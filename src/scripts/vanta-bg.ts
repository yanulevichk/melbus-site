// Vanta грузится лениво (three.js тяжёлый): только когда блок виден. Возвращает функцию остановки.
const loaders = {
  fog: () => import('vanta/dist/vanta.fog.min.js'),
  net: () => import('vanta/dist/vanta.net.min.js'),
  waves: () => import('vanta/dist/vanta.waves.min.js'),
} as const;

export function mountVanta(el: HTMLElement, effect: keyof typeof loaders = 'fog', opts: Record<string, unknown> = {}) {
  let instance: { destroy(): void } | null = null;
  let alive = true;
  const io = new IntersectionObserver(async ([e]) => {
    if (e.isIntersecting && !instance) {
      const THREE = await import('three');
      const mod: any = await loaders[effect]();
      if (!alive) return;
      const VANTA = (mod.default?.default ?? mod.default ?? mod) as (o: object) => { destroy(): void };
      instance = VANTA({ el, THREE, mouseControls: true, touchControls: false, gyroControls: false, ...opts });
    } else if (!e.isIntersecting && instance) {
      instance.destroy(); instance = null;
    }
  }, { rootMargin: '200px' });
  io.observe(el);
  return () => { alive = false; io.disconnect(); instance?.destroy(); instance = null; };
}
