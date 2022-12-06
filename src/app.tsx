import globalCss from './style.css';
import { moduleLoaderInit } from './loader/module-loader';

console.info('Loading Airbnb host helper');

document.head.append(VM.m(<style>{globalCss}</style>));
moduleLoaderInit();
