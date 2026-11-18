/**
 * «ЖИВОЙ» СЛОЙ САЙТА (18.11.2026, просьба владельца: «нравится, когда сайт живой»).
 *  1. Курсор-кольцо (только мышь): мягко догоняет указатель, растёт на ссылках и кнопках,
 *     на картинках-ссылках показывает подпись из data-cursor («Открыть», «Смотреть»). Обычный курсор остаётся.
 *  2. Картинки [data-img]: раскрываются шторкой снизу при появлении и чуть «плывут» при прокрутке (параллакс).
 *  3. Заголовки [data-tapeline]: бирюзовая полоса-скотч протягивается под заголовком, когда он появился.
 * Всё отключается при «уменьшить движение». Курсор живёт вне gsap.context, страницы — внутри (см. motion.ts).
 */
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const reduce = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer = () => matchMedia('(hover: hover) and (pointer: fine)').matches;

/* ---------- 1. курсор ---------- */
let ring: HTMLElement | null = null, label: HTMLElement | null = null;
let tx = -100, ty = -100, x = -100, y = -100, raf = 0, shown = false;
export function cursor() {
  if (!finePointer() || reduce()) return;
  if (!ring || !document.body.contains(ring)) {        // ClientRouter меняет body — создаём заново, если пропал
    ring = document.createElement('div'); ring.className = 'cur'; ring.setAttribute('aria-hidden', 'true');
    label = document.createElement('span'); label.className = 'cur__l'; ring.append(label);
    document.body.append(ring);
  }
  if (raf) return;                                     // слушатели и цикл — один раз на всю сессию
  const loop = () => {
    x += (tx - x) * 0.2; y += (ty - y) * 0.2;
    if (ring) ring.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    raf = requestAnimationFrame(loop);
  };
  raf = requestAnimationFrame(loop);
  addEventListener('pointermove', (e) => {
    if (e.pointerType !== 'mouse') return;
    tx = e.clientX; ty = e.clientY;
    if (!shown && ring) { shown = true; x = tx; y = ty; ring.classList.add('is-on'); }
  }, { passive: true });
  document.addEventListener('pointerleave', () => { shown = false; ring?.classList.remove('is-on'); });
  addEventListener('pointerover', (e) => {
    if (!ring || !label) return;
    const t = e.target as HTMLElement;
    const field = t.closest('input, textarea, select, [contenteditable]');
    const hit = t.closest<HTMLElement>('a, button, [role="button"], label, summary, [data-cursor]');
    const text = hit?.closest<HTMLElement>('[data-cursor]')?.dataset.cursor || '';
    ring.classList.toggle('is-field', !!field);
    ring.classList.toggle('is-link', !!hit && !text);
    ring.classList.toggle('is-label', !!text);
    label.textContent = text;
  }, { passive: true });
  addEventListener('pointerdown', () => ring?.classList.add('is-down'), { passive: true });
  addEventListener('pointerup', () => ring?.classList.remove('is-down'), { passive: true });
}

/* ---------- 2–3. картинки и полосы под заголовками (на каждой странице, внутри gsap.context) ---------- */
export function alivePage() {
  const rm = reduce();
  document.querySelectorAll<HTMLElement>('[data-img]').forEach((box) => {
    const img = box.querySelector<HTMLElement>('img, video');
    if (rm || !img) return;
    gsap.fromTo(box, { clipPath: 'inset(14% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.3, ease: 'expo.out', scrollTrigger: { trigger: box, start: 'top 90%', once: true } });
    gsap.fromTo(img, { scale: 1.16 }, { scale: 1.04, duration: 1.6, ease: 'expo.out', scrollTrigger: { trigger: box, start: 'top 90%', once: true } });
    gsap.fromTo(img, { yPercent: -3 }, { yPercent: 3, ease: 'none', scrollTrigger: { trigger: box, start: 'top bottom', end: 'bottom top', scrub: true } });
  });
  /* пакеты: оживают при наведении (подсветка за мышью, скотч сверху, иконка, галочки); на телефоне — в середине экрана */
  document.querySelectorAll<HTMLElement>('[data-pk]').forEach((wrap) => {
    const cols = Array.from(wrap.querySelectorAll<HTMLElement>('[data-pk-col]'));
    if (finePointer()) {
      cols.forEach((c) => {
        c.addEventListener('pointerenter', () => { c.classList.add('is-live'); wrap.classList.add('has-live'); });
        c.addEventListener('pointerleave', () => { c.classList.remove('is-live'); wrap.classList.remove('has-live'); });
        c.addEventListener('pointermove', (e) => {
          const r = c.getBoundingClientRect();
          c.style.setProperty('--mx', `${(e.clientX - r.left).toFixed(0)}px`); c.style.setProperty('--my', `${(e.clientY - r.top).toFixed(0)}px`);
        }, { passive: true });
      });
    } else {
      cols.forEach((c) => ScrollTrigger.create({ trigger: c, start: 'top 62%', end: 'bottom 38%', toggleClass: 'is-live' }));
    }
  });
  document.querySelectorAll<HTMLElement>('[data-tapeline]').forEach((el) => {
    if (rm) { el.classList.add('is-taped'); return; }
    ScrollTrigger.create({ trigger: el, start: 'top 85%', once: true, onEnter: () => el.classList.add('is-taped') });
  });
}

/* ---------- 4. горизонтальная лента под обычную прокрутку (шаги на главной) ----------
 * Владелец (18.11.2026): «в одну строку, и когда скролишь — сползают вбок». Экран закреплён через CSS sticky
 * (надёжнее, чем pin в GSAP: не зависит от порядка пересчёта и от фильма выше), высота секции = экран + длина ленты.
 * Сдвиг мягко догоняет прокрутку, картинки внутри карточек чуть «плывут» (параллакс), счётчик 01/06 и полоса-скотч.
 * Без JS / «уменьшить движение» — обычная лента, которую листают вбок пальцем или колёсиком. */
export function hScroll(wrap: HTMLElement, local: (() => void)[]) {
  const stage = wrap.querySelector<HTMLElement>('[data-hscroll-stage]');
  const track = wrap.querySelector<HTMLElement>('[data-hscroll-track]');
  if (!stage || !track || reduce()) return;
  const items = Array.from(track.querySelectorAll<HTMLElement>('[data-hs-item]'));
  const imgs = items.map((it) => it.querySelector<HTMLElement>('[data-hs-img]'));
  const fill = wrap.querySelector<HTMLElement>('[data-hscroll-fill]');
  const num = wrap.querySelector<HTMLElement>('[data-hscroll-n]');
  const SLOW = 1.3;                                    // сколько пикселей прокрутки на пиксель ленты
  wrap.classList.add('is-hs');
  let dist = 0, vw = 0, vh = 0, x = 0, rel: number[] = [], base = 0, wid: number[] = [];
  const measure = () => {
    vw = stage.clientWidth; vh = innerHeight;
    dist = Math.max(0, track.offsetWidth - vw);
    wrap.style.height = `${Math.round(stage.offsetHeight + dist * SLOW)}px`;
    const tr = track.getBoundingClientRect(), sr = stage.getBoundingClientRect();
    base = tr.left - x - sr.left;
    rel = items.map((it) => it.getBoundingClientRect().left - tr.left);
    wid = items.map((it) => it.offsetWidth);
  };
  measure();
  const onResize = () => {
    if (Math.abs(stage.clientWidth - vw) < 2 && Math.abs(innerHeight - vh) < 140) return;   // адресная строка телефона
    measure(); ScrollTrigger.refresh();
  };
  addEventListener('resize', onResize);

  const clamp = (v: number) => Math.max(0, Math.min(1, v));
  let cur = -1, raf = 0, shown = false, lastN = '';
  const r0 = wrap.getBoundingClientRect();
  if (r0.top > innerHeight * 0.85) gsap.set(items, { y: 70, opacity: 0 });   // карточки «поднимутся», когда секция появится
  else shown = true;
  const tick = () => {
    raf = requestAnimationFrame(tick);
    const r = wrap.getBoundingClientRect();
    if (r.bottom < -40 || r.top > innerHeight + 40) return;
    if (!shown && r.top < innerHeight * 0.8) { shown = true; gsap.to(items, { y: 0, opacity: 1, duration: 1.2, ease: 'expo.out', stagger: 0.09 }); }
    const total = wrap.offsetHeight - stage.offsetHeight;
    const target = total > 0 ? clamp(-r.top / total) : 0;
    if (cur < 0) cur = target;
    cur += (target - cur) * 0.14;
    if (Math.abs(target - cur) < 0.0002) cur = target;
    x = -cur * dist;
    track.style.transform = `translate3d(${x.toFixed(1)}px,0,0)`;
    fill?.style.setProperty('--p', cur.toFixed(4));
    items.forEach((_, i) => {                           // параллакс: картинка сдвигается навстречу движению
      const im = imgs[i]; if (!im) return;
      const left = base + rel[i] + x, c = (left + wid[i] / 2 - vw / 2) / vw;
      if (left > vw + 40 || left + wid[i] < -40) return;
      im.style.transform = `translate3d(${(-Math.max(-1, Math.min(1, c)) * wid[i] * 0.07).toFixed(1)}px,0,0)`;
    });
    const n = String(Math.round(cur * (items.length - 1)) + 1).padStart(2, '0');
    if (num && n !== lastN) { lastN = n; num.textContent = n; }
  };
  raf = requestAnimationFrame(tick);
  local.push(() => { cancelAnimationFrame(raf); removeEventListener('resize', onResize); wrap.classList.remove('is-hs'); wrap.style.height = ''; track.style.transform = ''; });
}
