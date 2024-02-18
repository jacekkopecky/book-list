import * as React from 'react';
import { createRoot } from 'react-dom/client';

import './tools/github-spa';

import App from './components/App';

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const root = createRoot(document.querySelector('#app')!);
root.render(<App />);

async function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register(
        new URL('../service-worker.ts', import.meta.url),
        {
          scope: '/',
          type: 'module',
        },
      );
      if (registration.installing) {
        console.log('Service worker installing');
      } else if (registration.waiting) {
        console.log('Service worker installed');
      } else if (registration.active) {
        console.log('Service worker active');
      }
    } catch (error) {
      console.error('Registration failed with', error);
    }
  }
}

registerServiceWorker().catch(console.error);
