/** Подписанные ссылки на видео: открыть может только тот, у кого есть ссылка из Telegram. */
import type { Env } from './env';

const b64url = (buf: ArrayBuffer) => btoa(String.fromCharCode(...new Uint8Array(buf))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
const secret = (env: Env) => env.LINK_SECRET || `link:${env.TELEGRAM_BOT_TOKEN || ''}`;

async function hmac(env: Env, data: string) {
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(secret(env)), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  return b64url(await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(data)));
}

/** ссылка живёт 60 дней */
export async function videoLink(env: Env, origin: string, key: string, days = 60) {
  const e = Math.floor(Date.now() / 1000) + days * 86400;
  return `${origin}/api/video/${key}?e=${e}&s=${await hmac(env, `${key}.${e}`)}`;
}

export async function checkLink(env: Env, key: string, e: string | null, s: string | null) {
  if (!e || !s || Number(e) < Date.now() / 1000) return false;
  const good = await hmac(env, `${key}.${e}`);
  if (good.length !== s.length) return false;
  let diff = 0; for (let i = 0; i < good.length; i++) diff |= good.charCodeAt(i) ^ s.charCodeAt(i);
  return diff === 0;
}

/** подпись любого текста (например, «offer:M-261112-K4F2») и проверка */
export const sign = (env: Env, data: string) => hmac(env, data);
export async function verify(env: Env, data: string, s: string | null) {
  if (!s) return false;
  const good = await hmac(env, data);
  if (good.length !== s.length) return false;
  let diff = 0; for (let i = 0; i < good.length; i++) diff |= good.charCodeAt(i) ^ s.charCodeAt(i);
  return diff === 0;
}

/** сравнение пароля команды без утечки по времени ответа */
export async function sameSecret(given: string | null, real: string | undefined) {
  if (!given || !real) return false;
  const h = async (x: string) => new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(x)));
  const [a, b] = await Promise.all([h(given), h(real)]);
  let diff = 0; for (let i = 0; i < a.length; i++) diff |= a[i] ^ b[i];
  return diff === 0;
}
