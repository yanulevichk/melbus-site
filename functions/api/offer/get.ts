/** GET /api/offer/get?id=…&s=… — оферта для клиента (по подписанной ссылке). */
import { json, type Env } from '../../../server/env';
import { publicOffer, ID_RE, type Offer } from '../../../server/offer';
import { verify } from '../../../server/sign';

export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  const u = new URL(request.url);
  const id = u.searchParams.get('id') || '';
  if (!env.VIDEOS || !ID_RE.test(id) || !(await verify(env, `offer:${id}`, u.searchParams.get('s')))) return json({ ok: false, error: 'not_found' }, 404);
  const obj = await env.VIDEOS.get(`offers/${id}.json`);
  if (!obj) return json({ ok: false, error: 'not_found' }, 404);
  return json({ ok: true, offer: publicOffer((await obj.json()) as Offer) });
};
