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
  ('requestIdleCallback' in window ? (window as any).requestIdleCallback : setTimeout)(rest, 200);
  tl.to(state, { f: count - 1, ease: 'none', duration: 1, onUpdate: draw }, 0);
  window.addEventListener('resize', draw);
}

/* ---------- инициализация страницы ---------- */
let ctx: gsap.Context | null = null;
let mm: gsap.MatchMedia | null = null;
const cleanups: (() => void)[] = [];

function initPage() {
  setupHeader();
  const rm = reduce();

  ctx = gsap.context(() => {
    /* заголовки строками */
    document.querySelectorAll<HTMLElement>('[data-split]').forEach((el) => {
      if (rm) return;
      const split = SplitText.create(el, { type: 'lines', mask: 'lines', linesClass: 'split-line', autoSplit: true,
        onSplit: (self) => gsap.from(self.lines, {
          yPercent: 110, duration: 1.1, ease: 'expo.out', stagger: 0.08,
          scrollTrigger: { trigger: el, start: 'top 88%', once: true },
        }),
      });
      cleanups.push(() => split.revert());
    });

    /* появление */
    gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach((el) => {
      if (rm) { gsap.set(el, { opacity: 1, y: 0 }); return; }
      gsap.to(el, { opacity: 1, y: 0, duration: 1, ease: 'expo.out', scrollTrigger: { trigger: el, start: 'top 92%', once: true } });
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

    /* сцены */
    document.querySelectorAll<HTMLElement>('[data-scene]').forEach((el) => {
      const pin = el.dataset.pin === '1' && !reduceNow;
      const len = Number(el.dataset.length) || 1.6;
      const tl = gsap.timeline({ paused: !pin });
      const bar = el.querySelector<HTMLElement>('[data-scene-progress]');
      const label = el.querySelector<HTMLElement>('[data-scene-frame]');
      const grid = el.querySelector<HTMLElement>('.scene__grid');
      if (bar) tl.to(bar, { scaleX: 1, ease: 'none', duration: 1 }, 0);
      if (grid) tl.fromTo(grid, { '--shift': '0px' }, { '--shift': '-240px', ease: 'none', duration: 1 }, 0);
      if (label) tl.eventCallback('onUpdate', () => (label.textContent = `кадр ${Math.round(tl.progress() * 149) + 1} / 150`));
      sceneFrames(el, tl);
      el.querySelectorAll<HTMLElement>('[data-at]').forEach((cap) => {
        const at = Number(cap.dataset.at);
        tl.fromTo(cap, { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 0.08 }, at);
        if (cap.dataset.until) tl.to(cap, { autoAlpha: 0, y: -24, duration: 0.08 }, Number(cap.dataset.until));
      });
      if (pin) {
        ScrollTrigger.create({ trigger: el, start: 'center center', end: `+=${len * 100}%`, pin: true, scrub: 0.5, animation: tl, anticipatePin: 1 });
      } else tl.progress(reduceNow ? 1 : 0);
    });

    /* горизонтальная лента шагов */
    document.querySelectorAll<HTMLElement>('[data-hscroll]').forEach((wrap) => {
      const track = wrap.querySelector<HTMLElement>('[data-hscroll-track]');
      const line = wrap.querySelector<SVGPathElement>('[data-route]');
      if (!track || !desktop || reduceNow) return;
      const dist = () => track.scrollWidth - wrap.clientWidth;
      const tl = gsap.timeline();
      tl.to(track, { x: () => -dist(), ease: 'none' }, 0);
      if (line) { const L = line.getTotalLength(); gsap.set(line, { strokeDasharray: L, strokeDashoffset: L }); tl.to(line, { strokeDashoffset: 0, ease: 'none' }, 0); }
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
        const stop = mountVanta(el, 'fog', { highlightColor: 0x2b4bff, midtoneColor: 0x1a2340, lowlightColor: 0x0c0e11, baseColor: 0x0c0e11, blurFactor: 0.7, speed: 0.8, zoom: 0.8 });
        if (stop) cleanups.push(stop);
      });
    }
  });

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

document.addEventListener('astro:page-load', initPage);
document.addEventListener('astro:before-swap', destroyPage);
document.addEventListener('astro:after-swap', () => { lenis?.scrollTo(0, { immediate: true }); lenis?.resize(); });
