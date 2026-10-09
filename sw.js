// Service Worker: macht die App installierbar und offline nutzbar.
const CACHE = 'counter-v3';

const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './shared/store.js',
  './shared/base.css',
  './home/index.html',
  './home/style.css',
  './home/scripts.js',
  './new/index.html',
  './new/style.css',
  './new/scripts.js',
  './counter/index.html',
  './counter/style.css',
  './counter/scripts.js',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/icon-maskable-512.png'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// Network first, damit Updates sofort ankommen; offline aus dem Cache.
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    fetch(e.request)
      .then(res => {
        const copy = res.clone();
        caches.open(CACHE).then(c => c.put(e.request, copy));
        return res;
      })
      .catch(() => caches.match(e.request, { ignoreSearch: true }))
  );
});
