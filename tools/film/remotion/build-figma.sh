#!/bin/bash
# Сторис → Figma: импортёр-плагин одним архивом (тексты и вёрстка — те же, что в render-stories.sh).
#   ./build-figma.sh            → marketing/stories/2026-11/MELBUS-storis-figma.zip
#   COMPARE=1 ./build-figma.sh  → ещё и сверка с готовыми сторис: out/figma/cmp/<язык>-<id>.jpg (слева готовая, справа по описанию)
# Перед этим сторис должны быть собраны (./render-stories.sh), т.к. берутся картинки из public/stories и обложки «Актуального».
set -e
cd "$(dirname "$0")"
npx tsx scripts/figma-spec.ts
node scripts/figma-build.cjs ${COMPARE:+--compare}
node scripts/figma-mock-test.cjs | head -4
