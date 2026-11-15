// Постер 3D-сцены (картинка до загрузки three.js). Нужен запущенный `npx astro preview --port 4321` и Playwright.
// Пример: node tools/scene-poster.cjs hero 0 hero-d.png d  → затем перевести в WebP и положить в public/scenes/<id>/poster-{d,m}.webp
// постеры 3D-сцен: node poster.cjs <hero|box> <progress> <out.png> <d|m>
const { chromium, devices } = require('playwright');
(async () => {
  const [,, kind, prog, out, mode] = process.argv;
  const b = await chromium.launch();
  const ctx = mode === 'm' ? await b.newContext({ ...devices['iPhone 13'], deviceScaleFactor: 3 }) : await b.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1.3 });
  const p = await ctx.newPage();
  await p.goto('http://localhost:4321/ru/?debug', { waitUntil: 'networkidle' });
  await p.addStyleTag({ content: '.cap,.scene__ai,.s3d__poster{display:none!important}' });
  const sel = `[data-three=${kind}]`;
  await p.evaluate((sel) => document.querySelector(sel).scrollIntoView({ block: 'center' }), sel);
  await p.waitForFunction((k) => window.__s3d && window.__s3d[k], kind, { timeout: 20000 });
  await p.waitForTimeout(1500);
  await p.evaluate(([k, v]) => window.__s3d[k].setProgress(Number(v)), [kind, prog]);
  await p.waitForTimeout(400);
  await (await p.$('.scene:has(' + sel + ') .scene__frame')).screenshot({ path: out });
  await b.close();
})();
