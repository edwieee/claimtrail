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

  const uint8 = new Uint8Array(buffer);
  const loadingTask = pdfjsLib.getDocument({
    data: uint8,
    useSystemFonts: true,
  });

  const doc = await loadingTask.promise;
  const pagesCount = doc.numPages;
  const chunks: ExtractedPdfChunk[] = [];
  let fullText = '';

  for (let pageNum = 1; pageNum <= pagesCount; pageNum++) {
    const page = await doc.getPage(pageNum);
    const content = await page.getTextContent();
    const pageStrings = content.items
      .map((item: any) => ('str' in item ? item.str : ''))
      .filter((s: string) => s.length > 0);

    const pageText = pageStrings.join(' ').replace(/\s+/g, ' ').trim();
    if (!pageText) continue;

    fullText += `\n--- Page ${pageNum} ---\n` + pageText;

    // Detect section titles or headers (e.g., "Section 3.2", "§3.2", "4.1 Policy")
    const sectionMatch = pageText.match(/(Section\s+\d+(\.\d+)*|§\s*\d+(\.\d+)*|[A-Z][A-Za-z\s]{3,30}:)/i);
    const sectionTitle = sectionMatch ? sectionMatch[0] : `Page ${pageNum} Clause`;

    chunks.push({
      id: `chunk-page-${pageNum}`,
      pageNumber: pageNum,
      sectionTitle: `${sectionTitle} (p. ${pageNum})`,
      text: pageText,
      confidence: 99.0,
    });
  }

  return {
    filename,
    pagesCount,
    chunks,
    fullText,
    sha256,
  };
}
