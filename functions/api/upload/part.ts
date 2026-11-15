/** PUT /api/upload/part?key=…&uploadId=…&n=1 (тело — кусок видео до 10 МБ) → { partNumber, etag } */
import { json, KEY_RE, PART, type Env } from '../../../server/env';

export const onRequestPut: PagesFunction<Env> = async ({ request, env }) => {
  if (!env.VIDEOS) return json({ ok: false, error: 'no_storage' }, 501);
  const u = new URL(request.url);
  const key = u.searchParams.get('key') || '', uploadId = u.searchParams.get('uploadId') || '', n = Number(u.searchParams.get('n'));
  if (!KEY_RE.test(key) || !uploadId || !(Number.isInteger(n) && n >= 1 && n <= 10000)) return json({ ok: false, error: 'bad_request' }, 400);
  // кусок сразу течёт в хранилище, не задерживаясь в памяти (лимит процессора на бесплатном тарифе — 10 мс)
  const len = Number(request.headers.get('content-length'));
  if (!request.body || !(len > 0 && len <= PART)) return json({ ok: false, error: 'bad_part' }, 400);
  const part = await env.VIDEOS.resumeMultipartUpload(key, uploadId).uploadPart(n, request.body);
  return json({ ok: true, partNumber: part.partNumber, etag: part.etag });
};
