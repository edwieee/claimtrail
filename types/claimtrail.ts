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
  answerDraftDetails?: AnswerDraft;
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

export type AnswerDraftEvidenceStatus =
  | 'supported'
  | 'partially_supported'
  | 'conflicting_evidence'
  | 'insufficient_evidence';

export interface AnswerDraftCitation {
  evidenceId: string;
  sourceType: 'pdf' | 'repo';
  sourceName: string;
  sourceUrlOrFilename: string;
  excerpt: string;
  pageNumber?: number;
  filePath?: string;
  lineRange?: { start: number; end: number };
  commitSha?: string;
  branch?: string;
}

export interface AnswerDraft {
  questionId: string;
  draftAnswer: string;
  evidenceStatus: AnswerDraftEvidenceStatus;
  reviewRequired: boolean;
  reasoningSummary: string;
  limitations: string[];
  evidenceCitations: AnswerDraftCitation[];
  generatedAt: string;
  model: string;
  evidenceVersion: string;
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

export type EvidenceRetrievalState = 'supporting' | 'conflicting' | 'insufficient' | 'mixed';

export interface EvidenceMatch {
  id: string;
  sourceId: string;
  sourceType: 'pdf' | 'repo';
  sourceName: string;
  sourceUrlOrFilename: string;
  repository?: string;
  filePath?: string;
  commitSha?: string;
  branch?: string;
  pageNumber?: number;
  lineRange?: { start: number; end: number };
  section?: string;
  snippet: string;
  score: number;
  explanation: string;
  signal: 'supporting' | 'potentially_conflicting' | 'ambiguous';
  limitations: string[];
}

export interface EvidenceMapping {
  claimId: string;
  claimCode: string;
  question: string;
  retrievalState: EvidenceRetrievalState;
  evidence: EvidenceMatch[];
  limitations: string[];
  retrievedAt: string;
}

export type DeterministicCheckStatus =
  | 'pass'
  | 'finding'
  | 'needs_review'
  | 'insufficient_evidence'
  | 'not_applicable';

export type DeterministicFindingType =
  | 'policy_config_conflict'
  | 'implementation_gap'
  | 'missing_evidence'
  | 'control_evidence'
  | 'unsupported_answer';

export type ConflictAnalysisType =
  | 'explicit_conflict'
  | 'possible_implementation_gap'
  | 'unsupported_answer'
  | 'missing_evidence'
  | 'consistent_evidence'
  | 'needs_human_verification';

export type FindingReviewStatus =
  | 'open'
  | 'in_review'
  | 'awaiting_evidence'
  | 'resolved'
  | 'accepted_risk'
  | 'false_positive';

export interface RuleEvidenceReference {
  evidenceId: string;
  sourceType: 'pdf' | 'repo';
  sourceName: string;
  sourceUrlOrFilename: string;
  excerpt: string;
  pageNumber?: number;
  filePath?: string;
  lineRange?: { start: number; end: number };
  commitSha?: string;
  branch?: string;
}

export interface DeterministicFinding {
  id: string;
  ruleId: string;
  ruleName: string;
  relatedClaimIds: string[];
  relatedQuestionCodes: string[];
  category: string;
  status: Exclude<DeterministicCheckStatus, 'pass' | 'not_applicable'>;
  reviewStatus?: FindingReviewStatus;
  analysisType?: ConflictAnalysisType;
  findingType: DeterministicFindingType;
  priority: 'high' | 'medium' | 'low';
  title: string;
  explanation: string;
  trigger: string;
  recommendedAction: string;
  evidence: RuleEvidenceReference[];
  checkedAt: string;
  firstDetectedAt?: string;
  lastUpdatedAt?: string;
  stale?: boolean;
  sourceVersion?: string;
  relatedDraftVersion?: string;
  relatedStep4FindingIds?: string[];
  whatEvidenceProves?: string;
  whatEvidenceDoesNotProve?: string;
  reviewNotes?: string;
  resolution?: {
    status: Exclude<FindingReviewStatus, 'open' | 'in_review' | 'awaiting_evidence'>;
    reason: string;
    resolvedAt: string;
  };
}

export interface ConflictAnalysisResult {
  id: string;
  claimId: string;
  claimCode: string;
  analysisType: ConflictAnalysisType;
  status: 'pass' | 'review' | 'missing';
  explanation: string;
  evidenceIds: string[];
  findingId?: string;
  sourceVersion: string;
  analyzedAt: string;
}

export interface SecurityCheckResult {
  id: string;
  ruleId: string;
  ruleName: string;
  claimId: string;
  claimCode: string;
  category: string;
  status: DeterministicCheckStatus;
  findingId?: string;
  explanation: string;
  checkedAt: string;
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
    lineRange?: { start: number; end: number };
  }[];
  repoMetadata?: {
    owner: string;
    repo: string;
    canonicalUrl: string;
    branch: string;
    commitSha: string;
    commitMessage?: string;
    inspectedFilesCount: number;
    totalFilesScanned: number;
    warnings?: string[];
    skippedFiles?: { path: string; reason: string }[];
  };
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
  checkResults?: SecurityCheckResult[];
  findings?: DeterministicFinding[];
  conflictAnalyses?: ConflictAnalysisResult[];
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
