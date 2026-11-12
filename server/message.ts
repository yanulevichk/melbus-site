/**
 * Заявка с сайта → текст сообщения в Telegram (по-русски, для команды MELBUS).
 * Подписи берём из тех же текстов, что и форма (src/content/quote.ts), — меняются в одном месте.
 */
import { quoteText as Q } from '../src/content/quote';
import { esc } from './telegram';

export interface Addr { addr?: string; floor?: string; lift?: number; dist?: string }
export interface QuotePayload {
  lang?: string; size?: number; pkg?: number; est?: number;
  from?: Addr; to?: Addr;
  date?: string; time?: string; flex?: boolean;
  items?: number[]; skipItems?: boolean; extras?: number[];
  name?: string; phone?: string; channel?: number; nip?: boolean; comment?: string;
  videos?: { key: string; name: string; size: number }[];
  skipped?: { name: string; size: number }[];
  hp?: string; t?: number;
}

const str = (v: unknown, max = 300) => (typeof v === 'string' ? v.trim().slice(0, max) : '');
const int = (v: unknown, min: number, max: number) => (Number.isInteger(v) && (v as number) >= min && (v as number) <= max ? (v as number) : -1);
const mb = (n: number) => (n >= 1024 ** 3 ? `${(n / 1024 ** 3).toFixed(1)} ГБ` : `${Math.max(1, Math.round(n / 1024 ** 2))} МБ`);
const zl = (n: number) => new Intl.NumberFormat('ru').format(n);

/** Проверка: телефон обязателен, ловушка для ботов пуста, форма заполнялась хотя бы 3 секунды. */
export function check(p: QuotePayload): string | null {
  if (str(p.hp)) return 'spam';
  if (typeof p.t === 'number' && Date.now() - p.t < 3000) return 'spam';
  if ((str(p.phone, 40).match(/\d/g) || []).length < 7) return 'phone';
  return null;
}

export function quoteMessage(id: string, p: QuotePayload, links: string[], teamUrl = '') {
  const ru = 'ru' as const;
  const lines: string[] = [];
  const add = (label: string, value: string) => value && lines.push(`<b>${label}:</b> ${value}`);
  lines.push(`<b>🆕 Заявка ${esc(id)}</b> · сайт ${esc(str(p.lang, 5).toUpperCase() || '—')}`);
  add('Имя', esc(str(p.name, 80)) || '—');
  const phone = str(p.phone, 40);
  const ch = int(p.channel, 0, Q.channels.length - 1);
  const digits = phone.replace(/\D/g, '');
  const wa = digits.length >= 9 ? ` · <a href="https://wa.me/${digits.length === 9 ? '48' + digits : digits}">открыть WhatsApp</a>` : '';
  add('Телефон', `${esc(phone)}${ch >= 0 ? ` · связь: ${esc(Q.channels[ch][ru])}` : ''}${wa}`);
  const s = int(p.size, 0, Q.sizes.length - 1);
  const est = int(p.est, 1, 1_000_000);
  add('Объём', `${s >= 0 ? esc(Q.sizes[s][ru]) : '—'}${est > 0 ? ` · ориентир из калькулятора: от ${zl(est)} zł` : ''}`);
  const addr = (a?: Addr) => {
    if (!a) return '';
    const parts = [esc(str(a.addr, 200)) || '—'];
    if (str(a.floor, 10)) parts.push(`этаж ${esc(str(a.floor, 10))}`);
    const l = int(a.lift, 0, Q.liftOpts.length - 1);
    if (l >= 0) parts.push(`лифт: ${esc(Q.liftOpts[l][ru].toLowerCase())}`);
    if (str(a.dist, 10)) parts.push(`от парковки ${esc(str(a.dist, 10))} м`);
    return parts.join(', ');
  };
  const pk = int(p.pkg, 0, Q.pkgs.length - 1);
  add('Пакет', pk >= 0 ? `<b>${esc(Q.pkgs[pk][ru])}</b>` : '—');
  add('Откуда', addr(p.from));
  add('Куда', addr(p.to));
  const date = str(p.date, 10).match(/^(\d{4})-(\d{2})-(\d{2})$/);
  const time = str(p.time, 10) === 'evening' ? Q.evening[ru].toLowerCase() : esc(str(p.time, 10));
  add('Дата', [date ? `${date[3]}.${date[2]}.${date[1]}` : 'не указана', time, p.flex ? 'гибко ±2 дня' : ''].filter(Boolean).join(', '));
  const items = (Array.isArray(p.items) ? p.items : []).map((n, i) => (Number.isInteger(n) && n > 0 && n < 100 && Q.items[i] ? `${Q.items[i][ru]} ×${n}` : '')).filter(Boolean);
  add('Вещи', [items.join(', '), p.skipItems ? '«покажу всё на видео»' : ''].filter(Boolean).join(' · ') || '—');
  const extras = (Array.isArray(p.extras) ? p.extras : []).map((i) => Q.extras[int(i, 0, Q.extras.length - 1)]?.[ru]).filter(Boolean);
  add('Услуги', extras.map(esc).join(', ') || '—');
  if (p.nip) lines.push('<b>🧾 Нужна фактура на фирму (NIP)</b>');
  add('Комментарий', esc(str(p.comment, 1500)));
  const vids = Array.isArray(p.videos) ? p.videos.slice(0, 10) : [];
  if (vids.length) lines.push(`<b>🎥 Видео (${vids.length}):</b>\n${vids.map((v, i) => `${i + 1}. <a href="${links[i]}">${esc(str(v.name, 80))}</a> (${mb(v.size)})`).join('\n')}`);
  const skipped = Array.isArray(p.skipped) ? p.skipped.slice(0, 10) : [];
  if (skipped.length) lines.push(`⚠️ <b>Видео не загрузилось:</b> ${skipped.map((v) => `${esc(str(v.name, 80))} (${mb(v.size)})`).join(', ')} — попросите прислать в WhatsApp`);
  if (!vids.length && !skipped.length) lines.push('🎥 Видео не прислали — попросите снять квартиру.');
  if (teamUrl) lines.push(`👉 <a href="${teamUrl}">Создать оферту по этой заявке</a>`);
  return lines.join('\n');
}

/**
 * Ссылка на инструмент менеджера /team/oferta/ с уже заполненными полями из заявки.
 * Номера вариантов формы заявки переводим в номера калькулятора (src/data/pricing.ts).
 */
export function teamOfferUrl(origin: string, id: string, p: QuotePayload) {
  const q = new URLSearchParams({ id });
  const iv = (v: unknown, min: number, max: number, def: number) => { const n = int(v, min, max); return n < 0 ? def : n; };
  const s = iv(p.size, 0, 6, -1);
  if (s >= 0) { q.set('size', String([0, 1, 2, 2, 3, 4, 0][s])); q.set('amount', String(s === 3 ? 2 : s === 6 ? 0 : 1)); }
  const ex = (Array.isArray(p.extras) ? p.extras : []).filter((e) => Number.isInteger(e));
  let pkg = iv(p.pkg, 0, 3, 3);
  if (pkg === 3) pkg = ex.includes(0) || ex.includes(6) ? 2 : ex.includes(1) ? 1 : 1;
  q.set('pkg', String(pkg));
  const map: Record<number, number> = { 2: 0, 3: 1, 7: 2, 4: 3, 5: 4 };
  const pex = ex.map((e) => map[e]).filter((e) => e !== undefined);
  if (pex.length) q.set('ex', pex.join(','));
  for (const [k, v] of [['lang', str(p.lang, 5)], ['name', str(p.name, 80)], ['phone', str(p.phone, 40)], ['from', str(p.from?.addr, 200)], ['to', str(p.to?.addr, 200)], ['date', str(p.date, 10)]] as const) if (v) q.set(k, v);
  const fl = (a?: Addr) => String(Math.max(0, Math.min(30, parseInt(str(a?.floor, 10), 10) || 0)));
  q.set('ff', fl(p.from)); q.set('ft', fl(p.to));
  q.set('lf', iv(p.from?.lift, 0, 2, 0) > 0 ? '1' : '0'); q.set('lt', iv(p.to?.lift, 0, 2, 0) > 0 ? '1' : '0');
  return `${origin}/team/oferta/?${q}`;
}
