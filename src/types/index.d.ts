import * as dom from '@violentmonkey/dom';
import * as ui from '@violentmonkey/ui';
import * as pdflib from 'pdf-lib';
import * as pdfjs from 'pdfjs-dist';

declare global {
  const VM: typeof dom & typeof ui;
  const PDFLib: typeof pdflib;
  const pdfjsLib: typeof pdfjs;

  namespace JSX {
    /**
     * JSX.Element can be different based on pragma in babel config:
     * - VNode   - when jsxFactory is VM.h
     * - DomNode - when jsxFactory is VM.hm
     */
    type Element = import('@gera2ld/jsx-dom').VNode;
  }
}
