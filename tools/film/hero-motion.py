#!/usr/bin/env python3
"""
Движение между соседними кадрами первого экрана → src/data/hero-motion.ts (19.11.2026, «главный экран недостаточно плавный»).

Что было не так: в замедленных местах монтажа соседние кадры часто ОДИНАКОВЫЕ (повтор кадра) — картинка «замирает»
и потом прыгает, а в быстрых сценах предметы сдвигаются на 60–140 px за кадр. При равномерной прокрутке это рывки.

Что считаем: оптический поток (OpenCV Farneback, 480×270) для каждой пары кадров → медиана и 95-й перцентиль сдвига
в пикселях 1080p. Из них:
  w — «вес» шага = сколько прокрутки отдать на этот шаг: повтор кадра = 0 (пропускаем), склейка = 1 (мгновенно),
      иначе ≈ среднее медианы и p95/4 → одинаковая видимая скорость движения по всему фильму;
  b — можно ли мягко смешивать два кадра на этом шаге (мелкое движение, без «двоения»).
Запуск: python3 tools/film/hero-motion.py public/scenes/hero/d 247 > src/data/hero-motion.ts
"""
import sys, numpy as np, cv2
from PIL import Image

base, N = sys.argv[1], int(sys.argv[2])
CUTS = {95, 167, 203}          # склейки монтажа (0-based индекс кадра ПЕРЕД склейкой): 0–4 с | 6.5–9.5 | 10–11.5 | 12.5–14.3
BLEND_P95 = 14                 # смешивать соседние кадры, только если 95 % точек сдвинулись меньше чем на 14 px

def load(i):
    return np.asarray(Image.open(f'{base}/{i + 1:04d}.webp').convert('L').resize((480, 270)))

w, b = [], []
prev = load(0)
for i in range(N - 1):
    cur = load(i + 1)
    f = cv2.calcOpticalFlowFarneback(prev, cur, None, 0.5, 3, 21, 3, 5, 1.1, 0)
    mag = np.hypot(f[..., 0], f[..., 1]) * 4
    p95, med = float(np.percentile(mag, 95)), float(np.median(mag))
    if i in CUTS: w.append(1); b.append(0)
    elif p95 < 0.5: w.append(0); b.append(0)                     # повтор кадра
    else:
        w.append(max(6, round((med + p95 / 4) / 2)))   # не меньше 6: медленные сцены (скотч, распаковка) не проскакивают
        b.append(1 if p95 <= BLEND_P95 else 0)
    prev = cur

print('// СГЕНЕРИРОВАНО tools/film/hero-motion.py — не править руками.')
print('// w[i] — сколько прокрутки отдать на шаг кадр i → i+1 (0 = повтор кадра, пропускаем); b[i] = 1 — шаг можно смешивать.')
print(f'export const HERO_W: number[] = {w};')
print(f"export const HERO_B = '{''.join(map(str, b))}';")
