/**
 * ЦЕНЫ MELBUS — ОДНА формула для всего: калькулятор, табло на главной, таблица цен, расчёт менеджера по видео.
 *
 * Принцип: МЫ НЕ ПРОДАЁМ ЧАСЫ. Цена — за весь переезд, по объёму вещей (что видно на видео), а не за время.
 *   цена пакета (размер × пакет) × сколько вещей  → округляем до …90
 *   + дорога за город (зона) + этажи без лифта + доп. услуги (то, что не входит в пакет)
 *
 * Пакеты построены как «картошка в McDonald's»: «Под ключ» лишь немного дороже «Стандарта»,
 * а даёт намного больше (упаковка всего, распаковка, мусор, ТВ и картины) — выбрать его логично.
 *
 * Все суммы brutto (с VAT 23 %). PRICE_STATUS: 'demo' → 'proposal' → 'approved'.
 * Пока не 'approved', на сайте подпись «цены на утверждении». Обоснование — docs/CENY-predlozhenie.md.
 */
import type { L } from '../i18n/text';

export const PRICE_STATUS: 'demo' | 'proposal' | 'approved' = 'proposal';
export const DEMO = PRICE_STATUS !== 'approved';

const l = (ru: string, pl: string, uk: string, en: string): L => ({ ru, pl, uk, en });

/** что везём; quote — номер варианта в форме заявки */
export const SIZES = [
  { label: l('Студия', 'Kawalerka', 'Студія', 'Studio'), status: l('Студия · до 30 м²', 'Kawalerka · do 30 m²', 'Студія · до 30 м²', 'Studio · up to 30 m²'), m2: 30, quote: 0 },
  { label: l('2 комнаты', '2 pokoje', '2 кімнати', '2 rooms'), status: l('2 комнаты · 40–55 м²', '2 pokoje · 40–55 m²', '2 кімнати · 40–55 м²', '2 rooms · 40–55 m²'), m2: 50, quote: 1 },
  { label: l('3 комнаты', '3 pokoje', '3 кімнати', '3 rooms'), status: l('3 комнаты · 60–80 м²', '3 pokoje · 60–80 m²', '3 кімнати · 60–80 м²', '3 rooms · 60–80 m²'), m2: 70, quote: 2 },
  { label: l('Дом', 'Dom', 'Будинок', 'House'), status: l('Дом · до 150 м²', 'Dom · do 150 m²', 'Будинок · до 150 м²', 'House · up to 150 m²'), m2: 130, quote: 4 },
  { label: l('Офис', 'Biuro', 'Офіс', 'Office'), status: l('Офис · 10–15 мест', 'Biuro · 10–15 stanowisk', 'Офіс · 10–15 місць', 'Office · 10–15 desks'), m2: 120, quote: 5 },
];

/** пакеты; quote — номер пакета в форме заявки; inc — какие доп. услуги уже внутри */
export const PACKAGES = [
  {
    id: 'move', quote: 0, inc: [] as string[],
    name: l('Перевозка', 'Transport', 'Перевезення', 'Transport'),
    note: l('Вы пакуете — мы перевозим', 'Ty pakujesz — my przewozimy', 'Ви пакуєте — ми перевозимо', 'You pack — we move'),
    items: [
      l('Бус и бригада в форме', 'Bus i ekipa w uniformach', 'Бус і бригада у формі', 'Van and uniformed crew'),
      l('Защита мебели плёнкой и одеялами', 'Ochrona mebli folią i kocami', 'Захист меблів плівкою й ковдрами', 'Furniture wrapped in film and blankets'),
      l('Защита пола и дверных косяков', 'Ochrona podłóg i futryn', 'Захист підлоги й одвірків', 'Floor and door-frame protection'),
      l('Разборка и сборка кровати', 'Demontaż i montaż łóżka', 'Розбирання та збирання ліжка', 'Bed disassembly and assembly'),
    ],
  },
  {
    id: 'standard', quote: 1, inc: ['boxes', 'assembly'],
    name: l('Стандарт', 'Standard', 'Стандарт', 'Standard'),
    note: l('Хрупкое и мебель — на нас', 'Delikatne i meble — po naszej stronie', 'Крихке й меблі — на нас', 'Fragile items and furniture — on us'),
    items: [
      l('Всё из «Перевозки»', 'Wszystko z pakietu „Transport”', 'Усе з «Перевезення»', 'Everything in “Transport”'),
      l('Упаковка кухни и хрупкого, материалы в цене', 'Pakowanie kuchni i rzeczy delikatnych, materiały w cenie', 'Пакування кухні та крихкого, матеріали в ціні', 'Kitchen and fragile packing, materials included'),
      l('Белые коробки MELBUS заранее', 'Białe kartony MELBUS wcześniej', 'Білі коробки MELBUS заздалегідь', 'White MELBUS boxes delivered in advance'),
      l('Разборка и сборка всей мебели', 'Demontaż i montaż wszystkich mebli', 'Розбирання та збирання всіх меблів', 'All furniture taken apart and reassembled'),
    ],
  },
  {
    id: 'full', quote: 2, inc: ['boxes', 'assembly', 'mount'],
    name: l('Под ключ', 'Pod klucz', 'Під ключ', 'Full service'),
    note: l('Вы приезжаете в готовый дом', 'Przyjeżdżasz do gotowego domu', 'Ви приїжджаєте в готовий дім', 'You arrive at a ready home'),
    items: [
      l('Всё из «Стандарта»', 'Wszystko z pakietu „Standard”', 'Усе зі «Стандарту»', 'Everything in “Standard”'),
      l('Упакуем всю квартиру — вы не трогаете ни одной коробки', 'Spakujemy całe mieszkanie — nie dotykasz żadnego kartonu', 'Запакуємо всю квартиру — ви не торкаєтеся жодної коробки', 'We pack the whole home — you don’t touch a single box'),
      l('Распакуем и расставим по местам', 'Rozpakujemy i ustawimy wszystko na miejscu', 'Розпакуємо й розставимо по місцях', 'We unpack and put everything in place'),
      l('Повесим ТВ и до 5 картин или полок', 'Powiesimy TV i do 5 obrazów lub półek', 'Повісимо ТВ і до 5 картин або полиць', 'We mount the TV and up to 5 pictures or shelves'),
      l('Вывезем упаковку и мусор', 'Wywieziemy opakowania i śmieci', 'Вивеземо пакування й сміття', 'We take away packaging and rubbish'),
      l('«Коробка первой ночи» — открываем первой', '„Karton pierwszej nocy” — otwieramy go pierwszy', '«Коробка першої ночі» — відкриваємо першою', 'A “first-night box” — opened first'),
    ],
  },
];

/**
 * ЦЕНА ПАКЕТА (zł brutto) — по Варшаве, с лифтом, обычное количество вещей. [размер][пакет]
 * Шаги сделаны специально: Перевозка → Стандарт ≈ +40 %, Стандарт → Под ключ ≈ +15–20 %.
 * Сверено с рынком Варшавы (ноябрь 2026): перевозка 2 комнат 1 600–2 500 zł, под ключ 2 600–4 000 zł.
 */
export const GRID: number[][] = [
  /* студия    */ [890, 1290, 1490],
  /* 2 комнаты */ [1690, 2390, 2790],
  /* 3 комнаты */ [2390, 3290, 3890],
  /* дом       */ [3990, 5490, 6790],
  /* офис      */ [2990, 4190, 4890],
];

/** сколько вещей (видно на видео): множитель к цене пакета */
export const AMOUNTS = [
  { k: 0.85, label: l('Немного', 'Niewiele', 'Небагато', 'Not much'), hint: l('минимализм, без кладовки', 'minimalizm, bez komórki', 'мінімалізм, без комори', 'minimal, no storage room') },
  { k: 1, label: l('Как у всех', 'Jak u większości', 'Як у всіх', 'Typical'), hint: l('обычная квартира', 'zwykłe mieszkanie', 'звичайна квартира', 'an ordinary home') },
  { k: 1.2, label: l('Много', 'Dużo', 'Багато', 'A lot'), hint: l('полные шкафы, кладовка, балкон', 'pełne szafy, komórka, balkon', 'повні шафи, комора, балкон', 'full wardrobes, storage, balcony') },
];

/** куда едем: доплата [размер] (zł) — больше вещей = больше машин */
export const ZONES = [
  { label: l('По Варшаве', 'W Warszawie', 'Варшавою', 'Within Warsaw'), add: [0, 0, 0, 0, 0] },
  { label: l('До 50 км', 'Do 50 km', 'До 50 км', 'Up to 50 km'), add: [190, 250, 350, 490, 350] },
  { label: l('До 150 км', 'Do 150 km', 'До 150 км', 'Up to 150 km'), add: [690, 890, 1190, 1690, 1290] },
  { label: l('По Польше', 'Po Polsce', 'Польщею', 'Across Poland'), add: [1490, 1790, 2290, 3290, 2490] },
];

/** этаж без лифта, за каждый этаж на каждом адресе [размер] */
export const FLOOR = [50, 80, 100, 120, 100];

/** доп. услуги (если не входят в пакет); quote — номер в форме заявки; price — [размер] */
export const EXTRAS = [
  { id: 'boxes', quote: 2, price: [190, 290, 390, 690, 450], label: l('Белые коробки заранее', 'Białe kartony wcześniej', 'Білі коробки заздалегідь', 'White boxes in advance') },
  { id: 'assembly', quote: 3, price: [190, 350, 490, 790, 590], label: l('Разборка и сборка всей мебели', 'Demontaż i montaż wszystkich mebli', 'Розбирання та збирання всіх меблів', 'All furniture disassembly and assembly') },
  { id: 'mount', quote: 7, price: [390, 390, 390, 490, 490], label: l('ТВ на стену и до 5 картин', 'TV na ścianę i do 5 obrazów', 'ТВ на стіну й до 5 картин', 'TV on the wall and up to 5 pictures') },
  { id: 'removal', quote: 4, price: [390, 390, 490, 590, 490], label: l('Вывоз старой мебели', 'Wywóz starych mebli', 'Вивезення старих меблів', 'Old furniture removal') },
  { id: 'cleaning', quote: 5, price: [390, 590, 790, 1490, 1390], label: l('Уборка после переезда', 'Sprzątanie po przeprowadzce', 'Прибирання після переїзду', 'Cleaning after the move') },
];

export interface CalcInput { size: number; amount: number; zone: number; floorsNoLift: number; pkg: number; extras: number[] }
export interface CalcResult { pkg: number; dist: number; floors: number; extras: number; total: number }

const r90 = (n: number) => Math.max(90, Math.round((n - 90) / 100) * 100 + 90); // …90 zł
const r10 = (n: number) => Math.round(n / 10) * 10;

/** доп. услуги, которые уже входят в пакет, не считаем */
export const extraIncluded = (pkg: number, extra: number) => (PACKAGES[pkg]?.inc ?? []).includes(EXTRAS[extra]?.id);

/** главный расчёт — тот же на сайте и у менеджера */
export function estimate(x: CalcInput): CalcResult {
  const s = Math.min(Math.max(0, x.size), SIZES.length - 1);
  const p = Math.min(Math.max(0, x.pkg), PACKAGES.length - 1);
  const k = AMOUNTS[x.amount]?.k ?? 1;
  const res = {
    pkg: r90(GRID[s][p] * k),
    dist: ZONES[x.zone]?.add[s] ?? 0,
    floors: r10(Math.max(0, x.floorsNoLift) * FLOOR[s] * k),
    extras: x.extras.filter((e) => !extraIncluded(p, e)).reduce((sum, e) => sum + (EXTRAS[e]?.price[s] ?? 0), 0),
  };
  return { ...res, total: res.pkg + res.dist + res.floors + res.extras };
}

/** цены всех трёх пакетов при тех же условиях (для карточек и подсказки «всего +X zł») */
export const comparePackages = (x: Omit<CalcInput, 'pkg'>) => PACKAGES.map((_, pkg) => estimate({ ...x, pkg }));

/** формат сумм: «1 690» на ru/pl/uk, «1,690» на en (польский Intl сам не ставит пробел в 4-значных) */
export const moneyLocale = (lang: string) => (lang === 'pl' ? 'ru' : lang || 'ru');
export const money = (n: number, lang: string) => new Intl.NumberFormat(moneyLocale(lang)).format(n);

/** табло на главной: «от …» = пакет «Перевозка», по Варшаве, с лифтом, обычное количество вещей */
export const boardOptions = SIZES.map((s, i) => ({ label: s.label, status: s.status, value: GRID[i][0] }));
