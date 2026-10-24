import { parseGitHubUrl, inspectPublicGitHubRepo, GITHUB_LIMITS } from '../lib/githubInspector';
import fs from 'fs';
import path from 'path';

// Parse .env.local manually if dotenv is not installed
const envLocalPath = path.join(process.cwd(), '.env.local');
if (fs.existsSync(envLocalPath)) {
  const content = fs.readFileSync(envLocalPath, 'utf-8');
  content.split('\n').forEach((line) => {
    const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
    if (match) {
      const key = match[1];
      let value = match[2] || '';
      if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
      if (value.startsWith("'") && value.endsWith("'")) value = value.slice(1, -1);
      process.env[key] = value.trim();
    }
  });
}

let passed = 0;
let failed = 0;

function assert(condition: boolean, message: string) {
  if (condition) {
    console.log(`  ✓ ${message}`);
    passed++;
  } else {
    console.error(`  ✗ FAIL: ${message}`);
    failed++;
  }
}

async function runTests() {
  console.log('\n==================================================');
  console.log('CLAIMTRAIL GITHUB REST API INTEGRATION TEST SUITE');
  console.log('==================================================\n');

  // TEST 1: URL Parsing and Strict Security Validation
  console.log('Test Suite 1: URL Parsing & Strict SSRF/Injection Prevention');
  try {
    const valid1 = parseGitHubUrl('https://github.com/octocat/Hello-World');
    assert(valid1.owner === 'octocat' && valid1.repo === 'Hello-World', 'Parses standard https GitHub URL');

    const valid2 = parseGitHubUrl('https://github.com/octocat/Hello-World.git');
    assert(valid2.repo === 'Hello-World', 'Strips trailing .git');

    const valid3 = parseGitHubUrl('octocat/Hello-World');
    assert(valid3.owner === 'octocat' && valid3.canonicalUrl === 'https://github.com/octocat/Hello-World', 'Parses shorthand owner/repo');

    const valid4 = parseGitHubUrl('github.com/octocat/Hello-World');
    assert(valid4.owner === 'octocat', 'Parses github.com/owner/repo without protocol');

    // Rejection tests
    let rejectedSsrf = false;
    try {
      parseGitHubUrl('https://evil.com/octocat/Hello-World');
    } catch {
      rejectedSsrf = true;
    }
    assert(rejectedSsrf, 'Rejects untrusted non-GitHub domains (SSRF prevention)');

    let rejectedCreds = false;
    try {
      parseGitHubUrl('https://admin:secret@github.com/octocat/Hello-World');
    } catch {
      rejectedCreds = true;
    }
    assert(rejectedCreds, 'Rejects embedded credentials in URL');

    let rejectedTraversal = false;
    try {
      parseGitHubUrl('https://github.com/octocat/../admin');
    } catch {
      rejectedTraversal = true;
    }
    assert(rejectedTraversal, 'Rejects path traversal .. in repository URL');

    let rejectedSubpath = false;
    try {
      parseGitHubUrl('https://github.com/octocat/Hello-World/tree/main/src');
    } catch {
      rejectedSubpath = true;
    }
    assert(rejectedSubpath, 'Rejects deep subpaths (/tree/main/src)');
  } catch (err) {
    console.error('Test Suite 1 encountered unexpected error:', err);
    failed++;
  }

  // TEST 2: Real API inspection of public repository (octocat/Hello-World)
  console.log('\nTest Suite 2: Real Octokit Inspection of Public Repository (octocat/Hello-World)');
  try {
    const token = process.env.GITHUB_TOKEN;
    const res = await inspectPublicGitHubRepo('https://github.com/octocat/Hello-World', token);

    assert(res.owner === 'octocat', `Repository owner is 'octocat' (got: ${res.owner})`);
    assert(res.repo === 'Hello-World', `Repository name is 'Hello-World' (got: ${res.repo})`);
    assert(res.canonicalUrl === 'https://github.com/octocat/Hello-World', 'Canonical URL is accurate');
    assert(!!res.latestCommitSha && res.latestCommitSha.length === 40, `Real 40-character commit SHA: ${res.latestCommitSha}`);
    assert(!!res.shortCommitSha && res.shortCommitSha.length === 7, `Short commit SHA: ${res.shortCommitSha}`);
    assert(res.totalFilesScanned > 0, `Scanned tree count: ${res.totalFilesScanned}`);
    assert(res.inspectedFiles.length > 0, `Inspected files count: ${res.inspectedFiles.length}`);

    const firstFile = res.inspectedFiles[0];
    assert(firstFile.path.length > 0, `Inspected file path: ${firstFile.path}`);
    assert(firstFile.lineRange && firstFile.lineRange.start >= 1, `Line range start is valid: ${firstFile.lineRange?.start}`);
    assert(firstFile.linesCount > 0, `File lines count: ${firstFile.linesCount}`);
    assert(!!firstFile.snippet && firstFile.snippet.length > 0, `Real non-empty code snippet extracted: "${firstFile.snippet.slice(0, 30)}..."`);
    assert(!!res.sha256 && res.sha256.length === 64, `Deterministic SHA-256 fingerprint generated: ${res.sha256.slice(0, 16)}...`);
  } catch (err) {
    console.error('Test Suite 2 failed:', err);
    failed++;
  }

  // TEST 3: Multi-file public repository inspection (octocat/Spoon-Knife)
  console.log('\nTest Suite 3: Multi-file Repository Inspection (octocat/Spoon-Knife)');
  try {
    const res = await inspectPublicGitHubRepo('octocat/Spoon-Knife');
    assert(res.inspectedFiles.length > 0, `Extracted files from Spoon-Knife: ${res.inspectedFiles.length} file(s)`);
    assert(res.inspectedFiles.some((f) => !!f.snippet && f.snippet.length > 0), 'Source snippet extracted reliably');
  } catch (err) {
    console.error('Test Suite 3 failed:', err);
    failed++;
  }

  // TEST 4: Error Handling for Nonexistent Repository
  console.log('\nTest Suite 4: Nonexistent Repository Error Handling');
  try {
    let caught404 = false;
    let errorMessage = '';
    try {
      await inspectPublicGitHubRepo('https://github.com/octocat/nonexistent-claimtrail-repo-99999');
    } catch (err: any) {
      caught404 = true;
      errorMessage = err.message;
    }
    assert(caught404, 'Gracefully catches nonexistent repository with Error');
    assert(errorMessage.includes('was not found or is private'), `Informative user-facing message: "${errorMessage}"`);
  } catch (err) {
    console.error('Test Suite 4 failed:', err);
    failed++;
  }

  // TEST 5: Token Confidentiality (Token must never leak in client APIs)
  console.log('\nTest Suite 5: Token Confidentiality Verification');
  try {
    const rawToken = process.env.GITHUB_TOKEN;
    if (rawToken && rawToken.length > 8) {
      // Check /api/assessment
      const assessRes = await fetch('http://localhost:3000/api/assessment');
      if (assessRes.ok) {
        const text = await assessRes.text();
        assert(!text.includes(rawToken), 'Server GITHUB_TOKEN is NOT present in /api/assessment response');
      }

      // Check /api/settings
      const settingsRes = await fetch('http://localhost:3000/api/settings');
      if (settingsRes.ok) {
        const settingsData = await settingsRes.json();
        const settingsText = JSON.stringify(settingsData);
        assert(!settingsText.includes(rawToken), 'Server GITHUB_TOKEN is NOT present in /api/settings response');
        if (settingsData.settings?.githubToken) {
          assert(settingsData.settings.githubToken.includes('••••'), 'Token in settings is safely masked with bullets');
        }
      }
    } else {
      console.log('  ℹ No raw GITHUB_TOKEN configured; skipping token leak check.');
    }
  } catch (err: any) {
    console.warn('Test Suite 5 check skipped or encountered network error:', err.message);
  }

  // TEST 6: Connect & Disconnect API Endpoint
  console.log('\nTest Suite 6: Full Live Connect and Disconnect Route');
  try {
    const connectRes = await fetch('http://localhost:3000/api/sources/connect-repo', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ repoUrl: 'https://github.com/octocat/Hello-World' }),
    });

    assert(connectRes.ok, `POST /api/sources/connect-repo responded with status ${connectRes.status}`);
    const connectData = await connectRes.json();
    assert(connectData.success === true, 'Connect API response has success: true');
    assert(connectData.source && connectData.source.type === 'repo', 'Connected source has type: repo');
    assert(connectData.source.repoMetadata?.commitSha?.length === 40, `Source has 40-char commit SHA in metadata: ${connectData.source.repoMetadata?.commitSha}`);
    assert(connectData.source.sha?.includes(connectData.commitSha), `Source display sha contains short SHA: ${connectData.source.sha}`);
    assert(connectData.source.extractedChunks && connectData.source.extractedChunks.length > 0, `Extracted chunks count: ${connectData.source.extractedChunks.length}`);

    // Disconnect repo
    const disconnectRes = await fetch('http://localhost:3000/api/sources/connect-repo', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sourceId: connectData.source.id }),
    });
    assert(disconnectRes.ok, `DELETE /api/sources/connect-repo responded with status ${disconnectRes.status}`);
    const disconnectData = await disconnectRes.json();
    assert(disconnectData.success === true, 'Disconnect API response has success: true');
  } catch (err) {
    console.error('Test Suite 6 failed:', err);
    failed++;
  }

  console.log('\n==================================================');
  console.log(`TEST RESULTS: ${passed} PASSED, ${failed} FAILED`);
  console.log('==================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runTests();
