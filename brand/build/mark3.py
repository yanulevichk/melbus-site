"""Знак MEL v3: два квадрата-рамки («ленты») в изометрии, у каждого отверстие по центру.
Каждая рамка = задняя стенка (^) + передняя стенка (V) высотой T; между ними — отверстие.
mode C — верхняя рамка целиком спереди; mode D — рамки сцеплены как звенья."""
import sys, json
W = 640
def geom(h=185, T=105, OFF=150):
    def back(y0):  # задняя стенка ^
        return [(0, y0 + h), (320, y0), (640, y0 + h), (640, y0 + h + T), (320, y0 + T), (0, y0 + h + T)]
    def front(y0):  # передняя стенка V
        return [(0, y0 + h), (320, y0 + 2 * h), (640, y0 + h), (640, y0 + h + T), (320, y0 + 2 * h + T), (0, y0 + h + T)]
    return back, front, OFF + 2 * h + T, OFF
def P(p): return 'M' + ' L'.join(f'{x:.1f},{y:.1f}' for x, y in p) + ' Z'

def build(mode, c, mono=None, gap=13, r=20, pad=16, **g):
    back, front, H, OFF = geom(**g)
    if mono: c = {k: mono for k in c}
    ub, uf, lb, lf = back(0), front(0), back(OFF), front(OFF)
    B1, F1 = (c['bl'], c['br']), (c['fl'], c['fr'])
    if mode == 'C':
        layers = [(lf, F1), (lb, B1), (ub, B1), (uf, F1)]
    else:  # D: задняя стенка нижней рамки проходит над передней стенкой верхней
        layers = [(lf, F1), (uf, F1), (lb, B1), (ub, B1)]
    o = [f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{-pad} {-pad} {W + 2 * pad} {H + 2 * pad}"><defs>',
         '<clipPath id="L"><rect x="-60" y="-60" width="380" height="900"/></clipPath>',
         '<clipPath id="R"><rect x="320" y="-60" width="400" height="900"/></clipPath>']
    for i in range(len(layers)):
        o.append(f'<mask id="m{i}" maskUnits="userSpaceOnUse" x="-80" y="-80" width="800" height="900"><rect x="-80" y="-80" width="800" height="900" fill="#fff"/>')
        for a, _ in layers[i + 1:]:
            o.append(f'<path d="{P(a)}" fill="#000" stroke="#000" stroke-width="{r + 2 * gap}" stroke-linejoin="round"/>')
        o.append('</mask>')
    o.append('</defs>')
    for i, (poly, (a, b)) in enumerate(layers):
        d = P(poly)
        o.append(f'<g mask="url(#m{i})"><path d="{d}" fill="{a}" stroke="{a}" stroke-width="{r}" stroke-linejoin="round" clip-path="url(#L)"/>'
                 f'<path d="{d}" fill="{b}" stroke="{b}" stroke-width="{r}" stroke-linejoin="round" clip-path="url(#R)"/></g>')
    o.append('</svg>')
    return '\n'.join(o)

if __name__ == '__main__':
    mode, out, cj = sys.argv[1], sys.argv[2], json.loads(sys.argv[3])
    g = json.loads(sys.argv[4]) if len(sys.argv) > 4 else {}
    mono = cj.pop('mono', None)
    open(out, 'w').write(build(mode, cj, mono=mono, **g))
