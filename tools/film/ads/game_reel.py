"""
РОЛИК «МИССИЯ: ВАРШАВА» (9:16, 12 с, 30 к/с) — имитация игры от третьего лица под техно 150 уд/мин.
Поверх шести клипов рисуется игровой интерфейс: заставка задания, мини-карта с маршрутом (едет вместе с героем),
счётчик посылок, часы, подсказки задания, всплывающее «+1», финал «МИССИЯ ВЫПОЛНЕНА» с наградой.

  ADS_FONTS=<папка со шрифтами> python3 game_reel.py <папка с клипами c1..c6.mp4> <музыка.mp3> <выход.mp4> [--still t] [--skip сек]

--skip — сколько секунд музыки пропустить в начале, чтобы первый удар попал в ноль.
"""
import os, sys, subprocess, math, random
import numpy as np
from PIL import Image, ImageDraw
sys.path.insert(0, os.path.dirname(__file__))
from day_reel import load_clip, text_layer, paste, fit, font, clamp, eout, UB, ON, W, H, FPS

DUR, BEAT = 12.0, 0.4
GOLD, GREEN, PINK, WHITE, INK = (255, 200, 40), (120, 225, 110), (255, 86, 190), (255, 255, 255), (12, 14, 20)

# (начало, конец, клип, с какой секунды клипа, скорость, подсказка задания, скорость карты пикс/с)
EDL = [
    (0.0, 2.4, 1, 0.2, 1.0, 'Иди к бусу', 18),
    (2.4, 3.6, 2, 0.3, 1.3, 'Садись за руль', 0),
    (3.6, 6.0, 3, 0.2, 1.0, 'Езжай по маршруту', 300),
    (6.0, 7.2, 4, 0.2, 1.2, 'Отнеси посылку', 45),
    (7.2, 8.4, 5, 0.2, 1.2, 'Вручи посылку', 0),
    (8.4, 12.0, 6, 0.0, 0.8, '', 0),
]
T_HUD, T_END, T_PLUS = 0.8, 8.4, 7.6
TAG = 'Курьер · маршруты GLS · Варшава'
BADGE = 'ИЩЕМ КУРЬЕРОВ · ВАРШАВА'
T_HIRE = 9.4            # «Миссия выполнена» сменяется на «Ищем курьеров»
PAY, SUB, CTA = '7000–8000 zł', 'пн–пт · доставка посылок GLS', 'НАПИШИ В WHATSAPP'

def parcels(t):
    if t < 3.6: return 0
    if t < 6.0: return int(33 * (t - 3.6) / 2.4)
    if t < T_PLUS: return 33
    if t < 7.8: return 34
    return min(120, 34 + int(86 * eout((t - 7.8) / .55)))

def game_clock(t):
    m = 330 + (40 * t / 3.6 if t < 3.6 else 40 + 510 * clamp((t - 3.6) / (T_END - 3.6)))
    return '%02d:%02d' % (int(m) // 60, int(m) % 60)

def build_map():
    """Большая карта «города» с розовым маршрутом; возвращает картинку и точки маршрута (снизу вверх)."""
    S = 2600; rnd = random.Random(5)
    im = Image.new('RGB', (S, S), (30, 34, 44)); d = ImageDraw.Draw(im)
    for i in range(-10, 40):
        d.line((i * 110 + 20, 0, i * 110 - 380, S), fill=(84, 90, 106), width=14 if i % 3 else 24)
        d.line((0, i * 96, S, i * 96 + 330), fill=(84, 90, 106), width=14 if i % 4 else 24)
    for _ in range(40):
        x, y = rnd.randrange(S), rnd.randrange(S); d.ellipse((x, y, x + rnd.randrange(30, 90), y + rnd.randrange(30, 70)), fill=(40, 62, 52))
    pts = [(1300, 2400)]
    for dx, dy in [(-20, -140), (150, -60), (-25, -330), (-190, -70), (-30, -360), (210, -80), (-25, -300), (160, -60), (-30, -420)]:
        pts.append((pts[-1][0] + dx, pts[-1][1] + dy))
    d.line(pts, fill=PINK, width=16, joint='curve')
    for p in pts[1:]: d.ellipse((p[0] - 8, p[1] - 8, p[0] + 8, p[1] + 8), fill=PINK)
    e = pts[-1]; d.ellipse((e[0] - 20, e[1] - 20, e[0] + 20, e[1] + 20), fill=GOLD)
    return im, pts

def along(pts, s):
    for a, b in zip(pts, pts[1:]):
        L = math.hypot(b[0] - a[0], b[1] - a[1])
        if s <= L: return a[0] + (b[0] - a[0]) * s / L, a[1] + (b[1] - a[1]) * s / L, math.atan2(b[0] - a[0], -(b[1] - a[1]))
        s -= L
    return pts[-1][0], pts[-1][1], 0.0

def main():
    args = [a for a in sys.argv[1:] if not a.startswith('--')]
    clips_dir, music, out = args[0], args[1], args[2]
    opt = lambda k, dflt: float(sys.argv[sys.argv.index(k) + 1]) if k in sys.argv else dflt
    still, skip = opt('--still', None), opt('--skip', 0.0)
    clips = {i: load_clip(os.path.join(clips_dir, f'c{i}.mp4')) for i in range(1, 7)}
    city, route = build_map()
    K = dict(stroke=5, pad=(16, 14))
    L_m1 = text_layer('ВАКАНСИЯ · МИССИЯ 01', font(ON, 46), GOLD, stroke=4, pad=(12, 10))
    L_badge = text_layer(BADGE, fit(BADGE, UB, 44, 900), INK, plate=(*GOLD, 255), pad=(30, 18))
    L_hire1 = text_layer('ИЩЕМ', fit('КУРЬЕРОВ', UB, 150, 1000, 7), GOLD, stroke=7, pad=(20, 16))
    L_hire2 = text_layer('КУРЬЕРОВ', fit('КУРЬЕРОВ', UB, 150, 1000, 7), GOLD, stroke=7, pad=(20, 16))
    L_join = text_layer('ТЕПЕРЬ ТВОЯ ОЧЕРЕДЬ', font(ON, 44), WHITE, stroke=4, pad=(12, 10))
    L_m2 = text_layer('РАЗВЕЗИ СВОЙ РАЙОН', fit('РАЗВЕЗИ СВОЙ РАЙОН', UB, 84, 980, 6), WHITE, stroke=6, pad=(16, 14))
    L_tag = text_layer(TAG, font(ON, 38), GOLD, stroke=4, pad=(12, 10))
    hints = {e[5]: text_layer(e[5], font(ON, 46), WHITE, stroke=4, pad=(12, 10)) for e in EDL if e[5]}
    L_plus = text_layer('+1 ПОСЫЛКА', font(UB, 58), GREEN, **K)
    L_done1 = text_layer('МИССИЯ', fit('ВЫПОЛНЕНА', UB, 150, 1000, 7), GOLD, stroke=7, pad=(20, 16))
    L_done2 = text_layer('ВЫПОЛНЕНА', fit('ВЫПОЛНЕНА', UB, 150, 1000, 7), GOLD, stroke=7, pad=(20, 16))
    L_rew = text_layer('НАГРАДА', font(ON, 44), WHITE, stroke=4, pad=(12, 10))
    L_pay = text_layer(PAY, fit(PAY, UB, 124, 1000, 6), GREEN, stroke=6, pad=(18, 16))
    L_sub = text_layer(SUB, fit(SUB, ON, 46, 960, 4), WHITE, stroke=4, pad=(12, 10))
    L_cta = text_layer(CTA, fit(CTA, UB, 54, 860), INK, plate=(*GOLD, 255), pad=(44, 28))
    L_vis = text_layer('Визуализация', font(ON, 26), (255, 255, 255, 180), stroke=2, pad=(8, 6))
    cache = {}
    def txt(s, size, col):
        if (s, size, col) not in cache: cache[(s, size, col)] = text_layer(s, font(UB, size), col, **K)
        return cache[(s, size, col)]
    MW, MH, MX, MY = 340, 240, 60, 1110
    frames = range(int(DUR * FPS)) if still is None else [int(still * FPS)]
    enc = None
    if still is None:
        enc = subprocess.Popen(['ffmpeg', '-v', 'error', '-y', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-s', f'{W}x{H}', '-r', str(FPS), '-i', '-',
                                '-ss', str(skip), '-i', music, '-t', str(DUR), '-af', f'afade=t=out:st={DUR - 0.5}:d=0.5,loudnorm=I=-14:TP=-1.5',
                                '-c:v', 'libx264', '-preset', 'slow', '-crf', '17', '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-b:a', '192k',
                                '-movflags', '+faststart', '-shortest', out], stdin=subprocess.PIPE)
    pos = 0.0; last_t = 0.0
    for f in range(int(DUR * FPS)):
        t = f / FPS
        ei = max(i for i, e in enumerate(EDL) if t >= e[0] - 1e-6); e = EDL[ei]
        pos += e[6] * (t - last_t); last_t = t           # путь по карте копится всегда, даже если кадр не рисуем
        if f not in frames: continue
        since = t - e[0]; beat = (t % BEAT) / BEAT
        src = clips[e[2]]; arr = src[min(int((e[3] + since * e[4]) * FPS), len(src) - 1)]
        img = Image.fromarray(arr)
        punch = 1 + .1 * (1 - eout(since / .2)) + .012 * (1 - eout(beat / .5))
        if punch > 1.002:
            cw, ch = W / punch, H / punch
            img = img.resize((W, H), Image.BICUBIC, box=((W - cw) / 2, (H - ch) / 2, (W + cw) / 2, (H + ch) / 2))
        arr = np.asarray(img).astype(np.int16)
        sh = int(12 * (1 - eout(since / .14)))
        if sh > 0 and ei > 0: arr[:, :, 0] = np.roll(arr[:, :, 0], sh, axis=1); arr[:, :, 2] = np.roll(arr[:, :, 2], -sh, axis=1)
        fl = (.55 if t < T_END else .85) * (1 - eout(since / .14)) if ei > 0 else 0
        if fl > .01: arr = arr + (255 - arr) * fl
        if t < T_HUD: arr = arr * (.55 + .45 * eout((t - .55) / .25))                     # заставка задания — картинка темнее
        if t >= T_END: arr = arr * (1 - .22 * eout((t - T_END - .1) / .4))
        img = Image.fromarray(np.clip(arr, 0, 255).astype(np.uint8)).convert('RGBA')
        # ---------- заставка задания
        if t < T_HUD + .15:
            a = 1 - clamp((t - T_HUD) / .15)
            paste(img, L_m1, W / 2, 700, 1, a * clamp(t / .1))
            n = max(1, int(len('РАЗВЕЗИ СВОЙ РАЙОН') * clamp(t / .45)))
            if n >= 18: paste(img, L_m2, W / 2, 790, 1 + .06 * (1 - eout((t - .45) / .2)), a)
            else: paste(img, text_layer('РАЗВЕЗИ СВОЙ РАЙОН'[:n], fit('РАЗВЕЗИ СВОЙ РАЙОН', UB, 84, 980, 6), WHITE, stroke=6, pad=(16, 14)), W / 2, 790, 1, a)
        # ---------- игровой интерфейс
        if T_HUD <= t < T_END + .12:
            a = clamp((t - T_HUD) / .15) * (1 - clamp((t - T_END) / .12))
            hud = Image.new('RGBA', (W, H), (0, 0, 0, 0))
            # мини-карта (повёрнута по ходу движения)
            x, y, ang = along(route, pos)
            win = city.crop((int(x - 300), int(y - 300), int(x + 300), int(y + 300))).rotate(math.degrees(ang), resample=Image.BICUBIC)
            win = win.crop((300 - MW // 2, 300 - MH // 2 - 40, 300 + MW // 2, 300 + MH // 2 - 40)).convert('RGBA')
            wd = ImageDraw.Draw(win); cx, cy = MW // 2, MH // 2 + 40
            wd.polygon([(cx, cy - 20), (cx - 15, cy + 16), (cx, cy + 8), (cx + 15, cy + 16)], fill=WHITE, outline=INK)
            hd = ImageDraw.Draw(hud)
            hd.rectangle((MX - 6, MY - 6, MX + MW + 6, MY + MH + 30), fill=(0, 0, 0, 215))
            hud.paste(win, (MX, MY))
            hd.rectangle((MX, MY + MH + 8, MX + MW // 2 - 4, MY + MH + 22), fill=(90, 190, 100, 255))
            hd.rectangle((MX + MW // 2 + 4, MY + MH + 8, MX + MW * 3 // 4 - 2, MY + MH + 22), fill=(90, 160, 230, 255))
            hd.rectangle((MX + MW * 3 // 4 + 6, MY + MH + 8, MX + MW, MY + MH + 22), fill=(*GOLD, 255))
            # часы и счётчик посылок справа сверху
            n = parcels(t)
            c = txt(game_clock(t), 46, WHITE); hud.alpha_composite(c, (W - 50 - c.width, 322))
            pop = 1 + .25 * (1 - eout((t - T_PLUS) / .25)) if t >= T_PLUS else 1
            c = txt('ПОСЫЛКИ %d/120' % n, 40, GREEN if n >= 120 else WHITE)
            paste(hud, c, W - 50 - c.width / 2, 422, pop)
            hd.rectangle((W - 420, 468, W - 60, 486), fill=(0, 0, 0, 200)); hd.rectangle((W - 420, 468, W - 420 + int(360 * n / 120), 486), fill=(*GREEN, 255))
            # подсказка задания и подпись
            if e[5]: paste(hud, hints[e[5]], W / 2, 1450, 1 + .12 * (1 - eout(since / .18)), clamp(since / .08))
            paste(hud, L_tag, W / 2, 1512)
            if a < .99: hud.putalpha(hud.getchannel('A').point(lambda v: int(v * a)))
            img.alpha_composite(hud)
            if T_PLUS <= t < T_PLUS + .8:
                k = t - T_PLUS; paste(img, L_plus, W / 2, 900 - 160 * eout(k / .7), 1 + .5 * (1 - eout(k / .15)), 1 - clamp((k - .5) / .3))
        # ---------- финал
        if t >= T_END:
            k = t - T_END
            if t < T_HIRE + .1:
                o = 1 - clamp((t - T_HIRE) / .1)
                paste(img, L_done1, W / 2, 390, 1 + 1.4 * (1 - eout(k / .18)), clamp(k / .06) * o)
                paste(img, L_done2, W / 2, 535, 1 + 1.4 * (1 - eout((k - .12) / .18)), clamp((k - .12) / .06) * o)
            if t >= T_HIRE:
                h = t - T_HIRE
                paste(img, L_join, W / 2, 322, 1, clamp(h / .1))
                paste(img, L_hire1, W / 2, 405, 1 + 1.4 * (1 - eout(h / .18)), clamp(h / .06))
                paste(img, L_hire2, W / 2, 545, 1 + 1.4 * (1 - eout((h - .1) / .18)), clamp((h - .1) / .06))
            if k >= .8:
                paste(img, L_rew, W / 2, 660, 1, clamp((k - .8) / .1))
                paste(img, L_pay, W / 2, 760, 1 + .5 * (1 - eout((k - .8) / .2)), clamp((k - .8) / .08))
            if k >= 1.6: paste(img, L_sub, W / 2, 872, 1 + .2 * (1 - eout((k - 1.6) / .2)), clamp((k - 1.6) / .08))
            if k >= 2.4: paste(img, L_cta, W / 2, 1440, (1 + .4 * (1 - eout((k - 2.4) / .2))) * (1 + .035 * (1 - eout(beat / .5))), clamp((k - 2.4) / .08))
            paste(img, L_tag, W / 2, 1540, 1, clamp((k - 2.4) / .1))
        paste(img, L_badge, W / 2, 255, 1 + .5 * (1 - eout(t / .25)), eout(t / .15))
        paste(img, L_vis, 110, 1610, 1, .9)
        if still is not None: img.convert('RGB').save(out, quality=90); return
        enc.stdin.write(img.convert('RGB').tobytes())
    enc.stdin.close(); enc.wait()

if __name__ == '__main__': main()
