// Проверка плагина без Figma: поддельный API с теми же ограничениями, что у настоящего
// (шрифт загружен до правки текста, FILL только внутри автолейаута, currentPage только через setCurrentPageAsync и т. д.).
//   node scripts/figma-mock-test.cjs [out/figma/MELBUS-storis-figma/code.js]
const fs = require('fs'), vm = require('vm');
const file = process.argv[2] || 'out/figma/MELBUS-storis-figma/code.js';
const errors = [], warns = [];
const fail = (m) => { throw new Error(m); };
const ENUM = {
  layoutMode: ['NONE', 'HORIZONTAL', 'VERTICAL'], primaryAxisAlignItems: ['MIN', 'MAX', 'CENTER', 'SPACE_BETWEEN'],
  counterAxisAlignItems: ['MIN', 'MAX', 'CENTER', 'BASELINE'], textAutoResize: ['NONE', 'WIDTH_AND_HEIGHT', 'HEIGHT', 'TRUNCATE'],
  strokeAlign: ['CENTER', 'INSIDE', 'OUTSIDE'], textAlignHorizontal: ['LEFT', 'CENTER', 'RIGHT', 'JUSTIFIED'],
  textDecoration: ['NONE', 'UNDERLINE', 'STRIKETHROUGH'], layoutSizing: ['FIXED', 'HUG', 'FILL'],
};
const AVAILABLE = [];
for (const s of ['Thin', 'ExtraLight', 'Light', 'Regular', 'Medium', 'SemiBold', 'Bold']) AVAILABLE.push({fontName: {family: 'Unbounded', style: s}}, {fontName: {family: 'Onest', style: s}});
for (const s of ['Regular', 'Extra Light', 'Light', 'Medium', 'Semi Bold']) AVAILABLE.push({fontName: {family: 'Inter', style: s}});
const loaded = new Set();
const fkey = (f) => `${f.family}|${f.style}`;
const checkPaints = (p, what) => {
  if (!Array.isArray(p)) fail(`${what}: fills должен быть массивом`);
  for (const x of p) {
    if (x.type === 'SOLID') { if (!x.color || 'a' in x.color) fail(`${what}: SOLID color без альфы`); }
    else if (x.type === 'IMAGE') { if (!x.imageHash) fail(`${what}: IMAGE без imageHash`); if (!['FILL', 'FIT', 'CROP', 'TILE'].includes(x.scaleMode)) fail('scaleMode'); }
    else if (x.type.startsWith('GRADIENT_')) {
      if (!Array.isArray(x.gradientTransform) || x.gradientTransform.length !== 2 || x.gradientTransform.some((r) => r.length !== 3)) fail('gradientTransform');
      for (const s of x.gradientStops) if (!('a' in s.color) || s.position < 0 || s.position > 1) fail('gradientStops');
    } else fail('тип заливки ' + x.type);
  }
};
let nodeCount = 0;
class Node {
  constructor(type) { this.type = type; this.name = type; this.parent = null; this._x = 0; this._y = 0; this._w = 100; this._h = 100; this.visible = true; this.locked = false; this._fills = []; this.strokes = []; this.effects = []; nodeCount++; }
  get x() { return this._x; } set x(v) { if (typeof v !== 'number' || isNaN(v)) fail(`${this.name}: x=${v}`); if (this.parent && this.parent.layoutMode && this.parent.layoutMode !== 'NONE') warns.push(`x внутри автолейаута: ${this.name}`); this._x = v; }
  get y() { return this._y; } set y(v) { if (typeof v !== 'number' || isNaN(v)) fail(`${this.name}: y=${v}`); if (this.parent && this.parent.layoutMode && this.parent.layoutMode !== 'NONE') warns.push(`y внутри автолейаута: ${this.name}`); this._y = v; }
  get width() { return this._w; } get height() { return this._h; }
  resize(w, h) { if (!(w >= 0.01 && h >= 0.01)) fail(`${this.name}: resize(${w},${h})`); this._w = w; this._h = h; }
  resizeWithoutConstraints(w, h) { this.resize(w, h); }
  get fills() { return this._fills; } set fills(p) { checkPaints(p, this.name); this._fills = p; }
  async setFillStyleIdAsync(id) { if (!STYLES.find((s) => s.id === id)) fail('нет стиля ' + id); this.fillStyleId = id; }
  remove() { if (this.parent) this.parent.children.splice(this.parent.children.indexOf(this), 1); this.parent = null; }
  set strokeAlign(v) { if (!ENUM.strokeAlign.includes(v)) fail('strokeAlign ' + v); this._sa = v; } get strokeAlign() { return this._sa; }
  set layoutSizingHorizontal(v) { this._lsh = this._sizing(v, 'h'); } get layoutSizingHorizontal() { return this._lsh || 'FIXED'; }
  set layoutSizingVertical(v) { this._lsv = this._sizing(v, 'v'); } get layoutSizingVertical() { return this._lsv || 'FIXED'; }
  _sizing(v, ax) {
    if (!ENUM.layoutSizing.includes(v)) fail('layoutSizing ' + v);
    if (v === 'FILL' && !(this.parent && this.parent.layoutMode && this.parent.layoutMode !== 'NONE')) fail(`${this.name}: FILL вне автолейаута`);
    if (v === 'HUG' && !(this.type === 'TEXT' || (this.layoutMode && this.layoutMode !== 'NONE'))) fail(`${this.name}: HUG не у автолейаута/текста`);
    if (this.type === 'TEXT' && v === 'FILL' && ax === 'h' && this.textAutoResize === 'WIDTH_AND_HEIGHT') this._tar = 'HEIGHT';
    return v;
  }
}
// ширина «FILL»: в вертикальном — вся ширина родителя; в горизонтальном — остаток поровну между FILL-детьми
const fillW = (n) => {
  const p = n.parent;
  if (p.layoutMode === 'VERTICAL') return p.innerW();
  const kids = p.children.filter((c) => c.visible), fills = kids.filter((c) => c.layoutSizingHorizontal === 'FILL');
  const fixed = kids.filter((c) => c.layoutSizingHorizontal !== 'FILL').reduce((a, c) => a + c.width, 0);
  return (p.innerW() - fixed - p.itemSpacing * Math.max(0, kids.length - 1)) / fills.length;
};
class Container extends Node {
  constructor(t) { super(t); this.children = []; this.layoutMode = 'NONE'; this.itemSpacing = 0; this.paddingTop = this.paddingBottom = this.paddingLeft = this.paddingRight = 0; this.clipsContent = true; }
  appendChild(n) { if (n === this) fail('сам в себя'); if (n.parent) n.remove(); n.parent = this; this.children.push(n); }
  set layoutMode(v) { if (!ENUM.layoutMode.includes(v)) fail('layoutMode ' + v); this._lm = v; } get layoutMode() { return this._lm; }
  set primaryAxisAlignItems(v) { if (!ENUM.primaryAxisAlignItems.includes(v)) fail('primaryAxisAlignItems ' + v); this._pa = v; } get primaryAxisAlignItems() { return this._pa; }
  set counterAxisAlignItems(v) { if (!ENUM.counterAxisAlignItems.includes(v)) fail('counterAxisAlignItems ' + v); this._ca = v; } get counterAxisAlignItems() { return this._ca; }
  innerW() { return this.width - this.paddingLeft - this.paddingRight; }
  get width() {
    if (this.layoutMode !== 'NONE' && this.layoutSizingHorizontal === 'HUG') {
      const ws = this.children.filter((c) => c.visible).map((c) => c.width);
      return (this.layoutMode === 'HORIZONTAL' ? ws.reduce((a, b) => a + b, 0) + this.itemSpacing * Math.max(0, ws.length - 1) : Math.max(0, ...ws)) + this.paddingLeft + this.paddingRight;
    }
    if (this.layoutSizingHorizontal === 'FILL' && this.parent) return fillW(this);
    return this._w;
  }
  get height() {
    if (this.layoutMode !== 'NONE' && this.layoutSizingVertical === 'HUG') {
      const hs = this.children.filter((c) => c.visible).map((c) => c.height);
      return (this.layoutMode === 'VERTICAL' ? hs.reduce((a, b) => a + b, 0) + this.itemSpacing * Math.max(0, hs.length - 1) : Math.max(0, ...hs)) + this.paddingTop + this.paddingBottom;
    }
    return this._h;
  }
}
class Text extends Node {
  constructor() { super('TEXT'); this._font = {family: 'Inter', style: 'Regular'}; this._chars = ''; this.fontSize = 12; this.lineHeight = {unit: 'AUTO'}; this._tar = 'WIDTH_AND_HEIGHT'; }
  set fontName(f) { if (!loaded.has(fkey(f))) fail(`шрифт не загружен: ${fkey(f)}`); this._font = f; } get fontName() { return this._font; }
  set characters(s) { if (!loaded.has(fkey(this._font))) fail(`characters при незагруженном ${fkey(this._font)}`); if (typeof s !== 'string' || !s) fail('пустой текст'); this._chars = s; }
  get characters() { return this._chars; }
  set textAutoResize(v) { if (!ENUM.textAutoResize.includes(v)) fail('textAutoResize ' + v); this._tar = v; } get textAutoResize() { return this._tar; }
  set textAlignHorizontal(v) { if (!ENUM.textAlignHorizontal.includes(v)) fail('textAlign ' + v); } set textDecoration(v) { if (!ENUM.textDecoration.includes(v)) fail('textDecoration ' + v); }
  set letterSpacing(v) { if (!['PERCENT', 'PIXELS'].includes(v.unit)) fail('letterSpacing'); } set lineHeight(v) { if (!['PERCENT', 'PIXELS', 'AUTO'].includes(v.unit)) fail('lineHeight'); this._lh = v; }
  _lhPx() { return this._lh && this._lh.unit === 'PERCENT' ? this.fontSize * this._lh.value / 100 : this.fontSize * 1.26; }
  _lines(w) { return this._chars.split('\n').reduce((a, p) => a + Math.max(1, Math.ceil(p.length * 0.55 * this.fontSize / w)), 0); }
  get width() {
    if (this.layoutSizingHorizontal === 'FILL' && this.parent) return fillW(this);
    if (this._tar === 'WIDTH_AND_HEIGHT') return Math.max(...this._chars.split('\n').map((p) => p.length)) * 0.55 * this.fontSize;
    return this._w;
  }
  get height() { if (this._tar === 'NONE') return this._h; return this._lines(this.width) * this._lhPx(); }
}
class Page extends Container { constructor() { super('PAGE'); this._loaded = true; } async loadAsync() { this._loaded = true; } }
class Component extends Container { createInstance() { const i = new Container('INSTANCE'); i.mainComponent = this; i._w = this.width; i._h = this.height; return i; } }
const STYLES = [];
let current, closed = null;
const firstPage = new Page(); firstPage.name = 'Page 1';
const all = [];
const mk = (n) => { all.push(n); if (current) current.appendChild(n); return n; };
const figma = {
  root: {children: [firstPage]},
  get currentPage() { return current; }, set currentPage(_) { fail('currentPage= запрещено в dynamic-page'); },
  async setCurrentPageAsync(p) { if (!(p instanceof Page)) fail('не страница'); current = p; },
  createFrame: () => mk(new Container('FRAME')), createText: () => mk(new Text()), createRectangle: () => mk(new Node('RECTANGLE')),
  createComponent: () => mk(new Component('COMPONENT')), createSection: () => mk(new Container('SECTION')),
  createPage: () => { const p = new Page(); figma.root.children.push(p); return p; },
  createPaintStyle: () => { const s = {id: 'S:' + STYLES.length, name: '', paints: []}; STYLES.push(s); return s; },
  getLocalPaintStylesAsync: async () => STYLES.slice(),
  createImage: (b) => { if (!(b instanceof Uint8Array) || b.length < 100) fail('createImage: не байты'); return {hash: 'h' + b.length}; },
  base64Decode: (s) => new Uint8Array(Buffer.from(s, 'base64')),
  listAvailableFontsAsync: async () => AVAILABLE,
  loadFontAsync: async (f) => { if (!AVAILABLE.find((a) => fkey(a.fontName) === fkey(f))) fail('нет шрифта ' + fkey(f)); loaded.add(fkey(f)); },
  notify: () => {}, closePlugin: (m) => { closed = m; }, viewport: {scrollAndZoomIntoView: () => {}},
};
current = firstPage;
const src = fs.readFileSync(file, 'utf8');
const ctx = vm.createContext({figma, console, Object, Math, JSON, Array, Promise, Error, String, Number, Uint8Array, Buffer});
vm.runInContext(src, ctx, {filename: 'code.js'});
const done = () => new Promise((r) => { const t = setInterval(() => { if (closed !== null) { clearInterval(t); r(); } }, 20); });
done().then(() => {
  console.log('closePlugin:', closed);
  if (/^Ошибка/.test(closed)) { console.error('ОШИБКА В ПЛАГИНЕ'); process.exit(1); }
  const pages = figma.root.children.map((p) => `${p.name} (${p.children.length})`);
  console.log('страницы:', pages.join(', '));
  const frames = all.filter((n) => n.type === 'FRAME' && n.width === 1080 && n.height === 1920 && n.parent && n.parent.type === 'SECTION');
  console.log('фреймов сторис:', frames.length, '· узлов всего:', nodeCount, '· стилей:', STYLES.length);
  // текст не должен заходить на логотип (по грубой оценке высоты текста в макете)
  let over = 0;
  for (const f of frames) for (const c of f.children) if (c.name === 'Текст' && c.y + c.height > 1920 - 300 - 41 + 2) { over++; if (over < 6) warns.push(`текст ниже логотипа (оценка): ${f.name} ${Math.round(c.y + c.height)}`); }
  const uniq = [...new Set(warns)];
  console.log('предупреждений:', uniq.length); uniq.slice(0, 15).forEach((w) => console.log('  ·', w));
  const sample = frames.find((f) => f.name.startsWith('D17-1'));
  const tree = (n, d = 0) => `${'  '.repeat(d)}${n.name} [${n.type}${n.layoutMode && n.layoutMode !== 'NONE' ? ' ' + n.layoutMode : ''}]\n` + (n.children || []).map((c) => tree(c, d + 1)).join('');
  console.log('\nпример слоёв:\n' + tree(sample));
}).catch((e) => { console.error(e); process.exit(1); });
process.on('unhandledRejection', (e) => { console.error('unhandled', e); process.exit(1); });
