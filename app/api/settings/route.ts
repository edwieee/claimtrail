import { NextRequest, NextResponse } from 'next/server';
import { getAssessmentStore, updateAssessmentStore, sanitizeSettingsForClient } from '@/lib/store';
import type { AppSettings } from '@/types/claimtrail';

export async function GET() {
  try {
    const current = getAssessmentStore();
    return NextResponse.json(sanitizeSettingsForClient(current.settings));
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
      const { openaiApiKey: _ignoredOpenAiKey, ...safeBody } = body || {};
      const nextSettings: AppSettings = {
        ...prev.settings,
        ...safeBody,
      };

      return {
        ...prev,
        settings: nextSettings,
        updatedAt: new Date().toISOString(),
      };
    });

    return NextResponse.json({
      success: true,
      settings: sanitizeSettingsForClient(updatedState.settings),
    });
  } catch (err: any) {
    console.error('Settings update error:', err);
    return NextResponse.json(
      { error: err?.message || 'Failed to update settings' },
      { status: 500 }
    );
  }
}
