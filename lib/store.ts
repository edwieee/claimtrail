import fs from 'fs';
import path from 'path';
import type { AssessmentState, AppSettings } from '@/types/claimtrail';

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

export function createEmptyState(settings?: Partial<AppSettings>): AssessmentState {
  const now = new Date().toISOString();
  return {
    assessmentId: '',
    assessmentName: '',
    framework: '',
    targetFilename: '',
    createdAt: now,
    updatedAt: now,
    claims: [],
    conflicts: [],
    sources: [],
    exportHistory: [],
    checkResults: [],
    findings: [],
    conflictAnalyses: [],
    settings: {
      activeModel: 'claude-3-7-sonnet',
      strictVerification: true,
      autoDetectConflicts: true,
      openaiApiKey: process.env.OPENAI_API_KEY || '',
      githubToken: process.env.GITHUB_TOKEN || '',
      ...settings,
    },
  };
}

function isLegacyDemoState(state: AssessmentState): boolean {
  return state.assessmentId === 'asm-acme-2026' &&
    state.assessmentName === 'AcmeCorp Enterprise Security 2026' &&
    state.claims.some((claim) => claim.id === 'claim-1' && claim.code === 'SEC-104');
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
      if (isLegacyDemoState(memoryCache)) {
        const empty = createEmptyState(memoryCache.settings);
        saveAssessmentStore(empty);
        return empty;
      }
      return memoryCache;
    } catch (err) {
      console.error('Error reading assessment store file, initializing new state:', err);
    }
  }

  const initial = createEmptyState();
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
