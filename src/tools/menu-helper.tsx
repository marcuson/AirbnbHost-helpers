import { createIcons, PenTool } from 'lucide';
import styles from './tools.module.css';
import { IPanelResult } from '@violentmonkey/ui';
import { openImpSoggiornoPanel } from './imposta-soggiorno';
import { newPanel } from '../utils/ui-utils';

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
          <button onclick={openImpSoggiorno}>RICEVUTA IMP. SOGGIORNO</button>
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
