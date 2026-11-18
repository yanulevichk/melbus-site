/* Первый экран MELBUS: слово-окно → фильм под прокрутку (кадры на canvas, плавное догоняние) → заголовок и кнопки. */
(() => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  // плавная прокрутка колесом, как на сайте (Lenis)
  if (window.Lenis && !reduce) {
    const lenis = new window.Lenis({ lerp: 0.085 });
    const raf = (t) => { lenis.raf(t); requestAnimationFrame(raf); };
    requestAnimationFrame(raf);
  }

  // вариант «Ночь»: слова по очереди проявляются из размытия
  const noir = document.querySelector('[data-noir]');
  if (noir) {
    const words = [...noir.querySelectorAll('.words b')];
    let i = -1;
    const next = () => { i = (i + 1) % words.length; words.forEach((w, j) => w.classList.toggle('on', j === i)); };
    next(); if (!reduce) setInterval(next, 2600);
    const v = noir.querySelector('video');
    const pick = () => { const m = matchMedia('(max-aspect-ratio: 3/4), (max-width: 700px)').matches; const src = m ? v.dataset.m : v.dataset.d; if (!v.src.endsWith(src)) { v.src = src; v.play().catch(() => {}); } };
    pick(); addEventListener('resize', pick);
    return;
  }

  const hero = document.querySelector('[data-hero]');
  if (!hero) return;
  const dark = document.body.classList.contains('tone-dark');
  const stage = hero.querySelector('.stage'), canvas = hero.querySelector('canvas'), g = canvas.getContext('2d');
  const mask = hero.querySelector('[data-mask]'), originEl = hero.querySelector('[data-origin]');
  const caps = [...hero.querySelectorAll('[data-cap]')], outro = hero.querySelector('[data-outro]');
  const intro = hero.querySelector('[data-intro]'), bar = hero.querySelector('[data-bar]');
  const N = 155, INTRO = 0.17, OUTRO = 0.9;
  const isMobile = () => matchMedia('(max-aspect-ratio: 3/4), (max-width: 700px)').matches;
  let set = '', frames = [];
  const load = () => {
    const s = isMobile() ? 'm' : 'd';
    if (s === set) return; set = s;
    frames = Array.from({ length: N }, (_, i) => { const im = new Image(); im.decoding = 'async'; im.src = `frames/${s}/${String(i + 1).padStart(4, '0')}.webp`; return im; });
    frames[0].onload = () => { last = ''; };
  };
  const ok = (im) => im && im.complete && im.naturalWidth > 0;
  const cover = (im, a) => {
    const cw = canvas.width, ch = canvas.height, s = Math.max(cw / im.naturalWidth, ch / im.naturalHeight);
    const w = im.naturalWidth * s, h = im.naturalHeight * s;
    g.globalAlpha = a; g.drawImage(im, (cw - w) / 2, (ch - h) / 2, w, h); g.globalAlpha = 1;
  };
  let last = '';
  const draw = (fp) => {
    const f = fp * (N - 1), i = Math.floor(f), fr = f - i, key = `${i}:${fr.toFixed(2)}:${canvas.width}`;
    if (key === last) return;
    let a = frames[i]; if (!ok(a)) for (let j = i; j >= 0; j--) if (ok(frames[j])) { a = frames[j]; break; }
    if (!ok(a)) return;
    cover(a, 1);
    const b = frames[i + 1];
    if (fr > 0.02 && ok(b)) cover(b, fr);            // мягкий переход между соседними кадрами
    last = key;
  };
  const size = () => {
    const d = Math.min(2, devicePixelRatio || 1);
    canvas.width = Math.round(stage.clientWidth * d); canvas.height = Math.round(stage.clientHeight * d); last = '';
    if (mask && originEl) {                           // точка «влёта» — внутри левой ножки буквы M
      const t = mask.style.transform; mask.style.transform = 'none';
      const A = stage.getBoundingClientRect(), B = originEl.getBoundingClientRect();
      mask.style.transformOrigin = `${B.left - A.left + B.width * 0.11}px ${B.top - A.top + B.height * 0.5}px`;
      mask.style.transform = t;
    }
  };
  load(); size();
  addEventListener('resize', () => { load(); size(); });
  document.fonts?.ready.then(size);

  let cur = 0;
  const clamp = (x) => Math.max(0, Math.min(1, x));
  const tick = () => {
    const r = hero.getBoundingClientRect(), total = hero.offsetHeight - stage.clientHeight;
    const target = clamp(-r.top / total);
    cur += (target - cur) * (reduce ? 1 : 0.16);
    if (Math.abs(target - cur) < 0.0004) cur = target;
    const p = cur, k = clamp(p / INTRO);
    if (mask) {
      mask.style.transform = `scale(${1 + Math.pow(k, 2.4) * 95})`;
      mask.style.visibility = k > 0.995 ? 'hidden' : 'visible';
    }
    if (intro) intro.style.opacity = String(1 - clamp(p / 0.05));
    stage.style.setProperty('--kb', String(1.08 - 0.08 * k));
    const fp = clamp((p - INTRO * 0.55) / (OUTRO - INTRO * 0.55));
    draw(fp);
    caps.forEach((c) => c.classList.toggle('on', fp >= +c.dataset.from && fp < +c.dataset.to && p < OUTRO - 0.005));
    outro?.classList.toggle('on', p >= OUTRO - 0.005);
    stage.style.setProperty('--dim', String(clamp((p - OUTRO + 0.02) / 0.1) * (dark ? 0.55 : 0.45)));
    if (bar) bar.style.transform = `scaleX(${p})`;
    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
})();
