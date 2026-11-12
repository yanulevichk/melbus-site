#!/bin/bash
# Пересборка всего пакета соцсетей на всех языках (тексты — src/social/texts.ts).
# Запуск из tools/film/remotion: ./render-social.sh [языки...]   (по умолчанию: ru pl uk en)
set -e
BX=${BROWSER:-/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell}
LANGS=${@:-ru pl uk en}
R() { npx remotion render src/index.ts "$@" --browser-executable=$BX --log=error; }
S() { npx remotion still src/index.ts "$@" --browser-executable=$BX --log=error; }
mkdir -p out/social/profile
S Avatar out/social/profile/avatar.jpg --jpeg-quality=92
R Highlights out/social/profile/highlights --sequence --image-format=jpeg --jpeg-quality=92
for L in $LANGS; do
  O=out/social/$L; mkdir -p $O
  for C in ReelFilm ReelPrice ReelCare ReelVan; do R $C-$L $O/melbus-$C-$L.mp4 --concurrency=4 --crf=18 --jpeg-quality=95; echo "$C-$L"; done
  R Carousel-$L $O/carousel --sequence --image-format=jpeg --jpeg-quality=92
  S OgCard-$L $O/og-1200x630.jpg --jpeg-quality=90
  S CoverFB-$L $O/cover-facebook-1640x624.jpg --jpeg-quality=90
done
echo SOCIAL_DONE
