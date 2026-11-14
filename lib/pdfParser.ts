import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.mjs';
import crypto from 'crypto';

export interface ExtractedPdfChunk {
  id: string;
  pageNumber: number;
  sectionTitle: string;
  text: string;
  confidence: number;
}

export interface ParsePdfResult {
  filename: string;
  pagesCount: number;
  chunks: ExtractedPdfChunk[];
  fullText: string;
  sha256: string;
}

export async function parseSecurityPolicyPdf(
  buffer: Buffer,
  filename: string
): Promise<ParsePdfResult> {
  const sha256 = crypto.createHash('sha256').update(buffer).digest('hex');

  const chunks: ExtractedPdfChunk[] = [];
  let fullText = '';
  let pagesCount = 1;

  try {
    const uint8 = new Uint8Array(buffer);
    const loadingTask = pdfjsLib.getDocument({
      data: uint8,
      useSystemFonts: true,
      disableFontFace: true,
    });

    const doc = await loadingTask.promise;
    pagesCount = doc.numPages;

    for (let pageNum = 1; pageNum <= pagesCount; pageNum++) {
      const page = await doc.getPage(pageNum);
      const content = await page.getTextContent();
      const pageStrings = content.items
        .map((item: any) => ('str' in item ? item.str : ''))
        .filter((s: string) => s.length > 0);

      const pageText = pageStrings.join(' ').replace(/\s+/g, ' ').trim();
      if (!pageText) continue;

      fullText += `\n--- Page ${pageNum} ---\n` + pageText;

      const sectionMatch = pageText.match(/(Section\s+\d+(\.\d+)*|§\s*\d+(\.\d+)*|[A-Z][A-Za-z\s]{3,30}:)/i);
      const sectionTitle = sectionMatch ? sectionMatch[0] : `Page ${pageNum} Clause`;

      chunks.push({
        id: `chunk-page-${pageNum}`,
        pageNumber: pageNum,
        sectionTitle: `${sectionTitle} (p. ${pageNum})`,
        text: pageText,
        confidence: 100,
      });
    }
  } catch (err: any) {
    console.warn('pdfjs parse warning (trying embedded text fallback):', err?.message);
    // Best-effort extraction of text that is actually present in simple PDF streams.
    const rawString = buffer.toString('utf-8', 0, Math.min(buffer.length, 500000));
    const textMatches: string[] = [];
    const parenRegex = /\(([^()]{3,})\)\s*T[jJ]/g;
    let m;
    while ((m = parenRegex.exec(rawString)) !== null) {
      const clean = m[1].replace(/\\([()\\])/g, '$1').trim();
      if (clean.length > 1) textMatches.push(clean);
    }

    const fallbackText = textMatches.join(' ').replace(/\s+/g, ' ').trim();
    if (fallbackText.length >= 20) {
      fullText = fallbackText;
      pagesCount = 1;
      chunks.push({ id: 'chunk-fallback-1', pageNumber: 1, sectionTitle: 'Embedded PDF text', text: fallbackText, confidence: 70 });
    }
  }

  if (chunks.length === 0 || !fullText.trim()) {
    throw new Error('No extractable text was found in this PDF. Upload a text-based policy PDF; scanned documents require OCR before upload.');
  }

  return {
    filename,
    pagesCount,
    chunks,
    fullText,
    sha256,
  };
}
