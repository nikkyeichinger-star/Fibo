const CACHE_NAME = 'fibo-v2';

const APP_SHELL = [
  './',
  './index.html',
  './index.css',
  './index.js',
  './manifest.json',
  './assets/logos/logo.svg',
  './assets/icons/icon-192.png',
  './assets/icons/icon-512.png',
];

// Bij installatie: alles in de kast leggen.
self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL)));
});

// Bij activatie: oude kasten opruimen, anders stapelen ze zich op.
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((names) =>
      Promise.all(names.filter((n) => n !== CACHE_NAME).map((n) => caches.delete(n)))
    )
  );
});

// Elk verzoek: eerst de kast, anders het netwerk.
self.addEventListener('fetch', (e) => {
  e.respondWith(caches.match(e.request).then((hit) => hit || fetch(e.request)));
});
