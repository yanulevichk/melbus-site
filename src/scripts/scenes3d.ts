/**
 * 3D-СЦЕНЫ MELBUS (three.js, грузится лениво — только когда сцена рядом с экраном).
 *
 *  hero — квартира-диорама: сканируем по видео → вещи превращаются в белые коробки →
 *         коробки уезжают в бусе → в новой квартире снова становятся мебелью.
 *  box  — плоская заготовка складывается в фирменную коробку, клеится бирюзовый скотч,
 *         появляется наклейка комнаты (цвет + номер + QR).
 *
 * Каждая сцена — чистая функция от прогресса p ∈ [0..1]: её можно крутить скроллом
 * в обе стороны или проигрывать по времени (на телефоне).
 */
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

export interface SceneApi { setProgress(p: number): void; destroy(): void }

/* ---------- палитра и математика ---------- */
const C = {
  graphite: 0x10161d, graphite2: 0x26303b, steel: 0x8f9aa7, silver: 0xdce1e7,
  paper: 0xf4f6f8, white: 0xffffff, teal: 0x14dcd5, tealDeep: 0x077e79, wall: 0xeef1f4,
};
/** hex задан в sRGB (как в макетах) → линейный цвет для расчёта света */
const col = (hex: number) => new THREE.Color(hex).convertSRGBToLinear();
const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
const seg = (p: number, a: number, b: number) => clamp01((p - a) / (b - a));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const eio = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const eout = (t: number) => 1 - Math.pow(1 - t, 3);
const ein = (t: number) => t * t * t;
const eback = (t: number) => { const c1 = 1.70158, c3 = c1 + 1; return t <= 0 ? 0 : 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2); };

/* ---------- материалы и геометрии с кэшем ---------- */
const mats = new Map<string, THREE.Material>();
function mat(color: number, o: { rough?: number; metal?: number; emissive?: number; ei?: number; env?: number } = {}) {
  const k = `${color}-${o.rough}-${o.metal}-${o.emissive}-${o.ei}-${o.env}`;
  let m = mats.get(k) as THREE.MeshStandardMaterial | undefined;
  if (!m) {
    m = new THREE.MeshStandardMaterial({ color: col(color), roughness: o.rough ?? 0.72, metalness: o.metal ?? 0, envMapIntensity: o.env ?? 0.5 });
    if (o.emissive != null) { m.emissive = col(o.emissive); m.emissiveIntensity = o.ei ?? 1; }
    mats.set(k, m);
  }
  return m;
}
const geos = new Map<string, THREE.BufferGeometry>();
function rbox(w: number, h: number, d: number, r = 0.05) {
  const k = `${w}|${h}|${d}|${r}`;
  let g = geos.get(k);
  if (!g) { g = r > 0 ? new RoundedBoxGeometry(w, h, d, 3, Math.min(r, w / 2, h / 2, d / 2)) : new THREE.BoxGeometry(w, h, d); geos.set(k, g); }
  return g;
}
/** деталь: y — низ детали */
function part(parent: THREE.Object3D, w: number, h: number, d: number, m: THREE.Material, x = 0, y = 0, z = 0, r = 0.04) {
  const mesh = new THREE.Mesh(rbox(w, h, d, r), m);
  mesh.position.set(x, y + h / 2, z);
  mesh.castShadow = true; mesh.receiveShadow = true;
  parent.add(mesh);
  return mesh;
}

/* ---------- текстуры: логотип и наклейка комнаты ---------- */
function loadImg(src: string) {
  return new Promise<HTMLImageElement>((res, rej) => { const i = new Image(); i.decoding = 'async'; i.onload = () => res(i); i.onerror = rej; i.src = src; });
}
function canvasTex(w: number, h: number, draw: (c: CanvasRenderingContext2D) => void) {
  const cv = document.createElement('canvas'); cv.width = w; cv.height = h;
  draw(cv.getContext('2d')!);
  const t = new THREE.CanvasTexture(cv);
  t.encoding = THREE.sRGBEncoding; t.anisotropy = 8;
  return t;
}
const LOGO_RATIO = 460.6 / 100;
function logoTexture(onReady: () => void) {
  const W = 1024, H = Math.round(W / LOGO_RATIO);
  const cv = document.createElement('canvas'); cv.width = W; cv.height = H;
  const t = new THREE.CanvasTexture(cv);
  t.encoding = THREE.sRGBEncoding; t.anisotropy = 8;
  loadImg('/brand/melbus-light.svg').then((img) => { cv.getContext('2d')!.drawImage(img, 0, 0, W, H); t.needsUpdate = true; onReady(); }).catch(() => {});
  return t;
}
/** «QR» — декоративный узор с тремя опорными квадратами */
function drawQr(c: CanvasRenderingContext2D, x: number, y: number, s: number, seed = 7) {
  const n = 25, m = s / n;
  let r = seed;
  const rnd = () => ((r = (r * 9301 + 49297) % 233280) / 233280);
  c.fillStyle = '#10161D';
  for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) {
    const inFinder = (i < 8 && j < 8) || (i > n - 9 && j < 8) || (i < 8 && j > n - 9);
    if (!inFinder && rnd() > 0.52) c.fillRect(x + i * m, y + j * m, m + 0.5, m + 0.5);
  }
  const finder = (fx: number, fy: number) => {
    c.fillRect(x + fx * m, y + fy * m, 7 * m, 7 * m);
    c.fillStyle = '#FFFFFF'; c.fillRect(x + (fx + 1) * m, y + (fy + 1) * m, 5 * m, 5 * m);
    c.fillStyle = '#10161D'; c.fillRect(x + (fx + 2) * m, y + (fy + 2) * m, 3 * m, 3 * m);
  };
  finder(0, 0); finder(n - 7, 0); finder(0, n - 7);
}
function stickerTexture(room: string, num: string, top = 'КОМНАТА', mid = 'КОРОБКА') {
  return canvasTex(640, 400, (c) => {
    c.fillStyle = '#FFFFFF'; c.beginPath(); (c as any).roundRect ? (c as any).roundRect(0, 0, 640, 400, 28) : c.rect(0, 0, 640, 400); c.fill();
    c.fillStyle = '#14DCD5'; c.fillRect(0, 0, 56, 400);
    c.fillStyle = '#10161D';
    c.font = '600 30px "Onest Variable", system-ui, sans-serif';
    c.fillText(top, 92, 78);
    c.font = '700 64px "Unbounded Variable", "Arial Black", sans-serif';
    c.fillText(room, 92, 152);
    c.font = '600 30px "Onest Variable", system-ui, sans-serif';
    c.fillStyle = '#5B6673'; c.fillText(mid, 92, 250);
    c.fillStyle = '#10161D'; c.font = '700 110px "Unbounded Variable", "Arial Black", sans-serif';
    c.fillText(num, 88, 360);
    drawQr(c, 400, 150, 210);
  });
}

/* ---------- сцена: рендерер, камера, свет, рендер по требованию ---------- */
function makeStage(host: HTMLElement, o: { shadows?: boolean; persp?: boolean }) {
  const mobile = window.innerWidth < 768;
  const canvas = document.createElement('canvas');
  canvas.className = 's3d__canvas';
  canvas.setAttribute('aria-hidden', 'true');
  host.appendChild(canvas);
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, mobile ? 1.6 : 1.75));
  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 0.95;
  renderer.shadowMap.enabled = o.shadows !== false;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  const scene = new THREE.Scene();
  const pmrem = new THREE.PMREMGenerator(renderer);
  const env = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environment = env;

  const hemi = new THREE.HemisphereLight(0xffffff, 0x3a4450, 0.3);
  scene.add(hemi);
  const sun = new THREE.DirectionalLight(0xffffff, 1.7);
  sun.position.set(-6, 14, 9);
  sun.castShadow = true;
  sun.shadow.mapSize.set(mobile ? 1024 : 2048, mobile ? 1024 : 2048);
  sun.shadow.camera.left = -14; sun.shadow.camera.right = 14; sun.shadow.camera.top = 14; sun.shadow.camera.bottom = -14;
  sun.shadow.camera.near = 1; sun.shadow.camera.far = 50;
  sun.shadow.bias = -0.0004; sun.shadow.normalBias = 0.02;
  scene.add(sun, sun.target);

  const camera: THREE.OrthographicCamera | THREE.PerspectiveCamera = o.persp
    ? new THREE.PerspectiveCamera(30, 1, 0.1, 200)
    : new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 200);

  let w = 1, h = 1, dirty = true, visible = false, raf = 0;
  const onResize: (() => void)[] = [];
  const resize = () => {
    const r = host.getBoundingClientRect();
    w = Math.max(1, r.width); h = Math.max(1, r.height);
    renderer.setSize(w, h, false);
    onResize.forEach((f) => f());
    dirty = true; kick();
  };
  const loop = () => {
    raf = 0;
    if (!visible || !dirty) return;
    dirty = false;
    renderer.render(scene, camera);
  };
  const kick = () => { if (!raf) raf = requestAnimationFrame(loop); };
  const ro = new ResizeObserver(resize); ro.observe(host);
  const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (visible) { dirty = true; kick(); } });
  io.observe(host);
  resize();

  return {
    scene, camera, renderer, sun, mobile,
    get aspect() { return w / h; },
    onResize: (f: () => void) => { onResize.push(f); f(); },
    invalidate: () => { dirty = true; kick(); },
    ready: () => host.classList.add('is-ready'),
    destroy: () => {
      cancelAnimationFrame(raf); ro.disconnect(); io.disconnect();
      scene.traverse((ob) => { const m = ob as THREE.Mesh; if (m.isMesh) { /* общие геометрии/материалы чистим ниже */ } });
      env.dispose(); pmrem.dispose(); renderer.dispose(); canvas.remove();
    },
  };
}

/** изометрическая камера, смотрит вдоль (1,1,1) как знак MELBUS */
function isoFrame(cam: THREE.OrthographicCamera, aspect: number, viewW: number, viewH: number, target: THREE.Vector3, az = 0, shiftX = 0) {
  const halfH = Math.max(viewH, viewW / aspect) / 2;
  cam.left = -halfH * aspect - shiftX; cam.right = halfH * aspect - shiftX; cam.top = halfH; cam.bottom = -halfH;
  const a = Math.PI / 4 + az;
  const dir = new THREE.Vector3(Math.sin(a) * Math.SQRT2, 1, Math.cos(a) * Math.SQRT2).normalize();
  cam.position.copy(target).addScaledVector(dir, 40);
  cam.lookAt(target);
  cam.updateProjectionMatrix();
}

/* ======================================================================
   МЕБЕЛЬ (низкополигональная, фирменные цвета). Начало координат — пол, фасад смотрит в +z.
   ====================================================================== */
type Maker = () => THREE.Group;
const F: Record<string, Maker> = {
  sofa() {
    const g = new THREE.Group();
    const body = mat(C.graphite2, { rough: 0.9 }), cush = mat(C.steel, { rough: 0.95 });
    part(g, 2.4, 0.42, 0.95, body, 0, 0.06, 0, 0.08);
    part(g, 2.4, 0.66, 0.26, body, 0, 0.06, -0.35, 0.08);
    part(g, 0.24, 0.6, 0.95, body, -1.08, 0.06, 0, 0.08);
    part(g, 0.24, 0.6, 0.95, body, 1.08, 0.06, 0, 0.08);
    part(g, 0.92, 0.16, 0.66, cush, -0.47, 0.48, 0.08, 0.07);
    part(g, 0.92, 0.16, 0.66, cush, 0.47, 0.48, 0.08, 0.07);
    const p = part(g, 0.46, 0.4, 0.14, mat(C.teal, { rough: 0.85 }), 0.62, 0.5, -0.16, 0.07); p.rotation.z = 0.18;
    return g;
  },
  table() {
    const g = new THREE.Group();
    part(g, 1.2, 0.07, 0.66, mat(C.white, { rough: 0.5 }), 0, 0.38, 0, 0.03);
    const leg = mat(C.graphite, { rough: 0.4, metal: 0.4 });
    for (const [x, z] of [[-0.52, -0.25], [0.52, -0.25], [-0.52, 0.25], [0.52, 0.25]]) part(g, 0.05, 0.38, 0.05, leg, x, 0, z, 0);
    part(g, 0.3, 0.12, 0.22, mat(C.tealDeep), 0.2, 0.45, 0.05, 0.03);
    return g;
  },
  rug() {
    const g = new THREE.Group();
    part(g, 2.9, 0.025, 1.9, mat(0x2f3a46, { rough: 1 }), 0, 0, 0, 0.01);
    part(g, 2.6, 0.03, 0.05, mat(C.teal, { rough: 1 }), 0, 0, 0.75, 0);
    part(g, 2.6, 0.03, 0.05, mat(C.teal, { rough: 1 }), 0, 0, -0.75, 0);
    return g;
  },
  armchair() {
    const g = new THREE.Group();
    const b = mat(C.steel, { rough: 0.95 });
    part(g, 0.95, 0.4, 0.9, b, 0, 0.06, 0, 0.08);
    part(g, 0.95, 0.62, 0.22, b, 0, 0.06, -0.34, 0.08);
    part(g, 0.18, 0.5, 0.9, b, -0.39, 0.06, 0, 0.07);
    part(g, 0.18, 0.5, 0.9, b, 0.39, 0.06, 0, 0.07);
    part(g, 0.6, 0.13, 0.64, mat(C.silver, { rough: 0.95 }), 0, 0.46, 0.06, 0.06);
    return g;
  },
  bookcase() {
    const g = new THREE.Group();
    const fr = mat(C.white, { rough: 0.6 });
    part(g, 0.06, 2.0, 0.42, fr, -0.67, 0, 0, 0.01);
    part(g, 0.06, 2.0, 0.42, fr, 0.67, 0, 0, 0.01);
    part(g, 1.4, 2.0, 0.04, mat(C.silver), 0, 0, -0.19, 0);
    const cols = [C.teal, C.graphite2, C.steel, C.tealDeep, C.silver, C.graphite];
    let k = 0;
    for (let s = 0; s < 5; s++) {
      const y = s * 0.48;
      part(g, 1.4, 0.05, 0.42, fr, 0, y, 0, 0.01);
      if (s === 4) break;
      let x = -0.6;
      while (x < 0.5) {
        const bw = 0.07 + ((k * 37) % 5) * 0.025, bh = 0.26 + ((k * 13) % 4) * 0.035;
        part(g, bw, bh, 0.28, mat(cols[k % cols.length], { rough: 0.85 }), x + bw / 2, y + 0.05, 0.02, 0.01);
        x += bw + 0.015; k++;
        if (k % 7 === 3) x += 0.2;
      }
    }
    return g;
  },
  plant() {
    const g = new THREE.Group();
    const pot = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.19, 0.46, 24), mat(C.white, { rough: 0.5 }));
    pot.position.y = 0.23; pot.castShadow = pot.receiveShadow = true; g.add(pot);
    const leafM = new THREE.MeshStandardMaterial({ color: col(C.tealDeep), roughness: 0.8, flatShading: true, envMapIntensity: 0.5 });
    for (const [x, y, z, r] of [[0, 0.95, 0, 0.42], [0.18, 1.25, 0.08, 0.3], [-0.16, 1.18, -0.1, 0.28]]) {
      const l = new THREE.Mesh(new THREE.IcosahedronGeometry(r, 0), leafM);
      l.position.set(x, y, z); l.castShadow = true; g.add(l);
    }
    return g;
  },
  lamp() {
    const g = new THREE.Group();
    const dark = mat(C.graphite, { rough: 0.35, metal: 0.5 });
    const base = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.22, 0.05, 24), dark); base.position.y = 0.025; base.castShadow = true; g.add(base);
    part(g, 0.04, 1.55, 0.04, dark, 0, 0.05, 0, 0);
    const shade = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.32, 0.36, 28, 1, true), new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: col(0xfff4e0), emissiveIntensity: 0.55, side: THREE.DoubleSide, roughness: 0.9 }));
    shade.position.y = 1.62; shade.castShadow = true; g.add(shade);
    return g;
  },
  tv() {
    const g = new THREE.Group();
    part(g, 1.7, 0.42, 0.44, mat(C.white, { rough: 0.55 }), 0, 0.08, 0, 0.04);
    part(g, 1.7, 0.08, 0.44, mat(C.graphite2), 0, 0, 0, 0.02);
    part(g, 1.36, 0.78, 0.05, mat(C.graphite, { rough: 0.25, metal: 0.3 }), 0, 0.62, -0.08, 0.02);
    part(g, 1.28, 0.7, 0.01, mat(0x0d2a2c, { rough: 0.2, emissive: 0x0b4f4c, ei: 0.6 }), 0, 0.66, -0.05, 0);
    return g;
  },
};

/* ---------- ещё мебель для «всё в одну коробку» ---------- */
Object.assign(F, {
  bed() {
    const g = new THREE.Group();
    part(g, 1.8, 0.3, 2.1, mat(C.steel, { rough: 0.8 }), 0, 0.1, 0, 0.05);
    part(g, 1.72, 0.24, 2.0, mat(C.white, { rough: 0.9 }), 0, 0.38, 0.02, 0.08);
    part(g, 1.8, 1.05, 0.12, mat(C.graphite2, { rough: 0.9 }), 0, 0.1, -1.02, 0.05);
    part(g, 0.66, 0.13, 0.38, mat(C.silver, { rough: 0.95 }), -0.42, 0.62, -0.7, 0.06);
    part(g, 0.66, 0.13, 0.38, mat(C.silver, { rough: 0.95 }), 0.42, 0.62, -0.7, 0.06);
    part(g, 1.76, 0.07, 1.2, mat(C.tealDeep, { rough: 0.95 }), 0, 0.6, 0.38, 0.03);
    for (const [x, z] of [[-0.82, -0.96], [0.82, -0.96], [-0.82, 0.96], [0.82, 0.96]]) part(g, 0.08, 0.12, 0.08, mat(C.graphite), x, 0, z, 0);
    return g;
  },
  fridge() {
    const g = new THREE.Group();
    const body = mat(0xe9edf1, { rough: 0.35, metal: 0.25, env: 0.9 });
    part(g, 0.74, 1.95, 0.7, body, 0, 0.04, 0, 0.06);
    part(g, 0.72, 0.012, 0.012, mat(C.steel), 0, 1.25, 0.356, 0);
    part(g, 0.04, 0.42, 0.05, mat(C.graphite, { metal: 0.6, rough: 0.3 }), 0.28, 1.36, 0.37, 0.01);
    part(g, 0.04, 0.62, 0.05, mat(C.graphite, { metal: 0.6, rough: 0.3 }), 0.28, 0.48, 0.37, 0.01);
    return g;
  },
  dining() {
    const g = new THREE.Group();
    part(g, 1.25, 0.06, 0.8, mat(C.white, { rough: 0.45 }), 0, 0.72, 0, 0.02);
    const leg = mat(C.graphite, { rough: 0.4, metal: 0.4 });
    for (const [x, z] of [[-0.55, -0.33], [0.55, -0.33], [-0.55, 0.33], [0.55, 0.33]]) part(g, 0.05, 0.72, 0.05, leg, x, 0, z, 0);
    for (const s of [-1, 1]) {
      const ch = new THREE.Group(); ch.position.set(0, 0, s * 0.62); ch.rotation.y = s > 0 ? Math.PI : 0;
      part(ch, 0.44, 0.05, 0.42, mat(C.graphite2), 0, 0.44, 0, 0.02);
      part(ch, 0.44, 0.48, 0.05, mat(C.graphite2), 0, 0.44, -0.2, 0.02);
      for (const [x, z] of [[-0.18, -0.18], [0.18, -0.18], [-0.18, 0.18], [0.18, 0.18]]) part(ch, 0.04, 0.44, 0.04, leg, x, 0, z, 0);
      g.add(ch);
    }
    part(g, 0.22, 0.2, 0.22, mat(C.teal, { rough: 0.5 }), 0.25, 0.78, 0, 0.04);
    return g;
  },
});

/** складная коробка MELBUS: стенки и клапаны на шарнирах, скотч, наклейка */
function foldBox(W: number, D: number, H: number, logo: THREE.Texture, sticker?: THREE.Texture, t = 0.04) {
  const outer = mat(C.white, { rough: 0.8 });
  const inner = mat(0xe4e9ed, { rough: 0.95 });
  const pm = [outer, outer, outer, outer, outer, inner];
  const root = new THREE.Group();
  const bottom = new THREE.Mesh(new THREE.BoxGeometry(W, t, D), inner);
  bottom.position.y = t / 2; bottom.castShadow = bottom.receiveShadow = true; root.add(bottom);
  const sides: { hinge: THREE.Group; flap: THREE.Group }[] = [];
  const defs: [number, number, number, number, boolean, boolean][] = [
    [0, D / 2, 0, W, true, !!sticker], [0, -D / 2, Math.PI, W, true, false], [W / 2, 0, Math.PI / 2, D, false, false], [-W / 2, 0, -Math.PI / 2, D, false, false],
  ];
  let stickerMesh: THREE.Mesh | null = null;
  const stickerM = sticker ? new THREE.MeshStandardMaterial({ map: sticker, transparent: true, roughness: 0.6, opacity: 0 }) : null;
  for (const [x, z, yaw, len, hasLogo, hasSticker] of defs) {
    const yg = new THREE.Group(); yg.position.set(x, 0, z); yg.rotation.y = yaw; root.add(yg);
    const hinge = new THREE.Group(); yg.add(hinge);
    const panel = new THREE.Mesh(new THREE.BoxGeometry(len, H, t), pm);
    panel.position.set(0, H / 2, -t / 2); panel.castShadow = panel.receiveShadow = true; hinge.add(panel);
    if (hasLogo) {
      const lw = len * (hasSticker ? 0.5 : 0.68);
      const dec = new THREE.Mesh(new THREE.PlaneGeometry(lw, lw / LOGO_RATIO), new THREE.MeshStandardMaterial({ map: logo, transparent: true, roughness: 0.75 }));
      dec.position.set(hasSticker ? -len * 0.2 : 0, H * (hasSticker ? 0.7 : 0.5), 0.002); hinge.add(dec);
    }
    if (hasSticker && stickerM) {
      const sw = Math.min(len * 0.36, H * 0.75);
      stickerMesh = new THREE.Mesh(new THREE.PlaneGeometry(sw, sw * 400 / 640), stickerM);
      stickerMesh.position.set(len * 0.24, H * 0.36, 0.004); hinge.add(stickerMesh);
    }
    const flap = new THREE.Group(); flap.position.set(0, H, 0); hinge.add(flap);
    const fl = new THREE.Mesh(new THREE.BoxGeometry(len - 0.01, D / 2, t), pm);
    fl.position.set(0, D / 4, -t / 2); fl.castShadow = fl.receiveShadow = true; flap.add(fl);
    sides.push({ hinge, flap });
  }
  const tapeM = mat(C.teal, { rough: 0.4, emissive: C.teal, ei: 0.18 });
  const unit = new THREE.BoxGeometry(1, 1, 1);
  const tTop = new THREE.Mesh(unit, tapeM), tL = new THREE.Mesh(unit, tapeM), tR = new THREE.Mesh(unit, tapeM);
  tTop.castShadow = true; root.add(tTop, tL, tR);
  const TW = Math.min(0.44, D * 0.22), TH = 0.012, DROP = H * 0.3;
  return {
    root,
    /** walls 0 — плоско, 1 — стоят; fold: 0 — клапаны торчат, 1 — закрыты, <0 — раскрыты наружу */
    set(o: { walls: number; flapsSide: number; flapsFB: number; tapeL?: number; tapeTop?: number; tapeR?: number; sticker?: number }) {
      const up = [o.walls, o.walls, o.walls, o.walls];
      const fold = [o.flapsFB, o.flapsFB, o.flapsSide, o.flapsSide];
      sides.forEach((s, i) => {
        s.hinge.rotation.x = (Math.PI / 2) * (1 - up[i]);
        s.flap.rotation.x = -(Math.PI / 2) * fold[i] * (i < 2 ? 1 : 0.985);
      });
      const top = H + t * 2.2;
      const a = o.tapeL ?? 0, b = o.tapeTop ?? 0, c = o.tapeR ?? 0;
      tL.visible = a > 0; tL.scale.set(TH, Math.max(0.001, DROP * a), TW); tL.position.set(-W / 2 - TH / 2, top - (DROP * a) / 2, 0);
      tTop.visible = b > 0; tTop.scale.set(Math.max(0.001, (W + 0.02) * b), TH, TW); tTop.position.set(-W / 2 + ((W + 0.02) * b) / 2, top, 0);
      tR.visible = c > 0; tR.scale.set(TH, Math.max(0.001, DROP * c), TW); tR.position.set(W / 2 + TH / 2, top - (DROP * c) / 2, 0);
      if (stickerMesh && stickerM) {
        const k = o.sticker ?? 0;
        stickerM.opacity = eout(k); stickerMesh.visible = k > 0;
        const sc = lerp(1.3, 1, eback(k)); stickerMesh.scale.set(sc, sc, 1); stickerMesh.position.z = 0.004 + (1 - eout(k)) * 0.3;
      }
    },
  };
}

/** комната-диорама: пол-подиум, две стены в разрезе, окно */
function room(variant: 'a' | 'b') {
  const g = new THREE.Group();
  const floorC = variant === 'a' ? 0xd5dbe2 : 0xe6e1d8;
  part(g, 7.6, 0.35, 5.6, mat(0xc4ccd5, { rough: 0.9 }), 0, -0.35, 0, 0.06);
  part(g, 7.5, 0.02, 5.5, mat(floorC, { rough: 0.85 }), 0, -0.01, 0, 0);
  part(g, 7.6, 0.035, 0.035, mat(C.teal, { emissive: C.teal, ei: 0.6 }), 0, -0.02, 2.82, 0);
  part(g, 0.035, 0.035, 5.6, mat(C.teal, { emissive: C.teal, ei: 0.6 }), 3.82, -0.02, 0, 0);
  const wallM = mat(C.wall, { rough: 0.95 });
  part(g, 7.6, 2.7, 0.18, wallM, 0, 0, -2.71, 0.02);
  part(g, 0.18, 2.7, 5.42, wallM, -3.71, 0, 0.09, 0.02);
  const glass = mat(0x1c3a44, { rough: 0.15, metal: 0.2, emissive: 0x0b4f4c, ei: 0.25 });
  const frame = mat(C.white, { rough: 0.5 });
  const wx = variant === 'a' ? 1.25 : 0.0;
  part(g, 1.9, 1.3, 0.04, frame, wx, 1.1, -2.6, 0.01);
  part(g, 1.76, 1.16, 0.05, glass, wx, 1.17, -2.59, 0);
  part(g, 0.04, 1.16, 0.06, frame, wx, 1.17, -2.56, 0);
  if (variant === 'b') {
    part(g, 0.05, 2.1, 1.1, mat(C.graphite2), -3.6, 0, 1.4, 0.01);
    part(g, 0.06, 0.06, 0.16, mat(C.silver, { metal: 0.8, rough: 0.3 }), -3.56, 1.0, 1.0, 0);
  }
  return g;
}

/** дом в городе: фасад с окнами (текстура), плоская крыша */
function building(w: number, h: number, d: number, tone: number, seed: number) {
  const g = new THREE.Group();
  const tex = canvasTex(256, 512, (c) => {
    c.fillStyle = '#' + tone.toString(16).padStart(6, '0'); c.fillRect(0, 0, 256, 512);
    let r = seed;
    const rnd = () => ((r = (r * 9301 + 49297) % 233280) / 233280);
    for (let y = 24; y < 500; y += 44) for (let x = 18; x < 240; x += 40) {
      const k = rnd();
      c.fillStyle = k > 0.9 ? '#14DCD5' : k > 0.78 ? '#FFE3B0' : '#3A4652';
      c.fillRect(x, y, 22, 26);
    }
  });
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(Math.max(1, Math.round(w / 1.6)), Math.max(1, Math.round(h / 2.6)));
  const texZ = tex.clone(); texZ.needsUpdate = true; texZ.repeat.set(Math.max(1, Math.round(d / 1.6)), Math.max(1, Math.round(h / 2.6)));
  const plain = mat(tone, { rough: 0.9 });
  const front = new THREE.MeshStandardMaterial({ map: tex, roughness: 0.9, envMapIntensity: 0.5 });
  const side = new THREE.MeshStandardMaterial({ map: texZ, roughness: 0.9, envMapIntensity: 0.5 });
  const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), [side, side, mat(0x3a4450, { rough: 0.9 }), plain, front, front]);
  m.position.y = h / 2; m.castShadow = m.receiveShadow = true; g.add(m);
  part(g, w + 0.1, 0.12, d + 0.1, mat(C.graphite2), 0, h, 0, 0.02);
  return g;
}
function tree(s = 1) {
  const g = new THREE.Group();
  const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.06 * s, 0.08 * s, 0.7 * s, 8), mat(0x4a3a2e, { rough: 1 }));
  trunk.position.y = 0.35 * s; trunk.castShadow = true; g.add(trunk);
  const leafM = new THREE.MeshStandardMaterial({ color: col(0x0f6b65), roughness: 0.85, flatShading: true, envMapIntensity: 0.5 });
  const crown = new THREE.Mesh(new THREE.IcosahedronGeometry(0.55 * s, 0), leafM);
  crown.position.y = 1.1 * s; crown.castShadow = true; g.add(crown);
  return g;
}

/* ======================================================================
   СЦЕНА «HERO»: вся квартира влезает в одну коробку MELBUS
   ====================================================================== */
async function heroScene(host: HTMLElement): Promise<SceneApi> {
  const st = makeStage(host, {});
  const { scene } = st;
  const cam = st.camera as THREE.OrthographicCamera;
  const logo = logoTexture(st.invalidate);
  if (document.fonts?.ready) await document.fonts.ready;

  const RY = 0.35, BX = 26, VX = 2.6;
  const track = new THREE.Group(); scene.add(track);
  const roomA = room('a'), roomB = room('b');
  roomA.position.y = RY; roomB.position.set(BX, RY, 0);
  track.add(roomA, roomB);

  // улица: дорога, разметка, тротуар, город между квартирами
  const lam = (c: number) => new THREE.MeshLambertMaterial({ color: col(c) });
  part(scene, 160, 0.02, 2.5, lam(0x141b23), 0, -0.02, 4.45, 0).castShadow = false;
  part(scene, 160, 0.03, 0.9, lam(0x222c37), 0, -0.02, 6.15, 0).castShadow = false;
  part(scene, 160, 0.03, 0.5, lam(0x222c37), 0, -0.02, 2.98, 0).castShadow = false;
  part(scene, 160, 0.02, 0.05, mat(C.tealDeep, { emissive: C.tealDeep, ei: 0.5 }), 0, 0.0, 5.72, 0).castShadow = false;
  const city = new THREE.Group(); track.add(city);
  for (let x = -40; x < 70; x += 2.2) part(city, 1.0, 0.02, 0.07, lam(0x5a6672), x, 0.0, 4.45, 0).castShadow = false;
  const tones = [0xdce1e7, 0xc9d1d9, 0xf4f6f8, 0xb9c3cd, 0xe3e7eb];
  const bdefs: [number, number, number, number][] = [[6.6, 3.2, 3.6, 2.6], [9.6, 2.4, 5.6, 3.4], [12.4, 2.8, 4.2, 2.8], [15.4, 2.6, 6.4, 3.2], [18.4, 3.0, 3.8, 2.6], [21.4, 2.2, 4.8, 3.0], [-6.4, 3.0, 4.6, 3.0], [-9.6, 2.6, 6.0, 3.0]];
  bdefs.forEach(([x, w, h, d], i) => { const b = building(w, h, d, tones[i % tones.length], 11 + i * 7); b.position.set(x, 0, -0.6 - d * 0.1); city.add(b); });
  // деревья: за дорогой — между домами; перед дорогой — редко и не там, где стоит бус
  for (let x = 4.8; x < 23; x += 2.9) { const t = tree(0.85); t.position.set(x, 0, 3.0); city.add(t); }
  for (let x = -16; x < 46; x += 3.4) {
    if (Math.abs(x - VX) < 4.5 || Math.abs(x - VX - BX) < 4.5) continue;
    const t = tree(0.8); t.position.set(x, 0, 7.1); city.add(t);
  }

  // мебель: квартира А и новая квартира Б
  type Item = { a: THREE.Object3D; b: THREE.Object3D; pa: THREE.Vector3; pb: THREE.Vector3; ra: number; rb: number; sz: THREE.Vector3; line: THREE.Box3Helper };
  const plan: [string, number, number, number, number, number, number][] = [
    // имя, A: x z rot, Б: x z rot
    ['bed', -2.2, -1.5, 0, 2.35, -1.5, 0],
    ['sofa', 0.3, -2.1, 0, 0.0, -2.1, 0],
    ['fridge', 3.25, -2.25, 0, -3.25, -2.25, 0],
    ['dining', 2.45, -0.55, 0, -2.2, -0.55, Math.PI / 2],
    ['bookcase', -3.32, 1.75, Math.PI / 2, -3.32, -1.0, Math.PI / 2],
    ['tv', -3.33, -0.05, Math.PI / 2, 0.0, 0.95, Math.PI],
    ['armchair', -1.45, 0.65, 0.9, 1.45, 0.55, -0.75],
    ['rug', 0.3, -0.7, 0, 0.0, -0.65, 0],
    ['lamp', -1.1, -2.3, 0, -1.55, -2.3, 0],
    ['plant', 3.3, 1.95, 0, 3.3, 1.1, 0],
  ];
  const items: Item[] = plan.map(([n, ax, az, ar, bx, bz, br]) => {
    const a = F[n](), b = F[n]();
    a.position.set(ax, 0, az); a.rotation.y = ar; roomA.add(a);
    b.position.set(bx, 0, bz); b.rotation.y = br; b.scale.setScalar(0.0001); roomB.add(b);
    roomA.updateMatrixWorld(true);
    const box3 = new THREE.Box3().setFromObject(a);
    const sz = box3.getSize(new THREE.Vector3());
    const line = new THREE.Box3Helper(box3.expandByScalar(0.06), col(C.teal));
    (line.material as THREE.LineBasicMaterial).transparent = true; (line.material as THREE.LineBasicMaterial).opacity = 0;
    scene.add(line);
    return { a, b, pa: new THREE.Vector3(ax, 0, az), pb: new THREE.Vector3(bx, 0, bz), ra: ar, rb: br, sz, line };
  });

  // та самая коробка
  const BW = 1.9, BD = 1.4, BH = 1.3;
  const box = foldBox(BW, BD, BH, logo, stickerTexture('КВАРТИРА', '1/1', 'ПЕРЕЕЗД', 'КОРОБКА'));
  const boxG = new THREE.Group(); boxG.add(box.root); scene.add(boxG);
  const BOXA = new THREE.Vector3(0.75, RY, 1.55), BOXB = new THREE.Vector3(1.75, RY, 1.95);

  // бус MELBUS (дверь — с невидимой стороны, грузим «за бортом»)
  const van = new THREE.Group(); scene.add(van);
  const white = mat(C.white, { rough: 0.35, metal: 0.05 });
  const dark = mat(C.graphite, { rough: 0.5 });
  const glassM = mat(0x15232b, { rough: 0.1, metal: 0.4 });
  part(van, 3.35, 2.0, 1.86, white, -0.55, 0.36, 0, 0.12);
  part(van, 1.3, 1.36, 1.86, white, 1.62, 0.36, 0, 0.16);
  const wind = part(van, 0.05, 0.78, 1.66, glassM, 1.92, 1.0, 0, 0.02); wind.rotation.z = -0.5;
  part(van, 0.62, 0.5, 0.02, glassM, 1.45, 1.06, 0.935, 0);
  part(van, 0.62, 0.5, 0.02, glassM, 1.45, 1.06, -0.935, 0);
  part(van, 0.2, 0.26, 1.9, dark, 2.28, 0.32, 0, 0.06);
  part(van, 0.16, 0.24, 1.9, dark, -2.24, 0.32, 0, 0.06);
  part(van, 3.36, 0.1, 1.885, mat(C.teal, { rough: 0.4, emissive: C.teal, ei: 0.15 }), -0.55, 0.55, 0, 0.02);
  part(van, 0.05, 0.12, 0.3, mat(0xffffff, { emissive: 0xffffff, ei: 1.2 }), 2.27, 0.78, 0.7, 0);
  part(van, 0.05, 0.12, 0.3, mat(0xffffff, { emissive: 0xffffff, ei: 1.2 }), 2.27, 0.78, -0.7, 0);
  part(van, 0.05, 0.12, 0.2, mat(0xff5a4e, { emissive: 0xff3b30, ei: 0.8 }), -2.25, 0.9, 0.78, 0);
  part(van, 0.05, 0.12, 0.2, mat(0xff5a4e, { emissive: 0xff3b30, ei: 0.8 }), -2.25, 0.9, -0.78, 0);
  const vanLogo = new THREE.MeshStandardMaterial({ map: logo, transparent: true, roughness: 0.5 });
  for (const sd of [1, -1]) {
    const d = new THREE.Mesh(new THREE.PlaneGeometry(2.5, 2.5 / LOGO_RATIO), vanLogo);
    d.position.set(-0.55, 1.45, sd * 0.935); if (sd < 0) d.rotation.y = Math.PI; van.add(d);
  }
  const wheels: THREE.Object3D[] = [];
  const tyre = new THREE.CylinderGeometry(0.37, 0.37, 0.28, 28), hub = new THREE.CylinderGeometry(0.2, 0.2, 0.3, 16);
  for (const x of [-1.45, 1.5]) for (const z of [0.82, -0.82]) {
    const w = new THREE.Group(); w.position.set(x, 0.37, z); w.rotation.x = Math.PI / 2;
    const t = new THREE.Mesh(tyre, dark); t.castShadow = true; w.add(t);
    w.add(new THREE.Mesh(hub, mat(C.silver, { metal: 0.8, rough: 0.3 })));
    van.add(w); wheels.push(w);
  }
  van.position.set(-30, 0, 4.45);

  // сканер — видеоосмотр
  const scanM = new THREE.MeshBasicMaterial({ color: col(C.teal), transparent: true, opacity: 0.55, depthWrite: false, blending: THREE.AdditiveBlending });
  const scan = new THREE.Mesh(new THREE.BoxGeometry(0.05, 2.9, 5.5), scanM);
  const glowM = new THREE.MeshBasicMaterial({ color: col(C.teal), transparent: true, opacity: 0.18, depthWrite: false, blending: THREE.AdditiveBlending });
  const glow = new THREE.Mesh(new THREE.PlaneGeometry(1.6, 5.5), glowM); glow.rotation.x = -Math.PI / 2;
  scan.add(glow); glow.position.set(-0.8, -1.42, 0);
  scan.visible = false; roomA.add(scan);

  // кривая Безье: из точки a в точку b с подъёмом
  const P = new THREE.Vector3(), Q = new THREE.Vector3();
  const bez = (out: THREE.Vector3, a: THREE.Vector3, b: THREE.Vector3, lift: number, t: number) => {
    Q.set((a.x + b.x) / 2, Math.max(a.y, b.y) + lift, (a.z + b.z) / 2);
    const u = 1 - t;
    out.set(u * u * a.x + 2 * u * t * Q.x + t * t * b.x, u * u * a.y + 2 * u * t * Q.y + t * t * b.y, u * u * a.z + 2 * u * t * Q.z + t * t * b.z);
    return out;
  };
  const target = new THREE.Vector3();
  const mouthA = new THREE.Vector3(BOXA.x, RY + BH * 0.55, BOXA.z);
  const tmpA = new THREE.Vector3(), tmpB = new THREE.Vector3();
  const N = items.length;
  const IN0 = 0.16, IN_STEP = 0.024, IN_DUR = 0.05;
  const OUT0 = 0.855, OUT_STEP = 0.0085, OUT_DUR = 0.05;

  let p = 0;
  const frame = () => {
    const aspect = st.aspect;
    const wide = aspect > 1.2;
    const T = -BX * eio(seg(p, 0.6, 0.79));
    track.position.x = T;

    // камера: крупно → общий план → проезд → новая квартира
    const zIn = eio(seg(p, 0.36, 0.5)), zOut = eio(seg(p, 0.86, 1));
    const zoom = lerp(lerp(0.74, 1.0, zIn), 0.84, zOut) + Math.sin(Math.PI * seg(p, 0.6, 0.79)) * 0.08;
    target.set(lerp(lerp(0.35, VX - 1.6, zIn), 0.6, zOut), 1.0, lerp(lerp(-0.1, 2.0, zIn), 0.3, zOut));
    const vw = (wide ? 15.5 : 12.6) * zoom, vh = (wide ? 10.2 : 11.5) * zoom;
    isoFrame(cam, aspect, vw, vh, target, (p - 0.5) * 0.14, wide ? 2.6 * zoom : 0);

    // сканер и рамки замеров
    const s = seg(p, 0.025, 0.12);
    scan.visible = s > 0 && s < 1;
    const sx = lerp(-3.7, 3.7, eio(s));
    scan.position.set(sx, 1.45, 0);
    scanM.opacity = 0.55 * Math.sin(Math.PI * s); glowM.opacity = 0.2 * Math.sin(Math.PI * s);

    // коробка: собирается из заготовки, глотает вещи, закрывается
    const walls = eio(seg(p, 0.1, 0.155));
    const open = -0.28 * eout(seg(p, 0.13, 0.16));
    const closeS = eio(seg(p, 0.425, 0.455)), closeF = eio(seg(p, 0.44, 0.47));
    const reopenF = eio(seg(p, 0.835, 0.855)), reopenS = eio(seg(p, 0.845, 0.86));
    const flat = eio(seg(p, 0.955, 0.99));
    const tapeOff = seg(p, 0.83, 0.845);
    box.set({
      walls: walls * (1 - flat),
      flapsSide: lerp(lerp(open, 1, closeS), -0.28, reopenS) * (1 - flat),
      flapsFB: lerp(lerp(open, 1, closeF), -0.28, reopenF) * (1 - flat),
      tapeL: eout(seg(p, 0.475, 0.49)) * (1 - tapeOff), tapeTop: eio(seg(p, 0.49, 0.51)) * (1 - tapeOff), tapeR: eout(seg(p, 0.51, 0.52)) * (1 - tapeOff),
      sticker: seg(p, 0.52, 0.545) * (1 - seg(p, 0.95, 0.97)),
    });
    // «глоток»: коробка пружинит, когда в неё ныряет вещь
    let gulp = 0;
    for (let i = 0; i < N; i++) { const e = IN0 + i * IN_STEP + IN_DUR; gulp += Math.sin(Math.PI * seg(p, e - 0.004, e + 0.016)); }
    for (let i = 0; i < N; i++) { const st0 = OUT0 + i * OUT_STEP; gulp += 0.6 * Math.sin(Math.PI * seg(p, st0, st0 + 0.014)); }
    // путь коробки: квартира А → бус → квартира Б
    const loadPt = tmpA.set(VX - 1.2, 1.0, 3.3);
    const hopIn = seg(p, 0.55, 0.595), hopOut = seg(p, 0.79, 0.835);
    let bs = Math.max(0.0001, eback(seg(p, 0.085, 0.105)) * (1 - ein(seg(p, 0.975, 0.995))));
    if (hopIn <= 0) boxG.position.copy(BOXA);
    else if (hopIn < 1) { bez(boxG.position, BOXA, loadPt, 1.8, eio(hopIn)); bs = lerp(1, 0.55, eio(hopIn)); }
    else if (hopOut <= 0) { boxG.position.copy(loadPt); bs = 0.0001; }
    else { bez(boxG.position, tmpA.set(VX - 1.2, 1.0, 3.3), tmpB.copy(BOXB), 1.8, eio(hopOut)); bs = lerp(0.55, 1, eout(hopOut)); }
    if (hopOut >= 1) boxG.position.copy(BOXB);
    const sq = Math.min(1, gulp) * 0.07;
    boxG.scale.set(bs * (1 + sq * 0.6), bs * (1 - sq), bs * (1 + sq * 0.6));
    boxG.rotation.y = Math.sin(Math.PI * hopIn) * 0.6 - Math.sin(Math.PI * hopOut) * 0.6;
    boxG.visible = bs > 0.001 && flat < 1;

    // вещи: в коробку…
    const mouthB = tmpB.set(BOXB.x, RY + BH * 0.55, BOXB.z);
    items.forEach((it, i) => {
      const fl = Math.max(0, 1 - Math.abs(sx - (it.pa.x)) / 1.1) * (s > 0 && s < 1 ? 1 : 0);
      const after = seg(p, 0.12, 0.14) * (1 - seg(p, IN0 + i * IN_STEP, IN0 + i * IN_STEP + 0.01));
      (it.line.material as THREE.LineBasicMaterial).opacity = Math.max(fl, after * 0.35);
      it.line.visible = (it.line.material as THREE.LineBasicMaterial).opacity > 0.01;

      const k = seg(p, IN0 + i * IN_STEP, IN0 + i * IN_STEP + IN_DUR);
      const a = it.a;
      if (k <= 0) { a.position.copy(it.pa); a.scale.setScalar(1); a.rotation.y = it.ra; }
      else {
        const e = eio(k);
        bez(P, tmpA.set(it.pa.x, 0, it.pa.z), tmpB.set(mouthA.x, mouthA.y - RY, mouthA.z), 2.4 + it.sz.y * 0.4, e);
        a.position.copy(P);
        const sc = Math.max(0.0001, 1 - ein(k) * 1.0);
        const stretch = Math.sin(Math.PI * k) * 0.28;
        a.scale.set(sc * (1 - stretch * 0.5), sc * (1 + stretch), sc * (1 - stretch * 0.5));
        a.rotation.y = it.ra + e * Math.PI * 1.2;
      }
      a.visible = k < 1;
      // …и из коробки на новые места
      const o = seg(p, OUT0 + i * OUT_STEP, OUT0 + i * OUT_STEP + OUT_DUR);
      const b = it.b;
      if (o <= 0) { b.visible = false; }
      else {
        b.visible = true;
        bez(P, tmpA.set(mouthB.x, mouthB.y - RY + 0.2, mouthB.z), tmpB.set(it.pb.x, 0, it.pb.z), 2.2 + it.sz.y * 0.4, eout(o));
        b.position.copy(P);
        const sc = Math.max(0.0001, eback(o));
        const stretch = Math.sin(Math.PI * o) * 0.22;
        b.scale.set(sc * (1 - stretch * 0.5), sc * (1 + stretch), sc * (1 - stretch * 0.5));
        b.rotation.y = it.rb - (1 - eout(o)) * Math.PI * 1.2;
      }
    });

    // бус: приезжает, ждёт, везёт, уезжает
    let vx = -30;
    if (p >= 0.37) vx = lerp(-30, VX, eout(seg(p, 0.37, 0.5)));
    if (p >= 0.9) vx = lerp(VX, 32, ein(seg(p, 0.9, 1)));
    van.position.x = vx;
    const drive = seg(p, 0.6, 0.79);
    const bump = Math.sin(Math.PI * seg(p, 0.585, 0.6)) * 0.06 + Math.sin(Math.PI * seg(p, 0.79, 0.805)) * 0.05;
    van.position.y = Math.sin(drive * Math.PI * 14) * 0.02 * Math.sin(drive * Math.PI) - bump;
    const dist = vx - T;
    wheels.forEach((w) => (w.rotation.y = -dist / 0.37));

    // свет: на дороге — тёплый «закат», в новой квартире снова день
    const warm = Math.sin(Math.PI * drive);
    st.sun.color.setRGB(1, lerp(1, 0.86, warm), lerp(1, 0.7, warm));
    st.invalidate();
  };
  st.onResize(frame);
  st.ready();
  return { setProgress(v) { p = clamp01(v); frame(); }, destroy: st.destroy };
}

/* ======================================================================
   СЦЕНА «BOX»: заготовка складывается в коробку MELBUS
   ====================================================================== */
async function boxScene(host: HTMLElement): Promise<SceneApi> {
  const st = makeStage(host, { persp: true });
  const { scene } = st;
  const cam = st.camera as THREE.PerspectiveCamera;
  st.sun.position.set(2.5, 12, 9);
  st.sun.intensity = 1.5;
  st.renderer.toneMappingExposure = 1.12;
  const fill = new THREE.DirectionalLight(0xffffff, 0.45); fill.position.set(10, 4, -2); scene.add(fill);
  const sc = st.sun.shadow.camera; sc.left = -7; sc.right = 7; sc.top = 7; sc.bottom = -7; sc.updateProjectionMatrix();
  st.sun.shadow.bias = -0.0015; st.sun.shadow.normalBias = 0.03;
  const logo = logoTexture(st.invalidate);
  if (document.fonts?.ready) await document.fonts.ready;

  const W = 3.0, D = 2.0, H = 2.0, t = 0.05;
  const outer = mat(C.white, { rough: 0.8 });
  const inner = mat(0xe4e9ed, { rough: 0.95 });
  const panelMats = [outer, outer, outer, outer, outer, inner]; // +z наружу, -z внутрь

  const root = new THREE.Group(); scene.add(root);
  const ground = new THREE.Mesh(new THREE.CircleGeometry(9, 48), new THREE.ShadowMaterial({ opacity: 0.12 }));
  ground.rotation.x = -Math.PI / 2; ground.receiveShadow = true; scene.add(ground);

  const bottom = new THREE.Mesh(new THREE.BoxGeometry(W, t, D), inner); bottom.position.y = t / 2; bottom.receiveShadow = bottom.castShadow = true; root.add(bottom);

  type Side = { hinge: THREE.Group; flap: THREE.Group; len: number };
  const sides: Side[] = [];
  const defs: { pos: [number, number, number]; yaw: number; len: number; logo?: boolean; sticker?: boolean }[] = [
    { pos: [0, 0, D / 2], yaw: 0, len: W, logo: true },
    { pos: [0, 0, -D / 2], yaw: Math.PI, len: W, logo: true },
    { pos: [W / 2, 0, 0], yaw: Math.PI / 2, len: D, sticker: true },
    { pos: [-W / 2, 0, 0], yaw: -Math.PI / 2, len: D },
  ];
  const sticker = stickerTexture(host.dataset.room || 'КУХНЯ', host.dataset.num || '07');
  const stickerM = new THREE.MeshStandardMaterial({ map: sticker, transparent: true, roughness: 0.6, opacity: 0 });
  let stickerMesh: THREE.Mesh | null = null;
  const tapeM = mat(C.teal, { rough: 0.4, emissive: C.teal, ei: 0.18 });

  for (const d of defs) {
    const yawG = new THREE.Group(); yawG.position.set(...d.pos); yawG.rotation.y = d.yaw; root.add(yawG);
    const hinge = new THREE.Group(); yawG.add(hinge);
    const panel = new THREE.Mesh(new THREE.BoxGeometry(d.len, H, t), panelMats);
    panel.position.set(0, H / 2, -t / 2); panel.castShadow = panel.receiveShadow = true; hinge.add(panel);
    if (d.logo) {
      const dec = new THREE.Mesh(new THREE.PlaneGeometry(d.len * 0.7, (d.len * 0.7) / LOGO_RATIO), new THREE.MeshStandardMaterial({ map: logo, transparent: true, roughness: 0.75 }));
      dec.position.set(0, H * 0.5, 0.002); hinge.add(dec);
    }
    if (d.sticker) {
      stickerMesh = new THREE.Mesh(new THREE.PlaneGeometry(1.25, 1.25 * 400 / 640), stickerM);
      stickerMesh.position.set(0, H * 0.46, 0.004); hinge.add(stickerMesh);
    }
    const flap = new THREE.Group(); flap.position.set(0, H, 0); hinge.add(flap);
    const fl = new THREE.Mesh(new THREE.BoxGeometry(d.len - 0.01, D / 2, t), panelMats);
    fl.position.set(0, D / 4, -t / 2); fl.castShadow = fl.receiveShadow = true; flap.add(fl);
    sides.push({ hinge, flap, len: d.len });
  }

  // скотч: верх по шву, и вниз по торцам
  const unit = new THREE.BoxGeometry(1, 1, 1);
  const tapeTop = new THREE.Mesh(unit, tapeM); tapeTop.castShadow = true; root.add(tapeTop);
  const tapeL = new THREE.Mesh(unit, tapeM), tapeR = new THREE.Mesh(unit, tapeM); root.add(tapeL, tapeR);
  const TW = 0.44, TH = 0.012, DROP = 0.62;

  const tgt = new THREE.Vector3();
  let p = 0;
  const frame = () => {
    const a = st.aspect;
    // складываем стенки
    const fb = eio(seg(p, 0.06, 0.26)), lr = eio(seg(p, 0.15, 0.34));
    const up = [fb, fb, lr, lr];
    const fold = [eio(seg(p, 0.44, 0.55)), eio(seg(p, 0.46, 0.57)), eio(seg(p, 0.35, 0.45)), eio(seg(p, 0.37, 0.47))];
    sides.forEach((s, i) => {
      s.hinge.rotation.x = (Math.PI / 2) * (1 - up[i]);
      s.flap.rotation.x = -(Math.PI / 2) * fold[i] * (i < 2 ? 1 : 0.985);
    });
    // скотч
    const tl = eout(seg(p, 0.56, 0.6)), tt = eio(seg(p, 0.6, 0.69)), tr = eout(seg(p, 0.69, 0.73));
    const top = H + t * 2.2;
    tapeL.visible = tl > 0; tapeL.scale.set(TH, Math.max(0.001, DROP * tl), TW); tapeL.position.set(-W / 2 - TH / 2, top - (DROP * tl) / 2, 0);
    tapeTop.visible = tt > 0; tapeTop.scale.set(Math.max(0.001, (W + 0.02) * tt), TH, TW); tapeTop.position.set(-W / 2 + ((W + 0.02) * tt) / 2, top, 0);
    tapeR.visible = tr > 0; tapeR.scale.set(TH, Math.max(0.001, DROP * tr), TW); tapeR.position.set(W / 2 + TH / 2, top - (DROP * tr) / 2, 0);
    // наклейка
    const sk = seg(p, 0.76, 0.86);
    stickerM.opacity = eout(sk);
    if (stickerMesh) { const s = lerp(1.25, 1, eback(sk)); stickerMesh.scale.set(s, s, 1); stickerMesh.position.z = 0.004 + (1 - eout(sk)) * 0.25; }
    // поворот и камера
    root.rotation.y = lerp(0.42, -0.5, eio(seg(p, 0.55, 0.92)));
    const cz = eio(seg(p, 0.0, 0.62));
    const elev = lerp(1.05, 0.36, cz);
    const dist = lerp(a < 1 ? 22 : 17.5, a < 1 ? 15 : 8.6, cz);
    tgt.set(0, lerp(0, H * (a < 1 ? 0.62 : 0.48), cz), 0);
    cam.aspect = a;
    cam.fov = a < 1 ? 36 : 30;
    cam.position.set(Math.sin(0.62) * Math.cos(elev) * dist, Math.sin(elev) * dist, Math.cos(0.62) * Math.cos(elev) * dist).add(tgt);
    cam.lookAt(tgt);
    cam.updateProjectionMatrix();
    st.invalidate();
  };
  st.onResize(frame);
  st.ready();
  return { setProgress(v) { p = clamp01(v); frame(); }, destroy: st.destroy };
}

export function supportsWebGL() {
  try { const c = document.createElement('canvas'); return !!(c.getContext('webgl2') || c.getContext('webgl')); } catch { return false; }
}

export async function mountScene(host: HTMLElement, kind: string): Promise<SceneApi> {
  if (!supportsWebGL()) throw new Error('no webgl');
  return kind === 'box' ? boxScene(host) : heroScene(host);
}
