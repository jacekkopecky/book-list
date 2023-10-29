(()=>{let e=[],a="";/* eslint-disable no-restricted-globals *//// <reference lib="webworker" />
async function t(){let t=await caches.open(a);await t.addAll(e)}async function n(){let e=await caches.keys();await Promise.all(e.map(e=>e!==a&&caches.delete(e)))}e=["/index.html","/manifest.webmanifest","/img/icon.svg","/index.d539dbac.css","/index.fef650ba.js","/404.html"],a="5eab157f";let c=async e=>{let a=new URL(e.url),t="/"===a.pathname?new URL("index.html",a):e,n=await caches.match(t);return n||fetch(e)};self.addEventListener("install",e=>e.waitUntil(t())),self.addEventListener("activate",e=>e.waitUntil(n())),self.addEventListener("fetch",e=>{e.respondWith(c(e.request))})})();//# sourceMappingURL=service-worker.js.map

//# sourceMappingURL=service-worker.js.map
