// Сборка выгрузки в Figma из out/figma/spec.json (сначала: npx tsx scripts/figma-spec.ts):
//   node scripts/figma-build.cjs            → логотипы PNG, метрики шрифта, HTML-превью, плагин-импортёр + zip
//   node scripts/figma-build.cjs --compare  → ещё и сравнение превью с готовыми сторис (out/figma/cmp/*.jpg)
const fs = require('fs'), path = require('path'), {execFileSync} = require('child_process');
const {chromium} = require('playwright');
const OUT = 'out/figma', SPEC = JSON.parse(fs.readFileSync(`${OUT}/spec.json`, 'utf8'));
const MK = path.resolve('../../../marketing/stories/2026-11');
const ZIP = `${MK}/MELBUS-storis-figma.zip`;
const PLUGIN = `${OUT}/MELBUS-storis-figma`;

const fontCss = () => {
  const ranges = {
    latin: 'U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD',
    'latin-ext': 'U+0100-024F, U+0259, U+1E00-1EFF, U+2020, U+20A0-20AB, U+20AD-20CF, U+2113, U+2C60-2C7F, U+A720-A7FF',
    cyrillic: 'U+0301, U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116',
    'cyrillic-ext': 'U+0460-052F, U+1C80-1C88, U+20B4, U+2DE0-2DFF, U+A640-A69F, U+FE2E-FE2F',
  };
  let css = '';
  for (const fam of ['unbounded', 'onest']) for (const [r, u] of Object.entries(ranges))
    css += `@font-face{font-family:'${fam === 'onest' ? 'Onest' : 'Unbounded'}';src:url('fonts/${fam}-${r}-wght-normal.woff2') format('woff2');font-weight:100 900;font-display:block;unicode-range:${u};}\n`;
  return css;
};

(async () => {
  fs.mkdirSync(`${OUT}/fonts`, {recursive: true});
  fs.mkdirSync(`${OUT}/brand`, {recursive: true});
  for (const f of fs.readdirSync('public/fonts')) fs.copyFileSync(`public/fonts/${f}`, `${OUT}/fonts/${f}`);
  for (const f of ['melbus-white.svg', 'mark-white.svg']) fs.copyFileSync(`public/brand/${f}`, `${OUT}/brand/${f}`);
  fs.copyFileSync('scripts/figma-preview.js', `${OUT}/preview.js`);

  const browser = await chromium.launch();
  const page = await browser.newPage({deviceScaleFactor: 1});

  // 1) логотипы — PNG с прозрачным фоном (×4 к размеру в сторис), в Figma — компоненты
  const png = async (svg, w, h, out) => {
    await page.setViewportSize({width: Math.ceil(w), height: Math.ceil(h)});
    fs.writeFileSync(`${OUT}/brand/_logo.html`, `<html><body style="margin:0;background:transparent"><img id="i" src="${svg}" style="display:block;width:${w}px;height:${h}px"></body></html>`);
    await page.goto('file://' + path.resolve(OUT, 'brand/_logo.html'));
    await page.waitForFunction(() => document.getElementById('i').complete);
    await page.locator('#i').screenshot({path: out, omitBackground: true});
  };
  await png('melbus-white.svg', SPEC.logo.w * 4, SPEC.logo.h * 4, `${OUT}/img/logo.png`);
  await png('mark-white.svg', 460 * 3, 460 * 3 * 657 / 672, `${OUT}/img/mark.png`);

  // 2) метрики Onest (для черты у пунктов списка: она стоит на 10 px выше базовой линии первой строки)
  fs.writeFileSync(`${OUT}/_metrics.html`, `<html><head><meta charset="utf-8"><style>${fontCss()}</style></head><body><span style="font-family:Onest;font-size:100px">Hgąб</span></body></html>`);
  await page.goto('file://' + path.resolve(OUT, '_metrics.html'));
  await page.evaluate(() => document.fonts.load('100px Onest', 'Hgąб'));
  const METRICS = await page.evaluate(() => {
    const c = document.createElement('canvas').getContext('2d'); c.font = '100px Onest';
    const m = c.measureText('Hgąб');
    return {asc: m.fontBoundingBoxAscent / 100, desc: m.fontBoundingBoxDescent / 100};
  });
  console.log('Onest:', METRICS);

  // 3) HTML-превью (по языку) — открыть в браузере или сравнить с готовыми сторис
  for (const lang of SPEC.langs) {
    fs.writeFileSync(`${OUT}/preview-${lang}.html`, `<!doctype html><html><head><meta charset="utf-8"><title>MELBUS сторис ${lang}</title><style>${fontCss()}
body{margin:0;background:#333}#root{display:flex;flex-wrap:wrap;gap:40px;padding:40px}</style></head><body><div id="root"></div>
<script>window.SPEC=${JSON.stringify(SPEC)};window.LANG='${lang}';</script><script src="preview.js"></script></body></html>`);
  }
  if (process.argv.includes('--compare')) {
    fs.mkdirSync(`${OUT}/cmp`, {recursive: true});
    await page.setViewportSize({width: 1800, height: 2000});
    for (const lang of SPEC.langs) {
      await page.goto('file://' + path.resolve(OUT, `preview-${lang}.html`));
      await page.waitForFunction(() => document.body.dataset.ready === '1', null, {timeout: 60000});
      await page.waitForTimeout(500);
      for (const st of SPEC.stories[lang]) {
        if (st.video) continue;
        const shot = `${OUT}/cmp/${lang}-${st.id}-p.png`;
        await page.locator(`[data-id="${st.id}"]`).screenshot({path: shot});
        const ref = `${MK}/${lang}/${st.id}.jpg`;
        execFileSync('ffmpeg', ['-loglevel', 'error', '-y', '-i', ref, '-i', shot, '-filter_complex',
          '[0]scale=540:-2[a];[1]scale=540:-2[b];[a][b]hstack,format=yuv420p', '-q:v', '4', `${OUT}/cmp/${lang}-${st.id}.jpg`]);
        fs.rmSync(shot);
      }
      // посты: сравнение с готовыми картинками из marketing/social (если уже собраны ./render-social.sh)
      const SOC = path.resolve('../../../marketing/social/2026-11-12', lang);
      const NN = (i) => String(i + 1).padStart(2, '0');
      const refs = [
        (fr, i) => `${SOC}/covers/${NN(i)}-cover-${fr.name.split('Reels ')[1]}-${lang}.jpg`,
        (fr, i) => `${SOC}/carousel/${NN(i)}-melbus-carousel-${lang}.jpg`,
        (fr, i) => `${SOC}/carousel-hours/${NN(i)}-melbus-hours-${lang}.jpg`,
        (fr, i) => `${SOC}/${i === 0 ? 'og-1200x630' : 'cover-facebook-1640x624'}.jpg`,
      ];
      for (const [si, sec] of SPEC.posts[lang].entries()) for (const [i, fr] of sec.frames.entries()) {
        const ref = refs[si](fr, i);
        if (!fs.existsSync(ref)) continue;
        const shot = `${OUT}/cmp/${lang}-P${si}-${i}-p.png`;
        await page.locator(`[data-id="P${si}-${i}"]`).screenshot({path: shot});
        execFileSync('ffmpeg', ['-loglevel', 'error', '-y', '-i', ref, '-i', shot, '-filter_complex',
          '[0]scale=540:-2[a];[1]scale=540:-2[b];[a][b]hstack,format=yuv420p', '-q:v', '4', `${OUT}/cmp/${lang}-P${si}-${i}.jpg`]);
        fs.rmSync(shot);
      }
    }
  }
  await browser.close();

  // 4) плагин-импортёр
  fs.rmSync(PLUGIN, {recursive: true, force: true});
  fs.mkdirSync(PLUGIN, {recursive: true});
  const IMG = {};
  for (const k of Object.keys(SPEC.images)) IMG[k] = fs.readFileSync(`${OUT}/img/${k}.jpg`).toString('base64');
  IMG.logo = fs.readFileSync(`${OUT}/img/logo.png`).toString('base64');
  IMG.mark = fs.readFileSync(`${OUT}/img/mark.png`).toString('base64');
  const code = `// MELBUS — сторис «Дневник запуска» → Figma. Собрано ${SPEC.version} скриптом tools/film/remotion/scripts/figma-build.cjs\n`
    + `const SPEC = ${JSON.stringify(SPEC)};\nconst METRICS = ${JSON.stringify(METRICS)};\nconst IMG = ${JSON.stringify(IMG)};\n`
    + fs.readFileSync('scripts/figma-plugin.js', 'utf8');
  fs.writeFileSync(`${PLUGIN}/code.js`, code);
  fs.writeFileSync(`${PLUGIN}/manifest.json`, JSON.stringify({
    name: 'MELBUS — сторис (импорт)', id: 'melbus-stories-import', api: '1.0.0', main: 'code.js',
    editorType: ['figma'], documentAccess: 'dynamic-page', networkAccess: {allowedDomains: ['none']},
  }, null, 2));
  fs.copyFileSync('scripts/figma-README.txt', `${PLUGIN}/КАК ОТКРЫТЬ.txt`);
  fs.rmSync(ZIP, {force: true});
  execFileSync('zip', ['-qr', ZIP, path.basename(PLUGIN)], {cwd: OUT});
  console.log(`плагин: ${(fs.statSync(`${PLUGIN}/code.js`).size / 1e6).toFixed(1)} МБ → ${ZIP}`);
})().catch((e) => { console.error(e); process.exit(1); });
