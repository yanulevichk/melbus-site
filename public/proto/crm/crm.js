/*
 * ПРОТОТИП CRM «Пульт» (23.11.2026) — кликабельный, без сервера: данные в data.js, всё живёт в браузере.
 * Экраны: Сегодня · Заявки (канбан) · Оферты · Расписание · Заказы · Заказ · Сотрудники · Бусы · Коробки · Финансы ·
 * Отчёты · Настройки. Перетаскивание — мышью (на телефоне — кнопка «⋯» / касание). Спецификация — docs/crm/SYSTEM.md.
 */
(() => {
  'use strict';
  const D = window.D;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const nf = new Intl.NumberFormat('ru-RU');
  const zl = (n) => `${nf.format(Math.round(n))} zł`;
  const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const S = (id) => D.staff.find((x) => x.id === id);
  const V = (id) => D.vans.find((x) => x.id === id);
  const J = (id) => D.jobs.find((x) => x.id === id);
  const Ld = (id) => D.leads.find((x) => x.id === id);
  const initials = (n) => n.replace(/[^A-Za-zА-Яа-яЁёĄ-ž\s]/g, '').split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0]).join('').toUpperCase();
  const plural = (n, a, b, c) => { const m10 = n % 10, m100 = n % 100; return m10 === 1 && m100 !== 11 ? a : m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14) ? b : c; };
  const DAY = Object.fromEntries(D.DAYS.map((d) => [d.k, d]));
  const dayLabel = (k) => { const d = DAY[k]; if (d) return `${d.d} ${d.n}.11`; const [, m, dd] = k.split('-'); return `${dd}.${m}`; };
  const hh = (h) => `${String(Math.floor(h)).padStart(2, '0')}:${h % 1 ? '30' : '00'}`;

  /* ---------- иконки (линии, цвет — currentColor) ---------- */
  const P = {
    today: '<rect x="4" y="4" width="7" height="9" rx="1.5"/><rect x="13" y="4" width="7" height="5" rx="1.5"/><rect x="13" y="11" width="7" height="9" rx="1.5"/><rect x="4" y="15" width="7" height="5" rx="1.5"/>',
    leads: '<path d="M4 13l2.5-8h11L20 13v6H4z"/><path d="M4 13h4.5l1 2h5l1-2H20"/>',
    offers: '<path d="M7 3h7l4 4v14H7z"/><path d="M14 3v4h4M10 12h5M10 16h5"/>',
    schedule: '<rect x="4" y="5" width="16" height="15" rx="2"/><path d="M4 10h16M9 3v4M15 3v4"/>',
    jobs: '<path d="M4 8l8-4 8 4v8l-8 4-8-4z"/><path d="M4 8l8 4 8-4M12 12v8"/>',
    staff: '<circle cx="9" cy="8" r="3.5"/><path d="M3 20c.5-3.5 3-5.5 6-5.5s5.5 2 6 5.5"/><path d="M16 4.6a3.5 3.5 0 0 1 0 6.8M18 14.8c1.7.7 2.7 2.4 3 5.2"/>',
    vans: '<path d="M3 6h11v10H3zM14 9h4l3 3.5V16h-7"/><circle cx="7" cy="17.5" r="1.8"/><circle cx="17" cy="17.5" r="1.8"/>',
    boxes: '<rect x="4" y="12" width="7" height="8" rx="1"/><rect x="13" y="12" width="7" height="8" rx="1"/><rect x="8.5" y="4" width="7" height="8" rx="1"/>',
    finance: '<rect x="3" y="6" width="18" height="13" rx="2"/><path d="M3 10h18M16 14.5h2"/>',
    reports: '<path d="M4 20V11M10 20V5M16 20v-6M3 20h18"/>',
    settings: '<circle cx="12" cy="12" r="3"/><path d="M12 2.5v3M12 18.5v3M4.6 4.6l2.1 2.1M17.3 17.3l2.1 2.1M2.5 12h3M18.5 12h3M4.6 19.4l2.1-2.1M17.3 6.7l2.1-2.1"/>',
    search: '<circle cx="11" cy="11" r="6.5"/><path d="M16 16l4.5 4.5"/>',
    bell: '<path d="M6 16v-5a6 6 0 0 1 12 0v5l1.5 2h-15z"/><path d="M10 20.5a2 2 0 0 0 4 0"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    phone: '<path d="M7 4h3l1.5 4-2 1.3a10 10 0 0 0 5.2 5.2L16 12.5l4 1.5v3a2 2 0 0 1-2 2A15 15 0 0 1 5 6a2 2 0 0 1 2-2z"/>',
    play: '<path d="M9 6.5v11l9-5.5z"/>',
    cam: '<path d="M4 8h3l2-3h6l2 3h3v11H4z"/><circle cx="12" cy="13" r="3.5"/>',
    check: '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
    x: '<path d="M6 6l12 12M18 6L6 18"/>',
    clock: '<circle cx="12" cy="12" r="8"/><path d="M12 8v4.5l3 2"/>',
    pin: '<path d="M12 21s-6.5-6-6.5-11a6.5 6.5 0 0 1 13 0c0 5-6.5 11-6.5 11z"/><circle cx="12" cy="10" r="2.3"/>',
    dots: '<circle cx="5" cy="12" r="1.3"/><circle cx="12" cy="12" r="1.3"/><circle cx="19" cy="12" r="1.3"/>',
    menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
    alert: '<path d="M12 4l9 16H3z"/><path d="M12 10v4M12 17v.3"/>',
    chev: '<path d="M9 6l6 6-6 6"/>',
    back: '<path d="M15 6l-6 6 6 6"/>',
    left: '<path d="M14 6l-6 6 6 6"/>',
    right: '<path d="M10 6l6 6-6 6"/>',
    sign: '<path d="M3 17c3-1 4-8 6-8s0 8 3 8 3-5 5-5 2 3 4 3"/>',
    qr: '<path d="M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4z"/><path d="M14 14h2v2h-2zM18 14h2v2h-2zM14 18h2v2h-2zM18 18h2v2h-2z"/>',
    chat: '<path d="M4 5h16v11H9l-5 4z"/>',
    link: '<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1"/><path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/>',
    send: '<path d="M4 12l16-7-5 15-3-6z"/><path d="M12 14l3-3"/>',
    wrench: '<path d="M14.5 6.5a4 4 0 0 0 5 5L12 19a2.1 2.1 0 0 1-3-3z"/>',
    key: '<circle cx="8" cy="15" r="4"/><path d="M11 12l8-8M16 7l2 2"/>',
    eye: '<path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z"/><circle cx="12" cy="12" r="2.8"/>',
    tape: '<path d="M3 15l14-10 4 4-14 10z"/><path d="M8 11.5l4 4"/>',
    route: '<circle cx="6" cy="6" r="2.2"/><circle cx="18" cy="18" r="2.2"/><path d="M8 7.5c5 1 3 7 8 9"/>',
  };
  const ico = (n, c = '') => `<svg class="i ${c}" viewBox="0 0 24 24" aria-hidden="true">${P[n] || ''}</svg>`;

  const NAV = [
    ['today', 'Сегодня'], ['leads', 'Заявки'], ['offers', 'Оферты'], ['schedule', 'Расписание'], ['jobs', 'Заказы'],
    ['staff', 'Сотрудники'], ['vans', 'Бусы'], ['boxes', 'Коробки'], ['finance', 'Финансы'], ['reports', 'Отчёты'], ['settings', 'Настройки'],
  ];
  const STATUS = {
    booked: ['Ждёт задаток', 'warn'], confirmed: ['Подтверждён', 'ok'], in_progress: ['Идёт', 'live'], done: ['Выполнен', 'done'],
    closed: ['Закрыт · оплачен', 'done'], cancelled: ['Отменён', 'mute'],
  };
  const PKGC = { taxi: 'pk-taxi', move: 'pk-move', full: 'pk-full' };
  const SRC = { 'Сайт': 'site', 'Телефон': 'tel', 'WhatsApp': 'wa', 'Instagram': 'ig' };

  /* ---------- общие кусочки ---------- */
  const route = (a, b) => `<span class="rt"><span class="rt__p"><i>A</i>${esc(a)}</span><span class="rt__l" aria-hidden="true"></span><span class="rt__p"><i class="b">B</i>${esc(b)}</span></span>`;
  const routeOfLead = (r) => { const [a, b] = r.split(' → '); return route(a, b); };
  const pkgTag = (p) => `<span class="pk ${PKGC[p]}">${D.PKG[p]}</span>`;
  const st = (s) => { const [t, c] = STATUS[s] || [s, 'mute']; return `<span class="st st--${c}">${t}</span>`; };
  const ava = (id, cls = '') => { const s = S(id); return s ? `<span class="ava ${cls}" title="${esc(s.name)} · ${esc(s.role)}">${initials(s.name)}</span>` : ''; };
  const crewNames = (j) => j.crew.map((id) => S(id).name).join(', ');
  const vanNames = (j) => j.vans.length ? j.vans.map((v) => `${V(v).name} <span class="mono">${V(v).plate}</span>`).join(', ') : '<span class="warn-t">бус не назначен</span>';
  const head = (k, title, act = '') => `<div class="ph"><div><p class="ph__k">${k}</p><h1 class="tl">${title}</h1></div>${act ? `<div class="ph__act">${act}</div>` : ''}</div>`;
  const empty = (t) => `<div class="empty">${ico('jobs')}<p>${t}</p></div>`;

  /* ---------- состояние «живого» дня ---------- */
  const feed = [
    { at: '09:41', who: 's4', t: 'упакована коробка <b class="mono">MB-4QZ7N</b> · Кухня 12', job: 'M-1142' },
    { at: '09:38', who: 's7', t: 'начал выгрузку на Kondratowicza 20', job: 'M-1145' },
    { at: '09:31', who: 's1', t: 'клиент подписал доп. работу «Снять карниз» · 30 zł', job: 'M-1142' },
    { at: '09:20', who: 's5', t: 'погрузка закончена · 26 из 26 коробок в бусе', job: 'M-1143' },
    { at: '09:05', who: 's1', t: 'начата упаковка · 6 фото «до» загружено', job: 'M-1142' },
    { at: '08:31', who: 's1', t: 'бригада на месте · фото подъезда', job: 'M-1142' },
  ];
  let clock = 9 * 60 + 42; // 09:42
  const now = () => `${String(Math.floor(clock / 60)).padStart(2, '0')}:${String(clock % 60).padStart(2, '0')}`;

  /* ---------- генерация деталей заказа (коробки, фото, вещи, события) ---------- */
  const rng = (seed) => { let h = 2166136261; for (const c of seed) h = Math.imul(h ^ c.charCodeAt(0), 16777619); return () => ((h = Math.imul(h ^ (h >>> 15), 2246822507) ^ Math.imul(h ^ (h >>> 13), 3266489909)) >>> 0) / 4294967296; };
  const ALPH = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  const WHAT = {
    kitchen: ['Тарелки, миски', 'Кастрюли и сковороды', 'Бокалы — хрупкое', 'Банки, специи', 'Тостер, блендер', 'Столовые приборы', 'Сервиз — хрупкое', 'Контейнеры, крышки'],
    bed: ['Постельное бельё', 'Одежда зимняя', 'Обувь', 'Книги', 'Документы', 'Одежда летняя'],
    living: ['Книги', 'Вазы, декор — хрупкое', 'Провода, роутер, пульты', 'Пледы, подушки', 'Настольные игры', 'Рамки, картины'],
    kids: ['Игрушки', 'Детская одежда', 'Конструктор', 'Детские книги'],
    bath: ['Полотенца', 'Косметика', 'Фен, бритва'],
    hall: ['Обувь', 'Шапки, шарфы', 'Инструменты'],
  };
  const SPLIT = [['kitchen', 0.3], ['bed', 0.22], ['living', 0.2], ['kids', 0.12], ['bath', 0.08], ['hall', 0.08]];
  function boxesOf(j) {
    if (j._boxes || !j.boxes) return j._boxes || [];
    const r = rng(j.id), out = [];
    let left = j.boxes;
    SPLIT.forEach(([room, k], i) => {
      const n = i === SPLIT.length - 1 ? left : Math.max(1, Math.round(j.boxes * k)); left -= n;
      for (let q = 1; q <= n; q++) {
        let code = 'MB-'; for (let c = 0; c < 5; c++) code += ALPH[Math.floor(r() * ALPH.length)];
        const what = WHAT[room][Math.floor(r() * WHAT[room].length)];
        out.push({ code, room, no: q, what, fragile: /хрупк/.test(what), night: room === 'bed' && q === 1, by: j.crew[Math.floor(r() * j.crew.length)], photos: 1 + Math.floor(r() * 3) });
      }
    });
    if (j.id === 'M-1142') out[0].code = 'MB-7F3K2';
    j._boxes = out; return out;
  }
  const boxState = (j, i) => (i < (j.unloaded || 0) ? 3 : i < (j.loaded || 0) ? 2 : i < (j.packed || 0) ? 1 : 0);
  const BOX_ST = ['выдана', 'упакована', 'в бусе', 'на месте'];

  const ITEMS = [
    ['Шкаф 2 м', 'разобрать и собрать', 45], ['Кровать 160', 'подъёмный механизм', 30], ['Диван 3-местный', 'плёнка, углы', 20], ['Кресло', '', 8],
    ['Комод', 'ящики закрепить', 15], ['Холодильник', 'разморожен клиентом', 25], ['Стиральная машина', 'транспортные болты', 30], ['Телевизор 55″', 'снять со стены', 48],
    ['Тумба под ТВ', '', 10], ['Стол обеденный + 4 стула', 'ножки снять', 15], ['Письменный стол', 'разобрать', 25], ['Стеллаж', 'разобрать', 20],
    ['Зеркало 120 см', 'хрупкое, уголки', 10], ['Ковёр 2×3 м', 'скрутить', 8],
  ];
  const ITEM_ST = ['В списке', 'Разобран', 'Упакован', 'В бусе', 'Выгружен', 'Собран', 'На месте'];
  function itemsOf(j) {
    if (j._items) return j._items;
    const r = rng(j.id + 'i'), n = j.pkg === 'taxi' ? 3 : j.id === 'M-1144' ? 10 : Math.min(ITEMS.length, 9 + Math.floor(r() * 5));
    const lvl = (s) => (s < 3 ? 0 : s === 3 ? 1 : s === 4 ? 2 : s === 5 ? 3 : s === 6 ? 4 : s === 7 ? 5 : 6);
    const base = lvl(j.stage);
    j._items = ITEMS.slice(0, n).map(([t, d, norm], i) => {
      let s = base; if (j.stage === 3) s = i < 4 ? 2 : i < 7 ? 1 : 0; if (j.stage >= 10) s = 6;
      const fact = s >= 5 || (j.stage >= 3 && s >= 1) ? Math.round(norm * (0.8 + r() * 0.45)) : null;
      return { t, d, norm, fact, s, dmg: j.id === 'M-1143' && t === 'Комод' };
    });
    return j._items;
  }
  const STAGE_PH = { 1: ['arrive'], 2: ['before1', 'before2', 'protect'], 3: ['pack1', 'pack2', 'pack3', 'tape'], 4: ['load', 'van'], 5: ['road'], 6: ['after2'], 7: ['after1'], 8: ['std'] };
  function photosOf(j) {
    const r = rng(j.id + 'p'), out = [];
    Object.entries(STAGE_PH).forEach(([si, keys]) => {
      si = +si;
      const has = j.stage >= 10 || j.stage > si || (j.stage === si && si >= 1 && si <= 3);
      if (!has || !D.PKG_STAGES[j.pkg].includes(si)) return;
      const t = (j.times[si] || '').split('–')[0] || '—';
      keys.forEach((k, i) => {
        const [src, cap] = D.PHOTOS[k];
        out.push({ src, cap, stage: si, by: j.crew[Math.floor(r() * j.crew.length)], at: t, geo: `52.${180 + Math.floor(r() * 80)}, 21.0${Math.floor(r() * 90)}`, acc: 4 + Math.floor(r() * 9), sha: Math.floor(r() * 0xffffffff).toString(16).padStart(8, '0') + Math.floor(r() * 0xffff).toString(16) });
        if (si === 3 && i === 1 && j.id === 'M-1142') out[out.length - 1].cap = 'Сервиз из серванта — хрупкое';
      });
    });
    if (j.id === 'M-1143') out.push({ src: '/img/services/mebel.webp', cap: 'Повреждение: скол на углу комода (отмечен бригадиром)', stage: 4, by: 's5', at: '09:12', geo: '52.236, 21.004', acc: 6, sha: 'c41f09e2a7', dmg: true });
    return out;
  }
  const EXTRA = {
    'M-1142': [
      { t: 'Снять карниз', price: 30, st: 'approved', at: '09:31', by: 's1', how: 'подпись на телефоне бригадира' },
      { t: 'Повесить телевизор на новом месте', price: 250, st: 'waiting', at: '09:44', by: 's1', how: 'ссылка отправлена в WhatsApp' },
    ],
    'M-1139': [{ t: 'Вывезти старую мебель (кресло)', price: 150, st: 'approved', at: '10:02', by: 's1', how: 'подпись на телефоне бригадира' }],
    'M-1143': [{ t: 'Разобрать и собрать кровать', price: 150, st: 'approved', at: '08:41', by: 's5', how: 'было в оферте' }],
  };
  function eventsOf(j) {
    const ev = [];
    const steps = D.PKG_STAGES[j.pkg];
    steps.forEach((si) => {
      const t = j.times?.[si]; if (!t) return;
      const [a, b] = t.split('–');
      const lead = S(j.crew[0]);
      ev.push({ at: a, who: j.crew[0], t: `шаг «${D.STAGES[si]}» начат${si === 0 ? ` · ${lead.name} отметил начало дня у буса (координаты ±7 м)` : ''}` });
      if (si === 1) ev.push({ at: a, who: j.crew[0], t: 'фото подъезда и парковки · 1 фото' });
      if (si === 2) ev.push({ at: a, who: j.crew[1] || j.crew[0], t: 'фото «до»: коридор, лестница, мебель · защита пола' });
      if (b) ev.push({ at: b, who: j.crew[0], t: `шаг «${D.STAGES[si]}» закончен` });
    });
    (EXTRA[j.id] || []).forEach((x) => ev.push({ at: x.at, who: x.by, t: x.st === 'approved' ? `доп. работа «${x.t}» · ${zl(x.price)} · клиент подписал` : `предложена доп. работа «${x.t}» · ${zl(x.price)} · ждём подписи` }));
    if (j.id === 'M-1142') feed.filter((f) => f.job === j.id).forEach((f) => ev.push({ at: f.at, who: f.who, t: f.t, live: true }));
    if (j.stage >= 10) ev.push({ at: '15:48', who: j.crew[0], t: 'клиент подписал протокол приёмки · оценка 5 из 5' }, { at: '16:02', who: j.crew[0], t: `оплата остатка ${zl(j.price - j.deposit)} · карта, терминал` });
    if (j.deposit) ev.push({ at: (j.depositAt || '').split(' · ')[0] || '—', who: null, t: `задаток ${zl(j.deposit)} получен${j.depositAt ? ' · ' + j.depositAt.split(' · ').slice(1).join(' · ') : ''}`, sys: true });
    const key = (e) => (/^\d\d:\d\d$/.test(e.at) ? '1' + e.at : '0' + e.at);
    const seen = new Set();
    return ev.filter((e) => { const k = e.at + e.t; if (seen.has(k)) return false; seen.add(k); return true; }).sort((x, y) => (key(y) > key(x) ? 1 : -1));
  }
  // план / факт: часы людей × 40 zł + бусы (топливо) + коробки
  function money(j) {
    const people = j.crew.length, planH = j.plan, factH = j.fact ?? (j.stage >= 10 ? planH : j.stage >= 0 ? Math.round(planH * (j.stage + 0.4) / 10 * 10) / 10 : 0);
    const cost = { people: factH * 40, vans: j.vans.length * 70, boxes: (j.boxes || 0) * 6.5 };
    const total = cost.people + cost.vans + cost.boxes, net = j.price / 1.23;
    return { people, planH, factH, cost, total, net, profit: net - total, margin: (net - total) / net };
  }

  /* ---------- оболочка: меню, поиск, уведомления ---------- */
  const nav = $('#nav');
  nav.innerHTML = NAV.map(([k, t]) => `<a href="#/${k}" data-nav="${k}">${ico(k)}<span>${t}</span>${k === 'leads' ? '<em data-count="leads"></em>' : ''}</a>`).join('');
  const setCounts = () => { const n = D.leads.filter((l) => l.col === 'new').length; $$('[data-count="leads"]').forEach((e) => { e.textContent = n || ''; }); };

  const view = $('#view');
  let cur = { page: 'today', arg: '' };
  function render(soft) {
    const [, page = 'today', arg = ''] = (location.hash || '#/today').split('/');
    cur = { page, arg: decodeURIComponent(arg) };
    $$('[data-nav]').forEach((a) => a.classList.toggle('on', a.dataset.nav === page || (page === 'job' && a.dataset.nav === 'jobs')));
    const fn = PAGES[page] || PAGES.today;
    view.innerHTML = fn(cur.arg);
    if (!soft) { view.classList.remove('in'); void view.offsetWidth; view.classList.add('in'); window.scrollTo({ top: 0 }); }
    else view.classList.remove('in');
    (AFTER[page] || (() => {}))(cur.arg);
    closeSide(); setCounts();
    document.title = `${(NAV.find((n) => n[0] === page) || [, page === 'job' ? cur.arg.split('/')[0] : ''])[1]} · Пульт MELBUS (прототип)`;
  }
  window.addEventListener('hashchange', () => render());

  /* ---------- СЕГОДНЯ ---------- */
  const CREWS = [
    { name: 'Бригада А', job: 'M-1142' }, { name: 'Бригада Б', job: 'M-1143' }, { name: 'Бригада В', job: 'M-1145' }, { name: 'Бригада Г', job: 'M-1144' },
  ];
  function crewCard(c, i) {
    const j = J(c.job), lead = S(j.crew[0]);
    let stage = j.stage < 0 ? 'Ждёт выезда' : D.STAGES[j.stage], detail = '', prog = 0;
    const steps = D.PKG_STAGES[j.pkg], pos = Math.max(0, steps.indexOf(j.stage));
    if (j.stage === 3) { detail = `<b data-live="packed-${j.id}">${j.packed}</b> из ${j.boxes} коробок`; prog = j.packed / j.boxes; }
    else if (j.stage === 4) { detail = `<b>${j.loaded}</b> из ${j.boxes} в бусе`; prog = j.loaded / j.boxes; }
    else if (j.stage === 5) { detail = `прибытие ≈ <b>${j.eta}</b> · ${j.km} км`; prog = 0.6; }
    else if (j.stage === 6) { detail = j.pkg === 'taxi' ? 'диван и 12 коробок · 2 ч оплачено' : `<b>${j.unloaded}</b> из ${j.boxes} на месте`; prog = 0.5; }
    else if (j.stage < 0) { detail = `выезд в ${hh(j.t0 - 0.5)} · ${j.rooms}`; }
    const overall = j.stage < 0 ? 0 : (pos + prog) / steps.length;
    return `<article class="crew ${j.stage < 0 ? 'is-wait' : ''}" data-open-job="${j.id}" style="--i:${i}" tabindex="0">
      <header><b>${c.name}</b><span class="crew__av">${j.crew.map((id) => ava(id, 'ava--s')).join('')}</span></header>
      <p class="crew__job"><span class="mono">${j.id}</span> · ${esc(j.client)}</p>
      <p class="crew__rt">${route(j.a.dist, j.b.dist)}</p>
      <div class="crew__now"><span class="stg ${j.stage < 0 ? '' : 'stg--live'}">${stage}</span><span class="crew__det">${detail}</span></div>
      <div class="bar"><i style="--p:${overall.toFixed(3)}"></i></div>
      <footer><span>${lead.name} · ${j.crew.length} ${plural(j.crew.length, 'человек', 'человека', 'человек')}</span><span>${j.vans.map((v) => V(v).name).join(' + ')}</span></footer>
    </article>`;
  }
  const ALERTS = () => [
    { kind: 'dmg', t: 'Отмечено повреждение', d: 'M-1143 · скол на углу комода при выносе. Бригадир приложил фото; на фото «до» угол целый.', act: ['Открыть заказ', '#/job/M-1143'], img: '/img/services/mebel.webp' },
    { kind: 'money', t: 'Задаток не оплачен', d: 'M-1151 · Катажина Демо · переезд в сб 28.11 · 778 zł. Ссылка отправлена 19.11.', act: ['Напомнить', 'remind'] },
    { kind: 'time', t: 'Оферта истекает завтра', d: 'O-2207 · Tomasz Demo · 2 190 zł · не открыта с 10.11.', act: ['Позвонить', 'tel'] },
    { kind: 'sign', t: 'Доп. работа ждёт подписи', d: 'M-1142 · «Повесить телевизор на новом месте» · 250 zł. Без подписи бригада не начинает.', act: ['Открыть', '#/job/M-1142/extra'] },
  ];
  const feedRow = (f, isNew) => `<li class="${isNew ? 'is-new' : ''}"><time>${f.at}</time>${f.who ? ava(f.who, 'ava--s') : '<span class="ava ava--s ava--sys">M</span>'}<p><b>${f.who ? S(f.who).name : 'Система'}</b> ${f.t} <a href="#/job/${f.job}" class="mono">${f.job}</a></p></li>`;
  const PAGES = {};
  PAGES.today = () => {
    const today = D.jobs.filter((j) => j.day === '2026-11-23');
    const tl = D.leads.filter((l) => /^\d\d:\d\d$/.test(l.at));
    const up = D.jobs.filter((j) => j.day > '2026-11-23').sort((a, b) => (a.day + a.t0 > b.day + b.t0 ? 1 : -1)).slice(0, 5);
    const k = [
      ['Заявки сегодня', tl.length, Object.entries(tl.reduce((a, l) => ((a[l.src] = (a[l.src] || 0) + 1), a), {})).map(([k, n]) => `${k} ${n}`).join(' · '), 'leads'],
      ['Оферты ждут ответа', D.offers.filter((o) => ['sent', 'viewed'].includes(o.status)).length, '1 истекает завтра', 'offers'],
      ['Переезды сегодня', today.length, '3 идут · 1 после обеда', 'schedule'],
      ['Выручка недели', zl(18640), '+14 % к прошлой неделе', 'finance'],
    ];
    return `${head('Понедельник, 23 ноября', 'Сегодня', `<span class="live"><i></i>обновляется в реальном времени · <span data-live="clock">${now()}</span></span>`)}
    <div class="kpis">${k.map(([t, v, s, to], i) => `<a class="kpi" href="#/${to}" style="--i:${i}"><span>${t}</span><b>${v}</b><small>${s}</small></a>`).join('')}</div>
    <div class="cols cols--today">
      <section class="card card--crews"><div class="card__h"><h2>Бригады сейчас</h2><a href="#/schedule" class="lnk">Расписание</a></div>
        <div class="crews" data-live="crews">${CREWS.map(crewCard).join('')}</div></section>
      <section class="card"><div class="card__h"><h2>Требует внимания</h2><span class="cnt">${ALERTS().length}</span></div>
        <ul class="alerts">${ALERTS().map((a, i) => `<li class="al al--${a.kind}" style="--i:${i}">${a.img ? `<button class="al__img" data-lb="${a.img}" data-cap="${esc(a.d)}"><img src="${a.img}" alt=""></button>` : `<span class="al__ic">${ico(a.kind === 'money' ? 'finance' : a.kind === 'time' ? 'clock' : 'sign')}</span>`}<div><b>${a.t}</b><p>${a.d}</p></div><button class="btn btn--s" data-alert="${a.act[1]}">${a.act[0]}</button></li>`).join('')}</ul></section>
    </div>
    <div class="cols">
      <section class="card"><div class="card__h"><h2>Лента</h2><span class="live live--s"><i></i>живая</span></div><ul class="feed" data-live="feed">${feed.slice(0, 7).map((f) => feedRow(f)).join('')}</ul></section>
      <section class="card"><div class="card__h"><h2>Ближайшие переезды</h2><a href="#/jobs" class="lnk">Все заказы</a></div>
        <ul class="next">${up.map((j) => `<li data-open-job="${j.id}" tabindex="0"><span class="next__d"><b>${DAY[j.day]?.n ?? ''}</b>${DAY[j.day]?.d ?? ''}</span><div><p><span class="mono">${j.id}</span> · ${esc(j.client)}</p><small>${hh(j.t0)}–${hh(j.t1)} · ${D.PKG[j.pkg]} · ${j.crew.length} чел. · ${j.vans.length ? j.vans.map((v) => V(v).name).join(' + ') : '<span class="warn-t">без буса</span>'}</small></div><b class="next__p">${zl(j.price)}</b>${j.unpaid ? '<span class="st st--warn">без задатка</span>' : ''}</li>`).join('')}</ul></section>
    </div>`;
  };

  /* ---------- ЗАЯВКИ (канбан) ---------- */
  let leadFilter = 'Все';
  function leadCard(l, i) {
    return `<article class="lc ${l.col === 'lost' ? 'is-lost' : ''} ${l._new ? 'is-fresh' : ''}" data-lead="${l.id}" tabindex="0" style="--i:${i}">
      <div class="lc__top"><span class="src src--${SRC[l.src]}">${l.src}</span><span class="lang">${l.lang}</span><time>${l.at}</time><button class="lc__more" data-lead-move="${l.id}" aria-label="Перенести">${ico('dots')}</button></div>
      <b class="lc__name">${esc(l.name)}</b>
      <p class="lc__rt">${routeOfLead(l.route)}</p>
      <div class="lc__meta">${pkgTag(l.pkg)}<span>${l.pkg === 'taxi' ? '150 zł/ч' : '≈ ' + zl(l.est)}</span><span>${ico('schedule')}${l.date}</span></div>
      ${l.reason ? `<p class="lc__reason">${esc(l.reason)}</p>` : ''}${l.video ? `<span class="lc__vid">${ico('play')}видео</span>` : ''}${l.offer ? `<span class="lc__vid">${ico('offers')}${l.offer}</span>` : ''}${l.job ? `<span class="lc__vid">${ico('jobs')}${l.job}</span>` : ''}
    </article>`;
  }
  PAGES.leads = () => {
    const srcs = ['Все', 'Сайт', 'Телефон', 'WhatsApp', 'Instagram'];
    const list = D.leads.filter((l) => leadFilter === 'Все' || l.src === leadFilter);
    return `${head('Все каналы в одной ленте', 'Заявки', `<div class="chips">${srcs.map((s) => `<button class="chip ${s === leadFilter ? 'on' : ''}" data-lf="${s}">${s}${s !== 'Все' ? ` <em>${D.leads.filter((l) => l.src === s).length}</em>` : ''}</button>`).join('')}</div>`)}
    <p class="hint">Перетащите карточку в другую колонку мышью. На телефоне — кнопка ${ico('dots', 'i--in')} на карточке.</p>
    <div class="kb" id="kb">${D.COLS.map(([k, t]) => { const ls = list.filter((l) => l.col === k); const sum = ls.reduce((a, l) => a + (l.pkg === 'taxi' ? 300 : l.est), 0); return `<section class="kb__col kb__col--${k}" data-col="${k}"><header><b>${t}</b><span>${ls.length}</span><small>${ls.length ? '≈ ' + zl(sum) : ''}</small></header><div class="kb__list">${ls.map(leadCard).join('') || '<p class="kb__empty">Перетащите сюда</p>'}</div></section>`; }).join('')}</div>`;
  };
  function moveLead(id, col, reason) {
    const l = Ld(id); if (!l || l.col === col) return;
    if (col === 'lost' && !reason) { askReason(id); return; }
    l.col = col; l.reason = col === 'lost' ? reason : '';
    if (col === 'offer' && !l.offer) { const no = 'O-22' + (10 + D.offers.length); l.offer = no; D.offers.unshift({ id: no, client: l.name, pkg: l.pkg, sum: l.est, v: 1, status: 'sent', views: 0, until: '07.12', sent: '23.11' }); toast(`Оферта <b>${no}</b> на ${zl(l.est)} отправлена клиенту в WhatsApp на языке ${l.lang}`); }
    else if (col === 'won' && !l.job) { const no = 'M-11' + (54 + D.jobs.length - 13); l.job = no; D.jobs.push({ id: no, client: l.name, phone: l.phone, lang: l.lang, pkg: l.pkg, price: l.est, day: '2026-11-29', t0: 9, t1: 15, a: { addr: '—', dist: l.route.split(' → ')[0] }, b: { addr: '—', dist: l.route.split(' → ')[1] || '—' }, rooms: l.rooms, vans: [], crew: ['s8', 's10'], status: 'booked', stage: -1, boxes: l.pkg === 'full' ? 40 : 0, plan: 10, deposit: 0, unpaid: true }); toast(`Создан заказ <b>${no}</b> · ссылка на задаток 20 % ушла клиенту`, `#/job/${no}`); }
    else toast(`<b>${esc(l.name)}</b> · ${D.COLS.find((c) => c[0] === col)[1]}${reason ? ' · ' + esc(reason) : ''}`);
    l._new = true; render(true); setTimeout(() => { l._new = false; }, 1200);
  }
  function askReason(id) {
    modal(`<h3>Почему заявка потеряна?</h3><p class="muted">Причины попадут в отчёт — видно, что улучшать.</p><div class="reasons">${D.LOST.map((r) => `<button class="btn" data-reason="${esc(r)}">${r}</button>`).join('')}</div>`, (m) => {
      $$('[data-reason]', m).forEach((b) => b.addEventListener('click', () => { closeModal(); moveLead(id, 'lost', b.dataset.reason); }));
    });
  }
  function leadMoveMenu(id, btn) {
    const l = Ld(id);
    popover(btn, `<p class="pop__h">Перенести в</p>${D.COLS.map(([k, t]) => `<button ${k === l.col ? 'disabled' : ''} data-to="${k}">${t}</button>`).join('')}`, (p) => {
      $$('[data-to]', p).forEach((b) => b.addEventListener('click', () => { closePop(); moveLead(id, b.dataset.to); }));
    });
  }
  function openLead(id) {
    const l = Ld(id);
    drawer(`<div class="dr__h"><div><p class="muted">${l.id} · ${l.src} · ${l.at}</p><h2>${esc(l.name)}</h2></div><button class="ib" data-close>${ico('x')}</button></div>
      <div class="dr__seg">${D.COLS.map(([k, t]) => `<button class="${k === l.col ? 'on' : ''}" data-dcol="${k}">${t}</button>`).join('')}</div>
      <dl class="kv"><div><dt>Телефон</dt><dd><a href="tel:${l.phone.replace(/\s/g, '')}">${l.phone}</a></dd></div><div><dt>Язык</dt><dd>${l.lang}</dd></div><div><dt>Пакет</dt><dd>${pkgTag(l.pkg)}</dd></div><div><dt>Цена по форме</dt><dd><b>${l.pkg === 'taxi' ? '150 zł/ч · мин. 2 ч' : '≈ ' + zl(l.est)}</b></dd></div><div><dt>Дата</dt><dd>${l.date}</dd></div><div><dt>Что</dt><dd>${l.rooms}</dd></div></dl>
      <div class="dr__rt">${routeOfLead(l.route)}</div>
      <h3>Видео квартиры</h3>
      <div class="vid" data-video>${l.video ? `<img src="/img/site/phone.webp" alt=""><button class="vid__play" aria-label="Смотреть видео">${ico('play')}</button><span class="vid__t">2:41 · загружено с сайта</span>` : '<p class="muted vid__none">Видео ещё нет. Попросите снять: ссылка на загрузку уйдёт в WhatsApp.</p><button class="btn btn--s" data-ask-video>Попросить видео</button>'}</div>
      <h3>Список из формы на сайте</h3>
      <ul class="lst">${D.LEAD_ITEMS.slice(0, l.pkg === 'taxi' ? 2 : 9).map((x) => `<li>${ico('check')}${x}</li>`).join('')}</ul>
      <div class="dr__act"><a class="btn" href="tel:${l.phone.replace(/\s/g, '')}">${ico('phone')}Позвонить</a><button class="btn" data-wa>${ico('chat')}WhatsApp</button><button class="btn btn--tape" data-make-offer="${l.id}">${ico('offers')}Создать оферту</button></div>`, (d) => {
      $$('[data-dcol]', d).forEach((b) => b.addEventListener('click', () => { closeDrawer(); moveLead(l.id, b.dataset.dcol); }));
      $('[data-make-offer]', d)?.addEventListener('click', () => { closeDrawer(); moveLead(l.id, 'offer'); });
      $('[data-wa]', d)?.addEventListener('click', () => toast('Откроется WhatsApp с шаблоном на языке клиента'));
      $('[data-ask-video]', d)?.addEventListener('click', () => toast('Ссылка на загрузку видео отправлена клиенту'));
      $('.vid__play', d)?.addEventListener('click', (e) => { const v = e.currentTarget.closest('.vid'); v.innerHTML = '<video src="/video/phone.mp4" poster="/img/site/phone.webp" controls autoplay playsinline></video>'; });
    });
  }
  // перетаскивание мышью (общая механика для канбана и расписания)
  let drag = null;
  function dnd(root, cfg) {
    root.addEventListener('pointerdown', (e) => {
      const el = e.target.closest(cfg.item);
      if (!el || e.button !== 0 || e.target.closest('button') || e.pointerType === 'touch') return;
      drag = { root, cfg, el, x: e.clientX, y: e.clientY, on: false };
    });
    root.addEventListener('click', (e) => {
      if (root.dataset.justDragged) return;
      const el = e.target.closest(cfg.item); if (!el || e.target.closest('button')) return;
      cfg.onClick(el, e);
    });
  }
  window.addEventListener('pointermove', (e) => {
    const d = drag; if (!d) return;
    if (!d.on) {
      if (Math.hypot(e.clientX - d.x, e.clientY - d.y) < 6) return;
      d.on = true; const r = d.el.getBoundingClientRect(); d.ox = d.x - r.left; d.oy = d.y - r.top;
      d.g = d.el.cloneNode(true); d.g.classList.add('ghost'); d.g.style.width = r.width + 'px'; document.body.append(d.g);
      d.el.classList.add('is-drag'); document.body.classList.add('dragging');
    }
    d.g.style.transform = `translate(${e.clientX - d.ox}px, ${e.clientY - d.oy}px) rotate(-2deg)`;
    const t = document.elementFromPoint(e.clientX, e.clientY)?.closest(d.cfg.target);
    $$(d.cfg.target, d.root).forEach((x) => x.classList.toggle('is-over', x === t));
    d.t = t;
  });
  window.addEventListener('pointerup', () => {
    const d = drag; drag = null; if (!d || !d.on) return;
    d.g.remove(); d.el.classList.remove('is-drag'); document.body.classList.remove('dragging');
    $$(d.cfg.target, d.root).forEach((x) => x.classList.remove('is-over'));
    d.root.dataset.justDragged = '1'; setTimeout(() => { d.root.dataset.justDragged = ''; }, 60);
    if (d.t) d.cfg.onDrop(d.el, d.t);
  });
  const AFTER = {};
  AFTER.leads = () => {
    const kb = $('#kb');
    dnd(kb, { item: '.lc', target: '.kb__col', onDrop: (el, t) => moveLead(el.dataset.lead, t.dataset.col), onClick: (el) => openLead(el.dataset.lead) });
    kb.addEventListener('keydown', (e) => { if (e.key === 'Enter' && e.target.matches('.lc')) openLead(e.target.dataset.lead); });
  };

  /* ---------- ОФЕРТЫ ---------- */
  const OST = { draft: ['Черновик', 'mute'], sent: ['Отправлена', 'warn'], viewed: ['Просмотрена', 'live'], accepted: ['Принята', 'ok'], declined: ['Отклонена', 'bad'], expired: ['Истекла', 'mute'] };
  let offerFilter = 'all';
  PAGES.offers = () => {
    const keys = ['all', 'draft', 'sent', 'viewed', 'accepted', 'declined', 'expired'];
    const list = D.offers.filter((o) => offerFilter === 'all' || o.status === offerFilter);
    return `${head('Ссылки с фиксированной ценой', 'Оферты', `<div class="chips">${keys.map((k) => `<button class="chip ${k === offerFilter ? 'on' : ''}" data-of="${k}">${k === 'all' ? 'Все' : OST[k][0]} <em>${k === 'all' ? D.offers.length : D.offers.filter((o) => o.status === k).length}</em></button>`).join('')}</div>`)}
    <div class="card card--flush"><div class="tw"><table class="tbl"><thead><tr><th>№</th><th>Клиент</th><th>Пакет</th><th class="r">Сумма</th><th>Версия</th><th>Статус</th><th>Просмотры</th><th>Отправлена</th><th>Действует до</th><th></th></tr></thead>
    <tbody>${list.map((o) => `<tr data-offer="${o.id}" class="${o.expiring ? 'is-hot' : ''}"><td class="mono">${o.id}</td><td>${esc(o.client)}</td><td>${pkgTag(o.pkg)}</td><td class="r"><b>${zl(o.sum)}</b></td><td>v${o.v}</td><td><span class="st st--${OST[o.status][1]}">${OST[o.status][0]}</span></td><td>${o.views ? `${ico('eye', 'i--in')} ${o.views}` : '—'}</td><td>${o.sent}</td><td>${o.until}${o.expiring ? ' <span class="st st--warn">завтра</span>' : ''}</td><td class="r"><button class="btn btn--s" data-resend="${o.id}">${o.status === 'draft' ? 'Отправить' : 'Ещё раз'}</button></td></tr>`).join('')}</tbody></table></div></div>`;
  };
  function openOffer(id) {
    const o = D.offers.find((x) => x.id === id), dep = Math.max(200, Math.round(o.sum * 0.2));
    drawer(`<div class="dr__h"><div><p class="muted">Оферта · версия ${o.v}</p><h2>${o.id}</h2></div><button class="ib" data-close>${ico('x')}</button></div>
      <div class="offer"><img src="/brand/melbus-light.svg" alt="MELBUS" class="offer__logo"><p class="muted">Так её видит клиент</p><h3>${esc(o.client)}</h3><p>${pkgTag(o.pkg)} · фиксированная цена</p><b class="offer__sum">${zl(o.sum)}</b><p class="muted">Задаток 20 % — ${zl(dep)} · BLIK или карта · действует до ${o.until}</p><p class="offer__g">Цена, которую вы приняли, не меняется. Ни этаж, ни тяжёлый шкаф её не сдвинут.</p></div>
      <dl class="kv"><div><dt>Статус</dt><dd><span class="st st--${OST[o.status][1]}">${OST[o.status][0]}</span></dd></div><div><dt>Просмотры</dt><dd>${o.views}</dd></div><div><dt>Отправлена</dt><dd>${o.sent}</dd></div></dl>
      <div class="dr__act"><button class="btn" data-copy>${ico('link')}Скопировать ссылку</button><button class="btn" data-v2>Новая версия</button><button class="btn btn--tape" data-send>${ico('send')}Отправить в WhatsApp</button></div>`, (d) => {
      $('[data-copy]', d).addEventListener('click', () => toast('Ссылка скопирована: melbus.pl/oferta/?id=' + o.id));
      $('[data-v2]', d).addEventListener('click', () => { o.v++; closeDrawer(); render(true); toast(`Создана версия v${o.v} — старая ссылка покажет «есть новая версия»`); });
      $('[data-send]', d).addEventListener('click', () => { closeDrawer(); toast('Оферта отправлена в WhatsApp'); });
    });
  }

  /* ---------- РАСПИСАНИЕ ---------- */
  const ROWS = [...D.vans.filter((v) => !/Сервис/.test(v.state)).map((v) => [v.id, `${v.name}`, v.plate]), ['none', 'Без буса', 'назначить']];
  function dayNeed(k) { return D.jobs.filter((j) => j.day === k).reduce((a, j) => a + j.crew.length, 0); }
  PAGES.schedule = () => {
    const short = D.DAYS.filter((d) => dayNeed(d.k) > d.avail);
    const cell = (row, d) => {
      const js = D.jobs.filter((j) => j.day === d.k && (row === 'none' ? !j.vans.length : j.vans.includes(row))).sort((a, b) => a.t0 - b.t0);
      const clash = js.some((a, i) => js.some((b, q) => q > i && a.t0 < b.t1 && b.t0 < a.t1));
      return `<div class="sc__cell ${clash ? 'is-clash' : ''} ${d.k === '2026-11-23' ? 'is-today' : ''}" data-row="${row}" data-day="${d.k}">${js.map((j) => `<div class="sb ${PKGC[j.pkg]} ${j.unpaid ? 'is-unpaid' : ''} ${j.status === 'in_progress' ? 'is-live' : ''}" data-sjob="${j.id}" data-from="${row}" tabindex="0" title="${esc(j.client)}">
        <span class="sb__t">${hh(j.t0)}–${hh(j.t1)}</span><b>${j.id}</b><span class="sb__c">${esc(j.client)}</span>
        <span class="sb__m">${j.crew.length} чел.${j.vans.length > 1 ? ' · ' + j.vans.length + ' буса' : ''}${j.unpaid ? ' · без задатка' : ''}</span>
        <span class="sb__bar"><i style="left:${((j.t0 - 7) / 14 * 100).toFixed(1)}%;width:${((j.t1 - j.t0) / 14 * 100).toFixed(1)}%"></i></span></div>`).join('')}${clash ? '<span class="sc__warn">пересечение</span>' : ''}</div>`;
    };
    return `${head('Неделя 23–29 ноября', 'Расписание', `<div class="wk"><button class="ib" data-wk="-1" aria-label="Предыдущая неделя">${ico('left')}</button><span>23–29.11</span><button class="ib" data-wk="1" aria-label="Следующая неделя">${ico('right')}</button></div><div class="legend">${Object.entries(D.PKG).map(([k, t]) => `<span class="${PKGC[k]}"><i></i>${t}</span>`).join('')}</div>`)}
    ${short.length ? `<div class="banner banner--warn">${ico('alert')}<p>${short.map((d) => `<b>${d.d} ${d.n}.11:</b> нужно ${dayNeed(d.k)} ${plural(dayNeed(d.k), 'человек', 'человека', 'человек')}, свободно ${d.avail} — не хватает ${dayNeed(d.k) - d.avail}`).join(' · ')}</p><button class="btn btn--s" data-call-extra>Позвать из резерва</button></div>` : `<div class="banner banner--ok">${ico('check')}<p>Людей хватает на всю неделю.</p></div>`}
    <p class="hint">Перетащите заказ на другой бус или день — бригада получит уведомление. На телефоне — коснитесь заказа.</p>
    <div class="sc" id="sc"><div class="sc__grid" style="--days:${D.DAYS.length}">
      <div class="sc__corner"></div>${D.DAYS.map((d) => { const need = dayNeed(d.k); return `<div class="sc__day ${d.k === '2026-11-23' ? 'is-today' : ''}"><b>${d.d} ${d.n}</b><span class="${need > d.avail ? 'bad' : ''}">люди ${need}/${d.avail}</span></div>`; }).join('')}
      ${ROWS.map(([id, n, p]) => `<div class="sc__row"><b>${n}</b><span class="mono">${p}</span></div>${D.DAYS.map((d) => cell(id, d)).join('')}`).join('')}
    </div></div>`;
  };
  function moveJob(id, from, row, day) {
    const j = J(id); if (!j) return;
    const sameDay = j.day === day;
    if (row !== 'none') { if (from === 'none' || !j.vans.length) j.vans = [row]; else if (!j.vans.includes(row)) j.vans = j.vans.map((v) => (v === from ? row : v)); }
    else j.vans = j.vans.filter((v) => v !== from);
    j.day = day;
    render(true);
    toast(`<b>${id}</b> → ${row === 'none' ? 'без буса' : V(row).name}, ${dayLabel(day)}${sameDay ? '' : ' · клиенту уйдёт сообщение о новой дате'} · бригаде — уведомление`);
  }
  AFTER.schedule = () => {
    const sc = $('#sc');
    dnd(sc, { item: '.sb', target: '.sc__cell', onDrop: (el, t) => moveJob(el.dataset.sjob, el.dataset.from, t.dataset.row, t.dataset.day), onClick: (el) => schedPop(el) });
  };
  function schedPop(el) {
    const j = J(el.dataset.sjob);
    popover(el, `<p class="pop__h">${j.id} · ${esc(j.client)}</p><a href="#/job/${j.id}" class="pop__a">Открыть заказ</a><label>Бус<select data-pv>${ROWS.map(([id, n]) => `<option value="${id}" ${id === el.dataset.from ? 'selected' : ''}>${n}</option>`).join('')}</select></label><label>День<select data-pd>${D.DAYS.map((d) => `<option value="${d.k}" ${d.k === j.day ? 'selected' : ''}>${d.d} ${d.n}.11</option>`).join('')}</select></label><button class="btn btn--tape btn--s" data-pm>Перенести</button>`, (p) => {
      $('[data-pm]', p).addEventListener('click', () => { closePop(); moveJob(j.id, el.dataset.from, $('[data-pv]', p).value, $('[data-pd]', p).value); });
    });
  }

  /* ---------- ЗАКАЗЫ (список) ---------- */
  let jobFilter = 'all';
  PAGES.jobs = () => {
    const F = { all: ['Все', () => true], today: ['Сегодня', (j) => j.day === '2026-11-23'], booked: ['Без задатка', (j) => j.status === 'booked'], confirmed: ['Подтверждены', (j) => j.status === 'confirmed'], done: ['Выполнены', (j) => ['done', 'closed'].includes(j.status)] };
    const list = D.jobs.filter(F[jobFilter][1]).sort((a, b) => (a.day + a.t0 > b.day + b.t0 ? 1 : -1));
    return `${head('Переезды и перевозки', 'Заказы', `<div class="chips">${Object.entries(F).map(([k, [t, f]]) => `<button class="chip ${k === jobFilter ? 'on' : ''}" data-jf="${k}">${t} <em>${D.jobs.filter(f).length}</em></button>`).join('')}</div>`)}
    <div class="card card--flush"><div class="tw"><table class="tbl tbl--click"><thead><tr><th>№</th><th>Дата</th><th>Клиент</th><th>Пакет</th><th>Маршрут</th><th>Бригада</th><th>Бусы</th><th class="r">Цена</th><th>Статус</th></tr></thead>
    <tbody>${list.map((j) => `<tr data-open-job="${j.id}"><td class="mono">${j.id}</td><td>${dayLabel(j.day)}<small class="muted"> ${hh(j.t0)}</small></td><td>${esc(j.client)}</td><td>${pkgTag(j.pkg)}</td><td>${route(j.a.dist, j.b.dist)}</td><td><span class="avs">${j.crew.map((id) => ava(id, 'ava--s')).join('')}</span></td><td>${j.vans.length ? j.vans.map((v) => V(v).name.replace('Бус ', '№')).join(', ') : '<span class="warn-t">—</span>'}</td><td class="r"><b>${zl(j.price)}</b></td><td>${st(j.status)}${j.status === 'in_progress' ? `<small class="muted"> · ${D.STAGES[j.stage]}</small>` : ''}</td></tr>`).join('')}</tbody></table></div></div>`;
  };

  /* ---------- ЗАКАЗ ---------- */
  const TABS = [['overview', 'Обзор'], ['photos', 'Фото'], ['boxes', 'Коробки'], ['items', 'Вещи'], ['extra', 'Доп. работы'], ['money', 'Деньги']];
  let boxFilter = { room: 'all', st: 'all', q: '' };
  PAGES.job = (arg) => {
    const [id, tab0] = arg.split('/'); const tab = tab0 || (location.hash.split('/')[3] || 'overview');
    const j = J(id); if (!j) return empty('Заказ не найден');
    const steps = D.PKG_STAGES[j.pkg], m = money(j), boxes = boxesOf(j), photos = photosOf(j), items = itemsOf(j), extra = EXTRA[j.id] || [];
    const lane = D.STAGES.map((n, i) => {
      const used = steps.includes(i), t = j.times?.[i] || '', state = !used ? 'skip' : i < j.stage || j.stage >= 10 ? 'done' : i === j.stage ? 'now' : 'next';
      const [a, b] = t.split('–');
      return `<li class="ln ln--${state}"><span class="ln__n">${state === 'done' ? ico('check') : String(i + 1).padStart(2, '0')}</span><b>${n}</b><small>${!used ? 'не нужен' : state === 'done' ? `${a}–${b}` : state === 'now' ? `идёт с ${a}` : '—'}</small></li>`;
    }).join('');
    const count = { photos: photos.length, boxes: boxes.length ? `<span data-live="packed-${j.id}">${j.packed || 0}</span>/${boxes.length}` : '—', items: items.length, extra: extra.length };
    return `<div class="jh">
      <div class="jh__top"><a href="#/jobs" class="back">${ico('back')}Заказы</a><div class="jh__st">${st(j.status)}${j.status === 'in_progress' ? `<span class="stg stg--live">${D.STAGES[j.stage]}</span>` : ''}</div></div>
      <div class="jh__main">
        <div><p class="jh__id"><span class="mono">${j.id}</span> · ${pkgTag(j.pkg)} · ${j.rooms}</p><h1 class="tl">${esc(j.client)}</h1>
          <p class="jh__when">${dayLabel(j.day)} · ${hh(j.t0)}–${hh(j.t1)} · ${j.lang}</p>
          <p class="jh__crew"><span class="avs">${j.crew.map((c) => ava(c)).join('')}</span><span>${crewNames(j)}<br><small>${vanNames(j)}</small></span></p></div>
        <div class="jh__price"><small>Цена фикс · с VAT</small><b>${zl(j.price)}</b><span>${j.deposit ? `задаток ${zl(j.deposit)} получен` : j.pkg === 'taxi' ? '150 zł/ч · оплата на месте' : '<span class="warn-t">задаток не оплачен</span>'}</span></div>
      </div>
      <div class="jh__rt">
        <div class="adr"><i>A</i><div><b>${esc(j.a.addr || '')}</b><small>${j.a.dist}${j.a.floor != null ? ` · этаж ${j.a.floor}${j.a.lift ? ' · лифт' : ' · без лифта'} · ${j.a.park}` : ''}</small></div></div>
        <div class="adr__line"><span>${j.km || '—'} км</span></div>
        <div class="adr"><i class="b">B</i><div><b>${esc(j.b.addr || '')}</b><small>${j.b.dist}${j.b.floor != null ? ` · этаж ${j.b.floor}${j.b.lift ? ' · лифт' : ' · без лифта'} · ${j.b.park}` : ''}</small></div></div>
      </div>
      <div class="jh__act"><a class="btn" href="tel:${j.phone.replace(/\s/g, '')}">${ico('phone')}Клиенту</a><button class="btn" data-client-page>${ico('eye')}Страница клиента</button><button class="btn" data-crew-msg>${ico('chat')}Бригаде</button>${j.unpaid ? `<button class="btn btn--tape" data-remind="${j.id}">${ico('send')}Напомнить о задатке</button>` : ''}</div>
    </div>
    <ol class="lane">${lane}</ol>
    <nav class="tabs" role="tablist">${TABS.map(([k, t]) => `<a role="tab" href="#/job/${j.id}/${k}" class="${k === tab ? 'on' : ''}">${t}${count[k] ? ` <em>${count[k]}</em>` : ''}</a>`).join('')}</nav>
    <div class="tabp">${(JT[tab] || JT.overview)(j, { m, boxes, photos, items, extra })}</div>`;
  };
  const JT = {};
  JT.overview = (j, { m, extra }) => `<div class="cols cols--job">
    <section class="card"><div class="card__h"><h2>Лента событий</h2><span class="muted">из приложения бригады</span></div>
      ${j.stage < 0 && !j.deposit ? empty('Событий пока нет — заказ ещё не начат') : `<ul class="tl-ev" data-live="ev-${j.id}">${eventsOf(j).map((e) => `<li class="${e.live ? 'is-live' : ''} ${e.sys ? 'is-sys' : ''}"><time>${e.at}</time>${e.who ? ava(e.who, 'ava--s') : '<span class="ava ava--s ava--sys">M</span>'}<p><b>${e.who ? S(e.who).name : 'Система'}</b> ${e.t}</p></li>`).join('')}</ul>`}</section>
    <div class="stack">
      <section class="card"><div class="card__h"><h2>План / факт</h2>${j.stage >= 10 ? '<span class="st st--done">итог</span>' : j.stage >= 0 ? '<span class="st st--live">идёт</span>' : ''}</div>${pf(j, m)}</section>
      ${j.note ? `<section class="card"><div class="card__h"><h2>Заметки для бригады</h2></div><p>${esc(j.note)}</p></section>` : ''}
      ${extra.length ? `<section class="card"><div class="card__h"><h2>Доп. работы</h2><a class="lnk" href="#/job/${j.id}/extra">Все</a></div>${extra.map(xRow).join('')}</section>` : ''}
    </div></div>`;
  const pf = (j, m) => `<div class="pf"><div><span>Часы людей</span><b>${nf.format(m.factH)} <small>из ${m.planH} по оферте</small></b><div class="bar bar--pf"><i style="--p:${Math.min(1, m.factH / m.planH).toFixed(3)}"></i></div></div>
    <dl class="kv kv--tight"><div><dt>Люди (${nf.format(m.factH)} ч × 40 zł)</dt><dd>${zl(m.cost.people)}</dd></div><div><dt>Бусы, топливо</dt><dd>${zl(m.cost.vans)}</dd></div><div><dt>Коробки и материалы</dt><dd>${zl(m.cost.boxes)}</dd></div><div class="kv__sum"><dt>Себестоимость</dt><dd>${zl(m.total)}</dd></div><div><dt>Выручка без VAT</dt><dd>${zl(m.net)}</dd></div><div class="kv__profit"><dt>Прибыль${j.stage < 10 ? ' (прогноз)' : ''}</dt><dd>${zl(j.stage < 10 ? m.net - (m.planH * 40 + m.cost.vans + m.cost.boxes) : m.profit)} <small>${Math.round((j.stage < 10 ? (m.net - (m.planH * 40 + m.cost.vans + m.cost.boxes)) / m.net : m.margin) * 100)} %</small></dd></div></dl></div>`;
  const xRow = (x) => `<div class="xr xr--${x.st}"><div><b>${x.t}</b><small>${S(x.by).name} · ${x.at} · ${x.how}</small></div><b class="xr__p">${zl(x.price)}</b>${x.st === 'approved' ? `<span class="sig" title="Подпись клиента">${ico('sign')}</span>` : '<span class="st st--warn">ждёт подписи</span>'}</div>`;
  JT.photos = (j, { photos }) => {
    if (!photos.length) return empty('Фото появятся, когда бригада начнёт: прибытие, «до», упаковка, погрузка, «после».');
    const by = {}; photos.forEach((p, i) => { (by[p.stage] ||= []).push([p, i]); });
    return Object.entries(by).map(([si, ps]) => `<section class="card"><div class="card__h"><h2>${String(+si + 1).padStart(2, '0')} · ${D.STAGES[si]}</h2><span class="muted">${ps.length} фото</span></div><div class="ph-grid">${ps.map(([p, i]) => `<button class="ph-t ${p.dmg ? 'is-dmg' : ''}" data-lbi="${i}"><img src="${p.src}" alt="" loading="lazy"><span>${esc(p.cap)}</span><small>${S(p.by).name} · ${p.at}</small></button>`).join('')}</div></section>`).join('');
  };
  JT.boxes = (j, { boxes }) => {
    if (!boxes.length) return empty(j.pkg === 'taxi' ? 'В «Грузотакси» коробки не учитываем — грузит клиент.' : 'Коробок в этом заказе нет.');
    const rooms = Object.keys(D.ROOMS).filter((r) => boxes.some((b) => b.room === r));
    const list = boxes.map((b, i) => ({ ...b, s: boxState(j, i) })).filter((b) => (boxFilter.room === 'all' || b.room === boxFilter.room) && (boxFilter.st === 'all' || String(b.s) === boxFilter.st) && (!boxFilter.q || b.code.toLowerCase().includes(boxFilter.q.toLowerCase()) || b.what.toLowerCase().includes(boxFilter.q.toLowerCase())));
    const cnt = (s) => boxes.filter((_, i) => boxState(j, i) >= s).length;
    return `<div class="bx-sum">${[['Упаковано', 1], ['В бусе', 2], ['На месте', 3]].map(([t, s]) => `<div class="bx-k"><span>${t}</span><b>${cnt(s)}<small> / ${boxes.length}</small></b><div class="bar"><i style="--p:${(cnt(s) / boxes.length).toFixed(3)}"></i></div></div>`).join('')}</div>
    <div class="bx-rooms">${rooms.map((r) => { const n = boxes.filter((b) => b.room === r).length, p = boxes.filter((b, i) => b.room === r && boxState(j, i) >= 1).length; return `<button class="room ${boxFilter.room === r ? 'on' : ''}" data-room="${r}"><i style="--c:${D.ROOMS[r][1]}"></i>${D.ROOMS[r][0]}<em>${p}/${n}</em></button>`; }).join('')}${boxFilter.room !== 'all' ? '<button class="room" data-room="all">Все комнаты</button>' : ''}</div>
    <div class="card card--flush"><div class="bx-tools"><label class="sf">${ico('search')}<input data-bq placeholder="Код MB-… или что внутри" value="${esc(boxFilter.q)}"></label><div class="chips">${[['all', 'Все'], ['0', 'Не упакованы'], ['1', 'Упакованы'], ['2', 'В бусе'], ['3', 'На месте']].map(([k, t]) => `<button class="chip ${boxFilter.st === k ? 'on' : ''}" data-bst="${k}">${t}</button>`).join('')}</div></div>
    <div class="tw"><table class="tbl"><thead><tr><th>Код</th><th>Комната</th><th>№</th><th>Что внутри</th><th>Статус</th><th>Фото</th><th>Упаковал</th></tr></thead><tbody>
    ${list.map((b) => `<tr class="${b.s === 0 ? 'is-dim' : ''}"><td class="mono">${b.code}</td><td><span class="rtag"><i style="--c:${D.ROOMS[b.room][1]}"></i>${D.ROOMS[b.room][0]}</span></td><td>${String(b.no).padStart(2, '0')}</td><td>${esc(b.what)}${b.fragile ? ' <span class="st st--warn">хрупкое</span>' : ''}${b.night ? ' <span class="st st--ok">первая ночь</span>' : ''}</td><td><span class="dots3" title="${BOX_ST[b.s]}">${[1, 2, 3].map((s) => `<i class="${b.s >= s ? 'on' : ''}"></i>`).join('')}</span> <small>${BOX_ST[b.s]}</small></td><td>${b.s ? `<button class="thumb" data-lb="/img/film/step-4-pack.webp" data-cap="${b.code} · ${D.ROOMS[b.room][0]} ${String(b.no).padStart(2, '0')} · ${esc(b.what)}"><img src="${b.room === 'kitchen' ? '/img/film/step-4-pack.webp' : b.room === 'bed' ? '/img/film/step-2-price.webp' : '/img/site/pack.webp'}" alt=""><em>${b.photos}</em></button>` : '—'}</td><td>${b.s ? S(b.by).name : '—'}</td></tr>`).join('') || '<tr><td colspan="7" class="muted">Ничего не найдено</td></tr>'}</tbody></table></div></div>`;
  };
  JT.items = (j, { items }) => `<div class="card card--flush"><div class="tw"><table class="tbl"><thead><tr><th>Вещь</th><th>Состояние</th><th class="r">Норма</th><th class="r">Факт</th><th></th></tr></thead><tbody>
    ${items.map((it) => `<tr><td><b>${it.t}</b><small class="muted">${it.d ? ' · ' + it.d : ''}</small>${it.dmg ? ' <span class="st st--bad">повреждение · фото</span>' : ''}</td><td><span class="pipe">${ITEM_ST.slice(1).map((s, i) => `<i class="${it.s > i ? 'on' : ''}" title="${s}"></i>`).join('')}</span> <small>${ITEM_ST[it.s]}</small></td><td class="r">${it.norm} мин</td><td class="r">${it.fact ? `<b class="${it.fact > it.norm * 1.1 ? 'warn-t' : ''}">${it.fact} мин</b>` : '—'}</td><td class="r">${it.s ? `<button class="thumb" data-lb="/img/services/mebel.webp" data-cap="${it.t}"><img src="/img/services/mebel.webp" alt=""></button>` : ''}</td></tr>`).join('')}</tbody></table></div></div>
    <p class="hint">Факт минут по каждой вещи копится в отчёт «Нормы времени» — так цена на сайте становится точнее.</p>`;
  JT.extra = (j, { extra }) => `<div class="banner banner--info">${ico('sign')}<p>Любая доп. работа — только с подписью клиента <b>до начала</b>. Без подписи бригада её не делает. Цена — из каталога, известна заранее.</p></div>
    ${extra.length ? `<section class="card">${extra.map((x) => `${xRow(x)}${x.st === 'approved' ? `<div class="sigbox"><svg viewBox="0 0 300 80" aria-label="Подпись клиента"><path d="M10 55c20-30 30-40 40-20s10 30 25 5 20-35 35-10 15 25 30 5 25-20 40 0 30 10 45-10 30-5 55 5" fill="none" stroke="#10161D" stroke-width="2.2" stroke-linecap="round"/></svg><small>Подпись клиента · ${x.at} · ${x.how} · 52.19, 21.02</small></div>` : `<div class="xr__act"><button class="btn btn--s" data-resend-x>${ico('send')}Отправить ссылку ещё раз</button><button class="btn btn--s" data-cancel-x>Отменить</button></div>`}`).join('<hr>')}</section>` : empty('Доп. работ нет. Бригадир добавляет их в приложении — из каталога с ценами.')}`;
  JT.money = (j, { m }) => {
    const pays = D.payments.filter((p) => p.job === j.id);
    return `<div class="cols cols--job"><section class="card"><div class="card__h"><h2>Оплаты</h2></div>
      <ul class="pays">${pays.map((p) => `<li><div><b>${p.kind}</b><small>${p.at} · ${p.method}</small></div><b>${zl(p.sum)}</b><span class="st st--${p.st === 'получено' ? 'ok' : p.st === 'ожидается' ? 'live' : 'warn'}">${p.st}</span></li>`).join('')}
      ${j.stage < 10 && j.pkg !== 'taxi' ? `<li class="is-plan"><div><b>Остаток</b><small>в день переезда · терминал у бригады: BLIK, карта, наличные</small></div><b>${zl(j.price - (j.deposit || 0))}</b><span class="st st--mute">в день переезда</span></li>` : ''}</ul>
      <div class="card__h"><h2>Фактура</h2></div>${j.stage >= 10 ? '<p><span class="mono">FV/2026/11/031</span> · KSeF: <span class="st st--ok">принята</span> · PDF отправлен клиенту</p>' : '<p class="muted">Выставится автоматически после оплаты остатка (через сервис с KSeF).</p>'}</section>
      <section class="card"><div class="card__h"><h2>План / факт и прибыль</h2></div>${pf(j, m)}</section></div>`;
  };
  AFTER.job = (arg) => {
    const [id] = arg.split('/'); const j = J(id); if (!j) return;
    const photos = photosOf(j);
    $$('[data-lbi]').forEach((b) => b.addEventListener('click', () => lightbox(photos.map((p) => ({ src: p.src, cap: `${p.cap}`, meta: `${D.STAGES[p.stage]} · ${S(p.by).name} · ${p.at} · координаты ${p.geo} (±${p.acc} м) · SHA-256 ${p.sha}…` })), +b.dataset.lbi)));
    $$('[data-room]').forEach((b) => b.addEventListener('click', () => { boxFilter.room = boxFilter.room === b.dataset.room ? 'all' : b.dataset.room; render(true); }));
    $$('[data-bst]').forEach((b) => b.addEventListener('click', () => { boxFilter.st = b.dataset.bst; render(true); }));
    const bq = $('[data-bq]'); if (bq) { bq.addEventListener('input', () => { boxFilter.q = bq.value; clearTimeout(bq._t); bq._t = setTimeout(() => { render(true); const n = $('[data-bq]'); n.focus(); n.setSelectionRange(n.value.length, n.value.length); }, 200); }); }
    $('[data-client-page]')?.addEventListener('click', () => clientPage(j));
    $('[data-crew-msg]')?.addEventListener('click', () => toast(`Сообщение бригаде (${crewNames(j)}) — придёт в приложение`));
    $('[data-remind]')?.addEventListener('click', () => toast('Напоминание о задатке отправлено в WhatsApp'));
    $('[data-resend-x]')?.addEventListener('click', () => toast('Ссылка на согласие отправлена клиенту ещё раз'));
    $('[data-cancel-x]')?.addEventListener('click', () => toast('Доп. работа отменена — бригада увидит это в приложении'));
  };
  function clientPage(j) {
    const steps = D.PKG_STAGES[j.pkg].filter((s) => s > 0 && s < 9);
    modal(`<div class="cp"><div class="cp__phone"><div class="cp__top"><img src="/brand/melbus-light.svg" alt="MELBUS"><span>${j.lang}</span></div>
      <p class="cp__k">Ваш переезд · ${dayLabel(j.day)}</p><h3>${j.stage < 0 ? 'Бригада приедет в ' + hh(j.t0) : j.stage >= 10 ? 'Готово. Добро пожаловать домой!' : D.STAGES[j.stage]}</h3>
      ${j.stage === 3 ? `<p class="cp__big">${j.packed} из ${j.boxes} коробок упаковано</p>` : ''}
      <ol class="cp__steps">${steps.map((s) => `<li class="${s < j.stage || j.stage >= 10 ? 'done' : s === j.stage ? 'now' : ''}">${D.STAGES[s]}</li>`).join('')}</ol>
      <p class="cp__crew">Бригада: ${j.crew.map((c) => S(c).name.split(' ')[0]).join(', ')} · ${j.vans.map((v) => V(v).plate).join(', ')}</p>
      <div class="cp__box"><b>Коробки по комнатам</b>${Object.keys(D.ROOMS).slice(0, 4).map((r) => `<span><i style="--c:${D.ROOMS[r][1]}"></i>${D.ROOMS[r][0]}</span>`).join('')}</div>
      ${(EXTRA[j.id] || []).filter((x) => x.st === 'waiting').map((x) => `<div class="cp__x"><b>Нужно ваше согласие</b><p>${x.t} — ${zl(x.price)}</p><button class="btn btn--tape btn--s">Согласен</button></div>`).join('')}
    </div><p class="muted cp__note">Так выглядит страница переезда у клиента на телефоне (4 языка). Ссылка уходит после задатка.</p></div>`);
  }

  /* ---------- СОТРУДНИКИ ---------- */
  PAGES.staff = () => {
    const hours = D.staff.reduce((a, s) => a + s.hours, 0);
    return `${head(`Ноябрь: ${nf.format(hours)} ч · себестоимость ${zl(hours * 40)}`, 'Сотрудники', `<button class="btn" data-add-staff>${ico('plus')}Сотрудник</button>`)}
    <div class="staff">${D.staff.map((s, i) => `<article class="sf-c" style="--i:${i}"><header>${ava(s.id, 'ava--l')}<div><b>${s.name}</b><small>${s.role} · ${s.lang}</small></div><span class="st st--${s.state === 'На заказе' ? 'live' : s.state === 'Свободен' ? 'ok' : 'mute'}">${s.state}</span></header>
      <div class="sf-c__h"><span>${s.hours} ч в ноябре</span><span>${s.jobs} ${plural(s.jobs, 'заказ', 'заказа', 'заказов')}</span></div><div class="bar"><i style="--p:${Math.min(1, s.hours / 168).toFixed(3)}"></i></div>
      <footer><a href="tel:${s.phone.replace(/\s/g, '')}" class="lnk">${s.phone}</a>${s.role !== 'Менеджер' ? `<button class="btn btn--s" data-pin="${s.id}">${ico('key')}Сбросить PIN</button>` : ''}</footer></article>`).join('')}</div>
    <p class="hint">Часы считаются из приложения: начало и конец дня, шаги, перерывы. Координаты — только в момент отметки, не постоянно (сотрудники подписывают уведомление).</p>`;
  };
  AFTER.staff = () => {
    $$('[data-pin]').forEach((b) => b.addEventListener('click', () => { const s = S(b.dataset.pin); modal(`<h3>Сбросить PIN — ${s.name}?</h3><p class="muted">Новый 4-значный PIN уйдёт SMS на ${s.phone}. Старый перестанет работать на всех телефонах.</p><div class="dr__act"><button class="btn" data-mc>Отмена</button><button class="btn btn--tape" data-ok>Сбросить</button></div>`, (m) => { $('[data-mc]', m).onclick = closeModal; $('[data-ok]', m).onclick = () => { closeModal(); toast(`Новый PIN отправлен ${s.name} · ••••`); }; }); }));
    $('[data-add-staff]')?.addEventListener('click', () => toast('Форма нового сотрудника: имя, телефон, роль, язык приложения'));
  };

  /* ---------- БУСЫ ---------- */
  PAGES.vans = () => `${head('Fiat Ducato L3H2 · 13 м³ каждый', 'Бусы')}
    <div class="vans">${D.vans.map((v, i) => `<article class="vn ${/Сервис/.test(v.state) ? 'is-svc' : ''}" style="--i:${i}"><div class="vn__img"><img src="/img/site/van-side.webp" alt=""></div><div class="vn__b"><header><b>${v.name}</b><span class="plate">${v.plate}</span></header>
      <p>${/Сервис/.test(v.state) ? `<span class="st st--warn">${v.state}</span>` : `<span class="st st--live">${v.state}</span>`}${v.today ? ` <a href="#/job/${v.today}" class="mono lnk">${v.today}</a>` : ''}</p>
      <dl class="kv kv--tight"><div><dt>Пробег</dt><dd>${nf.format(v.km)} км</dd></div><div><dt>До ТО</dt><dd class="${v.service < 1000 ? 'warn-t' : ''}">${v.service ? nf.format(v.service) + ' км' : 'сейчас'}</dd></div></dl>
      <div class="bar ${v.service < 1000 ? 'bar--warn' : ''}"><i style="--p:${(1 - Math.min(1, v.service / 15000)).toFixed(3)}"></i></div>
      <button class="btn btn--s" data-svc="${v.id}">${ico('wrench')}${/Сервис/.test(v.state) ? 'Вернуть в работу' : 'Отметить ТО'}</button></div></article>`).join('')}</div>`;
  AFTER.vans = () => $$('[data-svc]').forEach((b) => b.addEventListener('click', () => { const v = V(b.dataset.svc); if (/Сервис/.test(v.state)) { v.state = 'На базе'; v.service = 15000; } else { v.service = 15000; } render(true); toast(`${v.name} ${v.plate}: отмечено`); }));

  /* ---------- КОРОБКИ (склад) ---------- */
  let codeQ = '';
  PAGES.boxes = () => {
    const all = D.jobs.filter((j) => j.boxes).flatMap((j) => boxesOf(j).map((b, i) => ({ ...b, job: j.id, s: boxState(j, i) })));
    const hit = codeQ ? all.filter((b) => b.code.toLowerCase().includes(codeQ.toLowerCase())).slice(0, 6) : [];
    const recent = boxesOf(J('M-1142')).slice(0, J('M-1142').packed).slice(-6).reverse();
    return `${head('Белые коробки MELBUS, наклейки QR, материалы', 'Коробки')}
    <div class="kpis kpis--3">${[['На базе', D.stock.slice(0, 4).reduce((a, s) => a + s.base, 0), 'коробок всех размеров'], ['На заказах', D.stock.slice(0, 4).reduce((a, s) => a + s.jobs, 0), 'выданы бригадам'], ['Повреждены', D.stock.slice(0, 4).reduce((a, s) => a + s.bad, 0), 'списать или в ремонт']].map(([t, v, s], i) => `<div class="kpi" style="--i:${i}"><span>${t}</span><b>${nf.format(v)}</b><small>${s}</small></div>`).join('')}</div>
    <div class="cols"><section class="card card--flush"><div class="card__h card__h--pad"><h2>Склад</h2></div><div class="tw"><table class="tbl"><thead><tr><th>Позиция</th><th class="r">На базе</th><th class="r">На заказах</th><th class="r">Повреждено</th><th class="r">Минимум</th><th></th></tr></thead><tbody>
      ${D.stock.map((s) => `<tr class="${s.base < s.min ? 'is-hot' : ''}"><td>${s.t}</td><td class="r"><b>${nf.format(s.base)}</b></td><td class="r">${s.jobs}</td><td class="r">${s.bad}</td><td class="r muted">${s.min}</td><td class="r">${s.base < s.min ? '<button class="btn btn--s btn--tape" data-order>Заказать</button>' : ''}</td></tr>`).join('')}</tbody></table></div></section>
    <div class="stack"><section class="card"><div class="card__h"><h2>Найти коробку по коду</h2></div><label class="sf sf--l">${ico('qr')}<input data-code placeholder="MB-7F3K2" value="${esc(codeQ)}"></label>
      <div class="hits">${hit.map((b) => `<a href="#/job/${b.job}/boxes" class="hit"><span class="mono">${b.code}</span><span class="rtag"><i style="--c:${D.ROOMS[b.room][1]}"></i>${D.ROOMS[b.room][0]} ${String(b.no).padStart(2, '0')}</span><small>${b.job} · ${BOX_ST[b.s]} · ${esc(b.what)}</small></a>`).join('') || (codeQ ? '<p class="muted">Не найдено</p>' : '<p class="muted">Попробуйте MB-7F3K2</p>')}</div></section>
      <section class="card"><div class="card__h"><h2>Последние сканы</h2><span class="live live--s"><i></i></span></div><ul class="feed">${recent.map((b) => `<li><time>${now()}</time><span class="rtag"><i style="--c:${D.ROOMS[b.room][1]}"></i></span><p><b class="mono">${b.code}</b> · ${D.ROOMS[b.room][0]} ${String(b.no).padStart(2, '0')} · упакована · ${S(b.by).name}</p></li>`).join('')}</ul></section></div></div>`;
  };
  AFTER.boxes = () => {
    const i = $('[data-code]'); i?.addEventListener('input', () => { codeQ = i.value; clearTimeout(i._t); i._t = setTimeout(() => { render(true); const n = $('[data-code]'); n.focus(); n.setSelectionRange(n.value.length, n.value.length); }, 180); });
    $$('[data-order]').forEach((b) => b.addEventListener('click', () => toast('Заявка поставщику коробок сформирована')));
  };

  /* ---------- ФИНАНСЫ ---------- */
  PAGES.finance = () => {
    const got = D.payments.filter((p) => p.st === 'получено').reduce((a, p) => a + p.sum, 0);
    const wait = D.payments.filter((p) => p.st !== 'получено').reduce((a, p) => a + p.sum, 0);
    return `${head('Ноябрь 2026 · все суммы brutto', 'Финансы')}
    <div class="kpis">${[['Выручка ноября', zl(46280), '17 выполненных заказов'], ['Получено за неделю', zl(got), 'задатки и остатки'], ['Ожидается', zl(wait), 'не оплачено или в пути'], ['Прибыль ноября (оценка)', zl(21740), 'маржа ≈ 58 % без VAT']].map(([t, v, s], i) => `<div class="kpi" style="--i:${i}"><span>${t}</span><b>${v}</b><small>${s}</small></div>`).join('')}</div>
    <div class="cols cols--job"><section class="card card--flush"><div class="card__h card__h--pad"><h2>Платежи</h2></div><div class="tw"><table class="tbl"><thead><tr><th>Когда</th><th>Заказ</th><th>Клиент</th><th>За что</th><th>Способ</th><th class="r">Сумма</th><th>Статус</th></tr></thead><tbody>
      ${D.payments.map((p) => `<tr data-open-job="${p.job}"><td>${p.at}</td><td class="mono">${p.job}</td><td>${esc(p.client)}</td><td>${p.kind}</td><td>${p.method}</td><td class="r"><b>${zl(p.sum)}</b></td><td><span class="st st--${p.st === 'получено' ? 'ok' : p.st === 'ожидается' ? 'live' : 'warn'}">${p.st}</span></td></tr>`).join('')}</tbody></table></div></section>
    <section class="card"><div class="card__h"><h2>Фактуры · KSeF</h2></div><ul class="pays">${D.invoices.map((v) => `<li><div><b class="mono">${v.no}</b><small>${v.job} · ${esc(v.client)} · ${v.at}</small></div><b>${zl(v.sum)}</b><span class="st st--${v.ksef === 'принята' ? 'ok' : 'live'}">${v.ksef}</span></li>`).join('')}</ul>
      <div class="card__h"><h2>Способы оплаты</h2></div>${[['BLIK', 46], ['Карта', 34], ['Перевод', 14], ['Наличные', 6]].map(([t, p]) => `<div class="meth"><span>${t}</span><div class="bar"><i style="--p:${p / 100}"></i></div><b>${p} %</b></div>`).join('')}</section></div>`;
  };

  /* ---------- ОТЧЁТЫ ---------- */
  PAGES.reports = () => {
    const fun = [['Заявки', 64], ['Оферты', 41], ['Приняты', 23], ['Выполнены', 17]];
    const W = 640, H = 220, pad = 28, max = 24000, bw = (W - pad * 2) / D.weeks.length;
    const y = (v) => H - pad - (v / max) * (H - pad * 2);
    const line = D.weeks.map((w, i) => `${i ? 'L' : 'M'}${(pad + bw * i + bw / 2).toFixed(1)} ${y(w.profit).toFixed(1)}`).join(' ');
    return `${head('Последние 8 недель', 'Отчёты')}
    <div class="cols cols--rep">
      <section class="card"><div class="card__h"><h2>Воронка ноября</h2></div><div class="fun">${fun.map(([t, v], i) => `<div class="fun__r" style="--w:${(v / 64).toFixed(3)};--i:${i}"><span>${t}</span><div><i></i><b>${v}</b></div><small>${i ? Math.round(v / fun[i - 1][1] * 100) + ' %' : ''}</small></div>`).join('')}</div>
        <dl class="kv kv--tight"><div><dt>Средний чек</dt><dd><b>${zl(2940)}</b></dd></div><div><dt>Конверсия заявка → заказ</dt><dd>36 %</dd></div><div><dt>Чаще всего теряем</dt><dd>«Дорого» — 6, «другая фирма» — 4</dd></div></dl></section>
      <section class="card"><div class="card__h"><h2>Выручка и прибыль по неделям</h2><div class="legend"><span class="lg-rev"><i></i>выручка</span><span class="lg-pr"><i></i>прибыль</span></div></div>
        <svg class="chart" viewBox="0 0 ${W} ${H}" role="img" aria-label="График выручки и прибыли">${[0, 8000, 16000, 24000].map((v) => `<line x1="${pad}" x2="${W - pad}" y1="${y(v)}" y2="${y(v)}" class="ch-grid"/><text x="${pad - 6}" y="${y(v) + 4}" class="ch-ax" text-anchor="end">${v / 1000}к</text>`).join('')}
        ${D.weeks.map((w, i) => `<g class="ch-b" style="--i:${i}"><rect x="${(pad + bw * i + bw * 0.18).toFixed(1)}" y="${y(w.rev).toFixed(1)}" width="${(bw * 0.64).toFixed(1)}" height="${(H - pad - y(w.rev)).toFixed(1)}" rx="3"><title>${w.w}: выручка ${zl(w.rev)}, прибыль ${zl(w.profit)}</title></rect><text x="${(pad + bw * i + bw / 2).toFixed(1)}" y="${H - 8}" class="ch-ax" text-anchor="middle">${w.w}</text></g>`).join('')}
        <path d="${line}" class="ch-line"/>${D.weeks.map((w, i) => `<circle cx="${(pad + bw * i + bw / 2).toFixed(1)}" cy="${y(w.profit).toFixed(1)}" r="4" class="ch-dot"><title>${zl(w.profit)}</title></circle>`).join('')}</svg></section>
    </div>
    <section class="card card--flush"><div class="card__h card__h--pad"><h2>Нормы времени: план и факт по вещам</h2><span class="muted">из приложения бригады · ноябрь</span></div><div class="tw"><table class="tbl"><thead><tr><th>Вещь</th><th class="r">Норма</th><th class="r">Факт (медиана)</th><th class="r">Замеров</th><th>Разница</th><th></th></tr></thead><tbody>
      ${D.norms.map((n, i) => { const d = n.fact - n.norm, pct = Math.round(d / n.norm * 100); return `<tr><td>${n.item}</td><td class="r">${n.norm} мин</td><td class="r"><b>${n.fact} мин</b></td><td class="r muted">${n.n}</td><td><span class="dev ${pct > 8 ? 'up' : pct < -8 ? 'down' : ''}"><i style="--d:${Math.max(-1, Math.min(1, pct / 20))}"></i>${pct > 0 ? '+' : ''}${pct} %</span></td><td class="r">${n.done ? '<span class="st st--ok">в расчёте цены</span>' : Math.abs(pct) > 8 ? `<button class="btn btn--s ${pct > 0 ? 'btn--tape' : ''}" data-norm="${i}">${pct > 0 ? 'Поднять' : 'Снизить'} до ${Math.round(n.fact)} мин</button>` : '<span class="muted">в норме</span>'}</td></tr>`; }).join('')}</tbody></table></div>
      <p class="hint hint--pad">Пример: «Шкаф 2 м: норма 45 мин, факт 52 мин — поднять норму?» После подтверждения новая норма попадёт в формулу цены на сайте и в оферты.</p></section>`;
  };
  AFTER.reports = () => $$('[data-norm]').forEach((b) => b.addEventListener('click', () => { const n = D.norms[+b.dataset.norm]; n.norm = Math.round(n.fact); n.done = true; render(true); toast(`Норма «${n.item}» — ${n.norm} мин. Цены на сайте пересчитаются по новой норме.`); }));

  /* ---------- НАСТРОЙКИ ---------- */
  let setTab = 'prices', msgLang = 'PL';
  const MSG = {
    PL: 'Dzień dobry, {imię}! Oto Twoja oferta MELBUS: {pakiet}, stała cena {cena} zł. Zadatek 20% — BLIK lub kartą: {link}. Cena, którą zaakceptujesz, się nie zmienia.',
    EN: 'Hello {name}! Here is your MELBUS offer: {package}, fixed price {price} zł. 20% deposit by BLIK or card: {link}. The price you accept doesn’t change.',
    RU: 'Здравствуйте, {имя}! Ваша оферта MELBUS: {пакет}, фиксированная цена {цена} zł. Задаток 20 % — BLIK или картой: {ссылка}. Цена, которую вы приняли, не меняется.',
    UA: 'Вітаємо, {ім’я}! Ваша оферта MELBUS: {пакет}, фіксована ціна {ціна} zł. Завдаток 20 % — BLIK або карткою: {посилання}. Ціна, яку ви прийняли, не змінюється.',
  };
  PAGES.settings = () => {
    const tabs = [['prices', 'Цены'], ['photos', 'Фото по шагам'], ['msgs', 'Сообщения'], ['int', 'Интеграции'], ['access', 'Доступ']];
    const body = {
      prices: () => `<div class="form">${[['Час работы человека (для клиента)', '100 zł'], ['Бус, включая 30 км маршрута', '150 zł'], ['Каждый км после 30', '2,5 zł'], ['Грузотакси', '150 zł/ч · мин. 2 ч'], ['Перевозка по часам', '270 zł/ч · мин. 3 ч'], ['Задаток', '20 % · мин. 200 zł'], ['Оферта действует', '14 дней'], ['Себестоимость человека', '40 zł/ч']].map(([t, v]) => `<label class="fld"><span>${t}</span><input value="${v}"></label>`).join('')}</div><div class="dr__act"><button class="btn btn--tape" data-save>Сохранить</button></div><p class="hint">Те же числа считают цену на сайте, в офертах и в приложении — одна формула для всех.</p>`,
      photos: () => `<ul class="req">${D.STAGES.map((s, i) => { const need = { 1: 1, 2: 4, 3: 2, 4: 1, 8: 4 }[i] || 0; return `<li><span class="ln__n">${String(i + 1).padStart(2, '0')}</span><b>${s}</b><span class="req__n">${need ? `от ${need} фото` : 'фото не обязательны'}</span><button class="tg ${need ? 'on' : ''}" data-tg aria-pressed="${!!need}"><i></i></button></li>`; }).join('')}</ul><p class="hint">Без обязательных фото бригадир не сможет закрыть шаг — это защищает и клиента, и вас.</p>`,
      msgs: () => `<div class="chips">${Object.keys(MSG).map((k) => `<button class="chip ${k === msgLang ? 'on' : ''}" data-ml="${k}">${k}</button>`).join('')}</div><label class="fld fld--l"><span>Оферта клиенту · ${msgLang}</span><textarea rows="5">${MSG[msgLang]}</textarea></label><div class="dr__act"><button class="btn btn--tape" data-save>Сохранить шаблон</button></div>`,
      int: () => `<ul class="ints">${[['Telegram', 'Группа «Melbus заявки» · бот @Melbus_bot', 'on'], ['Przelewy24 · BLIK и карты', 'Задаток онлайн', ''], ['Fakturownia · KSeF', 'Фактуры автоматически', ''], ['Google Календарь', 'Расписание бригады (ссылка ICS)', 'on'], ['SMSAPI.pl', 'SMS клиенту: «бригада выехала»', '']].map(([t, d, on]) => `<li><div><b>${t}</b><small>${d}</small></div>${on ? '<span class="st st--ok">подключено</span>' : '<button class="btn btn--s" data-conn>Подключить</button>'}</li>`).join('')}</ul>`,
      access: () => `<ul class="ints">${[['Владелец', 'всё, включая финансы и цены'], ['Менеджер', 'заявки, оферты, расписание, заказы, сотрудники'], ['Бригадир', 'приложение: свои заказы, подпись клиента, оплата'], ['Грузчик / упаковщик / водитель', 'приложение: свои заказы, сканер, фото, своё время']].map(([t, d]) => `<li><div><b>${t}</b><small>${d}</small></div><span class="muted">${t === 'Владелец' ? '1 человек' : t === 'Менеджер' ? '1 человек' : ''}</span></li>`).join('')}</ul><p class="hint">Вход в Пульт — по e-mail с кодом (Cloudflare Access). В приложении — телефон + PIN.</p>`,
    };
    return `${head('Одна формула цены для сайта, оферт и приложения', 'Настройки')}<nav class="tabs">${tabs.map(([k, t]) => `<a href="#/settings" data-st="${k}" class="${k === setTab ? 'on' : ''}">${t}</a>`).join('')}</nav><section class="card">${body[setTab]()}</section>`;
  };
  AFTER.settings = () => {
    $$('[data-st]').forEach((a) => a.addEventListener('click', (e) => { e.preventDefault(); setTab = a.dataset.st; render(true); }));
    $$('[data-ml]').forEach((a) => a.addEventListener('click', () => { msgLang = a.dataset.ml; render(true); }));
    $$('[data-save]').forEach((a) => a.addEventListener('click', () => toast('Сохранено (в прототипе — только на экране)')));
    $$('[data-tg]').forEach((a) => a.addEventListener('click', () => { a.classList.toggle('on'); a.setAttribute('aria-pressed', a.classList.contains('on')); }));
    $$('[data-conn]').forEach((a) => a.addEventListener('click', () => toast('Подключение — на этапе 2 (нужен договор и ключ)')));
  };

  /* ---------- общие клики ---------- */
  document.addEventListener('click', (e) => {
    const t = e.target;
    const oj = t.closest('[data-open-job]'); if (oj && !t.closest('a,button')) { location.hash = `#/job/${oj.dataset.openJob}`; return; }
    const lf = t.closest('[data-lf]'); if (lf) { leadFilter = lf.dataset.lf; render(true); return; }
    const of = t.closest('[data-of]'); if (of) { offerFilter = of.dataset.of; render(true); return; }
    const jf = t.closest('[data-jf]'); if (jf) { jobFilter = jf.dataset.jf; render(true); return; }
    const lm = t.closest('[data-lead-move]'); if (lm) { e.stopPropagation(); leadMoveMenu(lm.dataset.leadMove, lm); return; }
    const ofr = t.closest('tr[data-offer]'); if (ofr && !t.closest('button')) { openOffer(ofr.dataset.offer); return; }
    const rs = t.closest('[data-resend]'); if (rs) { const o = D.offers.find((x) => x.id === rs.dataset.resend); if (o.status === 'draft') o.status = 'sent'; render(true); toast(`Оферта ${o.id} отправлена клиенту`); return; }
    const al = t.closest('[data-alert]'); if (al) { const a = al.dataset.alert; if (a.startsWith('#')) location.hash = a; else if (a === 'remind') toast('Напоминание о задатке отправлено Катажине Демо в WhatsApp'); else toast('Звонок: Tomasz Demo · +48 600 200 070'); return; }
    const lb = t.closest('[data-lb]'); if (lb) { lightbox([{ src: lb.dataset.lb, cap: lb.dataset.cap || '', meta: 'Фото из приложения бригады' }], 0); return; }
    if (t.closest('[data-wk]')) { toast('В прототипе показана одна неделя'); return; }
    if (t.closest('[data-call-extra]')) { D.DAYS.forEach((d) => { if (dayNeed(d.k) > d.avail) d.avail = dayNeed(d.k); }); render(true); toast('Запрос ушёл резервным сотрудникам · 2 подтвердили'); return; }
    if (t.closest('[data-act="new-lead"]')) { newLead(); return; }
    if (t.closest('[data-act="bell"]')) { toggleNotif(); return; }
    if (t.closest('[data-act="menu"]')) { document.body.classList.toggle('side-open'); return; }
    if (t.closest('#scrim')) { closeDrawer(); closeSide(); return; }
    if (!t.closest('.notif') && !t.closest('[data-act="bell"]')) $('#notif').hidden = true;
    if (!t.closest('.pop') && !t.closest('[data-lead-move]') && !t.closest('.sb')) closePop();
  });
  document.addEventListener('keydown', (e) => {
    const typing = /INPUT|TEXTAREA|SELECT/.test(document.activeElement?.tagName);
    if (e.key === '/' && !typing) { e.preventDefault(); $('#q').focus(); }
    if (e.key === 'Escape') { closeDrawer(); closeModal(); closeLb(); closePop(); $('#q').blur(); $('#qres').hidden = true; $('#notif').hidden = true; }
    if (e.key === 'Enter' && e.target.matches('[data-open-job]')) location.hash = `#/job/${e.target.dataset.openJob}`;
  });
  const closeSide = () => document.body.classList.remove('side-open');

  /* ---------- поиск ---------- */
  const q = $('#q'), qres = $('#qres');
  let qi = 0, qitems = [];
  function searchIndex() {
    const out = [];
    D.jobs.forEach((j) => out.push({ k: 'Заказ', t: `${j.id} · ${j.client}`, s: `${dayLabel(j.day)} · ${D.PKG[j.pkg]} · ${j.phone}`, h: `#/job/${j.id}`, x: `${j.id} ${j.client} ${j.phone}` }));
    D.leads.forEach((l) => out.push({ k: 'Заявка', t: `${l.name}`, s: `${l.id} · ${l.src} · ${l.phone}`, h: '#/leads', lead: l.id, x: `${l.id} ${l.name} ${l.phone}` }));
    D.offers.forEach((o) => out.push({ k: 'Оферта', t: `${o.id} · ${o.client}`, s: zl(o.sum), h: '#/offers', offer: o.id, x: `${o.id} ${o.client}` }));
    D.staff.forEach((s) => out.push({ k: 'Сотрудник', t: s.name, s: `${s.role} · ${s.phone}`, h: '#/staff', x: `${s.name} ${s.phone}` }));
    D.jobs.filter((j) => j.boxes).forEach((j) => boxesOf(j).forEach((b) => out.push({ k: 'Коробка', t: `${b.code}`, s: `${j.id} · ${D.ROOMS[b.room][0]} ${String(b.no).padStart(2, '0')} · ${b.what}`, h: `#/job/${j.id}/boxes`, box: b.code, x: b.code })));
    return out;
  }
  function doSearch() {
    const v = q.value.trim().toLowerCase().replace(/\s+/g, ' ');
    if (!v) { qres.hidden = true; return; }
    const norm = (s) => s.toLowerCase().replace(/\s+/g, ' ');
    qitems = searchIndex().filter((r) => norm(r.x).includes(v) || norm(r.x).replace(/\s/g, '').includes(v.replace(/\s/g, ''))).slice(0, 8);
    qi = 0;
    qres.innerHTML = qitems.length ? qitems.map((r, i) => `<a href="${r.h}" class="${i === qi ? 'on' : ''}" data-qi="${i}"><em>${r.k}</em><b>${esc(r.t)}</b><small>${esc(r.s)}</small></a>`).join('') : '<p class="muted">Ничего не найдено</p>';
    qres.hidden = false;
  }
  function pick(r) { qres.hidden = true; q.value = ''; q.blur(); if (r.box) boxFilter = { room: 'all', st: 'all', q: r.box }; location.hash = r.h; if (r.lead) setTimeout(() => openLead(r.lead), 60); if (r.offer) setTimeout(() => openOffer(r.offer), 60); }
  q.addEventListener('input', doSearch);
  q.addEventListener('focus', doSearch);
  q.addEventListener('keydown', (e) => {
    if (qres.hidden) return;
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') { e.preventDefault(); qi = (qi + (e.key === 'ArrowDown' ? 1 : -1) + qitems.length) % qitems.length; $$('a', qres).forEach((a, i) => a.classList.toggle('on', i === qi)); }
    if (e.key === 'Enter' && qitems[qi]) { e.preventDefault(); pick(qitems[qi]); }
  });
  qres.addEventListener('click', (e) => { const a = e.target.closest('[data-qi]'); if (a) { e.preventDefault(); pick(qitems[+a.dataset.qi]); } });
  q.addEventListener('blur', () => setTimeout(() => { qres.hidden = true; }, 150));

  /* ---------- уведомления ---------- */
  function toggleNotif() {
    const n = $('#notif');
    n.innerHTML = `<p class="notif__h">Уведомления</p>${D.notifications.map((x) => `<a href="${x.job ? '#/job/' + x.job : x.lead ? '#/leads' : '#/offers'}"><span>${x.t}</span><small>${x.at} назад</small></a>`).join('')}`;
    n.hidden = !n.hidden; $('.bell__dot').hidden = true;
  }

  /* ---------- новая заявка ---------- */
  function newLead() {
    modal(`<h3>Новая заявка</h3><p class="muted">Например, клиент позвонил. С сайта заявки приходят сами.</p>
      <form class="form" data-nl><label class="fld"><span>Имя</span><input name="name" required placeholder="Имя клиента" value="Новый Демо-клиент"></label><label class="fld"><span>Телефон</span><input name="phone" placeholder="+48" value="+48 600 300 001"></label>
      <label class="fld"><span>Канал</span><select name="src"><option>Телефон</option><option>Сайт</option><option>WhatsApp</option><option>Instagram</option></select></label><label class="fld"><span>Язык</span><select name="lang"><option>PL</option><option>EN</option><option>RU</option><option>UA</option></select></label>
      <label class="fld"><span>Пакет</span><select name="pkg"><option value="move">Перевозка</option><option value="full">Под ключ</option><option value="taxi">Грузотакси</option></select></label><label class="fld"><span>Желаемая дата</span><input name="date" value="10.12"></label>
      <div class="dr__act"><button type="button" class="btn" data-mc>Отмена</button><button class="btn btn--tape">Добавить</button></div></form>`, (m) => {
      $('[data-mc]', m).onclick = closeModal;
      $('[data-nl]', m).addEventListener('submit', (e) => {
        e.preventDefault(); const f = new FormData(e.target);
        const l = { id: 'L-30' + (90 + D.leads.length), name: f.get('name'), phone: f.get('phone'), src: f.get('src'), lang: f.get('lang'), pkg: f.get('pkg'), est: { move: 1790, full: 3890, taxi: 300 }[f.get('pkg')], date: f.get('date'), rooms: '2 комнаты', route: 'Варшава → Варшава', at: now(), col: 'new', _new: true };
        D.leads.unshift(l); closeModal(); location.hash = '#/leads'; render(true); toast(`Заявка <b>${esc(l.name)}</b> добавлена · уведомление в Telegram`);
      });
    });
  }

  /* ---------- окна: панель, модальное, всплывающее, просмотр фото, тосты ---------- */
  const drawerEl = $('#drawer'), scrim = $('#scrim');
  function drawer(html, bind) { $('#drawerIn').innerHTML = html; drawerEl.classList.add('open'); drawerEl.setAttribute('aria-hidden', 'false'); scrim.hidden = false; $$('[data-close]', drawerEl).forEach((b) => b.addEventListener('click', closeDrawer)); bind?.(drawerEl); setTimeout(() => $('[data-close]', drawerEl)?.focus(), 50); }
  function closeDrawer() { drawerEl.classList.remove('open'); drawerEl.setAttribute('aria-hidden', 'true'); scrim.hidden = !document.body.classList.contains('side-open'); }
  const modalEl = $('#modal');
  function modal(html, bind) { $('#modalIn').innerHTML = `<button class="ib modal__x" data-mx aria-label="Закрыть">${ico('x')}</button>${html}`; modalEl.hidden = false; $('[data-mx]', modalEl).onclick = closeModal; bind?.(modalEl); }
  function closeModal() { modalEl.hidden = true; }
  modalEl.addEventListener('click', (e) => { if (e.target === modalEl) closeModal(); });
  let popEl = null;
  function popover(anchor, html, bind) {
    closePop(); popEl = document.createElement('div'); popEl.className = 'pop'; popEl.innerHTML = html; document.body.append(popEl);
    const r = anchor.getBoundingClientRect(), w = popEl.offsetWidth, h = popEl.offsetHeight;
    popEl.style.left = Math.max(8, Math.min(innerWidth - w - 8, r.left)) + 'px';
    popEl.style.top = (r.bottom + h + 8 > innerHeight ? Math.max(8, r.top - h - 6) : r.bottom + 6) + 'px';
    bind?.(popEl);
  }
  function closePop() { popEl?.remove(); popEl = null; }
  const lb = $('#lb'); let lbList = [], lbI = 0;
  function lightbox(list, i) { lbList = list; lbI = i; showLb(); lb.hidden = false; }
  function showLb() { const p = lbList[lbI]; $('#lbImg').src = p.src; $('#lbCap').innerHTML = `<b>${esc(p.cap)}</b><small>${esc(p.meta || '')}</small><span>${lbI + 1} / ${lbList.length}</span>`; $$('.lb__nav', lb).forEach((b) => { b.hidden = lbList.length < 2; }); }
  function closeLb() { lb.hidden = true; }
  lb.addEventListener('click', (e) => { if (e.target.closest('[data-lbn]')) { lbI = (lbI + +e.target.closest('[data-lbn]').dataset.lbn + lbList.length) % lbList.length; showLb(); } else if (e.target === lb || e.target.closest('[data-lbx]')) closeLb(); });
  document.addEventListener('keydown', (e) => { if (lb.hidden) return; if (e.key === 'ArrowRight') { lbI = (lbI + 1) % lbList.length; showLb(); } if (e.key === 'ArrowLeft') { lbI = (lbI - 1 + lbList.length) % lbList.length; showLb(); } });
  function toast(html, href) {
    const t = document.createElement('div'); t.className = 'toast'; t.innerHTML = `${ico('check')}<p>${html}</p>${href ? `<a href="${href}">Открыть</a>` : ''}`;
    $('#toasts').append(t); setTimeout(() => t.classList.add('out'), 4200); setTimeout(() => t.remove(), 4700);
  }

  /* ---------- «живой» день: бригады двигаются, лента пополняется ---------- */
  setInterval(() => {
    clock += 1;
    const a = J('M-1142'), r = Math.random();
    let ev = null;
    if (a.stage === 3 && a.packed < a.boxes) {
      a.packed++; const b = boxesOf(a)[a.packed - 1];
      ev = { at: now(), who: b.by, t: `упакована коробка <b class="mono">${b.code}</b> · ${D.ROOMS[b.room][0]} ${String(b.no).padStart(2, '0')}`, job: a.id };
    } else if (a.stage === 3) { a.stage = 4; a.times[3] += now(); a.times[4] = now() + '–'; ev = { at: now(), who: 's1', t: 'упаковка закончена, начата погрузка', job: a.id }; }
    else if (a.stage === 4 && a.loaded < a.boxes) { a.loaded = Math.min(a.boxes, a.loaded + 2); if (r < 0.5) ev = { at: now(), who: 's2', t: `в бусе ${a.loaded} из ${a.boxes} коробок`, job: a.id }; }
    const b = J('M-1143'); if (r > 0.82 && b.stage === 5) ev = { at: now(), who: 's5', t: `в пути · прибытие ≈ ${b.eta}`, job: b.id };
    if (ev) { feed.unshift(ev); D.notifications.unshift({ t: `${S(ev.who).name}: ${ev.t.replace(/<[^>]+>/g, '')}`, at: 'только что', job: ev.job }); D.notifications.length = Math.min(D.notifications.length, 8); $('.bell__dot').hidden = false; }
    // обновляем только нужные куски, без перерисовки страницы
    $$('[data-live="clock"]').forEach((e) => { e.textContent = now(); });
    if (cur.page === 'today') {
      const cr = $('[data-live="crews"]'); if (cr) cr.innerHTML = CREWS.map(crewCard).join('');
      const fd = $('[data-live="feed"]'); if (fd && ev) { fd.insertAdjacentHTML('afterbegin', feedRow(ev, true)); while (fd.children.length > 7) fd.lastElementChild.remove(); }
    }
    $$(`[data-live="packed-${a.id}"]`).forEach((e) => { e.textContent = a.packed; });
    if (cur.page === 'job' && ev) { const ul = $(`[data-live="ev-${ev.job}"]`); if (ul) ul.insertAdjacentHTML('afterbegin', `<li class="is-live is-new"><time>${ev.at}</time>${ava(ev.who, 'ava--s')}<p><b>${S(ev.who).name}</b> ${ev.t}</p></li>`); }
  }, 3500);

  render();
})();
