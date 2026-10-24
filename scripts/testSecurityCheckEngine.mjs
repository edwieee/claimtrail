import assert from 'node:assert/strict';
import { runDeterministicSecurityChecks } from '../lib/securityCheckEngine.ts';

function claim(id, code, category, question) {
  return { id, code, category, question };
}

function source(id, name, type, chunks, metadata = {}) {
  return {
    id,
    name,
    type,
    typeLabel: type === 'pdf' ? 'PDF Policy' : 'GitHub Repository',
    sizeOrBranch: type === 'pdf' ? '1 MB' : 'branch: main',
    sha: 'source-sha',
    status: 'ready',
    statusLabel: 'Ready',
    extractedTitle: 'Indexed',
    extractedProgress: 100,
    extractedNote: '',
    linkedCount: 1,
    lastUpdated: 'Now',
    extractedChunks: chunks,
    ...metadata,
  };
}

const encryptionClaim = claim('claim-encryption', 'ENC-1', 'Encryption', 'Are database storage volumes encrypted at rest?');
const encryptionPolicy = source('policy', 'policies/security-policy.md', 'pdf', [
  { id: 'policy-encryption', pageOrFile: 'Page 7', section: 'Section 4 Encryption at Rest', text: 'Production databases must be encrypted at rest.', confidence: 99 },
]);
const encryptionRepo = source('repo', 'github.com/claimtrail/demo', 'repo', [
  { id: 'database-tf', pageOrFile: 'infra/terraform/database.tf', section: 'Lines 18-18', text: 'storage_encrypted = false', confidence: 96, lineRange: { start: 18, end: 18 } },
], { repoMetadata: { canonicalUrl: 'https://github.com/claimtrail/demo', branch: 'main', commitSha: 'abcdef123456' } });

const encryptionRun = runDeterministicSecurityChecks([encryptionClaim], [encryptionPolicy, encryptionRepo]);
const encryptionCheck = encryptionRun.results.find((result) => result.ruleId === 'CTL-ENCRYPTION-AT-REST');
assert.equal(encryptionCheck.status, 'finding');
assert.equal(encryptionRun.findings[0].findingType, 'policy_config_conflict');
assert.equal(encryptionRun.findings[0].priority, 'high');
assert.equal(encryptionRun.findings[0].evidence.some((item) => item.pageNumber === 7), true);
assert.equal(encryptionRun.findings[0].evidence.some((item) => item.filePath === 'infra/terraform/database.tf' && item.lineRange.start === 18), true);
assert.equal(encryptionRun.findings[0].evidence.some((item) => item.commitSha === 'abcdef123456'), true);
assert.equal(runDeterministicSecurityChecks([encryptionClaim], [encryptionPolicy, encryptionRepo]).findings[0].id, encryptionRun.findings[0].id);

const policyOnlyRun = runDeterministicSecurityChecks([encryptionClaim], [encryptionPolicy]);
assert.equal(policyOnlyRun.results.find((result) => result.ruleId === 'CTL-ENCRYPTION-AT-REST').status, 'insufficient_evidence');

const samlClaim = claim('claim-saml', 'IAM-SAML-1', 'Identity', 'Does SAML assertion validation prevent replay attacks?');
const samlRepo = source('saml-repo', 'github.com/claimtrail/demo', 'repo', [
  { id: 'validator', pageOrFile: 'auth/saml_validator.go', section: 'Lines 10-28', text: 'func ValidateSAMLAssertion(assertion SAMLAssertion) { validateSignature(assertion) }', confidence: 96, lineRange: { start: 10, end: 28 } },
  { id: 'replay-store', pageOrFile: 'auth/replay_store.go', section: 'Lines 1-20', text: 'type ReplayStore struct { entries map[string]time.Time }', confidence: 96, lineRange: { start: 1, end: 20 } },
], { repoMetadata: { canonicalUrl: 'https://github.com/claimtrail/demo', branch: 'main', commitSha: 'samlcommit' } });
const samlRun = runDeterministicSecurityChecks([samlClaim], [samlRepo]);
assert.equal(samlRun.results[0].status, 'needs_review');
assert.equal(samlRun.findings[0].findingType, 'implementation_gap');
assert.equal(samlRun.findings[0].evidence.length, 2);

const tenantClaim = claim('claim-tenant', 'TEN-1', 'Isolation', 'How is tenant isolation enforced for resource access?');
const tenantRun = runDeterministicSecurityChecks([tenantClaim], [encryptionPolicy]);
assert.equal(tenantRun.results[0].status, 'insufficient_evidence');

const loggingClaim = claim('claim-logging', 'LOG-1', 'Audit Logging', 'Are audit logs created for security-relevant actions?');
const loggingRepo = source('logging-repo', 'github.com/claimtrail/demo', 'repo', [
  { id: 'audit-module', pageOrFile: 'audit/logger.go', section: 'Audit logger module', text: 'package auditlog; type Logger struct {}', confidence: 90 },
]);
const loggingRun = runDeterministicSecurityChecks([loggingClaim], [loggingRepo]);
assert.equal(loggingRun.results[0].status, 'needs_review');

const retentionClaim = claim('claim-retention', 'RET-1', 'Data Lifecycle', 'Are security records retained and deleted according to policy?');
const retentionRun = runDeterministicSecurityChecks([retentionClaim], [encryptionPolicy]);
assert.equal(retentionRun.results[0].status, 'insufficient_evidence');

const malformed = source('malformed', 'malformed-policy.pdf', 'pdf', [{ id: 'bad', pageOrFile: null, section: null, text: null, confidence: 0 }]);
assert.doesNotThrow(() => runDeterministicSecurityChecks([encryptionClaim], [malformed]));

console.log('Security check engine tests passed.');
