/**
 * ЦЕНЫ НА САЙТЕ — тексты блока «Мы не продаём часы», таблицы цен и пакетов. Каждая фраза сразу на 4 языках.
 * Сами цифры — src/data/pricing.ts (одна формула для всего сайта).
 * Шаблоны: {d} — сумма, {n} — название пакета.
 */
import type { L } from '../i18n/text';

const l = (ru: string, pl: string, uk: string, en: string): L => ({ ru, pl, uk, en });

export const noHours = {
  h2: l('Мы не продаём часы', 'Nie sprzedajemy godzin', 'Ми не продаємо години', 'We don’t sell hours'),
  lead: l(
    'У почасовой фирмы медленная работа — это больше денег. У нас цена назначена до начала, поэтому бригаде выгодно работать быстро и аккуратно.',
    'W firmie liczącej za godzinę wolna praca to wyższy rachunek. U nas cena jest ustalona przed startem, więc ekipie opłaca się pracować szybko i starannie.',
    'У погодинної фірми повільна робота — це більше грошей. У нас ціна визначена до початку, тому бригаді вигідно працювати швидко й акуратно.',
    'With hourly movers, slow work means a bigger bill. Our price is set before we start, so it pays for our crew to work fast and carefully.'),
  them: l('Почасовая оплата', 'Płatność za godzinę', 'Погодинна оплата', 'Hourly billing'),
  us: l('MELBUS', 'MELBUS', 'MELBUS', 'MELBUS'),
  rows: [
    [l('Минимум 2–3 часа, даже если работы на час', 'Minimum 2–3 godziny, nawet gdy pracy jest na godzinę', 'Мінімум 2–3 години, навіть якщо роботи на годину', 'A 2–3 hour minimum, even for an hour’s work'),
     l('Цена за весь переезд — по видео, до начала работ', 'Cena za całą przeprowadzkę — z wideo, przed startem', 'Ціна за весь переїзд — за відео, до початку робіт', 'One price for the whole move — from a video, before we start')],
    [l('Пробки, лестницы и перекуры — за ваш счёт', 'Korki, schody i przerwy — na Twój koszt', 'Затори, сходи й перекури — за ваш рахунок', 'Traffic, stairs and breaks go on your bill'),
     l('Пробки, узкие лестницы и тяжёлый шкаф — наш риск', 'Korki, wąskie schody i ciężka szafa — nasze ryzyko', 'Затори, вузькі сходи й важка шафа — наш ризик', 'Traffic, narrow stairs and a heavy wardrobe are our risk')],
    [l('Итог узнаёте в конце дня', 'Kwotę poznajesz na koniec dnia', 'Підсумок дізнаєтеся наприкінці дня', 'You learn the total at the end of the day'),
     l('Итог известен заранее и не меняется', 'Kwotę znasz z góry — i ona się nie zmienia', 'Підсумок відомий заздалегідь і не змінюється', 'You know the total in advance — and it doesn’t change')],
  ] as [L, L][],
};

export const pkgText = {
  h2: l('Три пакета', 'Trzy pakiety', 'Три пакети', 'Three packages'),
  lead: l('Цена за весь переезд, а не за часы. Пример — 2 комнаты по Варшаве, с лифтом. Для вашей квартиры точную цену назовём по видео.', 'Cena za całą przeprowadzkę, a nie za godziny. Przykład — 2 pokoje w Warszawie, z windą. Dokładną cenę dla Twojego mieszkania podamy z wideo.', 'Ціна за весь переїзд, а не за години. Приклад — 2 кімнати Варшавою, з ліфтом. Для вашої квартири точну ціну назвемо за відео.', 'One price for the whole move, not by the hour. Example: 2 rooms within Warsaw, with a lift. We’ll give the exact price for your home from a video.'),
  best: l('Выгоднее всего', 'Najkorzystniej', 'Найвигідніше', 'Best value'),
  more: l('всего на {d} zł больше, чем «{n}»', 'tylko o {d} zł więcej niż „{n}”', 'усього на {d} zł більше за «{n}»', 'just {d} zł more than “{n}”'),
  calc: l('Рассчитать для своей квартиры', 'Oblicz dla swojego mieszkania', 'Розрахувати для своєї квартири', 'Calculate for your home'),
  choose: l('Выбрать', 'Wybieram', 'Обрати', 'Choose'),
};

export const priceTable = {
  h2: l('Цены на переезд', 'Ceny przeprowadzek', 'Ціни на переїзд', 'Moving prices'),
  caption: l('По Варшаве, с лифтом, обычное количество вещей. Мало вещей — дешевле, много — дороже. Точную цену назовём по видео — и она не изменится в день переезда.', 'W Warszawie, z windą, typowa ilość rzeczy. Mniej rzeczy — taniej, więcej — drożej. Dokładną cenę podamy z wideo — i nie zmieni się w dniu przeprowadzki.', 'Варшавою, з ліфтом, звичайна кількість речей. Мало речей — дешевше, багато — дорожче. Точну ціну назвемо за відео — і вона не зміниться в день переїзду.', 'Within Warsaw, with a lift, a typical amount of stuff. Less stuff costs less, more costs more. We’ll give the exact price from a video — and it won’t change on moving day.'),
  what: l('Что везём', 'Co przewozimy', 'Що веземо', 'What we move'),
  from: l('от', 'od', 'від', 'from'),
  demo: l('Цены на утверждении.', 'Ceny w trakcie zatwierdzania.', 'Ціни на затвердженні.', 'Prices are being finalised.'),
  incH2: l('Что входит', 'Co jest w cenie', 'Що входить', 'What’s included'),
  extrasH2: l('Дополнительно', 'Dodatkowo', 'Додатково', 'Extras'),
  extrasLead: l('Только если нужно. Часть услуг уже входит в «Стандарт» и «Под ключ».', 'Tylko jeśli potrzebujesz. Część usług jest już w pakietach „Standard” i „Pod klucz”.', 'Лише якщо потрібно. Частина послуг уже входить у «Стандарт» і «Під ключ».', 'Only if you need them. Some are already part of “Standard” and “Full service”.'),
  floor: l('Этаж без лифта — за этаж', 'Piętro bez windy — za piętro', 'Поверх без ліфта — за поверх', 'Floor without a lift — per floor'),
  eu: l('Переезд в другую страну ЕС', 'Przeprowadzka do innego kraju UE', 'Переїзд до іншої країни ЄС', 'Moving to another EU country'),
  euPrice: l('по видео и маршруту', 'wycena z wideo i trasy', 'за відео й маршрутом', 'priced from video and route'),
  alwaysH2: l('Всегда в цене', 'Zawsze w cenie', 'Завжди в ціні', 'Always included'),
  calc: l('Рассчитать свой переезд', 'Oblicz swoją przeprowadzkę', 'Розрахувати свій переїзд', 'Calculate your move'),
};
