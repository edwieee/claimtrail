import { NextResponse } from 'next/server';
import { parseSecurityPolicyPdf } from '@/lib/pdfParser';
import { updateAssessmentStore, saveUploadedBuffer } from '@/lib/store';
import type { EvidenceSourceFile } from '@/types/claimtrail';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No PDF file uploaded' }, { status: 400 });
    }

    const filename = file.name;
    if (!filename.toLowerCase().endsWith('.pdf')) {
      return NextResponse.json(
        { error: 'Invalid file format. Please upload a PDF document.' },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Save uploaded file locally
    const localPath = saveUploadedBuffer(filename, buffer);

    // Parse PDF text & chunk by sections
    const parseResult = await parseSecurityPolicyPdf(buffer, filename);

    // Map extracted chunks
    const chunks = parseResult.chunks.map((c, i) => ({
      id: `chunk-pdf-${i + 1}`,
      pageOrFile: `Page ${c.pageNumber}`,
      section: c.sectionTitle,
      text: c.text,
      confidence: c.confidence,
    }));

    const newSource: EvidenceSourceFile = {
      id: `src-pdf-${Date.now()}`,
      name: filename,
      type: 'pdf',
      typeLabel: 'PDF Security Policy',
      sizeOrBranch: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
      sha: parseResult.sha256,
      status: 'ready',
      statusLabel: 'Ready',
      extractedTitle: `${parseResult.pagesCount} pages indexed, ${chunks.length} sections mapped`,
      extractedProgress: 100,
      extractedNote: `SHA: ${parseResult.sha256.slice(0, 8)}…`,
      linkedCount: chunks.length,
      lastUpdated: 'Just now',
      localPath,
      extractedChunks: chunks,
    };

    const updatedState = updateAssessmentStore((prev) => {
      const otherSources = prev.sources.filter((s) => s.type !== 'pdf');
      return {
        ...prev,
        sources: [...otherSources, newSource],
        updatedAt: new Date().toISOString(),
      };
    });

    return NextResponse.json({
      success: true,
      filename,
      pagesCount: parseResult.pagesCount,
      chunksCount: chunks.length,
      source: newSource,
      state: updatedState,
    });
  } catch (err: any) {
    console.error('PDF upload error:', err);
    return NextResponse.json(
      { error: err?.message || 'Failed to parse and extract PDF security policy.' },
      { status: 500 }
    );
  }
}
