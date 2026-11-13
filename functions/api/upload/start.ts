/**
 * POST /api/upload/start { name, type, size } → { key, uploadId, part }
 * Видео грузится прямо в хранилище R2 кусками по 10 МБ (ограничение Cloudflare на запрос — 100 МБ,
 * а видео с телефона бывают по 300 МБ+). Если хранилище не подключено — 501, форма уйдёт без видео.
 */
import { json, rand, MAX_VIDEO, PART, type Env } from '../../../server/env';

const EXT = /\.(mp4|mov|m4v|webm|3gp|avi|mkv|hevc)$/i;

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  if (!env.VIDEOS) return json({ ok: false, error: 'no_storage' }, 501);
  let b: { name?: string; type?: string; size?: number };
  try { b = await request.json(); } catch { return json({ ok: false, error: 'bad_request' }, 400); }
  const name = String(b.name || 'video.mp4').slice(0, 120);
  const type = String(b.type || '');
  if (!(type.startsWith('video/') || EXT.test(name))) return json({ ok: false, error: 'not_video' }, 415);
  if (!(Number(b.size) > 0 && Number(b.size) <= MAX_VIDEO)) return json({ ok: false, error: 'too_big' }, 413);
  const safe = name.toLowerCase().normalize('NFKD').replace(/[^\w.-]+/g, '-').replace(/^-+|-+$/g, '').slice(-80) || 'video.mp4';
  const key = `quotes/${new Date().toISOString().slice(0, 10)}/${rand(12)}-${safe}`;
  const mpu = await env.VIDEOS.createMultipartUpload(key, { httpMetadata: { contentType: type || 'video/mp4' } });
  return json({ ok: true, key, uploadId: mpu.uploadId, part: PART });
};
