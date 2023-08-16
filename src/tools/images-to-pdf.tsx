import { IPanelResult } from '@violentmonkey/ui';
import { createElement, RotateCw } from 'lucide';
import { degrees, PDFDocument, PDFImage } from 'pdf-lib';
import { appCtx } from '../app-ctx';
import { downloadBlob } from '../utils/dwl-utils';
import { newPanel } from '../utils/ui-utils';

export interface ImageToPdfEntry {
  url: string;
  rotateCW?: number;
}

const imageEntries: ImageToPdfEntry[] = [];
let imagesDiv: HTMLDivElement;
const imageContainers: Node[] = [];
const images: HTMLImageElement[] = [];

const imagesToPdfPanel: IPanelResult = initPanel();

export function addImageToPdf(entry: ImageToPdfEntry) {
  imageEntries.push(entry);
  addPreviewImage(entry);
}

export function openImageToPdfPanel() {
  if (!imagesToPdfPanel) {
    initPanel();
  }

  imagesToPdfPanel.show();
}

function initPanel(): IPanelResult {
  const panel = newPanel({
    content: VM.m(
      <div>
        <div id="imageArray" style="margin-bottom: 50px;"></div>
        <div>
          <button
            style="margin-right: 30px;"
            onclick={async (e: Event) => {
              e.preventDefault();
              e.stopPropagation();
              onDownloadBtnClick();
            }}
          >
            Scarica file PDF
          </button>
          <button
            style="margin-right: 30px;"
            onclick={async (e: Event) => {
              e.preventDefault();
              e.stopPropagation();
              onDownloadBtnClick('-DOCS');
            }}
          >
            Scarica file PDF (doc. identità)
          </button>
          <button
            onclick={async (e: Event) => {
              e.preventDefault();
              e.stopPropagation();
              onClearBtnClick();
            }}
          >
            Pulisci
          </button>
        </div>
      </div>
    ),
    theme: 'light',
  });

  imagesDiv = panel.body.querySelector('#imageArray');
  return panel;
}

function getRotateStyle(deg: number) {
  return `transform: ${getRotateValue(deg)};`;
}

function getRotateValue(deg: number) {
  return `rotate(${deg}deg)`;
}

function addPreviewImage(entry: ImageToPdfEntry) {
  const newIdx = images.length;

  const newImg = VM.m(
    <div style="display: inline-block; padding: 0 30px; border-right: solid black">
      <div style="margin-bottom: 20px;"></div>
      <img
        src={entry.url}
        height="150"
        style={getRotateStyle(entry.rotateCW ?? 0)}
      ></img>
      <div style="margin-bottom: 20px;"></div>
      <button
        onclick={async (e: Event) => {
          e.preventDefault();
          e.stopPropagation();
          onRotateBtnClick(newIdx);
        }}
      >
        Routa {createElement(RotateCw)}
      </button>
    </div>
  );

  const imgCtr = newImg as HTMLDivElement;
  const image = imgCtr.querySelector('img') as HTMLImageElement;

  imageContainers.push(imgCtr);
  images.push(image);

  updatePreview();
}

function updatePreview() {
  imagesDiv.replaceChildren(...imageContainers);
}

function clear() {
  for (const c of imageContainers) {
    (c as HTMLElement).remove();
  }

  images.length = 0;
  imageContainers.length = 0;
  imageEntries.length = 0;
}

function getFilename(): string {
  return `${appCtx.reservationCtx?.dateFromStr}-${appCtx.reservationCtx?.dateToStr}`;
}

async function generatePdf(): Promise<PDFDocument> {
  const pdfDoc = await PDFDocument.create();

  for (const imageEntry of imageEntries) {
    const image = await fetch(imageEntry.url);
    const imageBlob = await image.blob();
    const imageBuffer = await imageBlob.arrayBuffer();
    const imageType =
      imageBlob.type.endsWith('jpeg') || imageBlob.type.endsWith('jpg')
        ? 'jpg'
        : 'png';

    let pdfImage: PDFImage;
    switch (imageType) {
      case 'jpg':
        pdfImage = await pdfDoc.embedJpg(imageBuffer);
        break;

      case 'png':
      default:
        pdfImage = await pdfDoc.embedPng(imageBuffer);
        break;
    }

    const rotateDegrees = imageEntry.rotateCW ?? 0;
    const imageDims = pdfImage.scale(1);
    const dims: [number, number] = [imageDims.width, imageDims.height];
    const page = pdfDoc.addPage(dims);

    page.drawImage(pdfImage, {
      x: 0,
      y: 0,
      width: imageDims.width,
      height: imageDims.height,
      opacity: 1,
    });
    page.setRotation(degrees(rotateDegrees));
  }

  return pdfDoc;
}

function onRotateBtnClick(imageIdx: number) {
  const imEntry = imageEntries[imageIdx];
  imEntry.rotateCW = ((imEntry.rotateCW ?? 0) + 90) % 360;

  const im = images[imageIdx];
  im.style.transform = getRotateValue(imEntry.rotateCW);

  updatePreview();
}

function onClearBtnClick() {
  clear();
}

async function onDownloadBtnClick(filenameSuffix?: string) {
  const pdfDoc = await generatePdf();
  const filename = getFilename();
  downloadBlob(
    await pdfDoc.save(),
    `${filename}${filenameSuffix ?? ''}.pdf`,
    'application/pdf'
  );
}
