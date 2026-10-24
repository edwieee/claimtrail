export type EvidenceStatus = 'green' | 'amber' | 'red';

export type NodeType = 'claim' | 'policy' | 'repository' | 'control' | 'conflict';

export interface EvidenceNode {
  id: string;
  type: NodeType;
  title: string;
  sourceLabel: string;
  pathOrReference: string;
  lineOrPageRef: string;
  snippet?: string;
  status: EvidenceStatus;
  statusText: string;
  confidence: number;
  metadata?: Record<string, string>;
  x?: number;
  y?: number;
}

export interface EvidenceLink {
  id: string;
  sourceId: string;
  targetId: string;
  status: EvidenceStatus;
  label?: string;
  dashed?: boolean;
}

export interface SecurityClaim {
  id: string;
  code: string; // e.g. "SEC-104" or "Q-104"
  category: string; // e.g. "Data Protection & Encryption"
  question: string;
  vendorDraftAnswer: string;
  status: EvidenceStatus;
  statusDetail: string;
  limitations: string;
  primarySourcePath: string;
  linePageRef: string;
  verifiedTimestamp: string;
  signalsCount: {
    supporting: number;
    conflicting: number;
    pending: number;
  };
  nodes: EvidenceNode[];
  links: EvidenceLink[];
  reviewStatus?: 'draft' | 'approved' | 'needs_review';
  answerDraft?: string;
  answerConfidence?: number;
  // Location in original spreadsheet
  sheetName?: string;
  rowNumber?: number;
  questionCol?: number;
  answerCol?: number;
  comments?: string;
  notes?: string;
  // Specific code/policy citations for dual-engine viewer
  policyCitation?: {
    docName: string;
    section: string;
    page: number;
    quote: string;
    status: string;
  };
  codeCitation?: {
    repo: string;
    filePath: string;
    startLine: number;
    endLine: number;
    lines: { num: number; text: string; isHighlighted?: boolean }[];
    branch: string;
    commitSha: string;
  };
  ruleCheck?: {
    ruleId: string;
    ruleName: string;
    status: 'verified' | 'failed' | 'unverified';
    matchConfidence: number;
    description: string;
  };
}

export interface ConflictItem {
  id: string;
  claimCode: string;
  title: string;
  severity: 'high' | 'medium' | 'low';
  sourceA: {
    type: 'policy' | 'repo' | 'questionnaire';
    label: string;
    ref: string;
    statement: string;
  };
  sourceB: {
    type: 'policy' | 'repo' | 'control';
    label: string;
    ref: string;
    statement: string;
  };
  detectedAt: string;
  status?: 'open' | 'reviewed' | 'resolved';
}

export interface EvidenceLibraryItem {
  id: string;
  sourceType: 'policy' | 'repository' | 'control';
  sourceName: string;
  pathOrRef: string;
  location: string;
  domain: string;
  relatedClaimCode: string;
  excerpt: string;
  relevance: string;
  confidence: number;
  status: EvidenceStatus;
}

export interface EvidenceSourceFile {
  id: string;
  name: string;
  type: 'xlsx' | 'pdf' | 'repo';
  typeLabel: string;
  sizeOrBranch: string;
  sha: string;
  status: 'ready' | 'needs_attention';
  statusLabel: string;
  extractedTitle: string;
  extractedProgress: number;
  extractedNote: string;
  linkedCount: number;
  lastUpdated: string;
  localPath?: string;
  extractedChunks?: {
    id: string;
    pageOrFile: string;
    section: string;
    text: string;
    confidence: number;
    linkedQuestionCode?: string;
  }[];
}

export interface SecurityCheckCategory {
  id: string;
  category: 'encryption' | 'auth' | 'isolation';
  title: string;
  description: string;
  status: 'supported' | 'needs_review' | 'issue_detected';
  statusLabel: string;
  sourceReference: string;
  targetPath: string;
  findingDetail: string;
  verifiedScope: string;
}

export interface ExportDeliverable {
  id: string;
  filename: string;
  format: 'XLSX' | 'PDF';
  assessment: string;
  exportedAt: string;
  status: 'Signed Draft' | 'Final Auditor Signed';
  isDraft: boolean;
  sizeBytes: number;
  downloadUrl: string;
}

export interface AppSettings {
  openaiApiKey?: string;
  anthropicApiKey?: string;
  githubToken?: string;
  activeModel: 'claude-3-7-sonnet' | 'gpt-4o' | 'deterministic';
  strictVerification: boolean;
  autoDetectConflicts: boolean;
}

export interface AssessmentState {
  assessmentId: string;
  assessmentName: string;
  framework: string;
  targetFilename: string;
  originalWorkbookPath?: string;
  createdAt: string;
  updatedAt: string;
  claims: SecurityClaim[];
  conflicts: ConflictItem[];
  sources: EvidenceSourceFile[];
  exportHistory: ExportDeliverable[];
  settings: AppSettings;
}

export interface LayerVisibility {
  policy: boolean;
  repository: boolean;
  controls: boolean;
  conflicts: boolean;
}

export type NavItem =
  | 'overview'
  | 'questionnaire'
  | 'sources'
  | 'findings'
  | 'exports'
  | 'review'
  | 'questions'
  | 'evidence';
