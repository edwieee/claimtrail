import { NextRequest, NextResponse } from 'next/server';
import { getAssessmentStore, updateAssessmentStore, sanitizeStateForClient } from '@/lib/store';
import { retrieveEvidenceForClaim } from '@/lib/evidenceRetriever';
import { DraftingError, generateEvidenceGroundedDraft } from '@/lib/aiDrafting';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const claimId = typeof body?.claimId === 'string' ? body.claimId : '';
    const model = typeof body?.model === 'string' && body.model.length <= 100 ? body.model : undefined;
    const replace = body?.replace === true;

    const current = getAssessmentStore();
    if (!claimId || claimId === 'all') {
      return NextResponse.json({ error: 'A single claimId is required. Bulk drafting is intentionally disabled.' }, { status: 400 });
    }

    const claim = current.claims.find((item) => item.id === claimId || item.code === claimId);
    if (!claim) return NextResponse.json({ error: `Claim '${claimId}' not found.` }, { status: 404 });

    const existingDraft = claim.answerDraftDetails;
    const hasManualEdit = Boolean(existingDraft && claim.answerDraft && claim.answerDraft !== existingDraft.draftAnswer);
    if (hasManualEdit && !replace) {
      return NextResponse.json({ success: true, claim, state: sanitizeStateForClient(current), preservedManualEdit: true });
    }

    const mapping = retrieveEvidenceForClaim(claim, current.sources, { limit: 8 });
    const findings = (current.findings || []).filter((finding) => finding.relatedClaimIds.includes(claim.id));
    const draft = await generateEvidenceGroundedDraft(claim, mapping, findings, { model });
    const nextVersion = (claim.answerVersion || 0) + 1;
    const previousAnswer = claim.editedAnswer || claim.answerDraft;
    const updatedClaim = {
      ...claim,
      answerDraft: draft.draftAnswer,
      editedAnswer: undefined,
      answerVersion: nextVersion,
      answerHistory: [
        ...(claim.answerHistory || []),
        ...(previousAnswer
          ? [{ version: nextVersion - 1, answer: previousAnswer, source: claim.editedAnswer ? 'human_edit' as const : 'ai' as const, createdAt: new Date().toISOString(), reason: 'Replaced by explicit regeneration.' }]
          : []),
        { version: nextVersion, answer: draft.draftAnswer, source: 'ai' as const, createdAt: draft.generatedAt },
      ],
      answerDraftDetails: draft,
      answerConfidence: undefined,
      reviewStatus: 'needs_review' as const,
      approval: undefined,
      statusDetail: `AI draft generated with ${draft.model}; human review required.`,
    };

    const updatedState = updateAssessmentStore((prev) => ({
      ...prev,
      claims: prev.claims.map((item) => (item.id === claim.id ? updatedClaim : item)),
      updatedAt: new Date().toISOString(),
    }));

    return NextResponse.json({
      success: true,
      claim: updatedClaim,
      state: sanitizeStateForClient(updatedState),
    });
  } catch (err: any) {
    if (err instanceof DraftingError) {
      return NextResponse.json({ error: err.message, code: err.code }, { status: err.status });
    }
    console.error('AI drafting request failed:', err?.message || 'unknown error');
    return NextResponse.json(
      { error: 'Failed to generate an evidence-grounded draft.' },
      { status: 500 }
    );
  }
}
