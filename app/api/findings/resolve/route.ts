import { NextRequest, NextResponse } from 'next/server';
import { updateAssessmentStore } from '@/lib/store';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { findingId, status, notes } = body;

    if (!findingId) {
      return NextResponse.json({ error: 'findingId is required' }, { status: 400 });
    }

    const allowedStatuses = ['open', 'in_review', 'awaiting_evidence', 'resolved', 'accepted_risk', 'false_positive'];
    if (!allowedStatuses.includes(status)) {
      return NextResponse.json(
        { error: 'Invalid review status.' },
        { status: 400 }
      );
    }

    if (['resolved', 'accepted_risk', 'false_positive'].includes(status) && (!notes || typeof notes !== 'string' || !notes.trim())) {
      return NextResponse.json({ error: 'A resolution reason is required for this status.' }, { status: 400 });
    }

    let updatedTargetFinding = null;

    const updatedState = updateAssessmentStore((prev) => {
      const conflicts = prev.conflicts.map((conflict) => {
        if (conflict.id === findingId) {
          if (!['open', 'reviewed', 'resolved'].includes(status)) return conflict;
          const updated = {
            ...conflict,
            status: status as 'open' | 'reviewed' | 'resolved',
            ...(notes ? { notes } : {}),
          };
          updatedTargetFinding = updated;
          return updated;
        }
        return conflict;
      });

      const findings = (prev.findings || []).map((finding) => {
        if (finding.id === findingId) {
          const updated = {
            ...finding,
            reviewStatus: status as typeof finding.reviewStatus,
            reviewNotes: notes?.trim() || finding.reviewNotes,
            ...(status === 'resolved' || status === 'accepted_risk' || status === 'false_positive'
              ? {
                  resolution: {
                    status: status as 'resolved' | 'accepted_risk' | 'false_positive',
                    reason: notes.trim(),
                    resolvedAt: new Date().toISOString(),
                  },
                }
              : {}),
            lastUpdatedAt: new Date().toISOString(),
          };
          updatedTargetFinding = updated;
          return updated;
        }
        return finding;
      });

      return {
        ...prev,
        conflicts,
        findings,
        updatedAt: new Date().toISOString(),
      };
    });

    if (!updatedTargetFinding) {
      return NextResponse.json({ error: `Finding '${findingId}' not found.` }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      finding: updatedTargetFinding,
      state: updatedState,
    });
  } catch (err: any) {
    console.error('Resolve finding error:', err);
    return NextResponse.json(
      { error: err?.message || 'Failed to update finding status' },
      { status: 500 }
    );
  }
}
