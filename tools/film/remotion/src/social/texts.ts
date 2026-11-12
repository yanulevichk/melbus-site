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
export const PRICE_FINAL: L = {ru: 'Цена по видео — окончательная.', pl: 'Cena z wideo — ostateczna.', uk: 'Ціна за відео — остаточна.', en: 'Price from a video — final.'};
export const WHERE: L = {ru: 'Варшава, Польша, Европа.', pl: 'Warszawa, Polska, Europa.', uk: 'Варшава, Польща, Європа.', en: 'Warsaw, Poland, Europe.'};
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
      {ru: 'Бус едет без перегрузок и попутных грузов', pl: 'Bez przeładunków i cudzych ładunków po drodze', uk: 'Бус їде без перевантажень і попутних вантажів', en: 'No reloading and no other cargo on the way'}],
    [14.5, 16.9,
      {ru: 'Варшава, Польша, Европа', pl: 'Warszawa, Polska, Europa', uk: 'Варшава, Польща, Європа', en: 'Warsaw, Poland, Europe'},
      {ru: 'Варшава и 150 км вокруг — 7 дней в неделю', pl: 'Warszawa i 150 km wokół — 7 dni w tygodniu', uk: 'Варшава і 150 км довкола — 7 днів на тиждень', en: 'Warsaw and 150 km around — 7 days a week'}],
    [18.8, 20.6,
      {ru: 'Распакуем и расставим', pl: 'Rozpakujemy i ustawimy', uk: 'Розпакуємо й розставимо', en: 'Unpacked and in place'},
      {ru: 'Соберём мебель и поставим всё по местам', pl: 'Złożymy meble i ustawimy wszystko na miejscu', uk: 'Зберемо меблі й поставимо все на місця', en: 'We assemble the furniture and put everything in place'}],
  ] as [number, number, L, L][],
};

// ---------- короткие Reels из одного ролика ----------
export type ClipReel = {clip: string; square: boolean; title: [L, L]; lines: [L, L, L]; endTitle: L};
export const CLIP_REELS: Record<'Price' | 'Care' | 'Van', ClipReel> = {
  Price: {
    clip: 'phone.mp4', square: true,
    title: [{ru: 'Цена', pl: 'Cena', uk: 'Ціна', en: 'Price'}, {ru: 'по видео', pl: 'z wideo', uk: 'за відео', en: 'from a video'}],
    lines: [
      {ru: 'Снимите квартиру на телефон — две-три минуты', pl: 'Nagraj mieszkanie telefonem — dwie, trzy minuty', uk: 'Зніміть квартиру на телефон — дві-три хвилини', en: 'Film your flat on your phone — two or three minutes'},
      {ru: 'Окончательная цена в течение двух часов днём', pl: 'Ostateczna cena w ciągu dwóch godzin (w dzień)', uk: 'Остаточна ціна протягом двох годин удень', en: 'The final price within two hours (daytime)'},
      {ru: 'В день переезда — никаких доплат', pl: 'W dniu przeprowadzki — żadnych dopłat', uk: 'У день переїзду — жодних доплат', en: 'No extra fees on moving day'},
    ],
    endTitle: {ru: 'Цена, которая не изменится', pl: 'Cena, która się nie zmieni', uk: 'Ціна, яка не зміниться', en: "A price that won't change"},
  },
  Care: {
    clip: 'gloves.mp4', square: true,
    title: [{ru: 'Аккуратность,', pl: 'Staranność,', uk: 'Акуратність,', en: 'Care'}, {ru: 'которую видно', pl: 'którą widać', uk: 'яку видно', en: 'you can see'}],
    lines: [
      {ru: 'Чистые перчатки и бахилы — до порога', pl: 'Czyste rękawice i ochraniacze na buty — już od progu', uk: 'Чисті рукавички й бахіли — ще до порога', en: 'Clean gloves and shoe covers — before we step in'},
      {ru: 'Посуда — в бумагу, коробки — с перегородками', pl: 'Naczynia — w papier, kartony — z przegródkami', uk: 'Посуд — у папір, коробки — з перегородками', en: 'Dishes in paper, boxes with dividers'},
      {ru: 'Каждая коробка подписана: комната и номер', pl: 'Każdy karton opisany: pokój i numer', uk: 'Кожна коробка підписана: кімната й номер', en: 'Every box labelled: room and number'},
    ],
    endTitle: {ru: 'Вещи клиента — как свои', pl: 'Rzeczy klienta — jak własne', uk: 'Речі клієнта — як свої', en: 'Your things, treated as our own'},
  },
  Van: {
    clip: 'van.mp4', square: false,
    title: [{ru: 'Только', pl: 'Tylko', uk: 'Лише', en: 'Only'}, {ru: 'ваши вещи', pl: 'Twoje rzeczy', uk: 'ваші речі', en: 'your things'}],
    lines: [
      {ru: 'Без перегрузок и попутных грузов', pl: 'Bez przeładunków i cudzych ładunków', uk: 'Без перевантажень і попутних вантажів', en: 'No reloading, no other cargo'},
      {ru: 'Варшава и 150 км вокруг — 7 дней в неделю', pl: 'Warszawa i 150 km wokół — 7 dni w tygodniu', uk: 'Варшава і 150 км довкола — 7 днів на тиждень', en: 'Warsaw and 150 km around — 7 days a week'},
      {ru: 'Польша и Европа — по запросу', pl: 'Polska i Europa — na zapytanie', uk: 'Польща і Європа — за запитом', en: 'Poland and Europe — on request'},
    ],
    endTitle: {ru: 'Бус MELBUS — только для вас', pl: 'Bus MELBUS — tylko dla Ciebie', uk: 'Бус MELBUS — лише для вас', en: 'A MELBUS van — just for you'},
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
    {ru: 'Подтверждаете предоплатой BLIK или картой — дата закреплена за вами.', pl: 'Potwierdzasz przedpłatą BLIK lub kartą — termin jest Twój.', uk: 'Підтверджуєте передоплатою BLIK або карткою — дата закріплена за вами.', en: 'Confirm with a BLIK or card prepayment — the date is yours.'}],
  [20.0, 35, '4',
    {ru: 'Упаковка', pl: 'Pakowanie', uk: 'Пакування', en: 'Packing'},
    {ru: 'Бригада в форме, перчатках и бахилах упаковывает всё по комнатам.', pl: 'Ekipa w uniformach, rękawicach i ochraniaczach na buty pakuje wszystko pokój po pokoju.', uk: 'Бригада у формі, рукавичках і бахілах пакує все по кімнатах.', en: 'A crew in uniforms, gloves and shoe covers packs everything room by room.'}],
  [26.6, 50, '5',
    {ru: 'Дорога', pl: 'Droga', uk: 'Дорога', en: 'On the road'},
    {ru: 'Бус MELBUS везёт только ваши вещи, без перегрузок по пути.', pl: 'Bus MELBUS wiezie tylko Twoje rzeczy, bez przeładunków po drodze.', uk: 'Бус MELBUS везе лише ваші речі, без перевантажень у дорозі.', en: 'A MELBUS van carries only your things, with no reloading on the way.'}],
  [41.7, 50, '6',
    {ru: 'Новый дом', pl: 'Nowy dom', uk: 'Новий дім', en: 'New home'},
    {ru: 'Заносим, собираем мебель и расставляем всё по местам.', pl: 'Wnosimy, składamy meble i ustawiamy wszystko na miejscu.', uk: 'Заносимо, збираємо меблі й розставляємо все по місцях.', en: 'We carry in, assemble the furniture and put everything in place.'}],
];

// размер шрифта под длину строки: широкий Unbounded ≈ 0,66 em на знак
export const fitSize = (lines: string[], base: number, width: number, k = 0.62) =>
  Math.min(base, Math.floor(width / (k * Math.max(...lines.map((s) => s.length)))));
