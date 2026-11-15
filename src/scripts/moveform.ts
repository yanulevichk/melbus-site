// @ts-nocheck — большой DOM-скрипт формы; модель цены типизирована в src/data/move.ts
/**
 * Форма «Что у вас дома» в браузере: вещи и размеры, адреса, коробки, допы, дата, табло с барабанами, бус с коробками,
 * отправка заявки (/api/quote, видео — /api/upload/*). Надписи приходят из MoveForm.astro (JSON, нужный язык).
 */
import { LEVELS, ROOMS, P, ITEMS, ITEM, EXTRAS, PRESETS, PLACE, KM_FREE, KM_RATE, HOURLY, BOX_MAT, CAP, calc, route, roadKm, specOf, asmOn, money } from '../data/move';

const ICO = {
  list: '<path d="M9 6h11M9 12h11M9 18h11M4 6h1M4 12h1M4 18h1"/>',
  camera: '<rect x="2.5" y="6" width="13" height="12" rx="2"/><path d="m15.5 10.5 6-3.5v10l-6-3.5z"/>',
  wheel: '<circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="2.2"/><path d="M3.6 11h6.2M14.2 11h6.2M12 14.2v6.3"/>',
  carry: '<path d="M3.5 10 11 6.3l7.5 3.7v7.5L11 21.2l-7.5-3.7z"/><path d="M3.5 10 11 13.7l7.5-3.7M11 13.7v7.5"/><path d="M16.5 3.5h4v4M20.5 3.5l-4.5 4.5"/>',
  key: '<circle cx="8" cy="15.5" r="4.5"/><path d="M11.3 12.3 20 3.5M16.2 7.5l2.6 2.6M18.6 5 21 7.4"/>',
  bed2: '<rect x="4" y="3" width="16" height="18" rx="1.5"/><rect x="6.5" y="5.5" width="4.5" height="3" rx="1"/><rect x="13" y="5.5" width="4.5" height="3" rx="1"/><path d="M4 11h16"/>',
  bed1: '<rect x="7" y="3" width="10" height="18" rx="1.5"/><rect x="9.5" y="5.5" width="5" height="3" rx="1"/><path d="M7 11h10"/>',
  bunk: '<path d="M4 3v18M20 3v18M4 7h16v2.5H4M4 15h16v2.5H4M16 9.5V15"/>',
  crib: '<path d="M4 5v16M20 5v16M4 8.5h16M4 17h16M8 8.5V17M12 8.5V17M16 8.5V17"/>',
  wardS: '<rect x="7" y="3" width="10" height="17" rx="1"/><path d="M12 3v17M10.5 10.5v3M13.5 10.5v3M8.5 20v1.5M15.5 20v1.5"/>',
  wardM: '<rect x="3.5" y="3" width="17" height="17" rx="1"/><path d="M9.2 3v17M14.8 3v17M7.8 10.5v3M10.6 10.5v3M16.2 10.5v3M5 20v1.5M19 20v1.5"/>',
  wardL: '<rect x="2.5" y="3" width="19" height="18" rx="1"/><path d="M12 3v18M2.5 6h19M15.5 10.5l3-2M15.5 14.5l4-3M5.5 10.5l3-2"/>',
  wardOpen: '<path d="M4 3.5h9v17H4z"/><path d="m13 3.5 6 2v17l-6-2M6.5 7.5h4M6.5 11h4"/>',
  dresser: '<rect x="4" y="5" width="16" height="14" rx="1"/><path d="M4 9.7h16M4 14.3h16M11 7.3h2M11 12h2M11 16.6h2M5.5 19v2M18.5 19v2"/>',
  nights: '<rect x="6" y="8" width="12" height="11" rx="1"/><path d="M6 13.5h12M11 10.7h2M11 16.2h2M7.5 19v2M16.5 19v2"/>',
  mirror: '<rect x="7" y="2.5" width="10" height="19" rx="5"/><path d="m10 8 3-2M10 12l5-3.5"/>',
  sofa: '<path d="M5 11V8a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v3M12 6v8"/><path d="M3 12a2 2 0 0 1 4 0v2h10v-2a2 2 0 0 1 4 0v5H3zM5 17v2M19 17v2"/>',
  sofaC: '<path d="M3 4h6.5v9H21v7H3z"/><path d="M5.8 4v13.2H21"/>',
  armch: '<path d="M7 11V8a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v3"/><path d="M4 12a1.8 1.8 0 0 1 3.5 0v2h9v-2a1.8 1.8 0 0 1 3.5 0v5H4zM6 17v2M18 17v2"/>',
  tv: '<rect x="2.5" y="4" width="19" height="12.5" rx="1.2"/><path d="M8 20h8M12 16.5V20"/>',
  tvst: '<rect x="3" y="12" width="18" height="6" rx="1"/><path d="M12 12v6M5 18v2M19 18v2"/><rect x="7" y="4" width="10" height="6" rx=".8"/>',
  shelf: '<rect x="5" y="3" width="14" height="18" rx="1"/><path d="M5 9h14M5 15h14M8 9V5.5M10 9V6M13.5 15v-4M15.5 15v-3"/>',
  ctable: '<path d="M3 10.5h18M6 10.5V17M18 10.5V17M4 10.5 5.5 8h13l1.5 2.5"/>',
  rug: '<rect x="4" y="5" width="16" height="14" rx="1"/><rect x="7" y="8" width="10" height="8" rx=".5"/><path d="M5 3.5V5M9 3.5V5M12 3.5V5M15 3.5V5M19 3.5V5M5 19v1.5M9 19v1.5M12 19v1.5M15 19v1.5M19 19v1.5"/>',
  lamp: '<path d="M8 3h8l2 6H6z"/><path d="M12 9v11M8.5 21h7"/>',
  plant: '<path d="M8 15h8l-1 6H9z"/><path d="M12 15V9.5M12 11.5c-3 0-5-2-5-5 3 0 5 2 5 5zM12 9.5c0-3 2-5 5-5 0 3-2 5-5 5z"/>',
  fridge: '<rect x="6" y="2.5" width="12" height="19" rx="1.5"/><path d="M6 9.5h12M9 5v2.5M9 12v3"/>',
  washer: '<rect x="4.5" y="3" width="15" height="18" rx="1.5"/><path d="M4.5 7h15M7 5h1M10 5h1"/><circle cx="12" cy="13.5" r="4.5"/><path d="M9.5 14c1.2-1 2.5 1 5 0"/>',
  dishw: '<rect x="4.5" y="3" width="15" height="18" rx="1.5"/><path d="M4.5 7.5h15M8 5.2h8M8 11h8M8 14h8M8 17h8"/>',
  dtable: '<path d="M2.5 9.5h19M5 9.5V20M19 9.5V20M5 13h14"/>',
  chair: '<path d="M7.5 3v18M7.5 12h10v9M7.5 3h2"/>',
  desk: '<path d="M2.5 8h19M4 8v12M20 8v12M13 8v8h7M13 12h7M15.5 10h2M15.5 14h2"/>',
  ochair: '<rect x="7.5" y="3" width="9" height="8" rx="2"/><path d="M6 13h12M12 13v5M7.5 21l4.5-3 4.5 3"/>',
  pc: '<rect x="3" y="4" width="13" height="10" rx="1"/><path d="M7 18h5M9.5 14v4"/><rect x="18" y="6" width="3.5" height="13" rx=".8"/>',
  hall: '<path d="M4 5h16M7 5v3M12 5v3M17 5v3"/><rect x="5" y="12" width="14" height="8" rx="1"/><path d="M5 16h14"/>',
  bike: '<circle cx="6" cy="16" r="3.5"/><circle cx="18" cy="16" r="3.5"/><path d="m6 16 4-7h5l3 7M10 9l3 7H6M14 6.5h2.5M9 7.5h2"/>',
  stroll: '<path d="M5 6h11a4 4 0 0 1 4 4v1H5z"/><path d="M5 11a6 6 0 0 0 6 4h3a6 6 0 0 0 6-4M3 4h2v2"/><circle cx="8" cy="19" r="1.8"/><circle cx="17" cy="19" r="1.8"/>',
  balc: '<path d="M4 9.5 12 5l8 4.5zM12 9.5V21M8.5 21h7M5 14h3.5v7M19 14h-3.5v7"/>',
  tires: '<circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="3.5"/><path d="M12 3.5v5M12 15.5v5M3.5 12h5M15.5 12h5"/>',
  bags: '<rect x="5" y="7" width="14" height="13" rx="2"/><path d="M9 7V4.5h6V7M9 7v13M15 7v13"/>',
  drill: '<path d="M3 7.5h10v6H3zM13 9h3M16 10.5h5M6.5 13.5V20h4l-1-6.5"/>',
  putty: '<path d="M10 13h10l1.5 5.5H8.5z"/><path d="M15 13V7a1.5 1.5 0 0 0-3 0v6"/><circle cx="4.5" cy="6" r="1"/><circle cx="4.5" cy="11" r="1"/>',
  rod: '<path d="M2.5 4h19"/><path d="M5 4c0 6 2 11 4 16H4.5V4M19 4c0 6-2 11-4 16h4.5V4"/>',
  frame: '<rect x="3.5" y="6" width="17" height="14" rx="1"/><path d="M12 2.5 8 6M12 2.5 16 6M3.5 16.5l5-4.5 4 3.5 3-2.5 5 4"/>',
  bin: '<path d="M4 6.5h16M9 6.5V4h6v2.5M6 6.5l1 14h10l1-14M10 10v7M14 10v7"/>',
  door: '<path d="M5 21h14M7 21V3.5h10V21M13.5 12.5v.01"/>',
  stairs: '<path d="M3 20h5v-4.5h4.5V11H17V6.5h4"/>',
  mic: '<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5.5 11a6.5 6.5 0 0 0 13 0M12 17.5V21"/>',
  tune: '<path d="M4 7h9M17 7h3M4 17h3M11 17h9"/><circle cx="15" cy="7" r="2"/><circle cx="9" cy="17" r="2"/>',
};

const MINI = '<svg viewBox="0 0 26 26"><path d="M3 8 13 3l10 5v11l-10 5-10-5z" fill="#fff" stroke="#8F9AA7"/><path d="m3 8 10 5 10-5M13 13v11" fill="none" stroke="#8F9AA7"/><path d="m8 5.5 10 5v11" fill="none" stroke="#14DCD5" stroke-width="2.4"/></svg>';
const CELLS = 60;

async function uploadVideo(file, onProgress) {
  const start = await fetch('/api/upload/start', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ name: file.name, type: file.type, size: file.size }) }).catch(() => null);
  if (!start?.ok) return null;
  const { key, uploadId, part } = await start.json();
  const parts = [], total = Math.ceil(file.size / part);
  for (let n = 1; n <= total; n++) {
    const chunk = file.slice((n - 1) * part, Math.min(file.size, n * part));
    let r = null;
    for (let tries = 0; tries < 3 && !r?.ok; tries++) r = await fetch(`/api/upload/part?key=${encodeURIComponent(key)}&uploadId=${encodeURIComponent(uploadId)}&n=${n}`, { method: 'PUT', body: chunk }).catch(() => null);
    if (!r?.ok) return null;
    parts.push(await r.json()); onProgress(n / total);
  }
  const done = await fetch('/api/upload/complete', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ key, uploadId, parts }) }).catch(() => null);
  return done?.ok ? { key, name: file.name, size: file.size } : null;
}

export function initMoveForm() {
  const root = document.querySelector('[data-mf]');
  if (!root || root.dataset.ready) return;
  root.dataset.ready = '1';
  const I = JSON.parse(root.querySelector('[data-mf-i18n]').textContent || '{}');
  const T = I.t, LANG = I.L;
  const $ = (k) => root.querySelector(`[data-el="${k}"]`);
  const tr = (s, v = {}) => s.replace(/\{(\w+)\}/g, (_, k) => (v[k] ?? ''));
  const nf = new Intl.NumberFormat(I.num, { maximumFractionDigits: 0 });
  const fmt = (n) => nf.format(Math.round(n));
  const zl = (n) => fmt(Math.round(n / 10) * 10) + ' zł';
  const dec = (x, d = 1) => new Intl.NumberFormat(I.num, { minimumFractionDigits: 0, maximumFractionDigits: d }).format(x);
  const pr = new Intl.PluralRules(LANG);
  const pl = (n, key) => { const f = I.plural[key], c = pr.select(n); return n + ' ' + (c === 'one' ? f[0] : c === 'few' ? f[1] : f[2]); };
  const hrs = (m) => dec(Math.round(m / 30) / 2);
  const tdur = (m) => (m < 90 ? Math.round(m) + ' ' + I.units.min : hrs(m) + ' ' + I.units.h);
  const m3 = (v) => dec(v) + ' м³';
  const ico = (k) => `<svg class="i" viewBox="0 0 24 24" aria-hidden="true">${ICO[k] || ''}</svg>`;
  const pic = (k, cls = 'pic') => `<img class="${cls}" src="/img/icons/${k}.webp" alt="" width="192" height="192" loading="lazy" decoding="async">`;
  const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  const smooth = () => (reduce.matches ? 'auto' : 'smooth');
  root.querySelectorAll('[data-ico]').forEach((s) => { s.setAttribute('aria-hidden', 'true'); s.innerHTML = ICO[s.dataset.ico]; });
  if (reduce.matches) root.querySelectorAll('video').forEach((v) => { v.removeAttribute('autoplay'); v.pause(); });

  // шапка сайта прячется при прокрутке — полоса шагов поднимается следом
  const hdr = document.querySelector('.hdr');
  const syncTop = () => root.style.setProperty('--mf-top', hdr && !hdr.classList.contains('is-hidden') ? 'calc(var(--header-h) + env(safe-area-inset-top, 0px))' : 'env(safe-area-inset-top, 0px)');
  if (hdr) new MutationObserver(syncTop).observe(hdr, { attributes: true, attributeFilter: ['class'] });
  syncTop();

  // ===== состояние: пример — 2 комнаты, «Под ключ», Мокотув → Бемово =====
  const S = { mode: 'list', level: 3, hours: 2,
    from: { place: 'Warszawa, Mokotów', floor: 3, lift: true, door: 0, house: 0 }, to: { place: 'Warszawa, Bemowo', floor: 2, lift: false, door: 1, house: 0 },
    list: [], boxes: 0, extras: {}, unpack: false, ahead: false, kitchen: false, preset: 'two', room: 'pop', q: '', date: '', dateK: 0, dateLabel: '' };
  let uid = 0;
  const T0 = Date.now();
  function applyPreset(k) {
    const p = PRESETS[k];
    S.preset = k; S.boxes = p.boxes; S.extras = {};
    S.list = p.items.map(([id, n, sel]) => ({ u: ++uid, id, n, sel: { ...ITEM[id].def, ...(sel || {}) }, cond: 'ok' }));
  }
  applyPreset('two');
  // ссылки с других страниц: ?size=0..4&pkg=0..2 (страница цен, главная), ?lvl=1..3, ?from= / ?to= (страницы районов), ?mode=video
  const qs = new URLSearchParams(location.search);
  const sizeK = ['studio', 'two', 'three', 'house', 'three'][Number(qs.get('size'))];
  if (qs.has('size') && sizeK) applyPreset(sizeK);
  const pkgQ = qs.get('pkg');
  if (pkgQ === '0' || pkgQ === '1') S.level = 2;
  if (pkgQ === '1') { S.kitchen = true; S.ahead = true; S.list.forEach((e) => { e.asm = true; }); }
  const lvlQ = Number(qs.get('lvl'));
  if (lvlQ >= 1 && lvlQ <= 3) S.level = lvlQ;
  for (const k of ['from', 'to']) { const v = qs.get(k); if (v && PLACE[v]) S[k].place = v; }
  if (S.from.place === S.to.place) S.to.place = S.from.place === 'Warszawa, Śródmieście' ? 'Warszawa, Mokotów' : 'Warszawa, Śródmieście';
  if (qs.get('mode') === 'video') S.mode = 'video';
  const countOf = (id) => S.list.filter((e) => e.id === id).reduce((a, e) => a + e.n, 0);
  const totalItems = () => S.list.reduce((a, e) => a + e.n, 0);
  function summary(e, withWork = true) {
    const it = ITEM[e.id], parts = (it.p || []).map((k) => I.params[k].opts[e.sel[k]]);
    if (withWork) {
      const c = e.cond || 'ok';
      if (it.kind === 'ward' && c !== 'ok') parts.push({ whole: T.wWhole, fix: T.wFix, drop: T.wDrop }[c]);
      else if (specOf(e).a > 0) parts.push(asmOn(e, S.level) ? T.wAsm : T.wNoAsm);
    }
    return parts.join(' · ');
  }

  // ===== барабаны цены =====
  function drums(el, value) {
    const str = value == null ? '—' : fmt(value);
    if (el.dataset.len !== String(str.length)) {
      el.innerHTML = [...str].map((ch) => (/\d/.test(ch)
        ? `<span class="drum"><span class="drum__s">${[...'0123456789'].map((d) => `<span>${d}</span>`).join('')}</span></span>`
        : `<span class="drum-sep">${/\s/.test(ch) ? '' : ch}</span>`)).join('');
      el.dataset.len = str.length; void el.offsetWidth;
    }
    const cols = el.querySelectorAll('.drum__s'); let i = 0;
    for (const ch of str) if (/\d/.test(ch)) cols[i++].style.transform = `translateY(-${ch}em)`;
  }

  // ===== бус: белый фургон (силуэт по кадру фильма), кузов в разрезе, внутри коробки MELBUS =====
  const vanSVG = (p) => `<svg viewBox="70 40 940 430" aria-hidden="true"><defs>
  <linearGradient id="${p}g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFFFFF"/><stop offset=".5" stop-color="#F2F5F8"/><stop offset=".85" stop-color="#DCE2E8"/><stop offset="1" stop-color="#C7CFD7"/></linearGradient>
  <linearGradient id="${p}gl" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#5D7183"/><stop offset=".45" stop-color="#26323D"/><stop offset="1" stop-color="#0E1419"/></linearGradient>
  <radialGradient id="${p}t" cx=".5" cy=".5" r=".5"><stop offset=".55" stop-color="#2A333B"/><stop offset="1" stop-color="#0B0F13"/></radialGradient>
  <radialGradient id="${p}r" cx=".38" cy=".32" r=".8"><stop offset="0" stop-color="#FFFFFF"/><stop offset=".6" stop-color="#B9C2CB"/><stop offset="1" stop-color="#6F7B87"/></radialGradient>
  <radialGradient id="${p}s" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#000" stop-opacity=".55"/><stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient>
  <linearGradient id="${p}in" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#E9EDF1"/><stop offset=".25" stop-color="#FFFFFF"/></linearGradient>
  <clipPath id="${p}c"><path d="M126 118L634 108L638 322H124Z"/></clipPath></defs>
  <ellipse cx="540" cy="446" rx="470" ry="18" fill="url(#${p}s)"/>
  <g class="vbody">
    <path d="M118 378Q100 376 100 360L102 122Q104 96 130 93L640 82Q690 80 714 98L838 222Q846 230 860 234L936 257Q962 266 967 292L972 346Q972 372 950 376L914 378A62 62 0 0 0 790 378H324A62 62 0 0 0 200 378Z" fill="url(#${p}g)" stroke="#B9C2CB" stroke-width="1.5"/>
    <path d="M132 100L638 89" stroke="#FFFFFF" stroke-width="4" stroke-linecap="round" opacity=".9"/>
    <path d="M126 118L634 108L638 322H124Z" fill="url(#${p}in)"/>
    <g clip-path="url(#${p}c)"><g data-cells="${p}"></g></g>
    <path d="M126 118L634 108L638 322H124Z" fill="none" stroke="#AEB8C2" stroke-width="2"/>
    <path d="M652 92V334" stroke="#C3CCD5" stroke-width="2"/>
    <path d="M668 112L706 110Q714 110 720 116L812 236Q815 244 806 246H668Z" fill="url(#${p}gl)"/>
    <path d="M690 118H724L700 196H678Z" fill="#FFFFFF" opacity=".13"/>
    <path d="M716 100L842 226L834 231L709 106Z" fill="#1C252E" opacity=".85"/>
    <path d="M822 232h20q6 0 6 6v14q0 4-4 4h-20z" fill="#2A3138"/>
    <rect x="760" y="262" width="28" height="7" rx="3.5" fill="#AEB8C2"/>
    <image href="/brand/melbus-light.svg" x="672" y="280" width="128" height="27.8"/>
    <path d="M912 262L958 275Q967 279 963 288L924 291Q912 289 910 278Z" fill="#EEF3F7" stroke="#AEB8C2" stroke-width="1.5"/>
    <path d="M944 300H971V330H948Z" fill="#2A3138"/>
    <rect x="100" y="226" width="11" height="78" rx="3" fill="#B43A2E"/>
    <path d="M100 332H970V341H100Z" fill="#14DCD5"/>
    <path d="M100 341H971Q972 372 950 376L914 378A62 62 0 0 0 790 378H324A62 62 0 0 0 200 378H118Q100 376 100 360Z" fill="#2A3138"/>
    <path d="M196 380A66 66 0 0 1 328 380M786 380A66 66 0 0 1 918 380" fill="none" stroke="#12181E" stroke-width="8"/>
  </g>
  ${[262, 852].map((x) => `<g><circle cx="${x}" cy="390" r="54" fill="url(#${p}t)"/><circle cx="${x}" cy="390" r="31" fill="url(#${p}r)"/>${[0, 72, 144, 216, 288].map((a) => `<path d="M${x} 390L${(x + 27 * Math.cos((a - 90) * Math.PI / 180)).toFixed(1)} ${(390 + 27 * Math.sin((a - 90) * Math.PI / 180)).toFixed(1)}" stroke="#7D8995" stroke-width="7" stroke-linecap="round"/>`).join('')}<circle cx="${x}" cy="390" r="9" fill="#56626E"/></g>`).join('')}
</svg>`;
  $('vanA').innerHTML = vanSVG('mfva'); $('vanB').innerHTML = vanSVG('mfvb');
  for (const p of ['mfva', 'mfvb']) root.querySelector(`[data-cells="${p}"]`).innerHTML = Array.from({ length: CELLS }, (_, i) => {
    const col = 11 - Math.floor(i / 5), row = 4 - (i % 5);
    return `<image class="cell" href="/img/icons/box.webp" x="${(126 + col * 42.5 + 1).toFixed(1)}" y="${(116 + row * 41.2 + 0.6).toFixed(1)}" width="40.5" height="40.5"/>`;
  }).join('');
  const onCount = { mfva: 0, mfvb: 0 };
  let landDelay = 0;
  function setVan(p, n) {
    const cells = root.querySelectorAll(`[data-cells="${p}"] .cell`), from = onCount[p], step = reduce.matches ? 0 : 30;
    cells.forEach((c, i) => { const on = i < n; c.style.transitionDelay = (on && i >= from ? landDelay + (i - from) * step : 0) + 'ms'; c.classList.toggle('on', on); });
    onCount[p] = n;
  }
  function setFill(vol, buses) {
    const part = (v) => Math.min(CELLS, Math.max(1, Math.round(Math.min(1, v / CAP) * CELLS)));
    $('vans').classList.toggle('two', buses > 1);
    setVan('mfva', part(vol)); setVan('mfvb', buses > 1 ? part(vol - CAP) : 0);
    landDelay = 0;
  }
  const inView = (el) => { const r = el.getBoundingClientRect(); return r.width > 0 && r.bottom > 0 && r.top < innerHeight; };
  function fly(from) {
    if (reduce.matches || !from) return;
    const a = from.getBoundingClientRect ? from.getBoundingClientRect() : from;
    const box = $('vans').classList.contains('two') ? $('vanB') : $('vanA');
    const toVan = inView($('van')) && !$('van').hidden;
    const barOn = !$('bar').classList.contains('away') && getComputedStyle($('bar')).display !== 'none';
    const tgt = toVan ? box.querySelector('svg') : barOn ? $('barP') : null;
    if (!tgt) return;
    if (toVan) landDelay = 560;
    const b = tgt.getBoundingClientRect();
    const x0 = a.left + a.width / 2 - 15, y0 = a.top + a.height / 2 - 15, x1 = b.left + b.width * (toVan ? 0.36 : 0.55) - 15, y1 = b.top + b.height * (toVan ? 0.38 : 0.4) - 15;
    const el = document.createElement('div'); el.className = 'flybox'; el.innerHTML = '<img src="/img/icons/box.webp" alt="" width="30" height="30">'; root.append(el);
    const mx = (x0 + x1) / 2, my = Math.min(y0, y1) - 90;
    el.animate([
      { transform: `translate(${x0}px, ${y0}px) scale(1) rotate(0deg)`, opacity: 1 },
      { transform: `translate(${mx}px, ${my}px) scale(1.1) rotate(-14deg)`, opacity: 1, offset: 0.45 },
      { transform: `translate(${x1}px, ${y1}px) scale(.45) rotate(-24deg)`, opacity: 0.3 },
    ], { duration: 700, easing: 'cubic-bezier(.3,.6,.35,1)' }).onfinish = () => {
      el.remove();
      if (toVan) { box.classList.remove('bump'); void box.offsetWidth; box.classList.add('bump'); }
    };
  }

  // ===== шаг 1: уровни =====
  $('levels').innerHTML = LEVELS.map((x, i) => `<button type="button" class="lvl" role="radio" data-act="level" data-v="${x.id}">${ico(x.icon)}<span class="lvl__t">${I.levels[i].t}</span><span class="lvl__d">${I.levels[i].d}</span><span class="lvl__p" data-lp="${x.id}"></span></button>`).join('');

  // ===== шаг 2: адреса =====
  const segQ = (k, act, label, opts) => `<div class="q"><span>${label}</span><div class="seg" role="radiogroup" aria-label="${label}">${opts.map((o, i) => `<button type="button" role="radio" data-act="${act}" data-k="${k}" data-v="${i}">${o}</button>`).join('')}</div></div>`;
  $('ends').innerHTML = [['from', T.from, 'A'], ['to', T.to, 'B']].map(([k, tt, pin]) => `<div class="end"><p class="end__t"><span class="pin">${pin}</span>${tt}</p>
    <label class="addr"><span>${T.addr}</span><input data-addr="${k}" list="mf-places" autocomplete="off" placeholder="${esc(T.addrPh)}" value="${esc(S[k].place)}"></label><p class="addr__ok" data-ok="${k}"></p>
    <div class="row"><span>${T.floor} <small style="color:var(--muted)">${T.floor0}</small></span><div class="stepper"><button type="button" data-act="floor" data-k="${k}" data-d="-1" aria-label="${tt}: ${T.floorDown}">−</button><output data-fl="${k}"></output><button type="button" data-act="floor" data-k="${k}" data-d="1" aria-label="${tt}: ${T.floorUp}">+</button></div></div>
    <button type="button" class="sw" role="switch" data-act="lift" data-k="${k}" data-lift="${k}"><span class="sw__l">${T.lift}<small>${T.liftS}</small></span><span class="sw__k"></span></button>
    <details><summary>${T.park} <span data-sum="${k}"></span></summary>${segQ(k, 'door', T.door, T.doorO)}${segQ(k, 'house', T.house, T.houseO)}</details></div>`).join('');
  root.querySelectorAll('[data-addr]').forEach((inp) => inp.addEventListener('input', () => { S[inp.dataset.addr].place = inp.value.trim(); render(); }));

  // ===== шаг 3: вещи =====
  $('presets').insertAdjacentHTML('beforeend', Object.keys(PRESETS).map((k) => `<button type="button" class="chip" data-act="preset" data-v="${k}">${I.presets[k]}</button>`).join(''));
  function renderTabs() {
    $('tabs').hidden = !!S.q;
    $('tabs').innerHTML = ROOMS.map(([k], i) => {
      const n = k === 'pop' ? 0 : S.list.filter((e) => ITEM[e.id].room === k).reduce((a, e) => a + e.n, 0);
      return `<button type="button" class="tab" role="tab" aria-selected="${S.room === k}" data-act="room" data-v="${k}">${I.rooms[i][1]}${n ? `<small>${n}</small>` : ''}</button>`;
    }).join('');
  }
  const nameOf = (id) => I.items[id];
  function tileHTML(it) {
    const nm = esc(nameOf(it.id));
    return `<div class="tile" data-id="${it.id}">
      <button type="button" class="tile__main" data-act="tile" aria-label="${tr(T.addA, { x: nm })}">${pic(it.icon)}<span class="tile__n">${nm}</span><span class="tile__s"></span></button>
      <span class="tape-badge" hidden></span><span class="tile__plus" aria-hidden="true">+</span>
      <div class="tile__ctrl" hidden><button type="button" class="ib" data-act="tminus" aria-label="${tr(T.lessA, { x: nm })}">−</button><button type="button" class="ib" data-act="tile" aria-label="${tr(T.moreA, { x: nm })}">+</button>${it.p ? `<span class="tile__hint">${T.sizeHint}</span>` : ''}</div></div>`;
  }
  function gridItems() {
    const q = S.q.trim().toLowerCase();
    if (q) return ITEMS.filter((i) => (nameOf(i.id) + ' ' + i.alias).toLowerCase().includes(q));
    return S.room === 'pop' ? ITEMS.filter((i) => i.pop) : ITEMS.filter((i) => i.room === S.room);
  }
  function renderGrid() {
    const list = gridItems();
    $('grid').innerHTML = list.length ? list.map(tileHTML).join('') : `<p class="more">${esc(tr(T.notFound, { q: S.q }))}</p>`;
    list.forEach((i) => updTile(i.id));
  }
  function updTile(id) {
    const el = root.querySelector(`[data-el="grid"] .tile[data-id="${id}"], [data-el="extras"] .tile[data-id="${id}"]`);
    if (!el) return;
    const x = EXTRAS.find((e) => e.id === id), n = x ? S.extras[id] || 0 : countOf(id);
    el.classList.toggle('on', n > 0);
    const b = el.querySelector('.tape-badge');
    if (b.textContent !== String(n)) { b.textContent = n; if (n > 0) { b.hidden = true; void b.offsetWidth; } }
    b.hidden = n === 0;
    el.querySelector('.tile__ctrl').hidden = n === 0;
    if (!x) { const es = S.list.filter((e) => e.id === id); el.querySelector('.tile__s').textContent = !n ? '' : es.length > 1 ? T.several : summary(es[0], false); }
  }
  function renderBlist() {
    const n = totalItems();
    $('blistN').textContent = n ? pl(n, 'things') : T.empty;
    $('blistClear').hidden = !n;
    $('blist').innerHTML = S.list.length ? S.list.map((e) => {
      const it = ITEM[e.id], s = summary(e), nm = esc(nameOf(e.id));
      return `<li class="brow" data-u="${e.u}">${pic(it.iconFor({ ...it.def, ...e.sel }), 'pic pic--s')}
        <span class="brow__t"><b>${nm}</b>${s ? `<small>${esc(s)}</small>` : ''}</span>
        <span class="stepper stepper--s"><button type="button" data-act="lminus" aria-label="${T.less}: ${nm}">−</button><output>${e.n}</output><button type="button" data-act="lplus" aria-label="${T.more}: ${nm}">+</button></span>
        <button type="button" class="ib" data-act="ledit" aria-label="${tr(T.editA, { x: nm })}">${ico('tune')}</button></li>`;
    }).join('') : `<li class="more">${T.emptyHint}</li>`;
  }
  // ===== шаг 5: допы =====
  $('extras').innerHTML = EXTRAS.map((e) => { const x = I.extras[e.id]; return `<div class="tile tile--wide" data-id="${e.id}">
    <button type="button" class="tile__main" data-act="xinc" aria-label="${tr(T.addA, { x: esc(x.name) })}">${pic(e.icon)}<span class="tile__n">${x.name}</span><span class="tile__d">${x.d}</span><span class="tile__p">${zl(money(e.min))} ${x.unit || T.each}</span></button>
    <span class="tape-badge" hidden></span><span class="tile__plus" aria-hidden="true">+</span>
    <div class="tile__ctrl" hidden><button type="button" class="ib" data-act="xdec" aria-label="${tr(T.lessA, { x: esc(x.name) })}">−</button><button type="button" class="ib" data-act="xinc" aria-label="${tr(T.moreA, { x: esc(x.name) })}">+</button></div></div>`; }).join('');
  // ===== шаг 6: дата =====
  const wdF = new Intl.DateTimeFormat(LANG, { weekday: 'short' }), monF = new Intl.DateTimeFormat(LANG, { month: 'short' }), longF = new Intl.DateTimeFormat(LANG, { weekday: 'short', day: 'numeric', month: 'long' });
  function dayK(d, ahead) {
    const dd = d.getDate(), wd = d.getDay(), m = d.getMonth() + 1, last = new Date(d.getFullYear(), m, 0).getDate();
    if (dd >= last - 2 || dd <= 3 || (wd === 6 && m >= 5 && m <= 9)) return 0.1;
    if (wd >= 2 && wd <= 4 && dd >= 8 && dd <= 22) return -0.1;
    return ahead >= 14 ? -0.05 : 0;
  }
  (function renderDays() {
    const t0 = new Date(); t0.setHours(0, 0, 0, 0);
    let html = '', lastM = -1;
    for (let i = 1; i <= 42; i++) {
      const d = new Date(t0); d.setDate(t0.getDate() + i);
      const k = dayK(d, i), iso = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`, lbl = longF.format(d);
      if (d.getMonth() !== lastM) { html += `<span class="mon" aria-hidden="true">${monF.format(d)}</span>`; lastM = d.getMonth(); }
      const tag = k ? (k > 0 ? '+10 %' : k <= -0.1 ? '−10 %' : '−5 %') : '';
      html += `<button type="button" role="radio" class="day ${k < 0 ? 'g' : k > 0 ? 'p' : ''}" data-act="date" data-v="${iso}" data-k="${k}" data-l="${esc(lbl)}" aria-label="${esc(lbl)}${tag ? ', ' + tag : ''}"><span>${wdF.format(d)}</span><b>${d.getDate()}</b><small>${tag}</small></button>`;
    }
    $('days').innerHTML = html;
  })();

  // ===== окно вещи: размер, работы, количество; на кнопке — сколько это добавит к цене =====
  let draft = null, lastFocus = null, sheetFrom = null;
  const sheet = $('sheet');
  function openSheet(id, u) {
    const e = u ? S.list.find((x) => x.u === u) : null;
    draft = e ? { ...e, sel: { ...e.sel } } : { u: null, id, n: 1, sel: { ...ITEM[id].def }, cond: 'ok' };
    renderSheet(); sheet.showModal();
  }
  const withDraft = (d) => ({ ...S, list: d.u ? S.list.map((e) => (e.u === d.u ? d : e)) : [...S.list, d] });
  function deltaText() {
    const d = Math.round(((calc(withDraft(draft)).raw || 0) - (calc(S).raw || 0)) / 10) * 10;
    return (d >= 0 ? '+' : '−') + fmt(Math.abs(d)) + ' zł';
  }
  function sheetHTML() {
    const it = ITEM[draft.id], sel = { ...it.def, ...draft.sel }, sp = it.spec(sel), per = (m) => zl(money(m));
    let h = `<div class="sheet__h"><span data-sheet-pic>${pic(it.iconFor(sel))}</span><h3 id="mf-sheetT">${esc(nameOf(it.id))}</h3><button type="button" class="ib" data-act="close" aria-label="${T.close}">×</button></div>`;
    for (const k of it.p || []) {
      h += `<div class="q"><span>${I.params[k].label}</span><div class="pchips" role="radiogroup" aria-label="${I.params[k].label}">${P[k].opts.map((o, i) => `<button type="button" class="pchip" role="radio" aria-checked="${sel[k] === i}" data-act="psel" data-k="${k}" data-v="${i}">${o.ic ? pic(o.ic, 'pic pic--xs') : o.h ? `<span class="hb"><i style="height:${o.h * 100}%"></i></span>` : ''}<span>${I.params[k].opts[i]}</span></button>`).join('')}</div></div>`;
    }
    if (it.kind === 'ward') {
      const c = draft.cond || 'ok';
      const o = (v, b, s) => `<button type="button" class="opt" role="radio" aria-checked="${c === v}" data-act="cond" data-v="${v}"><b>${b}</b><span>${s}</span></button>`;
      h += `<details class="more-q"${c !== 'ok' ? ' open' : ''}><summary>${T.oldQ}</summary><p>${T.oldTxt}</p>
        <div class="opts" role="radiogroup" aria-label="${T.oldAria}">${o('ok', T.cOk, T.cOkS)}${o('whole', T.cWhole, T.cWholeS)}${o('fix', T.cFix, tr(T.cFixS, { p: per(60) }))}${o('drop', T.cDrop, tr(T.cDropS, { p: per(90) }))}</div></details>`;
    }
    if (sp.a > 0 && (it.kind !== 'ward' || (draft.cond || 'ok') === 'ok')) {
      h += `<div class="end"><button type="button" class="sw" role="switch" aria-checked="${asmOn(draft, S.level)}" data-act="asm"><span class="sw__l">${T.asm}<small>${tr(T.asmS, { p: per(sp.a), h: hrs(sp.a) })}</small></span><span class="sw__k"></span></button></div>`;
    }
    if (it.kind === 'tv') {
      h += `<p>${T.tvTxt}</p><div class="end"><button type="button" class="sw" role="switch" aria-checked="${!!S.extras.tvOff}" data-act="xsw" data-v="tvOff"><span class="sw__l">${T.tvOff}<small>${tr(T.perPc, { p: per(48) })}</small></span><span class="sw__k"></span></button>
        <button type="button" class="sw" role="switch" aria-checked="${!!S.extras.tvOn}" data-act="xsw" data-v="tvOn"><span class="sw__l">${T.tvOn}<small>${tr(T.tvOnS, { p: per(150) })}</small></span><span class="sw__k"></span></button></div>`;
    }
    if (it.kind === 'conn') {
      h += `<div class="end"><button type="button" class="sw" role="switch" aria-checked="${!!S.extras.conn}" data-act="xsw" data-v="conn"><span class="sw__l">${T.conn}<small>${tr(T.connS, { p: per(90) })}</small></span><span class="sw__k"></span></button></div>`;
    }
    h += `<div class="sheet__f"><div class="stepper"><button type="button" data-act="dn" data-d="-1" aria-label="${T.less}">−</button><output>${draft.n}</output><button type="button" data-act="dn" data-d="1" aria-label="${T.more}">+</button></div>
      <button type="button" class="mbtn mbtn--tape" data-act="save">${draft.u ? T.save : T.add} <span class="delta">${deltaText()}</span></button></div>`;
    if (draft.u) h += `<button type="button" class="linkbtn" data-act="del">${T.remove}</button>`;
    return h;
  }
  function renderSheet(f) {
    $('sheetBody').innerHTML = sheetHTML();
    if (f) ($('sheetBody').querySelector(`[data-act="${f.act}"]${f.v != null ? `[data-v="${f.v}"]` : ''}${f.k ? `[data-k="${f.k}"]` : ''}`) || $('sheetBody').querySelector('[data-act="save"]')).focus();
  }

  // ===== табло =====
  function lineText(x, r) {
    const X = x.x || {};
    switch (x.k) {
      case 'hourly': return [T.lHourly, tr(T.subHourly, { h: X.h, rate: HOURLY })];
      case 'km': return [T.lKm, Math.round(X.km) + ' ' + I.units.km + ' × ' + dec(KM_RATE) + ' zł'];
      case 'carry': return [T.lCarry, tr(T.subWork, { h: hrs(x.min) })];
      case 'road': return [T.lRoad, tr(T.subRoad, { km: Math.round(X.km), t: tdur(X.min), crew: X.crew })];
      case 'asm': return [T.lAsm, tr(T.subWork, { h: hrs(x.min) })];
      case 'pack': return [T.lPack, tr(T.subWork, { h: hrs(x.min) })];
      case 'packK': return [T.lPackK, tr(T.subWork, { h: hrs(x.min) })];
      case 'unpack': return [T.lUnpack, tr(T.subWork, { h: hrs(x.min) })];
      case 'mount': return [T.lMount, tr(T.subWork, { h: hrs(x.min) })];
      case 'junk': return [T.lJunk, tr(T.subWork, { h: hrs(x.min) })];
      case 'bus': return [T.lBus + (X.buses > 1 ? ' × ' + X.buses : ''), X.extraKm ? tr(T.subBusX, { free: KM_FREE, x: Math.round(X.extraKm), rate: dec(KM_RATE) }) : tr(T.subBusIn, { free: KM_FREE })];
      case 'mat': return [T.lMat, X.boxes ? tr(T.subMatBoxes, { n: X.boxes }) : T.subMatFilm];
      case 'date': return [T.lDate + (S.dateLabel ? ': ' + S.dateLabel : ''), X.dk > 0 ? T.subDatePeak : X.dk <= -0.1 ? T.subDateGreen : T.subDateEarly];
    }
    return ['', ''];
  }
  function renderBoard() {
    const video = S.mode === 'video' && S.level !== 1;
    const r = calc(S);
    if (video) {
      const xs = calc({ ...S, list: [], boxes: 0, kitchen: false, dateK: 0, from: { ...S.from, floor: 0, lift: true, door: 0, house: 0 }, to: { ...S.to, floor: 0, lift: true, door: 0, house: 0 } });
      const extra = xs.lines.filter((x) => ['mount', 'junk'].includes(x.k));
      const sum = extra.reduce((a, x) => a + x.sum, 0);
      $('bK').textContent = T.kVideo;
      drums($('bP'), Math.round(sum / 10) * 10); $('bPtext').textContent = sum ? zl(sum) : '';
      $('bFix').textContent = sum ? T.fixVideoX : T.fixVideo;
      $('van').hidden = true; $('facts').innerHTML = '';
      $('lines').innerHTML = extra.map((x) => `<li><span>${lineText(x, xs)[0]}</span><b>${zl(x.sum)}</b></li>`).join('');
      $('bNote').textContent = T.noteVideo;
      drums($('barP'), sum ? Math.round(sum / 10) * 10 : null); $('barM').textContent = T.barVideo;
      return r;
    }
    $('bK').textContent = r.hourly ? T.kHourly : T.kPrice;
    drums($('bP'), r.empty ? 0 : r.total); $('bPtext').textContent = r.empty ? '' : zl(r.total);
    $('bFix').textContent = r.hourly ? T.fixHourly : r.empty ? T.fixEmpty : T.fix;
    $('van').hidden = !!r.hourly || !!r.empty;
    if (!r.hourly && !r.empty) {
      setFill(r.vol, r.buses);
      $('vanCap').textContent = r.buses > 1 ? tr(T.vanMany, { n: pl(r.buses, 'buses'), m3: m3(r.vol) }) : tr(T.vanOne, { p: Math.round(Math.min(1, r.fill) * 100), m3: m3(r.vol) });
    }
    const crewWord = (n) => pl(n, 'people').replace(/^\d+ /, '');
    $('facts').innerHTML = r.empty ? '' : r.hourly
      ? `<li><b>1</b><span>${T.fDriver}</span></li><li><b>${Math.max(2, S.hours)} ${I.units.h}</b><span>${T.fWithVan}</span></li><li><b>${HOURLY}</b><span>${T.fPerHour}</span></li>`
      : `<li><b>${r.crew}</b><span>${crewWord(r.crew)}</span></li><li><b>≈${hrs(r.dur * 60)} ${I.units.h}</b><span>${T.fOnSite}</span></li><li><b>${hrs(r.peopleH * 60)}</b><span>${T.fPeopleH}</span></li>`;
    $('lines').innerHTML = r.lines.map((x) => { const [a, b] = lineText(x, r); return `<li class="${x.sum < 0 ? 'minus' : ''}"><span>${a}<small>${b}</small></span><b>${x.sum < 0 ? '−' + zl(-x.sum) : zl(x.sum)}</b></li>`; }).join('');
    $('bNote').textContent = r.hourly ? T.noteHourly : T.note1;
    drums($('barP'), r.empty ? null : r.total);
    $('barM').textContent = r.empty ? T.barList : r.hourly ? T.barHourly : `${pl(totalItems(), 'things')} · ${pl(r.crew, 'people')} · ≈${hrs(r.dur * 60)} ${I.units.h} · ${T.barFix}`;
    return r;
  }

  // ===== полоса шагов =====
  let curStep = 's-level';
  function renderProg() {
    const secs = [...root.querySelectorAll('section.step')].filter((s) => !s.hidden);
    const idx = Math.max(0, secs.findIndex((s) => s.id === curStep));
    $('progN').textContent = (idx + 1) + '/' + secs.length;
    $('progCur').textContent = secs[idx]?.dataset.short || '';
    $('progBar').style.setProperty('--p', ((idx + 1) / secs.length).toFixed(3));
    $('progList').innerHTML = secs.map((s, i) => `<li><button type="button" data-act="jump" data-v="${s.id}" class="${i < idx ? 'done' : ''}"${i === idx ? ' aria-current="step"' : ''}>${s.dataset.short}</button></li>`).join('');
  }
  const io = new IntersectionObserver((es) => { for (const e of es) if (e.isIntersecting) { curStep = e.target.id; renderProg(); } }, { rootMargin: '-35% 0px -60% 0px' });
  root.querySelectorAll('section.step').forEach((s) => io.observe(s));

  // ===== общая отрисовка =====
  let last = null;
  function render(full) {
    root.querySelectorAll('[data-mode]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.mode === S.mode)));
    root.querySelectorAll('[data-act="level"]').forEach((b) => b.setAttribute('aria-checked', String(+b.dataset.v === S.level)));
    for (const x of LEVELS) {
      const el = root.querySelector(`[data-lp="${x.id}"]`);
      if (x.id === 1) { el.textContent = tr(T.perHour, { n: HOURLY }); continue; }
      const r = calc(S, x.id);
      el.textContent = S.mode === 'video' ? T.byVideo : r.empty ? T.byList : tr(T.forList, { n: fmt(r.total) });
    }
    for (const k of ['from', 'to']) {
      root.querySelector(`[data-fl="${k}"]`).textContent = S[k].floor;
      root.querySelector(`[data-lift="${k}"]`).setAttribute('aria-checked', String(S[k].lift));
      const ok = root.querySelector(`[data-ok="${k}"]`), p = PLACE[S[k].place];
      ok.classList.toggle('bad', !p);
      ok.textContent = p ? T.addrOk : S[k].place ? T.addrBad : '';
      root.querySelector(`[data-sum="${k}"]`).textContent = T.doorO[S[k].door].toLowerCase() + ' · ' + T.houseO[S[k].house].toLowerCase();
    }
    for (const a of ['door', 'house']) root.querySelectorAll(`[data-act="${a}"]`).forEach((b) => b.setAttribute('aria-checked', String(+b.dataset.v === (S[b.dataset.k][a] || 0))));
    const rt = route(S);
    $('route').innerHTML = rt ? `<div class="route__line"><span class="pin">A</span><span class="route__bar"></span><span class="pin">B</span></div>
      <p class="route__main">${tr(T.routeMain, { km: Math.round(rt.ab), t: tdur(rt.min) })}</p>
      <p class="route__sub">${rt.extraKm ? tr(T.routeExtra, { free: KM_FREE, x: Math.round(rt.extraKm), rate: dec(KM_RATE), sum: fmt(Math.round(rt.extraKm * KM_RATE / 10) * 10) }) : tr(T.routeIn, { free: KM_FREE })}</p>`
      : `<p class="route__sub">${T.routeNone}</p>`;
    const l1 = S.level === 1, video = S.mode === 'video';
    $('mode2').hidden = l1;
    $('itemsHours').hidden = !l1;
    $('itemsList').hidden = l1 || video;
    $('itemsVideo').hidden = l1 || !video;
    $('hItems').textContent = l1 ? T.hHours : video ? T.hVideo : T.hItems;
    $('subItems').textContent = l1 ? T.subHours : video ? T.subVideo : T.subItems;
    $('hoursN').textContent = S.hours;
    root.querySelector('#s-boxes').hidden = l1 || video;
    root.querySelector('#s-extra').hidden = l1;
    $('subBoxes').textContent = S.level === 3 ? T.subBoxes3 : T.subBoxes2;
    const swi = (a, on, show = true) => { const b = root.querySelector(`[data-act="${a}"].sw`); b.hidden = !show; b.setAttribute('aria-checked', String(on)); };
    swi('kitchen', S.kitchen, S.level === 2); swi('ahead', S.ahead, S.level === 2); swi('unpack', S.unpack);
    $('kitchenS').textContent = tr(T.kitchenS, { n: fmt(Math.round((money(100) + 10 * BOX_MAT) / 10) * 10) });
    $('aheadS').textContent = tr(T.aheadS, { n: BOX_MAT });
    $('unpackS').textContent = tr(T.unpackS, { n: fmt(money(9)) });
    $('boxN').textContent = S.boxes; $('boxR').value = S.boxes;
    $('boxVol').textContent = m3(S.boxes * 0.1);
    $('bx').innerHTML = MINI.repeat(Math.ceil(S.boxes / 5));
    root.querySelectorAll('[data-act="preset"]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.v === S.preset)));
    root.querySelectorAll('.day').forEach((b) => b.setAttribute('aria-checked', String(b.dataset.v === S.date)));
    if (full) { renderTabs(); renderGrid(); } else { renderTabs(); ITEMS.forEach((i) => updTile(i.id)); }
    EXTRAS.forEach((e) => updTile(e.id));
    renderBlist();
    last = renderBoard();
    renderProg();
    if (draft && sheet.open) renderSheet(lastFocus);
  }

  // ===== события =====
  function addSimple(id, from) {
    const e = S.list.find((x) => x.id === id && !ITEM[id].p);
    if (e) e.n++; else S.list.push({ u: ++uid, id, n: 1, sel: { ...ITEM[id].def }, cond: 'ok' });
    S.preset = ''; fly(from);
  }
  function removeLast(id) {
    const es = S.list.filter((e) => e.id === id), e = es[es.length - 1];
    if (!e) return;
    e.n--; if (e.n <= 0) S.list = S.list.filter((x) => x !== e);
    S.preset = '';
  }
  const go = (el, block = 'start') => el.scrollIntoView({ behavior: smooth(), block });
  root.addEventListener('click', (ev) => {
    const b = ev.target.closest('[data-act], [data-mode]');
    if (!b || !root.contains(b)) return;
    if (b.dataset.mode) { S.mode = b.dataset.mode; render(); if (b.closest('.hero')) go(root.querySelector('#s-items')); return; }
    const a = b.dataset.act, v = b.dataset.v, inSheet = !!b.closest('dialog');
    const tile = b.closest('.tile'), id = tile?.dataset.id, row = b.closest('.brow'), e = row ? S.list.find((x) => x.u === +row.dataset.u) : null;
    lastFocus = inSheet ? { act: a, v, k: b.dataset.k } : null;
    switch (a) {
      case 'level': S.level = +v; S.list.forEach((x) => delete x.asm); break;
      case 'floor': S[b.dataset.k].floor = Math.max(0, Math.min(20, S[b.dataset.k].floor + +b.dataset.d)); break;
      case 'lift': S[b.dataset.k].lift = !S[b.dataset.k].lift; break;
      case 'door': case 'house': S[b.dataset.k][a] = +v; break;
      case 'hours': S.hours = Math.max(2, Math.min(12, S.hours + +b.dataset.d)); break;
      case 'preset': applyPreset(v); render(true); return;
      case 'room': S.room = v; render(true); root.querySelector(`.tab[data-v="${v}"]`)?.focus(); return;
      case 'tile': if (ITEM[id].p) { sheetFrom = tile.querySelector('.pic'); openSheet(id); return; } addSimple(id, tile.querySelector('.pic')); break;
      case 'tminus': removeLast(id); break;
      case 'xinc': S.extras[id] = (S.extras[id] || 0) + 1; break;
      case 'xdec': S.extras[id] = Math.max(0, (S.extras[id] || 0) - 1); break;
      case 'lplus': e.n++; S.preset = ''; break;
      case 'lminus': e.n--; if (e.n <= 0) S.list = S.list.filter((x) => x !== e); S.preset = ''; break;
      case 'ledit': sheetFrom = null; openSheet(e.id, e.u); return;
      case 'lclear': S.list = []; S.preset = 'empty'; break;
      case 'close': sheet.close(); return;
      case 'psel': draft.sel[b.dataset.k] = +v; renderSheet(lastFocus); return;
      case 'cond': draft.cond = v; renderSheet(lastFocus); return;
      case 'asm': draft.asm = !asmOn(draft, S.level); renderSheet(lastFocus); return;
      case 'dn': draft.n = Math.max(1, Math.min(20, draft.n + +b.dataset.d)); renderSheet(lastFocus); return;
      case 'xsw': { const n = v === 'conn' ? countOf('washer') + countOf('dishw') || 1 : countOf('tv') || draft.n; S.extras[v] = S.extras[v] ? 0 : Math.max(1, n); break; }
      case 'save': {
        const r = root.querySelector('[data-sheet-pic]').getBoundingClientRect(), isNew = !draft.u;
        if (isNew) { draft.u = ++uid; S.list.push(draft); } else S.list = S.list.map((x) => (x.u === draft.u ? draft : x));
        S.preset = ''; draft = null; sheet.close();
        if (isNew) fly(sheetFrom && inView(sheetFrom) ? sheetFrom : r);
        break;
      }
      case 'del': S.list = S.list.filter((x) => x.u !== draft.u); draft = null; sheet.close(); break;
      case 'kitchen': case 'ahead': case 'unpack': S[a] = !S[a]; break;
      case 'box': S.boxes = Math.max(0, Math.min(150, S.boxes + +b.dataset.d)); break;
      case 'date': if (S.date === v) { S.date = ''; S.dateK = 0; S.dateLabel = ''; } else { S.date = v; S.dateK = +b.dataset.k; S.dateLabel = b.dataset.l; } break;
      case 'jump': go(root.querySelector('#' + v)); return;
      case 'go-send': go(root.querySelector('#s-send')); root.querySelector('[name="phone"]').focus({ preventScroll: true }); return;
      case 'to-board': go($('board')); return;
      default: return;
    }
    render();
  });
  $('q').addEventListener('input', (ev) => { S.q = ev.target.value; renderTabs(); renderGrid(); });
  $('boxR').addEventListener('input', (ev) => { S.boxes = +ev.target.value; render(); });
  sheet.addEventListener('close', () => { draft = null; render(); });
  sheet.addEventListener('click', (ev) => { if (ev.target === sheet) sheet.close(); });
  const mb = (n) => (n >= 1024 ** 3 ? `${dec(n / 1024 ** 3)} GB` : `${Math.max(1, Math.round(n / 1024 ** 2))} MB`);
  $('vfile').addEventListener('change', (ev) => { $('vlist').innerHTML = [...ev.target.files].map((f) => `<li><span>${esc(f.name)}</span><span>${mb(f.size)}</span></li>`).join(''); });
  // нижняя панель с ценой: не видна на первом экране и когда табло и так на экране
  const away = { hero: true, board: false, foot: false };
  const syncBar = () => $('bar').classList.toggle('away', away.hero || away.board || away.foot);
  const foot = document.querySelector('footer');
  if (foot) new IntersectionObserver(([en]) => { away.foot = en.isIntersecting; syncBar(); }).observe(foot);
  new IntersectionObserver(([en]) => { away.board = en.isIntersecting; syncBar(); }, { threshold: 0.25 }).observe($('board'));
  const hero = root.querySelector('.hero');
  if (hero) new IntersectionObserver(([en]) => { away.hero = en.isIntersecting; syncBar(); }, { rootMargin: '0px 0px -45% 0px' }).observe(hero);
  syncBar();

  // ===== отправка заявки: тот же /api/quote, что и форма заявки; видео — кусками в R2 =====
  const form = $('sendForm'), err = $('err'), btn = $('sendBtn');
  const showErr = (m) => { err.textContent = m; err.hidden = !m; };
  form.addEventListener('submit', async (ev) => {
    ev.preventDefault();
    const fd = new FormData(form), phone = String(fd.get('phone') || '');
    if ((phone.match(/\d/g) || []).length < 7) { showErr(T.errPhone); form.querySelector('[name="phone"]').focus(); return; }
    showErr(''); btn.disabled = true; btn.textContent = T.sending;
    const videos = [], skipped = [];
    if (S.mode === 'video') {
      const files = [...($('vfile').files || [])];
      for (const f of files) {
        const up = await uploadVideo(f, (x) => { btn.textContent = tr(T.uploading, { p: Math.round(x * 100) }); });
        if (up) videos.push(up); else skipped.push({ name: f.name, size: f.size });
      }
      btn.textContent = T.sending;
    }
    const r = calc(S);
    const end = (k) => ({ addr: S[k].place, floor: String(S[k].floor), lift: S[k].lift ? 1 : 0, dist: '' });
    const payload = {
      lang: LANG, est: S.mode === 'video' && S.level !== 1 ? undefined : r.total, from: end('from'), to: end('to'), date: S.date,
      name: String(fd.get('name') || ''), phone, channel: Number(fd.get('channel') || 0), comment: String(fd.get('comment') || ''), hp: String(fd.get('website') || ''), t: T0,
      videos, skipped,
      // цену сервер пересчитает сам по этому списку (server/move.ts)
      move: { mode: S.mode, level: S.level, hours: S.hours, boxes: S.boxes, unpack: S.unpack, ahead: S.ahead, kitchen: S.kitchen, extras: S.extras, dateK: S.dateK,
        from: { ...S.from }, to: { ...S.to },
        list: S.list.map((e) => ({ id: e.id, n: e.n, sel: e.sel, asm: e.asm, cond: e.cond })) },
    };
    try {
      const res = await fetch('/api/quote', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(payload) });
      const j = await res.json().catch(() => ({}));
      if (!res.ok || !j.ok) throw new Error(j.error || 'send');
      $('sent').textContent = tr(T.sent, { id: j.id }); $('sent').hidden = false; btn.hidden = true;
    } catch (e2) {
      showErr(e2.message === 'phone' ? T.errPhone : T.errSend); btn.disabled = false; btn.textContent = T.send;
    }
  });

  render(true);
}
