import fs from 'fs';
import path from 'path';
import type {
  AssessmentState,
  SecurityClaim,
  ConflictItem,
  EvidenceSourceFile,
  ExportDeliverable,
  AppSettings,
} from '@/types/claimtrail';
import { DEMO_CLAIMS, DEMO_CONFLICTS } from '@/data/demoData';

const DATA_DIR = path.join(process.cwd(), '.data');
const UPLOADS_DIR = path.join(DATA_DIR, 'uploads');
const EXPORTS_DIR = path.join(DATA_DIR, 'exports');
const STORE_FILE = path.join(DATA_DIR, 'assessment-store.json');

function ensureDirectories() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(UPLOADS_DIR)) {
    fs.mkdirSync(UPLOADS_DIR, { recursive: true });
  }
  if (!fs.existsSync(EXPORTS_DIR)) {
    fs.mkdirSync(EXPORTS_DIR, { recursive: true });
  }
}

// In-memory cache for fast reads
let memoryCache: AssessmentState | null = null;

// Initial Baseline Assessment Data
function createInitialState(): AssessmentState {
  const initialSources: EvidenceSourceFile[] = [
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
          linkedQuestionCode: 'Q-104',
        },
      ],
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
          linkedQuestionCode: 'Q-104',
        },
        {
          id: 'chunk-p-2',
          pageOrFile: 'Page 22',
          section: 'Section 4.1: Cryptographic Key Management',
          text: 'Customer master keys (CMKs) configured in AWS Key Management Service (KMS) must automatically rotate at an interval not exceeding 365 calendar days.',
          confidence: 98.4,
          linkedQuestionCode: 'Q-102',
        },
      ],
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
          linkedQuestionCode: 'Q-104',
        },
      ],
    },
  ];

  const initialExports: ExportDeliverable[] = [
    {
      id: 'exp-1',
      filename: 'AcmeCorp-Security-Assessment-2026-DRAFT-v0.9.xlsx',
      format: 'XLSX',
      assessment: 'AcmeCorp Enterprise 2026',
      exportedAt: 'Today, 14:12 UTC',
      status: 'Signed Draft',
      isDraft: true,
      sizeBytes: 2457600,
      downloadUrl: '/api/export/download/exp-1',
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
      downloadUrl: '/api/export/download/exp-2',
    },
  ];

  // Map demo claims to include enhanced citations
  const claimsWithCitations: SecurityClaim[] = DEMO_CLAIMS.map((claim, idx) => {
    // Add default citation data if not present
    return {
      ...claim,
      reviewStatus: claim.reviewStatus || (idx === 1 ? 'approved' : 'draft'),
      policyCitation: claim.policyCitation || {
        docName: 'Acme_InfoSec_Policy_v4.2.pdf',
        section: 'Section 3.2: Multi-Tenant Data Segregation',
        page: 14,
        quote:
          '“All multi-tenant data stores must enforce logical segregation using authenticated tenant identifiers. Direct cross-tenant access without session verification is strictly forbidden.”',
        status: 'Approved by Chief Compliance Officer (Signed Jan 2026).',
      },
      codeCitation: claim.codeCitation || {
        repo: 'github.com/acme/core-api',
        filePath: claim.primarySourcePath || 'auth/tenant_middleware.go',
        startLine: 42,
        endLine: 48,
        branch: 'main',
        commitSha: '7a21f8',
        lines: [
          { num: 42, text: 'func TenantIsolationMiddleware(next http.Handler) {' },
          { num: 43, text: '  tenantID := claims.GetTenantID(r.Context())' },
          { num: 44, text: '  // Enforce Postgres session variable for RLS', isHighlighted: true },
          { num: 45, text: '  db.Exec("SET LOCAL app.current_tenant_id = ?", tenantID)', isHighlighted: true },
          { num: 46, text: '  ctx := context.WithValue(r.Context(), KeyTenant, tenantID)' },
          { num: 47, text: '  next.ServeHTTP(w, r.WithContext(ctx))' },
          { num: 48, text: '}' },
        ],
      },
      ruleCheck: claim.ruleCheck || {
        ruleId: '#ENG-RLS-09',
        ruleName: 'Tenant Isolation Scope Check',
        status: claim.status === 'red' ? 'failed' : 'verified',
        matchConfidence: 94.2,
        description: 'Verifies session-level variable injection matches claimed RLS policy architecture.',
      },
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
    conflicts: DEMO_CONFLICTS,
    sources: initialSources,
    exportHistory: initialExports,
    settings: {
      activeModel: 'claude-3-7-sonnet',
      strictVerification: true,
      autoDetectConflicts: true,
      openaiApiKey: process.env.OPENAI_API_KEY || '',
      githubToken: process.env.GITHUB_TOKEN || '',
    },
  };
}

export function getAssessmentStore(): AssessmentState {
  if (memoryCache) {
    return memoryCache;
  }

  ensureDirectories();

  if (fs.existsSync(STORE_FILE)) {
    try {
      const data = fs.readFileSync(STORE_FILE, 'utf-8');
      memoryCache = JSON.parse(data) as AssessmentState;
      return memoryCache;
    } catch (err) {
      console.error('Error reading assessment store file, initializing new state:', err);
    }
  }

  const initial = createInitialState();
  saveAssessmentStore(initial);
  return initial;
}

export function saveAssessmentStore(state: AssessmentState): void {
  ensureDirectories();
  state.updatedAt = new Date().toISOString();
  memoryCache = state;
  try {
    fs.writeFileSync(STORE_FILE, JSON.stringify(state, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error persisting assessment store file:', err);
  }
}

export function updateAssessmentStore(
  updater: (prev: AssessmentState) => AssessmentState
): AssessmentState {
  const current = getAssessmentStore();
  const next = updater(current);
  saveAssessmentStore(next);
  return next;
}

export function saveUploadedBuffer(filename: string, buffer: Buffer): string {
  ensureDirectories();
  const safeName = `${Date.now()}_${filename.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
  const targetPath = path.join(UPLOADS_DIR, safeName);
  fs.writeFileSync(targetPath, buffer);
  return targetPath;
}

export function saveExportBuffer(filename: string, buffer: Buffer): string {
  ensureDirectories();
  const safeName = filename.replace(/[^a-zA-Z0-9._-]/g, '_');
  const targetPath = path.join(EXPORTS_DIR, safeName);
  fs.writeFileSync(targetPath, buffer);
  return targetPath;
}

export function getExportFilePath(filename: string): string | null {
  const safeName = filename.replace(/[^a-zA-Z0-9._-]/g, '_');
  const targetPath = path.join(EXPORTS_DIR, safeName);
  return fs.existsSync(targetPath) ? targetPath : null;
}

const REPO_CACHE_DIR = path.join(DATA_DIR, 'repo-cache');

export function saveRepoInspectionCache(key: string, data: any): void {
  ensureDirectories();
  if (!fs.existsSync(REPO_CACHE_DIR)) {
    fs.mkdirSync(REPO_CACHE_DIR, { recursive: true });
  }
  const safeKey = key.replace(/[^a-zA-Z0-9_-]/g, '_');
  const cachePath = path.join(REPO_CACHE_DIR, `${safeKey}.json`);
  fs.writeFileSync(cachePath, JSON.stringify(data, null, 2), 'utf-8');
}

export function getRepoInspectionCache(key: string): any | null {
  const safeKey = key.replace(/[^a-zA-Z0-9_-]/g, '_');
  const cachePath = path.join(REPO_CACHE_DIR, `${safeKey}.json`);
  if (fs.existsSync(cachePath)) {
    try {
      return JSON.parse(fs.readFileSync(cachePath, 'utf-8'));
    } catch {
      return null;
    }
  }
  return null;
}

export function sanitizeSettingsForClient(settings: AppSettings): AppSettings {
  return {
    ...settings,
    githubToken: settings.githubToken ? '••••••••' : '',
    openaiApiKey: settings.openaiApiKey ? '••••••••' : '',
  };
}

export function sanitizeStateForClient(state: AssessmentState): AssessmentState {
  return {
    ...state,
    settings: sanitizeSettingsForClient(state.settings),
  };
}
