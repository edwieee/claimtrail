import { NextRequest, NextResponse } from 'next/server';
import { updateAssessmentStore } from '@/lib/store';
import { inspectPublicGitHubRepo } from '@/lib/githubInspector';
import type { EvidenceSourceFile } from '@/types/claimtrail';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { repoUrl } = body;

    if (!repoUrl || typeof repoUrl !== 'string') {
      return NextResponse.json({ error: 'Repository URL is required' }, { status: 400 });
    }

    // Inspect repository
    const result = await inspectPublicGitHubRepo(repoUrl);

    const newSource: EvidenceSourceFile = {
      id: `src-repo-${Date.now()}`,
      name: `github.com/${result.owner}/${result.repo}`,
      type: 'repo',
      typeLabel: 'Public GitHub Repo',
      sizeOrBranch: `branch: ${result.branch}`,
      sha: `SHA: ${result.latestCommitSha}`,
      status: result.inspectedFiles.length > 0 ? 'ready' : 'needs_attention',
      statusLabel: result.inspectedFiles.length > 0 ? 'Ready' : 'Needs Attention',
      extractedTitle: `${result.inspectedFiles.length} code & config files analyzed`,
      extractedProgress: 100,
      extractedNote: `Commit: ${result.latestCommitSha} • ${result.totalFilesScanned} files scanned`,
      linkedCount: result.inspectedFiles.length,
      lastUpdated: 'Just now',
      extractedChunks: result.inspectedFiles.map((f, i) => ({
        id: `chunk-repo-${i + 1}`,
        pageOrFile: f.path,
        section: `Code AST (${f.language})`,
        text: f.content.slice(0, 600),
        confidence: 95.5,
      })),
    };

    const updatedState = updateAssessmentStore((prev) => {
      // Remove any previous source with the same repo name or id
      const filteredSources = prev.sources.filter(
        (s) => s.name !== newSource.name
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
      state: updatedState,
    });
  } catch (error: any) {
    console.error('Error connecting GitHub repo:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error inspecting repository' },
      { status: 500 }
    );
  }
}
