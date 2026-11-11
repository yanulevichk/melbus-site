"""
ПРЕВИЗ ПЕРВОГО ЭКРАНА MELBUS (Blender, серые модели) — «вся квартира в одной коробке».
Нужен, чтобы зафиксировать движение камеры и тайминг ДО платной генерации:
черновое видео отдаётся в Seedance 2.5 как образец движения (video reference).

Запуск (без окна):
  blender -b -noaudio --factory-startup -P tools/blender/previz_hero.py -- <out_dir> [width height] [start end]
Кадры пишутся в <out_dir>/f####.png (24 к/с, 42 с = 1008 кадров). Сцену можно сохранить: --save <file.blend>

Координаты: раскладка взята из three.js-сцены (y — вверх) и переводится в Blender (z — вверх) функцией P().
"""
import bpy, math, sys, os
from mathutils import Vector

argv = sys.argv[sys.argv.index('--') + 1:] if '--' in sys.argv else []
OUT = argv[0] if argv else '/tmp/previz'
RW, RH = (int(argv[1]), int(argv[2])) if len(argv) >= 3 else (960, 540)
F0, F1 = (int(argv[3]), int(argv[4])) if len(argv) >= 5 else (0, 1008)
SAVE = argv[argv.index('--save') + 1] if '--save' in argv else None

FPS, DUR = 24, 42.0
N = int(FPS * DUR)

# ---------------- утилиты ----------------
def P(x, y, z):
    """three.js (y вверх) → Blender (z вверх)"""
    return Vector((x, -z, y))

def clamp01(v): return max(0.0, min(1.0, v))
def seg(t, a, b): return clamp01((t - a) / (b - a))
def lerp(a, b, k): return a + (b - a) * k
def eio(k): return 4 * k * k * k if k < .5 else 1 - pow(-2 * k + 2, 3) / 2
def eout(k): return 1 - pow(1 - k, 3)
def ein(k): return k * k * k
def eback(k, c1=1.70158):
    if k <= 0: return 0.0
    c3 = c1 + 1
    return 1 + c3 * pow(k - 1, 3) + c1 * pow(k - 1, 2)

bpy.ops.wm.read_factory_settings(use_empty=True)
sc = bpy.context.scene
col = sc.collection

MATS = {}
def mat(name, rgb, rough=0.7):
    if name in MATS: return MATS[name]
    m = bpy.data.materials.new(name)
    m.diffuse_color = (*rgb, 1)
    m.use_nodes = True
    b = m.node_tree.nodes.get('Principled BSDF')
    if b:
        b.inputs['Base Color'].default_value = (*rgb, 1)
        b.inputs['Roughness'].default_value = rough
    MATS[name] = m
    return m

# серые «превизные» тона (без текстур — так советуют для Seedance)
G = {
    'floor': mat('floor', (0.62, 0.63, 0.64)), 'plinth': mat('plinth', (0.45, 0.46, 0.48)),
    'wall': mat('wall', (0.82, 0.83, 0.84)), 'dark': mat('dark', (0.16, 0.17, 0.18)),
    'mid': mat('mid', (0.40, 0.41, 0.43)), 'light': mat('light', (0.70, 0.71, 0.72)),
    'white': mat('white', (0.93, 0.93, 0.93)), 'glass': mat('glass', (0.30, 0.34, 0.36), 0.2),
    'road': mat('road', (0.20, 0.21, 0.22)), 'walk': mat('walk', (0.36, 0.37, 0.38)),
    'tape': mat('tape', (0.05, 0.75, 0.72), 0.4), 'tree': mat('tree', (0.32, 0.36, 0.34)),
    'bldg': mat('bldg', (0.58, 0.59, 0.61)),
}

def empty(name, loc=(0, 0, 0), parent=None):
    e = bpy.data.objects.new(name, None)
    e.empty_display_size = 0.2
    col.objects.link(e)
    e.parent = parent
    e.location = loc
    return e

def box(name, w, h, d, m, x=0, y=0, z=0, parent=None, bevel=0.02):
    """прямоугольник w×h×d (как в three.js), y — низ детали; координаты локальные (three)"""
    W, D, H = w / 2, d / 2, h / 2
    vs = [(-W, -D, -H), (W, -D, -H), (W, D, -H), (-W, D, -H), (-W, -D, H), (W, -D, H), (W, D, H), (-W, D, H)]
    fs = [(0, 1, 2, 3), (4, 7, 6, 5), (0, 4, 5, 1), (1, 5, 6, 2), (2, 6, 7, 3), (3, 7, 4, 0)]
    me = bpy.data.meshes.new(name); me.from_pydata(vs, [], fs); me.update()
    o = bpy.data.objects.new(name, me); col.objects.link(o)
    o.data.materials.append(m)
    o.parent = parent
    o.location = P(x, y + h / 2, z)
    if bevel and min(w, h, d) > bevel * 2.5:
        mod = o.modifiers.new('bevel', 'BEVEL'); mod.width = bevel; mod.segments = 2; mod.limit_method = 'ANGLE'
    return o

def cyl(name, r1, r2, h, m, x=0, y=0, z=0, parent=None, n=20, axis='y'):
    vs = []
    for k in range(n):
        a = 2 * math.pi * k / n
        vs.append((r2 * math.cos(a), r2 * math.sin(a), -h / 2))
    for k in range(n):
        a = 2 * math.pi * k / n
        vs.append((r1 * math.cos(a), r1 * math.sin(a), h / 2))
    fs = [tuple(range(n - 1, -1, -1)), tuple(range(n, 2 * n))]
    for k in range(n):
        fs.append((k, (k + 1) % n, n + (k + 1) % n, n + k))
    me = bpy.data.meshes.new(name); me.from_pydata(vs, [], fs); me.update()
    for p_ in me.polygons: p_.use_smooth = len(p_.vertices) == 4  # бока гладкие, крышки плоские
    o = bpy.data.objects.new(name, me); col.objects.link(o)
    o.data.materials.append(m)
    o.parent = parent
    if axis == 'y':   # вертикально (three y)
        o.location = P(x, y + h / 2, z)
    elif axis == 'x':  # ось вдоль three x (кардан, выхлоп)
        o.location = P(x, y, z); o.rotation_euler = (0, math.pi / 2, 0)
    else:            # ось вдоль three z (колёса)
        o.location = P(x, y, z); o.rotation_euler = (math.pi / 2, 0, 0)
    return o

def ico(name, r, m, x=0, y=0, z=0, parent=None):
    bpy.ops.mesh.primitive_ico_sphere_add(subdivisions=1, radius=r)
    o = bpy.context.active_object; o.name = name
    o.data.materials.append(m)
    o.parent = parent; o.location = P(x, y, z)
    return o

# ---------------- мебель (начало координат — пол, фасад в +z three) ----------------
def f_sofa(p):
    box('sofa_base', 2.4, .42, .95, G['dark'], 0, .06, 0, p, .06); box('sofa_back', 2.4, .66, .26, G['dark'], 0, .06, -.35, p, .06)
    box('sofa_al', .24, .6, .95, G['dark'], -1.08, .06, 0, p, .05); box('sofa_ar', .24, .6, .95, G['dark'], 1.08, .06, 0, p, .05)
    box('sofa_c1', .92, .16, .66, G['mid'], -.47, .48, .08, p, .05); box('sofa_c2', .92, .16, .66, G['mid'], .47, .48, .08, p, .05)
def f_rug(p):
    box('rug', 2.0, .012, 1.5, G['mid'], 0, 0, 0, p, 0)
def f_armchair(p):
    box('arm_b', .95, .4, .9, G['mid'], 0, .06, 0, p, .06); box('arm_k', .95, .62, .22, G['mid'], 0, .06, -.34, p, .05)
    box('arm_l', .18, .5, .9, G['mid'], -.39, .06, 0, p, .04); box('arm_r', .18, .5, .9, G['mid'], .39, .06, 0, p, .04)
def f_bookcase(p):
    box('bc_l', .06, 2.0, .42, G['white'], -.67, 0, 0, p, 0); box('bc_r', .06, 2.0, .42, G['white'], .67, 0, 0, p, 0)
    box('bc_back', 1.4, 2.0, .04, G['light'], 0, 0, -.19, p, 0)
    for s in range(5):
        box(f'bc_s{s}', 1.4, .05, .42, G['white'], 0, s * .48, 0, p, 0)
        if s < 4:
            box(f'bc_bk{s}', 1.1, .3, .28, G['mid'], -.05, s * .48 + .05, .02, p, .01)
def f_plant(p):
    cyl('pot', .24, .19, .46, G['white'], 0, 0, 0, p); ico('leaf1', .42, G['tree'], 0, .95, 0, p); ico('leaf2', .3, G['tree'], .18, 1.25, .08, p)
def f_lamp(p):
    cyl('lamp_b', .2, .22, .05, G['dark'], 0, 0, 0, p); box('lamp_p', .04, 1.55, .04, G['dark'], 0, .05, 0, p, 0); cyl('lamp_s', .17, .27, .36, G['white'], 0, 1.45, 0, p)
def f_tv(p):
    box('tv_st', 1.7, .42, .44, G['white'], 0, .08, 0, p, .03); box('tv_ft', 1.7, .08, .44, G['dark'], 0, 0, 0, p, .01)
    box('tv_sc', 1.36, .78, .05, G['dark'], 0, .62, -.08, p, .01)
def f_bed(p):
    box('bed_f', 1.8, .3, 2.1, G['mid'], 0, .1, 0, p, .04); box('bed_m', 1.72, .24, 2.0, G['white'], 0, .38, .02, p, .06)
    box('bed_h', 1.8, 1.05, .12, G['dark'], 0, .1, -1.02, p, .04); box('bed_bl', 1.76, .07, 1.2, G['light'], 0, .6, .38, p, .02)
    box('bed_p1', .66, .13, .38, G['light'], -.42, .62, -.7, p, .05); box('bed_p2', .66, .13, .38, G['light'], .42, .62, -.7, p, .05)
def f_fridge(p):
    box('fr_b', .74, 1.95, .7, G['light'], 0, .04, 0, p, .05); box('fr_h', .04, .42, .05, G['dark'], .28, 1.36, .37, p, 0)
def f_dining(p):
    box('dn_t', 1.25, .06, .8, G['white'], 0, .72, 0, p, .02)
    for i, (x, z) in enumerate([(-.55, -.33), (.55, -.33), (-.55, .33), (.55, .33)]): box(f'dn_l{i}', .05, .72, .05, G['dark'], x, 0, z, p, 0)
    for s in (-1, 1):
        ch = empty('chair', P(0, 0, s * .62), p); ch.rotation_euler = (0, 0, math.pi if s > 0 else 0)
        box('ch_s', .44, .05, .42, G['dark'], 0, .44, 0, ch, .01); box('ch_b', .44, .48, .05, G['dark'], 0, .44, -.2, ch, .01)
        for i, (x, z) in enumerate([(-.18, -.18), (.18, -.18), (-.18, .18), (.18, .18)]): box(f'ch_l{i}', .04, .44, .04, G['dark'], x, 0, z, ch, 0)

FUR = {'sofa': f_sofa, 'rug': f_rug, 'armchair': f_armchair, 'bookcase': f_bookcase, 'plant': f_plant,
       'lamp': f_lamp, 'tv': f_tv, 'bed': f_bed, 'fridge': f_fridge, 'dining': f_dining}

# ---------------- квартиры, улица, город ----------------
RY, BX, VX = 0.35, 26.0, 2.6

def room(name, ox, variant):
    r = empty(name, P(ox, RY, 0))
    box(name + '_plinth', 7.6, .35, 5.6, G['plinth'], 0, -.35, 0, r, .05)
    box(name + '_floor', 7.5, .02, 5.5, G['floor'], 0, -.01, 0, r, 0)
    box(name + '_wb', 7.6, 2.7, .18, G['wall'], 0, 0, -2.71, r, .01)
    box(name + '_wl', .18, 2.7, 5.42, G['wall'], -3.71, 0, .09, r, .01)
    wx = 1.25 if variant == 'a' else 0.0
    box(name + '_win', 1.76, 1.16, .05, G['glass'], wx, 1.17, -2.6, r, 0)
    if variant == 'b':
        box(name + '_door', .05, 2.1, 1.1, G['dark'], -3.6, 0, 1.4, r, 0)
    return r

roomA, roomB = room('roomA', 0, 'a'), room('roomB', BX, 'b')
box('road', 140, .02, 2.5, G['road'], 10, -.02, 4.45, None, 0)
box('walk_front', 140, .03, .9, G['walk'], 10, -.02, 6.15, None, 0)
box('walk_back', 140, .03, .5, G['walk'], 10, -.02, 2.98, None, 0)
x = -40.0
while x < 70:
    box('dash', 1.0, .02, .07, G['light'], x, 0, 4.45, None, 0); x += 2.2
def gable(name, w, d, h, m, x, y, z, parent=None):
    """двускатная крыша: конёк вдоль x (координаты three, y — низ)"""
    W, D = w / 2, d / 2
    vs = [(-W, -D, 0), (W, -D, 0), (W, D, 0), (-W, D, 0), (-W, 0, h), (W, 0, h)]
    fs = [(0, 1, 2, 3), (0, 4, 5, 1), (3, 2, 5, 4), (0, 3, 4), (1, 5, 2)]
    me = bpy.data.meshes.new(name); me.from_pydata(vs, [], fs); me.update()
    o = bpy.data.objects.new(name, me); col.objects.link(o); o.data.materials.append(m)
    o.parent = parent; o.location = P(x, y, z)
    return o
G['roof'] = mat('roof', (0.30, 0.31, 0.33)); G['grass'] = mat('grass', (0.42, 0.47, 0.40)); G['hedge'] = mat('hedge', (0.30, 0.36, 0.30))
# новостройка: квартира А — первый этаж жилого комплекса, высокие корпуса вокруг
box('block_A', 9.0, 11.0, 5.0, G['bldg'], 0.0, 0, -5.6, None, .03)
for i, (bx_, w, h, d) in enumerate([(6.8, 3.4, 8.2, 3.2), (10.2, 2.8, 9.4, 3.4), (-6.6, 3.2, 8.6, 3.2), (-10.0, 2.8, 10.0, 3.2), (13.6, 3.0, 6.4, 3.0)]):
    box(f'tower{i}', w, h, d, G['bldg'], bx_, 0, -0.8 - d * 0.1, None, .03)
# по пути — всё ниже и зеленее: малоэтажка, потом частные дома с двускатными крышами
for i, bx_ in enumerate([17.0, 20.2, 31.6, 35.0, 38.4]):
    w, d, h = 2.6, 2.6, 1.9 + (i % 2) * .5
    box(f'house{i}', w, h, d, G['wall'], bx_, 0, -1.2, None, .02)
    gable(f'house_roof{i}', w + .3, d + .3, 1.1, G['roof'], bx_, h, -1.2)
    box(f'house_win{i}', .8, .6, .02, G['glass'], bx_ - .4, h * .45, .11, None, 0)
# дом Б: сад, газон, живая изгородь, деревья за окнами
box('lawn_B', 22.0, .02, 9.0, G['grass'], BX, -.03, -3.0, None, 0)
box('lawn_front', 160, .02, 2.2, G['grass'], 10, -.04, 7.7, None, 0)
gable('roof_B_hint', 8.4, 6.2, 2.4, G['roof'], BX, 3.6, -6.4)                 # дом за кадром комнаты: крыша
box('house_B_back', 8.0, 3.6, 2.0, G['wall'], BX, 0, -6.4, None, .02)
for hx in (-5.6, 5.6):
    box('hedge_B', .5, .9, 6.0, G['hedge'], BX + hx, 0, -0.2, None, .1)
def tree(x, z, s=0.85):
    t = empty('tree', P(x, 0, z))
    cyl('trunk', .06 * s, .08 * s, .7 * s, G['dark'], 0, 0, 0, t, 8); ico('crown', .55 * s, G['tree'], 0, 1.1 * s, 0, t)
x = 4.8
while x < 20.5: tree(x, 3.0); x += 2.9          # не ставим деревья на пути коробки у дома Б
for tx, tz, ts in [(BX - 4.5, -4.0, 1.4), (BX - 1.5, -5.0, 1.6), (BX + 2.5, -4.6, 1.3), (BX + 5.0, -3.6, 1.5), (BX + 7.5, 1.0, 1.2), (BX - 7.0, 0.5, 1.3), (16.0, -3.5, 1.2), (24.0, -3.8, 1.4), (29.5, -3.2, 1.3)]:
    tree(tx, tz, ts)
x = -16.0
while x < 46:
    if abs(x - VX) > 4.5 and abs(x - VX - BX) > 4.5: tree(x, 7.1, .8)
    x += 3.4

# ---------------- мебель по местам: A и Б ----------------
PLAN = [
    ('bed', -2.2, -1.5, 0, 2.35, -1.5, 0), ('sofa', 0.6, -2.1, 0, 0.0, -2.1, 0), ('fridge', 3.25, -2.25, 0, -3.25, -2.25, 0),
    ('dining', 2.55, -0.85, 0, -2.0, -0.55, math.pi / 2), ('bookcase', -3.32, 1.75, math.pi / 2, -3.32, -1.0, math.pi / 2),
    ('tv', -3.33, -0.05, math.pi / 2, 0.0, 0.45, math.pi), ('armchair', -2.3, 2.05, 0.6, 1.62, 0.6, -0.75),
    ('rug', 2.65, -0.85, 0, 0.0, -0.65, 0), ('lamp', -0.95, -2.3, 0, -1.72, -2.3, 0), ('plant', 3.3, 1.95, 0, 3.3, 1.1, 0),
]
ITEMS = []
OUT_ORDER = ['rug', 'bed', 'sofa', 'fridge', 'dining', 'bookcase', 'tv', 'armchair', 'lamp', 'plant']  # ковёр — первым, на него ставят мебель
FIT = {'bed': .16, 'sofa': .14, 'fridge': .42, 'dining': .25, 'bookcase': .22, 'tv': .19, 'armchair': .33, 'rug': .11, 'lamp': .45, 'plant': .42}
SLOTS = [(x, z) for z in (-.3, .3) for x in (-.68, -.34, 0, .34, .68)]
for n, ax, az, ar, bx_, bz, br in PLAN:
    o = empty('it_' + n)
    FUR[n](o)
    ITEMS.append(dict(o=o, n=n, fit=FIT[n], slot=SLOTS[len(ITEMS)], a=(ax, az, ar), b=(bx_, bz, br), h={'bed': 1.2, 'fridge': 2.0, 'bookcase': 2.0, 'lamp': 1.9, 'plant': 1.5}.get(n, 0.8)))

# ---------------- складная коробка MELBUS ----------------
BW, BD, BH, BT = 1.9, 1.4, 1.3, 0.04
boxRoot = empty('box')
box('box_bottom', BW, BT, BD, G['white'], 0, 0, 0, boxRoot, 0)
SIDES = []
for i, (sx, sz, yaw, ln) in enumerate([(0, BD / 2, 0, BW), (0, -BD / 2, math.pi, BW), (BW / 2, 0, math.pi / 2, BD), (-BW / 2, 0, -math.pi / 2, BD)]):
    yg = empty(f'box_yaw{i}', P(sx, 0, sz), boxRoot); yg.rotation_euler = (0, 0, yaw)
    hinge = empty(f'box_hinge{i}', (0, 0, 0), yg)
    box(f'box_panel{i}', ln, BH, BT, G['white'], 0, 0, -BT / 2, hinge, 0)
    flap = empty(f'box_flapG{i}', P(0, BH, 0), hinge)
    box(f'box_flap{i}', ln - .01, BD / 2, BT, G['white'], 0, -BD / 4 + BD / 4, -BT / 2, flap, 0)  # y-низ=0, высота BD/2
    SIDES.append((hinge, flap))
    if i == 0:  # наклейка комнаты на фасаде (белая с цветной полосой)
        box('sticker', ln * .3, BH * .26, .006, G['light'], ln * .24, BH * .22, .004, hinge, 0)
        box('sticker_bar', .04, BH * .26, .008, G['tape'], ln * .24 - ln * .15 + .02, BH * .22, .006, hinge, 0)
tapeL = box('tapeL', 1, 1, 1, G['tape'], 0, 0, 0, boxRoot, 0)
tapeT = box('tapeT', 1, 1, 1, G['tape'], 0, 0, 0, boxRoot, 0)
tapeR = box('tapeR', 1, 1, 1, G['tape'], 0, 0, 0, boxRoot, 0)
# рулон скотча: едет вверх по левому торцу, через крышку и вниз по правому — лента тянется за ним
tapeRoll = empty('tape_roll', (0, 0, 0), boxRoot)
cyl('roll_outer', .12, .12, .3, G['tape'], 0, 0, 0, tapeRoll, 24, axis='z')
cyl('roll_core', .06, .06, .32, G['light'], 0, 0, 0, tapeRoll, 16, axis='z')
for t_ in (tapeL, tapeT, tapeR): t_.location = (0, 0, 0)
# раскладка коробки: в квартире А и Б (координаты three)
BOXA, BOXB = (0.6, RY, 0.7), (BX - 1.0, RY, 1.95)   # вокруг заготовки в А мебели нет
VAN_A, VAN_B = 2.2, BX + 2.2          # где стоит бус (центр) при погрузке и выгрузке: задняя дверь ≈ x−2.22

# ---------------- бус: пустой кузов, задние двери, пандус, днище ----------------
van = empty('van')
CX0, CX1 = -2.22, 1.12                 # кузов по x
box('van_floor', 3.34, .06, 1.86, G['mid'], -.55, .36, 0, van, 0)
# единый кузов с высокой крышей до самой кабины, покатый капот и наклонное лобовое стекло
box('van_roof', 3.5, .08, 1.86, G['white'], -.47, 2.28, 0, van, .04)
box('van_side_l', 3.5, 1.9, .05, G['white'], -.47, .42, .905, van, .03)
box('van_side_r', 3.5, 1.9, .05, G['white'], -.47, .42, -.905, van, .03)
box('van_front', .05, 1.9, 1.76, G['light'], .62, .42, 0, van, 0)            # перегородка кабина/кузов
box('van_inner', 2.7, .02, 1.7, G['light'], -.8, .43, 0, van, 0)        # пол внутри светлее — видно, что кузов пустой
box('van_cab_low', 1.3, .82, 1.86, G['white'], 1.65, .36, 0, van, .1)    # нижняя часть кабины и капот
box('van_hood', .7, .14, 1.8, G['white'], 2.0, 1.12, 0, van, .06)          # капот
ws = box('van_wind', .05, 1.23, 1.74, G['glass'], 1.53, 1.14, 0, van, 0); ws.rotation_euler = (0, -.464, 0)   # лобовое стекло
for zz in (.935, -.935):
    box('van_sidewin', .5, .62, .02, G['glass'], 1.0, 1.32, zz, van, 0)   # окна дверей кабины
    box('van_pillar', .3, 1.1, .05, G['white'], 1.13, 1.18, zz * .97, van, .02)
box('van_grille', .04, .34, 1.1, G['dark'], 2.31, .62, 0, van, .02)        # решётка (без значка)
for zz in (.68, -.68): box('van_lamp', .04, .14, .3, G['light'], 2.31, .9, zz, van, .02)
box('van_bump_f', .2, .26, 1.9, G['dark'], 2.28, .32, 0, van, .04)
box('van_logo_plate_l', 2.0, .55, .01, G['light'], -.6, 1.35, .935, van, 0)   # место под логотип MELBUS
box('van_logo_plate_r', 2.0, .55, .01, G['light'], -.6, 1.35, -.935, van, 0)
box('van_bump_r', .16, .16, 1.9, G['dark'], -2.24, .18, 0, van, .03)
box('van_stripe_l', 4.4, .1, .02, G['tape'], .0, .55, .935, van, 0)
box('van_stripe_r', 4.4, .1, .02, G['tape'], .0, .55, -.935, van, 0)
# ДНИЩЕ — «спецэффект» пролёта камеры под бусом: рама, двигатель, КПП, кардан, мост, рессоры, выхлоп, бак, запаска
UB = mat('under', (0.34, 0.35, 0.37), 0.5); UM = mat('under_mid', (0.55, 0.56, 0.58), 0.4); UL = mat('under_light', (0.78, 0.79, 0.80), 0.3)
box('van_floorpan', 3.9, .02, 1.7, mat('floorpan', (0.40, 0.41, 0.43)), -.3, .34, 0, van, 0)
for zz in (.42, -.42): box('van_rail', 4.3, .1, .08, UB, -.15, .24, zz, van, .01)                      # лонжероны
for xx in (-2.05, -1.0, -.1, .7, 1.95): box('van_cross', .07, .07, .92, UB, xx, .25, 0, van, 0)        # поперечины
box('van_engine', .72, .14, .55, UM, 1.55, .23, 0, van, .03)                                            # поддон двигателя
box('van_engine_ribs', .6, .03, .45, UL, 1.55, .215, 0, van, 0)
box('van_gearbox', .62, .14, .3, UM, .95, .21, 0, van, .04)                                            # коробка передач
cyl('van_driveshaft', .045, .045, 1.95, UL, -.33, .25, 0, van, 12, axis='x')                            # карданный вал
for xx in (.63, -.33, -1.28): cyl('van_ujoint', .075, .075, .06, UB, xx, .25, 0, van, 12, axis='x')    # крестовины и опора
box('van_bearing', .1, .1, .22, UB, -.33, .26, 0, van, 0)
cyl('van_diff', .12, .12, .2, UM, -1.45, .305, 0, van, 16, axis='x')                                    # «тыква» дифференциала
cyl('van_axle_r', .055, .055, 1.6, UB, -1.45, .34, 0, van, 12, axis='z')                               # задний мост
for zz in (.55, -.55):
    box('van_leaf', 1.2, .05, .08, UL, -1.45, .26, zz, van, .01)                                       # рессоры
    sh = cyl('van_shock', .025, .025, .18, UL, -1.15, .2, zz * 1.1, van, 8); sh.rotation_euler = (0, -.5, 0)  # амортизаторы
cyl('van_axle_f', .04, .04, 1.5, UB, 1.5, .37, 0, van, 10, axis='z')
cyl('van_rack', .03, .03, 1.2, UL, 1.32, .3, 0, van, 10, axis='z')                                      # рулевая рейка
for zz in (.66, -.66):
    for xx in (1.5, -1.45): cyl('van_disc', .2, .2, .03, UL, xx, .37, zz * 1.13, van, 20, axis='z')    # тормозные диски (внутри колёс)
cyl('van_exhaust', .03, .03, 3.4, UL, -.5, .2, .34, van, 10, axis='x')                                 # выхлоп
box('van_muffler', .62, .12, .22, UM, -.6, .2, .34, van, .04)                                         # глушитель
box('van_tank', .7, .14, .5, UM, .2, .21, -.38, van, .03)                                              # бак
sp = cyl('van_spare', .3, .3, .12, UB, -1.98, .19, 0, van, 22)                                          # запаска под кормой
# задние двери на петлях
DOORS = []
for s_ in (1, -1):
    hg = empty('van_door_h', P(CX0, .39, s_ * .93), van)
    box('van_door', .05, 1.92, .92, G['white'], 0, 0, -s_ * .46, hg, .01)
    box('van_door_win', .02, .4, .5, G['glass'], -.03, 1.25, -s_ * .46, hg, 0)
    DOORS.append((hg, s_))
# пандус
rampG = empty('van_ramp', P(CX0, .42, 0), van)
ramp = box('van_ramp_plank', 1.6, .04, 1.2, G['mid'], -.8, -.02, 0, rampG, 0)
WHEELS = []
for wx_ in (-1.45, 1.5):
    for wz in (.86, -.86):
        w = cyl('wheel', .37, .37, .28, G['dark'], wx_, .37, wz, van, 24, axis='z'); WHEELS.append(w)

# ---------------- тайминг (секунды) ----------------
T_WALLS, T_FLAPS, T_OPEN = (8.3, 9.7), (9.3, 10.2), (10.2, 10.9)   # заготовка лежит с начала: стенки встают, клапаны (сложены внутрь) раскрываются вверх
IN0, IN_STEP, IN_DUR = 11.6, 0.62, 1.2
T_CLOSE_S, T_CLOSE_F = (18.5, 19.1), (18.8, 19.4)
T_TAPE = (19.5, 19.8, 20.6, 20.9)
T_STICK = (20.7, 21.1)
T_VAN_IN = (17.0, 21.0)
T_DOORS_A = (21.4, 22.0, 25.0, 25.6)       # открыть / закрыть
T_HOP_A, T_RAMP_A = (22.2, 23.4), (23.45, 24.7)
CUT = 25.8
T_DRIVE = (26.2, 31.8)
T_DOORS_B = (32.2, 32.9, 35.3, 35.9)
T_RAMP_B, T_HOP_B = (33.0, 34.0), (34.05, 35.3)
T_OPEN_B = (35.9, 36.1, 36.1, 36.7)        # скотч снят, клапаны раскрылись
OUT0, OUT_STEP, OUT_DUR = 36.8, 0.32, 1.1
T_FLAT, T_GONE = (40.6, 41.3), (41.3, 41.7)
T_VAN_OUT = (38.0, 42.0)

def van_x(t):
    if t < T_VAN_IN[1]: return lerp(-32, VAN_A, eout(seg(t, *T_VAN_IN)))
    if t < T_DRIVE[0]: return VAN_A
    if t < T_VAN_OUT[0]: return lerp(VAN_A, VAN_B, eio(seg(t, *T_DRIVE)))
    return lerp(VAN_B, VAN_B + 36, ein(seg(t, *T_VAN_OUT)))

def doors(t):
    a = eio(seg(t, T_DOORS_A[0], T_DOORS_A[1])) * (1 - eio(seg(t, T_DOORS_A[2], T_DOORS_A[3])))
    b = eio(seg(t, T_DOORS_B[0], T_DOORS_B[1])) * (1 - eio(seg(t, T_DOORS_B[2], T_DOORS_B[3])))
    return max(a, b)

def ramp_k(t):
    a = eout(seg(t, 21.9, 22.3)) * (1 - ein(seg(t, 24.8, 25.1)))
    b = eout(seg(t, 32.8, 33.0)) * (1 - ein(seg(t, 35.1, 35.4)))
    return max(a, b)

def bez(a, b, lift, k):
    q = ((a[0] + b[0]) / 2, max(a[1], b[1]) + lift, (a[2] + b[2]) / 2)
    u = 1 - k
    return tuple(u * u * a[i] + 2 * u * k * q[i] + k * k * b[i] for i in range(3))
def lerp3(a, b, k): return tuple(a[i] + (b[i] - a[i]) * k for i in range(3))
def arc(a, b, lift, k):
    """дуга, которая взлетает и садится почти вертикально (не задевает соседнюю мебель)"""
    v = bez(a, b, lift, k); hk = k * k * (3 - 2 * k)
    return (a[0] + (b[0] - a[0]) * hk, v[1], a[2] + (b[2] - a[2]) * hk)

def box_state(t):
    """позиция коробки (three), поворот, масштаб"""
    vA, vB = van_x(t), van_x(t)
    cargoA = (VAN_A - 1.05, .43, 4.45); cargoB = (VAN_B - 1.05, .43, 4.45)
    streetA = (VAN_A - 4.8, 0.0, 4.45); streetB = (VAN_B - 4.8, 0.0, 4.45)
    edgeA = (VAN_A - 4.8, RY, 2.3); edgeB = (VAN_B - 4.8, RY, 2.3)        # край квартиры напротив кормы — в стороне от дверей
    rampTopA = (VAN_A - 2.22 - .2, .43, 4.45); rampTopB = (VAN_B - 2.22 - .2, .43, 4.45)
    clearA = (VAN_A - 3.35, .45, 4.45); clearB = (VAN_B - 3.35, .45, 4.45)    # целиком за бампером, на уровне пола кузова
    s = 1.0 - ein(seg(t, *T_GONE))
    rot = 0.0
    if t < T_HOP_A[0]: pos = BOXA
    elif t < T_HOP_A[1]:
        k = seg(t, *T_HOP_A)
        if k < .66: e = eio(k / .66); pos = bez(BOXA, edgeA, 1.0, e); rot = math.sin(math.pi * e) * .25
        else: e = eio((k - .66) / .34); pos = bez(edgeA, streetA, .25, e)
    elif t < T_RAMP_A[1]:
        k = eio(seg(t, *T_RAMP_A))
        if k < .35: pos = bez(streetA, clearA, .2, k / .35)                 # поднялись к пандусу, не задевая бампер
        elif k < .55: pos = lerp3(clearA, rampTopA, (k - .35) / .2)
        else: pos = lerp3(rampTopA, cargoA, (k - .55) / .45)
    elif t < CUT: pos = cargoA
    elif t < T_RAMP_B[0]: pos = (van_x(t) - 1.05, .43, 4.45)         # едет в кузове
    elif t < T_RAMP_B[1]:
        k = eio(seg(t, *T_RAMP_B))
        if k < .45: pos = lerp3(cargoB, rampTopB, k / .45)
        elif k < .65: pos = lerp3(rampTopB, clearB, (k - .45) / .2)        # выехали целиком за бампер
        else: pos = bez(clearB, streetB, .2, (k - .65) / .35)
    elif t < T_HOP_B[1]:
        k = seg(t, *T_HOP_B)
        if k < .3: e = eio(k / .3); pos = bez(streetB, edgeB, .25, e)
        else: e = eio((k - .3) / .7); pos = bez(edgeB, BOXB, 1.0, e); rot = -math.sin(math.pi * e) * .25
    else: pos = BOXB
    return pos, rot, max(s, .0001)

# ---------------- камера: опорные точки + процедурные участки, гладкая интерполяция ----------------
BOXC = (BOXA[0], BOXA[1] + .55, BOXA[2])
# ---------- камера: одна непрерывная траектория ----------
KEYS = [
    (0.0, (16.0, 17.0, 20.0), (1.0, 0.0, 1.0), 30),
    (2.5, (10.0, 8.0, 11.0), (0.5, 0.6, 0.5), 28),
    (4.2, (4.2, 2.4, 5.2), (0.5, 0.8, 0.2), 24),
    (5.2, (2.6, 1.3, 2.4), (-1.0, 0.9, -1.0), 21),          # влетели в квартиру
    (6.4, (0.9, 1.35, 1.6), (-1.6, 1.0, -1.6), 21),         # скользим по диагонали, не упираясь в мебель
    (7.4, (-0.6, 1.7, 1.9), (-2.4, 0.9, -0.9), 22),
    (8.3, (-0.8, 4.0, 1.4), (0.4, 0.4, 1.3), 26),           # кран вверх
]
# сверху: одна плавная спираль — сборка коробки и упаковка, равномерное вращение
MOUTH_A = (BOXA[0], RY + BH * .4, BOXA[2])
for k in range(0, 25):
    u = k / 24; t_ = 9.0 + u * 9.6
    ang = 3.4 - 2.09 * u
    r = lerp(0.9, 2.2, eio(u)); y = lerp(7.2, 5.0, eio(u))
    KEYS.append((t_, (BOXA[0] + r * math.cos(ang), y, BOXA[2] + r * math.sin(ang)), MOUTH_A, lerp(32, 30, u)))
KEYS += [
    (19.4, (-1.6, 3.6, BOXA[2] + 2.8), (BOXA[0], 1.5, BOXA[2]), 32),          # скотч: спокойный ракурс три четверти сверху
    (20.9, (-0.9, 3.2, BOXA[2] + 2.3), (BOXA[0] + .2, 1.55, BOXA[2]), 34),
    (22.0, (-1.0, 6.4, 6.4), (-0.6, 0.6, 3.2), 28),          # общий план: коробка, бус, двери, пандус
    (22.8, (-3.8, 3.6, 7.4), (-1.8, 0.5, 4.3), 27),
    (23.4, (-4.6, 1.5, 6.4), (-1.6, 0.6, 4.45), 26),
    (24.4, (-3.6, 1.3, 5.3), (-0.5, 0.9, 4.45), 24),
    (25.2, (-1.7, 1.25, 4.6), (1.0, 1.1, 4.45), 22),         # двери закрываются перед камерой
    (25.7, (-1.75, 1.2, 4.55), (1.0, 1.0, 4.45), 22),
]
# без склейки: отъезжаем назад и вниз за корму, бус трогается, догоняем и ныряем под днище
for k in range(1, 9):
    u = k / 8; t_ = 25.7 + u * 1.9; vx = van_x(t_)
    rel = lerp(-1.75 - VAN_A, -6.6, eout(min(1, u / .45))) if u < .45 else lerp(-6.6, -3.0, eio((u - .45) / .55))
    KEYS.append((t_, (vx + rel, lerp(1.2, 0.10, eio(u)), lerp(4.55, 4.45, u)), (vx, lerp(1.0, 0.45, eio(u)), 4.45), lerp(22, 20, u)))
for k in range(1, 13):       # под днищем от кормы к кабине: смотрим вперёд и вверх — кардан, мост, выхлоп
    u = k / 12; t_ = 27.6 + u * 1.7; vx = van_x(t_)
    rel = lerp(-3.0, 4.6, eio(u)); y = 0.09   # ~10 см до деталей днища, ~9 см до асфальта
    up = math.sin(math.pi * min(1, u / .6)) if u < .6 else 0.0
    KEYS.append((t_, (vx + rel, y, 4.45), (vx + rel + 2.2, y + lerp(.1, .5, up), 4.45), lerp(20, 18, u)))
for k in range(1, 11):       # вынырнули перед бусом, поднимаемся — бус проезжает под камерой
    u = k / 10; t_ = 29.3 + u * 1.5; vx = van_x(t_)
    cam_ = (vx + lerp(4.6, -3.0, ein(u)), lerp(0.09, 7.2, eout(u)), 4.45)
    fwd = (cam_[0] + 4.0, cam_[1] - 1.0, 4.45)
    look = tuple(lerp(fwd[i], (vx + 2.5, 0.6, 4.45)[i], eio(u)) for i in range(3))
    KEYS.append((t_, cam_, look, lerp(18, 26, u)))
for k in range(1, 7):        # за бусом до остановки
    u = k / 6; t_ = 30.8 + u * 1.4; vx = van_x(t_)
    KEYS.append((t_, (vx - lerp(3.0, 4.4, eio(u)), lerp(7.2, 3.0, eio(u)), lerp(4.45, 5.9, eio(u))), (vx + lerp(2.5, 0.5, u), lerp(0.6, 0.8, u), 4.45), 26))
KEYS += [
    (32.8, (BX - 4.4, 1.7, 6.4), (BX - 1.0, 0.8, 4.45), 26),
    (34.0, (BX - 3.8, 1.6, 6.0), (BX - 1.4, 0.6, 4.45), 26),
    (35.0, (BX - 3.0, 3.6, 4.8), (BOXB[0], 0.8, BOXB[2] + .4), 28),   # плавно вверх за прыжком коробки
]
# распаковка: спираль от коробки, расходится и сама приводит в финальный общий план
MOUTH_B = (BOXB[0], RY + BH * .4, BOXB[2])
FIN_REL = (BX + 9.0 - BOXB[0], 11.0 - BOXB[2]); FIN_A = math.atan2(FIN_REL[1], FIN_REL[0]); FIN_R = math.hypot(*FIN_REL)
for k in range(0, 23):
    u = k / 22; t_ = 36.0 + u * 6.0
    ang = FIN_A + 2.0 * (1 - u)
    r = lerp(0.9, FIN_R, ein(u) * .85 + u * .15); y = lerp(5.6, 8.8, eio(u))
    look = tuple(lerp(MOUTH_B[i], (BX, 0.6, 0.0)[i], eio(u)) for i in range(3))
    KEYS.append((t_, (BOXB[0] + r * math.cos(ang), y, BOXB[2] + r * math.sin(ang)), look, lerp(28, 32, u)))

def hermite(keys, t):
    """гладкая кривая через опорные точки (Catmull-Rom по времени), на концах — плавный старт/стоп"""
    if t <= keys[0][0]: return keys[0][1:]
    if t >= keys[-1][0]: return keys[-1][1:]
    i = max(j for j in range(len(keys) - 1) if keys[j][0] <= t)
    t0, t1 = keys[i][0], keys[i + 1][0]; h = t1 - t0; s = (t - t0) / h
    h00, h10, h01, h11 = 2*s**3 - 3*s**2 + 1, s**3 - 2*s**2 + s, -2*s**3 + 3*s**2, s**3 - s**2
    def tang(j, c):
        if j == 0 or j == len(keys) - 1: return 0.0
        return (keys[j + 1][c] - keys[j - 1][c]) / (keys[j + 1][0] - keys[j - 1][0])
    out = []
    for c in (1, 2, 3):
        if isinstance(keys[i][c], tuple):
            v = []
            for d in range(3):
                p0, p1 = keys[i][c][d], keys[i + 1][c][d]
                m0 = 0.0 if i == 0 else (keys[i + 1][c][d] - keys[i - 1][c][d]) / (keys[i + 1][0] - keys[i - 1][0])
                m1 = 0.0 if i + 1 == len(keys) - 1 else (keys[i + 2][c][d] - keys[i][c][d]) / (keys[i + 2][0] - keys[i][0])
                v.append(h00 * p0 + h10 * h * m0 + h01 * p1 + h11 * h * m1)
            out.append(tuple(v))
        else:
            p0, p1 = keys[i][c], keys[i + 1][c]
            m0 = 0.0 if i == 0 else (keys[i + 1][c] - keys[i - 1][c]) / (keys[i + 1][0] - keys[i - 1][0])
            m1 = 0.0 if i + 1 == len(keys) - 1 else (keys[i + 2][c] - keys[i][c]) / (keys[i + 2][0] - keys[i][0])
            out.append(h00 * p0 + h10 * h * m0 + h01 * p1 + h11 * h * m1)
    return out

def cam_state(t):
    return hermite(KEYS, t)

cam_data = bpy.data.cameras.new('cam'); cam_data.sensor_width = 36; cam_data.clip_start = .02; cam_data.clip_end = 300
cam = bpy.data.objects.new('cam', cam_data); col.objects.link(cam); sc.camera = cam
tgt = empty('cam_target')
con = cam.constraints.new('TRACK_TO'); con.target = tgt; con.track_axis = 'TRACK_NEGATIVE_Z'; con.up_axis = 'UP_Y'

# ---------------- анимация: всё — функция времени, ключ на каждый кадр ----------------
TH, TW_, DROP = .012, .3, BH * .3
def three_scale(s): return (s[0], s[2], s[1])

def apply(t, f):
    c, g, lens = cam_state(t)
    cam.location = P(*c); tgt.location = P(*g); cam_data.lens = lens
    cam.keyframe_insert('location', frame=f); tgt.keyframe_insert('location', frame=f); cam_data.keyframe_insert('lens', frame=f)
    # бус
    vx = van_x(t)
    drive = seg(t, *T_DRIVE)
    van.location = P(vx, math.sin(drive * math.pi * 18) * .015 * math.sin(drive * math.pi), 4.45); van.keyframe_insert('location', frame=f)
    for w in WHEELS:
        w.rotation_euler = (math.pi / 2, -vx / .37, 0); w.keyframe_insert('rotation_euler', frame=f)
    d = doors(t)
    for hg, s_ in DOORS:
        hg.rotation_euler = (0, 0, s_ * (math.pi * .6) * d); hg.keyframe_insert('rotation_euler', frame=f)
    rk = ramp_k(t)
    rampG.scale = (max(rk, .0001), 1, 1); rampG.rotation_euler = (0, -.27 * rk, 0)
    rampG.keyframe_insert('scale', frame=f); rampG.keyframe_insert('rotation_euler', frame=f)
    # коробка: сборка, клапаны, скотч
    walls = eio(seg(t, *T_WALLS)) + eio(seg(t, *T_FLAT))   # в конце стенки складываются внутрь (walls → 2)
    opn = -0.28 * eout(seg(t, *T_OPEN))
    cS, cF = eio(seg(t, *T_CLOSE_S)), eio(seg(t, *T_CLOSE_F))
    rOpen = eio(seg(t, T_OPEN_B[2], T_OPEN_B[3])); flat = eio(seg(t, *T_FLAT))
    pack = 2.0 * (1 - eio(seg(t, *T_FLAPS)))        # клапаны сложены на внутреннюю сторону стенок, раскрываются, когда стенки уже стоят
    fin = eio(seg(t, T_FLAT[0] - .3, T_FLAT[0] + .2))   # в конце клапаны сначала складываются внутрь, потом стенки
    flS = lerp(lerp(lerp(opn, 1, cS), -0.28, rOpen) + pack, 2.0, fin)
    flF = lerp(lerp(lerp(opn, 1, cF), -0.28, rOpen) + pack, 2.0, fin)
    for i, (hinge, flap) in enumerate(SIDES):
        hinge.rotation_euler = ((math.pi / 2) * (1 - walls), 0, 0)
        flap.rotation_euler = (-(math.pi / 2) * (flF if i < 2 else flS * .985), 0, 0)
        hinge.keyframe_insert('rotation_euler', frame=f); flap.keyframe_insert('rotation_euler', frame=f)
    off = seg(t, T_OPEN_B[0], T_OPEN_B[1])
    a, b_, c_ = (eout(seg(t, T_TAPE[0], T_TAPE[1])) * (1 - off), eio(seg(t, T_TAPE[1], T_TAPE[2])) * (1 - off), eout(seg(t, T_TAPE[2], T_TAPE[3])) * (1 - off))
    top = BH + BT * 2.2
    tapeL.scale = three_scale((TH, max(.001, DROP * a), TW_)); tapeL.location = P(-BW / 2 - TH / 2, top - DROP + DROP * a / 2, 0)   # растёт снизу вверх за рулоном
    tapeT.scale = three_scale((max(.001, (BW + .02) * b_), TH, TW_)); tapeT.location = P(-BW / 2 + (BW + .02) * b_ / 2, top, 0)
    tapeR.scale = three_scale((TH, max(.001, DROP * c_), TW_)); tapeR.location = P(BW / 2 + TH / 2, top - DROP * c_ / 2, 0)
    for t_ in (tapeL, tapeT, tapeR): t_.keyframe_insert('scale', frame=f); t_.keyframe_insert('location', frame=f)
    pos, rot, s = box_state(t)
    gulp = sum(math.sin(math.pi * seg(t, IN0 + i * IN_STEP + IN_DUR - .1, IN0 + i * IN_STEP + IN_DUR + .35)) for i in range(len(ITEMS)))
    gulp += sum(.6 * math.sin(math.pi * seg(t, OUT0 + i * OUT_STEP, OUT0 + i * OUT_STEP + .3)) for i in range(len(ITEMS)))
    sq = min(1, gulp) * .07
    boxRoot.location = P(*pos); boxRoot.rotation_euler = (0, 0, rot); boxRoot.scale = three_scale((s * (1 + sq * .6), s * (1 - sq), s * (1 + sq * .6)))
    for path in ('location', 'rotation_euler', 'scale'): boxRoot.keyframe_insert(path, frame=f)
    # вещи: ложатся внутрь коробки (в свою ячейку) и при распаковке поднимаются со дна
    hideA = seg(t, T_CLOSE_F[1] + .05, T_CLOSE_F[1] + .1)          # закрыли — внутри не видно
    showB = t >= T_OPEN_B[2]                                           # в Б коробка открылась — вещи снова на дне
    for i, it in enumerate(ITEMS):
        ax, az, ar = it['a']; bx_, bz, br = it['b']; fit = it['fit']; sx, sz = it['slot']
        slotA = (BOXA[0] + sx, RY + BT, BOXA[2] + sz); aboveA = (slotA[0], RY + BH + 1.0, slotA[2])   # выше открытых клапанов
        slotB = (BOXB[0] + sx, RY + BT, BOXB[2] + sz); aboveB = (slotB[0], RY + BH + 1.3, slotB[2])   # выше открытых клапанов
        k = seg(t, IN0 + i * IN_STEP, IN0 + i * IN_STEP + IN_DUR)
        oi = OUT_ORDER.index(it['n'])
        o_ = seg(t, OUT0 + oi * OUT_STEP, OUT0 + oi * OUT_STEP + OUT_DUR)
        if o_ > 0:                                   # распаковка: со дна вверх, потом по дуге на место, растёт
            if o_ < .3:
                e = eout(o_ / .3); p_ = lerp3(slotB, aboveB, e); sc_ = lerp(fit, fit * 1.15, e); r_ = 0.0
            else:
                e = eout((o_ - .3) / .7); p_ = arc(aboveB, (BX + bx_, RY, bz), 2.0 + it['h'] * .3, e)
                sc_ = lerp(fit * 1.15, 1.0, eback(e, .9) if e < 1 else 1.0); r_ = br * eio(min(1, e / .5))   # разворот — пока высоко
        elif showB and t >= OUT0 - 1.0:              # ждут на дне открытой коробки
            p_, sc_, r_ = slotB, fit, 0.0
        elif k <= 0:
            p_, sc_, r_ = (ax, RY, az), 1.0, ar
        elif k < 1:                                  # упаковка: по дуге к коробке, уменьшаясь, потом вниз — на дно
            if k < .68:
                e = eio(k / .68); p_ = arc((ax, RY, az), aboveA, 2.0 + it['h'] * .35, e)
                sc_ = lerp(1.0, fit * 1.15, e); r_ = ar * (1 - eio(min(1, e / .5)))
            else:
                e = eout((k - .68) / .32); p_ = lerp3(aboveA, slotA, e); sc_ = lerp(fit * 1.15, fit, e); r_ = 0.0
        else:                                        # лежит на дне, пока клапаны не закрылись
            p_, sc_, r_ = slotA, max(.0001, fit * (1 - hideA)), 0.0
        if t >= T_HOP_A[0] and k >= 1 and o_ <= 0 and not (showB and t >= OUT0 - 1.0):
            sc_ = .0001                               # коробка уехала — вещи внутри (не показываем)
        o = it['o']; o.location = P(*p_); o.rotation_euler = (0, 0, r_)
        o.scale = (max(sc_, .0001),) * 3
        for path in ('location', 'rotation_euler', 'scale'): o.keyframe_insert(path, frame=f)
    # рулон скотча
    rl = seg(t, T_TAPE[0], T_TAPE[1]); rt = seg(t, T_TAPE[1], T_TAPE[2]); rr = seg(t, T_TAPE[2], T_TAPE[3])
    gone = seg(t, T_TAPE[3], T_TAPE[3] + .3); appear = seg(t, T_TAPE[0] - .25, T_TAPE[0])
    R_ = .12; top_ = BH + BT * 2.2 + R_
    if t < T_TAPE[1]:   pos_r = (-BW / 2 - R_, top_ - R_ - DROP * (1 - eout(rl)), 0); dist = DROP * eout(rl)
    elif t < T_TAPE[2]: pos_r = (-BW / 2 + (BW) * eio(rt), top_, 0); dist = DROP + BW * eio(rt)
    else:               pos_r = (BW / 2 + R_, top_ - R_ - DROP * eout(rr) + .6 * eio(gone), 0); dist = DROP + BW + DROP * eout(rr)
    tapeRoll.location = P(*pos_r); tapeRoll.rotation_euler = (0, -dist / R_, 0)
    tapeRoll.scale = (max(.0001, eout(appear) * (1 - eio(gone))),) * 3
    for path in ('location', 'rotation_euler', 'scale'): tapeRoll.keyframe_insert(path, frame=f)

for f in range(0, N + 1):
    apply(f / FPS, f)
for ob in list(bpy.data.objects) + [cam_data]:
    ad = ob.animation_data
    if ad and ad.action:
        for fc in ad.action.fcurves:
            for kp in fc.keyframe_points: kp.interpolation = 'LINEAR'


# ---------------- рендер: Workbench (серый превиз, быстро) ----------------
sc.render.engine = 'BLENDER_WORKBENCH'
sc.view_settings.view_transform = 'Standard'
sh = sc.display.shading
sh.light = 'STUDIO'; sh.color_type = 'MATERIAL'; sh.show_shadows = False
sh.show_cavity = True; sh.cavity_type = 'BOTH'; sh.cavity_ridge_factor = .6; sh.cavity_valley_factor = .9
sc.display.shadow_focus = .4
sc.world = bpy.data.worlds.new('w'); sc.world.color = (0.09, 0.10, 0.11)
sc.render.resolution_x, sc.render.resolution_y = RW, RH
sc.render.fps = FPS
sc.frame_start, sc.frame_end = F0, F1
sc.render.image_settings.file_format = 'PNG'
sc.render.filepath = os.path.join(OUT, 'f####')
sc.display.render_aa = '8'
if SAVE:
    bpy.ops.wm.save_as_mainfile(filepath=SAVE)
if OUT != 'none':
    bpy.ops.render.render(animation=True)
print('PREVIZ_DONE', F0, F1)
