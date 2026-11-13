// Собирает инструкцию для выкладки (README) из posts.ts — все языки из одного места.
import {POSTS} from '../src/social/posts';
import {LANGS} from '../src/social/texts';

const NAMES = {ru: 'Русский', pl: 'Polski', uk: 'Українська', en: 'English'} as const;
const out: string[] = [];
out.push('# Посты для профиля — 10 публикаций (RU · PL · UK · EN), 12–13.11.2026', '');
out.push('Собрано в Remotion из готового материала (фильм, ролики сайта и 5 роликов Higgsfield, настоящий логотип, шрифты сайта). 8 Reels + 2 карусели + обложки для всех Reels. Всё это (и сторис) можно править в Figma — `marketing/stories/2026-11/MELBUS-storis-figma.zip`.');
out.push('', '**Где менять тексты (сразу на всех языках):**');
out.push('- надписи в роликах и картинках — `tools/film/remotion/src/social/texts.ts`;');
out.push('- подписи к публикациям — `tools/film/remotion/src/social/posts.ts` (этот файл собирается из него: `npx tsx scripts/posts-readme.ts`).');
out.push('Каждая фраза записана сразу на 4 языках; если язык пропущен — сборка выдаёт ошибку.', '');
out.push('**Пересобрать всё:** `cd tools/film/remotion && ./render-social.sh` (или только нужные языки: `./render-social.sh pl uk`).');
out.push('Ролики (MP4 1080×1920, без звука) в git не кладём — тяжёлые; картинки лежат здесь по папкам языков.', '');
out.push('## Как публиковать');
out.push('- Музыку добавлять в самом Instagram/TikTok из их библиотеки — законно, и алгоритм любит трендовые звуки.');
out.push('- Включить отметку ИИ: Instagram/Facebook — «Создано с помощью ИИ», TikTok — «AI-generated content». В роликах уже есть надпись «Визуализация».');
out.push('- Ссылка на сайт — в профиле (домен ещё не финальный).');
out.push('- **Порядок и даты** (по одному посту в день; номер = порядок ниже): 14.11 — 1, 15.11 — 2, 16.11 — 3 … 23.11 — 10. Первые три — до старта сторис 16.11.');
out.push('- **Закрепить** (📌, в профиле наверху): ' + POSTS.map((p, i) => (p.pin ? `${i + 1}. ${p.title.ru}` : '')).filter(Boolean).join(' · ') + '.');
out.push('- **Обложки Reels**: при публикации → «Обложка» → «Добавить из фотоплёнки» → `<язык>/covers/NN-cover-…jpg` (номер указан у каждого ролика). Все обложки в одном стиле — сетка профиля выглядит цельно. Важное на обложке — в середине: сетка режет её до 3:4.');
out.push('- **Дальше (25.11 – 4.01)** — 16 постов из картинок ChatGPT: подсказки и подписи — `marketing/gpt/README.md` и страница с кнопками «Скопировать» (ссылка в CLAUDE.md).');
out.push('- **Как будет выглядеть сетка**: `profile/grid-<язык>.jpg` (закреплённые сверху, дальше — от новых к старым).');
out.push('- Профиль: `profile/avatar.jpg` (аватар), обложки «Актуального» — `marketing/stories/2026-11/highlights/` (9 шт., названия — в README сторис), `<язык>/cover-facebook-1640x624.jpg`, превью ссылки `<язык>/og-1200x630.jpg`.', '');
for (const lang of LANGS) {
  out.push(`## ${NAMES[lang]} (${lang})`, '');
  POSTS.forEach((p, i) => {
    out.push(`**${i + 1}. ${p.title[lang]}**${p.pin ? ' 📌' : ''} — \`${lang}/${p.file.replace('<lang>', lang)}\`` + (p.cover ? ` · обложка \`${lang}/covers/${p.cover}-${lang}.jpg\`` : ''));
    out.push('> ' + p.text[lang].split('\n').join('\n> '));
    out.push('> ' + p.tags[lang], '');
  });
}
console.log(out.join('\n'));
