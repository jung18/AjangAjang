// public/service-worker.js

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
});

// 활성화 이벤트: 이전 캐시 정리
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// fetch 이벤트: 네트워크 요청 가로채기 및 캐시 응답 제공
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // 캐시된 자산이 있으면 제공하고, 없으면 네트워크 요청
        return response || fetch(event.request);
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
