import { moduleLoaderInit } from './loader/module-loader';
import globalCss from './style.css';

console.info('Loading Airbnb host helper');

pdfjsLib.GlobalWorkerOptions.workerSrc =
  '//cdnjs.cloudflare.com/ajax/libs/pdf.js/3.8.162/pdf.worker.min.js';

document.head.append(VM.m(<style>{globalCss}</style>));
moduleLoaderInit();
