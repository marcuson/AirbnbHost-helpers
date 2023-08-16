import { IPanelResult } from '@violentmonkey/ui';
import { PDFDocument } from 'pdf-lib';
import { TextItem } from 'pdfjs-dist/types/src/display/api';
import { downloadBlob, downloadURL } from '../utils/dwl-utils';
import { roundToDecimal } from '../utils/num-utils';
import { drawTextRightAlign, renderPageOnCanvas } from '../utils/pdf-utils';
import { newPanel } from '../utils/ui-utils';

const lines = [
  'con le seguenti modalità:',
  'riscossi tramite pagamento digitale Airbnb',
  'restituiti tramite rimborso Airbnb per esenzioni minori anni 12',
];

const fontSize = 9;

const xL = 710;
const xR = 717;
const yStart = 150;
const rowH = 20;
const h = 12;

const pdfPreviewCanvas = VM.m(
  <canvas id="pdfPreview" style="border: solid 1px;"></canvas>
) as HTMLCanvasElement;
const impSoggiornoPanel: IPanelResult = initPanel();

let originalFile: File = null;
let pdfDocOrig: PDFDocument = null;
let pdfDoc: PDFDocument = null;

let totalPrice: number = null;
let refundedPrice: number = null;
let yValue: number = null;
let startDate: string;
let endDate: string;
let guestsNum = 0;
let previewScale = 1;

export function openImpSoggiornoPanel() {
  if (!impSoggiornoPanel) {
    initPanel();
  }

  impSoggiornoPanel.show();
}

function initPanel(): IPanelResult {
  return newPanel({
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
          Coord. Y (dal basso):&nbsp;
          <input type="number" id="yValue" onchange={onYValueChange}></input>
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
  await updateDocOriginal();
  await updateConfigFromDocOriginal();
  await updateDoc();
  await updatePreview();
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

async function onYValueChange(e: Event) {
  yValue = parseInt((e.target as HTMLInputElement).value);
  await updateDoc();
  await updatePreview();
}

async function updateDocOriginal() {
  if (!originalFile) {
    return;
  }

  const pdfFile = await new Promise<ArrayBuffer>((res, _rej) => {
    const fileReader = new FileReader();
    fileReader.onload = function () {
      res(fileReader.result as ArrayBuffer);
    };
    fileReader.readAsArrayBuffer(originalFile);
  });

  pdfDocOrig = await PDFLib.PDFDocument.load(pdfFile);
}

async function updateDoc() {
  if (!pdfDocOrig) {
    return;
  }

  pdfDoc = await pdfDocOrig.copy();
  const font = await pdfDoc.embedFont(PDFLib.StandardFonts.Helvetica);
  const page = pdfDoc.getPage(0);
  let lineNr = 0;
  const y = yValue || yStart - rowH * (guestsNum + 1);

  if (totalPrice || refundedPrice) {
    drawTextRightAlign(page, lines[0], {
      x: xL,
      y: y + h * lineNr,
      font: font,
      size: fontSize,
    });
    lineNr++;
  }

  if (totalPrice) {
    drawTextRightAlign(page, lines[1], {
      x: xL,
      y: y - h * lineNr,
      font: font,
      size: fontSize,
    });
    page.drawText(totalPrice.toFixed(2) + ' €', {
      x: xR,
      y: y - h * lineNr,
      font: font,
      size: fontSize,
    });
    lineNr++;
  }

  if (refundedPrice) {
    drawTextRightAlign(page, lines[2], {
      x: xL,
      y: y - h * lineNr,
      font: font,
      size: fontSize,
    });
    page.drawText('-' + refundedPrice.toFixed(2) + ' €', {
      x: xR - font.widthOfTextAtSize('-', fontSize),
      y: y - h * lineNr,
      font: font,
      size: fontSize,
    });
    lineNr++;
  }
}

async function updateConfigFromDocOriginal() {
  if (!pdfDocOrig) {
    return;
  }

  const screenH = window.screen.availHeight;
  const pageH = Math.ceil(pdfDocOrig.getPage(0).getHeight());
  const screenW = window.screen.availWidth;
  const pageW = Math.ceil(pdfDocOrig.getPage(0).getWidth());
  const newScaleY = roundToDecimal((screenH - 320) / pageH, 2);
  const newScaleX = roundToDecimal((screenW - 40) / pageW, 2);
  const newScale = Math.min(newScaleY, newScaleX);
  previewScale = newScale > 1 ? 1 : newScale;

  try {
    const pdf = await pdfjsLib.getDocument(await pdfDocOrig.save()).promise;
    const page = await pdf.getPage(1);

    const textItems = await page.getTextContent();

    let nextIsStartDate = false;
    let nextIsEndDate = false;
    let nextIsGuestsNum = false;
    for (const textItem of textItems.items as TextItem[]) {
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

      if (str === 'Ospiti/Guests') {
        nextIsGuestsNum = true;
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

      if (nextIsGuestsNum) {
        nextIsGuestsNum = false;
        guestsNum = parseInt(str);
        continue;
      }
    }

    const msg = `
    Extracted data:
      - startDate: ${startDate}
      - endDate: ${endDate}
      - guestsNum: ${guestsNum}
    `;
    console.debug(msg);
  } catch (e) {
    console.error(e);
  }
}

function extractDate(date: string): string {
  return date.split('-').reverse().join('');
}

async function updatePreview() {
  if (!pdfDoc) {
    return;
  }

  await render(pdfPreviewCanvas, previewScale);
}

async function render(canvas: HTMLCanvasElement, scale: number) {
  try {
    const pdf = await pdfjsLib.getDocument(await pdfDoc.save()).promise;
    await renderPageOnCanvas(pdf, canvas, 1, scale);
  } catch (e) {
    console.error(e);
  }
}

function getFilename(): string {
  return `${startDate}-${endDate}`;
}

async function onDownloadBtnClick() {
  if (!pdfDoc) {
    return;
  }

  const filename = getFilename();
  downloadBlob(await pdfDoc.save(), `${filename}.pdf`, 'application/pdf');

  const canvas = document.createElement('canvas');
  await render(canvas, 2);
  await downloadURL(canvas.toDataURL('image/png'), `${filename}.png`);
  canvas.remove();
}
