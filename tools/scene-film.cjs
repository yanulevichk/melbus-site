// Покадровый ролик сцены для показа (без управления скроллом). Нужен `npx astro preview --port 4321` и Playwright.
// Пример: node tools/scene-film.cjs home-hero hero d 330 frames/ && ffmpeg -framerate 30 -i frames/f%04d.png -pix_fmt yuv420p out.mp4
// покадровый ролик сцены: node film.cjs <sceneId> <threeKind> <d|m> <frames> <outdir>
const { chromium, devices } = require('playwright');
(async () => {
  const [,, id, kind, mode, n, out] = process.argv;
  const b = await chromium.launch();
  const ctx = mode === 'm' ? await b.newContext({ ...devices['iPhone 13'], deviceScaleFactor: 2 }) : await b.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
  const p = await ctx.newPage();
  await p.goto('http://localhost:4321/ru/?debug', { waitUntil: 'networkidle' });
  await p.addStyleTag({ content: '.mbar{display:none!important}' });
  const sel = `[data-scene="${id}"]`;
  await p.evaluate((sel) => document.querySelector(sel).scrollIntoView({ block: 'center' }), sel);
  await p.waitForFunction((k) => window.__s3d && window.__s3d[k] && window.__tl, kind, { timeout: 20000 });
  await p.waitForTimeout(1500);
  const frame = await p.$(sel + ' .scene__frame');
  const N = Number(n);
  for (let i = 0; i <= N; i++) {
    await p.evaluate(([id, v]) => { const t = window.__tl[id]; t.pause(); t.progress(v); }, [id, i / N]);
    await p.waitForTimeout(40);
    await frame.screenshot({ path: `${out}/f${String(i).padStart(4, '0')}.png` });
  }
  await b.close();
})();
