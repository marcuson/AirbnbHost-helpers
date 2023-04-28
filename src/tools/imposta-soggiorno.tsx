import { PDFDocument, PDFFont, PDFPage } from 'pdf-lib';
import { downloadBlob, downloadURL } from '../utils/dwl-utils';
import { IPanelResult } from '@violentmonkey/ui';
import { newPanel } from '../utils/ui-utils';

pdfjsLib.GlobalWorkerOptions.workerSrc =
  '//cdnjs.cloudflare.com/ajax/libs/pdf.js/3.5.141/pdf.worker.min.js';

const lines = [
  'con le seguenti modalità:',
  'riscossi tramite pagamento digitale Airbnb',
  'restituiti tramite rimborso Airbnb per esenzioni minori anni 12',
];

const fontSize = 9;

const xL = 710;
const xR = 717;
const y = 76;
const h = 12;

const pdfPreviewCanvas = VM.m(
  <canvas id="pdfPreview" style="border: solid 1px;"></canvas>
) as HTMLCanvasElement;

let impSoggiornoPanel: IPanelResult = null;
let originalFile: File = null;
let totalPrice: number = null;
let startDate: string;
let endDate: string;
let refundedPrice: number = null;
let pdfDoc: PDFDocument = null;

export function openImpSoggiornoPanel() {
  if (!impSoggiornoPanel) {
    initPanel();
  }

  impSoggiornoPanel.wrapper.style.top = '20px';
  impSoggiornoPanel.wrapper.style.left = '20px';
  impSoggiornoPanel.wrapper.style.width = `${window.innerWidth - 56}px`;
  impSoggiornoPanel.wrapper.style.height = `${window.innerHeight - 56}px`;
  impSoggiornoPanel.body.style.height = '100%';
  impSoggiornoPanel.show();
}

function initPanel() {
  if (impSoggiornoPanel) {
    return;
  }

  impSoggiornoPanel = newPanel({
    content: VM.m(
      <div>
        <div>
          Ricevuta originale (pdf):&nbsp;
          <input
            type="file"
            id="pdfFile"
            accept="application/pdf"
            onchange={onFileChange}
          ></input>
        </div>
        <div>
          Prezzo pagato su Airbnb:&nbsp;
          <input type="number" id="totalPrice" onchange={onTotalChange}></input>
        </div>
        <div>
          Rimborsi minori anni 12:&nbsp;
          <input
            type="number"
            id="refundedPrice"
            onchange={onRefundedChange}
          ></input>
        </div>
        <div>
          <button
            onclick={async (e: Event) => {
              e.preventDefault();
              e.stopPropagation();
              onDownloadBtnClick();
            }}
          >
            Scarica file aggiornato
          </button>
        </div>
        <div style="padding: 10px;">{pdfPreviewCanvas}</div>
      </div>
    ),
    theme: 'light',
  });
}

async function onFileChange(e: Event) {
  originalFile = (e.target as HTMLInputElement).files[0];
  await updateDoc();
  await updatePreview();
  await updateDates();
}

async function onTotalChange(e: Event) {
  totalPrice = parseInt((e.target as HTMLInputElement).value);
  await updateDoc();
  await updatePreview();
}

async function onRefundedChange(e: Event) {
  refundedPrice = parseInt((e.target as HTMLInputElement).value);
  await updateDoc();
  await updatePreview();
}

function drawTextRightAlign(
  page: PDFPage,
  text: string,
  { x, y, font, size }: { x: number; y: number; font: PDFFont; size: number }
) {
  const textWidth = font.widthOfTextAtSize(text, size);
  const xx = x - textWidth;
  page.drawText(text, { x: xx, y: y, size: size });
}

async function updateDoc() {
  if (!originalFile) {
    return;
  }

  const pdfFile = await new Promise<ArrayBuffer>((res, rej) => {
    const fileReader = new FileReader();
    fileReader.onload = function () {
      res(fileReader.result as ArrayBuffer);
    };
    fileReader.readAsArrayBuffer(originalFile);
  });

  pdfDoc = await PDFLib.PDFDocument.load(pdfFile);
  const font = await pdfDoc.embedFont(PDFLib.StandardFonts.Helvetica);
  const page = pdfDoc.getPage(0);

  drawTextRightAlign(page, lines[0], {
    x: xL,
    y: y + h * 0,
    font: font,
    size: fontSize,
  });

  if (totalPrice) {
    drawTextRightAlign(page, lines[1], {
      x: xL,
      y: y - h * 1,
      font: font,
      size: fontSize,
    });
    page.drawText(totalPrice.toFixed(2) + ' €', {
      x: xR,
      y: y - h * 1,
      font: font,
      size: fontSize,
    });
  }

  if (refundedPrice) {
    drawTextRightAlign(page, lines[2], {
      x: xL,
      y: y - h * 2,
      font: font,
      size: fontSize,
    });
    page.drawText('-' + refundedPrice.toFixed(2) + ' €', {
      x: xR - font.widthOfTextAtSize('-', fontSize),
      y: y - h * 2,
      font: font,
      size: fontSize,
    });
  }
}

async function updateDates() {
  if (!pdfDoc) {
    return;
  }

  try {
    const pdf = await pdfjsLib.getDocument(await pdfDoc.save()).promise;
    const page = await pdf.getPage(1);
    const textItems = await page.getTextContent();

    let nextIsStartDate = false;
    let nextIsEndDate = false;
    for (const textItem of textItems.items) {
      const str = textItem.str.replace(/\s/g, '');
      if (str === '') {
        continue;
      }

      if (str === 'Dal/From') {
        nextIsStartDate = true;
        continue;
      }

      if (str === 'Al/To') {
        nextIsEndDate = true;
        continue;
      }

      if (nextIsStartDate) {
        nextIsStartDate = false;
        startDate = extractDate(str);
        continue;
      }

      if (nextIsEndDate) {
        nextIsEndDate = false;
        endDate = extractDate(str);
        continue;
      }
    }
  } catch (e) {
    console.error(e);
  }

  console.log(startDate, endDate);
}

function extractDate(date: string): string {
  return date.split('-').reverse().join('');
}
async function updatePreview() {
  if (!pdfDoc) {
    return;
  }

  await render(pdfPreviewCanvas, 1);
}

async function render(canvas: HTMLCanvasElement, scale: number) {
  try {
    const pdf = await pdfjsLib.getDocument(await pdfDoc.save()).promise;
    const page = await pdf.getPage(1);
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

async function onDownloadBtnClick() {
  if (!pdfDoc) {
    return;
  }

  const filename = `${startDate}-${endDate}`;
  downloadBlob(await pdfDoc.save(), `${filename}.pdf`, 'application/pdf');

  const canvas = document.createElement('canvas');
  await render(canvas, 2);
  await downloadURL(canvas.toDataURL('image/png'), `${filename}.png`);
  canvas.remove();
}
