"""
Надписи и озвучка поверх готового ролика рекламы «Ищем курьеров GLS» (1080×1920).
  python3 overlay.py <видео> <выход> <заголовок через |> [--voice файл.mp3] [--sub "подстрочник цены"] [--noprice] [--py Y]
Шрифты: Unbounded 800 и Onest 600 (TTF собираются из woff2 проекта, путь — в FONTS).
"""
import sys, os, subprocess, json
from PIL import Image, ImageDraw, ImageFont, ImageFilter

FONTS = os.environ.get('ADS_FONTS', os.path.join(os.path.dirname(__file__), 'fonts'))
UB = os.path.join(FONTS, 'unbounded-800.ttf'); ON = os.path.join(FONTS, 'onest-600.ttf')
W, H = 1080, 1920
TEAL, GRAPH, WHITE = (20, 220, 213), (16, 22, 29), (255, 255, 255)

a = sys.argv[1:]
src, out, head = a[0], a[1], a[2].replace('|', '\n')
voice = a[a.index('--voice') + 1] if '--voice' in a else None
sub = a[a.index('--sub') + 1] if '--sub' in a else 'пн–пт · в 15:00 свободен'
noprice = '--noprice' in a
PY = int(a[a.index('--py') + 1]) if '--py' in a else 1185      # высота блока цены
tmp = out + '.layers'; os.makedirs(tmp, exist_ok=True)

def layer(): return Image.new('RGBA', (W, H), (0, 0, 0, 0))
def font(p, s): return ImageFont.truetype(p, s)
def text_c(d, y, s, f, fill, spacing=10):
    box = d.multiline_textbbox((0, 0), s, font=f, spacing=spacing, align='center')
    w, h = box[2] - box[0], box[3] - box[1]
    d.multiline_text(((W - w) / 2 - box[0], y - h / 2 - box[1]), s, font=f, fill=fill, spacing=spacing, align='center')
    return w, h
def plate(img, y, w, h, fill, r=18):
    d = ImageDraw.Draw(img); d.rounded_rectangle(((W - w) / 2, y - h / 2, (W + w) / 2, y + h / 2), r, fill=fill)

# 1 — плашка сверху
L1 = layer(); f = font(UB, 34); d = ImageDraw.Draw(L1)
w, h = text_c(d, 250, 'ИЩЕМ КУРЬЕРОВ GLS · ВАРШАВА', f, GRAPH)
L1 = layer(); plate(L1, 250, w + 56, h + 44, TEAL + (255,), 14); text_c(ImageDraw.Draw(L1), 250, 'ИЩЕМ КУРЬЕРОВ GLS · ВАРШАВА', f, GRAPH)
# 2 — заголовок (белый, мягкая тень)
L2 = layer()
if head.strip():
    f = font(UB, 84); sh = layer(); text_c(ImageDraw.Draw(sh), 452, head, f, (0, 0, 0, 200), 14)
    L2 = Image.alpha_composite(L2, sh.filter(ImageFilter.GaussianBlur(14))); L2 = Image.alpha_composite(L2, sh.filter(ImageFilter.GaussianBlur(4)))
    text_c(ImageDraw.Draw(L2), 446, head, f, WHITE, 14)
# 3 — цена
L3 = layer()
if not noprice:
    f = font(UB, 92); w, h = text_c(ImageDraw.Draw(layer()), 0, '6500–8000 zł', f, TEAL)
    plate(L3, PY, w + 80, h + 70, GRAPH + (235,), 22); text_c(ImageDraw.Draw(L3), PY, '6500–8000 zł', f, TEAL)
f = font(ON, 38); yy = PY + 115 if not noprice else PY + 135
w, h = text_c(ImageDraw.Draw(layer()), 0, sub, f, WHITE)
plate(L3, yy, w + 48, h + 34, GRAPH + (215,), 14); text_c(ImageDraw.Draw(L3), yy, sub, f, WHITE)
# 4 — лента-«скотч» с призывом
L4 = layer(); band = Image.new('RGBA', (W + 200, 120), TEAL + (255,))
f = font(UB, 46); bd = ImageDraw.Draw(band); bb = bd.textbbox((0, 0), 'НАПИШИ В WHATSAPP', font=f)
bd.text(((W + 200 - (bb[2] - bb[0])) / 2 - bb[0], (120 - (bb[3] - bb[1])) / 2 - bb[1]), 'НАПИШИ В WHATSAPP', font=f, fill=GRAPH)
band = band.rotate(2.2, expand=True, resample=Image.BICUBIC); L4.alpha_composite(band, (-100, 1450 - band.height // 2))
f = font(ON, 32); w, h = text_c(ImageDraw.Draw(layer()), 0, 'Доставка посылок GLS · Варшава', f, WHITE)
plate(L4, 1570, w + 44, h + 30, GRAPH + (215,), 12); text_c(ImageDraw.Draw(L4), 1570, 'Доставка посылок GLS · Варшава', f, WHITE)
# 0 — пометка
L0 = layer(); ImageDraw.Draw(L0).text((40, 150), 'Визуализация', font=font(ON, 24), fill=(255, 255, 255, 140))
for i, L in enumerate((L0, L1, L2, L3, L4)): L.save(f'{tmp}/L{i}.png')

dur = float(subprocess.check_output(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', src]))
T = [0, .1, dur * .12, dur * .42, dur * .68]          # когда появляется каждый слой
cmd = ['ffmpeg', '-y', '-loglevel', 'error', '-i', src]
for i in range(5): cmd += ['-loop', '1', '-t', f'{dur}', '-i', f'{tmp}/L{i}.png']
fc = '[0:v]fps=24,scale=1080:1920:flags=lanczos,unsharp=5:5:0.5[b0];'
for i in range(5):
    fc += f'[{i + 1}:v]format=rgba,fade=in:st={T[i]:.2f}:d=0.3:alpha=1[l{i}];[b{i}][l{i}]overlay=shortest=1[b{i + 1}];'
fc += '[b5]format=yuv420p[v]'
maps = ['-map', '[v]']
if voice:
    vd = float(subprocess.check_output(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', voice]))
    tempo = max(1.0, min(1.25, vd / (dur - .5)))
    cmd += ['-i', voice]
    fc += f';[6:a]atempo={tempo:.3f},adelay=250:all=1,apad=whole_dur={dur},volume=1.6[a]'
    maps += ['-map', '[a]', '-c:a', 'aac', '-b:a', '160k']
cmd += ['-filter_complex', fc] + maps + ['-c:v', 'libx264', '-crf', '18', '-r', '24', '-t', f'{dur}', '-movflags', '+faststart', out]
subprocess.check_call(cmd); print('ok', out, round(dur, 2))
