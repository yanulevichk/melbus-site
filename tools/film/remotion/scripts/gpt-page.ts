// Страница с подсказками для ChatGPT и кнопками «Скопировать» (для телефона): marketing/gpt/podskazki-chatgpt.html
//   npx tsx scripts/gpt-page.ts   (данные — src/social/gptbank.ts, сразу 4 языка)
import {readFileSync, writeFileSync, mkdirSync} from 'node:fs';
import {GPT_POSTS, GPT_RUBRICS, GPT_STYLE} from '../src/social/gptbank';

const data = GPT_POSTS.map((g, i) => ({
  n: i + 1, id: g.id, date: g.date, rubric: GPT_RUBRICS[g.rubric].ru, what: g.what, prompt: g.prompt, check: g.check ?? '',
  title: g.title, sub: g.sub, caption: g.caption, tags: g.tags,
}));
const LOGO = 'data:image/png;base64,' + readFileSync('../../../brand/export/MELBUS_logo_na_belom.png').toString('base64');
const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');

const html = `<title>Подсказки MELBUS для ChatGPT</title>
<meta name="claude:viewport-fit-sides" content="cover">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Onest:wght@400;500;600&family=Unbounded:wght@300;400&display=swap">
<style>
/* Лента карточек на одну колонку (телефон), до 760px; бирюза — только «скотч»: линии и главная кнопка */
:root {
  --bg: #F4F6F8; --surface: #FFFFFF; --fg: #10161D; --muted: #5A6672; --line: #DCE1E7;
  --tape: #14DCD5; --accent: #077E79; --on-tape: #10161D; --warn-bg: #FFF4E0; --warn-fg: #7A4B00;
  --display: "Unbounded", "Arial Black", system-ui, sans-serif; --text: "Onest", system-ui, -apple-system, sans-serif;
}
@media (prefers-color-scheme: dark) { :root:not([data-theme="light"]) {
  --bg: #10161D; --surface: #18212A; --fg: #F1F4F7; --muted: #9AA6B2; --line: #2A3540; --accent: #14DCD5; --warn-bg: #3A2C12; --warn-fg: #F6C770; color-scheme: dark } }
:root[data-theme="dark"] { --bg: #10161D; --surface: #18212A; --fg: #F1F4F7; --muted: #9AA6B2; --line: #2A3540; --accent: #14DCD5; --warn-bg: #3A2C12; --warn-fg: #F6C770; color-scheme: dark }
* { box-sizing: border-box }
body { background: var(--bg); color: var(--fg); font: 16px/1.5 var(--text); margin: 0;
  padding-left: max(16px, env(safe-area-inset-left, 0px)); padding-right: max(16px, env(safe-area-inset-right, 0px)); padding-block: 28px 56px }
.wrap { max-width: 760px; margin: 0 auto; display: grid; gap: 18px }
h1 { font: 300 clamp(28px, 7vw, 44px)/1.05 var(--display); letter-spacing: -0.04em; margin: 0; text-wrap: balance }
h2 { font: 400 20px/1.2 var(--display); letter-spacing: -0.02em; margin: 0; text-wrap: balance }
.tape { width: 96px; height: 4px; background: var(--tape) }
.lead { color: var(--muted); margin: 0; max-width: 62ch }
ol.steps { margin: 0; padding-left: 1.3em; display: grid; gap: 6px }
.card { background: var(--surface); border: 1px solid var(--line); border-radius: 6px; padding: 18px; display: grid; gap: 12px; min-width: 0 }
.meta { display: flex; flex-wrap: wrap; gap: 8px; align-items: center; font-size: 13px; color: var(--muted) }
.chip { border: 1px solid var(--line); border-radius: 99px; padding: 2px 10px; font-weight: 500; color: var(--fg) }
.num { font: 400 13px var(--display); color: var(--accent); font-variant-numeric: tabular-nums }
code.id { font: 500 13px ui-monospace, Menlo, monospace; background: var(--bg); border: 1px solid var(--line); border-radius: 4px; padding: 1px 6px }
.what { margin: 0; color: var(--muted) }
details { border-top: 1px solid var(--line); padding-top: 10px }
summary { cursor: pointer; font-weight: 500; color: var(--accent) }
pre { white-space: pre-wrap; word-break: break-word; font: 13px/1.5 ui-monospace, Menlo, monospace; background: var(--bg); border: 1px solid var(--line); border-radius: 4px; padding: 10px; margin: 8px 0 0; max-height: 280px; overflow: auto }
.over { font-size: 14px; margin: 0 }
.over b { font-weight: 600 }
.cap { white-space: pre-line; font-size: 15px; margin: 0 }
.tags { color: var(--accent); font-size: 14px; margin: 0 }
.btns { display: flex; flex-wrap: wrap; gap: 8px }
button { font: 600 15px var(--text); border-radius: 3px; padding: 10px 14px; cursor: pointer; border: 1px solid var(--line); background: transparent; color: var(--fg) }
button.main { background: var(--tape); border-color: var(--tape); color: var(--on-tape) }
button:focus-visible { outline: 3px solid var(--accent); outline-offset: 2px }
button.done { border-color: var(--accent) }
.warn { background: var(--warn-bg); color: var(--warn-fg); border-radius: 4px; padding: 8px 10px; font-size: 14px; margin: 0 }
.langs { display: flex; gap: 6px; flex-wrap: wrap; align-items: center }
.langs button { padding: 6px 12px; font-size: 14px }
.langs button[aria-pressed="true"] { background: var(--fg); color: var(--bg); border-color: var(--fg) }
.bar { position: sticky; top: env(safe-area-inset-top, 0px); z-index: 5; background: var(--bg); padding-block: 10px; border-bottom: 1px solid var(--line) }
body::before { content: ""; position: fixed; inset: 0 0 auto; height: env(safe-area-inset-top, 0px); z-index: 10; background: var(--bg) }
textarea.fallback { width: 100%; min-height: 120px; font: 13px ui-monospace, Menlo, monospace }
@media (prefers-reduced-motion: no-preference) { button { transition: background .15s, border-color .15s } }
</style>
<div class="wrap">
  <header style="display:grid;gap:14px">
    <h1>Подсказки MELBUS для ChatGPT</h1>
    <div class="tape"></div>
    <p class="lead">16 постов на 6 недель: 25.11.2026 – 4.01.2027, по понедельникам, средам и пятницам. Для каждого: подсказка для картинки и подпись к посту на 4 языках.</p>
  </header>
  <section class="card" aria-labelledby="how">
    <h2 id="how">Как сделать картинку</h2>
    <ol class="steps">
      <li>В ChatGPT откройте новый чат и прикрепите логотип <code class="id">MELBUS_logo_na_belom.png</code>.</li>
      <li>Нажмите «Скопировать подсказку» у нужного поста и вставьте в чат. Стиль уже внутри.</li>
      <li>Проверьте: логотип ровный и только на коробке, коробки белые, нет лиц, лишних рук и надписей-каракулей. Если что-то не так, напишите ChatGPT «переделай: …».</li>
      <li>Пришлите картинку Claude с подписью <code class="id">id</code> (например, dishes). Он соберёт пост 4:5 и сторис 9:16 на 4 языках с надписями.</li>
      <li>При публикации вставьте подпись на нужном языке и включите метку «Создано с помощью ИИ».</li>
    </ol>
    <figure style="margin:0;display:grid;gap:6px"><img src="${LOGO}" alt="Логотип MELBUS на белом — образец для ChatGPT" style="width:100%;max-width:420px;border:1px solid var(--line);border-radius:4px;background:#fff">
      <figcaption style="font-size:13px;color:var(--muted)">Логотип для шага 1: на телефоне нажмите на него и удерживайте → «Сохранить изображение».</figcaption></figure>
    <details><summary>Общий стиль (уже входит в каждую подсказку)</summary><pre>${esc(GPT_STYLE)}</pre></details>
  </section>
  <div class="bar">
    <div class="langs" role="group" aria-label="Язык подписи">
      <span style="color:var(--muted);font-size:14px">Язык подписи:</span>
      <button type="button" data-lang="pl">PL</button><button type="button" data-lang="ru">RU</button><button type="button" data-lang="uk">UK</button><button type="button" data-lang="en">EN</button>
    </div>
  </div>
  <div id="list" class="wrap" style="gap:14px"></div>
  <p class="lead">Источник — <code class="id">tools/film/remotion/src/social/gptbank.ts</code>; меняем фразу сразу на всех 4 языках.</p>
</div>
<script>
const STYLE = ${JSON.stringify(GPT_STYLE)};
const POSTS = ${JSON.stringify(data)};
let lang = 'pl';
try { lang = localStorage.getItem('melbus-gpt-lang') || 'pl'; } catch (e) {}
const list = document.getElementById('list');
const el = (tag, cls, text) => { const e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; };
async function copy(btn, text) {
  const label = btn.textContent;
  try { await navigator.clipboard.writeText(text); btn.textContent = 'Скопировано'; btn.classList.add('done'); }
  catch (e) {
    const ta = el('textarea', 'fallback'); ta.value = text; ta.readOnly = true;
    btn.parentElement.after(ta); ta.focus(); ta.select(); btn.textContent = 'Текст выделен — скопируйте вручную';
  }
  setTimeout(() => { btn.textContent = label; btn.classList.remove('done'); }, 2200);
}
function render() {
  document.querySelectorAll('.langs button').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.lang === lang)));
  list.replaceChildren();
  for (const p of POSTS) {
    const c = el('article', 'card');
    const m = el('div', 'meta');
    m.append(el('span', 'num', String(p.n).padStart(2, '0')), el('span', 'chip', p.date), el('span', 'chip', p.rubric));
    const id = el('code', 'id', p.id); m.append(id);
    c.append(m, el('h2', null, p.title.ru), el('p', 'what', p.what));
    if (p.check) c.append(el('p', 'warn', 'Сверить перед публикацией: ' + p.check));
    const b = el('div', 'btns');
    const b1 = el('button', 'main', 'Скопировать подсказку'); b1.type = 'button'; b1.onclick = () => copy(b1, STYLE + '\\n\\nScene: ' + p.prompt);
    const b2 = el('button', null, 'Скопировать подпись ' + lang.toUpperCase()); b2.type = 'button'; b2.onclick = () => copy(b2, p.caption[lang] + '\\n\\n' + p.tags[lang]);
    b.append(b1, b2); c.append(b);
    const d1 = el('details'); d1.append(el('summary', null, 'Подсказка для картинки'), el('pre', null, p.prompt)); c.append(d1);
    const d2 = el('details'); d2.append(el('summary', null, 'Надпись на картинке и подпись (' + lang.toUpperCase() + ')'));
    const o = el('p', 'over'); o.append(el('b', null, p.title[lang]), document.createTextNode(' — ' + p.sub[lang]));
    d2.append(o, el('p', 'cap', p.caption[lang]), el('p', 'tags', p.tags[lang])); c.append(d2);
    list.append(c);
  }
}
document.querySelectorAll('.langs button').forEach((b) => b.addEventListener('click', () => {
  lang = b.dataset.lang; try { localStorage.setItem('melbus-gpt-lang', lang); } catch (e) {} render();
}));
render();
</script>
`;
mkdirSync('../../../marketing/gpt', {recursive: true});
writeFileSync('../../../marketing/gpt/podskazki-chatgpt.html', html);
console.log('marketing/gpt/podskazki-chatgpt.html', (html.length / 1024).toFixed(0) + ' КБ');
