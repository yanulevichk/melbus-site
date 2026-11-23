#!/bin/bash
# Дорисовка промежуточных кадров первого экрана: читает список «кадрA кадрB результат [доля 0..1]» (по строке на кадр)
# и запускает RIFE v4.6 (/opt/rife, ставит tools/film/rife-setup.sh). Пример строки:
#   tools/film/remotion/public/frames72/f00840.jpg tools/film/remotion/public/frames72/f00843.jpg out/m0840.png 0.5
set -euo pipefail
LIST=${1:?список пар}; BIN=/opt/rife/rife-ncnn-vulkan; MODEL=/opt/rife/rife-v4.6
[ -x "$BIN" ] || { echo "сначала tools/film/rife-setup.sh"; exit 1; }
while read -r A B OUT T; do
  [ -z "${A:-}" ] && continue
  mkdir -p "$(dirname "$OUT")"
  "$BIN" -0 "$A" -1 "$B" -o "$OUT" -m "$MODEL" -s "${T:-0.5}" >/dev/null 2>&1 || echo "ошибка: $OUT"
done < "$LIST"
