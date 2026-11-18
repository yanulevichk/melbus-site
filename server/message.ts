/**
 * Заявка с сайта → текст сообщения в Telegram (по-русски, для команды MELBUS).
 * 18.11.2026: на сайте одна форма — «Что у вас дома» (страница «Цены и расчёт»). Её список вещей, пакет и адреса
 * приходят в поле move; цену сервер пересчитывает сам (server/move.ts). Каналы связи — src/content/quote.ts.
 */
import { quoteText as Q } from '../src/content/quote';
import { href, type Locale } from '../src/i18n/routes';
import { esc } from './telegram';
import { cleanMove, moveLines, teamFormUrl, type MovePayload } from './move';

export interface QuotePayload {
  lang?: string; est?: number; date?: string;
  name?: string; phone?: string; channel?: number; comment?: string;
  videos?: { key: string; name: string; size: number }[];
  skipped?: { name: string; size: number }[];
  hp?: string; t?: number;
  /** форма «Что у вас дома»: список вещей, пакет, адреса с этажами — см. server/move.ts */
  move?: MovePayload;
}

const str = (v: unknown, max = 300) => (typeof v === 'string' ? v.trim().slice(0, max) : '');
const int = (v: unknown, min: number, max: number) => (Number.isInteger(v) && (v as number) >= min && (v as number) <= max ? (v as number) : -1);
const mb = (n: number) => (n >= 1024 ** 3 ? `${(n / 1024 ** 3).toFixed(1)} ГБ` : `${Math.max(1, Math.round(n / 1024 ** 2))} МБ`);
const LANGS: Locale[] = ['pl', 'ru', 'uk', 'en'];
const langOf = (p: QuotePayload) => (LANGS.includes(p.lang as Locale) ? (p.lang as Locale) : 'pl');

/** Проверка: телефон обязателен, ловушка для ботов пуста, форма заполнялась хотя бы 3 секунды. */
export function check(p: QuotePayload): string | null {
  if (str(p.hp)) return 'spam';
  if (typeof p.t === 'number' && Date.now() - p.t < 3000) return 'spam';
  if ((str(p.phone, 40).match(/\d/g) || []).length < 7) return 'phone';
  return null;
}

export function quoteMessage(id: string, p: QuotePayload, links: string[], teamUrl = '') {
  const lines: string[] = [];
  const add = (label: string, value: string) => value && lines.push(`<b>${label}:</b> ${value}`);
  lines.push(`<b>🆕 Заявка ${esc(id)}</b> · сайт ${langOf(p).toUpperCase()}`);
  add('Имя', esc(str(p.name, 80)) || '—');
  const phone = str(p.phone, 40);
  const ch = int(p.channel, 0, Q.channels.length - 1);
  const digits = phone.replace(/\D/g, '');
  const wa = digits.length >= 9 ? ` · <a href="https://wa.me/${digits.length === 9 ? '48' + digits : digits}">открыть WhatsApp</a>` : '';
  add('Телефон', `${esc(phone)}${ch >= 0 ? ` · связь: ${esc(Q.channels[ch].ru)}` : ''}${wa}`);
  const move = p.move && typeof p.move === 'object' ? cleanMove(p.move) : null;
  if (move) lines.push(...moveLines(move).lines);
  const date = str(p.date, 10).match(/^(\d{4})-(\d{2})-(\d{2})$/);
  add('Дата', date ? `${date[3]}.${date[2]}.${date[1]}` : 'не указана');
  add('Комментарий', esc(str(p.comment, 1500)));
  const vids = Array.isArray(p.videos) ? p.videos.slice(0, 10) : [];
  if (vids.length) lines.push(`<b>🎥 Видео (${vids.length}):</b>\n${vids.map((v, i) => `${i + 1}. <a href="${links[i]}">${esc(str(v.name, 80))}</a> (${mb(v.size)})`).join('\n')}`);
  const skipped = Array.isArray(p.skipped) ? p.skipped.slice(0, 10) : [];
  if (skipped.length) lines.push(`⚠️ <b>Видео не загрузилось:</b> ${skipped.map((v) => `${esc(str(v.name, 80))} (${mb(v.size)})`).join(', ')} — попросите прислать в WhatsApp`);
  if (!vids.length && !skipped.length && move?.mode === 'video') lines.push('🎥 Клиент выбрал «по видео», но видео не прислал — попросите снять квартиру.');
  if (teamUrl) lines.push(`👉 <a href="${teamUrl}">Открыть расчёт клиента и создать оферту</a>`);
  return lines.join('\n');
}

/** Ссылка для менеджера: форма «Что у вас дома» с вещами клиента в режиме оферты (?team=1). */
export function teamOfferUrl(origin: string, id: string, p: QuotePayload) {
  const L = langOf(p);
  const S = cleanMove(p.move && typeof p.move === 'object' ? p.move : {});
  const meta: Record<string, string> = { lang: L };
  for (const [k, v] of [['name', str(p.name, 80)], ['phone', str(p.phone, 40)], ['date', str(p.date, 10)]] as const) if (v) meta[k] = v;
  return teamFormUrl(origin, href('ru', 'pricing'), id, S, meta);
}
