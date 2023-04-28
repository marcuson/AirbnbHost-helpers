import { ModuleDef } from '../loader/module-def';
import { initMenu, stopMenu } from './menu-helper';
import { stylesheet } from './tools.module.css';

export const moduleDef = {
  name: 'tools',
  css: stylesheet,
  initFn: initMenu,
  stopFn: stopMenu,
} as ModuleDef;
