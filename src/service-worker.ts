/* eslint-disable no-restricted-globals */
/// <reference lib="webworker" />

import { manifest, version } from '@parcel/service-worker';

declare let self: ServiceWorkerGlobalScope;

async function install() {
  const cache = await caches.open(version);
  await cache.addAll(manifest);
}

async function activate() {
  const keys = await caches.keys();
  await Promise.all(
    keys.map((key) => key !== version && caches.delete(key)),
  );
}

const cacheFirst = async (request: Request) => {
  const url = new URL(request.url);
  const cacheKey = url.pathname === '/' ? new URL('index.html', url) : request;

  const responseFromCache = await caches.match(cacheKey);
  return responseFromCache || fetch(request);
};

self.addEventListener('install', (e) => e.waitUntil(install()));
self.addEventListener('activate', (e) => e.waitUntil(activate()));

self.addEventListener('fetch', (event) => {
  event.respondWith(cacheFirst(event.request));
});
