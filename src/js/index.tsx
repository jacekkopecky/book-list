import * as React from 'react';
import * as ReactDom from 'react-dom';

import './tools/github-spa';

import App from './components/App';

ReactDom.render(<App />, document.querySelector('#app'));

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
