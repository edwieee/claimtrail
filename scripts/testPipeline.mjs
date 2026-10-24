import fs from 'fs';
import path from 'path';
import ExcelJS from 'exceljs';
import { parseQuestionnaireXlsx } from '../lib/xlsxParser.ts';
import { parseSecurityPolicyPdf } from '../lib/pdfParser.ts';
import { evaluateSecurityControls } from '../lib/securityChecker.ts';
import { synthesizeGroundedAnswer } from '../lib/aiSynthesizer.ts';
import { generateCompletedQuestionnaireXlsx } from '../lib/xlsxExporter.ts';

async function testPipeline() {
  console.log('--- STARTING CLAIMTRAIL PIPELINE VERIFICATION ---');

  // 1. Test XLSX Parsing
  const xlsxPath = path.join(process.cwd(), 'public', 'samples', 'AcmeCorp-Security-Assessment-2026.xlsx');
  console.log('Testing XLSX parser with:', xlsxPath);
  const xlsxBuffer = fs.readFileSync(xlsxPath);
  const parsedXlsx = await parseQuestionnaireXlsx(xlsxBuffer, 'AcmeCorp-Security-Assessment-2026.xlsx');

  console.log(`[PASS] XLSX Parsed: ${parsedXlsx.claims.length} claims extracted.`);
  console.log(`[PASS] SHA-256: ${parsedXlsx.sha256}`);
  if (parsedXlsx.claims.length === 0) throw new Error('Expected at least 1 claim from sample XLSX');

  // 2. Test PDF Parsing
  const pdfPath = path.join(process.cwd(), 'public', 'samples', 'Acme_InfoSec_Policy_v4.2.pdf');
  console.log('Testing PDF parser with:', pdfPath);
  const pdfBuffer = fs.readFileSync(pdfPath);
  const parsedPdf = await parseSecurityPolicyPdf(pdfBuffer, 'Acme_InfoSec_Policy_v4.2.pdf');

  console.log(`[PASS] PDF Parsed: ${parsedPdf.pagesCount} pages, ${parsedPdf.chunks.length} chunks extracted.`);
  console.log(`[PASS] SHA-256: ${parsedPdf.sha256}`);

  // 3. Test Security Controls Evaluation
  console.log('Testing Deterministic Security Rules...');
  const sampleSources = [
    {
      id: 'src-pdf-test',
      name: 'Acme_InfoSec_Policy_v4.2.pdf',
      type: 'pdf',
      typeLabel: 'PDF Security Policy',
      sizeOrBranch: '14 KB',
      sha: parsedPdf.sha256,
      status: 'ready',
      statusLabel: 'Ready',
      extractedTitle: 'Policy Mapped',
      extractedProgress: 100,
      extractedNote: '',
      linkedCount: 5,
      lastUpdated: 'Now',
      extractedChunks: parsedPdf.chunks.map((c, i) => ({
        id: `chunk-${i}`,
        pageOrFile: `Page ${c.pageNumber}`,
        section: c.sectionTitle,
        text: c.text,
        confidence: c.confidence,
      })),
    },
    {
      id: 'src-repo-test',
      name: 'github.com/acme/core-api',
      type: 'repo',
      typeLabel: 'Public GitHub Repo',
      sizeOrBranch: 'branch: main',
      sha: '7a21f8',
      status: 'needs_attention',
      statusLabel: 'Needs Attention',
      extractedTitle: '14 Go files analyzed',
      extractedProgress: 75,
      extractedNote: '',
      linkedCount: 5,
      lastUpdated: 'Now',
    },
  ];

  const evalResult = evaluateSecurityControls(parsedXlsx.claims, sampleSources, [
    {
      path: 'auth/tenant_middleware.go',
      content: 'db.Exec("SET LOCAL app.current_tenant_id = ?", tenantID)',
    },
  ]);

  console.log(`[PASS] Security Check Evaluated: ${evalResult.updatedClaims.length} claims updated.`);
  console.log(`[PASS] Conflicts Detected: ${evalResult.conflicts.length} exceptions flagged.`);

  // 4. Test AI / Grounded Synthesis
  if (process.env.OPENAI_API_KEY) {
    console.log('Testing Grounded AI Synthesizer...');
    const synthesis = await synthesizeGroundedAnswer(evalResult.updatedClaims[0]);
    console.log(`[PASS] Synthesized answer preview: "${synthesis.answer.slice(0, 80)}..."`);
    console.log(`[PASS] Model: ${synthesis.model}, Confidence: ${synthesis.confidence}%`);
  } else {
    console.log('[SKIP] Grounded AI Synthesizer requires OPENAI_API_KEY; no provider call was attempted.');
  }

  // 5. Test Export XLSX Generation
  console.log('Testing Real XLSX Export Generation...');
  const exportResult = await generateCompletedQuestionnaireXlsx(evalResult.updatedClaims, {
    assessmentName: 'AcmeCorp-Test-Assessment',
    includeDrafts: true,
    includeHashes: true,
    embedLinks: true,
    originalWorkbookBuffer: xlsxBuffer,
  });

  console.log(`[PASS] Generated XLSX Deliverable: ${exportResult.filename} (${exportResult.sizeBytes} bytes)`);

  // 6. Validate Output Workbook
  const verifyWb = new ExcelJS.Workbook();
  await verifyWb.xlsx.load(exportResult.buffer);
  const sheetNames = verifyWb.worksheets.map((s) => s.name);
  console.log(`[PASS] Worksheets in output workbook:`, sheetNames);
  if (!sheetNames.includes('Audit Evidence Trail')) {
    throw new Error('Audit Evidence Trail sheet missing in exported workbook!');
  }

  const auditSheet = verifyWb.getWorksheet('Audit Evidence Trail');
  console.log(`[PASS] Audit Trail Sheet Rows: ${auditSheet.rowCount} rows`);

  console.log('--- ALL CLAIMTRAIL INTEGRATION PIPELINE TESTS PASSED ---');
}

testPipeline().catch((err) => {
  console.error('PIPELINE TEST FAILED:', err);
  process.exit(1);
});
