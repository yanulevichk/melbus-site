/*
 * MELBUS OS — общий «живой» слой прототипов (28.11.2026). Пара к os.css.
 *   OS.enter(root, opt)   — анимировать новый экран: заголовки по строкам + полоса, фото шторкой, блоки по очереди, цифры барабанами
 *   OS.drum(el, text?)    — цифры элемента крутятся барабанами до значения (повторный вызов — докручивает до нового)
 *   OS.magnetic(sel)      — главная кнопка тянется за мышью (только мышь)
 *   OS.grain(sel)         — зерно на тёмном блоке
 * opt: { heads, tape, imgs, rise, drums } — CSS-селекторы внутри root (у каждого прототипа свои классы).
 */
(() => {
  const reduce = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = () => matchMedia('(hover: hover) and (pointer: fine)').matches;

  // заголовок → строки (только простой текст и <br>; иначе — маска целиком)
  function split(el, delay) {
    if (el.dataset.osDone) return;
    el.dataset.osDone = '1';
    el.style.setProperty('--os-d', delay + 'ms');
    const plain = [...el.childNodes].every((n) => n.nodeType === 3 || (n.nodeType === 1 && n.tagName === 'BR'));
    if (!plain || !el.textContent.trim()) { el.classList.add('os-mask'); return; }
    const parts = el.innerHTML.split(/<br\s*\/?>/i);
    el.innerHTML = parts.map((p) => p.trim().split(/\s+/).filter(Boolean).map((w) => `<span class="os-w">${w}</span>`).join(' ')).join('<br>');
    const lines = []; let top = null;
    el.querySelectorAll('.os-w').forEach((w) => {
      const t = w.offsetTop;
      if (top === null || Math.abs(t - top) > 4) { lines.push([]); top = t; }
      lines[lines.length - 1].push(w.innerHTML);
    });
    el.innerHTML = lines.map((ws, i) => `<span class="os-line"><span class="os-line__in" style="--i:${i}">${ws.join(' ')}</span></span>`).join('');
  }

  // цифры-барабаны
  function drum(el, text, from) {
    const t = (text ?? el.dataset.osText ?? el.textContent).trim();
    if (!/\d/.test(t)) return;
    const prev = el.dataset.osText;
    el.dataset.osText = t; el.setAttribute('aria-label', t);
    const same = prev && prev.replace(/\d/g, '0') === t.replace(/\d/g, '0') && el.querySelector('.os-drum');
    if (!same) {
      el.classList.add('os-num');
      let di = 0;
      el.innerHTML = [...t].map((ch) => /\d/.test(ch)
        ? `<span class="os-drum" aria-hidden="true"><span class="os-drum__s" style="--i:${di++}">${'0123456789'.split('').map((d) => `<i>${d}</i>`).join('')}</span></span>`
        : `<span class="os-ch" aria-hidden="true">${ch === ' ' ? '&nbsp;' : ch}</span>`).join('');
      // from — прежнее значение: барабаны стартуют с него (без анимации), а не с нуля
      const f = from && from.replace(/\d/g, '0') === t.replace(/\d/g, '0') ? from.replace(/\D/g, '') : '';
      if (f) el.querySelectorAll('.os-drum__s').forEach((s, i) => { s.style.transition = 'none'; s.style.setProperty('--v', f[i]); });
      void el.offsetWidth;   // старт с нуля (или с прежнего), потом прокрутка до значения
      if (f) el.querySelectorAll('.os-drum__s').forEach((s) => { s.style.transition = ''; });
    }
    const digits = t.replace(/\D/g, '');
    const strips = el.querySelectorAll('.os-drum__s');
    const go = () => strips.forEach((s, i) => s.style.setProperty('--v', digits[i]));
    if (reduce()) go(); else requestAnimationFrame(() => requestAnimationFrame(go));
  }

  // по появлении на экране
  const io = 'IntersectionObserver' in window ? new IntersectionObserver((es) => es.forEach((e) => {
    if (!e.isIntersecting) return;
    io.unobserve(e.target);
    show(e.target);
  }), { rootMargin: '0px 0px -6% 0px' }) : null;
  // заголовок/полоса ниже экрана ждут (анимация на паузе), барабан крутится, блок появляется
  const show = (el) => { if (el.dataset.osDrum) drum(el); else if (el.classList.contains('os-wait')) el.classList.remove('os-wait'); else el.classList.add('is-in'); };
  const whenSeen = (el) => { if (io) io.observe(el); else show(el); };
  const below = (el) => el.getBoundingClientRect().top > innerHeight * 0.94;

  function enter(root, opt = {}) {
    if (!root) return;
    if (reduce()) { root.querySelectorAll(opt.drums || '[data-os-drum]').forEach((el) => drum(el)); return; }
    const o = { heads: 'h1, h2', tape: '', imgs: '', rise: '', drums: '[data-os-drum]', ...opt };
    let d = 0;
    root.querySelectorAll(o.heads).forEach((h) => {
      if (h.closest('[data-os-skip]') || h.dataset.osDone) return;
      if (below(h)) { split(h, 0); h.classList.add('os-wait'); whenSeen(h); return; }
      split(h, d); d = Math.min(d + 120, 360);
    });
    if (o.tape) root.querySelectorAll(o.tape).forEach((h) => {
      if (h.dataset.osTaped) return; h.dataset.osTaped = '1'; h.classList.add('os-tape');
      if (below(h) && !h.classList.contains('os-wait')) { h.classList.add('os-wait'); whenSeen(h); }
    });
    if (o.imgs) root.querySelectorAll(o.imgs).forEach((im, i) => {
      if (im.dataset.osImg) return; im.dataset.osImg = '1';
      im.classList.add('os-img'); im.style.setProperty('--os-d', Math.min(i, 6) * 70 + 'ms'); whenSeen(im);
    });
    if (o.rise) root.querySelectorAll(o.rise).forEach((el, i) => {
      if (el.dataset.osRise) return; el.dataset.osRise = '1';
      el.classList.add('os-rise'); el.style.setProperty('--i', Math.min(i, 10)); whenSeen(el);
    });
    root.querySelectorAll(o.drums).forEach((el) => {
      if (el.dataset.osDrum || el.closest('[data-os-drum]')) return;
      // «37 <span>из 41</span>» — крутим только число в начале, разметку внутри не трогаем
      if (el.children.length) {
        const tn = [...el.childNodes].find((n) => n.nodeType === 3 && /\d/.test(n.textContent));
        if (!tn) return;
        const sp = document.createElement('span'); sp.className = 'os-wrap'; sp.textContent = tn.textContent.trim(); tn.replaceWith(sp, tn.textContent.endsWith(' ') ? ' ' : ''); el = sp;
      }
      el.dataset.osDrum = '1'; el.dataset.osText = el.textContent.trim(); whenSeen(el);
    });
  }

  // главная кнопка тянется за мышью (делегирование — работает и для кнопок, появившихся позже)
  function magnetic(sel) {
    if (!fine() || reduce()) return;
    let cur = null;
    addEventListener('pointermove', (e) => {
      const b = e.target.closest?.(sel);
      if (cur && cur !== b) { cur.style.transform = ''; cur = null; }
      if (!b || b.disabled) return;
      cur = b;
      const r = b.getBoundingClientRect();
      b.style.transition = 'transform .35s cubic-bezier(.2,.7,.1,1)';
      b.style.transform = `translate(${((e.clientX - r.left - r.width / 2) * 0.22).toFixed(1)}px, ${((e.clientY - r.top - r.height / 2) * 0.3).toFixed(1)}px)`;
    }, { passive: true });
  }

  function grain(sel) {
    document.querySelectorAll(sel).forEach((el) => {
      if (el.querySelector(':scope > .os-grain')) return;
      if (getComputedStyle(el).position === 'static') el.style.position = 'relative';
      const g = document.createElement('i'); g.className = 'os-grain'; g.setAttribute('aria-hidden', 'true'); el.prepend(g);
    });
  }

  window.OS = { enter, drum, magnetic, grain, split };
})();
