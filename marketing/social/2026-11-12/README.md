# Пакет для соцсетей №1 — 12.11.2026 (RU · PL · UK · EN)

Собрано в Remotion из готового материала (фильм, 3 ролика, кадры, настоящий логотип, шрифты сайта) — без новой генерации.

**Где менять тексты (сразу на всех языках):**
- надписи в роликах и картинках — `tools/film/remotion/src/social/texts.ts`;
- подписи к публикациям — `tools/film/remotion/src/social/posts.ts` (этот файл собирается из него: `npx tsx scripts/posts-readme.ts`).
Каждая фраза записана сразу на 4 языках; если язык пропущен — сборка выдаёт ошибку.

**Пересобрать всё:** `cd tools/film/remotion && ./render-social.sh` (или только нужные языки: `./render-social.sh pl uk`).
Ролики (MP4 1080×1920, без звука) в git не кладём — тяжёлые; картинки лежат здесь по папкам языков.

## Как публиковать
- Музыку добавлять в самом Instagram/TikTok из их библиотеки — законно, и алгоритм любит трендовые звуки.
- Включить отметку ИИ: Instagram/Facebook — «Создано с помощью ИИ», TikTok — «AI-generated content». В роликах уже есть надпись «Визуализация».
- Ссылка на сайт — в профиле (домен ещё не финальный).
- Порядок: Reels-фильм → карусель → «Цена по видео» → «Аккуратность» → «Только ваши вещи», по одному в 1–2 дня.
- Профиль: `profile/avatar.jpg` (аватар), `profile/highlights/1…5-*.jpg` (обложки «Актуального»: цена, коробки, аккуратность, бус, вопросы), `<язык>/cover-facebook-1640x624.jpg`.

## Русский (ru)

**1. Reels «Вся квартира — в одну коробку»** — `ru/melbus-ReelFilm-ru.mp4`
> Вся квартира — в одну коробку. Почти буквально 📦
> Снимаете квартиру на телефон — мы называем окончательную цену. Упакуем, перевезём и расставим всё по местам. Без доплат в день переезда.
> Варшава и 150 км вокруг · 7 дней в неделю · фактура VAT
> #переезд #переездваршава #варшава #польша #melbus

**2. Карусель «Переезд за 6 шагов»** — `ru/carousel/01…07-melbus-carousel-ru.jpg`
> Как проходит переезд с MELBUS — 6 шагов от видео на телефоне до последней собранной полки. Сохраните, чтобы не потерять 👇
> #переезд #варшава #какпереехать #melbus

**3. Reels «Цена по видео»** — `ru/melbus-ReelPrice-ru.mp4`
> Две-три минуты видео на телефон — и вы знаете окончательную цену переезда. В день переезда никаких «а тут ещё этаж».
> #переезд #ценапереезда #варшава #melbus

**4. Reels «Аккуратность, которую видно»** — `ru/melbus-ReelCare-ru.mp4`
> Чистые перчатки и бахилы — ещё до порога. Посуда — в бумагу, коробки — с перегородками. Вещи клиента — как свои.
> #переезд #упаковка #варшава #melbus

**5. Reels «Только ваши вещи»** — `ru/melbus-ReelVan-ru.mp4`
> Бус MELBUS везёт только ваши вещи — без перегрузок и попутных грузов. Варшава и 150 км вокруг, Польша и Европа — по запросу.
> #переезд #грузоперевозки #варшава #melbus

## Polski (pl)

**1. Reels „Całe mieszkanie w jednym kartonie”** — `pl/melbus-ReelFilm-pl.mp4`
> Całe mieszkanie w jednym kartonie. Prawie dosłownie 📦
> Nagrywasz mieszkanie telefonem — podajemy ostateczną cenę. Spakujemy, przewieziemy i ustawimy wszystko na miejscu. Bez dopłat w dniu przeprowadzki.
> Warszawa i 150 km wokół · 7 dni w tygodniu · faktura VAT
> #przeprowadzka #przeprowadzkawarszawa #warszawa #przeprowadzki #melbus

**2. Karuzela „Przeprowadzka w 6 krokach”** — `pl/carousel/01…07-melbus-carousel-pl.jpg`
> Jak wygląda przeprowadzka z MELBUS — 6 kroków od wideo z telefonu po ostatnią złożoną półkę. Zapisz, żeby nie zgubić 👇
> #przeprowadzka #warszawa #jaksieprzeprowadzic #melbus

**3. Reels „Cena z wideo”** — `pl/melbus-ReelPrice-pl.mp4`
> Dwie, trzy minuty wideo z telefonu — i znasz ostateczną cenę przeprowadzki. W dniu przeprowadzki żadnych „a tu jeszcze piętro”.
> #przeprowadzka #cenaprzeprowadzki #warszawa #melbus

**4. Reels „Staranność, którą widać”** — `pl/melbus-ReelCare-pl.mp4`
> Czyste rękawice i ochraniacze na buty — już od progu. Naczynia w papier, kartony z przegródkami. Rzeczy klienta — jak własne.
> #przeprowadzka #pakowanie #warszawa #melbus

**5. Reels „Tylko Twoje rzeczy”** — `pl/melbus-ReelVan-pl.mp4`
> Bus MELBUS wiezie tylko Twoje rzeczy — bez przeładunków i cudzych ładunków. Warszawa i 150 km wokół, Polska i Europa — na zapytanie.
> #przeprowadzka #transport #warszawa #melbus

## Українська (uk)

**1. Reels «Уся квартира — в одну коробку»** — `uk/melbus-ReelFilm-uk.mp4`
> Уся квартира — в одну коробку. Майже буквально 📦
> Знімаєте квартиру на телефон — ми називаємо остаточну ціну. Запакуємо, перевеземо й розставимо все по місцях. Без доплат у день переїзду.
> Варшава і 150 км довкола · 7 днів на тиждень · фактура VAT
> #переїзд #переїздваршава #варшава #польща #melbus

**2. Карусель «Переїзд за 6 кроків»** — `uk/carousel/01…07-melbus-carousel-uk.jpg`
> Як проходить переїзд із MELBUS — 6 кроків від відео на телефоні до останньої зібраної полиці. Збережіть, щоб не загубити 👇
> #переїзд #варшава #якпереїхати #melbus

**3. Reels «Ціна за відео»** — `uk/melbus-ReelPrice-uk.mp4`
> Дві-три хвилини відео на телефон — і ви знаєте остаточну ціну переїзду. У день переїзду жодних «а тут ще поверх».
> #переїзд #цінапереїзду #варшава #melbus

**4. Reels «Акуратність, яку видно»** — `uk/melbus-ReelCare-uk.mp4`
> Чисті рукавички й бахіли — ще до порога. Посуд — у папір, коробки — з перегородками. Речі клієнта — як свої.
> #переїзд #пакування #варшава #melbus

**5. Reels «Лише ваші речі»** — `uk/melbus-ReelVan-uk.mp4`
> Бус MELBUS везе лише ваші речі — без перевантажень і попутних вантажів. Варшава і 150 км довкола, Польща і Європа — за запитом.
> #переїзд #вантажоперевезення #варшава #melbus

## English (en)

**1. Reel “Your whole flat in one box”** — `en/melbus-ReelFilm-en.mp4`
> Your whole flat in one box. Almost literally 📦
> Film your flat on your phone — we give you the final price. We pack, move and put everything in place. No extra fees on moving day.
> Warsaw and 150 km around · 7 days a week · VAT invoice
> #moving #warsaw #movingtowarsaw #poland #melbus

**2. Carousel “Moving in 6 steps”** — `en/carousel/01…07-melbus-carousel-en.jpg`
> How a move with MELBUS works — 6 steps from a phone video to the last shelf assembled. Save it for later 👇
> #moving #warsaw #movingtips #melbus

**3. Reel “Price from a video”** — `en/melbus-ReelPrice-en.mp4`
> Two or three minutes of phone video — and you know the final price of your move. No “oh, there’s another floor” on moving day.
> #moving #movingcost #warsaw #melbus

**4. Reel “Care you can see”** — `en/melbus-ReelCare-en.mp4`
> Clean gloves and shoe covers before we step in. Dishes in paper, boxes with dividers. We treat your things as our own.
> #moving #packing #warsaw #melbus

**5. Reel “Only your things”** — `en/melbus-ReelVan-en.mp4`
> A MELBUS van carries only your things — no reloading, no other cargo. Warsaw and 150 km around, Poland and Europe on request.
> #moving #removals #warsaw #melbus

