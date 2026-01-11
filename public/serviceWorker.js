const CACHE_NAME = 'geo-pwa-cache-v1';

// Statische Assets, die immer verfügbar sein sollen
const STATIC_ASSETS = [
    '/',
    '/index.html',
    '/manifest.json',
    '/service-worker.js',

    // Icons
    '/icons/128x128.png',
    '/icons/144x144.png',
    '/icons/152x152.png',
    '/icons/192x192.png',
    '/icons/512x512.png',
    '/icons/apple-touch-icon.png',
    '/icons/favicon.png'
];

// Install: Cache statische Assets + alle Assets im Build-Ordner
self.addEventListener('install', (event) => {
    console.log('Service Worker installiert');
    event.waitUntil(
        (async () => {
            const cache = await caches.open(CACHE_NAME);

            // statische Assets
            await cache.addAll(STATIC_ASSETS);

            // Dynamisch alle Dateien aus /assets cachen
            const assetsResponse = await fetch('/assets/');
            if (assetsResponse.ok) {
                const htmlText = await assetsResponse.text();
                const assetUrls = Array.from(htmlText.matchAll(/href="([^"]+)"/g), m => m[1])
                    .filter(u => u.startsWith('/assets/'));
                await cache.addAll(assetUrls);
            }

            return self.skipWaiting();
        })()
    );
});

// Activate: Alten Cache löschen
self.addEventListener('activate', (event) => {
    console.log('Service Worker aktiviert');
    event.waitUntil(
        caches.keys().then((keys) =>
            Promise.all(
                keys.filter(key => key !== CACHE_NAME)
                    .map(key => caches.delete(key))
            )
        )
    );
    self.clients.claim();
});

// Fetch: Assets aus Cache bedienen, sonst Netzwerk
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request).catch(() => {
                // Fallback auf Startseite, falls Dokument offline nicht im Cache ist
                if (event.request.destination === 'document') {
                    return caches.match('/index.html');
                }
            });
        })
    );
});
