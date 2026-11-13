// Описание всех сторис для Figma (та же вёрстка, что в Story.tsx, но слоями): тексты, шрифты, размеры, картинки.
//   npx tsx scripts/figma-spec.ts            → out/figma/spec.json + out/figma/img/*.jpg|png
// Дальше: node scripts/figma-build.cjs (HTML-превью для сверки и плагин-импортёр для Figma).
import {execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import {existsSync, mkdirSync, readFileSync, rmSync, writeFileSync} from 'node:fs';
import {STORIES, RUBRICS, DAY_WORD, PAIR_LABELS, HL, TIMES, dateOf, VIDEO_OPTS, type Story} from '../src/social/stories';
import {CAROUSEL, COMMON, COVER_LINE, fitSize, HEADLINE, HOURS, LANGS, PRICE_FINAL, WHERE, type Lang} from '../src/social/texts';
import {COVER_BG, COVERS, coverTitle} from '../src/social/postdata';
import {fitWrap} from '../src/social/fit';
import {noHours} from '../../../../src/content/prices';
import media from '../src/social/stories-media.json';

const OUT = 'out/figma', IMG = `${OUT}/img`, PUB = 'public';
rmSync(OUT, {recursive: true, force: true});
mkdirSync(IMG, {recursive: true});

const W = 1080, H = 1920, PADX = 84, TW = W - PADX * 2;
const TAPE = '#14DCD5', GRAPHITE = '#10161D', LINE = '#2A3540', STEEL = '#8F9AA7';
const INTERACTIVE: Record<string, string> = {poll: 'Опрос', quiz: 'Викторина', question: 'Вопрос', slider: 'Шкала-эмодзи'};
const CH = ['', 'Глава 1 · Знакомство', 'Глава 2 · Цена без часов', 'Глава 3 · Детали, которые видно', 'Глава 4 · Как мы сняли фильм + запись на переезд'];
const WD = ['вс', 'пн', 'вт', 'ср', 'чт', 'пт', 'сб'];

// ---------- картинки: обрезаем под рамку заранее (как object-fit: cover), Figma ставит их «Fill» без сдвигов ----------
const images: Record<string, {w: number; h: number; file: string; from: string}> = {};
const ff = (args: string[]) => execFileSync('ffmpeg', ['-loglevel', 'error', '-y', ...args]);
const cover = (src: string, w: number, h: number, pos: 'center' | 'top' | number = 'center', at?: number): string => {
  const key = createHash('sha1').update(`${src}|${w}x${h}|${pos}|${at ?? ''}`).digest('hex').slice(0, 12);
  if (images[key]) return key;
  const file = `${IMG}/${key}.jpg`;
  const px = typeof pos === 'number' ? `(iw-${w})*${pos / 100}` : `(iw-${w})/2`;
  const vf = `scale=${w}:${h}:force_original_aspect_ratio=increase:flags=lanczos,crop=${w}:${h}:${px}:${pos === 'top' ? 0 : `(ih-${h})/2`}`;
  ff([...(at !== undefined ? ['-ss', String(at)] : []), '-i', `${PUB}/${src}`, '-frames:v', '1', '-vf', vf, '-q:v', '4', file]);
  images[key] = {w, h, file, from: src};
  return key;
};

// ---------- узлы ----------
type Font = 'U200' | 'U300' | 'O400' | 'O500' | 'O600';
type Txt = {t: 'text'; name: string; text: string; font: Font; size: number; lh?: number; ls?: number; color: string; alpha?: number; strike?: boolean; mt?: number; maxW?: number};
type Bullets = {t: 'bullets'; name: string; gap: number; mt?: number; items: {text: string; size: number}[]};
type Compare = {t: 'compare'; name: string; mt?: number; head: [string, string]; rows: [string, string][]};
type Bar = {t: 'bar'; name: string; w: number; h: number; color: string; mt?: number};
type LogoC = {t: 'logo'; name: string; w: number; mt?: number};
type Child = Txt | Bullets | Compare | Bar | LogoC;
type Node =
  | {t: 'img'; name: string; key: string; x: number; y: number; w: number; h: number; r?: number; stroke?: {color: string; w: number}; shadow?: boolean; fill?: string; note?: string}
  | {t: 'grad'; name: string; stops: [number, string, number][]; dir?: 'h'}
  | {t: 'stack'; name: string; x: number; y: number; w: number; lift: number; children: Child[]; anchor?: 'bottom' | 'center'}
  | {t: 'atext'; name: string; text: string; font: Font; size: number; lh?: number; ls?: number; color: string; alpha?: number; x: number; y: number; w: number; align?: 'RIGHT'}
  | {t: 'logoAt'; x: number; y: number; w: number}
  | {t: 'pair'; name: string; x: number; y: number; w: number; gap: number; boxes: {key: string; h: number; r: number; stroke: {color: string; w: number}; label: {text: string; bg: string; alpha: number; color: string}}[]}
  | {t: 'header'; rubric: string; day: string; alpha: number; shadow: boolean}
  | {t: 'tape'}
  | {t: 'logo'}
  | {t: 'mark'; x: number; y: number; w: number; h: number}
  | {t: 'ai'; text: string; x?: number; top?: number; bot?: number; size?: number} // x — правый край; top/bot — верх/низ надписи
  | {t: 'sticker'; label: string; x: number; y: number; w: number; h: number};

const title = (text: string, max: number, lines: number, mt = 0): Txt =>
  ({t: 'text', name: 'Заголовок', text, font: 'U200', size: fitWrap(text, max, TW, lines, 0.66), lh: 102, ls: -4.5, color: '#FFFFFF', mt});
const body = (text: string | undefined, mt = 36, opts: Partial<Txt> = {}): Txt[] => text ? [{t: 'text', name: 'Подзаголовок', text,
  font: 'O400', size: fitWrap(text, 42, TW, 5, 0.52, 30), lh: 145, color: '#FFFFFF', alpha: 0.82, mt, ...opts}] : [];
const bullets = (items: string[], compact: boolean): Bullets =>
  ({t: 'bullets', name: 'Пункты', gap: compact ? 22 : 34, mt: compact ? 36 : 56, items: items.map((text) => ({text, size: fitWrap(text, 46, TW - 56, 2, 0.52, 32)}))});

const bgOf = (s: Story): {src?: string; ai: boolean} => {
  if (s.real && (media.real as string[]).includes(s.id)) return {src: `stories/real/${s.id}.jpg`, ai: false};
  if (s.gpt && (media.gpt as string[]).includes(s.gpt)) return {src: `stories/gpt/${s.gpt}.jpg`, ai: true};
  return {src: s.img, ai: !!s.ai};
};

const ru = (s: Story) => RUBRICS[s.rubric].ru;
const frameName = (s: Story) => {
  const d = dateOf(s.day);
  return `${s.id} · ${String(d.getUTCDate()).padStart(2, '0')}.${String(d.getUTCMonth() + 1).padStart(2, '0')} ${TIMES[s.slot]} · ${ru(s)}${s.kind === 'video' ? ' · ВИДЕО' : ''}`;
};

const story = (s: Story, lang: Lang) => {
  const t = s.title[lang], b = s.body?.[lang];
  const sticky = !!(s.sticker && INTERACTIVE[s.sticker.t]);
  const bg = bgOf(s);
  const nodes: Node[] = [];
  let ai = false, frameBg: 'radial' | 'graphite' = 'radial';
  const head = (alpha: number, shadow: boolean) => nodes.push({t: 'header', rubric: RUBRICS[s.rubric][lang], day: `${DAY_WORD[lang]} ${s.day}`, alpha, shadow}, {t: 'tape'});
  let video: {file: string; seconds: number; vertical: boolean} | undefined;

  if (s.kind === 'video') {
    const o = VIDEO_OPTS[s.id] ?? {};
    const vertical = !!o.vertical, from = o.from ?? 0;
    video = {file: s.video!.replace('stories/', ''), seconds: o.seconds ?? 8, vertical};
    frameBg = 'graphite';
    if (vertical) {
      nodes.push({t: 'img', name: 'Кадр из ролика (скрыть для PNG-подписи)', key: cover(s.video!, W, H, 'center', from + 2), x: 0, y: 0, w: W, h: H, note: video.file});
      nodes.push({t: 'grad', name: 'Затемнение', stops: [[0, GRAPHITE, 0.7], [0.2, GRAPHITE, 0], [0.55, GRAPHITE, 0], [0.8, GRAPHITE, 0.92]]});
    } else {
      nodes.push({t: 'img', name: 'Кадр из ролика (скрыть для PNG-подписи)', key: cover(s.video!, W, W, 'center', from + 2), x: 0, y: 330, w: W, h: W, note: video.file});
      nodes.push({t: 'grad', name: 'Затемнение', stops: [[0, GRAPHITE, 1], [0.22, GRAPHITE, 0], [0.48, GRAPHITE, 0], [0.6, GRAPHITE, 0.85], [0.7, GRAPHITE, 1]]});
    }
    head(0.75, false);
    nodes.push({t: 'stack', name: 'Текст', x: PADX, y: 1180, w: TW, lift: 220, children: [title(t, 88, 3), ...body(b, 24)]});
    ai = !!s.ai;
  } else if (s.kind === 'photo' || ((s.kind === 'text' || s.kind === 'list') && bg.src && (s.real || s.gpt) && bg.src !== s.img)) {
    if (bg.src) nodes.push({t: 'img', name: 'Фото', key: cover(bg.src, W, 1180), x: 0, y: 0, w: W, h: 1180});
    nodes.push({t: 'grad', name: 'Затемнение', stops: s.kind === 'list'
      ? [[0, GRAPHITE, 0.92], [0.14, GRAPHITE, 0.55], [0.28, GRAPHITE, 0], [0.36, GRAPHITE, 0], [0.51, GRAPHITE, 1]]
      : [[0, GRAPHITE, 0.92], [0.14, GRAPHITE, 0.55], [0.3, GRAPHITE, 0], [0.46, GRAPHITE, 0], [0.61, GRAPHITE, 1]]});
    head(0.78, true);
    const kids: Child[] = [title(t, 90, 3)];
    if (s.kind === 'list' && s.items) kids.push(bullets(s.items.map((x) => x[lang]), true)); else kids.push(...body(b, 28));
    nodes.push({t: 'stack', name: 'Текст', x: PADX, y: 1080, w: TW, lift: s.kind === 'list' ? 280 : 200, children: kids});
    ai = bg.ai;
  } else if (s.kind === 'number') {
    const big = s.big![lang];
    head(0.78, true);
    nodes.push({t: 'stack', name: 'Текст', x: PADX, y: 520, w: TW, lift: 0, children: [
      {t: 'text', name: 'Цифра', text: big, font: 'U200', size: Math.min(300, Math.floor(TW / (0.7 * big.length))), lh: 100, ls: -6, color: '#FFFFFF'},
      {t: 'text', name: 'Заголовок', text: t, font: 'U300', size: fitWrap(t, 64, TW, 2, 0.66), ls: -3, color: TAPE, mt: 28},
      ...body(b, 48),
    ]});
  } else if (s.kind === 'shot' || s.kind === 'pair') {
    head(0.78, true);
    nodes.push({t: 'stack', name: 'Текст', x: PADX, y: 360, w: TW, lift: 0, children: [title(t, 74, 3), ...body(b, 22, {size: 34})]});
    if (s.kind === 'shot') {
      const h = sticky ? 560 : b ? 680 : 760;
      nodes.push({t: 'img', name: 'Скриншот сайта', key: cover(`stories/shots/${s.shot}-${lang}.jpg`, 720, h, 'top'), x: (W - 720) / 2, y: b ? 800 : 700, w: 720, h, r: 36, stroke: {color: LINE, w: 1}, shadow: true, fill: '#FFFFFF'});
    } else {
      nodes.push({t: 'pair', name: 'Черновик и готовый кадр', x: PADX, y: 690, w: TW, gap: 26, boxes: s.pair!.map((src, i) => ({
        key: cover(src, TW, 410), h: 410, r: 18, stroke: i === 1 ? {color: TAPE, w: 2} : {color: LINE, w: 1},
        label: {text: PAIR_LABELS[i][lang], bg: i === 1 ? TAPE : GRAPHITE, alpha: i === 1 ? 1 : 0.75, color: i === 1 ? GRAPHITE : '#FFFFFF'},
      }))});
      ai = true;
    }
  } else if (s.kind === 'logo') {
    head(0.78, true);
    nodes.push({t: 'mark', x: (W - 460) / 2, y: 470, w: 460, h: 460 * 657 / 672});
    nodes.push({t: 'stack', name: 'Текст', x: PADX, y: 1060, w: TW, lift: 0, children: [title(t, 86, 2), ...body(b)]});
  } else {
    head(0.78, true);
    const kids: Child[] = [title(t, sticky ? 92 : 108, sticky ? 4 : 5)];
    if (s.kind === 'compare') kids.push({t: 'compare', name: 'Сравнение', mt: 64, head: [noHours.them[lang], noHours.us[lang]], rows: noHours.rows.map(([a, c]) => [a[lang], c[lang]] as [string, string])});
    if (s.kind === 'list' && s.items) { kids.push(...body(b, 26, {color: TAPE, alpha: 1})); kids.push(bullets(s.items.map((x) => x[lang]), false)); }
    if (s.kind === 'text') kids.push(...body(b));
    nodes.push({t: 'stack', name: 'Текст', x: PADX, y: sticky ? 400 : s.kind === 'text' && !s.items ? 560 : 420, w: TW, lift: 0, children: kids});
  }
  if (sticky) nodes.push({t: 'sticker', label: `Место для стикера Instagram: ${INTERACTIVE[s.sticker!.t]} (скрыто)`, x: 140, y: 1080, w: 800, h: 420});
  nodes.push({t: 'logo'});
  if (ai) nodes.push({t: 'ai', text: COMMON.ai[lang]});
  const d = dateOf(s.day);
  return {id: s.id, day: s.day, slot: s.slot, name: frameName(s), kind: s.kind, bg: frameBg, video, nodes,
    dayLabel: `День ${s.day} · ${WD[d.getUTCDay()]} ${String(d.getUTCDate()).padStart(2, '0')}.${String(d.getUTCMonth() + 1).padStart(2, '0')}`};
};

const ORDER: Lang[] = ['pl', 'ru', 'uk', 'en'];
if (ORDER.some((l) => !LANGS.includes(l))) throw new Error('языки');
const stories = Object.fromEntries(ORDER.map((lang) => [lang, STORIES.map((s) => story(s, lang))]));

// ---------- посты профиля: обложки Reels, две карусели, превью ссылок и обложка Facebook ----------
const fr = (name: string, w: number, h: number, bg: string, nodes: Node[]) => ({name, w, h, bg, nodes});
const frameAt = (t: number) => `frames72/f${String(Math.round(t * 72)).padStart(5, '0')}.jpg`;
const posts = (lang: Lang) => {
  const ai = COMMON.ai[lang];
  // обложки Reels 1080×1920 (PostKit.ReelCover)
  const covers = COVERS.map((id, i) => {
    const bg = COVER_BG[id];
    const t = coverTitle(id).map((x) => x[lang]);
    const key = bg.img ? cover(bg.img, W, H, bg.pos ? parseFloat(bg.pos) : 'center') : cover(`clips/${bg.clip}`, W, H, 'center', bg.at);
    return fr(`Обложка ${String(i + 1).padStart(2, '0')} · Reels ${id}`, W, H, 'graphite', [
      {t: 'img', name: 'Кадр из ролика', key, x: 0, y: 0, w: W, h: H},
      {t: 'grad', name: 'Затемнение', stops: [[0, GRAPHITE, 0.35], [0.22, GRAPHITE, 0], [0.4, GRAPHITE, 0], [0.62, GRAPHITE, 0.86], [1, GRAPHITE, 0.96]]},
      {t: 'stack', name: 'Текст', x: 72, y: 1090, w: 936, lift: 0, children: [
        {t: 'bar', name: 'Линия скотча', w: 160, h: 5, color: TAPE},
        {t: 'text', name: 'Заголовок', text: t.join('\n'), font: 'U200', size: fitSize(t, 120, 936), lh: 95, ls: -5.5, color: '#FFFFFF', mt: 40},
      ]},
      {t: 'logoAt', x: 72, y: 1560, w: 240},
      {t: 'ai', text: ai, x: W - 72, top: 1572, size: 24},
    ]);
  });
  // карусель «Переезд за 6 шагов» 1080×1350 (Carousel.tsx)
  const steps = CAROUSEL.map(([t, x, n, titleL, textL], i) => {
    const title = titleL[lang], text = textL[lang], isCover = n === '';
    const kids: Child[] = [];
    if (!isCover) kids.push({t: 'text', name: 'Номер шага', text: n, font: 'U200', size: 220, lh: 80, ls: -6, color: '#FFFFFF'});
    kids.push({t: 'bar', name: 'Линия скотча', w: isCover ? 300 : 120, h: 4, color: TAPE, mt: isCover ? 0 : 28});
    kids.push({t: 'text', name: 'Заголовок', text: title, font: 'U200', size: fitSize(title.split('\n'), isCover ? 116 : 84, 952), lh: 95, ls: -5.5, color: '#FFFFFF', mt: 34});
    kids.push({t: 'text', name: 'Текст', text, font: 'O400', size: 36, lh: 145, color: '#FFFFFF', alpha: 0.84, mt: 28, maxW: 860});
    if (isCover) kids.push({t: 'text', name: 'Листайте', text: COMMON.swipe[lang], font: 'O400', size: 30, color: TAPE, mt: 40});
    return fr(`Слайд ${i + 1} · ${isCover ? 'обложка' : 'шаг ' + n}`, W, 1350, 'graphite', [
      {t: 'img', name: 'Кадр из фильма', key: cover(frameAt(t), W, 1350, x), x: 0, y: 0, w: W, h: 1350},
      {t: 'grad', name: 'Затемнение', stops: [[0, GRAPHITE, 0.55], [0.26, GRAPHITE, 0], [0.42, GRAPHITE, 0], [0.82, GRAPHITE, 0.92]]},
      {t: 'logoAt', x: 64, y: 60, w: 250},
      {t: 'atext', name: 'Счётчик', text: `${i + 1} / ${CAROUSEL.length}`, font: 'O400', size: 28, color: '#FFFFFF', alpha: 0.75, x: W - 64 - 300, y: 70, w: 300, align: 'RIGHT'},
      {t: 'stack', name: 'Текст', x: 64, y: 1350 - 110, w: 952, lift: 0, anchor: 'bottom', children: kids},
      {t: 'ai', text: ai, x: W - 64, bot: 1350 - 48, size: 20},
    ]);
  });
  // карусель «Мы не продаём часы» 1080×1350 (PostKit.CarouselHours)
  const nH = 2 + noHours.rows.length;
  const hourFrame = (i: number, name: string, top: number, kids: Child[]) => fr(`Слайд ${i + 1} · ${name}`, W, 1350, 'radial60', [
    {t: 'logoAt', x: 72, y: 64, w: 230},
    {t: 'atext', name: 'Счётчик', text: `${i + 1} / ${nH}`, font: 'O400', size: 28, color: '#FFFFFF', alpha: 0.7, x: W - 72 - 300, y: 74, w: 300, align: 'RIGHT'},
    {t: 'stack', name: 'Текст', x: 72, y: top, w: 936, lift: 0, children: kids},
    {t: 'atext', name: 'Подпись внизу', text: COMMON.noExtras[lang], font: 'O400', size: 26, color: '#FFFFFF', alpha: 0.55, x: 72, y: 1350 - 64 - 33, w: 936},
  ]);
  const hours = [
    hourFrame(0, 'обложка', 330, [
      {t: 'text', name: 'Заголовок', text: noHours.h2[lang], font: 'U200', size: fitWrap(noHours.h2[lang], 150, 936, 3, 0.66), lh: 95, ls: -6, color: '#FFFFFF'},
      {t: 'bar', name: 'Линия скотча', w: 300, h: 5, color: TAPE, mt: 56},
      {t: 'text', name: 'Подзаголовок', text: noHours.lead[lang], font: 'O400', size: 40, lh: 145, color: '#FFFFFF', alpha: 0.84, mt: 48, maxW: 900},
      {t: 'text', name: 'Листайте', text: COMMON.swipe[lang], font: 'O400', size: 30, color: TAPE, mt: 56},
    ]),
    ...noHours.rows.map(([a, c], k) => hourFrame(k + 1, `сравнение ${k + 1}`, 300, [
      {t: 'text', name: 'Как у других — подпись', text: noHours.them[lang], font: 'O400', size: 30, color: '#FFFFFF', alpha: 0.55},
      {t: 'text', name: 'Как у других', text: a[lang], font: 'O400', size: 52, lh: 130, color: '#FFFFFF', alpha: 0.5, strike: true, mt: 22},
      {t: 'bar', name: 'Разделитель', w: 936, h: 1, color: LINE, mt: 72},
      {t: 'text', name: 'Как у MELBUS — подпись', text: noHours.us[lang], font: 'O400', size: 30, color: TAPE, mt: 72},
      {t: 'text', name: 'Как у MELBUS', text: c[lang], font: 'U200', size: fitWrap(c[lang], 84, 936, 4, 0.66), lh: 105, ls: -4.5, color: '#FFFFFF', mt: 26},
    ])),
    hourFrame(nH - 1, 'призыв', 330, [
      {t: 'text', name: 'Заголовок', text: HOURS.ctaTitle[lang], font: 'U200', size: fitWrap(HOURS.ctaTitle[lang], 92, 936, 4, 0.66), lh: 100, ls: -5.5, color: '#FFFFFF'},
      {t: 'bar', name: 'Линия скотча', w: 300, h: 5, color: TAPE, mt: 56},
      {t: 'text', name: 'Текст', text: HOURS.ctaText[lang], font: 'O400', size: 40, lh: 145, color: '#FFFFFF', alpha: 0.84, mt: 48, maxW: 900},
    ]),
  ];
  // превью ссылок 1200×630 и обложка Facebook 1640×624 (OgCard.tsx, ProfileKit.CoverFB)
  const head = HEADLINE.map((x) => x[lang]);
  const og = fr('Превью ссылки на сайт (Open Graph 1200×630)', 1200, 630, 'graphite', [
    {t: 'img', name: 'Бус', key: cover('stills/van.jpg', 1126, 630), x: 470, y: 0, w: 1126, h: 630},
    {t: 'grad', name: 'Затемнение', dir: 'h', stops: [[0, GRAPHITE, 1], [0.4, GRAPHITE, 1], [0.46, GRAPHITE, 0.6], [0.56, GRAPHITE, 0]]},
    {t: 'logoAt', x: 64, y: 64, w: 280},
    {t: 'stack', name: 'Текст', x: 64, y: 630 - 64, w: 500, lift: 0, anchor: 'bottom', children: [
      {t: 'text', name: 'Заголовок', text: head.join('\n'), font: 'U200', size: fitSize(head, 80, 500), lh: 95, ls: -5.5, color: '#FFFFFF'},
      {t: 'bar', name: 'Линия скотча', w: 200, h: 4, color: TAPE, mt: 34},
      {t: 'text', name: 'Текст', text: `${PRICE_FINAL[lang]}\n${WHERE[lang]}`, font: 'O400', size: 28, lh: 140, color: '#FFFFFF', alpha: 0.84, mt: 26},
    ]},
    {t: 'ai', text: ai, x: 1200 - 32, bot: 630 - 24, size: 16},
  ]);
  const fb = fr('Обложка Facebook (1640×624)', 1640, 624, 'graphite', [
    {t: 'img', name: 'Бус', key: cover('stills/van.jpg', 1116, 624), x: 600, y: 0, w: 1116, h: 624},
    {t: 'grad', name: 'Затемнение', dir: 'h', stops: [[0, GRAPHITE, 1], [0.36, GRAPHITE, 1], [0.44, GRAPHITE, 0.55], [0.56, GRAPHITE, 0]]},
    {t: 'stack', name: 'Текст', x: 110, y: 312, w: 600, lift: 0, anchor: 'center', children: [
      {t: 'logo', name: 'Логотип', w: 260},
      {t: 'text', name: 'Заголовок', text: head.join('\n'), font: 'U200', size: fitSize(head, 76, 520), lh: 95, ls: -5.5, color: '#FFFFFF', mt: 44},
      {t: 'bar', name: 'Линия скотча', w: 180, h: 4, color: TAPE, mt: 30},
      {t: 'text', name: 'Текст', text: COVER_LINE[lang], font: 'O400', size: 26, lh: 145, color: '#FFFFFF', alpha: 0.84, mt: 24},
    ]},
    {t: 'ai', text: ai, x: 1640 - 28, bot: 624 - 20, size: 16},
  ]);
  return [
    {name: 'Посты · Обложки Reels (8) — загружаются как обложка ролика', frames: covers},
    {name: 'Посты · Карусель «Переезд за 6 шагов» (7 слайдов)', frames: steps},
    {name: 'Посты · Карусель «Мы не продаём часы» (5 слайдов)', frames: hours},
    {name: 'Ссылки и Facebook', frames: [og, fb]},
  ];
};
const postSections = Object.fromEntries(ORDER.map((lang) => [lang, posts(lang)]));

// обложки «Актуального» (без текста) — картинками
const HLK = ['diary', 'price', 'packages', 'how', 'boxes', 'care', 'vans', 'areas', 'faq'] as const;
const hlDir = '../../../marketing/stories/2026-11/highlights';
const highlights = HLK.map((k, i) => {
  const src = `${hlDir}/${i + 1}-${k}.jpg`;
  if (!existsSync(src)) throw new Error(src);
  const key = `hl-${k}`;
  ff(['-i', src, '-q:v', '4', `${IMG}/${key}.jpg`]);
  images[key] = {w: W, h: H, file: `${IMG}/${key}.jpg`, from: src};
  return {key, name: `${i + 1} · ${HL[k].ru}`, titles: Object.fromEntries(ORDER.map((l) => [l, HL[k][l]]))};
});

// аватар профиля (картинка, общий для всех языков)
const AV = '../../../marketing/social/2026-11-12/profile/avatar.jpg';
ff(['-i', AV, '-q:v', '4', `${IMG}/avatar.jpg`]);
images.avatar = {w: 1080, h: 1080, file: `${IMG}/avatar.jpg`, from: AV};

const chapters = [1, 2, 3, 4].map((n) => {
  const a = dateOf(n * 7 - 6), z = dateOf(n * 7);
  const f = (d: Date) => `${d.getUTCDate()}.${String(d.getUTCMonth() + 1).padStart(2, '0')}`;
  return {n, name: `${CH[n]} (${f(a)}–${f(z)})`, days: [n * 7 - 6, n * 7]};
});

const spec = {
  version: new Date().toISOString().slice(0, 10), W, H, PADX,
  colors: {graphite: GRAPHITE, tape: TAPE, line: LINE, steel: STEEL, glow: '#16303A'},
  langs: ORDER, langNames: {pl: 'PL — польский (основной)', ru: 'RU — русский', uk: 'UK — украинский', en: 'EN — английский'},
  chapters, stories, highlights, posts: postSections,
  images: Object.fromEntries(Object.entries(images).map(([k, v]) => [k, {w: v.w, h: v.h, from: v.from}])),
  logo: {w: 190, h: 190 / 4.606}, mark: {svg: 'brand/mark-white.svg'},
};
writeFileSync(`${OUT}/spec.json`, JSON.stringify(spec));
const n = Object.values(stories).reduce((a, l) => a + l.length, 0);
console.log(`сторис: ${n}, картинок: ${Object.keys(images).length}, ${(Object.keys(images).reduce((a, k) => a + readFileSync(images[k].file).length, 0) / 1e6).toFixed(1)} МБ`);
