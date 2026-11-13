/**
 * Услуги — каждая фраза сразу на 4 языках (ru, pl, uk, en). Меняем текст — меняем на всех языках.
 * id — постоянный ключ (адреса страниц строятся из slug на нужном языке).
 * media — готовый ролик для первого экрана страницы услуги (public/video).
 */
import type { L } from '../i18n/text';
import type { Locale } from '../i18n/routes';

export interface Service {
  id: string;
  slug: L;
  group: 'move' | 'extra';
  title: L;
  short: L;
  lead: L;
  includes: L[];
  media: { video: string; poster: string };
}

const V = {
  film: { video: '/video/film-1280.mp4', poster: '/scenes/film/poster-d.webp' },
  pack: { video: '/video/pack.mp4', poster: '/img/site/pack.webp' },
  van: { video: '/video/van.mp4', poster: '/img/site/van-side.webp' },
  gloves: { video: '/video/gloves.mp4', poster: '/img/site/gloves.webp' },
  tape: { video: '/video/tape.mp4', poster: '/img/site/tape.webp' },
};

export const services: Service[] = [
  {
    id: 'pereezd-kvartiry', group: 'move', media: V.film,
    slug: { ru: 'pereezd-kvartiry', pl: 'przeprowadzka-mieszkania', uk: 'pereyizd-kvartyry', en: 'flat-moving' },
    title: { ru: 'Переезд квартиры', pl: 'Przeprowadzka mieszkania', uk: 'Переїзд квартири', en: 'Flat move' },
    short: { ru: 'Студии, 2–4 комнаты', pl: 'Kawalerki, 2–4 pokoje', uk: 'Студії, 2–4 кімнати', en: 'Studios, 2–4 rooms' },
    lead: { ru: 'Упакуем, перевезём и расставим всё по местам. Цена фиксируется по видео и не меняется в день переезда.', pl: 'Spakujemy, przewieziemy i ustawimy wszystko na swoje miejsca. Cenę ustalamy z wideo i nie zmienia się w dniu przeprowadzki.', uk: 'Запакуємо, перевеземо й розставимо все по місцях. Ціну фіксуємо за відео, і вона не змінюється в день переїзду.', en: 'We pack, move and put everything in place. The price is fixed from a video and doesn’t change on moving day.' },
    includes: [
      { ru: 'Защита полов и дверных проёмов', pl: 'Zabezpieczenie podłóg i futryn', uk: 'Захист підлог і дверних прорізів', en: 'Floor and door frame protection' },
      { ru: 'Плёнка, одеяла и ремни для мебели', pl: 'Folia, koce i pasy do mebli', uk: 'Плівка, ковдри й ремені для меблів', en: 'Film, blankets and straps for furniture' },
      { ru: 'Разборка и сборка мебели', pl: 'Demontaż i montaż mebli', uk: 'Розбирання та збирання меблів', en: 'Furniture disassembly and assembly' },
      { ru: 'Расстановка по комнатам', pl: 'Ustawienie w pokojach', uk: 'Розстановка по кімнатах', en: 'Everything placed room by room' },
    ],
  },
  {
    id: 'pereezd-doma', group: 'move', media: V.pack,
    slug: { ru: 'pereezd-doma', pl: 'przeprowadzka-domu', uk: 'pereyizd-budynku', en: 'house-moving' },
    title: { ru: 'Переезд дома', pl: 'Przeprowadzka domu', uk: 'Переїзд будинку', en: 'House move' },
    short: { ru: 'Дома и таунхаусы', pl: 'Domy i szeregowce', uk: 'Будинки й таунхауси', en: 'Houses and townhouses' },
    lead: { ru: 'Большие объёмы, несколько бусов, сад и гараж. Один координатор от оценки до последней коробки.', pl: 'Duże objętości, kilka busów, ogród i garaż. Jeden koordynator od wyceny po ostatni karton.', uk: 'Великі обсяги, кілька бусів, сад і гараж. Один координатор від оцінки до останньої коробки.', en: 'Large volumes, several vans, garden and garage. One coordinator from the quote to the last box.' },
    includes: [
      { ru: 'Несколько бусов в один день', pl: 'Kilka busów jednego dnia', uk: 'Кілька бусів в один день', en: 'Several vans on one day' },
      { ru: 'Координатор переезда', pl: 'Koordynator przeprowadzki', uk: 'Координатор переїзду', en: 'A move coordinator' },
      { ru: 'Гараж, подвал, сад', pl: 'Garaż, piwnica, ogród', uk: 'Гараж, підвал, сад', en: 'Garage, basement, garden' },
      { ru: 'Упаковка под ключ', pl: 'Pakowanie pod klucz', uk: 'Пакування під ключ', en: 'Full packing service' },
    ],
  },
  {
    id: 'pereezd-ofisa', group: 'move', media: V.van,
    slug: { ru: 'pereezd-ofisa', pl: 'przeprowadzka-biura', uk: 'pereyizd-ofisu', en: 'office-moving' },
    title: { ru: 'Переезд офиса', pl: 'Przeprowadzka biura', uk: 'Переїзд офісу', en: 'Office move' },
    short: { ru: 'Ночью и в выходные', pl: 'Nocą i w weekendy', uk: 'Уночі та у вихідні', en: 'Nights and weekends' },
    lead: { ru: 'Переезжаем, пока вы не работаете: вечером в пятницу начали, в понедельник офис работает.', pl: 'Przenosimy biuro, kiedy nie pracujecie: zaczynamy w piątek wieczorem, w poniedziałek biuro działa.', uk: 'Переїжджаємо, поки ви не працюєте: почали в п’ятницю ввечері — у понеділок офіс працює.', en: 'We move while you’re closed: we start on Friday evening, and on Monday the office is up and running.' },
    includes: [
      { ru: 'Работа ночью и в выходные', pl: 'Praca nocą i w weekendy', uk: 'Робота вночі та у вихідні', en: 'Night and weekend work' },
      { ru: 'Маркировка рабочих мест', pl: 'Oznaczenie stanowisk pracy', uk: 'Маркування робочих місць', en: 'Workstation labelling' },
      { ru: 'Техника и серверные шкафы', pl: 'Sprzęt i szafy serwerowe', uk: 'Техніка й серверні шафи', en: 'Equipment and server racks' },
      { ru: 'Фактура VAT', pl: 'Faktura VAT', uk: 'Фактура VAT', en: 'VAT invoice' },
    ],
  },
  {
    id: 'perevozka-mebeli', group: 'move', media: V.van,
    slug: { ru: 'perevozka-mebeli', pl: 'transport-mebli', uk: 'perevezennya-mebliv', en: 'furniture-transport' },
    title: { ru: 'Перевозка мебели и вещей', pl: 'Transport mebli i rzeczy', uk: 'Перевезення меблів і речей', en: 'Furniture and item transport' },
    short: { ru: 'Диван из магазина, OLX', pl: 'Sofa ze sklepu, OLX', uk: 'Диван із магазину, OLX', en: 'A sofa from a shop or OLX' },
    lead: { ru: 'Один предмет или несколько: заберём из магазина или у продавца и занесём до нужной комнаты.', pl: 'Jedna rzecz czy kilka: odbierzemy ze sklepu lub od sprzedawcy i wniesiemy do właściwego pokoju.', uk: 'Одна річ чи кілька: заберемо з магазину чи від продавця й занесемо до потрібної кімнати.', en: 'One item or several: we collect it from the shop or seller and carry it into the right room.' },
    includes: [
      { ru: 'Фиксированная цена за поездку', pl: 'Stała cena za kurs', uk: 'Фіксована ціна за поїздку', en: 'Fixed price per trip' },
      { ru: 'Занос на этаж', pl: 'Wniesienie na piętro', uk: 'Занесення на поверх', en: 'Carrying upstairs' },
      { ru: 'Упаковка в плёнку', pl: 'Zabezpieczenie folią', uk: 'Пакування в плівку', en: 'Wrapped in film' },
      { ru: 'Удобное окно доставки', pl: 'Wygodne okno dostawy', uk: 'Зручне вікно доставки', en: 'A convenient delivery window' },
    ],
  },
  {
    id: 'pianino-i-seyfy', group: 'move', media: V.gloves,
    slug: { ru: 'pianino-i-seyfy', pl: 'pianina-i-sejfy', uk: 'pianino-i-seyfy', en: 'pianos-and-safes' },
    title: { ru: 'Пианино и сейфы', pl: 'Pianina i sejfy', uk: 'Піаніно та сейфи', en: 'Pianos and safes' },
    short: { ru: 'Тяжёлое и ценное', pl: 'Ciężkie i cenne', uk: 'Важке й цінне', en: 'Heavy and valuable' },
    lead: { ru: 'Специальные ремни, такелаж и опытная бригада для тяжёлых и хрупких предметов.', pl: 'Specjalne pasy, sprzęt do przenoszenia i doświadczona ekipa do ciężkich i delikatnych przedmiotów.', uk: 'Спеціальні ремені, такелаж і досвідчена бригада для важких і крихких речей.', en: 'Special straps, rigging gear and an experienced crew for heavy and fragile items.' },
    includes: [
      { ru: 'Такелажные ремни и тележки', pl: 'Pasy transportowe i wózki', uk: 'Такелажні ремені й візки', en: 'Lifting straps and dollies' },
      { ru: 'Защита лестниц', pl: 'Zabezpieczenie schodów', uk: 'Захист сходів', en: 'Stair protection' },
      { ru: 'Бригада 3–4 человека', pl: 'Ekipa 3–4 osoby', uk: 'Бригада 3–4 особи', en: 'A crew of 3–4' },
      { ru: 'Страхование груза', pl: 'Ubezpieczenie ładunku', uk: 'Страхування вантажу', en: 'Cargo insurance' },
    ],
  },
  {
    id: 'mezhdugorodnie', group: 'move', media: V.van,
    slug: { ru: 'mezhdugorodnie', pl: 'przeprowadzki-miedzymiastowe', uk: 'mizhmiski-pereyizdy', en: 'long-distance-moves' },
    title: { ru: 'Междугородние переезды', pl: 'Przeprowadzki międzymiastowe', uk: 'Міжміські переїзди', en: 'Long-distance moves' },
    short: { ru: 'По всей Польше', pl: 'Po całej Polsce', uk: 'По всій Польщі', en: 'Across Poland' },
    lead: { ru: 'Варшава → Краков, Гданьск, Вроцлав и любой город. Один бус только под ваши вещи.', pl: 'Warszawa → Kraków, Gdańsk, Wrocław i każde inne miasto. Jeden bus tylko na Twoje rzeczy.', uk: 'Варшава → Краків, Гданськ, Вроцлав і будь-яке місто. Один бус лише під ваші речі.', en: 'Warsaw → Kraków, Gdańsk, Wrocław or any city. One van just for your things.' },
    includes: [
      { ru: 'Без перегрузки в пути', pl: 'Bez przeładunku po drodze', uk: 'Без перевантаження в дорозі', en: 'No reloading on the way' },
      { ru: 'Фиксированная цена', pl: 'Stała cena', uk: 'Фіксована ціна', en: 'Fixed price' },
      { ru: 'Доставка в оговорённый день', pl: 'Dostawa w ustalonym dniu', uk: 'Доставка в узгоджений день', en: 'Delivery on the agreed day' },
      { ru: 'Сборка на месте', pl: 'Montaż na miejscu', uk: 'Збирання на місці', en: 'Assembly on site' },
    ],
  },
  {
    id: 'po-evrope', group: 'move', media: V.van,
    slug: { ru: 'po-evrope', pl: 'przeprowadzki-zagraniczne', uk: 'pereyizdy-yevropoyu', en: 'moves-in-europe' },
    title: { ru: 'Переезды по Европе', pl: 'Przeprowadzki po Europie', uk: 'Переїзди Європою', en: 'Moves across Europe' },
    short: { ru: 'Германия, Нидерланды и др.', pl: 'Niemcy, Holandia i inne', uk: 'Німеччина, Нідерланди та ін.', en: 'Germany, the Netherlands and more' },
    lead: { ru: 'Переезды в страны ЕС с одним бусом и одной бригадой от двери до двери.', pl: 'Przeprowadzki do krajów UE jednym busem i z jedną ekipą, od drzwi do drzwi.', uk: 'Переїзди до країн ЄС одним бусом і однією бригадою від дверей до дверей.', en: 'Moves to EU countries with one van and one crew, door to door.' },
    includes: [
      { ru: 'Отдельный бус под ваш груз', pl: 'Osobny bus na Twój ładunek', uk: 'Окремий бус під ваш вантаж', en: 'A dedicated van for your load' },
      { ru: 'Документы и страховка', pl: 'Dokumenty i ubezpieczenie', uk: 'Документи й страховка', en: 'Documents and insurance' },
      { ru: 'Связь с водителем в пути', pl: 'Kontakt z kierowcą w trasie', uk: 'Зв’язок із водієм у дорозі', en: 'Contact with the driver on the way' },
      { ru: 'Разгрузка и сборка', pl: 'Rozładunek i montaż', uk: 'Розвантаження та збирання', en: 'Unloading and assembly' },
    ],
  },
  {
    id: 'upakovka', group: 'extra', media: V.gloves,
    slug: { ru: 'upakovka', pl: 'pakowanie', uk: 'pakuvannya', en: 'packing' },
    title: { ru: 'Упаковка', pl: 'Pakowanie', uk: 'Пакування', en: 'Packing' },
    short: { ru: 'Под ключ или только хрупкое', pl: 'Kompleksowo lub tylko delikatne rzeczy', uk: 'Під ключ або лише крихке', en: 'Everything or just the fragile items' },
    lead: { ru: 'Каждую вещь упакуем как свою: посуда в бумагу, техника в плёнку, одежда в гардеробные коробки.', pl: 'Każdą rzecz pakujemy jak własną: naczynia w papier, sprzęt w folię, ubrania do kartonów garderobianych.', uk: 'Кожну річ запакуємо як свою: посуд у папір, техніку в плівку, одяг у гардеробні коробки.', en: 'We pack every item as if it were our own: dishes in paper, electronics in film, clothes in wardrobe boxes.' },
    includes: [
      { ru: 'Белые фирменные коробки', pl: 'Białe firmowe kartony', uk: 'Білі фірмові коробки', en: 'White branded boxes' },
      { ru: 'Наклейки по комнатам и QR', pl: 'Naklejki pokoi i kod QR', uk: 'Наліпки за кімнатами та QR', en: 'Room labels and QR codes' },
      { ru: 'Пузырчатая плёнка и бумага', pl: 'Folia bąbelkowa i papier', uk: 'Бульбашкова плівка й папір', en: 'Bubble wrap and paper' },
      { ru: 'Распаковка на месте', pl: 'Rozpakowanie na miejscu', uk: 'Розпакування на місці', en: 'Unpacking on site' },
    ],
  },
  {
    id: 'korobki', group: 'extra', media: V.tape,
    slug: { ru: 'korobki', pl: 'kartony', uk: 'korobky', en: 'boxes' },
    title: { ru: 'Коробки и материалы', pl: 'Kartony i materiały', uk: 'Коробки й матеріали', en: 'Boxes and materials' },
    short: { ru: 'Доставим заранее', pl: 'Dostarczymy wcześniej', uk: 'Доставимо заздалегідь', en: 'Delivered in advance' },
    lead: { ru: 'Белые фирменные коробки, скотч, плёнка и наклейки — привезём за несколько дней до переезда.', pl: 'Białe firmowe kartony, taśma, folia i naklejki — przywieziemy kilka dni przed przeprowadzką.', uk: 'Білі фірмові коробки, скотч, плівка й наліпки — привеземо за кілька днів до переїзду.', en: 'White branded boxes, tape, film and labels — delivered a few days before your move.' },
    includes: [
      { ru: 'Наборы под размер квартиры', pl: 'Zestawy dopasowane do mieszkania', uk: 'Набори під розмір квартири', en: 'Sets sized to your flat' },
      { ru: 'Гардеробные коробки', pl: 'Kartony garderobiane', uk: 'Гардеробні коробки', en: 'Wardrobe boxes' },
      { ru: 'Коробки для посуды', pl: 'Kartony na naczynia', uk: 'Коробки для посуду', en: 'Boxes for dishes' },
      { ru: 'Возврат неиспользованных', pl: 'Zwrot niewykorzystanych', uk: 'Повернення невикористаних', en: 'Unused boxes taken back' },
    ],
  },
  {
    id: 'sborka-mebeli', group: 'extra', media: V.pack,
    slug: { ru: 'sborka-mebeli', pl: 'montaz-mebli', uk: 'zbyrannya-mebliv', en: 'furniture-assembly' },
    title: { ru: 'Разборка и сборка мебели', pl: 'Demontaż i montaż mebli', uk: 'Розбирання та збирання меблів', en: 'Furniture disassembly and assembly' },
    short: { ru: 'Шкафы, кровати, кухни', pl: 'Szafy, łóżka, kuchnie', uk: 'Шафи, ліжка, кухні', en: 'Wardrobes, beds, kitchens' },
    lead: { ru: 'Разберём, промаркируем каждую деталь и соберём на новом месте.', pl: 'Rozkręcimy, oznaczymy każdą część i złożymy w nowym miejscu.', uk: 'Розберемо, промаркуємо кожну деталь і зберемо на новому місці.', en: 'We take it apart, label every part and reassemble it at your new place.' },
    includes: [
      { ru: 'Маркировка деталей', pl: 'Oznaczenie części', uk: 'Маркування деталей', en: 'Labelled parts' },
      { ru: 'Свои инструменты', pl: 'Własne narzędzia', uk: 'Власні інструменти', en: 'Our own tools' },
      { ru: 'Крепёж в подписанных пакетах', pl: 'Okucia w opisanych woreczkach', uk: 'Кріплення в підписаних пакетах', en: 'Fittings in labelled bags' },
      { ru: 'Навеска полок и ТВ', pl: 'Wieszanie półek i telewizora', uk: 'Навішування полиць і ТВ', en: 'Mounting shelves and TVs' },
    ],
  },
  {
    id: 'vyvoz-mebeli', group: 'extra', media: V.van,
    slug: { ru: 'vyvoz-mebeli', pl: 'wywoz-mebli', uk: 'vyviz-mebliv', en: 'furniture-removal' },
    title: { ru: 'Вывоз мебели и утилизация', pl: 'Wywóz mebli i utylizacja', uk: 'Вивезення меблів і утилізація', en: 'Furniture removal and disposal' },
    short: { ru: 'Старая мебель и техника', pl: 'Stare meble i sprzęt', uk: 'Старі меблі й техніка', en: 'Old furniture and appliances' },
    lead: { ru: 'Заберём то, что не едет с вами, и сдадим на переработку по правилам.', pl: 'Zabierzemy to, co nie jedzie z Tobą, i oddamy do recyklingu zgodnie z przepisami.', uk: 'Заберемо те, що не їде з вами, і здамо на переробку за правилами.', en: 'We take what’s not coming with you and recycle it properly.' },
    includes: [
      { ru: 'Вынос с любого этажа', pl: 'Zniesienie z każdego piętra', uk: 'Винесення з будь-якого поверху', en: 'Carried down from any floor' },
      { ru: 'Сдача на переработку', pl: 'Oddanie do recyklingu', uk: 'Здача на переробку', en: 'Recycling' },
      { ru: 'Техника и электроника', pl: 'Sprzęt AGD i elektronika', uk: 'Техніка й електроніка', en: 'Appliances and electronics' },
      { ru: 'Вместе с переездом дешевле', pl: 'Taniej razem z przeprowadzką', uk: 'Разом із переїздом дешевше', en: 'Cheaper together with a move' },
    ],
  },
  {
    id: 'uborka', group: 'extra', media: V.pack,
    slug: { ru: 'uborka', pl: 'sprzatanie', uk: 'prybyrannya', en: 'cleaning' },
    title: { ru: 'Уборка после переезда', pl: 'Sprzątanie po przeprowadzce', uk: 'Прибирання після переїзду', en: 'Move-out cleaning' },
    short: { ru: 'Сдача квартиры владельцу', pl: 'Oddanie mieszkania właścicielowi', uk: 'Здача квартири власнику', en: 'Handing the flat back to the landlord' },
    lead: { ru: 'Уберём старую квартиру после выезда, чтобы вы спокойно вернули залог.', pl: 'Posprzątamy stare mieszkanie po wyprowadzce — kaucja wróci do Ciebie bez nerwów.', uk: 'Приберемо стару квартиру після виїзду, щоб ви спокійно повернули заставу.', en: 'We clean your old flat after you move out, so you get your deposit back without stress.' },
    includes: [
      { ru: 'Генеральная уборка', pl: 'Sprzątanie generalne', uk: 'Генеральне прибирання', en: 'Deep cleaning' },
      { ru: 'Кухня и санузел', pl: 'Kuchnia i łazienka', uk: 'Кухня й санвузол', en: 'Kitchen and bathroom' },
      { ru: 'Окна по запросу', pl: 'Okna na życzenie', uk: 'Вікна на запит', en: 'Windows on request' },
      { ru: 'Фото-отчёт', pl: 'Fotorelacja', uk: 'Фотозвіт', en: 'Photo report' },
    ],
  },
];

export const serviceById = (id: string) => services.find((s) => s.id === id);
export const serviceSlug = (id: string, locale: Locale) => serviceById(id)?.slug[locale] ?? id;

// подписи раздела услуг
export const servicesText = {
  groups: { move: { ru: 'Переезды', pl: 'Przeprowadzki', uk: 'Переїзди', en: 'Moves' }, extra: { ru: 'Дополнительные услуги', pl: 'Usługi dodatkowe', uk: 'Додаткові послуги', en: 'Extra services' } },
  eyebrow: { ru: 'Услуги', pl: 'Usługi', uk: 'Послуги', en: 'Services' },
  title: { ru: 'Всё для переезда<br>в одних руках', pl: 'Wszystko do przeprowadzki<br>w jednych rękach', uk: 'Усе для переїзду<br>в одних руках', en: 'Everything for your move<br>in one place' },
  lead: { ru: 'От одной коробки до офиса на три этажа. Каждая услуга — с фиксированной ценой и бригадой MELBUS.', pl: 'Od jednego kartonu po biuro na trzech piętrach. Każda usługa ze stałą ceną i ekipą MELBUS.', uk: 'Від однієї коробки до офісу на три поверхи. Кожна послуга — з фіксованою ціною та бригадою MELBUS.', en: 'From a single box to a three-floor office. Every service with a fixed price and a MELBUS crew.' },
  one: { ru: 'Услуга', pl: 'Usługa', uk: 'Послуга', en: 'Service' },
  incEyebrow: { ru: 'Что входит', pl: 'Co obejmuje', uk: 'Що входить', en: 'What’s included' },
  incTitle: { ru: 'Включено<br>в фиксированную цену', pl: 'W stałej<br>cenie', uk: 'Включено<br>у фіксовану ціну', en: 'Included<br>in the fixed price' },
  more: { ru: 'Ещё услуги', pl: 'Inne usługi', uk: 'Інші послуги', en: 'More services' },
} satisfies Record<string, L | Record<string, L>>;
