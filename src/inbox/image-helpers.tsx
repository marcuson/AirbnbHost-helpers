import { createIcons, Download, FileText } from 'lucide';
import { toast } from '../toast/toast';
import { addImageToPdf } from '../tools/images-to-pdf';
import { downloadImg } from '../utils/img-utils';
import styles from './inbox.module.css';

let domThreadDisconnector: () => void;
let domThreadImagesDisconnector: () => void;

export function startObserveDOM() {
  domThreadDisconnector = listenForDOMThread();
}

export function stopObserveDOM() {
  domThreadDisconnector();
  domThreadImagesDisconnector();
}

function listenForDOMThread(): () => void {
  return VM.observe(document.body, () => {
    const inboxThread = document.querySelector('section#thread_panel');

    if (inboxThread) {
      console.debug('Inbox thread loaded, start listening for images');
      domThreadImagesDisconnector = listenForDOMThreadImages(inboxThread);
      return true;
    }
  });
}

function listenForDOMThreadImages(inboxThread: Element): () => void {
  return VM.observe(inboxThread, () => {
    const imageNodes = [
      ...document.querySelectorAll('div[data-testid^=image-asset-]'),
    ].filter(
      (x) =>
        x.getAttribute('data-ahh-augmented') !== 'true' &&
        x.getAttribute('data-testid') !== 'image-asset-undefined'
    );

    if (imageNodes.length <= 0) {
      return;
    }

    for (const imageNode of imageNodes) {
      const imageUrlUnprocessed = imageNode.getAttribute('data-testid');
      const actualWidthMatches = imageUrlUnprocessed.match(/im_w=(?<w>[0-9]+)/);
      if (actualWidthMatches.length <= 0) {
        continue;
      }

      const actualWidth = parseInt(actualWidthMatches.groups.w);
      const newWidth = actualWidth * 3;
      const newImageUrl = imageUrlUnprocessed
        .replace('image-asset-', '')
        .replace(actualWidthMatches[0], `im_w=${newWidth}`);

      const downloadBtn = VM.m(
        <button
          class={styles.imgDownloadBtn}
          onclick={async (e: Event) => {
            e.preventDefault();
            e.stopPropagation();
            await downloadImg(newImageUrl);
          }}
        >
          <i icon-name="download"></i>
        </button>
      );

      const addImageToPdfBtn = VM.m(
        <button
          class={styles.imgDownloadBtn}
          onclick={async (e: Event) => {
            e.preventDefault();
            e.stopPropagation();
            addImageToPdfConvert(newImageUrl);
          }}
        >
          <i icon-name="file-text"></i>
        </button>
      );

      imageNode.classList.add(styles.imgContainer);
      imageNode.appendChild(downloadBtn);
      imageNode.appendChild(addImageToPdfBtn);
      imageNode.setAttribute('data-ahh-augmented', 'true');
    }

    createIcons({ icons: { Download, FileText } });
  });

  function addImageToPdfConvert(url: string) {
    addImageToPdf({ url });
    toast('success', 'Image added for later PDF conversion!');
  }
}
