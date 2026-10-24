import ExcelJS from 'exceljs';
import crypto from 'crypto';
import JSZip from 'jszip';
import { createRequire } from 'module';
import type { SecurityClaim } from '@/types/claimtrail';

const cjsRequire = typeof require !== 'undefined' ? require : createRequire(import.meta.url);

// ---------------------------------------------------------------------------
// 1. ExcelJS Reconcile Safety Patch
// Fixes ExcelJS runtime bug: Cannot read properties of undefined (reading 'comments')
// occurs when worksheet rels point to comments/vmlDrawings that are not found in options
// ---------------------------------------------------------------------------
let isPatched = false;
export function ensureExcelJSSafeReconcile() {
  if (isPatched) return;
  try {
    const WorksheetXform = cjsRequire('exceljs/lib/xlsx/xform/sheet/worksheet-xform');
    const RelType = cjsRequire('exceljs/lib/xlsx/rel-type');

    if (WorksheetXform?.prototype && !WorksheetXform.prototype._claimtrail_patched) {
      WorksheetXform.prototype.reconcile = function safeReconcile(model: any, options: any) {
        options = options || {};
        options.comments = options.comments || {};
        options.vmlDrawings = options.vmlDrawings || {};
        options.tables = options.tables || {};
        options.drawings = options.drawings || {};

        const rels = (model.relationships || []).reduce((h: any, rel: any) => {
          h[rel.Id] = rel;
          if (rel.Type === RelType.Comments) {
            let commentEntry = options.comments[rel.Target];
            if (!commentEntry) {
              const targetClean = (rel.Target || '').replace(/^\/?(xl\/)?(\.\.\/)?/, '');
              for (const [key, val] of Object.entries(options.comments)) {
                const keyClean = key.replace(/^\/?(xl\/)?(\.\.\/)?/, '');
                if (keyClean === targetClean || keyClean.endsWith(targetClean) || targetClean.endsWith(keyClean)) {
                  commentEntry = val;
                  break;
                }
              }
            }
            if (commentEntry && commentEntry.comments) {
              model.comments = commentEntry.comments;
            } else {
              model.comments = [];
            }
          }
          if (rel.Type === RelType.VmlDrawing && model.comments && model.comments.length) {
            let vmlEntry = options.vmlDrawings[rel.Target];
            if (!vmlEntry) {
              const targetClean = (rel.Target || '').replace(/^\/?(xl\/)?(\.\.\/)?/, '');
              for (const [key, val] of Object.entries(options.vmlDrawings)) {
                const keyClean = key.replace(/^\/?(xl\/)?(\.\.\/)?/, '');
                if (keyClean === targetClean || keyClean.endsWith(targetClean) || targetClean.endsWith(keyClean)) {
                  vmlEntry = val;
                  break;
                }
              }
            }
            if (vmlEntry && vmlEntry.comments) {
              const vmlComment = vmlEntry.comments;
              model.comments.forEach((comment: any, index: number) => {
                if (comment && vmlComment[index]) {
                  comment.note = Object.assign({}, comment.note, vmlComment[index]);
                }
              });
            }
          }
          return h;
        }, {});

        options.commentsMap = (model.comments || []).reduce((h: any, comment: any) => {
          if (comment && comment.ref) {
            h[comment.ref] = comment;
          }
          return h;
        }, {});

        options.hyperlinkMap = (model.hyperlinks || []).reduce((h: any, hyperlink: any) => {
          if (hyperlink && hyperlink.rId && rels[hyperlink.rId]) {
            h[hyperlink.address] = rels[hyperlink.rId].Target;
          }
          return h;
        }, {});

        options.formulae = options.formulae || {};

        model.rows = (model.rows && model.rows.filter(Boolean)) || [];
        model.rows.forEach((row: any) => {
          row.cells = (row.cells && row.cells.filter(Boolean)) || [];
        });

        this.map.cols.reconcile(model.cols, options);
        this.map.sheetData.reconcile(model.rows, options);
        this.map.conditionalFormatting.reconcile(model.conditionalFormattings, options);

        model.media = [];
        if (model.drawing && rels[model.drawing.rId]) {
          const drawingRel = rels[model.drawing.rId];
          if (drawingRel && drawingRel.Target) {
            const match = drawingRel.Target.match(/\/drawings\/([a-zA-Z0-9]+)[.][a-zA-Z]{3,4}$/);
            if (match) {
              const drawingName = match[1];
              const drawing = options.drawings[drawingName];
              if (drawing && drawing.anchors) {
                drawing.anchors.forEach((anchor: any) => {
                  if (anchor.medium) {
                    model.media.push({
                      type: 'image',
                      imageId: anchor.medium.index,
                      range: anchor.range,
                      hyperlinks: anchor.picture?.hyperlinks,
                    });
                  }
                });
              }
            }
          }
        }

        const backgroundRel = model.background && rels[model.background.rId];
        if (backgroundRel) {
          const target = backgroundRel.Target.split('/media/')[1];
          const imageId = options.mediaIndex && options.mediaIndex[target];
          if (imageId !== undefined) {
            model.media.push({
              type: 'background',
              imageId,
            });
          }
        }

        model.tables = (model.tables || []).map((tablePart: any) => {
          const rel = rels[tablePart.rId];
          return rel && options.tables ? options.tables[rel.Target] : undefined;
        }).filter(Boolean);

        delete model.relationships;
        delete model.hyperlinks;
        delete model.comments;
      };
      WorksheetXform.prototype._claimtrail_patched = true;
      isPatched = true;
    }
  } catch (err) {
    console.warn('Could not patch ExcelJS WorksheetXform:', err);
  }
}

// Ensure patch is applied immediately on import
ensureExcelJSSafeReconcile();

// ---------------------------------------------------------------------------
// 2. Extract cell comments directly from XLSX XML
// ---------------------------------------------------------------------------
export async function extractCommentsFromBuffer(buffer: Buffer): Promise<Record<string, string>> {
  const commentMap: Record<string, string> = {};
  try {
    const zip = await JSZip.loadAsync(buffer);
    for (const [name, file] of Object.entries(zip.files)) {
      if (name.includes('comment') && name.endsWith('.xml')) {
        const xml = await file.async('string');
        const commentRegex = /<comment\s+[^>]*ref="([A-Z0-9]+)"[^>]*>([\s\S]*?)<\/comment>/gi;
        let match;
        while ((match = commentRegex.exec(xml)) !== null) {
          const ref = match[1];
          const body = match[2];
          const textParts: string[] = [];
          const tRegex = /<t[^>]*>([\s\S]*?)<\/t>/gi;
          let tMatch;
          while ((tMatch = tRegex.exec(body)) !== null) {
            const clean = tMatch[1].replace(/<[^>]+>/g, '').trim();
            if (clean) textParts.push(clean);
          }
          if (textParts.length > 0) {
            commentMap[ref] = textParts.join(' ');
          }
        }
      }
    }
  } catch (err) {
    console.warn('extractCommentsFromBuffer warning:', err);
  }
  return commentMap;
}

// ---------------------------------------------------------------------------
// 3. Helper to read comment from cell or commentsMap safely
// ---------------------------------------------------------------------------
export function getSafeCellComment(
  cell: ExcelJS.Cell | null | undefined,
  commentsMap?: Record<string, string>
): string | undefined {
  if (!cell) return undefined;

  // 1. Check ExcelJS cell.note
  const note = (cell as any).note;
  if (note) {
    if (typeof note === 'string' && note.trim()) return note.trim();
    if (typeof note === 'object') {
      if (Array.isArray(note.texts) && note.texts.length > 0) {
        const joined = note.texts
          .map((t: any) => (typeof t === 'string' ? t : t?.text || ''))
          .join('')
          .trim();
        if (joined) return joined;
      }
      if (note.text && typeof note.text === 'string' && note.text.trim()) {
        return note.text.trim();
      }
    }
  }

  // 2. Check optional .comment or .comments defensively
  const c = (cell as any).comment || (cell as any).comments;
  if (c) {
    if (typeof c === 'string' && c.trim()) return c.trim();
    if (typeof c === 'object') {
      if (Array.isArray(c.texts)) {
        const joined = c.texts
          .map((t: any) => (typeof t === 'string' ? t : t?.text || ''))
          .join('')
          .trim();
        if (joined) return joined;
      }
      if (c.text && typeof c.text === 'string' && c.text.trim()) return c.text.trim();
    }
  }

  // 3. Fallback to XML commentsMap by cell address
  if (cell.address && commentsMap && commentsMap[cell.address]) {
    return commentsMap[cell.address];
  }

  return undefined;
}

// ---------------------------------------------------------------------------
// 4. Safe Workbook Loader (with fallback zip normalization)
// ---------------------------------------------------------------------------
export async function safeLoadWorkbook(buffer: Buffer): Promise<ExcelJS.Workbook> {
  ensureExcelJSSafeReconcile();

  const workbook = new ExcelJS.Workbook();
  try {
    await workbook.xlsx.load(buffer as any);
    return workbook;
  } catch (err: any) {
    console.warn('Direct ExcelJS load encountered issue, attempting normalized zip load:', err?.message);
    try {
      const zip = await JSZip.loadAsync(buffer);
      // Ensure standard comment and drawing file aliases exist in zip
      let commentIdx = 1;
      for (const [name, file] of Object.entries(zip.files)) {
        const cMatch = name.match(/^xl\/(?:comments\/)?comment(\d*)\.xml$/i);
        if (cMatch) {
          const stdName = `xl/comments${cMatch[1] || commentIdx}.xml`;
          if (name !== stdName && !zip.file(stdName)) {
            zip.file(stdName, await file.async('nodebuffer'));
          }
          commentIdx++;
        }
        const vMatch = name.match(/^xl\/drawings\/(?:commentsDrawing|drawing)(\d*)\.vml$/i);
        if (vMatch) {
          const stdVml = `xl/drawings/vmlDrawing${vMatch[1] || 1}.vml`;
          if (name !== stdVml && !zip.file(stdVml)) {
            zip.file(stdVml, await file.async('nodebuffer'));
          }
        }
      }

      for (const [name, file] of Object.entries(zip.files)) {
        if (name.includes('worksheets/_rels/') && name.endsWith('.rels')) {
          let text = await file.async('string');
          text = text.replace(/Target="\/xl\//g, 'Target="../');
          text = text.replace(/Target="\.\.\/comments\/comment(\d*)\.xml"/g, 'Target="../comments$1.xml"');
          text = text.replace(/Target="\.\.\/drawings\/commentsDrawing(\d*)\.vml"/g, 'Target="../drawings/vmlDrawing$1.vml"');
          zip.file(name, text);
        }
      }
      const cleanBuffer = await zip.generateAsync({ type: 'nodebuffer', compression: 'DEFLATE' });
      const fallbackWb = new ExcelJS.Workbook();
      await fallbackWb.xlsx.load(cleanBuffer as any);
      return fallbackWb;
    } catch {
      // Final fallback: strip comment and vmlDrawing relationships to guarantee clean questions load
      const zip = await JSZip.loadAsync(buffer);
      for (const [name, file] of Object.entries(zip.files)) {
        if (name.includes('_rels') && name.endsWith('.rels')) {
          let text = await file.async('string');
          text = text.replace(/<Relationship[^>]*Type="[^"]*(?:comments|vmlDrawing)"[^>]*\/>/gi, '');
          text = text.replace(/Target="\/xl\//g, 'Target="../');
          zip.file(name, text);
        }
      }
      const strippedBuffer = await zip.generateAsync({ type: 'nodebuffer', compression: 'DEFLATE' });
      const strippedWb = new ExcelJS.Workbook();
      await strippedWb.xlsx.load(strippedBuffer as any);
      return strippedWb;
    }
  }
}

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

  // Extract comments safely from buffer
  const commentsMap = await extractCommentsFromBuffer(buffer);

  // Safely load workbook
  const workbook = await safeLoadWorkbook(buffer);

  if (!workbook.worksheets || workbook.worksheets.length === 0) {
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
  const maxHeaderSearchRow = Math.min(15, targetSheet.rowCount || 0);
  for (let r = 1; r <= maxHeaderSearchRow; r++) {
    const row = targetSheet.getRow(r);
    let matchedInRow = 0;

    row.eachCell((cell, colNumber) => {
      const text = cell.text ? cell.text.trim().toLowerCase() : '';
      if (!text) return;

      if (
        /^(id|code|q_id|question_id|question\s*id|item|ref|control_id|control\s*id|#|number)$/i.test(text) ||
        (/id$/i.test(text) && !/guidance/i.test(text))
      ) {
        if (idCol === -1) {
          idCol = colNumber;
          matchedInRow++;
        }
      } else if (
        /^(category|domain|security\s*domain|section|family|pillar|module)/i.test(text) &&
        catCol === -1
      ) {
        catCol = colNumber;
        matchedInRow++;
      } else if (
        /^(question|requirement|prompt|claim|control_text|description|questionnaire\s*requirement)/i.test(text) &&
        !/id$/i.test(text) &&
        qCol === -1
      ) {
        qCol = colNumber;
        matchedInRow++;
      } else if (
        /^(vendor_response|vendor_answer|response|answer|vendor\s*response|technical\s*claim)/i.test(text) &&
        aCol === -1
      ) {
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
  const rowCount = targetSheet.rowCount || 0;

  for (let r = startRow; r <= rowCount; r++) {
    const row = targetSheet.getRow(r);
    const qCell = row.getCell(qCol);
    const qCellText = qCell.text?.trim();

    // Skip empty question rows
    if (!qCellText || qCellText.length < 5) {
      continue;
    }

    const idCell = row.getCell(idCol);
    const catCell = row.getCell(catCol);
    const aCell = row.getCell(aCol);

    const idCellText = idCell.text?.trim() || `Q-${100 + claims.length + 1}`;
    const catCellText = catCell.text?.trim() || 'General Security';
    const aCellText = aCell.text?.trim() || '';

    // Safely extract optional comments from any relevant cell in the question row
    const rowComment =
      getSafeCellComment(qCell, commentsMap) ||
      getSafeCellComment(idCell, commentsMap) ||
      getSafeCellComment(aCell, commentsMap);

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
      limitations: rowComment
        ? `Workbook comment: ${rowComment}`
        : 'Requires automated source evidence inspection.',
      primarySourcePath: originalFilename,
      linePageRef: `Row ${r}, Col ${qCol}`,
      verifiedTimestamp: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC',
      signalsCount: { supporting: aCellText ? 1 : 0, conflicting: 0, pending: 1 },
      sheetName: targetSheet.name,
      rowNumber: r,
      questionCol: qCol,
      answerCol: aCol,
      reviewStatus: aCellText ? 'approved' : 'draft',
      comments: rowComment || undefined,
      notes: rowComment || undefined,
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
    totalRows: rowCount,
    totalQuestions: claims.length,
    sha256,
  };
}
