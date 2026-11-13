/**
 * ТЕКСТЫ К ПУБЛИКАЦИЯМ (подписи под постами) — каждый сразу на 4 языках.
 * Меняем подпись — меняем во всех языках. Инструкция для выкладки собирается отсюда:
 *   npx tsx scripts/posts-readme.ts > ../../../marketing/social/2026-11-12/README.md
 */
import type {L} from './texts';

// pin — закрепить в профиле; cover — обложка Reels (covers/NN-cover-<имя>-<lang>.jpg)
export type Post = {file: string; title: L; text: L; tags: L; pin?: boolean; cover?: string};

export const POSTS: Post[] = [
  {
    file: 'melbus-ReelFilm-<lang>.mp4', pin: true, cover: '01-cover-Film',
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
    file: 'carousel/01…07-melbus-carousel-<lang>.jpg', pin: true,
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
    file: 'melbus-ReelPrice-<lang>.mp4', cover: '02-cover-Price',
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
    file: 'melbus-ReelCare-<lang>.mp4', cover: '03-cover-Care',
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
    file: 'melbus-ReelVan-<lang>.mp4', cover: '04-cover-Van',
    title: {ru: 'Reels «Только ваши вещи»', pl: 'Reels „Tylko Twoje rzeczy”', uk: 'Reels «Лише ваші речі»', en: 'Reel “Only your things”'},
    text: {
      ru: 'Бус MELBUS везёт только ваши вещи — без перегрузок и попутных грузов. Варшава и 150 км вокруг, Польша и Европа — по запросу.',
      pl: 'Bus MELBUS wiezie tylko Twoje rzeczy — bez przeładunków i cudzych ładunków. Warszawa i 150 km wokół, Polska i Europa — na zapytanie.',
      uk: 'Бус MELBUS везе лише ваші речі — без перевантажень і попутних вантажів. Варшава і 150 км довкола, Польща і Європа — за запитом.',
      en: 'A MELBUS van carries only your things — no reloading, no other cargo. Warsaw and 150 km around, Poland and Europe on request.',
    },
    tags: {ru: '#переезд #грузоперевозки #варшава #melbus', pl: '#przeprowadzka #transport #warszawa #melbus', uk: '#переїзд #вантажоперевезення #варшава #melbus', en: '#moving #removals #warsaw #melbus'},
  },
  // ---- 13.11.2026: ещё 5 публикаций, чтобы заполнить профиль до запуска (ролики Higgsfield, «Визуализация») ----
  {
    file: 'carousel-hours/01…05-melbus-hours-<lang>.jpg', pin: true,
    title: {ru: 'Карусель «Мы не продаём часы»', pl: 'Karuzela „Nie sprzedajemy godzin”', uk: 'Карусель «Ми не продаємо години»', en: 'Carousel “We don’t sell hours”'},
    text: {
      ru: 'Почему мы не берём оплату за часы? У почасовой фирмы медленная работа — это больше денег. У нас цена за весь переезд известна заранее — и бригаде выгодно работать быстро и аккуратно. Листайте 👉 и сохраните, чтобы сравнить с другими предложениями.',
      pl: 'Dlaczego nie liczymy za godziny? W firmie liczącej za godzinę wolna praca to wyższy rachunek. U nas cenę za całą przeprowadzkę znasz z góry — a ekipie opłaca się pracować szybko i starannie. Przesuń 👉 i zapisz, żeby porównać z innymi ofertami.',
      uk: 'Чому ми не беремо оплату за години? У погодинної фірми повільна робота — це більше грошей. У нас ціна за весь переїзд відома заздалегідь — і бригаді вигідно працювати швидко й акуратно. Гортайте 👉 і збережіть, щоб порівняти з іншими пропозиціями.',
      en: 'Why don’t we charge by the hour? With hourly movers, slow work means a bigger bill. With us, you know the price for the whole move in advance — so the crew gains from working fast and carefully. Swipe 👉 and save it to compare with other offers.',
    },
    tags: {ru: '#переезд #ценапереезда #варшава #melbus', pl: '#przeprowadzka #cenaprzeprowadzki #warszawa #melbus', uk: '#переїзд #цінапереїзду #варшава #melbus', en: '#moving #movingwarsaw #warsaw #melbus'},
  },
  {
    file: 'melbus-ReelSeal-<lang>.mp4', cover: '05-cover-Seal',
    title: {ru: 'Reels «Цену запечатываем»', pl: 'Reels „Cenę zaklejamy”', uk: 'Reels «Ціну запечатуємо»', en: 'Reel “We seal the price”'},
    text: {
      ru: 'Цену запечатываем, как коробку: что приняли в оферте — то и платите. Изменения — только с вашего согласия и до начала работ.',
      pl: 'Cenę zaklejamy jak karton: płacisz tyle, ile przyjąłeś w ofercie. Zmiany — tylko za Twoją zgodą i przed rozpoczęciem pracy.',
      uk: 'Ціну запечатуємо, як коробку: що прийняли в оферті — те й платите. Зміни — лише з вашої згоди й до початку робіт.',
      en: 'We seal the price like a box: you pay what you accepted in the offer. Changes only with your consent and before work begins.',
    },
    tags: {ru: '#переезд #фиксированнаяцена #варшава #melbus', pl: '#przeprowadzka #cenaprzeprowadzki #warszawa #melbus', uk: '#переїзд #фіксованаціна #варшава #melbus', en: '#moving #fixedprice #warsaw #melbus'},
  },
  {
    file: 'melbus-ReelQr-<lang>.mp4', cover: '06-cover-Qr',
    title: {ru: 'Reels «Каждая коробка знает, что в ней»', pl: 'Reels „Każdy karton wie, co ma w środku”', uk: 'Reels «Кожна коробка знає, що в ній»', en: 'Reel “Every box knows what’s inside”'},
    text: {
      ru: 'Каждая коробка знает, что в ней. Цвет наклейки — комната, номер — коробка, а QR — список вещей внутри. В новом доме распаковка идёт по комнатам, без поисков.',
      pl: 'Każdy karton wie, co ma w środku. Kolor naklejki to pokój, numer to karton, a QR to lista rzeczy w środku. W nowym domu rozpakowujesz pokój po pokoju, bez szukania.',
      uk: 'Кожна коробка знає, що в ній. Колір наліпки — кімната, номер — коробка, а QR — список речей усередині. У новому домі розпакування йде по кімнатах, без пошуків.',
      en: 'Every box knows what’s inside. Label colour = room, number = box, and the QR code lists the contents. In your new home you unpack room by room, no searching.',
    },
    tags: {ru: '#переезд #упаковка #порядок #melbus', pl: '#przeprowadzka #pakowanie #porządek #melbus', uk: '#переїзд #пакування #порядок #melbus', en: '#moving #packing #organised #melbus'},
  },
  {
    file: 'melbus-ReelWardrobe-<lang>.mp4', cover: '08-cover-Wardrobe',
    title: {ru: 'Reels «Одежда на вешалках»', pl: 'Reels „Ubrania na wieszakach”', uk: 'Reels «Одяг на вішаках»', en: 'Reel “Clothes on hangers”'},
    text: {
      ru: 'Рубашки и платья едут на вешалках — в гардеробных коробках со штангой. Из шкафа — сразу в коробку, из коробки — сразу в шкаф. И ничего не мнётся.',
      pl: 'Koszule i sukienki jadą na wieszakach — w kartonach garderobianych z drążkiem. Z szafy prosto do kartonu, z kartonu prosto do szafy. I nic się nie gniecie.',
      uk: 'Сорочки й сукні їдуть на вішаках — у гардеробних коробках зі штангою. Із шафи — одразу в коробку, з коробки — одразу в шафу. І нічого не мнеться.',
      en: 'Shirts and dresses travel on hangers — in wardrobe boxes with a rail. Straight from the wardrobe into the box, and from the box back into the wardrobe. Nothing gets creased.',
    },
    tags: {ru: '#переезд #упаковка #гардероб #melbus', pl: '#przeprowadzka #pakowanie #garderoba #melbus', uk: '#переїзд #пакування #гардероб #melbus', en: '#moving #packing #wardrobe #melbus'},
  },
  {
    file: 'melbus-ReelFirstNight-<lang>.mp4', cover: '07-cover-FirstNight',
    title: {ru: 'Reels «Коробка первой ночи» (совет)', pl: 'Reels „Karton pierwszej nocy” (porada)', uk: 'Reels «Коробка першої ночі» (порада)', en: 'Reel “The first-night box” (tip)'},
    text: {
      ru: 'Совет перед переездом: соберите «коробку первой ночи». Чайник, кружки, зарядки, постельное, аптечка — она едет последней и открывается первой. Сохраните, чтобы не забыть 📦',
      pl: 'Porada przed przeprowadzką: spakuj „karton pierwszej nocy”. Czajnik, kubki, ładowarki, pościel, apteczka — jedzie ostatni, otwierasz go pierwszy. Zapisz, żeby nie zapomnieć 📦',
      uk: 'Порада перед переїздом: зберіть «коробку першої ночі». Чайник, кружки, зарядки, постіль, аптечка — вона їде останньою й відкривається першою. Збережіть, щоб не забути 📦',
      en: 'A tip before you move: pack a “first-night box”. Kettle, mugs, chargers, bedding, first-aid kit — it goes on last and comes off first. Save it so you don’t forget 📦',
    },
    tags: {ru: '#переезд #советы #новоселье #melbus', pl: '#przeprowadzka #porady #nowemieszkanie #melbus', uk: '#переїзд #поради #новосілля #melbus', en: '#moving #movingtips #newhome #melbus'},
  },
];
