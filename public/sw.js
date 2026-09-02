const CACHE_NAME = 'bigenda-bite-v1'
const PAGE_CACHE = 'pages-v1'
const API_CACHE = 'api-v1'
const ASSET_CACHE = 'assets-v1'

const STATIC_ASSETS = [
  '/',
  '/favicon.svg',
  '/manifest.json',
  '/_next/static/css/',
]

self.addEventListener('install', (event: ExtendableEvent) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS)
    })
  )
})

self.addEventListener('activate', (event: ExtendableEvent) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((name) => {
          if (name !== CACHE_NAME && name !== PAGE_CACHE && name !== API_CACHE && name !== ASSET_CACHE) {
            return caches.delete(name)
          }
        })
      )
    })
  )
})

self.addEventListener('fetch', (event: FetchEvent) => {
  const url = new URL(event.request.url)

  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(event.request).then((response) => {
        if (response.ok) {
          const cloned = response.clone()
          caches.open(API_CACHE).then((cache) => cache.put(event.request, cloned))
        }
        return response
      }).catch(() => {
        return caches.match(event.request)
      })
    )
    return
  }

  if (url.pathname.startsWith('/_next/static/')) {
    event.respondWith(caches.match(event.request).then((response) => response || fetch(event.request)))
    return
  }

  event.respondWith(
    fetch(event.request).then((response) => {
      if (response.ok && url.pathname.startsWith('/')) {
        const cloned = response.clone()
        caches.open(PAGE_CACHE).then((cache) => cache.put(event.request, cloned))
      }
      return response
    }).catch(() => {
      return caches.match(event.request).then((cachedResponse) => {
        if (cachedResponse) return cachedResponse
        return caches.match('/')
      })
    })
  )
})

declare const self: ServiceWorkerGlobalScope
