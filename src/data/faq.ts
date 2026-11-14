/** Частые вопросы — каждый вопрос и ответ сразу на 4 языках. */
import type { L } from '../i18n/text';
import type { Locale } from '../i18n/routes';

export const faqHome: [L, L][] = [
  [
    { ru: 'Почему цена не изменится в день переезда?', pl: 'Dlaczego cena nie zmieni się w dniu przeprowadzki?', uk: 'Чому ціна не зміниться в день переїзду?', en: 'Why won’t the price change on moving day?' },
    { ru: 'Мы считаем цену по видео вашей квартиры и списку вещей. Если работа займёт больше времени, чем мы рассчитали, — это наш риск. Цена может измениться, только если вещей заметно больше, чем на видео, или поменялся адрес, — и только с вашего согласия до начала работ.', pl: 'Wyceniamy przeprowadzkę na podstawie wideo mieszkania i listy rzeczy. Jeśli praca zajmie więcej czasu, niż zakładaliśmy, to nasze ryzyko. Cena może się zmienić tylko wtedy, gdy rzeczy jest wyraźnie więcej niż na wideo albo zmienił się adres — i tylko za Twoją zgodą przed rozpoczęciem pracy.', uk: 'Ми рахуємо ціну за відео вашої квартири та списком речей. Якщо робота займе більше часу, ніж ми розрахували, — це наш ризик. Ціна може змінитися, лише якщо речей помітно більше, ніж на відео, або змінилася адреса, і лише з вашої згоди до початку робіт.', en: 'We price your move from a video of your flat and a list of items. If the job takes longer than we planned, that’s our risk. The price can only change if there are noticeably more items than in the video or the address changes — and only with your consent before work begins.' },
  ],
  [
    { ru: 'Почему у вас нет почасовой оплаты?', pl: 'Dlaczego nie liczycie za godzinę?', uk: 'Чому у вас немає погодинної оплати?', en: 'Why don’t you charge by the hour?' },
    { ru: 'При почасовой оплате медленная работа выгодна фирме: пробки, лестницы и перерывы оплачивает клиент, а итог известен только в конце. Мы заранее называем цену за весь переезд — по видео. Если работа продлится дольше, это наш риск, поэтому бригаде выгодно работать быстро и аккуратно.', pl: 'Przy stawce godzinowej powolna praca opłaca się firmie: za korki, schody i przerwy płaci klient, a ile zapłaci, dowiaduje się dopiero na końcu. My z góry podajemy cenę za całą przeprowadzkę — na podstawie wideo. Jeśli praca potrwa dłużej, to nasze ryzyko, dlatego ekipie opłaca się pracować szybko i starannie.', uk: 'За погодинної оплати повільна робота вигідна фірмі: затори, сходи й перерви оплачує клієнт, а підсумок відомий лише наприкінці. Ми заздалегідь називаємо ціну всього переїзду — за відео. Якщо робота триватиме довше, це наш ризик, тому бригаді вигідно працювати швидко й акуратно.', en: 'With hourly billing, slow work pays off for the company: you pay for traffic, stairs and breaks, and only learn the total at the end. We quote one price for the whole move up front, based on a video. If the job takes longer, that’s our risk, so it pays for the crew to work fast and carefully.' },
  ],
  [
    { ru: 'Как снять видео для оценки?', pl: 'Jak nagrać wideo do wyceny?', uk: 'Як зняти відео для оцінки?', en: 'How do I film the video for a quote?' },
    { ru: 'Снимите на телефон каждую комнату (30–60 секунд), откройте шкафы и антресоли, покажите подъезд и лестницу. Загрузите видео в форме заявки или отправьте его в WhatsApp.', pl: 'Nagraj telefonem każdy pokój (30–60 sekund), otwórz szafy i antresole, pokaż wejście do budynku i klatkę schodową. Wgraj wideo przez formularz zapytania albo wyślij je na WhatsApp.', uk: 'Зніміть на телефон кожну кімнату (30–60 секунд), відкрийте шафи й антресолі, покажіть під’їзд і сходи. Завантажте відео у формі заявки або надішліть його у WhatsApp.', en: 'Film each room on your phone for 30–60 seconds, open the wardrobes and top cupboards, and show the entrance and stairs. Upload the video through the quote form or send it on WhatsApp.' },
  ],
  [
    { ru: 'Какой нужен задаток?', pl: 'Jaki zadatek trzeba wpłacić?', uk: 'Який потрібен завдаток?', en: 'How much is the deposit?' },
    { ru: 'Задаток закрепляет за вами дату переезда. Размер и условия будут в оферте — сейчас мы их окончательно утверждаем.', pl: 'Zadatek rezerwuje dla Ciebie termin przeprowadzki. Wysokość i warunki znajdziesz w ofercie — właśnie je ostatecznie ustalamy.', uk: 'Завдаток закріплює за вами дату переїзду. Розмір і умови будуть в оферті — зараз ми їх остаточно затверджуємо.', en: 'The deposit secures your moving date. The amount and terms will be in your offer — we are finalising them now.' },
  ],
  [
    { ru: 'Вы выставляете фактуру?', pl: 'Wystawiacie fakturę?', uk: 'Ви виставляєте фактуру?', en: 'Do you issue invoices?' },
    { ru: 'Да, выставляем фактуру VAT и частным клиентам, и фирмам. Если нужна фактура на фирму, отметьте это в заявке.', pl: 'Tak, wystawiamy faktury VAT klientom prywatnym i firmom. Jeśli potrzebujesz faktury na firmę, zaznacz to w zapytaniu.', uk: 'Так, виставляємо фактуру VAT і приватним клієнтам, і фірмам. Якщо потрібна фактура на фірму, позначте це в заявці.', en: 'Yes, we issue VAT invoices to private clients and companies. If you need a company invoice, just tick the box in the form.' },
  ],
  [
    { ru: 'Как можно оплатить?', pl: 'Jak można zapłacić?', uk: 'Як можна оплатити?', en: 'How can I pay?' },
    { ru: 'BLIK, картой или наличными — у бригады есть платёжный терминал. Задаток можно внести онлайн через BLIK или картой.', pl: 'BLIK-iem, kartą lub gotówką — ekipa ma terminal płatniczy. Zadatek możesz wpłacić online BLIK-iem lub kartą.', uk: 'BLIK, карткою або готівкою — у бригади є платіжний термінал. Завдаток можна внести онлайн через BLIK або карткою.', en: 'BLIK, card or cash — the crew carries a card terminal. You can pay the deposit online with BLIK or a card.' },
  ],
  [
    { ru: 'Вы работаете в выходные?', pl: 'Pracujecie w weekendy?', uk: 'Ви працюєте у вихідні?', en: 'Do you work at weekends?' },
    { ru: 'Да, 7 дней в неделю. Офис можем перевезти ночью или в выходные, чтобы не останавливать работу.', pl: 'Tak, 7 dni w tygodniu. Biuro możemy przenieść nocą lub w weekend, żeby nie przerywać pracy.', uk: 'Так, 7 днів на тиждень. Офіс можемо перевезти вночі або у вихідні, щоб не зупиняти роботу.', en: 'Yes, 7 days a week. We can move an office at night or at the weekend, so work doesn’t stop.' },
  ],
  [
    { ru: 'Что, если что-то повредят?', pl: 'Co, jeśli coś zostanie uszkodzone?', uk: 'Що, як щось пошкодять?', en: 'What if something gets damaged?' },
    { ru: 'Мебель, полы и дверные проёмы защищаем плёнкой, одеялами и накладками. Если что-то всё же повредили, принимаем рекламацию в порядке, описанном в регламенте.', pl: 'Meble, podłogi i futryny chronimy folią, kocami i osłonami. Jeśli mimo to dojdzie do uszkodzenia, przyjmujemy reklamację zgodnie z regulaminem.', uk: 'Меблі, підлогу й дверні прорізи захищаємо плівкою, ковдрами та накладками. Якщо щось усе ж пошкодили, приймаємо рекламацію в порядку, описаному в регламенті.', en: 'We protect furniture, floors and door frames with stretch wrap, blankets and guards. If something does get damaged, we handle it through the complaints procedure in our terms of service.' },
  ],
  [
    { ru: 'Можно ли заказать только коробки?', pl: 'Czy można zamówić same kartony?', uk: 'Чи можна замовити лише коробки?', en: 'Can I order just boxes?' },
    { ru: 'Да, привезём белые коробки MELBUS, скотч и плёнку за несколько дней до переезда.', pl: 'Tak, przywieziemy białe kartony MELBUS, taśmę i folię kilka dni przed przeprowadzką.', uk: 'Так, привеземо білі коробки MELBUS, скотч і плівку за кілька днів до переїзду.', en: 'Yes, we’ll deliver white MELBUS boxes, tape and stretch wrap a few days before your move.' },
  ],
];

export const faqFor = (locale: Locale): [string, string][] => faqHome.map(([q, a]) => [q[locale], a[locale]]);
