/**
 * ЦЕНЫ MELBUS — ОДНА формула для всего: калькулятор, табло на главной, расчёт менеджера по видео.
 *
 *   работа = часы × ставка бригады (бус + N грузчиков)
 *   + дорога (зона: доп. часы бригады + км)
 *   + этажи без лифта (часы на этаж) + упаковка (часы + материалы) + доп. услуги
 *   × запас фиксированной цены (мы берём риск «не уложились по времени» на себя)
 *   → каждую часть округляем до 10 zł.
 *
 * Все суммы brutto (с VAT 23 %). PRICE_STATUS: 'demo' → 'proposal' → 'approved'.
 * Пока не 'approved', на сайте подпись «демо-цифры». Подписи — сразу на 4 языках.
 */
import type { L } from '../i18n/text';

export const PRICE_STATUS: 'demo' | 'proposal' | 'approved' = 'demo';
export const DEMO = PRICE_STATUS !== 'approved';

const l = (ru: string, pl: string, uk: string, en: string): L => ({ ru, pl, uk, en });

/** ставки и общие правила */
export const rates = {
  crewHour: { 2: 290, 3: 380, 4: 470 } as Record<number, number>, // бус + N грузчиков, zł/час
  minHours: 2,          // минимальный заказ
  buffer: 0.1,          // запас фиксированной цены (+10 %)
  boxPrice: 9,          // белая коробка MELBUS с доставкой, zł/шт.
};

/** что везём: часы работы по Варшаве (погрузка + дорога + разгрузка), бригада, этажи, упаковка, доп. услуги */
export const SIZES = [
  { label: l('Студия', 'Kawalerka', 'Студія', 'Studio'), status: l('Студия · до 30 м²', 'Kawalerka · do 30 m²', 'Студія · до 30 м²', 'Studio · up to 30 m²'),
    crew: 2, hours: 3, floorH: 0.15, packH: [0, 1, 2.5], packMat: [0, 60, 180], boxes: 15, assemblyH: 1, unpackH: 1.5, m2: 30, quote: 0 },
  { label: l('2 комнаты', '2 pokoje', '2 кімнати', '2 rooms'), status: l('2 комнаты · 40–55 м²', '2 pokoje · 40–55 m²', '2 кімнати · 40–55 м²', '2 rooms · 40–55 m²'),
    crew: 2, hours: 5, floorH: 0.25, packH: [0, 1.5, 4], packMat: [0, 90, 300], boxes: 25, assemblyH: 2, unpackH: 2.5, m2: 50, quote: 1 },
  { label: l('3 комнаты', '3 pokoje', '3 кімнати', '3 rooms'), status: l('3 комнаты · 60–80 м²', '3 pokoje · 60–80 m²', '3 кімнати · 60–80 м²', '3 rooms · 60–80 m²'),
    crew: 3, hours: 6, floorH: 0.3, packH: [0, 2, 5], packMat: [0, 120, 420], boxes: 35, assemblyH: 2.5, unpackH: 3, m2: 70, quote: 2 },
  { label: l('Дом', 'Dom', 'Будинок', 'House'), status: l('Дом · до 150 м²', 'Dom · do 150 m²', 'Будинок · до 150 м²', 'House · up to 150 m²'),
    crew: 4, hours: 8, floorH: 0.35, packH: [0, 3, 7], packMat: [0, 180, 650], boxes: 60, assemblyH: 4, unpackH: 4.5, m2: 130, quote: 4 },
  { label: l('Офис', 'Biuro', 'Офіс', 'Office'), status: l('Офис · 10–15 мест', 'Biuro · 10–15 stanowisk', 'Офіс · 10–15 місць', 'Office · 10–15 desks'),
    crew: 3, hours: 7, floorH: 0.3, packH: [0, 2, 5], packMat: [0, 120, 400], boxes: 40, assemblyH: 3, unpackH: 3, m2: 120, quote: 5 },
];

/** куда едем: доп. часы бригады в дороге (туда-обратно) + км */
export const ZONES = [
  { label: l('По Варшаве', 'W Warszawie', 'Варшавою', 'Within Warsaw'), hours: 0, km: 0 },
  { label: l('До 50 км', 'Do 50 km', 'До 50 км', 'Up to 50 km'), hours: 1, km: 0 },
  { label: l('До 150 км', 'Do 150 km', 'До 150 км', 'Up to 150 km'), hours: 2.5, km: 0 },
  { label: l('По Польше', 'Po Polsce', 'Польщею', 'Across Poland'), hours: 5, km: 300 },
];
export const KM_PRICE = 3.5; // zł/км сверх зоны (межгород)

/** упаковка: индекс = packH/packMat в SIZES; quote — номер услуги в форме заявки (-1 = нет) */
export const PACKING = [
  { label: l('Пакуем сами', 'Pakujemy sami', 'Пакуємо самі', 'We pack ourselves'), quote: -1 },
  { label: l('Только хрупкое', 'Tylko delikatne', 'Лише крихке', 'Fragile items only'), quote: 1 },
  { label: l('Всё под ключ', 'Wszystko pod klucz', 'Усе під ключ', 'Everything'), quote: 0 },
];

/** доп. услуги: как считаем (часы бригады / коробки / фикс / за м²); quote — номер в форме заявки */
export const EXTRAS = [
  { id: 'boxes', quote: 2, label: l('Белые коробки заранее', 'Białe kartony wcześniej', 'Білі коробки заздалегідь', 'White boxes in advance') },
  { id: 'assembly', quote: 3, label: l('Разборка и сборка мебели', 'Demontaż i montaż mebli', 'Розбирання та збирання меблів', 'Furniture disassembly and assembly') },
  { id: 'removal', quote: 4, label: l('Вывоз старой мебели', 'Wywóz starych mebli', 'Вивезення старих меблів', 'Old furniture removal') },
  { id: 'cleaning', quote: 5, label: l('Уборка после переезда', 'Sprzątanie po przeprowadzce', 'Прибирання після переїзду', 'Cleaning after the move') },
  { id: 'unpack', quote: 6, label: l('Распаковка и расстановка', 'Rozpakowanie i ustawienie', 'Розпакування та розстановка', 'Unpacking and arranging') },
] as const;
export const REMOVAL_PRICE = 350;  // вывоз старой мебели (до ~3 предметов), zł
export const CLEANING_M2 = 7;      // уборка, zł/м²

export interface CalcInput { size: number; zone: number; floorsNoLift: number; pack: number; extras: number[] }
export interface CalcResult { crew: number; hours: number; base: number; dist: number; floors: number; pack: number; extras: number; total: number }

/** главный расчёт — тот же на сайте и у менеджера */
export function estimate(x: CalcInput): CalcResult {
  const s = SIZES[x.size] ?? SIZES[1];
  const z = ZONES[x.zone] ?? ZONES[0];
  const rate = rates.crewHour[s.crew];
  const k = 1 + rates.buffer;
  const r10 = (n: number) => Math.round((n * k) / 10) * 10;
  const hours = Math.max(rates.minHours, s.hours);
  const pack = x.pack > 0 ? s.packH[x.pack] * rate + s.packMat[x.pack] : 0;
  const ex = x.extras.reduce((sum, i) => {
    const id = EXTRAS[i]?.id;
    if (id === 'boxes') return sum + s.boxes * rates.boxPrice;
    if (id === 'assembly') return sum + s.assemblyH * rate;
    if (id === 'removal') return sum + REMOVAL_PRICE;
    if (id === 'cleaning') return sum + s.m2 * CLEANING_M2;
    if (id === 'unpack') return sum + s.unpackH * rate;
    return sum;
  }, 0);
  const res = {
    crew: s.crew, hours,
    base: r10(hours * rate),
    dist: r10(z.hours * rate + z.km * KM_PRICE),
    floors: r10(Math.max(0, x.floorsNoLift) * s.floorH * rate),
    pack: r10(pack),
    extras: r10(ex),
  };
  return { ...res, total: res.base + res.dist + res.floors + res.pack + res.extras };
}

/** табло на главной: «от …» для каждого размера (по Варшаве, с лифтом, без упаковки) — из той же формулы */
export const boardOptions = SIZES.map((s, i) => ({
  label: s.label, status: s.status,
  value: estimate({ size: i, zone: 0, floorsNoLift: 0, pack: 0, extras: [] }).total,
}));
