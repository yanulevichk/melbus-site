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
  document.querySelectorAll<HTMLElement>('[data-tapeline]').forEach((el) => {
    if (rm) { el.classList.add('is-taped'); return; }
    ScrollTrigger.create({ trigger: el, start: 'top 85%', once: true, onEnter: () => el.classList.add('is-taped') });
  });
}
