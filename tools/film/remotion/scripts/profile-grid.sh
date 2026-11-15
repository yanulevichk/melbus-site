#!/bin/bash
# Превью сетки профиля: закреплённые сверху (карусель «часы», карусель «6 шагов», фильм), дальше — от новых к старым.
# Плитка 3:4 (так Instagram показывает сетку). → marketing/social/2026-11-12/profile/grid-<язык>.jpg
set -e
cd "$(dirname "$0")/.."
SOC=../../../marketing/social/2026-11-12
for L in ${@:-ru pl uk en}; do
  D=$SOC/$L; T=$(mktemp -d)
  tiles=("$D/carousel-hours/01-melbus-hours-$L.jpg" "$D/carousel/01-melbus-carousel-$L.jpg" "$D/covers/01-cover-Film-$L.jpg"
         "$D/covers/07-cover-FirstNight-$L.jpg" "$D/covers/08-cover-Wardrobe-$L.jpg" "$D/covers/06-cover-Qr-$L.jpg"
         "$D/covers/05-cover-Seal-$L.jpg" "$D/covers/04-cover-Van-$L.jpg" "$D/covers/03-cover-Care-$L.jpg" "$D/covers/02-cover-Price-$L.jpg")
  i=0; for f in "${tiles[@]}"; do
    ffmpeg -loglevel error -y -i "$f" -vf "scale=360:480:force_original_aspect_ratio=increase,crop=360:480" "$T/$(printf %02d $i).png"; i=$((i+1))
  done
  # 10 плиток → 3 колонки × 4 ряда (последние две клетки — пустые)
  for k in 10 11; do ffmpeg -loglevel error -y -f lavfi -i color=c=white:s=360x480 -frames:v 1 "$T/$k.png"; done
  ffmpeg -loglevel error -y -framerate 1 -i "$T/%02d.png" -vf "tile=3x4:margin=0:padding=4:color=white" -frames:v 1 -q:v 3 "$SOC/profile/grid-$L.jpg"
  rm -rf "$T"; echo "grid-$L"
done
