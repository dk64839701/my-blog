const CACHE = 'chinsas-blog-v1';

// 앱 설치 시 핵심 페이지 미리 캐시
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) =>
      cache.addAll(['/', '/blog', '/about'])
    )
  );
  self.skipWaiting();
});

// 이전 버전 캐시 정리
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const { request } = event;

  // GET 요청만, API 제외
  if (request.method !== 'GET') return;
  if (request.url.includes('/api/')) return;

  event.respondWith(
    caches.match(request).then((cached) => {
      // 캐시된 응답을 즉시 반환하면서 백그라운드에서 업데이트 (stale-while-revalidate)
      const fetched = fetch(request).then((response) => {
        if (response.ok) {
          caches.open(CACHE).then((cache) => cache.put(request, response.clone()));
        }
        return response;
      });

      return cached || fetched.catch(() => {
        // 오프라인 + 캐시 없음: 홈페이지라도 반환
        if (request.destination === 'document') {
          return caches.match('/');
        }
      });
    })
  );
});
