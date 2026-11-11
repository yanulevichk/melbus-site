"""Генератор знака MEL: 3 полосы (верхний шеврон, средний шеврон, нижняя V) в изометрии 30°."""
import sys, json
W, H = 640, 507
T = 120
def chev(y):      # шеврон вершиной вверх; y = верх вершины
    return [(0, y+179), (320, y), (640, y+179), (640, y+179+T), (320, y+T), (0, y+179+T)]
def vee():
    return [(0, 208), (320, 387), (640, 208), (640, 328), (320, 507), (0, 328)]
def pts(p): return ' '.join(f'{x},{y}' for x, y in p)

def mark(left, right, vleft, vright, pad=14, mono=None, gap=16):
    """Полосы с вырезами-зазорами: нижние слои обрезаются расширенным контуром верхних (как ленты в оригинале)."""
    if mono: left = right = vleft = vright = mono
    r = 26
    shapes = [vee(), chev(182), chev(0)]
    cols = [(vleft, vright), (left, right), (left, right)]
    out = [f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{-pad} {-pad} {W+2*pad} {H+2*pad}">', '<defs>',
           '<clipPath id="R"><rect x="320" y="-50" width="400" height="700"/></clipPath>',
           '<clipPath id="L"><rect x="-50" y="-50" width="370" height="700"/></clipPath>']
    # маска для слоя i: всё белое, минус расширенные контуры слоёв выше
    for i in range(len(shapes)):
        above = shapes[i+1:]
        out.append(f'<mask id="m{i}" maskUnits="userSpaceOnUse" x="-60" y="-60" width="760" height="640"><rect x="-60" y="-60" width="760" height="640" fill="#fff"/>')
        for a in above:
            out.append(f'<polygon points="{pts(a)}" fill="#000" stroke="#000" stroke-width="{r+2*gap}" stroke-linejoin="round"/>')
        out.append('</mask>')
    out.append('</defs>')
    for i, (poly, (cl, cr)) in enumerate(zip(shapes, cols)):
        p = pts(poly)
        out.append(f'<g mask="url(#m{i})">')
        out.append(f'<polygon points="{p}" fill="{cl}" stroke="{cl}" stroke-width="{r}" stroke-linejoin="round" clip-path="url(#L)"/>')
        out.append(f'<polygon points="{p}" fill="{cr}" stroke="{cr}" stroke-width="{r}" stroke-linejoin="round" clip-path="url(#R)"/>')
        out.append('</g>')
    out.append('</svg>')
    return '\n'.join(out)

P = json.loads(sys.argv[1])
variants = {
  'mark-dark':  mark(P['teal'], P['silver'], P['tealDeep'], P['silverDeep']),   # на тёмном фоне
  'mark-light': mark(P['tealDeep'], P['graphite'], P['tealDark'], P['graphite2']), # на светлом фоне
  'mark-black': mark(None, None, None, None, mono=P['ink']),
  'mark-white': mark(None, None, None, None, mono='#FFFFFF'),
}
for k, v in variants.items():
    open(f'/home/user/moving-site/public/brand/{k}.svg', 'w').write(v)
print('ok')
