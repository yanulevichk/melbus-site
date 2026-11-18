/**
 * ВНУТРЕННИЕ СТРАНИЦЫ — заголовки для поиска (meta) и содержание, каждая фраза сразу на 4 языках.
 * Меняем фразу — меняем её на всех языках. Тип L требует все 4 языка.
 */
import type { L } from '../i18n/text';
import { brand } from '../config/brand';

const l = (ru: string, pl: string, uk: string, en: string): L => ({ ru, pl, uk, en });
const y = brand.facts.years;

/** icons — 3D-иконки к пунктам (public/img/icons/<имя>.webp), по одной на пункт */
export interface LBlock { type: 'list' | 'text' | 'faq' | 'cards'; eyebrow?: L; title: L; lead?: L; items?: [L, L][]; icons?: string[] }
export interface LMedia { video: string; poster: string; alt: L; caption?: L; square?: boolean }
export interface LPage { eyebrow: L; title: L; lead?: L; media?: LMedia; blocks?: LBlock[] }

/** title и description для поиска и превью ссылок; nav — какой пункт меню подсветить */
export const meta: Record<string, { title: L; description: L; nav?: string }> = {
  home: {
    title: l('переезды в Варшаве с фиксированной ценой', 'przeprowadzki w Warszawie ze stałą ceną', 'переїзди у Варшаві з фіксованою ціною', 'moving in Warsaw at a fixed price'),
    description: l('Переезды квартир, домов и офисов по Варшаве, Польше и ЕС. Фиксированная цена по видео, без доплат. Фактура VAT, BLIK, карта или наличные, 7 дней в неделю.', 'Przeprowadzki mieszkań, domów i biur w Warszawie, w Polsce i w UE. Stała cena na podstawie wideo, bez dopłat. Faktura VAT, BLIK, karta lub gotówka, 7 dni w tygodniu.', 'Переїзди квартир, будинків і офісів у Варшаві, Польщі та ЄС. Фіксована ціна за відео, без доплат. Фактура VAT, BLIK, картка або готівка, 7 днів на тиждень.', 'Flat, house and office moves in Warsaw, across Poland and the EU. A fixed price from a video, with no extra fees. VAT invoice, BLIK, card or cash, 7 days a week.'),
  },
  services: {
    title: l('Услуги', 'Usługi', 'Послуги', 'Services'),
    description: l('Переезды квартир, домов и офисов, перевозка и сборка мебели, упаковка и коробки, вывоз старой мебели, уборка.', 'Przeprowadzki mieszkań, domów i biur, transport mebli, pakowanie i kartony, montaż mebli, wywóz starych mebli i sprzątanie.', 'Переїзди квартир, будинків і офісів, перевезення та збирання меблів, пакування й коробки, вивезення старих меблів, прибирання.', 'Flat, house and office moves, furniture transport and assembly, packing and boxes, old furniture removal and cleaning.'),
    nav: 'services',
  },
  pricing: {
    title: l('Цены и расчёт переезда', 'Cennik i wycena przeprowadzki', 'Ціни й розрахунок переїзду', 'Moving prices and quote'),
    description: l('Отметьте вещи или пришлите видео — цена за весь переезд сразу, и она не изменится. Грузотакси, перевозка, под ключ.', 'Zaznacz rzeczy albo wyślij wideo — od razu cena za całą przeprowadzkę, która się nie zmieni. Taxi bagażowe, transport, pod klucz.', 'Позначте речі або надішліть відео — ціна за весь переїзд одразу, і вона не зміниться. Вантажне таксі, перевезення, під ключ.', 'Pick your things or send a video and get a price for the whole move right away — one that won’t change. Van and driver, transport, full service.'),
    nav: 'pricing',
  },
  how: {
    title: l('Как мы работаем', 'Jak pracujemy', 'Як ми працюємо', 'How we work'),
    description: l('Шаги переезда и стандарты бригады MELBUS: перчатки, бахилы, защита дома, порядок в коробках.', 'Etapy przeprowadzki i standardy ekipy MELBUS: rękawice, ochraniacze na buty, ochrona domu, porządek w kartonach.', 'Кроки переїзду та стандарти бригади MELBUS: рукавички, бахіли, захист дому, порядок у коробках.', 'The steps of a MELBUS move and our crew standards: gloves, shoe covers, home protection, neatly labelled boxes.'),
    nav: 'how',
  },
  faq: {
    title: l('Вопросы и ответы', 'Pytania i odpowiedzi', 'Питання й відповіді', 'Questions and answers'),
    description: l('Ответы на частые вопросы о переезде с MELBUS.', 'Odpowiedzi na najczęstsze pytania o przeprowadzkę z MELBUS.', 'Відповіді на часті питання про переїзд із MELBUS.', 'Answers to common questions about moving with MELBUS.'),
  },
  contact: {
    title: l('Контакты', 'Kontakt', 'Контакти', 'Contact'),
    description: l('Телефон, WhatsApp, Telegram и email MELBUS.', 'Telefon, WhatsApp, Telegram i e-mail MELBUS.', 'Телефон, WhatsApp, Telegram і email MELBUS.', 'Contact MELBUS by phone, WhatsApp, Telegram or email.'),
    nav: 'contact',
  },
  terms: {
    title: l('Регламент', 'Regulamin', 'Регламент', 'Terms of service'),
    description: l('Регламент оказания услуг MELBUS.', 'Regulamin świadczenia usług MELBUS.', 'Регламент надання послуг MELBUS.', 'MELBUS terms of service.'),
  },
  privacy: {
    title: l('Политика конфиденциальности', 'Polityka prywatności', 'Політика конфіденційності', 'Privacy policy'),
    description: l('Как MELBUS обрабатывает персональные данные.', 'Jak MELBUS przetwarza dane osobowe.', 'Як MELBUS обробляє персональні дані.', 'How MELBUS processes personal data.'),
  },
  cookies: {
    title: l('Cookies', 'Cookies', 'Cookies', 'Cookies'),
    description: l('Политика cookies MELBUS.', 'Polityka cookies MELBUS.', 'Політика cookies MELBUS.', 'MELBUS cookie policy.'),
  },
  complaints: {
    title: l('Рекламации', 'Reklamacje', 'Рекламації', 'Complaints'),
    description: l('Как подать рекламацию в MELBUS.', 'Jak złożyć reklamację w MELBUS.', 'Як подати рекламацію в MELBUS.', 'How to file a complaint with MELBUS.'),
  },
};
meta.lux = meta.home;

export const pages: Record<string, LPage> = {
  // 18.11.2026: «Гарантия цены» и «О нас» влиты в «Как мы работаем» (меньше страниц); старые адреса → 301 (public/_redirects)

  how: {
    eyebrow: l('Как мы работаем', 'Jak pracujemy', 'Як ми працюємо', 'How we work'),
    title: l('Переезд,<br>как по чек-листу', 'Przeprowadzka<br>punkt po punkcie', 'Переїзд,<br>як за чек-листом', 'A move that runs<br>like clockwork'),
    lead: l('Шесть шагов от видео до последней полки и стандарты, которые бригада соблюдает в каждом доме.', 'Sześć kroków od wideo po ostatnią półkę i standardy, których ekipa przestrzega w każdym domu.', 'Шість кроків від відео до останньої полиці та стандарти, яких бригада дотримується в кожному домі.', 'Six steps from the video to the last shelf, and the standards our crew follows in every home.'),
    media: { video: '/video/film-1280.mp4', poster: '/scenes/film/poster-d.webp',
      alt: l('Фильм MELBUS: вся квартира складывается в одну коробку и переезжает в новый дом', 'Film MELBUS: całe mieszkanie trafia do jednego kartonu i jedzie do nowego domu', 'Фільм MELBUS: уся квартира складається в одну коробку й переїжджає в новий дім', 'MELBUS film: the whole flat packs into one box and moves to a new home'),
      caption: l('Переезд от первого кадра до последней полки — за 23 секунды.', 'Przeprowadzka od pierwszego kadru po ostatnią półkę — w 23 sekundy.', 'Переїзд від першого кадру до останньої полиці — за 23 секунди.', 'A move from the first frame to the last shelf — in 23 seconds.') },
    blocks: [
      { type: 'list', icons: ['phone', 'tag', 'calendar', 'box', 'pin', 'keys'], eyebrow: l('Шаги', 'Kroki', 'Кроки', 'Steps'), title: l('От видео<br>до нового адреса', 'Od wideo<br>do nowego adresu', 'Від відео<br>до нової адреси', 'From a video<br>to a new address'), items: [
        [l('Видео', 'Wideo', 'Відео', 'Video'), l('Снимаете квартиру на телефон.', 'Nagrywasz mieszkanie telefonem.', 'Знімаєте квартиру на телефон.', 'You film your flat on your phone.')],
        [l('Цена', 'Cena', 'Ціна', 'Price'), l('Фиксированная цена в течение 2 часов (днём).', 'Stała cena w ciągu 2 godzin (w dzień).', 'Фіксована ціна протягом 2 годин (удень).', 'A fixed price within 2 hours (daytime).')],
        [l('Бронь', 'Rezerwacja', 'Бронювання', 'Booking'), l('Задаток — BLIK или картой.', 'Zadatek BLIK-iem lub kartą.', 'Завдаток — BLIK або карткою.', 'A deposit by BLIK or card.')],
        [l('Упаковка', 'Pakowanie', 'Пакування', 'Packing'), l('Бригада пакует по комнатам.', 'Ekipa pakuje pokój po pokoju.', 'Бригада пакує по кімнатах.', 'The crew packs room by room.')],
        [l('Дорога', 'Droga', 'Дорога', 'On the road'), l('В бусе только ваши вещи.', 'W busie tylko Twoje rzeczy.', 'У бусі лише ваші речі.', 'Only your things in the van.')],
        [l('Новый дом', 'Nowy dom', 'Новий дім', 'New home'), l('Заносим, собираем, расставляем.', 'Wnosimy, składamy, ustawiamy.', 'Заносимо, збираємо, розставляємо.', 'We carry in, assemble and arrange.')],
      ] },
      { type: 'list', eyebrow: l('Как это работает', 'Jak to działa', 'Як це працює', 'How it works'), title: l('Риск —<br>на нашей стороне', 'Ryzyko<br>bierzemy na siebie', 'Ризик —<br>на нашому боці', 'The risk<br>is on us'), items: [
        [l('Цена фиксируется по видео', 'Cenę ustalamy na podstawie wideo', 'Ціна фіксується за відео', 'The price is fixed from a video'), l('Мы видим вещи, этажи и подъезд заранее, поэтому считаем точно.', 'Rzeczy, piętra i klatkę schodową widzimy z góry, więc liczymy dokładnie.', 'Ми бачимо речі, поверхи й під’їзд заздалегідь, тому рахуємо точно.', 'We see the items, floors and stairwell in advance, so we price accurately.')],
        [l('Работа затянулась — не ваша проблема', 'Trwa dłużej? To nie Twój problem', 'Робота затяглася — не ваша проблема', 'Taking longer isn’t your problem'), l('Пробки, тяжёлый шкаф, узкая лестница, которую вы показали на видео, — всё это уже в цене.', 'Korki, ciężka szafa, wąskie schody widoczne na wideo — to wszystko jest już w cenie.', 'Затори, важка шафа, вузькі сходи, які ви показали на відео, — усе це вже в ціні.', 'Traffic, a heavy wardrobe, narrow stairs you showed us on video — it’s all already in the price.')],
        [l('Изменения — только с вашего согласия', 'Zmiany — tylko za Twoją zgodą', 'Зміни — лише з вашої згоди', 'Changes only with your consent'), l('Если вещей заметно больше или изменился адрес, бригадир оформляет изменение в приложении. Вы принимаете его до начала работ.', 'Jeśli rzeczy jest wyraźnie więcej albo zmienił się adres, brygadzista zgłasza zmianę w aplikacji. Akceptujesz ją przed rozpoczęciem pracy.', 'Якщо речей помітно більше або змінилася адреса, бригадир оформлює зміну в застосунку. Ви приймаєте її до початку робіт.', 'If there are noticeably more items or the address changes, the crew leader logs the change in the app. You accept it before work begins.')],
        [l('Мелочи бесплатно', 'Drobiazgi gratis', 'Дрібниці безкоштовно', 'Small extras are free'), l('До 5 коробок или один небольшой предмет сверх списка — без доплаты.', 'Do 5 kartonów albo jeden mały przedmiot spoza listy — bez dopłaty.', 'До 5 коробок або один невеликий предмет поза списком — без доплати.', 'Up to 5 boxes or one small item not on the list — at no extra cost.')],
      ] },
      { type: 'cards', eyebrow: l('Дополнительно', 'Dodatkowo', 'Додатково', 'Plus'), title: l('Ещё три гарантии', 'Jeszcze trzy gwarancje', 'Ще три гарантії', 'Three more guarantees'), items: [
        [l('Пунктуальность', 'Punktualność', 'Пунктуальність', 'Punctuality'), l('Окно прибытия — 30 минут. Опоздаем по своей вине — скидка 100 zł за каждые 30 минут опоздания.', 'Okno przyjazdu — 30 minut. Jeśli spóźnimy się z naszej winy, dostaniesz 100 zł rabatu za każde 30 minut spóźnienia.', 'Вікно прибуття — 30 хвилин. Запізнимося з нашої вини — знижка 100 zł за кожні 30 хвилин запізнення.', 'A 30-minute arrival window. If we’re late through our own fault, you get 100 zł off for every 30 minutes of delay.')],
        [l('Сохранность', 'Bezpieczeństwo mienia', 'Схоронність', 'Careful handling'), l('Защищаем дом и мебель. Повреждения — по процедуре рекламации.', 'Chronimy dom i meble. Uszkodzenia — zgodnie z procedurą reklamacyjną.', 'Захищаємо дім і меблі. Пошкодження — за процедурою рекламації.', 'We protect your home and furniture. Any damage is handled under the complaints procedure.')],
        [l('Фактура', 'Faktura', 'Фактура', 'Invoice'), l('Всегда выставляем фактуру VAT.', 'Zawsze wystawiamy fakturę VAT.', 'Завжди виставляємо фактуру VAT.', 'We always issue a VAT invoice.')],
      ] },
      { type: 'cards', eyebrow: l('Стандарты бригады', 'Standardy ekipy', 'Стандарти бригади', 'Crew standards'), title: l('Что вы увидите<br>в своём доме', 'Co zobaczysz<br>w swoim domu', 'Що ви побачите<br>у своєму домі', 'What you’ll see<br>in your home'), items: [
        [l('Бахилы и перчатки', 'Ochraniacze na buty i rękawice', 'Бахіли й рукавички', 'Shoe covers and gloves'), l('Надеваем до входа в квартиру.', 'Zakładamy przed wejściem do mieszkania.', 'Вдягаємо до входу в квартиру.', 'We put them on before entering your flat.')],
        [l('Защита пола и косяков', 'Ochrona podłóg i futryn', 'Захист підлоги й одвірків', 'Floor and door frame protection'), l('Дорожки и накладки до начала работ.', 'Chodniki i osłony przed rozpoczęciem pracy.', 'Доріжки й накладки до початку робіт.', 'Runners and guards in place before work starts.')],
        [l('Белые коробки MELBUS', 'Białe kartony MELBUS', 'Білі коробки MELBUS', 'White MELBUS boxes'), l('Наклейки с названием комнаты и QR-код со списком вещей.', 'Naklejki z nazwą pokoju i kod QR z listą rzeczy.', 'Наліпки з назвою кімнати і QR-код зі списком речей.', 'Room labels and a QR code listing what’s inside.')],
      ] },
      { type: 'text', eyebrow: l('Почему мы', 'Dlaczego my', 'Чому ми', 'Why us'), title: l('Дисциплина курьерской службы<br>в каждом переезде', 'Dyscyplina firmy kurierskiej<br>w każdej przeprowadzce', 'Дисципліна кур’єрської служби<br>у кожному переїзді', 'Courier discipline<br>in every move'), items: [
        [l('Точно в срок', 'Punktualnie', 'Точно вчасно', 'Right on time'), l('Больше пяти лет мы работаем в доставке, где всё решают минуты. Опаздывать — не в наших правилах.', 'Od ponad pięciu lat pracujemy w dostawach, gdzie liczy się każda minuta. Spóźnianie się nie leży w naszej naturze.', 'Понад п’ять років ми працюємо в доставці, де все вирішують хвилини. Запізнюватися — не в наших правилах.', 'For over five years we’ve worked in delivery, where every minute counts. Being late isn’t in our nature.')],
        [l('Свой парк', 'Własna flota', 'Власний парк', 'Our own fleet'), l('Бусы наши, а не арендованные «по звонку».', 'Busy są nasze, a nie wynajmowane „na telefon”.', 'Буси наші, а не орендовані «за дзвінком».', 'The vans are ours, not hired at the last minute.')],
        [l('Честно о новом', 'Szczerze o nowej usłudze', 'Чесно про нове', 'Honest about being new'), l('Переезды — наше новое направление. Поэтому мы так стараемся на каждом заказе.', 'Przeprowadzki to nasza nowa usługa. Dlatego tak bardzo staramy się przy każdym zleceniu.', 'Переїзди — наш новий напрям. Тому ми так стараємося на кожному замовленні.', 'Moving is a new service for us. That’s why we put so much into every job.')],
      ] },
    ],
  },


  faq: {
    eyebrow: l('Вопросы', 'Pytania', 'Питання', 'Questions'),
    title: l('Вопросы<br>и ответы', 'Pytania<br>i odpowiedzi', 'Питання<br>й відповіді', 'Questions<br>and answers'),
  },

  contact: {
    eyebrow: l('Контакты', 'Kontakt', 'Контакти', 'Contact'),
    title: l('Напишите —<br>ответим быстро', 'Napisz —<br>odpowiemy szybko', 'Напишіть —<br>відповімо швидко', 'Message us —<br>we’ll reply fast'),
    lead: l('Работаем 7 дней в неделю. Варшава и 150 км вокруг.', 'Pracujemy 7 dni w tygodniu. Warszawa i okolice do 150 km.', 'Працюємо 7 днів на тиждень. Варшава і 150 км довкола.', 'We work 7 days a week, within 150 km of Warsaw.'),
  },
};

export const misc = {
  faqTitle: l('Частые вопросы', 'Najczęstsze pytania', 'Часті питання', 'Frequently asked questions'),
  contactTitle: l('Как связаться', 'Jak się skontaktować', 'Як зв’язатися', 'How to reach us'),
  phone: l('Телефон', 'Telefon', 'Телефон', 'Phone'),
  email: l('Email', 'E-mail', 'Email', 'Email'),
  docs: l('Документы', 'Dokumenty', 'Документи', 'Documents'),
  legalLead: l('Документ готовим вместе с юристом. Скоро здесь появится полный текст.', 'Dokument przygotowujemy wspólnie z prawnikiem. Wkrótce pojawi się tu pełna treść.', 'Документ готуємо разом із юристом. Незабаром тут з’явиться повний текст.', 'We are preparing this document with a lawyer. The full text will appear here soon.'),
};
