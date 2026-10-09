// Service Worker: macht die App installierbar und offline nutzbar.
const CACHE = 'counter-v5';

const ASSETS = [
  './',
  './index.html',
  './style.css',
  './scripts.js',
  './manifest.json',
  './shared/store.js',
  './shared/base.css',
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

  // Aeltere Installationen starten noch mit ./home/index.html (vor dem Umzug ins Root).
  const oldHome = new URL('./home/', self.registration.scope).pathname;
  if (e.request.mode === 'navigate' && new URL(e.request.url).pathname.startsWith(oldHome)) {
    e.respondWith(Response.redirect(self.registration.scope, 302));
    return;
  }

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
