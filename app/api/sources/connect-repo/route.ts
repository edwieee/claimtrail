import { NextRequest, NextResponse } from 'next/server';
import {
  getAssessmentStore,
  updateAssessmentStore,
  saveRepoInspectionCache,
  sanitizeStateForClient,
} from '@/lib/store';
import { inspectPublicGitHubRepo } from '@/lib/githubInspector';
import type { EvidenceSourceFile } from '@/types/claimtrail';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const { repoUrl, githubToken } = body;

    if (!repoUrl || typeof repoUrl !== 'string') {
      return NextResponse.json(
        { error: 'Repository URL is required. Example: https://github.com/owner/repository' },
        { status: 400 }
      );
    }

    // Inspect public GitHub repository safely via Octokit
    const result = await inspectPublicGitHubRepo(repoUrl, githubToken);

    // Cache the full inspected files on the server for downstream security checks
    const repoSourceKey = `github.com/${result.owner}/${result.repo}`;
    saveRepoInspectionCache(repoSourceKey, result.inspectedFiles);

    // Get current questionnaire claims to correlate code evidence
    const current = getAssessmentStore();
    const existingClaims = current.claims || [];

    // Map chunks to relevant claim codes based on file path and content keywords
    const chunks = result.inspectedFiles.map((f, i) => {
      let matchedCode: string | undefined = undefined;
      const lowerPath = f.path.toLowerCase();
      const lowerContent = f.snippet.toLowerCase();

      for (const claim of existingClaims) {
        const qLower = claim.question.toLowerCase();
        const cLower = claim.category.toLowerCase();

        if (
          (qLower.includes('tenant') || qLower.includes('isolat') || cLower.includes('isolation')) &&
          (lowerPath.includes('tenant') || lowerContent.includes('tenant') || lowerContent.includes('rls'))
        ) {
          matchedCode = claim.code;
          break;
        }

        if (
          (qLower.includes('kms') || qLower.includes('key') || qLower.includes('encrypt') || cLower.includes('crypt')) &&
          (lowerPath.includes('kms') || lowerContent.includes('kms') || lowerContent.includes('encrypt') || lowerContent.includes('key'))
        ) {
          matchedCode = claim.code;
          break;
        }

        if (
          (qLower.includes('mfa') || qLower.includes('multi-factor') || cLower.includes('identity')) &&
          (lowerPath.includes('auth') || lowerContent.includes('mfa') || lowerContent.includes('iam'))
        ) {
          matchedCode = claim.code;
          break;
        }

        if (
          (qLower.includes('egress') || qLower.includes('perimeter') || qLower.includes('firewall') || cLower.includes('network')) &&
          (lowerPath.includes('network') || lowerPath.includes('vpc') || lowerContent.includes('nat') || lowerContent.includes('security_group'))
        ) {
          matchedCode = claim.code;
          break;
        }

        if (
          (qLower.includes('audit') || qLower.includes('cloudtrail') || qLower.includes('log') || cLower.includes('telemetry')) &&
          (lowerPath.includes('cloudtrail') || lowerContent.includes('cloudtrail') || lowerContent.includes('s3') || lowerContent.includes('log'))
        ) {
          matchedCode = claim.code;
          break;
        }
      }

      // Default fallback: link to first claim if no specific keyword matched
      if (!matchedCode && existingClaims.length > 0 && i < existingClaims.length) {
        matchedCode = existingClaims[i].code;
      }

      return {
        id: `chunk-repo-${f.id}`,
        pageOrFile: f.path,
        section: `${f.language} (Lines ${f.lineRange.start}–${f.lineRange.end})`,
        text: f.snippet,
        confidence: 96.0,
        linkedQuestionCode: matchedCode,
        lineRange: f.lineRange,
      };
    });

    const uniqueLinkedQuestions = new Set(chunks.map((c) => c.linkedQuestionCode).filter(Boolean));

    const newSource: EvidenceSourceFile = {
      id: `src-repo-${result.owner}-${result.repo}`,
      name: repoSourceKey,
      type: 'repo',
      typeLabel: 'Public GitHub Repo',
      sizeOrBranch: `branch: ${result.branch}`,
      sha: `SHA: ${result.shortCommitSha}`,
      status: result.inspectedFiles.length > 0 ? 'ready' : 'needs_attention',
      statusLabel: result.inspectedFiles.length > 0 ? 'Ready' : 'Needs Attention',
      extractedTitle: `${result.inspectedFiles.length} source & config files indexed`,
      extractedProgress: 100,
      extractedNote: `Commit: ${result.shortCommitSha} • ${result.totalFilesScanned} tree items scanned`,
      linkedCount: uniqueLinkedQuestions.size || result.inspectedFiles.length,
      lastUpdated: 'Just now',
      extractedChunks: chunks,
      repoMetadata: {
        owner: result.owner,
        repo: result.repo,
        canonicalUrl: result.canonicalUrl,
        branch: result.branch,
        commitSha: result.latestCommitSha,
        commitMessage: result.commitMessage,
        inspectedFilesCount: result.inspectedFiles.length,
        totalFilesScanned: result.totalFilesScanned,
        warnings: result.warnings,
        skippedFiles: result.skippedFiles,
      },
    };

    const updatedState = updateAssessmentStore((prev) => {
      // Remove any existing source with the same name or ID
      const filteredSources = prev.sources.filter(
        (s) => s.name !== newSource.name && s.id !== newSource.id
      );

      return {
        ...prev,
        sources: [newSource, ...filteredSources],
        updatedAt: new Date().toISOString(),
      };
    });

    return NextResponse.json({
      success: true,
      source: newSource,
      state: sanitizeStateForClient(updatedState),
      warnings: result.warnings,
      inspectedFilesCount: result.inspectedFiles.length,
      totalFilesScanned: result.totalFilesScanned,
      commitSha: result.shortCommitSha,
    });
  } catch (error: any) {
    const status = typeof error?.status === 'number' && error.status >= 400 && error.status < 600 ? error.status : 500;
    const safeError = error?.message || 'Internal server error while inspecting GitHub repository.';

    console.error('Error connecting GitHub repo:', safeError);

    return NextResponse.json(
      { error: safeError },
      { status }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    let sourceId = searchParams.get('sourceId');
    let sourceName = searchParams.get('sourceName');

    if (!sourceId && !sourceName) {
      try {
        const body = await request.json();
        sourceId = body?.sourceId || null;
        sourceName = body?.sourceName || null;
      } catch {
        // body was not JSON or empty
      }
    }

    if (!sourceId && !sourceName) {
      return NextResponse.json(
        { error: 'Either sourceId or sourceName parameter is required' },
        { status: 400 }
      );
    }

    const updatedState = updateAssessmentStore((prev) => {
      const filteredSources = prev.sources.filter((s) => {
        if (sourceId && s.id === sourceId) return false;
        if (sourceName && s.name === sourceName) return false;
        return true;
      });

      return {
        ...prev,
        sources: filteredSources,
        updatedAt: new Date().toISOString(),
      };
    });

    return NextResponse.json({
      success: true,
      state: sanitizeStateForClient(updatedState),
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Failed to remove evidence source' },
      { status: 500 }
    );
  }
}
