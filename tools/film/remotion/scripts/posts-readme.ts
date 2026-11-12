// Собирает инструкцию для выкладки (README) из posts.ts — все языки из одного места.
import {POSTS} from '../src/social/posts';
import {LANGS} from '../src/social/texts';

const NAMES = {ru: 'Русский', pl: 'Polski', uk: 'Українська', en: 'English'} as const;
const out: string[] = [];
out.push('# Пакет для соцсетей №1 — 12.11.2026 (RU · PL · UK · EN)', '');
out.push('Собрано в Remotion из готового материала (фильм, 3 ролика, кадры, настоящий логотип, шрифты сайта) — без новой генерации.');
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
out.push('- Порядок: Reels-фильм → карусель → «Цена по видео» → «Аккуратность» → «Только ваши вещи», по одному в 1–2 дня.');
out.push('- Профиль: `profile/avatar.jpg` (аватар), `profile/highlights/element-0…4.jpeg` (обложки «Актуального»: цена, коробки, аккуратность, бус, вопросы), `<язык>/cover-facebook-1640x624.jpg`.', '');
for (const lang of LANGS) {
  out.push(`## ${NAMES[lang]} (${lang})`, '');
  POSTS.forEach((p, i) => {
    out.push(`**${i + 1}. ${p.title[lang]}** — \`${lang}/${p.file.replace('<lang>', lang)}\``);
    out.push('> ' + p.text[lang].split('\n').join('\n> '));
    out.push('> ' + p.tags[lang], '');
  });
}
console.log(out.join('\n'));
