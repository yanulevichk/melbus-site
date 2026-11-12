/**
 * ГЛАВНАЯ — все тексты, каждая фраза сразу на 4 языках (ru, pl, uk, en).
 * Меняем фразу — меняем её на всех языках. Тип L требует все 4 языка.
 */
import type { L } from '../i18n/text';

const l = (ru: string, pl: string, uk: string, en: string): L => ({ ru, pl, uk, en });

export const home = {
  posterAlt: l('Вид сверху на жилой комплекс в Варшаве в золотой час — начало фильма о переезде MELBUS', 'Widok z góry na osiedle w Warszawie o złotej godzinie — początek filmu o przeprowadzce MELBUS', 'Вид згори на житловий комплекс у Варшаві в золоту годину — початок фільму про переїзд MELBUS', 'Aerial view of a Warsaw residential complex at golden hour — the opening of the MELBUS moving film'),
  kicker: l('Переезды по Варшаве, Польше и Европе', 'Przeprowadzki w Warszawie, w Polsce i w Europie', 'Переїзди Варшавою, Польщею та Європою', 'Moving in Warsaw, across Poland and Europe'),
  title: [l('Переезд', 'Przeprowadzka', 'Переїзд', 'Moving,'), l('без доплат', 'bez dopłat', 'без доплат', 'no extra fees')] as [L, L],
  lead: l('Вы снимаете квартиру на видео — мы называем окончательную цену. Упакуем, перевезём и расставим всё по местам.', 'Nagrywasz mieszkanie telefonem — podajemy ostateczną cenę. Spakujemy, przewieziemy i ustawimy wszystko na miejscu.', 'Ви знімаєте квартиру на відео — ми називаємо остаточну ціну. Запакуємо, перевеземо й розставимо все по місцях.', 'You film your flat — we give you the final price. We pack, move and put everything in place.'),
  hint: l('Прокрутите — фильм пойдёт', 'Przewiń — film ruszy', 'Прокрутіть — фільм почнеться', 'Scroll — the film will play'),
  // подписи фильма: [с, до (секунды монтажа 23 с), заголовок, пояснение]
  caps: [
    [4.8, 6.5, l('Цена по видео', 'Cena z wideo', 'Ціна за відео', 'Price from a video'), l('Снимаете квартиру на телефон — мы называем окончательную цену.', 'Nagrywasz mieszkanie telefonem — podajemy ostateczną cenę.', 'Знімаєте квартиру на телефон — ми називаємо остаточну ціну.', 'Film your flat on your phone — we give you the final price.')],
    [6.6, 8.4, l('Упакуем всё', 'Spakujemy wszystko', 'Запакуємо все', 'We pack everything'), l('От кровати и холодильника до последней вилки.', 'Od łóżka i lodówki po ostatni widelec.', 'Від ліжка й холодильника до останньої виделки.', 'From the bed and fridge to the last fork.')],
    [9.9, 11.7, l('Белые коробки MELBUS', 'Białe kartony MELBUS', 'Білі коробки MELBUS', 'White MELBUS boxes'), l('Бирюзовый скотч и наклейка комнаты на каждой.', 'Turkusowa taśma i naklejka pokoju na każdym.', 'Бірюзовий скотч і наліпка кімнати на кожній.', 'Turquoise tape and a room label on every one.')],
    [12.7, 14.2, l('Только ваши вещи', 'Tylko Twoje rzeczy', 'Лише ваші речі', 'Only your things'), l('Бус едет без перегрузок и попутных грузов.', 'Bez przeładunków i cudzych ładunków po drodze.', 'Бус їде без перевантажень і попутних вантажів.', 'No reloading and no other cargo on the way.')],
    [14.5, 16.9, l('Варшава, Польша, Европа', 'Warszawa, Polska, Europa', 'Варшава, Польща, Європа', 'Warsaw, Poland, Europe'), l('Варшава и 150 км вокруг — семь дней в неделю.', 'Warszawa i 150 km wokół — siedem dni w tygodniu.', 'Варшава і 150 км довкола — сім днів на тиждень.', 'Warsaw and 150 km around — seven days a week.')],
    [18.8, 20.6, l('Распакуем и расставим', 'Rozpakujemy i ustawimy', 'Розпакуємо й розставимо', 'Unpacked and in place'), l('Соберём мебель и поставим всё по местам.', 'Złożymy meble i ustawimy wszystko na miejscu.', 'Зберемо меблі й поставимо все на місця.', 'We assemble the furniture and put everything in place.')],
  ] as [number, number, L, L][],
  endTitle: l('Ваш новый адрес ждёт', 'Twój nowy adres czeka', 'Ваша нова адреса чекає', 'Your new address is waiting'),
  watch: l('Смотреть ролик · 0:23', 'Zobacz film · 0:23', 'Дивитися ролик · 0:23', 'Watch the film · 0:23'),
  band: [
    [l('Цена по видео', 'Cena z wideo', 'Ціна за відео', 'Price from a video'), l('окончательная, без доплат на месте', 'ostateczna, bez dopłat na miejscu', 'остаточна, без доплат на місці', 'final, no extra fees on the day')],
    [l('Фактура VAT', 'Faktura VAT', 'Фактура VAT', 'VAT invoice'), l('BLIK, карта или перевод', 'BLIK, karta lub przelew', 'BLIK, картка або переказ', 'BLIK, card or bank transfer')],
    [l('7 дней в неделю', '7 dni w tygodniu', '7 днів на тиждень', '7 days a week'), l('Варшава и 150 км вокруг', 'Warszawa i 150 km wokół', 'Варшава і 150 км довкола', 'Warsaw and 150 km around')],
  ] as [L, L][],
  statement: l('Цена, которую вы приняли, — это цена, которую вы заплатите. Никаких «а тут ещё этаж» и «шкаф оказался тяжелее». Если что-то меняется — только с вашего согласия и до начала работ.', 'Cena, którą przyjmujesz, to cena, którą zapłacisz. Żadnego „a tu jeszcze piętro” ani „szafa okazała się cięższa”. Jeśli coś się zmienia — tylko za Twoją zgodą i przed rozpoczęciem pracy.', 'Ціна, яку ви прийняли, — це ціна, яку ви заплатите. Жодних «а тут ще поверх» і «шафа виявилася важчою». Якщо щось змінюється — лише з вашої згоди й до початку робіт.', 'The price you accept is the price you pay. No “oh, there’s another floor” or “the wardrobe turned out heavier”. If anything changes, it’s only with your consent and before work begins.'),
  statementLink: l('Как работает гарантия цены', 'Jak działa gwarancja ceny', 'Як працює гарантія ціни', 'How the price guarantee works'),
  phoneAlt: l('Рука с телефоном снимает квартиру на видео', 'Ręka z telefonem nagrywa mieszkanie', 'Рука з телефоном знімає квартиру на відео', 'A hand filming a flat on a phone'),
  phoneCaption: l('Две-три минуты видео на телефон — и мы называем окончательную цену.', 'Dwie, trzy minuty wideo z telefonu — i podajemy ostateczną cenę.', 'Дві-три хвилини відео на телефон — і ми називаємо остаточну ціну.', 'Two or three minutes of phone video — and we give you the final price.'),
  price: {
    h2: l('Сколько стоит переезд', 'Ile kosztuje przeprowadzka', 'Скільки коштує переїзд', 'How much does a move cost'),
    lead: l('Ориентир за полминуты. Окончательную цену зафиксируем по видео.', 'Orientacyjna cena w pół minuty. Ostateczną ustalimy z wideo.', 'Орієнтир за пів хвилини. Остаточну ціну зафіксуємо за відео.', 'A ballpark in thirty seconds. We fix the final price from a video.'),
    seg: l('Что перевозим', 'Co przewozimy', 'Що перевозимо', 'What are we moving'),
    from: l('от', 'od', 'від', 'from'),
    sr: l('Ориентировочная цена: от', 'Cena orientacyjna: od', 'Орієнтовна ціна: від', 'Approximate price: from'),
    demo: l('Демо-цифры: ставки ещё утверждаются.', 'Ceny demonstracyjne: stawki są jeszcze zatwierdzane.', 'Демо-цифри: ставки ще затверджуються.', 'Demo figures: rates are still being finalised.'),
    next: l('Продолжить расчёт', 'Kontynuuj wycenę', 'Продовжити розрахунок', 'Continue the estimate'),
  },
  steps: {
    h2: l('Как проходит переезд', 'Jak wygląda przeprowadzka', 'Як проходить переїзд', 'How the move works'),
    lead: l('Шесть шагов от видео на телефоне до последней собранной полки. На каждом шаге вы знаете, что будет дальше.', 'Sześć kroków od wideo z telefonu po ostatnią złożoną półkę. Na każdym etapie wiesz, co będzie dalej.', 'Шість кроків від відео на телефоні до останньої зібраної полиці. На кожному кроці ви знаєте, що буде далі.', 'Six steps from a phone video to the last shelf assembled. At every step you know what happens next.'),
    note: l('Кадры — визуализация из нашего фильма.', 'Kadry to wizualizacja z naszego filmu.', 'Кадри — візуалізація з нашого фільму.', 'Stills are visualisations from our film.'),
    items: [
      ['step-1-video', l('Видео', 'Wideo', 'Відео', 'Video'), l('Снимаете квартиру на телефон: две-три минуты, комната за комнатой.', 'Nagrywasz mieszkanie telefonem: dwie, trzy minuty, pokój po pokoju.', 'Знімаєте квартиру на телефон: дві-три хвилини, кімната за кімнатою.', 'Film your flat on your phone: two or three minutes, room by room.')],
      ['step-2-price', l('Цена', 'Cena', 'Ціна', 'Price'), l('В течение двух часов днём присылаем окончательную цену и список вещей.', 'W ciągu dwóch godzin (w dzień) wysyłamy ostateczną cenę i listę rzeczy.', 'Протягом двох годин удень надсилаємо остаточну ціну та список речей.', 'Within two hours (daytime) we send the final price and a list of items.')],
      ['step-3-book', l('Бронь', 'Rezerwacja', 'Бронювання', 'Booking'), l('Подтверждаете предоплатой BLIK или картой — дата закреплена за вами.', 'Potwierdzasz przedpłatą BLIK lub kartą — termin jest Twój.', 'Підтверджуєте передоплатою BLIK або карткою — дата закріплена за вами.', 'Confirm with a BLIK or card prepayment — the date is yours.')],
      ['step-4-pack', l('Упаковка', 'Pakowanie', 'Пакування', 'Packing'), l('Бригада в форме, перчатках и бахилах упаковывает всё по комнатам.', 'Ekipa w uniformach, rękawicach i ochraniaczach na buty pakuje wszystko pokój po pokoju.', 'Бригада у формі, рукавичках і бахілах пакує все по кімнатах.', 'A crew in uniforms, gloves and shoe covers packs everything room by room.')],
      ['step-5-road', l('Дорога', 'Droga', 'Дорога', 'On the road'), l('Бус MELBUS везёт только ваши вещи, без перегрузок по пути.', 'Bus MELBUS wiezie tylko Twoje rzeczy, bez przeładunków po drodze.', 'Бус MELBUS везе лише ваші речі, без перевантажень у дорозі.', 'A MELBUS van carries only your things, with no reloading on the way.')],
      ['step-6-home', l('Новый дом', 'Nowy dom', 'Новий дім', 'New home'), l('Заносим, собираем мебель и расставляем всё по местам.', 'Wnosimy, składamy meble i ustawiamy wszystko na miejscu.', 'Заносимо, збираємо меблі й розставляємо все по місцях.', 'We carry in, assemble the furniture and put everything in place.')],
    ] as [string, L, L][],
  },
  std: {
    alt: l('Руки в фирменных перчатках MELBUS упаковывают бокал в бумагу и кладут в коробку', 'Ręce w firmowych rękawicach MELBUS pakują kieliszek w papier i wkładają go do kartonu', 'Руки у фірмових рукавичках MELBUS пакують келих у папір і кладуть у коробку', 'Hands in MELBUS gloves wrap a glass in paper and place it in a box'),
    h2: l('Аккуратность, которую видно', 'Staranność, którą widać', 'Акуратність, яку видно', 'Care you can see'),
    lead: l('Двадцать бусов и пять лет в логистике научили нас простому правилу: вещи клиента — как свои.', 'Dwadzieścia busów i pięć lat w logistyce nauczyły nas prostej zasady: rzeczy klienta traktujemy jak własne.', 'Двадцять бусів і п’ять років у логістиці навчили нас простого правила: речі клієнта — як свої.', 'Twenty vans and five years in logistics taught us a simple rule: we treat your things as our own.'),
    items: [
      [l('Чистота с порога', 'Czystość od progu', 'Чистота з порога', 'Clean from the doorstep'), l('Бахилы поверх рабочей обуви и чистые перчатки — до того, как мы войдём в квартиру.', 'Ochraniacze na buty robocze i czyste rękawice — zanim wejdziemy do mieszkania.', 'Бахіли поверх робочого взуття й чисті рукавички — ще до того, як ми зайдемо в квартиру.', 'Shoe covers over work boots and clean gloves — before we step into your flat.')],
      [l('Защита дома', 'Ochrona domu', 'Захист дому', 'Home protection'), l('Дорожки на пол, накладки на дверные косяки и углы. Уходя, убираем за собой.', 'Chodniki na podłogę, osłony na futryny i narożniki. Wychodząc, sprzątamy po sobie.', 'Доріжки на підлогу, накладки на одвірки й кути. Ідучи, прибираємо за собою.', 'Floor runners, guards on door frames and corners. We tidy up before we leave.')],
      [l('Хрупкое отдельно', 'Delikatne osobno', 'Крихке окремо', 'Fragile items separately'), l('Посуда в бумаге, бокалы в пузырчатой плёнке, коробки с перегородками.', 'Naczynia w papierze, kieliszki w folii bąbelkowej, kartony z przegródkami.', 'Посуд у папері, келихи в бульбашковій плівці, коробки з перегородками.', 'Dishes in paper, glasses in bubble wrap, boxes with dividers.')],
      [l('Порядок в коробках', 'Porządek w kartonach', 'Порядок у коробках', 'Order in every box'), l('Цвет наклейки — комната, номер — коробка, QR — список вещей внутри.', 'Kolor naklejki to pokój, numer to karton, kod QR to lista rzeczy w środku.', 'Колір наліпки — кімната, номер — коробка, QR — список речей усередині.', 'The label colour is the room, the number is the box, the QR code lists what’s inside.')],
      [l('Одежда на вешалках', 'Ubrania na wieszakach', 'Одяг на вішаках', 'Clothes on hangers'), l('Гардеробные коробки со штангой: вещи приезжают не мятыми.', 'Kartony garderobiane z drążkiem: ubrania przyjeżdżają niepogniecione.', 'Гардеробні коробки зі штангою: речі приїжджають не м’ятими.', 'Wardrobe boxes with a rail: clothes arrive uncreased.')],
    ] as [L, L][],
  },
  boxes: {
    h2: l('Белые коробки с порядком внутри', 'Białe kartony z porządkiem w środku', 'Білі коробки з порядком усередині', 'White boxes with order inside'),
    lead: l('Привезём набор за несколько дней до переезда. Цвет наклейки показывает комнату, номер — коробку, QR — список вещей внутри.', 'Przywieziemy zestaw kilka dni przed przeprowadzką. Kolor naklejki wskazuje pokój, numer — karton, kod QR — listę rzeczy w środku.', 'Привеземо набір за кілька днів до переїзду. Колір наліпки показує кімнату, номер — коробку, QR — список речей усередині.', 'We deliver a set a few days before your move. The label colour shows the room, the number the box, the QR code the list of items inside.'),
    alt: l('Белая коробка MELBUS, заклеенная бирюзовым скотчем, с наклейкой комнаты', 'Biały karton MELBUS zaklejony turkusową taśmą, z naklejką pokoju', 'Біла коробка MELBUS, заклеєна бірюзовим скотчем, з наліпкою кімнати', 'A white MELBUS box sealed with turquoise tape, with a room label'),
    roomsAria: l('Цвета наклеек по комнатам', 'Kolory naklejek według pokoi', 'Кольори наліпок за кімнатами', 'Label colours by room'),
    rooms: [
      [l('Кухня', 'Kuchnia', 'Кухня', 'Kitchen'), '#14DCD5', '07'], [l('Спальня', 'Sypialnia', 'Спальня', 'Bedroom'), '#077E79', '12'],
      [l('Гостиная', 'Salon', 'Вітальня', 'Living room'), '#10161D', '03'], [l('Детская', 'Pokój dziecięcy', 'Дитяча', 'Kids’ room'), '#8F9AA7', '21'],
      [l('Ванная', 'Łazienka', 'Ванна', 'Bathroom'), '#C9D1D9', '05'],
    ] as [L, string, string][],
  },
  guarantee: {
    h2: l('Цена из оферты —<br />окончательная.', 'Cena z oferty —<br />ostateczna.', 'Ціна з оферти —<br />остаточна.', 'The price in the offer<br />is final.'),
    cols: [
      [l('Фиксированная цена', 'Stała cena', 'Фіксована ціна', 'Fixed price'), l('Риск «не уложились по времени» — наш. Сумма из принятой оферты не меняется.', 'Ryzyko „nie zmieściliśmy się w czasie” jest nasze. Kwota z przyjętej oferty się nie zmienia.', 'Ризик «не вклалися в час» — наш. Сума з прийнятої оферти не змінюється.', 'The risk of running over time is ours. The amount in the accepted offer doesn’t change.')],
      [l('Пунктуальность', 'Punktualność', 'Пунктуальність', 'Punctuality'), l('Окно прибытия — 30 минут. Опоздали по своей вине — скидка за каждые 30 минут.', 'Okno przyjazdu to 30 minut. Spóźnimy się z naszej winy — rabat za każde 30 minut.', 'Вікно прибуття — 30 хвилин. Запізнилися з нашої вини — знижка за кожні 30 хвилин.', 'A 30-minute arrival window. If we’re late through our fault, you get a discount for every 30 minutes.')],
      [l('Сохранность', 'Bezpieczeństwo mienia', 'Збереження', 'Safekeeping'), l('Защищаем мебель и дом. Если что-то повредили — возмещаем по процедуре рекламации.', 'Chronimy meble i dom. Jeśli coś uszkodzimy — rekompensujemy zgodnie z procedurą reklamacyjną.', 'Захищаємо меблі й дім. Якщо щось пошкодили — відшкодовуємо за процедурою рекламації.', 'We protect your furniture and home. If something is damaged, we compensate under the complaints procedure.')],
    ] as [L, L][],
    link: l('Условия гарантии', 'Warunki gwarancji', 'Умови гарантії', 'Guarantee terms'),
  },
  facts: [
    [l('5+', '5+', '5+', '5+'), l('лет в логистике', 'lat w logistyce', 'років у логістиці', 'years in logistics')],
    [l('≈30 000', '≈30 000', '≈30 000', '≈30,000'), l('доставок в месяц', 'dostaw miesięcznie', 'доставок на місяць', 'deliveries a month')],
    [l('≈20', '≈20', '≈20', '≈20'), l('бусов в своём парке', 'busów we własnej flocie', 'бусів у власному парку', 'vans in our own fleet')],
    [l('7/7', '7/7', '7/7', '7/7'), l('работаем без выходных', 'pracujemy bez dni wolnych', 'працюємо без вихідних', 'no days off')],
  ] as [L, L][],
  area: {
    h2: l('Варшава и 150 км вокруг', 'Warszawa i 150 km wokół', 'Варшава і 150 км довкола', 'Warsaw and 150 km around'),
    lead: l('Мокотув, Воля, Урсынов, Прага, Белоленка и все районы города. Пясечно, Прушков, Легионово, Марки и дальше. По Польше и в страны ЕС — по запросу.', 'Mokotów, Wola, Ursynów, Praga, Białołęka i wszystkie dzielnice miasta. Piaseczno, Pruszków, Legionowo, Marki i dalej. Po Polsce i do krajów UE — na zapytanie.', 'Мокотув, Воля, Урсинів, Прага, Бялоленка й усі райони міста. Пясечно, Прушків, Легіоново, Марки й далі. Польщею та до країн ЄС — за запитом.', 'Mokotów, Wola, Ursynów, Praga, Białołęka and every district of the city. Piaseczno, Pruszków, Legionowo, Marki and beyond. Across Poland and to EU countries on request.'),
    mapAria: l('Карта: Варшава в центре, кольцо 150 км, ближайшие города', 'Mapa: Warszawa w centrum, krąg 150 km, najbliższe miasta', 'Мапа: Варшава в центрі, кільце 150 км, найближчі міста', 'Map: Warsaw in the centre, a 150 km ring, nearby towns'),
    km: l('150 км', '150 km', '150 км', '150 km'),
    places: [
      [200, 200, l('Варшава', 'Warszawa', 'Варшава', 'Warsaw'), true], [204, 140, l('Легионово', 'Legionowo', 'Легіоново', 'Legionowo')], [128, 214, l('Прушков', 'Pruszków', 'Прушків', 'Pruszków')],
      [210, 262, l('Пясечно', 'Piaseczno', 'Пясечно', 'Piaseczno')], [258, 246, l('Отвоцк', 'Otwock', 'Отвоцьк', 'Otwock')], [96, 104, l('Плоцк', 'Płock', 'Плоцьк', 'Płock')],
      [332, 186, l('Седльце', 'Siedlce', 'Седльце', 'Siedlce')], [222, 338, l('Радом', 'Radom', 'Радом', 'Radom')], [80, 296, l('Лодзь', 'Łódź', 'Лодзь', 'Łódź')],
    ] as [number, number, L, boolean?][],
  },
  reviews: l('Мы новое направление, поэтому отзывов пока нет. Первые появятся здесь и в Google — публикуем только настоящие.', 'Jesteśmy nową usługą, dlatego nie mamy jeszcze opinii. Pierwsze pojawią się tutaj i w Google — publikujemy tylko prawdziwe.', 'Ми новий напрям, тому відгуків поки немає. Перші з’являться тут і в Google — публікуємо лише справжні.', 'We’re a new service, so there are no reviews yet. The first ones will appear here and on Google — we only publish real ones.'),
  faqH2: l('Частые вопросы', 'Najczęstsze pytania', 'Часті питання', 'Frequently asked questions'),
  vanAlt: l('Белый бус MELBUS едет по улице Варшавы в золотой час', 'Biały bus MELBUS jedzie ulicą Warszawy o złotej godzinie', 'Білий бус MELBUS їде вулицею Варшави в золоту годину', 'A white MELBUS van drives through Warsaw at golden hour'),
  finalLead: l('Пришлите видео квартиры — в течение двух часов днём получите цену, которая не изменится.', 'Wyślij wideo mieszkania — w ciągu dwóch godzin (w dzień) otrzymasz cenę, która się nie zmieni.', 'Надішліть відео квартири — протягом двох годин удень отримаєте ціну, яка не зміниться.', 'Send a video of your flat — within two hours (daytime) you’ll get a price that won’t change.'),
  modalAria: l('Ролик MELBUS: вся квартира в одной коробке', 'Film MELBUS: całe mieszkanie w jednym kartonie', 'Ролик MELBUS: уся квартира в одній коробці', 'MELBUS film: your whole flat in one box'),
};
