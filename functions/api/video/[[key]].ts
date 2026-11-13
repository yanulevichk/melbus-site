/**
 * GET /api/video/quotes/…/file.mp4?e=…&s=… — видео клиента по подписанной ссылке из Telegram.
 * Поддерживает перемотку (Range), чтобы видео играло прямо в телефоне.
 */
import { KEY_RE, type Env } from '../../../server/env';
import { checkLink } from '../../../server/sign';

export const onRequestGet: PagesFunction<Env> = async ({ request, env, params }) => {
  const key = (Array.isArray(params.key) ? params.key : [params.key]).join('/');
  const u = new URL(request.url);
  if (!env.VIDEOS || !KEY_RE.test(key) || !(await checkLink(env, key, u.searchParams.get('e'), u.searchParams.get('s')))) {
    return new Response('Not found', { status: 404 });
  }
  const range = request.headers.has('range') ? request.headers : undefined;
  const obj = await env.VIDEOS.get(key, range ? { range } : {});
  if (!obj) return new Response('Not found', { status: 404 });
  const h = new Headers();
  obj.writeHttpMetadata(h);
  h.set('etag', obj.httpEtag);
  h.set('accept-ranges', 'bytes');
  h.set('cache-control', 'private, max-age=3600');
  h.set('x-robots-tag', 'noindex');
  h.set('content-disposition', `inline; filename="${key.split('/').pop()}"`);
  const r = obj.range as { offset?: number; length?: number } | undefined;
  if (range && r && typeof r.offset === 'number') {
    const len = r.length ?? obj.size - r.offset;
    h.set('content-range', `bytes ${r.offset}-${r.offset + len - 1}/${obj.size}`);
    h.set('content-length', String(len));
    return new Response(obj.body, { status: 206, headers: h });
  }
  h.set('content-length', String(obj.size));
  return new Response(obj.body, { headers: h });
};
