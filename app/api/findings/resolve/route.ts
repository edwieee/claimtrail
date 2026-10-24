import { NextRequest, NextResponse } from 'next/server';
import { updateAssessmentStore } from '@/lib/store';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { findingId, status, notes } = body;

    if (!findingId) {
      return NextResponse.json({ error: 'findingId is required' }, { status: 400 });
    }

    if (!['open', 'reviewed', 'resolved'].includes(status)) {
      return NextResponse.json(
        { error: "status must be 'open', 'reviewed', or 'resolved'" },
        { status: 400 }
      );
    }

    let updatedTargetFinding = null;

    const updatedState = updateAssessmentStore((prev) => {
      const conflicts = prev.conflicts.map((conflict) => {
        if (conflict.id === findingId) {
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

      return {
        ...prev,
        conflicts,
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
