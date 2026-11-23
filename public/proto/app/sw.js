/* Прототип «MELBUS Бригада»: офлайн-оболочка. Кэшируем только свои файлы (и иконки/логотип), чтобы приложение
   открывалось без сети. Обновление — сменить VERSION. */
const VERSION = 'brigada-proto-v1';
const FILES = [
  '/proto/app/', '/proto/app/index.html', '/proto/app/app.css', '/proto/app/app.js', '/proto/app/manifest.webmanifest',
  '/icon-192.png', '/icon-512.png', '/apple-touch-icon.png', '/brand/melbus-dark.svg', '/brand/melbus-light.svg', '/brand/mark-dark.svg',
];
self.addEventListener('install', (e) => { e.waitUntil(caches.open(VERSION).then((c) => c.addAll(FILES)).then(() => self.skipWaiting())); });
self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== VERSION).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', (e) => {
  const u = new URL(e.request.url);
  if (e.request.method !== 'GET' || u.origin !== location.origin) return;
  const own = u.pathname.startsWith('/proto/app/') || u.pathname.startsWith('/img/icons/') || FILES.includes(u.pathname);
  if (!own) return;
  // свои файлы: сначала сеть (свежая версия), без сети — из кэша; картинки иконок кэшируем по мере открытия
  e.respondWith(fetch(e.request).then((r) => {
    if (r.ok) { const copy = r.clone(); caches.open(VERSION).then((c) => c.put(e.request, copy)); }
    return r;
  }).catch(() => caches.match(e.request, { ignoreSearch: true }).then((m) => m || caches.match('/proto/app/'))));
});
