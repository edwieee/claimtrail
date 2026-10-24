import { NextResponse } from 'next/server';
import { getAssessmentStore, updateAssessmentStore, sanitizeStateForClient } from '@/lib/store';

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
    const updated = updateAssessmentStore((prev) => ({
      ...prev,
      ...body,
      updatedAt: new Date().toISOString(),
    }));
    return NextResponse.json(sanitizeStateForClient(updated));
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Failed to update assessment' }, { status: 500 });
  }
}
