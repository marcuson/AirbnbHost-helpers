import { ModuleDef } from '../loader/module-def';
import { startObserveDOM, stopObserveDOM } from './image-helpers';
import { stylesheet } from './inbox.module.css';

export const moduleDef = {
  name: 'inbox',
  css: stylesheet,
  initFn: startObserveDOM,
  stopFn: stopObserveDOM,
} as ModuleDef;
