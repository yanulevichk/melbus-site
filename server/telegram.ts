/** Отправка сообщения в Telegram через Bot API. */
import type { Env } from './env';

export const esc = (s: unknown) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

export async function sendTelegram(env: Env, html: string) {
  if (!env.TELEGRAM_BOT_TOKEN || !env.TELEGRAM_CHAT_ID) throw new Error('telegram_not_configured');
  const api = (env.TELEGRAM_API || 'https://api.telegram.org').replace(/\/$/, '');
  const r = await fetch(`${api}/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ chat_id: env.TELEGRAM_CHAT_ID, text: html.slice(0, 4000), parse_mode: 'HTML', disable_web_page_preview: true }),
  });
  if (!r.ok) throw new Error(`telegram_${r.status}: ${(await r.text()).slice(0, 200)}`);
}
