/** Частые вопросы — каждый вопрос и ответ сразу на 4 языках. */
import type { L } from '../i18n/text';
import type { Locale } from '../i18n/routes';

export const faqHome: [L, L][] = [
  [
    { ru: 'Почему цена не изменится в день переезда?', pl: 'Dlaczego cena nie zmieni się w dniu przeprowadzki?', uk: 'Чому ціна не зміниться в день переїзду?', en: 'Why won’t the price change on moving day?' },
    { ru: 'Мы считаем цену по видео вашей квартиры и списку вещей. Если работа займёт больше времени, чем мы рассчитали, — это наш риск. Цена может измениться только если вещей заметно больше или изменился адрес, и только с вашего согласия до начала работ.', pl: 'Wyceniamy przeprowadzkę na podstawie wideo mieszkania i listy rzeczy. Jeśli praca zajmie więcej czasu, niż zakładaliśmy, to nasze ryzyko. Cena może się zmienić tylko wtedy, gdy rzeczy jest wyraźnie więcej albo zmienił się adres — i tylko za Twoją zgodą przed rozpoczęciem pracy.', uk: 'Ми рахуємо ціну за відео вашої квартири та списком речей. Якщо робота займе більше часу, ніж ми розрахували, — це наш ризик. Ціна може змінитися, лише якщо речей помітно більше або змінилася адреса, і лише з вашої згоди до початку робіт.', en: 'We price your move from a video of your flat and a list of items. If the job takes longer than we planned, that’s our risk. The price can only change if there are noticeably more items or the address changes — and only with your consent before work begins.' },
  ],
  [
    { ru: 'Почему вы не берёте оплату за час?', pl: 'Dlaczego nie liczycie za godzinę?', uk: 'Чому ви не берете оплату за годину?', en: 'Why don’t you charge by the hour?' },
    { ru: 'При почасовой оплате медленная работа выгодна фирме: пробки, лестницы и перерывы оплачивает клиент, а итог известен только в конце. Мы называем цену за весь переезд по видео — заранее. Если работа займёт дольше, это наш риск, поэтому бригаде выгодно работать быстро и аккуратно.', pl: 'Przy płatności za godzinę wolna praca opłaca się firmie: korki, schody i przerwy opłaca klient, a kwotę zna dopiero na końcu. My podajemy cenę za całą przeprowadzkę z wideo — z góry. Jeśli praca potrwa dłużej, to nasze ryzyko, dlatego ekipie opłaca się pracować szybko i starannie.', uk: 'За погодинної оплати повільна робота вигідна фірмі: затори, сходи й перерви оплачує клієнт, а підсумок відомий лише наприкінці. Ми називаємо ціну за весь переїзд за відео — заздалегідь. Якщо робота триватиме довше, це наш ризик, тому бригаді вигідно працювати швидко й акуратно.', en: 'With hourly billing, slow work pays off for the company: you pay for traffic, stairs and breaks, and only learn the total at the end. We quote one price for the whole move from a video — up front. If the job takes longer, that’s our risk, so the crew gains from working fast and carefully.' },
  ],
  [
    { ru: 'Как снять видео для оценки?', pl: 'Jak nagrać wideo do wyceny?', uk: 'Як зняти відео для оцінки?', en: 'How do I film the video for a quote?' },
    { ru: 'Пройдите с телефоном по каждой комнате 30–60 секунд, откройте шкафы и антресоль, покажите подъезд и лестницу. Загрузите видео в форме заявки или отправьте в WhatsApp.', pl: 'Przejdź z telefonem przez każdy pokój przez 30–60 sekund, otwórz szafy i antresole, pokaż klatkę schodową i schody. Wgraj wideo w formularzu zapytania albo wyślij na WhatsApp.', uk: 'Пройдіть із телефоном кожною кімнатою 30–60 секунд, відкрийте шафи й антресолі, покажіть під’їзд і сходи. Завантажте відео у формі заявки або надішліть у WhatsApp.', en: 'Walk through each room with your phone for 30–60 seconds, open wardrobes and top cupboards, and show the stairwell and stairs. Upload the video in the quote form or send it on WhatsApp.' },
  ],
  [
    { ru: 'Какой нужен задаток?', pl: 'Jaki jest zadatek?', uk: 'Який потрібен завдаток?', en: 'How much is the deposit?' },
    { ru: 'Задаток закрепляет дату за вами. Размер и условия указаны в оферте — пока утверждаем их окончательно.', pl: 'Zadatek rezerwuje dla Ciebie termin. Wysokość i warunki podajemy w ofercie — właśnie je ostatecznie zatwierdzamy.', uk: 'Завдаток закріплює дату за вами. Розмір і умови вказані в оферті — зараз затверджуємо їх остаточно.', en: 'The deposit secures your date. The amount and terms are in the offer — we are finalising them now.' },
  ],
  [
    { ru: 'Вы выставляете фактуру?', pl: 'Wystawiacie fakturę?', uk: 'Ви виставляєте фактуру?', en: 'Do you issue invoices?' },
    { ru: 'Да, фактура VAT для частных клиентов и фирм. Для фирм укажите NIP в заявке — данные подтянутся автоматически.', pl: 'Tak, fakturę VAT dla klientów prywatnych i firm. Firmy podają NIP w zapytaniu — dane uzupełnią się automatycznie.', uk: 'Так, фактуру VAT для приватних клієнтів і фірм. Для фірм укажіть NIP у заявці — дані підтягнуться автоматично.', en: 'Yes, a VAT invoice for private clients and companies. Companies just enter their NIP in the form — the details fill in automatically.' },
  ],
  [
    { ru: 'Как можно оплатить?', pl: 'Jak można zapłacić?', uk: 'Як можна оплатити?', en: 'How can I pay?' },
    { ru: 'BLIK, карта (в том числе у бригады на месте), Przelewy24 или перевод.', pl: 'BLIK, kartą (także u ekipy na miejscu), Przelewy24 lub przelewem.', uk: 'BLIK, карткою (зокрема в бригади на місці), Przelewy24 або переказом.', en: 'BLIK, card (including with the crew on site), Przelewy24 or bank transfer.' },
  ],
  [
    { ru: 'Вы работаете в выходные?', pl: 'Pracujecie w weekendy?', uk: 'Ви працюєте у вихідні?', en: 'Do you work at weekends?' },
    { ru: 'Да, 7 дней в неделю. Офисы часто перевозим ночью и в выходные, чтобы не останавливать работу.', pl: 'Tak, 7 dni w tygodniu. Biura często przenosimy nocą i w weekendy, żeby nie przerywać pracy.', uk: 'Так, 7 днів на тиждень. Офіси часто перевозимо вночі та у вихідні, щоб не зупиняти роботу.', en: 'Yes, 7 days a week. We often move offices at night and at weekends so work doesn’t stop.' },
  ],
  [
    { ru: 'Что если что-то повредят?', pl: 'Co jeśli coś zostanie uszkodzone?', uk: 'Що, як щось пошкодять?', en: 'What if something gets damaged?' },
    { ru: 'Мы защищаем мебель и дом плёнкой, одеялами и накладками. Если повреждение всё же случилось — оформляем рекламацию по процедуре из регламента.', pl: 'Chronimy meble i dom folią, kocami i osłonami. Jeśli mimo to dojdzie do uszkodzenia — przyjmujemy reklamację zgodnie z procedurą z regulaminu.', uk: 'Ми захищаємо меблі й дім плівкою, ковдрами та накладками. Якщо пошкодження все ж сталося — оформлюємо рекламацію за процедурою з регламенту.', en: 'We protect furniture and your home with film, blankets and guards. If damage does happen, we handle it through the complaints procedure in our terms.' },
  ],
  [
    { ru: 'Можно ли заказать только коробки?', pl: 'Czy można zamówić same kartony?', uk: 'Чи можна замовити лише коробки?', en: 'Can I order just boxes?' },
    { ru: 'Да, привезём белые коробки MELBUS, скотч и плёнку за несколько дней до переезда.', pl: 'Tak, przywieziemy białe kartony MELBUS, taśmę i folię kilka dni przed przeprowadzką.', uk: 'Так, привеземо білі коробки MELBUS, скотч і плівку за кілька днів до переїзду.', en: 'Yes, we’ll deliver white MELBUS boxes, tape and film a few days before your move.' },
  ],
];

export const faqFor = (locale: Locale): [string, string][] => faqHome.map(([q, a]) => [q[locale], a[locale]]);
