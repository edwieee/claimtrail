import { NextRequest, NextResponse } from 'next/server';
import { getAssessmentStore } from '@/lib/store';
import { retrieveEvidenceForClaim, retrieveEvidenceForClaims } from '@/lib/evidenceRetriever';

export async function GET(request: NextRequest) {
  try {
    const state = getAssessmentStore();
    const claimId = request.nextUrl.searchParams.get('claimId');
    const all = request.nextUrl.searchParams.get('all') === 'true';
    const requestedLimit = Number(request.nextUrl.searchParams.get('limit') || 6);
    const limit = Number.isFinite(requestedLimit) ? Math.min(Math.max(requestedLimit, 1), 10) : 6;

    if (claimId && typeof claimId !== 'string') {
      return NextResponse.json({ error: 'Invalid claimId.' }, { status: 400 });
    }

    if (claimId) {
      const claim = state.claims.find((item) => item.id === claimId || item.code === claimId);
      if (!claim) return NextResponse.json({ error: `Question '${claimId}' not found.` }, { status: 404 });
      return NextResponse.json({ mapping: retrieveEvidenceForClaim(claim, state.sources, { limit }) });
    }

    if (!all) {
      return NextResponse.json({ error: 'Provide a claimId or all=true.' }, { status: 400 });
    }

    return NextResponse.json({ mappings: retrieveEvidenceForClaims(state.claims, state.sources, { limit }) });
  } catch (error: any) {
    console.error('Evidence retrieval error:', error?.message || error);
    return NextResponse.json({ error: 'Failed to retrieve questionnaire evidence.' }, { status: 500 });
  }
}