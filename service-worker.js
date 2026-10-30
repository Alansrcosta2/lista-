var CACHE_NAME = 'lista-mercado-cache-v12';
var ASSETS = [
  '/',
  '/index.html',
  '/style.css',
  '/main.clean.js',
  '/produtos.js',
  '/manifest.json',
  '/icons/icon.png',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
  '/icons/splash.png',
  '/menu-icons/sol.png',
  '/menu-icons/lua-crescente.png',
  '/menu-icons/definicoes.png',
  '/menu-icons/icons8-lixeira-480.png',
  '/menu-icons/icons8-logotipo-do-whatsapp-100.png',
  '/menu-icons/marcador-de-localizacao.png'
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
