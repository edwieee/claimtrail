import { NextRequest, NextResponse } from 'next/server';
import { getAssessmentStore, updateAssessmentStore } from '@/lib/store';
import type { AppSettings } from '@/types/claimtrail';

export async function GET() {
  try {
    const current = getAssessmentStore();
    return NextResponse.json(current.settings);
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || 'Failed to fetch settings' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const updatedState = updateAssessmentStore((prev) => {
      const nextSettings: AppSettings = {
        ...prev.settings,
        ...body,
      };

      return {
        ...prev,
        settings: nextSettings,
        updatedAt: new Date().toISOString(),
      };
    });

    return NextResponse.json({
      success: true,
      settings: updatedState.settings,
    });
  } catch (err: any) {
    console.error('Settings update error:', err);
    return NextResponse.json(
      { error: err?.message || 'Failed to update settings' },
      { status: 500 }
    );
  }
}
