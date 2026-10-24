import { NextResponse } from 'next/server';
import { getAssessmentStore, updateAssessmentStore } from '@/lib/store';
import { evaluateSecurityControls } from '@/lib/securityChecker';

export async function POST() {
  try {
    const current = getAssessmentStore();

    if (!current.claims || current.claims.length === 0) {
      return NextResponse.json(
        { error: 'No questionnaire claims available to evaluate.' },
        { status: 400 }
      );
    }

    const result = evaluateSecurityControls(current.claims, current.sources);

    const updatedState = updateAssessmentStore((prev) => {
      // Merge conflicts, avoiding duplicates by id
      const existingConflictIds = new Set(prev.conflicts.map((c) => c.id));
      const newConflicts = result.conflicts.filter((c) => !existingConflictIds.has(c.id));
      const mergedConflicts = [...newConflicts, ...prev.conflicts];

      return {
        ...prev,
        claims: result.updatedClaims,
        conflicts: mergedConflicts,
        updatedAt: new Date().toISOString(),
      };
    });

    return NextResponse.json({
      success: true,
      evaluatedAt: result.evaluatedAt,
      claimsCount: result.updatedClaims.length,
      conflictsCount: updatedState.conflicts.length,
      state: updatedState,
    });
  } catch (err: any) {
    console.error('Evidence evaluation error:', err);
    return NextResponse.json(
      { error: err?.message || 'Failed to evaluate security evidence.' },
      { status: 500 }
    );
  }
}
