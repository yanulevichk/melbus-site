/**
 * ФОРМА «ЧТО У ВАС ДОМА» — модель цены (одна для формы на сайте, сообщения менеджеру и примеров на странице цен).
 *
 * Цена = часы работы людей × RATE + бус + коробки. Часы считаются заранее по списку вещей:
 *   у каждой вещи — минуты «вынести и занести», объём и минуты «разобрать и собрать»; размер (ширина и высота шкафа,
 *   размер кровати, диагональ ТВ…) меняет эти цифры. Плюс этажи без лифта, далёкая парковка, дорога A→B, допы, дата.
 * Обоснование и сравнение с рынком — документ «Цена переезда MELBUS» (Claude Docs). Все суммы brutto (с VAT).
 * Названия — сразу на 4 языках (тип L). Прототип с той же формулой — prototypes/forma-chto-doma.html.
 */
import type { L } from '../i18n/text';

const l = (ru: string, pl: string, uk: string, en: string): L => ({ ru, pl, uk, en });

export const RATE = 100;      // zł за час работы одного человека для клиента, с VAT (человек стоит фирме 40 zł/ч)
export const BUS = 150;       // бус за переезд: топливо и износ; входит KM_FREE км от адреса до адреса
export const CAP = 13;        // м³ в одном бусе (класс Fiat Ducato L3H2)
export const FLAT = 0.45;     // разобранная мебель занимает меньше места
export const BOX_MAT = 8;     // коробка + бумага + скотч, zł
export const FILM = 30;       // плёнка и скотч для мебели
export const KM_FREE = 30;    // км от адреса до адреса, которые входят в BUS
export const KM_RATE = 2.5;   // zł за каждый км сверх KM_FREE (покрывает и обратный путь)
export const HOURLY = 150;    // пакет 1 «Грузотакси»: бус с водителем, zł в час, минимум 2 часа
/** 18.11.2026: в «Перевозке» можно платить по часам (для тех, кого пугает фиксированная цена). Рынок Варшавы (ноябрь 2026):
 *  бус + водитель + 2 грузчика 190–360 zł/ч, чаще 260–290 (kb.pl, locayo, panprzeprowadzka). Ставка — предложение, ждёт «да». */
export const HOURLY2 = { base: 270, person: 90, van: 60, min: 3 };   // бус + 2 человека; каждый следующий человек; каждый следующий бус; минимум часов
export const EXAMPLE = { from: 'Warszawa, Mokotów', to: 'Warszawa, Bemowo', floor: 2 };   // пример для цен на сайте = начальное состояние формы

/** 18.11.2026 — три пакета (решение владельца): 1 грузотакси по часам; 2 вещи уже упакованы — выносим, везём, заносим
 *  (разборка и сборка — по желанию, отдельно); 3 под ключ — упаковка, разборка и сборка мебели входят. */
export const LEVELS = [
  { id: 1, icon: 'wheel', t: l('Грузотакси', 'Taxi bagażowe', 'Вантажне таксі', 'Van and driver'),
    d: l('Бус с водителем. Грузите вы, везём мы. 150 zł в час, минимум 2 часа.', 'Bus z kierowcą. Ty ładujesz, my wieziemy. 150 zł za godzinę, minimum 2 godziny.', 'Бус із водієм. Вантажите ви, веземо ми. 150 zł на годину, мінімум 2 години.', 'A van with a driver. You load, we drive. 150 zł an hour, 2 hours minimum.') },
  { id: 2, icon: 'carry', t: l('Перевозка', 'Transport', 'Перевезення', 'Transport'),
    d: l('Вещи уже упакованы. Мы выносим, везём и заносим. Разборку и сборку мебели можно добавить.', 'Rzeczy są już spakowane. Wynosimy, wieziemy i wnosimy. Demontaż i montaż mebli można dodać.', 'Речі вже спаковані. Ми виносимо, веземо й заносимо. Розбирання та збирання меблів можна додати.', 'Your things are already packed. We carry them out, drive and carry them in. Furniture assembly can be added.') },
  { id: 3, icon: 'key', t: l('Под ключ', 'Pod klucz', 'Під ключ', 'Full service'),
    d: l('Пакуем в наши белые коробки, разбираем мебель, везём и собираем на новом месте.', 'Pakujemy w nasze białe kartony, rozkręcamy meble, wieziemy i skręcamy w nowym miejscu.', 'Пакуємо в наші білі коробки, розбираємо меблі, веземо й збираємо на новому місці.', 'We pack everything into our white boxes, take the furniture apart, move it and reassemble it at your new place.') },
];

export const ROOMS: [string, L][] = [
  ['pop', l('Популярное', 'Najczęstsze', 'Популярне', 'Popular')],
  ['bed', l('Спальня', 'Sypialnia', 'Спальня', 'Bedroom')],
  ['live', l('Гостиная', 'Salon', 'Вітальня', 'Living room')],
  ['kit', l('Кухня', 'Kuchnia', 'Кухня', 'Kitchen')],
  ['kid', l('Детская, кабинет', 'Pokój dziecięcy, gabinet', 'Дитяча, кабінет', 'Kids’ room, study')],
  ['hall', l('Прихожая, балкон', 'Przedpokój, balkon', 'Передпокій, балкон', 'Hallway, balcony')],
];

export interface Opt { t: L; ic?: string; h?: number }
/** Размеры, которые меняют время работы и объём */
export const P: Record<string, { label: L; opts: Opt[] }> = {
  wardW: { label: l('Ширина', 'Szerokość', 'Ширина', 'Width'), opts: [
    { t: l('до 1 м', 'do 1 m', 'до 1 м', 'up to 1 m'), ic: 'wardS' }, { t: l('1,5–2 м', '1,5–2 m', '1,5–2 м', '1.5–2 m'), ic: 'wardM' }, { t: l('от 2 м, купе', 'od 2 m, przesuwna', 'від 2 м, купе', '2 m+, sliding'), ic: 'wardL' }] },
  wardH: { label: l('Высота', 'Wysokość', 'Висота', 'Height'), opts: [
    { t: l('до 2 м', 'do 2 m', 'до 2 м', 'up to 2 m'), h: 0.55 }, { t: l('2–2,4 м', '2–2,4 m', '2–2,4 м', '2–2.4 m'), h: 0.75 }, { t: l('до потолка', 'do sufitu', 'до стелі', 'floor to ceiling'), h: 1 }] },
  bedS: { label: l('Ширина спального места', 'Szerokość materaca', 'Ширина спального місця', 'Mattress width'), opts: [
    { t: l('90 см', '90 cm', '90 см', '90 cm') }, { t: l('140 см', '140 cm', '140 см', '140 cm') }, { t: l('160 см', '160 cm', '160 см', '160 cm') }, { t: l('180 см и шире', '180 cm i więcej', '180 см і ширше', '180 cm or wider') }] },
  bedT: { label: l('Основание', 'Podstawa', 'Основа', 'Base'), opts: [
    { t: l('обычное', 'zwykła', 'звичайна', 'standard') }, { t: l('с подъёмным механизмом', 'z pojemnikiem i podnośnikiem', 'з підйомним механізмом', 'lift-up storage base') }] },
  sofaT: { label: l('Какой', 'Rodzaj', 'Який', 'Type'), opts: [
    { t: l('2-местный', '2-osobowa', '2-місний', '2-seater'), ic: 'sofa' }, { t: l('3-местный', '3-osobowa', '3-місний', '3-seater'), ic: 'sofa' },
    { t: l('угловой', 'narożnik', 'кутовий', 'corner sofa'), ic: 'sofaC' }, { t: l('большой модульный', 'duży modułowy', 'великий модульний', 'large modular'), ic: 'sofaC' }] },
  tvS: { label: l('Диагональ', 'Przekątna', 'Діагональ', 'Screen size'), opts: [
    { t: l('до 55″', 'do 55″', 'до 55″', 'up to 55″') }, { t: l('55–75″', '55–75″', '55–75″', '55–75″') }, { t: l('больше 75″', 'ponad 75″', 'понад 75″', 'over 75″') }] },
  fridgeT: { label: l('Какой', 'Rodzaj', 'Який', 'Type'), opts: [
    { t: l('обычный', 'zwykła', 'звичайний', 'standard') }, { t: l('двухдверный, side-by-side', 'dwudrzwiowa, side-by-side', 'двостулковий, side-by-side', 'side-by-side') }] },
  tableT: { label: l('Какой', 'Rodzaj', 'Який', 'Type'), opts: [
    { t: l('на 4 человек', 'dla 4 osób', 'на 4 людей', 'seats 4') }, { t: l('на 6–8 человек', 'dla 6–8 osób', 'на 6–8 людей', 'seats 6–8') }, { t: l('со стеклянной столешницей', 'ze szklanym blatem', 'зі скляною стільницею', 'with a glass top') }] },
  shelfT: { label: l('Размер', 'Rozmiar', 'Розмір', 'Size'), opts: [
    { t: l('невысокий', 'niski', 'невисокий', 'low'), h: 0.5 }, { t: l('до 2 м', 'do 2 m', 'до 2 м', 'up to 2 m'), h: 0.75 }, { t: l('мебельная стенка', 'meblościanka', 'меблева стінка', 'wall unit'), h: 1 }] },
  deskT: { label: l('Какой', 'Rodzaj', 'Який', 'Type'), opts: [
    { t: l('обычный', 'zwykłe', 'звичайний', 'standard') }, { t: l('угловой', 'narożne', 'кутовий', 'corner') }] },
  mirrorT: { label: l('Размер', 'Rozmiar', 'Розмір', 'Size'), opts: [
    { t: l('до 1 м', 'do 1 m', 'до 1 м', 'up to 1 m') }, { t: l('больше 1 м', 'ponad 1 m', 'понад 1 м', 'over 1 m') }] },
};

export interface Spec { c: number; v: number; a: number }
export type Sel = Record<string, number>;
export interface Item {
  id: string; room: string; pop?: boolean; name: L; icon: string; kind: '' | 'bed' | 'ward' | 'tv' | 'conn';
  p?: string[]; def: Sel; spec: (s: Sel) => Spec; iconFor: (s: Sel) => string; alias: string;
}
const T3 = (arr: number[][]) => (i: number): Spec => ({ c: arr[i][0], v: arr[i][1], a: arr[i][2] || 0 });
const fixed = (c: number, v: number, a = 0) => () => ({ c, v, a });
type ItemIn = Omit<Item, 'kind' | 'def' | 'iconFor' | 'alias'> & Partial<Pick<Item, 'kind' | 'def' | 'iconFor' | 'alias'>>;
const mk = (it: ItemIn): Item => ({ kind: '', def: {}, iconFor: () => it.icon, alias: '', ...it });

// c — вынести и занести (чел.-мин), v — объём м³, a — разобрать и собрать (чел.-мин)
export const ITEMS: Item[] = [
  mk({ id: 'bed', room: 'bed', pop: true, name: l('Кровать', 'Łóżko', 'Ліжко', 'Bed'), icon: 'bed2', kind: 'bed', p: ['bedS', 'bedT'], def: { bedS: 2, bedT: 0 },
    spec: (s) => { const b = T3([[30, 0.8, 60], [40, 1.2, 80], [45, 1.4, 90], [55, 1.6, 100]])(s.bedS); return s.bedT ? { c: b.c + 20, v: b.v + 0.2, a: b.a + 40 } : b; },
    iconFor: (s) => (s.bedS === 0 ? 'bed1' : 'bed2'), alias: 'кровать матрас łóżko materac ліжко bed mattress' }),
  mk({ id: 'ward', room: 'bed', pop: true, name: l('Шкаф', 'Szafa', 'Шафа', 'Wardrobe'), icon: 'wardM', kind: 'ward', p: ['wardW', 'wardH'], def: { wardW: 1, wardH: 0 },
    spec: (s) => { const b = T3([[25, 0.7, 150], [60, 1.6, 270], [80, 2.2, 420]])(s.wardW), k = [1, 1.2, 1.45][s.wardH]; return { c: b.c * k, v: b.v * k, a: b.a * k }; },
    iconFor: (s) => ['wardS', 'wardM', 'wardL'][s.wardW], alias: 'шкаф гардероб купе szafa garderoba przesuwna pax шафа wardrobe closet' }),
  mk({ id: 'dresser', room: 'bed', pop: true, name: l('Комод', 'Komoda', 'Комод', 'Chest of drawers'), icon: 'dresser', spec: fixed(25, 0.6), alias: 'dresser' }),
  mk({ id: 'nights', room: 'bed', name: l('Тумбочка', 'Szafka nocna', 'Тумбочка', 'Bedside table'), icon: 'nights', spec: fixed(6, 0.15), alias: 'nightstand' }),
  mk({ id: 'mirror', room: 'bed', name: l('Зеркало', 'Lustro', 'Дзеркало', 'Mirror'), icon: 'mirror', p: ['mirrorT'], def: { mirrorT: 1 }, spec: (s) => T3([[8, 0.1], [15, 0.2]])(s.mirrorT) }),
  mk({ id: 'sofa', room: 'live', pop: true, name: l('Диван', 'Sofa', 'Диван', 'Sofa'), icon: 'sofa', p: ['sofaT'], def: { sofaT: 1 },
    spec: (s) => T3([[30, 1.1], [40, 1.5], [60, 2.5, 30], [80, 3.2, 60]])(s.sofaT), iconFor: (s) => (s.sofaT >= 2 ? 'sofaC' : 'sofa'), alias: 'диван софа kanapa narożnik диван couch' }),
  mk({ id: 'armch', room: 'live', pop: true, name: l('Кресло', 'Fotel', 'Крісло', 'Armchair'), icon: 'armch', spec: fixed(15, 0.6) }),
  mk({ id: 'tv', room: 'live', pop: true, name: l('Телевизор', 'Telewizor', 'Телевізор', 'TV'), icon: 'tv', kind: 'tv', p: ['tvS'], def: { tvS: 1 },
    spec: (s) => T3([[15, 0.2], [25, 0.35], [40, 0.5]])(s.tvS), alias: 'телевизор тв tv телевізор' }),
  mk({ id: 'tvst', room: 'live', name: l('Тумба под ТВ', 'Szafka RTV', 'Тумба під ТВ', 'TV stand'), icon: 'tvst', spec: fixed(15, 0.4) }),
  mk({ id: 'shelf', room: 'live', pop: true, name: l('Стеллаж, стенка', 'Regał, meblościanka', 'Стелаж, стінка', 'Shelving unit'), icon: 'shelf', p: ['shelfT'], def: { shelfT: 1 },
    spec: (s) => T3([[15, 0.5, 40], [25, 0.8, 60], [50, 1.6, 120]])(s.shelfT), alias: 'стеллаж стенка книжный regał półki bookcase' }),
  mk({ id: 'ctable', room: 'live', name: l('Журнальный столик', 'Stolik kawowy', 'Журнальний столик', 'Coffee table'), icon: 'ctable', spec: fixed(8, 0.3) }),
  mk({ id: 'rug', room: 'live', name: l('Ковёр', 'Dywan', 'Килим', 'Rug'), icon: 'rug', spec: fixed(8, 0.2) }),
  mk({ id: 'lamp', room: 'live', name: l('Торшер', 'Lampa stojąca', 'Торшер', 'Floor lamp'), icon: 'lamp', spec: fixed(5, 0.15) }),
  mk({ id: 'plant', room: 'live', name: l('Большой цветок', 'Duża roślina', 'Велика рослина', 'Large plant'), icon: 'plant', spec: fixed(6, 0.3) }),
  mk({ id: 'fridge', room: 'kit', pop: true, name: l('Холодильник', 'Lodówka', 'Холодильник', 'Fridge'), icon: 'fridge', p: ['fridgeT'], def: { fridgeT: 0 }, spec: (s) => T3([[40, 0.9], [70, 1.4]])(s.fridgeT) }),
  mk({ id: 'washer', room: 'kit', pop: true, name: l('Стиральная машина', 'Pralka', 'Пральна машина', 'Washing machine'), icon: 'washer', kind: 'conn', spec: fixed(40, 0.4), alias: 'стиралка' }),
  mk({ id: 'dishw', room: 'kit', name: l('Посудомойка', 'Zmywarka', 'Посудомийна машина', 'Dishwasher'), icon: 'dishw', kind: 'conn', spec: fixed(30, 0.4) }),
  mk({ id: 'dtable', room: 'kit', pop: true, name: l('Обеденный стол', 'Stół do jadalni', 'Обідній стіл', 'Dining table'), icon: 'dtable', p: ['tableT'], def: { tableT: 0 },
    spec: (s) => T3([[15, 0.6, 24], [25, 1.0, 40], [30, 0.8, 40]])(s.tableT), alias: 'стол stół стіл table' }),
  mk({ id: 'chair', room: 'kit', pop: true, name: l('Стул', 'Krzesło', 'Стілець', 'Chair'), icon: 'chair', spec: fixed(5, 0.15) }),
  mk({ id: 'desk', room: 'kid', pop: true, name: l('Письменный стол', 'Biurko', 'Письмовий стіл', 'Desk'), icon: 'desk', p: ['deskT'], def: { deskT: 0 },
    spec: (s) => T3([[15, 0.5, 60], [25, 0.8, 90]])(s.deskT), alias: 'стол компьютерный biurko стіл desk' }),
  mk({ id: 'ochair', room: 'kid', name: l('Офисное кресло', 'Krzesło biurowe', 'Офісне крісло', 'Office chair'), icon: 'ochair', spec: fixed(5, 0.3) }),
  mk({ id: 'bunk', room: 'kid', name: l('Двухъярусная кровать', 'Łóżko piętrowe', 'Двоярусне ліжко', 'Bunk bed'), icon: 'bunk', kind: 'bed', spec: fixed(40, 1.2, 180) }),
  mk({ id: 'crib', room: 'kid', name: l('Детская кроватка', 'Łóżeczko dziecięce', 'Дитяче ліжечко', 'Cot'), icon: 'crib', kind: 'bed', spec: fixed(15, 0.5, 40) }),
  mk({ id: 'pc', room: 'kid', name: l('Компьютер с монитором', 'Komputer z monitorem', 'Комп’ютер з монітором', 'Computer and monitor'), icon: 'pc', spec: fixed(10, 0.2) }),
  mk({ id: 'hallw', room: 'hall', name: l('Шкаф в прихожей, обувница', 'Szafa w przedpokoju, szafka na buty', 'Шафа в передпокої, взуттєва шафа', 'Hallway cabinet, shoe rack'), icon: 'hall', spec: fixed(20, 0.6) }),
  mk({ id: 'bike', room: 'hall', name: l('Велосипед', 'Rower', 'Велосипед', 'Bicycle'), icon: 'bike', spec: fixed(8, 0.5) }),
  mk({ id: 'stroll', room: 'hall', name: l('Коляска', 'Wózek dziecięcy', 'Візочок', 'Pushchair'), icon: 'stroll', spec: fixed(5, 0.4) }),
  mk({ id: 'balc', room: 'hall', name: l('Балконная мебель', 'Meble balkonowe', 'Балконні меблі', 'Balcony furniture'), icon: 'balc', spec: fixed(10, 0.5) }),
  mk({ id: 'tires', room: 'hall', name: l('Колёса, комплект', 'Komplet opon', 'Колеса, комплект', 'Set of tyres'), icon: 'tires', spec: fixed(10, 0.4) }),
  mk({ id: 'bags', room: 'hall', name: l('Сумка, чемодан', 'Torba, walizka', 'Сумка, валіза', 'Bag or suitcase'), icon: 'bags', spec: fixed(3, 0.1) }),
];
export const ITEM: Record<string, Item> = Object.fromEntries(ITEMS.map((i) => [i.id, i]));

/** Допы: минуты работы → цена (минуты × RATE). Цены сверены с рынком Польши 2026. */
export const EXTRAS = [
  { id: 'tvOff', icon: 'tvwall', min: 48, name: l('Снять телевизор со стены', 'Zdjęcie telewizora ze ściany', 'Зняти телевізор зі стіни', 'Take the TV off the wall'),
    d: l('Вместе с кронштейном. Старые дюбели остаются в стене.', 'Razem z uchwytem. Stare kołki zostają w ścianie.', 'Разом із кронштейном. Старі дюбелі залишаються в стіні.', 'Bracket included. The old wall plugs stay in the wall.') },
  { id: 'tvOn', icon: 'drill', min: 150, name: l('Повесить телевизор на новом месте', 'Montaż telewizora w nowym miejscu', 'Повісити телевізор на новому місці', 'Mount the TV at the new place'),
    d: l('Ищем проводку, ставим новые дюбели под вашу стену. Кронштейн ваш.', 'Sprawdzamy przewody i osadzamy nowe kołki dobrane do ściany. Uchwyt jest Twój.', 'Шукаємо проводку, ставимо нові дюбелі під вашу стіну. Кронштейн ваш.', 'We check for cables and use new wall plugs that suit your wall. You provide the bracket.') },
  { id: 'holes', icon: 'putty', min: 36, unit: l('за место', 'za miejsce', 'за місце', 'per spot'), name: l('Заделать отверстия', 'Zaszpachlowanie otworów', 'Закласти отвори', 'Fill the holes'),
    d: l('После телевизора, карниза или полки, без покраски. Пригодится, чтобы вернуть залог за съёмную квартиру.', 'Po telewizorze, karniszu lub półce, bez malowania. Przyda się przy odzyskiwaniu kaucji za wynajęte mieszkanie.', 'Після телевізора, карниза чи полиці, без фарбування. Знадобиться, щоб повернути заставу за орендовану квартиру.', 'After a TV, curtain rod or shelf, without painting. Handy for getting your rental deposit back.') },
  { id: 'rodOff', icon: 'rod', min: 18, name: l('Снять карниз', 'Demontaż karnisza', 'Зняти карниз', 'Take down a curtain rod'),
    d: l('Шторы снимем и упакуем.', 'Zdejmiemy i spakujemy zasłony.', 'Штори знімемо й запакуємо.', 'We take down and pack the curtains.') },
  { id: 'rodOn', icon: 'rod', min: 84, name: l('Повесить карниз', 'Montaż karnisza', 'Повісити карниз', 'Put up a curtain rod'),
    d: l('С новыми дюбелями, по уровню.', 'Na nowych kołkach, w poziomie.', 'З новими дюбелями, за рівнем.', 'With new wall plugs, perfectly level.') },
  { id: 'hang', icon: 'frame', min: 24, name: l('Повесить картину, зеркало, полку', 'Powieszenie obrazu, lustra, półki', 'Повісити картину, дзеркало, полицю', 'Hang a picture, mirror or shelf'),
    d: l('До 10 кг, с новыми дюбелями.', 'Do 10 kg, na nowych kołkach.', 'До 10 кг, з новими дюбелями.', 'Up to 10 kg, with new wall plugs.') },
  { id: 'conn', icon: 'washer', min: 90, name: l('Отключить и подключить стиральную или посудомоечную машину', 'Odłączenie i podłączenie pralki lub zmywarki', 'Відключити й підключити пральну чи посудомийну машину', 'Disconnect and reconnect a washing machine or dishwasher'),
    d: l('Воду и слив. Транспортные болты поставим, если они у вас есть.', 'Woda i odpływ. Śruby transportowe założymy, jeśli je masz.', 'Воду й злив. Транспортні болти поставимо, якщо вони у вас є.', 'Water and drain. We fit the transport bolts if you have them.') },
  { id: 'junk', icon: 'bin', min: 90, name: l('Вывезти старую мебель', 'Wywóz starych mebli', 'Вивезти старі меблі', 'Remove old furniture'),
    d: l('Вынесем и отвезём в пункт приёма отходов.', 'Wyniesiemy i zawieziemy do punktu odbioru odpadów.', 'Винесемо й відвеземо до пункту прийому відходів.', 'We carry it out and take it to a waste collection point.') },
] as { id: string; icon: string; min: number; unit?: L; name: L; d: L }[];

/** Заготовки «Начать с»: [вещь, сколько, размер] */
export const PRESETS: Record<string, { t: L; items: [string, number, Sel?][]; boxes: number }> = {
  studio: { t: l('Кавалерка', 'Kawalerka', 'Студія', 'Studio flat'), boxes: 20, items: [['bed', 1, { bedS: 2 }], ['ward', 1, { wardW: 1, wardH: 0 }], ['dresser', 1], ['armch', 1], ['tv', 1, { tvS: 0 }], ['tvst', 1], ['dtable', 1], ['chair', 2], ['fridge', 1], ['washer', 1], ['rug', 1], ['plant', 1], ['bags', 3]] },
  two: { t: l('2 комнаты', '2 pokoje', '2 кімнати', '2 rooms'), boxes: 40, items: [['bed', 1, { bedS: 2 }], ['nights', 2], ['ward', 2, { wardW: 1, wardH: 0 }], ['dresser', 1], ['sofa', 1, { sofaT: 1 }], ['armch', 1], ['tv', 1, { tvS: 1 }], ['tvst', 1], ['ctable', 1], ['rug', 1], ['lamp', 1], ['plant', 2], ['fridge', 1], ['washer', 1], ['dtable', 1], ['chair', 4], ['bags', 4]] },
  three: { t: l('3 комнаты', '3 pokoje', '3 кімнати', '3 rooms'), boxes: 60, items: [['bed', 1, { bedS: 2 }], ['bed', 1, { bedS: 0 }], ['nights', 2], ['ward', 2, { wardW: 1, wardH: 1 }], ['ward', 1, { wardW: 0, wardH: 0 }], ['dresser', 1], ['sofa', 1, { sofaT: 2 }], ['armch', 2], ['tv', 1, { tvS: 1 }], ['tvst', 1], ['shelf', 1], ['ctable', 1], ['rug', 2], ['lamp', 1], ['plant', 3], ['fridge', 1], ['washer', 1], ['dishw', 1], ['dtable', 1, { tableT: 1 }], ['chair', 6], ['desk', 1], ['ochair', 1], ['pc', 1], ['hallw', 1], ['bike', 1], ['bags', 6]] },
  house: { t: l('Дом', 'Dom', 'Будинок', 'House'), boxes: 90, items: [['bed', 2, { bedS: 3 }], ['bed', 1, { bedS: 0 }], ['nights', 4], ['ward', 3, { wardW: 1, wardH: 1 }], ['ward', 1, { wardW: 2, wardH: 2 }], ['dresser', 2], ['sofa', 1, { sofaT: 3 }], ['armch', 2], ['tv', 2, { tvS: 1 }], ['tvst', 1], ['shelf', 2, { shelfT: 2 }], ['ctable', 1], ['rug', 3], ['lamp', 2], ['plant', 4], ['fridge', 1, { fridgeT: 1 }], ['washer', 1], ['dishw', 1], ['dtable', 1, { tableT: 1 }], ['chair', 6], ['desk', 1], ['ochair', 1], ['pc', 1], ['hallw', 1], ['bike', 2], ['balc', 1], ['tires', 1], ['bags', 8]] },
  empty: { t: l('С нуля', 'Od zera', 'З нуля', 'Start empty'), boxes: 0, items: [] },
};

/** Районы и города для подсказок адреса (на сайте позже — поиск точного адреса и маршрут по дорогам). */
export const PLACES = ([
  ['Warszawa, Mokotów', 52.1935, 21.035], ['Warszawa, Śródmieście', 52.2297, 21.0122], ['Warszawa, Wola', 52.2366, 20.958],
  ['Warszawa, Ochota', 52.212, 20.972], ['Warszawa, Praga-Południe', 52.239, 21.085], ['Warszawa, Praga-Północ', 52.258, 21.033],
  ['Warszawa, Żoliborz', 52.269, 20.985], ['Warszawa, Bielany', 52.293, 20.942], ['Warszawa, Bemowo', 52.254, 20.911],
  ['Warszawa, Ursus', 52.195, 20.883], ['Warszawa, Włochy', 52.194, 20.943], ['Warszawa, Ursynów', 52.15, 21.05],
  ['Warszawa, Wilanów', 52.165, 21.088], ['Warszawa, Wawer', 52.196, 21.178], ['Warszawa, Białołęka', 52.319, 20.996],
  ['Warszawa, Targówek', 52.29, 21.048], ['Warszawa, Rembertów', 52.26, 21.15], ['Warszawa, Wesoła', 52.24, 21.22],
  ['Piaseczno', 52.073, 21.026], ['Pruszków', 52.17, 20.812], ['Legionowo', 52.401, 20.926], ['Marki', 52.327, 21.105],
  ['Ząbki', 52.292, 21.106], ['Łomianki', 52.334, 20.886], ['Otwock', 52.105, 21.261], ['Józefów', 52.137, 21.235],
  ['Konstancin-Jeziorna', 52.094, 21.117], ['Grodzisk Mazowiecki', 52.109, 20.625],
  ['Łódź', 51.7592, 19.456], ['Radom', 51.4027, 21.1471], ['Płock', 52.5468, 19.7064], ['Lublin', 51.2465, 22.5684],
  ['Białystok', 53.1325, 23.1688], ['Kraków', 50.0647, 19.945], ['Poznań', 52.4064, 16.9252], ['Wrocław', 51.1079, 17.0385],
  ['Gdańsk', 54.352, 18.6466], ['Berlin', 52.52, 13.405],
] as [string, number, number][]).map(([n, lat, lon]) => ({ n, lat, lon }));
export const PLACE: Record<string, { n: string; lat: number; lon: number }> = Object.fromEntries(PLACES.map((p) => [p.n, p]));
export function roadKm(a: { lat: number; lon: number }, b: { lat: number; lon: number }) {   // по прямой × извилистость дорог
  const r = Math.PI / 180, dLat = (b.lat - a.lat) * r, dLon = (b.lon - a.lon) * r;
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(a.lat * r) * Math.cos(b.lat * r) * Math.sin(dLon / 2) ** 2;
  const km = 12742 * Math.asin(Math.sqrt(h));
  return km * (km < 25 ? 1.35 : 1.2);
}
export function driveMin(km: number) {          // город ~22 км/ч, пригород ~50, трасса ~75 + 10 мин на парковку
  const t = Math.min(km, 15) / 22 + Math.max(0, Math.min(km, 60) - 15) / 50 + Math.max(0, km - 60) / 75;
  return t * 60 + 10;
}

export interface End { place: string; floor: number; lift: boolean; door: number; house: number }
export interface Entry { u?: number; id: string; n: number; sel: Sel; asm?: boolean; cond?: 'ok' | 'whole' | 'fix' | 'drop' }
export interface State {
  level: number; hours: number; from: End; to: End; list: Entry[]; boxes: number; extras: Record<string, number>;
  unpack?: boolean; ahead?: boolean; kitchen?: boolean; dateK?: number;
  asmAll?: boolean;               // «Перевозка»: разобрать и собрать всю мебель (в «Под ключ» входит всегда)
  pay?: 'fixed' | 'hourly';       // «Перевозка»: фиксированная цена (по умолчанию) или по часам
}
export function route(S: Pick<State, 'from' | 'to'>) {   // только от адреса до адреса: где наша база — не забота клиента
  const A = PLACE[S.from.place], B = PLACE[S.to.place];
  if (!A || !B) return null;
  const ab = Math.max(3, roadKm(A, B));
  return { ab, min: driveMin(ab), extraKm: Math.max(0, ab - KM_FREE) };
}
export const DOOR = [0, 0.15, 0.3];             // у подъезда / до 50 м / дальше
export const HOUSE = [0, 0.1, 0];               // блок / каменица (узкие лестницы, двор) / дом
export const up90 = (x: number) => Math.max(90, Math.ceil((x - 90) / 100) * 100 + 90);   // вверх до …90
export const specOf = (e: Entry) => ITEM[e.id].spec({ ...ITEM[e.id].def, ...e.sel });
export const asmDefault = (_it: Item, lvl: number, all = false) => lvl === 3 || (lvl === 2 && all);
export const asmOn = (e: Entry, lvl: number, all = false) => specOf(e).a > 0 && (e.asm ?? asmDefault(ITEM[e.id], lvl, all));
export const money = (min: number) => min / 60 * RATE;

/** Строки разбивки: k — что это (подпись даёт форма на нужном языке), min — минуты работы людей, sum — zł */
export interface Line { k: 'carry' | 'road' | 'asm' | 'pack' | 'packK' | 'unpack' | 'mount' | 'junk' | 'bus' | 'mat' | 'date' | 'hourly' | 'hourly2' | 'km'; min?: number; sum: number; x?: Record<string, number> }
export interface Result {
  lvl: number; total: number; raw: number; hourly?: boolean; empty?: boolean; crew: number; dur: number; vol: number; buses: number;
  fill: number; peopleH: number; lines: Line[]; n: number; rt: { ab: number; min: number; extraKm: number };
  hourly2?: { rate: number; h: number; sum: number };   // «Перевозка» по часам: ставка, оценка часов, оценка суммы
  paidHourly?: boolean;                             // итог посчитан по часам (S.pay === 'hourly')
}
export function calc(S: State, lvl = S.level): Result {
  const RT = route(S) || { ab: 10, min: 40, extraKm: 0 };
  const kmCost = RT.extraKm * KM_RATE, dk = S.dateK || 0;
  if (lvl === 1) {
    const h = Math.max(2, S.hours), base = h * HOURLY + kmCost;
    const lines: Line[] = [{ k: 'hourly', sum: h * HOURLY, x: { h } }];
    if (kmCost) lines.push({ k: 'km', sum: kmCost, x: { km: RT.extraKm } });
    if (dk) lines.push({ k: 'date', sum: base * dk, x: { dk } });
    return { lvl, total: Math.round(base * (1 + dk) / 10) * 10, raw: base * (1 + dk), hourly: true, crew: 1, dur: h, vol: 0, buses: 1, fill: 0, peopleH: h, lines, n: 0, rt: RT };
  }
  let carry = 0, asm = 0, junk = 0, mount = 0, vol = 0, n = 0;
  for (const e of S.list) {
    const it = ITEM[e.id]; if (!it || !e.n) continue;
    const sp = specOf(e), c = e.n, cond = it.kind === 'ward' ? (e.cond || 'ok') : 'ok';
    if (cond === 'drop') { junk += 90 * c; continue; }
    n += c;
    carry += sp.c * c * (cond === 'whole' ? 1.5 : 1);
    const on = cond === 'ok' && asmOn(e, lvl, S.asmAll);
    const flat = sp.a > 0 && (cond === 'fix' || on || (lvl === 2 && it.kind === 'ward' && cond === 'ok'));
    vol += sp.v * c * (flat ? FLAT : 1);
    if (cond === 'fix') asm += (sp.a + 60) * c; else if (on) asm += sp.a * c;
  }
  const B = S.boxes || 0;
  carry += B * 4; vol += B * 0.1;
  const kitchen = lvl === 2 && S.kitchen ? 10 : 0;            // «упаковать кухню и хрупкое» в «Перевозке»
  const pack = lvl === 3 ? B * 10 : kitchen * 10;
  const unpack = S.unpack ? B * 9 : 0;
  const small = n + B > 0 ? Math.max(30, carry * 0.1) : 0;
  const end = (e: End) => (e.lift ? 0 : e.floor) * 0.1 + DOOR[e.door || 0] + HOUSE[e.house || 0];
  const floors = carry / 2 * (end(S.from) + end(S.to));      // этажи без лифта, далёкая парковка, каменица
  for (const e of EXTRAS) {
    const k = S.extras[e.id] || 0;
    if (e.id === 'junk') junk += e.min * k; else mount += e.min * k;
  }
  const work = carry + small + floors + asm + pack + unpack + mount + junk;
  if (work <= 0) return { lvl, total: 0, raw: 0, empty: true, crew: 0, dur: 0, vol: 0, buses: 0, fill: 0, peopleH: 0, lines: [], n: 0, rt: RT };
  // не влезает в один бус — едут сразу несколько (за рулём второго — один из бригады). Проверено 18.11.2026: один бус
  // в несколько рейсов выходит дороже и дольше (бригада катается туда-обратно), поэтому такой вариант не предлагаем.
  const buses = Math.max(1, Math.ceil(vol / CAP - 1e-9));
  const crew = Math.max(work / 60 <= 6 ? 2 : work / 60 <= 16 ? 3 : 4, buses + 1);   // за рулём второго буса — один из бригады
  const travel = n + B > 0 ? RT.min * crew : 0;
  const extraKm = RT.extraKm;
  const busCost = buses * (BUS + extraKm * KM_RATE);
  const mat = (lvl === 3 || S.ahead ? B * BOX_MAT : kitchen * BOX_MAT) + (n > 0 ? FILM : 0);
  const raw = money(work + travel) + busCost + mat;
  const dur = work / crew / 60 + (travel ? RT.min / 60 : 0);
  // «Перевозка» по часам: ставка за бус и бригаду × часы от подачи до конца разгрузки (не меньше минимума, шаг 30 мин)
  const rate = HOURLY2.base + (crew - 2) * HOURLY2.person + (buses - 1) * HOURLY2.van;
  const h = Math.max(HOURLY2.min, Math.ceil(dur * 2) / 2);
  const hourly2 = { rate, h, sum: rate * h + extraKm * KM_RATE * buses + mat };
  const W = (k: Line['k'], m: number, x?: Record<string, number>): Line => ({ k, min: m, sum: money(m), x });
  const base = { lvl, crew, dur, vol, buses, fill: vol / (buses * CAP), peopleH: (work + travel) / 60, n, rt: RT, hourly2: lvl === 2 ? hourly2 : undefined };
  if (lvl === 2 && S.pay === 'hourly') {
    const lines: Line[] = [{ k: 'hourly2', sum: rate * h, x: { rate, h, crew, buses } }];
    if (extraKm) lines.push({ k: 'km', sum: extraKm * KM_RATE * buses, x: { km: extraKm } });
    if (mat) lines.push({ k: 'mat', sum: mat, x: { boxes: kitchen } });
    const sum = hourly2.sum * (1 + dk);
    if (dk) lines.push({ k: 'date', sum: hourly2.sum * dk, x: { dk } });
    return { ...base, total: Math.round(sum / 10) * 10, raw: sum, lines, paidHourly: true };
  }
  const lines: Line[] = [
    W('carry', carry + small + floors), W('road', travel, { km: RT.ab, min: RT.min, crew }), W('asm', asm), W(lvl === 3 ? 'pack' : 'packK', pack),
    W('unpack', unpack), W('mount', mount), W('junk', junk),
    { k: 'bus', sum: busCost, x: { buses, extraKm } }, { k: 'mat', sum: mat, x: { boxes: B } },
  ].filter((x) => x.sum > 0);
  if (dk) lines.push({ k: 'date', sum: raw * dk, x: { dk } });
  return { ...base, total: up90(raw * (1 + dk)), raw: raw * (1 + dk), lines };
}

/**
 * Цена заготовки (для примеров на странице цен, главной и табло): по Варшаве ~15 км, лифт с обеих сторон.
 * o.asmAll — разобрать и собрать всю мебель, o.kitchen / o.ahead — упаковать кухню и хрупкое / коробки заранее.
 */
export function presetTotal(key: string, lvl: number, o: { asmAll?: boolean; kitchen?: boolean; ahead?: boolean } = {}) {
  return calc(presetState(key, lvl, o)).total;
}
/** Состояние формы для заготовки: те же адреса, этажи и лифт, что у формы при открытии, — поэтому цифры совпадают везде. */
export function presetState(key: string, lvl: number, o: { asmAll?: boolean; kitchen?: boolean; ahead?: boolean } = {}): State {
  const p = PRESETS[key];
  const end = (place: string): End => ({ place, floor: EXAMPLE.floor, lift: true, door: 0, house: 0 });
  return { level: lvl, hours: 2, from: end(EXAMPLE.from), to: end(EXAMPLE.to), boxes: p.boxes, extras: {},
    kitchen: o.kitchen, ahead: o.ahead, asmAll: o.asmAll,
    list: p.items.map(([id, n, sel]) => ({ id, n, sel: { ...ITEM[id].def, ...(sel || {}) } })) };
}
