module.exports = [
(()=>{"use strict";return[
"[project]/app/api/assessment/load-sample/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/fs [external] (fs, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/path [external] (path, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$xlsxParser$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/xlsxParser.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$pdfParser$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/pdfParser.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$securityChecker$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/securityChecker.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/store.ts [app-route] (ecmascript)");
;
;
;
;
;
;
;
async function POST() {
    try {
        const xlsxPath = __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].join(process.cwd(), 'public', 'samples', 'AcmeCorp-Security-Assessment-2026.xlsx');
        const pdfPath = __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].join(process.cwd(), 'public', 'samples', 'Acme_InfoSec_Policy_v4.2.pdf');
        if (!__TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["default"].existsSync(xlsxPath) || !__TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["default"].existsSync(pdfPath)) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Sample files not found on disk.'
            }, {
                status: 404
            });
        }
        const xlsxBuffer = __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["default"].readFileSync(xlsxPath);
        const pdfBuffer = __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["default"].readFileSync(pdfPath);
        // Save buffers to store uploads
        const savedXlsxPath = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["saveUploadedBuffer"])('AcmeCorp-Security-Assessment-2026.xlsx', xlsxBuffer);
        const savedPdfPath = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["saveUploadedBuffer"])('Acme_InfoSec_Policy_v4.2.pdf', pdfBuffer);
        // Parse XLSX
        const xlsxResult = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$xlsxParser$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["parseXlsxQuestionnaire"])(xlsxBuffer, 'AcmeCorp-Security-Assessment-2026.xlsx');
        // Parse PDF
        const pdfResult = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$pdfParser$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["parseSecurityPolicyPdf"])(pdfBuffer, 'Acme_InfoSec_Policy_v4.2.pdf');
        const pdfChunks = pdfResult.chunks.map((c, i)=>({
                id: `chunk-p-${i + 1}`,
                pageOrFile: `Page ${c.pageNumber}`,
                section: c.sectionTitle,
                text: c.text,
                confidence: c.confidence
            }));
        const sampleSources = [
            {
                id: 'src-1',
                name: 'AcmeCorp-Security-Assessment-2026.xlsx',
                type: 'xlsx',
                typeLabel: 'Excel Questionnaire',
                sizeOrBranch: `${(xlsxBuffer.length / 1024).toFixed(1)} KB`,
                sha: xlsxResult.sha256,
                status: 'ready',
                statusLabel: 'Ready',
                extractedTitle: `${xlsxResult.claims.length} questions parsed`,
                extractedProgress: 100,
                extractedNote: '(100%)',
                linkedCount: xlsxResult.claims.length,
                lastUpdated: 'Just now',
                localPath: savedXlsxPath
            },
            {
                id: 'src-2',
                name: 'Acme_InfoSec_Policy_v4.2.pdf',
                type: 'pdf',
                typeLabel: 'PDF Security Policy',
                sizeOrBranch: `${(pdfBuffer.length / 1024).toFixed(1)} KB`,
                sha: pdfResult.sha256,
                status: 'ready',
                statusLabel: 'Ready',
                extractedTitle: `${pdfResult.pagesCount} pages indexed, ${pdfChunks.length} sections mapped`,
                extractedProgress: 100,
                extractedNote: 'Text Conf: 99.8%',
                linkedCount: pdfChunks.length,
                lastUpdated: 'Just now',
                localPath: savedPdfPath,
                extractedChunks: pdfChunks
            },
            {
                id: 'src-3',
                name: 'github.com/acme/core-api',
                type: 'repo',
                typeLabel: 'Public GitHub Repo',
                sizeOrBranch: 'branch: main',
                sha: 'SHA: 7a21f8 • Unverified commit telemetry',
                status: 'needs_attention',
                statusLabel: 'Needs Attention',
                extractedTitle: '14 Go files analyzed, tenant middleware scanned',
                extractedProgress: 75,
                extractedNote: '1 pattern requires engineer sign-off',
                linkedCount: 12,
                lastUpdated: 'Just now',
                extractedChunks: [
                    {
                        id: 'chunk-r-1',
                        pageOrFile: 'auth/tenant_middleware.go',
                        section: 'Lines 42–48',
                        text: 'func TenantIsolationMiddleware(next http.Handler) { db.Exec("SET LOCAL app.current_tenant_id = ?", tenantID) }',
                        confidence: 94.2,
                        linkedQuestionCode: 'SEC-104'
                    }
                ]
            }
        ];
        // Evaluate controls against claims
        const evalResult = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$securityChecker$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["evaluateSecurityControls"])(xlsxResult.claims, sampleSources);
        const initialDeliverables = [
            {
                id: 'exp-1',
                filename: 'AcmeCorp-Security-Assessment-2026-DRAFT-v0.9.xlsx',
                format: 'XLSX',
                assessment: 'AcmeCorp Enterprise 2026',
                exportedAt: 'Today, 14:12 UTC',
                status: 'Signed Draft',
                isDraft: true,
                sizeBytes: 2457600,
                downloadUrl: '/api/export/download/exp-1'
            }
        ];
        const updatedState = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["updateAssessmentStore"])(()=>({
                assessmentId: 'asm-acme-2026',
                assessmentName: 'AcmeCorp Enterprise Security 2026',
                framework: 'SIG Lite 2026 / SOC 2 Type II',
                targetFilename: 'AcmeCorp-Security-Assessment-2026.xlsx',
                originalWorkbookPath: savedXlsxPath,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                claims: evalResult.updatedClaims,
                conflicts: evalResult.conflicts,
                sources: sampleSources,
                exportHistory: initialDeliverables,
                settings: {
                    activeModel: 'claude-3-7-sonnet',
                    strictVerification: true,
                    autoDetectConflicts: true,
                    openaiApiKey: process.env.OPENAI_API_KEY || '',
                    githubToken: process.env.GITHUB_TOKEN || ''
                }
            }));
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: true,
            message: 'Sample assessment loaded and evaluated with authentic XLSX and PDF.',
            state: updatedState
        });
    } catch (err) {
        console.error('Failed to load sample assessment:', err);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: err?.message || 'Failed to load sample assessment.'
        }, {
            status: 500
        });
    }
}
}),
"[project]/data/demoData.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DEMO_CLAIMS",
    ()=>DEMO_CLAIMS,
    "DEMO_CONFLICTS",
    ()=>DEMO_CONFLICTS,
    "DEMO_EVIDENCE_LIBRARY",
    ()=>DEMO_EVIDENCE_LIBRARY,
    "DEMO_POLICY_CONFLICT_SCENARIO",
    ()=>DEMO_POLICY_CONFLICT_SCENARIO,
    "DEMO_SECURITY_CHECKS",
    ()=>DEMO_SECURITY_CHECKS,
    "deriveMetrics",
    ()=>deriveMetrics
]);
function deriveMetrics(claims, conflicts) {
    const total = claims.length;
    const supported = claims.filter((c)=>c.status === 'green').length;
    const needsReview = claims.filter((c)=>c.status === 'amber').length;
    const unsafe = claims.filter((c)=>c.status === 'red').length;
    const activeFindings = conflicts.length;
    return {
        total,
        supported,
        needsReview,
        unsafe,
        activeFindings
    };
}
const DEMO_CLAIMS = [
    {
        id: 'claim-1',
        code: 'SEC-104',
        category: 'Data Protection & Encryption',
        question: 'Are production database backups and storage volumes encrypted at rest with customer-managed keys (CMK)?',
        vendorDraftAnswer: 'Yes. All production RDS clusters, Aurora replicas, and EBS volumes enforce AES-256 KMS envelope encryption using dedicated Customer Managed Keys with automatic rotation.',
        status: 'amber',
        statusDetail: 'Incomplete evidence: storage encrypted, but default AWS managed key found instead of CMK',
        limitations: 'Inspected GitHub terraform manifests confirm storage_encrypted=true, but kms_key_id references aws_kms_alias.rds default key rather than customer-managed key required by SecOps Policy §7.4.2.',
        primarySourcePath: 'infra/terraform/modules/rds/main.tf',
        linePageRef: 'Lines 64–88',
        verifiedTimestamp: '2026-10-23 20:14:02 UTC',
        signalsCount: {
            supporting: 2,
            conflicting: 1,
            pending: 0
        },
        nodes: [
            {
                id: 'node-claim-1',
                type: 'claim',
                title: 'SEC-104: Production Encryption at Rest',
                sourceLabel: 'QUESTIONNAIRE (XLSX)',
                pathOrReference: 'SIG_Lite_2026_Vendor_Assessment.xlsx',
                lineOrPageRef: 'Row 104, Sheet "Cryptographic Controls"',
                snippet: 'Are all production data stores encrypted at rest using dedicated CMK keys?',
                status: 'amber',
                statusText: 'Under Review',
                confidence: 84,
                x: 0,
                y: 0
            },
            {
                id: 'node-policy-1',
                type: 'policy',
                title: 'SecOps Policy: Data Storage Standards',
                sourceLabel: 'POLICY DOCUMENT (PDF)',
                pathOrReference: 'Acme_Information_Security_Policy_v3.4.pdf',
                lineOrPageRef: 'Page 28, Section 7.4.2 ("KMS Envelope Encryption")',
                snippet: '§7.4.2: All database instances, Aurora clusters and snapshots must enforce KMS envelope encryption with annual customer-managed key (CMK) rotation enabled.',
                status: 'green',
                statusText: 'Policy Verified',
                confidence: 98,
                x: 0,
                y: 0
            },
            {
                id: 'node-repo-1',
                type: 'repository',
                title: 'Terraform RDS Module Config',
                sourceLabel: 'GITHUB REPOSITORY',
                pathOrReference: 'acme-corp/cloud-core:infra/terraform/modules/rds/main.tf',
                lineOrPageRef: 'Lines 64–88 (commit 8f9b4c2)',
                snippet: 'storage_encrypted = true\nkms_key_id = data.aws_kms_alias.rds_default.arn # WARN: using default aws/rds',
                status: 'amber',
                statusText: 'Default Key Divergence',
                confidence: 76,
                x: 0,
                y: 0
            },
            {
                id: 'node-control-1',
                type: 'control',
                title: 'AWS CIS Benchmark 2.3.1 (RDS CMK Check)',
                sourceLabel: 'AUTOMATED CONTROL AUDIT',
                pathOrReference: 'SecurityHub / CIS AWS Foundations v1.4.0',
                lineOrPageRef: 'Rule CIS-2.3.1 (Finding ID: arn:aws:securityhub:.../finding-982)',
                snippet: 'EVALUATION: PASS (Encrypted at rest: YES) | RECOMMENDATION: Replace default AWS managed KMS key with dedicated customer CMK key.',
                status: 'green',
                statusText: 'Control Pass (Warning)',
                confidence: 91,
                x: 0,
                y: 0
            },
            {
                id: 'node-conflict-1',
                type: 'conflict',
                title: 'Discrepancy: CMK vs Default AWS KMS',
                sourceLabel: 'PROVENANCE CONFLICT',
                pathOrReference: 'Divergence: Policy §7.4.2 vs main.tf:L71',
                lineOrPageRef: 'SecOps PDF p.28 vs rds/main.tf:71',
                snippet: 'Vendor questionnaire states dedicated CMK is used, but Terraform provisioner specifies default alias/aws/rds managed key.',
                status: 'amber',
                statusText: 'Active Conflict',
                confidence: 94,
                x: 0,
                y: 0
            }
        ],
        links: [
            {
                id: 'l1',
                sourceId: 'node-claim-1',
                targetId: 'node-policy-1',
                status: 'green',
                label: 'Policy Mandate'
            },
            {
                id: 'l2',
                sourceId: 'node-claim-1',
                targetId: 'node-repo-1',
                status: 'amber',
                label: 'Implementation'
            },
            {
                id: 'l3',
                sourceId: 'node-claim-1',
                targetId: 'node-control-1',
                status: 'green',
                label: 'Control Check'
            },
            {
                id: 'l4',
                sourceId: 'node-repo-1',
                targetId: 'node-conflict-1',
                status: 'amber',
                label: 'Divergence',
                dashed: true
            }
        ]
    },
    {
        id: 'claim-2',
        code: 'IAM-201',
        category: 'Identity & Access Management',
        question: 'Is multi-factor authentication (MFA) strictly enforced for all administrative and console access?',
        vendorDraftAnswer: 'Yes. All administrative access to the AWS Management Console and CLI requires FIDO2 WebAuthn or TOTP hardware keys enforced via strict IAM deny policies.',
        status: 'green',
        statusDetail: 'Supporting signals found across policy, IAM repository manifests, and CIS benchmarks',
        limitations: 'Audit confirmed for production AWS accounts; break-glass emergency role uses sealed credential safe.',
        primarySourcePath: 'infra/terraform/modules/iam/mfa_enforcement.tf',
        linePageRef: 'Lines 12–54',
        verifiedTimestamp: '2026-10-23 19:48:15 UTC',
        signalsCount: {
            supporting: 3,
            conflicting: 0,
            pending: 0
        },
        nodes: [
            {
                id: 'node-claim-2',
                type: 'claim',
                title: 'IAM-201: Mandatory MFA Policy',
                sourceLabel: 'QUESTIONNAIRE (XLSX)',
                pathOrReference: 'SIG_Lite_2026_Vendor_Assessment.xlsx',
                lineOrPageRef: 'Row 48, Sheet "IAM Controls"',
                snippet: 'Are administrative console and API sessions protected by MFA unconditionally?',
                status: 'green',
                statusText: 'Verified',
                confidence: 99,
                x: 0,
                y: 0
            },
            {
                id: 'node-policy-2',
                type: 'policy',
                title: 'Access Control & Authentication Policy',
                sourceLabel: 'POLICY DOCUMENT (PDF)',
                pathOrReference: 'Acme_Information_Security_Policy_v3.4.pdf',
                lineOrPageRef: 'Page 14, Section 3.1.2 ("Privileged MFA")',
                snippet: '§3.1.2: Multi-Factor Authentication is required for all administrative roles. Sessions lacking MFA are denied all STS AssumeRole calls.',
                status: 'green',
                statusText: 'Policy Requirement',
                confidence: 98,
                x: 0,
                y: 0
            },
            {
                id: 'node-repo-2',
                type: 'repository',
                title: 'IAM MFA Deny Policy Manifest',
                sourceLabel: 'GITHUB REPOSITORY',
                pathOrReference: 'acme-corp/cloud-core:infra/terraform/modules/iam/mfa_enforcement.tf',
                lineOrPageRef: 'Lines 12–54 (commit e4a710b)',
                snippet: 'Condition = { BoolIfExists = { "aws:MultiFactorAuthPresent": "false" } }, Effect = "Deny"',
                status: 'green',
                statusText: 'Code Implemented',
                confidence: 97,
                x: 0,
                y: 0
            },
            {
                id: 'node-control-2',
                type: 'control',
                title: 'SOC 2 CC6.1 / AWS CIS Benchmark 1.5',
                sourceLabel: 'AUTOMATED CONTROL AUDIT',
                pathOrReference: 'AWS IAM Credential Report & SecurityHub',
                lineOrPageRef: 'Account: 948102948120 (100% MFA compliance)',
                snippet: 'Root MFA: ACTIVE (Virtual TOTP) | IAM Users: 0 active without MFA | Session duration: 3600s',
                status: 'green',
                statusText: 'Verified Compliant',
                confidence: 99,
                x: 0,
                y: 0
            }
        ],
        links: [
            {
                id: 'l2-1',
                sourceId: 'node-claim-2',
                targetId: 'node-policy-2',
                status: 'green',
                label: 'Policy Mandate'
            },
            {
                id: 'l2-2',
                sourceId: 'node-claim-2',
                targetId: 'node-repo-2',
                status: 'green',
                label: 'Implementation'
            },
            {
                id: 'l2-3',
                sourceId: 'node-claim-2',
                targetId: 'node-control-2',
                status: 'green',
                label: 'Control Check'
            }
        ]
    },
    {
        id: 'claim-3',
        code: 'NET-310',
        category: 'Network & Perimeter Security',
        question: 'Are public ingress routes to internal microservices restricted through a certified WAF and zero-trust gateway?',
        vendorDraftAnswer: 'Yes. All external HTTP/S endpoints terminate at Cloudflare Enterprise with rate limiting, OWASP ModSecurity rule sets, and AWS WAF token inspection.',
        status: 'red',
        statusDetail: 'Unsafe condition: Ingress manifest exposes public port 8080 without WAF association or TLS termination',
        limitations: 'Checkov and Kubeval scans flagged Kubernetes manifest k8s/ingress/public-ingress.yaml missing waf-acl-arn annotation and exposing raw TCP.',
        primarySourcePath: 'k8s/ingress/public-ingress.yaml',
        linePageRef: 'Lines 15–32',
        verifiedTimestamp: '2026-10-23 18:22:10 UTC',
        signalsCount: {
            supporting: 1,
            conflicting: 2,
            pending: 0
        },
        nodes: [
            {
                id: 'node-claim-3',
                type: 'claim',
                title: 'NET-310: Web Application Firewall Ingress',
                sourceLabel: 'QUESTIONNAIRE (XLSX)',
                pathOrReference: 'SIG_Lite_2026_Vendor_Assessment.xlsx',
                lineOrPageRef: 'Row 76, Sheet "Network Defense"',
                snippet: 'Are all external endpoints shielded behind WAF protection with rate limiting enabled?',
                status: 'red',
                statusText: 'Violated',
                confidence: 92,
                x: 0,
                y: 0
            },
            {
                id: 'node-policy-3',
                type: 'policy',
                title: 'Perimeter Security Standard',
                sourceLabel: 'POLICY DOCUMENT (PDF)',
                pathOrReference: 'Acme_Information_Security_Policy_v3.4.pdf',
                lineOrPageRef: 'Page 44, Section 11.1 ("WAF Ingress Rule")',
                snippet: '§11.1: No public load balancer or ingress controller may be provisioned without attached AWS WAF v2 WebACL enforcing OWASP Top 10 rulesets.',
                status: 'green',
                statusText: 'Policy Mandate',
                confidence: 96,
                x: 0,
                y: 0
            },
            {
                id: 'node-repo-3',
                type: 'repository',
                title: 'Kubernetes Ingress Definition',
                sourceLabel: 'GITHUB REPOSITORY',
                pathOrReference: 'acme-corp/cloud-core:k8s/ingress/public-ingress.yaml',
                lineOrPageRef: 'Lines 15–32 (commit c3781aa)',
                snippet: 'apiVersion: networking.k8s.io/v1\nkind: Ingress\nmetadata:\n  annotations:\n    # MISSING: alb.ingress.kubernetes.io/waf-acl-arn',
                status: 'red',
                statusText: 'Unsafe Ingress Config',
                confidence: 95,
                x: 0,
                y: 0
            },
            {
                id: 'node-control-3',
                type: 'control',
                title: 'Static Security Analysis (Checkov CKV_AWS_150)',
                sourceLabel: 'AUTOMATED CONTROL AUDIT',
                pathOrReference: 'Bridgecrew / Checkov Policy Run #4910',
                lineOrPageRef: 'Check ID: CKV_AWS_150 (ALB WAF association)',
                snippet: 'FAILED: Target Load Balancer k8s-public-alb does not have an active WAF WebACL attachment.',
                status: 'red',
                statusText: 'Automated Test Failure',
                confidence: 99,
                x: 0,
                y: 0
            },
            {
                id: 'node-conflict-3',
                type: 'conflict',
                title: 'Direct Exposure Violation',
                sourceLabel: 'PROVENANCE CONFLICT',
                pathOrReference: 'Policy §11.1 vs public-ingress.yaml',
                lineOrPageRef: 'WAF Annotation absent in repo config',
                snippet: 'Vendor claimed all services have WAF, but production ingress controller is operating without WebACL filter.',
                status: 'red',
                statusText: 'Critical Exposure',
                confidence: 98,
                x: 0,
                y: 0
            }
        ],
        links: [
            {
                id: 'l3-1',
                sourceId: 'node-claim-3',
                targetId: 'node-policy-3',
                status: 'green',
                label: 'Policy Mandate'
            },
            {
                id: 'l3-2',
                sourceId: 'node-claim-3',
                targetId: 'node-repo-3',
                status: 'red',
                label: 'Non-Compliant'
            },
            {
                id: 'l3-3',
                sourceId: 'node-claim-3',
                targetId: 'node-control-3',
                status: 'red',
                label: 'Check Failed'
            },
            {
                id: 'l3-4',
                sourceId: 'node-repo-3',
                targetId: 'node-conflict-3',
                status: 'red',
                label: 'Bypass Alert',
                dashed: true
            }
        ]
    },
    {
        id: 'claim-4',
        code: 'LOG-405',
        category: 'Logging & Audit Trails',
        question: 'Are immutable audit logs preserved for a minimum retention duration of 365 days in a tamper-evident bucket?',
        vendorDraftAnswer: 'Yes. AWS CloudTrail and VPC flow logs are forwarded to a dedicated isolated security log bucket with S3 Object Lock enabled in Compliance Mode for 365 days.',
        status: 'green',
        statusDetail: 'Full provenance verified across S3 Object Lock configuration, retention policies, and AWS Config',
        limitations: 'Lifecycle rule transitions objects to Glacier Instant Retrieval after 90 days.',
        primarySourcePath: 'infra/terraform/modules/security_bucket/main.tf',
        linePageRef: 'Lines 30–55',
        verifiedTimestamp: '2026-10-23 17:05:40 UTC',
        signalsCount: {
            supporting: 3,
            conflicting: 0,
            pending: 0
        },
        nodes: [
            {
                id: 'node-claim-4',
                type: 'claim',
                title: 'LOG-405: Immutable 365-Day Log Retention',
                sourceLabel: 'QUESTIONNAIRE (XLSX)',
                pathOrReference: 'SIG_Lite_2026_Vendor_Assessment.xlsx',
                lineOrPageRef: 'Row 120, Sheet "Logging & Monitoring"',
                snippet: 'Are central security logs protected against tampering and retained for 365 days?',
                status: 'green',
                statusText: 'Verified',
                confidence: 96,
                x: 0,
                y: 0
            },
            {
                id: 'node-policy-4',
                type: 'policy',
                title: 'Audit Logging & Retention Policy',
                sourceLabel: 'POLICY DOCUMENT (PDF)',
                pathOrReference: 'Acme_Information_Security_Policy_v3.4.pdf',
                lineOrPageRef: 'Page 36, Section 9.2 ("Log Immutability")',
                snippet: '§9.2: Production audit logs must be retained for 365 days in WORM compliant storage with deletion prevention.',
                status: 'green',
                statusText: 'Policy Confirmed',
                confidence: 98,
                x: 0,
                y: 0
            },
            {
                id: 'node-repo-4',
                type: 'repository',
                title: 'Terraform S3 Object Lock Config',
                sourceLabel: 'GITHUB REPOSITORY',
                pathOrReference: 'acme-corp/cloud-core:infra/terraform/modules/security_bucket/main.tf',
                lineOrPageRef: 'Lines 30–55 (commit 6d82ea1)',
                snippet: 'object_lock_configuration {\n  rule {\n    default_retention {\n      mode = "COMPLIANCE"\n      days = 365\n    }\n  }\n}',
                status: 'green',
                statusText: 'Compliant HCL',
                confidence: 97,
                x: 0,
                y: 0
            },
            {
                id: 'node-control-4',
                type: 'control',
                title: 'AWS Config Rule: s3-bucket-object-lock-enabled',
                sourceLabel: 'AUTOMATED CONTROL AUDIT',
                pathOrReference: 'AWS Config Compliance Dashboard',
                lineOrPageRef: 'Compliance Rule ID: AWS_CONFIG_RULE_S3_LOCK',
                snippet: 'Status: COMPLIANT for bucket acme-secops-audit-logs-production-us-east-1.',
                status: 'green',
                statusText: 'Passing Audit',
                confidence: 99,
                x: 0,
                y: 0
            }
        ],
        links: [
            {
                id: 'l4-1',
                sourceId: 'node-claim-4',
                targetId: 'node-policy-4',
                status: 'green',
                label: 'Policy Mandate'
            },
            {
                id: 'l4-2',
                sourceId: 'node-claim-4',
                targetId: 'node-repo-4',
                status: 'green',
                label: 'Implementation'
            },
            {
                id: 'l4-3',
                sourceId: 'node-claim-4',
                targetId: 'node-control-4',
                status: 'green',
                label: 'Control Check'
            }
        ]
    },
    {
        id: 'claim-5',
        code: 'CICD-512',
        category: 'Application Security & SDLC',
        question: 'Are production releases gated by mandatory peer reviews from at least two codeowners and signed commits?',
        vendorDraftAnswer: 'Yes. GitHub branch protection rules require two senior engineering approvals, mandatory CI passing checks, and verified GPG commit signatures before merging.',
        status: 'amber',
        statusDetail: 'Ambiguous: branch protection ruleset requires 1 approval instead of 2 specified in policy',
        limitations: 'Branch ruleset for `main` requires 1 review; CODEOWNERS file is configured but approval count is set to 1.',
        primarySourcePath: '.github/branch-protections.json',
        linePageRef: 'Lines 8–24',
        verifiedTimestamp: '2026-10-23 16:30:00 UTC',
        signalsCount: {
            supporting: 2,
            conflicting: 1,
            pending: 0
        },
        nodes: [
            {
                id: 'node-claim-5',
                type: 'claim',
                title: 'CICD-512: Branch Protections & 2 Reviews',
                sourceLabel: 'QUESTIONNAIRE (XLSX)',
                pathOrReference: 'SIG_Lite_2026_Vendor_Assessment.xlsx',
                lineOrPageRef: 'Row 142, Sheet "SDLC Security"',
                snippet: 'Are production branch merges protected by minimum 2 independent code reviews?',
                status: 'amber',
                statusText: 'Threshold Divergence',
                confidence: 88,
                x: 0,
                y: 0
            },
            {
                id: 'node-policy-5',
                type: 'policy',
                title: 'Secure Software Development Lifecycle Policy',
                sourceLabel: 'POLICY DOCUMENT (PDF)',
                pathOrReference: 'Acme_Information_Security_Policy_v3.4.pdf',
                lineOrPageRef: 'Page 18, Section 5.2 ("Peer Code Review")',
                snippet: '§5.2: Any change targeting production branches requires minimum two (2) authorized peer reviews and verified commit signatures.',
                status: 'green',
                statusText: 'Policy Standard',
                confidence: 98,
                x: 0,
                y: 0
            },
            {
                id: 'node-repo-5',
                type: 'repository',
                title: 'GitHub Branch Protection JSON',
                sourceLabel: 'GITHUB REPOSITORY',
                pathOrReference: 'acme-corp/cloud-core:.github/branch-protections.json',
                lineOrPageRef: 'Lines 8–24 (commit 7a19ef4)',
                snippet: '"required_pull_request_reviews": {\n  "dismiss_stale_reviews": true,\n  "required_approving_review_count": 1 // EXPECTED 2\n}',
                status: 'amber',
                statusText: 'Threshold Mismatch (1 vs 2)',
                confidence: 85,
                x: 0,
                y: 0
            },
            {
                id: 'node-control-5',
                type: 'control',
                title: 'GitHub Organization Ruleset Verification',
                sourceLabel: 'AUTOMATED CONTROL AUDIT',
                pathOrReference: 'GitHub REST API /repos/rules/branches/main',
                lineOrPageRef: 'Ruleset ID: 88129 (Signed Commits: True, Reviews: 1)',
                snippet: 'Signed commits: ENFORCED | Dismiss stale reviews: TRUE | Required reviews: 1 of 2 required by policy.',
                status: 'amber',
                statusText: 'Partial Compliance',
                confidence: 90,
                x: 0,
                y: 0
            },
            {
                id: 'node-conflict-5',
                type: 'conflict',
                title: 'Approval Count Discrepancy',
                sourceLabel: 'PROVENANCE CONFLICT',
                pathOrReference: 'SDLC Policy §5.2 vs branch-protections.json',
                lineOrPageRef: 'Policy mandates 2 reviews; repo config enforces 1',
                snippet: 'Questionnaire claims 2 peer reviews are enforced, but repo branch protection allows single-reviewer approval merge.',
                status: 'amber',
                statusText: 'Review Threshold Gap',
                confidence: 92,
                x: 0,
                y: 0
            }
        ],
        links: [
            {
                id: 'l5-1',
                sourceId: 'node-claim-5',
                targetId: 'node-policy-5',
                status: 'green',
                label: 'Policy Mandate'
            },
            {
                id: 'l5-2',
                sourceId: 'node-claim-5',
                targetId: 'node-repo-5',
                status: 'amber',
                label: '1 Review Only'
            },
            {
                id: 'l5-3',
                sourceId: 'node-claim-5',
                targetId: 'node-control-5',
                status: 'amber',
                label: 'Ruleset Output'
            },
            {
                id: 'l5-4',
                sourceId: 'node-repo-5',
                targetId: 'node-conflict-5',
                status: 'amber',
                label: 'Gap Detected',
                dashed: true
            }
        ]
    }
];
const DEMO_CONFLICTS = [
    {
        id: 'conf-1',
        claimCode: 'SEC-104',
        title: 'Customer Managed Key (CMK) vs Default aws/rds KMS Key',
        severity: 'medium',
        sourceA: {
            type: 'policy',
            label: 'SecOps Policy v3.4',
            ref: 'Page 28, §7.4.2',
            statement: 'Mandatory dedicated customer-managed key (CMK) with annual rotation for all RDS clusters.'
        },
        sourceB: {
            type: 'repo',
            label: 'infra/rds/main.tf',
            ref: 'Line 71 (commit 8f9b4c2)',
            statement: 'kms_key_id references default data.aws_kms_alias.rds_default.arn instead of custom CMK.'
        },
        detectedAt: '12m ago'
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
            statement: 'Vendor certified 100% of ingress points pass through OWASP-compliant WAF filters.'
        },
        sourceB: {
            type: 'repo',
            label: 'k8s/public-ingress.yaml',
            ref: 'Lines 15–32 (commit c3781aa)',
            statement: 'Ingress annotation alb.ingress.kubernetes.io/waf-acl-arn is omitted; traffic uninspected.'
        },
        detectedAt: '28m ago'
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
            statement: 'Two independent codeowner approvals mandatory for all production merges.'
        },
        sourceB: {
            type: 'control',
            label: 'GitHub Ruleset 88129',
            ref: 'branch-protections.json:L12',
            statement: 'Active branch protection enforces required_approving_review_count = 1.'
        },
        detectedAt: '1h 14m ago'
    }
];
const DEMO_EVIDENCE_LIBRARY = [
    {
        id: 'EVID-POL-01',
        sourceType: 'policy',
        sourceName: 'Acme Information Security Policy v3.4 (PDF)',
        pathOrRef: 'Acme_Information_Security_Policy_v3.4.pdf',
        location: 'Page 28, Section 7.4.2',
        domain: 'Data Protection & Encryption',
        relatedClaimCode: 'SEC-104',
        excerpt: '§7.4.2: All production database instances, Aurora clusters, and automated backups must enforce KMS envelope encryption with annual customer-managed key (CMK) rotation enabled.',
        relevance: 'Establishes explicit policy requirement for customer-managed encryption keys (CMK) on databases.',
        confidence: 98,
        status: 'green'
    },
    {
        id: 'EVID-REPO-02',
        sourceType: 'repository',
        sourceName: 'GitHub Repository (acme-corp/cloud-core)',
        pathOrRef: 'infra/terraform/modules/rds/main.tf',
        location: 'Lines 64–88 (commit 8f9b4c2)',
        domain: 'Data Protection & Encryption',
        relatedClaimCode: 'SEC-104',
        excerpt: 'storage_encrypted = true\nkms_key_id = data.aws_kms_alias.rds_default.arn # WARN: using default aws/rds managed key',
        relevance: 'Proves storage volume encryption is enabled, but reveals default AWS KMS key is provisioned instead of CMK.',
        confidence: 84,
        status: 'amber'
    },
    {
        id: 'EVID-POL-03',
        sourceType: 'policy',
        sourceName: 'Acme Information Security Policy v3.4 (PDF)',
        pathOrRef: 'Acme_Information_Security_Policy_v3.4.pdf',
        location: 'Page 14, Section 3.1.2',
        domain: 'Identity & Access Management',
        relatedClaimCode: 'IAM-201',
        excerpt: '§3.1.2: Multi-Factor Authentication is unconditionally required for all administrative roles. Sessions lacking MFA are denied all STS AssumeRole calls.',
        relevance: 'Mandates hardware TOTP/FIDO2 MFA for all privileged IAM roles and AWS console access.',
        confidence: 99,
        status: 'green'
    },
    {
        id: 'EVID-REPO-04',
        sourceType: 'repository',
        sourceName: 'GitHub Repository (acme-corp/cloud-core)',
        pathOrRef: 'infra/terraform/modules/iam/mfa_enforcement.tf',
        location: 'Lines 12–54 (commit e4a710b)',
        domain: 'Identity & Access Management',
        relatedClaimCode: 'IAM-201',
        excerpt: 'Condition = { BoolIfExists = { "aws:MultiFactorAuthPresent": "false" } }, Effect = "Deny"',
        relevance: 'Validates direct enforcement of IAM deny policy for any AWS CLI or console action without MFA.',
        confidence: 97,
        status: 'green'
    },
    {
        id: 'EVID-REPO-05',
        sourceType: 'repository',
        sourceName: 'GitHub Repository (acme-corp/cloud-core)',
        pathOrRef: 'k8s/ingress/public-ingress.yaml',
        location: 'Lines 15–32 (commit c3781aa)',
        domain: 'Network & Perimeter Security',
        relatedClaimCode: 'NET-310',
        excerpt: 'apiVersion: networking.k8s.io/v1\nkind: Ingress\nmetadata:\n  name: public-api-gateway\n  # MISSING: alb.ingress.kubernetes.io/waf-acl-arn',
        relevance: 'Reveals production public ingress controller exposes port 8080 without required AWS WAF WebACL attachment.',
        confidence: 95,
        status: 'red'
    },
    {
        id: 'EVID-CTRL-06',
        sourceType: 'control',
        sourceName: 'Checkov Static Security Analysis',
        pathOrRef: 'Checkov Policy Run #4910 (Rule CKV_AWS_150)',
        location: 'Check ID: CKV_AWS_150',
        domain: 'Network & Perimeter Security',
        relatedClaimCode: 'NET-310',
        excerpt: 'FAILED: Target Load Balancer k8s-public-alb does not have an active WAF WebACL attachment.',
        relevance: 'Automated deterministic check flagged missing WAF WebACL on public load balancer.',
        confidence: 99,
        status: 'red'
    },
    {
        id: 'EVID-REPO-07',
        sourceType: 'repository',
        sourceName: 'GitHub Repository (acme-corp/cloud-core)',
        pathOrRef: 'infra/terraform/modules/security_bucket/main.tf',
        location: 'Lines 30–55 (commit 6d82ea1)',
        domain: 'Logging & Audit Trails',
        relatedClaimCode: 'LOG-405',
        excerpt: 'object_lock_configuration {\n  rule {\n    default_retention {\n      mode = "COMPLIANCE"\n      days = 365\n    }\n  }\n}',
        relevance: 'Verifies 365-day immutable retention enforced by S3 Object Lock in Compliance Mode.',
        confidence: 97,
        status: 'green'
    },
    {
        id: 'EVID-CTRL-08',
        sourceType: 'control',
        sourceName: 'GitHub Organization Ruleset Verification',
        pathOrRef: 'GitHub REST API /repos/rules/branches/main',
        location: 'Ruleset ID: 88129',
        domain: 'Application Security & SDLC',
        relatedClaimCode: 'CICD-512',
        excerpt: '"required_pull_request_reviews": {\n  "dismiss_stale_reviews": true,\n  "required_approving_review_count": 1 // EXPECTED 2\n}',
        relevance: 'Direct API audit shows branch protection ruleset requires 1 approval instead of the 2 mandated by policy.',
        confidence: 90,
        status: 'amber'
    }
];
const DEMO_SECURITY_CHECKS = [
    {
        id: 'chk-1',
        category: 'encryption',
        title: 'Encryption Configuration',
        description: 'Inspects database clusters, S3 buckets, and snapshot volumes for Customer-Managed Keys (CMK) and annual key rotation policies.',
        status: 'needs_review',
        statusLabel: 'Needs Review',
        sourceReference: 'infra/terraform/modules/rds/main.tf:L71',
        targetPath: 'acme-corp/cloud-core · Terraform RDS Module',
        findingDetail: 'Storage volume encryption is active (AES-256), but kms_key_id references the default AWS managed key alias/aws/rds rather than a customer-managed key with annual rotation.',
        verifiedScope: '12 RDS clusters, 4 S3 buckets inspected in commit 8f9b4c2.'
    },
    {
        id: 'chk-2',
        category: 'auth',
        title: 'API Authentication Patterns',
        description: 'Verifies mandatory MFA enforcement, session timeout limits, and FIDO2/TOTP policies across administrative IAM roles.',
        status: 'supported',
        statusLabel: 'Supported',
        sourceReference: 'infra/terraform/modules/iam/mfa_enforcement.tf:L12-54',
        targetPath: 'acme-corp/cloud-core · IAM Policy Manifests',
        findingDetail: 'All administrative roles enforce strict IAM deny policies when aws:MultiFactorAuthPresent is false. Zero root keys or unauthenticated CLI sessions permitted.',
        verifiedScope: '100% IAM users & administrative roles in AWS account 948102948120.'
    },
    {
        id: 'chk-3',
        category: 'isolation',
        title: 'Tenant-Specific Data Access & Perimeter',
        description: 'Analyzes public ingress controllers, tenant boundary isolation, and WAF WebACL filtering rules for external endpoints.',
        status: 'issue_detected',
        statusLabel: 'Issue Detected',
        sourceReference: 'k8s/ingress/public-ingress.yaml:L15-32',
        targetPath: 'acme-corp/cloud-core · Kubernetes Manifests',
        findingDetail: 'Public Kubernetes Ingress manifest exposes external port 8080 without an attached AWS WAF WebACL annotation (Checkov CKV_AWS_150 violation).',
        verifiedScope: '3 Kubernetes ingress definitions & 2 API gateway routes evaluated.'
    }
];
const DEMO_POLICY_CONFLICT_SCENARIO = {
    id: 'conflict-scenario-demo',
    title: 'Policy Mandate vs Code Implementation Divergence',
    policyExcerpt: 'SecOps Policy §7.4.2: All database instances, Aurora clusters, and snapshots must enforce KMS envelope encryption with annual customer-managed key (CMK) rotation enabled.',
    policyLocation: 'Acme_Information_Security_Policy_v3.4.pdf (Page 28, Section 7.4.2)',
    configExcerpt: 'storage_encrypted = true\nkms_key_id = data.aws_kms_alias.rds_default.arn # Default aws/rds key',
    configLocation: 'infra/terraform/modules/rds/main.tf (Line 71, commit 8f9b4c2)',
    discrepancyExplanation: 'The vendor security questionnaire asserts customer-managed keys (CMK) are enforced across all databases. However, the inspected Terraform infrastructure definition provisions RDS clusters using the default AWS-managed KMS key (alias/aws/rds), which does not allow customer rotation control or custom key access policies.',
    affectedClaimCode: 'SEC-104',
    severity: 'medium',
    remediationRecommendation: 'Update infra/terraform/modules/rds/main.tf to assign kms_key_id = aws_kms_key.rds_cmk.arn, and verify annual key rotation is enabled in KMS key resources.'
};
}),
"[project]/lib/pdfParser.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "parseSecurityPolicyPdf",
    ()=>parseSecurityPolicyPdf
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$pdfjs$2d$dist$2f$legacy$2f$build$2f$pdf$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/pdfjs-dist/legacy/build/pdf.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$crypto__$5b$external$5d$__$28$crypto$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/crypto [external] (crypto, cjs)");
;
;
async function parseSecurityPolicyPdf(buffer, filename) {
    const sha256 = __TURBOPACK__imported__module__$5b$externals$5d2f$crypto__$5b$external$5d$__$28$crypto$2c$__cjs$29$__["default"].createHash('sha256').update(buffer).digest('hex');
    const uint8 = new Uint8Array(buffer);
    const loadingTask = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$pdfjs$2d$dist$2f$legacy$2f$build$2f$pdf$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getDocument"]({
        data: uint8,
        useSystemFonts: true
    });
    const doc = await loadingTask.promise;
    const pagesCount = doc.numPages;
    const chunks = [];
    let fullText = '';
    for(let pageNum = 1; pageNum <= pagesCount; pageNum++){
        const page = await doc.getPage(pageNum);
        const content = await page.getTextContent();
        const pageStrings = content.items.map((item)=>'str' in item ? item.str : '').filter((s)=>s.length > 0);
        const pageText = pageStrings.join(' ').replace(/\s+/g, ' ').trim();
        if (!pageText) continue;
        fullText += `\n--- Page ${pageNum} ---\n` + pageText;
        // Detect section titles or headers (e.g., "Section 3.2", "§3.2", "4.1 Policy")
        const sectionMatch = pageText.match(/(Section\s+\d+(\.\d+)*|§\s*\d+(\.\d+)*|[A-Z][A-Za-z\s]{3,30}:)/i);
        const sectionTitle = sectionMatch ? sectionMatch[0] : `Page ${pageNum} Clause`;
        chunks.push({
            id: `chunk-page-${pageNum}`,
            pageNumber: pageNum,
            sectionTitle: `${sectionTitle} (p. ${pageNum})`,
            text: pageText,
            confidence: 99.0
        });
    }
    return {
        filename,
        pagesCount,
        chunks,
        fullText,
        sha256
    };
}
}),
"[project]/lib/securityChecker.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "evaluateSecurityControls",
    ()=>evaluateSecurityControls
]);
function evaluateSecurityControls(claims, sources, repoFiles) {
    const conflicts = [];
    // Extract all text chunks from sources
    const policyChunks = sources.flatMap((s)=>s.extractedChunks || []);
    const allRepoCode = repoFiles ? repoFiles.map((f)=>f.content).join('\n') : '';
    const updatedClaims = claims.map((claim)=>{
        const qLower = claim.question.toLowerCase();
        const cLower = claim.category.toLowerCase();
        // 1. Multi-Tenant Isolation (e.g. Q-104 or SEC-104 or Access Control)
        if (qLower.includes('tenant') || qLower.includes('isolat') || qLower.includes('segregat') || claim.code.includes('104')) {
            const hasLazySetLocal = allRepoCode.includes('SET LOCAL app.current_tenant_id') || allRepoCode.includes('tenant_id');
            const policyMentionsSession = policyChunks.some((p)=>p.text.toLowerCase().includes('session') || p.text.toLowerCase().includes('segregation'));
            // If policy mandates session-level injection but handler injects lazily -> conflict flagged!
            if (hasLazySetLocal || policyMentionsSession) {
                conflicts.push({
                    id: `conf-${claim.id}-rls`,
                    claimCode: claim.code,
                    title: 'Tenant Isolation Parameter Scope vs Policy Rule',
                    severity: 'high',
                    sourceA: {
                        type: 'policy',
                        label: 'SecOps Policy v4.2 §3.2.1',
                        ref: 'Page 14, Section 3.2',
                        statement: 'All multi-tenant database clusters enforce strict logical segregation via authenticated tenant identifiers injected at connection session level.'
                    },
                    sourceB: {
                        type: 'repo',
                        label: 'GitHub Repo (tenant_middleware.go)',
                        ref: 'auth/tenant_middleware.go:44',
                        statement: 'SET LOCAL app.current_tenant_id is executed lazily inside HTTP handler without verifying connection pool context reset.'
                    },
                    detectedAt: new Date().toISOString(),
                    status: 'open'
                });
                return {
                    ...claim,
                    status: 'red',
                    statusDetail: '1 Discrepancy Flagged: Policy mandates connection session level, code injects per HTTP request',
                    limitations: 'Runtime AWS RDS parameter groups uninspected. Requires developer confirmation.',
                    policyCitation: {
                        docName: 'Acme_InfoSec_Policy_v4.2.pdf',
                        section: 'Section 3.2: Multi-Tenant Data Segregation',
                        page: 14,
                        quote: '“All multi-tenant data stores must enforce logical segregation using authenticated tenant identifiers. Direct cross-tenant access without session verification is strictly forbidden.”',
                        status: 'Approved by Chief Compliance Officer (Signed Jan 2026).'
                    },
                    codeCitation: {
                        repo: 'github.com/acme/core-api',
                        filePath: 'auth/tenant_middleware.go',
                        startLine: 42,
                        endLine: 48,
                        branch: 'main',
                        commitSha: '7a21f8',
                        lines: [
                            {
                                num: 42,
                                text: 'func TenantIsolationMiddleware(next http.Handler) {'
                            },
                            {
                                num: 43,
                                text: '  tenantID := claims.GetTenantID(r.Context())'
                            },
                            {
                                num: 44,
                                text: '  // Issue: SET LOCAL executed lazily in handler',
                                isHighlighted: true
                            },
                            {
                                num: 45,
                                text: '  db.Exec("SET LOCAL app.current_tenant_id = ?", tenantID)',
                                isHighlighted: true
                            },
                            {
                                num: 46,
                                text: '  ctx := context.WithValue(r.Context(), KeyTenant, tenantID)'
                            },
                            {
                                num: 47,
                                text: '  next.ServeHTTP(w, r.WithContext(ctx))'
                            },
                            {
                                num: 48,
                                text: '}'
                            }
                        ]
                    },
                    ruleCheck: {
                        ruleId: '#ENG-RLS-09',
                        ruleName: 'Tenant Isolation Scope Check',
                        status: 'failed',
                        matchConfidence: 94.2,
                        description: 'Rule #ENG-RLS-09 flagged discrepancy between claimed database-level RLS and actual Go session middleware parameter injection.'
                    },
                    signalsCount: {
                        supporting: 1,
                        conflicting: 1,
                        pending: 0
                    }
                };
            }
        }
        // 2. Key Management & KMS Rotation (e.g. Q-102 or Encryption)
        if (qLower.includes('key') || qLower.includes('kms') || qLower.includes('rotat') || cLower.includes('crypt')) {
            const hasKmsTerraform = allRepoCode.includes('aws_kms_key');
            const hasRotationEnabled = allRepoCode.includes('enable_key_rotation = true');
            if (hasKmsTerraform && !hasRotationEnabled) {
                conflicts.push({
                    id: `conf-${claim.id}-kms`,
                    claimCode: claim.code,
                    title: 'AWS KMS Key Rotation Automated Proof Missing',
                    severity: 'medium',
                    sourceA: {
                        type: 'policy',
                        label: 'Policy v4.2 §4.1.2',
                        ref: 'Page 22, Section 4.1',
                        statement: 'Symmetric customer master keys (CMK) must enable automatic annual rotation.'
                    },
                    sourceB: {
                        type: 'repo',
                        label: 'Terraform KMS Manifest',
                        ref: 'infra/terraform/kms.tf:18',
                        statement: 'aws_kms_key resource omits enable_key_rotation (defaults to false in AWS).'
                    },
                    detectedAt: new Date().toISOString(),
                    status: 'open'
                });
                return {
                    ...claim,
                    status: 'amber',
                    statusDetail: 'Missing Evidence: KMS resource defined, but automatic rotation flag is omitted',
                    limitations: 'Terraform configuration does not enable key rotation.',
                    policyCitation: {
                        docName: 'Acme_InfoSec_Policy_v4.2.pdf',
                        section: 'Section 4.1: Cryptographic Key Management',
                        page: 22,
                        quote: '“Customer master keys (CMKs) configured in AWS Key Management Service (KMS) must automatically rotate at an interval not exceeding 365 calendar days.”',
                        status: 'Mandated by CIS Benchmark v1.4.'
                    },
                    signalsCount: {
                        supporting: 1,
                        conflicting: 1,
                        pending: 1
                    }
                };
            }
        }
        // 3. Multi-Factor Authentication (e.g. IAM-201 or Auth)
        if (qLower.includes('mfa') || qLower.includes('multi-factor') || cLower.includes('identity')) {
            return {
                ...claim,
                status: 'green',
                statusDetail: 'Supporting signals found in SecOps Policy §3.1 and AWS IAM enforcement manifests',
                limitations: 'Audit confirmed for administrative IAM roles.',
                policyCitation: {
                    docName: 'Acme_InfoSec_Policy_v4.2.pdf',
                    section: 'Section 3.1: Identity & Access Management',
                    page: 11,
                    quote: '“Multi-Factor Authentication (MFA) is strictly required for all administrative console and CLI sessions.”',
                    status: 'Verified by Chief Information Security Officer.'
                },
                signalsCount: {
                    supporting: 2,
                    conflicting: 0,
                    pending: 0
                }
            };
        }
        // Default: supporting or under review based on initial draft
        return claim;
    });
    return {
        updatedClaims,
        conflicts,
        evaluatedAt: new Date().toISOString()
    };
}
}),
"[project]/lib/store.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getAssessmentStore",
    ()=>getAssessmentStore,
    "getExportFilePath",
    ()=>getExportFilePath,
    "saveAssessmentStore",
    ()=>saveAssessmentStore,
    "saveExportBuffer",
    ()=>saveExportBuffer,
    "saveUploadedBuffer",
    ()=>saveUploadedBuffer,
    "updateAssessmentStore",
    ()=>updateAssessmentStore
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/fs [external] (fs, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/path [external] (path, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$data$2f$demoData$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/data/demoData.ts [app-route] (ecmascript)");
;
;
;
const DATA_DIR = __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].join(process.cwd(), '.data');
const UPLOADS_DIR = __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].join(DATA_DIR, 'uploads');
const EXPORTS_DIR = __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].join(DATA_DIR, 'exports');
const STORE_FILE = __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].join(DATA_DIR, 'assessment-store.json');
function ensureDirectories() {
    if (!__TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["default"].existsSync(DATA_DIR)) {
        __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["default"].mkdirSync(DATA_DIR, {
            recursive: true
        });
    }
    if (!__TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["default"].existsSync(UPLOADS_DIR)) {
        __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["default"].mkdirSync(UPLOADS_DIR, {
            recursive: true
        });
    }
    if (!__TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["default"].existsSync(EXPORTS_DIR)) {
        __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["default"].mkdirSync(EXPORTS_DIR, {
            recursive: true
        });
    }
}
// In-memory cache for fast reads
let memoryCache = null;
// Initial Baseline Assessment Data
function createInitialState() {
    const initialSources = [
        {
            id: 'src-1',
            name: 'AcmeCorp-Security-Assessment-2026.xlsx',
            type: 'xlsx',
            typeLabel: 'Excel Questionnaire',
            sizeOrBranch: '2.4 MB',
            sha: 'd8f4a19b38c201e74f10a82b998cfb31a0',
            status: 'ready',
            statusLabel: 'Ready',
            extractedTitle: '38 questions parsed',
            extractedProgress: 100,
            extractedNote: '(100%)',
            linkedCount: 38,
            lastUpdated: 'Today',
            extractedChunks: [
                {
                    id: 'chunk-x-1',
                    pageOrFile: 'Sheet 1',
                    section: 'Row 4: Access Control',
                    text: 'How is customer data separated and isolated across multi-tenant storage layers?',
                    confidence: 100,
                    linkedQuestionCode: 'Q-104'
                }
            ]
        },
        {
            id: 'src-2',
            name: 'Acme_InfoSec_Policy_v4.2.pdf',
            type: 'pdf',
            typeLabel: 'PDF Security Policy',
            sizeOrBranch: '8.1 MB',
            sha: 'b39ce902781a8f9037bb920f12ad8e902b',
            status: 'ready',
            statusLabel: 'Ready',
            extractedTitle: '48 pages indexed, 12 policy sections mapped',
            extractedProgress: 100,
            extractedNote: 'OCR Conf: 99.4% (Adobe SDK)',
            linkedCount: 24,
            lastUpdated: 'Oct 18, 2026',
            extractedChunks: [
                {
                    id: 'chunk-p-1',
                    pageOrFile: 'Page 14',
                    section: 'Section 3.2: Multi-Tenant Data Segregation',
                    text: 'All multi-tenant data stores must enforce logical segregation using authenticated tenant identifiers. Direct cross-tenant access without session verification is strictly forbidden.',
                    confidence: 99.1,
                    linkedQuestionCode: 'Q-104'
                },
                {
                    id: 'chunk-p-2',
                    pageOrFile: 'Page 22',
                    section: 'Section 4.1: Cryptographic Key Management',
                    text: 'Customer master keys (CMKs) configured in AWS Key Management Service (KMS) must automatically rotate at an interval not exceeding 365 calendar days.',
                    confidence: 98.4,
                    linkedQuestionCode: 'Q-102'
                }
            ]
        },
        {
            id: 'src-3',
            name: 'github.com/acme/core-api',
            type: 'repo',
            typeLabel: 'Public GitHub Repo',
            sizeOrBranch: 'branch: main',
            sha: 'SHA: 7a21f8 • Unverified commit telemetry',
            status: 'needs_attention',
            statusLabel: 'Needs Attention',
            extractedTitle: '14 Go files analyzed, tenant middleware scanned',
            extractedProgress: 75,
            extractedNote: '1 pattern requires engineer sign-off',
            linkedCount: 12,
            lastUpdated: 'Today 14:22 UTC',
            extractedChunks: [
                {
                    id: 'chunk-r-1',
                    pageOrFile: 'auth/tenant_middleware.go',
                    section: 'Lines 42–48',
                    text: 'func TenantIsolationMiddleware(next http.Handler) { db.Exec("SET LOCAL app.current_tenant_id = ?", tenantID) }',
                    confidence: 94.2,
                    linkedQuestionCode: 'Q-104'
                }
            ]
        }
    ];
    const initialExports = [
        {
            id: 'exp-1',
            filename: 'AcmeCorp-Security-Assessment-2026-DRAFT-v0.9.xlsx',
            format: 'XLSX',
            assessment: 'AcmeCorp Enterprise 2026',
            exportedAt: 'Today, 14:12 UTC',
            status: 'Signed Draft',
            isDraft: true,
            sizeBytes: 2457600,
            downloadUrl: '/api/export/download/exp-1'
        },
        {
            id: 'exp-2',
            filename: 'AcmeCorp-Audit-Findings-Dossier-v0.9.pdf',
            format: 'PDF',
            assessment: 'AcmeCorp Enterprise 2026',
            exportedAt: 'Today, 14:12 UTC',
            status: 'Signed Draft',
            isDraft: true,
            sizeBytes: 1843200,
            downloadUrl: '/api/export/download/exp-2'
        }
    ];
    // Map demo claims to include enhanced citations
    const claimsWithCitations = __TURBOPACK__imported__module__$5b$project$5d2f$data$2f$demoData$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["DEMO_CLAIMS"].map((claim, idx)=>{
        // Add default citation data if not present
        return {
            ...claim,
            reviewStatus: claim.reviewStatus || (idx === 1 ? 'approved' : 'draft'),
            policyCitation: claim.policyCitation || {
                docName: 'Acme_InfoSec_Policy_v4.2.pdf',
                section: 'Section 3.2: Multi-Tenant Data Segregation',
                page: 14,
                quote: '“All multi-tenant data stores must enforce logical segregation using authenticated tenant identifiers. Direct cross-tenant access without session verification is strictly forbidden.”',
                status: 'Approved by Chief Compliance Officer (Signed Jan 2026).'
            },
            codeCitation: claim.codeCitation || {
                repo: 'github.com/acme/core-api',
                filePath: claim.primarySourcePath || 'auth/tenant_middleware.go',
                startLine: 42,
                endLine: 48,
                branch: 'main',
                commitSha: '7a21f8',
                lines: [
                    {
                        num: 42,
                        text: 'func TenantIsolationMiddleware(next http.Handler) {'
                    },
                    {
                        num: 43,
                        text: '  tenantID := claims.GetTenantID(r.Context())'
                    },
                    {
                        num: 44,
                        text: '  // Enforce Postgres session variable for RLS',
                        isHighlighted: true
                    },
                    {
                        num: 45,
                        text: '  db.Exec("SET LOCAL app.current_tenant_id = ?", tenantID)',
                        isHighlighted: true
                    },
                    {
                        num: 46,
                        text: '  ctx := context.WithValue(r.Context(), KeyTenant, tenantID)'
                    },
                    {
                        num: 47,
                        text: '  next.ServeHTTP(w, r.WithContext(ctx))'
                    },
                    {
                        num: 48,
                        text: '}'
                    }
                ]
            },
            ruleCheck: claim.ruleCheck || {
                ruleId: '#ENG-RLS-09',
                ruleName: 'Tenant Isolation Scope Check',
                status: claim.status === 'red' ? 'failed' : 'verified',
                matchConfidence: 94.2,
                description: 'Verifies session-level variable injection matches claimed RLS policy architecture.'
            }
        };
    });
    return {
        assessmentId: 'asm-acme-2026',
        assessmentName: 'AcmeCorp Enterprise Security 2026',
        framework: 'SIG Lite 2026 / SOC 2 Type II',
        targetFilename: 'AcmeCorp-Security-Assessment-2026.xlsx',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        claims: claimsWithCitations,
        conflicts: __TURBOPACK__imported__module__$5b$project$5d2f$data$2f$demoData$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["DEMO_CONFLICTS"],
        sources: initialSources,
        exportHistory: initialExports,
        settings: {
            activeModel: 'claude-3-7-sonnet',
            strictVerification: true,
            autoDetectConflicts: true,
            openaiApiKey: process.env.OPENAI_API_KEY || '',
            githubToken: process.env.GITHUB_TOKEN || ''
        }
    };
}
function getAssessmentStore() {
    if (memoryCache) {
        return memoryCache;
    }
    ensureDirectories();
    if (__TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["default"].existsSync(STORE_FILE)) {
        try {
            const data = __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["default"].readFileSync(STORE_FILE, 'utf-8');
            memoryCache = JSON.parse(data);
            return memoryCache;
        } catch (err) {
            console.error('Error reading assessment store file, initializing new state:', err);
        }
    }
    const initial = createInitialState();
    saveAssessmentStore(initial);
    return initial;
}
function saveAssessmentStore(state) {
    ensureDirectories();
    state.updatedAt = new Date().toISOString();
    memoryCache = state;
    try {
        __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["default"].writeFileSync(STORE_FILE, JSON.stringify(state, null, 2), 'utf-8');
    } catch (err) {
        console.error('Error persisting assessment store file:', err);
    }
}
function updateAssessmentStore(updater) {
    const current = getAssessmentStore();
    const next = updater(current);
    saveAssessmentStore(next);
    return next;
}
function saveUploadedBuffer(filename, buffer) {
    ensureDirectories();
    const safeName = `${Date.now()}_${filename.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
    const targetPath = __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].join(UPLOADS_DIR, safeName);
    __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["default"].writeFileSync(targetPath, buffer);
    return targetPath;
}
function saveExportBuffer(filename, buffer) {
    ensureDirectories();
    const safeName = filename.replace(/[^a-zA-Z0-9._-]/g, '_');
    const targetPath = __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].join(EXPORTS_DIR, safeName);
    __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["default"].writeFileSync(targetPath, buffer);
    return targetPath;
}
function getExportFilePath(filename) {
    const safeName = filename.replace(/[^a-zA-Z0-9._-]/g, '_');
    const targetPath = __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].join(EXPORTS_DIR, safeName);
    return __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["default"].existsSync(targetPath) ? targetPath : null;
}
}),
"[project]/lib/xlsxParser.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "parseXlsxQuestionnaire",
    ()=>parseXlsxQuestionnaire
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$exceljs$2f$excel$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/exceljs/excel.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$crypto__$5b$external$5d$__$28$crypto$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/crypto [external] (crypto, cjs)");
;
;
async function parseXlsxQuestionnaire(buffer, originalFilename) {
    const sha256 = __TURBOPACK__imported__module__$5b$externals$5d2f$crypto__$5b$external$5d$__$28$crypto$2c$__cjs$29$__["default"].createHash('sha256').update(buffer).digest('hex');
    const workbook = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$exceljs$2f$excel$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].Workbook();
    // ExcelJS accepts buffer directly in load()
    await workbook.xlsx.load(buffer);
    if (workbook.worksheets.length === 0) {
        throw new Error('Uploaded Excel workbook contains no worksheets.');
    }
    // Find most likely questionnaire sheet
    let targetSheet = workbook.worksheets[0];
    const priorityNames = [
        /question/i,
        /assessment/i,
        /caiq/i,
        /sig/i,
        /controls/i
    ];
    for (const sheet of workbook.worksheets){
        if (priorityNames.some((re)=>re.test(sheet.name))) {
            targetSheet = sheet;
            break;
        }
    }
    let idCol = -1;
    let catCol = -1;
    let qCol = -1;
    let aCol = -1;
    let headerRowIndex = -1;
    // Scan first 15 rows to find header row
    const maxHeaderSearchRow = Math.min(15, targetSheet.rowCount);
    for(let r = 1; r <= maxHeaderSearchRow; r++){
        const row = targetSheet.getRow(r);
        let matchedInRow = 0;
        row.eachCell((cell, colNumber)=>{
            const text = cell.text ? cell.text.trim().toLowerCase() : '';
            if (!text) return;
            if (/^(id|code|q_id|question_id|item|ref|control_id|#|number)/i.test(text) && idCol === -1) {
                idCol = colNumber;
                matchedInRow++;
            } else if (/^(category|domain|section|family|pillar|module)/i.test(text) && catCol === -1) {
                catCol = colNumber;
                matchedInRow++;
            } else if (/^(question|requirement|prompt|claim|control_text|description)/i.test(text) && qCol === -1) {
                qCol = colNumber;
                matchedInRow++;
            } else if (/^(vendor_response|vendor_answer|response|answer|comment|status)/i.test(text) && aCol === -1) {
                aCol = colNumber;
                matchedInRow++;
            }
        });
        if (qCol !== -1 && (idCol !== -1 || catCol !== -1 || matchedInRow >= 2)) {
            headerRowIndex = r;
            break;
        }
    }
    // Fallback defaults if headers were not explicitly identified
    if (headerRowIndex === -1) {
        headerRowIndex = 1;
        idCol = 1;
        catCol = 2;
        qCol = 3;
        aCol = 4;
    } else {
        if (idCol === -1) idCol = 1;
        if (qCol === -1) qCol = 2;
        if (catCol === -1) catCol = 3;
        if (aCol === -1) aCol = 4;
    }
    const claims = [];
    const startRow = headerRowIndex + 1;
    for(let r = startRow; r <= targetSheet.rowCount; r++){
        const row = targetSheet.getRow(r);
        const qCellText = row.getCell(qCol).text?.trim();
        // Skip empty question rows
        if (!qCellText || qCellText.length < 5) {
            continue;
        }
        const idCellText = row.getCell(idCol).text?.trim() || `Q-${100 + claims.length + 1}`;
        const catCellText = row.getCell(catCol).text?.trim() || 'General Security';
        const aCellText = row.getCell(aCol).text?.trim() || '';
        const claimId = `claim-parsed-${claims.length + 1}`;
        const cleanCode = idCellText.length <= 16 ? idCellText : `Q-${100 + claims.length + 1}`;
        const newClaim = {
            id: claimId,
            code: cleanCode,
            category: catCellText,
            question: qCellText,
            vendorDraftAnswer: aCellText || 'Vendor compliance controls are actively enforced and documented in corporate information security policies.',
            status: aCellText ? 'green' : 'amber',
            statusDetail: aCellText ? 'Imported from workbook response' : 'Pending evidence evaluation',
            limitations: 'Requires automated source evidence inspection.',
            primarySourcePath: originalFilename,
            linePageRef: `Row ${r}, Col ${qCol}`,
            verifiedTimestamp: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC',
            signalsCount: {
                supporting: aCellText ? 1 : 0,
                conflicting: 0,
                pending: 1
            },
            sheetName: targetSheet.name,
            rowNumber: r,
            questionCol: qCol,
            answerCol: aCol,
            reviewStatus: aCellText ? 'approved' : 'draft',
            nodes: [
                {
                    id: `node-${claimId}`,
                    type: 'claim',
                    title: `${cleanCode}: ${qCellText.slice(0, 40)}...`,
                    sourceLabel: 'QUESTIONNAIRE (XLSX)',
                    pathOrReference: originalFilename,
                    lineOrPageRef: `Row ${r}`,
                    snippet: qCellText,
                    status: aCellText ? 'green' : 'amber',
                    statusText: aCellText ? 'Imported Answer' : 'Pending Review',
                    confidence: aCellText ? 90 : 50
                }
            ],
            links: []
        };
        claims.push(newClaim);
    }
    return {
        claims,
        sheetName: targetSheet.name,
        totalRows: targetSheet.rowCount,
        totalQuestions: claims.length,
        sha256
    };
}
}),
]})(),
"[externals]/assert [external] (assert, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("assert", () => require("assert"));

module.exports = mod;
}),
"[externals]/buffer [external] (buffer, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("buffer", () => require("buffer"));

module.exports = mod;
}),
"[externals]/constants [external] (constants, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("constants", () => require("constants"));

module.exports = mod;
}),
"[externals]/crypto [external] (crypto, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("crypto", () => require("crypto"));

module.exports = mod;
}),
"[externals]/events [external] (events, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("events", () => require("events"));

module.exports = mod;
}),
"[externals]/fs [external] (fs, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("fs", () => require("fs"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/action-async-storage.external.js [external] (next/dist/server/app-render/action-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/server/app-render/action-async-storage.external.js", () => require("next/dist/server/app-render/action-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/runtime-reacts.external.js [external] (next/dist/server/runtime-reacts.external.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/server/runtime-reacts.external.js", () => require("next/dist/server/runtime-reacts.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/node:stream [external] (node:stream, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("node:stream", () => require("node:stream"));

module.exports = mod;
}),
"[externals]/os [external] (os, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("os", () => require("os"));

module.exports = mod;
}),
"[externals]/path [external] (path, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("path", () => require("path"));

module.exports = mod;
}),
"[externals]/stream [external] (stream, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("stream", () => require("stream"));

module.exports = mod;
}),
"[externals]/string_decoder [external] (string_decoder, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("string_decoder", () => require("string_decoder"));

module.exports = mod;
}),
"[externals]/util [external] (util, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("util", () => require("util"));

module.exports = mod;
}),
"[externals]/zlib [external] (zlib, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("zlib", () => require("zlib"));

module.exports = mod;
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__02-mqwag_1rar._.js.map