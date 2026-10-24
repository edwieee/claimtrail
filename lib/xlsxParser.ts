import ExcelJS from 'exceljs';
import crypto from 'crypto';
import type { SecurityClaim } from '@/types/claimtrail';

export interface ParseXlsxResult {
  claims: SecurityClaim[];
  sheetName: string;
  totalRows: number;
  totalQuestions: number;
  sha256: string;
}

export async function parseXlsxQuestionnaire(
  buffer: Buffer,
  originalFilename: string
): Promise<ParseXlsxResult> {
  const sha256 = crypto.createHash('sha256').update(buffer).digest('hex');

  const workbook = new ExcelJS.Workbook();
  // ExcelJS accepts buffer directly in load()
  await workbook.xlsx.load(buffer as any);

  if (workbook.worksheets.length === 0) {
    throw new Error('Uploaded Excel workbook contains no worksheets.');
  }

  // Find most likely questionnaire sheet
  let targetSheet = workbook.worksheets[0];
  const priorityNames = [/question/i, /assessment/i, /caiq/i, /sig/i, /controls/i];
  for (const sheet of workbook.worksheets) {
    if (priorityNames.some((re) => re.test(sheet.name))) {
      targetSheet = sheet;
      break;
    }
  }

  let idCol = -1;
  let catCol = -1;
  let qCol = -1;
  let aCol = -1;
  let headerRowIndex = -1;

  // Scan first 15 rows to find header row
  const maxHeaderSearchRow = Math.min(15, targetSheet.rowCount);
  for (let r = 1; r <= maxHeaderSearchRow; r++) {
    const row = targetSheet.getRow(r);
    let matchedInRow = 0;

    row.eachCell((cell, colNumber) => {
      const text = cell.text ? cell.text.trim().toLowerCase() : '';
      if (!text) return;

      if (/^(id|code|q_id|question_id|item|ref|control_id|#|number)/i.test(text) && idCol === -1) {
        idCol = colNumber;
        matchedInRow++;
      } else if (/^(category|domain|section|family|pillar|module)/i.test(text) && catCol === -1) {
        catCol = colNumber;
        matchedInRow++;
      } else if (/^(question|requirement|prompt|claim|control_text|description)/i.test(text) && qCol === -1) {
        qCol = colNumber;
        matchedInRow++;
      } else if (/^(vendor_response|vendor_answer|response|answer|comment|status)/i.test(text) && aCol === -1) {
        aCol = colNumber;
        matchedInRow++;
      }
    });

    if (qCol !== -1 && (idCol !== -1 || catCol !== -1 || matchedInRow >= 2)) {
      headerRowIndex = r;
      break;
    }
  }

  // Fallback defaults if headers were not explicitly identified
  if (headerRowIndex === -1) {
    headerRowIndex = 1;
    idCol = 1;
    catCol = 2;
    qCol = 3;
    aCol = 4;
  } else {
    if (idCol === -1) idCol = 1;
    if (qCol === -1) qCol = 2;
    if (catCol === -1) catCol = 3;
    if (aCol === -1) aCol = 4;
  }

  const claims: SecurityClaim[] = [];
  const startRow = headerRowIndex + 1;

  for (let r = startRow; r <= targetSheet.rowCount; r++) {
    const row = targetSheet.getRow(r);
    const qCellText = row.getCell(qCol).text?.trim();

    // Skip empty question rows
    if (!qCellText || qCellText.length < 5) {
      continue;
    }

    const idCellText = row.getCell(idCol).text?.trim() || `Q-${100 + claims.length + 1}`;
    const catCellText = row.getCell(catCol).text?.trim() || 'General Security';
    const aCellText = row.getCell(aCol).text?.trim() || '';

    const claimId = `claim-parsed-${claims.length + 1}`;
    const cleanCode = idCellText.length <= 16 ? idCellText : `Q-${100 + claims.length + 1}`;

    const newClaim: SecurityClaim = {
      id: claimId,
      code: cleanCode,
      category: catCellText,
      question: qCellText,
      vendorDraftAnswer:
        aCellText ||
        'Vendor compliance controls are actively enforced and documented in corporate information security policies.',
      status: aCellText ? 'green' : 'amber',
      statusDetail: aCellText ? 'Imported from workbook response' : 'Pending evidence evaluation',
      limitations: 'Requires automated source evidence inspection.',
      primarySourcePath: originalFilename,
      linePageRef: `Row ${r}, Col ${qCol}`,
      verifiedTimestamp: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC',
      signalsCount: { supporting: aCellText ? 1 : 0, conflicting: 0, pending: 1 },
      sheetName: targetSheet.name,
      rowNumber: r,
      questionCol: qCol,
      answerCol: aCol,
      reviewStatus: aCellText ? 'approved' : 'draft',
      nodes: [
        {
          id: `node-${claimId}`,
          type: 'claim',
          title: `${cleanCode}: ${qCellText.slice(0, 40)}...`,
          sourceLabel: 'QUESTIONNAIRE (XLSX)',
          pathOrReference: originalFilename,
          lineOrPageRef: `Row ${r}`,
          snippet: qCellText,
          status: aCellText ? 'green' : 'amber',
          statusText: aCellText ? 'Imported Answer' : 'Pending Review',
          confidence: aCellText ? 90 : 50,
        },
      ],
      links: [],
    };

    claims.push(newClaim);
  }

  return {
    claims,
    sheetName: targetSheet.name,
    totalRows: targetSheet.rowCount,
    totalQuestions: claims.length,
    sha256,
  };
}
