import { NextResponse } from 'next/server';
import { getAssessmentStore, updateAssessmentStore, sanitizeStateForClient } from '@/lib/store';
import { runDeterministicSecurityChecks } from '@/lib/securityCheckEngine';
import { analyzeConflictEvidence } from '@/lib/conflictAnalyzer';

export async function POST(req: Request) {
  try {
    const current = getAssessmentStore();
    const body = await req.json().catch(() => ({}));
    const requestedClaimId = typeof body?.claimId === 'string' ? body.claimId : undefined;

    if (!current.claims || current.claims.length === 0) {
      return NextResponse.json(
        { error: 'No questionnaire claims available to evaluate.' },
        { status: 400 }
      );
    }

    const selectedClaims = requestedClaimId
      ? current.claims.filter((claim) => claim.id === requestedClaimId || claim.code === requestedClaimId)
      : current.claims;
    if (requestedClaimId && selectedClaims.length === 0) {
      return NextResponse.json({ error: `Question '${requestedClaimId}' not found.` }, { status: 404 });
    }

    const result = runDeterministicSecurityChecks(selectedClaims, current.sources);
    const analysis = analyzeConflictEvidence(selectedClaims, result.mappings, result.findings);

    const updatedState = updateAssessmentStore((prev) => {
      const checkedClaimIds = new Set(selectedClaims.map((claim) => claim.id));
      const retainedResults = (prev.checkResults || []).filter((check) => !checkedClaimIds.has(check.claimId));
      const now = new Date().toISOString();
      const nextFindingIds = new Set(analysis.findings.map((finding) => finding.id));
      const refreshedFindings = (prev.findings || [])
        .filter((finding) => finding.relatedClaimIds.some((claimId) => checkedClaimIds.has(claimId)))
        .filter((finding) => !nextFindingIds.has(finding.id))
        .map((finding) => ({
          ...finding,
          stale: true,
          reviewStatus: ['resolved', 'accepted_risk', 'false_positive'].includes(finding.reviewStatus || '')
            ? finding.reviewStatus
            : 'awaiting_evidence' as const,
          lastUpdatedAt: now,
        }));
      const untouchedFindings = (prev.findings || []).filter(
        (finding) => !finding.relatedClaimIds.some((claimId) => checkedClaimIds.has(claimId))
      );
      const mergedFindings = analysis.findings.map((finding) => {
        const previous = (prev.findings || []).find((item) => item.id === finding.id);
        return {
          ...finding,
          firstDetectedAt: previous?.firstDetectedAt || finding.firstDetectedAt || now,
          lastUpdatedAt: now,
          reviewStatus: previous?.reviewStatus || finding.reviewStatus || 'open',
          reviewNotes: previous?.reviewNotes,
          resolution: previous?.resolution,
          stale: false,
        };
      });

      return {
        ...prev,
        checkResults: [...retainedResults, ...result.results],
        findings: [...untouchedFindings, ...refreshedFindings, ...mergedFindings],
        conflictAnalyses: [
          ...(prev.conflictAnalyses || []).filter((item) => !checkedClaimIds.has(item.claimId)),
          ...analysis.analyses,
        ],
        updatedAt: new Date().toISOString(),
      };
    });

    const findings = updatedState.findings || [];

    return NextResponse.json({
      success: true,
      evaluatedAt: result.checkedAt,
      claimsCount: selectedClaims.length,
      checksCount: result.results.length,
      findingsCount: findings.length,
      needsReviewCount: findings.filter((finding) => finding.status === 'needs_review' || finding.status === 'finding').length,
      insufficientEvidenceCount: findings.filter((finding) => finding.status === 'insufficient_evidence').length,
      state: sanitizeStateForClient(updatedState),
    });
  } catch (err: any) {
    console.error('Evidence evaluation error:', err);
    return NextResponse.json(
      { error: err?.message || 'Failed to evaluate security evidence.' },
      { status: 500 }
    );
  }
}
