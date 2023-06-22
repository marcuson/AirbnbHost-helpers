import { IPanelOptions, IPanelResult } from '@violentmonkey/ui';
import { X, createElement } from 'lucide';
import styles, { stylesheet } from './ui-utils.module.css';

export function newPanel(opts: IPanelOptions): IPanelResult {
  const panel = VM.getPanel(opts);

  panel.wrapper.appendChild(
    VM.m(<style id={'ahh-panel-style'}>{stylesheet}</style>)
  );

  panel.wrapper.style.top = '20px';
  panel.wrapper.style.left = '20px';
  panel.wrapper.style.width = `${window.innerWidth - 56}px`;
  panel.wrapper.style.height = `${window.innerHeight - 56}px`;
  panel.body.style.height = '100%';

  panel.body.appendChild(
    VM.m(
      <button onclick={() => panel.hide()} class={styles.closeBtn}>
        {createElement(X)}
      </button>
    )
  );

  return panel;
}
