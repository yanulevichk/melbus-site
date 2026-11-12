/**
 * Таблица маршрутов: один ключ страницы → свой адрес на каждом языке.
 * Все 4 языка включены. PL — основной (без префикса): «/», RU — /ru/, UA — /uk/, EN — /en/.
 */
import { serviceSlug } from '../data/services';

export type Locale = 'ru' | 'pl' | 'uk' | 'en';

export const locales: Record<Locale, { label: string; htmlLang: string; prefix: string; enabled: boolean }> = {
  ru: { label: 'RU', htmlLang: 'ru', prefix: '/ru', enabled: true },
  pl: { label: 'PL', htmlLang: 'pl', prefix: '', enabled: true },
  uk: { label: 'UA', htmlLang: 'uk', prefix: '/uk', enabled: true },
  en: { label: 'EN', htmlLang: 'en', prefix: '/en', enabled: true },
};

export const enabledLocales = (Object.keys(locales) as Locale[]).filter((l) => locales[l].enabled);

export type PageKey =
  | 'home' | 'services' | 'pricing' | 'calculator' | 'quote' | 'guarantee' | 'how'
  | 'about' | 'faq' | 'contact' | 'terms' | 'privacy' | 'cookies' | 'complaints' | 'lux'
  | `service:${string}`;

/** слаги страниц; '' = главная языка */
export const slugs: Record<string, Partial<Record<Locale, string>>> = {
  home:       { ru: '', pl: '', uk: '', en: '' },
  services:   { ru: 'uslugi', pl: 'uslugi', uk: 'poslugy', en: 'services' },
  pricing:    { ru: 'ceny', pl: 'cennik', uk: 'tsiny', en: 'pricing' },
  calculator: { ru: 'kalkulyator', pl: 'kalkulator', uk: 'kalkulyator', en: 'calculator' },
  quote:      { ru: 'zayavka', pl: 'wycena', uk: 'zayavka', en: 'quote' },
  guarantee:  { ru: 'garantiya-ceny', pl: 'gwarancja-stalej-ceny', uk: 'garantiya-tsiny', en: 'fixed-price-guarantee' },
  how:        { ru: 'kak-my-rabotaem', pl: 'jak-pracujemy', uk: 'yak-my-pratsyuyemo', en: 'how-we-work' },
  about:      { ru: 'o-nas', pl: 'o-nas', uk: 'pro-nas', en: 'about' },
  faq:        { ru: 'voprosy', pl: 'faq', uk: 'pytannya', en: 'faq' },
  contact:    { ru: 'kontakty', pl: 'kontakt', uk: 'kontakty', en: 'contact' },
  terms:      { ru: 'reglament', pl: 'regulamin', uk: 'reglament', en: 'terms' },
  privacy:    { ru: 'konfidencialnost', pl: 'polityka-prywatnosci', uk: 'konfidentsiynist', en: 'privacy' },
  cookies:    { ru: 'cookies', pl: 'cookies', uk: 'cookies', en: 'cookies' },
  complaints: { ru: 'reklamacii', pl: 'reklamacje', uk: 'reklamatsii', en: 'complaints' },
  lux:        { ru: 'lux', pl: 'lux', uk: 'lux', en: 'lux' }, // копия главной (noindex): люкс-версия стала главной 12.11.2026
};

export function href(locale: Locale, key: PageKey): string {
  const p = locales[locale].prefix;
  if (key.startsWith('service:')) {
    return `${p}/${slugs.services[locale]}/${serviceSlug(key.slice(8), locale)}/`;
  }
  const s = slugs[key]?.[locale] ?? '';
  return s ? `${p}/${s}/` : `${p}/` || '/';
}
