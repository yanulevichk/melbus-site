"""Нарезка листов 3D-иконок (GPT Image, 3×3 на белом) в отдельные файлы.
  python3 tools/icons/cut-icons.py
Листы: brand/ai/icons-2026-11-14/sheet-N.(png|jpg). Порядок имён = порядок клеток (слева направо, сверху вниз).
Выход: public/img/icons/<имя>.webp (192 px, сайт), prototypes/media/icons/<имя>.webp (прототип формы),
       tools/film/remotion/public/icons/<имя>.jpg (512 px, «Актуальное» и Figma)."""
import os
from PIL import Image, ImageChops
SHEETS = 'brand/ai/icons-2026-11-14'
NAMES = [
    ['bed2', 'bed1', 'wardS', 'wardM', 'wardL', 'dresser', 'nights', 'mirror', 'bunk'],
    ['sofa', 'sofaC', 'armch', 'tv', 'tvst', 'shelf', 'ctable', 'rug', 'lamp'],
    ['plant', 'fridge', 'washer', 'dishw', 'dtable', 'chair', 'desk', 'ochair', 'crib'],
    ['pc', 'hall', 'bike', 'stroll', 'balc', 'tires', 'bags', 'box', 'drill'],
    ['tvwall', 'putty', 'rod', 'frame', 'bin', 'unpack', 'tape', 'boxes', 'blanket'],
    ['piano', 'safe', 'clean', 'phone', 'tag', 'calendar', 'pin', 'keys', 'house'],
    ['notebook', 'gloves', 'wheel', 'chat', 'globe', 'road', 'block', 'clapper', 'shield'],
]
OUT = [('public/img/icons', 192, 'webp'), ('prototypes/media/icons', 192, 'webp'), ('tools/film/remotion/public/icons', 512, 'jpg')]
for d, _, _ in OUT: os.makedirs(d, exist_ok=True)
for si, row in enumerate(NAMES, 1):
    src = next(f'{SHEETS}/sheet-{si}.{e}' for e in ('png', 'jpg') if os.path.exists(f'{SHEETS}/sheet-{si}.{e}'))
    im = Image.open(src).convert('RGB'); W, H = im.size; cw, ch = W / 3, H / 3
    for k, n in enumerate(row):
        x0, y0 = int((k % 3) * cw), int((k // 3) * ch)
        cell = im.crop((x0, y0, int(x0 + cw), int(y0 + ch)))
        mask = ImageChops.difference(cell, Image.new('RGB', cell.size, (255, 255, 255))).convert('L').point(lambda v: 255 if v > 10 else 0)
        bb = mask.getbbox()
        if bb: cell = cell.crop(bb)
        s = max(cell.size); pad = int(s * 0.06); S = s + 2 * pad
        sq = Image.new('RGB', (S, S), (255, 255, 255)); sq.paste(cell, ((S - cell.width) // 2, (S - cell.height) // 2))
        for d, px, fmt in OUT:
            r = sq.resize((px, px), Image.LANCZOS)
            r.save(f'{d}/{n}.{fmt}', 'WEBP' if fmt == 'webp' else 'JPEG', quality=86 if fmt == 'webp' else 90)
print(sum(len(r) for r in NAMES), 'icons')
