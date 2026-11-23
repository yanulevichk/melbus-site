#!/bin/bash
# Установка программы дорисовки промежуточных кадров RIFE (rife-ncnn-vulkan, открытый проект nihui на GitHub) в /opt/rife.
# Разрешение на запуск — .claude/settings.json (владелец разрешил 23.11.2026). Архив проверяется по SHA-256 —
# если файл на GitHub подменят, установка остановится.
set -euo pipefail
VER=20221029
URL="https://github.com/nihui/rife-ncnn-vulkan/releases/download/$VER/rife-ncnn-vulkan-$VER-ubuntu.zip"
SHA=1e2c7ee7fa7daa326542d50622f0afedc80cf6f1858bda411d16385ffa5cdf68
DIR=/opt/rife
if [ -x "$DIR/rife-ncnn-vulkan" ]; then echo "уже установлено: $DIR"; exit 0; fi
dpkg -s libvulkan1 mesa-vulkan-drivers >/dev/null 2>&1 || apt-get install -y -q libvulkan1 mesa-vulkan-drivers >/dev/null
TMP=$(mktemp -d)
curl -sSL -o "$TMP/rife.zip" "$URL"
echo "$SHA  $TMP/rife.zip" | sha256sum -c --quiet
mkdir -p "$DIR" && unzip -q "$TMP/rife.zip" -d "$TMP" && cp -r "$TMP/rife-ncnn-vulkan-$VER-ubuntu/." "$DIR/"
chmod +x "$DIR/rife-ncnn-vulkan"; rm -rf "$TMP"
echo "готово: $DIR"
