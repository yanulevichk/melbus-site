/**
 * ЦЕНЫ НА САЙТЕ — тексты блока «Можно и по часам» и пакетов на главной. Каждая фраза сразу на 4 языках.
 * Цифры — src/data/move.ts (одна формула для всего сайта), пакеты — src/data/pricing.ts.
 * 18.11.2026: вместо «Мы не продаём часы» — «Можно и по часам» (решение владельца: кого пугает фиксированная цена,
 * может выбрать почасовую; тактично объясняем, почему фиксированная выгоднее, без упрёков другим фирмам).
 */
import type { L } from '../i18n/text';
import { HOURLY2 } from '../data/move';

const l = (ru: string, pl: string, uk: string, en: string): L => ({ ru, pl, uk, en });
const v = (x: L): L => Object.fromEntries(Object.entries(x).map(([k, s]) => [k, s.replace('{rate}', String(HOURLY2.base)).replace('{min}', String(HOURLY2.min))])) as L;

export const noHours = {
  h2: l('Можно и по часам', 'Można też za godzinę', 'Можна й погодинно', 'You can also pay by the hour'),
  lead: v(l(
    'Почасовая оплата выгодна тому, кто работает медленно. Поэтому мы советуем фиксированную цену. Но если вам привычнее по часам — пожалуйста: бус и два грузчика за {rate} zł в час, минимум {min} часа.',
    'Płatność za godzinę opłaca się temu, kto pracuje wolno. Dlatego polecamy stałą cenę. Ale jeśli wolisz za godzinę — proszę bardzo: bus i dwóch tragarzy za {rate} zł za godzinę, minimum {min} godziny.',
    'Погодинна оплата вигідна тому, хто працює повільно. Тому ми радимо фіксовану ціну. Але якщо вам звичніше погодинно — будь ласка: бус і два вантажники за {rate} zł на годину, мінімум {min} години.',
    'Paying by the hour suits whoever works slowly. That’s why we recommend a fixed price. But if you prefer hourly, that’s fine: a van and two movers for {rate} zł an hour, {min} hours minimum.')),
  them: l('По часам', 'Za godzinę', 'Погодинно', 'Hourly'),
  us: l('Фиксированная цена', 'Stała cena', 'Фіксована ціна', 'Fixed price'),
  rows: [
    [l('Счёт растёт с каждой пробкой и долгим лифтом', 'Rachunek rośnie z każdym korkiem i wolną windą', 'Рахунок росте з кожним затором і повільним ліфтом', 'The bill grows with every traffic jam and slow lift'),
     l('Пробки, лестницы и тяжёлый шкаф — наш риск', 'Korki, schody i ciężka szafa — to nasze ryzyko', 'Затори, сходи й важка шафа — наш ризик', 'Traffic, stairs and a heavy wardrobe are our risk')],
    [l('Итог узнаёте в конце дня', 'Kwotę poznajesz na koniec dnia', 'Підсумок дізнаєтеся наприкінці дня', 'You learn the total at the end of the day'),
     l('Итог известен до начала работ', 'Kwotę znasz przed rozpoczęciem prac', 'Підсумок відомий до початку робіт', 'You know the total before we start')],
    [v(l('Минимум {min} часа, даже если управились быстрее', 'Minimum {min} godziny, nawet gdy skończymy szybciej', 'Мінімум {min} години, навіть якщо впоралися швидше', '{min} hours minimum, even if we finish sooner')),
     l('Платите за весь переезд, а не за время', 'Płacisz za całą przeprowadzkę, a nie za czas', 'Платите за весь переїзд, а не за час', 'You pay for the whole move, not for the time')],
  ] as [L, L][],
};

export const pkgText = {
  h2: l('Три пакета', 'Trzy pakiety', 'Три пакети', 'Three packages'),
  lead: l('Пример — 2 комнаты по Варшаве, с лифтом. Для вашего переезда цену посчитает форма: по вашим вещам и адресам.', 'Przykład — 2 pokoje w Warszawie, z windą. Cenę Twojej przeprowadzki policzy formularz: według Twoich rzeczy i adresów.', 'Приклад — 2 кімнати у Варшаві, з ліфтом. Ціну вашого переїзду порахує форма: за вашими речами й адресами.', 'Example: a 2-room flat in Warsaw, with a lift. The form prices your own move from your things and addresses.'),
  best: l('Меньше всего забот', 'Najmniej zmartwień', 'Найменше клопоту', 'Least hassle'),
  from: l('от', 'od', 'від', 'from'),
  perHour: l('{n} zł в час', '{n} zł za godzinę', '{n} zł на годину', '{n} zł an hour'),
  orHourly: v(l('или {rate} zł в час', 'lub {rate} zł za godzinę', 'або {rate} zł на годину', 'or {rate} zł an hour')),
  calc: l('Посчитать свой переезд', 'Policz swoją przeprowadzkę', 'Порахувати свій переїзд', 'Price your move'),
  choose: l('Выбрать', 'Wybieram', 'Обрати', 'Choose'),
};
