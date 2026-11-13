// HTML-превью сторис из out/figma/spec.json — для сверки с рендером Remotion (та же вёрстка CSS).
// Подключается из preview-<lang>.html; window.SPEC и window.LANG задаёт сборка.
(function () {
  const S = window.SPEC, L = window.LANG, C = S.colors;
  const rgba = (hex, a = 1) => `rgba(${parseInt(hex.slice(1, 3), 16)},${parseInt(hex.slice(3, 5), 16)},${parseInt(hex.slice(5, 7), 16)},${a})`;
  const FONT = {U200: ['Unbounded', 200], U300: ['Unbounded', 300], O400: ['Onest', 400], O500: ['Onest', 500], O600: ['Onest', 600]};
  const el = (tag, css, parent, text) => { const e = document.createElement(tag); Object.assign(e.style, css); if (text != null) e.textContent = text; if (parent) parent.appendChild(e); return e; };
  const textCss = (n) => ({fontFamily: FONT[n.font][0], fontWeight: FONT[n.font][1], fontSize: n.size + 'px', lineHeight: n.lh ? String(n.lh / 100) : 'normal',
    letterSpacing: n.ls ? n.ls / 100 + 'em' : 'normal', color: rgba(n.color, n.alpha ?? 1), textDecoration: n.strike ? 'line-through' : 'none', textDecorationColor: rgba(C.steel, 0.7)});
  const child = (n, parent) => {
    const mt = (n.mt || 0) + 'px';
    if (n.t === 'text') return el('div', {...textCss(n), marginTop: mt}, parent, n.text);
    if (n.t === 'bullets') {
      const box = el('div', {display: 'grid', gap: n.gap + 'px', marginTop: mt}, parent);
      for (const it of n.items) {
        const row = el('div', {display: 'grid', gridTemplateColumns: '56px 1fr', alignItems: 'baseline', fontFamily: 'Onest', fontSize: it.size + 'px', lineHeight: '1.35', color: '#fff'}, box);
        el('span', {width: '34px', height: '4px', background: C.tape, display: 'block', transform: 'translateY(-10px)'}, row);
        el('span', {}, row, it.text);
      }
      return box;
    }
    if (n.t === 'compare') {
      const box = el('div', {marginTop: mt, borderTop: '1px solid ' + C.line}, parent);
      const h = el('div', {display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '28px', padding: '22px 0', fontFamily: 'Onest', fontSize: '28px', color: 'rgba(255,255,255,.62)', borderBottom: '1px solid ' + C.line}, box);
      el('span', {}, h, n.head[0]); el('span', {color: '#fff', fontWeight: 600}, h, n.head[1]);
      for (const [a, b] of n.rows) {
        const r = el('div', {display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '28px', padding: '28px 0', borderBottom: '1px solid ' + C.line, fontFamily: 'Onest', fontSize: '34px', lineHeight: '1.35', color: '#fff'}, box);
        el('span', {color: 'rgba(255,255,255,.55)', textDecoration: 'line-through', textDecorationColor: rgba(C.steel, 0.7)}, r, a);
        el('span', {fontWeight: 500}, r, b);
      }
      return box;
    }
  };
  const story = (st) => {
    const f = el('div', {position: 'relative', width: S.W + 'px', height: S.H + 'px', overflow: 'hidden', color: '#fff', fontFamily: 'Onest',
      background: st.bg === 'radial' ? `radial-gradient(90% 55% at 88% 0%, ${C.glow} 0%, ${C.graphite} 62%)` : C.graphite});
    f.dataset.id = st.id;
    const after = [];
    for (const n of st.nodes) {
      if (n.t === 'img') {
        el('div', {position: 'absolute', left: n.x + 'px', top: n.y + 'px', width: n.w + 'px', height: n.h + 'px', borderRadius: (n.r || 0) + 'px', overflow: 'hidden',
          background: `${n.fill || 'transparent'} url(img/${n.key}.jpg) center/cover no-repeat`, border: n.stroke ? `${n.stroke.w}px solid ${n.stroke.color}` : 'none',
          boxShadow: n.shadow ? '0 40px 90px rgba(0,0,0,.55)' : 'none'}, f);
      } else if (n.t === 'grad') {
        el('div', {position: 'absolute', inset: 0, background: `linear-gradient(180deg, ${n.stops.map(([p, c, a]) => `${rgba(c, a)} ${p * 100}%`).join(', ')})`}, f);
      } else if (n.t === 'header') {
        const h = el('div', {position: 'absolute', left: S.PADX + 'px', right: S.PADX + 'px', top: '232px', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
          fontSize: '30px', color: `rgba(255,255,255,${n.alpha})`, textShadow: n.shadow ? '0 2px 12px rgba(0,0,0,.6)' : 'none'}, f);
        el('span', {}, h, n.rubric); el('span', {}, h, n.day);
      } else if (n.t === 'tape') {
        el('div', {position: 'absolute', left: S.PADX + 'px', top: '288px', width: '120px', height: '4px', background: C.tape}, f);
      } else if (n.t === 'stack') {
        const s = el('div', {position: 'absolute', left: n.x + 'px', width: n.w + 'px', top: n.y + 'px'}, f);
        n.children.forEach((c, i) => { const e = child(c, s); if (i === 0 && e) e.style.marginTop = '0px'; });
        after.push(() => { const h = s.offsetHeight; s.style.top = (n.lift ? Math.max(n.y - n.lift, Math.min(n.y, S.H - 390 - h)) : n.y) + 'px'; });
      } else if (n.t === 'pair') {
        const g = el('div', {position: 'absolute', left: n.x + 'px', top: n.y + 'px', width: n.w + 'px', display: 'grid', gap: n.gap + 'px'}, f);
        for (const b of n.boxes) {
          const box = el('div', {position: 'relative', height: b.h + 'px', borderRadius: b.r + 'px', overflow: 'hidden', border: `${b.stroke.w}px solid ${b.stroke.color}`,
            background: `url(img/${b.key}.jpg) center/cover`}, g);
          el('span', {position: 'absolute', left: '18px', top: '16px', padding: '6px 14px', borderRadius: '4px', fontSize: '26px', fontWeight: 600,
            background: rgba(b.label.bg, b.label.alpha), color: b.label.color}, box, b.label.text);
        }
      } else if (n.t === 'logo') {
        el('img', {position: 'absolute', left: S.PADX + 'px', bottom: '300px', width: S.logo.w + 'px', height: S.logo.h + 'px'}, f).src = 'brand/melbus-white.svg';
      } else if (n.t === 'mark') {
        el('img', {position: 'absolute', left: n.x + 'px', top: n.y + 'px', width: n.w + 'px', height: n.h + 'px'}, f).src = 'brand/mark-white.svg';
      } else if (n.t === 'ai') {
        el('div', {position: 'absolute', right: S.PADX + 'px', bottom: '304px', fontSize: '24px', color: 'rgba(255,255,255,.6)', letterSpacing: '0.3px'}, f, n.text);
      }
    }
    return {f, after};
  };
  const root = document.getElementById('root');
  const all = S.stories[L].map((st) => { const r = story(st); root.appendChild(r.f); return r; });
  document.fonts.ready.then(() => { all.forEach((r) => r.after.forEach((fn) => fn())); document.body.dataset.ready = '1'; });
})();
