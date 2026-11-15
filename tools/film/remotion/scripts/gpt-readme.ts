// Инструкция «Подсказки для ChatGPT» (marketing/gpt/README.md) из gptbank.ts — не править README руками:
//   npx tsx scripts/gpt-readme.ts > ../../../marketing/gpt/README.md   (делает и ./render-gpt.sh)
import {existsSync} from 'node:fs';
import {GPT_POSTS, GPT_RUBRICS, GPT_STYLE} from '../src/social/gptbank';
import {LANGS} from '../src/social/texts';

const M = '../../../marketing/gpt';
const has = (id: string) => ['jpg', 'jpeg', 'png', 'webp'].some((e) => existsSync(`${M}/${id}.${e}`));
const out: string[] = [];
const p = (x = '') => out.push(x);

p('# Подсказки для ChatGPT — посты на 6 недель (25.11.2026 – 4.01.2027)');
p();
p('> Собирается из `tools/film/remotion/src/social/gptbank.ts` (тексты сразу на 4 языках). Не править руками.');
p();
p('## Как сделать картинку (бесплатно, в вашем ChatGPT)');
p('1. Откройте ChatGPT → новый чат → прикрепите логотип `brand/export/MELBUS_logo_na_belom.png`.');
p('2. Вставьте **общий стиль** (ниже) и сразу за ним **подсказку** нужного поста. Попросите вертикальную картинку 2:3.');
p('3. Проверьте: логотип не кривой и только на коробке/предмете (не «водяным знаком»), коробки белые, нет лиц и лишних рук, нет надписей-каракулей. Если что-то не так — напишите ChatGPT «переделай: …» (например, «убери логотип с пола», «коробки только белые»).');
p('4. Скачайте и сохраните как `marketing/gpt/<id>.jpg` (id — в заголовке поста, например `dishes.jpg`). Или просто пришлите картинку Claude с подписью id.');
p('5. `cd tools/film/remotion && ./render-gpt.sh` (или попросите Claude) → готовые пост 4:5 и сторис 9:16 на 4 языках: `marketing/gpt/<язык>/post-NN-<id>-<язык>.jpg`, `story-NN-<id>-<язык>.jpg`.');
p('6. Публикуя: подпись — ниже (на нужном языке), включите метку Instagram «Создано с помощью ИИ». На картинках уже стоит «Визуализация».');
p();
p('**Общий стиль (вставлять перед каждой подсказкой):**');
p('```');
p(GPT_STYLE);
p('```');
p();
p('## План');
p('| № | Дата | Рубрика | id | Что на картинке | Картинка |');
p('|---|---|---|---|---|---|');
GPT_POSTS.forEach((g, i) => p(`| ${i + 1} | ${g.date} | ${GPT_RUBRICS[g.rubric].ru} | \`${g.id}\` | ${g.what} | ${has(g.id) ? '✅ есть' : '— нет'} |`));
p();
GPT_POSTS.forEach((g, i) => {
  p(`## ${i + 1}. ${g.date} · ${g.title.ru} — \`${g.id}\``);
  p(`${GPT_RUBRICS[g.rubric].ru} · ${g.what}${g.check ? `\n\n⚠️ **Сверить перед публикацией:** ${g.check}` : ''}`);
  p();
  p('**Подсказка:**');
  p('```');
  p(g.prompt);
  p('```');
  p('**Надпись на картинке:** ' + LANGS.map((L) => `${L.toUpperCase()}: «${g.title[L]}» — ${g.sub[L]}`).join(' · '));
  p();
  for (const L of LANGS) {
    p(`**Подпись ${L.toUpperCase()}:**`);
    p('> ' + g.caption[L].split('\n').join('\n> '));
    p('> ' + g.tags[L]);
    p();
  }
});
console.log(out.join('\n'));
