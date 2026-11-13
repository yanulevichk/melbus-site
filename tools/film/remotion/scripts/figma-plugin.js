// ===== Импортёр сторис MELBUS в Figma (код плагина; SPEC, METRICS, IMG вставляет сборка выше) =====
// Что создаётся: страницы «Сторис PL/RU/UK/EN», «Актуальное», «⚙︎ Компоненты»; на странице языка — разделы по главам,
// в разделе — дни (ряд) × время (09:00, 13:00, 19:00). Каждая сторис — фрейм 1080×1920 с живым текстом в автолейауте.

const W = SPEC.W, H = SPEC.H, PADX = SPEC.PADX, TW = W - PADX * 2;
const BOTTOM = H - 390; // текст не опускается ниже — там логотип и поле ответа Instagram
const C = SPEC.colors;
const COL = (hex) => ({r: parseInt(hex.slice(1, 3), 16) / 255, g: parseInt(hex.slice(3, 5), 16) / 255, b: parseInt(hex.slice(5, 7), 16) / 255});
const solid = (hex, a = 1) => ({type: 'SOLID', color: COL(hex), opacity: a});
const shadow = (y, blur, a) => ({type: 'DROP_SHADOW', color: {r: 0, g: 0, b: 0, a}, offset: {x: 0, y}, radius: blur, spread: 0, visible: true, blendMode: 'NORMAL'});

// ---------- шрифты: Unbounded / Onest (есть в Figma из Google Fonts); если нет — Inter ----------
const WANT = {U200: ['Unbounded', 'ExtraLight'], U300: ['Unbounded', 'Light'], O400: ['Onest', 'Regular'], O500: ['Onest', 'Medium'], O600: ['Onest', 'SemiBold']};
const INTER = {U200: 'Extra Light', U300: 'Light', O400: 'Regular', O500: 'Medium', O600: 'Semi Bold'};
const F = {};
const norm = (s) => s.toLowerCase().replace(/[\s_-]/g, '');
let missingFonts = [];
async function resolveFonts() {
  const list = await figma.listAvailableFontsAsync();
  const find = (family, style) => list.find((f) => f.fontName.family === family && norm(f.fontName.style) === norm(style));
  for (const [k, [family, style]] of Object.entries(WANT)) {
    const hit = find(family, style) || find('Inter', INTER[k]) || find('Inter', 'Regular');
    if (!find(family, style)) missingFonts.push(`${family} ${style}`);
    F[k] = hit.fontName;
  }
  await figma.loadFontAsync({family: 'Inter', style: 'Regular'});
  for (const f of Object.values(F)) await figma.loadFontAsync(f);
}

// ---------- стили цветов (меняете стиль — меняется во всех сторис) ----------
const ST = {};
async function makeStyles() {
  const defs = [
    ['graphite', 'MELBUS/Графит', C.graphite, 1], ['tape', 'MELBUS/Бирюза (скотч)', C.tape, 1], ['white', 'MELBUS/Белый', '#FFFFFF', 1],
    ['w82', 'MELBUS/Текст 82%', '#FFFFFF', 0.82], ['w78', 'MELBUS/Шапка 78%', '#FFFFFF', 0.78], ['w75', 'MELBUS/Шапка видео 75%', '#FFFFFF', 0.75],
    ['w62', 'MELBUS/Подпись 62%', '#FFFFFF', 0.62], ['w60', 'MELBUS/Визуализация 60%', '#FFFFFF', 0.6], ['w55', 'MELBUS/Зачёркнуто 55%', '#FFFFFF', 0.55],
    ['line', 'MELBUS/Линии', C.line, 1],
  ];
  const existing = await figma.getLocalPaintStylesAsync();
  for (const [k, name, hex, a] of defs) {
    let s = existing.find((x) => x.name === name);
    if (!s) { s = figma.createPaintStyle(); s.name = name; }
    s.paints = [solid(hex, a)];
    ST[k] = s;
  }
}
const styleKey = (hex, a = 1) => {
  if (hex === C.tape && a === 1) return 'tape';
  if (hex === C.graphite && a === 1) return 'graphite';
  if (hex === C.line) return 'line';
  if (hex.toUpperCase() === '#FFFFFF') return {1: 'white', 0.82: 'w82', 0.78: 'w78', 0.75: 'w75', 0.62: 'w62', 0.6: 'w60', 0.55: 'w55'}[a];
};
async function paint(node, hex, a = 1) {
  node.fills = [solid(hex, a)];
  const k = styleKey(hex, a);
  if (k && ST[k]) await node.setFillStyleIdAsync(ST[k].id);
}

// ---------- примитивы ----------
async function text(n, width) {
  const t = figma.createText();
  t.fontName = F[n.font];
  t.characters = n.text;
  t.fontSize = n.size;
  if (n.lh) t.lineHeight = {unit: 'PERCENT', value: n.lh};
  if (n.ls) t.letterSpacing = {unit: 'PERCENT', value: n.ls};
  if (n.strike) t.textDecoration = 'STRIKETHROUGH';
  await paint(t, n.color, n.alpha ?? 1);
  t.name = n.name;
  if (width) { t.resize(width, Math.max(1, t.height)); t.textAutoResize = 'HEIGHT'; } else t.textAutoResize = 'WIDTH_AND_HEIGHT';
  return t;
}
function auto(name, dir, width) {
  const f = figma.createFrame();
  f.name = name;
  f.layoutMode = dir;
  f.fills = [];
  f.clipsContent = false;
  if (width) { f.resize(width, 10); f.layoutSizingHorizontal = 'FIXED'; }
  else f.layoutSizingHorizontal = 'HUG';
  f.layoutSizingVertical = 'HUG';
  return f;
}
const fill = (node) => { node.layoutSizingHorizontal = 'FILL'; };
function lineSides(f, top, bottom) {
  f.strokes = [solid(C.line)];
  f.strokeAlign = 'INSIDE';
  f.strokeTopWeight = top; f.strokeBottomWeight = bottom; f.strokeLeftWeight = 0; f.strokeRightWeight = 0;
}

// ---------- блоки текста ----------
async function bulletsNode(n) {
  const box = auto(n.name, 'VERTICAL', TW);
  box.itemSpacing = n.gap;
  let i = 0;
  for (const it of n.items) {
    i++;
    const row = auto(`Пункт ${i}`, 'HORIZONTAL', TW);
    row.counterAxisAlignItems = 'MIN';
    const lhPx = it.size * 1.35;
    const base = (lhPx - (METRICS.asc + METRICS.desc) * it.size) / 2 + METRICS.asc * it.size; // базовая линия первой строки
    const dashBox = figma.createFrame();
    dashBox.name = 'Черта'; dashBox.fills = []; dashBox.clipsContent = false;
    dashBox.resize(56, Math.round(lhPx));
    const dash = figma.createRectangle();
    dash.name = 'Скотч'; dash.resize(34, 4); dash.x = 0; dash.y = Math.round(base - 14);
    await paint(dash, C.tape);
    dashBox.appendChild(dash);
    row.appendChild(dashBox);
    const t = await text({t: 'text', name: 'Текст пункта', text: it.text, font: 'O400', size: it.size, lh: 135, color: '#FFFFFF'}, TW - 56);
    row.appendChild(t); fill(t);
    box.appendChild(row); fill(row);
  }
  return box;
}
async function compareNode(n) {
  const box = auto(n.name, 'VERTICAL', TW);
  lineSides(box, 1, 0);
  const row = async (name, a, b, head) => {
    const r = auto(name, 'HORIZONTAL', TW);
    r.itemSpacing = 28; r.paddingTop = r.paddingBottom = head ? 22 : 28;
    lineSides(r, 0, 1);
    const ta = await text(head ? {t: 'text', name: 'Как у других', text: a, font: 'O400', size: 28, color: '#FFFFFF', alpha: 0.62}
      : {t: 'text', name: 'Как у других', text: a, font: 'O400', size: 34, lh: 135, color: '#FFFFFF', alpha: 0.55, strike: true}, (TW - 28) / 2);
    const tb = await text(head ? {t: 'text', name: 'Как у MELBUS', text: b, font: 'O600', size: 28, color: '#FFFFFF'}
      : {t: 'text', name: 'Как у MELBUS', text: b, font: 'O500', size: 34, lh: 135, color: '#FFFFFF'}, (TW - 28) / 2);
    r.appendChild(ta); r.appendChild(tb); fill(ta); fill(tb);
    box.appendChild(r); fill(r);
  };
  await row('Заголовки', n.head[0], n.head[1], true);
  let i = 0;
  for (const [a, b] of n.rows) await row(`Строка ${++i}`, a, b, false);
  return box;
}
async function childNode(n) {
  if (n.t === 'text') return text(n, TW);
  if (n.t === 'bullets') return bulletsNode(n);
  if (n.t === 'compare') return compareNode(n);
  throw new Error('неизвестный блок ' + n.t);
}
// отступы между блоками: автолейаут даёт один отступ на рамку, поэтому разные отступы — вложенными рамками
async function stackNode(name, kids) {
  const f = auto(name, 'VERTICAL', TW);
  f.appendChild(await childNode(kids[0])); fill(f.children[0]);
  const rest = kids.slice(1);
  if (rest.length) {
    f.itemSpacing = rest[0].mt || 0;
    if (rest.every((k) => (k.mt || 0) === (rest[0].mt || 0))) {
      for (const k of rest) { const c = await childNode(k); f.appendChild(c); fill(c); }
    } else {
      const sub = await stackNode(rest.map((k) => k.name).join(' + '), [Object.assign({}, rest[0], {mt: 0}), ...rest.slice(1)]);
      f.appendChild(sub); fill(sub);
    }
  }
  return f;
}

// ---------- компоненты ----------
const IH = {};
const imageFill = (key, mode = 'FILL') => ({type: 'IMAGE', scaleMode: mode, imageHash: IH[key]});
let LOGO, MARK;
function imageComponent(name, key, w, h) {
  const c = figma.createComponent();
  c.name = name; c.resize(w, h); c.fills = [imageFill(key, 'FIT')]; c.clipsContent = false;
  return c;
}

// ---------- сторис ----------
async function storyFrame(st) {
  const f = figma.createFrame();
  f.name = st.name;
  f.resize(W, H);
  f.clipsContent = true;
  if (st.bg === 'radial') {
    f.fills = [{type: 'GRADIENT_RADIAL', gradientTransform: [[0.5 / 0.9, 0, 0.5 - 0.88 * 0.5 / 0.9], [0, 0.5 / 0.55, 0.5]],
      gradientStops: [{position: 0, color: Object.assign(COL(C.glow), {a: 1})}, {position: 0.62, color: Object.assign(COL(C.graphite), {a: 1})}, {position: 1, color: Object.assign(COL(C.graphite), {a: 1})}]}];
  } else {
    // видео: фон отдельным слоем — его и кадр из ролика можно скрыть и выгрузить PNG-подпись поверх ролика
    f.fills = [];
    const bg = figma.createRectangle(); bg.name = 'Фон (скрыть для PNG-подписи)'; bg.resize(W, H);
    await paint(bg, C.graphite); f.appendChild(bg);
  }
  for (const n of st.nodes) {
    if (n.t === 'img') {
      const r = figma.createRectangle();
      r.name = n.name; r.resize(n.w, n.h); r.x = n.x; r.y = n.y;
      r.fills = n.fill ? [solid(n.fill), imageFill(n.key)] : [imageFill(n.key)];
      if (n.r) r.cornerRadius = n.r;
      if (n.stroke) { r.strokes = [solid(n.stroke.color)]; r.strokeWeight = n.stroke.w; r.strokeAlign = 'OUTSIDE'; }
      if (n.shadow) r.effects = [shadow(40, 90, 0.55)];
      f.appendChild(r);
    } else if (n.t === 'grad') {
      const r = figma.createRectangle();
      r.name = n.name; r.resize(W, H);
      r.fills = [{type: 'GRADIENT_LINEAR', gradientTransform: [[0, 1, 0], [-1, 0, 1]],
        gradientStops: n.stops.map(([p, c, a]) => ({position: p, color: Object.assign(COL(c), {a})}))}];
      f.appendChild(r);
    } else if (n.t === 'header') {
      const h = auto('Шапка', 'HORIZONTAL', TW);
      h.primaryAxisAlignItems = 'SPACE_BETWEEN';
      for (const [name, s] of [['Рубрика', n.rubric], ['День', n.day]]) {
        const t = await text({t: 'text', name, text: s, font: 'O400', size: 30, color: '#FFFFFF', alpha: n.alpha});
        if (n.shadow) t.effects = [shadow(2, 12, 0.6)];
        h.appendChild(t);
      }
      f.appendChild(h); h.x = PADX; h.y = 232;
    } else if (n.t === 'tape') {
      const r = figma.createRectangle(); r.name = 'Линия скотча'; r.resize(120, 4); r.x = PADX; r.y = 288;
      await paint(r, C.tape); f.appendChild(r);
    } else if (n.t === 'stack') {
      const s = await stackNode(n.name, n.children);
      f.appendChild(s);
      s.x = n.x;
      s.y = n.lift ? Math.max(n.y - n.lift, Math.min(n.y, BOTTOM - s.height)) : n.y;
    } else if (n.t === 'pair') {
      const g = auto(n.name, 'VERTICAL', n.w);
      g.itemSpacing = n.gap;
      let i = 0;
      for (const b of n.boxes) {
        const box = figma.createFrame();
        box.name = i === 0 ? 'Черновик' : 'Готовый кадр';
        box.resize(n.w, b.h); box.cornerRadius = b.r; box.clipsContent = true;
        box.fills = [imageFill(b.key)];
        box.strokes = [solid(b.stroke.color)]; box.strokeWeight = b.stroke.w; box.strokeAlign = 'INSIDE';
        const lab = auto('Метка', 'HORIZONTAL');
        lab.paddingTop = lab.paddingBottom = 6; lab.paddingLeft = lab.paddingRight = 14; lab.cornerRadius = 4;
        await paint(lab, b.label.bg, b.label.alpha);
        const t = await text({t: 'text', name: 'Текст метки', text: b.label.text, font: 'O600', size: 26, color: b.label.color});
        lab.appendChild(t); box.appendChild(lab); lab.x = 18; lab.y = 16;
        g.appendChild(box);
        i++;
      }
      f.appendChild(g); g.x = n.x; g.y = n.y;
    } else if (n.t === 'logo') {
      const l = LOGO.createInstance(); l.name = 'Логотип'; f.appendChild(l);
      l.x = PADX; l.y = H - 300 - SPEC.logo.h;
    } else if (n.t === 'mark') {
      const m = MARK.createInstance(); m.name = 'Знак MELBUS'; f.appendChild(m);
      m.resize(n.w, n.h); m.x = n.x; m.y = n.y;
    } else if (n.t === 'ai') {
      const t = await text({t: 'text', name: 'Визуализация', text: n.text, font: 'O400', size: 24, ls: 1.25, color: '#FFFFFF', alpha: 0.6}, 400);
      t.textAlignHorizontal = 'RIGHT';
      f.appendChild(t); t.x = W - PADX - 400; t.y = H - 304 - t.height;
    } else if (n.t === 'sticker') {
      const r = figma.createRectangle();
      r.name = n.label; r.resize(n.w, n.h); r.x = n.x; r.y = n.y; r.cornerRadius = 24;
      r.fills = [solid(C.tape, 0.06)]; r.strokes = [solid(C.tape, 0.8)]; r.strokeWeight = 3; r.dashPattern = [16, 10];
      f.appendChild(r); r.visible = false; r.locked = true;
    }
  }
  return f;
}

// ---------- раскладка страницы языка ----------
const COLW = W + 100, ROWH = H + 320, PAD = 160;
async function langPage(page, lang) {
  await figma.setCurrentPageAsync(page);
  const list = SPEC.stories[lang];
  let y0 = 0;
  const info = await text({t: 'text', name: 'Как пользоваться', font: 'O400', size: 40, lh: 140, color: '#FFFFFF', text: [
    `MELBUS · Сторис «Дневник запуска» · ${SPEC.langNames[lang]} · 16.11–13.12.2026`,
    'Каждая сторис — фрейм 1080×1920. Текст живой: двойной клик и правьте; блок «Текст» — автолейаут, растёт вниз (если стал длинным — поднимите блок, чтобы не задеть логотип).',
    'Не опускайте текст ниже ~1530 px и не ставьте важное выше ~250 px: там поле ответа и имя профиля Instagram.',
    'Цвета — стили «MELBUS/…» (правка стиля меняет все сторис). Логотип — компонент на странице «⚙︎ Компоненты».',
    'Выгрузка: выделить фреймы → Export → JPG/PNG 1x (1080×1920).',
    'ВИДЕО-сторис: подпись делается здесь, ролик — отдельно. Скройте слои «Фон…» и «Кадр из ролика…» → Export PNG (прозрачный) → наложите на ролик в CapCut/Instagram. Ролики: marketing/stories/2026-11/hf/ и public/video/.',
    'Скрытые слои «Место для стикера…» показывают, где оставить место для опроса/вопроса в Instagram.',
    'ИИ-кадры помечены «Визуализация» — при публикации включите метку Instagram «Создано с помощью ИИ».',
  ].join('\n')}, 3200);
  const card = auto('О файле', 'VERTICAL', 3400);
  card.paddingTop = card.paddingBottom = 60; card.paddingLeft = card.paddingRight = 100; card.cornerRadius = 40;
  await paint(card, C.graphite);
  card.appendChild(info); fill(info);
  card.x = 0; card.y = -card.height - 200;

  for (const ch of SPEC.chapters) {
    const sec = figma.createSection();
    sec.name = ch.name;
    const days = ch.days[1] - ch.days[0] + 1;
    sec.resizeWithoutConstraints(PAD * 2 + 3 * COLW - 100, PAD + days * ROWH);
    sec.x = 0; sec.y = y0;
    for (let d = ch.days[0]; d <= ch.days[1]; d++) {
      const rowY = PAD + (d - ch.days[0]) * ROWH + 60;
      const dayStories = list.filter((s) => s.day === d);
      const lab = await text({t: 'text', name: `Подпись дня ${d}`, text: `${dayStories[0].dayLabel}   ·   09:00 история   ·   13:00 вовлечение   ·   19:00 призыв`, font: 'O600', size: 56, color: C.graphite});
      sec.appendChild(lab); lab.x = PAD; lab.y = rowY - 110;
      for (const st of dayStories) {
        const fr = await storyFrame(st);
        sec.appendChild(fr);
        fr.x = PAD + (st.slot - 1) * COLW; fr.y = rowY;
        if (st.video) {
          const note = await text({t: 'text', name: 'Заметка: видео', font: 'O400', size: 30, lh: 135, color: C.graphite,
            text: `▶ Видео ${st.video.seconds} с · ролик: ${st.video.file}. Для подписи поверх ролика: скрыть «Фон…» и «Кадр из ролика…» → Export PNG.`}, W);
          sec.appendChild(note); note.x = fr.x; note.y = rowY + H + 24;
        }
      }
      figma.notify(`MELBUS ${lang.toUpperCase()}: день ${d} из 28`, {timeout: 800});
    }
    y0 += PAD + days * ROWH + 400;
  }
}

async function highlightsPage(page) {
  await figma.setCurrentPageAsync(page);
  let i = 0;
  for (const h of SPEC.highlights) {
    const f = figma.createFrame();
    f.name = h.name; f.resize(W, H); f.fills = [imageFill(h.key)];
    f.x = i * (W + 100); f.y = 0;
    const t = await text({t: 'text', name: 'Названия в Instagram', font: 'O400', size: 36, lh: 140, color: '#FFFFFF',
      text: SPEC.langs.map((l) => `${l.toUpperCase()}: ${h.titles[l]}`).join('\n')}, W);
    t.x = f.x; t.y = H + 40;
    i++;
  }
  const note = await text({t: 'text', name: 'Как пользоваться', font: 'O400', size: 40, lh: 140, color: '#FFFFFF',
    text: 'Обложки «Актуального» (без текста, одни на все языки). Названия задаются в Instagram — подписи под обложками.'}, 3000);
  note.x = 0; note.y = -200;
}

// ---------- запуск ----------
async function main() {
  figma.notify('MELBUS: собираю сторис… это займёт 1–3 минуты', {timeout: 5000});
  await resolveFonts();
  for (const [k, b64] of Object.entries(IMG)) IH[k] = figma.createImage(figma.base64Decode(b64)).hash;
  await makeStyles();

  // первая пустая страница нового файла — переиспользуем
  const first = figma.root.children[0];
  await first.loadAsync();
  const pages = [];
  const newPage = (name) => {
    if (pages.length === 0 && first.children.length === 0) { first.name = name; pages.push(first); return first; }
    const p = figma.createPage(); p.name = name; pages.push(p); return p;
  };
  const langPages = SPEC.langs.map((l) => newPage(`Сторис ${l.toUpperCase()}`));
  const hlPage = newPage('Актуальное (обложки)');
  const compPage = newPage('⚙︎ Компоненты');

  await figma.setCurrentPageAsync(compPage);
  LOGO = imageComponent('Логотип MELBUS (белый)', 'logo', SPEC.logo.w, SPEC.logo.h);
  MARK = imageComponent('Знак MELBUS (белый)', 'mark', 460, 460 * 657 / 672);
  LOGO.x = 0; LOGO.y = 0; MARK.x = 400; MARK.y = 0;
  const cnote = await text({t: 'text', name: 'Заметка', font: 'O400', size: 28, lh: 140, color: '#FFFFFF',
    text: 'Компоненты: логотип и знак (картинкой высокого разрешения — оригинал в векторе: public/brand/*.svg). Замените их здесь — поменяются во всех сторис.'}, 900);
  cnote.x = 0; cnote.y = 520;

  for (let i = 0; i < SPEC.langs.length; i++) await langPage(langPages[i], SPEC.langs[i]);
  await highlightsPage(hlPage);

  await figma.setCurrentPageAsync(langPages[0]);
  figma.viewport.scrollAndZoomIntoView(langPages[0].children);
  const n = SPEC.langs.reduce((a, l) => a + SPEC.stories[l].length, 0);
  figma.closePlugin(`Готово: ${n} сторис на ${SPEC.langs.length} языках.` + (missingFonts.length ? ` Нет шрифтов: ${missingFonts.join(', ')} — стоит Inter, установите их и замените.` : ''));
}
main().catch((e) => { console.error(e); figma.closePlugin('Ошибка: ' + (e && e.message ? e.message : e)); });
