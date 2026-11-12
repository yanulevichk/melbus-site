/**
 * ТЕКСТЫ К ПУБЛИКАЦИЯМ (подписи под постами) — каждый сразу на 4 языках.
 * Меняем подпись — меняем во всех языках. Инструкция для выкладки собирается отсюда:
 *   npx tsx scripts/posts-readme.ts > ../../../marketing/social/2026-11-12/README.md
 */
import type {L} from './texts';

export type Post = {file: string; title: L; text: L; tags: L};

export const POSTS: Post[] = [
  {
    file: 'melbus-ReelFilm-<lang>.mp4',
    title: {ru: 'Reels «Вся квартира — в одну коробку»', pl: 'Reels „Całe mieszkanie w jednym kartonie”', uk: 'Reels «Уся квартира — в одну коробку»', en: 'Reel “Your whole flat in one box”'},
    text: {
      ru: 'Вся квартира — в одну коробку. Почти буквально 📦\nСнимаете квартиру на телефон — мы называем окончательную цену. Упакуем, перевезём и расставим всё по местам. Без доплат в день переезда.\nВаршава и 150 км вокруг · 7 дней в неделю · фактура VAT',
      pl: 'Całe mieszkanie w jednym kartonie. Prawie dosłownie 📦\nNagrywasz mieszkanie telefonem — podajemy ostateczną cenę. Spakujemy, przewieziemy i ustawimy wszystko na miejscu. Bez dopłat w dniu przeprowadzki.\nWarszawa i 150 km wokół · 7 dni w tygodniu · faktura VAT',
      uk: 'Уся квартира — в одну коробку. Майже буквально 📦\nЗнімаєте квартиру на телефон — ми називаємо остаточну ціну. Запакуємо, перевеземо й розставимо все по місцях. Без доплат у день переїзду.\nВаршава і 150 км довкола · 7 днів на тиждень · фактура VAT',
      en: 'Your whole flat in one box. Almost literally 📦\nFilm your flat on your phone — we give you the final price. We pack, move and put everything in place. No extra fees on moving day.\nWarsaw and 150 km around · 7 days a week · VAT invoice',
    },
    tags: {ru: '#переезд #переездваршава #варшава #польша #melbus', pl: '#przeprowadzka #przeprowadzkawarszawa #warszawa #przeprowadzki #melbus', uk: '#переїзд #переїздваршава #варшава #польща #melbus', en: '#moving #warsaw #movingtowarsaw #poland #melbus'},
  },
  {
    file: 'carousel/element-0…6.jpeg',
    title: {ru: 'Карусель «Переезд за 6 шагов»', pl: 'Karuzela „Przeprowadzka w 6 krokach”', uk: 'Карусель «Переїзд за 6 кроків»', en: 'Carousel “Moving in 6 steps”'},
    text: {
      ru: 'Как проходит переезд с MELBUS — 6 шагов от видео на телефоне до последней собранной полки. Сохраните, чтобы не потерять 👇',
      pl: 'Jak wygląda przeprowadzka z MELBUS — 6 kroków od wideo z telefonu po ostatnią złożoną półkę. Zapisz, żeby nie zgubić 👇',
      uk: 'Як проходить переїзд із MELBUS — 6 кроків від відео на телефоні до останньої зібраної полиці. Збережіть, щоб не загубити 👇',
      en: 'How a move with MELBUS works — 6 steps from a phone video to the last shelf assembled. Save it for later 👇',
    },
    tags: {ru: '#переезд #варшава #какпереехать #melbus', pl: '#przeprowadzka #warszawa #jaksieprzeprowadzic #melbus', uk: '#переїзд #варшава #якпереїхати #melbus', en: '#moving #warsaw #movingtips #melbus'},
  },
  {
    file: 'melbus-ReelPrice-<lang>.mp4',
    title: {ru: 'Reels «Цена по видео»', pl: 'Reels „Cena z wideo”', uk: 'Reels «Ціна за відео»', en: 'Reel “Price from a video”'},
    text: {
      ru: 'Две-три минуты видео на телефон — и вы знаете окончательную цену переезда. В день переезда никаких «а тут ещё этаж».',
      pl: 'Dwie, trzy minuty wideo z telefonu — i znasz ostateczną cenę przeprowadzki. W dniu przeprowadzki żadnych „a tu jeszcze piętro”.',
      uk: 'Дві-три хвилини відео на телефон — і ви знаєте остаточну ціну переїзду. У день переїзду жодних «а тут ще поверх».',
      en: 'Two or three minutes of phone video — and you know the final price of your move. No “oh, there’s another floor” on moving day.',
    },
    tags: {ru: '#переезд #ценапереезда #варшава #melbus', pl: '#przeprowadzka #cenaprzeprowadzki #warszawa #melbus', uk: '#переїзд #цінапереїзду #варшава #melbus', en: '#moving #movingcost #warsaw #melbus'},
  },
  {
    file: 'melbus-ReelCare-<lang>.mp4',
    title: {ru: 'Reels «Аккуратность, которую видно»', pl: 'Reels „Staranność, którą widać”', uk: 'Reels «Акуратність, яку видно»', en: 'Reel “Care you can see”'},
    text: {
      ru: 'Чистые перчатки и бахилы — ещё до порога. Посуда — в бумагу, коробки — с перегородками. Вещи клиента — как свои.',
      pl: 'Czyste rękawice i ochraniacze na buty — już od progu. Naczynia w papier, kartony z przegródkami. Rzeczy klienta — jak własne.',
      uk: 'Чисті рукавички й бахіли — ще до порога. Посуд — у папір, коробки — з перегородками. Речі клієнта — як свої.',
      en: 'Clean gloves and shoe covers before we step in. Dishes in paper, boxes with dividers. We treat your things as our own.',
    },
    tags: {ru: '#переезд #упаковка #варшава #melbus', pl: '#przeprowadzka #pakowanie #warszawa #melbus', uk: '#переїзд #пакування #варшава #melbus', en: '#moving #packing #warsaw #melbus'},
  },
  {
    file: 'melbus-ReelVan-<lang>.mp4',
    title: {ru: 'Reels «Только ваши вещи»', pl: 'Reels „Tylko Twoje rzeczy”', uk: 'Reels «Лише ваші речі»', en: 'Reel “Only your things”'},
    text: {
      ru: 'Бус MELBUS везёт только ваши вещи — без перегрузок и попутных грузов. Варшава и 150 км вокруг, Польша и Европа — по запросу.',
      pl: 'Bus MELBUS wiezie tylko Twoje rzeczy — bez przeładunków i cudzych ładunków. Warszawa i 150 km wokół, Polska i Europa — na zapytanie.',
      uk: 'Бус MELBUS везе лише ваші речі — без перевантажень і попутних вантажів. Варшава і 150 км довкола, Польща і Європа — за запитом.',
      en: 'A MELBUS van carries only your things — no reloading, no other cargo. Warsaw and 150 km around, Poland and Europe on request.',
    },
    tags: {ru: '#переезд #грузоперевозки #варшава #melbus', pl: '#przeprowadzka #transport #warszawa #melbus', uk: '#переїзд #вантажоперевезення #варшава #melbus', en: '#moving #removals #warsaw #melbus'},
  },
];
