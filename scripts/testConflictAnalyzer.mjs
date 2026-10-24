import assert from 'node:assert/strict';
import { analyzeConflictEvidence } from '../lib/conflictAnalyzer.ts';

const claim = {
  id: 'claim-conflict-1',
  code: 'ENC-1',
  category: 'Encryption',
  question: 'Are database volumes encrypted at rest?',
};

const policyEvidence = {
  id: 'policy-evidence',
  sourceId: 'policy',
  sourceType: 'pdf',
  sourceName: 'security-policy.pdf',
  sourceUrlOrFilename: 'security-policy.pdf',
  pageNumber: 7,
  snippet: 'Database volumes must be encrypted at rest.',
};
const repoEvidence = {
  id: 'repo-evidence',
  sourceId: 'repo',
  sourceType: 'repo',
  sourceName: 'github.com/demo/repo',
  sourceUrlOrFilename: 'https://github.com/demo/repo',
  filePath: 'infra/terraform/database.tf',
  lineRange: { start: 18, end: 18 },
  commitSha: 'abc123',
  snippet: 'storage_encrypted = false',
};

const mapping = (evidence, retrievalState = 'supporting') => ({
  claimId: claim.id,
  claimCode: claim.code,
  question: claim.question,
  retrievalState,
  evidence,
  limitations: [],
  retrievedAt: new Date().toISOString(),
});

const explicit = {
  id: 'finding-step4',
  ruleId: 'CTL-ENCRYPTION-AT-REST',
  ruleName: 'Encryption conflict',
  relatedClaimIds: [claim.id],
  relatedQuestionCodes: [claim.code],
  category: 'Encryption',
  status: 'finding',
  analysisType: 'explicit_conflict',
  findingType: 'policy_config_conflict',
  priority: 'high',
  title: 'Encryption conflict',
  explanation: 'Policy and configuration conflict.',
  trigger: 'Explicit false setting.',
  recommendedAction: 'Verify deployment.',
  evidence: [],
  checkedAt: new Date().toISOString(),
};

const conflict = analyzeConflictEvidence([claim], { [claim.id]: mapping([policyEvidence, repoEvidence], 'mixed') }, [explicit]);
assert.equal(conflict.analyses[0].analysisType, 'explicit_conflict');
assert.equal(conflict.analyses[0].findingId, explicit.id);

const missing = analyzeConflictEvidence([claim], { [claim.id]: mapping([policyEvidence], 'supporting') }, []);
assert.equal(missing.analyses[0].analysisType, 'missing_evidence');
assert.equal(missing.analyses[0].status, 'missing');

const draftClaim = {
  ...claim,
  answerDraftDetails: {
    questionId: claim.id,
    draftAnswer: 'All production systems are fully encrypted and compliant.',
    evidenceStatus: 'supported',
    reviewRequired: true,
    reasoningSummary: 'Policy cited.',
    limitations: [],
    evidenceCitations: [{ evidenceId: policyEvidence.id, sourceType: 'pdf', sourceName: policyEvidence.sourceName, sourceUrlOrFilename: policyEvidence.sourceUrlOrFilename, excerpt: policyEvidence.snippet, pageNumber: 7 }],
    generatedAt: new Date().toISOString(),
    model: 'test',
    evidenceVersion: 'draft-v1',
  },
};
const unsupported = analyzeConflictEvidence([draftClaim], { [claim.id]: mapping([policyEvidence], 'supporting') }, []);
assert.equal(unsupported.analyses[0].analysisType, 'unsupported_answer');
assert.equal(unsupported.findings[0].findingType, 'unsupported_answer');

const consistent = analyzeConflictEvidence([claim], { [claim.id]: mapping([policyEvidence, { ...repoEvidence, snippet: 'storage_encrypted = true' }], 'supporting') }, []);
assert.equal(consistent.analyses[0].analysisType, 'consistent_evidence');
assert.equal(consistent.findings.length, 0);

const secondRun = analyzeConflictEvidence([claim], { [claim.id]: mapping([policyEvidence, repoEvidence], 'mixed') }, [explicit]);
assert.equal(secondRun.analyses[0].findingId, conflict.analyses[0].findingId);

console.log('Conflict analyzer tests passed.');
