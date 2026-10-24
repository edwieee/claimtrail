import ExcelJS from 'exceljs';
import crypto from 'crypto';
import type { SecurityClaim } from '@/types/claimtrail';
import { saveExportBuffer } from './store';
import { safeLoadWorkbook } from './xlsxParser';

export interface ExportWorkbookOptions {
  assessmentName?: string;
  includeHashes?: boolean;
  embedLinks?: boolean;
  includeDrafts?: boolean;
  originalWorkbookBuffer?: Buffer | null;
}

export interface ExportWorkbookResult {
  buffer: Buffer;
  filename: string;
  sizeBytes: number;
  sha256: string;
}

function effectiveAnswer(claim: SecurityClaim): string {
  return claim.editedAnswer || claim.answerDraft || claim.vendorDraftAnswer || '';
}

function isApproved(claim: SecurityClaim): boolean {
  return claim.reviewStatus === 'approved' && (!claim.approval || claim.approval.status === 'approved') && !claim.answerDraftDetails?.evidenceStatus.includes('insufficient');
}

function answerStatus(claim: SecurityClaim): string {
  if (claim.reviewStatus === 'approved' && isApproved(claim)) return 'APPROVED';
  if (claim.reviewStatus === 'rejected') return 'REJECTED';
  if (claim.reviewStatus === 'stale') return 'STALE - RE-REVIEW';
  return claim.answerDraftDetails?.evidenceStatus === 'insufficient_evidence' ? 'INSUFFICIENT EVIDENCE' : 'DRAFT';
}

function citationSummary(claim: SecurityClaim): string {
  const citations = claim.answerDraftDetails?.evidenceCitations || [];
  if (citations.length > 0) {
    return citations.map((citation) => {
      const location = citation.pageNumber !== undefined
        ? `p.${citation.pageNumber}`
        : citation.filePath
        ? `${citation.filePath}${citation.lineRange ? `:${citation.lineRange.start}-${citation.lineRange.end}` : ''}`
        : citation.sourceUrlOrFilename;
      return `${citation.sourceName} (${location})`;
    }).join('; ');
  }
  if (claim.policyCitation) return `${claim.policyCitation.docName} (${claim.policyCitation.section}, p.${claim.policyCitation.page})`;
  if (claim.codeCitation) return `${claim.codeCitation.repo}/${claim.codeCitation.filePath}:${claim.codeCitation.startLine}-${claim.codeCitation.endLine} (commit ${claim.codeCitation.commitSha})`;
  return claim.primarySourcePath || 'No citation stored';
}

export async function generateCompletedQuestionnaireXlsx(
  claims: SecurityClaim[],
  options?: ExportWorkbookOptions
): Promise<ExportWorkbookResult> {
  const assessmentName = options?.assessmentName || 'AcmeCorp-Security-Assessment-2026';
  const cleanName = assessmentName.replace(/[^a-zA-Z0-9_-]/g, '_');
  const filename = `${cleanName}-COMPLETED-v1.0.xlsx`;

  let workbook = new ExcelJS.Workbook();

  // If original workbook buffer is provided, load it to preserve original formatting
  if (options?.originalWorkbookBuffer) {
    try {
      workbook = await safeLoadWorkbook(options.originalWorkbookBuffer);
    } catch (err) {
      console.warn('Could not load original workbook buffer, creating new workbook:', err);
      workbook = new ExcelJS.Workbook();
    }
  }

  // If new workbook or original has no sheets
  if (workbook.worksheets.length === 0) {
    const mainSheet = workbook.addWorksheet('Questionnaire Responses');
    mainSheet.columns = [
      { header: 'ID', key: 'id', width: 14 },
      { header: 'Category', key: 'category', width: 28 },
      { header: 'Question', key: 'question', width: 45 },
      { header: 'Vendor Response (ClaimTrail Verified)', key: 'response', width: 60 },
      { header: 'Review Status', key: 'status', width: 18 },
      { header: 'Evidence Citation', key: 'citation', width: 40 },
    ];

    // Style Header Row
    const headerRow = mainSheet.getRow(1);
    headerRow.font = { bold: true, color: { argb: 'FFFFFFFF' } };
    headerRow.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF0B1C30' },
    };
    headerRow.alignment = { vertical: 'middle', horizontal: 'left' };

    claims.forEach((claim) => {
      const approved = isApproved(claim);
      let responseText = effectiveAnswer(claim);
      if (claim.reviewStatus === 'rejected') {
        responseText = `[REJECTED DRAFT - NOT FOR SUBMISSION] ${responseText}`;
      } else if (claim.answerDraftDetails?.evidenceStatus === 'insufficient_evidence') {
        responseText = `[INSUFFICIENT EVIDENCE] ${responseText}`;
      } else if (!approved && options?.includeDrafts) {
        responseText = `[UNVERIFIED DRAFT] ${responseText}`;
      }

      const citationText = citationSummary(claim);

      mainSheet.addRow({
        id: claim.code,
        category: claim.category,
        question: claim.question,
        response: responseText,
        status: answerStatus(claim),
        citation: citationText,
      });
    });
  } else {
    // Write back into the original worksheet preserving original structure and layout
    claims.forEach((claim) => {
      const targetSheet = claim.sheetName ? workbook.getWorksheet(claim.sheetName) || workbook.worksheets[0] : workbook.worksheets[0];
      if (claim.rowNumber && claim.rowNumber <= targetSheet.rowCount) {
        const row = targetSheet.getRow(claim.rowNumber);
        const col = claim.answerCol || 4;
        const approved = isApproved(claim);
        let responseText = effectiveAnswer(claim);
        if (claim.reviewStatus === 'rejected') {
          responseText = `[REJECTED DRAFT - NOT FOR SUBMISSION] ${responseText}`;
        } else if (claim.answerDraftDetails?.evidenceStatus === 'insufficient_evidence') {
          responseText = `[INSUFFICIENT EVIDENCE] ${responseText}`;
        } else if (!approved && options?.includeDrafts) {
          responseText = `[UNVERIFIED DRAFT] ${responseText}`;
        }
        row.getCell(col).value = responseText;
      }
    });
  }

  // Append Dedicated "Audit Evidence Trail" Sheet
  const auditSheet = workbook.addWorksheet('Audit Evidence Trail');
  auditSheet.columns = [
    { header: 'Question Code', key: 'code', width: 16 },
    { header: 'Question Requirement', key: 'question', width: 40 },
    { header: 'Review Decision', key: 'decision', width: 18 },
    { header: 'Reviewer', key: 'reviewer', width: 22 },
    { header: 'Decision Timestamp', key: 'decidedAt', width: 22 },
    { header: 'Reviewer Notes / Overrides', key: 'notes', width: 35 },
    { header: 'Policy Evidence (PDF)', key: 'policy', width: 35 },
    { header: 'Repository Implementation (Code AST)', key: 'repo', width: 40 },
    { header: 'Automated Rule Check', key: 'rule', width: 28 },
    { header: 'Evidence Checksum (SHA-256)', key: 'sha', width: 32 },
  ];

  // Header styling for Audit Trail tab (Burnt Copper theme)
  const auditHeaderRow = auditSheet.getRow(1);
  auditHeaderRow.font = { bold: true, color: { argb: 'FFFFFFFF' } };
  auditHeaderRow.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FFC2410C' },
  };
  auditHeaderRow.alignment = { vertical: 'middle', horizontal: 'left' };

  claims.forEach((claim) => {
    const approved = isApproved(claim);
    const policyRef = citationSummary(claim);

    const repoRef = claim.codeCitation
      ? `${claim.codeCitation.repo}/${claim.codeCitation.filePath}:${claim.codeCitation.startLine}-${claim.codeCitation.endLine} (commit ${claim.codeCitation.commitSha})`
      : `${claim.primarySourcePath}:${claim.linePageRef || 'location unavailable'}`;

    const ruleText = claim.ruleCheck
      ? `${claim.ruleCheck.ruleId} (${claim.ruleCheck.status.toUpperCase()})`
      : claim.answerDraftDetails?.evidenceStatus || 'No deterministic result stored';

    const reviewer = claim.approval?.reviewer || (approved ? 'Security Reviewer' : 'Unassigned');
    const decidedAt = claim.approval?.decidedAt ? new Date(claim.approval.decidedAt).toLocaleString() : approved ? 'Pre-verified baseline' : 'Pending';
    const notes = claim.approval?.reason || claim.staleReason || (claim.approval?.hasUnresolvedFindingOverride ? 'Approved with explicit override for unresolved finding' : '') || '';

    const shaHash = crypto
      .createHash('sha256')
      .update(`${claim.code}:${effectiveAnswer(claim)}:${policyRef}:${repoRef}:${reviewer}:${decidedAt}`)
      .digest('hex');

    auditSheet.addRow({
      code: claim.code,
      question: claim.question,
      decision: approved ? 'Auditor Approved' : answerStatus(claim),
      reviewer,
      decidedAt,
      notes,
      policy: policyRef,
      repo: repoRef,
      rule: ruleText,
      sha: options?.includeHashes !== false ? shaHash : 'SHA-256 Excluded',
    });
  });

  // Add compliance disclaimer row (Safe approval rule 8)
  auditSheet.addRow({});
  const disclaimerRow = auditSheet.addRow({
    code: 'STATUTORY COMPLIANCE NOTICE',
    question: 'ClaimTrail automates evidence retrieval and cross-referencing against source artifacts. Questionnaire answer approval records an internal reviewer verification decision only and does NOT constitute a formal certification of legal, regulatory, or SOC 2 compliance.',
  });
  disclaimerRow.font = { italic: true, size: 9, color: { argb: 'FF64748B' } };

  // Generate buffer
  const arrayBuffer = await workbook.xlsx.writeBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const sizeBytes = buffer.length;
  const sha256 = crypto.createHash('sha256').update(buffer).digest('hex');

  // Persist deliverable to exports storage
  saveExportBuffer(filename, buffer);

  return {
    buffer,
    filename,
    sizeBytes,
    sha256,
  };
}
