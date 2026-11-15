/** Отправка сообщения в Telegram через Bot API. */
import type { Env } from './env';

export const esc = (s: unknown) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

export async function sendTelegram(env: Env, html: string) {
  if (!env.TELEGRAM_BOT_TOKEN || !env.TELEGRAM_CHAT_ID) throw new Error('telegram_not_configured');
  const api = (env.TELEGRAM_API || 'https://api.telegram.org').replace(/\/$/, '');
  // лимит Telegram — 4096 знаков: длинную заявку режем по строкам, чтобы не разорвать HTML-теги
  const parts: string[] = [];
  for (const line of html.split('\n')) {
    const cur = parts[parts.length - 1];
    if (cur !== undefined && cur.length + line.length + 1 <= 3900) parts[parts.length - 1] = cur + '\n' + line;
    else parts.push(line.slice(0, 3900));
  }
  for (const text of parts) {
    const r = await fetch(`${api}/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ chat_id: env.TELEGRAM_CHAT_ID, text, parse_mode: 'HTML', disable_web_page_preview: true }),
    });
    if (!r.ok) throw new Error(`telegram_${r.status}: ${(await r.text()).slice(0, 200)}`);
  }
}
