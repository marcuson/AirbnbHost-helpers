import { ModuleDef } from '../loader/module-def';
import {
  startObserveDOM as imageInit,
  stopObserveDOM as imageStop,
} from './image-helpers';
import { stylesheet } from './inbox.module.css';
import {
  startObserveDOM as reservationCtxInit,
  stopObserveDOM as reservationCtxStop,
} from './reservation-ctx-helpers';

export const moduleDef = {
  name: 'inbox',
  css: stylesheet,
  initFn: () => {
    imageInit();
    reservationCtxInit();
  },
  stopFn: () => {
    imageStop();
    reservationCtxStop();
  },
} as ModuleDef;
