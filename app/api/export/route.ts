import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import { getAssessmentStore, updateAssessmentStore, saveExportBuffer } from '@/lib/store';
import { generateCompletedQuestionnaireXlsx } from '@/lib/xlsxExporter';
import type { ExportDeliverable } from '@/types/claimtrail';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const {
      format = 'XLSX',
      includeDrafts = true,
      includeHashes = true,
      embedLinks = true,
    } = body;

    const current = getAssessmentStore();
    if (format !== 'XLSX' && format !== 'xlsx') {
      return NextResponse.json({ error: 'Only XLSX questionnaire export is currently implemented.' }, { status: 400 });
    }

    const blockedClaims = current.claims.filter((claim) => {
      const approved = claim.reviewStatus === 'approved' && (!claim.approval || claim.approval.status === 'approved');
      return !approved || claim.reviewStatus === 'stale' || claim.reviewStatus === 'rejected' || claim.answerDraftDetails?.evidenceStatus === 'insufficient_evidence';
    });
    if (!includeDrafts && blockedClaims.length > 0) {
      return NextResponse.json({
        error: 'Final export is not ready. Review or explicitly resolve all pending answers first.',
        code: 'export_not_ready',
        blockedClaims: blockedClaims.map((claim) => ({ id: claim.id, code: claim.code, reviewStatus: claim.reviewStatus || 'draft' })),
      }, { status: 409 });
    }

    let originalBuffer: Buffer | null = null;
    if (current.originalWorkbookPath && fs.existsSync(current.originalWorkbookPath)) {
      try {
        originalBuffer = fs.readFileSync(current.originalWorkbookPath);
      } catch (err) {
        console.warn('Failed reading original workbook file:', err);
      }
    }

    const exportResult = await generateCompletedQuestionnaireXlsx(current.claims, {
      assessmentName: current.assessmentName || 'AcmeCorp-Security-Assessment-2026',
      includeDrafts,
      includeHashes,
      embedLinks,
      originalWorkbookBuffer: originalBuffer,
    });

    // Persist exported file to disk for instant downloads
    saveExportBuffer(exportResult.filename, exportResult.buffer);

    const exportId = `exp-${Date.now()}`;
    const newDeliverable: ExportDeliverable = {
      id: exportId,
      filename: exportResult.filename,
      format: 'XLSX',
      assessment: current.assessmentName || 'AcmeCorp Enterprise 2026',
      exportedAt: new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
      status: blockedClaims.length === 0 ? 'Final Auditor Signed' : 'Signed Draft',
      isDraft: blockedClaims.length > 0,
      sizeBytes: exportResult.sizeBytes,
      downloadUrl: `/api/export/download/${exportId}`,
    };

    const updatedState = updateAssessmentStore((prev) => ({
      ...prev,
      exportHistory: [newDeliverable, ...prev.exportHistory],
      updatedAt: new Date().toISOString(),
    }));

    // If client requested download directly
    const url = new URL(req.url);
    if (url.searchParams.get('download') === 'true') {
      const response = new NextResponse(new Uint8Array(exportResult.buffer));
      response.headers.set(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      );
      response.headers.set(
        'Content-Disposition',
        `attachment; filename="${exportResult.filename}"`
      );
      return response;
    }

    return NextResponse.json({
      success: true,
      deliverable: newDeliverable,
      state: updatedState,
    });
  } catch (err: any) {
    console.error('Export error:', err);
    return NextResponse.json(
      { error: err?.message || 'Failed to generate export file.' },
      { status: 500 }
    );
  }
}
