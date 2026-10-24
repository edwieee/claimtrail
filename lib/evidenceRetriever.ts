import crypto from 'crypto';
import type {
  EvidenceMapping,
  EvidenceMatch,
  EvidenceRetrievalState,
  EvidenceSourceFile,
  SecurityClaim,
} from '../types/claimtrail';

const DEFAULT_LIMIT = 6;
const MAX_LIMIT = 10;
const MAX_SNIPPET_LENGTH = 900;

const STOP_WORDS = new Set([
  'about', 'after', 'against', 'also', 'among', 'and', 'are', 'all', 'any', 'for',
  'from', 'how', 'into', 'its', 'must', 'not', 'our', 'that', 'the', 'their',
  'these', 'this', 'those', 'through', 'using', 'with', 'what', 'when', 'where',
  'which', 'who', 'why', 'will', 'your', 'does', 'is', 'can', 'customer', 'data',
  'security', 'control', 'controls', 'system', 'systems', 'question', 'whether',
]);

const CONFLICT_TERMS = [
  'false', 'missing', 'disabled', 'without', 'does not', 'do not', 'failed', 'failure',
  'fail', 'insecure', 'unencrypted', 'unprotected', 'exposed', 'bypass', 'omits',
  'omitted', 'not enforced', 'not enabled', 'violation', 'vulnerable', 'publicly exposed',
];

const SUPPORT_TERMS = [
  'true', 'enabled', 'enforced', 'required', 'protected', 'encrypted', 'validated',
  'verify', 'verified', 'rotation', 'restricted', 'isolated', 'authenticated',
  'implemented', 'configured', 'compliant', 'webhook', 'waf', 'mfa', 'saml',
];

interface Candidate {
  source: EvidenceSourceFile;
  chunk: NonNullable<EvidenceSourceFile['extractedChunks']>[number];
  sourceText: string;
  score: number;
  matchedTerms: string[];
  phraseMatches: string[];
}

function normalize(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9_./-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function canonicalTerm(term: string): string {
  const aliases: Record<string, string> = {
    encrypted: 'encrypt',
    encryption: 'encrypt',
    encrypt: 'encrypt',
    keys: 'key',
    key: 'key',
    isolated: 'isolat',
    isolation: 'isolat',
    isolate: 'isolat',
    authenticated: 'auth',
    authentication: 'auth',
    authorization: 'auth',
    authorisation: 'auth',
    validated: 'valid',
    validation: 'valid',
    validate: 'valid',
    rotations: 'rotat',
    rotation: 'rotat',
    rotate: 'rotat',
  };
  return aliases[term] || term;
}

function normalizeForSearch(value: string): string {
  return normalize(value).split(' ').map(canonicalTerm).join(' ');
}

function termsFor(...values: string[]): string[] {
  const terms = new Set<string>();
  for (const value of values) {
    for (const rawTerm of normalize(value).split(' ')) {
      const term = canonicalTerm(rawTerm);
      if (term.length >= 3 && !STOP_WORDS.has(rawTerm)) terms.add(term);
    }
  }
  return [...terms];
}

function phrasesFor(value: string): string[] {
  const terms = normalize(value).split(' ').filter((term) => term.length >= 3 && !STOP_WORDS.has(term)).map(canonicalTerm);
  const phrases: string[] = [];
  for (let index = 0; index < terms.length - 1; index += 1) {
    const phrase = terms.slice(index, index + 2).join(' ');
    if (phrase.length >= 9) phrases.push(phrase);
  }
  return phrases;
}

function parsePageNumber(pageOrFile?: string): number | undefined {
  const match = pageOrFile?.match(/page\s+(\d+)/i);
  return match ? Number(match[1]) : undefined;
}

function parseLineRange(chunk: NonNullable<EvidenceSourceFile['extractedChunks']>[number]) {
  if (chunk.lineRange) return chunk.lineRange;
  const match = String(chunk.section || '').match(/lines?\s+(\d+)\s*[–-]\s*(\d+)/i);
  return match ? { start: Number(match[1]), end: Number(match[2]) } : undefined;
}

function classifySignal(text: string): EvidenceMatch['signal'] {
  const normalized = normalizeForSearch(text);
  const hasConflict = CONFLICT_TERMS.some((term) => normalized.includes(normalizeForSearch(term)));
  const hasSupport = SUPPORT_TERMS.some((term) => normalized.includes(normalizeForSearch(term)));
  if (hasConflict) return 'potentially_conflicting';
  if (hasSupport) return 'supporting';
  return 'ambiguous';
}

function stableId(sourceId: string, chunkId: string, snippet: string): string {
  return `evidence-${crypto.createHash('sha256').update(`${sourceId}:${chunkId}:${snippet}`).digest('hex').slice(0, 16)}`;
}

function toEvidenceMatch(candidate: Candidate): EvidenceMatch {
  const { source, chunk, sourceText, score, matchedTerms, phraseMatches } = candidate;
  const limitations: string[] = [
    'Retrieval relevance is not proof of deployed security posture.',
  ];
  const lineRange = source.type === 'repo' ? parseLineRange(chunk) : undefined;
  const pageNumber = source.type === 'pdf' ? parsePageNumber(chunk.pageOrFile) : undefined;

  if (source.type === 'repo' && !lineRange) {
    limitations.push('Reliable source line numbers were not available in the ingested metadata.');
  }
  if (source.type === 'repo') {
    limitations.push('Repository evidence represents the inspected commit, not necessarily the deployed state.');
  }
  if (source.type === 'pdf' && !pageNumber) {
    limitations.push('Reliable PDF page metadata was not available in the ingested chunk.');
  }

  const signal = classifySignal(sourceText);
  const explanation = phraseMatches.length > 0
    ? `Matched phrase${phraseMatches.length > 1 ? 's' : ''}: ${phraseMatches.slice(0, 3).join(', ')}.`
    : `Matched terms: ${matchedTerms.slice(0, 6).join(', ')}.`;

  return {
    id: stableId(source.id, chunk.id, sourceText),
    sourceId: source.id,
    sourceType: source.type as 'pdf' | 'repo',
    sourceName: source.name,
    sourceUrlOrFilename: source.type === 'repo'
      ? source.repoMetadata?.canonicalUrl || source.name
      : source.name,
    repository: source.type === 'repo' ? source.repoMetadata?.canonicalUrl : undefined,
    filePath: source.type === 'repo' ? chunk.pageOrFile : undefined,
    commitSha: source.type === 'repo' ? source.repoMetadata?.commitSha : undefined,
    branch: source.type === 'repo' ? source.repoMetadata?.branch : undefined,
    pageNumber,
    lineRange,
    section: chunk.section,
    snippet: sourceText.slice(0, MAX_SNIPPET_LENGTH),
    score: Math.round(score * 100) / 100,
    explanation,
    signal,
    limitations,
  };
}

function deduplicate(candidates: Candidate[]): Candidate[] {
  const seen = new Set<string>();
  return candidates.filter((candidate) => {
    const key = `${candidate.source.id}:${normalize(candidate.sourceText).slice(0, 320)}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export function retrieveEvidenceForClaim(
  claim: SecurityClaim,
  sources: EvidenceSourceFile[],
  options?: { limit?: number }
): EvidenceMapping {
  const limit = Math.min(Math.max(options?.limit || DEFAULT_LIMIT, 1), MAX_LIMIT);
  const searchTerms = termsFor(claim.question, claim.category);
  const searchPhrases = phrasesFor(claim.question);
  const candidates: Candidate[] = [];

  for (const source of sources) {
    if (source.type !== 'pdf' && source.type !== 'repo') continue;
    for (const chunk of Array.isArray(source.extractedChunks) ? source.extractedChunks : []) {
      const sourceText = `${chunk.section || ''} ${chunk.pageOrFile || ''} ${chunk.text || ''}`;
      const normalizedText = normalizeForSearch(sourceText);
      const matchedTerms = searchTerms.filter((term) => normalizedText.includes(term));
      const phraseMatches = searchPhrases.filter((phrase) => normalizedText.includes(phrase));
      if (matchedTerms.length === 0) continue;

      const overlapScore = matchedTerms.length / Math.max(searchTerms.length, 1);
      const phraseScore = Math.min(phraseMatches.length * 0.12, 0.36);
      const sourceScore = source.type === 'repo' ? 0.08 : 0.04;
      const score = Math.min(0.99, overlapScore * 0.76 + phraseScore + sourceScore);
      if (score < 0.12) continue;

      candidates.push({ source, chunk, sourceText: typeof chunk.text === 'string' ? chunk.text : '', score, matchedTerms, phraseMatches });
    }
  }

  const selected = deduplicate(candidates)
    .sort((a, b) => b.score - a.score || a.source.name.localeCompare(b.source.name))
    .slice(0, limit);
  const evidence = selected.map(toEvidenceMatch);
  const hasSupport = evidence.some((item) => item.signal === 'supporting');
  const hasConflict = evidence.some((item) => item.signal === 'potentially_conflicting');
  let retrievalState: EvidenceRetrievalState = 'insufficient';
  if (hasSupport && hasConflict) retrievalState = 'mixed';
  else if (hasConflict) retrievalState = 'conflicting';
  else if (hasSupport) retrievalState = 'supporting';

  const limitations = evidence.flatMap((item) => item.limitations).filter((value, index, values) => values.indexOf(value) === index);
  if (evidence.length === 0) {
    limitations.push('No sufficiently relevant extracted policy or repository passage was found for this question.');
  }
  if (sources.every((source) => source.type !== 'pdf' && source.type !== 'repo')) {
    limitations.push('No policy PDF or GitHub repository evidence source is currently available.');
  }

  return {
    claimId: claim.id,
    claimCode: claim.code,
    question: claim.question,
    retrievalState,
    evidence,
    limitations: [...new Set(limitations)],
    retrievedAt: new Date().toISOString(),
  };
}

export function retrieveEvidenceForClaims(
  claims: SecurityClaim[],
  sources: EvidenceSourceFile[],
  options?: { limit?: number }
): Record<string, EvidenceMapping> {
  return Object.fromEntries(claims.map((claim) => [claim.id, retrieveEvidenceForClaim(claim, sources, options)]));
}