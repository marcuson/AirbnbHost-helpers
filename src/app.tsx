import globalCss from './style.css';

console.info('Loading Airbnb host helper');

document.head.append(VM.m(<style>{globalCss}</style>));
