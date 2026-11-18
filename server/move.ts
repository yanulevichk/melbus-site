/**
 * Заявка из формы «Что у вас дома» (/kalkulator/): проверяем присланный список, ПЕРЕСЧИТЫВАЕМ цену той же формулой
 * (src/data/move.ts) — цифре из браузера не верим — и пишем по-русски блок для Telegram.
 */
import { LEVELS, ITEM, P, EXTRAS, PLACE, calc, route, asmOn, type State, type Entry, type End, type Result } from '../src/data/move';
import { mf } from '../src/content/moveform';
import { esc } from './telegram';

export interface MoveEnd { place?: string; floor?: number; lift?: boolean; door?: number; house?: number }
export interface MovePayload {
  mode?: 'list' | 'video'; level?: number; hours?: number; boxes?: number;
  unpack?: boolean; ahead?: boolean; kitchen?: boolean; extras?: Record<string, number>; dateK?: number;
  pay?: 'fixed' | 'hourly'; asmAll?: boolean;
  from?: MoveEnd; to?: MoveEnd;
  list?: { id?: string; n?: number; sel?: Record<string, number>; asm?: boolean; cond?: string }[];
}

const int = (v: unknown, min: number, max: number, def: number) => (Number.isInteger(v) && (v as number) >= min && (v as number) <= max ? (v as number) : def);
const zl = (n: number) => `${n < 0 ? '−' : ''}${new Intl.NumberFormat('ru').format(Math.abs(Math.round(n / 10) * 10))} zł`;
const buses = (n: number) => `${n} ${n === 1 ? 'бус' : n < 5 ? 'буса' : 'бусов'}`;
const dec = (n: number) => new Intl.NumberFormat('ru', { maximumFractionDigits: 1 }).format(n);
const COND = ['ok', 'whole', 'fix', 'drop'] as const;
const DATE_K = [-0.1, -0.05, 0, 0.1];

/** Чистим всё, что пришло из браузера: только известные вещи, варианты и допы, разумные количества. */
export function cleanMove(m: MovePayload): State & { mode: 'list' | 'video' } {
  const end = (e: MoveEnd = {}): End => ({
    place: typeof e.place === 'string' ? e.place.trim().slice(0, 120) : '',
    floor: int(e.floor, 0, 30, 0), lift: e.lift === true, door: int(e.door, 0, 2, 0), house: int(e.house, 0, 2, 0),
  });
  const list: Entry[] = [];
  for (const x of (Array.isArray(m.list) ? m.list : []).slice(0, 150)) {
    const it = x && typeof x.id === 'string' ? ITEM[x.id] : undefined;
    if (!it) continue;
    const sel: Record<string, number> = { ...it.def };
    for (const k of it.p || []) sel[k] = int(x.sel?.[k], 0, P[k].opts.length - 1, it.def[k] ?? 0);
    const cond = COND.includes(x.cond as never) ? (x.cond as Entry['cond']) : 'ok';
    list.push({ id: it.id, n: int(x.n, 1, 50, 1), sel, cond, ...(typeof x.asm === 'boolean' ? { asm: x.asm } : {}) });
  }
  const extras: Record<string, number> = {};
  for (const e of EXTRAS) { const n = int(m.extras?.[e.id], 0, 50, 0); if (n) extras[e.id] = n; }
  return {
    mode: m.mode === 'video' ? 'video' : 'list', level: int(m.level, 1, 3, 3), hours: int(m.hours, 2, 12, 2),
    from: end(m.from), to: end(m.to), list, boxes: int(m.boxes, 0, 150, 0), extras,
    unpack: m.unpack === true, ahead: m.ahead === true, kitchen: m.kitchen === true,
    dateK: DATE_K.includes(m.dateK as number) ? (m.dateK as number) : 0,
    pay: m.pay === 'hourly' ? 'hourly' : 'fixed', asmAll: m.asmAll === true,
  };
}

const ru = <T extends { ru: string }>(x: T) => x.ru;
export type Lang = 'ru' | 'pl' | 'uk' | 'en';
export function itemText(e: Entry, lvl: number, L: Lang = 'ru', all = false) {
  const it = ITEM[e.id];
  const parts = (it.p || []).map((k) => P[k].opts[e.sel[k]].t[L]);
  if (it.kind === 'ward' && e.cond && e.cond !== 'ok') parts.push({ whole: mf.wWhole, fix: mf.wFix, drop: mf.wDrop }[e.cond][L]);
  else if (it.spec({ ...it.def, ...e.sel }).a > 0) parts.push(asmOn(e, lvl, all) ? mf.wAsm[L] : mf.wNoAsm[L]);
  return `${it.name[L]}${parts.length ? ` (${parts.join(', ')})` : ''} ×${e.n}`;
}
const LINE: Record<string, { ru: string }> = { carry: mf.lCarry, road: mf.lRoad, asm: mf.lAsm, pack: mf.lPack, packK: mf.lPackK, unpack: mf.lUnpack, mount: mf.lMount, junk: mf.lJunk, bus: mf.lBus, mat: mf.lMat, date: mf.lDate, hourly: mf.lHourly, hourly2: mf.lHourly2, km: mf.lKm };

/** Строки для Telegram + пересчитанная цена (null — «по видео», считает менеджер). */
export function moveLines(S: ReturnType<typeof cleanMove>): { lines: string[]; total: number | null; r: Result } {
  const r = calc(S);
  const lv = LEVELS.find((x) => x.id === S.level)!;
  const video = S.mode === 'video' && S.level !== 1;
  const out: string[] = [];
  const priced = video || r.empty ? null : r.total;
  out.push(`<b>📋 Форма «Что у вас дома»</b> · <b>${esc(ru(lv.t))}</b>${video ? ' · вещи покажут на видео' : ''}`);
  if (priced != null) out.push(`<b>💰 Цена на сайте: ${zl(priced)}</b> (пересчитано на сервере${S.dateK ? `, дата ${S.dateK > 0 ? '+' : '−'}${Math.abs(S.dateK * 100)} %` : ''})`);
  if (S.level === 2 && !video && !r.empty) out.push(S.pay === 'hourly'
    ? `<b>⏱ Клиент выбрал оплату ПО ЧАСАМ:</b> ${r.hourly2?.rate} zł/ч, мин. 3 ч; оценка выше — по нашим нормам (фиксированная была бы ${zl(calc({ ...S, pay: 'fixed' }).total)})`
    : `Оплата: фиксированная цена${S.asmAll ? ' · разборка и сборка всей мебели' : ''}`);
  if (S.level === 1) out.push(`⏱ ${S.hours} ч × 150 zł, водитель и бус`);
  else if (!video && !r.empty) out.push(`👷 ${r.crew} чел. · ≈${dec(r.dur)} ч · ${dec(r.peopleH)} чел.-ч · ${buses(r.buses)} · ${dec(r.vol)} м³`);
  const end = (e: End) => [esc(e.place || '—') + (e.place && !PLACE[e.place] ? ' (нет в подсказках — проверить адрес)' : ''), `этаж ${e.floor}`, e.lift ? 'лифт есть' : 'без лифта', mf.doorO[e.door].ru.toLowerCase(), mf.houseO[e.house].ru.toLowerCase()].join(', ');
  out.push(`<b>📍 Откуда:</b> ${end(S.from)}`, `<b>📍 Куда:</b> ${end(S.to)}`);
  const rt = route(S);
  if (rt) out.push(`🛣 ${Math.round(rt.ab)} км между адресами, ≈${Math.round(rt.min)} мин`);
  if (S.level !== 1 && !video) {
    const n = S.list.reduce((a, e) => a + e.n, 0);
    let items = S.list.map((e) => esc(itemText(e, S.level, 'ru', S.asmAll))).join('; ');
    if (items.length > 2200) items = items.slice(0, 2200).replace(/;[^;]*$/, '') + ' … (список длиннее — полностью в оферте)';
    out.push(`<b>📦 Вещи (${n}):</b> ${items || '—'}`);
    out.push(`<b>Коробки:</b> ${S.boxes}${S.ahead ? ' · привезти заранее' : ''}${S.kitchen ? ' · упаковать кухню и хрупкое' : ''}${S.unpack ? ' · распаковать' : ''}`);
  }
  const ex = EXTRAS.filter((e) => S.extras[e.id]).map((e) => `${e.name.ru} ×${S.extras[e.id]}`);
  if (ex.length) out.push(`<b>🔧 Допы:</b> ${esc(ex.join('; '))}`);
  if (priced != null) out.push(`<i>Разбивка: ${r.lines.map((l) => `${LINE[l.k].ru} ${zl(l.sum)}`).join(' · ')}</i>`);
  return { lines: out, total: priced, r };
}

/**
 * Ссылка для менеджера: та же форма «Что у вас дома» с вещами клиента (?team=1&s=…) — поправить по видео и создать оферту.
 * s — очищенный список (MovePayload) в JSON; форма читает его так же, как сервер.
 */
export function teamFormUrl(origin: string, pricingPath: string, id: string, S: ReturnType<typeof cleanMove>, meta: Record<string, string>) {
  const q = new URLSearchParams({ team: '1', id, ...meta });
  const { mode, ...m } = S;
  const s = JSON.stringify({ ...m, mode, list: S.list.map(({ id, n, sel, asm, cond }) => ({ id, n, sel, asm, cond })) });
  q.set('s', s);
  return `${origin}${pricingPath}?${q}`;
}
