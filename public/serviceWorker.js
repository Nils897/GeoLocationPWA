/**
 * Service Worker for Geo PWA
 *
 * Responsibilities:
 * - Cache static assets for offline use
 * - Dynamically cache assets in /assets/
 * - Clean up old caches on activation
 * - Serve cached assets first, fallback to network
 * - Provide offline fallback for HTML documents
 */

const CACHE_NAME = 'geo-pwa-cache-v1';

/**
 * List of static assets to cache during installation.
 * These files are essential for the app shell and icons.
 */
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

/**
 * Install event
 *
 * Caches the static assets and dynamically caches all assets
 * under /assets/ to ensure offline availability.
 */
self.addEventListener('install', (event) => {
    console.log('Service Worker installed');
    event.waitUntil(
        (async () => {
            const cache = await caches.open(CACHE_NAME);

            // Cache static app shell assets
            await cache.addAll(STATIC_ASSETS);

            // Dynamically cache all files under /assets/
            const assetsResponse = await fetch('/assets/');
            if (assetsResponse.ok) {
                const htmlText = await assetsResponse.text();
                const assetUrls = Array.from(htmlText.matchAll(/href="([^"]+)"/g), m => m[1])
                    .filter(u => u.startsWith('/assets/'));
                await cache.addAll(assetUrls);
            }

            // Force waiting Service Worker to become active immediately
            return self.skipWaiting();
        })()
    );
});

/**
 * Activate event
 *
 * Deletes old caches that do not match CACHE_NAME
 * to prevent serving outdated resources.
 */
self.addEventListener('activate', (event) => {
    console.log('Service Worker activated');
    event.waitUntil(
        caches.keys().then((keys) =>
            Promise.all(
                keys
                    .filter(key => key !== CACHE_NAME)
                    .map(key => caches.delete(key))
            )
        )
    );
    // Take control of all clients immediately
    self.clients.claim();
});

/**
 * Fetch event
 *
 * Responds with cached assets first (Cache First strategy),
 * falls back to network if not cached.
 *
 * For HTML documents, provides offline fallback to /index.html
 * if both cache and network fail.
 */
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request).catch(() => {
                // Offline fallback for HTML pages
                if (event.request.destination === 'document') {
                    return caches.match('/index.html');
                }
            });
        })
    );
});
