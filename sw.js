<<<<<<< HEAD
const CACHE_NAME = 'caaitba-app-v32';
=======
const CACHE_NAME = 'caaitba-app-v29';
>>>>>>> 7a09f1c8b83631fed48a32e6a7627a5a5fd36bb3
const ASSETS = [
    './',
    './index.html',
    './scss/styles.css?v=32',
    './js/app.js',
    './manifest.json',
    './assets/images/icon-192.png',
    './assets/images/icon-512.png'
];

self.addEventListener('install', (e) => {
    self.skipWaiting();
    e.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS)));
});

self.addEventListener('activate', (e) => {
    e.waitUntil(
        caches.keys().then((keys) => {
            return Promise.all(keys.map((key) => {
                if (key !== CACHE_NAME) return caches.delete(key);
            }));
        }).then(() => self.clients.claim())
    );
});

self.addEventListener('fetch', (e) => {
    e.respondWith(
        fetch(e.request)
            .then((res) => {
                const resClone = res.clone();
                caches.open(CACHE_NAME).then((cache) => cache.put(e.request, resClone));
                return res;
            })
            .catch(() => caches.match(e.request))
    );
});