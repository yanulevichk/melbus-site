#!/bin/bash
# Сторис «Дневник запуска» на месяц (тексты — src/social/stories.ts), запуск из tools/film/remotion:
#   ./render-stories.sh [языки...]      (по умолчанию: ru pl uk en)
#   NOVIDEO=1 ./render-stories.sh       — только картинки (быстро), видео не трогать
# Своё фото команды → marketing/stories/2026-11/real/<id сторис>.jpg (например D01-1.jpg)
# Картинка из ChatGPT → marketing/stories/2026-11/gpt/<id подсказки>.jpg (first-night, uniform, floor, boxes…)
# После этого просто запустите скрипт ещё раз — сторис соберутся уже с ними.
set -e
cd "$(dirname "$0")"
ROOT=../../..; M=$ROOT/marketing/stories/2026-11; P=public/stories
BX=${BROWSER:-/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell}
LANGS=${@:-ru pl uk en}
R() { npx remotion render src/index.ts "$@" --browser-executable=$BX --log=error; }

# 1) материалы: готовые картинки и ролики сайта, кадры 3D-черновика, скриншоты сайта, ваши фото и картинки GPT
mkdir -p $P/shots $P/real $P/gpt; rm -f $P/real/* $P/gpt/*
cp $ROOT/public/img/site/{phone,gloves,pack,tape,van-side}.webp $ROOT/public/img/film/step-*.webp $P/
cp $ROOT/public/scenes/box/poster-m.webp $P/box-render.webp
cp $ROOT/public/video/{film-m,phone,gloves,van}.mp4 $P/
cp $M/src/pv-*.jpg $M/src/film-*.jpg $P/
cp $M/src/*-ru.jpg $M/src/*-pl.jpg $M/src/*-uk.jpg $M/src/*-en.jpg $P/shots/
for d in real gpt; do [ -d $M/$d ] && find $M/$d -maxdepth 1 -name '*.jpg' -exec cp {} $P/$d/ \; ; done
node -e "const fs=require('fs');const ls=d=>fs.readdirSync('$P/'+d).filter(f=>f.endsWith('.jpg')).map(f=>f.slice(0,-4));fs.writeFileSync('src/social/stories-media.json',JSON.stringify({real:ls('real'),gpt:ls('gpt')}))"
IDS=$(npx tsx scripts/stories-ids.ts)

# 2) сторис на каждом языке: картинки (одной последовательностью → переименование по id) и видео
for L in $LANGS; do
  O=out/stories/$L; rm -rf $O; mkdir -p $O/seq
  R Stories-$L $O/seq --sequence --image-format=jpeg --jpeg-quality=88
  FILES=($(ls $O/seq | sort -V))
  echo "$IDS" | awk '$1=="still"{print $2, $3}' | while read n id; do mv "$O/seq/${FILES[$n]}" "$O/$id.jpg"; done
  [ -z "$NOVIDEO" ] && for id in $(echo "$IDS" | awk '$1=="video"{print $2}'); do R Story-$id-$L $O/$id.mp4 --crf=23 --concurrency=4; done
  rm -rf $O/seq; mkdir -p $M/$L; rm -f $M/$L/*.jpg; [ -z "$NOVIDEO" ] && rm -f $M/$L/*.mp4; cp $O/* $M/$L/
  echo "stories-$L: $(ls $M/$L | wc -l) файлов"
done

# 3) обложки «Актуального» v2 (без текста — подходят для всех языков)
H=out/stories/highlights; rm -rf $H; R HighlightsV2 $H --sequence --image-format=jpeg --jpeg-quality=92
mkdir -p $M/highlights; i=1; for f in $(ls $H | sort -V); do
  name=$(echo "diary price packages how boxes care vans areas faq" | cut -d' ' -f$i); cp $H/$f $M/highlights/$i-$name.jpg; i=$((i+1)); done
echo STORIES_DONE
