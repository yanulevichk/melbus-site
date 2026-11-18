/**
 * ОФЕРТА: менеджер открывает ту же форму «Что у вас дома» с вещами клиента (?team=1&s=…), поправляет по видео
 * и создаёт оферту → клиент открывает её по подписанной ссылке и принимает.
 * 18.11.2026: цена считается ЗДЕСЬ той же формулой, что форма на сайте (src/data/move.ts → calc) — одна на всё.
 * Менеджер может добавить корректировку с причиной (видна клиенту только сумма). Хранится в R2: offers/<id>.json.
 */
import { calc, HOURLY, HOURLY2 } from '../src/data/move';
import { PACKAGES, DEPOSIT, OFFER_DAYS } from '../src/data/pricing';
import { href, type Locale } from '../src/i18n/routes';
import { cleanMove, itemText, type MovePayload } from './move';
import { esc } from './telegram';

export interface OfferInput {
  quoteId?: string; lang?: string; name?: string; phone?: string; date?: string; window?: string; note?: string;
  manual?: number; manualReason?: string; move?: MovePayload;
}
export interface OfferPrice { calc: number; manual: number; total: number; deposit: number; hourly?: { rate: number; h: number; min: number } }
export interface Offer {
  id: string; lang: Locale; name: string; phone: string; lvl: number; pay: 'fixed' | 'hourly';
  from: string; to: string; floorsFrom: number; liftFrom: boolean; floorsTo: number; liftTo: boolean;
  date: string; window: string; items: string; note: string; manualReason: string; move: MovePayload;
  price: OfferPrice; createdAt: string; validUntil: string; status: 'sent' | 'accepted'; acceptedAt?: string;
}

const LANGS: Locale[] = ['pl', 'ru', 'uk', 'en'];
const str = (v: unknown, max = 200) => (typeof v === 'string' ? v.trim().slice(0, max) : '');
const int = (v: unknown, min: number, max: number, def: number) => (Number.isInteger(v) && (v as number) >= min && (v as number) <= max ? (v as number) : def);
const r10 = (n: number) => Math.round(n / 10) * 10;
export const ID_RE = /^M-\d{6}-[A-Z0-9]{4}$/;

export function buildOffer(id: string, x: OfferInput, now = new Date()): Offer {
  const lang = (LANGS.includes(x.lang as Locale) ? x.lang : 'pl') as Locale;
  const S = cleanMove(x.move || {});
  const r = calc(S);
  const hourly = S.level === 1 || (S.level === 2 && S.pay === 'hourly');
  const base = r.empty ? 0 : r.total;
  const manual = r10(int(x.manual, -100000, 100000, 0));
  const total = Math.max(0, r10(base + manual));
  const deposit = Math.min(total, Math.max(DEPOSIT.min, r10(total * DEPOSIT.pct)));
  const items = S.level === 1 ? '' : S.list.map((e) => itemText(e, S.level, lang, S.asmAll)).join('\n').slice(0, 3000);
  return {
    id, lang, name: str(x.name, 80), phone: str(x.phone, 40), lvl: S.level, pay: hourly ? 'hourly' : 'fixed',
    from: S.from.place, to: S.to.place, floorsFrom: S.from.floor, liftFrom: S.from.lift, floorsTo: S.to.floor, liftTo: S.to.lift,
    date: /^\d{4}-\d{2}-\d{2}$/.test(str(x.date, 10)) ? str(x.date, 10) : '', window: str(x.window, 40),
    items, note: str(x.note, 1000), manualReason: str(x.manualReason, 200), move: x.move || {},
    price: { calc: base, manual, total, deposit, hourly: hourly ? (S.level === 1 ? { rate: HOURLY, h: r.dur, min: 2 } : { rate: r.hourly2!.rate, h: r.hourly2!.h, min: HOURLY2.min }) : undefined },
    createdAt: now.toISOString(), validUntil: new Date(now.getTime() + OFFER_DAYS * 86400e3).toISOString(), status: 'sent',
  };
}

/** что видит клиент (без телефона, внутренней причины корректировки и сырого списка) */
export const publicOffer = (o: Offer) => {
  const { phone, manualReason, move, ...rest } = o;
  return { ...rest, expired: o.status !== 'accepted' && Date.now() > Date.parse(o.validUntil) };
};

export const offerUrl = (origin: string, o: Offer, sig: string) => `${origin}${href(o.lang, 'offer')}?id=${o.id}&s=${sig}`;

const zl = (n: number) => `${new Intl.NumberFormat('ru').format(n)} zł`;
const dmy = (d: string) => (d ? d.split('-').reverse().join('.') : 'дата не указана');
const pkgName = (o: Offer) => (PACKAGES.find((p) => p.lvl === o.lvl) || PACKAGES[2]).name.ru;

export function offerCreatedMsg(o: Offer, url: string) {
  return [
    `<b>📝 Оферта ${esc(o.id)}</b> · ${esc(o.name || '—')} · сайт ${o.lang.toUpperCase()}`,
    `<b>${esc(pkgName(o))}</b>${o.pay === 'hourly' ? ' (по часам, оценка)' : ''} — <b>${zl(o.price.total)}</b> (задаток ${zl(o.price.deposit)})`,
    `${dmy(o.date)}${o.window ? `, ${esc(o.window)}` : ''} · действует до ${dmy(o.validUntil.slice(0, 10))}`,
    o.price.manual ? `Корректировка ${o.price.manual > 0 ? '+' : ''}${zl(o.price.manual)}${o.manualReason ? `: ${esc(o.manualReason)}` : ''} (по форме было ${zl(o.price.calc)})` : '',
    `<a href="${url}">Открыть оферту</a>`,
  ].filter(Boolean).join('\n');
}

export function offerAcceptedMsg(o: Offer) {
  return [
    `<b>✅ Клиент принял оферту ${esc(o.id)}</b>`,
    `${esc(o.name || '—')}${o.phone ? ` · ${esc(o.phone)}` : ''}`,
    `<b>${esc(pkgName(o))}</b> — <b>${zl(o.price.total)}</b> · ${dmy(o.date)}${o.window ? `, ${esc(o.window)}` : ''}`,
    `Задаток ${zl(o.price.deposit)} — отправьте клиенту ссылку на оплату (BLIK/перевод).`,
  ].join('\n');
}

