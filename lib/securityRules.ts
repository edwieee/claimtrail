import type { DeterministicFindingType } from '../types/claimtrail';

export interface SecurityRuleDefinition {
  id: string;
  category: string;
  name: string;
  purpose: string;
  priority: 'high' | 'medium' | 'low';
  findingType: DeterministicFindingType;
}

export const SECURITY_RULES: SecurityRuleDefinition[] = [
  {
    id: 'CTL-ENCRYPTION-AT-REST',
    category: 'Encryption',
    name: 'Encryption at rest policy/configuration consistency',
    purpose: 'Detect an explicit encryption requirement contradicted by an explicit disabled infrastructure setting.',
    priority: 'high',
    findingType: 'policy_config_conflict',
  },
  {
    id: 'CTL-SAML-REPLAY-PROTECTION',
    category: 'Identity & Access',
    name: 'SAML assertion replay protection integration',
    purpose: 'Check whether replay protection is demonstrably connected to the SAML assertion-validation flow.',
    priority: 'high',
    findingType: 'implementation_gap',
  },
  {
    id: 'CTL-TENANT-AUTHORIZATION',
    category: 'Isolation',
    name: 'Tenant authorization evidence',
    purpose: 'Require explicit tenant-context authorization checks in repository evidence.',
    priority: 'high',
    findingType: 'control_evidence',
  },
  {
    id: 'CTL-AUDIT-LOGGING',
    category: 'Logging & Monitoring',
    name: 'Audit event logging evidence',
    purpose: 'Identify explicit audit-event creation or logging behavior without inferring complete coverage.',
    priority: 'medium',
    findingType: 'control_evidence',
  },
  {
    id: 'CTL-RETENTION-DELETION',
    category: 'Data Lifecycle',
    name: 'Retention and deletion consistency',
    purpose: 'Compare explicit documented retention requirements with explicit implementation settings.',
    priority: 'medium',
    findingType: 'policy_config_conflict',
  },
  {
    id: 'CTL-BACKUP-RECOVERY',
    category: 'Resilience',
    name: 'Backup and recovery evidence',
    purpose: 'Check for evidence of backup schedules, retention, restoration, or recovery objectives.',
    priority: 'medium',
    findingType: 'missing_evidence',
  },
  {
    id: 'CTL-AI-TOOL-PERMISSIONS',
    category: 'AI Security',
    name: 'AI tool permission safeguards',
    purpose: 'Check for explicit tool allowlists or permission checks in available code.',
    priority: 'medium',
    findingType: 'implementation_gap',
  },
];
