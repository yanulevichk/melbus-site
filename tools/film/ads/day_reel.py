"""
РОЛИК «ОДИН ДЕНЬ» (9:16, 12 с, 30 к/с) — монтаж под техно 150 уд/мин.
Склейки ровно на удар бочки (0,4 с), на каждой склейке — «удар» зумом, белая вспышка и сдвиг цветов;
огромные часы-афиша, которые «прокручиваются» между планами; финал — стоп-кадр с условиями.

  ADS_FONTS=<папка со шрифтами> python3 day_reel.py <папка с клипами c1..c7.mp4> <музыка.mp3> <выход.mp4> [--still t]

Раскладка (EDL) и тексты — ниже, в начале файла.
"""
import os, sys, subprocess, math, random
import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageFilter

FONTS = os.environ.get('ADS_FONTS', os.path.join(os.path.dirname(__file__), 'fonts'))
UB = os.path.join(FONTS, 'unbounded-800.ttf'); ON = os.path.join(FONTS, 'onest-600.ttf')
W, H, FPS, DUR, BEAT = 1080, 1920, 30, 12.0, 0.4
TEAL, GRAPH, WHITE = (20, 220, 213), (16, 22, 29), (255, 255, 255)

# (начало, конец, клип, с какой секунды клипа, скорость, часы, подпись)
EDL = [
    (0.0, 2.4, 1, 0.3, 1.0, '05:30', 'подъём'),
    (2.4, 4.0, 2, 0.2, 1.3, '06:40', 'загрузка'),
    (4.0, 4.8, 3, 0.3, 1.2, '09:10', 'адрес'),
    (4.8, 5.6, 4, 0.3, 1.2, '11:25', 'ещё адрес'),
    (5.6, 6.8, 5, 0.2, 1.2, '13:05', 'вручил'),
    (6.8, 8.0, 6, 0.6, 1.0, '14:40', 'кузов пустой'),
    (8.0, 8.4, 0, 0.0, 1.0, '15:00', ''),            # чёрный такт
    (8.4, 12.0, 7, 0.0, 1.0, '15:00', ''),
]
FREEZE_AT = 10.4          # с этой секунды — стоп-кадр под условия
BADGE = 'КУРЬЕР · МАРШРУТЫ GLS · ВАРШАВА'
FINAL = [(9.2, 'СВОБОДЕН'), (10.0, '6500–8000 zł'), (10.4, 'пн–пт · доставка посылок GLS'), (10.8, 'НАПИШИ В WHATSAPP')]

def font(p, s): return ImageFont.truetype(p, s)
def clamp(v, a=0.0, b=1.0): return max(a, min(b, v))
def eout(k): return 1 - (1 - clamp(k)) ** 3

def load_clip(path):
    """Все кадры клипа 1080×1920 (обрезка по центру), 30 к/с."""
    cmd = ['ffmpeg', '-v', 'error', '-i', path, '-vf',
           f'fps={FPS},scale={W}:{H}:force_original_aspect_ratio=increase:flags=lanczos,crop={W}:{H},unsharp=5:5:0.6',
           '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-']
    raw = subprocess.run(cmd, capture_output=True, check=True).stdout
    return np.frombuffer(raw, np.uint8).reshape(-1, H, W, 3)

def text_layer(s, fnt, fill, plate=None, pad=(34, 20), stroke=0):
    d = ImageDraw.Draw(Image.new('RGBA', (8, 8)))
    x0, y0, x1, y1 = d.textbbox((0, 0), s, font=fnt, stroke_width=stroke)
    w, h = x1 - x0, y1 - y0
    im = Image.new('RGBA', (w + pad[0] * 2, h + pad[1] * 2), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    if plate: d.rectangle((0, 0, im.width, im.height), fill=plate)
    d.text((pad[0] - x0, pad[1] - y0), s, font=fnt, fill=fill, stroke_width=stroke, stroke_fill=(0, 0, 0, 255))
    return im

def paste(base, layer, cx, cy, scale=1.0, alpha=1.0, angle=0.0):
    if alpha <= 0.01: return
    if abs(scale - 1) > .005: layer = layer.resize((max(1, int(layer.width * scale)), max(1, int(layer.height * scale))), Image.BICUBIC)
    if angle: layer = layer.rotate(angle, expand=True, resample=Image.BICUBIC)
    if alpha < .99:
        a = layer.getchannel('A').point(lambda v: int(v * alpha)); layer = layer.copy(); layer.putalpha(a)
    base.alpha_composite(layer, (int(cx - layer.width / 2), int(cy - layer.height / 2)))

def fit(s, path, size, maxw, stroke=0):
    f = font(path, size)
    while ImageDraw.Draw(Image.new('RGB', (8, 8))).textlength(s, font=f) + stroke * 2 > maxw: size -= 4; f = font(path, size)
    return f

def main():
    args = [a for a in sys.argv[1:] if not a.startswith('--')]
    clips_dir, music, out = args[0], args[1], args[2]
    still = float(sys.argv[sys.argv.index('--still') + 1]) if '--still' in sys.argv else None
    clips = {i: load_clip(os.path.join(clips_dir, f'c{i}.mp4')) for i in range(1, 8)}
    rnd = random.Random(7)
    # слои текста
    L_badge = text_layer(BADGE, fit(BADGE, UB, 40, 900), GRAPH, plate=(*TEAL, 255), pad=(30, 18))
    F_clock = font(UB, 250)
    clocks = {}
    def clock(s):
        if s not in clocks: clocks[s] = text_layer(s, F_clock, WHITE, stroke=6, pad=(20, 20))
        return clocks[s]
    caps = {e[6]: text_layer(e[6].upper(), font(UB, 46), TEAL, plate=(*GRAPH, 235), pad=(26, 14)) for e in EDL if e[6]}
    L_free = text_layer('СВОБОДЕН', fit('СВОБОДЕН', UB, 150, 980, 5), TEAL, stroke=5, pad=(20, 20))
    L_pay = text_layer(FINAL[1][1], fit(FINAL[1][1], UB, 104, 960), WHITE, plate=(*GRAPH, 240), pad=(36, 22))
    L_sub = text_layer(FINAL[2][1], fit(FINAL[2][1], ON, 46, 940), WHITE, plate=(*GRAPH, 240), pad=(28, 14))
    L_cta = text_layer(FINAL[3][1], fit(FINAL[3][1], UB, 56, 900), GRAPH, plate=(*TEAL, 255), pad=(1080, 26))
    L_vis = text_layer('Визуализация', font(ON, 26), (255, 255, 255, 170), pad=(8, 6))
    cuts = [e[0] for e in EDL]
    frames = range(int(DUR * FPS)) if still is None else [int(still * FPS)]
    enc = None
    if still is None:
        enc = subprocess.Popen(['ffmpeg', '-v', 'error', '-y', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-s', f'{W}x{H}', '-r', str(FPS), '-i', '-',
                                '-i', music, '-t', str(DUR), '-af', f'afade=t=out:st={DUR - .5}:d=.5,loudnorm=I=-14:TP=-1.5',
                                '-c:v', 'libx264', '-preset', 'slow', '-crf', '17', '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-b:a', '192k',
                                '-movflags', '+faststart', '-shortest', out], stdin=subprocess.PIPE)
    for f in frames:
        t = f / FPS
        ei = max(i for i, e in enumerate(EDL) if t >= e[0] - 1e-6); e = EDL[ei]
        since = t - e[0]                                    # с последней склейки
        beat = (t % BEAT) / BEAT                            # 0 на ударе
        # --- картинка
        if e[2] == 0:
            arr = np.zeros((H, W, 3), np.uint8)
        else:
            tt = min(t, FREEZE_AT) if e[2] == 7 else t
            src = clips[e[2]]; k = int((e[3] + (tt - e[0]) * e[4]) * FPS)
            arr = src[min(k, len(src) - 1)]
        img = Image.fromarray(arr)
        punch = 1 + .16 * (1 - eout(since / .2)) + .018 * (1 - eout(beat / .5))
        if e[2] == 7 and t > FREEZE_AT: punch += .05 * eout((t - FREEZE_AT) / 1.6)
        if punch > 1.002:
            cw, ch = W / punch, H / punch
            img = img.resize((W, H), Image.BICUBIC, box=((W - cw) / 2, (H - ch) / 2, (W + cw) / 2, (H + ch) / 2))
        arr = np.asarray(img).astype(np.int16)
        # сдвиг цветов на склейке
        sh = int(22 * (1 - eout(since / .16)))
        if sh > 0 and e[2] != 0:
            arr[:, :, 0] = np.roll(arr[:, :, 0], sh, axis=1); arr[:, :, 2] = np.roll(arr[:, :, 2], -sh, axis=1)
            for _ in range(3):                                   # «сбитые» полосы
                y = rnd.randrange(200, H - 300); hh = rnd.randrange(14, 60)
                arr[y:y + hh] = np.roll(arr[y:y + hh], rnd.randrange(-70, 70), axis=1)
        fl = .75 * (1 - eout(since / .12)) if ei > 0 else 0
        if fl > .01: arr = arr + (255 - arr) * fl
        if e[2] == 7 and t > FREEZE_AT: arr = arr * (1 - .38 * eout((t - FREEZE_AT) / .3))   # затемнение под условия
        # лёгкая виньетка сверху и снизу под текст
        img = Image.fromarray(np.clip(arr, 0, 255).astype(np.uint8)).convert('RGBA')
        # --- надписи
        paste(img, L_badge, W / 2, 255, 1 + .5 * (1 - eout(t / .25)), eout(t / .15))
        final = t >= 8.0
        cs = e[5]
        if since < .14:                                         # цифры «прокручиваются»
            cs = '%02d:%02d' % (rnd.randrange(5, 15), rnd.randrange(0, 60))
        cy = 470 if not final else 520
        paste(img, clock(cs), W / 2, cy, (1.0 if not final else 1.12) * (1 + .22 * (1 - eout(since / .18))), 1.0,
              0 if final else (-2 if ei % 2 else 2))
        if e[6]: paste(img, caps[e[6]], W / 2, 665, 1 + .3 * (1 - eout((since - .06) / .16)), clamp((since - .04) / .08))
        if t >= FINAL[0][0]:
            k = t - FINAL[0][0]; paste(img, L_free, W / 2, 760, 1 + 1.2 * (1 - eout(k / .16)), clamp(k / .06), -3)
        if t >= FINAL[1][0]:
            k = t - FINAL[1][0]; paste(img, L_pay, W / 2, 1010, 1 + .4 * (1 - eout(k / .18)), clamp(k / .08))
        if t >= FINAL[2][0]:
            k = t - FINAL[2][0]; paste(img, L_sub, W / 2, 1130, 1 + .3 * (1 - eout(k / .18)), clamp(k / .08))
        if t >= FINAL[3][0]:
            k = t - FINAL[3][0]
            band = L_cta.crop((int(L_cta.width / 2 - 560 * eout(k / .22)), 0, int(L_cta.width / 2 + 560 * eout(k / .22)), L_cta.height))
            paste(img, band, W / 2, 1290, 1 + .03 * (1 - eout(beat / .5)), 1.0, 2.2)
        paste(img, L_vis, 110, 1500, 1, .9)
        if still is not None: img.convert('RGB').save(out, quality=90); return
        enc.stdin.write(img.convert('RGB').tobytes())
    enc.stdin.close(); enc.wait()

if __name__ == '__main__': main()
