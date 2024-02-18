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
    const directCacheHit = await caches.match(request);
    if (directCacheHit) return directCacheHit;

    if (request.url.startsWith(self.location.origin)) {
      const defaultCacheHit = await caches.match(new URL('/index.html', self.location.origin));
      if (defaultCacheHit) return defaultCacheHit;
    }

    // cache API requests for later use if we go offline
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
  }

  return fetch(request);
}

self.addEventListener('install', (e) => e.waitUntil(install()));
self.addEventListener('activate', (e) => e.waitUntil(activate()));

self.addEventListener('fetch', (event) => {
  event.respondWith(cacheFirst(event.request));
});
