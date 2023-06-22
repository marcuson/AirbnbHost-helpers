import { IPanelResult } from '@violentmonkey/ui';
import { createIcons, PenTool } from 'lucide';
import { newPanel } from '../utils/ui-utils';
import { openImageToPdfPanel } from './images-to-pdf';
import { openImpSoggiornoPanel } from './imposta-soggiorno';
import styles from './tools.module.css';

let toolsMenu: IPanelResult = null;

export function initMenu() {
  initToolsMenu();
  addToolsButton();
}

export function stopMenu() {
  console.debug('Nothing to do to unload tools module');
}

function addToolsButton() {
  const utilsBtn = VM.m(
    <button
      id="toolsBtn"
      class={styles.toolsBtn}
      onclick={async (e: Event) => {
        e.preventDefault();
        e.stopPropagation();
        openToolsMenu();
      }}
    >
      <i icon-name="pen-tool"></i>
    </button>
  );

  document.body.appendChild(utilsBtn);
  createIcons({ icons: { PenTool } });
}

function initToolsMenu() {
  if (toolsMenu) {
    return;
  }

  toolsMenu = newPanel({
    content: VM.m(
      <div>
        <div>
          <button onclick={openImpSoggiorno} style="margin-right: 30px;">
            RICEVUTA IMP. SOGGIORNO
          </button>
          <button onclick={openImageToPdf}>IMMAGINI &gt;&gt; PDF</button>
        </div>
      </div>
    ),
    theme: 'light',
  });
}

function closeToolsMenu() {
  toolsMenu.hide();
}

function openToolsMenu() {
  toolsMenu.show();
}

function openImpSoggiorno() {
  closeToolsMenu();
  openImpSoggiornoPanel();
}

function openImageToPdf() {
  closeToolsMenu();
  openImageToPdfPanel();
}
