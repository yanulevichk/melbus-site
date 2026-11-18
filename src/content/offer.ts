/**
 * ОФЕРТА (страница для клиента + готовое сообщение для WhatsApp). Каждая фраза сразу на 4 языках.
 * Шаблоны: {id} {name} {date} {d} {n} {total} {pkg} {url}.
 */
import type { L } from '../i18n/text';

const l = (ru: string, pl: string, uk: string, en: string): L => ({ ru, pl, uk, en });

export const offerText = {
  metaTitle: l('Оферта на переезд', 'Oferta na przeprowadzkę', 'Оферта на переїзд', 'Moving offer'),
  metaDesc: l('Ваша оферта MELBUS: фиксированная цена за весь переезд.', 'Twoja oferta MELBUS: stała cena za całą przeprowadzkę.', 'Ваша оферта MELBUS: фіксована ціна за весь переїзд.', 'Your MELBUS offer: one fixed price for the whole move.'),
  loading: l('Загружаем оферту…', 'Wczytujemy ofertę…', 'Завантажуємо оферту…', 'Loading your offer…'),
  notFound: l('Оферта не найдена. Проверьте ссылку или напишите нам в WhatsApp.', 'Nie znaleziono oferty. Sprawdź link albo napisz do nas na WhatsApp.', 'Оферту не знайдено. Перевірте посилання або напишіть нам у WhatsApp.', 'Offer not found. Check the link or message us on WhatsApp.'),
  title: l('Оферта № {id}', 'Oferta nr {id}', 'Оферта № {id}', 'Offer no. {id}'),
  forName: l('для {name}', 'dla: {name}', 'для {name}', 'for {name}'),
  valid: l('Действует до {date}', 'Ważna do {date}', 'Діє до {date}', 'Valid until {date}'),
  totalFor: l('за весь переезд, пакет «{pkg}»', 'za całą przeprowadzkę, pakiet „{pkg}”', 'за весь переїзд, пакет «{pkg}»', 'for the whole move, “{pkg}” package'),
  totalForHourly: l('оценка, пакет «{pkg}», оплата по часам', 'szacunek, pakiet „{pkg}”, płatność za godzinę', 'оцінка, пакет «{pkg}», оплата погодинно', 'estimate, “{pkg}” package, paid by the hour'),
  noHours: l('Не за часы: если работа затянется, это наш риск, а не ваш.', 'Nie za godziny: jeśli praca potrwa dłużej, to nasze ryzyko, a nie Twoje.', 'Не за години: якщо робота затягнеться, це наш ризик, а не ваш.', 'Not by the hour: if the job takes longer, that’s our risk, not yours.'),
  details: l('Детали переезда', 'Szczegóły przeprowadzki', 'Деталі переїзду', 'Move details'),
  when: l('Когда', 'Kiedy', 'Коли', 'When'),
  noDate: l('дату согласуем', 'termin ustalimy', 'дату погодимо', 'date to be agreed'),
  arrival: l('прибытие бригады: {w}', 'przyjazd ekipy: {w}', 'прибуття бригади: {w}', 'crew arrives: {w}'),
  from: l('Откуда', 'Skąd', 'Звідки', 'From'),
  to: l('Куда', 'Dokąd', 'Куди', 'To'),
  floor: l('этаж {n}', 'piętro {n}', 'поверх {n}', 'floor {n}'),
  ground: l('партер', 'parter', 'партер', 'ground floor'),
  lift: l('лифт есть', 'jest winda', 'ліфт є', 'with a lift'),
  noLift: l('без лифта', 'bez windy', 'без ліфта', 'no lift'),
  items: l('Список вещей', 'Lista rzeczy', 'Список речей', 'Item list'),
  note: l('Комментарий', 'Komentarz', 'Коментар', 'Note'),
  included: l('Что входит в пакет', 'Co obejmuje pakiet', 'Що входить у пакет', 'What the package includes'),
  price: l('Из чего складывается цена', 'Z czego składa się cena', 'З чого складається ціна', 'Price breakdown'),
  rows: {
    pkg: l('Пакет «{n}»', 'Pakiet „{n}”', 'Пакет «{n}»', '“{n}” package'),
    manual: l('Индивидуальная корректировка', 'Korekta indywidualna', 'Індивідуальне коригування', 'Individual adjustment'),
    hourly: l('Оплата по часам', 'Płatność za godzinę', 'Оплата погодинно', 'Paid by the hour'),
    hourlyV: l('{rate} в час, минимум {h} ч', '{rate} za godzinę, minimum {h} godz.', '{rate} на годину, мінімум {h} год', '{rate} an hour, {h} h minimum'),
    total: l('Итого', 'Razem', 'Разом', 'Total'),
  },
  guaranteeH: l('Гарантия цены', 'Gwarancja ceny', 'Гарантія ціни', 'Price guarantee'),
  guarantee: l('Цена окончательная. Изменить её можно, только если вещей заметно больше, чем на видео, или изменился адрес — и только с вашего согласия до начала работ.', 'Cena jest ostateczna. Może się zmienić tylko wtedy, gdy rzeczy jest wyraźnie więcej niż na wideo albo zmienił się adres — i tylko za Twoją zgodą przed rozpoczęciem pracy.', 'Ціна остаточна. Змінити її можна, лише якщо речей помітно більше, ніж на відео, або змінилася адреса — і лише з вашої згоди до початку робіт.', 'The price is final. It can only change if there are noticeably more items than on the video or the address changes — and only with your consent before work begins.'),
  depositH: l('Задаток', 'Zadatek', 'Завдаток', 'Deposit'),
  deposit: l('{d} — закрепляет дату за вами. Остаток — после переезда: BLIK, карта или наличные. Фактура VAT.', '{d} — rezerwuje dla Ciebie termin. Reszta po przeprowadzce: BLIK, karta lub gotówka. Faktura VAT.', '{d} — закріплює дату за вами. Решта — після переїзду: BLIK, картка або готівка. Фактура VAT.', '{d} — secures your date. The balance is paid after the move: BLIK, card or cash. VAT invoice included.'),
  cancelH: l('Отмена и перенос', 'Rezygnacja i zmiana terminu', 'Скасування й перенесення', 'Cancelling and rescheduling'),
  cancel: l('Бесплатная отмена — не позднее чем за 72 часа до переезда. Позже задаток не возвращается. Один перенос даты — бесплатно.', 'Bezpłatna rezygnacja — najpóźniej 72 godziny przed przeprowadzką. Później zadatek nie podlega zwrotowi. Jedna zmiana terminu — bezpłatnie.', 'Безкоштовне скасування — не пізніше ніж за 72 години до переїзду. Пізніше завдаток не повертається. Одне перенесення дати — безкоштовно.', 'Free cancellation up to 72 hours before the move. After that, the deposit is non-refundable. One date change is free.'),
  agree: l('Принимаю условия оферты и', 'Akceptuję warunki oferty i', 'Приймаю умови оферти й', 'I accept the conditions of this offer and the'),
  terms: l('регламент', 'regulamin', 'регламент', 'terms of service'),
  accept: l('Принять оферту', 'Akceptuję ofertę', 'Прийняти оферту', 'Accept the offer'),
  accepting: l('Отправляем…', 'Wysyłamy…', 'Надсилаємо…', 'Sending…'),
  acceptedH: l('Оферта принята', 'Oferta zaakceptowana', 'Оферту прийнято', 'Offer accepted'),
  accepted: l('Спасибо! Мы напишем вам, как оплатить задаток, и подтвердим детали.', 'Dziękujemy! Napiszemy do Ciebie w sprawie zadatku i potwierdzenia szczegółów.', 'Дякуємо! Ми напишемо вам, як оплатити завдаток, і підтвердимо деталі.', 'Thank you! We’ll message you about paying the deposit and confirm the details.'),
  expiredH: l('Срок оферты истёк', 'Oferta wygasła', 'Строк оферти минув', 'This offer has expired'),
  expired: l('Напишите нам — пересчитаем на новую дату.', 'Napisz do nas — przeliczymy na nowy termin.', 'Напишіть нам — перерахуємо на нову дату.', 'Message us and we’ll recalculate the price for a new date.'),
  errAgree: l('Отметьте согласие с условиями.', 'Zaznacz akceptację warunków.', 'Позначте згоду з умовами.', 'Please tick to accept the terms.'),
  err: l('Не получилось. Попробуйте ещё раз или напишите в WhatsApp.', 'Nie udało się. Spróbuj ponownie albo napisz na WhatsApp.', 'Не вдалося. Спробуйте ще раз або напишіть у WhatsApp.', 'Something went wrong. Try again or message us on WhatsApp.'),
  ask: l('Есть вопрос? Напишите в WhatsApp', 'Masz pytanie? Napisz na WhatsApp', 'Є питання? Напишіть у WhatsApp', 'Questions? Message us on WhatsApp'),
  /** готовое сообщение клиенту (копирует менеджер) */
  message: l(
    'Здравствуйте, {name}! Ваша оферта MELBUS: {total} за весь переезд, пакет «{pkg}», {date}. Цена не изменится в день переезда. Подробности и подтверждение: {url}',
    'Dzień dobry, {name}! Twoja oferta MELBUS: {total} za całą przeprowadzkę, pakiet „{pkg}”, {date}. Cena nie zmieni się w dniu przeprowadzki. Szczegóły i akceptacja: {url}',
    'Вітаємо, {name}! Ваша оферта MELBUS: {total} за весь переїзд, пакет «{pkg}», {date}. Ціна не зміниться в день переїзду. Деталі й підтвердження: {url}',
    'Hello {name}! Your MELBUS offer: {total} for the whole move, “{pkg}” package, {date}. The price won’t change on moving day. Details and confirmation: {url}'),
  /** то же для оплаты по часам: сумма — оценка, без «цена не изменится» */
  messageHourly: l(
    'Здравствуйте, {name}! Ваша оферта MELBUS: пакет «{pkg}», оплата по часам, оценка {total}, {date}. Подробности и подтверждение: {url}',
    'Dzień dobry, {name}! Twoja oferta MELBUS: pakiet „{pkg}”, płatność za godzinę, szacunkowo {total}, {date}. Szczegóły i akceptacja: {url}',
    'Вітаємо, {name}! Ваша оферта MELBUS: пакет «{pkg}», оплата погодинно, оцінка {total}, {date}. Деталі й підтвердження: {url}',
    'Hello {name}! Your MELBUS offer: “{pkg}” package, paid by the hour, estimated at {total}, {date}. Details and confirmation: {url}'),
};
