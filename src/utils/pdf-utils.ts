import { PDFPage, PDFFont } from 'pdf-lib';
import { PDFDocumentProxy } from 'pdfjs-dist';

export async function renderPageOnCanvas(
  pdf: PDFDocumentProxy,
  canvas: HTMLCanvasElement,
  pageNum: number,
  scale: number
) {
  try {
    const page = await pdf.getPage(pageNum);
    const viewport = page.getViewport({ scale: scale });
    const context = canvas.getContext('2d');
    canvas.height = viewport.height;
    canvas.width = viewport.width;
    const renderContext = { canvasContext: context, viewport: viewport };
    await page.render(renderContext).promise;
  } catch (e) {
    console.error(e);
  }
}

export function drawTextRightAlign(
  page: PDFPage,
  text: string,
  { x, y, font, size }: { x: number; y: number; font: PDFFont; size: number }
) {
  const textWidth = font.widthOfTextAtSize(text, size);
  const xx = x - textWidth;
  page.drawText(text, { x: xx, y: y, size: size });
}
