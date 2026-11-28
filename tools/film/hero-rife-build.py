#!/usr/bin/env python3
"""
Первый экран: настоящие кадры + дорисованные RIFE середины → новая последовательность public/scenes/hero/{d,m} (28.11.2026).

Как получены середины: пары соседних кадров с большим движением (быстрые места монтажа) → tools/film/rife-interp.sh
(RIFE v4.6, строка «frames72/f<k>.jpg frames72/f<k+3>.jpg <rife>/m<k:05d>.png 0.5»). Каждую середину смотрели глазами
(кадр A | середина | кадр B): там, где быстро закрываются двери буса, мебель влетает в коробку или крупно смазан скотч,
RIFE «плавит» картинку — такие кадры переносим в <rife>/rejected/ и они не попадают в фильм.

Кодирование середин: сырой PNG RIFE чуть мягче и «шумнее» настоящих кадров (в AVIF весил вдвое больше) →
лёгкое шумоподавление + мягкая резкость (VF ниже): вес и резкость как у соседей.

Запуск (из корня репозитория):
  python3 tools/film/hero-rife-build.py <папка rife с m*.png> <папка вывода>
  затем скопировать <вывод>/{d,m} в public/scenes/hero/{d,m}, в tools/film/hero-frames.json записать seq.json
  (src, cuts), data-n в src/components/HeroFilm.astro, N/CUTS в public/proto/hero/proto.js и пересчитать
  python3 tools/film/hero-motion.py public/scenes/hero/d <N> <cuts> > src/data/hero-motion.ts
Исходный список — только настоящие кадры (числа в src hero-frames.json; строки "r<k>" — уже дорисованные, пропускаются).
"""
import json, os, shutil, subprocess, sys
from concurrent.futures import ThreadPoolExecutor

RIFE, OUT = sys.argv[1], sys.argv[2]
DRY = '--dry' in sys.argv          # только посчитать последовательность (seq.json), без кодирования
REPO = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
F72 = f'{REPO}/tools/film/remotion/public/frames72'
VF = 'hqdn3d=1.5:1.5:0:0,unsharp=5:5:0.5:5:5:0'
AV = ['-c:v', 'libaom-av1', '-still-picture', '1', '-crf', '28', '-cpu-used', '6', '-threads', '1']
WP = ['-c:v', 'libwebp', '-quality', '72']

H = json.load(open(f'{REPO}/tools/film/hero-frames.json'))
real = [k for k in H['src'] if isinstance(k, int)]
# склейки в нумерации только настоящих кадров
cuts_real, ri = set(), -1
for i, k in enumerate(H['src']):
    if isinstance(k, int): ri += 1
    if i in set(H['cuts']): cuts_real.add(ri)

seq = []
for i, k in enumerate(real):
    seq.append(('r', k))
    if i not in cuts_real and i + 1 < len(real) and real[i + 1] == k + 3 and os.path.exists(f'{RIFE}/m{k:05d}.png'):
        seq.append(('m', k))
cuts = [n for n, (t, k) in enumerate(seq) if t == 'r' and real.index(k) in cuts_real]

def enc(job):
    n, (t, k) = job
    src, vf = (f'{F72}/f{k:05d}.jpg', None) if t == 'r' else (f'{RIFE}/m{k:05d}.png', VF)
    j = lambda *f: ','.join(x for x in (vf, *f) if x) or 'null'
    for f, args, out in ((j(), AV, f'd/{n:04d}.avif'), (j('scale=1280:720:flags=lanczos'), WP, f'd/{n:04d}.webp'),
                         (j('crop=608:1080:656:0'), AV, f'm/{n:04d}.avif'), (j('crop=608:1080:656:0'), WP, f'm/{n:04d}.webp')):
        subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', src, '-vf', f, *args, f'{OUT}/{out}'], check=True)

for s in ('d', 'm'): os.makedirs(f'{OUT}/{s}', exist_ok=True)
if not DRY:
    with ThreadPoolExecutor(os.cpu_count() or 4) as ex: list(ex.map(enc, enumerate(seq, 1)))
json.dump({'n': len(seq), 'cuts': cuts, 'src': [k if t == 'r' else f'r{k}' for t, k in seq]}, open(f'{OUT}/seq.json', 'w'))
print('кадров', len(seq), 'дорисовано', sum(t == 'm' for t, _ in seq), 'склейки', cuts)
