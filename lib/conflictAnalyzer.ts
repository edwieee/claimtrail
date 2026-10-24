import crypto from 'crypto';
import type {
  ConflictAnalysisResult,
  DeterministicFinding,
  EvidenceMapping,
  SecurityClaim,
} from '../types/claimtrail';

export interface ConflictAnalysisRun {
  analyses: ConflictAnalysisResult[];
  findings: DeterministicFinding[];
}

function stableId(parts: string[]): string {
  return crypto.createHash('sha256').update(parts.sort().join('|')).digest('hex').slice(0, 18);
}

function sourceVersion(mapping: EvidenceMapping): string {
  return crypto.createHash('sha256').update(mapping.evidence.map((item) => item.id).sort().join('|')).digest('hex');
}

function makeAnalysis(
  claim: SecurityClaim,
  mapping: EvidenceMapping,
  analysisType: ConflictAnalysisResult['analysisType'],
  status: ConflictAnalysisResult['status'],
  explanation: string,
  findingId?: string,
): ConflictAnalysisResult {
  return {
    id: `analysis-${stableId([claim.id, sourceVersion(mapping), analysisType])}`,
    claimId: claim.id,
    claimCode: claim.code,
    analysisType,
    status,
    explanation,
    evidenceIds: mapping.evidence.map((item) => item.id),
    findingId,
    sourceVersion: sourceVersion(mapping),
    analyzedAt: new Date().toISOString(),
  };
}

function makeUnsupportedAnswerFinding(
  claim: SecurityClaim,
  mapping: EvidenceMapping,
  step4Findings: DeterministicFinding[],
): DeterministicFinding {
  const now = new Date().toISOString();
  const evidence = mapping.evidence.map((item) => ({
    evidenceId: item.id,
    sourceType: item.sourceType,
    sourceName: item.sourceName,
    sourceUrlOrFilename: item.sourceUrlOrFilename,
    excerpt: item.snippet,
    pageNumber: item.pageNumber,
    filePath: item.filePath,
    lineRange: item.lineRange,
    commitSha: item.commitSha,
    branch: item.branch,
  }));
  const id = `finding-${stableId(['CONFLICT-UNSUPPORTED-ANSWER', claim.id, claim.answerDraftDetails?.evidenceVersion || '', ...evidence.map((item) => item.evidenceId)])}`;
  const sourceVersionValue = sourceVersion(mapping);
  return {
    id,
    ruleId: 'CONFLICT-UNSUPPORTED-ANSWER',
    ruleName: 'Questionnaire answer evidence boundary',
    relatedClaimIds: [claim.id],
    relatedQuestionCodes: [claim.code],
    category: claim.category,
    status: 'needs_review',
    analysisType: 'unsupported_answer',
    findingType: 'unsupported_answer',
    priority: 'medium',
    title: 'Draft answer claims more than the evidence establishes',
    explanation: 'The saved draft uses implementation or production language, but the mapped evidence does not include implementation evidence sufficient to support that scope.',
    trigger: 'The draft contains an overconfident implementation claim while the mapped evidence is policy-only or otherwise incomplete.',
    recommendedAction: 'Revise the draft to separate documented policy from implementation evidence, then request the missing proof before approval.',
    evidence,
    checkedAt: now,
    firstDetectedAt: now,
    lastUpdatedAt: now,
    sourceVersion: sourceVersionValue,
    relatedDraftVersion: claim.answerDraftDetails?.evidenceVersion,
    relatedStep4FindingIds: step4Findings.map((finding) => finding.id),
    whatEvidenceProves: 'The cited excerpts are relevant to the questionnaire topic and may establish a documented requirement.',
    whatEvidenceDoesNotProve: 'The available excerpts do not establish deployed production state, complete implementation, or compliance.',
  };
}

export function analyzeConflictEvidence(
  claims: SecurityClaim[],
  mappings: Record<string, EvidenceMapping>,
  step4Findings: DeterministicFinding[],
): ConflictAnalysisRun {
  const analyses: ConflictAnalysisResult[] = [];
  const findings: DeterministicFinding[] = [...step4Findings];

  for (const claim of claims) {
    const mapping = mappings[claim.id];
    if (!mapping) continue;
    const relatedFindings = findings.filter((finding) => finding.relatedClaimIds.includes(claim.id));
    const draft = claim.answerDraftDetails;
    const hasPolicy = mapping.evidence.some((item) => item.sourceType === 'pdf');
    const hasImplementation = mapping.evidence.some((item) => item.sourceType === 'repo');
    const overconfidentDraft = Boolean(
      draft &&
      /\b(all|fully|always|enforced|implemented|compliant|production|guarantee|guaranteed)\b/i.test(draft.draftAnswer) &&
      hasPolicy &&
      !hasImplementation,
    );

    if (overconfidentDraft) {
      const finding = makeUnsupportedAnswerFinding(claim, mapping, relatedFindings);
      findings.push(finding);
      analyses.push(makeAnalysis(claim, mapping, 'unsupported_answer', 'review', finding.explanation, finding.id));
      continue;
    }

    if (relatedFindings.some((finding) => finding.analysisType === 'explicit_conflict' || finding.status === 'finding')) {
      const finding = relatedFindings.find((item) => item.analysisType === 'explicit_conflict' || item.status === 'finding');
      analyses.push(makeAnalysis(claim, mapping, 'explicit_conflict', 'review', finding?.explanation || 'A deterministic finding indicates conflicting evidence.', finding?.id));
      continue;
    }

    if (relatedFindings.some((finding) => finding.analysisType === 'possible_implementation_gap' || finding.status === 'needs_review')) {
      const finding = relatedFindings.find((item) => item.analysisType === 'possible_implementation_gap' || item.status === 'needs_review');
      analyses.push(makeAnalysis(claim, mapping, 'possible_implementation_gap', 'review', finding?.explanation || 'Evidence suggests an implementation gap requiring human verification.', finding?.id));
      continue;
    }

    if (mapping.retrievalState === 'insufficient' || mapping.evidence.length === 0 || (hasPolicy && !hasImplementation)) {
      const finding = relatedFindings.find((item) => item.analysisType === 'missing_evidence');
      analyses.push(makeAnalysis(claim, mapping, 'missing_evidence', 'missing', 'The available evidence is insufficient to compare policy requirements with implementation.', finding?.id));
      continue;
    }

    if (mapping.retrievalState === 'supporting' && hasPolicy && hasImplementation) {
      analyses.push(makeAnalysis(claim, mapping, 'consistent_evidence', 'pass', 'Retrieved policy and implementation evidence are aligned within the inspected scope; production state remains unverified.'));
      continue;
    }

    analyses.push(makeAnalysis(claim, mapping, 'needs_human_verification', 'review', 'The retrieved evidence is relevant but incomplete or ambiguous for a reliable policy-versus-implementation conclusion.'));
  }

  return { analyses, findings };
}
