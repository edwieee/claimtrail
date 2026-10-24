import { Octokit } from '@octokit/rest';
import crypto from 'crypto';

export interface InspectedRepoFile {
  id: string;
  path: string;
  size: number;
  content: string;
  snippet: string;
  sha: string;
  language: string;
  linesCount: number;
  lineRange: { start: number; end: number };
  isTruncated: boolean;
  limitations?: string;
}

export interface SkippedRepoFile {
  path: string;
  reason: string;
  size?: number;
}

export interface InspectRepoResult {
  owner: string;
  repo: string;
  canonicalUrl: string;
  branch: string;
  latestCommitSha: string;
  shortCommitSha: string;
  commitMessage?: string;
  commitDate?: string;
  totalFilesScanned: number;
  inspectedFiles: InspectedRepoFile[];
  skippedFiles: SkippedRepoFile[];
  warnings: string[];
  sha256: string;
}

export interface ParsedGitHubUrl {
  owner: string;
  repo: string;
  canonicalUrl: string;
}

export const GITHUB_LIMITS = {
  maxFilesToFetch: 15,
  maxSingleFileBytes: 80 * 1024, // 80 KB
  maxTotalContentBytes: 300 * 1024, // 300 KB
  requestTimeoutMs: 15000,
};

// Strict GitHub owner/repo regex according to GitHub username & repository naming specifications
const GITHUB_OWNER_REGEX = /^[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,37}[a-zA-Z0-9])?$/;
const GITHUB_REPO_REGEX = /^[a-zA-Z0-9_.-]{1,100}$/;

/**
 * Validates and parses a user-provided GitHub repository URL or shorthand.
 * Rejects SSRF vectors, non-GitHub domains, embedded credentials, path traversals, etc.
 */
export function parseGitHubUrl(input: string): ParsedGitHubUrl {
  if (!input || typeof input !== 'string') {
    throw new Error('Repository URL must be a non-empty string.');
  }

  const trimmed = input.trim();

  // Reject embedded credentials, e.g. https://user:pass@github.com/...
  if (trimmed.includes('@')) {
    throw new Error('Invalid repository URL: Embedded credentials are strictly prohibited.');
  }

  // Reject path traversals, control characters, or IP address formats
  if (trimmed.includes('..') || /[\r\n\t\0]/.test(trimmed)) {
    throw new Error('Invalid repository URL: Path traversal or control characters detected.');
  }

  let pathname = '';

  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    let parsedUrl: URL;
    try {
      parsedUrl = new URL(trimmed);
    } catch {
      throw new Error('Malformed URL format. Expected: https://github.com/owner/repository');
    }

    const host = parsedUrl.hostname.toLowerCase();
    if (host !== 'github.com' && host !== 'www.github.com') {
      throw new Error(`Untrusted host '${host}'. Only public repositories on 'github.com' are supported.`);
    }

    pathname = parsedUrl.pathname;
  } else {
    // Handle shorthand like "github.com/owner/repo" or "owner/repo"
    const cleaned = trimmed.replace(/^github\.com\//i, '').replace(/^\/+/, '');
    pathname = `/${cleaned}`;
  }

  // Split and filter path segments
  const segments = pathname.split('/').filter((s) => s.length > 0);
  if (segments.length < 2) {
    throw new Error('Invalid repository path. Expected: https://github.com/owner/repository');
  }

  const rawOwner = segments[0];
  let rawRepo = segments[1];

  // Strip trailing .git if present
  if (rawRepo.toLowerCase().endsWith('.git')) {
    rawRepo = rawRepo.slice(0, -4);
  }

  // Reject if extra segments indicate subpaths like /pulls, /issues, /tree/...
  if (segments.length > 2) {
    // If user provided a link to a tree or blob, warn or instruct on root repo URL
    const subpath = segments.slice(2).join('/');
    if (/^(tree|blob|commits|pulls|issues|releases|actions)/i.test(subpath)) {
      throw new Error(
        `Repository subpath '/${subpath}' is not supported. Please supply the root repository URL: https://github.com/${rawOwner}/${rawRepo}`
      );
    }
  }

  if (!GITHUB_OWNER_REGEX.test(rawOwner)) {
    throw new Error(`Invalid GitHub owner format: '${rawOwner}'. Must be alphanumeric and up to 39 characters.`);
  }

  if (!GITHUB_REPO_REGEX.test(rawRepo) || rawRepo === '.' || rawRepo === '..') {
    throw new Error(`Invalid GitHub repository name format: '${rawRepo}'.`);
  }

  return {
    owner: rawOwner,
    repo: rawRepo,
    canonicalUrl: `https://github.com/${rawOwner}/${rawRepo}`,
  };
}

/**
 * Determines file language/type tag from extension or filename
 */
function detectLanguage(filePath: string): string {
  const lower = filePath.toLowerCase();
  const filename = lower.split('/').pop() || '';

  if (filename === 'dockerfile' || filename.endsWith('.dockerfile')) return 'DOCKER';
  if (filename === 'security.md' || filename.endsWith('.md')) return 'MARKDOWN';
  if (lower.endsWith('.tf') || lower.endsWith('.tfvars')) return 'TERRAFORM';
  if (lower.endsWith('.yaml') || lower.endsWith('.yml')) return 'YAML';
  if (lower.endsWith('.ts') || lower.endsWith('.tsx')) return 'TYPESCRIPT';
  if (lower.endsWith('.js') || lower.endsWith('.jsx') || lower.endsWith('.mjs') || lower.endsWith('.cjs')) return 'JAVASCRIPT';
  if (lower.endsWith('.py')) return 'PYTHON';
  if (lower.endsWith('.go')) return 'GO';
  if (lower.endsWith('.json')) return 'JSON';
  if (lower.endsWith('.toml')) return 'TOML';
  if (lower.endsWith('.sh') || lower.endsWith('.bash')) return 'SHELL';
  return 'CONFIG';
}

/**
 * Assigns an inspection priority score based on security relevance
 */
function scoreFileForSecurityInspection(filePath: string): number {
  let score = 0;
  const lower = filePath.toLowerCase();

  // 1. CI/CD and automated security workflows
  if (lower.includes('.github/workflows/')) score += 50;
  if (lower.includes('dependabot') || lower.includes('codeql') || lower.includes('sonar')) score += 40;

  // 2. Infrastructure as Code (IaC)
  if (lower.endsWith('.tf') || lower.endsWith('.tfvars')) score += 45;
  if (lower.includes('terraform/') || lower.includes('infra/')) score += 35;

  // 3. Security, Auth, Identity, Isolation & Perimeter controls
  if (/(auth|tenant|isolation|middleware|rls|security|kms|crypto|cipher|secret|perimeter|cors|jwt|rbac|iam)/i.test(lower)) {
    score += 40;
  }

  // 4. Containers & deployment configs
  if (lower.includes('dockerfile') || lower.includes('docker-compose')) score += 30;

  // 5. Security documentation & policies
  if (lower.endsWith('security.md')) score += 35;
  if (lower.endsWith('.md') || lower.endsWith('.txt') || lower.endsWith('readme')) score += 6;

  // 6. Config files
  if (lower.endsWith('.yaml') || lower.endsWith('.yml')) score += 15;
  if (lower.endsWith('.json') && !lower.includes('package-lock')) score += 10;
  if (lower.endsWith('.toml') || lower.endsWith('.ini') || lower.endsWith('.env.example')) score += 15;

  // 7. General source code
  if (/\.(ts|tsx|js|jsx|mjs|cjs|py|go|rb|java|rs|php|sh|bash)$/i.test(lower)) score += 5;

  // 8. Other text / project manifests without extension (e.g. README, LICENSE, Makefile)
  if (!lower.includes('.') && /(readme|license|makefile|procfile)/i.test(lower)) score += 4;

  return score;
}

/**
 * Checks whether a repository path should be strictly excluded
 */
function isExcludedPath(filePath: string): { excluded: boolean; reason?: string } {
  const lower = filePath.toLowerCase();

  // Exclude dependency / build / package folders
  const excludedDirs = [
    'node_modules/',
    '.git/',
    '.next/',
    'dist/',
    'build/',
    'out/',
    'vendor/',
    'target/',
    'bin/',
    'obj/',
    'coverage/',
    '.cache/',
    'venv/',
    '.venv/',
    '__pycache__/',
    '.idea/',
    '.vscode/',
  ];
  for (const dir of excludedDirs) {
    if (lower.includes(dir) || lower.startsWith(dir)) {
      return { excluded: true, reason: `Excluded directory '${dir}'` };
    }
  }

  // Exclude lockfiles
  const lockfiles = [
    'package-lock.json',
    'yarn.lock',
    'pnpm-lock.yaml',
    'pipfile.lock',
    'poetry.lock',
    'cargo.lock',
    'composer.lock',
    'gemfile.lock',
  ];
  const filename = lower.split('/').pop() || '';
  if (lockfiles.includes(filename)) {
    return { excluded: true, reason: 'Excluded dependency lockfile' };
  }

  // Exclude secret files and private keys
  if (
    filename.startsWith('.env') ||
    filename.endsWith('.pem') ||
    filename.endsWith('.key') ||
    filename.endsWith('.crt') ||
    filename.endsWith('.pfx') ||
    filename.includes('id_rsa') ||
    filename.includes('id_ed25519')
  ) {
    return { excluded: true, reason: 'Excluded potential secret or credential file' };
  }

  // Exclude binary and media extensions
  const binaryExtensions = [
    '.png', '.jpg', '.jpeg', '.gif', '.ico', '.svg', '.webp',
    '.pdf', '.zip', '.tar', '.gz', '.7z', '.rar',
    '.exe', '.dll', '.so', '.dylib', '.wasm',
    '.mp4', '.mp3', '.mov', '.avi',
    '.woff', '.woff2', '.ttf', '.eot',
    '.parquet', '.avro', '.db', '.sqlite',
  ];
  for (const ext of binaryExtensions) {
    if (lower.endsWith(ext)) {
      return { excluded: true, reason: `Excluded binary or media format (${ext})` };
    }
  }

  return { excluded: false };
}

/**
 * Main public GitHub repository inspector.
 * Inspects default branch, retrieves commit SHA, scans bounded file tree,
 * safely retrieves source files, and builds genuine audit evidence.
 */
export async function inspectPublicGitHubRepo(
  repoUrl: string,
  githubToken?: string
): Promise<InspectRepoResult> {
  const { owner, repo, canonicalUrl } = parseGitHubUrl(repoUrl);

  const token = githubToken || process.env.GITHUB_TOKEN || undefined;

  const octokit = new Octokit({
    auth: token,
    request: {
      timeout: GITHUB_LIMITS.requestTimeoutMs,
    },
    userAgent: 'ClaimTrail-Audit-Engine/1.0',
  });

  const warnings: string[] = [];
  const skippedFiles: SkippedRepoFile[] = [];

  try {
    // 1. Fetch repository metadata
    let repoData;
    try {
      const res = await octokit.rest.repos.get({ owner, repo });
      repoData = res.data;
    } catch (err: any) {
      if (err.status === 404) {
        throw new Error(
          `GitHub repository '${owner}/${repo}' was not found or is private. Ensure the repository exists, is publicly accessible, and the URL is spelled correctly.`
        );
      }
      if (err.status === 401) {
        throw new Error('GitHub API token authentication failed. Please verify the configured GITHUB_TOKEN.');
      }
      if (err.status === 403) {
        const rateRemaining = err.response?.headers?.['x-ratelimit-remaining'];
        const rateReset = err.response?.headers?.['x-ratelimit-reset'];
        if (rateRemaining === '0' && rateReset) {
          const resetDate = new Date(parseInt(rateReset, 10) * 1000).toLocaleTimeString();
          throw new Error(
            `GitHub API rate limit exceeded. Rate limit resets at ${resetDate} UTC. To increase your limit to 5,000 req/hr, configure a server GITHUB_TOKEN.`
          );
        }
        throw new Error(`Access forbidden (403) for repository '${owner}/${repo}'. Check API permissions.`);
      }
      throw err;
    }

    if (repoData.size === 0) {
      throw new Error(`Repository '${owner}/${repo}' is empty (size is 0 KB with no committed files).`);
    }

    const defaultBranch = repoData.default_branch || 'main';

    // 2. Fetch latest commit on default branch
    let latestCommitSha = '';
    let shortCommitSha = '';
    let commitMessage = '';
    let commitDate = '';

    try {
      const commitRes = await octokit.rest.repos.getCommit({
        owner,
        repo,
        ref: defaultBranch,
      });
      latestCommitSha = commitRes.data.sha;
      shortCommitSha = latestCommitSha.slice(0, 7);
      commitMessage = commitRes.data.commit.message.split('\n')[0].slice(0, 100);
      commitDate = commitRes.data.commit.committer?.date || commitRes.data.commit.author?.date || '';
    } catch (err: any) {
      throw new Error(`Could not retrieve latest commit for '${owner}/${repo}' branch '${defaultBranch}': ${err.message}`);
    }

    // 3. Fetch git tree recursively from latest commit
    let treeItems: Array<{ path?: string; mode?: string; type?: string; sha?: string; size?: number }> = [];
    try {
      const treeRes = await octokit.rest.git.getTree({
        owner,
        repo,
        tree_sha: latestCommitSha,
        recursive: '1',
      });

      if (treeRes.data.truncated) {
        warnings.push('Repository file tree exceeds 100,000 items and was truncated by GitHub API. Inspected available tree subset.');
      }

      treeItems = treeRes.data.tree || [];
    } catch (err: any) {
      throw new Error(`Failed to read repository tree for '${owner}/${repo}': ${err.message}`);
    }

    if (treeItems.length === 0) {
      throw new Error(`Repository '${owner}/${repo}' file tree is empty.`);
    }

    // 4. Filter and prioritize candidate files for security evidence
    const candidateFiles: Array<{ path: string; sha: string; size: number; score: number }> = [];

    for (const item of treeItems) {
      if (item.type !== 'blob' || !item.path) continue;

      const path = item.path;
      const size = item.size || 0;

      // Check exclusion rules
      const exclusion = isExcludedPath(path);
      if (exclusion.excluded) {
        continue;
      }

      // Check single file size limit
      if (size > GITHUB_LIMITS.maxSingleFileBytes) {
        skippedFiles.push({
          path,
          reason: `Exceeds single file size limit (${(size / 1024).toFixed(1)} KB > ${(GITHUB_LIMITS.maxSingleFileBytes / 1024).toFixed(0)} KB)`,
          size,
        });
        continue;
      }

      const score = scoreFileForSecurityInspection(path);
      if (score > 0) {
        candidateFiles.push({ path, sha: item.sha || '', size, score });
      }
    }

    // If no candidate files matched prioritized patterns, fallback to top non-excluded blobs
    if (candidateFiles.length === 0) {
      for (const item of treeItems) {
        if (item.type !== 'blob' || !item.path) continue;
        const exclusion = isExcludedPath(item.path);
        if (exclusion.excluded) continue;
        if ((item.size || 0) > GITHUB_LIMITS.maxSingleFileBytes) continue;
        candidateFiles.push({ path: item.path, sha: item.sha || '', size: item.size || 0, score: 1 });
        if (candidateFiles.length >= 5) break;
      }
    }

    // Sort candidate files by relevance score descending
    candidateFiles.sort((a, b) => b.score - a.score);

    if (candidateFiles.length > GITHUB_LIMITS.maxFilesToFetch) {
      const omittedCount = candidateFiles.length - GITHUB_LIMITS.maxFilesToFetch;
      warnings.push(`Configured limit reached: Inspected top ${GITHUB_LIMITS.maxFilesToFetch} relevant files; ${omittedCount} lower-priority files deferred.`);
    }

    const filesToInspect = candidateFiles.slice(0, GITHUB_LIMITS.maxFilesToFetch);
    const inspectedFiles: InspectedRepoFile[] = [];
    let accumulatedContentBytes = 0;

    // 5. Fetch content of candidate files
    for (const fileCandidate of filesToInspect) {
      if (accumulatedContentBytes >= GITHUB_LIMITS.maxTotalContentBytes) {
        skippedFiles.push({
          path: fileCandidate.path,
          reason: `Total downloaded content limit reached (${(GITHUB_LIMITS.maxTotalContentBytes / 1024).toFixed(0)} KB)`,
        });
        continue;
      }

      try {
        const fileContentRes = await octokit.rest.repos.getContent({
          owner,
          repo,
          path: fileCandidate.path,
          ref: latestCommitSha,
        });

        if ('content' in fileContentRes.data && fileContentRes.data.content) {
          const rawBuffer = Buffer.from(fileContentRes.data.content, 'base64');

          // Check for binary null-byte indicator
          if (rawBuffer.includes(0)) {
            skippedFiles.push({ path: fileCandidate.path, reason: 'Detected binary content' });
            continue;
          }

          const rawText = rawBuffer.toString('utf-8');
          const lines = rawText.split(/\r?\n/);
          const linesCount = lines.length;

          // Determine line range and snippet (bounded to first 80 lines or 1500 chars)
          const maxSnippetLines = Math.min(linesCount, 80);
          const snippetText = lines.slice(0, maxSnippetLines).join('\n').slice(0, 1500);
          const isTruncated = linesCount > maxSnippetLines || rawText.length > 1500;

          accumulatedContentBytes += rawBuffer.length;

          const fileId = `ev-repo-${owner}-${repo}-${crypto.createHash('md5').update(fileCandidate.path).digest('hex').slice(0, 8)}`;

          inspectedFiles.push({
            id: fileId,
            path: fileCandidate.path,
            size: fileCandidate.size,
            content: rawText,
            snippet: snippetText,
            sha: fileCandidate.sha,
            language: detectLanguage(fileCandidate.path),
            linesCount,
            lineRange: { start: 1, end: maxSnippetLines },
            isTruncated,
            limitations: isTruncated ? `Snippet displays lines 1–${maxSnippetLines} of ${linesCount} total lines.` : undefined,
          });
        }
      } catch (err: any) {
        console.warn(`Could not read repository file '${fileCandidate.path}':`, err?.message || err);
        skippedFiles.push({ path: fileCandidate.path, reason: err?.message || 'Failed to fetch content' });
      }
    }

    if (inspectedFiles.length === 0 && candidateFiles.length > 0) {
      warnings.push('Could not download content for candidate files. Check repository permissions.');
    }

    // 6. Compute deterministic SHA-256 fingerprint for this inspection revision
    const sha256 = crypto
      .createHash('sha256')
      .update(`${owner}/${repo}:${latestCommitSha}:${inspectedFiles.map((f) => f.sha).join(',')}`)
      .digest('hex');

    return {
      owner,
      repo,
      canonicalUrl,
      branch: defaultBranch,
      latestCommitSha,
      shortCommitSha,
      commitMessage,
      commitDate,
      totalFilesScanned: treeItems.length,
      inspectedFiles,
      skippedFiles,
      warnings,
      sha256,
    };
  } catch (err: any) {
    // Sanitize any error message to guarantee GITHUB_TOKEN is NEVER exposed
    let safeMessage = err?.message || 'An unexpected error occurred while inspecting repository.';
    if (token) {
      safeMessage = safeMessage.replaceAll(token, '[REDACTED_GITHUB_TOKEN]');
    }
    const cleanError = new Error(safeMessage);
    (cleanError as any).status = err?.status || 500;
    throw cleanError;
  }
}
