/**
 * POST /api/offer/create — менеджер создаёт оферту (заголовок x-team-key = секрет TEAM_KEY).
 * Ответ: { ok, id, url, offer } — url отправляем клиенту.
 */
import { json, rand, type Env } from '../../../server/env';
import { buildOffer, publicOffer, offerUrl, offerCreatedMsg, ID_RE, type Offer, type OfferInput } from '../../../server/offer';
import { sign, sameSecret } from '../../../server/sign';
import { sendTelegram } from '../../../server/telegram';

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  if (!env.TEAM_KEY || !env.VIDEOS) return json({ ok: false, error: 'not_configured' }, 501);
  if (!(await sameSecret(request.headers.get('x-team-key'), env.TEAM_KEY))) return json({ ok: false, error: 'bad_key' }, 401);
  let x: OfferInput;
  try { x = await request.json(); } catch { return json({ ok: false, error: 'bad_request' }, 400); }
  const d = new Date();
  const id = x.quoteId && ID_RE.test(x.quoteId) ? x.quoteId
    : `M-${String(d.getUTCFullYear()).slice(2)}${String(d.getUTCMonth() + 1).padStart(2, '0')}${String(d.getUTCDate()).padStart(2, '0')}-${rand(4).toUpperCase()}`;
  const key = `offers/${id}.json`;
  const old = await env.VIDEOS.get(key);
  if (old && ((await old.json()) as Offer).status === 'accepted') return json({ ok: false, error: 'already_accepted', id }, 409);
  const offer = buildOffer(id, x, d);
  await env.VIDEOS.put(key, JSON.stringify(offer), { httpMetadata: { contentType: 'application/json' } });
  const url = offerUrl(new URL(request.url).origin, offer, await sign(env, `offer:${id}`));
  await sendTelegram(env, offerCreatedMsg(offer, url)).catch((e) => console.error('telegram', e));
  return json({ ok: true, id, url, offer: publicOffer(offer) });
};
