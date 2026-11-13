// Описание всех сторис для Figma (та же вёрстка, что в Story.tsx, но слоями): тексты, шрифты, размеры, картинки.
//   npx tsx scripts/figma-spec.ts            → out/figma/spec.json + out/figma/img/*.jpg|png
// Дальше: node scripts/figma-build.cjs (HTML-превью для сверки и плагин-импортёр для Figma).
import {execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import {existsSync, mkdirSync, readFileSync, rmSync, writeFileSync} from 'node:fs';
import {STORIES, RUBRICS, DAY_WORD, PAIR_LABELS, HL, TIMES, dateOf, VIDEO_OPTS, type Story} from '../src/social/stories';
import {COMMON, LANGS, type Lang} from '../src/social/texts';
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
const cover = (src: string, w: number, h: number, pos: 'center' | 'top' = 'center', at?: number): string => {
  const key = createHash('sha1').update(`${src}|${w}x${h}|${pos}|${at ?? ''}`).digest('hex').slice(0, 12);
  if (images[key]) return key;
  const file = `${IMG}/${key}.jpg`;
  const vf = `scale=${w}:${h}:force_original_aspect_ratio=increase:flags=lanczos,crop=${w}:${h}:(iw-${w})/2:${pos === 'top' ? 0 : `(ih-${h})/2`}`;
  ff([...(at !== undefined ? ['-ss', String(at)] : []), '-i', `${PUB}/${src}`, '-frames:v', '1', '-vf', vf, '-q:v', '4', file]);
  images[key] = {w, h, file, from: src};
  return key;
};

// ---------- узлы ----------
type Font = 'U200' | 'U300' | 'O400' | 'O500' | 'O600';
type Txt = {t: 'text'; name: string; text: string; font: Font; size: number; lh?: number; ls?: number; color: string; alpha?: number; strike?: boolean; mt?: number};
type Bullets = {t: 'bullets'; name: string; gap: number; mt?: number; items: {text: string; size: number}[]};
type Compare = {t: 'compare'; name: string; mt?: number; head: [string, string]; rows: [string, string][]};
type Child = Txt | Bullets | Compare;
type Node =
  | {t: 'img'; name: string; key: string; x: number; y: number; w: number; h: number; r?: number; stroke?: {color: string; w: number}; shadow?: boolean; fill?: string; note?: string}
  | {t: 'grad'; name: string; stops: [number, string, number][]}
  | {t: 'stack'; name: string; x: number; y: number; w: number; lift: number; children: Child[]}
  | {t: 'pair'; name: string; x: number; y: number; w: number; gap: number; boxes: {key: string; h: number; r: number; stroke: {color: string; w: number}; label: {text: string; bg: string; alpha: number; color: string}}[]}
  | {t: 'header'; rubric: string; day: string; alpha: number; shadow: boolean}
  | {t: 'tape'}
  | {t: 'logo'}
  | {t: 'mark'; x: number; y: number; w: number; h: number}
  | {t: 'ai'; text: string}
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

const chapters = [1, 2, 3, 4].map((n) => {
  const a = dateOf(n * 7 - 6), z = dateOf(n * 7);
  const f = (d: Date) => `${d.getUTCDate()}.${String(d.getUTCMonth() + 1).padStart(2, '0')}`;
  return {n, name: `${CH[n]} (${f(a)}–${f(z)})`, days: [n * 7 - 6, n * 7]};
});

const spec = {
  version: new Date().toISOString().slice(0, 10), W, H, PADX,
  colors: {graphite: GRAPHITE, tape: TAPE, line: LINE, steel: STEEL, glow: '#16303A'},
  langs: ORDER, langNames: {pl: 'PL — польский (основной)', ru: 'RU — русский', uk: 'UK — украинский', en: 'EN — английский'},
  chapters, stories, highlights,
  images: Object.fromEntries(Object.entries(images).map(([k, v]) => [k, {w: v.w, h: v.h, from: v.from}])),
  logo: {w: 190, h: 190 / 4.606}, mark: {svg: 'brand/mark-white.svg'},
};
writeFileSync(`${OUT}/spec.json`, JSON.stringify(spec));
const n = Object.values(stories).reduce((a, l) => a + l.length, 0);
console.log(`сторис: ${n}, картинок: ${Object.keys(images).length}, ${(Object.keys(images).reduce((a, k) => a + readFileSync(images[k].file).length, 0) / 1e6).toFixed(1)} МБ`);
