/**
 * POST /api/quote — заявка с сайта → сообщение в Telegram команде MELBUS.
 * Ответ: { ok: true, id: "M-261112-K4F2" } или { ok: false, error: "phone" | "spam" | "send" }.
 */
import { json, rand, KEY_RE, type Env } from '../../server/env';
import { check, quoteMessage, teamOfferUrl, type QuotePayload } from '../../server/message';
import { sendTelegram } from '../../server/telegram';
import { videoLink } from '../../server/sign';

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  let p: QuotePayload;
  try { p = await request.json(); } catch { return json({ ok: false, error: 'bad_request' }, 400); }
  const bad = check(p);
  if (bad === 'spam') return json({ ok: true, id: 'M-000000-0000' }); // боту делаем вид, что всё хорошо
  if (bad) return json({ ok: false, error: bad }, 400);

  const d = new Date();
  const id = `M-${String(d.getUTCFullYear()).slice(2)}${String(d.getUTCMonth() + 1).padStart(2, '0')}${String(d.getUTCDate()).padStart(2, '0')}-${rand(4).toUpperCase()}`;
  p.videos = (Array.isArray(p.videos) ? p.videos : []).filter((v) => v && typeof v.key === 'string' && KEY_RE.test(v.key));
  const origin = new URL(request.url).origin;
  const links = await Promise.all(p.videos.map((v) => videoLink(env, origin, v.key)));
  try {
    await sendTelegram(env, quoteMessage(id, p, links, teamOfferUrl(origin, id, p)));
  } catch (e) {
    console.error('quote send failed', e);
    return json({ ok: false, error: 'send' }, 502);
  }
  return json({ ok: true, id });
};
