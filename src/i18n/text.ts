/**
 * МНОГОЯЗЫЧНЫЕ ТЕКСТЫ: каждая фраза сайта записана сразу на 4 языках (ru, pl, uk, en).
 * Правило проекта: меняем фразу — меняем её на всех языках в той же записи.
 * Тип L требует все 4 языка — пропущенный язык = ошибка сборки.
 */
import type { Locale } from './routes';

export type L = Record<Locale, string>;
/** текст на нужном языке */
export const t = (x: L, locale: Locale): string => x[locale];
/** список пар [заголовок, описание] на нужном языке */
export const tp = (items: [L, L][], locale: Locale): [string, string][] => items.map(([a, b]) => [a[locale], b[locale]]);
