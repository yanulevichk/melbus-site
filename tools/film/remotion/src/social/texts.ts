/**
 * ВСЕ ТЕКСТЫ ДЛЯ СОЦСЕТЕЙ — В ОДНОМ МЕСТЕ, КАЖДЫЙ СРАЗУ НА 4 ЯЗЫКАХ.
 * Правило: меняем фразу — меняем её на всех языках (ru, pl, uk, en) в этой же записи.
 * Тип L требует все 4 языка: если какой-то пропущен, сборка выдаст ошибку и ролик не соберётся.
 */
export const LANGS = ['ru', 'pl', 'uk', 'en'] as const;
export type Lang = (typeof LANGS)[number];
export type L = Record<Lang, string>;

// общие подписи
export const COMMON = {
  ai: {ru: 'Визуализация', pl: 'Wizualizacja', uk: 'Візуалізація', en: 'Visualisation'},
  noExtras: {ru: 'Переезд без доплат.', pl: 'Przeprowadzka bez dopłat.', uk: 'Переїзд без доплат.', en: 'Moving with no extra fees.'},
  linkInBio: {ru: 'Ссылка в профиле.', pl: 'Link w profilu.', uk: 'Посилання в профілі.', en: 'Link in bio.'},
  swipe: {ru: 'Листайте', pl: 'Przesuń', uk: 'Гортайте', en: 'Swipe'},
} satisfies Record<string, L>;

// главный заголовок бренда (две строки)
export const HEADLINE: [L, L] = [
  {ru: 'Переезд', pl: 'Przeprowadzka', uk: 'Переїзд', en: 'Moving,'},
  {ru: 'без доплат', pl: 'bez dopłat', uk: 'без доплат', en: 'no extra fees'},
];
export const PRICE_FINAL: L = {ru: 'Цена по видео — окончательная.', pl: 'Cena z wideo — ostateczna.', uk: 'Ціна за відео — остаточна.', en: 'The price from your video is final.'};
export const WHERE: L = {ru: 'Варшава, Польша, ЕС.', pl: 'Warszawa, Polska, UE.', uk: 'Варшава, Польща, ЄС.', en: 'Warsaw, Poland, the EU.'};
export const COVER_LINE: L = {ru: 'Цена по видео · Варшава + 150 км · 7/7', pl: 'Cena z wideo · Warszawa + 150 km · 7/7', uk: 'Ціна за відео · Варшава + 150 км · 7/7', en: 'Price from a video · Warsaw + 150 km · 7/7'};

// ---------- Reels «фильм» ----------
export const FILM = {
  hook: [
    {ru: 'Вся квартира —', pl: 'Całe mieszkanie —', uk: 'Уся квартира —', en: 'Your whole flat —'},
    {ru: 'в одну коробку', pl: 'w jednym kartonie', uk: 'в одну коробку', en: 'in one box'},
  ] as [L, L],
  // [с, до (секунды монтажа 23 с), заголовок, пояснение] — те же моменты, что подписи на сайте
  caps: [
    [4.8, 6.5,
      {ru: 'Цена по видео', pl: 'Cena z wideo', uk: 'Ціна за відео', en: 'Price from a video'},
      {ru: 'Снимаете квартиру на телефон — мы называем окончательную цену', pl: 'Nagrywasz mieszkanie telefonem — podajemy ostateczną cenę', uk: 'Знімаєте квартиру на телефон — ми називаємо остаточну ціну', en: 'Film your flat on your phone — we give you the final price'}],
    [6.6, 8.4,
      {ru: 'Упакуем всё', pl: 'Spakujemy wszystko', uk: 'Запакуємо все', en: 'We pack everything'},
      {ru: 'От кровати и холодильника до последней вилки', pl: 'Od łóżka i lodówki po ostatni widelec', uk: 'Від ліжка й холодильника до останньої виделки', en: 'From the bed and fridge to the last fork'}],
    [9.9, 11.7,
      {ru: 'Белые коробки MELBUS', pl: 'Białe kartony MELBUS', uk: 'Білі коробки MELBUS', en: 'White MELBUS boxes'},
      {ru: 'Бирюзовый скотч и наклейка комнаты на каждой', pl: 'Turkusowa taśma i naklejka pokoju na każdym', uk: 'Бірюзовий скотч і наліпка кімнати на кожній', en: 'Turquoise tape and a room label on every one'}],
    [12.7, 14.2,
      {ru: 'Только ваши вещи', pl: 'Tylko Twoje rzeczy', uk: 'Лише ваші речі', en: 'Only your things'},
      {ru: 'Бус едет без перегрузок и попутных грузов', pl: 'Bez przeładunków i doładunków po drodze', uk: 'Бус їде без перевантажень і попутних вантажів', en: 'No reloading and no other cargo on the way'}],
    [14.5, 16.9,
      {ru: 'Варшава, Польша, ЕС', pl: 'Warszawa, Polska, UE', uk: 'Варшава, Польща, ЄС', en: 'Warsaw, Poland, the EU'},
      {ru: 'Варшава и 150 км вокруг — 7 дней в неделю', pl: 'Warszawa i okolice do 150 km — 7 dni w tygodniu', uk: 'Варшава і 150 км довкола — 7 днів на тиждень', en: 'Within 150 km of Warsaw — 7 days a week'}],
    [18.8, 20.6,
      {ru: 'Распакуем и расставим', pl: 'Rozpakujemy i ustawimy', uk: 'Розпакуємо й розставимо', en: 'Unpacked and in place'},
      {ru: 'Соберём мебель и поставим всё по местам', pl: 'Złożymy meble i ustawimy wszystko na swoje miejsca', uk: 'Зберемо меблі й поставимо все на місця', en: 'We assemble the furniture and put everything in place'}],
  ] as [number, number, L, L][],
};

// ---------- короткие Reels из одного ролика ----------
// vertical — вертикальный ролик (Higgsfield 9:16) на весь экран; иначе — в рамке (square — квадрат, нет — 16:9)
export type ClipReel = {clip: string; square: boolean; vertical?: boolean; title: [L, L]; lines: [L, L, L]; endTitle: L};
export const CLIP_REELS: Record<'Price' | 'Care' | 'Van' | 'Seal' | 'Qr' | 'FirstNight' | 'Wardrobe', ClipReel> = {
  Price: {
    clip: 'phone.mp4', square: true,
    title: [{ru: 'Цена', pl: 'Cena', uk: 'Ціна', en: 'Price'}, {ru: 'по видео', pl: 'z wideo', uk: 'за відео', en: 'from a video'}],
    lines: [
      {ru: 'Снимите квартиру на телефон — две-три минуты', pl: 'Nagraj mieszkanie telefonem — dwie, trzy minuty', uk: 'Зніміть квартиру на телефон — дві-три хвилини', en: 'Film your flat on your phone — two or three minutes'},
      {ru: 'Окончательная цена в течение двух часов днём', pl: 'Ostateczna cena w ciągu dwóch godzin (w dzień)', uk: 'Остаточна ціна протягом двох годин удень', en: 'The final price within two hours (daytime)'},
      {ru: 'В день переезда — никаких доплат', pl: 'W dniu przeprowadzki — żadnych dopłat', uk: 'У день переїзду — жодних доплат', en: 'No extra fees on moving day'},
    ],
    endTitle: {ru: 'Цена, которая не изменится', pl: 'Cena, która się nie zmieni', uk: 'Ціна, яка не зміниться', en: 'A price that won’t change'},
  },
  Care: {
    clip: 'gloves.mp4', square: true,
    title: [{ru: 'Аккуратность,', pl: 'Staranność,', uk: 'Акуратність,', en: 'Care'}, {ru: 'которую видно', pl: 'którą widać', uk: 'яку видно', en: 'you can see'}],
    lines: [
      {ru: 'Чистые перчатки и бахилы — до порога', pl: 'Czyste rękawice i ochraniacze na buty — już od progu', uk: 'Чисті рукавички й бахіли — ще до порога', en: 'Clean gloves and shoe covers — before we step in'},
      {ru: 'Посуда — в бумагу, коробки — с перегородками', pl: 'Naczynia — w papier, kartony — z przegródkami', uk: 'Посуд — у папір, коробки — з перегородками', en: 'Dishes in paper, boxes with dividers'},
      {ru: 'Каждая коробка подписана: комната и номер', pl: 'Każdy karton opisany: pokój i numer', uk: 'Кожна коробка підписана: кімната й номер', en: 'Every box labelled: room and number'},
    ],
    endTitle: {ru: 'Ваши вещи — как свои', pl: 'Twoje rzeczy — jak własne', uk: 'Ваші речі — як свої', en: 'Your things, treated as our own'},
  },
  Van: {
    clip: 'van.mp4', square: false,
    title: [{ru: 'Только', pl: 'Tylko', uk: 'Лише', en: 'Only'}, {ru: 'ваши вещи', pl: 'Twoje rzeczy', uk: 'ваші речі', en: 'your things'}],
    lines: [
      {ru: 'Без перегрузок и попутных грузов', pl: 'Bez przeładunków i doładunków', uk: 'Без перевантажень і попутних вантажів', en: 'No reloading, no other cargo'},
      {ru: 'Варшава и 150 км вокруг — 7 дней в неделю', pl: 'Warszawa i okolice do 150 km — 7 dni w tygodniu', uk: 'Варшава і 150 км довкола — 7 днів на тиждень', en: 'Within 150 km of Warsaw — 7 days a week'},
      {ru: 'Польша и страны ЕС — по запросу', pl: 'Polska i kraje UE — na zapytanie', uk: 'Польща і країни ЄС — за запитом', en: 'Poland and EU countries on request'},
    ],
    endTitle: {ru: 'Бус MELBUS — только для вас', pl: 'Bus MELBUS — tylko dla Ciebie', uk: 'Бус MELBUS — лише для вас', en: 'A MELBUS van — just for you'},
  },
  // ---- 13.11.2026: ролики Higgsfield (вертикальные, «Визуализация») ----
  Seal: {
    clip: 'hf-tape.mp4', square: false, vertical: true,
    title: [{ru: 'Цену', pl: 'Cenę', uk: 'Ціну', en: 'We seal'}, {ru: 'запечатываем', pl: 'pieczętujemy', uk: 'запечатуємо', en: 'the price'}],
    lines: [
      {ru: 'Цена — по видео, до начала работ', pl: 'Cena z wideo — przed rozpoczęciem pracy', uk: 'Ціна — за відео, до початку робіт', en: 'The price comes from your video, before we start'},
      {ru: 'Изменения — только с вашего согласия', pl: 'Zmiany — tylko za Twoją zgodą', uk: 'Зміни — лише з вашої згоди', en: 'Changes only with your consent'},
      {ru: 'Что приняли в оферте — то и платите', pl: 'Płacisz tyle, ile w zaakceptowanej ofercie', uk: 'Що прийняли в оферті — те й платите', en: 'You pay what you accepted in the offer'},
    ],
    endTitle: {ru: 'Цена запечатана, как коробка', pl: 'Cena zamknięta jak karton', uk: 'Ціна запечатана, як коробка', en: 'A price sealed like a box'},
  },
  Qr: {
    clip: 'hf-qr.mp4', square: false, vertical: true,
    title: [{ru: 'Каждая коробка', pl: 'Każdy karton', uk: 'Кожна коробка', en: 'Every box'}, {ru: 'знает, что в ней', pl: 'wie, co ma w środku', uk: 'знає, що в ній', en: 'knows what’s inside'}],
    lines: [
      {ru: 'Цвет наклейки — комната', pl: 'Kolor naklejki to pokój', uk: 'Колір наліпки — кімната', en: 'Label colour = room'},
      {ru: 'Номер — коробка, QR — список вещей', pl: 'Numer to karton, QR to lista rzeczy', uk: 'Номер — коробка, QR — список речей', en: 'Number = box, QR = list of contents'},
      {ru: 'Распаковка по комнатам, без поисков', pl: 'Rozpakowanie pokój po pokoju, bez szukania', uk: 'Розпакування по кімнатах, без пошуків', en: 'Unpacking room by room, no searching'},
    ],
    endTitle: {ru: 'Порядок с первой коробки', pl: 'Porządek od pierwszego kartonu', uk: 'Порядок з першої коробки', en: 'Order from the very first box'},
  },
  FirstNight: {
    clip: 'hf-first-night.mp4', square: false, vertical: true,
    title: [{ru: 'Коробка', pl: 'Karton', uk: 'Коробка', en: 'The first-night'}, {ru: 'первой ночи', pl: 'pierwszej nocy', uk: 'першої ночі', en: 'box'}],
    lines: [
      {ru: 'Чайник, кружки, чай и кофе', pl: 'Czajnik, kubki, herbata i kawa', uk: 'Чайник, кружки, чай і кава', en: 'Kettle, mugs, tea and coffee'},
      {ru: 'Зарядки, удлинитель, аптечка', pl: 'Ładowarki, przedłużacz, apteczka', uk: 'Зарядки, подовжувач, аптечка', en: 'Chargers, extension lead, first-aid kit'},
      {ru: 'Постельное и полотенца', pl: 'Pościel i ręczniki', uk: 'Постіль і рушники', en: 'Bedding and towels'},
    ],
    endTitle: {ru: 'Едет последней — открывается первой', pl: 'Jedzie ostatni — otwierasz go pierwszy', uk: 'Їде останньою — відкривається першою', en: 'Goes on last, comes off first'},
  },
  Wardrobe: {
    clip: 'hf-wardrobe.mp4', square: false, vertical: true,
    title: [{ru: 'Одежда', pl: 'Ubrania', uk: 'Одяг', en: 'Clothes'}, {ru: 'на вешалках', pl: 'na wieszakach', uk: 'на вішаках', en: 'on hangers'}],
    lines: [
      {ru: 'Гардеробные коробки со штангой', pl: 'Kartony garderobiane z drążkiem', uk: 'Гардеробні коробки зі штангою', en: 'Wardrobe boxes with a rail'},
      {ru: 'Из шкафа — сразу на вешалку в коробку', pl: 'Z szafy — od razu na wieszak w kartonie', uk: 'Із шафи — одразу на вішак у коробку', en: 'Straight from the wardrobe onto the rail'},
      {ru: 'Вещи приезжают немятыми', pl: 'Ubrania przyjeżdżają niepogniecione', uk: 'Речі приїжджають нем’ятими', en: 'Clothes arrive uncreased'},
    ],
    endTitle: {ru: 'Из шкафа — в шкаф', pl: 'Z szafy do szafy', uk: 'Із шафи — у шафу', en: 'From wardrobe to wardrobe'},
  },
};

// ---------- карусель «Переезд за 6 шагов» ----------
// [время кадра в фильме, сдвиг кадрирования %, номер, заголовок, текст]
export const CAROUSEL: [number, number, string, L, L][] = [
  [12.4, 50, '',
    {ru: 'Переезд\nза 6 шагов', pl: 'Przeprowadzka\nw 6 krokach', uk: 'Переїзд\nза 6 кроків', en: 'Moving\nin 6 steps'},
    {ru: 'От видео на телефоне до последней собранной полки.', pl: 'Od wideo z telefonu po ostatnią złożoną półkę.', uk: 'Від відео на телефоні до останньої зібраної полиці.', en: 'From a phone video to the last shelf assembled.'}],
  [6.2, 55, '1',
    {ru: 'Видео', pl: 'Wideo', uk: 'Відео', en: 'Video'},
    {ru: 'Снимаете квартиру на телефон: две-три минуты, комната за комнатой.', pl: 'Nagrywasz mieszkanie telefonem: dwie, trzy minuty, pokój po pokoju.', uk: 'Знімаєте квартиру на телефон: дві-три хвилини, кімната за кімнатою.', en: 'Film your flat on your phone: two or three minutes, room by room.'}],
  [18.1, 50, '2',
    {ru: 'Цена', pl: 'Cena', uk: 'Ціна', en: 'Price'},
    {ru: 'В течение двух часов днём присылаем окончательную цену и список вещей.', pl: 'W ciągu dwóch godzin (w dzień) wysyłamy ostateczną cenę i listę rzeczy.', uk: 'Протягом двох годин удень надсилаємо остаточну ціну та список речей.', en: 'Within two hours (daytime) we send the final price and a list of items.'}],
  [24.45, 50, '3',
    {ru: 'Бронь', pl: 'Rezerwacja', uk: 'Бронювання', en: 'Booking'},
    {ru: 'Подтверждаете задатком BLIK или картой — дата закреплена за вами.', pl: 'Potwierdzasz zadatkiem BLIK lub kartą — termin jest Twój.', uk: 'Підтверджуєте завдатком BLIK або карткою — дата закріплена за вами.', en: 'Confirm with a deposit by BLIK or card — the date is yours.'}],
  [20.0, 35, '4',
    {ru: 'Упаковка', pl: 'Pakowanie', uk: 'Пакування', en: 'Packing'},
    {ru: 'Бригада в форме, перчатках и бахилах упаковывает всё по комнатам.', pl: 'Ekipa w uniformach, rękawicach i ochraniaczach na buty pakuje wszystko pokój po pokoju.', uk: 'Бригада у формі, рукавичках і бахілах пакує все по кімнатах.', en: 'A crew in uniforms, gloves and shoe covers packs everything room by room.'}],
  [26.6, 50, '5',
    {ru: 'Дорога', pl: 'Droga', uk: 'Дорога', en: 'On the road'},
    {ru: 'Бус MELBUS везёт только ваши вещи, без перегрузок по пути.', pl: 'Bus MELBUS wiezie tylko Twoje rzeczy, bez przeładunków po drodze.', uk: 'Бус MELBUS везе лише ваші речі, без перевантажень у дорозі.', en: 'A MELBUS van carries only your things, with no reloading on the way.'}],
  [41.7, 50, '6',
    {ru: 'Новый дом', pl: 'Nowy dom', uk: 'Новий дім', en: 'New home'},
    {ru: 'Заносим, собираем мебель и расставляем всё по местам.', pl: 'Wnosimy, składamy meble i ustawiamy wszystko na swoje miejsca.', uk: 'Заносимо, збираємо меблі й розставляємо все по місцях.', en: 'We carry in, assemble the furniture and put everything in place.'}],
];

// ---------- карусель «Мы не продаём часы» (13.11.2026): заголовок и сравнение — из src/content/prices.ts (как на сайте) ----------
export const HOURS = {
  ctaTitle: {ru: 'Цена за весь переезд — до начала работ', pl: 'Cena za całą przeprowadzkę — przed startem', uk: 'Ціна за весь переїзд — до початку робіт', en: 'One price for the whole move — before we start'},
  ctaText: {ru: 'Снимите квартиру на телефон — пришлём окончательную цену в течение 2 часов днём. Калькулятор — по ссылке в профиле.', pl: 'Nagraj mieszkanie telefonem — wyślemy ostateczną cenę w ciągu 2 godzin (w dzień). Kalkulator — link w profilu.', uk: 'Зніміть квартиру на телефон — надішлемо остаточну ціну протягом 2 годин удень. Калькулятор — за посиланням у профілі.', en: 'Film your flat on your phone — we’ll send the final price within 2 hours (daytime). Calculator — link in bio.'},
} satisfies Record<string, L>;

// размер шрифта под длину строки: широкий Unbounded ≈ 0,66 em на знак
export const fitSize = (lines: string[], base: number, width: number, k = 0.62) =>
  Math.min(base, Math.floor(width / (k * Math.max(...lines.map((s) => s.length)))));
