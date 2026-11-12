/**
 * ОФЕРТА (страница для клиента + готовое сообщение для WhatsApp). Каждая фраза сразу на 4 языках.
 * Шаблоны: {id} {name} {date} {d} {n} {total} {pkg} {url}.
 */
import type { L } from '../i18n/text';

const l = (ru: string, pl: string, uk: string, en: string): L => ({ ru, pl, uk, en });

export const offerText = {
  metaTitle: l('Оферта на переезд', 'Oferta przeprowadzki', 'Оферта на переїзд', 'Moving offer'),
  metaDesc: l('Ваша оферта MELBUS: фиксированная цена за весь переезд.', 'Twoja oferta MELBUS: stała cena za całą przeprowadzkę.', 'Ваша оферта MELBUS: фіксована ціна за весь переїзд.', 'Your MELBUS offer: one fixed price for the whole move.'),
  loading: l('Загружаем оферту…', 'Wczytujemy ofertę…', 'Завантажуємо оферту…', 'Loading your offer…'),
  notFound: l('Оферта не найдена. Проверьте ссылку или напишите нам в WhatsApp.', 'Nie znaleziono oferty. Sprawdź link albo napisz do nas na WhatsApp.', 'Оферту не знайдено. Перевірте посилання або напишіть нам у WhatsApp.', 'Offer not found. Check the link or message us on WhatsApp.'),
  title: l('Оферта № {id}', 'Oferta nr {id}', 'Оферта № {id}', 'Offer no. {id}'),
  forName: l('для {name}', 'dla: {name}', 'для {name}', 'for {name}'),
  valid: l('Действует до {date}', 'Ważna do {date}', 'Діє до {date}', 'Valid until {date}'),
  totalFor: l('за весь переезд · пакет «{pkg}»', 'za całą przeprowadzkę · pakiet „{pkg}”', 'за весь переїзд · пакет «{pkg}»', 'for the whole move · “{pkg}” package'),
  noHours: l('Не за часы: если работа займёт дольше — это наш риск, не ваш.', 'Nie za godziny: jeśli praca potrwa dłużej — to nasze ryzyko, nie Twoje.', 'Не за години: якщо робота триватиме довше — це наш ризик, не ваш.', 'Not by the hour: if the job takes longer, that’s our risk, not yours.'),
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
  what: l('Что перевозим', 'Co przewozimy', 'Що перевозимо', 'What we move'),
  items: l('Список вещей', 'Lista rzeczy', 'Список речей', 'Item list'),
  extras: l('Дополнительно', 'Dodatkowo', 'Додатково', 'Extras'),
  note: l('Комментарий', 'Komentarz', 'Коментар', 'Note'),
  included: l('Что входит в пакет', 'Co obejmuje pakiet', 'Що входить у пакет', 'What the package includes'),
  price: l('Из чего цена', 'Z czego składa się cena', 'З чого ціна', 'Price breakdown'),
  rows: {
    pkg: l('Пакет «{n}»', 'Pakiet „{n}”', 'Пакет «{n}»', '“{n}” package'),
    dist: l('Дорога за город', 'Dojazd poza miasto', 'Дорога за місто', 'Out-of-town travel'),
    floors: l('Этажи без лифта', 'Piętra bez windy', 'Поверхи без ліфта', 'Floors without a lift'),
    extras: l('Доп. услуги', 'Usługi dodatkowe', 'Дод. послуги', 'Extras'),
    manual: l('Индивидуальная корректировка', 'Korekta indywidualna', 'Індивідуальне коригування', 'Individual adjustment'),
    total: l('Итого', 'Razem', 'Разом', 'Total'),
  },
  guaranteeH: l('Гарантия цены', 'Gwarancja ceny', 'Гарантія ціни', 'Price guarantee'),
  guarantee: l('Цена окончательная. Изменить её можно, только если вещей заметно больше, чем на видео, или изменился адрес — и только с вашего согласия до начала работ.', 'Cena jest ostateczna. Może się zmienić tylko, gdy rzeczy jest wyraźnie więcej niż na wideo albo zmienił się adres — i tylko za Twoją zgodą przed rozpoczęciem pracy.', 'Ціна остаточна. Змінити її можна, лише якщо речей помітно більше, ніж на відео, або змінилася адреса — і лише з вашої згоди до початку робіт.', 'The price is final. It can only change if there are noticeably more items than on the video or the address changes — and only with your consent before work begins.'),
  depositH: l('Задаток', 'Zadatek', 'Завдаток', 'Deposit'),
  deposit: l('{d} — закрепляет дату за вами. Остаток — после переезда: BLIK, карта или перевод. Фактура VAT.', '{d} — rezerwuje dla Ciebie termin. Reszta po przeprowadzce: BLIK, karta lub przelew. Faktura VAT.', '{d} — закріплює дату за вами. Решта — після переїзду: BLIK, картка або переказ. Фактура VAT.', '{d} — secures your date. The rest after the move: BLIK, card or bank transfer. VAT invoice.'),
  cancelH: l('Отмена и перенос', 'Odwołanie i zmiana terminu', 'Скасування й перенесення', 'Cancelling and rescheduling'),
  cancel: l('Бесплатно — за 72 часа и раньше. Позже задаток не возвращается. Один перенос даты — бесплатно.', 'Bezpłatnie — 72 godziny wcześniej lub dawniej. Później zadatek nie jest zwracany. Jedna zmiana terminu — bezpłatnie.', 'Безкоштовно — за 72 години й раніше. Пізніше завдаток не повертається. Одне перенесення дати — безкоштовно.', 'Free up to 72 hours before. After that the deposit isn’t refunded. One date change is free.'),
  agree: l('Принимаю условия оферты и', 'Akceptuję warunki oferty i', 'Приймаю умови оферти й', 'I accept the offer terms and the'),
  terms: l('регламент', 'regulamin', 'регламент', 'terms of service'),
  accept: l('Принять оферту', 'Akceptuję ofertę', 'Прийняти оферту', 'Accept the offer'),
  accepting: l('Отправляем…', 'Wysyłamy…', 'Надсилаємо…', 'Sending…'),
  acceptedH: l('Оферта принята', 'Oferta zaakceptowana', 'Оферту прийнято', 'Offer accepted'),
  accepted: l('Спасибо! Мы напишем вам, чтобы оплатить задаток и подтвердить детали.', 'Dziękujemy! Napiszemy do Ciebie w sprawie zadatku i potwierdzenia szczegółów.', 'Дякуємо! Ми напишемо вам, щоб оплатити завдаток і підтвердити деталі.', 'Thank you! We’ll message you about the deposit and to confirm the details.'),
  expiredH: l('Срок оферты истёк', 'Oferta wygasła', 'Строк оферти минув', 'This offer has expired'),
  expired: l('Напишите нам — пересчитаем на новую дату.', 'Napisz do nas — przeliczymy na nowy termin.', 'Напишіть нам — перерахуємо на нову дату.', 'Message us and we’ll requote for a new date.'),
  errAgree: l('Отметьте согласие с условиями.', 'Zaznacz akceptację warunków.', 'Позначте згоду з умовами.', 'Please tick to accept the terms.'),
  err: l('Не получилось. Попробуйте ещё раз или напишите в WhatsApp.', 'Nie udało się. Spróbuj ponownie albo napisz na WhatsApp.', 'Не вдалося. Спробуйте ще раз або напишіть у WhatsApp.', 'Something went wrong. Try again or message us on WhatsApp.'),
  ask: l('Есть вопрос? Напишите в WhatsApp', 'Masz pytanie? Napisz na WhatsApp', 'Є питання? Напишіть у WhatsApp', 'Questions? Message us on WhatsApp'),
  /** готовое сообщение клиенту (копирует менеджер) */
  message: l(
    'Здравствуйте, {name}! Ваша оферта MELBUS: {total} за весь переезд, пакет «{pkg}», {date}. Цена не изменится в день переезда. Подробности и подтверждение: {url}',
    'Dzień dobry, {name}! Twoja oferta MELBUS: {total} za całą przeprowadzkę, pakiet „{pkg}”, {date}. Cena nie zmieni się w dniu przeprowadzki. Szczegóły i akceptacja: {url}',
    'Вітаємо, {name}! Ваша оферта MELBUS: {total} за весь переїзд, пакет «{pkg}», {date}. Ціна не зміниться в день переїзду. Деталі й підтвердження: {url}',
    'Hello {name}! Your MELBUS offer: {total} for the whole move, “{pkg}” package, {date}. The price won’t change on moving day. Details and confirmation: {url}'),
};
