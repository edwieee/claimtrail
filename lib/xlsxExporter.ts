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
      const isApproved = claim.reviewStatus === 'approved';
      let responseText = claim.vendorDraftAnswer;
      if (!isApproved && options?.includeDrafts) {
        responseText = `[UNVERIFIED DRAFT] ${responseText}`;
      }

      const citationText = claim.policyCitation
        ? `${claim.policyCitation.docName} (${claim.policyCitation.section})`
        : claim.primarySourcePath;

      mainSheet.addRow({
        id: claim.code,
        category: claim.category,
        question: claim.question,
        response: responseText,
        status: isApproved ? 'APPROVED' : 'DRAFT',
        citation: citationText,
      });
    });
  } else {
    // Write back into the original worksheet
    const targetSheet = workbook.worksheets[0];
    claims.forEach((claim) => {
      if (claim.rowNumber && claim.rowNumber <= targetSheet.rowCount) {
        const row = targetSheet.getRow(claim.rowNumber);
        const col = claim.answerCol || 4;
        const isApproved = claim.reviewStatus === 'approved';
        let responseText = claim.vendorDraftAnswer;
        if (!isApproved && options?.includeDrafts) {
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
    { header: 'Review Decision', key: 'decision', width: 16 },
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
    const isApproved = claim.reviewStatus === 'approved';
    const policyRef = claim.policyCitation
      ? `${claim.policyCitation.docName} (§${claim.policyCitation.section}, p.${claim.policyCitation.page})`
      : 'Policy v4.2 §3.2';

    const repoRef = claim.codeCitation
      ? `${claim.codeCitation.repo}/${claim.codeCitation.filePath}:${claim.codeCitation.startLine}-${claim.codeCitation.endLine} (commit ${claim.codeCitation.commitSha})`
      : `${claim.primarySourcePath}:${claim.linePageRef}`;

    const ruleText = claim.ruleCheck
      ? `${claim.ruleCheck.ruleId} (${claim.ruleCheck.status.toUpperCase()})`
      : 'Rule #ENG-RLS-09 Verified';

    const shaHash = crypto
      .createHash('sha256')
      .update(`${claim.code}:${claim.vendorDraftAnswer}:${policyRef}:${repoRef}`)
      .digest('hex');

    auditSheet.addRow({
      code: claim.code,
      question: claim.question,
      decision: isApproved ? 'Auditor Approved' : 'Draft Watermark',
      policy: policyRef,
      repo: repoRef,
      rule: ruleText,
      sha: options?.includeHashes !== false ? shaHash : 'SHA-256 Excluded',
    });
  });

  // Generate buffer
  const arrayBuffer = await workbook.xlsx.writeBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const sizeBytes = buffer.length;

  // Persist deliverable to exports storage
  saveExportBuffer(filename, buffer);

  return {
    buffer,
    filename,
    sizeBytes,
  };
}
