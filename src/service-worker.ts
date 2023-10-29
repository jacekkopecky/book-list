/// <reference lib="webworker" />

import { manifest, version } from '@parcel/service-worker';

declare let self: ServiceWorkerGlobalScope;

async function install() {
  console.log({ version });
  for (const path of manifest) {
    console.log('adding cache', path);
  }
  const cache = await caches.open(version);
  await cache.addAll(manifest);
}

async function activate() {
  const keys = await caches.keys();
  await Promise.all(
    keys.map((key) => {
      if (key !== version) {
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
  }

  return fetch(request);
}

self.addEventListener('install', (e) => e.waitUntil(install()));
self.addEventListener('activate', (e) => e.waitUntil(activate()));

self.addEventListener('fetch', (event) => {
  event.respondWith(cacheFirst(event.request));
});
