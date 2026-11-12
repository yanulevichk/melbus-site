/** POST /api/offer/accept { id, s, agree: true } — клиент принимает оферту → отметка + сообщение в Telegram. */
import { json, type Env } from '../../../server/env';
import { publicOffer, offerAcceptedMsg, ID_RE, type Offer } from '../../../server/offer';
import { verify } from '../../../server/sign';
import { sendTelegram } from '../../../server/telegram';

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  let b: { id?: string; s?: string; agree?: boolean };
  try { b = await request.json(); } catch { return json({ ok: false, error: 'bad_request' }, 400); }
  const id = String(b.id || '');
  if (!env.VIDEOS || !ID_RE.test(id) || !(await verify(env, `offer:${id}`, b.s ?? null))) return json({ ok: false, error: 'not_found' }, 404);
  if (b.agree !== true) return json({ ok: false, error: 'agree' }, 400);
  const key = `offers/${id}.json`;
  const obj = await env.VIDEOS.get(key);
  if (!obj) return json({ ok: false, error: 'not_found' }, 404);
  const o = (await obj.json()) as Offer;
  if (o.status === 'accepted') return json({ ok: true, offer: publicOffer(o) }); // повторное нажатие — без второго сообщения
  if (Date.now() > Date.parse(o.validUntil)) return json({ ok: false, error: 'expired' }, 410);
  o.status = 'accepted';
  o.acceptedAt = new Date().toISOString();
  await env.VIDEOS.put(key, JSON.stringify(o), { httpMetadata: { contentType: 'application/json' } });
  await sendTelegram(env, offerAcceptedMsg(o)).catch((e) => console.error('telegram', e));
  return json({ ok: true, offer: publicOffer(o) });
};
