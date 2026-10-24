import { SecurityClaim, ConflictItem } from '@/types/claimtrail';

// ─────────────────────────────────────────────────────────────────────────────
// Shared helper: derive rolled-up metrics from the single source of truth
// ─────────────────────────────────────────────────────────────────────────────
export function deriveMetrics(claims: SecurityClaim[], conflicts: ConflictItem[]) {
  const total = claims.length;
  const supported = claims.filter((c) => c.status === 'green').length;
  const needsReview = claims.filter((c) => c.status === 'amber').length;
  const unsafe = claims.filter((c) => c.status === 'red').length;
  const activeFindings = conflicts.length;

  return { total, supported, needsReview, unsafe, activeFindings };
}

// ─────────────────────────────────────────────────────────────────────────────
// Demo fixtures — labelled explicitly; never imply these are real scan results
// ─────────────────────────────────────────────────────────────────────────────
export const DEMO_CLAIMS: SecurityClaim[] = [
  {
    id: 'claim-1',
    code: 'SEC-104',
    category: 'Data Protection & Encryption',
    question: 'Are production database backups and storage volumes encrypted at rest with customer-managed keys (CMK)?',
    vendorDraftAnswer:
      'Yes. All production RDS clusters, Aurora replicas, and EBS volumes enforce AES-256 KMS envelope encryption using dedicated Customer Managed Keys with automatic rotation.',
    status: 'amber',
    statusDetail: 'Incomplete evidence: storage encrypted, but default AWS managed key found instead of CMK',
    limitations:
      'Inspected GitHub terraform manifests confirm storage_encrypted=true, but kms_key_id references aws_kms_alias.rds default key rather than customer-managed key required by SecOps Policy §7.4.2.',
    primarySourcePath: 'infra/terraform/modules/rds/main.tf',
    linePageRef: 'Lines 64–88',
    verifiedTimestamp: '2026-10-23 20:14:02 UTC',
    signalsCount: { supporting: 2, conflicting: 1, pending: 0 },
    nodes: [
      {
        id: 'node-claim-1', type: 'claim',
        title: 'SEC-104: Production Encryption at Rest',
        sourceLabel: 'QUESTIONNAIRE (XLSX)',
        pathOrReference: 'SIG_Lite_2026_Vendor_Assessment.xlsx',
        lineOrPageRef: 'Row 104, Sheet "Cryptographic Controls"',
        snippet: 'Are all production data stores encrypted at rest using dedicated CMK keys?',
        status: 'amber', statusText: 'Under Review', confidence: 84, x: 0, y: 0,
      },
      {
        id: 'node-policy-1', type: 'policy',
        title: 'SecOps Policy: Data Storage Standards',
        sourceLabel: 'POLICY DOCUMENT (PDF)',
        pathOrReference: 'Acme_Information_Security_Policy_v3.4.pdf',
        lineOrPageRef: 'Page 28, Section 7.4.2 ("KMS Envelope Encryption")',
        snippet: '§7.4.2: All database instances, Aurora clusters and snapshots must enforce KMS envelope encryption with annual customer-managed key (CMK) rotation enabled.',
        status: 'green', statusText: 'Policy Verified', confidence: 98, x: 0, y: 0,
      },
      {
        id: 'node-repo-1', type: 'repository',
        title: 'Terraform RDS Module Config',
        sourceLabel: 'GITHUB REPOSITORY',
        pathOrReference: 'acme-corp/cloud-core:infra/terraform/modules/rds/main.tf',
        lineOrPageRef: 'Lines 64–88 (commit 8f9b4c2)',
        snippet: 'storage_encrypted = true\nkms_key_id = data.aws_kms_alias.rds_default.arn # WARN: using default aws/rds',
        status: 'amber', statusText: 'Default Key Divergence', confidence: 76, x: 0, y: 0,
      },
      {
        id: 'node-control-1', type: 'control',
        title: 'AWS CIS Benchmark 2.3.1 (RDS CMK Check)',
        sourceLabel: 'AUTOMATED CONTROL AUDIT',
        pathOrReference: 'SecurityHub / CIS AWS Foundations v1.4.0',
        lineOrPageRef: 'Rule CIS-2.3.1 (Finding ID: arn:aws:securityhub:.../finding-982)',
        snippet: 'EVALUATION: PASS (Encrypted at rest: YES) | RECOMMENDATION: Replace default AWS managed KMS key with dedicated customer CMK key.',
        status: 'green', statusText: 'Control Pass (Warning)', confidence: 91, x: 0, y: 0,
      },
      {
        id: 'node-conflict-1', type: 'conflict',
        title: 'Discrepancy: CMK vs Default AWS KMS',
        sourceLabel: 'PROVENANCE CONFLICT',
        pathOrReference: 'Divergence: Policy §7.4.2 vs main.tf:L71',
        lineOrPageRef: 'SecOps PDF p.28 vs rds/main.tf:71',
        snippet: 'Vendor questionnaire states dedicated CMK is used, but Terraform provisioner specifies default alias/aws/rds managed key.',
        status: 'amber', statusText: 'Active Conflict', confidence: 94, x: 0, y: 0,
      },
    ],
    links: [
      { id: 'l1', sourceId: 'node-claim-1', targetId: 'node-policy-1', status: 'green', label: 'Policy Mandate' },
      { id: 'l2', sourceId: 'node-claim-1', targetId: 'node-repo-1', status: 'amber', label: 'Implementation' },
      { id: 'l3', sourceId: 'node-claim-1', targetId: 'node-control-1', status: 'green', label: 'Control Check' },
      { id: 'l4', sourceId: 'node-repo-1', targetId: 'node-conflict-1', status: 'amber', label: 'Divergence', dashed: true },
    ],
  },
  {
    id: 'claim-2',
    code: 'IAM-201',
    category: 'Identity & Access Management',
    question: 'Is multi-factor authentication (MFA) strictly enforced for all administrative and console access?',
    vendorDraftAnswer:
      'Yes. All administrative access to the AWS Management Console and CLI requires FIDO2 WebAuthn or TOTP hardware keys enforced via strict IAM deny policies.',
    status: 'green',
    statusDetail: 'Supporting signals found across policy, IAM repository manifests, and CIS benchmarks',
    limitations: 'Audit confirmed for production AWS accounts; break-glass emergency role uses sealed credential safe.',
    primarySourcePath: 'infra/terraform/modules/iam/mfa_enforcement.tf',
    linePageRef: 'Lines 12–54',
    verifiedTimestamp: '2026-10-23 19:48:15 UTC',
    signalsCount: { supporting: 3, conflicting: 0, pending: 0 },
    nodes: [
      {
        id: 'node-claim-2', type: 'claim',
        title: 'IAM-201: Mandatory MFA Policy',
        sourceLabel: 'QUESTIONNAIRE (XLSX)',
        pathOrReference: 'SIG_Lite_2026_Vendor_Assessment.xlsx',
        lineOrPageRef: 'Row 48, Sheet "IAM Controls"',
        snippet: 'Are administrative console and API sessions protected by MFA unconditionally?',
        status: 'green', statusText: 'Verified', confidence: 99, x: 0, y: 0,
      },
      {
        id: 'node-policy-2', type: 'policy',
        title: 'Access Control & Authentication Policy',
        sourceLabel: 'POLICY DOCUMENT (PDF)',
        pathOrReference: 'Acme_Information_Security_Policy_v3.4.pdf',
        lineOrPageRef: 'Page 14, Section 3.1.2 ("Privileged MFA")',
        snippet: '§3.1.2: Multi-Factor Authentication is required for all administrative roles. Sessions lacking MFA are denied all STS AssumeRole calls.',
        status: 'green', statusText: 'Policy Requirement', confidence: 98, x: 0, y: 0,
      },
      {
        id: 'node-repo-2', type: 'repository',
        title: 'IAM MFA Deny Policy Manifest',
        sourceLabel: 'GITHUB REPOSITORY',
        pathOrReference: 'acme-corp/cloud-core:infra/terraform/modules/iam/mfa_enforcement.tf',
        lineOrPageRef: 'Lines 12–54 (commit e4a710b)',
        snippet: 'Condition = { BoolIfExists = { "aws:MultiFactorAuthPresent": "false" } }, Effect = "Deny"',
        status: 'green', statusText: 'Code Implemented', confidence: 97, x: 0, y: 0,
      },
      {
        id: 'node-control-2', type: 'control',
        title: 'SOC 2 CC6.1 / AWS CIS Benchmark 1.5',
        sourceLabel: 'AUTOMATED CONTROL AUDIT',
        pathOrReference: 'AWS IAM Credential Report & SecurityHub',
        lineOrPageRef: 'Account: 948102948120 (100% MFA compliance)',
        snippet: 'Root MFA: ACTIVE (Virtual TOTP) | IAM Users: 0 active without MFA | Session duration: 3600s',
        status: 'green', statusText: 'Verified Compliant', confidence: 99, x: 0, y: 0,
      },
    ],
    links: [
      { id: 'l2-1', sourceId: 'node-claim-2', targetId: 'node-policy-2', status: 'green', label: 'Policy Mandate' },
      { id: 'l2-2', sourceId: 'node-claim-2', targetId: 'node-repo-2', status: 'green', label: 'Implementation' },
      { id: 'l2-3', sourceId: 'node-claim-2', targetId: 'node-control-2', status: 'green', label: 'Control Check' },
    ],
  },
  {
    id: 'claim-3',
    code: 'NET-310',
    category: 'Network & Perimeter Security',
    question: 'Are public ingress routes to internal microservices restricted through a certified WAF and zero-trust gateway?',
    vendorDraftAnswer:
      'Yes. All external HTTP/S endpoints terminate at Cloudflare Enterprise with rate limiting, OWASP ModSecurity rule sets, and AWS WAF token inspection.',
    status: 'red',
    statusDetail: 'Unsafe condition: Ingress manifest exposes public port 8080 without WAF association or TLS termination',
    limitations:
      'Checkov and Kubeval scans flagged Kubernetes manifest k8s/ingress/public-ingress.yaml missing waf-acl-arn annotation and exposing raw TCP.',
    primarySourcePath: 'k8s/ingress/public-ingress.yaml',
    linePageRef: 'Lines 15–32',
    verifiedTimestamp: '2026-10-23 18:22:10 UTC',
    signalsCount: { supporting: 1, conflicting: 2, pending: 0 },
    nodes: [
      {
        id: 'node-claim-3', type: 'claim',
        title: 'NET-310: Web Application Firewall Ingress',
        sourceLabel: 'QUESTIONNAIRE (XLSX)',
        pathOrReference: 'SIG_Lite_2026_Vendor_Assessment.xlsx',
        lineOrPageRef: 'Row 76, Sheet "Network Defense"',
        snippet: 'Are all external endpoints shielded behind WAF protection with rate limiting enabled?',
        status: 'red', statusText: 'Violated', confidence: 92, x: 0, y: 0,
      },
      {
        id: 'node-policy-3', type: 'policy',
        title: 'Perimeter Security Standard',
        sourceLabel: 'POLICY DOCUMENT (PDF)',
        pathOrReference: 'Acme_Information_Security_Policy_v3.4.pdf',
        lineOrPageRef: 'Page 44, Section 11.1 ("WAF Ingress Rule")',
        snippet: '§11.1: No public load balancer or ingress controller may be provisioned without attached AWS WAF v2 WebACL enforcing OWASP Top 10 rulesets.',
        status: 'green', statusText: 'Policy Mandate', confidence: 96, x: 0, y: 0,
      },
      {
        id: 'node-repo-3', type: 'repository',
        title: 'Kubernetes Ingress Definition',
        sourceLabel: 'GITHUB REPOSITORY',
        pathOrReference: 'acme-corp/cloud-core:k8s/ingress/public-ingress.yaml',
        lineOrPageRef: 'Lines 15–32 (commit c3781aa)',
        snippet: 'apiVersion: networking.k8s.io/v1\nkind: Ingress\nmetadata:\n  annotations:\n    # MISSING: alb.ingress.kubernetes.io/waf-acl-arn',
        status: 'red', statusText: 'Unsafe Ingress Config', confidence: 95, x: 0, y: 0,
      },
      {
        id: 'node-control-3', type: 'control',
        title: 'Static Security Analysis (Checkov CKV_AWS_150)',
        sourceLabel: 'AUTOMATED CONTROL AUDIT',
        pathOrReference: 'Bridgecrew / Checkov Policy Run #4910',
        lineOrPageRef: 'Check ID: CKV_AWS_150 (ALB WAF association)',
        snippet: 'FAILED: Target Load Balancer k8s-public-alb does not have an active WAF WebACL attachment.',
        status: 'red', statusText: 'Automated Test Failure', confidence: 99, x: 0, y: 0,
      },
      {
        id: 'node-conflict-3', type: 'conflict',
        title: 'Direct Exposure Violation',
        sourceLabel: 'PROVENANCE CONFLICT',
        pathOrReference: 'Policy §11.1 vs public-ingress.yaml',
        lineOrPageRef: 'WAF Annotation absent in repo config',
        snippet: 'Vendor claimed all services have WAF, but production ingress controller is operating without WebACL filter.',
        status: 'red', statusText: 'Critical Exposure', confidence: 98, x: 0, y: 0,
      },
    ],
    links: [
      { id: 'l3-1', sourceId: 'node-claim-3', targetId: 'node-policy-3', status: 'green', label: 'Policy Mandate' },
      { id: 'l3-2', sourceId: 'node-claim-3', targetId: 'node-repo-3', status: 'red', label: 'Non-Compliant' },
      { id: 'l3-3', sourceId: 'node-claim-3', targetId: 'node-control-3', status: 'red', label: 'Check Failed' },
      { id: 'l3-4', sourceId: 'node-repo-3', targetId: 'node-conflict-3', status: 'red', label: 'Bypass Alert', dashed: true },
    ],
  },
  {
    id: 'claim-4',
    code: 'LOG-405',
    category: 'Logging & Audit Trails',
    question: 'Are immutable audit logs preserved for a minimum retention duration of 365 days in a tamper-evident bucket?',
    vendorDraftAnswer:
      'Yes. AWS CloudTrail and VPC flow logs are forwarded to a dedicated isolated security log bucket with S3 Object Lock enabled in Compliance Mode for 365 days.',
    status: 'green',
    statusDetail: 'Full provenance verified across S3 Object Lock configuration, retention policies, and AWS Config',
    limitations: 'Lifecycle rule transitions objects to Glacier Instant Retrieval after 90 days.',
    primarySourcePath: 'infra/terraform/modules/security_bucket/main.tf',
    linePageRef: 'Lines 30–55',
    verifiedTimestamp: '2026-10-23 17:05:40 UTC',
    signalsCount: { supporting: 3, conflicting: 0, pending: 0 },
    nodes: [
      {
        id: 'node-claim-4', type: 'claim',
        title: 'LOG-405: Immutable 365-Day Log Retention',
        sourceLabel: 'QUESTIONNAIRE (XLSX)',
        pathOrReference: 'SIG_Lite_2026_Vendor_Assessment.xlsx',
        lineOrPageRef: 'Row 120, Sheet "Logging & Monitoring"',
        snippet: 'Are central security logs protected against tampering and retained for 365 days?',
        status: 'green', statusText: 'Verified', confidence: 96, x: 0, y: 0,
      },
      {
        id: 'node-policy-4', type: 'policy',
        title: 'Audit Logging & Retention Policy',
        sourceLabel: 'POLICY DOCUMENT (PDF)',
        pathOrReference: 'Acme_Information_Security_Policy_v3.4.pdf',
        lineOrPageRef: 'Page 36, Section 9.2 ("Log Immutability")',
        snippet: '§9.2: Production audit logs must be retained for 365 days in WORM compliant storage with deletion prevention.',
        status: 'green', statusText: 'Policy Confirmed', confidence: 98, x: 0, y: 0,
      },
      {
        id: 'node-repo-4', type: 'repository',
        title: 'Terraform S3 Object Lock Config',
        sourceLabel: 'GITHUB REPOSITORY',
        pathOrReference: 'acme-corp/cloud-core:infra/terraform/modules/security_bucket/main.tf',
        lineOrPageRef: 'Lines 30–55 (commit 6d82ea1)',
        snippet: 'object_lock_configuration {\n  rule {\n    default_retention {\n      mode = "COMPLIANCE"\n      days = 365\n    }\n  }\n}',
        status: 'green', statusText: 'Compliant HCL', confidence: 97, x: 0, y: 0,
      },
      {
        id: 'node-control-4', type: 'control',
        title: 'AWS Config Rule: s3-bucket-object-lock-enabled',
        sourceLabel: 'AUTOMATED CONTROL AUDIT',
        pathOrReference: 'AWS Config Compliance Dashboard',
        lineOrPageRef: 'Compliance Rule ID: AWS_CONFIG_RULE_S3_LOCK',
        snippet: 'Status: COMPLIANT for bucket acme-secops-audit-logs-production-us-east-1.',
        status: 'green', statusText: 'Passing Audit', confidence: 99, x: 0, y: 0,
      },
    ],
    links: [
      { id: 'l4-1', sourceId: 'node-claim-4', targetId: 'node-policy-4', status: 'green', label: 'Policy Mandate' },
      { id: 'l4-2', sourceId: 'node-claim-4', targetId: 'node-repo-4', status: 'green', label: 'Implementation' },
      { id: 'l4-3', sourceId: 'node-claim-4', targetId: 'node-control-4', status: 'green', label: 'Control Check' },
    ],
  },
  {
    id: 'claim-5',
    code: 'CICD-512',
    category: 'Application Security & SDLC',
    question: 'Are production releases gated by mandatory peer reviews from at least two codeowners and signed commits?',
    vendorDraftAnswer:
      'Yes. GitHub branch protection rules require two senior engineering approvals, mandatory CI passing checks, and verified GPG commit signatures before merging.',
    status: 'amber',
    statusDetail: 'Ambiguous: branch protection ruleset requires 1 approval instead of 2 specified in policy',
    limitations: 'Branch ruleset for `main` requires 1 review; CODEOWNERS file is configured but approval count is set to 1.',
    primarySourcePath: '.github/branch-protections.json',
    linePageRef: 'Lines 8–24',
    verifiedTimestamp: '2026-10-23 16:30:00 UTC',
    signalsCount: { supporting: 2, conflicting: 1, pending: 0 },
    nodes: [
      {
        id: 'node-claim-5', type: 'claim',
        title: 'CICD-512: Branch Protections & 2 Reviews',
        sourceLabel: 'QUESTIONNAIRE (XLSX)',
        pathOrReference: 'SIG_Lite_2026_Vendor_Assessment.xlsx',
        lineOrPageRef: 'Row 142, Sheet "SDLC Security"',
        snippet: 'Are production branch merges protected by minimum 2 independent code reviews?',
        status: 'amber', statusText: 'Threshold Divergence', confidence: 88, x: 0, y: 0,
      },
      {
        id: 'node-policy-5', type: 'policy',
        title: 'Secure Software Development Lifecycle Policy',
        sourceLabel: 'POLICY DOCUMENT (PDF)',
        pathOrReference: 'Acme_Information_Security_Policy_v3.4.pdf',
        lineOrPageRef: 'Page 18, Section 5.2 ("Peer Code Review")',
        snippet: '§5.2: Any change targeting production branches requires minimum two (2) authorized peer reviews and verified commit signatures.',
        status: 'green', statusText: 'Policy Standard', confidence: 98, x: 0, y: 0,
      },
      {
        id: 'node-repo-5', type: 'repository',
        title: 'GitHub Branch Protection JSON',
        sourceLabel: 'GITHUB REPOSITORY',
        pathOrReference: 'acme-corp/cloud-core:.github/branch-protections.json',
        lineOrPageRef: 'Lines 8–24 (commit 7a19ef4)',
        snippet: '"required_pull_request_reviews": {\n  "dismiss_stale_reviews": true,\n  "required_approving_review_count": 1 // EXPECTED 2\n}',
        status: 'amber', statusText: 'Threshold Mismatch (1 vs 2)', confidence: 85, x: 0, y: 0,
      },
      {
        id: 'node-control-5', type: 'control',
        title: 'GitHub Organization Ruleset Verification',
        sourceLabel: 'AUTOMATED CONTROL AUDIT',
        pathOrReference: 'GitHub REST API /repos/rules/branches/main',
        lineOrPageRef: 'Ruleset ID: 88129 (Signed Commits: True, Reviews: 1)',
        snippet: 'Signed commits: ENFORCED | Dismiss stale reviews: TRUE | Required reviews: 1 of 2 required by policy.',
        status: 'amber', statusText: 'Partial Compliance', confidence: 90, x: 0, y: 0,
      },
      {
        id: 'node-conflict-5', type: 'conflict',
        title: 'Approval Count Discrepancy',
        sourceLabel: 'PROVENANCE CONFLICT',
        pathOrReference: 'SDLC Policy §5.2 vs branch-protections.json',
        lineOrPageRef: 'Policy mandates 2 reviews; repo config enforces 1',
        snippet: 'Questionnaire claims 2 peer reviews are enforced, but repo branch protection allows single-reviewer approval merge.',
        status: 'amber', statusText: 'Review Threshold Gap', confidence: 92, x: 0, y: 0,
      },
    ],
    links: [
      { id: 'l5-1', sourceId: 'node-claim-5', targetId: 'node-policy-5', status: 'green', label: 'Policy Mandate' },
      { id: 'l5-2', sourceId: 'node-claim-5', targetId: 'node-repo-5', status: 'amber', label: '1 Review Only' },
      { id: 'l5-3', sourceId: 'node-claim-5', targetId: 'node-control-5', status: 'amber', label: 'Ruleset Output' },
      { id: 'l5-4', sourceId: 'node-repo-5', targetId: 'node-conflict-5', status: 'amber', label: 'Gap Detected', dashed: true },
    ],
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Findings: 3 separate conflict/finding entities linked to 3 of the 5 claims
// (SEC-104, NET-310, CICD-512). IAM-201 and LOG-405 are clean.
// This is the correct entity: 5 questions, 3 findings — not the same count.
// ─────────────────────────────────────────────────────────────────────────────
export const DEMO_CONFLICTS: ConflictItem[] = [
  {
    id: 'conf-1',
    claimCode: 'SEC-104',
    title: 'Customer Managed Key (CMK) vs Default aws/rds KMS Key',
    severity: 'medium',
    sourceA: {
      type: 'policy',
      label: 'SecOps Policy v3.4',
      ref: 'Page 28, §7.4.2',
      statement: 'Mandatory dedicated customer-managed key (CMK) with annual rotation for all RDS clusters.',
    },
    sourceB: {
      type: 'repo',
      label: 'infra/rds/main.tf',
      ref: 'Line 71 (commit 8f9b4c2)',
      statement: 'kms_key_id references default data.aws_kms_alias.rds_default.arn instead of custom CMK.',
    },
    detectedAt: '12m ago',
  },
  {
    id: 'conf-2',
    claimCode: 'NET-310',
    title: 'Public K8s Ingress Lacks AWS WAF Association',
    severity: 'high',
    sourceA: {
      type: 'questionnaire',
      label: 'SIG Lite Row 76',
      ref: 'Network Defense §11',
      statement: 'Vendor certified 100% of ingress points pass through OWASP-compliant WAF filters.',
    },
    sourceB: {
      type: 'repo',
      label: 'k8s/public-ingress.yaml',
      ref: 'Lines 15–32 (commit c3781aa)',
      statement: 'Ingress annotation alb.ingress.kubernetes.io/waf-acl-arn is omitted; traffic uninspected.',
    },
    detectedAt: '28m ago',
  },
  {
    id: 'conf-3',
    claimCode: 'CICD-512',
    title: 'Branch Review Threshold (1 Required vs 2 Mandated)',
    severity: 'low',
    sourceA: {
      type: 'policy',
      label: 'SDLC Policy §5.2',
      ref: 'Page 18, Section 5.2',
      statement: 'Two independent codeowner approvals mandatory for all production merges.',
    },
    sourceB: {
      type: 'control',
      label: 'GitHub Ruleset 88129',
      ref: 'branch-protections.json:L12',
      statement: 'Active branch protection enforces required_approving_review_count = 1.',
    },
    detectedAt: '1h 14m ago',
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Screen C: Evidence Library items
// ─────────────────────────────────────────────────────────────────────────────
import type { EvidenceLibraryItem, SecurityCheckCategory } from '@/types/claimtrail';

export const DEMO_EVIDENCE_LIBRARY: EvidenceLibraryItem[] = [
  {
    id: 'EVID-POL-01',
    sourceType: 'policy',
    sourceName: 'Acme Information Security Policy v3.4 (PDF)',
    pathOrRef: 'Acme_Information_Security_Policy_v3.4.pdf',
    location: 'Page 28, Section 7.4.2',
    domain: 'Data Protection & Encryption',
    relatedClaimCode: 'SEC-104',
    excerpt:
      '§7.4.2: All production database instances, Aurora clusters, and automated backups must enforce KMS envelope encryption with annual customer-managed key (CMK) rotation enabled.',
    relevance:
      'Establishes explicit policy requirement for customer-managed encryption keys (CMK) on databases.',
    confidence: 98,
    status: 'green',
  },
  {
    id: 'EVID-REPO-02',
    sourceType: 'repository',
    sourceName: 'GitHub Repository (acme-corp/cloud-core)',
    pathOrRef: 'infra/terraform/modules/rds/main.tf',
    location: 'Lines 64–88 (commit 8f9b4c2)',
    domain: 'Data Protection & Encryption',
    relatedClaimCode: 'SEC-104',
    excerpt:
      'storage_encrypted = true\nkms_key_id = data.aws_kms_alias.rds_default.arn # WARN: using default aws/rds managed key',
    relevance:
      'Proves storage volume encryption is enabled, but reveals default AWS KMS key is provisioned instead of CMK.',
    confidence: 84,
    status: 'amber',
  },
  {
    id: 'EVID-POL-03',
    sourceType: 'policy',
    sourceName: 'Acme Information Security Policy v3.4 (PDF)',
    pathOrRef: 'Acme_Information_Security_Policy_v3.4.pdf',
    location: 'Page 14, Section 3.1.2',
    domain: 'Identity & Access Management',
    relatedClaimCode: 'IAM-201',
    excerpt:
      '§3.1.2: Multi-Factor Authentication is unconditionally required for all administrative roles. Sessions lacking MFA are denied all STS AssumeRole calls.',
    relevance:
      'Mandates hardware TOTP/FIDO2 MFA for all privileged IAM roles and AWS console access.',
    confidence: 99,
    status: 'green',
  },
  {
    id: 'EVID-REPO-04',
    sourceType: 'repository',
    sourceName: 'GitHub Repository (acme-corp/cloud-core)',
    pathOrRef: 'infra/terraform/modules/iam/mfa_enforcement.tf',
    location: 'Lines 12–54 (commit e4a710b)',
    domain: 'Identity & Access Management',
    relatedClaimCode: 'IAM-201',
    excerpt:
      'Condition = { BoolIfExists = { "aws:MultiFactorAuthPresent": "false" } }, Effect = "Deny"',
    relevance:
      'Validates direct enforcement of IAM deny policy for any AWS CLI or console action without MFA.',
    confidence: 97,
    status: 'green',
  },
  {
    id: 'EVID-REPO-05',
    sourceType: 'repository',
    sourceName: 'GitHub Repository (acme-corp/cloud-core)',
    pathOrRef: 'k8s/ingress/public-ingress.yaml',
    location: 'Lines 15–32 (commit c3781aa)',
    domain: 'Network & Perimeter Security',
    relatedClaimCode: 'NET-310',
    excerpt:
      'apiVersion: networking.k8s.io/v1\nkind: Ingress\nmetadata:\n  name: public-api-gateway\n  # MISSING: alb.ingress.kubernetes.io/waf-acl-arn',
    relevance:
      'Reveals production public ingress controller exposes port 8080 without required AWS WAF WebACL attachment.',
    confidence: 95,
    status: 'red',
  },
  {
    id: 'EVID-CTRL-06',
    sourceType: 'control',
    sourceName: 'Checkov Static Security Analysis',
    pathOrRef: 'Checkov Policy Run #4910 (Rule CKV_AWS_150)',
    location: 'Check ID: CKV_AWS_150',
    domain: 'Network & Perimeter Security',
    relatedClaimCode: 'NET-310',
    excerpt:
      'FAILED: Target Load Balancer k8s-public-alb does not have an active WAF WebACL attachment.',
    relevance:
      'Automated deterministic check flagged missing WAF WebACL on public load balancer.',
    confidence: 99,
    status: 'red',
  },
  {
    id: 'EVID-REPO-07',
    sourceType: 'repository',
    sourceName: 'GitHub Repository (acme-corp/cloud-core)',
    pathOrRef: 'infra/terraform/modules/security_bucket/main.tf',
    location: 'Lines 30–55 (commit 6d82ea1)',
    domain: 'Logging & Audit Trails',
    relatedClaimCode: 'LOG-405',
    excerpt:
      'object_lock_configuration {\n  rule {\n    default_retention {\n      mode = "COMPLIANCE"\n      days = 365\n    }\n  }\n}',
    relevance:
      'Verifies 365-day immutable retention enforced by S3 Object Lock in Compliance Mode.',
    confidence: 97,
    status: 'green',
  },
  {
    id: 'EVID-CTRL-08',
    sourceType: 'control',
    sourceName: 'GitHub Organization Ruleset Verification',
    pathOrRef: 'GitHub REST API /repos/rules/branches/main',
    location: 'Ruleset ID: 88129',
    domain: 'Application Security & SDLC',
    relatedClaimCode: 'CICD-512',
    excerpt:
      '"required_pull_request_reviews": {\n  "dismiss_stale_reviews": true,\n  "required_approving_review_count": 1 // EXPECTED 2\n}',
    relevance:
      'Direct API audit shows branch protection ruleset requires 1 approval instead of the 2 mandated by policy.',
    confidence: 90,
    status: 'amber',
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Screen E: Security Checks (3 Categories)
// ─────────────────────────────────────────────────────────────────────────────
export const DEMO_SECURITY_CHECKS: SecurityCheckCategory[] = [
  {
    id: 'chk-1',
    category: 'encryption',
    title: 'Encryption Configuration',
    description:
      'Inspects database clusters, S3 buckets, and snapshot volumes for Customer-Managed Keys (CMK) and annual key rotation policies.',
    status: 'needs_review',
    statusLabel: 'Needs Review',
    sourceReference: 'infra/terraform/modules/rds/main.tf:L71',
    targetPath: 'acme-corp/cloud-core · Terraform RDS Module',
    findingDetail:
      'Storage volume encryption is active (AES-256), but kms_key_id references the default AWS managed key alias/aws/rds rather than a customer-managed key with annual rotation.',
    verifiedScope: '12 RDS clusters, 4 S3 buckets inspected in commit 8f9b4c2.',
  },
  {
    id: 'chk-2',
    category: 'auth',
    title: 'API Authentication Patterns',
    description:
      'Verifies mandatory MFA enforcement, session timeout limits, and FIDO2/TOTP policies across administrative IAM roles.',
    status: 'supported',
    statusLabel: 'Supported',
    sourceReference: 'infra/terraform/modules/iam/mfa_enforcement.tf:L12-54',
    targetPath: 'acme-corp/cloud-core · IAM Policy Manifests',
    findingDetail:
      'All administrative roles enforce strict IAM deny policies when aws:MultiFactorAuthPresent is false. Zero root keys or unauthenticated CLI sessions permitted.',
    verifiedScope: '100% IAM users & administrative roles in AWS account 948102948120.',
  },
  {
    id: 'chk-3',
    category: 'isolation',
    title: 'Tenant-Specific Data Access & Perimeter',
    description:
      'Analyzes public ingress controllers, tenant boundary isolation, and WAF WebACL filtering rules for external endpoints.',
    status: 'issue_detected',
    statusLabel: 'Issue Detected',
    sourceReference: 'k8s/ingress/public-ingress.yaml:L15-32',
    targetPath: 'acme-corp/cloud-core · Kubernetes Manifests',
    findingDetail:
      'Public Kubernetes Ingress manifest exposes external port 8080 without an attached AWS WAF WebACL annotation (Checkov CKV_AWS_150 violation).',
    verifiedScope: '3 Kubernetes ingress definitions & 2 API gateway routes evaluated.',
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Screen E: Policy-Implementation Conflict Scenario (Illustrative Demo)
// ─────────────────────────────────────────────────────────────────────────────
export const DEMO_POLICY_CONFLICT_SCENARIO = {
  id: 'conflict-scenario-demo',
  title: 'Policy Mandate vs Code Implementation Divergence',
  policyExcerpt:
    'SecOps Policy §7.4.2: All database instances, Aurora clusters, and snapshots must enforce KMS envelope encryption with annual customer-managed key (CMK) rotation enabled.',
  policyLocation: 'Acme_Information_Security_Policy_v3.4.pdf (Page 28, Section 7.4.2)',
  configExcerpt:
    'storage_encrypted = true\nkms_key_id = data.aws_kms_alias.rds_default.arn # Default aws/rds key',
  configLocation: 'infra/terraform/modules/rds/main.tf (Line 71, commit 8f9b4c2)',
  discrepancyExplanation:
    'The vendor security questionnaire asserts customer-managed keys (CMK) are enforced across all databases. However, the inspected Terraform infrastructure definition provisions RDS clusters using the default AWS-managed KMS key (alias/aws/rds), which does not allow customer rotation control or custom key access policies.',
  affectedClaimCode: 'SEC-104',
  severity: 'medium' as const,
  remediationRecommendation:
    'Update infra/terraform/modules/rds/main.tf to assign kms_key_id = aws_kms_key.rds_cmk.arn, and verify annual key rotation is enabled in KMS key resources.',
};

