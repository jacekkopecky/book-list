/// <reference lib="webworker" />

import { manifest, version } from '@parcel/service-worker';
import config from '../server/config';

declare let self: ServiceWorkerGlobalScope;

const cacheName = version;

async function install() {
  console.log({ version });
  const files = [...manifest, '/version.txt'];
  for (const path of files) {
    console.log('adding cache', path);
  }
  const cache = await caches.open(cacheName);
  await cache.addAll(files);
}

async function activate() {
  const keys = await caches.keys();
  await Promise.all(
    keys.map((key) => {
      if (key !== cacheName) {
        console.log('deleting cache for version', key);
        return caches.delete(key);
      } else {
        return undefined;
      }
    }),
  );
}

async function cacheFirst(request: Request) {
  if (request.method === 'GET') {
    // network-first cache API requests for later use if we go offline
    if (request.url.startsWith(config.serverURL)) {
      try {
        const response = await fetch(request);
        const cache = await caches.open(cacheName);
        await cache.put(request, response.clone());
        return response;
      } catch (e) {
        const match = await caches.match(request.url);
        if (match) return match;
        else throw e;
      }
    }

    // cache the rest of the files
    const directCacheHit = await caches.match(request);
    if (directCacheHit) return directCacheHit;

    // respond with index.html for anything local but not cached
    if (request.url.startsWith(self.location.origin)) {
      const defaultCacheHit = await caches.match(new URL('/index.html', self.location.origin));
      if (defaultCacheHit) return defaultCacheHit;
    }
  }

  return fetch(request);
}

function reloadBooks() {
  // optimally we could reload the books, but we'd need to override the JWT auth
  // for now, just ask the user to refresh

  return self.registration.showNotification('Bananas for Books', {
    body: 'Your books have been updated, please refresh',
  });
}

self.addEventListener('install', (e) => e.waitUntil(install()));
self.addEventListener('activate', (e) => e.waitUntil(activate()));

self.addEventListener('fetch', (event) => {
  event.respondWith(cacheFirst(event.request));
});

self.addEventListener('push', (e) => e.waitUntil(reloadBooks()));
