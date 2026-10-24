import { NextRequest, NextResponse } from 'next/server';
import { getAssessmentStore, updateAssessmentStore } from '@/lib/store';
import { synthesizeGroundedAnswer } from '@/lib/aiSynthesizer';
import type { SecurityClaim } from '@/types/claimtrail';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { claimId, model } = body;

    const current = getAssessmentStore();
    const apiKey = current.settings?.openaiApiKey;

    if (claimId && claimId !== 'all') {
      const claim = current.claims.find((c) => c.id === claimId || c.code === claimId);
      if (!claim) {
        return NextResponse.json({ error: `Claim '${claimId}' not found.` }, { status: 404 });
      }

      const synthesis = await synthesizeGroundedAnswer(claim, {
        apiKey,
        model: model || current.settings?.activeModel,
      });

      const updatedClaim: SecurityClaim = {
        ...claim,
        answerDraft: synthesis.answer,
        answerConfidence: synthesis.confidence,
        statusDetail: `AI Synthesized with ${synthesis.model} (${synthesis.sourcesCount} verified sources)`,
      };

      const updatedState = updateAssessmentStore((prev) => ({
        ...prev,
        claims: prev.claims.map((c) => (c.id === claim.id ? updatedClaim : c)),
        updatedAt: new Date().toISOString(),
      }));

      return NextResponse.json({
        success: true,
        claim: updatedClaim,
        state: updatedState,
      });
    }

    // Synthesize for all claims
    const updatedClaims: SecurityClaim[] = [];
    for (const claim of current.claims) {
      const synthesis = await synthesizeGroundedAnswer(claim, {
        apiKey,
        model: model || current.settings?.activeModel,
      });
      updatedClaims.push({
        ...claim,
        answerDraft: synthesis.answer,
        answerConfidence: synthesis.confidence,
        statusDetail: `AI Synthesized with ${synthesis.model} (${synthesis.sourcesCount} verified sources)`,
      });
    }

    const updatedState = updateAssessmentStore((prev) => ({
      ...prev,
      claims: updatedClaims,
      updatedAt: new Date().toISOString(),
    }));

    return NextResponse.json({
      success: true,
      count: updatedClaims.length,
      claims: updatedClaims,
      state: updatedState,
    });
  } catch (err: any) {
    console.error('AI synthesis error:', err);
    return NextResponse.json(
      { error: err?.message || 'Failed to synthesize answer.' },
      { status: 500 }
    );
  }
}
