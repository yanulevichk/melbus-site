/**
 * Настройки сервера заявок (Cloudflare Pages Functions).
 * Секреты задаются в Cloudflare: Pages → проект → Settings → Variables and Secrets. В git их НЕТ.
 */
export interface Env {
  /** токен бота от @BotFather */
  TELEGRAM_BOT_TOKEN?: string;
  /** куда слать заявки: id чата/группы (например -1001234567890) */
  TELEGRAM_CHAT_ID?: string;
  /** только для проверки на своём компьютере: адрес поддельного Telegram */
  TELEGRAM_API?: string;
  /** секрет для ссылок на видео; если не задан — берётся от токена бота */
  LINK_SECRET?: string;
  /** пароль команды для создания оферт (инструмент /team/oferta/) */
  TEAM_KEY?: string;
  /** хранилище видео и оферт (R2), привязка в wrangler.toml */
  VIDEOS?: R2Bucket;
}

export const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), { status, headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' } });

/** ключ видео в хранилище: quotes/2026-11-12/ab12cd34ef56-kuchnia.mp4 */
export const KEY_RE = /^quotes\/\d{4}-\d{2}-\d{2}\/[a-z0-9]{12}-[a-z0-9._-]{1,80}$/;
export const MAX_VIDEO = 2 * 1024 ** 3; // 2 ГБ на файл
export const PART = 10 * 1024 ** 2;     // куски по 10 МБ (все, кроме последнего, одного размера — так требует R2)

export const rand = (n: number) => {
  const a = new Uint8Array(n); crypto.getRandomValues(a);
  return Array.from(a, (b) => 'abcdefghijklmnopqrstuvwxyz0123456789'[b % 36]).join('');
};
