import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App';
import { CurrencyProvider } from './context/CurrencyContext';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import { Capacitor } from '@capacitor/core';
import './index.css';

// Automatically route API requests to backend server when running in native mobile APK
if (Capacitor.isNativePlatform() || window.Capacitor?.isNativePlatform?.()) {
  const originalFetch = window.fetch;
  const DEFAULT_BACKEND = 'http://192.168.1.6:5000';
  window.fetch = function(input, init = {}) {
    try {
      const apiBase = localStorage.getItem('bhanjo_api_url') || DEFAULT_BACKEND;
      let targetUrl = input;
      if (typeof input === 'string') {
        if (input.startsWith('/api/')) {
          targetUrl = `${apiBase}${input}`;
        } else if (input.startsWith('http://localhost/api/') || input.startsWith('https://localhost/api/')) {
          targetUrl = input.replace(/^https?:\/\/localhost/, apiBase);
        }
      } else if (input && typeof input.url === 'string') {
        const urlStr = input.url;
        if (urlStr.startsWith('/api/') || urlStr.startsWith('http://localhost/api/') || urlStr.startsWith('https://localhost/api/')) {
          targetUrl = urlStr.replace(/^https?:\/\/localhost/, apiBase);
        }
      }

      // Add a 3.5-second timeout for native requests so offline/cellular devices never freeze
      if (typeof targetUrl === 'string' && targetUrl.startsWith('http')) {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3500);
        const options = { ...init, signal: init.signal || controller.signal };
        return originalFetch.call(this, targetUrl, options).finally(() => clearTimeout(timeoutId));
      }
    } catch (e) {
      console.warn('API interceptor note:', e);
    }
    return originalFetch.call(this, input, init);
  };
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <CurrencyProvider>
      <AuthProvider>
        <CartProvider>
          <App />
        </CartProvider>
      </AuthProvider>
    </CurrencyProvider>
  </React.StrictMode>
);
