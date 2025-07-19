import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { init } from '@telegram-apps/sdk';

let tg;
try {
  tg = init();
  if (tg.initDataUnsafe) {
    console.log('Telegram Web App initialized:', tg.initDataUnsafe);
    tg.ready();
    tg.expand();
  } else {
    console.warn('Telegram Web App data unavailable, running in standalone mode.');
  }
} catch (e) {
  console.error('Telegram Web App initialization failed:', e);
  tg = { ready: () => {}, expand: () => {} };
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
