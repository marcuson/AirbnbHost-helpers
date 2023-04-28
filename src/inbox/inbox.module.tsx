import { ModuleDef } from '../loader/module-def';
import {
  startObserveDOM as imageInit,
  stopObserveDOM as imageStop,
} from './image-helpers';
import { stylesheet } from './inbox.module.css';

export const moduleDef = {
  name: 'inbox',
  css: stylesheet,
  initFn: () => {
    imageInit();
  },
  stopFn: () => {
    imageStop();
  },
} as ModuleDef;
