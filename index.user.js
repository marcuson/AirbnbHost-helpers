
// ==UserScript==
// @name        Airbnb host helper
// @namespace   marcuson
// @description Helpers for hosts on the Airbnb platform.
// @match       https://www.airbnb.*/hosting
// @match       https://www.airbnb.*/hosting/*
// @version     1.1.0
// @author      marcuson
// @license     GPL-3.0-or-later
// @downloadURL https://github.com/marcuson/AirbnbHost-helpers/raw/gh-pages/index.user.js
// @supportURL  https://github.com/marcuson/AirbnbHost-helpers/issues
// @homepageURL https://github.com/marcuson/AirbnbHost-helpers
// @require     https://cdn.jsdelivr.net/combine/npm/@violentmonkey/dom@2,npm/@violentmonkey/ui@0.7
// @require     https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.5.141/pdf.min.js
// @require     https://unpkg.com/pdf-lib@1.17.1/dist/pdf-lib.min.js
// @grant       GM.addStyle
// @grant       GM.getValue
// @grant       GM.setValue
// ==/UserScript==

(function () {
'use strict';

var css_248z = "";

function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };
  return _setPrototypeOf(o, p);
}

function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }
  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      writable: true,
      configurable: true
    }
  });
  Object.defineProperty(subClass, "prototype", {
    writable: false
  });
  if (superClass) _setPrototypeOf(subClass, superClass);
}

async function downloadImg(imageUrl) {
  const resp = await fetch(imageUrl);
  const data = await resp.blob();
  const tmpImageUrl = window.URL.createObjectURL(data);
  const tag = document.createElement('a');
  tag.href = tmpImageUrl;
  tag.download = '';
  document.body.appendChild(tag);
  tag.click();
  document.body.removeChild(tag);
}

/**
 * lucide v0.104.0 - ISC
 */

const createElement = (tag, attrs, children = []) => {
  const element = document.createElementNS("http://www.w3.org/2000/svg", tag);
  Object.keys(attrs).forEach((name) => {
    element.setAttribute(name, String(attrs[name]));
  });
  if (children.length) {
    children.forEach((child) => {
      const childElement = createElement(...child);
      element.appendChild(childElement);
    });
  }
  return element;
};
var createElement$1 = ([tag, attrs, children]) => createElement(tag, attrs, children);

/**
 * lucide v0.104.0 - ISC
 */

const getAttrs = (element) => Array.from(element.attributes).reduce((attrs, attr) => {
  attrs[attr.name] = attr.value;
  return attrs;
}, {});
const getClassNames = (attrs) => {
  if (typeof attrs === "string")
    return attrs;
  if (!attrs || !attrs.class)
    return "";
  if (attrs.class && typeof attrs.class === "string") {
    return attrs.class.split(" ");
  }
  if (attrs.class && Array.isArray(attrs.class)) {
    return attrs.class;
  }
  return "";
};
const combineClassNames = (arrayOfClassnames) => {
  const classNameArray = arrayOfClassnames.flatMap(getClassNames);
  return classNameArray.map((classItem) => classItem.trim()).filter(Boolean).filter((value, index, self) => self.indexOf(value) === index).join(" ");
};
const toPascalCase = (string) => string.replace(/(\w)(\w*)(_|-|\s*)/g, (g0, g1, g2) => g1.toUpperCase() + g2.toLowerCase());
const replaceElement = (element, { nameAttr, icons, attrs }) => {
  const iconName = element.getAttribute(nameAttr);
  if (iconName == null)
    return;
  const ComponentName = toPascalCase(iconName);
  const iconNode = icons[ComponentName];
  if (!iconNode) {
    return console.warn(
      `${element.outerHTML} icon name was not found in the provided icons object.`
    );
  }
  const elementAttrs = getAttrs(element);
  const [tag, iconAttributes, children] = iconNode;
  const iconAttrs = {
    ...iconAttributes,
    "icon-name": iconName,
    ...attrs,
    ...elementAttrs
  };
  const classNames = combineClassNames(["lucide", `lucide-${iconName}`, elementAttrs, attrs]);
  if (classNames) {
    Object.assign(iconAttrs, {
      class: classNames
    });
  }
  const svgElement = createElement$1([tag, iconAttrs, children]);
  return element.parentNode?.replaceChild(svgElement, element);
};

/**
 * lucide v0.104.0 - ISC
 */

const defaultAttributes = {
  xmlns: "http://www.w3.org/2000/svg",
  width: 24,
  height: 24,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": 2,
  "stroke-linecap": "round",
  "stroke-linejoin": "round"
};

/**
 * lucide v0.104.0 - ISC
 */

const Download = [
  "svg",
  defaultAttributes,
  [
    ["path", { d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" }],
    ["polyline", { points: "7 10 12 15 17 10" }],
    ["line", { x1: "12", y1: "15", x2: "12", y2: "3" }]
  ]
];

/**
 * lucide v0.104.0 - ISC
 */

const PenTool = [
  "svg",
  defaultAttributes,
  [
    ["path", { d: "m12 19 7-7 3 3-7 7-3-3z" }],
    ["path", { d: "m18 13-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" }],
    ["path", { d: "m2 2 7.586 7.586" }],
    ["circle", { cx: "11", cy: "11", r: "2" }]
  ]
];

/**
 * lucide v0.104.0 - ISC
 */

const X = [
  "svg",
  defaultAttributes,
  [
    ["line", { x1: "18", y1: "6", x2: "6", y2: "18" }],
    ["line", { x1: "6", y1: "6", x2: "18", y2: "18" }]
  ]
];

/**
 * lucide v0.104.0 - ISC
 */

const createIcons = ({ icons = {}, nameAttr = "icon-name", attrs = {} } = {}) => {
  if (!Object.values(icons).length) {
    throw new Error(
      "Please provide an icons object.\nIf you want to use all the icons you can import it like:\n `import { createIcons, icons } from 'lucide';\nlucide.createIcons({icons});`"
    );
  }
  if (typeof document === "undefined") {
    throw new Error("`createIcons()` only works in a browser environment.");
  }
  const elementsToReplace = document.querySelectorAll(`[${nameAttr}]`);
  Array.from(elementsToReplace).forEach(
    (element) => replaceElement(element, { nameAttr, icons, attrs })
  );
};

var styles$2 = {"imgContainer":"inbox-module_imgContainer__sQDNX","imgDownloadBtn":"inbox-module_imgDownloadBtn__CCkFw"};
var stylesheet$2=".inbox-module_imgContainer__sQDNX .inbox-module_imgDownloadBtn__CCkFw{background-color:#fff;border-radius:10px;display:none}.inbox-module_imgContainer__sQDNX:hover .inbox-module_imgDownloadBtn__CCkFw{display:initial}.inbox-module_imgContainer__sQDNX:hover .inbox-module_imgDownloadBtn__CCkFw:hover{background-color:#ccc}";

function _wrapRegExp() { _wrapRegExp = function (re, groups) { return new BabelRegExp(re, void 0, groups); }; var _super = RegExp.prototype, _groups = new WeakMap(); function BabelRegExp(re, flags, groups) { var _this = new RegExp(re, flags); return _groups.set(_this, groups || _groups.get(re)), _setPrototypeOf(_this, BabelRegExp.prototype); } function buildGroups(result, re) { var g = _groups.get(re); return Object.keys(g).reduce(function (groups, name) { var i = g[name]; if ("number" == typeof i) groups[name] = result[i];else { for (var k = 0; void 0 === result[i[k]] && k + 1 < i.length;) k++; groups[name] = result[i[k]]; } return groups; }, Object.create(null)); } return _inherits(BabelRegExp, RegExp), BabelRegExp.prototype.exec = function (str) { var result = _super.exec.call(this, str); if (result) { result.groups = buildGroups(result, this); var indices = result.indices; indices && (indices.groups = buildGroups(indices, this)); } return result; }, BabelRegExp.prototype[Symbol.replace] = function (str, substitution) { if ("string" == typeof substitution) { var groups = _groups.get(this); return _super[Symbol.replace].call(this, str, substitution.replace(/\$<([^>]+)>/g, function (_, name) { var group = groups[name]; return "$" + (Array.isArray(group) ? group.join("$") : group); })); } if ("function" == typeof substitution) { var _this = this; return _super[Symbol.replace].call(this, str, function () { var args = arguments; return "object" != typeof args[args.length - 1] && (args = [].slice.call(args)).push(buildGroups(args, _this)), substitution.apply(this, args); }); } return _super[Symbol.replace].call(this, str, substitution); }, _wrapRegExp.apply(this, arguments); }
let domThreadDisconnector;
let domThreadImagesDisconnector;
function startObserveDOM() {
  domThreadDisconnector = listenForDOMThread();
}
function stopObserveDOM() {
  domThreadDisconnector();
  domThreadImagesDisconnector();
}
function listenForDOMThread() {
  return VM.observe(document.body, () => {
    const inboxThread = document.querySelector('section[data-testid=orbital-panel-host-messaging-message-thread]');
    if (inboxThread) {
      console.debug('Inbox thread loaded, start listening for images');
      domThreadImagesDisconnector = listenForDOMThreadImages(inboxThread);
      return true;
    }
  });
}
function listenForDOMThreadImages(inboxThread) {
  return VM.observe(inboxThread, () => {
    const imageNodes = [...document.querySelectorAll('div[role=img][data-testid^=image-asset-]')].filter(x => x.getAttribute('data-ahh-augmented') !== 'true' && x.getAttribute('data-testid') !== 'image-asset-undefined');
    if (imageNodes.length <= 0) {
      return;
    }
    for (const imageNode of imageNodes) {
      const imageUrlUnprocessed = imageNode.getAttribute('data-testid');
      const actualWidthMatches = imageUrlUnprocessed.match( /*#__PURE__*/_wrapRegExp(/im_w=([0-9]+)/, {
        w: 1
      }));
      if (actualWidthMatches.length <= 0) {
        continue;
      }
      const actualWidth = parseInt(actualWidthMatches.groups.w);
      const newWidth = actualWidth * 3;
      const newImageUrl = imageUrlUnprocessed.replace('image-asset-', '').replace(actualWidthMatches[0], `im_w=${newWidth}`);
      const downloadBtn = VM.m(VM.h("button", {
        class: styles$2.imgDownloadBtn,
        onclick: async e => {
          e.preventDefault();
          e.stopPropagation();
          await downloadImg(newImageUrl);
        }
      }, VM.h("i", {
        "icon-name": "download"
      })));
      imageNode.classList.add(styles$2.imgContainer);
      imageNode.appendChild(downloadBtn);
      imageNode.setAttribute('data-ahh-augmented', 'true');
    }
    createIcons({
      icons: {
        Download
      }
    });
  });
}

const moduleDef$1 = {
  name: 'inbox',
  css: stylesheet$2,
  initFn: () => {
    startObserveDOM();
  },
  stopFn: () => {
    stopObserveDOM();
  }
};

var styles$1 = {"toolsBtn":"tools-module_toolsBtn__yK6ow"};
var stylesheet$1=".tools-module_toolsBtn__yK6ow{background-color:#aaa;border:1px solid #aaa;border-radius:100%;bottom:25px;height:60px;position:fixed;right:25px;width:60px;z-index:10000}.tools-module_toolsBtn__yK6ow:hover{background-color:#ccc;border-color:#ccc}";

function downloadURL(data, fileName) {
  const a = document.createElement('a');
  a.href = data;
  a.download = fileName;
  document.body.appendChild(a);
  a.style.display = 'none';
  a.click();
  a.remove();
}
function downloadBlob(data, fileName, mimeType) {
  const blob = new Blob([data], {
    type: mimeType
  });
  const url = window.URL.createObjectURL(blob);
  downloadURL(url, fileName);
  setTimeout(() => window.URL.revokeObjectURL(url), 1000);
}

var styles = {"closeBtn":"ui-utils-module_closeBtn__iRms-"};
var stylesheet=".ui-utils-module_closeBtn__iRms-{background-color:#fff;border-radius:100%;border-style:none;cursor:pointer;height:30px;padding:0;position:absolute;right:5px;top:5px;width:30px}.ui-utils-module_closeBtn__iRms-:hover{background-color:#eee}";

function newPanel(opts) {
  const panel = VM.getPanel(opts);
  panel.wrapper.appendChild(VM.m(VM.h("style", {
    id: 'ahh-panel-style'
  }, stylesheet)));
  panel.wrapper.style.top = '20px';
  panel.wrapper.style.left = '20px';
  panel.wrapper.style.width = `${window.innerWidth - 56}px`;
  panel.wrapper.style.height = `${window.innerHeight - 56}px`;
  panel.body.style.height = '100%';
  panel.body.appendChild(VM.m(VM.h("button", {
    onclick: () => panel.hide(),
    class: styles.closeBtn
  }, createElement$1(X))));
  return panel;
}

pdfjsLib.GlobalWorkerOptions.workerSrc = '//cdnjs.cloudflare.com/ajax/libs/pdf.js/3.5.141/pdf.worker.min.js';
const lines = ['con le seguenti modalità:', 'riscossi tramite pagamento digitale Airbnb', 'restituiti tramite rimborso Airbnb per esenzioni minori anni 12'];
const fontSize = 9;
const xL = 710;
const xR = 717;
const y = 76;
const h = 12;
const pdfPreviewCanvas = VM.m(VM.h("canvas", {
  id: "pdfPreview",
  style: "border: solid 1px;"
}));
const impSoggiornoPanel = initPanel();
let originalFile = null;
let pdfDocOrig = null;
let pdfDoc = null;
let totalPrice = null;
let refundedPrice = null;
let startDate;
let endDate;
function openImpSoggiornoPanel() {
  if (!impSoggiornoPanel) {
    initPanel();
  }
  impSoggiornoPanel.show();
}
function initPanel() {
  return newPanel({
    content: VM.m(VM.h("div", null, VM.h("div", null, "Ricevuta originale (pdf):\xA0", VM.h("input", {
      type: "file",
      id: "pdfFile",
      accept: "application/pdf",
      onchange: onFileChange
    })), VM.h("div", null, "Prezzo pagato su Airbnb:\xA0", VM.h("input", {
      type: "number",
      id: "totalPrice",
      onchange: onTotalChange
    })), VM.h("div", null, "Rimborsi minori anni 12:\xA0", VM.h("input", {
      type: "number",
      id: "refundedPrice",
      onchange: onRefundedChange
    })), VM.h("div", null, VM.h("button", {
      onclick: async e => {
        e.preventDefault();
        e.stopPropagation();
        onDownloadBtnClick();
      }
    }, "Scarica file aggiornato")), VM.h("div", {
      style: "padding: 10px;"
    }, pdfPreviewCanvas))),
    theme: 'light'
  });
}
async function onFileChange(e) {
  originalFile = e.target.files[0];
  await updateDocOriginal();
  await updateDoc();
  await updatePreview();
  await updateDates();
}
async function onTotalChange(e) {
  totalPrice = parseInt(e.target.value);
  await updateDoc();
  await updatePreview();
}
async function onRefundedChange(e) {
  refundedPrice = parseInt(e.target.value);
  await updateDoc();
  await updatePreview();
}
function drawTextRightAlign(page, text, {
  x,
  y,
  font,
  size
}) {
  const textWidth = font.widthOfTextAtSize(text, size);
  const xx = x - textWidth;
  page.drawText(text, {
    x: xx,
    y: y,
    size: size
  });
}
async function updateDocOriginal() {
  if (!originalFile) {
    return;
  }
  const pdfFile = await new Promise((res, rej) => {
    const fileReader = new FileReader();
    fileReader.onload = function () {
      res(fileReader.result);
    };
    fileReader.readAsArrayBuffer(originalFile);
  });
  pdfDocOrig = await PDFLib.PDFDocument.load(pdfFile);
}
async function updateDoc() {
  if (!pdfDocOrig) {
    return;
  }
  pdfDoc = await pdfDocOrig.copy();
  const font = await pdfDoc.embedFont(PDFLib.StandardFonts.Helvetica);
  const page = pdfDoc.getPage(0);
  let lineNr = 0;
  if (totalPrice || refundedPrice) {
    drawTextRightAlign(page, lines[0], {
      x: xL,
      y: y + h * lineNr,
      font: font,
      size: fontSize
    });
    lineNr++;
  }
  if (totalPrice) {
    drawTextRightAlign(page, lines[1], {
      x: xL,
      y: y - h * lineNr,
      font: font,
      size: fontSize
    });
    page.drawText(totalPrice.toFixed(2) + ' €', {
      x: xR,
      y: y - h * lineNr,
      font: font,
      size: fontSize
    });
    lineNr++;
  }
  if (refundedPrice) {
    drawTextRightAlign(page, lines[2], {
      x: xL,
      y: y - h * lineNr,
      font: font,
      size: fontSize
    });
    page.drawText('-' + refundedPrice.toFixed(2) + ' €', {
      x: xR - font.widthOfTextAtSize('-', fontSize),
      y: y - h * lineNr,
      font: font,
      size: fontSize
    });
    lineNr++;
  }
}
async function updateDates() {
  if (!pdfDoc) {
    return;
  }
  try {
    const pdf = await pdfjsLib.getDocument(await pdfDoc.save()).promise;
    const page = await pdf.getPage(1);
    const textItems = await page.getTextContent();
    let nextIsStartDate = false;
    let nextIsEndDate = false;
    for (const textItem of textItems.items) {
      const str = textItem.str.replace(/\s/g, '');
      if (str === '') {
        continue;
      }
      if (str === 'Dal/From') {
        nextIsStartDate = true;
        continue;
      }
      if (str === 'Al/To') {
        nextIsEndDate = true;
        continue;
      }
      if (nextIsStartDate) {
        nextIsStartDate = false;
        startDate = extractDate(str);
        continue;
      }
      if (nextIsEndDate) {
        nextIsEndDate = false;
        endDate = extractDate(str);
        continue;
      }
    }
  } catch (e) {
    console.error(e);
  }
}
function extractDate(date) {
  return date.split('-').reverse().join('');
}
async function updatePreview() {
  if (!pdfDoc) {
    return;
  }
  await render(pdfPreviewCanvas, 1);
}
async function render(canvas, scale) {
  try {
    const pdf = await pdfjsLib.getDocument(await pdfDoc.save()).promise;
    const page = await pdf.getPage(1);
    const viewport = page.getViewport({
      scale: scale
    });
    const context = canvas.getContext('2d');
    canvas.height = viewport.height;
    canvas.width = viewport.width;
    const renderContext = {
      canvasContext: context,
      viewport: viewport
    };
    await page.render(renderContext).promise;
  } catch (e) {
    console.error(e);
  }
}
function getFilename() {
  return `${startDate}-${endDate}`;
}
async function onDownloadBtnClick() {
  if (!pdfDoc) {
    return;
  }
  const filename = getFilename();
  downloadBlob(await pdfDoc.save(), `${filename}.pdf`, 'application/pdf');
  const canvas = document.createElement('canvas');
  await render(canvas, 2);
  await downloadURL(canvas.toDataURL('image/png'), `${filename}.png`);
  canvas.remove();
}

let toolsMenu = null;
function initMenu() {
  initToolsMenu();
  addToolsButton();
}
function stopMenu() {
  console.debug('Nothing to do to unload tools module');
}
function addToolsButton() {
  const utilsBtn = VM.m(VM.h("button", {
    id: "toolsBtn",
    class: styles$1.toolsBtn,
    onclick: async e => {
      e.preventDefault();
      e.stopPropagation();
      openToolsMenu();
    }
  }, VM.h("i", {
    "icon-name": "pen-tool"
  })));
  document.body.appendChild(utilsBtn);
  createIcons({
    icons: {
      PenTool
    }
  });
}
function initToolsMenu() {
  if (toolsMenu) {
    return;
  }
  toolsMenu = newPanel({
    content: VM.m(VM.h("div", null, VM.h("div", null, VM.h("button", {
      onclick: openImpSoggiorno
    }, "RICEVUTA IMP. SOGGIORNO")))),
    theme: 'light'
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

const moduleDef = {
  name: 'tools',
  css: stylesheet$1,
  initFn: initMenu,
  stopFn: stopMenu
};

function unloadModule(mod) {
  if (!mod) {
    console.info(`No module to unload`);
    return;
  }
  console.info(`Unloading module ${mod.name}`);
  const cssToRemove = document.querySelector('#ahh-current-module-style-' + mod.name);
  if (cssToRemove) {
    cssToRemove.remove();
  }
  if (mod.stopFn) {
    mod.stopFn();
  }
}
function loadModule(mod) {
  console.info(`Loading ${mod.name} module`);
  if (mod.css) {
    document.head.append(VM.m(VM.h("style", {
      id: 'ahh-current-module-style-' + mod.name
    }, mod.css)));
  }
  if (mod.initFn) {
    mod.initFn();
  }
}
function getCorrectModule(path) {
  // choose module to load according to current path
  if (path.startsWith('/hosting/inbox')) {
    return moduleDef$1;
  }
  return undefined;
}
function loadPersistentModules() {
  loadModule(moduleDef);
}
function moduleLoaderInit() {
  let currentPath = '';
  let currentModule = undefined;
  const observer = new MutationObserver(() => {
    if (window.location.pathname === currentPath) {
      return;
    }
    currentPath = window.location.pathname;
    console.info(`Path changed to ${currentPath}`);
    if (currentModule !== undefined) {
      unloadModule(currentModule);
    }
    currentModule = getCorrectModule(currentPath);
    if (currentModule === undefined) {
      console.info(`No module to load for path ${currentPath}`);
      return;
    }
    loadModule(currentModule);
  });
  observer.observe(document.body, {
    childList: true,
    subtree: false
  });
  loadPersistentModules();
}

console.info('Loading Airbnb host helper');
document.head.append(VM.m(VM.h("style", null, css_248z)));
moduleLoaderInit();

})();
