import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { parseXlsxQuestionnaire } from '@/lib/xlsxParser';
import { parseSecurityPolicyPdf } from '@/lib/pdfParser';
import { evaluateSecurityControls } from '@/lib/securityChecker';
import { updateAssessmentStore, saveUploadedBuffer } from '@/lib/store';
import type { EvidenceSourceFile, ExportDeliverable } from '@/types/claimtrail';

export async function POST() {
  try {
    const xlsxPath = path.join(process.cwd(), 'public', 'samples', 'AcmeCorp-Security-Assessment-2026.xlsx');
    const pdfPath = path.join(process.cwd(), 'public', 'samples', 'Acme_InfoSec_Policy_v4.2.pdf');

    if (!fs.existsSync(xlsxPath) || !fs.existsSync(pdfPath)) {
      return NextResponse.json({ error: 'Sample files not found on disk.' }, { status: 404 });
    }

    const xlsxBuffer = fs.readFileSync(xlsxPath);
    const pdfBuffer = fs.readFileSync(pdfPath);

    // Save buffers to store uploads
    const savedXlsxPath = saveUploadedBuffer('AcmeCorp-Security-Assessment-2026.xlsx', xlsxBuffer);
    const savedPdfPath = saveUploadedBuffer('Acme_InfoSec_Policy_v4.2.pdf', pdfBuffer);

    // Parse XLSX
    const xlsxResult = await parseXlsxQuestionnaire(xlsxBuffer, 'AcmeCorp-Security-Assessment-2026.xlsx');

    // Parse PDF
    const pdfResult = await parseSecurityPolicyPdf(pdfBuffer, 'Acme_InfoSec_Policy_v4.2.pdf');

    const pdfChunks = pdfResult.chunks.map((c, i) => ({
      id: `chunk-p-${i + 1}`,
      pageOrFile: `Page ${c.pageNumber}`,
      section: c.sectionTitle,
      text: c.text,
      confidence: c.confidence,
    }));

    const sampleSources: EvidenceSourceFile[] = [
      {
        id: 'src-1',
        name: 'AcmeCorp-Security-Assessment-2026.xlsx',
        type: 'xlsx',
        typeLabel: 'Excel Questionnaire',
        sizeOrBranch: `${(xlsxBuffer.length / 1024).toFixed(1)} KB`,
        sha: xlsxResult.sha256,
        status: 'ready',
        statusLabel: 'Ready',
        extractedTitle: `${xlsxResult.claims.length} questions parsed`,
        extractedProgress: 100,
        extractedNote: '(100%)',
        linkedCount: xlsxResult.claims.length,
        lastUpdated: 'Just now',
        localPath: savedXlsxPath,
      },
      {
        id: 'src-2',
        name: 'Acme_InfoSec_Policy_v4.2.pdf',
        type: 'pdf',
        typeLabel: 'PDF Security Policy',
        sizeOrBranch: `${(pdfBuffer.length / 1024).toFixed(1)} KB`,
        sha: pdfResult.sha256,
        status: 'ready',
        statusLabel: 'Ready',
        extractedTitle: `${pdfResult.pagesCount} pages indexed, ${pdfChunks.length} sections mapped`,
        extractedProgress: 100,
        extractedNote: 'Text Conf: 99.8%',
        linkedCount: pdfChunks.length,
        lastUpdated: 'Just now',
        localPath: savedPdfPath,
        extractedChunks: pdfChunks,
      },
      {
        id: 'src-3',
        name: 'github.com/acme/core-api',
        type: 'repo',
        typeLabel: 'Public GitHub Repo',
        sizeOrBranch: 'branch: main',
        sha: 'SHA: 7a21f8 • Unverified commit telemetry',
        status: 'needs_attention',
        statusLabel: 'Needs Attention',
        extractedTitle: '14 Go files analyzed, tenant middleware scanned',
        extractedProgress: 75,
        extractedNote: '1 pattern requires engineer sign-off',
        linkedCount: 12,
        lastUpdated: 'Just now',
        extractedChunks: [
          {
            id: 'chunk-r-1',
            pageOrFile: 'auth/tenant_middleware.go',
            section: 'Lines 42–48',
            text: 'func TenantIsolationMiddleware(next http.Handler) { db.Exec("SET LOCAL app.current_tenant_id = ?", tenantID) }',
            confidence: 94.2,
            linkedQuestionCode: 'SEC-104',
          },
        ],
      },
    ];

    // Evaluate controls against claims
    const evalResult = evaluateSecurityControls(xlsxResult.claims, sampleSources);

    const initialDeliverables: ExportDeliverable[] = [
      {
        id: 'exp-1',
        filename: 'AcmeCorp-Security-Assessment-2026-DRAFT-v0.9.xlsx',
        format: 'XLSX',
        assessment: 'AcmeCorp Enterprise 2026',
        exportedAt: 'Today, 14:12 UTC',
        status: 'Signed Draft',
        isDraft: true,
        sizeBytes: 2457600,
        downloadUrl: '/api/export/download/exp-1',
      },
    ];

    const updatedState = updateAssessmentStore(() => ({
      assessmentId: 'asm-acme-2026',
      assessmentName: 'AcmeCorp Enterprise Security 2026',
      framework: 'SIG Lite 2026 / SOC 2 Type II',
      targetFilename: 'AcmeCorp-Security-Assessment-2026.xlsx',
      originalWorkbookPath: savedXlsxPath,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      claims: evalResult.updatedClaims,
      conflicts: evalResult.conflicts,
      sources: sampleSources,
      exportHistory: initialDeliverables,
      settings: {
        activeModel: 'claude-3-7-sonnet',
        strictVerification: true,
        autoDetectConflicts: true,
        openaiApiKey: process.env.OPENAI_API_KEY || '',
        githubToken: process.env.GITHUB_TOKEN || '',
      },
    }));

    return NextResponse.json({
      success: true,
      message: 'Sample assessment loaded and evaluated with authentic XLSX and PDF.',
      state: updatedState,
    });
  } catch (err: any) {
    console.error('Failed to load sample assessment:', err);
    return NextResponse.json(
      { error: err?.message || 'Failed to load sample assessment.' },
      { status: 500 }
    );
  }
}
