var CACHE_NAME = 'lista-mercado-cache-v7';
var ASSETS = [
  '/',
  '/index.html',
  '/style.css?v=5',
  '/main.clean.js',
  '/produtos.js',
  '/manifest.json',
  '/icons/icon.png',
  '/icons/splash.png'
];

self.addEventListener('install', function(event) {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) { return cache.addAll(ASSETS); })
  );
});

self.addEventListener('activate', function(event) {
  self.clients.claim();
  event.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(keys.filter(function(k) { return k !== CACHE_NAME; }).map(function(k) { return caches.delete(k); }));
    })
  );
});

self.addEventListener('fetch', function(event) {
  var request = event.request;
  if (request.method !== 'GET') return;

  // Skip caching for non-HTTP requests (like chrome-extension)
  if (!request.url.startsWith('http')) return;

  // Network first for HTML, cache first for others
  var accept = request.headers.get('accept');
  if (accept && accept.indexOf('text/html') !== -1) {
    event.respondWith(
      fetch(request)
        .then(function(response) {
          var copy = response.clone();
          caches.open(CACHE_NAME).then(function(cache) { cache.put(request, copy); });
          return response;
        })
        .catch(function() { return caches.match(request); })
    );
  } else {
    event.respondWith(
      caches.match(request).then(function(cached) {
        return cached || fetch(request).then(function(response) {
          var copy = response.clone();
          caches.open(CACHE_NAME).then(function(cache) { cache.put(request, copy); });
          return response;
        });
      })
    );
  }
});
