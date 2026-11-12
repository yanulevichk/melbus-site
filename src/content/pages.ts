/**
 * ВНУТРЕННИЕ СТРАНИЦЫ — заголовки для поиска (meta) и содержание, каждая фраза сразу на 4 языках.
 * Меняем фразу — меняем её на всех языках. Тип L требует все 4 языка.
 */
import type { L } from '../i18n/text';
import { brand } from '../config/brand';

const l = (ru: string, pl: string, uk: string, en: string): L => ({ ru, pl, uk, en });
const y = brand.facts.years;

export interface LBlock { type: 'list' | 'text' | 'faq' | 'cards'; eyebrow?: L; title: L; lead?: L; items?: [L, L][] }
export interface LMedia { video: string; poster: string; alt: L; caption?: L; square?: boolean }
export interface LPage { eyebrow: L; title: L; lead?: L; media?: LMedia; blocks?: LBlock[] }

/** title и description для поиска и превью ссылок; nav — какой пункт меню подсветить */
export const meta: Record<string, { title: L; description: L; nav?: string }> = {
  home: {
    title: l('переезды в Варшаве с фиксированной ценой', 'przeprowadzki w Warszawie ze stałą ceną', 'переїзди у Варшаві з фіксованою ціною', 'moving in Warsaw at a fixed price'),
    description: l('Переезды квартир, домов и офисов по Варшаве, Польше и ЕС. Цена по видео без доплат, фактура VAT, BLIK и карта, 7 дней в неделю.', 'Przeprowadzki mieszkań, domów i biur w Warszawie, w Polsce i w UE. Cena z wideo bez dopłat, faktura VAT, BLIK i karta, 7 dni w tygodniu.', 'Переїзди квартир, будинків і офісів Варшавою, Польщею та ЄС. Ціна за відео без доплат, фактура VAT, BLIK і картка, 7 днів на тиждень.', 'Flat, house and office moves in Warsaw, across Poland and the EU. A price from a video with no extra fees, VAT invoice, BLIK and card, 7 days a week.'),
  },
  services: {
    title: l('Услуги', 'Usługi', 'Послуги', 'Services'),
    description: l('Переезды квартир, домов и офисов, перевозка мебели, упаковка, коробки, сборка мебели, вывоз и уборка.', 'Przeprowadzki mieszkań, domów i biur, transport mebli, pakowanie, kartony, montaż mebli, wywóz i sprzątanie.', 'Переїзди квартир, будинків і офісів, перевезення меблів, пакування, коробки, збирання меблів, вивезення й прибирання.', 'Flat, house and office moves, furniture transport, packing, boxes, furniture assembly, removal and cleaning.'),
    nav: 'services',
  },
  pricing: {
    title: l('Цены на переезд', 'Cennik przeprowadzek', 'Ціни на переїзд', 'Moving prices'),
    description: l('Пакеты и ставки MELBUS: что входит в цену и как мы её фиксируем по видео.', 'Pakiety i stawki MELBUS: co obejmuje cena i jak ustalamy ją na podstawie wideo.', 'Пакети й ставки MELBUS: що входить у ціну і як ми фіксуємо її за відео.', 'MELBUS packages and rates: what the price includes and how we fix it from a video.'),
    nav: 'pricing',
  },
  calculator: {
    title: l('Калькулятор переезда', 'Kalkulator przeprowadzki', 'Калькулятор переїзду', 'Moving cost calculator'),
    description: l('Ориентировочная цена переезда за 30 секунд.', 'Orientacyjna cena przeprowadzki w 30 sekund.', 'Орієнтовна ціна переїзду за 30 секунд.', 'An approximate moving price in 30 seconds.'),
    nav: 'pricing',
  },
  quote: {
    title: l('Заявка на переезд', 'Zapytanie o przeprowadzkę', 'Заявка на переїзд', 'Moving quote request'),
    description: l('Расскажите о переезде и пришлите видео — получите фиксированную цену.', 'Opowiedz o przeprowadzce i wyślij wideo — otrzymasz stałą cenę.', 'Розкажіть про переїзд і надішліть відео — отримайте фіксовану ціну.', 'Tell us about your move and send a video — get a fixed price.'),
  },
  guarantee: {
    title: l('Гарантия фиксированной цены', 'Gwarancja stałej ceny', 'Гарантія фіксованої ціни', 'Fixed price guarantee'),
    description: l('Цена из принятой оферты окончательная. Условия гарантии MELBUS.', 'Cena z przyjętej oferty jest ostateczna. Warunki gwarancji MELBUS.', 'Ціна з прийнятої оферти остаточна. Умови гарантії MELBUS.', 'The price in the accepted offer is final. MELBUS guarantee terms.'),
    nav: 'guarantee',
  },
  how: {
    title: l('Как мы работаем', 'Jak pracujemy', 'Як ми працюємо', 'How we work'),
    description: l('Шаги переезда и стандарты бригады MELBUS: перчатки, бахилы, защита дома, порядок в коробках.', 'Etapy przeprowadzki i standardy ekipy MELBUS: rękawice, ochraniacze na buty, ochrona domu, porządek w kartonach.', 'Кроки переїзду та стандарти бригади MELBUS: рукавички, бахіли, захист дому, порядок у коробках.', 'The steps of a move and MELBUS crew standards: gloves, shoe covers, home protection, order in every box.'),
    nav: 'how',
  },
  about: {
    title: l('О нас', 'O nas', 'Про нас', 'About us'),
    description: l(`MELBUS — ${y}+ лет в логистике и собственный парк бусов.`, `MELBUS — ponad ${y} lat w logistyce i własna flota busów.`, `MELBUS — ${y}+ років у логістиці та власний парк бусів.`, `MELBUS — ${y}+ years in logistics and our own fleet of vans.`),
    nav: 'about',
  },
  faq: {
    title: l('Вопросы и ответы', 'Pytania i odpowiedzi', 'Питання й відповіді', 'Questions and answers'),
    description: l('Ответы на частые вопросы о переезде с MELBUS.', 'Odpowiedzi na najczęstsze pytania o przeprowadzkę z MELBUS.', 'Відповіді на часті питання про переїзд із MELBUS.', 'Answers to common questions about moving with MELBUS.'),
  },
  contact: {
    title: l('Контакты', 'Kontakt', 'Контакти', 'Contact'),
    description: l('Телефон, WhatsApp, Telegram и email MELBUS.', 'Telefon, WhatsApp, Telegram i e-mail MELBUS.', 'Телефон, WhatsApp, Telegram і email MELBUS.', 'MELBUS phone, WhatsApp, Telegram and email.'),
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
  pricing: {
    eyebrow: l('Цены', 'Cennik', 'Ціни', 'Prices'),
    title: l('Честная цена<br>до переезда', 'Uczciwa cena<br>przed przeprowadzką', 'Чесна ціна<br>до переїзду', 'An honest price<br>before you move'),
    lead: l('Все цены брутто. Ставки и пакеты публикуем после анализа рынка — структура ниже на утверждении.', 'Wszystkie ceny brutto. Stawki i pakiety opublikujemy po analizie rynku — poniższa struktura jest jeszcze zatwierdzana.', 'Усі ціни брутто. Ставки й пакети опублікуємо після аналізу ринку — структура нижче на затвердженні.', 'All prices include VAT. We’ll publish rates and packages after a market review — the structure below is still being finalised.'),
    media: { video: '/video/phone.mp4', poster: '/img/site/phone.webp', square: true,
      alt: l('Рука с телефоном снимает квартиру на видео', 'Ręka z telefonem nagrywa mieszkanie', 'Рука з телефоном знімає квартиру на відео', 'A hand filming a flat on a phone'),
      caption: l('Две-три минуты видео на телефон — и мы называем окончательную цену.', 'Dwie, trzy minuty wideo z telefonu — i podajemy ostateczną cenę.', 'Дві-три хвилини відео на телефон — і ми називаємо остаточну ціну.', 'Two or three minutes of phone video — and we give you the final price.') },
    blocks: [
      { type: 'cards', eyebrow: l('Пакеты', 'Pakiety', 'Пакети', 'Packages'), title: l('Три пакета', 'Trzy pakiety', 'Три пакети', 'Three packages'), items: [
        [l('Перевозка', 'Transport', 'Перевезення', 'Transport'), l('Вы пакуете — мы перевозим, защищаем и собираем кровать.', 'Ty pakujesz — my przewozimy, zabezpieczamy i składamy łóżko.', 'Ви пакуєте — ми перевозимо, захищаємо і збираємо ліжко.', 'You pack — we move, protect and reassemble the bed.')],
        [l('Стандарт', 'Standard', 'Стандарт', 'Standard'), l('Плюс упаковка кухни и хрупкого, набор белых коробок, сборка мебели.', 'Do tego pakowanie kuchni i rzeczy delikatnych, zestaw białych kartonów, montaż mebli.', 'Плюс пакування кухні та крихкого, набір білих коробок, збирання меблів.', 'Plus packing the kitchen and fragile items, a set of white boxes, furniture assembly.')],
        [l('Под ключ', 'Pod klucz', 'Під ключ', 'Full service'), l('Плюс упаковка всей квартиры, распаковка и расстановка.', 'Do tego pakowanie całego mieszkania, rozpakowanie i ustawienie.', 'Плюс пакування всієї квартири, розпакування та розстановка.', 'Plus packing the whole flat, unpacking and arranging.')],
      ] },
      { type: 'list', eyebrow: l('Всегда включено', 'Zawsze w cenie', 'Завжди включено', 'Always included'), title: l('Без доплат<br>за мелочи', 'Bez dopłat<br>za drobiazgi', 'Без доплат<br>за дрібниці', 'No extra charges<br>for small things'), items: [
        [l('Подача буса и топливо по Варшаве', 'Dojazd busa i paliwo w Warszawie', 'Подача буса й пальне по Варшаві', 'Van arrival and fuel within Warsaw'), l('Не считаем отдельно дорогу до вас.', 'Nie liczymy osobno dojazdu do Ciebie.', 'Не рахуємо окремо дорогу до вас.', 'We don’t charge separately for getting to you.')],
        [l('Защита мебели и дома', 'Ochrona mebli i domu', 'Захист меблів і дому', 'Furniture and home protection'), l('Плёнка, одеяла, ремни, дорожки на пол, накладки на косяки.', 'Folia, koce, pasy, chodniki na podłogę, osłony na futryny.', 'Плівка, ковдри, ремені, доріжки на підлогу, накладки на одвірки.', 'Film, blankets, straps, floor runners, door frame guards.')],
        [l('Бахилы и перчатки', 'Ochraniacze na buty i rękawice', 'Бахіли й рукавички', 'Shoe covers and gloves'), l('Стандарт бригады, а не услуга за деньги.', 'Standard ekipy, a nie płatna usługa.', 'Стандарт бригади, а не платна послуга.', 'A crew standard, not a paid extra.')],
        [l('Фактура VAT', 'Faktura VAT', 'Фактура VAT', 'VAT invoice'), l('Для частных клиентов и фирм.', 'Dla klientów prywatnych i firm.', 'Для приватних клієнтів і фірм.', 'For private clients and companies.')],
      ] },
    ],
  },

  calculator: {
    eyebrow: l('Калькулятор', 'Kalkulator', 'Калькулятор', 'Calculator'),
    title: l('Сколько стоит<br>ваш переезд', 'Ile kosztuje<br>Twoja przeprowadzka', 'Скільки коштує<br>ваш переїзд', 'How much<br>will your move cost'),
    lead: l('Выберите, что и куда везём, — табло покажет ориентир. Точную цену назовём по видео.', 'Wybierz, co i dokąd wieziemy — tablica pokaże orientacyjną cenę. Dokładną podamy na podstawie wideo.', 'Оберіть, що й куди веземо, — табло покаже орієнтир. Точну ціну назвемо за відео.', 'Choose what we’re moving and where — the board shows a ballpark. We’ll give you the exact price from a video.'),
  },

  guarantee: {
    eyebrow: l('Гарантия', 'Gwarancja', 'Гарантія', 'Guarantee'),
    title: l('Цена, которую<br>вы приняли, —<br>окончательная', 'Cena, którą<br>przyjmujesz,<br>jest ostateczna', 'Ціна, яку<br>ви прийняли, —<br>остаточна', 'The price<br>you accept<br>is final'),
    lead: l('Главное обещание MELBUS. Ниже — честные условия, при которых оно работает.', 'Najważniejsza obietnica MELBUS. Poniżej uczciwe warunki, na jakich działa.', 'Головна обіцянка MELBUS. Нижче — чесні умови, за яких вона працює.', 'MELBUS’s main promise. Below are the honest terms that make it work.'),
    media: { video: '/video/tape.mp4', poster: '/img/site/tape.webp',
      alt: l('Бирюзовый скотч запечатывает белую коробку MELBUS', 'Turkusowa taśma zakleja biały karton MELBUS', 'Бірюзовий скотч запечатує білу коробку MELBUS', 'Turquoise tape seals a white MELBUS box'),
      caption: l('Цену запечатываем, как коробку: что приняли в оферте — то и платите.', 'Cenę zaklejamy jak karton: płacisz tyle, ile przyjąłeś w ofercie.', 'Ціну запечатуємо, як коробку: що прийняли в оферті — те й платите.', 'We seal the price like a box: you pay what you accepted in the offer.') },
    blocks: [
      { type: 'list', eyebrow: l('Как это работает', 'Jak to działa', 'Як це працює', 'How it works'), title: l('Риск —<br>на нашей стороне', 'Ryzyko<br>bierzemy na siebie', 'Ризик —<br>на нашому боці', 'The risk<br>is on us'), items: [
        [l('Цена фиксируется по видео', 'Cenę ustalamy z wideo', 'Ціна фіксується за відео', 'The price is fixed from a video'), l('Мы видим вещи, этажи и подъезд заранее, поэтому считаем точно.', 'Widzimy rzeczy, piętra i klatkę schodową z wyprzedzeniem, więc liczymy dokładnie.', 'Ми бачимо речі, поверхи й під’їзд заздалегідь, тому рахуємо точно.', 'We see the items, floors and stairwell in advance, so we price accurately.')],
        [l('Дольше по времени — не ваша проблема', 'Dłużej trwa — to nie Twój problem', 'Довше за часом — не ваша проблема', 'Taking longer isn’t your problem'), l('Пробки, тяжёлый шкаф, узкая лестница с видео — уже в цене.', 'Korki, ciężka szafa, wąskie schody z wideo — już są w cenie.', 'Затори, важка шафа, вузькі сходи з відео — уже в ціні.', 'Traffic, a heavy wardrobe, narrow stairs seen on the video — all already in the price.')],
        [l('Изменения — только с вашего согласия', 'Zmiany — tylko za Twoją zgodą', 'Зміни — лише з вашої згоди', 'Changes only with your consent'), l('Если вещей заметно больше или изменился адрес, бригадир оформляет изменение в приложении. Вы принимаете его до начала работ.', 'Jeśli rzeczy jest wyraźnie więcej albo zmienił się adres, brygadzista zgłasza zmianę w aplikacji. Akceptujesz ją przed rozpoczęciem pracy.', 'Якщо речей помітно більше або змінилася адреса, бригадир оформлює зміну в застосунку. Ви приймаєте її до початку робіт.', 'If there are noticeably more items or the address changes, the crew leader logs the change in the app. You accept it before work begins.')],
        [l('Мелочи бесплатно', 'Drobiazgi gratis', 'Дрібниці безкоштовно', 'Small extras are free'), l('До 5 коробок или один небольшой предмет сверх списка — без доплаты.', 'Do 5 kartonów lub jeden mały przedmiot ponad listę — bez dopłaty.', 'До 5 коробок або один невеликий предмет понад список — без доплати.', 'Up to 5 boxes or one small item beyond the list — at no extra cost.')],
      ] },
      { type: 'cards', eyebrow: l('Дополнительно', 'Dodatkowo', 'Додатково', 'Also'), title: l('Ещё две гарантии', 'Jeszcze dwie gwarancje', 'Ще дві гарантії', 'Two more guarantees'), items: [
        [l('Пунктуальность', 'Punktualność', 'Пунктуальність', 'Punctuality'), l('Окно прибытия 30 минут. Опоздали по своей вине — скидка за каждые 30 минут.', 'Okno przyjazdu 30 minut. Spóźnimy się z naszej winy — rabat za każde 30 minut.', 'Вікно прибуття 30 хвилин. Запізнилися з нашої вини — знижка за кожні 30 хвилин.', 'A 30-minute arrival window. Late through our fault — a discount for every 30 minutes.')],
        [l('Сохранность', 'Bezpieczeństwo mienia', 'Збереження', 'Safekeeping'), l('Защищаем дом и мебель. Повреждения — по процедуре рекламации.', 'Chronimy dom i meble. Uszkodzenia — zgodnie z procedurą reklamacyjną.', 'Захищаємо дім і меблі. Пошкодження — за процедурою рекламації.', 'We protect your home and furniture. Any damage is handled under the complaints procedure.')],
        [l('Фактура', 'Faktura', 'Фактура', 'Invoice'), l('Всегда выставляем фактуру VAT.', 'Zawsze wystawiamy fakturę VAT.', 'Завжди виставляємо фактуру VAT.', 'We always issue a VAT invoice.')],
      ] },
    ],
  },

  how: {
    eyebrow: l('Как мы работаем', 'Jak pracujemy', 'Як ми працюємо', 'How we work'),
    title: l('Переезд,<br>как по чек-листу', 'Przeprowadzka<br>jak z checklisty', 'Переїзд,<br>як за чек-листом', 'A move that runs<br>like a checklist'),
    lead: l('Шесть шагов от видео до последней полки и стандарты, которые бригада соблюдает в каждом доме.', 'Sześć kroków od wideo po ostatnią półkę i standardy, których ekipa przestrzega w każdym domu.', 'Шість кроків від відео до останньої полиці та стандарти, яких бригада дотримується в кожному домі.', 'Six steps from the video to the last shelf, and the standards our crew keeps in every home.'),
    media: { video: '/video/film-1280.mp4', poster: '/scenes/film/poster-d.webp',
      alt: l('Фильм MELBUS: вся квартира складывается в одну коробку и переезжает в новый дом', 'Film MELBUS: całe mieszkanie trafia do jednego kartonu i jedzie do nowego domu', 'Фільм MELBUS: уся квартира складається в одну коробку й переїжджає в новий дім', 'MELBUS film: the whole flat packs into one box and moves to a new home'),
      caption: l('Переезд от первого кадра до последней полки — за 23 секунды.', 'Przeprowadzka od pierwszego kadru po ostatnią półkę — w 23 sekundy.', 'Переїзд від першого кадру до останньої полиці — за 23 секунди.', 'A move from the first frame to the last shelf — in 23 seconds.') },
    blocks: [
      { type: 'list', eyebrow: l('Шаги', 'Kroki', 'Кроки', 'Steps'), title: l('От видео<br>до нового адреса', 'Od wideo<br>do nowego adresu', 'Від відео<br>до нової адреси', 'From a video<br>to a new address'), items: [
        [l('Видео', 'Wideo', 'Відео', 'Video'), l('Снимаете квартиру на телефон.', 'Nagrywasz mieszkanie telefonem.', 'Знімаєте квартиру на телефон.', 'You film your flat on your phone.')],
        [l('Цена', 'Cena', 'Ціна', 'Price'), l('В течение 2 часов днём — фиксированная цена.', 'W ciągu 2 godzin (w dzień) — stała cena.', 'Протягом 2 годин удень — фіксована ціна.', 'A fixed price within 2 hours (daytime).')],
        [l('Бронь', 'Rezerwacja', 'Бронювання', 'Booking'), l('Предоплата BLIK или картой.', 'Przedpłata BLIK lub kartą.', 'Передоплата BLIK або карткою.', 'Prepayment by BLIK or card.')],
        [l('Упаковка', 'Pakowanie', 'Пакування', 'Packing'), l('Бригада пакует по комнатам.', 'Ekipa pakuje pokój po pokoju.', 'Бригада пакує по кімнатах.', 'The crew packs room by room.')],
        [l('Дорога', 'Droga', 'Дорога', 'On the road'), l('Бус только с вашими вещами.', 'Bus tylko z Twoimi rzeczami.', 'Бус лише з вашими речами.', 'A van with only your things.')],
        [l('Новый дом', 'Nowy dom', 'Новий дім', 'New home'), l('Заносим, собираем, расставляем.', 'Wnosimy, składamy, ustawiamy.', 'Заносимо, збираємо, розставляємо.', 'We carry in, assemble and arrange.')],
      ] },
      { type: 'cards', eyebrow: l('Стандарты бригады', 'Standardy ekipy', 'Стандарти бригади', 'Crew standards'), title: l('Что вы увидите<br>в своём доме', 'Co zobaczysz<br>w swoim domu', 'Що ви побачите<br>у своєму домі', 'What you’ll see<br>in your home'), items: [
        [l('Бахилы и перчатки', 'Ochraniacze na buty i rękawice', 'Бахіли й рукавички', 'Shoe covers and gloves'), l('Надеваем до входа в квартиру.', 'Zakładamy przed wejściem do mieszkania.', 'Вдягаємо до входу в квартиру.', 'Put on before we enter your flat.')],
        [l('Защита пола и косяков', 'Ochrona podłóg i futryn', 'Захист підлоги й одвірків', 'Floor and door frame protection'), l('Дорожки и накладки до начала работ.', 'Chodniki i osłony przed rozpoczęciem pracy.', 'Доріжки й накладки до початку робіт.', 'Runners and guards in place before work starts.')],
        [l('Белые коробки MELBUS', 'Białe kartony MELBUS', 'Білі коробки MELBUS', 'White MELBUS boxes'), l('Наклейки по комнатам и QR со списком.', 'Naklejki według pokoi i kod QR z listą.', 'Наліпки за кімнатами і QR зі списком.', 'Room labels and a QR code with the list.')],
      ] },
    ],
  },

  about: {
    eyebrow: l('О нас', 'O nas', 'Про нас', 'About us'),
    title: l('Логистика —<br>наша профессия', 'Logistyka<br>to nasz zawód', 'Логістика —<br>наша професія', 'Logistics<br>is what we do'),
    lead: l(`MELBUS — ${y}+ лет в доставке и собственный парк бусов. Теперь мы перевозим не только посылки, но и целые дома.`, `MELBUS — ponad ${y} lat w dostawach i własna flota busów. Teraz przewozimy nie tylko paczki, ale całe domy.`, `MELBUS — ${y}+ років у доставці та власний парк бусів. Тепер ми перевозимо не лише посилки, а й цілі домівки.`, `MELBUS — ${y}+ years in delivery and our own fleet of vans. Now we move not just parcels but entire homes.`),
    media: { video: '/video/van.mp4', poster: '/img/site/van-side.webp',
      alt: l('Белый бус MELBUS едет по улице Варшавы', 'Biały bus MELBUS jedzie ulicą Warszawy', 'Білий бус MELBUS їде вулицею Варшави', 'A white MELBUS van drives through Warsaw'),
      caption: l('Около двадцати своих бусов и пять лет в логистике.', 'Około dwudziestu własnych busów i pięć lat w logistyce.', 'Близько двадцяти власних бусів і п’ять років у логістиці.', 'Around twenty vans of our own and five years in logistics.') },
    blocks: [
      { type: 'text', eyebrow: l('Почему мы', 'Dlaczego my', 'Чому ми', 'Why us'), title: l('Дисциплина курьерской службы<br>в каждом переезде', 'Dyscyplina firmy kurierskiej<br>w każdej przeprowadzce', 'Дисципліна кур’єрської служби<br>у кожному переїзді', 'Courier discipline<br>in every move'), items: [
        [l('Точно ко времени', 'Punktualnie', 'Точно вчасно', 'Right on time'), l('Каждый месяц мы доставляем около 30 000 посылок. Опаздывать — не в нашей культуре.', 'Co miesiąc doręczamy około 30 000 paczek. Spóźnianie się nie leży w naszej kulturze.', 'Щомісяця ми доставляємо близько 30 000 посилок. Запізнюватися — не в нашій культурі.', 'We deliver around 30,000 parcels every month. Being late isn’t part of our culture.')],
        [l('Свой парк', 'Własna flota', 'Власний парк', 'Our own fleet'), l('Бусы наши, а не арендованные «по звонку».', 'Busy są nasze, a nie wynajmowane „na telefon”.', 'Буси наші, а не орендовані «за дзвінком».', 'The vans are ours, not hired at the last minute.')],
        [l('Честно о новом', 'Uczciwie o nowym', 'Чесно про нове', 'Honest about being new'), l('Переезды — наше новое направление. Поэтому мы так стараемся на каждом заказе.', 'Przeprowadzki to nasza nowa usługa. Dlatego tak bardzo staramy się przy każdym zleceniu.', 'Переїзди — наш новий напрям. Тому ми так стараємося на кожному замовленні.', 'Moving is a new service for us. That’s why we put so much into every job.')],
      ] },
    ],
  },

  faq: {
    eyebrow: l('Вопросы', 'Pytania', 'Питання', 'Questions'),
    title: l('Вопросы<br>и ответы', 'Pytania<br>i odpowiedzi', 'Питання<br>й відповіді', 'Questions<br>and answers'),
  },

  contact: {
    eyebrow: l('Контакты', 'Kontakt', 'Контакти', 'Contact'),
    title: l('Напишите —<br>ответим быстро', 'Napisz —<br>odpowiemy szybko', 'Напишіть —<br>відповімо швидко', 'Write to us —<br>we reply fast'),
    lead: l(`Работаем ${brand.hours}. ${brand.area}.`, `Pracujemy ${brand.hours}. ${brand.area}.`, `Працюємо ${brand.hours}. ${brand.area}.`, `We work ${brand.hours}. ${brand.area}.`),
  },
};

export const misc = {
  faqTitle: l('Частые вопросы', 'Najczęstsze pytania', 'Часті питання', 'Frequently asked questions'),
  contactTitle: l('Как связаться', 'Jak się skontaktować', 'Як зв’язатися', 'How to reach us'),
  phone: l('Телефон', 'Telefon', 'Телефон', 'Phone'),
  email: l('Email', 'E-mail', 'Email', 'Email'),
  docs: l('Документы', 'Dokumenty', 'Документи', 'Documents'),
  legalLead: l('Черновик документа готовим вместе с юристом. Здесь появится полный текст.', 'Dokument przygotowujemy wspólnie z prawnikiem. Wkrótce pojawi się tu pełna treść.', 'Чернетку документа готуємо разом із юристом. Тут з’явиться повний текст.', 'We are preparing this document with a lawyer. The full text will appear here.'),
};
