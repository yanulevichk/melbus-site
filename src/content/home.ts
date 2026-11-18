/**
 * ГЛАВНАЯ — все тексты, каждая фраза сразу на 4 языках (ru, pl, uk, en).
 * Меняем фразу — меняем её на всех языках. Тип L требует все 4 языка.
 */
import type { L } from '../i18n/text';

const l = (ru: string, pl: string, uk: string, en: string): L => ({ ru, pl, uk, en });

export const home = {
  posterAlt: l('Вид сверху на жилой комплекс в Варшаве в золотой час — начало фильма о переезде MELBUS', 'Widok z góry na osiedle w Warszawie o złotej godzinie — początek filmu o przeprowadzce MELBUS', 'Вид згори на житловий комплекс у Варшаві в золоту годину — початок фільму про переїзд MELBUS', 'Aerial view of a Warsaw residential complex at golden hour — the opening of the MELBUS moving film'),
  kicker: l('Переезды по Варшаве, Польше и ЕС', 'Przeprowadzki w Warszawie, w Polsce i w UE', 'Переїзди Варшавою, Польщею та ЄС', 'Moving in Warsaw, across Poland and the EU'),
  title: [l('Переезд,', 'Przeprowadzka,', 'Переїзд,', 'A move'), l('который не дорожает', 'która nie drożeje', 'який не дорожчає', 'that won’t cost more')] as [L, L],
  lead: l('Снимите видео квартиры, дома или офиса — в течение 2 часов пришлём цену, которая не изменится. Дальше упакуем, перевезём и расставим всё по местам.', 'Nagraj wideo mieszkania, domu lub biura — w ciągu 2 godzin wyślemy cenę, która się nie zmieni. Potem spakujemy, przewieziemy i ustawimy wszystko na swoje miejsca.', 'Зніміть відео квартири, будинку чи офісу — протягом 2 годин надішлемо ціну, яка не зміниться. Далі запакуємо, перевеземо й розставимо все по місцях.', 'Film your flat, house or office — within 2 hours we’ll send you a price that won’t change. Then we pack, move and put everything in its place.'),
  hint: l('Прокрутите — фильм начнётся', 'Przewiń — film ruszy', 'Прокрутіть — фільм почнеться', 'Scroll to play the film'),
  // подписи фильма: [с, до (секунды монтажа 23 с), заголовок, пояснение]
  caps: [
    [4.8, 6.5, l('Цена по видео', 'Cena z wideo', 'Ціна за відео', 'Price from a video'), l('Снимаете квартиру на телефон — мы называем окончательную цену.', 'Nagrywasz mieszkanie telefonem — podajemy ostateczną cenę.', 'Знімаєте квартиру на телефон — ми називаємо остаточну ціну.', 'Film your flat on your phone — we give you the final price.')],
    [6.6, 8.4, l('Упакуем всё', 'Spakujemy wszystko', 'Запакуємо все', 'We pack everything'), l('От кровати и холодильника до последней вилки.', 'Od łóżka i lodówki po ostatni widelec.', 'Від ліжка й холодильника до останньої виделки.', 'From the bed and fridge to the last fork.')],
    [9.9, 11.7, l('Белые коробки MELBUS', 'Białe kartony MELBUS', 'Білі коробки MELBUS', 'White MELBUS boxes'), l('Бирюзовый скотч и наклейка комнаты на каждой.', 'Turkusowa taśma i naklejka z oznaczeniem pokoju na każdym.', 'Бірюзовий скотч і наліпка кімнати на кожній.', 'Turquoise tape and a room label on every one.')],
    [12.7, 14.2, l('Только ваши вещи', 'Tylko Twoje rzeczy', 'Лише ваші речі', 'Only your things'), l('Бус едет без перегрузок и попутных грузов.', 'Bez przeładunków i doładunków po drodze.', 'Бус їде без перевантажень і попутних вантажів.', 'No reloading and no other cargo on the way.')],
    [14.5, 16.9, l('Варшава, Польша, ЕС', 'Warszawa, Polska, UE', 'Варшава, Польща, ЄС', 'Warsaw, Poland, the EU'), l('Варшава и 150 км вокруг — семь дней в неделю.', 'Warszawa i okolice do 150 km — siedem dni w tygodniu.', 'Варшава і 150 км довкола — сім днів на тиждень.', 'Within 150 km of Warsaw — seven days a week.')],
    [18.8, 20.6, l('Распакуем и расставим', 'Rozpakujemy i ustawimy', 'Розпакуємо й розставимо', 'Unpacked and in place'), l('Соберём мебель и поставим всё по местам.', 'Złożymy meble i ustawimy wszystko na swoje miejsca.', 'Зберемо меблі й поставимо все на місця.', 'We assemble the furniture and put everything in place.')],
  ] as [number, number, L, L][],
  // 18.11.2026: первый экран «Кино» — слово MELBUS → фильм 10 с под прокрутку. [от, до] — доля фильма (0–1)
  film2: [
    [0.05, 0.36, l('Снимите квартиру на видео', 'Nagraj mieszkanie telefonem', 'Зніміть квартиру на відео', 'Film your flat'), l('В течение 2 часов пришлём цену, которая не изменится.', 'W ciągu 2 godzin wyślemy cenę, która się nie zmieni.', 'Протягом 2 годин надішлемо ціну, яка не зміниться.', 'Within 2 hours we’ll send a price that won’t change.')],
    [0.42, 0.66, l('Вся квартира — в одной коробке', 'Całe mieszkanie w jednym kartonie', 'Уся квартира — в одній коробці', 'Your whole flat — in one box'), l('Пакуем, разбираем мебель, ничего не теряем.', 'Pakujemy, rozkręcamy meble, niczego nie gubimy.', 'Пакуємо, розбираємо меблі, нічого не губимо.', 'We pack, take the furniture apart and lose nothing.')],
    [0.69, 0.82, l('Цена не меняется', 'Cena się nie zmienia', 'Ціна не змінюється', 'The price doesn’t change'), l('Ни этаж, ни тяжёлый шкаф её не сдвинут.', 'Ani piętro, ani ciężka szafa jej nie przesuną.', 'Ні поверх, ні важка шафа її не зсунуть.', 'No floor and no heavy wardrobe will move it.')],
    [0.85, 1.01, l('Только ваши вещи', 'Tylko Twoje rzeczy', 'Лише ваші речі', 'Only your things'), l('Бус едет без перегрузок и чужих грузов.', 'Bus jedzie bez przeładunków i doładunków.', 'Бус їде без перевантажень і чужих вантажів.', 'The van carries nothing else and makes no reloads.')],
  ] as [number, number, L, L][],
  scrollHint: l('Прокрутите', 'Przewiń', 'Прокрутіть', 'Scroll'),
  endTitle: l('Ваш новый адрес ждёт', 'Twój nowy adres czeka', 'Ваша нова адреса чекає', 'Your new address is waiting'),
  watch: l('Смотреть ролик · 0:23', 'Zobacz film · 0:23', 'Дивитися ролик · 0:23', 'Watch the film · 0:23'),
  band: [
    [l('Цена по видео', 'Cena z wideo', 'Ціна за відео', 'Price from a video'), l('окончательная, без доплат на месте', 'ostateczna, bez dopłat na miejscu', 'остаточна, без доплат на місці', 'final, no extra fees on the day')],
    [l('Фактура VAT', 'Faktura VAT', 'Фактура VAT', 'VAT invoice'), l('BLIK, карта или наличные', 'BLIK, karta lub gotówka', 'BLIK, картка або готівка', 'BLIK, card or cash')],
    [l('7 дней в неделю', '7 dni w tygodniu', '7 днів на тиждень', '7 days a week'), l('Варшава и 150 км вокруг', 'Warszawa i okolice do 150 km', 'Варшава і 150 км довкола', 'Within 150 km of Warsaw')],
  ] as [L, L][],
  statement: l('Цена, которую вы приняли, не меняется. Ни этаж, ни тяжёлый шкаф её не сдвинут.', 'Cena, którą zaakceptujesz, się nie zmienia. Ani piętro, ani ciężka szafa jej nie przesuną.', 'Ціна, яку ви прийняли, не змінюється. Ні поверх, ні важка шафа її не зсунуть.', 'The price you accept doesn’t change. No floor and no heavy wardrobe will move it.'),
  statementLink: l('Как работает гарантия цены', 'Jak działa gwarancja ceny', 'Як працює гарантія ціни', 'How the price guarantee works'),
  phoneAlt: l('Рука с телефоном снимает квартиру на видео', 'Ręka z telefonem nagrywa mieszkanie', 'Рука з телефоном знімає квартиру на відео', 'A hand filming a flat on a phone'),
  phoneCaption: l('Две-три минуты видео — и вы знаете цену всего переезда.', 'Dwie, trzy minuty wideo — i znasz cenę całej przeprowadzki.', 'Дві-три хвилини відео — і ви знаєте ціну всього переїзду.', 'Two or three minutes of video, and you know the price of the whole move.'),
  price: {
    h2: l('Сколько стоит переезд', 'Ile kosztuje przeprowadzka', 'Скільки коштує переїзд', 'How much does a move cost'),
    lead: l('Выберите пример — табло покажет цену «Перевозки». Цену своего переезда форма посчитает за пару минут.', 'Wybierz przykład — tablica pokaże cenę pakietu „Transport”. Cenę Twojej przeprowadzki formularz policzy w kilka minut.', 'Оберіть приклад — табло покаже ціну «Перевезення». Ціну вашого переїзду форма порахує за кілька хвилин.', 'Pick an example and the board shows the “Transport” price. The form prices your own move in a couple of minutes.'),
    seg: l('Что перевозим', 'Co przewozimy', 'Що перевозимо', 'What are we moving'),
    from: l('от', 'od', 'від', 'from'),
    sr: l('Ориентировочная цена: от', 'Cena orientacyjna: od', 'Орієнтовна ціна: від', 'Approximate price: from'),
    demo: l('Цифры для примера: ставки ещё утверждаются.', 'Ceny przykładowe: stawki są jeszcze ustalane.', 'Цифри для прикладу: ставки ще затверджуються.', 'Sample figures: rates are still being finalised.'),
    next: l('Посчитать свой переезд', 'Policz swoją przeprowadzkę', 'Порахувати свій переїзд', 'Price your move'),
  },
  steps: {
    h2: l('Как проходит переезд', 'Jak wygląda przeprowadzka', 'Як проходить переїзд', 'How the move works'),
    lead: l('От видео на телефоне до последней собранной полки — шесть шагов, и на каждом понятно, что дальше.', 'Od wideo z telefonu po ostatnią złożoną półkę — sześć kroków i na każdym wiesz, co dalej.', 'Від відео на телефоні до останньої зібраної полиці — шість кроків, і на кожному зрозуміло, що далі.', 'From a phone video to the last shelf assembled: six steps, and at each one you know what comes next.'),
    note: l('Кадры — визуализация из нашего фильма.', 'Kadry to wizualizacja z naszego filmu.', 'Кадри — візуалізація з нашого фільму.', 'Stills are visualisations from our film.'),
    items: [
      ['step-1-video', l('Видео', 'Wideo', 'Відео', 'Video'), l('Снимаете квартиру на телефон: две-три минуты, комната за комнатой.', 'Nagrywasz mieszkanie telefonem: dwie, trzy minuty, pokój po pokoju.', 'Знімаєте квартиру на телефон: дві-три хвилини, кімната за кімнатою.', 'Film your flat on your phone: two or three minutes, room by room.')],
      ['step-2-price', l('Цена', 'Cena', 'Ціна', 'Price'), l('В течение 2 часов днём — цена за весь переезд. Дальше она не меняется.', 'W ciągu 2 godzin w dzień — cena za całą przeprowadzkę. Potem już się nie zmienia.', 'Протягом 2 годин удень — ціна за весь переїзд. Далі вона не змінюється.', 'Within 2 hours (daytime): the price for the whole move. From then on it doesn’t change.')],
      ['step-3-book', l('Бронь', 'Rezerwacja', 'Бронювання', 'Booking'), l('Вносите задаток через BLIK или картой — дата закреплена за вами.', 'Wpłacasz zadatek BLIKIEM lub kartą — termin jest Twój.', 'Вносите завдаток через BLIK або карткою — дата закріплена за вами.', 'Confirm with a deposit by BLIK or card — the date is yours.')],
      ['step-4-pack', l('Упаковка', 'Pakowanie', 'Пакування', 'Packing'), l('Пакуем по комнатам в белые коробки. Или пакуете вы — тогда дешевле.', 'Pakujemy pokój po pokoju w białe kartony. Albo pakujesz Ty — wtedy taniej.', 'Пакуємо по кімнатах у білі коробки. Або пакуєте ви — тоді дешевше.', 'We pack room by room into white boxes. Or you pack yourself, and it costs less.')],
      ['step-5-road', l('Дорога', 'Droga', 'Дорога', 'On the road'), l('Бус MELBUS везёт только ваши вещи, без перегрузок по пути.', 'Bus MELBUS wiezie tylko Twoje rzeczy, bez przeładunków po drodze.', 'Бус MELBUS везе лише ваші речі, без перевантажень у дорозі.', 'A MELBUS van carries only your things, with no reloading on the way.')],
      ['step-6-home', l('Новый дом', 'Nowy dom', 'Новий дім', 'New home'), l('Заносим, собираем мебель и расставляем всё по местам.', 'Wnosimy, składamy meble i ustawiamy wszystko na swoje miejsca.', 'Заносимо, збираємо меблі й розставляємо все по місцях.', 'We carry in, assemble the furniture and put everything in place.')],
    ] as [string, L, L][],
  },
  std: {
    alt: l('Руки в фирменных перчатках MELBUS упаковывают бокал в бумагу и кладут в коробку', 'Ręce w firmowych rękawicach MELBUS pakują kieliszek w papier i wkładają go do kartonu', 'Руки у фірмових рукавичках MELBUS пакують келих у папір і кладуть у коробку', 'Hands in MELBUS gloves wrap a glass in paper and place it in a box'),
    h2: l('Аккуратность, которую видно', 'Staranność, którą widać', 'Акуратність, яку видно', 'Care you can see'),
    lead: l('Пять лет и двадцать бусов в логистике научили нас простому: чужие вещи бережём как свои.', 'Pięć lat i dwadzieścia busów w logistyce nauczyły nas jednego: cudze rzeczy chronimy jak własne.', 'П’ять років і двадцять бусів у логістиці навчили нас простого: чужі речі бережемо як свої.', 'Five years and twenty vans in logistics taught us one thing: we look after other people’s things as if they were ours.'),
    items: [
      [l('Чистота с порога', 'Czystość od progu', 'Чистота з порога', 'Clean from the doorstep'), l('Бахилы поверх рабочей обуви и чистые перчатки — до того, как мы войдём в квартиру.', 'Ochraniacze na buty robocze i czyste rękawice — zanim wejdziemy do mieszkania.', 'Бахіли поверх робочого взуття й чисті рукавички — ще до того, як ми зайдемо в квартиру.', 'Shoe covers over work boots and clean gloves — before we step into your flat.')],
      [l('Защита дома', 'Ochrona domu', 'Захист дому', 'Protecting your home'), l('Дорожки на пол, накладки на дверные косяки и углы. Уходя, убираем за собой.', 'Chodniki na podłogę, osłony na futryny i narożniki. Wychodząc, sprzątamy po sobie.', 'Доріжки на підлогу, накладки на одвірки й кути. Перед тим як піти, прибираємо за собою.', 'Floor runners, guards on door frames and corners. We tidy up before we leave.')],
      [l('Хрупкое отдельно', 'Delikatne rzeczy osobno', 'Крихке окремо', 'Fragile items packed separately'), l('Посуда в бумаге, бокалы в пузырчатой плёнке, коробки с перегородками.', 'Naczynia w papierze, kieliszki w folii bąbelkowej, kartony z przegródkami.', 'Посуд у папері, келихи в бульбашковій плівці, коробки з перегородками.', 'Dishes in paper, glasses in bubble wrap, boxes with dividers.')],
      [l('Порядок в коробках', 'Porządek w kartonach', 'Порядок у коробках', 'Order in every box'), l('Цвет наклейки — комната, номер — коробка, QR — список вещей внутри.', 'Kolor naklejki to pokój, numer to karton, kod QR to lista rzeczy w środku.', 'Колір наліпки — кімната, номер — коробка, QR — список речей усередині.', 'The label colour is the room, the number is the box, the QR code lists what’s inside.')],
      [l('Одежда на вешалках', 'Ubrania na wieszakach', 'Одяг на вішаках', 'Clothes on hangers'), l('Гардеробные коробки со штангой: вещи приезжают немятыми.', 'Kartony garderobiane z drążkiem: ubrania przyjeżdżają niepogniecione.', 'Гардеробні коробки зі штангою: речі приїжджають нем’ятими.', 'Wardrobe boxes with a rail: clothes arrive uncreased.')],
    ] as [L, L][],
  },
  boxes: {
    h2: l('Белые коробки с порядком внутри', 'Białe kartony z porządkiem w środku', 'Білі коробки з порядком усередині', 'White boxes with order inside'),
    lead: l('Привезём набор за несколько дней до переезда. Цвет наклейки показывает комнату, номер — коробку, QR — список вещей внутри.', 'Przywieziemy zestaw kilka dni przed przeprowadzką. Kolor naklejki wskazuje pokój, numer — karton, kod QR — listę rzeczy w środku.', 'Привеземо набір за кілька днів до переїзду. Колір наліпки показує кімнату, номер — коробку, QR — список речей усередині.', 'We bring a set of boxes a few days before your move. The label colour shows the room, the number the box, the QR code the list of items inside.'),
    alt: l('Белая коробка MELBUS, заклеенная бирюзовым скотчем, с наклейкой комнаты', 'Biały karton MELBUS zaklejony turkusową taśmą, z naklejką oznaczającą pokój', 'Біла коробка MELBUS, заклеєна бірюзовим скотчем, з наліпкою кімнати', 'A white MELBUS box sealed with turquoise tape, with a room label'),
    roomsAria: l('Цвета наклеек по комнатам', 'Kolory naklejek według pokoi', 'Кольори наліпок за кімнатами', 'Label colours by room'),
    rooms: [
      [l('Кухня', 'Kuchnia', 'Кухня', 'Kitchen'), '#14DCD5', '07'], [l('Спальня', 'Sypialnia', 'Спальня', 'Bedroom'), '#077E79', '12'],
      [l('Гостиная', 'Salon', 'Вітальня', 'Living room'), '#10161D', '03'], [l('Детская', 'Pokój dziecięcy', 'Дитяча', 'Kids’ room'), '#8F9AA7', '21'],
      [l('Ванная', 'Łazienka', 'Ванна кімната', 'Bathroom'), '#C9D1D9', '05'],
    ] as [L, string, string][],
  },
  guarantee: {
    h2: l('Цена из оферты —<br />окончательная.', 'Cena z oferty —<br />ostateczna.', 'Ціна з оферти —<br />остаточна.', 'The price in the offer<br />is final.'),
    cols: [
      [l('Фиксированная цена', 'Stała cena', 'Фіксована ціна', 'Fixed price'), l('Риск «не уложились по времени» — наш. Сумма из принятой оферты не меняется.', 'Ryzyko „nie zmieściliśmy się w czasie” jest nasze. Kwota z przyjętej oferty się nie zmienia.', 'Ризик «не встигли вчасно» — наш. Сума з прийнятої оферти не змінюється.', 'The risk of running over time is ours. The amount in the accepted offer doesn’t change.')],
      [l('Пунктуальность', 'Punktualność', 'Пунктуальність', 'Punctuality'), l('Окно прибытия — 30 минут. Опоздаем по своей вине — скидка 100 zł за каждые 30 минут.', 'Okno przyjazdu to 30 minut. Jeśli spóźnimy się z naszej winy — 100 zł rabatu za każde 30 minut.', 'Вікно прибуття — 30 хвилин. Запізнимося з нашої вини — знижка 100 zł за кожні 30 хвилин.', 'A 30-minute arrival window. If we’re late through our own fault, you get 100 zł off for every 30 minutes.')],
      [l('Сохранность', 'Bezpieczeństwo mienia', 'Безпека речей', 'Protection'), l('Защищаем мебель и дом. Если мы что-то повредим — возместим ущерб по процедуре рекламации.', 'Chronimy meble i dom. Jeśli coś uszkodzimy — pokryjemy szkodę zgodnie z procedurą reklamacyjną.', 'Захищаємо меблі й дім. Якщо ми щось пошкодимо — відшкодуємо збитки за процедурою рекламації.', 'We protect your furniture and home. If we damage anything, we’ll compensate you under our complaints procedure.')],
    ] as [L, L][],
    link: l('Условия гарантии', 'Warunki gwarancji', 'Умови гарантії', 'Guarantee terms'),
  },
  facts: [
    [l('5+', '5+', '5+', '5+'), l('лет в логистике', 'lat w logistyce', 'років у логістиці', 'years in logistics')],
    [l('150 км', '150 km', '150 км', '150 km'), l('вокруг Варшавы', 'wokół Warszawy', 'навколо Варшави', 'around Warsaw')],
    [l('≈20', '≈20', '≈20', '≈20'), l('бусов в собственном парке', 'busów we własnej flocie', 'бусів у власному парку', 'vans in our own fleet')],
    [l('7/7', '7/7', '7/7', '7/7'), l('работаем без выходных', 'pracujemy bez dni wolnych', 'працюємо без вихідних', 'no days off')],
  ] as [L, L][],
  area: {
    h2: l('Варшава и 150 км вокруг', 'Warszawa i okolice do 150 km', 'Варшава і 150 км довкола', 'Within 150 km of Warsaw'),
    lead: l('Мокотув, Воля, Урсынов, Прага, Белоленка и все районы города. Пясечно, Прушков, Легионово, Марки и дальше. По Польше и в страны ЕС — по запросу.', 'Mokotów, Wola, Ursynów, Praga, Białołęka i wszystkie dzielnice miasta. Piaseczno, Pruszków, Legionowo, Marki i dalej. Po Polsce i do krajów UE — na zapytanie.', 'Мокотув, Воля, Урсинів, Прага, Бялоленка й усі райони міста. Пясечно, Прушків, Легіоново, Марки й далі. Польщею та до країн ЄС — за запитом.', 'Mokotów, Wola, Ursynów, Praga, Białołęka and every district of the city. Piaseczno, Pruszków, Legionowo, Marki and beyond. Across Poland and to EU countries on request.'),
    mapAria: l('Карта: Варшава в центре, радиус 150 км, ближайшие города', 'Mapa: Warszawa w centrum, promień 150 km, najbliższe miasta', 'Мапа: Варшава в центрі, радіус 150 км, найближчі міста', 'Map: Warsaw in the centre, a 150 km radius, nearby towns'),
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
  finalLead: l('Снимите видео квартиры, дома или офиса — в течение 2 часов пришлём цену, которая не изменится.', 'Nagraj wideo mieszkania, domu lub biura — w ciągu 2 godzin wyślemy cenę, która się nie zmieni.', 'Зніміть відео квартири, будинку чи офісу — протягом 2 годин надішлемо ціну, яка не зміниться.', 'Film your flat, house or office — within 2 hours we’ll send you a price that won’t change.'),
  modalAria: l('Ролик MELBUS: вся квартира в одной коробке', 'Film MELBUS: całe mieszkanie w jednym kartonie', 'Ролик MELBUS: уся квартира в одній коробці', 'MELBUS film: your whole flat in one box'),
};
