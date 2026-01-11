/**
 * Service Worker for Progressive Web Application
 *
 * Implements:
 * - Offline capability
 * - Installability
 * - Update strategies to ensure content freshness
 *
 * Strategies used:
 * - Network First for HTML documents (Fresh requirement)
 * - Stale While Revalidate for static assets
 * - Cache First fallback for all other requests
 */

const CACHE_NAME = 'geo-pwa-cache-v2';

/**
 * Core application shell files.
 * These files are required for the application to start offline.
 */
const STATIC_ASSETS = [
    '/',
    '/index.html',
    '/manifest.json',
    '/service-worker.js',

    // Application icons
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
 * Pre-caches the application shell to guarantee offline availability
 * on the first load after installation.
 */
self.addEventListener('install', (event) => {
    event.waitUntil(
        (async () => {
            const cache = await caches.open(CACHE_NAME);
            await cache.addAll(STATIC_ASSETS);
            await self.skipWaiting();
        })()
    );
});

/**
 * Activate event
 *
 * Cleans up old cache versions to prevent serving outdated resources
 * and takes immediate control over all open clients.
 */
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keys) =>
            Promise.all(
                keys
                    .filter(key => key !== CACHE_NAME)
                    .map(key => caches.delete(key))
            )
        )
    );
    self.clients.claim();
});

/**
 * Fetch event
 *
 * Applies different caching strategies depending on the request type:
 *
 * 1. HTML documents:
 *    Network First strategy to always serve the most recent version.
 *
 * 2. Static assets (CSS, JS, images, fonts):
 *    Stale While Revalidate strategy for fast responses and background updates.
 *
 * 3. All other requests:
 *    Cache First strategy as a safe fallback.
 */
self.addEventListener('fetch', (event) => {
    const { request } = event;

    /**
     * Handle navigation requests (HTML documents)
     * Ensures freshness by preferring network responses.
     */
    if (request.mode === 'navigate') {
        event.respondWith(
            (async () => {
                try {
                    const networkResponse = await fetch(request);
                    const cache = await caches.open(CACHE_NAME);
                    cache.put(request, networkResponse.clone());
                    return networkResponse;
                } catch (error) {
                    const cachedResponse = await caches.match(request);
                    return cachedResponse || caches.match('/index.html');
                }
            })()
        );
        return;
    }

    /**
     * Handle static assets
     * Serve cached content immediately and update cache in the background.
     */
    if (
        request.destination === 'style' ||
        request.destination === 'script' ||
        request.destination === 'image' ||
        request.destination === 'font'
    ) {
        event.respondWith(
            (async () => {
                const cache = await caches.open(CACHE_NAME);
                const cachedResponse = await cache.match(request);

                const networkFetch = fetch(request)
                    .then((response) => {
                        cache.put(request, response.clone());
                        return response;
                    })
                    .catch(() => cachedResponse);

                return cachedResponse || networkFetch;
            })()
        );
        return;
    }

    /**
     * Fallback handling
     * Tries cache first, then network.
     */
    event.respondWith(
        caches.match(request).then(response => response || fetch(request))
    );
});

/**
 * Push event handler
 *
 * Displays a notification to re-engage the user with the application.
 */
self.addEventListener('push', (event) => {
    const data = event.data ? event.data.json() : {};

    const title = data.title || 'Geo PWA';
    const options = {
        body: data.body || 'New content is available.',
        icon: '/icons/192x192.png',
        badge: '/icons/128x128.png',
        data: {
            url: data.url || '/'
        }
    };

    event.waitUntil(
        self.registration.showNotification(title, options)
    );
});

/**
 * Notification click handler
 *
 * Opens the application and navigates to a specific route (deep link).
 */
self.addEventListener('notificationclick', (event) => {
    event.notification.close();

    event.waitUntil(
        clients.openWindow(event.notification.data.url)
    );
});
