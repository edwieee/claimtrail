import crypto from 'crypto';
import type {
  DeterministicFinding,
  EvidenceMatch,
  EvidenceMapping,
  SecurityCheckResult,
  SecurityClaim,
  EvidenceSourceFile,
  RuleEvidenceReference,
} from '../types/claimtrail';
import { retrieveEvidenceForClaim } from './evidenceRetriever';
import { SECURITY_RULES } from './securityRules';

export interface SecurityCheckRun {
  results: SecurityCheckResult[];
  findings: DeterministicFinding[];
  mappings: Record<string, EvidenceMapping>;
  checkedAt: string;
}

function normalized(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9_./:=\-\s]/g, ' ').replace(/\s+/g, ' ').trim();
}

function includesAny(value: string, terms: string[]): boolean {
  const text = normalized(value);
  return terms.some((term) => text.includes(term));
}

function evidenceText(item: EvidenceMatch): string {
  return normalized(`${item.snippet} ${item.section || ''} ${item.filePath || ''}`);
}

function sourceMatches(items: EvidenceMatch[], predicate: (item: EvidenceMatch) => boolean): EvidenceMatch[] {
  return items.filter(predicate);
}

function toReference(item: EvidenceMatch): RuleEvidenceReference {
  return {
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
  };
}

function stableFindingId(ruleId: string, claimId: string, evidence: EvidenceMatch[]): string {
  const evidenceIds = evidence.map((item) => item.id).sort().join('|');
  return `finding-${crypto.createHash('sha256').update(`${ruleId}:${claimId}:${evidenceIds}`).digest('hex').slice(0, 18)}`;
}

function makeFinding(
  ruleId: string,
  claim: SecurityClaim,
  status: 'finding' | 'needs_review' | 'insufficient_evidence',
  findingType: DeterministicFinding['findingType'],
  priority: DeterministicFinding['priority'],
  title: string,
  explanation: string,
  trigger: string,
  recommendedAction: string,
  evidence: EvidenceMatch[],
  checkedAt: string,
): DeterministicFinding {
  const rule = SECURITY_RULES.find((item) => item.id === ruleId);
  const sourceVersion = crypto.createHash('sha256').update(evidence.map((item) => item.id).sort().join('|')).digest('hex');
  const analysisType = findingType === 'policy_config_conflict'
    ? 'explicit_conflict'
    : findingType === 'implementation_gap'
    ? 'possible_implementation_gap'
    : findingType === 'missing_evidence'
    ? 'missing_evidence'
    : 'needs_human_verification';
  return {
    id: stableFindingId(ruleId, claim.id, evidence),
    ruleId,
    ruleName: rule?.name || ruleId,
    relatedClaimIds: [claim.id],
    relatedQuestionCodes: [claim.code],
    category: rule?.category || claim.category,
    status,
    analysisType,
    findingType,
    priority,
    title,
    explanation,
    trigger,
    recommendedAction,
    evidence: evidence.map(toReference),
    checkedAt,
    firstDetectedAt: checkedAt,
    lastUpdatedAt: checkedAt,
    sourceVersion,
    relatedDraftVersion: claim.answerDraftDetails?.evidenceVersion,
  };
}

function makeResult(
  ruleId: string,
  claim: SecurityClaim,
  status: SecurityCheckResult['status'],
  explanation: string,
  checkedAt: string,
  findingId?: string,
): SecurityCheckResult {
  const rule = SECURITY_RULES.find((item) => item.id === ruleId);
  return {
    id: `check-${ruleId}-${claim.id}`,
    ruleId,
    ruleName: rule?.name || ruleId,
    claimId: claim.id,
    claimCode: claim.code,
    category: rule?.category || claim.category,
    status,
    findingId,
    explanation,
    checkedAt,
  };
}

function checkEncryption(claim: SecurityClaim, mapping: EvidenceMapping, checkedAt: string) {
  const questionText = `${claim.question} ${claim.category}`;
  if (!includesAny(questionText, ['encrypt', 'kms', 'cipher', 'storage at rest'])) return null;

  const policy = sourceMatches(mapping.evidence, (item) => item.sourceType === 'pdf' && includesAny(evidenceText(item), ['encrypt', 'kms', 'cipher']));
  const disabledConfig = sourceMatches(mapping.evidence, (item) => item.sourceType === 'repo' && /(?:storage[_ -]?encrypted|encrypted[_ -]?at[_ -]?rest|encryption)[^\n]{0,30}(?:=|:)\s*(?:false|disabled|off)/i.test(item.snippet));
  if (policy.length > 0 && disabledConfig.length > 0) {
    const finding = makeFinding(
      'CTL-ENCRYPTION-AT-REST', claim, 'finding', 'policy_config_conflict', 'high',
      'Encryption requirement conflicts with explicit infrastructure setting',
      'A policy passage requires encryption at rest while repository configuration explicitly disables encryption.',
      'Policy evidence and a repository setting containing an explicit false/disabled encryption value were both retrieved.',
      'Verify the deployed database configuration and correct the infrastructure setting if the repository reflects an active deployment path.',
      [...policy, ...disabledConfig], checkedAt,
    );
    return { result: makeResult('CTL-ENCRYPTION-AT-REST', claim, 'finding', finding.explanation, checkedAt, finding.id), finding };
  }
  const status = policy.length > 0 || mapping.evidence.length > 0 ? 'insufficient_evidence' : 'insufficient_evidence';
  const finding = makeFinding(
    'CTL-ENCRYPTION-AT-REST', claim, status, 'missing_evidence', 'high',
    'Encryption configuration could not be established',
    policy.length > 0 ? 'The policy requirement was retrieved, but no explicit disabling or enabling infrastructure setting was found.' : 'No sufficiently relevant policy and infrastructure evidence was retrieved.',
    'The required policy/configuration pair was incomplete.',
    'Inspect the relevant database infrastructure configuration and deployed resource state.',
    policy, checkedAt,
  );
  return { result: makeResult('CTL-ENCRYPTION-AT-REST', claim, status, finding.explanation, checkedAt, finding.id), finding };
}

function checkSaml(claim: SecurityClaim, mapping: EvidenceMapping, checkedAt: string) {
  const questionText = `${claim.question} ${claim.category}`;
  if (!includesAny(questionText, ['saml', 'replay', 'assertion'])) return null;

  const validation = sourceMatches(mapping.evidence, (item) => item.sourceType === 'repo' && includesAny(evidenceText(item), ['saml', 'assertion', 'validate']));
  const replayStore = sourceMatches(mapping.evidence, (item) => item.sourceType === 'repo' && includesAny(evidenceText(item), ['replay', 'nonce', 'assertionid', 'replaystore']));
  const integrated = validation.some((item) => includesAny(evidenceText(item), ['replaystore', 'replay store', 'checkreplay', 'assertionid']));

  if (validation.length > 0 && replayStore.length > 0 && !integrated) {
    const finding = makeFinding(
      'CTL-SAML-REPLAY-PROTECTION', claim, 'needs_review', 'implementation_gap', 'high',
      'SAML replay protection integration requires review',
      'Validation logic and a replay-store implementation were retrieved, but the available snippets do not demonstrate that the store is called by the validation flow.',
      'Replay-store evidence exists separately from validation-flow evidence without an explicit integration signal.',
      'Trace the runtime validation path and add an integration test proving replay detection is enforced.',
      [...validation, ...replayStore], checkedAt,
    );
    return { result: makeResult('CTL-SAML-REPLAY-PROTECTION', claim, 'needs_review', finding.explanation, checkedAt, finding.id), finding };
  }
  const status = validation.length > 0 && integrated ? 'pass' : 'insufficient_evidence';
  const finding = status === 'pass' ? undefined : makeFinding(
    'CTL-SAML-REPLAY-PROTECTION', claim, 'insufficient_evidence', 'missing_evidence', 'high',
    'SAML replay protection evidence is incomplete',
    'The available evidence does not establish an integrated replay-protection check in the SAML validation flow.',
    'A validation flow and replay-protection integration could not both be established.',
    'Review the complete assertion-validation flow and its replay-store call site.',
    [...validation, ...replayStore], checkedAt,
  );
  return { result: makeResult('CTL-SAML-REPLAY-PROTECTION', claim, status, finding?.explanation || 'Validation and replay protection integration were explicitly retrieved.', checkedAt, finding?.id), finding };
}

function checkTenant(claim: SecurityClaim, mapping: EvidenceMapping, checkedAt: string) {
  const questionText = `${claim.question} ${claim.category}`;
  if (!includesAny(questionText, ['tenant', 'isolation', 'segregat'])) return null;

  const explicitAuth = sourceMatches(mapping.evidence, (item) => item.sourceType === 'repo' && includesAny(evidenceText(item), ['tenant']) && includesAny(evidenceText(item), ['authorize', 'authorization', 'claims', 'context', 'permission', 'allow']));
  const finding = explicitAuth.length > 0 ? undefined : makeFinding(
    'CTL-TENANT-AUTHORIZATION', claim, 'insufficient_evidence', 'missing_evidence', 'high',
    'Tenant authorization evidence is insufficient',
    'The retrieved repository evidence does not contain an explicit tenant authorization check that can be evaluated by this rule.',
    'Tenant isolation cannot be established from file names, comments, or a generic database setting alone.',
    'Inspect the tenant authorization path and verify that authenticated tenant context is checked before resource access.',
    mapping.evidence.filter((item) => item.sourceType === 'repo'), checkedAt,
  );
  return { result: makeResult('CTL-TENANT-AUTHORIZATION', claim, explicitAuth.length > 0 ? 'pass' : 'insufficient_evidence', explicitAuth.length > 0 ? 'Explicit tenant-related authorization evidence was retrieved; deployment and coverage remain outside this check.' : finding?.explanation || 'Tenant authorization evidence is insufficient.', checkedAt, finding?.id), finding };
}

function checkAudit(claim: SecurityClaim, mapping: EvidenceMapping, checkedAt: string) {
  const questionText = `${claim.question} ${claim.category}`;
  if (!includesAny(questionText, ['audit', 'logging', 'log ', 'trail', 'monitor'])) return null;

  const explicitLogging = sourceMatches(mapping.evidence, (item) => {
    if (item.sourceType !== 'repo') return false;
    const text = evidenceText(item);
    return includesAny(text, ['audit event', 'audit_log', 'log(', 'emit', 'security event']) || /(?:logger|auditLogger)\s*\.\s*(?:info|warn|error|debug|log|write)\s*\(/i.test(item.snippet);
  });
  const moduleOnly = sourceMatches(mapping.evidence, (item) => item.sourceType === 'repo' && includesAny(evidenceText(item), ['audit', 'logging', 'logger']) && !includesAny(evidenceText(item), ['log(', 'emit', 'event']));
  const status = explicitLogging.length > 0 ? 'pass' : moduleOnly.length > 0 ? 'needs_review' : 'insufficient_evidence';
  const finding = status === 'pass' ? undefined : makeFinding(
    'CTL-AUDIT-LOGGING', claim, status, status === 'needs_review' ? 'implementation_gap' : 'missing_evidence', 'medium',
    status === 'needs_review' ? 'Audit logging coverage requires review' : 'Audit logging evidence is insufficient',
    status === 'needs_review' ? 'An audit/logging module was found, but the available evidence does not demonstrate event coverage.' : 'No explicit audit-event creation or logging behavior was retrieved.',
    'The rule requires observable event creation or logging behavior, not only a module name or comment.',
    'Trace representative security-relevant actions to their audit-event sink and verify coverage.',
    [...explicitLogging, ...moduleOnly], checkedAt,
  );
  return { result: makeResult('CTL-AUDIT-LOGGING', claim, status, finding?.explanation || 'Explicit audit-event logging evidence was retrieved; complete coverage remains outside this check.', checkedAt, finding?.id), finding };
}

function checkRetention(claim: SecurityClaim, mapping: EvidenceMapping, checkedAt: string) {
  const questionText = `${claim.question} ${claim.category}`;
  if (!includesAny(questionText, ['retention', 'retain', 'deletion', 'delete', 'purge', '365 day'])) return null;

  const policy = sourceMatches(mapping.evidence, (item) => item.sourceType === 'pdf' && includesAny(evidenceText(item), ['retention', 'retain', 'delete', '365']));
  const implementation = sourceMatches(mapping.evidence, (item) => item.sourceType === 'repo' && includesAny(evidenceText(item), ['retention', 'lifecycle', 'expiration', 'delete', 'days']));
  const policyDays = policy.map((item) => item.snippet.match(/(\d+)\s*(?:day|days)/i)?.[1]).filter(Boolean).map(Number);
  const implementationDays = implementation.map((item) => item.snippet.match(/(?:days?|retention|expiration)[^\d]{0,20}(\d+)/i)?.[1]).filter(Boolean).map(Number);
  const contradictory = policyDays.some((days) => implementationDays.some((implementationDay) => implementationDay < days));
  if (contradictory) {
    const finding = makeFinding(
      'CTL-RETENTION-DELETION', claim, 'finding', 'policy_config_conflict', 'medium',
      'Retention configuration is shorter than the documented requirement',
      'Retrieved policy and implementation evidence contain explicit retention durations that differ.',
      `The implementation duration (${implementationDays.join(', ')}) is shorter than the documented duration (${policyDays.join(', ')}).`,
      'Confirm the active retention policy and deployed lifecycle configuration before treating this as an operational violation.',
      [...policy, ...implementation], checkedAt,
    );
    return { result: makeResult('CTL-RETENTION-DELETION', claim, 'finding', finding.explanation, checkedAt, finding.id), finding };
  }
  const status = policy.length > 0 && implementation.length > 0 ? 'pass' : 'insufficient_evidence';
  const finding = status === 'pass' ? undefined : makeFinding(
    'CTL-RETENTION-DELETION', claim, 'insufficient_evidence', 'missing_evidence', 'medium',
    'Retention and deletion evidence is incomplete',
    'The evidence does not contain both a documented requirement and an explicit implementation setting that this rule can compare.',
    'A policy/configuration comparison could not be completed.',
    'Review the documented retention requirement and deployed deletion/lifecycle behavior.',
    [...policy, ...implementation], checkedAt,
  );
  return { result: makeResult('CTL-RETENTION-DELETION', claim, status, finding?.explanation || 'Policy and implementation retention evidence were retrieved without an explicit contradiction.', checkedAt, finding?.id), finding };
}

function checkBackup(claim: SecurityClaim, mapping: EvidenceMapping, checkedAt: string) {
  const questionText = `${claim.question} ${claim.category}`;
  if (!includesAny(questionText, ['backup', 'recovery', 'restore', 'rpo', 'rto', 'disaster'])) return null;

  const backupEvidence = sourceMatches(mapping.evidence, (item) => includesAny(evidenceText(item), ['backup', 'restore', 'recovery', 'rpo', 'rto', 'snapshot']));
  const hasSchedule = backupEvidence.some((item) => includesAny(evidenceText(item), ['daily', 'weekly', 'schedule', 'cron', 'interval']));
  const hasRecoveryDetail = backupEvidence.some((item) => includesAny(evidenceText(item), ['restore', 'rpo', 'rto', 'recovery procedure']));
  const status = hasSchedule && hasRecoveryDetail ? 'pass' : backupEvidence.length > 0 ? 'needs_review' : 'insufficient_evidence';
  const finding = status === 'pass' ? undefined : makeFinding(
    'CTL-BACKUP-RECOVERY', claim, status, status === 'needs_review' ? 'control_evidence' : 'missing_evidence', 'medium',
    status === 'needs_review' ? 'Backup/recovery evidence requires review' : 'Backup/recovery evidence is insufficient',
    status === 'needs_review' ? 'Some backup or recovery evidence was retrieved, but schedule and recovery execution details are incomplete.' : 'No useful backup schedule, retention, restore procedure, or recovery-objective evidence was retrieved.',
    'The rule requires evidence of both backup operation and recovery detail where applicable.',
    'Confirm backup schedules, retention, restoration procedures, and recovery objectives with operational records.',
    backupEvidence, checkedAt,
  );
  return { result: makeResult('CTL-BACKUP-RECOVERY', claim, status, finding?.explanation || 'Backup and recovery evidence covers schedule and recovery details; execution success is not established.', checkedAt, finding?.id), finding };
}

function checkAiPermissions(claim: SecurityClaim, mapping: EvidenceMapping, checkedAt: string) {
  const questionText = `${claim.question} ${claim.category}`;
  if (!includesAny(questionText, ['ai ', ' ai', 'tool permission', 'agent', 'model'])) return null;

  const toolEvidence = sourceMatches(mapping.evidence, (item) => item.sourceType === 'repo' && includesAny(evidenceText(item), ['tool', 'agent', 'function']));
  const permissionEvidence = toolEvidence.filter((item) => includesAny(evidenceText(item), ['allowlist', 'permission', 'authorize', 'allowedtools', 'deny', 'policy']));
  const status = permissionEvidence.length > 0 ? 'pass' : toolEvidence.length > 0 ? 'needs_review' : 'insufficient_evidence';
  const finding = status === 'pass' ? undefined : makeFinding(
    'CTL-AI-TOOL-PERMISSIONS', claim, status, status === 'needs_review' ? 'implementation_gap' : 'missing_evidence', 'medium',
    status === 'needs_review' ? 'AI tool permissions require review' : 'AI tool permission evidence is insufficient',
    status === 'needs_review' ? 'Tool or agent code was retrieved, but explicit permission safeguards were not found in the available evidence.' : 'No explicit AI tool permission or restriction evidence was retrieved.',
    'A tool or model reference alone does not establish a production security boundary.',
    'Review the tool authorization path and verify deny-by-default or allowlisted permissions.',
    toolEvidence, checkedAt,
  );
  return { result: makeResult('CTL-AI-TOOL-PERMISSIONS', claim, status, finding?.explanation || 'Explicit AI tool permission safeguards were retrieved; complete production boundary coverage remains outside this check.', checkedAt, finding?.id), finding };
}

const CHECKERS = [checkEncryption, checkSaml, checkTenant, checkAudit, checkRetention, checkBackup, checkAiPermissions];

export function runDeterministicSecurityChecks(claims: SecurityClaim[], sources: EvidenceSourceFile[]): SecurityCheckRun {
  const checkedAt = new Date().toISOString();
  const results: SecurityCheckResult[] = [];
  const findings: DeterministicFinding[] = [];
  const mappings: Record<string, EvidenceMapping> = {};

  for (const claim of claims) {
    const mapping = retrieveEvidenceForClaim(claim, sources, { limit: 10 });
    mappings[claim.id] = mapping;
    let applicable = false;
    for (const checker of CHECKERS) {
      const outcome = checker(claim, mapping, checkedAt);
      if (!outcome) continue;
      applicable = true;
      results.push(outcome.result);
      if (outcome.finding) findings.push(outcome.finding);
    }
    if (!applicable) {
      results.push({
        id: `check-none-${claim.id}`,
        ruleId: 'NO-SUPPORTED-RULE',
        ruleName: 'No supported deterministic rule',
        claimId: claim.id,
        claimCode: claim.code,
        category: claim.category,
        status: 'not_applicable',
        explanation: 'No implemented deterministic rule applies to the wording and evidence scope of this question.',
        checkedAt,
      });
    }
  }

  return { results, findings, mappings, checkedAt };
}
