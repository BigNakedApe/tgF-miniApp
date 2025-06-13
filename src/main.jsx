import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

// Инициализация Telegram Web App
if (!window.Telegram?.WebApp) {
  console.error('Telegram Web Apps SDK not loaded.');
  document.getElementById('root').innerHTML = '<p style="color: red; text-align: center;">Error: Telegram Web Apps SDK not loaded.</p>';
} else {
  window.Telegram.WebApp.ready();
  window.Telegram.WebApp.expand();
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);