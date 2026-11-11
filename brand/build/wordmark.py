"""Надпись MELBUS шрифтом Krona One → SVG-кривые; локапы знак+надпись."""
from fontTools.ttLib import TTFont
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.boundsPen import BoundsPen
import re
FONT = '/home/user/moving-site/node_modules/@fontsource/krona-one/files/krona-one-latin-400-normal.woff2'
f = TTFont(FONT); gs = f.getGlyphSet(); cmap = f.getBestCmap(); upm = f['head'].unitsPerEm
TRACK = 0.04 * upm
def word(text):
    x = 0; paths = []
    for ch in text:
        g = cmap[ord(ch)]
        pen = SVGPathPen(gs); gs[g].draw(pen)
        paths.append((ch, x, pen.getCommands()))
        x += gs[g].width + TRACK
    bp = BoundsPen(gs); gs[cmap[ord('M')]].draw(bp)
    capH = bp.bounds[3]
    return paths, x - TRACK, capH
paths, wdt, capH = word('MELBUS')

def wordmark_group(c1, c2, scale, tx, ty):
    # шрифт: y вверх → переворачиваем
    out = [f'<g transform="translate({tx},{ty}) scale({scale},{-scale})">']
    for i, (ch, x, d) in enumerate(paths):
        out.append(f'<path transform="translate({x},0)" d="{d}" fill="{c1 if i < 3 else c2}"/>')
    out.append('</g>')
    return '\n'.join(out)

mark_src = {k: open(f'/home/user/moving-site/public/brand/mark-{k}.svg').read() for k in ['dark', 'light', 'white', 'black']}
def inner(svg, idp):
    body = re.sub(r'^<svg[^>]*>|</svg>$', '', svg.strip(), flags=re.S)
    return re.sub(r'id="(\w+)"', lambda m: f'id="{idp}{m.group(1)}"', body).replace('url(#', f'url(#{idp}')
vb = [float(v) for v in re.search(r'viewBox="([^"]+)"', mark_src['dark']).group(1).split()]
VX, VY, MW, MH = vb  # viewBox знака с полями

def lockup(variant, c1, c2, name):
    # знак высотой 100, надпись капителью 44, по центру знака
    s_mark = 100 / MH
    s_word = 44 / capH
    gap = 30
    mw = MW * s_mark
    W = mw + gap + wdt * s_word
    svg = [f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W:.1f} 100">',
           f'<g transform="scale({s_mark})"><svg viewBox="{VX} {VY} {MW} {MH}" width="{MW}" height="{MH}">{inner(mark_src[variant], name)}</svg></g>',
           wordmark_group(c1, c2, s_word, mw + gap, 50 + 22), '</svg>']
    open(f'/home/user/moving-site/public/brand/{name}.svg', 'w').write('\n'.join(svg))

def wordonly(c1, c2, name):
    s = 1
    svg = [f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 {-capH*0.02:.0f} {wdt:.0f} {capH*1.04:.0f}">', wordmark_group(c1, c2, s, 0, capH), '</svg>']
    open(f'/home/user/moving-site/public/brand/{name}.svg', 'w').write('\n'.join(svg))

lockup('dark', '#FFFFFF', '#14DCD5', 'melbus-dark')      # на тёмном
lockup('light', '#10161D', '#077E79', 'melbus-light')    # на светлом
lockup('white', '#FFFFFF', '#FFFFFF', 'melbus-white')
lockup('black', '#070A0F', '#070A0F', 'melbus-black')
wordonly('#FFFFFF', '#14DCD5', 'wordmark-dark')
wordonly('#10161D', '#077E79', 'wordmark-light')
print('capH', capH, 'width', wdt)
