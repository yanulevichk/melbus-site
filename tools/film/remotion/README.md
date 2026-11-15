# Монтаж фильма первого экрана (Remotion)

Отдельный мини-проект, сайт не затрагивает. Remotion 4 (лицензия: бесплатно для фирм до 3 человек, иначе Company License — remotion.dev/license).

## Как собрать
1. Склеить черновики Seedance: `tools/film/assemble-drafts.sh` → `raw_joined.mp4` (42 с, 854×480, 24 к/с).
2. Дорисовать промежуточные кадры для замедлений (24 → 72 к/с):
   `ffmpeg -i raw_joined.mp4 -vf "minterpolate=fps=72:mi_mode=mci:mc_mode=aobmc:me_mode=bidir:vsbmc=1:scd=none" -crf 12 interp72.mp4`
3. Кадры 1080p с резкостью в `public/frames72/`:
   `ffmpeg -i interp72.mp4 -vf "hqdn3d=1.2:1.2:2:2,scale=1920:1080:flags=lanczos,cas=0.9,unsharp=5:5:0.5:3:3:0" -q:v 2 -start_number 0 public/frames72/f%05d.jpg`
4. `npm install`, рендер:
   `npx remotion render src/index.ts Hero out/melbus-hero.mp4 --browser-executable=/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell --concurrency=4 --crf=16`

## Где что
- `src/remap.ts` — скорость каждой сцены (`SEGMENTS`): >1 быстрее, <1 замедление. Плавные разгоны/торможения — `BLEND`.
- `src/Hero.tsx` — на обычной скорости берутся только настоящие кадры, дорисованные — только в замедлениях; бесшовный повтор; пометка «Wizualizacja / Визуализация».
- `src/Root.tsx` — композиции `Hero` (с пометкой) и `HeroClean` (без неё — если пометку ставит сайт).
