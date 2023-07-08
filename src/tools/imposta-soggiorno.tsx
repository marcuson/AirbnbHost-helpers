import { IPanelResult } from '@violentmonkey/ui';
import { PDFDocument } from 'pdf-lib';
import { TextItem } from 'pdfjs-dist/types/src/display/api';
import { downloadBlob, downloadURL } from '../utils/dwl-utils';
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
const yDefault = 76;
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
          <input
            type="number"
            id="yValue"
            value="76"
            onchange={onYValueChange}
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
  await updateDocOriginal();
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

async function onYValueChange(e: Event) {
  yValue = parseInt((e.target as HTMLInputElement).value);
  await updateDoc();
  await updatePreview();
}

async function updateDocOriginal() {
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
  const y = yValue || yDefault;

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
