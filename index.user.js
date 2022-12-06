
// ==UserScript==
// @name        Airbnb host helper
// @namespace   marcuson
// @description Helpers for hosts on the Airbnb platform.
// @match       https://www.airbnb.*/hosting
// @match       https://www.airbnb.*/hosting/*
// @version     1.0.0
// @author      marcuson
// @license     GPL-3.0-or-later
// @downloadURL https://github.com/marcuson/AirbnbHost-helpers/raw/gh-pages/index.user.js
// @supportURL  https://github.com/marcuson/AirbnbHost-helpers/issues
// @homepageURL https://github.com/marcuson/AirbnbHost-helpers
// @require     https://cdn.jsdelivr.net/combine/npm/@violentmonkey/dom@2,npm/@violentmonkey/ui@0.7
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

var styles = {"imgContainer":"inbox-module_imgContainer__sQDNX","imgDownloadBtn":"inbox-module_imgDownloadBtn__CCkFw"};
var stylesheet=".inbox-module_imgContainer__sQDNX .inbox-module_imgDownloadBtn__CCkFw{background-color:#fff;border-radius:10px;display:none}.inbox-module_imgContainer__sQDNX:hover .inbox-module_imgDownloadBtn__CCkFw{display:initial}.inbox-module_imgContainer__sQDNX:hover .inbox-module_imgDownloadBtn__CCkFw:hover{background-color:#ccc}";

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
        class: styles.imgDownloadBtn,
        onclick: async e => {
          e.preventDefault();
          e.stopPropagation();
          await downloadImg(newImageUrl);
        }
      }, VM.h("i", {
        "icon-name": "download"
      })));
      imageNode.classList.add(styles.imgContainer);
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

const moduleDef = {
  name: 'inbox',
  css: stylesheet,
  initFn: startObserveDOM,
  stopFn: stopObserveDOM
};

function unloadModule(mod) {
  if (!mod) {
    console.info(`No current module to unload`);
    return;
  }
  console.info(`Unloading current module`);
  const cssToRemove = document.querySelector('#ahh-current-module-style');
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
      id: "ahh-current-module-style"
    }, mod.css)));
  }
  if (mod.initFn) {
    mod.initFn();
  }
}
function getCorrectModule(path) {
  // choose module to load according to current path
  if (path.startsWith('/hosting/inbox')) {
    return moduleDef;
  }
  return undefined;
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
}

console.info('Loading Airbnb host helper');
document.head.append(VM.m(VM.h("style", null, css_248z)));
moduleLoaderInit();

})();
