const CACHE_NAME = 'toko-online-pwa-v1';
const OFFLINE_URL = '/offline';

const PRECACHE_ASSETS = [
  '/',
  '/offline',
  '/manifest.json',
  '/favicon.ico',
  '/apple-touch-icon.png',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
];

// Perform install and cache baseline static shell
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Service Worker: Pre-caching offline layouts and static assets...');
      return cache.addAll(PRECACHE_ASSETS);
    }).then(() => self.skipWaiting())
  );
});

// Clean up old caches on activation
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('Service Worker: Clearing obsolete cache store:', key);
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Intercept client fetches with custom routing strategies
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Bypass cache completely for non-GET requests (checkout/payment submits)
  if (event.request.method !== 'GET') {
    event.respondWith(fetch(event.request));
    return;
  }

  // 1. NETWORK ONLY Strategy
  // Admin dashboard, checkout flows, payment configurations, and webhooks
  if (
    url.pathname.startsWith('/admin') ||
    url.pathname.startsWith('/checkout') ||
    url.pathname.startsWith('/api/payment') ||
    url.pathname.includes('firestore') // Firestore direct connections
  ) {
    event.respondWith(
      fetch(event.request).catch(() => {
        // Fallback for HTML request if offline
        if (event.request.headers.get('accept')?.includes('text/html')) {
          return caches.match(OFFLINE_URL);
        }
        return new Response('Koneksi internet tidak tersedia.', {
          status: 503,
          headers: { 'Content-Type': 'text/plain' },
        });
      })
    );
    return;
  }

  // 2. STALE WHILE REVALIDATE Strategy
  // Product Catalog page lists
  if (url.pathname.startsWith('/products')) {
    event.respondWith(
      caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((cachedResponse) => {
          const fetchPromise = fetch(event.request)
            .then((networkResponse) => {
              if (networkResponse && networkResponse.status === 200) {
                cache.put(event.request, networkResponse.clone());
              }
              return networkResponse;
            })
            .catch(() => {
              // Return offline fallback if no cache matched
              return cachedResponse || cache.match(OFFLINE_URL);
            });

          return cachedResponse || fetchPromise;
        });
      })
    );
    return;
  }

  // 3. NETWORK FIRST Strategy
  // Public home landing page
  if (url.pathname === '/') {
    event.respondWith(
      fetch(event.request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const responseClone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, responseClone));
          }
          return networkResponse;
        })
        .catch(() => {
          return caches.match(event.request).then((cachedResponse) => {
            return cachedResponse || caches.match(OFFLINE_URL);
          });
        })
    );
    return;
  }

  // 4. CACHE FIRST Strategy
  // Static assets (js, css, images, fonts)
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request).then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
          const responseClone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, responseClone));
        }
        return networkResponse;
      }).catch(() => {
        // Fallback for HTML templates
        if (event.request.headers.get('accept')?.includes('text/html')) {
          return caches.match(OFFLINE_URL);
        }
      });
    })
  );
});

// Background Sync (If browser supports)
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-pending-requests') {
    console.log('Background Sync: Re-syncing pending user requests...');
    // Sync non-critical requests here. Exclude checkout and payment transactions.
  }
});

// Future Push Notification listener hook
self.addEventListener('push', (event) => {
  console.log('Push Notification received:', event.data?.text());
  // Place future custom web push alerts layout code here
});
