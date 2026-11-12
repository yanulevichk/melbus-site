/**
 * ДЕМО-ЦИФРЫ для табло цены. Ставки MELBUS ещё НЕ утверждены (ждут анализа конкурентов).
 * Когда цены утвердят — заменить значения здесь и убрать DEMO. Подписи — сразу на 4 языках.
 */
import type { L } from '../i18n/text';

export const DEMO = true;
export const boardOptions: { label: L; value: number; status: L }[] = [
  { value: 1190, label: { ru: 'Студия', pl: 'Kawalerka', uk: 'Студія', en: 'Studio' }, status: { ru: 'Студия · до 30 м²', pl: 'Kawalerka · do 30 m²', uk: 'Студія · до 30 м²', en: 'Studio · up to 30 m²' } },
  { value: 1890, label: { ru: '2 комнаты', pl: '2 pokoje', uk: '2 кімнати', en: '2 rooms' }, status: { ru: '2 комнаты · 40–55 м²', pl: '2 pokoje · 40–55 m²', uk: '2 кімнати · 40–55 м²', en: '2 rooms · 40–55 m²' } },
  { value: 2690, label: { ru: '3 комнаты', pl: '3 pokoje', uk: '3 кімнати', en: '3 rooms' }, status: { ru: '3 комнаты · 60–80 м²', pl: '3 pokoje · 60–80 m²', uk: '3 кімнати · 60–80 м²', en: '3 rooms · 60–80 m²' } },
  { value: 4290, label: { ru: 'Дом', pl: 'Dom', uk: 'Будинок', en: 'House' }, status: { ru: 'Дом · до 150 м²', pl: 'Dom · do 150 m²', uk: 'Будинок · до 150 м²', en: 'House · up to 150 m²' } },
  { value: 3490, label: { ru: 'Офис', pl: 'Biuro', uk: 'Офіс', en: 'Office' }, status: { ru: 'Офис · 10–15 мест', pl: 'Biuro · 10–15 stanowisk', uk: 'Офіс · 10–15 місць', en: 'Office · 10–15 desks' } },
];

/**
 * ДЕМО-ФОРМУЛА калькулятора (/kalkulator/). Все суммы brutto, НЕ утверждены.
 * Итог = база (boardOptions) + расстояние×k + этажи без лифта×k + упаковка (% от базы) + доп. услуги×k,
 * где k — «размер» переезда (sizeK, по порядку boardOptions). Округление до 10 zł.
 * quote — номер варианта в форме заявки (src/content/quote.ts), чтобы перенести выбор в заявку.
 */
export const calcDemo = {
  sizeK: [0.6, 1, 1.4, 2, 1.6],
  sizeQuote: [0, 1, 2, 4, 5],
  distance: [
    { add: 0, label: { ru: 'По Варшаве', pl: 'W Warszawie', uk: 'Варшавою', en: 'Within Warsaw' } as L },
    { add: 290, label: { ru: 'До 50 км', pl: 'Do 50 km', uk: 'До 50 км', en: 'Up to 50 km' } as L },
    { add: 690, label: { ru: 'До 150 км', pl: 'Do 150 km', uk: 'До 150 км', en: 'Up to 150 km' } as L },
    { add: 1490, label: { ru: 'По Польше', pl: 'Po Polsce', uk: 'Польщею', en: 'Across Poland' } as L },
  ],
  floorNoLift: 70, // за каждый этаж без лифта, на каждом адресе
  packing: [
    { pct: 0, quote: -1, label: { ru: 'Пакуем сами', pl: 'Pakujemy sami', uk: 'Пакуємо самі', en: 'We pack ourselves' } as L },
    { pct: 0.12, quote: 1, label: { ru: 'Только хрупкое', pl: 'Tylko delikatne', uk: 'Лише крихке', en: 'Fragile items only' } as L },
    { pct: 0.3, quote: 0, label: { ru: 'Всё под ключ', pl: 'Wszystko pod klucz', uk: 'Усе під ключ', en: 'Everything' } as L },
  ],
  extras: [
    { add: 190, quote: 2, label: { ru: 'Белые коробки заранее', pl: 'Białe kartony wcześniej', uk: 'Білі коробки заздалегідь', en: 'White boxes in advance' } as L },
    { add: 290, quote: 3, label: { ru: 'Разборка и сборка мебели', pl: 'Demontaż i montaż mebli', uk: 'Розбирання та збирання меблів', en: 'Furniture disassembly and assembly' } as L },
    { add: 350, quote: 4, label: { ru: 'Вывоз старой мебели', pl: 'Wywóz starych mebli', uk: 'Вивезення старих меблів', en: 'Old furniture removal' } as L },
    { add: 390, quote: 5, label: { ru: 'Уборка после переезда', pl: 'Sprzątanie po przeprowadzce', uk: 'Прибирання після переїзду', en: 'Cleaning after the move' } as L },
    { add: 250, quote: 6, label: { ru: 'Распаковка и расстановка', pl: 'Rozpakowanie i ustawienie', uk: 'Розпакування та розстановка', en: 'Unpacking and arranging' } as L },
  ],
};
