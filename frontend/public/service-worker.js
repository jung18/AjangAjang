const CACHE_NAME = 'my-cache-v2'; // 캐시 이름에 버전을 포함하여 새로운 캐시 적용
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
  self.skipWaiting(); // 서비스 워커가 대기 상태 없이 바로 활성화되도록 합니다.
});

// 활성화 이벤트: 이전 캐시 정리 및 활성화된 서비스 워커가 클라이언트에 적용되도록 설정
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log(`Deleting old cache: ${cacheName}`);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      return self.clients.claim(); // 활성화된 서비스 워커가 기존 클라이언트에도 적용되도록 설정
    })
  );
});

// fetch 이벤트: 네트워크 요청 가로채기 및 캐시 응답 제공
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') {
    return;
  }

  event.respondWith(
    caches.open(CACHE_NAME).then((cache) => {
      return fetch(event.request)
        .then((response) => {
          // 최신 응답을 캐시에 저장
          cache.put(event.request, response.clone());
          return response;
        })
        .catch(() => {
          // 네트워크 요청이 실패하면 캐시에서 응답 제공
          return cache.match(event.request);
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
