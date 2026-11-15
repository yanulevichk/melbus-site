/**
 * ОФЕРТА: менеджер создаёт по видео → клиент открывает по ссылке и принимает.
 * Цена пересчитывается ЗДЕСЬ той же формулой, что на сайте (src/data/pricing.ts) — подделать нельзя.
 * Хранится в R2: offers/<id>.json. Ссылка подписана (как ссылки на видео).
 */
import { estimate, PACKAGES, SIZES, EXTRAS, ZONES, AMOUNTS, DATE_ADJ, DEPOSIT, OFFER_DAYS, extraIncluded } from '../src/data/pricing';
import { href, type Locale } from '../src/i18n/routes';
import { esc } from './telegram';

export interface OfferInput {
  quoteId?: string; lang?: string; name?: string; phone?: string;
  size?: number; amount?: number; pkg?: number; zone?: number;
  floorsFrom?: number; liftFrom?: boolean; floorsTo?: number; liftTo?: boolean;
  extras?: number[]; from?: string; to?: string; date?: string; window?: string;
  items?: string; note?: string; dateAdj?: number; manual?: number; manualReason?: string;
}
export interface OfferPrice { pkg: number; dist: number; floors: number; extras: number; adj: number; manual: number; total: number; deposit: number }
export interface Offer {
  id: string; lang: Locale; name: string; phone: string; size: number; amount: number; pkg: number; zone: number;
  floorsFrom: number; liftFrom: boolean; floorsTo: number; liftTo: boolean; extras: number[];
  from: string; to: string; date: string; window: string; items: string; note: string; dateAdj: number; manualReason: string;
  price: OfferPrice; createdAt: string; validUntil: string; status: 'sent' | 'accepted'; acceptedAt?: string;
}

const LANGS: Locale[] = ['pl', 'ru', 'uk', 'en'];
const str = (v: unknown, max = 200) => (typeof v === 'string' ? v.trim().slice(0, max) : '');
const int = (v: unknown, min: number, max: number, def: number) => (Number.isInteger(v) && (v as number) >= min && (v as number) <= max ? (v as number) : def);
const r10 = (n: number) => Math.round(n / 10) * 10;
export const ID_RE = /^M-\d{6}-[A-Z0-9]{4}$/;

export function buildOffer(id: string, x: OfferInput, now = new Date()): Offer {
  const lang = (LANGS.includes(x.lang as Locale) ? x.lang : 'pl') as Locale;
  const size = int(x.size, 0, SIZES.length - 1, 1), pkg = int(x.pkg, 0, PACKAGES.length - 1, 1);
  const amount = int(x.amount, 0, AMOUNTS.length - 1, 1), zone = int(x.zone, 0, ZONES.length - 1, 0);
  const floorsFrom = int(x.floorsFrom, 0, 30, 0), floorsTo = int(x.floorsTo, 0, 30, 0);
  const liftFrom = !!x.liftFrom, liftTo = !!x.liftTo;
  const extras = [...new Set((Array.isArray(x.extras) ? x.extras : []).filter((e) => Number.isInteger(e) && EXTRAS[e] && !extraIncluded(pkg, e)))];
  const dateAdj = int(x.dateAdj, 0, DATE_ADJ.length - 1, 0);
  const manual = int(x.manual, -100000, 100000, 0);
  const e = estimate({ size, amount, zone, pkg, extras, floorsNoLift: (liftFrom ? 0 : floorsFrom) + (liftTo ? 0 : floorsTo) });
  const adj = r10(e.total * DATE_ADJ[dateAdj].k);
  const total = Math.max(0, r10(e.total + adj + manual));
  const deposit = Math.min(total, Math.max(DEPOSIT.min, r10(total * DEPOSIT.pct)));
  return {
    id, lang, name: str(x.name, 80), phone: str(x.phone, 40), size, amount, pkg, zone, floorsFrom, liftFrom, floorsTo, liftTo, extras,
    from: str(x.from), to: str(x.to), date: /^\d{4}-\d{2}-\d{2}$/.test(str(x.date, 10)) ? str(x.date, 10) : '', window: str(x.window, 40),
    items: str(x.items, 2000), note: str(x.note, 1000), dateAdj, manualReason: str(x.manualReason, 200),
    price: { pkg: e.pkg, dist: e.dist, floors: e.floors, extras: e.extras, adj, manual, total, deposit },
    createdAt: now.toISOString(), validUntil: new Date(now.getTime() + OFFER_DAYS * 86400e3).toISOString(), status: 'sent',
  };
}

/** что видит клиент (без телефона и внутренней причины корректировки) */
export const publicOffer = (o: Offer) => {
  const { phone, manualReason, ...rest } = o;
  return { ...rest, expired: o.status !== 'accepted' && Date.now() > Date.parse(o.validUntil) };
};

export const offerUrl = (origin: string, o: Offer, sig: string) => `${origin}${href(o.lang, 'offer')}?id=${o.id}&s=${sig}`;

const zl = (n: number) => `${new Intl.NumberFormat('ru').format(n)} zł`;
const dmy = (d: string) => (d ? d.split('-').reverse().join('.') : 'дата не указана');

export function offerCreatedMsg(o: Offer, url: string) {
  return [
    `<b>📝 Оферта ${esc(o.id)}</b> · ${esc(o.name || '—')} · сайт ${o.lang.toUpperCase()}`,
    `<b>${esc(PACKAGES[o.pkg].name.ru)}</b>, ${esc(SIZES[o.size].status.ru)} — <b>${zl(o.price.total)}</b> (задаток ${zl(o.price.deposit)})`,
    `${dmy(o.date)}${o.window ? `, ${esc(o.window)}` : ''} · действует до ${dmy(o.validUntil.slice(0, 10))}`,
    o.price.manual ? `Корректировка ${o.price.manual > 0 ? '+' : ''}${zl(o.price.manual)}${o.manualReason ? `: ${esc(o.manualReason)}` : ''}` : '',
    `<a href="${url}">Открыть оферту</a>`,
  ].filter(Boolean).join('\n');
}

export function offerAcceptedMsg(o: Offer) {
  return [
    `<b>✅ Клиент принял оферту ${esc(o.id)}</b>`,
    `${esc(o.name || '—')}${o.phone ? ` · ${esc(o.phone)}` : ''}`,
    `<b>${esc(PACKAGES[o.pkg].name.ru)}</b> — <b>${zl(o.price.total)}</b> · ${dmy(o.date)}${o.window ? `, ${esc(o.window)}` : ''}`,
    `Задаток ${zl(o.price.deposit)} — отправьте клиенту ссылку на оплату (BLIK/перевод).`,
  ].join('\n');
}
