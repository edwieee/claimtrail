import { NextRequest, NextResponse } from 'next/server';
import { updateAssessmentStore } from '@/lib/store';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { claimId, answerText, reviewStatus, limitations } = body;

    if (!claimId) {
      return NextResponse.json({ error: 'claimId is required' }, { status: 400 });
    }

    let updatedTargetClaim = null;

    const updatedState = updateAssessmentStore((prev) => {
      const claims = prev.claims.map((claim) => {
        if (claim.id === claimId || claim.code === claimId) {
          const updated = {
            ...claim,
            ...(answerText !== undefined ? { answerDraft: answerText } : {}),
            ...(reviewStatus !== undefined ? { reviewStatus } : {}),
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
