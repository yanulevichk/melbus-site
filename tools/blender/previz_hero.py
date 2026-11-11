"""
ПРЕВИЗ ПЕРВОГО ЭКРАНА MELBUS (Blender, серые модели) — «вся квартира в одной коробке».
Нужен, чтобы зафиксировать движение камеры и тайминг ДО платной генерации:
черновое видео отдаётся в Seedance 2.5 как образец движения (video reference).

Запуск (без окна):
  blender -b -noaudio --factory-startup -P tools/blender/previz_hero.py -- <out_dir> [width height] [start end]
Кадры пишутся в <out_dir>/f####.png (24 к/с, 35 с = 840 кадров). Сцену можно сохранить: --save <file.blend>

Координаты: раскладка взята из three.js-сцены (y — вверх) и переводится в Blender (z — вверх) функцией P().
"""
import bpy, math, sys, os
from mathutils import Vector

argv = sys.argv[sys.argv.index('--') + 1:] if '--' in sys.argv else []
OUT = argv[0] if argv else '/tmp/previz'
RW, RH = (int(argv[1]), int(argv[2])) if len(argv) >= 3 else (960, 540)
F0, F1 = (int(argv[3]), int(argv[4])) if len(argv) >= 5 else (0, 840)
SAVE = argv[argv.index('--save') + 1] if '--save' in argv else None

FPS, DUR = 24, 35.0
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
def eback(k):
    if k <= 0: return 0.0
    c1 = 1.70158; c3 = c1 + 1
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
    box('rug', 2.9, .025, 1.9, G['mid'], 0, 0, 0, p, 0)
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
    cyl('lamp_b', .2, .22, .05, G['dark'], 0, 0, 0, p); box('lamp_p', .04, 1.55, .04, G['dark'], 0, .05, 0, p, 0); cyl('lamp_s', .2, .32, .36, G['white'], 0, 1.45, 0, p)
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
for i, (bx_, w, h, d) in enumerate([(6.6, 3.2, 3.6, 2.6), (9.6, 2.4, 5.6, 3.4), (12.4, 2.8, 4.2, 2.8), (15.4, 2.6, 6.4, 3.2), (18.4, 3.0, 3.8, 2.6), (21.4, 2.2, 4.8, 3.0), (-6.4, 3.0, 4.6, 3.0), (-9.6, 2.6, 6.0, 3.0), (32.4, 2.8, 5.0, 3.0), (35.6, 2.6, 4.0, 2.8)]):
    box(f'bldg{i}', w, h, d, G['bldg'], bx_, 0, -0.6 - d * 0.1, None, .03)
def tree(x, z, s=0.85):
    t = empty('tree', P(x, 0, z))
    cyl('trunk', .06 * s, .08 * s, .7 * s, G['dark'], 0, 0, 0, t, 8); ico('crown', .55 * s, G['tree'], 0, 1.1 * s, 0, t)
x = 4.8
while x < 23: tree(x, 3.0); x += 2.9
x = -16.0
while x < 46:
    if abs(x - VX) > 4.5 and abs(x - VX - BX) > 4.5: tree(x, 7.1, .8)
    x += 3.4

# ---------------- мебель по местам: A и Б ----------------
PLAN = [
    ('bed', -2.2, -1.5, 0, 2.35, -1.5, 0), ('sofa', 0.3, -2.1, 0, 0.0, -2.1, 0), ('fridge', 3.25, -2.25, 0, -3.25, -2.25, 0),
    ('dining', 2.45, -0.55, 0, -2.2, -0.55, math.pi / 2), ('bookcase', -3.32, 1.75, math.pi / 2, -3.32, -1.0, math.pi / 2),
    ('tv', -3.33, -0.05, math.pi / 2, 0.0, 0.95, math.pi), ('armchair', -1.45, 0.65, 0.9, 1.45, 0.55, -0.75),
    ('rug', 0.3, -0.7, 0, 0.0, -0.65, 0), ('lamp', -1.1, -2.3, 0, -1.55, -2.3, 0), ('plant', 3.3, 1.95, 0, 3.3, 1.1, 0),
]
ITEMS = []
for n, ax, az, ar, bx_, bz, br in PLAN:
    o = empty('it_' + n)
    FUR[n](o)
    ITEMS.append(dict(o=o, a=(ax, az, ar), b=(bx_, bz, br), h={'bed': 1.2, 'fridge': 2.0, 'bookcase': 2.0, 'lamp': 1.9, 'plant': 1.5}.get(n, 0.8)))

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
for t_ in (tapeL, tapeT, tapeR): t_.location = (0, 0, 0)
BOXA, BOXB = (0.75, RY, 1.55), (BX + 1.75, RY, 1.95)

# ---------------- бус ----------------
van = empty('van')
box('van_cargo', 3.35, 2.0, 1.86, G['white'], -.55, .36, 0, van, .1)
box('van_cab', 1.3, 1.36, 1.86, G['white'], 1.62, .36, 0, van, .12)
ws = box('van_wind', .05, .78, 1.66, G['glass'], 1.92, 1.0, 0, van, 0); ws.rotation_euler = (0, .5, 0)
box('van_sidewin', .62, .5, .02, G['glass'], 1.45, 1.06, .935, van, 0)
box('van_bump_f', .2, .26, 1.9, G['dark'], 2.28, .32, 0, van, .04)
box('van_bump_r', .16, .24, 1.9, G['dark'], -2.24, .32, 0, van, .04)
box('van_stripe', 3.36, .1, 1.885, G['tape'], -.55, .55, 0, van, 0)
# боковая сдвижная дверь (видимая сторона): проём тёмный, дверь отъезжает назад
DOOR_X = 0.45
box('van_opening', .95, 1.6, .02, G['dark'], DOOR_X, .55, .925, van, 0)
vanDoor = box('van_door', .97, 1.62, .04, G['white'], DOOR_X, .54, .95, van, .01)
WHEELS = []
for wx_ in (-1.45, 1.5):
    for wz in (.82, -.82):
        w = cyl('wheel', .37, .37, .28, G['dark'], wx_, .37, wz, van, 24, axis='z'); WHEELS.append(w)

# ---------------- камера ----------------
cam_data = bpy.data.cameras.new('cam'); cam_data.lens = 38; cam_data.sensor_width = 36
cam = bpy.data.objects.new('cam', cam_data); col.objects.link(cam); sc.camera = cam
tgt = empty('cam_target')
con = cam.constraints.new('TRACK_TO'); con.target = tgt; con.track_axis = 'TRACK_NEGATIVE_Z'; con.up_axis = 'UP_Y'
# опорные точки камеры: (секунда, позиция камеры, точка взгляда) в координатах three
CAM_KEYS = [
    (0.0, (9.5, 8.8, 11.0), (0.2, 0.8, 0.0)),
    (7.0, (7.2, 6.6, 8.6), (0.5, 0.9, 0.8)),
    (15.0, (4.0, 5.8, 9.4), (0.8, 1.0, 1.4)),
    (20.5, (6.5, 4.2, 13.0), (2.0, 1.0, 3.2)),
    (21.5, (8.5, 3.6, 13.2), (4.0, 1.0, 4.0)),
    (28.0, (32.5, 3.8, 13.0), (28.5, 1.0, 3.6)),
    (35.0, (34.5, 10.5, 12.0), (26.3, 0.6, 0.0)),
]
for t_, c, g in CAM_KEYS:
    f = round(t_ * FPS)
    cam.location = P(*c); cam.keyframe_insert('location', frame=f)
    tgt.location = P(*g); tgt.keyframe_insert('location', frame=f)
for ob in (cam, tgt):
    for fc in ob.animation_data.action.fcurves:
        for kp in fc.keyframe_points: kp.interpolation = 'BEZIER'; kp.handle_left_type = kp.handle_right_type = 'AUTO_CLAMPED'

# ---------------- анимация: состояние сцены как функция времени ----------------
IN0, IN_STEP, IN_DUR = 7.0, 0.7, 1.3
OUT0, OUT_STEP, OUT_DUR = 30.2, 0.3, 1.1

def bez(a, b, lift, k):
    q = ((a[0] + b[0]) / 2, max(a[1], b[1]) + lift, (a[2] + b[2]) / 2)
    u = 1 - k
    return tuple(u * u * a[i] + 2 * u * k * q[i] + k * k * b[i] for i in range(3))

def state(t):
    S = {}
    # бус: приезжает, ждёт, везёт, стоит у новой квартиры
    vx = -30.0
    if t >= 14.5: vx = lerp(-30, VX, eout(seg(t, 14.5, 18.5)))
    if t >= 21.0: vx = lerp(VX, VX + BX, eio(seg(t, 21.0, 27.8)))
    if t >= 33.0: vx = lerp(VX + BX, VX + BX + 34, ein(seg(t, 33.0, 35.0)))
    S['door'] = eio(seg(t, 18.6, 19.0)) * (1 - eio(seg(t, 20.5, 20.9))) + eio(seg(t, 27.9, 28.2)) * (1 - eio(seg(t, 29.5, 29.9)))
    drive = seg(t, 21.0, 27.8)
    S['van'] = ((vx, math.sin(drive * math.pi * 16) * .02 * math.sin(drive * math.pi), 4.45), vx)
    # коробка
    pop = eback(seg(t, 2.0, 2.5))
    walls = eio(seg(t, 2.5, 4.5))
    opn = -0.28 * eout(seg(t, 4.2, 5.0))
    cS, cF = eio(seg(t, 15.0, 15.6)), eio(seg(t, 15.4, 16.0))
    rS, rF = eio(seg(t, 29.8, 30.2)), eio(seg(t, 29.6, 30.0))
    flat = eio(seg(t, 33.6, 34.4))
    off = seg(t, 29.4, 29.6)
    S['walls'] = walls * (1 - flat)
    S['flS'] = lerp(lerp(opn, 1, cS), -0.28, rS) * (1 - flat)
    S['flF'] = lerp(lerp(opn, 1, cF), -0.28, rF) * (1 - flat)
    S['tape'] = (eout(seg(t, 16.1, 16.4)) * (1 - off), eio(seg(t, 16.4, 17.2)) * (1 - off), eout(seg(t, 17.2, 17.5)) * (1 - off))
    S['sticker'] = seg(t, 17.5, 18.0)
    gulp = sum(math.sin(math.pi * seg(t, IN0 + i * IN_STEP + IN_DUR - .1, IN0 + i * IN_STEP + IN_DUR + .35)) for i in range(len(ITEMS)))
    gulp += sum(.6 * math.sin(math.pi * seg(t, OUT0 + i * OUT_STEP, OUT0 + i * OUT_STEP + .3)) for i in range(len(ITEMS)))
    hopIn, hopOut = seg(t, 19.0, 20.4), seg(t, 28.2, 29.4)
    doorPt = lambda vx_: (vx_ + DOOR_X, 1.25, 4.45 + .75)
    inVan = doorPt(VX)
    s = pop * (1 - ein(seg(t, 34.4, 34.9)))
    rot = 0.0
    if hopIn <= 0: pos = BOXA
    elif hopIn < 1: pos = bez(BOXA, inVan, 2.8, eio(hopIn)); s = lerp(1, .42, eio(hopIn)); rot = math.sin(math.pi * hopIn) * .5
    elif hopOut <= 0: pos = inVan; s = 0.0001
    else:
        pos = bez(doorPt(VX + BX), BOXB, 2.8, eio(hopOut)); s = lerp(.42, 1, eout(hopOut)); rot = -math.sin(math.pi * hopOut) * .5
    s *= (1 - ein(seg(t, 34.4, 34.9)))   # сложенная коробка исчезает в конце
    s = max(s, .0001)
    sq = min(1, gulp) * .07
    S['box'] = (pos, rot, (s * (1 + sq * .6), s * (1 - sq), s * (1 + sq * .6)))
    # вещи
    mouthA = (BOXA[0], RY + BH * .55, BOXA[2]); mouthB = (BOXB[0], RY + BH * .55, BOXB[2])
    its = []
    for i, it in enumerate(ITEMS):
        ax, az, ar = it['a']; bx_, bz, br = it['b']
        k = seg(t, IN0 + i * IN_STEP, IN0 + i * IN_STEP + IN_DUR)
        o_ = seg(t, OUT0 + i * OUT_STEP, OUT0 + i * OUT_STEP + OUT_DUR)
        if o_ > 0:
            e = eout(o_)
            pos = bez(mouthB, (BX + bx_, RY, bz), 2.2 + it['h'] * .4, e)
            sc_ = max(.0001, eback(o_)); st_ = math.sin(math.pi * o_) * .22
            its.append((pos, br - (1 - e) * math.pi * 1.2, (sc_ * (1 - st_ * .5), sc_ * (1 + st_), sc_ * (1 - st_ * .5))))
        elif k <= 0:
            its.append(((ax, RY, az), ar, (1, 1, 1)))
        elif k < 1:
            e = eio(k)
            pos = bez((ax, RY, az), mouthA, 2.4 + it['h'] * .4, e)
            sc_ = max(.0001, 1 - ein(k)); st_ = math.sin(math.pi * k) * .28
            its.append((pos, ar + e * math.pi * 1.2, (sc_ * (1 - st_ * .5), sc_ * (1 + st_), sc_ * (1 - st_ * .5))))
        else:
            its.append(((ax, RY, az), ar, (.0001, .0001, .0001)))
    S['items'] = its
    return S

def three_scale(s):  # (sx, sy, sz) three → Blender
    return (s[0], s[2], s[1])

TW, TH, DROP = .44 * BD / 2 * 2 * .5, .012, BH * .3
def apply(S, f):
    (vp, vx) = S['van']
    van.location = P(*vp); van.keyframe_insert('location', frame=f)
    d = S['door']
    vanDoor.location = P(DOOR_X - 1.0 * d, .54 + .81, .95 + .06 * min(1, d * 4)); vanDoor.keyframe_insert('location', frame=f)
    for w in WHEELS:
        w.rotation_euler = (math.pi / 2, 0, -vx / .37 * 0)  # базовый поворот
        w.rotation_euler[1] = -vx / .37
        w.keyframe_insert('rotation_euler', frame=f)
    pos, rot, s = S['box']
    boxRoot.location = P(*pos); boxRoot.rotation_euler = (0, 0, rot); boxRoot.scale = three_scale(s)
    for path in ('location', 'rotation_euler', 'scale'): boxRoot.keyframe_insert(path, frame=f)
    for i, (hinge, flap) in enumerate(SIDES):
        hinge.rotation_euler = ((math.pi / 2) * (1 - S['walls']), 0, 0)
        fold = S['flF'] if i < 2 else S['flS']
        flap.rotation_euler = (-(math.pi / 2) * fold * (1 if i < 2 else .985), 0, 0)
        hinge.keyframe_insert('rotation_euler', frame=f); flap.keyframe_insert('rotation_euler', frame=f)
    a, b, c = S['tape']; top = BH + BT * 2.2; tw = .3
    tapeL.scale = three_scale((TH, max(.001, DROP * a), tw)); tapeL.location = P(-BW / 2 - TH / 2, top - DROP * a / 2, 0)
    tapeT.scale = three_scale((max(.001, (BW + .02) * b), TH, tw)); tapeT.location = P(-BW / 2 + (BW + .02) * b / 2, top, 0)
    tapeR.scale = three_scale((TH, max(.001, DROP * c), tw)); tapeR.location = P(BW / 2 + TH / 2, top - DROP * c / 2, 0)
    for t_ in (tapeL, tapeT, tapeR):
        t_.keyframe_insert('scale', frame=f); t_.keyframe_insert('location', frame=f)
    for it, (pos, rot, s) in zip(ITEMS, S['items']):
        o = it['o']; o.location = P(*pos); o.rotation_euler = (0, 0, rot); o.scale = three_scale(s)
        for path in ('location', 'rotation_euler', 'scale'): o.keyframe_insert(path, frame=f)

for f in range(0, N + 1):
    apply(state(f / FPS), f)
for ob in bpy.data.objects:
    if ob.animation_data and ob.animation_data.action and ob not in (cam, tgt):
        for fc in ob.animation_data.action.fcurves:
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
