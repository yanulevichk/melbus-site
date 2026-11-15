"""
Проверка превиза на столкновения (запуск: blender -b previz.blend -P tools/blender/check_collisions.py -- [шаг])
Ищет кадры, где:
  1) камера входит внутрь какого-либо предмета (с запасом 6 см);
  2) коробка MELBUS пересекается с бусом (кузов, двери, пандус кроме случаев «внутри кузова»), стенами, домами, деревьями, мебелью;
  3) летящие вещи пересекаются со стенами комнат и с бусом;
  4) вещи пересекаются друг с другом (по деталям) и со стенками коробки.
В конце — справка: где камера ближе 15 см к чему-либо (кроме дороги и газона).
Пересечение считается по габаритным коробкам (AABB) отдельных деталей — грубо, но надёжно для превиза.
"""
import bpy, sys
from mathutils import Vector

argv = sys.argv[sys.argv.index('--') + 1:] if '--' in sys.argv else []
STEP = int(argv[0]) if argv else 2
sc = bpy.context.scene
cam = sc.camera

def root_of(o):
    while o.parent: o = o.parent
    return o

def aabb(o, deps):
    ev = o.evaluated_get(deps)
    pts = [ev.matrix_world @ Vector(c) for c in ev.bound_box]
    mn = Vector((min(p.x for p in pts), min(p.y for p in pts), min(p.z for p in pts)))
    mx = Vector((max(p.x for p in pts), max(p.y for p in pts), max(p.z for p in pts)))
    return mn, mx

def overlap(a, b, pad=0.0):
    return all(a[0][i] < b[1][i] - pad and a[1][i] > b[0][i] + pad for i in range(3))

def inside(p, box, pad):
    return all(box[0][i] - pad < p[i] < box[1][i] + pad for i in range(3))

meshes = [o for o in sc.objects if o.type == 'MESH']
def group(o):
    r = root_of(o).name
    if r == 'box': return 'box'
    if r.startswith('it_'): return 'item'
    if r == 'van': return 'van'
    if r in ('roomA', 'roomB'): return 'room'
    return 'world'

problems = []
near = {}
for f in range(sc.frame_start, sc.frame_end + 1, STEP):
    sc.frame_set(f)
    deps = bpy.context.evaluated_depsgraph_get()
    boxes = {}
    for o in meshes:
        s = o.evaluated_get(deps).matrix_world.to_scale()
        if min(abs(s.x), abs(s.y), abs(s.z)) < 0.02:   # спрятанные (масштаб ~0)
            continue
        boxes[o.name] = (group(o), aabb(o, deps))
    cp = cam.evaluated_get(deps).matrix_world.translation
    # 1) камера внутри предмета
    for n, (g, bb) in boxes.items():
        if n in ('road', 'walk_front', 'walk_back', 'lawn_B', 'lawn_front') or n.startswith('dash'):
            continue
        if inside(cp, bb, 0.06):
            problems.append((f, 'камера', n))
    for n, (g, bb) in boxes.items():
        if n.startswith(('road', 'walk', 'dash', 'lawn')): continue
        d = max(max(bb[0][i] - cp[i], cp[i] - bb[1][i], 0) for i in range(3))
        if d < .15: near.setdefault(n.split('.')[0], []).append((f, d))
    # 2) коробка
    box_parts = [(n, bb) for n, (g, bb) in boxes.items() if g == 'box' and not n.startswith('roll') and not n.startswith('tape')]
    for n, (g, bb) in boxes.items():
        if g in ('box', 'item') or n.startswith(('road', 'walk', 'dash', 'lawn', 'roomA_floor', 'roomB_floor', 'roomA_plinth', 'roomB_plinth')):
            continue
        if g == 'van' and n.startswith(('van_floor', 'van_inner', 'van_ramp', 'van_rail', 'van_cross', 'van_chassis')):
            continue
        for bn, bb2 in box_parts:
            if overlap(bb, bb2, 0.02):
                problems.append((f, 'коробка:' + bn, n)); break
    # 3) летящие вещи против стен и буса
    for n, (g, bb) in boxes.items():
        if g != 'item': continue
        for n2, (g2, bb2) in boxes.items():
            if g2 in ('van',) or (g2 == 'room' and ('_wb' in n2 or '_wl' in n2)):
                if overlap(bb, bb2, 0.02):
                    problems.append((f, 'вещь:' + n, n2)); break

    # 4) вещи между собой (по деталям, разные предметы) и со стенками коробки
    parts = [(n, root_of(bpy.data.objects[n]).name, bb) for n, (g, bb) in boxes.items() if g == 'item']
    for a in range(len(parts)):
        na, ra, ba = parts[a]
        for b in range(a + 1, len(parts)):
            nb, rb, bb_ = parts[b]
            if ra != rb and overlap(ba, bb_, 0.02):
                problems.append((f, 'вещь:' + ra, rb)); break
        for bn, bb2 in box_parts:
            if overlap(ba, bb2, 0.02):
                problems.append((f, 'вещь:' + ra, 'коробка_' + bn)); break

# свернуть в интервалы
from collections import defaultdict
runs = defaultdict(list)
for f, a, b in problems: runs[(a.split(':')[0] + ':' + (a.split(':')[1].split('.')[0] if ':' in a else ''), b.split('.')[0])].append(f)
print('=== COLLISIONS ===')
for (a, b), fs in sorted(runs.items(), key=lambda x: x[1][0]):
    print(f'{a:28s} x {b:22s} кадры {fs[0]}–{fs[-1]} ({fs[0]/24:.2f}–{fs[-1]/24:.2f} с), n={len(fs)}')
print('=== TOTAL', len(problems), '===')
print('--- камера ближе 15 см (для справки) ---')
for n, v in sorted(near.items(), key=lambda x: x[1][0][0]):
    print(f'{n:22s} {v[0][0]/24:.2f}–{v[-1][0]/24:.2f} с, минимум {min(d for _, d in v)*100:.0f} см')
