# Посты для профиля — 10 публикаций (RU · PL · UK · EN), 12–13.11.2026

Собрано в Remotion из готового материала (фильм, ролики сайта и 5 роликов Higgsfield, настоящий логотип, шрифты сайта). 8 Reels + 2 карусели + обложки для всех Reels. Всё это (и сторис) можно править в Figma — `marketing/stories/2026-11/MELBUS-storis-figma.zip`.

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
- **Порядок и даты** (по одному посту в день; номер = порядок ниже): 14.11 — 1, 15.11 — 2, 16.11 — 3 … 23.11 — 10. Первые три — до старта сторис 16.11.
- **Закрепить** (📌, в профиле наверху): 1. Reels «Вся квартира — в одну коробку» · 2. Карусель «Переезд за 6 шагов» · 6. Карусель «Мы не продаём часы».
- **Обложки Reels**: при публикации → «Обложка» → «Добавить из фотоплёнки» → `<язык>/covers/NN-cover-…jpg` (номер указан у каждого ролика). Все обложки в одном стиле — сетка профиля выглядит цельно. Важное на обложке — в середине: сетка режет её до 3:4.
- **Как будет выглядеть сетка**: `profile/grid-<язык>.jpg` (закреплённые сверху, дальше — от новых к старым).
- Профиль: `profile/avatar.jpg` (аватар), обложки «Актуального» — `marketing/stories/2026-11/highlights/` (9 шт., названия — в README сторис), `<язык>/cover-facebook-1640x624.jpg`, превью ссылки `<язык>/og-1200x630.jpg`.

## Русский (ru)

**1. Reels «Вся квартира — в одну коробку»** 📌 — `ru/melbus-ReelFilm-ru.mp4` · обложка `ru/covers/01-cover-Film-ru.jpg`
> Вся квартира — в одну коробку. Почти буквально 📦
> Снимаете квартиру на телефон — мы называем окончательную цену. Упакуем, перевезём и расставим всё по местам. Без доплат в день переезда.
> Варшава и 150 км вокруг · 7 дней в неделю · фактура VAT
> #переезд #переездваршава #варшава #польша #melbus

**2. Карусель «Переезд за 6 шагов»** 📌 — `ru/carousel/01…07-melbus-carousel-ru.jpg`
> Как проходит переезд с MELBUS — 6 шагов от видео на телефоне до последней собранной полки. Сохраните, чтобы не потерять 👇
> #переезд #варшава #какпереехать #melbus

**3. Reels «Цена по видео»** — `ru/melbus-ReelPrice-ru.mp4` · обложка `ru/covers/02-cover-Price-ru.jpg`
> Две-три минуты видео на телефон — и вы знаете окончательную цену переезда. В день переезда никаких «а тут ещё этаж».
> #переезд #ценапереезда #варшава #melbus

**4. Reels «Аккуратность, которую видно»** — `ru/melbus-ReelCare-ru.mp4` · обложка `ru/covers/03-cover-Care-ru.jpg`
> Чистые перчатки и бахилы — ещё до порога. Посуда — в бумагу, коробки — с перегородками. Вещи клиента — как свои.
> #переезд #упаковка #варшава #melbus

**5. Reels «Только ваши вещи»** — `ru/melbus-ReelVan-ru.mp4` · обложка `ru/covers/04-cover-Van-ru.jpg`
> Бус MELBUS везёт только ваши вещи — без перегрузок и попутных грузов. Варшава и 150 км вокруг, Польша и Европа — по запросу.
> #переезд #грузоперевозки #варшава #melbus

**6. Карусель «Мы не продаём часы»** 📌 — `ru/carousel-hours/01…05-melbus-hours-ru.jpg`
> Почему мы не берём оплату за часы? У почасовой фирмы медленная работа — это больше денег. У нас цена за весь переезд известна заранее — и бригаде выгодно работать быстро и аккуратно. Листайте 👉 и сохраните, чтобы сравнить с другими предложениями.
> #переезд #ценапереезда #варшава #melbus

**7. Reels «Цену запечатываем»** — `ru/melbus-ReelSeal-ru.mp4` · обложка `ru/covers/05-cover-Seal-ru.jpg`
> Цену запечатываем, как коробку: что приняли в оферте — то и платите. Изменения — только с вашего согласия и до начала работ.
> #переезд #фиксированнаяцена #варшава #melbus

**8. Reels «Каждая коробка знает, что в ней»** — `ru/melbus-ReelQr-ru.mp4` · обложка `ru/covers/06-cover-Qr-ru.jpg`
> Каждая коробка знает, что в ней. Цвет наклейки — комната, номер — коробка, а QR — список вещей внутри. В новом доме распаковка идёт по комнатам, без поисков.
> #переезд #упаковка #порядок #melbus

**9. Reels «Одежда на вешалках»** — `ru/melbus-ReelWardrobe-ru.mp4` · обложка `ru/covers/08-cover-Wardrobe-ru.jpg`
> Рубашки и платья едут на вешалках — в гардеробных коробках со штангой. Из шкафа — сразу в коробку, из коробки — сразу в шкаф. И ничего не мнётся.
> #переезд #упаковка #гардероб #melbus

**10. Reels «Коробка первой ночи» (совет)** — `ru/melbus-ReelFirstNight-ru.mp4` · обложка `ru/covers/07-cover-FirstNight-ru.jpg`
> Совет перед переездом: соберите «коробку первой ночи». Чайник, кружки, зарядки, постельное, аптечка — она едет последней и открывается первой. Сохраните, чтобы не забыть 📦
> #переезд #советы #новоселье #melbus

## Polski (pl)

**1. Reels „Całe mieszkanie w jednym kartonie”** 📌 — `pl/melbus-ReelFilm-pl.mp4` · обложка `pl/covers/01-cover-Film-pl.jpg`
> Całe mieszkanie w jednym kartonie. Prawie dosłownie 📦
> Nagrywasz mieszkanie telefonem — podajemy ostateczną cenę. Spakujemy, przewieziemy i ustawimy wszystko na miejscu. Bez dopłat w dniu przeprowadzki.
> Warszawa i 150 km wokół · 7 dni w tygodniu · faktura VAT
> #przeprowadzka #przeprowadzkawarszawa #warszawa #przeprowadzki #melbus

**2. Karuzela „Przeprowadzka w 6 krokach”** 📌 — `pl/carousel/01…07-melbus-carousel-pl.jpg`
> Jak wygląda przeprowadzka z MELBUS — 6 kroków od wideo z telefonu po ostatnią złożoną półkę. Zapisz, żeby nie zgubić 👇
> #przeprowadzka #warszawa #jaksieprzeprowadzic #melbus

**3. Reels „Cena z wideo”** — `pl/melbus-ReelPrice-pl.mp4` · обложка `pl/covers/02-cover-Price-pl.jpg`
> Dwie, trzy minuty wideo z telefonu — i znasz ostateczną cenę przeprowadzki. W dniu przeprowadzki żadnych „a tu jeszcze piętro”.
> #przeprowadzka #cenaprzeprowadzki #warszawa #melbus

**4. Reels „Staranność, którą widać”** — `pl/melbus-ReelCare-pl.mp4` · обложка `pl/covers/03-cover-Care-pl.jpg`
> Czyste rękawice i ochraniacze na buty — już od progu. Naczynia w papier, kartony z przegródkami. Rzeczy klienta — jak własne.
> #przeprowadzka #pakowanie #warszawa #melbus

**5. Reels „Tylko Twoje rzeczy”** — `pl/melbus-ReelVan-pl.mp4` · обложка `pl/covers/04-cover-Van-pl.jpg`
> Bus MELBUS wiezie tylko Twoje rzeczy — bez przeładunków i cudzych ładunków. Warszawa i 150 km wokół, Polska i Europa — na zapytanie.
> #przeprowadzka #transport #warszawa #melbus

**6. Karuzela „Nie sprzedajemy godzin”** 📌 — `pl/carousel-hours/01…05-melbus-hours-pl.jpg`
> Dlaczego nie liczymy za godziny? W firmie liczącej za godzinę wolna praca to wyższy rachunek. U nas cenę za całą przeprowadzkę znasz z góry — a ekipie opłaca się pracować szybko i starannie. Przesuń 👉 i zapisz, żeby porównać z innymi ofertami.
> #przeprowadzka #cenaprzeprowadzki #warszawa #melbus

**7. Reels „Cenę zaklejamy”** — `pl/melbus-ReelSeal-pl.mp4` · обложка `pl/covers/05-cover-Seal-pl.jpg`
> Cenę zaklejamy jak karton: płacisz tyle, ile przyjąłeś w ofercie. Zmiany — tylko za Twoją zgodą i przed rozpoczęciem pracy.
> #przeprowadzka #cenaprzeprowadzki #warszawa #melbus

**8. Reels „Każdy karton wie, co ma w środku”** — `pl/melbus-ReelQr-pl.mp4` · обложка `pl/covers/06-cover-Qr-pl.jpg`
> Każdy karton wie, co ma w środku. Kolor naklejki to pokój, numer to karton, a QR to lista rzeczy w środku. W nowym domu rozpakowujesz pokój po pokoju, bez szukania.
> #przeprowadzka #pakowanie #porządek #melbus

**9. Reels „Ubrania na wieszakach”** — `pl/melbus-ReelWardrobe-pl.mp4` · обложка `pl/covers/08-cover-Wardrobe-pl.jpg`
> Koszule i sukienki jadą na wieszakach — w kartonach garderobianych z drążkiem. Z szafy prosto do kartonu, z kartonu prosto do szafy. I nic się nie gniecie.
> #przeprowadzka #pakowanie #garderoba #melbus

**10. Reels „Karton pierwszej nocy” (porada)** — `pl/melbus-ReelFirstNight-pl.mp4` · обложка `pl/covers/07-cover-FirstNight-pl.jpg`
> Porada przed przeprowadzką: spakuj „karton pierwszej nocy”. Czajnik, kubki, ładowarki, pościel, apteczka — jedzie ostatni, otwierasz go pierwszy. Zapisz, żeby nie zapomnieć 📦
> #przeprowadzka #porady #nowemieszkanie #melbus

## Українська (uk)

**1. Reels «Уся квартира — в одну коробку»** 📌 — `uk/melbus-ReelFilm-uk.mp4` · обложка `uk/covers/01-cover-Film-uk.jpg`
> Уся квартира — в одну коробку. Майже буквально 📦
> Знімаєте квартиру на телефон — ми називаємо остаточну ціну. Запакуємо, перевеземо й розставимо все по місцях. Без доплат у день переїзду.
> Варшава і 150 км довкола · 7 днів на тиждень · фактура VAT
> #переїзд #переїздваршава #варшава #польща #melbus

**2. Карусель «Переїзд за 6 кроків»** 📌 — `uk/carousel/01…07-melbus-carousel-uk.jpg`
> Як проходить переїзд із MELBUS — 6 кроків від відео на телефоні до останньої зібраної полиці. Збережіть, щоб не загубити 👇
> #переїзд #варшава #якпереїхати #melbus

**3. Reels «Ціна за відео»** — `uk/melbus-ReelPrice-uk.mp4` · обложка `uk/covers/02-cover-Price-uk.jpg`
> Дві-три хвилини відео на телефон — і ви знаєте остаточну ціну переїзду. У день переїзду жодних «а тут ще поверх».
> #переїзд #цінапереїзду #варшава #melbus

**4. Reels «Акуратність, яку видно»** — `uk/melbus-ReelCare-uk.mp4` · обложка `uk/covers/03-cover-Care-uk.jpg`
> Чисті рукавички й бахіли — ще до порога. Посуд — у папір, коробки — з перегородками. Речі клієнта — як свої.
> #переїзд #пакування #варшава #melbus

**5. Reels «Лише ваші речі»** — `uk/melbus-ReelVan-uk.mp4` · обложка `uk/covers/04-cover-Van-uk.jpg`
> Бус MELBUS везе лише ваші речі — без перевантажень і попутних вантажів. Варшава і 150 км довкола, Польща і Європа — за запитом.
> #переїзд #вантажоперевезення #варшава #melbus

**6. Карусель «Ми не продаємо години»** 📌 — `uk/carousel-hours/01…05-melbus-hours-uk.jpg`
> Чому ми не беремо оплату за години? У погодинної фірми повільна робота — це більше грошей. У нас ціна за весь переїзд відома заздалегідь — і бригаді вигідно працювати швидко й акуратно. Гортайте 👉 і збережіть, щоб порівняти з іншими пропозиціями.
> #переїзд #цінапереїзду #варшава #melbus

**7. Reels «Ціну запечатуємо»** — `uk/melbus-ReelSeal-uk.mp4` · обложка `uk/covers/05-cover-Seal-uk.jpg`
> Ціну запечатуємо, як коробку: що прийняли в оферті — те й платите. Зміни — лише з вашої згоди й до початку робіт.
> #переїзд #фіксованаціна #варшава #melbus

**8. Reels «Кожна коробка знає, що в ній»** — `uk/melbus-ReelQr-uk.mp4` · обложка `uk/covers/06-cover-Qr-uk.jpg`
> Кожна коробка знає, що в ній. Колір наліпки — кімната, номер — коробка, а QR — список речей усередині. У новому домі розпакування йде по кімнатах, без пошуків.
> #переїзд #пакування #порядок #melbus

**9. Reels «Одяг на вішаках»** — `uk/melbus-ReelWardrobe-uk.mp4` · обложка `uk/covers/08-cover-Wardrobe-uk.jpg`
> Сорочки й сукні їдуть на вішаках — у гардеробних коробках зі штангою. Із шафи — одразу в коробку, з коробки — одразу в шафу. І нічого не мнеться.
> #переїзд #пакування #гардероб #melbus

**10. Reels «Коробка першої ночі» (порада)** — `uk/melbus-ReelFirstNight-uk.mp4` · обложка `uk/covers/07-cover-FirstNight-uk.jpg`
> Порада перед переїздом: зберіть «коробку першої ночі». Чайник, кружки, зарядки, постіль, аптечка — вона їде останньою й відкривається першою. Збережіть, щоб не забути 📦
> #переїзд #поради #новосілля #melbus

## English (en)

**1. Reel “Your whole flat in one box”** 📌 — `en/melbus-ReelFilm-en.mp4` · обложка `en/covers/01-cover-Film-en.jpg`
> Your whole flat in one box. Almost literally 📦
> Film your flat on your phone — we give you the final price. We pack, move and put everything in place. No extra fees on moving day.
> Warsaw and 150 km around · 7 days a week · VAT invoice
> #moving #warsaw #movingtowarsaw #poland #melbus

**2. Carousel “Moving in 6 steps”** 📌 — `en/carousel/01…07-melbus-carousel-en.jpg`
> How a move with MELBUS works — 6 steps from a phone video to the last shelf assembled. Save it for later 👇
> #moving #warsaw #movingtips #melbus

**3. Reel “Price from a video”** — `en/melbus-ReelPrice-en.mp4` · обложка `en/covers/02-cover-Price-en.jpg`
> Two or three minutes of phone video — and you know the final price of your move. No “oh, there’s another floor” on moving day.
> #moving #movingcost #warsaw #melbus

**4. Reel “Care you can see”** — `en/melbus-ReelCare-en.mp4` · обложка `en/covers/03-cover-Care-en.jpg`
> Clean gloves and shoe covers before we step in. Dishes in paper, boxes with dividers. We treat your things as our own.
> #moving #packing #warsaw #melbus

**5. Reel “Only your things”** — `en/melbus-ReelVan-en.mp4` · обложка `en/covers/04-cover-Van-en.jpg`
> A MELBUS van carries only your things — no reloading, no other cargo. Warsaw and 150 km around, Poland and Europe on request.
> #moving #removals #warsaw #melbus

**6. Carousel “We don’t sell hours”** 📌 — `en/carousel-hours/01…05-melbus-hours-en.jpg`
> Why don’t we charge by the hour? With hourly movers, slow work means a bigger bill. With us, you know the price for the whole move in advance — so the crew gains from working fast and carefully. Swipe 👉 and save it to compare with other offers.
> #moving #movingwarsaw #warsaw #melbus

**7. Reel “We seal the price”** — `en/melbus-ReelSeal-en.mp4` · обложка `en/covers/05-cover-Seal-en.jpg`
> We seal the price like a box: you pay what you accepted in the offer. Changes only with your consent and before work begins.
> #moving #fixedprice #warsaw #melbus

**8. Reel “Every box knows what’s inside”** — `en/melbus-ReelQr-en.mp4` · обложка `en/covers/06-cover-Qr-en.jpg`
> Every box knows what’s inside. Label colour = room, number = box, and the QR code lists the contents. In your new home you unpack room by room, no searching.
> #moving #packing #organised #melbus

**9. Reel “Clothes on hangers”** — `en/melbus-ReelWardrobe-en.mp4` · обложка `en/covers/08-cover-Wardrobe-en.jpg`
> Shirts and dresses travel on hangers — in wardrobe boxes with a rail. Straight from the wardrobe into the box, and from the box back into the wardrobe. Nothing gets creased.
> #moving #packing #wardrobe #melbus

**10. Reel “The first-night box” (tip)** — `en/melbus-ReelFirstNight-en.mp4` · обложка `en/covers/07-cover-FirstNight-en.jpg`
> A tip before you move: pack a “first-night box”. Kettle, mugs, chargers, bedding, first-aid kit — it goes on last and comes off first. Save it so you don’t forget 📦
> #moving #movingtips #newhome #melbus

