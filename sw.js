const CACHE='kresaflow-production-license-v1';
const CORE=[
  './',
  './index.html',
  './KresaFlow_v39_Production_License_Test.html',
  './sw-kresaflow-license-v1.js',
  './manifest.webmanifest',
  './ikon-192.png',
  './ikon-512.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE)
      .then(cache => cache.addAll(CORE))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(key => key !== CACHE).map(key => caches.delete(key))
      )
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;

      return fetch(event.request).then(response => {
        const copy = response.clone();
        caches.open(CACHE).then(cache => cache.put(event.request, copy));
        return response;
      }).catch(() => caches.match('./KresaFlow_v39_Production_License_Test.html')
        .then(fallback => fallback || caches.match('./index.html')));
    })
  );
});
