#!/bin/bash
# Пересборка всего пакета соцсетей на всех языках (тексты — src/social/texts.ts).
# Запуск из tools/film/remotion: ./render-social.sh [языки...]   (по умолчанию: ru pl uk en)
# Только часть роликов: REELS="ReelSeal ReelQr" ./render-social.sh pl
# Готовое копируется в marketing/social/2026-11-12/<язык>/ (ролики mp4 — только локально, в git не кладём)
set -e
BX=${BROWSER:-/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell}
LANGS=${@:-ru pl uk en}
R() { npx remotion render src/index.ts "$@" --browser-executable=$BX --log=error; }
S() { npx remotion still src/index.ts "$@" --browser-executable=$BX --log=error; }
M=../../../marketing/stories/2026-11
mkdir -p out/social/profile public/clips
cp $M/hf/hf-*.mp4 $M/src/film-van.jpg public/clips/   # ролики Higgsfield и кадр фильма для обложек
S Avatar out/social/profile/avatar.jpg --jpeg-quality=92
R Highlights out/social/profile/highlights --sequence --image-format=jpeg --jpeg-quality=92
for L in $LANGS; do
  O=out/social/$L; mkdir -p $O
  for C in ${REELS:-ReelFilm ReelPrice ReelCare ReelVan ReelSeal ReelQr ReelFirstNight ReelWardrobe}; do R $C-$L $O/melbus-$C-$L.mp4 --concurrency=4 --crf=18 --jpeg-quality=95; echo "$C-$L"; done
  R Carousel-$L $O/carousel --sequence --image-format=jpeg --jpeg-quality=92
  R CarouselHours-$L $O/carousel-hours --sequence --image-format=jpeg --jpeg-quality=92
  R ReelCovers-$L $O/covers --sequence --image-format=jpeg --jpeg-quality=92
  S OgCard-$L $O/og-1200x630.jpg --jpeg-quality=90
  S CoverFB-$L $O/cover-facebook-1640x624.jpg --jpeg-quality=90
  # → marketing/social/2026-11-12/<язык>/ с понятными именами
  D=../../../marketing/social/2026-11-12/$L; mkdir -p $D/carousel $D/carousel-hours $D/covers
  i=1; for f in $(ls $O/carousel | sort -V); do cp $O/carousel/$f $D/carousel/$(printf %02d $i)-melbus-carousel-$L.jpg; i=$((i+1)); done
  i=1; for f in $(ls $O/carousel-hours | sort -V); do cp $O/carousel-hours/$f $D/carousel-hours/$(printf %02d $i)-melbus-hours-$L.jpg; i=$((i+1)); done
  i=1; for f in $(ls $O/covers | sort -V); do n=$(echo "Film Price Care Van Seal Qr FirstNight Wardrobe" | cut -d' ' -f$i); cp $O/covers/$f $D/covers/$(printf %02d $i)-cover-$n-$L.jpg; i=$((i+1)); done
  cp $O/*.mp4 $O/og-1200x630.jpg $O/cover-facebook-1640x624.jpg $D/
done
mkdir -p ../../../marketing/social/2026-11-12/profile/highlights
cp out/social/profile/avatar.jpg ../../../marketing/social/2026-11-12/profile/
./scripts/profile-grid.sh $LANGS
echo SOCIAL_DONE
