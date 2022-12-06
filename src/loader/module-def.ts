export interface ModuleDef {
  name: string;
  css: string;
  initFn: () => void;
  stopFn: () => void;
}
