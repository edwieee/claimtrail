import { NextResponse } from 'next/server';
import { createEmptyState, getAssessmentStore, saveAssessmentStore, updateAssessmentStore, sanitizeStateForClient } from '@/lib/store';

export async function GET() {
  try {
    const state = getAssessmentStore();
    return NextResponse.json(sanitizeStateForClient(state));
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Failed to get assessment' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    if (body?.action === 'create') {
      const assessmentName = typeof body.assessmentName === 'string' ? body.assessmentName.trim() : '';
      const framework = typeof body.framework === 'string' ? body.framework.trim() : '';
      if (assessmentName.length < 2 || assessmentName.length > 120) {
        return NextResponse.json({ error: 'Assessment name must be between 2 and 120 characters.' }, { status: 400 });
      }
      if (framework.length > 160) {
        return NextResponse.json({ error: 'Framework must be 160 characters or fewer.' }, { status: 400 });
      }
      const current = getAssessmentStore();
      if (current.assessmentId) {
        return NextResponse.json({ error: 'An active assessment already exists. This workspace will not overwrite persisted assessment data.' }, { status: 409 });
      }
      const created = {
        ...createEmptyState(current.settings),
        assessmentId: `asm-${Date.now()}`,
        assessmentName,
        framework,
      };
      saveAssessmentStore(created);
      return NextResponse.json(sanitizeStateForClient(created), { status: 201 });
    }

    const allowed = ['assessmentName', 'framework'] as const;
    const updates = Object.fromEntries(allowed.filter((key) => typeof body?.[key] === 'string').map((key) => [key, body[key].trim()]));
    const updated = updateAssessmentStore((prev) => ({
      ...prev,
      ...updates,
      updatedAt: new Date().toISOString(),
    }));
    return NextResponse.json(sanitizeStateForClient(updated));
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Failed to update assessment' }, { status: 500 });
  }
}
