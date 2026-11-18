/**
 * ЦЕНЫ MELBUS НА САЙТЕ — всё считается ОДНОЙ формулой из src/data/move.ts (та же, что в форме «Что у вас дома»,
 * в сообщении менеджеру и в оферте). Здесь — только пакеты (названия, что входит) и примеры для главной.
 *
 * 18.11.2026, решение владельца — три пакета:
 *   1 «Грузотакси» — бус с водителем, грузит клиент, по часам (HOURLY, минимум 2 часа);
 *   2 «Перевозка» — вещи уже упакованы: выносим, везём, заносим; фиксированная цена или по часам (HOURLY2);
 *     разборка и сборка мебели — по желанию, отдельно;
 *   3 «Под ключ» — упаковка в наши коробки, разборка и сборка мебели входят; только фиксированная цена.
 * Пример для цифр на сайте = начальное состояние формы (EXAMPLE в move.ts): по Варшаве, Мокотув → Бемово, 2 этаж, лифт.
 * Поэтому «от 1 790 zł» на главной откроется в форме ровно с той же суммой.
 *
 * Все суммы brutto (с VAT 23 %). PRICE_STATUS: 'proposal' → 'approved' (после «да» владельца).
 */
import type { L } from '../i18n/text';
import { presetTotal, HOURLY, HOURLY2 } from './move';

export const PRICE_STATUS = 'proposal' as 'demo' | 'proposal' | 'approved';
export const DEMO = PRICE_STATUS !== 'approved';

const l = (ru: string, pl: string, uk: string, en: string): L => ({ ru, pl, uk, en });

/** пакеты; lvl — уровень в форме (move.ts LEVELS) */
export const PACKAGES = [
  {
    id: 'taxi', lvl: 1, icon: 'wheel',
    name: l('Грузотакси', 'Taxi bagażowe', 'Вантажне таксі', 'Van and driver'),
    note: l('Грузите вы — везём мы', 'Ty ładujesz — my wieziemy', 'Вантажите ви — веземо ми', 'You load, we drive'),
    items: [
      l('Бус с водителем', 'Bus z kierowcą', 'Бус із водієм', 'A van with a driver'),
      l('Ремни для крепления груза', 'Pasy do mocowania ładunku', 'Ремені для кріплення вантажу', 'Straps to secure the load'),
      l('Платите только за время', 'Płacisz tylko za czas', 'Платите лише за час', 'You pay only for the time'),
    ],
  },
  {
    id: 'move', lvl: 2, icon: 'carry',
    name: l('Перевозка', 'Transport', 'Перевезення', 'Transport'),
    note: l('Вещи упакованы — остальное на нас', 'Rzeczy spakowane — resztą zajmiemy się my', 'Речі спаковані — решта на нас', 'You’ve packed — we do the rest'),
    items: [
      l('Бус и бригада в фирменной форме', 'Bus i ekipa w firmowych uniformach', 'Бус і бригада у фірмовій формі', 'A van and a uniformed crew'),
      l('Выносим, везём и заносим', 'Wynosimy, wieziemy i wnosimy', 'Виносимо, веземо й заносимо', 'We carry out, drive and carry in'),
      l('Плёнка и одеяла для мебели, защита пола', 'Folia i koce na meble, ochrona podłóg', 'Плівка й ковдри для меблів, захист підлоги', 'Stretch wrap and blankets for furniture, floor protection'),
      l('Разборка и сборка мебели — по желанию', 'Demontaż i montaż mebli — na życzenie', 'Розбирання та збирання меблів — за бажанням', 'Furniture assembly if you need it'),
    ],
  },
  {
    id: 'full', lvl: 3, icon: 'key',
    name: l('Под ключ', 'Pod klucz', 'Під ключ', 'Full service'),
    note: l('Вам остаются только ключи', 'Tobie zostają tylko klucze', 'Вам залишаються лише ключі', 'All that’s left for you is the keys'),
    items: [
      l('Всё из «Перевозки»', 'Wszystko z pakietu „Transport”', 'Усе з «Перевезення»', 'Everything in “Transport”'),
      l('Упакуем всё в белые коробки MELBUS', 'Spakujemy wszystko w białe kartony MELBUS', 'Запакуємо все в білі коробки MELBUS', 'We pack everything into white MELBUS boxes'),
      l('Разберём и соберём мебель', 'Rozkręcimy i skręcimy meble', 'Розберемо й зберемо меблі', 'We take the furniture apart and reassemble it'),
      l('Наклейки комнат: коробки сразу едут на свои места', 'Naklejki pokoi: kartony od razu trafiają na swoje miejsca', 'Наклейки кімнат: коробки одразу їдуть на свої місця', 'Room labels: every box goes straight to its room'),
      l('«Коробка первой ночи» — её открываем первой', '„Karton pierwszej nocy” — otwieramy go pierwszy', '«Коробка першої ночі» — відкриваємо її першою', 'A “first-night box”, opened first'),
    ],
  },
];

/** примеры «что везём» = заготовки формы (PRESETS в move.ts) */
export const SIZES = [
  { preset: 'studio', label: l('Студия', 'Kawalerka', 'Студія', 'Studio'), status: l('Студия · до 30 м²', 'Kawalerka · do 30 m²', 'Студія · до 30 м²', 'Studio · up to 30 m²') },
  { preset: 'two', label: l('2 комнаты', '2 pokoje', '2 кімнати', '2 rooms'), status: l('2 комнаты · 40–55 м²', '2 pokoje · 40–55 m²', '2 кімнати · 40–55 м²', '2 rooms · 40–55 m²') },
  { preset: 'three', label: l('3 комнаты', '3 pokoje', '3 кімнати', '3 rooms'), status: l('3 комнаты · 60–80 м²', '3 pokoje · 60–80 m²', '3 кімнати · 60–80 м²', '3 rooms · 60–80 m²') },
  { preset: 'house', label: l('Дом', 'Dom', 'Будинок', 'House'), status: l('Дом · до 150 м²', 'Dom · do 150 m²', 'Будинок · до 150 м²', 'House · up to 150 m²') },
];

/**
 * ЦЕНА ПРИМЕРА [размер][пакет 2–3] (zł brutto) — той же формулой, что в форме:
 * [0] «Перевозка», [1] «Перевозка» + разборка и сборка всей мебели, [2] «Под ключ».
 */
export const GRID: number[][] = SIZES.map((s) => [presetTotal(s.preset, 2), presetTotal(s.preset, 2, { asmAll: true }), presetTotal(s.preset, 3)]);
export { HOURLY, HOURLY2 };

/** ссылка на форму с тем же примером, что и цифра на сайте: ?size= (номер в SIZES) &lvl= (1–3) */
export const formQuery = (size: number, lvl: number) => `?size=${size}&lvl=${lvl}`;

/** формат сумм: «1 690» на ru/pl/uk, «1,690» на en (польский Intl сам не ставит пробел в 4-значных) */
export const moneyLocale = (lang: string) => (lang === 'pl' ? 'ru' : lang || 'ru');
export const money = (n: number, lang: string) => new Intl.NumberFormat(moneyLocale(lang)).format(n);

/** табло на главной: «от …» = «Перевозка» для каждого примера */
export const boardOptions = SIZES.map((s, i) => ({ label: s.label, status: s.status, value: GRID[i][0], size: i }));

/** задаток (zadatek): закрепляет дату; доля от суммы, но не меньше минимума */
export const DEPOSIT = { pct: 0.2, min: 200 };
/** сколько дней действует оферта */
export const OFFER_DAYS = 14;
