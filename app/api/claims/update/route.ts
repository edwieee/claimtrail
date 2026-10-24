import { NextRequest, NextResponse } from 'next/server';
import { updateAssessmentStore } from '@/lib/store';
import type { AnswerVersion } from '@/types/claimtrail';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { claimId, answerText, reviewStatus, limitations, reason, reviewer, hasUnresolvedFindingOverride, staleReason } = body;

    if (!claimId) {
      return NextResponse.json({ error: 'claimId is required' }, { status: 400 });
    }

    if (reviewStatus && !['draft', 'approved', 'needs_review', 'rejected', 'stale'].includes(reviewStatus)) {
      return NextResponse.json({ error: 'Invalid answer review status.' }, { status: 400 });
    }

    let updatedTargetClaim = null;

    const updatedState = updateAssessmentStore((prev) => {
      const claims = prev.claims.map((claim) => {
        if (claim.id === claimId || claim.code === claimId) {
          const hasAnswerText = typeof answerText === 'string';
          const nextVersion = (claim.answerVersion || 0) + (hasAnswerText ? 1 : 0);
          const reviewerName = typeof reviewer === 'string' && reviewer.trim() ? reviewer.trim() : 'Security Reviewer';
          const historyEntry: AnswerVersion | null = hasAnswerText
            ? {
                version: nextVersion,
                answer: answerText,
                source: 'human_edit',
                createdAt: new Date().toISOString(),
                reviewer: reviewerName,
                reason: typeof reason === 'string' ? reason.trim() : undefined,
              }
            : null;
          const updated = {
            ...claim,
            ...(hasAnswerText
              ? {
                  editedAnswer: answerText,
                  answerVersion: nextVersion,
                  answerHistory: [...(claim.answerHistory || []), historyEntry as AnswerVersion],
                  reviewStatus: 'needs_review' as const,
                  approval: undefined,
                  staleReason: undefined,
                }
              : {}),
            ...(reviewStatus === 'approved'
              ? {
                  reviewStatus: 'approved' as const,
                  staleReason: undefined,
                  approval: {
                    status: 'approved' as const,
                    version: claim.answerVersion || nextVersion || 1,
                    decidedAt: new Date().toISOString(),
                    reason: typeof reason === 'string' ? reason.trim() || undefined : undefined,
                    reviewer: reviewerName,
                    hasUnresolvedFindingOverride: Boolean(hasUnresolvedFindingOverride),
                  },
                }
              : reviewStatus === 'rejected'
              ? {
                  reviewStatus: 'rejected' as const,
                  approval: {
                    status: 'rejected' as const,
                    version: claim.answerVersion || nextVersion || 1,
                    decidedAt: new Date().toISOString(),
                    reason: typeof reason === 'string' ? reason.trim() || undefined : undefined,
                    reviewer: reviewerName,
                  },
                }
              : reviewStatus === 'stale'
              ? {
                  reviewStatus: 'stale' as const,
                  staleReason: typeof staleReason === 'string' ? staleReason : typeof reason === 'string' ? reason : 'Evidence updated or conflicting finding detected.',
                  approval: undefined,
                }
              : reviewStatus === 'needs_review' || reviewStatus === 'draft'
              ? {
                  reviewStatus,
                  approval: undefined,
                }
              : {}),
            ...(limitations !== undefined ? { limitations } : {}),
          };
          updatedTargetClaim = updated;
          return updated;
        }
        return claim;
      });

      return {
        ...prev,
        claims,
        updatedAt: new Date().toISOString(),
      };
    });

    if (!updatedTargetClaim) {
      return NextResponse.json({ error: `Claim '${claimId}' not found.` }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      claim: updatedTargetClaim,
      state: updatedState,
    });
  } catch (err: any) {
    console.error('Update claim error:', err);
    return NextResponse.json(
      { error: err?.message || 'Failed to update claim' },
      { status: 500 }
    );
  }
}
