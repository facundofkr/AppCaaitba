const CACHE_NAME = 'caaitba-app-v2'; // <--- Cambiá v1 por v2 (o v3)
const ASSETS = [
    './',
    './index.html',
    './scss/styles.css',
    './js/app.js',
    './manifest.json'
];

self.addEventListener('install', (e) => {
    e.waitUntil(
        caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
    );
});

// Esto borra la caché vieja cuando se activa la nueva versión
self.addEventListener('activate', (e) => {
    e.waitUntil(
        caches.keys().keys().then((keys) => {
            return Promise.all(
                keys.map((key) => {
                    if (key !== CACHE_NAME) {
                        return caches.delete(key);
                    }
                })
            );
        })
    );
});

self.addEventListener('fetch', (e) => {
    e.respondWith(
        caches.match(e.request).then((res) => res || fetch(e.request))
    );
});