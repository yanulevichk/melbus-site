"""
ЧЕРНОВЫЕ СЦЕНЫ РЕКЛАМЫ «ИЩЕМ КУРЬЕРА» (вертикаль 9:16, 24 к/с) — превиз для Higgsfield.
Шесть роликов: 8 «Пустое кресло», 9 «Выбери персонажа», 10 «Окна небоскрёба»,
11 «Бус из коробок», 12 «Гигантский бус», 13 «Лови ключи», 14 «Один день за 12 секунд».

Запуск:
  blender -b -noaudio --factory-startup -P tools/blender/ads/previz_ads.py -- <сцена> <out_dir> [W H] [k n] [--notext]
  <сцена> = 8|9|10|11|12|13|14;  k n — рендерить только кадры, где кадр % n == k (для параллельных процессов)
  --notext — без надписей (чистый кадр для генерации; надписи потом накладываются при монтаже)
Кадры: <out_dir>/f####.png
"""
import bpy, math, sys, os, random
from mathutils import Vector, Matrix, Euler

argv = sys.argv[sys.argv.index('--') + 1:] if '--' in sys.argv else []
NOTEXT = '--notext' in argv
argv = [a for a in argv if not a.startswith('--')]
SCENE = int(argv[0]) if argv else 8
OUT = argv[1] if len(argv) > 1 else '/tmp/ads'
RW, RH = (int(argv[2]), int(argv[3])) if len(argv) > 3 else (540, 960)
KMOD, NMOD = (int(argv[4]), int(argv[5])) if len(argv) > 5 else (0, 1)
FPS = 24
SAMPLES = int(os.environ.get('ADS_SAMPLES', '10'))

# ---------------- утилиты ----------------
def clamp01(v): return max(0.0, min(1.0, v))
def seg(t, a, b): return clamp01((t - a) / (b - a))
def lerp(a, b, k): return a + (b - a) * k
def lerp3(a, b, k): return Vector(a) + (Vector(b) - Vector(a)) * k
def eio(k): return 4 * k * k * k if k < .5 else 1 - pow(-2 * k + 2, 3) / 2
def eout(k): return 1 - pow(1 - k, 3)
def ein(k): return k * k * k
def eback(k, c1=1.70158):
    if k <= 0: return 0.0
    if k >= 1: return 1.0
    c3 = c1 + 1
    return 1 + c3 * pow(k - 1, 3) + c1 * pow(k - 1, 2)

bpy.ops.wm.read_factory_settings(use_empty=True)
sc = bpy.context.scene
col = bpy.data.collections.new('main'); sc.collection.children.link(col)
hudc = bpy.data.collections.new('hudc'); sc.collection.children.link(hudc)
FONT = bpy.data.fonts.load('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf')

MATS = {}
def mat(name, rgb, rough=.6, emit=0.0, metal=0.0, alpha=1.0, ecol=None):
    if name in MATS: return MATS[name]
    m = bpy.data.materials.new(name); m.use_nodes = True
    b = m.node_tree.nodes['Principled BSDF']
    b.inputs['Base Color'].default_value = (*rgb, 1)
    b.inputs['Roughness'].default_value = rough
    b.inputs['Metallic'].default_value = metal
    if emit:
        b.inputs['Emission Color'].default_value = (*(ecol or rgb), 1)
        b.inputs['Emission Strength'].default_value = emit
    if alpha < 1:
        b.inputs['Alpha'].default_value = alpha
        m.blend_method = 'BLEND'; m.shadow_method = 'NONE'; m.show_transparent_back = False
    m.diffuse_color = (*rgb, alpha)
    MATS[name] = m
    return m

def set_emit(m, strength, alpha=None):
    b = m.node_tree.nodes['Principled BSDF']
    b.inputs['Emission Strength'].default_value = strength
    if alpha is not None: b.inputs['Alpha'].default_value = alpha

TEAL = (0.02, 0.72, 0.68)
M = {
    'white': mat('white', (0.86, 0.87, 0.88), .3), 'paint': mat('paint', (0.9, 0.9, 0.9), .22), 'dark': mat('dark', (0.03, 0.035, 0.045), .5),
    'graph': mat('graph', (0.06, 0.085, 0.11), .5), 'mid': mat('mid', (0.22, 0.24, 0.27), .7),
    'light': mat('light', (0.62, 0.64, 0.67), .6), 'glass': mat('glass', (0.05, 0.08, 0.1), .08, alpha=.35),
    'glass_s': mat('glass_s', (0.04, 0.06, 0.09), .1, metal=.6),
    'teal': mat('teal', TEAL, .4, emit=1.2), 'teal_m': mat('teal_m', TEAL, .45),
    'road': mat('road', (0.075, 0.078, 0.085), .65), 'walk': mat('walk', (0.2, 0.2, 0.21), .8),
    'line': mat('line', (0.8, 0.8, 0.8), .6), 'lamp': mat('lamp', (1, .93, .8), .3, emit=6),
    'red': mat('red', (.8, .05, .04), .4, emit=1.5), 'tree': mat('tree', (0.1, 0.2, 0.14), .9),
    'clay': mat('clay', (0.78, 0.76, 0.73), .75), 'metal': mat('metal', (0.7, 0.72, 0.75), .25, metal=1),
    'ghost': mat('ghost', TEAL, .4, emit=2.4, alpha=.3),
    'h_w': mat('h_w', (1, 1, 1), 1, emit=1.0), 'h_t': mat('h_t', TEAL, 1, emit=2.2, ecol=(0.08, 0.86, 0.83)),
    'h_g': mat('h_g', (0.063, 0.086, 0.114), 1, emit=1.0), 'h_plate': mat('h_plate', (0.02, 0.03, 0.04), 1, alpha=.72),
    'h_tplate': mat('h_tplate', TEAL, 1, emit=1.6, ecol=(0.08, 0.86, 0.83)),
    'h_bar': mat('h_bar', (0.12, 0.15, 0.18), 1, emit=.6, ecol=(0.12, 0.15, 0.18)),
}

def _own(o):
    for c in list(o.users_collection): c.objects.unlink(o)
    col.objects.link(o)
    return o

def empty(name, loc=(0, 0, 0), parent=None):
    e = bpy.data.objects.new(name, None); col.objects.link(e)
    e.parent = parent; e.location = loc
    return e

def box(name, sx, sy, sz, m, loc=(0, 0, 0), parent=None, bevel=.02, rot=None):
    X, Y, Z = sx / 2, sy / 2, sz / 2
    vs = [(-X, -Y, -Z), (X, -Y, -Z), (X, Y, -Z), (-X, Y, -Z), (-X, -Y, Z), (X, -Y, Z), (X, Y, Z), (-X, Y, Z)]
    fs = [(0, 3, 2, 1), (4, 5, 6, 7), (0, 1, 5, 4), (1, 2, 6, 5), (2, 3, 7, 6), (3, 0, 4, 7)]
    me = bpy.data.meshes.new(name); me.from_pydata(vs, [], fs); me.update()
    o = bpy.data.objects.new(name, me); col.objects.link(o)
    o.data.materials.append(m); o.parent = parent; o.location = loc
    if rot: o.rotation_euler = rot
    if bevel and min(sx, sy, sz) > bevel * 2.2:
        md = o.modifiers.new('b', 'BEVEL'); md.width = bevel; md.segments = 3; md.limit_method = 'ANGLE'
    return o

def cyl(name, r, h, m, loc=(0, 0, 0), parent=None, axis='z', n=28, r2=None):
    bpy.ops.mesh.primitive_cone_add(vertices=n, radius1=r, radius2=r if r2 is None else r2, depth=h)
    o = _own(bpy.context.active_object); o.name = name
    for p in o.data.polygons: p.use_smooth = len(p.vertices) == 4
    o.data.materials.append(m); o.parent = parent; o.location = loc
    if axis == 'y': o.rotation_euler = (math.pi / 2, 0, 0)
    if axis == 'x': o.rotation_euler = (0, math.pi / 2, 0)
    return o

def sphere(name, r, m, loc=(0, 0, 0), parent=None, scale=None):
    bpy.ops.mesh.primitive_uv_sphere_add(segments=24, ring_count=12, radius=r)
    o = _own(bpy.context.active_object); o.name = name
    for p in o.data.polygons: p.use_smooth = True
    o.data.materials.append(m); o.parent = parent; o.location = loc
    if scale: o.scale = scale
    return o

def torus(name, R, r, m, loc=(0, 0, 0), parent=None):
    bpy.ops.mesh.primitive_torus_add(major_radius=R, minor_radius=r, major_segments=40, minor_segments=10)
    o = _own(bpy.context.active_object); o.name = name
    for p in o.data.polygons: p.use_smooth = True
    o.data.materials.append(m); o.parent = parent; o.location = loc
    return o

def text(name, s, size, m, loc=(0, 0, 0), rot=(0, 0, 0), parent=None, align='CENTER', extrude=0.0):
    cu = bpy.data.curves.new(name, 'FONT'); cu.body = s; cu.font = FONT; cu.size = size
    cu.align_x = align; cu.align_y = 'CENTER'; cu.extrude = extrude; cu.space_line = .92
    o = bpy.data.objects.new(name, cu); col.objects.link(o)
    o.data.materials.append(m); o.parent = parent; o.location = loc; o.rotation_euler = rot
    return o

def light(kind, energy, loc, rot=(0, 0, 0), color=(1, 1, 1), size=1.0, parent=None):
    d = bpy.data.lights.new(kind, kind); d.energy = energy; d.color = color
    if kind == 'AREA': d.size = size
    if kind == 'SUN': d.angle = math.radians(1.2)
    if kind == 'SPOT': d.spot_size = size; d.spot_blend = .5
    o = bpy.data.objects.new(kind, d); col.objects.link(o); o.location = loc; o.rotation_euler = rot; o.parent = parent
    return o

def _desc(o):
    out = [o]
    for c in o.children: out += _desc(c)
    return out

# ---------------- камера и надписи ----------------
camd = bpy.data.cameras.new('cam'); camd.clip_start = .03; camd.clip_end = 900
cam = bpy.data.objects.new('cam', camd); sc.collection.objects.link(cam); sc.camera = cam
HUD = empty('hud', (0, 0, -.25), cam)
HUDS = []   # (obj, t_in, t_out, base_scale)
CHK, CHK_FN, CAM_MARGIN = [], [], .1

def hermite(keys, t):
    """keys: [(время, значение)] — гладкая кривая через точки (скорость непрерывна, без остановок на ключах)."""
    n = len(keys)
    if t <= keys[0][0]: return keys[0][1] * 1
    if t >= keys[-1][0]: return keys[-1][1] * 1
    i = max(j for j in range(n - 1) if keys[j][0] <= t)
    t0, p0 = keys[i]; t1, p1 = keys[i + 1]
    def tan(j):
        a, b = max(j - 1, 0), min(j + 1, n - 1)
        m = (keys[b][1] - keys[a][1]) * (1.0 / (keys[b][0] - keys[a][0]))
        return m * (.35 if j in (0, n - 1) else 1.0)
    h = t1 - t0; u = (t - t0) / h; u2, u3 = u * u, u * u * u
    return p0 * (2 * u3 - 3 * u2 + 1) + tan(i) * (h * (u3 - 2 * u2 + u)) + p1 * (-2 * u3 + 3 * u2) + tan(i + 1) * (h * (u3 - u2))

def hand_noise(t, amp):
    return Vector((math.sin(t * 1.3) + .5 * math.sin(t * 2.9 + 1), math.sin(t * 1.1 + 2) + .5 * math.sin(t * 3.3),
                   math.sin(t * 1.7 + 4) + .5 * math.sin(t * 2.3 + .5))) * amp

def cam_path(t, K, amp=.012, fstop=None, focus=None):
    """K: [(t, позиция, цель, объектив)]"""
    pos = hermite([(k[0], Vector(k[1])) for k in K], t) + hand_noise(t, amp)
    tg = hermite([(k[0], Vector(k[2])) for k in K], t) + hand_noise(t + 7, amp * .6)
    set_cam(pos, tg, hermite([(k[0], float(k[3])) for k in K], t), .004 * math.sin(t * .9), fstop, focus)
    return pos, tg

def set_cam(pos, target, lens, roll=0.0, fstop=None, focus=None):
    cam.location = pos
    d = Vector(target) - Vector(pos)
    camd.dof.use_dof = fstop is not None
    if fstop is not None:
        camd.dof.aperture_fstop = fstop; camd.dof.focus_distance = focus if focus is not None else d.length
    q = d.to_track_quat('-Z', 'Y')
    cam.rotation_euler = (q.to_matrix().to_4x4() @ Matrix.Rotation(roll, 4, 'Z')).to_euler()
    camd.lens = lens

def hud(s, y, size, color='w', t_in=0.0, t_out=None, plate=None, x=0.0, align='CENTER', maxw=1.0):
    """Надпись поверх кадра. Единицы: высота кадра = 2 (−1…1), ширина = 1.125."""
    if NOTEXT: return None
    g = empty('hud_g', (x, y, 0), HUD)
    o = text('hud_t', s, size, M['h_' + color], (0, 0, 0), parent=g, align=align)
    bpy.context.view_layer.update()
    w, h = o.dimensions.x, o.dimensions.y
    if w > maxw:
        k = maxw / w; o.scale = (k, k, k); w, h = w * k, h * k
    if plate:
        px = 0 if align == 'CENTER' else (w / 2 if align == 'LEFT' else -w / 2)
        box('hud_p', w + size * .9, h + size * .75, .002, M['h_plate' if plate == 'dark' else 'h_tplate'], (px, 0, -.004), g, 0)
    HUDS.append((g, t_in, t_out))
    return g

def apply_hud(t):
    # масштаб «экрана» надписей: на расстоянии 0.25 м полувысота кадра = 0.25*18/lens
    k = .25 * 18.0 / camd.lens
    HUD.scale = (k, k, k)
    for g, a, b in HUDS:
        s = eback(seg(t, a, a + .28))
        if b is not None: s *= 1 - ein(seg(t, b - .18, b))
        g.scale = (s, s, s) if s > .001 else (0, 0, 0)
    for b, a in TAPES:
        k = eout(seg(t, a, a + .32))
        b.scale = (max(k, .0001), 1, 1); b.location.x = -.65 + .65 * k

# ---------------- бус (нос в +X, водитель слева = +Y) ----------------
def make_van(name='van', passenger_seat=True, logo=True):
    r = empty(name); W, D = M['paint'], M['dark']
    box('cargo', 3.5, 2.0, 1.95, W, (-.9, 0, 1.425), r, .07)
    box('cabfloor', 1.9, 1.96, .06, D, (1.75, 0, .5), r, 0)
    box('hood', .85, 2.0, .75, W, (2.28, 0, .83), r, .1)
    for s in (1, -1):
        box('doorlow', 1.1, .05, .75, W, (1.37, s * .975, .83), r, .02)
        box('bpil', .1, .05, 1.15, W, (.92, s * .975, 1.78), r, .01)
        box('apil', .07, .07, 1.19, W, (2.27, s * .955, 1.76), r, .01, rot=(0, -.35, 0))
        box('stripe', 5.25, .02, .09, M['teal'], (0, s * 1.005, .72), r, 0)
        box('rearl', .03, .12, .5, M['red'], (-2.66, s * .9, 1.3), r, 0)
        box('headl', .04, .36, .16, M['lamp'], (2.71, s * .7, 1.0), r, .01)
    box('cabroof', 1.27, 2.0, .08, W, (1.47, 0, 2.36), r, .03)
    ws = box('windshield', .02, 1.86, 1.19, M['glass'], (2.27, 0, 1.76), r, 0, rot=(0, -.35, 0))
    glass = [ws]
    for s in (1, -1): glass.append(box('sidewin', .95, .015, .95, M['glass'], (1.5, s * .985, 1.72), r, 0))
    box('bulkhead', .05, 1.9, 1.9, M['light'], (.86, 0, 1.45), r, 0)
    box('skirt', 5.3, 2.02, .14, D, (-.02, 0, .48), r, .03)
    box('bumper', .16, 2.0, .3, D, (2.72, 0, .6), r, .04)
    box('grille', .03, 1.15, .22, D, (2.715, 0, .98), r, .01)
    for s in (1, -1):
        box('mirror_arm', .06, .22, .04, D, (2.02, s * 1.08, 1.5), r, 0)
        box('mirror', .05, .1, .3, D, (2.03, s * 1.2, 1.58), r, .02)
        box('handle', .14, .02, .035, D, (1.0, s * 1.0, 1.12), r, .008)
    box('plate', .01, .5, .12, M['light'], (2.805, 0, .6), r, 0)
    box('rhandle', .02, .3, .04, D, (-2.66, 0, 1.15), r, 0)
    box('rseam', .012, .012, 1.8, D, (-2.655, 0, 1.42), r, 0)
    wheels = []
    for wx in (1.8, -1.55):
        for s in (1, -1):
            cyl('arch', .47, .05, D, (wx, s * .99, .42), r, 'y', 32)
            w = cyl('wheel', .37, .26, D, (wx, s * .9, .37), r, 'y'); wheels.append(w)
            cyl('hub', .2, .27, M['light'], (0, 0, 0), w, 'z', 16).rotation_euler = (0, 0, 0)
    # сдвижная дверь (правый борт) и тёмный проём за ней
    box('doorhole', 1.2, .02, 1.7, D, (.12, -1.0, 1.45), r, 0)
    door = box('slidedoor', 1.26, .035, 1.78, W, (.12, -1.018, 1.45), r, .02)
    if logo:
        for s in (1, -1):
            rot = (math.pi / 2, 0, 0) if s < 0 else (math.pi / 2, 0, math.pi)
            ax = -1.42
            text('logoA', 'MEL', .36, M['graph'], (ax - .02 * (1 if s < 0 else -1), s * 1.012, 1.5), rot, r, 'RIGHT', .004)
            text('logoB', 'BUS', .36, M['teal_m'], (ax + .02 * (1 if s < 0 else -1), s * 1.012, 1.5), rot, r, 'LEFT', .004)
    # кабина внутри
    box('dash', .4, 1.9, .28, D, (2.05, 0, 1.13), r, .05)
    ys = (.45, -.45) if passenger_seat else (.45,)
    for y in ys:
        box('seat', .5, .5, .14, M['mid'], (1.3, y, .9), r, .05)
        box('seatback', .12, .5, .78, M['mid'], (1.02, y, 1.33), r, .05, rot=(0, -.12, 0))
        box('headrest', .1, .28, .2, M['mid'], (.95, y, 1.83), r, .04)
    sw = empty('steer_tilt', (1.7, .45, 1.4), r); sw.rotation_euler = (0, math.radians(-65), 0)
    steer = empty('steer', (0, 0, 0), sw)
    torus('swheel', .19, .022, D, (0, 0, 0), steer)
    box('spoke', .36, .035, .02, D, (0, 0, 0), steer, 0); box('spoke2', .035, .19, .02, D, (0, -.09, 0), steer, 0)
    cyl('column', .03, .4, D, (0, 0, -.2), sw, 'z', 12)
    return {'root': r, 'wheels': wheels, 'steer': steer, 'door': door, 'glass': glass}

def spin_wheels(v, dist):
    for w in v['wheels']: w.rotation_euler = (math.pi / 2, -dist / .37, 0)

# ---------------- человек-«глина» ----------------
def make_figure(m, pose='sit', parent=None, courier=False):
    r = empty('fig', (0, 0, 0), parent)
    if pose == 'sit':
        box('pelvis', .3, .36, .2, m, (0, 0, .105), r, .07)
        box('torso', .22, .4, .52, m, (-.05, 0, .46), r, .09, rot=(0, -.1, 0))
        sphere('head', .12, m, (-.02, 0, .9), r)
        for s in (1, -1):
            box('thigh', .4, .14, .13, m, (.2, s * .1, .105), r, .05)
            box('shin', .12, .12, .42, m, (.4, s * .1, -.15), r, .05)
            box('uarm', .11, .1, .3, m, (.02, s * .26, .55), r, .04, rot=(0, .45, 0))
            box('farm', .22, .09, .09, m, (.2, s * .26, .46), r, .04, rot=(0, -.2, 0))
    else:
        dk, tl = (M['graph'], M['teal_m']) if courier else (m, m)
        for s in (1, -1):
            box('leg', .16, .15, .76, dk, (0, s * .1, .49), r, .06)
            box('shoe', .26, .13, .09, M['dark'] if courier else m, (.04, s * .1, .045), r, .03)
            box('uarm', .11, .1, .3, dk, (.06, s * .28, 1.32), r, .045, rot=(0, -.35, 0))
            box('farm', .3, .09, .09, dk, (.27, s * .285, 1.1), r, .04)
            sphere('hand', .055, M['dark'] if courier else m, (.46, s * .285, 1.1), r)
        box('torso', .26, .44, .62, dk, (0, 0, 1.2), r, .1)
        if courier:
            box('trim', .262, .442, .04, tl, (0, 0, .95), r, .01)
            box('zip', .01, .03, .5, tl, (.132, 0, 1.22), r, 0)
        sphere('head', .13, m, (0, 0, 1.68), r)
        if courier:
            cyl('cap', .136, .08, dk, (0, 0, 1.78), r, 'z', 24)
            box('visor', .14, .2, .02, tl, (.17, 0, 1.75), r, .008)
            pb = box('parcel', .36, .44, .3, M['white'], (.44, 0, 1.13), r, .015)
            box('tape', .362, .06, .302, M['teal_m'], (.44, 0, 1.13), r, 0)
    return r

# ---------------- город ----------------
def street(x0, x1, road_w=12, walk_w=4, night=False):
    L = x1 - x0; cx = (x0 + x1) / 2
    box('asphalt', L, 400, .1, M['road'], (cx, 0, -.05), None, 0)
    for s in (1, -1):
        box('walk', L, walk_w, .16, M['walk'], (cx, s * (road_w / 2 + walk_w / 2), .08), None, .03)
    x = x0
    while x < x1:
        box('dash', 2.2, .14, .01, M['line'], (x, 0, .006), None, 0); x += 6

def buildings(x0, x1, y_face, side, hmin, hmax, seed, night=False, depth=22, wmin=10, wmax=20):
    rnd = random.Random(seed); x = x0
    tones = [(0.5, 0.52, 0.55), (0.34, 0.36, 0.4), (0.62, 0.61, 0.58), (0.2, 0.22, 0.26), (0.44, 0.47, 0.5)]
    while x < x1:
        w = rnd.uniform(wmin, wmax); h = rnd.uniform(hmin, hmax); d = depth
        tone = rnd.choice(tones)
        if night: tone = tuple(c * .25 for c in tone)
        m = mat('b%.2f%.2f%d' % (tone[0], tone[2], night), tone, .8)
        yc = y_face + side * d / 2
        box('bld', w - .6, d, h, m, (x + w / 2, yc, h / 2), None, 0)
        if not night:
            box('shop', w - 1.2, d + .1, 2.6, M['glass_s'], (x + w / 2, yc, 1.5), None, 0)
            box('shoplight', w - 2.2, .06, .14, M['lamp'], (x + w / 2, y_face - side * .08, 2.95), None, 0)
        box('parapet', w - .4, d + .2, .5, m, (x + w / 2, yc, h + .25), None, 0)
        box('roofbox', w * .3, d * .3, 2.4, m, (x + w / 2 + rnd.uniform(-2, 2), yc, h + 1.2), None, 0)
        fl = 3.4; z = 5.2 if not night else 2.2
        while z < h - 2:
            box('band', w - 1.6, d + .06, 1.5, M['glass_s'], (x + w / 2, yc, z + .75), None, 0); z += fl
        if night:
            for _ in range(int(h / 6)):
                wm = mat('warm', (1, .8, .5), .5, emit=2.5)
                box('lit', rnd.uniform(.8, 2.4), .1, 1.2, wm,
                    (x + rnd.uniform(1.5, w - 1.5), y_face - side * .06, 2.95 + fl * rnd.randrange(0, max(1, int((h - 5) / fl)))), None, 0)
        x += w

def tree(x, y, s=1.0):
    cyl('trunk', .12 * s, 2.2 * s, M['dark'], (x, y, 1.1 * s), None, 'z', 8)
    sphere('crown', 1.3 * s, M['tree'], (x, y, 3.0 * s), None, (1, 1, 1.15))

def lamp_post(x, y, side=1, night=False):
    cyl('pole', .07, 6, M['dark'], (x, y, 3), None, 'z', 8)
    box('arm', .1, 1.4, .08, M['dark'], (x, y - side * .7, 5.95), None, 0)
    box('head', .5, .25, .06, M['lamp'], (x, y - side * 1.3, 5.9), None, 0)

def car(x, y, heading=0.0, rgb=(.5, .1, .1)):
    r = empty('car', (x, y, 0)); r.rotation_euler = (0, 0, heading)
    m = mat('car%.2f%.2f' % (rgb[0], rgb[2]), rgb, .35, metal=.3)
    box('cbody', 4.3, 1.8, .62, m, (0, 0, .62), r, .12)
    box('ccab', 2.3, 1.62, .55, M['glass_s'], (-.2, 0, 1.18), r, .14)
    for wx in (1.35, -1.35):
        for s in (1, -1): cyl('cw', .32, .22, M['dark'], (wx, s * .85, .32), r, 'y', 16)
    return r

SUN_DIR = Vector((.6, -.55, .32)).normalized()
HUD_WORLD = MAIN_WORLD = None
def render_setup(world=(0.5, 0.6, 0.75), wstr=1.0, night=False, haze=.0035):
    sc.render.engine = 'BLENDER_EEVEE'
    ee = sc.eevee
    ee.taa_render_samples = SAMPLES; ee.use_gtao = True; ee.gtao_distance = 1.6; ee.gtao_factor = 1.3
    ee.use_bloom = True; ee.bloom_threshold = 1.0; ee.bloom_intensity = .06 if not night else .12; ee.bloom_radius = 6
    ee.use_ssr = True; ee.use_soft_shadows = True; ee.shadow_cube_size = '1024'; ee.shadow_cascade_size = '2048'
    sc.view_settings.view_transform = 'Filmic'; sc.view_settings.look = 'Medium High Contrast'
    w = bpy.data.worlds.new('w'); w.use_nodes = True
    nt = w.node_tree; bg = nt.nodes['Background']; bg.inputs[0].default_value = (*world, 1); bg.inputs[1].default_value = wstr
    if not night:
        sky = nt.nodes.new('ShaderNodeTexSky'); sky.sky_type = 'HOSEK_WILKIE'; sky.turbidity = 2.6; sky.ground_albedo = .25
        sky.sun_direction = SUN_DIR
        nt.links.new(sky.outputs[0], bg.inputs[0]); bg.inputs[1].default_value = 1.5 * wstr
        sc.view_settings.exposure = .55
    vol = nt.nodes.new('ShaderNodeVolumeScatter'); vol.inputs['Density'].default_value = haze
    vol.inputs['Anisotropy'].default_value = .55
    vol.inputs['Color'].default_value = (.75, .85, 1, 1) if not night else (.35, .5, .8, 1)
    if haze > 0: nt.links.new(vol.outputs[0], nt.nodes['World Output'].inputs['Volume'])
    ee.volumetric_start = .5; ee.volumetric_end = 260; ee.volumetric_tile_size = '8'; ee.volumetric_samples = 48
    ee.use_volumetric_lights = True; ee.use_volumetric_shadows = False
    ee.bokeh_max_size = 60; ee.use_bokeh_jittered = False
    sc.world = w
    bw = bpy.data.worlds.new('hudw'); bw.use_nodes = True; bw.node_tree.nodes['Background'].inputs[1].default_value = 0
    global HUD_WORLD, MAIN_WORLD; HUD_WORLD, MAIN_WORLD = bw, w
    sc.render.resolution_x, sc.render.resolution_y = RW, RH
    sc.render.image_settings.file_format = 'PNG'; sc.render.fps = FPS

def sun(energy=5.0, direction=None, color=(1, .86, .68)):
    """Низкое тёплое солнце (длинные тени); direction — куда СВЕТИТ солнце оттуда, где оно на небе."""
    global SUN_DIR
    if direction is not None: SUN_DIR = Vector(direction).normalized()
    o = light('SUN', energy, (0, 0, 50), (0, 0, 0), color)
    o.rotation_euler = (-SUN_DIR).to_track_quat('-Z', 'Y').to_euler()
    return o

def badge(t_out=None):
    """Плашка «ИЩЕМ КУРЬЕРА» — с первой секунды в каждом ролике."""
    hud('ИЩЕМ КУРЬЕРА · ВАРШАВА', .74, .058, 'g', .05, t_out, plate='teal')

TAPES = []
def cta(t):
    if NOTEXT: return
    g = empty('tape_g', (0, -.5, 0), HUD); g.rotation_euler = (0, 0, math.radians(2.2))
    b = box('tape_b', 1.3, .12, .002, M['h_tplate'], (0, 0, -.003), g, 0)
    TAPES.append((b, t))
    hud('НАПИШИ В WHATSAPP  →', -.5, .058, 'g', t + .22, None).rotation_euler = (0, 0, math.radians(2.2))
    hud('Маршруты GLS · Варшава', -.6, .032, 'w', t + .4, None, plate='dark')

# =====================================================================================
# 8 — «ПУСТОЕ КРЕСЛО»
# =====================================================================================
def scene8():
    sun(6, (.95, .02, .32)); render_setup(wstr=1.0, haze=.0025)
    street(-80, 260); buildings(-80, 260, 11, 1, 14, 34, 1); buildings(-80, 260, -11, -1, 14, 34, 2)
    for i in range(18): tree(-70 + i * 19, 8.2 * (1 if i % 2 else -1), .9)
    v = make_van(passenger_seat=False); van = v['root']
    v['glass'][2].hide_render = True                     # правое окно снято — через него влетает камера
    ghost = make_figure(M['ghost'], 'sit', van); ghost.location = (1.3, .45, .97)
    cam.parent = van
    CHK.append(('призрак/кабина', meshes(ghost), [o for o in meshes(van) if o not in meshes(ghost)]))
    light('POINT', 60, (1.5, -.2, 2.1), parent=van, color=(1, .95, .9))
    badge(3.3)
    hud('ЗДЕСЬ ДОЛЖЕН\nБЫТЬ ТЫ', .56, .1, 'w', 3.7, None, plate='dark')
    hud('6500–8000 zł', -.2, .12, 't', 4.7, None, plate='dark')
    hud('на руки · пн–пт · в 15:00 свободен', -.32, .04, 'w', 4.95, None, plate='dark')
    cta(5.9)
    A = [(0.0, (13.0, -7.5, .75), (1.6, 0, 1.25), 40), (1.3, (7.0, -4.9, 1.35), (1.6, 0, 1.4), 34),
         (2.3, (3.0, -2.5, 1.75), (1.55, .3, 1.45), 26), (3.0, (1.56, -1.22, 1.72), (1.48, .45, 1.42), 19),
         (3.9, (1.5, -.8, 1.66), (1.42, .45, 1.38), 16.5), (7.5, (1.42, -.68, 1.68), (1.36, .5, 1.44), 15.5)]
    def apply(t):
        x = -40 + 11 * t
        van.location = (x, 2.6, 0); spin_wheels(v, x)
        v['steer'].rotation_euler = (0, 0, .55 * math.sin(t * 2.3) + .2 * math.sin(t * 5.1))
        cam_path(t, A, amp=.006 + .01 * (1 - seg(t, 2.2, 3.2)), fstop=lerp(2.8, 1.8, seg(t, 2.5, 3.6)))
        g = eout(seg(t, 3.45, 4.1))
        ghost.scale = (1, 1, 1) if g > 0 else (0, 0, 0)
        set_emit(M['ghost'], (2.2 + 1.2 * math.sin(t * 6.5)) * g, (.26 + .1 * math.sin(t * 6.5)) * g)
    return 7.5, apply

# =====================================================================================
# 9 — «ВЫБЕРИ ПЕРСОНАЖА»
# =====================================================================================
def scene9():
    render_setup((0.01, 0.014, 0.02), 1.0, night=True, haze=.005)
    box('floor', 60, 60, .1, mat('stage', (0.02, 0.025, 0.03), .55), (0, 0, -.05), None, 0)
    cyl('pod', 1.15, .22, M['graph'], (0, 0, .11), None, 'z', 64)
    torus('ring', 1.16, .025, M['teal'], (0, 0, .225))
    ring2 = torus('ring2', 1.5, .012, M['teal'], (0, 0, .02))
    spin = empty('spin', (0, 0, .226))
    fig = make_figure(M['clay'], 'stand', spin, courier=True)
    CHK.append(('коробка/руки', named('parcel'), [o for o in meshes(fig) if o.name.split('.')[0] != 'parcel']))
    CHK.append(('фигура/подиум', meshes(fig), named('pod', 'ring')))
    v = make_van(); v['root'].location = (-2.6, 8.5, 0); v['root'].rotation_euler = (0, 0, math.radians(-30))
    light('AREA', 900, (2.5, -3.5, 4.2), (math.radians(48), 0, math.radians(32)), (1, .96, .9), 3)
    light('AREA', 500, (-3.5, -1, 3.0), (math.radians(60), 0, math.radians(-75)), (0.3, .95, .92), 3)
    light('AREA', 220, (-1, 4, 5), (math.radians(-50), 0, 0), (.6, .8, 1), 4)
    light('SPOT', 2500, (0, -.5, 6), (0, 0, 0), (1, 1, 1), math.radians(38))
    hud('ВЫБЕРИ ПЕРСОНАЖА', .74, .07, 'w', .05)
    hud('КУРЬЕР · ВАРШАВА', .64, .05, 'g', .3, None, plate='teal')
    rows = [('ЗАРПЛАТА', '6500–8000 zł', 1.0), ('ВЫХОДНЫЕ', 'СБ + ВС', .92), ('КОНЕЦ СМЕНЫ', '15:00', .85), ('БУС', '2020+', .78)]
    bars = []
    for i, (lab, val, lvl) in enumerate(rows):
        y = -.1 - i * .105; t0 = 1.1 + i * .75
        hud(lab, y, .036, 'w', t0, None, x=-.47, align='LEFT')
        hud(val, y, .042, 't', t0 + .25, None, x=.47, align='RIGHT')
        if not NOTEXT:
            box('barbg', .94, .016, .002, M['h_bar'], (0, y - .04, -.002), HUD, 0)
            f = box('barfill', 1, .016, .002, M['h_tplate'], (0, y - .04, 0), HUD, 0); bars.append((f, t0 + .1, lvl))
    btn = hud('ИГРАТЬ  ▶', -.56, .075, 'g', 4.6, None, plate='teal')
    hud('Напиши в WhatsApp · маршруты GLS', -.66, .03, 'w', 5.2, None, plate='dark')
    def apply(t):
        spin.rotation_euler = (0, 0, math.radians(-65) + 1.25 * t + .9 * eout(seg(t, 0, 1.2)))
        ring2.scale = (1 + .06 * math.sin(t * 3),) * 2 + (1,)
        a = math.radians(-112 + 44 * eout(seg(t, 0, 7.0)))
        d = lerp(10.5, 7.3, eout(seg(t, 0, 2.2))) - .25 * seg(t, 2.2, 7)
        pos = Vector((d * math.cos(a), d * math.sin(a), lerp(.7, 1.35, eout(seg(t, 0, 2.6))))) + hand_noise(t, .008)
        set_cam(pos, (0, 0, .0), 44, 0, 2.0, (Vector((0, 0, 1.2)) - pos).length)
        for f, t0, lvl in bars:
            k = eout(seg(t, t0, t0 + .6)) * lvl
            f.scale = (max(k * .94, .0001), 1, 1); f.location.x = -.47 + .94 * k / 2
        if btn:
            p = seg(t, 5.9, 6.25)
            if 0 < p < 1:
                s = 1 - .12 * math.sin(p * math.pi); btn.scale = (s, s, s)
    return 7.0, apply

# =====================================================================================
# 10 — «ОКНА НЕБОСКРЁБА»
# =====================================================================================
GLYPH = {
    'И': '#...#,#...#,#..##,#.#.#,##..#,#...#,#...#', 'Щ': '#.#.#,#.#.#,#.#.#,#.#.#,#.#.#,#####,....#',
    'Е': '#####,#....,#....,####.,#....,#....,#####', 'М': '#...#,##.##,#.#.#,#.#.#,#...#,#...#,#...#',
    'К': '#...#,#..#.,#.#..,##...,#.#..,#..#.,#...#', 'У': '#...#,#...#,#...#,.####,....#,....#,.###.',
    'Р': '####.,#...#,#...#,####.,#....,#....,#....', 'Ь': '#....,#....,#....,####.,#...#,#...#,####.',
    'А': '.###.,#...#,#...#,#####,#...#,#...#,#...#', '6': '.###.,#....,#....,####.,#...#,#...#,.###.',
    '5': '#####,#....,####.,....#,....#,#...#,.###.', '0': '.###.,#...#,#..##,#.#.#,##..#,#...#,.###.',
    'z': '.....,.....,#####,...#.,..#..,.#...,#####', 'ł': '.##..,..#..,..#.#,..##.,.##..,..#..,.###.',
    ' ': '.....,.....,.....,.....,.....,.....,.....',
}
def scene10():
    render_setup((0.006, 0.01, 0.022), 1.0, night=True, haze=.0022)
    rnd = random.Random(10)
    box('ground', 500, 500, .1, mat('wet', (0.02, 0.022, 0.028), .18), (0, 0, -.05), None, 0)
    COLS, ROWS, CW, CH = 45, 38, 1.0, 1.6
    TW, TH = COLS * CW + 1.5, ROWS * CH + 5
    box('tower', TW, 16, TH, mat('tower', (0.018, 0.022, 0.03), .35), (0, 48, TH / 2), None, 0)
    m_off = mat('w_off', (0.012, 0.018, 0.03), .1, metal=.5)
    m_warm = mat('w_warm', (1, .78, .5), .5, emit=1.4)
    m_on = mat('w_on', (1, .97, .9), .5, emit=5.5)
    m_teal = mat('w_teal', TEAL, .5, emit=7, ecol=(0.08, 0.86, 0.83))
    lines = [('ИЩЕМ', 6, m_on, .7, 1.9), ('КУРЬЕРА', 15, m_on, 1.6, 2.9), ('6500 zł', 24, m_teal, 3.0, 3.6)]
    grid = {}
    for s, row0, m, a, b in lines:
        wd = len(s) * 6 - 1; c0 = (COLS - wd) // 2
        for i, ch in enumerate(s):
            for r_, rowbits in enumerate(GLYPH[ch].split(',')):
                for c_, bit in enumerate(rowbits):
                    if bit == '#': grid[(row0 + r_, c0 + i * 6 + c_)] = (m, rnd.uniform(a, b))
    wins = []
    wmesh = box('wproto', .72, .08, 1.15, m_off, (0, 0, -50), None, 0).data
    for r_ in range(ROWS):
        for c_ in range(COLS):
            o = bpy.data.objects.new('win', wmesh); col.objects.link(o)
            o.location = ((c_ - (COLS - 1) / 2) * CW, 39.96, TH - 3.2 - r_ * CH)
            o.material_slots[0].link = 'OBJECT'; o.material_slots[0].material = m_off
            g = grid.get((r_, c_))
            warm = None if g else ((rnd.uniform(0, .6), rnd.uniform(.5, 2.4)) if rnd.random() < .06 else None)
            wins.append([o, g, warm, None])
    buildings(-150, -TW / 2 - 6, 44, 1, 20, 55, 31, night=True); buildings(TW / 2 + 6, 150, 44, 1, 20, 55, 32, night=True)
    street(-150, 150)                                       # дорога по y=0 перенесётся ниже
    for o in list(bpy.data.objects):
        if o.name.startswith(('asphalt', 'walk', 'dash')): o.location.y -= 38
    for i in range(10): lamp_post(-98 + i * 20, -29.5, 1)
    v = make_van(); van = v['root']
    light('SPOT', 4000, (2.8, 0, 1.0), (0, math.radians(-82), 0), (1, .95, .85), math.radians(50), parent=van)
    CHK.append(('бус/улица', meshes(van), named('pole', 'arm', 'head', 'bld', 'walk')))
    light('SUN', .25, (0, 0, 50), (math.radians(30), 0, math.radians(20)), (.5, .6, 1))
    badge(2.4)
    hud('пн–пт · 5:30–15:00 · на руки', .72, .045, 'w', 4.1, None, plate='dark')
    cta(5.3)
    def apply(t):
        for w in wins:
            o, g, warm, cur = w
            if g: want = g[0] if t >= g[1] else m_off
            elif warm: want = m_warm if (t + warm[0]) % (warm[1] * 4) < warm[1] * 3.4 else m_off
            else: want = m_off
            if want is not cur: o.material_slots[0].material = want; w[3] = want
        pulse = 7 + 5 * math.sin((t - 3.6) * 9) * (1 - seg(t, 3.6, 5.0)) if t > 3.6 else 7
        set_emit(m_teal, pulse)
        cam_path(t, [(0, (-9, 20, 1.4), (-2, 40, 46), 15), (1.5, (-13, -4, 3.5), (-1, 40, 40), 18),
                     (3.0, (-6, -44, 9.5), (0, 40, 33), 25), (4.4, (0, -64, 12.5), (0, 40, 31.5), 30),
                     (7.5, (2.5, -69, 13.6), (0, 40, 31.2), 30.5)], amp=.02)
        x = -62 + 13.5 * (t - 2.2)
        van.location = (x, -36.5, 0); spin_wheels(v, x)
    return 7.5, apply

# =====================================================================================
# 11 — «БУС ИЗ КОРОБОК»
# =====================================================================================
def scene11():
    sun(6, (-.94, .03, .36)); render_setup(wstr=1.0, haze=.0025)
    street(-140, 180, 34, 6); buildings(-140, 180, 23, 1, 18, 60, 5); buildings(-140, 180, -23, -1, 18, 60, 6)
    for i in range(16): tree(-110 + i * 17, 19.5 * (1 if i % 2 else -1), 1.0)
    v = make_van(); van = v['root']
    ghost = make_figure(M['ghost'], 'sit', van); ghost.location = (1.3, .45, .97)
    rnd = random.Random(11)
    # заготовка коробки: белая + бирюзовый скотч
    C = .36
    b0 = box('bx', C * .94, C * .94, C * .94, M['white'], (0, 0, -80), None, .012)
    b0.data.materials.append(M['teal_m'])
    tp = box('bxt', C * .95, C * .14, C * .95, M['teal_m'], (0, 0, -80), None, 0)
    nx, ny, nz = 15, 6, 6
    solid = set()
    for i in range(nx):
        for j in range(ny):
            for k in range(nz):
                x = -2.7 + C * (i + .5); z = .3 + C * (k + .5)
                if x > 1.9 and z > 1.25 + (2.7 - x) * 1.4: continue        # скос капота/лобового
                solid.add((i, j, k))
    boxes = []
    for (i, j, k) in sorted(solid):
        nb = [(i + 1, j, k), (i - 1, j, k), (i, j + 1, k), (i, j - 1, k), (i, j, k + 1)]
        if all(n in solid for n in nb): continue                           # только оболочка
        x = -2.7 + C * (i + .5); y = -1.08 + C * (j + .5); z = .3 + C * (k + .5)
        g = empty('bg'); o = bpy.data.objects.new('b', b0.data); col.objects.link(o); o.parent = g
        o2 = bpy.data.objects.new('bt', tp.data); col.objects.link(o2); o2.parent = g
        # колонна (одинаковые x, y) летит строго вертикально, нижние раньше верхних → коробки не встречаются
        t0 = .15 + 3.0 * (.68 * i / nx + .32 * k / nz) + rnd.uniform(0, .04) + .05 * ((i * 7 + j * 3) % 5) / 5
        boxes.append((g, Vector((x, y, z)), t0, rnd.uniform(46, 60)))
    CHK.append(('призрак/кабина', meshes(ghost), [o for o in meshes(van) if o not in meshes(ghost)]))
    CHK.append(('бус/улица', meshes(van), named('trunk', 'crown', 'bld', 'walk', 'shop')))
    def box_check(t):
        cols_ = {}
        for g, tgt, t0, H in boxes:
            if g.scale.x > .01: cols_.setdefault((round(tgt.x, 3), round(tgt.y, 3)), []).append(g.location.z)
        out = []
        for key, zs in cols_.items():
            zs.sort()
            if any(b - a < C * .94 for a, b in zip(zs, zs[1:])): out.append('коробки в колонне %s' % (key,))
        return out
    CHK_FN.append(box_check)
    ringm = mat('shock', TEAL, .5, emit=6, alpha=.8)
    shock = torus('shock', 1.0, .05, ringm, (0, 0, 1.2))
    badge(4.6)
    hud('НЕ ХВАТАЕТ\nТОЛЬКО ТЕБЯ', .56, .1, 'w', 5.2, None, plate='dark')
    hud('6500–8000 zł', -.2, .12, 't', 6.0, None, plate='dark')
    hud('на руки · пн–пт · опыт не нужен', -.32, .04, 'w', 6.2, None, plate='dark')
    cta(6.9)
    TS = 4.55
    def apply(t):
        for g, tgt, t0, H in boxes:
            k = seg(t, t0, t0 + 1.0)
            fall = (1 - k) ** 2.2                      # быстро сверху, мягкая посадка
            sq = .06 * math.sin(seg(t, t0 + 1.0, t0 + 1.22) * math.pi)   # лёгкое «приседание» при посадке
            g.location = (tgt.x, tgt.y, tgt.z + 52.0 * fall)
            s = 1.0 if t < TS else 0.0
            if TS - .12 < t < TS: s = 1 + .25 * seg(t, TS - .12, TS)
            g.scale = (s, s, s * (1 - sq))
        vs = 0.0 if t < TS else 1 + .07 * (1 - eout(seg(t, TS, TS + .35)))
        van.scale = (vs, vs, vs)
        q = seg(t, TS, TS + .7)
        shock.scale = (.01,) * 3 if q <= 0 or q >= 1 else (1 + 9 * eout(q),) * 2 + (1,)
        set_emit(ringm, 6 * (1 - q), .8 * (1 - q))
        g_ = eout(seg(t, TS + .45, TS + 1.1)); ghost.scale = (1, 1, 1) if g_ > 0 else (0, 0, 0)
        set_emit(M['ghost'], (3.0 + 1.6 * math.sin(t * 6.5)) * g_, (.5 + .12 * math.sin(t * 6.5)) * g_)
        # облёт по дуге: высоко сбоку → низко спереди-слева → наезд на пустое кресло
        O = [(0, Vector((100, 17.5, 8.0))), (2.2, Vector((62, 12.5, 4.2))), (4.4, Vector((30, 9.4, 1.75))),
             (5.6, Vector((24, 7.2, 1.7))), (8.0, Vector((19, 5.6, 1.78)))]
        o = hermite(O, t); a = math.radians(o.x)
        imp = .05 * math.exp(-(t - TS) * 7) * math.sin((t - TS) * 60) if t >= TS else 0
        pos = Vector((o.y * math.cos(a), o.y * math.sin(a), o.z + imp)) + hand_noise(t, .012)
        tg = hermite([(0, Vector((0, 0, 3.2))), (3.0, Vector((0, 0, 1.4))), (4.6, Vector((.2, 0, 1.3))), (8.0, Vector((1.25, .42, 1.5)))], t)
        set_cam(pos, tg, hermite([(0, 22.0), (4.4, 28.0), (8.0, 40.0)], t), 0, lerp(4.0, 2.0, seg(t, 4.6, 6.5)), (tg - pos).length)
    return 8.0, apply

# =====================================================================================
# 12 — «ГИГАНТСКИЙ БУС»
# =====================================================================================
def scene12():
    sun(6.5, (-.95, -.02, .38)); render_setup(wstr=1.0, haze=.0045)
    street(-420, 200, 30, 6)
    buildings(-420, 200, 18, 1, 38, 120, 7, depth=40, wmin=18, wmax=34)
    buildings(-420, 200, -18, -1, 38, 120, 8, depth=40, wmin=18, wmax=34)
    rnd = random.Random(12)
    for i in range(22):
        s = 1 if i % 2 else -1
        if s < 0 and 2 < -150 + i * 14 < 44: continue
        tree(-150 + i * 14 + rnd.uniform(-2, 2), s * 16.6, 1.0); lamp_post(-146 + i * 14, s * 15.9, s)
    cols = [(.5, .08, .06), (.08, .16, .4), (.55, .55, .58), (.05, .05, .06), (.6, .5, .1)]
    for i in range(16):
        s = 1 if i % 2 else -1
        cx_ = -60 + i * 7.2 + rnd.uniform(-.8, .8)
        if s < 0 and 2 < cx_ < 40: continue
        car(cx_, s * 13.6, 0 if s > 0 else math.pi, rnd.choice(cols))
    v = make_van(); van = v['root']; van.scale = (10, 10, 10)
    CHK.append(('великан/улица', meshes(van), named('cbody', 'ccab', 'cw', 'trunk', 'crown', 'pole', 'arm', 'head', 'bld', 'shop', 'parapet', 'walk')))
    badge(4.4)
    hud('НАМ ОЧЕНЬ\nНУЖЕН ВОДИТЕЛЬ', .56, .095, 'w', 4.7, None, plate='dark')
    hud('6500–8000 zł', -.2, .12, 't', 5.7, None, plate='dark')
    hud('на руки · пн–пт · бус 2020+', -.32, .04, 'w', 5.9, None, plate='dark')
    cta(6.7)
    X0, X1, TSTOP = -330.0, -24.0, 4.2
    def apply(t):
        k = seg(t, 0, TSTOP); e = 1 - pow(1 - k, 2.4)
        x = lerp(X0, X1, e)
        speed = (X1 - X0) / TSTOP * 2.4 * pow(1 - k, 1.4) if k < 1 else 0
        dip = .012 * math.sin(seg(t, TSTOP, TSTOP + .9) * math.pi * 3) * (1 - seg(t, TSTOP, TSTOP + .9))
        van.location = (x, 0, 0); van.rotation_euler = (0, dip * 2.2, 0)
        for w in v['wheels']: w.rotation_euler = (math.pi / 2, -x / 3.7, 0)
        v['door'].location.x = .12 - 1.3 * eio(seg(t, 4.7, 6.0))
        sh = min(1.0, speed / 150) * .09 + .06 * (1 - seg(t, TSTOP, TSTOP + .5)) * (1 if t >= TSTOP else 0)
        jx, jz = sh * math.sin(t * 47), sh * math.sin(t * 61 + 1)
        pos = hermite([(0, Vector((14, -14.9, 1.5))), (3.0, Vector((18, -14.7, 1.6))), (5.0, Vector((22, -14.6, 1.7))),
                       (8.0, Vector((25.5, -14.9, 1.9)))], t) + hand_noise(t, .012) + Vector((jx, 0, jz))
        # сначала обычная улица на уровне глаз → взгляд уезжает вверх на великана → на открывающуюся дверь
        tg = hermite([(0, Vector((-30, -9, 1.6))), (1.1, Vector((-55, -4, 5))), (2.4, Vector((-60, -1, 15))),
                      (4.4, Vector((-10, -4, 12))), (6.2, Vector((-16, -8, 13.5))), (8.0, Vector((-17, -8, 13.5)))], t)
        set_cam(pos, tg, hermite([(0, 24.0), (2.4, 18.0), (4.4, 15.0), (8.0, 14.5)], t), .012 * math.sin(t * 1.3))
    return 8.0, apply

# =====================================================================================
# 13 — «ЛОВИ КЛЮЧИ»
# =====================================================================================
def scene13():
    sun(6, (.95, .03, .32)); render_setup(wstr=1.0, haze=.0025)
    street(-60, 160); buildings(-60, 160, 11, 1, 14, 36, 13); buildings(-60, 160, -11, -1, 14, 36, 14)
    for i in range(12): tree(-40 + i * 17, 8.2 * (1 if i % 2 else -1), .9)
    v = make_van(); van = v['root']; van.location = (11.5, 2.4, 0); van.rotation_euler = (0, 0, math.radians(197))
    thrower = make_figure(M['clay'], 'stand', None, courier=False)
    thrower.location = (8.2, .2, 0); thrower.rotation_euler = (0, 0, math.pi)
    # ключи: кольцо, ключ, брелок-бирка
    keys = empty('keys')
    kr = torus('kring', .02, .0028, M['metal'], (0, 0, 0), keys); kr.rotation_euler = (math.pi / 2, 0, 0)
    box('khead', .034, .012, .056, M['dark'], (-.03, 0, -.045), keys, .004, rot=(0, .5, 0))
    box('kblade', .008, .003, .05, M['metal'], (-.058, 0, -.087), keys, 0, rot=(0, .5, 0))
    tag = empty('tag', (.012, 0, -.075), keys)
    box('tagb', .078, .006, .118, M['teal_m'], (0, 0, 0), tag, .004)
    cyl('taghole', .006, .008, M['dark'], (0, 0, .048), tag, 'y', 12)
    text('tagt', '6500–\n8000', .021, M['graph'], (0, -.0038, -.002), (math.pi / 2, 0, 0), tag, 'CENTER', .0004)
    text('tagz', 'zł на руки', .0105, M['graph'], (0, -.0038, -.04), (math.pi / 2, 0, 0), tag, 'CENTER', .0004)
    # рука в перчатке: ладонь к камере
    hand = empty('hand')
    box('palm', .1, .034, .105, M['graph'], (0, 0, 0), hand, .012)
    box('cuff', .104, .05, .045, M['teal_m'], (0, 0, -.078), hand, .01)
    box('arm', .09, .06, .5, M['graph'], (0, .004, -.35), hand, .02)
    fingers = []
    for i, fx in enumerate((-.037, -.0125, .0125, .037)):
        h_ = empty('fh', (fx, 0, .054), hand)
        box('fin', .021, .024, (.07, .08, .075, .06)[i], M['graph'], (0, 0, (.035, .04, .0375, .03)[i]), h_, .008)
        fingers.append(h_)
    th = empty('th', (.052, 0, -.02), hand); th.rotation_euler = (0, .7, 0)
    box('thumb', .022, .024, .065, M['graph'], (0, 0, .03), th, .008)
    CHK.append(('ключи/рука', meshes(keys), meshes(hand)))
    CHK.append(('ключи/мир', meshes(keys), meshes(van) + meshes(thrower) + named('asphalt')))
    CHK.append(('рука/мир', meshes(hand), meshes(van) + meshes(thrower)))
    badge(3.6)
    hud('ЛОВИ!', .5, .15, 'w', .7, 3.2, plate='dark')
    hud('БУС 2020+ · ПН–ПТ\nВ 15:00 СВОБОДЕН', .58, .07, 'w', 4.3, None, plate='dark')
    hud('Опыт не нужен — научим', .44, .045, 'w', 5.0, None, plate='dark')
    cta(5.6)
    CAM = Vector((0, 0, 1.62)); P0 = Vector((7.6, .15, 2.3)); TC = 3.3; KLOC = Vector((0, -.037, .03))
    def hand_pose(t):
        up = eout(seg(t, 2.3, 3.1)); lift = eio(seg(t, 3.5, 4.5))
        rest = Vector((.52, -.06, 1.3)); show = Vector((.43, -.01, 1.56))
        p = Vector((.42, -.1, .9)).lerp(rest, up).lerp(show, lift)
        hit = seg(t, TC, TC + .5); p.z -= .045 * math.sin(hit * math.pi) * (1 - hit)
        # ладонь вверх (ловит ключи сверху) → разворот ладонью к камере
        a_ = math.radians(lerp(18, 80, lift)); c_, s_ = math.cos(a_), math.sin(a_)
        R = Matrix(((0, s_, c_), (-1, 0, 0), (0, -c_, s_)))      # столбцы: X=(0,-1,0), Y=(s,0,-c), Z=пальцы=(c,0,s)
        return p, R.to_euler('XYZ')
    def apply(t):
        p, e = hand_pose(t)
        # перевод фокуса: бус вдалеке → ключи летят → рука с брелоком у камеры
        kd = (keys.matrix_world.translation - CAM).length if t > .6 else 8.0
        foc = lerp(8.0, max(.3, kd), eio(seg(t, .5, 1.3)))
        set_cam(CAM + hand_noise(t, .006) + Vector((-.05 * eio(seg(t, 0, 3)), 0, 0)),
                (6, .3, 1.5 - .12 * eio(seg(t, 3.5, 4.5))), hermite([(0, 20.0), (3.3, 23.0), (4.6, 27.0), (7, 28.0)], t),
                0, 2.0, foc)
        hand.location = p; hand.rotation_euler = e
        curl = lerp(.15, .5, eout(seg(t, TC, TC + .25)))
        for f in fingers: f.rotation_euler = (curl, 0, 0)
        bpy.context.view_layer.update()
        if t < TC:
            k = seg(t, .55, TC)
            ke = k * (2 - k) * .55 + k * .45                # быстрый старт, «зависание» у камеры
            pc, ec = hand_pose(TC)
            Mh = Matrix.Translation(pc) @ ec.to_matrix().to_4x4()
            end = Mh @ KLOC                                  # ровно то место на ладони, где ключи останутся
            # подлёт к ладони со стороны её «лица» (по нормали), чтобы не задеть пальцы
            nrm = (Mh.to_3x3() @ Vector((0, -1, 0))).normalized()
            pos = P0.lerp(end, ke) + nrm * (.25 * (1 - ke) ** .3); pos.z += 1.5 * math.sin(ke * math.pi) * (1 - ke) ** .5
            if k <= 0: pos = P0 + Vector((0, 0, -.9))
            keys.parent = None
            keys.location = pos
            sp = max(0.0, 1 - ke / .82) * 9      # к ладони ключи подлетают уже ровно, без вращения
            q_spin = Euler((sp * 1.3, sp * .7, sp), 'XYZ').to_quaternion()
            q = (ec.to_quaternion() @ q_spin)
            keys.rotation_euler = q.to_euler()
            s = 1.0 if k > 0 else 0.0
            keys.scale = (s, s, s)
        else:
            keys.parent = hand; keys.scale = (1, 1, 1)
            sw = .35 * math.sin((t - TC) * 9) * math.exp(-(t - TC) * 3)
            keys.location = KLOC; keys.rotation_euler = (0, sw, 0)   # качаются только в плоскости ладони
        arm = eio(seg(t, .2, .6)) - eio(seg(t, .6, 1.3))
        thrower.rotation_euler = (0, -.25 * arm, math.pi)
    return 7.0, apply

# =====================================================================================
# 14 — «ОДИН ДЕНЬ ЗА 12 СЕКУНД» (пять планов «с телефона», жёсткие склейки, часы на экране)
# =====================================================================================
def cargo_shell(x0, parcels=True):
    """Бус с открытым кузовом (нос в +X): пол, борта, крыша, распашные задние двери на петлях."""
    r = empty('shell', (x0, 0, 0)); W, D = M['paint'], M['dark']
    box('sfloor', 3.5, 1.9, .06, M['mid'], (-.9, 0, .55), r, 0)
    for s in (1, -1): box('swall', 3.5, .05, 1.8, W, (-.9, s * .975, 1.48), r, 0)
    box('sroof', 3.5, 2.0, .05, W, (-.9, 0, 2.405), r, 0)
    box('sbulk', .05, 1.9, 1.8, M['light'], (.825, 0, 1.48), r, 0)
    box('scab', 1.9, 2.0, 1.3, W, (1.8, 0, 1.2), r, .1)
    box('sskirt', 5.3, 2.02, .14, D, (-.02, 0, .45), r, .03)
    box('sstripe', 3.5, .01, .09, M['teal'], (-.9, -1.006, .72), r, 0)
    for wx in (1.8, -1.55):
        for s in (1, -1): cyl('wheel', .37, .26, D, (wx, s * .9, .37), r, 'y')
    doors = []
    for s in (1, -1):
        h = empty('hinge', (-2.66, s * .975, 0), r)
        box('sdoor', .04, .94, 1.8, W, (-.03, -s * .48, 1.48), h, .01)
        doors.append((h, s))
    if parcels:
        for ix in range(3):
            for iy in (-.6, 0, .6):
                for iz in range(3):
                    b = box('pcl', .42, .5, .36, M['white'], (.45 - ix * .5, iy, .77 + iz * .37), r, .012)
                    box('tape', .422, .06, .362, M['teal_m'], (0, 0, 0), b, 0)
    return r, doors

def set_doors(doors, k):
    """k = 1 — распахнуты на 115°, k = 0 — закрыты."""
    for h, s in doors: h.rotation_euler = (0, 0, -s * math.radians(115) * k)

def no_parcel(fig):
    for d in _desc(fig):
        if d.name.split('.')[0] in ('parcel', 'tape'): d.scale = (0, 0, 0); d.hide_render = True

def scene14():
    sn = sun(5, (.6, -.55, -.32)); render_setup(wstr=1.0, haze=.002)
    bg = MAIN_WORLD.node_tree.nodes['Background'].inputs[1]
    X = [0, 300, 600, 900, 1200]; T = [0, 2.2, 4.6, 7.2, 9.4, 12.0]
    # --- план 1: 05:30, темно, бус у бордюра, водитель с кофе
    street(-60, 60); buildings(-60, 60, 10, 1, 12, 26, 1, night=True); buildings(-60, 60, -10, -1, 12, 26, 2, night=True)
    v1 = make_van('van1'); v1['root'].location = (0, 4.9, 0)
    c1 = make_figure(M['clay'], 'stand', None, True); no_parcel(c1)
    c1.location = (3.9, 7.4, .16); c1.rotation_euler = (0, 0, math.radians(-25))
    cyl('cup', .04, .11, M['white'], (.46, .285, 1.215), c1, 'z', 16)
    lamp_post(1, 8.6, 1, True); light('POINT', 900, (1, 7.3, 5.6), color=(1, .82, .6))
    light('SPOT', 2500, (2.9, 4.9, 1.0), (0, math.radians(84), 0), (1, .95, .85), .3)
    CHK.append(('курьер/бус 1', meshes(c1), meshes(v1['root'])))
    # --- план 2: 06:40, загрузка посылок через задние двери
    street(X[1] - 40, X[1] + 40); buildings(X[1] - 40, X[1] + 40, 10, 1, 10, 20, 3)
    s2, d2 = cargo_shell(X[1]); set_doors(d2, 1)
    c2 = make_figure(M['clay'], 'stand', None, True); no_parcel(c2); c2.location = (X[1] - 3.55, 0, 0)
    p2 = box('parcel2', .36, .44, .3, M['white'], (0, 0, 0), None, .015); box('tape', .362, .06, .302, M['teal_m'], (0, 0, 0), p2, 0)
    P2A, P2B = Vector((X[1] - 3.11, 0, 1.13)), Vector((X[1] - 1.05, 0, .745))
    CHK.append(('посылка/кузов 2', [p2], meshes(s2))); CHK.append(('курьер/кузов 2', meshes(c2), meshes(s2)))
    # --- план 3: 10:15, вручение у двери
    box('ground3', 40, 40, .1, M['walk'], (X[2], 0, -.05), None, 0)
    WM = mat('wall3', (.55, .53, .5), .85)
    box('wallL', 6, .3, 6, WM, (X[2] - 3.5, 3, 3), None, 0); box('wallR', 6, .3, 6, WM, (X[2] + 3.5, 3, 3), None, 0)
    box('wallT', 1.0, .3, 3.9, WM, (X[2], 3, 4.05), None, 0)
    box('hall', 3, 3, .05, M['mid'], (X[2], 4.7, 0), None, 0); box('hallback', 3, .1, 2.6, M['light'], (X[2], 6.2, 1.3), None, 0)
    h3 = empty('hinge3', (X[2] - .5, 3, 0)); box('door3', .98, .05, 2.08, M['graph'], (.5, 0, 1.05), h3, .01)
    box('intercom', .12, .03, .2, M['metal'], (X[2] + .8, 2.83, 1.4), None, 0)
    c3 = make_figure(M['clay'], 'stand', None, True); c3.rotation_euler = (0, 0, math.pi / 2)
    cu3 = make_figure(M['clay'], 'stand', None, False); cu3.location = (X[2] + .1, 4.75, .03); cu3.rotation_euler = (0, 0, -math.pi / 2)
    light('POINT', 300, (X[2], 4.6, 2.3), color=(1, .9, .75))
    stat3 = named('wallL', 'wallR', 'wallT', 'door3', 'hall', 'hallback') + meshes(cu3)
    CHK.append(('курьер/дверь 3', meshes(c3) + [o for o in _desc(c3) if o.name.split('.')[0] == 'parcel'], stat3))
    CHK.append(('клиент/дверь 3', meshes(cu3), named('door3', 'wallL', 'wallR', 'wallT')))
    # --- план 4: 14:40, пустой кузов изнутри, двери закрываются
    street(X[3] - 40, X[3] + 40); buildings(X[3] - 40, X[3] + 40, 10, 1, 10, 20, 5); buildings(X[3] - 40, X[3] + 40, -10, -1, 10, 20, 6)
    s4, d4 = cargo_shell(X[3], parcels=False)
    c4 = make_figure(M['clay'], 'stand', None, True); no_parcel(c4); c4.location = (X[3] - 4.3, 0, 0)
    CHK.append(('курьер/двери 4', meshes(c4), meshes(s4)))
    # --- план 5: 15:00, идёт домой, бус остаётся позади
    street(X[4] - 60, X[4] + 90); buildings(X[4] - 60, X[4] + 90, 10, 1, 12, 26, 7); buildings(X[4] - 60, X[4] + 90, -10, -1, 12, 26, 8)
    for i in range(8): tree(X[4] - 20 + i * 13, 9.0, .9)
    v5 = make_van('van5'); v5['root'].location = (X[4] - 1.5, 4.9, 0)
    c5 = make_figure(M['clay'], 'stand', None, True); no_parcel(c5)
    CHK.append(('курьер/бус 5', meshes(c5), meshes(v5['root'])))
    # --- надписи
    hud('КУРЬЕР НА БУСЕ · ВАРШАВА', .8, .056, 'g', .05, None, plate='teal')
    for i, (clock, cap) in enumerate([('05:30', 'кофе — и поехали'), ('06:40', 'загрузил свой район'), ('10:15', 'адрес за адресом'),
                                      ('14:40', 'кузов пустой'), ('15:00', 'ты свободен')]):
        hud(clock, .6, .15, 'w', T[i] + .04, T[i + 1] if i < 4 else None, plate='dark')
        hud(cap, .46, .05, 't', T[i] + .12, T[i + 1] if i < 4 else None, plate='dark')
    hud('6500–8000 zł', -.22, .12, 't', 10.0, None, plate='dark')
    hud('пн–пт · выходные свободны', -.34, .042, 'w', 10.25, None, plate='dark')
    hud('НАПИШИ В WHATSAPP', -.52, .058, 'g', 10.6, None, plate='teal')
    K = [
        [(0.0, (9.6, 9.3, 1.35), (3.6, 6.6, 1.25), 24), (2.2, (7.2, 8.6, 1.5), (3.7, 6.9, 1.35), 26)],
        [(2.2, (X[1] - 5.6, -2.3, 1.55), (X[1] - 2.6, 0, 1.2), 22), (4.6, (X[1] - 4.9, -1.9, 1.5), (X[1] - 2.2, 0, 1.1), 24)],
        [(4.6, (X[2] - 1.7, -2.6, 1.62), (X[2], 2.4, 1.35), 22), (7.2, (X[2] - 1.35, -.9, 1.6), (X[2] + .05, 3.2, 1.4), 24)],
        [(7.2, (X[3] - .35, .08, 1.42), (X[3] - 4.3, 0, 1.4), 15), (9.4, (X[3] - .2, .05, 1.42), (X[3] - 4.3, 0, 1.42), 16)],
        [(9.4, (X[4] + 1.2, 8.0, 1.05), (X[4] + 6.0, 7.5, 1.3), 24), (12.0, (X[4] + 2.6, 7.95, 1.15), (X[4] + 10.5, 7.5, 1.35), 26)],
    ]
    ENV = [(.35, .12, (.5, .6, 1), (.4, -.3, -.5), .9), (2.6, .75, (1, .8, .62), (.85, .35, -.3), .55),
           (5.0, 1.4, (1, .95, .88), (.45, .6, -.6), .5), (5.0, 1.4, (1, .95, .88), (.8, -.3, -.55), .5),
           (6.0, 1.1, (1, .78, .55), (-.9, .12, -.3), .55)]
    def apply(t):
        i = max(j for j in range(5) if t >= T[j] - 1e-6)
        e, w, c, d, ex = ENV[i]
        sn.data.energy = e; sn.data.color = c; bg.default_value = 1.5 * w
        sn.rotation_euler = Vector(d).normalized().to_track_quat('-Z', 'Y').to_euler()
        sc.view_settings.exposure = ex
        cam_path(t, K[i], amp=.018)
        bob = lambda sp: .018 * abs(math.sin(t * sp))
        # 1: отпивает кофе — лёгкий наклон корпуса
        c1.rotation_euler = (0, -.05 * eio(seg(t, .5, 1.1)) + .05 * eio(seg(t, 1.3, 1.9)), math.radians(-25))
        # 2: посылка из рук — в кузов
        k = eio(seg(t, 2.9, 3.9))
        p2.location = P2A.lerp(P2B, k) + Vector((0, 0, .14 * math.sin(math.pi * k)))
        # 3: курьер подходит, дверь открывается
        k3 = eio(seg(t, 4.6, 6.3))
        c3.location = (X[2], lerp(-.6, 2.25, k3), bob(9) * (1 - seg(t, 6.0, 6.3)))
        h3.rotation_euler = (0, 0, math.radians(85) * eio(seg(t, 5.1, 5.85)))
        # 4: двери закрываются по очереди, внутри темнеет
        k4a, k4b = 1 - eio(seg(t, 7.7, 8.4)), 1 - eio(seg(t, 8.5, 9.2))
        for (h, s), kk in zip(d4, (k4a, k4b)): h.rotation_euler = (0, 0, -s * math.radians(115) * kk)
        if i == 3: bg.default_value = 1.5 * w * (.25 + .75 * (k4a + k4b) / 2)
        # 5: идёт домой
        c5.location = (X[4] + lerp(3.6, 8.2, seg(t, 9.4, 12.0)), 7.5, .16 + bob(9))
    return 12.0, apply

# ---------------- проверка столкновений (ADS_CHECK=1 — без рендера) ----------------
from mathutils.bvhtree import BVHTree
def meshes(objs):
    out = []
    for o in (objs if isinstance(objs, (list, tuple)) else [objs]):
        for d in _desc(o):
            if d.type == 'MESH' and d.name.split('.')[0] not in ('tape', 'trim', 'zip', 'cap', 'visor', 'hub', 'arch'): out.append(d)
    return out
def named(*pref):
    return [o for o in col.all_objects if o.type == 'MESH' and o.name.split('.')[0] in pref]
def _aabb(o):
    mw = o.matrix_world; pts = [mw @ Vector(c) for c in o.bound_box]
    return (Vector((min(p.x for p in pts), min(p.y for p in pts), min(p.z for p in pts))),
            Vector((max(p.x for p in pts), max(p.y for p in pts), max(p.z for p in pts))))
def _bvh(o, dg):
    oe = o.evaluated_get(dg); me = oe.to_mesh(); mw = oe.matrix_world
    tr = BVHTree.FromPolygons([mw @ v.co for v in me.vertices], [tuple(p.vertices) for p in me.polygons])
    oe.to_mesh_clear(); return tr
def run_checks(t):
    hits = []; dg = bpy.context.evaluated_depsgraph_get(); cache = {}
    def bvh(o):
        if o.name not in cache: cache[o.name] = _bvh(o, dg)
        return cache[o.name]
    for label, A, B in CHK:
        ba = [(o, _aabb(o)) for o in A if o.scale.length > .01 and o.matrix_world.to_scale().length > .01]
        bb = [(o, _aabb(o)) for o in B if o.matrix_world.to_scale().length > .01]
        for oa, (a0, a1) in ba:
            for ob, (b0, b1) in bb:
                if oa is ob: continue
                if a1.x < b0.x or b1.x < a0.x or a1.y < b0.y or b1.y < a0.y or a1.z < b0.z or b1.z < a0.z: continue
                if bvh(oa).overlap(bvh(ob)): hits.append('%s: %s × %s' % (label, oa.name, ob.name))
    cp = cam.matrix_world.translation
    for o in col.all_objects:
        if o.type != 'MESH' or o.hide_render or o.matrix_world.to_scale().length < .01: continue
        a0, a1 = _aabb(o); m = CAM_MARGIN
        if not (a0.x - m < cp.x < a1.x + m and a0.y - m < cp.y < a1.y + m and a0.z - m < cp.z < a1.z + m): continue
        r = bvh(o).find_nearest(cp)
        if r[0] is not None and r[3] < CAM_MARGIN: hits.append('КАМЕРА %.0f мм от %s' % (r[3] * 1000, o.name))
    for fn in CHK_FN: hits += fn(t)
    return hits

# ---------------- запуск ----------------
DUR, APPLY = {8: scene8, 9: scene9, 10: scene10, 11: scene11, 12: scene12, 13: scene13, 14: scene14}[SCENE]()
N = int(DUR * FPS)
os.makedirs(OUT, exist_ok=True)
for o in _desc(HUD):
    for c in list(o.users_collection): c.objects.unlink(o)
    hudc.objects.link(o)
HAS_HUD = (not NOTEXT) and len(HUDS) > 0
if os.environ.get('ADS_CHECK'):
    total = 0; seen = {}
    for f in range(N):
        t = f / FPS; APPLY(t); bpy.context.view_layer.update()
        for h in run_checks(t):
            total += 1
            if h.split(' от ')[-1] not in seen: seen[h.split(' от ')[-1]] = 1; print('HIT t=%.2f %s' % (t, h))
    print('CHECK_TOTAL', SCENE, total); sys.exit(0)
for f in range(N):
    if f % NMOD != KMOD: continue
    t = f / FPS
    APPLY(t); apply_hud(t)
    hudc.hide_render = True; col.hide_render = False
    sc.world = MAIN_WORLD; sc.render.film_transparent = False; sc.eevee.taa_render_samples = SAMPLES
    sc.render.image_settings.color_mode = 'RGB'
    sc.render.filepath = os.path.join(OUT, 'f%04d.png' % f)
    bpy.ops.render.render(write_still=True)
    if HAS_HUD:
        dof = camd.dof.use_dof; camd.dof.use_dof = False
        hudc.hide_render = False; col.hide_render = True
        sc.world = HUD_WORLD; sc.render.film_transparent = True; sc.eevee.taa_render_samples = 4
        sc.render.image_settings.color_mode = 'RGBA'
        sc.render.filepath = os.path.join(OUT, 'h%04d.png' % f)
        bpy.ops.render.render(write_still=True)
        camd.dof.use_dof = dof
print('ADS_PREVIZ_DONE', SCENE, N)
