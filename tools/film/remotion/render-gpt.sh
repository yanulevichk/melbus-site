#!/bin/bash
# Посты из картинок ChatGPT (банк подсказок — src/social/gptbank.ts, инструкция — marketing/gpt/README.md).
#   1) картинку из ChatGPT сохранить как marketing/gpt/<id>.jpg|png|webp (id — из README, например dishes.jpg)
#   2) ./render-gpt.sh [языки]  → marketing/gpt/<язык>/post-NN-<id>-<язык>.jpg (4:5, NN — номер в плане) и story-NN-<id>-<язык>.jpg (9:16)
set -e
cd "$(dirname "$0")"
M=../../../marketing/gpt; P=public/gpt
BX=${BROWSER:-/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell}
LANGS=${@:-ru pl uk en}
R() { npx remotion render src/index.ts "$@" --browser-executable=$BX --log=error; }
mkdir -p $P $M; rm -f $P/*
for f in $(find $M -maxdepth 1 -type f \( -name '*.jpg' -o -name '*.jpeg' -o -name '*.png' -o -name '*.webp' \)); do
  id=$(basename "$f"); id=${id%.*}
  ffmpeg -loglevel error -y -i "$f" -vf "scale='min(1600,iw)':-2" -q:v 3 "$P/$id.jpg"
done
node -e "const fs=require('fs');fs.writeFileSync('src/social/gpt-media.json',JSON.stringify({ready:fs.readdirSync('$P').filter(f=>f.endsWith('.jpg')).map(f=>f.slice(0,-4))}))"
READY=$(npx tsx -e "import {GPT_READY} from './src/social/GptKit'; import {GPT_POSTS} from './src/social/gptbank'; console.log(GPT_READY.map((p) => String(GPT_POSTS.indexOf(p) + 1).padStart(2, '0') + ':' + p.id).join(' '))" 2>/dev/null)
[ -z "$READY" ] && { echo "Картинок ещё нет: сохраните их в marketing/gpt/<id>.jpg"; exit 0; }
echo "готово к сборке: $READY"
for L in $LANGS; do
  O=out/gpt/$L; rm -rf $O; mkdir -p $O $M/$L
  R GptPosts-$L $O/posts --sequence --image-format=jpeg --jpeg-quality=92
  R GptStories-$L $O/stories --sequence --image-format=jpeg --jpeg-quality=90
  i=1; for x in $READY; do n=${x%%:*}; id=${x##*:}
    cp $O/posts/$(ls $O/posts | sort -V | sed -n ${i}p) $M/$L/post-$n-$id-$L.jpg
    cp $O/stories/$(ls $O/stories | sort -V | sed -n ${i}p) $M/$L/story-$n-$id-$L.jpg; i=$((i+1)); done
  echo "gpt-$L: $(ls $M/$L | wc -l) файлов"
done
npx tsx scripts/gpt-readme.ts > $M/README.md
echo GPT_DONE
