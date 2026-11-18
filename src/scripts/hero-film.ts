// @ts-nocheck — DOM/canvas-движок первого экрана; данные приходят атрибутами из HeroFilm.astro
/**
 * ПЕРВЫЙ ЭКРАН «КИНО» (18.11.2026, выбор владельца: эффекты 1 + 2 + 6).
 * Слово-окно MELBUS → прокрутка «влетает» в ножку M → фильм 10 с под прокрутку → заголовок и кнопки.
 * Всё на ОДНОМ canvas: кадр, кино-обработка (затемнение + виньетка) и слово с вырезанными буквами — без огромных
 * DOM-слоёв, mix-blend и CSS-фильтров на весь экран, поэтому плавно и на телефоне.
 * Кадры: /scenes/hero/{d,m}/NNNN.avif (1080p и вертикальная вырезка 608×1080 из исходника 1080p), запасной .webp,
 * если браузер не умеет AVIF. Порядок загрузки: первый → каждый 8-й → ближайшие к месту прокрутки; каждый кадр
 * декодируется заранее. Соседние кадры не смешиваем (в быстрых сценах это давало «двоение»).
 * Сборка кадров — prototypes/hero-proto/README.md.
 */
const AVIF_TEST = 'data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAAB0AAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAIAAAACAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgQ0MAAAAABNjb2xybmNseAACAAIAAYAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAACVtZGF0EgAKCBgANogQEAwgMg8f8D///8WfhwB8+ErK42A=';
let avif: Promise<boolean> | null = null;
const avifOk = () => (avif ||= new Promise((r) => { const i = new Image(); i.onload = () => r(i.width > 0); i.onerror = () => r(false); i.src = AVIF_TEST; }));

export function heroFilm(sec, local) {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const touch = matchMedia('(pointer: coarse)').matches;
  const dark = sec.dataset.tone !== 'light';
  const base = sec.dataset.base, N = +sec.dataset.n;
  const stage = sec.querySelector('[data-hf-stage]'), canvas = sec.querySelector('canvas'), g = canvas.getContext('2d', { alpha: false });
  const caps = [...sec.querySelectorAll('[data-hf-cap]')], outro = sec.querySelector('[data-hf-outro]');
  const intro = sec.querySelector('[data-hf-intro]'), bar = sec.querySelector('[data-hf-bar]');
  const INTRO = 0.17, OUTRO = 0.9, MASK = dark ? '#0B1015' : '#F4F6F8';
  const isMobile = () => matchMedia('(max-aspect-ratio: 3/4), (max-width: 700px)').matches;
  let alive = true;
  local.push(() => { alive = false; });

  if (reduce) { sec.classList.add('is-static'); outro?.classList.add('on'); return; }   // без движения: постер и заголовок

  // ---- кадры ----
  let set = '', ext = 'webp', frames = [], ready = [], loaded = 0, coarseDone = false, active = 0, want = 0;
  const coarse = (() => { const o = [0]; for (let i = 8; i < N; i += 8) o.push(i); o.push(N - 1); return o; })();
  const requested = new Set();
  const pick = () => {
    for (const i of coarse) if (!requested.has(i)) return i;
    coarseDone = true;
    for (let d = 0; d < N; d++) {                      // ближайшие к месту прокрутки, сначала вперёд
      const a = want + d, b = want - d;
      if (a < N && !requested.has(a)) return a;
      if (b >= 0 && !requested.has(b)) return b;
    }
    return -1;
  };
  const pump = () => {
    while (alive && active < 6) {
      const i = pick(); if (i < 0) return;
      requested.add(i); active++;
      const s = set, im = new Image();
      im.src = `${base}/${s}/${String(i + 1).padStart(4, '0')}.${ext}`;
      (im.decode ? im.decode() : new Promise((r, j) => { im.onload = r; im.onerror = j; }))
        .then(() => { if (s === set) { frames[i] = im; ready[i] = true; loaded++; dirty = true; } }, () => {})
        .finally(() => { active--; pump(); });
    }
  };
  const load = async () => {
    const s = isMobile() ? 'm' : 'd';
    if (s === set) return;
    set = s; ext = (await avifOk()) ? 'avif' : 'webp';
    frames = new Array(N); ready = new Array(N).fill(false); requested.clear(); loaded = 0; coarseDone = false;
    pump();
  };
  const nearest = (i) => { if (ready[i]) return i; for (let d = 1; d < N; d++) { if (i - d >= 0 && ready[i - d]) return i - d; if (i + d < N && ready[i + d]) return i + d; } return -1; };

  // ---- холст ----
  let W = 0, H = 0, dirty = true;
  const size = (force) => {
    const d = Math.min(2, devicePixelRatio || 1), w = Math.round(stage.clientWidth * d), h = Math.round(stage.clientHeight * d);
    if (!force && Math.abs(w - W) < 2 && Math.abs(h - H) < 160 * d) return;   // адресная строка телефона — не пересоздаём
    W = canvas.width = w; H = canvas.height = h; g.imageSmoothingQuality = 'high'; dirty = true; buildMask();
  };

  // ---- слово-окно ----
  const mc = document.createElement('canvas'), mg = mc.getContext('2d');
  let ox = 0, oy = 0, fontOk = false;
  const buildMask = () => {
    if (!W) return;
    mc.width = W; mc.height = H;
    mg.fillStyle = MASK; mg.fillRect(0, 0, W, H);
    const text = 'MELBUS';
    const setFont = (f) => { mg.font = `900 ${f}px "Unbounded Variable", Unbounded, "Arial Black", sans-serif`; if ('letterSpacing' in mg) mg.letterSpacing = `${-0.06 * f}px`; };
    let fs = H * 0.4; setFont(fs);
    fs *= Math.min(1, (W * 0.9) / mg.measureText(text).width); setFont(fs);
    const tw = mg.measureText(text).width, x = (W - tw) / 2, y = H * 0.5 + fs * 0.36;
    mg.globalCompositeOperation = 'destination-out'; mg.fillText(text, x, y); mg.globalCompositeOperation = 'source-over';
    const mw = mg.measureText('M').width; ox = x + mw * 0.1; oy = y - fs * 0.38;
  };
  (document.fonts?.load('900 100px "Unbounded Variable"') || Promise.resolve()).then(() => { fontOk = true; buildMask(); dirty = true; });

  // ---- кино-обработка на холсте ----
  let vig = null;
  const grade = () => {
    if (!dark) return;
    g.fillStyle = 'rgba(6,9,12,.14)'; g.fillRect(0, 0, W, H);
    if (!vig || vig.w !== W || vig.h !== H) { const r = g.createRadialGradient(W / 2, H * 0.52, Math.min(W, H) * 0.25, W / 2, H * 0.52, Math.max(W, H) * 0.75); r.addColorStop(0, 'rgba(0,0,0,0)'); r.addColorStop(1, 'rgba(0,0,0,.55)'); vig = { r, w: W, h: H }; }
    g.fillStyle = vig.r; g.fillRect(0, 0, W, H);
  };
  const cover = (im, a) => {
    const s = Math.max(W / im.naturalWidth, H / im.naturalHeight), w = im.naturalWidth * s, h = im.naturalHeight * s;
    g.globalAlpha = a; g.drawImage(im, (W - w) / 2, (H - h) / 2, w, h); g.globalAlpha = 1;
  };
  let lastKey = '';
  const render = (fp, k) => {
    // без смешивания соседних кадров: при 24 к/с шаг мелкий, а смешивание в быстрых сценах даёт «двоение»
    const i = Math.min(N - 1, Math.round(fp * (N - 1)));
    want = i;
    const a = nearest(i); if (a < 0) return;
    const key = `${a}:${k.toFixed(4)}:${W}:${fontOk}`;
    if (key === lastKey && !dirty) return;
    lastKey = key; dirty = false;
    g.setTransform(1, 0, 0, 1, 0, 0);
    const kb = 1.07 - 0.07 * Math.min(1, k);
    g.save(); g.translate(W / 2, H / 2); g.scale(kb, kb); g.translate(-W / 2, -H / 2);
    cover(frames[a], 1);
    g.restore();
    grade();
    if (k < 0.999) {
      if (fontOk) { const s = 1 + Math.pow(k, 2.3) * 110; g.setTransform(s, 0, 0, s, ox * (1 - s), oy * (1 - s)); g.drawImage(mc, 0, 0); g.setTransform(1, 0, 0, 1, 0, 0); }
      else { g.fillStyle = MASK; g.globalAlpha = Math.max(0, 1 - k * 2); g.fillRect(0, 0, W, H); g.globalAlpha = 1; }
    }
    if (!sec.classList.contains('is-live')) sec.classList.add('is-live');   // постер прячем, как только нарисован первый кадр
  };

  load(); size(true);
  const onResize = () => { load(); size(false); };
  const onOrient = () => setTimeout(() => size(true), 250);
  addEventListener('resize', onResize); addEventListener('orientationchange', onOrient);
  local.push(() => { removeEventListener('resize', onResize); removeEventListener('orientationchange', onOrient); });

  let cur = 0, prevCaps = '', raf = 0;
  const clamp = (x) => Math.max(0, Math.min(1, x));
  const tick = () => {
    if (!alive) return;
    const r = sec.getBoundingClientRect(), total = sec.offsetHeight - stage.clientHeight;
    const target = clamp(-r.top / total);
    cur += (target - cur) * (touch ? 0.22 : 0.14);
    if (Math.abs(target - cur) < 0.0003) cur = target;
    const p = cur, k = clamp(p / INTRO), fp = clamp((p - INTRO * 0.55) / (OUTRO - INTRO * 0.55));
    if (r.bottom > 0 && r.top < innerHeight) {         // рисуем, только пока первый экран виден
      render(fp, k);
      if (intro) intro.style.opacity = String(1 - clamp(p / 0.045));
      const capsKey = caps.map((c) => +(fp >= +c.dataset.from && fp < +c.dataset.to && p < OUTRO - 0.005)).join('') + (p >= OUTRO - 0.005 ? 'o' : '');
      if (capsKey !== prevCaps) { prevCaps = capsKey; caps.forEach((c, j) => c.classList.toggle('on', capsKey[j] === '1')); outro?.classList.toggle('on', capsKey.endsWith('o')); }
      stage.style.setProperty('--dim', (clamp((p - OUTRO + 0.02) / 0.1) * (dark ? 0.5 : 0.42)).toFixed(3));
      if (bar) bar.style.transform = `scaleX(${p.toFixed(4)})`;
    }
    raf = requestAnimationFrame(tick);
  };
  raf = requestAnimationFrame(tick);
  local.push(() => cancelAnimationFrame(raf));
}
