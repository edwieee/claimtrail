import { NextResponse } from 'next/server';
import { parseXlsxQuestionnaire } from '@/lib/xlsxParser';
import { updateAssessmentStore, saveUploadedBuffer } from '@/lib/store';
import type { EvidenceSourceFile } from '@/types/claimtrail';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const filename = file.name;
    if (!filename.endsWith('.xlsx') && !filename.endsWith('.xls')) {
      return NextResponse.json(
        { error: 'Invalid file format. Please upload an Excel spreadsheet (.xlsx or .xls).' },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Save uploaded original file
    const localPath = saveUploadedBuffer(filename, buffer);

    // Parse Excel workbook
    const parseResult = await parseXlsxQuestionnaire(buffer, filename);

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
        sources: [newSource, ...otherSources],
        updatedAt: new Date().toISOString(),
      };
    });

    return NextResponse.json({
      success: true,
      filename,
      totalQuestions: parseResult.totalQuestions,
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
