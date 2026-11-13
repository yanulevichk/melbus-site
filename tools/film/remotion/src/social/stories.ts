/**
 * СТОРИС НА МЕСЯЦ «ДНЕВНИК ЗАПУСКА MELBUS» (16.11 – 13.12.2026) — единый источник, каждая фраза сразу на 4 языках.
 * Меняем фразу — меняем её на всех языках (тип L требует все 4, иначе сборка не пройдёт).
 *
 * Почему «дневник»: заказов и отзывов ещё нет, выдумывать нельзя. Зато можно честно показывать, как мы строим сервис:
 * бренд, коробки, цену, фильм, сайт. Это и есть сторителлинг: каждый день — следующая страница.
 *
 * 4 главы: 1) знакомство, 2) цена без часов, 3) детали, которые видно, 4) как мы сняли фильм + запись на переезд.
 * 2–3 сторис в день: 09:00 — история дня, 13:00 — вовлечение (опрос/викторина/вопрос), 19:00 — призыв (не каждый день).
 *
 * Картинки: готовые материалы (фильм, ролики, скриншоты сайта, кадры 3D-черновика); слоты для фото команды (real)
 * и картинок ChatGPT (gpt) — если файл положить в marketing/stories/2026-11/{real,gpt}/<id>.jpg, сторис пересоберётся с ним.
 * Цены берутся из формулы сайта (src/data/pricing.ts) — поменяли цену на сайте, пересобрали сторис.
 */
import type {L, Lang} from './texts';
import {GRID, PACKAGES} from '../../../../../src/data/pricing';
import {noHours} from '../../../../../src/content/prices';

const l = (ru: string, pl: string, uk: string, en: string): L => ({ru, pl, uk, en});
const same = (s: string): L => ({ru: s, pl: s, uk: s, en: s});
const zl = (n: number, lang: Lang) => `${new Intl.NumberFormat(lang === 'en' ? 'en' : 'ru').format(n)} zł`;
const money = (n: number): L => ({ru: zl(n, 'ru'), pl: zl(n, 'pl'), uk: zl(n, 'uk'), en: zl(n, 'en')});

export const START = '2026-11-16'; // понедельник, день 1
export const DAY_WORD = l('День', 'Dzień', 'День', 'Day');

export const RUBRICS = {
  diary: l('Дневник запуска', 'Dziennik startu', 'Щоденник запуску', 'Launch diary'),
  how: l('Как это работает', 'Jak to działa', 'Як це працює', 'How it works'),
  tip: l('Совет', 'Porada', 'Порада', 'Tip'),
  myth: l('Миф или правда', 'Mit czy prawda', 'Міф чи правда', 'Myth or fact'),
  bts: l('За кадром', 'Za kulisami', 'За кадром', 'Behind the scenes'),
  num: l('Цифра', 'Liczba', 'Цифра', 'The number'),
  ask: l('Ваш голос', 'Twój głos', 'Ваш голос', 'Your say'),
  sun: l('Воскресенье', 'Niedziela', 'Неділя', 'Sunday'),
  melbus: same('MELBUS'),
};
export type Rubric = keyof typeof RUBRICS;

/** Актуальное (обложки — Highlights v2, названия ≤ 15 знаков) */
export const HL = {
  price: l('Цена', 'Cena', 'Ціна', 'Price'),
  how: l('Как работаем', 'Jak działamy', 'Як працюємо', 'How it works'),
  packages: l('Пакеты', 'Pakiety', 'Пакети', 'Packages'),
  boxes: l('Коробки', 'Kartony', 'Коробки', 'Boxes'),
  care: l('Аккуратность', 'Staranność', 'Акуратність', 'Care'),
  vans: l('Бусы', 'Busy', 'Буси', 'Vans'),
  areas: l('Районы', 'Dzielnice', 'Райони', 'Areas'),
  diary: l('Дневник', 'Dziennik', 'Щоденник', 'Diary'),
  faq: l('Вопросы', 'Pytania', 'Питання', 'FAQ'),
};
export type Hl = keyof typeof HL;

export type Sticker =
  | {t: 'poll'; opts: L[]}
  | {t: 'quiz'; opts: L[]; ok: number}
  | {t: 'question'; q: L}
  | {t: 'slider'; q: L; emoji: string}
  | {t: 'link'; to: 'calc' | 'quote' | 'price' | 'home' | 'areas'; label: L};

export type Kind = 'text' | 'photo' | 'number' | 'list' | 'compare' | 'shot' | 'pair' | 'logo' | 'video';

export type Story = {
  id: string; day: number; slot: 1 | 2 | 3; rubric: Rubric; kind: Kind;
  title: L; body?: L; items?: L[]; big?: L;
  img?: string;            // stories/<файл> — общая картинка
  shot?: string;           // скриншот сайта на языке сторис: stories/shots/<shot>-<lang>.jpg
  pair?: [string, string]; // две картинки: «черновик» и «готово»
  video?: string;          // stories/<файл>.mp4
  ai?: boolean;            // пометка «Визуализация»
  real?: string;           // что снять команде (по-русски); фото → marketing/stories/2026-11/real/<id>.jpg
  gpt?: string;            // id подсказки ChatGPT; картинка → marketing/stories/2026-11/gpt/<id>.jpg
  sticker?: Sticker;
  hl?: Hl;
  after?: 'prices' | 'site'; // публиковать после утверждения цен / запуска сайта
  note?: string;           // заметка команде (по-русски)
};

export const PAIR_LABELS: [L, L] = [l('3D-черновик', 'Szkic 3D', '3D-чернетка', '3D draft'), l('Готовый кадр', 'Gotowy kadr', 'Готовий кадр', 'Final frame')];
const YES_NO: L[] = [l('Да', 'Tak', 'Так', 'Yes'), l('Нет', 'Nie', 'Ні', 'No')];
const FACT_MYTH: L[] = [l('Правда', 'Prawda', 'Правда', 'Fact'), l('Миф', 'Mit', 'Міф', 'Myth')];
const LINK = {
  calc: l('Калькулятор', 'Kalkulator', 'Калькулятор', 'Calculator'),
  quote: l('Заявка', 'Wycena', 'Заявка', 'Get a quote'),
  price: l('Цены', 'Cennik', 'Ціни', 'Prices'),
  home: l('Сайт', 'Strona', 'Сайт', 'Website'),
};
const g = GRID[1]; // 2 комнаты: [Перевозка, Стандарт, Под ключ]

export const STORIES: Story[] = [
  // ───────── НЕДЕЛЯ 1 · ЗНАКОМСТВО ─────────
  {id: 'D01-1', day: 1, slot: 1, rubric: 'diary', kind: 'photo', img: 'stories/film-van.jpg', ai: true, hl: 'diary',
    real: 'Фото: ряд ваших бусов на базе утром (без номеров и лиц). Если есть — заменит визуализацию.',
    title: l('5 лет мы возим чужие посылки', 'Od 5 lat wozimy cudze paczki', '5 років ми возимо чужі посилки', 'For 5 years we’ve delivered other people’s parcels'),
    body: l('Около 30 000 доставок в месяц и 20 своих бусов. Теперь мы перевозим целые дома.', 'Około 30 000 dostaw miesięcznie i 20 własnych busów. Teraz przewozimy całe domy.', 'Близько 30 000 доставок на місяць і 20 власних бусів. Тепер ми перевозимо цілі домівки.', 'Around 30,000 deliveries a month and 20 vans of our own. Now we move entire homes.')},
  {id: 'D01-2', day: 1, slot: 2, rubric: 'ask', kind: 'text',
    title: l('Что пугает в переезде больше всего?', 'Co najbardziej przeraża w przeprowadzce?', 'Що найбільше лякає в переїзді?', 'What scares you most about moving?'),
    sticker: {t: 'poll', opts: [l('Упаковка', 'Pakowanie', 'Пакування', 'Packing'), l('Доплаты в конце', 'Dopłaty na koniec', 'Доплати наприкінці', 'Extra fees at the end'), l('Разбитые вещи', 'Stłuczone rzeczy', 'Розбиті речі', 'Broken things'), l('Всё сразу', 'Wszystko naraz', 'Усе одразу', 'All of it')]}},
  {id: 'D01-3', day: 1, slot: 3, rubric: 'melbus', kind: 'photo', img: 'stories/film-aerial.jpg', ai: true, hl: 'diary',
    title: l('Мы запускаем переезды под ключ', 'Startujemy z przeprowadzkami pod klucz', 'Ми запускаємо переїзди під ключ', 'We’re launching full-service moves'),
    body: l('Цена по видео — окончательная. Каждый день в сторис — как мы готовимся.', 'Cena z wideo — ostateczna. Codziennie w relacjach pokazujemy, jak się przygotowujemy.', 'Ціна за відео — остаточна. Щодня в сторіс — як ми готуємося.', 'One final price from a video. Every day in stories: how we’re getting ready.')},

  {id: 'D02-1', day: 2, slot: 1, rubric: 'diary', kind: 'text', hl: 'diary',
    title: l('Почему именно переезды?', 'Dlaczego przeprowadzki?', 'Чому саме переїзди?', 'Why moving?'),
    body: l('Мы видели, как это бывает: «доплата за этаж», оплата за часы, вещи в мусорных пакетах. Мы решили сделать иначе.', 'Widzieliśmy, jak to wygląda: „dopłata za piętro”, płatność za godziny, rzeczy w workach na śmieci. Postanowiliśmy zrobić to inaczej.', 'Ми бачили, як це буває: «доплата за поверх», оплата за години, речі в сміттєвих пакетах. Ми вирішили зробити інакше.', 'We’ve seen how it goes: a “floor surcharge”, hourly billing, belongings in bin bags. We decided to do it differently.')},
  {id: 'D02-2', day: 2, slot: 2, rubric: 'myth', kind: 'text',
    title: l('Переезд всегда выходит дороже, чем обещали?', 'Przeprowadzka zawsze kosztuje więcej, niż obiecano?', 'Переїзд завжди виходить дорожчим, ніж обіцяли?', 'Does a move always cost more than promised?'),
    body: l('Ответ — завтра: как работает цена по видео.', 'Odpowiedź jutro: jak działa cena z wideo.', 'Відповідь — завтра: як працює ціна за відео.', 'Answer tomorrow: how a price from a video works.'),
    sticker: {t: 'quiz', opts: FACT_MYTH, ok: 1}},

  {id: 'D03-1', day: 3, slot: 1, rubric: 'how', kind: 'video', video: 'stories/phone.mp4', ai: true, hl: 'how',
    title: l('Шаг 1. Видео квартиры', 'Krok 1. Wideo mieszkania', 'Крок 1. Відео квартири', 'Step 1. A video of your home'),
    body: l('Две-три минуты на телефон, комната за комнатой. Цена — окончательная.', 'Dwie, trzy minuty telefonem, pokój po pokoju. Cena — ostateczna.', 'Дві-три хвилини на телефон, кімната за кімнатою. Ціна — остаточна.', 'Two or three minutes on your phone, room by room. The price is final.')},
  {id: 'D03-2', day: 3, slot: 2, rubric: 'tip', kind: 'list', hl: 'how',
    title: l('Как снять квартиру для оценки', 'Jak nagrać mieszkanie do wyceny', 'Як зняти квартиру для оцінки', 'How to film your home for a quote'),
    items: [
      l('30–60 секунд на комнату', '30–60 sekund na pokój', '30–60 секунд на кімнату', '30–60 seconds per room'),
      l('Откройте шкафы и антресоли', 'Otwórz szafy i antresole', 'Відкрийте шафи й антресолі', 'Open wardrobes and top cupboards'),
      l('Балкон, кладовка, подвал', 'Balkon, komórka, piwnica', 'Балкон, комора, підвал', 'Balcony, storage room, cellar'),
      l('Лестница и парковка у подъезда', 'Klatka schodowa i parking przy wejściu', 'Сходи й паркування біля під’їзду', 'Stairs and parking by the entrance'),
    ]},
  {id: 'D03-3', day: 3, slot: 3, rubric: 'ask', kind: 'text', hl: 'faq',
    title: l('Что вы хотите знать о переезде?', 'Co chcesz wiedzieć o przeprowadzce?', 'Що ви хочете знати про переїзд?', 'What do you want to know about moving?'),
    sticker: {t: 'question', q: l('Спросите нас', 'Zapytaj nas', 'Запитайте нас', 'Ask us')},
    note: 'Собирайте вопросы весь месяц — ответы в субботу 12.12 (D27). Только настоящие вопросы.'},

  {id: 'D04-1', day: 4, slot: 1, rubric: 'bts', kind: 'logo', hl: 'diary',
    title: l('Наш знак — две коробки', 'Nasz znak to dwa kartony', 'Наш знак — дві коробки', 'Our mark: two boxes'),
    body: l('Сцеплены вместе — как мы и ваш дом. Бирюза — это наш скотч.', 'Połączone ze sobą — jak my i Twój dom. Turkus to nasza taśma.', 'Зчеплені разом — як ми й ваш дім. Бірюза — це наш скотч.', 'Locked together, like us and your home. The turquoise is our tape.')},
  {id: 'D04-2', day: 4, slot: 2, rubric: 'ask', kind: 'text',
    title: l('Белые или коричневые коробки?', 'Białe czy brązowe kartony?', 'Білі чи коричневі коробки?', 'White or brown boxes?'),
    body: l('Мы свой выбор сделали — почему, расскажем в субботу.', 'My już wybraliśmy — dlaczego, powiemy w sobotę.', 'Ми свій вибір зробили — чому, розповімо в суботу.', 'We’ve made our choice — we’ll tell you why on Saturday.'),
    sticker: {t: 'poll', opts: [l('Белые', 'Białe', 'Білі', 'White'), l('Коричневые', 'Brązowe', 'Коричневі', 'Brown')]}},

  {id: 'D05-1', day: 5, slot: 1, rubric: 'num', kind: 'number', hl: 'diary',
    big: l('≈30 000', '≈30 000', '≈30 000', '≈30,000'),
    title: l('доставок в месяц', 'dostaw miesięcznie', 'доставок на місяць', 'deliveries a month'),
    body: l('Приезжать вовремя для нас — рабочая привычка, а не обещание.', 'Punktualność to dla nas codzienny nawyk, a nie obietnica.', 'Приїжджати вчасно для нас — робоча звичка, а не обіцянка.', 'Arriving on time is a work habit for us, not a promise.')},
  {id: 'D05-2', day: 5, slot: 2, rubric: 'ask', kind: 'text', real: 'Можно фоном: фото ваших бусов (без номеров).',
    title: l('Сколько бусов в нашем парке?', 'Ile busów jest w naszej flocie?', 'Скільки бусів у нашому парку?', 'How many vans are in our fleet?'),
    sticker: {t: 'quiz', opts: [same('5'), same('≈20'), same('50')], ok: 1}},
  {id: 'D05-3', day: 5, slot: 3, rubric: 'melbus', kind: 'shot', shot: 'calc-board', hl: 'price', after: 'site',
    title: l('Посчитайте свой переезд', 'Policz swoją przeprowadzkę', 'Порахуйте свій переїзд', 'Price your move'),
    body: l('Калькулятор на сайте: 30 секунд, без регистрации.', 'Kalkulator na stronie: 30 sekund, bez rejestracji.', 'Калькулятор на сайті: 30 секунд, без реєстрації.', 'The calculator on our site: 30 seconds, no sign-up.'),
    sticker: {t: 'link', to: 'calc', label: LINK.calc}},

  {id: 'D06-1', day: 6, slot: 1, rubric: 'bts', kind: 'photo', img: 'stories/film-load.jpg', ai: true, hl: 'boxes', gpt: 'boxes',
    title: l('Почему коробки белые', 'Dlaczego kartony są białe', 'Чому коробки білі', 'Why our boxes are white'),
    body: l('На белом видно наклейку комнаты и номер. Чисто — и сразу ясно, что это MELBUS.', 'Na bieli widać naklejkę pokoju i numer. Czysto — i od razu widać, że to MELBUS.', 'На білому видно наліпку кімнати й номер. Чисто — і одразу зрозуміло, що це MELBUS.', 'White shows the room label and number. Clean — and clearly MELBUS.')},
  {id: 'D06-2', day: 6, slot: 2, rubric: 'ask', kind: 'text',
    title: l('Насколько вы любите упаковывать вещи?', 'Jak bardzo lubisz pakowanie?', 'Наскільки ви любите пакувати речі?', 'How much do you enjoy packing?'),
    sticker: {t: 'slider', q: l('Честно', 'Szczerze', 'Чесно', 'Honestly'), emoji: '😩'}},

  {id: 'D07-1', day: 7, slot: 1, rubric: 'sun', kind: 'video', video: 'stories/film-m.mp4', ai: true,
    title: l('Вся квартира — в одну коробку', 'Całe mieszkanie — w jednym kartonie', 'Уся квартира — в одну коробку', 'Your whole home — in one box'),
    body: l('Наш фильм о переезде.', 'Nasz film o przeprowadzce.', 'Наш фільм про переїзд.', 'Our film about moving.')},
  {id: 'D07-2', day: 7, slot: 2, rubric: 'diary', kind: 'text', hl: 'diary',
    title: l('Неделя 1: знакомство', 'Tydzień 1: poznajmy się', 'Тиждень 1: знайомство', 'Week 1: meet us'),
    body: l('Кто мы, почему переезды и почему белые коробки. Дальше — цена, которая не меняется.', 'Kim jesteśmy, dlaczego przeprowadzki i czemu białe kartony. Dalej — cena, która się nie zmienia.', 'Хто ми, чому переїзди й чому білі коробки. Далі — ціна, яка не змінюється.', 'Who we are, why moving, and why white boxes. Next: a price that doesn’t change.')},

  // ───────── НЕДЕЛЯ 2 · ЦЕНА БЕЗ ЧАСОВ ─────────
  {id: 'D08-1', day: 8, slot: 1, rubric: 'how', kind: 'photo', img: 'stories/step-2-price.webp', ai: true, hl: 'how',
    title: l('Шаг 2. Цена за 2 часа', 'Krok 2. Cena w 2 godziny', 'Крок 2. Ціна за 2 години', 'Step 2. A price within 2 hours'),
    body: l('Днём в течение двух часов — окончательная цена и список вещей.', 'W dzień, w ciągu dwóch godzin — ostateczna cena i lista rzeczy.', 'Удень протягом двох годин — остаточна ціна й список речей.', 'Within two hours (daytime): the final price and a list of items.')},
  {id: 'D08-2', day: 8, slot: 2, rubric: 'ask', kind: 'text',
    title: l('Вам называли одну цену, а в конце просили больше?', 'Podano Ci jedną cenę, a na koniec chciano więcej?', 'Вам називали одну ціну, а наприкінці просили більше?', 'Were you quoted one price and asked for more at the end?'),
    sticker: {t: 'poll', opts: [l('Да, было', 'Tak, było', 'Так, було', 'Yes, it happened'), l('Нет, везло', 'Nie, udało się', 'Ні, щастило', 'No, I was lucky')]}},

  {id: 'D09-1', day: 9, slot: 1, rubric: 'diary', kind: 'compare', hl: 'price',
    title: noHours.h2 as L},
  {id: 'D09-2', day: 9, slot: 2, rubric: 'myth', kind: 'text',
    title: l('Почасовая оплата — это дешевле?', 'Płatność za godzinę jest tańsza?', 'Погодинна оплата — дешевше?', 'Is hourly billing cheaper?'),
    body: l('Минимум 2–3 часа, пробки и перекуры — за ваш счёт.', 'Minimum 2–3 godziny, korki i przerwy — na Twój koszt.', 'Мінімум 2–3 години, затори й перекури — за ваш рахунок.', 'A 2–3 hour minimum, plus traffic and breaks on your bill.'),
    sticker: {t: 'quiz', opts: [l('Да', 'Tak', 'Так', 'Yes'), l('Не всегда', 'Nie zawsze', 'Не завжди', 'Not always')], ok: 1}},
  {id: 'D09-3', day: 9, slot: 3, rubric: 'melbus', kind: 'shot', shot: 'calc-pkg', hl: 'price', after: 'site',
    title: l('Сравните сами', 'Sprawdź i porównaj', 'Порівняйте самі', 'See for yourself'),
    body: l('Наша цена — за весь переезд. Посчитайте за 30 секунд.', 'Nasza cena jest za całą przeprowadzkę. Policz w 30 sekund.', 'Наша ціна — за весь переїзд. Порахуйте за 30 секунд.', 'Our price covers the whole move. Work it out in 30 seconds.'),
    sticker: {t: 'link', to: 'calc', label: LINK.calc}},

  {id: 'D10-1', day: 10, slot: 1, rubric: 'tip', kind: 'text', hl: 'price',
    title: l('Этажи без лифта — сразу в цене', 'Piętra bez windy — od razu w cenie', 'Поверхи без ліфта — одразу в ціні', 'Floors without a lift — priced in up front'),
    body: l('Покажите лестницу на видео — доплаты на месте не будет.', 'Pokaż schody na wideo — na miejscu nie będzie dopłat.', 'Покажіть сходи на відео — доплати на місці не буде.', 'Show the stairs on video — no extra charge on the day.')},
  {id: 'D10-2', day: 10, slot: 2, rubric: 'ask', kind: 'text',
    title: l('Ваш этаж?', 'Twoje piętro?', 'Ваш поверх?', 'Which floor are you on?'),
    sticker: {t: 'poll', opts: [l('Партер–2', 'Parter–2', 'Партер–2', 'Ground–2'), same('3–5'), same('6+'), l('Есть лифт', 'Mam windę', 'Є ліфт', 'There’s a lift')]}},

  {id: 'D11-1', day: 11, slot: 1, rubric: 'bts', kind: 'shot', shot: 'price-table', hl: 'price', after: 'prices',
    title: l('Как мы считаем цену', 'Jak liczymy cenę', 'Як ми рахуємо ціну', 'How we work out the price'),
    body: l('Объём вещей с видео × пакет, плюс этажи и дорога. Одна формула — на сайте и у менеджера.', 'Objętość rzeczy z wideo × pakiet, plus piętra i dojazd. Jeden wzór — na stronie i u menedżera.', 'Обсяг речей з відео × пакет, плюс поверхи й дорога. Одна формула — на сайті й у менеджера.', 'Volume from the video × package, plus floors and travel. One formula — on the site and for our team.')},
  {id: 'D11-2', day: 11, slot: 2, rubric: 'myth', kind: 'text', after: 'prices',
    title: l('Сколько стоит переезд 2 комнат «Под ключ»?', 'Ile kosztuje przeprowadzka 2 pokoi „Pod klucz”?', 'Скільки коштує переїзд 2 кімнат «Під ключ»?', 'What does a full-service 2-room move cost?'),
    body: l('Упакуем, перевезём, распакуем. По Варшаве, с лифтом.', 'Spakujemy, przewieziemy, rozpakujemy. W Warszawie, z windą.', 'Запакуємо, перевеземо, розпакуємо. Варшавою, з ліфтом.', 'We pack, move and unpack. Within Warsaw, with a lift.'),
    sticker: {t: 'quiz', opts: [money(g[0]), money(g[2]), money(4000)], ok: 1}},

  {id: 'D12-1', day: 12, slot: 1, rubric: 'diary', kind: 'text', hl: 'price',
    title: l('Чёрная пятница? У нас честная цена каждый день', 'Black Friday? U nas uczciwa cena każdego dnia', 'Чорна п’ятниця? У нас чесна ціна щодня', 'Black Friday? Our price is honest every day'),
    body: l('Без «скидок» с завышенной цены. Одна цена за весь переезд — до начала работ.', 'Bez „promocji” od zawyżonej ceny. Jedna cena za całą przeprowadzkę — przed startem.', 'Без «знижок» із завищеної ціни. Одна ціна за весь переїзд — до початку робіт.', 'No “discounts” off an inflated price. One price for the whole move, before we start.')},
  {id: 'D12-2', day: 12, slot: 2, rubric: 'melbus', kind: 'number', after: 'prices', hl: 'price',
    big: same('−5 %'),
    title: l('за раннюю бронь', 'za wczesną rezerwację', 'за раннє бронювання', 'for early booking'),
    body: l('Бронируйте за 14+ дней. Зимой больше «зелёных» дат — ещё −10 %.', 'Zarezerwuj 14+ dni wcześniej. Zimą więcej „zielonych” terminów — kolejne −10%.', 'Бронюйте за 14+ днів. Взимку більше «зелених» дат — ще −10 %.', 'Book 14+ days ahead. Winter has more “green” dates — another −10%.'),
    note: 'Скидки — из предложения цен (DATE_ADJ). Публиковать только если утвердите. Совмещать ли скидки — решите вы.'},
  {id: 'D12-3', day: 12, slot: 3, rubric: 'melbus', kind: 'photo', img: 'stories/phone.webp', ai: true, after: 'site',
    title: l('Пришлите видео — получите цену', 'Wyślij wideo — otrzymasz cenę', 'Надішліть відео — отримайте ціну', 'Send a video, get a price'),
    body: l('Ответим в течение 2 часов днём.', 'Odpowiemy w ciągu 2 godzin (w dzień).', 'Відповімо протягом 2 годин удень.', 'We reply within 2 hours (daytime).'),
    sticker: {t: 'link', to: 'quote', label: LINK.quote}},

  {id: 'D13-1', day: 13, slot: 1, rubric: 'how', kind: 'shot', shot: 'offer', hl: 'how', after: 'prices',
    title: l('Шаг 3. Оферта и бронь', 'Krok 3. Oferta i rezerwacja', 'Крок 3. Оферта й бронювання', 'Step 3. Offer and booking'),
    body: l('Цена, дата и что входит — в оферте по ссылке. Принимаете — дата за вами.', 'Cena, termin i zakres — w ofercie pod linkiem. Akceptujesz — termin jest Twój.', 'Ціна, дата й що входить — в оферті за посиланням. Приймаєте — дата за вами.', 'Price, date and what’s included — in an offer by link. Accept it, and the date is yours.'),
    note: 'На скриншоте — пример оферты.'},
  {id: 'D13-2', day: 13, slot: 2, rubric: 'ask', kind: 'text',
    title: l('Когда планируете переезд?', 'Kiedy planujesz przeprowadzkę?', 'Коли плануєте переїзд?', 'When are you planning to move?'),
    sticker: {t: 'poll', opts: [l('Декабрь', 'Grudzień', 'Грудень', 'December'), l('Январь–февраль', 'Styczeń–luty', 'Січень–лютий', 'Jan–Feb'), l('Весна', 'Wiosna', 'Весна', 'Spring'), l('Пока думаю', 'Jeszcze myślę', 'Поки думаю', 'Still thinking')]},
    note: 'Результаты опроса = план загрузки бригад. Запишите их.'},

  {id: 'D14-1', day: 14, slot: 1, rubric: 'sun', kind: 'video', video: 'stories/van.mp4', ai: true, hl: 'vans',
    title: l('Только ваши вещи', 'Tylko Twoje rzeczy', 'Лише ваші речі', 'Only your things'),
    body: l('Бус едет без перегрузок и попутных грузов.', 'Bez przeładunków i cudzych ładunków po drodze.', 'Бус їде без перевантажень і попутних вантажів.', 'No reloading and no other cargo on the way.')},
  {id: 'D14-2', day: 14, slot: 2, rubric: 'diary', kind: 'text', hl: 'diary',
    title: l('Неделя 2: цена', 'Tydzień 2: cena', 'Тиждень 2: ціна', 'Week 2: the price'),
    body: l('Цена по видео, без часов и доплат. Дальше — детали, которые видно.', 'Cena z wideo, bez godzin i dopłat. Dalej — szczegóły, które widać.', 'Ціна за відео, без годин і доплат. Далі — деталі, які видно.', 'A price from a video, no hours, no extra fees. Next: details you can see.')},

  // ───────── НЕДЕЛЯ 3 · ДЕТАЛИ, КОТОРЫЕ ВИДНО ─────────
  {id: 'D15-1', day: 15, slot: 1, rubric: 'how', kind: 'photo', img: 'stories/step-4-pack.webp', ai: true, hl: 'care',
    title: l('Шаг 4. Упаковка', 'Krok 4. Pakowanie', 'Крок 4. Пакування', 'Step 4. Packing'),
    body: l('По комнатам: посуда — в бумагу, бокалы — в пузырчатую плёнку.', 'Pokój po pokoju: naczynia w papier, kieliszki w folię bąbelkową.', 'По кімнатах: посуд — у папір, келихи — у бульбашкову плівку.', 'Room by room: dishes in paper, glasses in bubble wrap.')},
  {id: 'D15-2', day: 15, slot: 2, rubric: 'tip', kind: 'text', hl: 'care',
    title: l('Как класть тарелки в коробку?', 'Jak układać talerze w kartonie?', 'Як класти тарілки в коробку?', 'How should plates go into a box?'),
    sticker: {t: 'quiz', opts: [l('Стопкой плашмя', 'Płasko w stos', 'Стосом плазом', 'Flat in a stack'), l('Ребром, как пластинки', 'Na sztorc, jak płyty', 'Ребром, як платівки', 'On edge, like records')], ok: 1},
    note: 'Правильный ответ — ребром: так тарелки лучше выдерживают удар. Можно ответить в следующей сторис текстом.'},

  {id: 'D16-1', day: 16, slot: 1, rubric: 'bts', kind: 'shot', shot: 'stickers', hl: 'boxes',
    title: l('Наклейка комнаты: цвет, номер, QR', 'Naklejka pokoju: kolor, numer, QR', 'Наліпка кімнати: колір, номер, QR', 'Room label: colour, number, QR'),
    body: l('Цвет — комната, номер — коробка, QR — список вещей внутри.', 'Kolor to pokój, numer to karton, QR to lista rzeczy w środku.', 'Колір — кімната, номер — коробка, QR — список речей усередині.', 'Colour is the room, number is the box, QR lists what’s inside.')},
  {id: 'D16-2', day: 16, slot: 2, rubric: 'ask', kind: 'text',
    title: l('Сколько коробок не разобрано после прошлого переезда?', 'Ile kartonów czeka nierozpakowanych od ostatniej przeprowadzki?', 'Скільки коробок не розібрано після минулого переїзду?', 'How many boxes are still unpacked from your last move?'),
    sticker: {t: 'slider', q: l('Признавайтесь', 'Przyznaj się', 'Зізнавайтеся', 'Be honest'), emoji: '📦'}},
  {id: 'D16-3', day: 16, slot: 3, rubric: 'melbus', kind: 'photo', img: 'stories/film-box.jpg', ai: true, after: 'site',
    title: l('Посмотрите, как это работает', 'Zobacz, jak to działa', 'Подивіться, як це працює', 'See how it works'),
    body: l('Фильм, цены и калькулятор — на сайте.', 'Film, ceny i kalkulator — na stronie.', 'Фільм, ціни й калькулятор — на сайті.', 'The film, prices and calculator — on our site.'),
    sticker: {t: 'link', to: 'home', label: LINK.home}},

  {id: 'D17-1', day: 17, slot: 1, rubric: 'tip', kind: 'list', gpt: 'first-night', hl: 'boxes',
    title: l('Коробка первой ночи', 'Karton pierwszej nocy', 'Коробка першої ночі', 'The first-night box'),
    body: l('Едет последней — открывается первой.', 'Jedzie ostatni — otwierasz go pierwszy.', 'Їде останньою — відкривається першою.', 'Goes on last, comes off first.'),
    items: [
      l('Чайник, кружки, чай и кофе', 'Czajnik, kubki, herbata i kawa', 'Чайник, кружки, чай і кава', 'Kettle, mugs, tea and coffee'),
      l('Зарядки и удлинитель', 'Ładowarki i przedłużacz', 'Зарядки й подовжувач', 'Chargers and an extension lead'),
      l('Постельное и полотенца', 'Pościel i ręczniki', 'Постіль і рушники', 'Bedding and towels'),
      l('Аптечка и туалетная бумага', 'Apteczka i papier toaletowy', 'Аптечка й туалетний папір', 'First-aid kit and toilet paper'),
    ]},
  {id: 'D17-2', day: 17, slot: 2, rubric: 'ask', kind: 'text',
    title: l('Что обязательно будет в вашей коробке первой ночи?', 'Co musi być w Twoim kartonie pierwszej nocy?', 'Що обов’язково буде у вашій коробці першої ночі?', 'What’s a must in your first-night box?'),
    sticker: {t: 'poll', opts: [l('Кофе', 'Kawa', 'Кава', 'Coffee'), l('Зарядки', 'Ładowarki', 'Зарядки', 'Chargers'), l('Пижама', 'Piżama', 'Піжама', 'Pyjamas'), l('Игрушки детей', 'Zabawki dzieci', 'Іграшки дітей', 'Kids’ toys')]}},

  {id: 'D18-1', day: 18, slot: 1, rubric: 'bts', kind: 'text', gpt: 'uniform', hl: 'care',
    title: l('Форма бригады', 'Strój ekipy', 'Форма бригади', 'Our crew’s uniform'),
    body: l('Графит с бирюзовым кантом, чёрные перчатки, бахилы с логотипом — ещё до порога.', 'Grafit z turkusową lamówką, czarne rękawice, ochraniacze na buty z logo — już od progu.', 'Графіт із бірюзовим кантом, чорні рукавички, бахіли з логотипом — ще до порога.', 'Graphite with turquoise piping, black gloves, logo shoe covers — before we step in.'),
    note: 'Когда сошьют форму — заменить настоящим фото (без лиц или с согласия сотрудника).'},
  {id: 'D18-2', day: 18, slot: 2, rubric: 'myth', kind: 'text', hl: 'care',
    title: l('Что бригада надевает до входа в квартиру?', 'Co ekipa zakłada przed wejściem do mieszkania?', 'Що бригада вдягає до входу в квартиру?', 'What does our crew put on before stepping in?'),
    sticker: {t: 'quiz', opts: [l('Бахилы', 'Ochraniacze na buty', 'Бахіли', 'Shoe covers'), l('Ничего', 'Nic', 'Нічого', 'Nothing'), l('Шапку', 'Czapkę', 'Шапку', 'A hat')], ok: 0}},

  {id: 'D19-1', day: 19, slot: 1, rubric: 'num', kind: 'number', hl: 'price',
    big: same('0 zł'),
    title: l('доплат в день переезда', 'dopłat w dniu przeprowadzki', 'доплат у день переїзду', 'extra on moving day'),
    body: l('Изменения — только с вашего согласия и до начала работ.', 'Zmiany — tylko za Twoją zgodą i przed rozpoczęciem pracy.', 'Зміни — лише з вашої згоди й до початку робіт.', 'Changes only with your consent, before work begins.')},
  {id: 'D19-2', day: 19, slot: 2, rubric: 'tip', kind: 'photo', img: 'stories/gloves.webp', gpt: 'floor', ai: true, hl: 'care',
    title: l('Как мы защищаем дом', 'Jak chronimy dom', 'Як ми захищаємо дім', 'How we protect your home'),
    body: l('Дорожки на пол, накладки на косяки и углы. Это стандарт, а не платная услуга.', 'Chodniki na podłogę, osłony na futryny i narożniki. To standard, nie płatna usługa.', 'Доріжки на підлогу, накладки на одвірки й кути. Це стандарт, а не платна послуга.', 'Runners on floors, guards on door frames and corners. Standard, not a paid extra.')},
  {id: 'D19-3', day: 19, slot: 3, rubric: 'melbus', kind: 'photo', img: 'stories/phone.webp', ai: true, after: 'site',
    title: l('Отправьте видео — мы назовём цену', 'Wyślij wideo — podamy cenę', 'Надішліть відео — ми назвемо ціну', 'Send a video, we’ll name the price'),
    sticker: {t: 'link', to: 'quote', label: LINK.quote}},

  {id: 'D20-1', day: 20, slot: 1, rubric: 'how', kind: 'photo', img: 'stories/step-5-road.webp', ai: true, hl: 'how',
    title: l('Шаг 5. Дорога', 'Krok 5. Droga', 'Крок 5. Дорога', 'Step 5. On the road'),
    body: l('Бус MELBUS везёт только ваши вещи.', 'Bus MELBUS wiezie tylko Twoje rzeczy.', 'Бус MELBUS везе лише ваші речі.', 'A MELBUS van carries only your things.')},
  {id: 'D20-2', day: 20, slot: 2, rubric: 'ask', kind: 'text', hl: 'faq',
    title: l('Какую вещь страшнее всего перевозить?', 'Którą rzecz najbardziej boisz się przewozić?', 'Яку річ найстрашніше перевозити?', 'Which item are you most nervous about moving?'),
    sticker: {t: 'question', q: l('Напишите', 'Napisz', 'Напишіть', 'Tell us')}},

  {id: 'D21-1', day: 21, slot: 1, rubric: 'sun', kind: 'video', video: 'stories/gloves.mp4', ai: true,
    title: l('День святого Николая 🎁', 'Mikołajki 🎁', 'День святого Миколая 🎁', 'St Nicholas Day 🎁'),
    body: l('Лучший подарок на новоселье — переезд без стресса и доплат.', 'Najlepszy prezent na nowe mieszkanie — przeprowadzka bez stresu i dopłat.', 'Найкращий подарунок на новосілля — переїзд без стресу й доплат.', 'The best housewarming gift: a move with no stress and no extra fees.')},
  {id: 'D21-2', day: 21, slot: 2, rubric: 'diary', kind: 'text', hl: 'diary',
    title: l('Неделя 3: детали', 'Tydzień 3: szczegóły', 'Тиждень 3: деталі', 'Week 3: the details'),
    body: l('Коробки, наклейки, форма и защита дома. Дальше — как мы сняли фильм.', 'Kartony, naklejki, stroje i ochrona domu. Dalej — jak powstał nasz film.', 'Коробки, наліпки, форма й захист дому. Далі — як ми зняли фільм.', 'Boxes, labels, uniforms and home protection. Next: how we made our film.')},

  // ───────── НЕДЕЛЯ 4 · КАК МЫ СНЯЛИ ФИЛЬМ + ЗАПИСЬ ─────────
  {id: 'D22-1', day: 22, slot: 1, rubric: 'bts', kind: 'pair', pair: ['stories/pv-aerial.jpg', 'stories/film-aerial.jpg'], ai: true, hl: 'diary',
    title: l('Как мы сняли фильм без съёмки', 'Jak nakręciliśmy film bez kamery', 'Як ми зняли фільм без зйомки', 'How we made a film without filming'),
    body: l('Сначала — серые 3D-модели и камера, как у дрона. Потом ИИ «перекрасил» их в кино.', 'Najpierw szare modele 3D i kamera jak z drona. Potem AI „przemalowało” je w kino.', 'Спершу — сірі 3D-моделі й камера, як у дрона. Потім ШІ «перефарбував» їх у кіно.', 'First, grey 3D models and a drone-like camera. Then AI “repainted” them into cinema.')},
  {id: 'D22-2', day: 22, slot: 2, rubric: 'ask', kind: 'text',
    title: l('Догадались, что фильм нарисован?', 'Wiedzieliście, że film jest wygenerowany?', 'Здогадалися, що фільм намальований?', 'Could you tell the film was generated?'),
    sticker: {t: 'poll', opts: YES_NO}},

  {id: 'D23-1', day: 23, slot: 1, rubric: 'bts', kind: 'pair', pair: ['stories/pv-box.jpg', 'stories/film-box.jpg'], ai: true, hl: 'diary',
    title: l('Ни одного удара', 'Ani jednego uderzenia', 'Жодного удару', 'Not a single knock'),
    body: l('Каждый кадр проверяем: мебель не должна задеть стену или коробку. Как в настоящем переезде.', 'Sprawdzamy każdą klatkę: meble nie mogą zahaczyć o ścianę ani karton. Jak w prawdziwej przeprowadzce.', 'Перевіряємо кожен кадр: меблі не мають зачепити стіну чи коробку. Як у справжньому переїзді.', 'We check every frame: furniture mustn’t touch a wall or the box. Just like a real move.')},
  {id: 'D23-2', day: 23, slot: 2, rubric: 'how', kind: 'photo', img: 'stories/step-6-home.webp', ai: true, hl: 'how',
    title: l('Шаг 6. Новый дом', 'Krok 6. Nowy dom', 'Крок 6. Новий дім', 'Step 6. Your new home'),
    body: l('Заносим, собираем мебель, расставляем. Кровать — первой.', 'Wnosimy, składamy meble, ustawiamy. Łóżko — jako pierwsze.', 'Заносимо, збираємо меблі, розставляємо. Ліжко — першим.', 'We carry in, assemble and arrange. The bed goes first.')},
  {id: 'D23-3', day: 23, slot: 3, rubric: 'melbus', kind: 'shot', shot: 'calc-board', after: 'site',
    title: l('Сколько стоит ваш переезд?', 'Ile kosztuje Twoja przeprowadzka?', 'Скільки коштує ваш переїзд?', 'What will your move cost?'),
    sticker: {t: 'link', to: 'calc', label: LINK.calc}},

  {id: 'D24-1', day: 24, slot: 1, rubric: 'how', kind: 'shot', shot: 'area', hl: 'areas',
    title: l('Где мы работаем', 'Gdzie działamy', 'Де ми працюємо', 'Where we work'),
    body: l('Варшава и 150 км вокруг. По Польше и в ЕС — по запросу.', 'Warszawa i 150 km wokół. Po Polsce i do UE — na zapytanie.', 'Варшава і 150 км довкола. Польщею та до ЄС — за запитом.', 'Warsaw and 150 km around. Across Poland and the EU on request.')},
  {id: 'D24-2', day: 24, slot: 2, rubric: 'ask', kind: 'text', hl: 'areas',
    title: l('Откуда вы переезжаете?', 'Skąd się przeprowadzasz?', 'Звідки ви переїжджаєте?', 'Where are you moving from?'),
    sticker: {t: 'poll', opts: [l('Варшава', 'Warszawa', 'Варшава', 'Warsaw'), l('Пригород', 'Okolice', 'Передмістя', 'Suburbs'), l('Другой город', 'Inne miasto', 'Інше місто', 'Another city'), l('Из-за границы', 'Z zagranicy', 'З-за кордону', 'Abroad')]}},

  {id: 'D25-1', day: 25, slot: 1, rubric: 'myth', kind: 'text',
    title: l('Зимой переезжать дороже?', 'Zimą przeprowadzka jest droższa?', 'Взимку переїжджати дорожче?', 'Is moving in winter more expensive?'),
    sticker: {t: 'quiz', opts: YES_NO, ok: 1}},
  {id: 'D25-2', day: 25, slot: 2, rubric: 'tip', kind: 'text',
    title: l('Зима — тихий сезон', 'Zima to spokojny sezon', 'Зима — тихий сезон', 'Winter is the quiet season'),
    body: l('Больше свободных дат. Пик — лето, субботы и конец месяца.', 'Więcej wolnych terminów. Szczyt to lato, soboty i koniec miesiąca.', 'Більше вільних дат. Пік — літо, суботи й кінець місяця.', 'More free dates. Peak time is summer, Saturdays and month-ends.')},

  {id: 'D26-1', day: 26, slot: 1, rubric: 'num', kind: 'number', after: 'prices', hl: 'packages',
    big: same('3'),
    title: l('пакета на выбор', 'pakiety do wyboru', 'пакети на вибір', 'packages to choose from'),
    body: l(`Для 2 комнат «Под ключ» — всего на ${zl(g[2] - g[1], 'ru')} дороже «Стандарта».`, `Dla 2 pokoi „Pod klucz” to tylko ${zl(g[2] - g[1], 'pl')} więcej niż „Standard”.`, `Для 2 кімнат «Під ключ» — усього на ${zl(g[2] - g[1], 'uk')} дорожче за «Стандарт».`, `For 2 rooms, “Full service” is just ${zl(g[2] - g[1], 'en')} more than “Standard”.`)},
  {id: 'D26-2', day: 26, slot: 2, rubric: 'ask', kind: 'shot', shot: 'calc-pkg', hl: 'packages',
    title: l('Какой пакет выбрали бы вы?', 'Który pakiet wybierasz?', 'Який пакет обрали б ви?', 'Which package would you pick?'),
    sticker: {t: 'poll', opts: PACKAGES.map((p) => p.name as L)}},
  {id: 'D26-3', day: 26, slot: 3, rubric: 'melbus', kind: 'shot', shot: 'price-table', after: 'prices',
    title: l('Все цены — на сайте', 'Wszystkie ceny — na stronie', 'Усі ціни — на сайті', 'All prices on our site'),
    body: l('За весь переезд, не за часы.', 'Za całą przeprowadzkę, nie za godziny.', 'За весь переїзд, не за години.', 'For the whole move, not by the hour.'),
    sticker: {t: 'link', to: 'price', label: LINK.price}},

  {id: 'D27-1', day: 27, slot: 1, rubric: 'ask', kind: 'text', hl: 'faq',
    title: l('Ваши вопросы — наши ответы', 'Wasze pytania — nasze odpowiedzi', 'Ваші питання — наші відповіді', 'Your questions, our answers'),
    body: l('Отвечаем на вопросы, которые вы прислали за месяц.', 'Odpowiadamy na pytania, które przysłaliście w tym miesiącu.', 'Відповідаємо на питання, які ви надіслали за місяць.', 'Answering the questions you sent us this month.'),
    note: 'После этой сторис — 3–5 ответов: в Instagram откройте ответы на стикер «Вопрос» → «Поделиться ответом». Только настоящие вопросы.'},
  {id: 'D27-2', day: 27, slot: 2, rubric: 'tip', kind: 'list', hl: 'how',
    title: l('Неделя до переезда: что сделать', 'Tydzień przed przeprowadzką: co zrobić', 'Тиждень до переїзду: що зробити', 'A week before moving: what to do'),
    items: [
      l('Закажите коробки заранее', 'Zamów kartony wcześniej', 'Замовте коробки заздалегідь', 'Order boxes in advance'),
      l('Разберите ненужное', 'Pozbądź się zbędnych rzeczy', 'Розберіть непотрібне', 'Declutter what you don’t need'),
      l('Договоритесь о лифте и парковке', 'Ustal windę i parking', 'Домовтеся про ліфт і паркування', 'Sort out the lift and parking'),
      l('Снимите видео — получите цену', 'Nagraj wideo — dostaniesz cenę', 'Зніміть відео — отримайте ціну', 'Film a video — get your price'),
    ]},

  {id: 'D28-1', day: 28, slot: 1, rubric: 'sun', kind: 'video', video: 'stories/film-m.mp4', ai: true,
    title: l('Ваш новый адрес ждёт', 'Twój nowy adres czeka', 'Ваша нова адреса чекає', 'Your new address is waiting')},
  {id: 'D28-2', day: 28, slot: 2, rubric: 'diary', kind: 'text', hl: 'diary',
    title: l('Месяц дневника позади', 'Miesiąc dziennika za nami', 'Місяць щоденника позаду', 'A month of our diary'),
    body: l('Спасибо, что вы с нами. Дальше — первые настоящие переезды: покажем их как есть.', 'Dziękujemy, że jesteście z nami. Dalej — pierwsze prawdziwe przeprowadzki: pokażemy je bez upiększeń.', 'Дякуємо, що ви з нами. Далі — перші справжні переїзди: покажемо їх як є.', 'Thanks for being here. Next: our first real moves, shown as they are.')},
  {id: 'D28-3', day: 28, slot: 3, rubric: 'melbus', kind: 'photo', img: 'stories/film-van.jpg', ai: true, after: 'site',
    title: l('Запишитесь на переезд', 'Zarezerwuj przeprowadzkę', 'Запишіться на переїзд', 'Book your move'),
    body: l('Декабрь и январь — есть свободные даты.', 'Grudzień i styczeń — są wolne terminy.', 'Грудень і січень — є вільні дати.', 'December and January — dates available.'),
    sticker: {t: 'link', to: 'quote', label: LINK.quote},
    note: 'Только если свободные даты правда есть.'},
];

/** сторис-картинки (всё, кроме видео) — по порядку кадров рендера */
export const STILLS = STORIES.filter((s) => s.kind !== 'video');
export const VIDEOS = STORIES.filter((s) => s.kind === 'video');
export const dateOf = (day: number) => {
  const d = new Date(`${START}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() + day - 1);
  return d;
};
export const TIMES = {1: '09:00', 2: '13:00', 3: '19:00'} as const;

/** Шапка профиля Instagram (имя — до 30 знаков, его ищет поиск; описание — до 150 знаков) */
export const PROFILE = {
  name: l('MELBUS Переезды Варшава', 'MELBUS Przeprowadzki Warszawa', 'MELBUS Переїзди Варшава', 'MELBUS Movers Warsaw'),
  bio: l(
    'Переезды под ключ: Варшава +150 км 📦\nЦена по видео — без доплат и без оплаты за часы.\nФактура VAT · BLIK · 7/7 · PL RU UA EN',
    'Przeprowadzki pod klucz: Warszawa +150 km 📦\nStała cena z wideo — bez dopłat i liczenia godzin.\nFaktura VAT · BLIK · 7/7 · PL RU UA EN',
    'Переїзди під ключ: Варшава +150 км 📦\nЦіна за відео — без доплат і без оплати за години.\nФактура VAT · BLIK · 7/7 · PL RU UA EN',
    'Full-service moves: Warsaw +150 km 📦\nOne fixed price from a video — no extras, no hourly billing.\nVAT invoice · BLIK · 7/7 · PL RU UA EN'),
};
