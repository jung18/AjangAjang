const CACHE_NAME = 'my-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/styles.css',
  '/main.js'
];

// 설치 이벤트: 캐시 생성 및 자산 저장
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
  self.skipWaiting();
});

// 활성화 이벤트: 이전 캐시 정리 및 활성화된 서비스 워커가 클라이언트에 적용되도록 설정
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (!cacheWhitelist.includes(cacheName)) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      return self.clients.claim();
    })
  );
});

// fetch 이벤트: 네트워크 요청 가로채기 및 캐시 응답 제공
self.addEventListener('fetch', (event) => {
  // POST 요청은 캐시하지 않도록 필터링
  if (event.request.method !== 'GET' || !event.request.url.startsWith('https')) {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        return response || fetch(event.request).then((response) => {
          return caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, response.clone()); // 최신 응답을 캐시에 저장
            return response;
          });
        });
      })
      .catch(() => {
        // 여기서 네트워크 요청이 실패할 경우 대체 응답을 제공할 수 있음
        return new Response('Network error occurred', {
          status: 408,
          statusText: 'Request Timeout'
        });
      })
  );
});

// 푸시 이벤트: 푸시 알림 처리
self.addEventListener('push', (event) => {
  const title = '푸시 알림';
  const options = {
    body: event.data ? event.data.text() : '새로운 알림이 도착했습니다.',
    icon: 'icon.png'
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});
