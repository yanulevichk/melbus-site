/**
 * ДВИЖОК АНИМАЦИЙ MELBUS.
 * Lenis (плавный скролл) + GSAP/ScrollTrigger/SplitText.
 * Каждый эффект включается атрибутом в разметке — страницы не пишут свой JS.
 *
 *  data-split          заголовок выезжает строками из-под маски
 *  data-reveal         элемент плавно появляется снизу
 *  data-scene          сцена «под скролл» (кадры на canvas или заглушка)
 *  data-marquee        бегущая строка, скорость зависит от скролла
 *  data-words          текст «проявляется» по словам при скролле
 *  data-hscroll        горизонтальная лента, закреплённая на экране (только компьютер)
 *  data-count-to       число набегает до значения
 *  data-magnetic       кнопка слегка тянется за курсором (только мышь)
 *  data-swap           закреплённый медиа-стек, кадры меняются по пунктам текста
 *  data-vanta          живой фон Vanta (только компьютер)
 */
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { mountVanta } from './vanta-bg';

gsap.registerPlugin(ScrollTrigger, SplitText);

const reduce = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const isDesktop = () => window.matchMedia('(min-width: 1024px)').matches;
const finePointer = () => window.matchMedia('(hover: hover) and (pointer: fine)').matches;

/* ---------- Lenis: один на весь сайт ---------- */
let lenis: Lenis | null = null;
if (!reduce()) {
  lenis = new Lenis({ lerp: 0.1, wheelMultiplier: 1 });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((t) => lenis!.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
}

/* ---------- логотип «заклеивается» скотчем (первый заход, без прелоадера) ---------- */
let introDelay = 0;
function tapeLogo() {
  const root = document.documentElement;
  const tape = document.querySelector<HTMLElement>('[data-logo-tape]');
  if (!tape || !root.classList.contains('tape') || reduce()) return;
  try { sessionStorage.setItem('mb-tape', '1'); } catch {}
  gsap.timeline({ delay: 0.25, onComplete: () => root.classList.remove('tape') })
    .fromTo(tape, { scaleX: 0, transformOrigin: '0% 50%', opacity: 1 }, { scaleX: 1, duration: 0.55, ease: 'expo.out' })
    .to(tape, { scaleX: 0, transformOrigin: '100% 50%', duration: 0.5, ease: 'expo.in' }, '+=0.35');
}

/* ---------- шторка между страницами ---------- */
function curtain() {
  const el = document.querySelector<HTMLElement>('[data-curtain]');
  return {
    in: () => new Promise<void>((res) => {
      if (!el || reduce()) return res();
      gsap.killTweensOf(el);
      gsap.set(el, { visibility: 'visible' });
      gsap.fromTo(el, { clipPath: 'inset(100% 0 0 0)' }, { clipPath: 'inset(0% 0 0 0)', duration: 0.5, ease: 'expo.inOut', onComplete: () => res() });
      gsap.fromTo(el.querySelector('img'), { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.4, delay: 0.2 });
    }),
    out: () => {
      if (!el || getComputedStyle(el).visibility !== 'visible') return;
      gsap.to(el, { clipPath: 'inset(0 0 100% 0)', duration: 0.65, ease: 'expo.inOut', delay: 0.05, onComplete: () => { gsap.set(el, { visibility: 'hidden' }); } });
    },
  };
}
document.addEventListener('astro:before-preparation', (e: any) => {
  const load = e.loader;
  e.loader = async () => { await Promise.all([curtain().in(), load()]); };
});

/* ---------- шапка и меню (живут между страницами) ---------- */
function setupHeader() {
  const hdr = document.querySelector<HTMLElement>('[data-header]');
  if (!hdr || hdr.dataset.ready) return;
  hdr.dataset.ready = '1';
  let last = 0;
  const onScroll = () => {
    const y = window.scrollY;
    hdr.classList.toggle('is-scrolled', y > 8);
    const menuOpen = hdr.querySelector('.menu.is-open');
    hdr.classList.toggle('is-hidden', !menuOpen && y > 240 && y > last);
    last = y;
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  const btn = hdr.querySelector<HTMLButtonElement>('[data-menu-toggle]');
  const menu = hdr.querySelector<HTMLElement>('[data-menu]');
  if (!btn || !menu) return;
  const close = () => {
    btn.setAttribute('aria-expanded', 'false');
    menu.classList.remove('is-open');
    lenis?.start();
    document.documentElement.style.overflow = '';
    setTimeout(() => { if (!menu.classList.contains('is-open')) menu.hidden = true; }, 700);
  };
  const open = () => {
    menu.hidden = false;
    requestAnimationFrame(() => menu.classList.add('is-open'));
    btn.setAttribute('aria-expanded', 'true');
    lenis?.stop();
    document.documentElement.style.overflow = 'hidden';
  };
  btn.addEventListener('click', () => (btn.getAttribute('aria-expanded') === 'true' ? close() : open()));
  menu.addEventListener('click', (e) => { if ((e.target as HTMLElement).closest('a')) close(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && menu.classList.contains('is-open')) close(); });
  document.addEventListener('astro:before-swap', close);
}

/* свободная минута браузера (или таймер, где requestIdleCallback нет) */
function whenIdle(fn: () => void, ms: number) {
  if ('requestIdleCallback' in window) window.requestIdleCallback(() => fn(), { timeout: ms * 5 });
  else setTimeout(fn, ms);
}

/* ---------- сцены: кадры на canvas ---------- */
function sceneFrames(el: HTMLElement, tl: gsap.core.Timeline) {
  const mobile = window.innerWidth < 768;
  const count = Number(mobile ? el.dataset.countMobile : el.dataset.count) || 0;
  const canvas = el.querySelector('canvas');
  if (!count || !canvas) return;
  const ctx = canvas.getContext('2d')!;
  const dir = `${el.dataset.base}/${mobile ? 'mobile' : 'desktop'}`;
  const ext = el.dataset.ext || 'webp';
  const imgs: HTMLImageElement[] = [];
  const state = { f: 0 };
  const src = (i: number) => `${dir}/${String(i + 1).padStart(4, '0')}.${ext}`;
  const draw = () => {
    const img = imgs[Math.round(state.f)];
    if (!img?.complete || !img.naturalWidth) return;
    const { width: w, height: h } = canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio, 2);
    if (canvas.width !== Math.round(w * dpr)) { canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr); }
    const s = Math.max(canvas.width / img.naturalWidth, canvas.height / img.naturalHeight);
    const dw = img.naturalWidth * s, dh = img.naturalHeight * s;
    ctx.drawImage(img, (canvas.width - dw) / 2, (canvas.height - dh) / 2, dw, dh);
  };
  // первый кадр сразу, остальные — в фоне
  const load = (i: number) => { const im = new Image(); im.decoding = 'async'; im.src = src(i); im.onload = () => { if (i === Math.round(state.f)) draw(); }; imgs[i] = im; };
  load(0);
  const rest = () => { for (let i = 1; i < count; i++) load(i); el.classList.add('is-live'); };
  whenIdle(rest, 200);
  tl.to(state, { f: count - 1, ease: 'none', duration: 1, onUpdate: draw }, 0);
  window.addEventListener('resize', draw);
}

/* ---------- фильм первого экрана (люкс) ----------
 * Компьютер: секция закрепляется, прокрутка ведёт фильм вперёд/назад (кадры WebP на canvas).
 * Телефон: тот же фильм — видео без звука по кругу, только пока на экране.
 * Подписи [data-film-cap data-from data-to] — в секундах фильма, общие для обоих режимов. */
function filmHero(sec: HTMLElement, desktop: boolean, reduceNow: boolean, local: (() => void)[]) {
  const stage = sec.querySelector<HTMLElement>('[data-film-stage]') || sec;
  const canvas = sec.querySelector<HTMLCanvasElement>('[data-film-canvas]');
  const video = sec.querySelector<HTMLVideoElement>('[data-film-video]');
  const intro = sec.querySelector<HTMLElement>('[data-film-intro]');
  const caps = [...sec.querySelectorAll<HTMLElement>('[data-film-cap]')];
  const bar = sec.querySelector<HTMLElement>('[data-film-progress]');
  const dur = Number(sec.dataset.dur) || 23;
  const setTime = (t: number) => {
    caps.forEach((c) => c.classList.toggle('is-on', t >= Number(c.dataset.from) && t < Number(c.dataset.to)));
    if (bar) bar.style.transform = `scaleX(${Math.min(1, Math.max(0, t / dur)).toFixed(4)})`;
  };
  setTime(0);
  if (reduceNow) return;

  if (desktop && canvas) {
    const count = Number(sec.dataset.count) || 0;
    const base = sec.dataset.base || '';
    const imgs: HTMLImageElement[] = [];
    const ok = new Uint8Array(count);
    const ctx = canvas.getContext('2d');
    let cur = 0;
    const draw = () => {
      if (!ctx) return;
      let i = cur;
      if (!ok[i]) for (let d = 1; d < count; d++) { if (i - d >= 0 && ok[i - d]) { i -= d; break; } if (i + d < count && ok[i + d]) { i += d; break; } }
      const img = imgs[i];
      if (!img || !ok[i]) return;
      const r = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio, 2);
      const W = Math.round(r.width * dpr), H = Math.round(r.height * dpr);
      if (canvas.width !== W || canvas.height !== H) { canvas.width = W; canvas.height = H; }
      const s = Math.max(W / img.naturalWidth, H / img.naturalHeight);
      const dw = img.naturalWidth * s, dh = img.naturalHeight * s;
      ctx.drawImage(img, (W - dw) / 2, (H - dh) / 2, dw, dh);
      sec.classList.add('is-live');
    };
    const load = (i: number) => {
      if (imgs[i]) return;
      const im = new Image();
      im.decoding = 'async';
      im.onload = () => { ok[i] = 1; if (Math.abs(i - cur) < 8) draw(); };
      im.src = `${base}/${String(i + 1).padStart(4, '0')}.webp`;
      imgs[i] = im;
    };
    // сначала «скелет» — каждый 8-й кадр, потом заполняем промежутки: прокрутка работает сразу
    const order: number[] = [];
    const seen = new Uint8Array(count);
    for (let step = 8; step >= 1; step >>= 1) for (let i = 0; i < count; i += step) if (!seen[i]) { seen[i] = 1; order.push(i); }
    load(0);
    let k = 0, alive = true;
    const pump = () => { if (!alive) return; const end = Math.min(order.length, k + 16); for (; k < end; k++) load(order[k]); if (k < order.length) setTimeout(pump, 80); };
    whenIdle(pump, 300);
    // Прокрутка задаёт, ДО какого места дойти; фильм идёт туда сам, не быстрее задуманного темпа монтажа
    // (резкий рывок колесом не проматывает фильм). Назад, к началу, — быстрее.
    const FWD = 1.5, BACK = 5; // секунд фильма за секунду
    let target = 0, shown = 0;
    const render = () => { cur = Math.min(count - 1, Math.round((shown / dur) * (count - 1))); draw(); setTime(shown); };
    const tick = (_t: number, dtMs: number) => {
      const d = target - shown;
      if (Math.abs(d) < 0.0005) return;
      const step = (d > 0 ? FWD : BACK) * Math.min(dtMs, 100) / 1000;
      shown += Math.sign(d) * Math.min(Math.abs(d), step);
      render();
    };
    gsap.ticker.add(tick);
    const st = ScrollTrigger.create({
      trigger: sec, start: 'top top', end: () => '+=' + (Number(sec.dataset.length) || 4) * window.innerHeight,
      pin: stage, scrub: true, anticipatePin: 1, invalidateOnRefresh: true,
      refreshPriority: 10, // закрепление фильма считается первым — блоки ниже не «наезжают»
      onUpdate: (self) => {
        const p = self.progress;
        target = p * dur;
        if (intro) { const q = Math.min(1, p / 0.03); gsap.set(intro, { autoAlpha: 1 - q, y: -48 * q }); }
      },
    });
    window.addEventListener('resize', draw);
    local.push(() => { alive = false; gsap.ticker.remove(tick); st.kill(); window.removeEventListener('resize', draw); });
  } else if (video) {
    let raf = 0;
    const tick = () => { setTime(video.currentTime); raf = requestAnimationFrame(tick); };
    const onPlay = () => { sec.classList.add('is-playing'); cancelAnimationFrame(raf); raf = requestAnimationFrame(tick); };
    const onPause = () => cancelAnimationFrame(raf);
    video.addEventListener('playing', onPlay);
    video.addEventListener('pause', onPause);
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        if (!video.getAttribute('src') && video.dataset.src) video.src = video.dataset.src;
        video.play().catch(() => {});
      } else video.pause();
    }, { threshold: 0.2 });
    io.observe(video);
    local.push(() => { io.disconnect(); cancelAnimationFrame(raf); video.pause(); video.removeEventListener('playing', onPlay); video.removeEventListener('pause', onPause); });
  }
}

/* окно «Смотреть ролик»: видео грузится только по нажатию */
function filmModal() {
  const dlg = document.querySelector<HTMLDialogElement>('[data-film-modal]');
  if (!dlg) return;
  const v = dlg.querySelector('video');
  const open = () => {
    if (v && !v.getAttribute('src') && v.dataset.src) v.src = v.dataset.src;
    dlg.showModal(); lenis?.stop();
    v?.play().catch(() => {});
  };
  const close = () => { v?.pause(); if (dlg.open) dlg.close(); lenis?.start(); };
  document.querySelectorAll<HTMLElement>('[data-film-open]').forEach((b) => b.addEventListener('click', open));
  dlg.querySelectorAll<HTMLElement>('[data-film-close]').forEach((b) => b.addEventListener('click', close));
  dlg.addEventListener('click', (e) => { if (e.target === dlg) close(); });
  dlg.addEventListener('close', () => { v?.pause(); lenis?.start(); });
  cleanups.push(close);
}

/* ---------- 3D-сцены: грузим three.js только когда сцена рядом с экраном ---------- */
function scene3d(el: HTMLElement, tl: gsap.core.Timeline, local: (() => void)[]) {
  const host = el.querySelector<HTMLElement>('[data-three]');
  if (host) mount3d(host, tl, local);
}
function mount3d(host: HTMLElement, tl: gsap.core.Timeline, local: (() => void)[]) {
  const st = { p: 0 };
  let api: { setProgress(p: number): void; destroy(): void } | null = null;
  let alive = true;
  tl.to(st, { p: 1, ease: 'none', duration: 1, onUpdate: () => api?.setProgress(st.p) }, 0);
  const load = () => import('./scenes3d')
    .then((m) => m.mountScene(host, host.dataset.three!))
    .then((a) => {
      if (!alive) { a.destroy(); return; }
      api = a; a.setProgress(st.p);
      if (location.search.includes('debug')) ((window as any).__s3d ||= {})[host.dataset.three!] = a; // для проверки кадров
    })
    .catch(() => host.classList.add('is-fallback'));
  const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { io.disconnect(); load(); } }, { rootMargin: '600px 0px' });
  // скорость: на телефоне three.js ждёт первого касания/прокрутки, на компьютере — свободной минуты браузера.
  // До этого на месте сцены стоит постер (картинка первого кадра).
  const evs = ['scroll', 'touchstart', 'pointerdown', 'keydown', 'wheel'] as const;
  const go = () => { evs.forEach((n) => window.removeEventListener(n, go)); io.observe(host); };
  if (window.matchMedia('(max-width: 1023px)').matches && !location.search.includes('debug')) evs.forEach((n) => window.addEventListener(n, go, { passive: true, once: true }));
  else ('requestIdleCallback' in window ? (window as any).requestIdleCallback(go, { timeout: 1500 }) : setTimeout(go, 600));
  local.push(() => { alive = false; evs.forEach((n) => window.removeEventListener(n, go)); io.disconnect(); api?.destroy(); api = null; });
}

/* ---------- шаги: маршрут и бус ---------- */
function stepsRoute(desktop: boolean, reduceNow: boolean, local: (() => void)[]) {
  const wrap = document.querySelector<HTMLElement>('[data-hscroll]');
  if (!wrap || reduceNow) return;
  if (desktop) return; // на компьютере бус двигается в самой ленте (см. ниже)
  const fill = wrap.querySelector<HTMLElement>('[data-fill]');
  const bus = wrap.querySelector<HTMLElement>('[data-fill-bus]');
  if (!fill) return;
  const t = gsap.timeline();
  t.fromTo(fill, { scaleY: 0 }, { scaleY: 1, ease: 'none' }, 0);
  if (bus) t.fromTo(bus, { top: '0%' }, { top: '100%', ease: 'none' }, 0);
  const trig = ScrollTrigger.create({ trigger: wrap.querySelector('[data-hscroll-track]'), start: 'top 70%', end: 'bottom 60%', scrub: 0.4, animation: t });
  local.push(() => { trig.kill(); t.kill(); });
}

/* ---------- табло цены: барабаны с цифрами ---------- */
function priceBoard(board: HTMLElement) {
  const reels = Array.from(board.querySelectorAll<HTMLElement>('[data-reel]'));
  const out = board.querySelector<HTMLElement>('[data-board-value]');
  const status = board.querySelector<HTMLElement>('[data-board-status]');
  const chips = Array.from(document.querySelectorAll<HTMLButtonElement>(`[data-board-for="${board.id}"] [data-value]`));
  const fmt = new Intl.NumberFormat('ru');
  const cur = reels.map(() => 0);
  const CELLS = 33; // 3 круга по 11 клеток (0–9 и пустая)
  const yp = (idx: number) => (-idx * 100) / CELLS;
  const show = (value: number, spin = 1) => {
    const digits = String(value).padStart(reels.length, ' ').split('');
    reels.forEach((r, i) => {
      const strip = r.firstElementChild as HTMLElement;
      const d = digits[i] === ' ' ? 10 : Number(digits[i]); // 10 = пустая клетка
      const from = cur[i] % 11;
      const to = d + 11 * Math.max(1, spin);
      cur[i] = d;
      r.classList.toggle('is-blank', d === 10);
      if (reduce()) { gsap.set(strip, { yPercent: yp(d) }); return; }
      gsap.fromTo(strip, { yPercent: yp(from) }, { yPercent: yp(to), duration: 0.9 + i * 0.22, ease: 'expo.out', overwrite: true,
        onComplete: () => gsap.set(strip, { yPercent: yp(d) }) });
      r.classList.remove('is-hit'); void r.offsetWidth; r.classList.add('is-hit');
    });
    if (out) out.textContent = fmt.format(value);
  };
  const pick = (b: HTMLButtonElement, spin = 1) => {
    chips.forEach((c) => c.setAttribute('aria-pressed', String(c === b)));
    if (status) status.textContent = b.dataset.status || b.textContent || '';
    show(Number(b.dataset.value), spin);
  };
  chips.forEach((b) => b.addEventListener('click', () => pick(b)));
  const first = chips.find((c) => c.getAttribute('aria-pressed') === 'true') || chips[0];
  if (!first) return;
  reels.forEach((r) => gsap.set(r.firstElementChild, { yPercent: 0 }));
  ScrollTrigger.create({ trigger: board, start: 'top 85%', once: true, onEnter: () => pick(first, 2) });
}

/* ---------- инициализация страницы ---------- */
let ctx: gsap.Context | null = null;
let mm: gsap.MatchMedia | null = null;
const cleanups: (() => void)[] = [];

function initPage() {
  setupHeader();
  const rm = reduce();

  const delay = introDelay; introDelay = 0;
  ctx = gsap.context(() => {
    /* заголовки строками */
    document.querySelectorAll<HTMLElement>('[data-split]').forEach((el) => {
      if (rm) return;
      const split = SplitText.create(el, { type: 'lines', mask: 'lines', linesClass: 'split-line', autoSplit: true,
        onSplit: (self) => gsap.from(self.lines, {
          yPercent: 110, duration: 1.1, ease: 'expo.out', stagger: 0.08, delay,
          scrollTrigger: { trigger: el, start: 'top 88%', once: true },
        }),
      });
      cleanups.push(() => split.revert());
    });

    /* появление */
    gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach((el) => {
      if (rm) { gsap.set(el, { opacity: 1, y: 0 }); return; }
      gsap.to(el, { opacity: 1, y: 0, duration: 1, ease: 'expo.out', delay: delay ? delay + 0.25 : 0, scrollTrigger: { trigger: el, start: 'top 92%', once: true } });
    });

    /* бегущая строка */
    document.querySelectorAll<HTMLElement>('[data-marquee]').forEach((el) => {
      const track = el.firstElementChild as HTMLElement;
      if (!track || rm) return;
      track.append(...Array.from(track.children).map((c) => c.cloneNode(true)));
      let x = 0, dir = -1;
      const speed = Number(el.dataset.marquee) || 60;
      const tick = (_t: number, dt: number) => {
        const v = lenis ? lenis.velocity : 0;
        if (v) dir = v > 0 ? -1 : 1;
        x += dir * (speed + Math.abs(v) * 6) * (dt / 1000);
        const half = track.scrollWidth / 2;
        if (x <= -half) x += half; if (x > 0) x -= half;
        gsap.set(track, { x });
      };
      gsap.ticker.add(tick);
      cleanups.push(() => gsap.ticker.remove(tick));
    });

    /* слова проявляются */
    document.querySelectorAll<HTMLElement>('[data-words]').forEach((el) => {
      const split = SplitText.create(el, { type: 'words' });
      cleanups.push(() => split.revert());
      if (rm) return;
      gsap.fromTo(split.words, { opacity: 0.14 }, { opacity: 1, stagger: 0.1, ease: 'none',
        scrollTrigger: { trigger: el, start: 'top 80%', end: 'bottom 45%', scrub: true } });
    });

    /* класс is-in, когда блок появился (CSS-анимации: галочки, линии, радар) */
    document.querySelectorAll<HTMLElement>('[data-inview]').forEach((el) => {
      if (rm) { el.classList.add('is-in'); return; }
      ScrollTrigger.create({ trigger: el, start: el.dataset.inview || 'top 80%', once: true, onEnter: () => el.classList.add('is-in') });
    });

    /* линии рисуются по ходу прокрутки */
    document.querySelectorAll<SVGPathElement>('[data-draw] path, path[data-draw]').forEach((path) => {
      const L = path.getTotalLength();
      if (rm) return;
      gsap.fromTo(path, { strokeDasharray: L, strokeDashoffset: L }, { strokeDashoffset: 0, ease: 'none',
        scrollTrigger: { trigger: path.closest('[data-draw]') || path, start: 'top 85%', end: 'center 45%', scrub: 0.6 } });
    });

    /* «лента скотча»: линия протягивается и открывает кадр сверху вниз */
    document.querySelectorAll<HTMLElement>('[data-tape]').forEach((el) => {
      const media = el.querySelector<HTMLElement>('.tape__media');
      if (!media) return;
      if (rm) { gsap.set(media, { clipPath: 'none' }); return; }
      let line = el.querySelector<HTMLElement>('.tape__line');
      if (!line) { line = document.createElement('i'); line.className = 'tape__line'; line.setAttribute('aria-hidden', 'true'); el.appendChild(line); }
      const t = gsap.timeline({ paused: true });
      t.fromTo(line, { scaleX: 0, top: '0%', opacity: 1 }, { scaleX: 1, duration: 0.75, ease: 'power3.inOut' })
        .fromTo(media, { clipPath: 'inset(0% 0% 100% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.25, ease: 'expo.inOut' }, '-=0.05')
        .to(line, { top: '100%', duration: 1.25, ease: 'expo.inOut' }, '<')
        .to(line, { opacity: 0, duration: 0.5 }, '-=0.25');
      ScrollTrigger.create({ trigger: el, start: 'top 80%', once: true, onEnter: () => t.play() });
    });

    /* открытие первого экрана (люкс): линия-скотч → заголовок строками → остальное */
    document.querySelectorAll<HTMLElement>('[data-intro-hero]').forEach((hero) => {
      const title = hero.querySelector<HTMLElement>('[data-intro-title]');
      const line = hero.querySelector<HTMLElement>('[data-intro-line]');
      const rest = hero.querySelectorAll<HTMLElement>('[data-intro-fade]');
      if (rm || !title) { gsap.set([title, line, ...rest], { clearProps: 'all', visibility: 'visible', opacity: 1, scaleX: 1 }); return; }
      const split = SplitText.create(title, { type: 'lines', mask: 'lines', linesClass: 'split-line' });
      cleanups.push(() => split.revert());
      gsap.set(title, { visibility: 'visible' });
      const t = gsap.timeline({ delay: 0.15 + delay });
      t.from(split.lines, { yPercent: 105, duration: 1.35, ease: 'expo.out', stagger: 0.1 }, 0)
        .fromTo(line, { scaleX: 0 }, { scaleX: 1, duration: 1.1, ease: 'expo.inOut' }, 0.35)
        .fromTo(rest, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 1.1, ease: 'expo.out', stagger: 0.09 }, 0.7);
    });

    /* табло цены */
    document.querySelectorAll<HTMLElement>('[data-board]').forEach(priceBoard);

    /* полоска прогресса страницы в шапке */
    const prog = document.querySelector<HTMLElement>('[data-progress]');
    if (prog) ScrollTrigger.create({ start: 0, end: 'max', onUpdate: (s) => gsap.set(prog, { scaleX: s.progress }) });

    /* числа */
    document.querySelectorAll<HTMLElement>('[data-count-to]').forEach((el) => {
      const to = Number(el.dataset.countTo);
      const fmt = new Intl.NumberFormat(document.documentElement.lang || 'ru');
      if (rm) { el.textContent = fmt.format(to); return; }
      const o = { v: 0 };
      gsap.to(o, { v: to, duration: 1.8, ease: 'expo.out', onUpdate: () => (el.textContent = fmt.format(Math.round(o.v))),
        scrollTrigger: { trigger: el, start: 'top 90%', once: true } });
    });
  });

  /* то, что зависит от размера экрана */
  mm = gsap.matchMedia();
  mm.add({ desktop: '(min-width: 1024px)', mobile: '(max-width: 1023px)', rm: '(prefers-reduced-motion: reduce)' }, (c) => {
    const { desktop, rm: reduceNow } = c.conditions as { desktop: boolean; rm: boolean };

    const local: (() => void)[] = [];

    /* фильм первого экрана — первым: его закрепление сдвигает всё, что ниже */
    document.querySelectorAll<HTMLElement>('[data-film]').forEach((sec) => filmHero(sec, desktop, reduceNow, local));

    /* сцены */
    document.querySelectorAll<HTMLElement>('[data-scene]').forEach((el) => {
      const mobileMode = el.dataset.mobile || 'pin';
      const pin = el.dataset.pin === '1' && !reduceNow && (desktop || mobileMode === 'pin');
      const len = Number(el.dataset.length) || 1.6;
      const tl = gsap.timeline({ paused: true });
      const bar = el.querySelector<HTMLElement>('[data-scene-progress]');
      const label = el.querySelector<HTMLElement>('[data-scene-frame]');
      const grid = el.querySelector<HTMLElement>('.scene__grid');
      if (bar) tl.to(bar, { scaleX: 1, ease: 'none', duration: 1 }, 0);
      if (grid) tl.fromTo(grid, { '--shift': '0px' }, { '--shift': '-240px', ease: 'none', duration: 1 }, 0);
      if (label) tl.eventCallback('onUpdate', () => (label.textContent = `кадр ${Math.round(tl.progress() * 149) + 1} / 150`));
      sceneFrames(el, tl);
      scene3d(el, tl, local);
      el.querySelectorAll<HTMLElement>('[data-at]').forEach((cap) => {
        const at = Number(cap.dataset.at);
        tl.fromTo(cap, { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 0.06 }, at);
        if (cap.dataset.until) tl.to(cap, { autoAlpha: 0, y: -24, duration: 0.06 }, Number(cap.dataset.until));
      });
      tl.set({}, {}, 1); // длина таймлайна ровно 1
      if (location.search.includes('debug')) ((window as any).__tl ||= {})[el.dataset.scene!] = tl;
      if (reduceNow) { tl.progress(1); return; }
      if (pin) {
        ScrollTrigger.create({ trigger: el, start: 'center center', end: `+=${len * 100}%`, pin: true, scrub: 0.6, animation: tl, anticipatePin: 1 });
      } else if (mobileMode === 'auto' && !location.search.includes('debug')) {
        // телефон: сцена играет сама, по кругу, только пока видна
        tl.timeScale(1 / 22).repeat(-1).repeatDelay(0.1);
        const io = new IntersectionObserver(([e]) => (e.isIntersecting ? tl.play() : tl.pause()), { threshold: 0.15 });
        io.observe(el); local.push(() => io.disconnect());
      } else {
        ScrollTrigger.create({ trigger: el, start: 'top 85%', end: 'bottom 20%', scrub: 0.5, animation: tl });
      }
      local.push(() => tl.kill());
    });

    /* горизонтальная лента шагов */
    document.querySelectorAll<HTMLElement>('[data-hscroll]').forEach((wrap) => {
      const track = wrap.querySelector<HTMLElement>('[data-hscroll-track]');
      const line = wrap.querySelector<SVGPathElement>('[data-route]');
      if (!track || !desktop || reduceNow) return;
      const dist = () => track.scrollWidth - wrap.clientWidth;
      const tl = gsap.timeline();
      tl.to(track, { x: () => -dist(), ease: 'none' }, 0);
      if (line) {
        const L = line.getTotalLength();
        gsap.set(line, { strokeDasharray: L, strokeDashoffset: L });
        tl.to(line, { strokeDashoffset: 0, ease: 'none' }, 0);
        const bus = wrap.querySelector<HTMLElement>('[data-route-bus]');
        const svg = line.ownerSVGElement!;
        if (bus) tl.eventCallback('onUpdate', () => {
          const k = tl.progress();
          const pt = line.getPointAtLength(L * k), pt2 = line.getPointAtLength(Math.min(L, L * k + 4));
          const r = svg.getBoundingClientRect(), vb = svg.viewBox.baseVal;
          const sx = r.width / vb.width, sy = r.height / vb.height;
          const ang = Math.atan2((pt2.y - pt.y) * sy, (pt2.x - pt.x) * sx) * 180 / Math.PI;
          gsap.set(bus, { x: pt.x * sx, y: pt.y * sy, rotation: ang, opacity: k > 0.002 && k < 0.998 ? 1 : 0 });
        });
      }
      ScrollTrigger.create({ trigger: wrap, start: 'top top+=' + (parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header-h')) || 76), end: () => '+=' + dist(), pin: true, scrub: 0.6, animation: tl, invalidateOnRefresh: true });
    });

    /* закреплённый медиа-стек */
    document.querySelectorAll<HTMLElement>('[data-swap]').forEach((wrap) => {
      const items = wrap.querySelectorAll<HTMLElement>('[data-swap-item]');
      const media = wrap.querySelectorAll<HTMLElement>('[data-swap-media]');
      if (!desktop || reduceNow) return;
      gsap.set(media, { clipPath: 'inset(100% 0 0 0)' });
      gsap.set(media[0], { clipPath: 'inset(0% 0 0 0)' });
      items.forEach((it, i) => {
        if (!i) return;
        gsap.to(media[i], { clipPath: 'inset(0% 0 0 0)', ease: 'none', scrollTrigger: { trigger: it, start: 'top 75%', end: 'top 35%', scrub: true } });
      });
    });

    /* карточки слегка наклоняются за курсором */
    if (finePointer() && !reduceNow) {
      document.querySelectorAll<HTMLElement>('[data-tilt]').forEach((c) => {
        const move = (e: PointerEvent) => {
          const r = c.getBoundingClientRect();
          const x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
          c.style.setProperty('--ry', `${(x * 7).toFixed(2)}deg`); c.style.setProperty('--rx', `${(-y * 6).toFixed(2)}deg`);
        };
        const leave = () => { c.style.setProperty('--ry', '0deg'); c.style.setProperty('--rx', '0deg'); };
        c.addEventListener('pointermove', move); c.addEventListener('pointerleave', leave);
        local.push(() => { c.removeEventListener('pointermove', move); c.removeEventListener('pointerleave', leave); });
      });
    }

    /* магнитные кнопки */
    if (finePointer() && !reduceNow) {
      document.querySelectorAll<HTMLElement>('[data-magnetic]').forEach((b) => {
        const xTo = gsap.quickTo(b, 'x', { duration: 0.5, ease: 'power3' });
        const yTo = gsap.quickTo(b, 'y', { duration: 0.5, ease: 'power3' });
        const move = (e: PointerEvent) => { const r = b.getBoundingClientRect(); xTo((e.clientX - r.left - r.width / 2) * 0.25); yTo((e.clientY - r.top - r.height / 2) * 0.35); };
        const leave = () => { xTo(0); yTo(0); };
        b.addEventListener('pointermove', move); b.addEventListener('pointerleave', leave);
        cleanups.push(() => { b.removeEventListener('pointermove', move); b.removeEventListener('pointerleave', leave); });
      });
    }

    /* Vanta только на компьютере */
    if (desktop && !reduceNow) {
      document.querySelectorAll<HTMLElement>('[data-vanta]').forEach((el) => {
        const stop = mountVanta(el, 'fog', { highlightColor: 0x14dcd5, midtoneColor: 0x0b3a3d, lowlightColor: 0x10161d, baseColor: 0x10161d, blurFactor: 0.7, speed: 0.8, zoom: 0.8 });
        if (stop) local.push(stop);
      });
    }

    /* 3D вне сцен-слотов (люкс-hero): прогресс = прокрутка своей секции */
    document.querySelectorAll<HTMLElement>('[data-three-free]').forEach((host) => {
      const sec = host.closest<HTMLElement>('section') || host;
      const tl = gsap.timeline({ paused: true });
      tl.set({}, {}, 1);
      mount3d(host, tl, local);
      if (location.search.includes('debug')) ((window as any).__tl ||= {})[host.dataset.three!] = tl;
      if (reduceNow) return;
      const trig = ScrollTrigger.create({ trigger: sec, start: 'top top', end: 'bottom top', scrub: 0.6, animation: tl });
      local.push(() => { trig.kill(); tl.kill(); });
    });

    /* шаги: бус едет по маршруту (компьютер) / линия заполняется (телефон) */
    stepsRoute(desktop, reduceNow, local);

    return () => local.splice(0).forEach((f) => f());
  });

  filmModal();

  /* видео: грузим и играем только на экране */
  const io = new IntersectionObserver((entries) => entries.forEach((e) => {
    const v = e.target as HTMLVideoElement;
    if (e.isIntersecting) {
      v.querySelectorAll<HTMLSourceElement>('source[data-src]').forEach((s) => { s.src = s.dataset.src!; s.removeAttribute('data-src'); v.load(); });
      if (!reduce()) v.play().catch(() => {});
    } else v.pause();
  }), { rootMargin: '200px' });
  document.querySelectorAll('[data-video="1"] video').forEach((v) => io.observe(v));
  cleanups.push(() => io.disconnect());

  ScrollTrigger.refresh();
}

function destroyPage() {
  cleanups.splice(0).forEach((f) => f());
  mm?.revert(); ctx?.revert();
  ScrollTrigger.getAll().forEach((t) => t.kill());
}

let first = true;
document.addEventListener('astro:page-load', () => {
  if (first) { first = false; tapeLogo(); } else curtain().out();
  initPage();
});
document.addEventListener('astro:before-swap', destroyPage);
document.addEventListener('astro:after-swap', () => { lenis?.scrollTo(0, { immediate: true }); lenis?.resize(); });
