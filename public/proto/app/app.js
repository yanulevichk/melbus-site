/* MELBUS Бригада — кликабельный прототип PWA (23.11.2026). Спецификация: docs/crm/SYSTEM.md.
   Всё на чистом JS, демо-данные в localStorage. Камера: getUserMedia + BarcodeDetector, запасной jsQR (cdn.jsdelivr.net).
   Фото сжимаются на телефоне (canvas → WebP/JPEG). Подпись клиента — пальцем на canvas. */
(() => {
  'use strict';
  const KEY = 'melbus-brigada-demo-v1';
  const app = document.getElementById('app');
  const now = () => Date.now();
  const pad2 = (n) => String(n).padStart(2, '0');
  const hm = (t) => { const d = new Date(t); return `${pad2(d.getHours())}:${pad2(d.getMinutes())}`; };
  const dur = (ms, sec = false) => { ms = Math.max(0, ms); const h = Math.floor(ms / 3.6e6), m = Math.floor(ms / 6e4) % 60, s = Math.floor(ms / 1e3) % 60; return sec ? `${h}:${pad2(m)}:${pad2(s)}` : `${h} ч ${pad2(m)} мин`; };
  const hmm = (ms) => { ms = Math.max(0, ms); return `${Math.floor(ms / 3.6e6)}:${pad2(Math.floor(ms / 6e4) % 60)}`; };
  const zl = (n) => `${new Intl.NumberFormat('ru-RU').format(Math.round(n))} zł`;
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
  const plural = (n, a, b, c) => { const m10 = n % 10, m100 = n % 100; return m10 === 1 && m100 !== 11 ? a : m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14) ? b : c; };

  /* ---------- иконки ---------- */
  const P = {
    back: '<path d="M15 5l-7 7 7 7"/>', more: '<path d="M5 12h.01M12 12h.01M19 12h.01" stroke-width="3.4"/>',
    phone: '<path d="M6.6 10.8a15 15 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25 11.4 11.4 0 0 0 3.6.57 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.57a1 1 0 0 1-.25 1z"/>',
    nav: '<path d="M3 11l18-8-8 18-2-8z"/>', home: '<path d="M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/>',
    job: '<path d="M9 3h6v3H9zM7 5H5v16h14V5h-2M8.5 11h7M8.5 15h5"/>',
    qr: '<path d="M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h2.5v2.5H14zM18.5 14H20M14 18.5V20M17.5 17.5H20V20h-2.5z"/>',
    clock: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>', cam: '<path d="M4 8h3l2-3h6l2 3h3v11H4z"/><circle cx="12" cy="13" r="3.4"/>',
    check: '<path d="M5 12.5l4.5 4.5L19 7.5"/>', chev: '<path d="M9 6l6 6-6 6"/>', plus: '<path d="M12 5v14M5 12h14"/>',
    warn: '<path d="M12 4l9 16H3zM12 10v4.5M12 17.5h.01"/>', pause: '<path d="M9 6v12M15 6v12"/>', play: '<path d="M8 5.5l11 6.5-11 6.5z"/>',
    x: '<path d="M6 6l12 12M18 6L6 18"/>', pin: '<path d="M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11z"/><circle cx="12" cy="10" r="2.6"/>',
    star: '<path d="M12 3.5l2.6 5.5 6 .7-4.5 4.1 1.2 6L12 16.8l-5.3 3 1.2-6-4.5-4.1 6-.7z"/>', box: '<path d="M3.5 7.5L12 3.5l8.5 4-8.5 4zM3.5 7.5v9L12 20.5l8.5-4v-9M12 11.5v9"/>',
    pen: '<path d="M4 20l4-1 11-11-3-3L5 16z"/>', van: '<path d="M2.5 16.5V7h11v9.5M13.5 10h4l3 3.5v3h-7M6 17.5a1.6 1.6 0 1 0 0 .1M17 17.5a1.6 1.6 0 1 0 0 .1"/>',
  };
  const ic = (k) => `<svg viewBox="0 0 24 24" aria-hidden="true">${P[k]}</svg>`;
  const tick = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>';
  const img3d = (k) => `/img/icons/${k}.webp`;

  /* ---------- справочники ---------- */
  const ROOMS = [
    { id: 'kitchen', n: 'Кухня', c: '#14DCD5', where: 'прямо по коридору, первая дверь налево' },
    { id: 'bed', n: 'Спальня', c: '#077E79', where: 'вторая дверь направо, у окна' },
    { id: 'living', n: 'Гостиная', c: '#10161D', where: 'большая комната прямо' },
    { id: 'kids', n: 'Детская', c: '#8F9AA7', where: 'первая дверь направо' },
    { id: 'office', n: 'Кабинет', c: '#34506A', where: 'маленькая комната у балкона' },
    { id: 'bath', n: 'Ванная', c: '#C9D1D9', where: 'налево от входа' },
    { id: 'hall', n: 'Прихожая', c: '#B9A27A', where: 'у входной двери, в шкаф' },
  ];
  const room = (id) => ROOMS.find((r) => r.id === id) || ROOMS[0];
  const ST = {
    depart: { t: 'Выезд', s: 'Бус, инструменты, коробки', kind: 'basic', check: ['Ремни, одеяла и плёнка в бусе', 'Коробки, скотч и наклейки взяли', 'Инструменты для сборки'], need: 1, labels: ['Одометр'], cta: 'Выехали' },
    arrive: { t: 'Прибытие', s: 'Подъезд и место для буса', kind: 'basic', check: ['Позвонили клиенту', 'Бус стоит и не мешает проезду'], need: 2, labels: ['Подъезд', 'Парковка'], cta: 'Мы на месте' },
    protect: { t: 'Осмотр и защита', s: 'Фото «до» и защита дома', kind: 'basic', check: ['Защитили пол в проходе', 'Заклеили углы и дверные косяки', 'Сфотографировали старые царапины'], need: 4, labels: ['Прихожая', 'Лестница', 'Двери', 'Мебель'], cta: 'Готово, начинаем' },
    pack: { t: 'Упаковка и разборка', s: 'Коробки по QR, мебель', kind: 'pack', cta: 'Упаковка закончена' },
    load: { t: 'Погрузка', s: 'Каждая коробка — скан у буса', kind: 'load', cta: 'Всё в бусе, едем' },
    drive: { t: 'В пути', s: 'Клиент видит «В пути»', kind: 'drive', cta: 'Приехали на новый адрес' },
    unload: { t: 'Выгрузка', s: 'Скан → нужная комната', kind: 'unload', cta: 'Всё выгружено' },
    assemble: { t: 'Сборка и расстановка', s: 'Мебель по местам', kind: 'assemble', check: ['Мебель собрана и стоит по плану', 'Коробки разнесены по комнатам', 'Плёнку и мусор забрали'], need: 0, cta: 'Готово' },
    accept: { t: 'Приёмка', s: 'Подпись клиента и оплата', kind: 'accept', cta: 'Завершить заказ' },
    back: { t: 'Возврат на базу', s: 'Бус и коробки', kind: 'basic', check: ['Пустые коробки сданы на склад', 'Бус чистый, одеяла сложены'], need: 1, labels: ['Одометр'], cta: 'Закрыть заказ' },
  };
  const FLOW = { full: ['depart', 'arrive', 'protect', 'pack', 'load', 'drive', 'unload', 'assemble', 'accept', 'back'], move: ['depart', 'arrive', 'protect', 'load', 'drive', 'unload', 'accept', 'back'] };
  const PKG = { full: 'Под ключ', move: 'Перевозка' };
  const EXTRAS = [
    { id: 'tvOff', n: 'Снять ТВ со стены', d: 'С кронштейном', p: 80, ic: 'tvwall' },
    { id: 'tvOn', n: 'Повесить ТВ на новом месте', d: 'Новые дюбели, проверим проводку', p: 250, ic: 'drill' },
    { id: 'conn', n: 'Подключить стиральную машину', d: 'Вода и слив', p: 150, ic: 'washer' },
    { id: 'junk', n: 'Вывоз старой мебели', d: 'За 1 предмет', p: 150, ic: 'bin' },
    { id: 'holes', n: 'Заделать отверстия', d: 'За 1 место, без покраски', p: 60, ic: 'putty' },
    { id: 'rodOn', n: 'Повесить карниз', d: 'Новые дюбели', p: 140, ic: 'rod' },
    { id: 'frame', n: 'Повесить картину или зеркало', d: 'До 10 кг', p: 40, ic: 'frame' },
    { id: 'unpack', n: 'Распаковать коробки', d: 'За 1 коробку', p: 15, ic: 'unpack' },
  ];

  /* ---------- демо-данные ---------- */
  const ALPH = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  const code5 = () => 'MB-' + Array.from({ length: 5 }, () => ALPH[Math.floor(Math.random() * ALPH.length)]).join('');
  const hashCode = (s) => { let h = 7; for (const ch of s) h = (h * 31 + ch.charCodeAt(0)) >>> 0; let o = ''; for (let i = 0; i < 5; i++) { o += ALPH[h % ALPH.length]; h = Math.floor(h / ALPH.length) + i * 7; } return 'MB-' + o; };
  function seed() {
    const dist = [['kitchen', 12], ['bed', 8], ['living', 9], ['kids', 5], ['bath', 3], ['hall', 3]];
    const boxes = []; const notes = { kitchen: ['Тарелки', 'Кастрюли', 'Бокалы — хрупкое', 'Специи и банки'], bed: ['Постельное бельё', 'Одежда зима'], living: ['Книги', 'Настольные игры', 'Декор'], kids: ['Игрушки', 'Лего'], bath: ['Полотенца', 'Косметика'], hall: ['Обувь', 'Шапки и шарфы'] };
    dist.forEach(([r, n]) => { for (let i = 1; i <= n; i++) boxes.push({ code: code5(), room: r, n: i, st: 'packed', fragile: r === 'kitchen' && i % 4 === 3, first: r === 'bed' && i === 1, note: notes[r][(i - 1) % notes[r].length], ph: [], t: now() - 864e5 }); });
    const miss = ['kitchen:11', 'kitchen:12', 'kids:5', 'bath:3'];
    boxes.forEach((b) => { if (!miss.includes(`${b.room}:${b.n}`)) b.st = 'loaded'; });
    const ladder5 = ['Разобран', 'Упакован', 'Загружен', 'Выгружен', 'Собран'];
    return {
      v: 1, auth: false, phone: '+48 512 345 678', user: { name: 'Андрей', role: 'Бригадир' }, offline: false, pending: 0,
      day: { start: null, geo: null, pauses: [], end: null }, log: [], route: { name: 'today' }, cur: 'MB-2311-014',
      jobs: [
        {
          id: 'MB-2311-014', pkg: 'full', win: '08:00–08:30', client: 'Анна Ковальская', phone: '+48600100200',
          from: { a: 'ul. Puławska 145/24', d: 'Mokotów · 2 этаж · лифт есть', park: 'Бус у подъезда', q: 'ul. Puławska 145, Warszawa' },
          to: { a: 'ul. Powstańców Śląskich 70/12', d: 'Bemowo · 4 этаж · лифт есть', park: 'Во дворе, 15 м до двери', q: 'ul. Powstańców Śląskich 70, Warszawa' },
          special: ['Пианино · 4 человека', 'Зеркало 1,8 м · хрупкое', 'Кот в переноске'],
          note: 'Домофон 24. Клиентка будет с 7:45. Кот в переноске — дверь надолго не открывать.',
          crew: ['Андрей', 'Максим', 'Олег', 'Ихор'], van: 'WX 1234A · WX 5678B', planH: 8, price: 3890, deposit: 780, km: 14, min: 35,
          stage: 0, done: {}, photos: {}, checks: {}, extras: [], started: null, closed: null, accept: { rate: 0, pay: '', note: '', sig: false },
          items: [
            { id: 'ward', n: 'Шкаф 2-дверный', s: '1,5–2 м · разобрать', ic: 'wardM', steps: ladder5, st: 0 },
            { id: 'bed', n: 'Кровать 160 см', s: 'Разобрать, матрас в чехол', ic: 'bed2', steps: ladder5, st: 0 },
            { id: 'sofa', n: 'Диван 3-местный', s: 'Плёнка и уголки', ic: 'sofa', steps: ['Упакован', 'Загружен', 'Выгружен', 'На месте'], st: 0 },
            { id: 'table', n: 'Стол обеденный', s: 'На 4 человека · снять ножки', ic: 'dtable', steps: ladder5, st: 0 },
            { id: 'washer', n: 'Стиральная машина', s: 'Транспортные болты', ic: 'washer', steps: ['Отключена', 'Загружена', 'Выгружена', 'Подключена'], st: 0 },
            { id: 'piano', n: 'Пианино', s: '4 человека · ремни', ic: 'piano', steps: ['Упаковано', 'Загружено', 'Выгружено', 'На месте'], st: 0 },
            { id: 'mirror', n: 'Зеркало 1,8 м', s: 'Хрупкое · уголки', ic: 'mirror', steps: ['Упаковано', 'Загружено', 'Выгружено', 'Повешено'], st: 0 },
            { id: 'tv', n: 'Телевизор 55″', s: 'Коробка для ТВ', ic: 'tv', steps: ['Снят', 'Упакован', 'Загружен', 'Выгружен', 'Повешен'], st: 0 },
          ],
          boxes,
        },
        {
          id: 'MB-2311-015', pkg: 'move', win: '15:30–16:00', client: 'Tomasz Nowak', phone: '+48600300400',
          from: { a: 'ul. Grochowska 300/5', d: 'Praga-Południe · 3 этаж · без лифта', park: 'Платная зона, 30 м', q: 'ul. Grochowska 300, Warszawa' },
          to: { a: 'ul. Kasprowicza 12/3', d: 'Bielany · 1 этаж · без лифта', park: 'У подъезда', q: 'ul. Kasprowicza 12, Warszawa' },
          special: ['Стиральная машина'], note: 'Вещи упакованы клиентом — наклеить наши наклейки на коробки.',
          crew: ['Андрей', 'Максим'], van: 'WX 1234A', planH: 3, price: 1290, deposit: 260, km: 16, min: 40,
          stage: 0, done: {}, photos: {}, checks: {}, extras: [], started: null, closed: null, accept: { rate: 0, pay: '', note: '', sig: false },
          items: [{ id: 'washer', n: 'Стиральная машина', s: 'Транспортные болты', ic: 'washer', steps: ['Загружена', 'Выгружена', 'На месте'], st: 0 }],
          boxes: [],
        },
      ],
    };
  }
  let S;
  try { S = JSON.parse(localStorage.getItem(KEY)); } catch (e) { S = null; }
  if (!S || S.v !== 1) S = seed();
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { /* место кончилось — демо работает и без сохранения */ } };
  const J = (id = S.cur) => S.jobs.find((j) => j.id === id) || S.jobs[0];
  const flow = (j) => FLOW[j.pkg];
  const isOff = () => S.offline || !navigator.onLine;

  /* ---------- журнал и очередь отправки ---------- */
  function act(text, job) {
    S.log.unshift({ t: now(), text, job: job || null });
    if (isOff()) S.pending++;
    save();
  }
  function flush() {
    if (isOff() || !S.pending) return;
    const n = S.pending; S.pending = 0; save();
    toast(`Связь есть · отправлено ${n} ${plural(n, 'действие', 'действия', 'действий')}`);
    render(false);
  }
  addEventListener('online', flush);
  addEventListener('offline', () => render(false));

  /* ---------- время ---------- */
  const worked = () => {
    const d = S.day; if (!d.start) return 0;
    const end = d.end || now();
    const p = d.pauses.reduce((a, x) => a + ((x.e || end) - x.s), 0);
    return end - d.start - p;
  };
  const paused = () => { const l = S.day.pauses[S.day.pauses.length - 1]; return !!(l && !l.e); };
  function geo() {
    return new Promise((res) => {
      if (!navigator.geolocation) return res(null);
      const tm = setTimeout(() => res(null), 7000);
      navigator.geolocation.getCurrentPosition((p) => { clearTimeout(tm); res({ lat: +p.coords.latitude.toFixed(5), lng: +p.coords.longitude.toFixed(5), acc: Math.round(p.coords.accuracy) }); },
        () => { clearTimeout(tm); res(null); }, { enableHighAccuracy: true, timeout: 6500, maximumAge: 60000 });
    });
  }

  /* ---------- маленькие помощники интерфейса ---------- */
  let toastT;
  function toast(text) {
    app.querySelector('.toast')?.remove(); clearTimeout(toastT);
    const el = document.createElement('div'); el.className = 'toast'; el.innerHTML = `<i></i><span>${text}</span>`;
    app.append(el);
    toastT = setTimeout(() => { el.classList.add('out'); setTimeout(() => el.remove(), 300); }, 2600);
  }
  function buzz(ok = true) {
    try { navigator.vibrate?.(ok ? 35 : [60, 40, 60]); } catch (e) { }
    try {
      const A = window.AudioContext || window.webkitAudioContext; if (!A) return;
      buzz.ctx ||= new A(); const c = buzz.ctx, o = c.createOscillator(), g = c.createGain();
      o.frequency.value = ok ? 1320 : 330; o.type = 'sine'; g.gain.setValueAtTime(0.0001, c.currentTime);
      g.gain.exponentialRampToValueAtTime(0.18, c.currentTime + 0.01); g.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + 0.13);
      o.connect(g).connect(c.destination); o.start(); o.stop(c.currentTime + 0.14);
    } catch (e) { }
  }
  function qrSvg(text) {
    if (!window.qrcode) return '';
    try { const q = window.qrcode(0, 'M'); q.addData(text); q.make(); return q.createSvgTag({ cellSize: 4, margin: 0, scalable: true }); } catch (e) { return ''; }
  }

  /* ---------- фото: сжатие на телефоне ---------- */
  async function compress(file) {
    const url = URL.createObjectURL(file);
    try {
      const im = await new Promise((res, rej) => { const i = new Image(); i.onload = () => res(i); i.onerror = rej; i.src = url; });
      const enc = (w, q) => {
        const s = Math.min(1, w / Math.max(im.naturalWidth, im.naturalHeight));
        const c = document.createElement('canvas'); c.width = Math.round(im.naturalWidth * s); c.height = Math.round(im.naturalHeight * s);
        c.getContext('2d').drawImage(im, 0, 0, c.width, c.height);
        let d = c.toDataURL('image/webp', q); if (!d.startsWith('data:image/webp')) d = c.toDataURL('image/jpeg', q);
        return d;
      };
      const full = enc(1600, 0.78), thumb = enc(320, 0.72);
      return { thumb, kb: Math.round((full.length * 3) / 4 / 1024), orig: Math.round(file.size / 1024), t: now() };
    } finally { URL.revokeObjectURL(url); }
  }
  // демо-фото (на компьютере без камеры): «снимок» интерьера с подписью и временем
  function demoPhoto(label) {
    const c = document.createElement('canvas'); c.width = c.height = 320; const g = c.getContext('2d');
    const hue = [28, 34, 200, 190, 24][Math.floor(Math.random() * 5)];
    const gr = g.createLinearGradient(0, 0, 320, 320); gr.addColorStop(0, `hsl(${hue} 30% 72%)`); gr.addColorStop(1, `hsl(${hue} 25% 38%)`);
    g.fillStyle = gr; g.fillRect(0, 0, 320, 320);
    g.fillStyle = 'rgba(255,255,255,.18)'; g.fillRect(28, 40, 110, 150); g.fillRect(170, 70, 120, 100);
    g.fillStyle = 'rgba(16,22,29,.28)'; g.fillRect(0, 230, 320, 90);
    g.fillStyle = 'rgba(255,255,255,.85)'; g.fillRect(60, 200, 200, 40);
    g.fillStyle = '#14DCD5'; g.fillRect(60, 214, 200, 10);
    g.fillStyle = '#fff'; g.font = '600 22px Onest, sans-serif'; g.fillText(label || 'Фото', 18, 286);
    g.font = '400 15px Onest, sans-serif'; g.fillStyle = 'rgba(255,255,255,.85)'; g.fillText(`${hm(now())} · демо`, 18, 306);
    return { thumb: c.toDataURL('image/webp', 0.72).startsWith('data:image/webp') ? c.toDataURL('image/webp', 0.72) : c.toDataURL('image/jpeg', 0.8), kb: 214, orig: 3200, t: now(), demo: true };
  }
  // сетка фото: key — где хранить (job.photos[key]), need — сколько обязательно, labels — подписи слотов
  function photoGrid(key, need, labels = [], max = 6) {
    const list = J().photos[key] || [];
    const slots = Math.min(max, Math.max(need, list.length + 1));
    let h = '<div class="photos">';
    for (let i = 0; i < slots; i++) {
      const p = list[i];
      if (p) h += `<div class="ph ph--fill${p.fresh ? ' pop' : ''}"><img src="${p.thumb}" alt=""><em>${esc(labels[i] || `Фото ${i + 1}`)} · ${hm(p.t)}</em><button class="ph__x" data-act="ph-del" data-k="${key}" data-i="${i}" aria-label="Удалить фото">×</button></div>`;
      else h += `<label class="ph">${ic('cam')}<span>${esc(labels[i] || (i < need ? 'Нужно фото' : 'Ещё фото'))}</span><input type="file" accept="image/*" capture="environment" data-ph="${key}" data-lbl="${esc(labels[i] || '')}"></label>`;
    }
    h += '</div>';
    const missing = Math.max(0, need - list.length);
    h += `<div class="need"><span>${need ? (missing ? `Ещё <b>${missing}</b> ${plural(missing, 'фото', 'фото', 'фото')}` : '<b>Фото готовы</b>') : 'Фото по желанию'} · сжатие на телефоне</span><button class="link" data-act="ph-demo" data-k="${key}" data-need="${need}" data-labels="${esc(labels.join('|'))}">Демо-фото</button></div>`;
    list.forEach((p) => { delete p.fresh; });
    return h;
  }
  const photosOk = (key, need) => (J().photos[key] || []).length >= need;

  /* ---------- подпись клиента ---------- */
  function sigPad(id, stored, onChange) {
    const box = app.querySelector(`[data-sig="${id}"]`); if (!box) return;
    const cv = box.querySelector('canvas'), dpr = Math.min(2, devicePixelRatio || 1), ph = box.querySelector('.sig__ph');
    const r = box.getBoundingClientRect(); cv.width = r.width * dpr; cv.height = r.height * dpr;
    const g = cv.getContext('2d'); g.scale(dpr, dpr); g.lineWidth = 2.6; g.lineCap = 'round'; g.lineJoin = 'round'; g.strokeStyle = '#10161D';
    let down = false, lx = 0, ly = 0, len = 0;
    const mark = (on) => { box.classList.toggle('signed', on); ph.textContent = on ? 'Подпись принята' : 'Подпись клиента пальцем'; };
    if (stored) { const im = new Image(); im.onload = () => g.drawImage(im, 0, 0, r.width, r.height); im.src = stored; len = 999; mark(true); }
    const pt = (e) => { const b = cv.getBoundingClientRect(); return [e.clientX - b.left, e.clientY - b.top]; };
    cv.addEventListener('pointerdown', (e) => { down = true; [lx, ly] = pt(e); cv.setPointerCapture?.(e.pointerId); });
    cv.addEventListener('pointermove', (e) => {
      if (!down) return; const [x, y] = pt(e); g.beginPath(); g.moveTo(lx, ly); g.lineTo(x, y); g.stroke();
      len += Math.hypot(x - lx, y - ly); lx = x; ly = y;
      if (len > 70 && !box.classList.contains('signed')) { mark(true); onChange(cv.toDataURL('image/png')); }
    });
    const up = () => { if (down && len > 70) onChange(cv.toDataURL('image/png')); down = false; };
    cv.addEventListener('pointerup', up); cv.addEventListener('pointercancel', up);
    box.querySelector('.sig__clr').addEventListener('click', () => { g.clearRect(0, 0, cv.width, cv.height); len = 0; mark(false); onChange(null); });
  }
  const sigHTML = (id) => `<div class="sig" data-sig="${id}"><canvas aria-label="Поле для подписи"></canvas><button class="sig__clr" type="button">Очистить</button><span class="sig__ph">Подпись клиента пальцем</span></div>`;

  /* ---------- навигация ---------- */
  const ROOTS = ['today', 'job', 'time'];
  function go(name, params = {}, back = false) {
    stopCam();
    if (!back) S.route = { name, ...params, prev: S.route };
    else S.route = { name, ...params, prev: S.route?.prev?.prev };
    save(); render(back ? 'back' : 'fwd');
  }
  function goBack() { const p = S.route.prev; if (p) { S.route = p; save(); render('back'); } else go('today', {}, true); }

  /* ---------- экраны ---------- */
  const bar = (title, sub = '', back = true) => {
    const clock = S.day.start && !S.day.end ? `<span class="clock${paused() ? ' is-pause' : ''}" data-clock><i></i><span>${dur(worked(), true)}</span></span>` : '';
    return `<header class="bar">${back ? `<button class="ib" data-act="back" aria-label="Назад">${ic('back')}</button>` : '<span style="width:6px"></span>'}
      <div class="bar__t">${title}${sub ? `<small>${sub}</small>` : ''}</div>${clock}<button class="ib" data-act="menu" aria-label="Меню демо">${ic('more')}</button></header>`;
  };
  const netBar = () => (isOff() ? `<div class="net"><i></i><span><b>Нет связи</b> · ${S.pending ? `${S.pending} ${plural(S.pending, 'действие ждёт', 'действия ждут', 'действий ждут')} отправки — всё сохранено в телефоне` : 'работаем дальше, всё сохраняется в телефоне'}</span></div>` : '');
  const tabs = (cur) => `<nav class="tabs" aria-label="Разделы">
    <button class="tab" data-act="tab" data-v="today" ${cur === 'today' ? 'aria-current="page"' : ''}>${ic('home')}<span>Сегодня</span></button>
    <button class="tab" data-act="tab" data-v="job" ${cur === 'job' ? 'aria-current="page"' : ''}>${ic('job')}<span>Заказ</span></button>
    <button class="tab tab--scan" data-act="tab" data-v="scan"><span>${ic('qr')}</span><span>Сканер</span></button>
    <button class="tab" data-act="tab" data-v="time" ${cur === 'time' ? 'aria-current="page"' : ''}>${ic('clock')}<span>Мой день</span></button></nav>`;

  function vLogin() {
    return `<div class="login">
      <img class="login__logo" src="/brand/melbus-dark.svg" alt="MELBUS" width="132" height="29">
      <h1 class="login__t">Бригада</h1>
      <p class="login__p">Вход для сотрудников MELBUS</p>
      <label class="field"><span>Телефон</span><input type="tel" inputmode="tel" value="${esc(S.phone)}" data-el="phone" autocomplete="tel"></label>
      <div class="pin" data-el="pin" aria-label="PIN-код"><i></i><i></i><i></i><i></i></div>
      <p class="login__hint" style="margin-top:auto">Демо: PIN <b>1234</b></p>
      <div class="keys">${[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => `<button class="key" data-act="key" data-v="${n}">${n}</button>`).join('')}
        <button class="key key--fn" data-act="key" data-v="c">Стереть</button><button class="key" data-act="key" data-v="0">0</button><button class="key key--fn" data-act="key" data-v="ok">Войти</button></div></div>`;
  }

  function jobCard(j) {
    const f = flow(j), done = Object.keys(j.done).length, cur = j.closed ? 'Готово' : done ? `Шаг ${Math.min(done + 1, f.length)} · ${ST[f[Math.min(j.stage, f.length - 1)]].t}` : 'Ждёт';
    return `<button class="card card--press job${j.pkg === 'move' ? ' job--move' : ''}" data-act="open-job" data-v="${j.id}">
      <div class="row row--sb"><span class="job__time">${j.win}</span><span class="badge ${j.closed ? 'badge--ok' : done ? 'badge--tape' : ''}">${cur}</span></div>
      <div class="row row--sb"><b>${esc(j.client)}</b><span class="badge badge--dark">${PKG[j.pkg]}</span></div>
      <div class="job__addr"><p><span class="ab">A</span><span>${esc(j.from.a)} <span class="muted">· ${esc(j.from.d.split(' · ')[0])}</span></span></p><p><span class="ab ab--b">B</span><span>${esc(j.to.a)} <span class="muted">· ${esc(j.to.d.split(' · ')[0])}</span></span></p></div>
      <div class="row row--sb"><span class="crew">${j.crew.map((c) => `<i>${c[0]}</i>`).join('')}</span><span class="muted" style="font-size:13px">${ic('van').replace('<svg', '<svg style="width:16px;height:16px;vertical-align:-3px;fill:none;stroke:currentColor;stroke-width:1.8"')} ${esc(j.van)}</span></div>
      <div class="prog"><i style="width:${(done / f.length) * 100}%"></i></div></button>`;
  }

  function vToday() {
    const d = new Date(), started = !!S.day.start, ended = !!S.day.end;
    const date = new Intl.DateTimeFormat('ru-RU', { weekday: 'long', day: 'numeric', month: 'long' }).format(d);
    const hr = d.getHours(), hi = hr < 12 ? 'Доброе утро' : hr < 18 ? 'Добрый день' : 'Добрый вечер';
    const allClosed = S.jobs.every((j) => j.closed);
    const dayBox = ended ? `<div class="daybox"><div><div class="daybox__n">${dur(worked())}</div><div class="daybox__s">День закончен в ${hm(S.day.end)}</div></div><span class="badge badge--tape">Готово</span></div>`
      : started ? `<div class="daybox"><div><div class="daybox__n" data-clock-big>${dur(worked(), true)}</div><div class="daybox__s">${paused() ? 'Перерыв' : 'В работе'} с ${hm(S.day.start)}${S.day.geo ? ` · геопозиция ±${S.day.geo.acc} м` : ' · без геопозиции'}</div></div>
          <button class="btn btn--ghost-d btn--sm" data-act="pause">${paused() ? ic('play') + 'Продолжить' : ic('pause') + 'Перерыв'}</button></div>`
      : `<button class="btn btn--tape btn--block" data-act="day-start">${ic('play')}Начать день</button>`;
    return `${bar('<img src="/brand/melbus-dark.svg" alt="MELBUS" width="112" height="24" style="height:22px;width:auto">', '', false)}${netBar()}
      <main class="view"><section class="hello"><p class="hello__d">${date}</p><h1 class="hello__t">${hi},<br>${esc(S.user.name)}</h1><p class="hello__r">${S.user.role} · бусы WX 1234A, WX 5678B</p>${dayBox}</section>
      <div class="pad"><div class="row row--sb"><h2 class="h">Заказы на сегодня</h2><span class="muted" style="font-size:13px">${S.jobs.length}</span></div>
      ${S.jobs.map(jobCard).join('')}
      <div class="card"><p class="k">Перед выездом</p><div class="grid2"><div><div class="big">60</div><span class="muted" style="font-size:13px">коробок в бусе</span></div><div><div class="big">20</div><span class="muted" style="font-size:13px">одеял и ремней</span></div></div></div>
      ${started && !ended && allClosed ? '<button class="btn btn--dark btn--block" data-act="day-end">Закончить день</button>' : ''}
      <p class="proto-tag">Прототип · демо-данные · ⋯ вверху — режим без связи и сброс</p></div></main>${tabs('today')}`;
  }

  function vJob() {
    const j = J(), f = flow(j), si = Math.min(j.stage, f.length - 1), onSite = j.started ? (j.closed || now()) - j.started : 0;
    const stepsHTML = f.map((k, i) => {
      const st = ST[k], isDone = !!j.done[k], isCur = !j.closed && i === j.stage;
      return `<li><button class="step${isDone ? ' is-done' : ''}${isCur ? ' is-cur' : ''}" data-act="stage" data-v="${i}"><span class="step__n">${isDone ? tick.replace('<svg', '<svg style="width:16px;height:16px;stroke:#10161D;stroke-width:2.6;fill:none"') : i + 1}</span>
        <span class="step__t">${st.t}<span class="step__s">${isDone ? `Готово в ${hm(j.done[k])}` : st.s}</span></span>${ic('chev')}</button></li>`;
    }).join('');
    const extrasSum = j.extras.reduce((a, x) => a + x.sum, 0);
    return `${bar(`Заказ ${j.id}`, `${PKG[j.pkg]} · ${j.win}`)}${netBar()}
      <main class="view"><section class="jhead"><div class="jhead__top"><div><p class="jhead__c">${esc(j.client)}</p><p class="jhead__m">${j.crew.length} ${plural(j.crew.length, 'человек', 'человека', 'человек')} · ${esc(j.van)}</p></div>
        <a class="btn btn--tape btn--sm" href="tel:${j.phone}" aria-label="Позвонить клиенту">${ic('phone')}</a></div>
        <div class="timer"><div><b>${j.closed ? f.length : si + 1}/${f.length}</b><span>шаг</span></div><div><b data-jobclock>${j.started ? dur(onSite, true).slice(0, -3) : '—'}</b><span>на заказе</span></div><div><b>${j.planH} ч</b><span>по оферте</span></div></div></section>
      <div class="pad pad--dock">
        <div class="card">${['from', 'to'].map((k, i) => `<div class="addr"><span class="ab${i ? ' ab--b' : ''}">${i ? 'B' : 'A'}</span><div><p class="addr__t">${esc(j[k].a)}</p><p class="addr__s">${esc(j[k].d)}<br>${esc(j[k].park)}</p></div>
          <a class="nav-btn" href="https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(j[k].q)}" target="_blank" rel="noopener" aria-label="Навигация">${ic('nav')}</a></div>`).join('<div class="sep"></div>')}</div>
        <div class="special">${j.special.map((s) => `<span class="badge badge--amber">${esc(s)}</span>`).join('')}</div>
        <div class="note"><b>Заметка менеджера</b>${esc(j.note)}</div>
        <div class="quick"><button data-act="scan" data-v="${j.pkg === 'full' && j.stage <= 3 ? 'pack' : j.stage <= f.indexOf('load') ? 'load' : 'unload'}"><img src="${img3d('box')}" alt="">Коробки</button><button data-act="go" data-v="items"><img src="${img3d('wardM')}" alt="">Вещи</button>
          <button data-act="go" data-v="extra"><img src="${img3d('drill')}" alt="">Доп. работа</button><button data-act="damage"><img src="${img3d('shield')}" alt="">Повреждение</button></div>
        ${j.extras.length ? `<div class="approved">${tick}<div><b>Доп. работы согласованы</b><small>${j.extras.map((x) => esc(x.n)).join(', ')}</small></div><b>+${zl(extrasSum)}</b></div>` : ''}
        <div class="card" style="padding:8px"><ul class="steps">${stepsHTML}</ul></div></div></main>
      ${j.closed ? '' : `<div class="dock" style="bottom:calc(70px + var(--sb))"><button class="btn btn--tape btn--block" data-act="stage" data-v="${j.stage}">Шаг ${si + 1}: ${ST[f[si]].t}${ic('chev')}</button></div>`}
      ${tabs('job')}`;
  }

  // --- шаг ---
  function stageReady(j, k) {
    const st = ST[k];
    if (st.kind === 'basic' || st.kind === 'assemble') {
      const ch = j.checks[k] || [], okC = st.check.every((_, i) => ch[i]), okP = photosOk(k, st.need || 0);
      if (!okC || !okP) {
        const left = st.check.filter((_, i) => !ch[i]).length, ph = Math.max(0, (st.need || 0) - (j.photos[k] || []).length);
        return [false, [left ? `отметьте ${left} ${plural(left, 'пункт', 'пункта', 'пунктов')}` : '', ph ? `добавьте ${ph} фото` : ''].filter(Boolean).join(' и ')];
      }
      return [true, ''];
    }
    if (st.kind === 'load') { const n = j.boxes.length, l = j.boxes.filter((b) => b.st !== 'packed').length; return n && l < n ? [false, `не загружено ${n - l} ${plural(n - l, 'коробка', 'коробки', 'коробок')} — проверьте сканером`] : [true, '']; }
    if (st.kind === 'unload') { const n = j.boxes.length, u = j.boxes.filter((b) => b.st === 'unloaded').length; return n && u < n ? [false, `в бусе ещё ${n - u} ${plural(n - u, 'коробка', 'коробки', 'коробок')}`] : [true, '']; }
    if (st.kind === 'accept') {
      const a = j.accept, ph = Math.max(0, 4 - (j.photos.after || []).length);
      const miss = [ph ? `${ph} фото «после»` : '', a.sig ? '' : 'подпись', a.pay ? '' : 'способ оплаты'].filter(Boolean);
      return miss.length ? [false, `Нужно: ${miss.join(', ')}`] : [true, ''];
    }
    return [true, ''];
  }
  const checklist = (j, k) => `<div style="display:grid;gap:8px">${ST[k].check.map((c, i) => `<button class="check${(j.checks[k] || [])[i] ? ' on' : ''}" data-act="check" data-k="${k}" data-i="${i}"><i>${tick}</i><span>${esc(c)}</span></button>`).join('')}</div>`;
  const meterHTML = (n, of, label) => `<div class="card"><div class="row row--sb"><span class="k">${label}</span><span class="badge ${n >= of && of ? 'badge--ok' : 'badge--tape'}">${n >= of && of ? 'Все' : `${of - n} осталось`}</span></div>
    <div class="big">${n}<span class="muted" style="font:300 18px var(--display)"> из ${of}</span></div><div class="prog" style="height:8px"><i style="width:${of ? (n / of) * 100 : 0}%"></i></div></div>`;

  function vStage() {
    const j = J(), f = flow(j), i = S.route.i, k = f[i], st = ST[k];
    const isDone = !!j.done[k], [ok, why] = stageReady(j, k);
    let body = `<p class="k">Шаг ${i + 1} из ${f.length}</p><h1 class="h">${st.t}</h1><p class="muted" style="margin:0">${st.s}</p>`;
    if (st.kind === 'basic') body += checklist(j, k) + `<p class="k" style="margin-top:6px">Фото</p>` + photoGrid(k, st.need, st.labels);
    if (st.kind === 'pack') {
      const n = j.boxes.length, byRoom = ROOMS.map((r) => [r, j.boxes.filter((b) => b.room === r.id).length]).filter(([, c]) => c);
      const it = j.items.filter((x) => x.steps[0] === 'Разобран'), itDone = it.filter((x) => x.st >= 1).length;
      body += `<button class="card card--press" data-act="scan" data-v="pack"><div class="row row--sb"><span class="k">Коробки</span><span class="badge badge--tape">${ic('qr').replace('<svg', '<svg style="width:14px;height:14px;fill:none;stroke:currentColor;stroke-width:2"')} Сканер</span></div>
        <div class="big">${n}<span class="muted" style="font:300 18px var(--display)"> ${plural(n, 'коробка', 'коробки', 'коробок')} упаковано</span></div>
        <div class="special">${byRoom.map(([r, c]) => `<span class="badge" style="background:${r.c}1f"><i style="width:10px;height:10px;border-radius:3px;background:${r.c}"></i>${r.n} ${c}</span>`).join('')}</div></button>
        <button class="card card--press" data-act="go" data-v="items"><div class="row row--sb"><span class="k">Разборка мебели</span><span class="badge">${itDone} из ${it.length}</span></div>
        <div class="row" style="gap:6px">${it.map((x) => `<img src="${img3d(x.ic)}" alt="" style="width:48px;height:48px;mix-blend-mode:multiply;opacity:${x.st >= 1 ? 1 : .45}">`).join('')}</div></button>`;
    }
    if (st.kind === 'load') {
      const n = j.boxes.length, l = j.boxes.filter((b) => b.st !== 'packed').length, miss = j.boxes.filter((b) => b.st === 'packed');
      body += meterHTML(l, n, 'Коробки в бусе') + (miss.length ? `<div class="card"><p class="k">Не загружены</p><div class="special">${miss.map((b) => `<span class="badge badge--amber">${room(b.room).n} · ${pad2(b.n)}</span>`).join('')}</div></div>` : '')
        + `<button class="btn btn--dark btn--block" data-act="scan" data-v="load">${ic('qr')}Сканировать коробки у буса</button>`
        + `<p class="muted" style="margin:0;font-size:13px">Приложение не даст уехать, пока все коробки не отсканированы — ничего не останется в квартире.</p>`;
    }
    if (st.kind === 'drive') {
      body += `<div class="card" style="background:var(--g);color:#fff;border-color:var(--g)"><div class="row" style="gap:14px"><span class="ab">A</span><span style="flex:1;height:2px;background:repeating-linear-gradient(90deg,#14DCD5 0 8px,transparent 8px 14px)"></span>${ic('van').replace('<svg', '<svg style="width:28px;height:28px;fill:none;stroke:#14DCD5;stroke-width:1.6"')}<span style="flex:1;height:2px;background:#2A3541"></span><span class="ab ab--b">B</span></div>
        <div class="big" style="color:#fff">${j.km} км · ≈ ${j.min} мин</div><p style="margin:0;color:#B9C2CB;font-size:14px">${esc(j.from.a)} → ${esc(j.to.a)}</p></div>
        <div class="approved">${tick}<div><b>Клиент видит «В пути»</b><small>На странице переезда: бригада, номер буса и примерное время</small></div><span></span></div>
        <a class="btn btn--ghost btn--block" href="https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(j.to.q)}" target="_blank" rel="noopener">${ic('nav')}Навигация до адреса B</a>`;
    }
    if (st.kind === 'unload') {
      const n = j.boxes.length, u = j.boxes.filter((b) => b.st === 'unloaded').length;
      body += meterHTML(u, n, 'Коробки на месте') + `<button class="btn btn--dark btn--block" data-act="scan" data-v="unload">${ic('qr')}Сканировать и разносить</button>
        <div class="card"><p class="k">План новой квартиры</p>${ROOMS.filter((r) => j.boxes.some((b) => b.room === r.id)).map((r) => `<div class="row"><i style="width:14px;height:34px;border-radius:4px;background:${r.c};flex:none"></i><div><b>${r.n}</b><div class="muted" style="font-size:13px">${r.where}</div></div></div>`).join('')}</div>`;
    }
    if (st.kind === 'assemble') {
      const big = j.items;
      body += `<button class="card card--press" data-act="go" data-v="items"><div class="row row--sb"><span class="k">Мебель и техника</span><span class="badge">${big.filter((x) => x.st >= x.steps.length).length} из ${big.length} на месте</span></div>
        <div class="row" style="gap:6px;flex-wrap:wrap">${big.map((x) => `<img src="${img3d(x.ic)}" alt="" style="width:44px;height:44px;mix-blend-mode:multiply;opacity:${x.st >= x.steps.length ? 1 : .4}">`).join('')}</div></button>` + checklist(j, k);
    }
    if (st.kind === 'accept') return vAccept();
    const dock = isDone ? `<div class="dock"><button class="btn btn--ghost btn--block" data-act="back">Шаг уже готов · ${hm(j.done[k])}</button></div>`
      : `<div class="dock">${ok ? '' : `<p class="dock__hint">Чтобы продолжить, ${esc(why)}</p>`}<button class="btn btn--tape btn--block${ok ? '' : ' is-off'}" data-act="stage-done" ${ok ? '' : 'aria-disabled="true"'}>${st.cta}</button></div>`;
    return `${bar(`Шаг ${i + 1}: ${st.t}`, j.id)}${netBar()}<main class="view"><div class="pad pad--dock">${body}</div></main>${dock}`;
  }

  function vAccept() {
    const j = J(), a = j.accept, n = j.boxes.length, u = j.boxes.filter((b) => b.st === 'unloaded').length;
    const itOk = j.items.filter((x) => x.st >= x.steps.length).length, ex = j.extras.reduce((s, x) => s + x.sum, 0), due = j.price + ex - j.deposit;
    const line = (ok, t) => `<div class="okline${ok ? '' : ' warn'}"><i>${ok ? tick : '<svg viewBox="0 0 24 24"><path d="M12 7v6M12 17h.01"/></svg>'}</i><span>${t}</span></div>`;
    const [ok, why] = stageReady(j, 'accept');
    const i = flow(j).indexOf('accept');
    return `${bar(`Шаг ${i + 1}: Приёмка`, j.id)}${netBar()}<main class="view"><div class="pad pad--dock">
      <p class="k">Шаг ${i + 1} из ${flow(j).length}</p><h1 class="h">Приёмка</h1>
      <div class="card">${line(!n || u >= n, n ? `Коробки на месте: ${u} из ${n}` : 'Коробки клиента — без наших наклеек')}${line(itOk >= j.items.length, `Мебель и техника: ${itOk} из ${j.items.length}`)}${line(true, j.extras.length ? `Доп. работы согласованы: ${j.extras.length} (+${zl(ex)})` : 'Доп. работ не было')}</div>
      <p class="k">Фото «после»</p>${photoGrid('after', 4, ['Гостиная', 'Спальня', 'Кухня', 'Прихожая'])}
      <p class="k">Замечания клиента</p><textarea class="ta" data-el="acc-note" placeholder="Например: всё отлично / царапина на ножке стола (была до переезда — см. фото «до»)">${esc(a.note)}</textarea>
      <p class="k">Оценка</p><div class="stars">${[1, 2, 3, 4, 5].map((s) => `<button class="${a.rate >= s ? 'on' : ''}" data-act="rate" data-v="${s}" aria-label="${s} из 5">${ic('star')}</button>`).join('')}</div>
      <div class="card sum"><p><span>Цена по оферте</span><b>${zl(j.price)}</b></p>${ex ? `<p><span>Доп. работы (согласованы)</span><b>+${zl(ex)}</b></p>` : ''}<p><span>Задаток оплачен онлайн</span><b>−${zl(j.deposit)}</b></p><p class="tot"><span>К оплате</span><b>${zl(due)}</b></p></div>
      <p class="k">Оплата · терминал у бригадира</p><div class="pay">${['BLIK', 'Карта', 'Наличные'].map((p) => `<button data-act="pay" data-v="${p}" aria-pressed="${a.pay === p}">${p}</button>`).join('')}</div>
      <p class="k">Подпись клиента: «Работы приняты»</p>${sigHTML('acc')}</div></main>
      <div class="dock">${ok ? '' : `<p class="dock__hint">${esc(why)}</p>`}<button class="btn btn--tape btn--block${ok ? '' : ' is-off'}" data-act="stage-done">Завершить заказ · ${zl(due)}</button></div>`;
  }

  function vItems() {
    const j = J();
    return `${bar('Мебель и техника', j.id)}${netBar()}<main class="view"><div class="pad"><h1 class="h">Вещи</h1><p class="muted" style="margin:0">Нажмите на вещь — отметить, что сделано, добавить фото или повреждение.</p>
      ${j.items.map((x) => { const last = x.st >= x.steps.length; return `<button class="item" data-act="item" data-v="${x.id}"><img src="${img3d(x.ic)}" alt=""><span><span class="item__t">${esc(x.n)}</span><span class="item__s">${esc(x.s)}${x.dmg?.length ? ' · ⚠ повреждение' : ''}</span></span>
        <span class="badge ${last ? 'badge--ok' : x.st ? 'badge--tape' : ''}">${x.st ? esc(x.steps[x.st - 1]) : 'В списке'}</span></button>`; }).join('')}</div></main>`;
  }

  function vExtra() {
    const j = J(), sel = S.route.sel || {}, sum = EXTRAS.reduce((a, x) => a + (sel[x.id] || 0) * x.p, 0), signed = !!S.route.signed;
    const ok = sum > 0 && signed;
    return `${bar('Доп. работа', j.id)}${netBar()}<main class="view"><div class="pad pad--dock"><h1 class="h">Клиент просит ещё</h1>
      <p class="muted" style="margin:0">Цена известна заранее. Делаем только после подписи клиента — так обещает MELBUS.</p>
      ${j.extras.map((x) => `<div class="approved">${tick}<div><b>${esc(x.n)}</b><small>Согласовано в ${hm(x.t)} · подпись клиента</small></div><b>+${zl(x.sum)}</b></div>`).join('')}
      ${EXTRAS.map((x) => { const q = sel[x.id] || 0; return `<div class="xitem${q ? ' on' : ''}"><img src="${img3d(x.ic)}" alt=""><span><b>${esc(x.n)}</b><small>${esc(x.d)} · ${zl(x.p)}</small></span>
        <span class="row" style="gap:6px">${q ? `<button class="ib" style="background:var(--paper)" data-act="x-dec" data-v="${x.id}" aria-label="Меньше">−</button><b class="xitem__p">${q}</b>` : ''}<button class="ib" style="background:var(--g);color:var(--tape)" data-act="x-inc" data-v="${x.id}" aria-label="Добавить">${ic('plus')}</button></span></div>`; }).join('')}
      ${sum ? `<div class="card sum"><p class="tot"><span>Итого доп. работы</span><b>+${zl(sum)}</b></p></div><p class="k">Подпись клиента: «Согласен на доп. работы»</p>${sigHTML('extra')}` : ''}</div></main>
      <div class="dock">${ok ? '' : `<p class="dock__hint">${sum ? 'Дайте клиенту подписать на экране' : 'Выберите работу из списка'}</p>`}<button class="btn btn--tape btn--block${ok ? '' : ' is-off'}" data-act="x-approve">Согласовать${sum ? ` · +${zl(sum)}` : ''}</button></div>`;
  }

  function vTime() {
    const started = !!S.day.start, ended = !!S.day.end;
    const pz = S.day.pauses.reduce((a, x) => a + ((x.e || S.day.end || now()) - x.s), 0);
    const boxesScanned = S.log.filter((l) => /^Коробка/.test(l.text)).length, photos = S.jobs.reduce((a, j) => a + Object.values(j.photos).reduce((b, l) => b + l.length, 0), 0);
    return `${bar('Мой день', new Intl.DateTimeFormat('ru-RU', { day: 'numeric', month: 'long' }).format(new Date()), false)}${netBar()}<main class="view"><section class="hello">
      <p class="hello__d">Отработано сегодня</p><div class="hello__t" style="font-size:44px" data-clock-big>${started ? dur(worked(), true) : '0:00:00'}</div>
      <p class="hello__r">${started ? `Начало ${hm(S.day.start)}${S.day.geo ? ` · ${S.day.geo.lat}, ${S.day.geo.lng}` : ''} · перерывы ${dur(pz)}` : 'День ещё не начат'}</p>
      ${started && !ended ? `<div class="grid2"><button class="btn btn--ghost-d" data-act="pause">${paused() ? ic('play') + 'Продолжить' : ic('pause') + 'Перерыв'}</button><button class="btn btn--tape" data-act="day-end">Закончить день</button></div>` : !started ? `<button class="btn btn--tape btn--block" data-act="day-start">${ic('play')}Начать день</button>` : ''}</section>
      <div class="pad"><div class="grid2"><div class="card"><div class="big">${boxesScanned}</div><span class="muted" style="font-size:13px">коробок отсканировано</span></div><div class="card"><div class="big">${photos}</div><span class="muted" style="font-size:13px">фото сделано</span></div></div>
      <h2 class="h h--s">Лента дня</h2>${S.log.length ? `<div class="card" style="gap:10px">${S.log.slice(0, 40).map((l) => `<div class="row" style="align-items:flex-start"><b style="font-variant-numeric:tabular-nums;min-width:44px">${hm(l.t)}</b><span>${esc(l.text)}</span></div>`).join('')}</div>` : '<p class="muted">Здесь появятся начало дня, шаги, сканы и фото — с точным временем.</p>'}
      <p class="muted" style="font-size:12px;margin:0">Геопозиция берётся только в момент нажатия «Начать день» и «Закончить день» — без постоянного слежения. Сотрудники подписывают уведомление (Kodeks pracy, art. 22³).</p></div></main>${tabs('time')}`;
  }

  const VIEWS = { today: vToday, job: vJob, stage: vStage, items: vItems, extra: vExtra, time: vTime };
  function render(anim) {
    const prevView = app.querySelector('.view'), keepScroll = anim === false && prevView ? prevView.scrollTop : 0;
    if (!S.auth) { app.innerHTML = vLogin(); return; }
    const v = VIEWS[S.route.name] || vToday;
    app.querySelectorAll('.sheet, .sheet-bg, .menu, .toast').forEach((e) => { if (!e.classList.contains('toast')) e.remove(); });
    const keepToast = app.querySelector('.toast');
    app.innerHTML = v();
    if (keepToast) app.append(keepToast);
    const view = app.querySelector('.view');
    if (view) { if (anim === 'fwd' || anim === 'back') view.classList.add(anim === 'back' ? 'in-back' : 'in-fwd'); else view.scrollTop = keepScroll; }
    if (S.route.name === 'stage' && ST[flow(J())[S.route.i]]?.kind === 'accept') sigPad('acc', J().accept.sig, (v2) => { J().accept.sig = v2; save(); refreshDock(); });
    if (S.route.name === 'extra') sigPad('extra', S.route.signed, (v2) => { S.route.signed = v2; refreshDock(); });
  }
  // обновить только нижнюю кнопку (чтобы не стереть подпись перерисовкой)
  function refreshDock() {
    const old = app.querySelector('.dock'); if (!old) return;
    const tmp = document.createElement('div'); tmp.innerHTML = VIEWS[S.route.name]();
    const nd = tmp.querySelector('.dock'); if (nd) old.replaceWith(nd);
  }

  /* ---------- сканер ---------- */
  let cam = null;
  function stopCam() { if (cam) { cam.alive = false; cam.stream?.getTracks().forEach((t) => t.stop()); cam = null; } app.querySelector('.scan')?.remove(); }
  function scanMeta(j, mode) {
    const n = j.boxes.length;
    if (mode === 'pack') return { n, of: 0, label: `${plural(n, 'коробка упакована', 'коробки упакованы', 'коробок упаковано')}`, miss: [] };
    if (mode === 'load') { const l = j.boxes.filter((b) => b.st !== 'packed'); return { n: l.length, of: n, label: 'в бусе', miss: j.boxes.filter((b) => b.st === 'packed') }; }
    const u = j.boxes.filter((b) => b.st === 'unloaded'); return { n: u.length, of: n, label: 'на месте', miss: [] };
  }
  function scanUI() {
    const j = J(), mode = S.scan.mode, m = scanMeta(j, mode);
    return `<div class="scan"><div class="scan__top"><button class="ib" data-act="scan-close" aria-label="Закрыть">${ic('x')}</button><div class="bar__t" style="color:#fff">Сканер коробок<small>${j.id} · ${esc(j.client)}</small></div></div>
      <div class="seg" role="group" aria-label="Режим">${[['pack', 'Упаковка'], ['load', 'Погрузка'], ['unload', 'Выгрузка']].map(([k, t]) => `<button data-act="scan-mode" data-v="${k}" aria-pressed="${mode === k}">${t}</button>`).join('')}</div>
      ${mode === 'pack' ? `<div class="rooms">${ROOMS.map((r) => `<button class="room" style="--c:${r.c}" data-act="scan-room" data-v="${r.id}" aria-pressed="${S.scan.room === r.id}"><i></i>${r.n}</button>`).join('')}</div>` : ''}
      <div class="cam" data-cam><video playsinline muted></video><div class="cam__frame"><b></b><b></b><b></b><b></b><span class="cam__line"></span></div><p class="cam__msg" data-cam-msg>Включаем камеру…</p></div>
      <div class="scan__bot"><div class="meter"><div class="row row--sb"><div class="meter__n">${m.n}${m.of ? `<small> из ${m.of}</small>` : ''} <small>${m.label}</small></div>
        ${mode === 'pack' ? `<span class="badge badge--tape">${room(S.scan.room).n}</span>` : ''}</div>${m.of ? `<div class="meter__bar"><i style="width:${(m.n / m.of) * 100}%"></i></div>` : ''}
        ${m.miss.length ? `<div class="miss">${m.miss.slice(0, 6).map((b) => `<span>${room(b.room).n} · ${pad2(b.n)}</span>`).join('')}${m.miss.length > 6 ? `<span>+${m.miss.length - 6}</span>` : ''}</div>` : ''}</div>
        <div class="grid2"><button class="btn btn--ghost-d" data-act="demo-scan">Демо: скан</button>${mode === 'pack' ? `<button class="btn btn--tape" data-act="scan-close">Готово</button>` : `<button class="btn btn--ghost-d" data-act="demo-scan-all">Демо: все</button>`}</div>
        ${mode !== 'pack' ? '<button class="btn btn--tape" data-act="scan-close">Готово</button>' : ''}</div></div>`;
  }
  function openScan(mode) {
    stopCam();
    const j = J(); S.scan = { mode: mode || 'pack', room: S.scan?.room || 'kitchen' }; save();
    app.insertAdjacentHTML('beforeend', scanUI());
    if (j.pkg === 'move' && mode === 'pack') toast('Коробки клиента: клеим наши наклейки и сканируем');
    startCam();
  }
  function rerenderScan() {
    const live = cam && cam.stream; const sc = app.querySelector('.scan'); if (!sc) return;
    const video = sc.querySelector('video');
    const tmp = document.createElement('div'); tmp.innerHTML = scanUI(); const nw = tmp.firstElementChild;
    if (live && video) nw.querySelector('[data-cam]').replaceWith(sc.querySelector('[data-cam]'));
    sc.replaceWith(nw);
  }
  async function startCam() {
    const sc = app.querySelector('.scan'); if (!sc) return;
    const msg = (t) => { const m = app.querySelector('[data-cam-msg]'); if (m) m.textContent = t; };
    if (!navigator.mediaDevices?.getUserMedia) { msg('Камера недоступна — нажмите «Демо: скан»'); return; }
    const c = { alive: true, stream: null, det: null, last: '', lastT: 0 }; cam = c;
    try {
      c.stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 1280 } }, audio: false });
      if (!c.alive) { c.stream.getTracks().forEach((t) => t.stop()); return; }
      const v = app.querySelector('.scan video'); v.srcObject = c.stream; await v.play().catch(() => { });
      msg('Наведите на QR-код наклейки');
      if ('BarcodeDetector' in window) { try { const f = await window.BarcodeDetector.getSupportedFormats?.(); if (!f || f.includes('qr_code')) c.det = new window.BarcodeDetector({ formats: ['qr_code'] }); } catch (e) { c.det = null; } }
      if (!c.det) await loadJsQR();
      const cv = document.createElement('canvas'), g = cv.getContext('2d', { willReadFrequently: true });
      const loop = async () => {
        if (!c.alive) return;
        const vid = app.querySelector('.scan video');
        if (vid && vid.readyState >= 2) {
          let val = '';
          try {
            if (c.det) { const r = await c.det.detect(vid); if (r[0]) val = r[0].rawValue; }
            else if (window.jsQR) { const w = 480, h = Math.round((vid.videoHeight / vid.videoWidth) * w) || 480; cv.width = w; cv.height = h; g.drawImage(vid, 0, 0, w, h); const d = g.getImageData(0, 0, w, h); const r = window.jsQR(d.data, w, h, { inversionAttempts: 'dontInvert' }); if (r) val = r.data; }
          } catch (e) { }
          if (val && (val !== c.last || now() - c.lastT > 2500) && !app.querySelector('.sheet')) { c.last = val; c.lastT = now(); onScan(val, false); }
        }
        setTimeout(loop, 180);
      };
      loop();
    } catch (e) { msg('Нет доступа к камере — нажмите «Демо: скан»'); }
  }
  function loadJsQR() {
    if (window.jsQR) return Promise.resolve();
    return new Promise((res) => { const s = document.createElement('script'); s.src = 'https://cdn.jsdelivr.net/npm/jsqr@1.4.0/dist/jsQR.js'; s.onload = res; s.onerror = res; document.head.append(s); });
  }
  function flashCam() { const c = app.querySelector('[data-cam]'); if (!c) return; c.classList.remove('hit'); void c.offsetWidth; c.classList.add('hit'); }
  function onScan(raw, demo) {
    const j = J(), mode = S.scan.mode, m = String(raw).toUpperCase().match(/MB-[A-Z0-9]{5}/);
    const code = m ? m[0] : hashCode(String(raw));
    flashCam();
    if (mode === 'pack') {
      const ex = j.boxes.find((b) => b.code === code);
      if (ex) { buzz(false); toast(`Эта наклейка уже на коробке ${room(ex.room).n} · ${pad2(ex.n)}`); return; }
      buzz(true);
      const r = S.scan.room, n = j.boxes.filter((b) => b.room === r).length + 1;
      S.draft = { code: demo ? code5() : code, room: r, n, st: 'packed', fragile: false, first: false, note: '', ph: [], t: now() };
      boxSheet();
      return;
    }
    let b = j.boxes.find((x) => x.code === code);
    const want = mode === 'load' ? 'packed' : 'loaded';
    if (!b || b.st !== want) {
      if (b && b.st !== want) { buzz(false); toast(`${room(b.room).n} · ${pad2(b.n)} уже ${mode === 'load' ? 'в бусе' : 'на месте'}`); return; }
      b = j.boxes.find((x) => x.st === want);         // прототип: незнакомый QR принимаем за следующую коробку из списка
      if (!b) { buzz(false); toast(mode === 'load' ? 'Все коробки уже в бусе' : 'Все коробки уже на месте'); return; }
      if (!demo) toast('Демо: QR принят как ' + room(b.room).n + ' · ' + pad2(b.n));
    }
    buzz(true);
    if (mode === 'load') { b.st = 'loaded'; act(`Коробка ${room(b.room).n} · ${pad2(b.n)} → в бус`, j.id); if (demo) toast(`${room(b.room).n} · ${pad2(b.n)} → в бус WX 1234A`); }
    else { b.st = 'unloaded'; act(`Коробка ${room(b.room).n} · ${pad2(b.n)} → ${room(b.room).n}`, j.id); roomHint(b); }
    save(); rerenderScan();
    const meta = scanMeta(j, mode); if (meta.of && meta.n >= meta.of) setTimeout(() => toast(mode === 'load' ? `Все ${meta.of} коробок в бусе — можно ехать` : `Все ${meta.of} коробок на месте`), 900);
  }
  function roomHint(b) {
    const r = room(b.room);
    app.querySelector('.room-hint')?.remove();
    const el = document.createElement('div'); el.className = 'toast room-hint';
    el.style.cssText = `top:auto;bottom:calc(230px + var(--sb));background:${r.c};color:${['living', 'bed', 'office'].includes(r.id) ? '#fff' : '#10161D'};flex-direction:column;align-items:flex-start;gap:2px;padding:14px 16px`;
    el.innerHTML = `<b style="font:300 24px/1 var(--display);letter-spacing:-.04em">${r.n} · ${pad2(b.n)}</b><span>Несите: ${r.where}</span>`;
    app.append(el); setTimeout(() => { el.classList.add('out'); setTimeout(() => el.remove(), 300); }, 2400);
  }

  /* ---------- нижние листы ---------- */
  function sheet(html, cls = '') {
    closeSheet();
    app.insertAdjacentHTML('beforeend', `<div class="sheet-bg" data-act="sheet-close"></div><section class="sheet ${cls}" role="dialog">${html}</section>`);
  }
  function closeSheet() { app.querySelectorAll('.sheet, .sheet-bg').forEach((e) => e.remove()); }
  function boxSheet() {
    const d = S.draft, r = room(d.room);
    const phs = d.ph.map((p, i) => `<div class="ph ph--fill pop"><img src="${p.thumb}" alt=""><em>Содержимое ${i + 1}</em></div>`).join('');
    const slots = d.ph.length < 3 ? `<label class="ph">${ic('cam')}<span>${d.ph.length ? 'Ещё фото' : 'Фото содержимого'}</span><input type="file" accept="image/*" capture="environment" data-boxph></label>` : '';
    sheet(`<div class="boxid" style="--c:${r.c}"><div><p class="boxid__room">${r.n} · ${pad2(d.n)}</p><p class="boxid__code">${d.code} · наклейка</p></div><div class="boxid__qr">${qrSvg('https://melbus.pl/b/' + d.code)}</div></div>
      <div class="photos">${phs}${slots}</div><div class="need"><span>${d.ph.length ? `<b>${d.ph.length} фото</b> · клиент увидит их по QR` : 'Нужно хотя бы 1 фото содержимого'}</span><button class="link" data-act="box-demo-ph">Демо-фото</button></div>
      <textarea class="ta" data-el="box-note" placeholder="Что внутри: тарелки, кастрюли…">${esc(d.note)}</textarea>
      <button class="toggle${d.fragile ? ' on' : ''}" data-act="box-tg" data-v="fragile"><span><b>Хрупкое</b><small>Наклейка «Ostrożnie», грузим сверху</small></span><i></i></button>
      <button class="toggle${d.first ? ' on' : ''}" data-act="box-tg" data-v="first"><span><b>Коробка первой ночи</b><small>Открываем первой: зарядки, бельё, чайник</small></span><i></i></button>
      <button class="btn btn--tape btn--block${d.ph.length ? '' : ' is-off'}" data-act="box-save">Сохранить коробку</button>`);
  }
  function itemSheet(id) {
    const j = J(), x = j.items.find((i) => i.id === id);
    sheet(`<div class="row"><img src="${img3d(x.ic)}" alt="" style="width:64px;height:64px;mix-blend-mode:multiply"><div><p class="sheet__t">${esc(x.n)}</p><span class="muted" style="font-size:13px">${esc(x.s)}</span></div></div>
      <div class="ladder">${x.steps.map((s, i) => `<button class="${i < x.st ? 'is-done' : ''}${i === x.st ? ' is-next' : ''}" data-act="item-st" data-v="${id}" data-i="${i}"><i>${i < x.st ? tick.replace('<svg', '<svg style="width:14px;height:14px;stroke:#10161D;stroke-width:2.8;fill:none"') : i + 1}</i>${esc(s)}</button>`).join('')}</div>
      <p class="k">Фото</p>${photoGrid('item-' + id, 0, [], 3)}
      ${x.dmg?.length ? x.dmg.map((d) => `<div class="approved" style="background:var(--red-bg);border-color:#F3C9BF"><svg viewBox="0 0 24 24">${P.warn}</svg><div><b>Повреждение · ${hm(d.t)}</b><small>${esc(d.text)}</small></div><span></span></div>`).join('') : ''}
      <div class="grid2"><button class="btn btn--red" data-act="damage" data-v="${id}">${ic('warn')}Повреждение</button><button class="btn btn--dark" data-act="sheet-close">Готово</button></div>`);
  }
  function damageSheet(itemId) {
    const j = J(); const x = itemId ? j.items.find((i) => i.id === itemId) : null;
    S.dmg = { item: itemId || '', text: '' };
    sheet(`<p class="sheet__t">Повреждение${x ? ` · ${esc(x.n)}` : ''}</p><p class="muted" style="margin:0;font-size:14px">Фото и пара слов — менеджер получит сразу. Если царапина была до переезда — отметьте это.</p>
      ${photoGrid('dmg', 1, ['Крупный план', 'Общий вид'], 3)}
      <textarea class="ta" data-el="dmg-text" placeholder="Что и где: скол на углу столешницы, 2 см"></textarea>
      <button class="toggle" data-act="dmg-before"><span><b>Было до переезда</b><small>Есть на фото «до» — не наша вина</small></span><i></i></button>
      <button class="btn btn--dark btn--block" data-act="dmg-send">Отправить менеджеру</button>`);
  }
  function menuOpen() {
    app.querySelector('.menu')?.remove();
    app.insertAdjacentHTML('beforeend', `<div class="sheet-bg" data-act="menu-close" style="background:transparent"></div><div class="menu" role="menu">
      <button class="toggle${S.offline ? ' on' : ''}" data-act="net-tg"><span><b>Режим без связи</b><small>Показать работу без интернета</small></span><i></i></button>
      <button data-act="reset">Сбросить демо <span class="muted">↺</span></button><button data-act="logout">Выйти</button></div>`);
  }

  /* ---------- действия ---------- */
  let pin = '';
  app.addEventListener('click', async (e) => {
    const b = e.target.closest('[data-act]'); if (!b) return;
    const a = b.dataset.act, v = b.dataset.v, j = J();
    if (b.classList.contains('is-off')) return;
    switch (a) {
      case 'key': {
        const box = app.querySelector('[data-el="pin"]');
        if (v === 'c') pin = pin.slice(0, -1); else if (v === 'ok') { if (pin.length < 4) return; } else if (pin.length < 4) pin += v;
        box.querySelectorAll('i').forEach((d, i) => d.classList.toggle('on', i < pin.length));
        if (pin.length === 4) {
          if (pin === '1234') { S.phone = app.querySelector('[data-el="phone"]').value; S.auth = true; S.route = { name: 'today' }; pin = ''; save(); setTimeout(() => render('fwd'), 180); }
          else { buzz(false); box.classList.add('shake'); setTimeout(() => { box.classList.remove('shake'); pin = ''; box.querySelectorAll('i').forEach((d) => d.classList.remove('on')); }, 450); }
        }
        return;
      }
      case 'back': goBack(); return;
      case 'tab': if (v === 'scan') { openScan(j.pkg === 'full' && j.stage <= 3 ? 'pack' : j.stage <= flow(j).indexOf('load') ? 'load' : 'unload'); return; } go(v, {}, false); return;
      case 'open-job': S.cur = v; go('job'); return;
      case 'go': go(v); return;
      case 'menu': menuOpen(); return;
      case 'menu-close': app.querySelectorAll('.menu, .sheet-bg').forEach((x) => x.remove()); return;
      case 'net-tg': S.offline = !S.offline; save(); if (!S.offline) flush(); render(false); return;
      case 'reset': localStorage.removeItem(KEY); S = seed(); S.auth = true; save(); render('fwd'); toast('Демо сброшено'); return;
      case 'logout': S.auth = false; save(); render(); return;
      case 'day-start': {
        b.classList.add('is-off'); b.innerHTML = 'Определяем геопозицию…';
        const g = await geo(); S.day = { start: now(), geo: g, pauses: [], end: null }; act(g ? `Начало дня · геопозиция ±${g.acc} м` : 'Начало дня · без геопозиции'); buzz(true);
        render(false); toast(g ? `День начат в ${hm(now())} · место отмечено` : `День начат в ${hm(now())} · без геопозиции`); return;
      }
      case 'pause': { const l = S.day.pauses[S.day.pauses.length - 1]; if (l && !l.e) { l.e = now(); act('Конец перерыва'); } else { S.day.pauses.push({ s: now(), e: null }); act('Перерыв'); } render(false); return; }
      case 'day-end': {
        const l = S.day.pauses[S.day.pauses.length - 1]; if (l && !l.e) l.e = now();
        const g = await geo(); S.day.end = now(); act(g ? 'Конец дня · геопозиция отмечена' : 'Конец дня'); save(); doneScreen('day'); return;
      }
      case 'stage': go('stage', { i: +v }); return;
      case 'check': { const k = b.dataset.k, i = +b.dataset.i; (j.checks[k] ||= [])[i] = !j.checks[k][i]; save(); b.classList.toggle('on'); refreshDock(); return; }
      case 'ph-del': { const k = b.dataset.k; j.photos[k].splice(+b.dataset.i, 1); save(); if (k.startsWith('item-') && app.querySelector('.sheet')) itemSheet(k.slice(5)); else render(false); return; }
      case 'ph-demo': {
        const k = b.dataset.k, need = +b.dataset.need, labels = (b.dataset.labels || '').split('|');
        const list = (j.photos[k] ||= []); const add = Math.max(1, need - list.length);
        for (let i = 0; i < add && list.length < 6; i++) list.push({ ...demoPhoto(labels[list.length] || 'Фото'), fresh: true });
        act(`Фото · ${add} шт.`, j.id); save();
        if (app.querySelector('.sheet') && k === 'dmg') { const tmp = app.querySelector('.sheet .photos'); tmp.outerHTML = photoGrid('dmg', 1, ['Крупный план', 'Общий вид'], 3).replace(/<div class="need">[\s\S]*$/, ''); return; }
        if (app.querySelector('.sheet') && k.startsWith('item-')) { itemSheet(k.slice(5)); return; }
        render(false); toast(`Фото сжато: ${(3.2).toLocaleString('ru-RU')} МБ → ${214} КБ`); return;
      }
      case 'stage-done': {
        const f = flow(j), i = S.route.i, k = f[i]; if (j.done[k]) return;
        if (!stageReady(j, k)[0]) return;
        j.done[k] = now(); if (k === 'depart' && !j.started) j.started = now();
        if (k === 'accept') { act(`Приёмка · подпись клиента · оплата ${j.accept.pay}`, j.id); }
        act(`${ST[k].t} — готово`, j.id); buzz(true);
        j.stage = Math.min(f.length, Math.max(j.stage, i + 1));
        if (k === 'back') { j.closed = now(); save(); doneScreen('job'); return; }
        save(); toast(`«${ST[k].t}» — готово в ${hm(now())}`);
        if (j.stage < f.length) { S.route = { name: 'stage', i: j.stage, prev: S.route.prev }; render('fwd'); } else go('job', {}, true);
        return;
      }
      case 'scan': openScan(v); return;
      case 'scan-close': stopCam(); render(false); return;
      case 'scan-mode': S.scan.mode = v; save(); rerenderScan(); return;
      case 'scan-room': S.scan.room = v; save(); rerenderScan(); return;
      case 'demo-scan': onScan(S.scan.mode === 'pack' ? code5() : (J().boxes.find((x) => x.st === (S.scan.mode === 'load' ? 'packed' : 'loaded'))?.code || 'MB-XXXXX'), true); return;
      case 'demo-scan-all': {
        const want = S.scan.mode === 'load' ? 'packed' : 'loaded', list = j.boxes.filter((x) => x.st === want);
        list.forEach((x) => { x.st = S.scan.mode === 'load' ? 'loaded' : 'unloaded'; act(`Коробка ${room(x.room).n} · ${pad2(x.n)} → ${S.scan.mode === 'load' ? 'в бус' : room(x.room).n}`, j.id); });
        save(); flashCam(); buzz(true); rerenderScan(); toast(list.length ? `Демо: ${list.length} ${plural(list.length, 'коробка', 'коробки', 'коробок')} отсканировано` : 'Нечего сканировать'); return;
      }
      case 'box-demo-ph': S.draft.ph.push(demoPhoto('Содержимое')); boxSheet(); return;
      case 'box-tg': S.draft[v] = !S.draft[v]; b.classList.toggle('on'); return;
      case 'box-save': {
        const d = S.draft; d.note = app.querySelector('[data-el="box-note"]')?.value || '';
        j.boxes.push(d); act(`Коробка ${room(d.room).n} · ${pad2(d.n)} упакована · ${d.ph.length} фото`, j.id); S.draft = null; save(); closeSheet(); rerenderScan();
        toast(`${room(d.room).n} · ${pad2(d.n)} сохранена${d.first ? ' · коробка первой ночи' : ''}`); return;
      }
      case 'sheet-close': closeSheet(); if (S.route.name === 'items') render(false); return;
      case 'item': itemSheet(v); return;
      case 'item-st': {
        const x = j.items.find((i) => i.id === v), i = +b.dataset.i; x.st = i < x.st ? i : i + 1;
        act(`${x.n}: ${x.st ? x.steps[x.st - 1].toLowerCase() : 'сброшено'}`, j.id); save(); itemSheet(v); buzz(true); return;
      }
      case 'damage': damageSheet(v); return;
      case 'dmg-before': b.classList.toggle('on'); S.dmg.before = b.classList.contains('on'); return;
      case 'dmg-send': {
        const text = app.querySelector('[data-el="dmg-text"]')?.value || 'без описания';
        const x = S.dmg.item ? j.items.find((i) => i.id === S.dmg.item) : null;
        if (x) (x.dmg ||= []).push({ t: now(), text: (S.dmg.before ? 'Было до переезда: ' : '') + text });
        act(`Повреждение${x ? ' · ' + x.n : ''}: ${text}`, j.id); j.photos.dmg = []; save(); closeSheet();
        toast(isOff() ? 'Сохранено · уйдёт менеджеру, когда появится связь' : 'Менеджер получил: фото и описание'); render(false); return;
      }
      case 'x-inc': case 'x-dec': {
        const sel = (S.route.sel ||= {}), was = Object.values(sel).some((q) => q > 0);
        sel[v] = Math.max(0, (sel[v] || 0) + (a === 'x-inc' ? 1 : -1)); S.route.signed = false; save(); render(false);
        if (!was && a === 'x-inc') app.querySelector('[data-sig="extra"]')?.scrollIntoView({ behavior: 'smooth', block: 'center' });   // первая работа — сразу к подписи
        return;
      }
      case 'x-approve': {
        const sel = S.route.sel || {}; let total = 0;
        EXTRAS.forEach((x) => { const q = sel[x.id] || 0; if (q) { j.extras.push({ id: x.id, n: x.n + (q > 1 ? ` × ${q}` : ''), sum: q * x.p, t: now() }); total += q * x.p; } });
        act(`Доп. работа согласована · +${zl(total)} · подпись клиента`, j.id); S.route.sel = {}; S.route.signed = false; save(); buzz(true);
        toast(`Согласовано в ${hm(now())} · +${zl(total)}`); render(false); app.querySelector('.view')?.scrollTo({ top: 0, behavior: 'smooth' }); return;
      }
      case 'rate': j.accept.rate = +v; save(); app.querySelectorAll('.stars button').forEach((s, i) => s.classList.toggle('on', i < +v)); return;
      case 'pay': j.accept.pay = v; save(); app.querySelectorAll('.pay button').forEach((p) => p.setAttribute('aria-pressed', String(p.dataset.v === v))); refreshDock(); return;
      case 'done-close': app.querySelector('.done')?.remove(); go('today', {}, true); return;
      default:
    }
  });
  // фото с камеры / из галереи
  app.addEventListener('change', async (e) => {
    const inp = e.target; if (!(inp instanceof HTMLInputElement) || inp.type !== 'file' || !inp.files?.[0]) return;
    const file = inp.files[0];
    try {
      const p = await compress(file);
      if (inp.hasAttribute('data-boxph')) { S.draft.ph.push(p); boxSheet(); toast(`Фото сжато: ${(p.orig / 1024).toFixed(1).replace('.', ',')} МБ → ${p.kb} КБ`); return; }
      const k = inp.dataset.ph, j = J(); (j.photos[k] ||= []).push({ ...p, fresh: true }); act(`Фото · ${inp.dataset.lbl || k}`, j.id); save();
      if (app.querySelector('.sheet') && k.startsWith('item-')) itemSheet(k.slice(5));
      else if (app.querySelector('.sheet') && k === 'dmg') { const g = app.querySelector('.sheet .photos'); g.outerHTML = photoGrid('dmg', 1, ['Крупный план', 'Общий вид'], 3).replace(/<div class="need">[\s\S]*$/, ''); }
      else render(false);
      toast(`Фото сжато: ${(p.orig / 1024).toFixed(1).replace('.', ',')} МБ → ${p.kb} КБ`);
    } catch (err) { toast('Не удалось прочитать фото'); }
  });
  app.addEventListener('input', (e) => {
    const el = e.target.closest('[data-el]'); if (!el) return;
    if (el.dataset.el === 'acc-note') { J().accept.note = el.value; save(); }
    if (el.dataset.el === 'box-note' && S.draft) S.draft.note = el.value;
  });

  /* ---------- экран «готово» ---------- */
  function doneScreen(kind) {
    const j = J();
    const html = kind === 'job'
      ? `<div class="done"><div class="done__tape"><span>MELBUS · ГОТОВО · MELBUS · ГОТОВО · MELBUS · ГОТОВО</span></div><h2 class="done__t">Заказ закрыт</h2><p class="done__p">${esc(j.client)} · ${esc(j.to.a)}. Клиент получил протокол приёмки и фактуру на странице переезда.</p>
        <div class="stats"><div><b>${hmm((j.closed || now()) - (j.started || now()))}</b><span>на заказе · план ${j.planH} ч</span></div><div><b>${j.boxes.length}</b><span>коробок по QR</span></div>
        <div><b>${Object.values(j.photos).reduce((a, l) => a + l.length, 0)}</b><span>фото</span></div><div><b>${j.accept.rate || '—'}${j.accept.rate ? '/5' : ''}</b><span>оценка клиента</span></div></div>
        <button class="btn btn--tape btn--block" data-act="done-close">К заказам на сегодня</button></div>`
      : `<div class="done"><div class="done__tape"><span>MELBUS · ДЕНЬ ЗАКОНЧЕН · MELBUS · ДЕНЬ ЗАКОНЧЕН</span></div><h2 class="done__t">Спасибо,<br>${esc(S.user.name)}</h2><p class="done__p">Начало ${hm(S.day.start)} · конец ${hm(S.day.end)}. Часы ушли в Пульт — зарплата считается сама.</p>
        <div class="stats"><div><b>${hmm(worked())}</b><span>отработано</span></div><div><b>${S.jobs.filter((x) => x.closed).length}</b><span>заказов закрыто</span></div>
        <div><b>${S.log.filter((l) => /^Коробка/.test(l.text)).length}</b><span>сканов коробок</span></div><div><b>${S.day.pauses.length}</b><span>перерывов</span></div></div>
        <button class="btn btn--tape btn--block" data-act="done-close">Готово</button></div>`;
    stopCam(); app.insertAdjacentHTML('beforeend', html); buzz(true);
  }

  /* ---------- часы в шапке ---------- */
  setInterval(() => {
    if (!S.auth || !S.day.start || S.day.end) return;
    const t = dur(worked(), true);
    app.querySelectorAll('[data-clock] span').forEach((x) => { x.textContent = t; });
    app.querySelectorAll('[data-clock-big]').forEach((x) => { x.textContent = t; });
    const j = J(); const jc = app.querySelector('[data-jobclock]'); if (jc && j.started) jc.textContent = dur((j.closed || now()) - j.started, true).slice(0, -3);
  }, 1000);

  /* ---------- старт ---------- */
  render();
  // QR на боковой панели (компьютер)
  const fillQR = () => document.querySelectorAll('[data-qr]').forEach((el) => { if (!el.innerHTML) el.innerHTML = qrSvg(el.dataset.qr); });
  if (window.qrcode) fillQR(); else addEventListener('load', fillQR);
  if ('serviceWorker' in navigator && (location.protocol === 'https:' || location.hostname === 'localhost')) {
    addEventListener('load', () => navigator.serviceWorker.register('/proto/app/sw.js', { scope: '/proto/app/' }).catch(() => { }));
  }
})();
