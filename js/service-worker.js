(()=>{let e=[],a="";/* eslint-disable no-restricted-globals *//// <reference lib="webworker" />
async function t(){console.log(a),console.log(e.join(",  "));let t=await caches.open(a);await t.addAll(e)}async function i(){let e=await caches.keys();await Promise.all(e.map(e=>e!==a&&caches.delete(e)))}e=["/index.html","/manifest.webmanifest","/img/icon.svg","/index.d539dbac.css","/index.03bfc872.js","/404.html"],a="6dca81f7",self.addEventListener("install",e=>e.waitUntil(t())),self.addEventListener("activate",e=>e.waitUntil(i()))})();//# sourceMappingURL=service-worker.js.map

//# sourceMappingURL=service-worker.js.map
