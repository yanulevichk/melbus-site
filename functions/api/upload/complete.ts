/** POST /api/upload/complete { key, uploadId, parts: [{ partNumber, etag }] } → { ok, key, size } */
import { json, KEY_RE, type Env } from '../../../server/env';

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  if (!env.VIDEOS) return json({ ok: false, error: 'no_storage' }, 501);
  let b: { key?: string; uploadId?: string; parts?: { partNumber: number; etag: string }[] };
  try { b = await request.json(); } catch { return json({ ok: false, error: 'bad_request' }, 400); }
  if (!b.key || !KEY_RE.test(b.key) || !b.uploadId || !Array.isArray(b.parts) || !b.parts.length) return json({ ok: false, error: 'bad_request' }, 400);
  const parts = b.parts.map((p) => ({ partNumber: Number(p.partNumber), etag: String(p.etag) })).sort((a, z) => a.partNumber - z.partNumber);
  const obj = await env.VIDEOS.resumeMultipartUpload(b.key, b.uploadId).complete(parts);
  return json({ ok: true, key: obj.key, size: obj.size });
};
