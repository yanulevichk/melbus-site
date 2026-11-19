/*
 * Первый экран MELBUS (прототип v2, 18.11.2026): всё рисуется на ОДНОМ canvas — кадр фильма, кино-обработка и
 * слово-окно MELBUS (буквы вырезаны в заливке). Никаких огромных DOM-слоёв с mix-blend и CSS-фильтров на весь экран —
 * поэтому плавно и на телефоне. Кадры: сначала первый, потом каждый 8-й (грубо по всей длине), потом остальные;
 * каждый кадр заранее декодируется (img.decode), чтобы при прокрутке не было подтормаживаний.
 */
(() => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const touch = matchMedia('(pointer: coarse)').matches;

  // плавная прокрутка колесом мыши (на сенсорных экранах — родная прокрутка)
  if (window.Lenis && !reduce && !touch) {
    const lenis = new window.Lenis({ lerp: 0.1, wheelMultiplier: 0.9 });
    const raf = (t) => { lenis.raf(t); requestAnimationFrame(raf); };
    requestAnimationFrame(raf);
  }

  // ===== вариант «Ночь»: фильм по кругу, слова по очереди =====
  const noir = document.querySelector('[data-noir]');
  if (noir) {
    const words = [...noir.querySelectorAll('.words b')];
    let i = -1;
    const next = () => { i = (i + 1) % words.length; words.forEach((w, j) => w.classList.toggle('on', j === i)); };
    next(); if (!reduce) setInterval(next, 2600);
    const v = noir.querySelector('video');
    const pick = () => { const m = matchMedia('(max-aspect-ratio: 3/4), (max-width: 700px)').matches; const src = m ? v.dataset.m : v.dataset.d; if (!v.currentSrc.endsWith(src)) { v.src = src; v.play().catch(() => {}); } };
    pick(); addEventListener('resize', pick);
    return;
  }

  const hero = document.querySelector('[data-hero]');
  if (!hero) return;
  const dark = document.body.classList.contains('tone-dark');
  const stage = hero.querySelector('.stage'), canvas = hero.querySelector('canvas'), g = canvas.getContext('2d', { alpha: false });
  const caps = [...hero.querySelectorAll('[data-cap]')], outro = hero.querySelector('[data-outro]');
  const intro = hero.querySelector('[data-intro]'), bar = hero.querySelector('[data-bar]');
  const N = 442, INTRO = 0.17, OUTRO = 0.9;   // 19.11.2026: 442 настоящих кадра (tools/film/hero-frames.json)
  const CUTS = new Set([170, 336, 366]);                 // склейки фильма: здесь соседние кадры не смешиваем (иначе «двоение»)
  const MASK = dark ? '#0B1015' : '#F4F6F8';
  const isMobile = () => matchMedia('(max-aspect-ratio: 3/4), (max-width: 700px)').matches;

  // ---- кадры: порядок загрузки — 1-й, каждый 8-й, остальные; декодируем заранее ----
  let set = '', frames = [], ready = [];
  const order = (() => { const o = [0]; for (let i = 8; i < N; i += 8) o.push(i); for (let i = 1; i < N; i++) if (!o.includes(i)) o.push(i); return o; })();
  const load = () => {
    const s = isMobile() ? 'm' : 'd';
    if (s === set) return; set = s;
    frames = new Array(N); ready = new Array(N).fill(false);
    let k = 0, active = 0;
    const pump = () => {
      while (active < 6 && k < order.length) {
        const i = order[k++], im = new Image(); active++;
        im.src = `/scenes/hero/${s}/${String(i + 1).padStart(4, "0")}.webp`;
        (im.decode ? im.decode() : new Promise((r) => { im.onload = r; })).then(() => { if (set === s) { frames[i] = im; ready[i] = true; dirty = true; } }, () => {}).finally(() => { active--; pump(); });
      }
    };
    pump();
  };
  const nearest = (i) => { if (ready[i]) return i; for (let d = 1; d < N; d++) { if (i - d >= 0 && ready[i - d]) return i - d; if (i + d < N && ready[i + d]) return i + d; } return -1; };

  // ---- размеры холста: при скрытии адресной строки телефона не пересоздаём (только при заметной смене) ----
  let W = 0, H = 0, dirty = true;
  const size = (force) => {
    const d = Math.min(2, devicePixelRatio || 1), w = Math.round(stage.clientWidth * d), h = Math.round(stage.clientHeight * d);
    if (!force && Math.abs(w - W) < 2 && Math.abs(h - H) < 160 * d) return;
    W = canvas.width = w; H = canvas.height = h; dirty = true; buildMask();
  };

  // ---- слово-окно: заливка с вырезанными буквами MELBUS, рисуется в отдельный холст один раз ----
  const mc = document.createElement('canvas'), mg = mc.getContext('2d');
  let ox = 0, oy = 0, fontOk = false;
  const buildMask = () => {
    mc.width = W; mc.height = H;
    mg.fillStyle = MASK; mg.fillRect(0, 0, W, H);
    const text = 'MELBUS';
    const setFont = (f) => { mg.font = `900 ${f}px Unbounded, "Arial Black", sans-serif`; if ('letterSpacing' in mg) mg.letterSpacing = `${-0.06 * f}px`; };
    let fs = H * 0.4; setFont(fs);
    fs *= Math.min(1, (W * 0.9) / mg.measureText(text).width); setFont(fs);   // слово во всю ширину, с полями
    const tw = mg.measureText(text).width, x = (W - tw) / 2, y = H * 0.5 + fs * 0.36;
    mg.globalCompositeOperation = 'destination-out'; mg.fillText(text, x, y); mg.globalCompositeOperation = 'source-over';
    // точка «влёта» — внутри левой ножки буквы M
    const mw = mg.measureText('M').width; ox = x + mw * 0.1; oy = y - fs * 0.38;
  };
  document.fonts?.load('900 100px Unbounded').then(() => { fontOk = true; buildMask(); dirty = true; });

  // ---- кино-обработка прямо на холсте: лёгкое затемнение и виньетка (дешевле CSS-фильтров) ----
  let vig = null;
  const grade = () => {
    if (!dark) return;
    g.fillStyle = 'rgba(6,9,12,.16)'; g.fillRect(0, 0, W, H);
    if (!vig || vig.w !== W || vig.h !== H) { const r = g.createRadialGradient(W / 2, H * 0.52, Math.min(W, H) * 0.25, W / 2, H * 0.52, Math.max(W, H) * 0.75); r.addColorStop(0, 'rgba(0,0,0,0)'); r.addColorStop(1, 'rgba(0,0,0,.58)'); vig = { r, w: W, h: H }; }
    g.fillStyle = vig.r; g.fillRect(0, 0, W, H);
  };
  const cover = (im, a) => {
    const s = Math.max(W / im.naturalWidth, H / im.naturalHeight), w = im.naturalWidth * s, h = im.naturalHeight * s;
    g.globalAlpha = a; g.drawImage(im, (W - w) / 2, (H - h) / 2, w, h); g.globalAlpha = 1;
  };

  let lastKey = '';
  const render = (fp, k) => {
    const f = fp * (N - 1), i = Math.floor(f), fr = f - i;
    const a = nearest(i); if (a < 0) return;
    const key = `${a}:${i}:${fr.toFixed(3)}:${k.toFixed(4)}:${W}`;
    if (key === lastKey && !dirty) return;
    lastKey = key; dirty = false;
    g.setTransform(1, 0, 0, 1, 0, 0);
    const kb = 1.07 - 0.07 * Math.min(1, k);               // лёгкий «наезд» камеры во время влёта
    g.save(); g.translate(W / 2, H / 2); g.scale(kb, kb); g.translate(-W / 2, -H / 2);
    cover(frames[a], 1);
    if (a === i && fr > 0.02 && !CUTS.has(i) && ready[i + 1]) cover(frames[i + 1], fr);   // мягкий переход между соседними кадрами (24 к/с)
    g.restore();
    grade();
    if (k < 0.999 && fontOk) {                              // слово-окно: увеличиваем от ножки M
      const s = 1 + Math.pow(k, 2.3) * 110;
      g.setTransform(s, 0, 0, s, ox * (1 - s), oy * (1 - s));
      g.drawImage(mc, 0, 0);
      g.setTransform(1, 0, 0, 1, 0, 0);
    } else if (!fontOk && k < 0.5) { g.fillStyle = MASK; g.globalAlpha = 1 - k * 2; g.fillRect(0, 0, W, H); g.globalAlpha = 1; }
  };

  load(); size(true);
  addEventListener('resize', () => { load(); size(false); });
  addEventListener('orientationchange', () => setTimeout(() => size(true), 250));

  let cur = 0, prevCaps = '';
  const clamp = (x) => Math.max(0, Math.min(1, x));
  const tick = () => {
    const r = hero.getBoundingClientRect(), total = hero.offsetHeight - stage.clientHeight;
    const target = clamp(-r.top / total);
    cur += (target - cur) * (reduce ? 1 : touch ? 0.22 : 0.14);
    if (Math.abs(target - cur) < 0.0003) cur = target;
    const p = cur, k = clamp(p / INTRO);
    const fp = clamp((p - INTRO * 0.55) / (OUTRO - INTRO * 0.55));
    render(fp, k);
    if (intro) intro.style.opacity = String(1 - clamp(p / 0.045));
    const capsKey = caps.map((c) => +(fp >= +c.dataset.from && fp < +c.dataset.to && p < OUTRO - 0.005)).join('') + (p >= OUTRO - 0.005 ? 'o' : '');
    if (capsKey !== prevCaps) { prevCaps = capsKey; caps.forEach((c, j) => c.classList.toggle('on', capsKey[j] === '1')); outro?.classList.toggle('on', capsKey.endsWith('o')); }
    stage.style.setProperty('--dim', (clamp((p - OUTRO + 0.02) / 0.1) * (dark ? 0.5 : 0.42)).toFixed(3));
    if (bar) bar.style.transform = `scaleX(${p.toFixed(4)})`;
    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
})();
