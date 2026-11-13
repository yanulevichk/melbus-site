// Данные постов (обложки Reels) — общие для Remotion (PostKit.tsx) и выгрузки в Figma (scripts/figma-spec.ts)
import {CLIP_REELS, FILM, type L} from './texts';

export const COVERS = ['Film', 'Price', 'Care', 'Van', 'Seal', 'Qr', 'FirstNight', 'Wardrobe'] as const;
export type CoverId = (typeof COVERS)[number];
// кадр для фона: клип и секунда (у фильма — кадр монтажа)
export const COVER_BG: Record<CoverId, {clip?: string; img?: string; at: number; pos?: string}> = {
  Film: {img: 'clips/film-van.jpg', at: 0}, Price: {clip: 'phone.mp4', at: 2.2}, Care: {clip: 'gloves.mp4', at: 2.4}, Van: {clip: 'van.mp4', at: 2.0},
  Seal: {clip: 'hf-tape.mp4', at: 3.2}, Qr: {clip: 'hf-qr.mp4', at: 2.6}, FirstNight: {clip: 'hf-first-night.mp4', at: 1.9}, Wardrobe: {clip: 'hf-wardrobe.mp4', at: 3.4},
};
export const coverTitle = (id: CoverId): [L, L] => (id === 'Film' ? FILM.hook : CLIP_REELS[id].title);
