"""Знак MEL v2: две ромбовидные рамки (квадраты в изометрии) с отверстием по центру.
mode A — верхняя рамка лежит поверх нижней; mode B — рамки сцеплены, как звенья."""
import sys, json
W = 640; h = 179; T = 120; OFF = 182
dx = T * 320 / h  # горизонтальная толщина рамки у боковых углов
def top_half(y0):
    return [(0, y0 + h), (320, y0), (640, y0 + h), (640 - dx, y0 + h), (320, y0 + T), (dx, y0 + h)]
def bot_half(y0):
    return [(0, y0 + h), (dx, y0 + h), (320, y0 + 2 * h - T), (640 - dx, y0 + h), (640, y0 + h), (320, y0 + 2 * h)]
def P(p): return 'M' + ' L'.join(f'{x:.1f},{y:.1f}' for x, y in p) + ' Z'
H = OFF + 2 * h

def build(mode, cl, cr, cl2, cr2, mono=None, gap=14, r=22, pad=16):
    if mono: cl = cr = cl2 = cr2 = mono
    # слои снизу вверх: (path, левый цвет, правый цвет)
    up_t, up_b = top_half(0), bot_half(0)
    lo_t, lo_b = top_half(OFF), bot_half(OFF)
    if mode == 'A':   # нижняя рамка целиком под верхней
        layers = [(lo_b, cl2, cr2), (lo_t, cl2, cr2), (up_b, cl, cr), (up_t, cl, cr)]
    else:             # B: сцепка — верхняя половина нижней рамки проходит над нижней половиной верхней
        layers = [(lo_b, cl2, cr2), (up_b, cl, cr), (lo_t, cl, cr), (up_t, cl, cr)]
    o = [f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{-pad} {-pad} {W + 2 * pad} {H + 2 * pad}"><defs>',
         '<clipPath id="L"><rect x="-60" y="-60" width="380" height="800"/></clipPath>',
         '<clipPath id="R"><rect x="320" y="-60" width="400" height="800"/></clipPath>']
    for i in range(len(layers)):
        o.append(f'<mask id="m{i}" maskUnits="userSpaceOnUse" x="-80" y="-80" width="800" height="800"><rect x="-80" y="-80" width="800" height="800" fill="#fff"/>')
        for a, _, _ in layers[i + 1:]:
            o.append(f'<path d="{P(a)}" fill="#000" stroke="#000" stroke-width="{r + 2 * gap}" stroke-linejoin="round"/>')
        o.append('</mask>')
    o.append('</defs>')
    for i, (poly, a, b) in enumerate(layers):
        d = P(poly)
        o.append(f'<g mask="url(#m{i})"><path d="{d}" fill="{a}" stroke="{a}" stroke-width="{r}" stroke-linejoin="round" clip-path="url(#L)"/>'
                 f'<path d="{d}" fill="{b}" stroke="{b}" stroke-width="{r}" stroke-linejoin="round" clip-path="url(#R)"/></g>')
    o.append('</svg>')
    return '\n'.join(o)

if __name__ == '__main__':
    mode = sys.argv[1]; out = sys.argv[2]
    C = json.loads(sys.argv[3])
    open(out, 'w').write(build(mode, C['l'], C['r'], C['l2'], C['r2'], C.get('mono')))
