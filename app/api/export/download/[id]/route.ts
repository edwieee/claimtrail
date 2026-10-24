import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import { getAssessmentStore, getExportFilePath } from '@/lib/store';
import { generateCompletedQuestionnaireXlsx } from '@/lib/xlsxExporter';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const current = getAssessmentStore();

    // Find in export history
    const deliverable = current.exportHistory.find(
      (e) => e.id === id || e.filename.includes(id)
    );

    let filePath = deliverable ? getExportFilePath(deliverable.filename) : null;
    let filename = deliverable?.filename || `ClaimTrail-Export-${id}.xlsx`;

    let buffer: Buffer;

    if (filePath && fs.existsSync(filePath)) {
      buffer = fs.readFileSync(filePath);
    } else {
      // Generate on-the-fly if not on disk
      const generated = await generateCompletedQuestionnaireXlsx(current.claims, {
        assessmentName: current.assessmentName,
      });
      buffer = generated.buffer;
      filename = generated.filename;
    }

    const response = new NextResponse(new Uint8Array(buffer));
    response.headers.set(
      'Content-Type',
      filename.endsWith('.pdf')
        ? 'application/pdf'
        : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
    response.headers.set(
      'Content-Disposition',
      `attachment; filename="${filename}"`
    );
    return response;
  } catch (err: any) {
    console.error('Download export error:', err);
    return NextResponse.json(
      { error: err?.message || 'Failed to download export file.' },
      { status: 500 }
    );
  }
}
