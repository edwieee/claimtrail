import { NextResponse } from 'next/server';
import { parseXlsxQuestionnaire } from '@/lib/xlsxParser';
import { getAssessmentStore, updateAssessmentStore, saveUploadedBuffer } from '@/lib/store';
import type { EvidenceSourceFile } from '@/types/claimtrail';

export async function POST(req: Request) {
  try {
    if (!getAssessmentStore().assessmentId) {
      return NextResponse.json({ error: 'Create an assessment before uploading a questionnaire.' }, { status: 409 });
    }
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const filename = file.name;
    if (!filename.toLowerCase().endsWith('.xlsx')) {
      return NextResponse.json(
        { error: 'Invalid file format. Please upload an Excel questionnaire (.xlsx).' },
        { status: 400 }
      );
    }
    if (file.size === 0) return NextResponse.json({ error: 'The uploaded workbook is empty.' }, { status: 400 });
    if (file.size > 20 * 1024 * 1024) return NextResponse.json({ error: 'The workbook exceeds the 20 MB upload limit.' }, { status: 413 });

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Parse Excel workbook
    const parseResult = await parseXlsxQuestionnaire(buffer, filename);
    if (parseResult.totalQuestions === 0) {
      return NextResponse.json({ error: 'No questionnaire rows were found. Include a Question, Requirement, or Prompt column with at least one item.' }, { status: 422 });
    }
    const localPath = saveUploadedBuffer(filename, buffer);

    // Create source entry
    const newSource: EvidenceSourceFile = {
      id: `src-${Date.now()}`,
      name: filename,
      type: 'xlsx',
      typeLabel: 'Excel Questionnaire',
      sizeOrBranch: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
      sha: parseResult.sha256,
      status: 'ready',
      statusLabel: 'Ready',
      extractedTitle: `${parseResult.totalQuestions} questions parsed`,
      extractedProgress: 100,
      extractedNote: `Sheet: ${parseResult.sheetName}`,
      linkedCount: parseResult.totalQuestions,
      lastUpdated: 'Just now',
      localPath,
    };

    // Update store
    const updatedState = updateAssessmentStore((prev) => {
      // Keep existing sources, replace or append questionnaire source
      const otherSources = prev.sources.filter((s) => s.type !== 'xlsx');
      return {
        ...prev,
        targetFilename: filename,
        originalWorkbookPath: localPath,
        claims: parseResult.claims,
        conflicts: [],
        checkResults: [],
        findings: [],
        conflictAnalyses: [],
        sources: [newSource, ...otherSources],
        updatedAt: new Date().toISOString(),
      };
    });

    return NextResponse.json({
      success: true,
      filename,
      totalQuestions: parseResult.totalQuestions,
      questionsCount: parseResult.totalQuestions,
      claims: parseResult.claims,
      state: updatedState,
    });
  } catch (err: any) {
    console.error('Questionnaire upload error:', err);
    return NextResponse.json(
      { error: err?.message || 'Failed to process Excel questionnaire.' },
      { status: 500 }
    );
  }
}
