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
    lead: { ru: 'Упакуем, перевезём и расставим всё по местам. Цена фиксируется по видео и не меняется в день переезда.', pl: 'Spakujemy, przewieziemy i ustawimy wszystko na swoje miejsca. Cenę ustalamy na podstawie wideo i w dniu przeprowadzki już się nie zmienia.', uk: 'Запакуємо, перевеземо й розставимо все по місцях. Ціну фіксуємо за відео, і вона не змінюється в день переїзду.', en: 'We pack, move and put everything where it belongs. The price is set from a video and won’t change on moving day.' },
    includes: [
      { ru: 'Защита полов и дверных проёмов', pl: 'Zabezpieczenie podłóg i futryn', uk: 'Захист підлог і дверних прорізів', en: 'Floor and door-frame protection' },
      { ru: 'Плёнка, одеяла и ремни для мебели', pl: 'Folia, koce i pasy do mebli', uk: 'Плівка, ковдри й ремені для меблів', en: 'Stretch wrap, blankets and straps for furniture' },
      { ru: 'Разборка и сборка мебели', pl: 'Demontaż i montaż mebli', uk: 'Розбирання та збирання меблів', en: 'Furniture disassembly and assembly' },
      { ru: 'Расстановка по комнатам', pl: 'Rozstawienie rzeczy po pokojach', uk: 'Розстановка по кімнатах', en: 'Everything placed room by room' },
    ],
  },
  {
    id: 'pereezd-doma', group: 'move', media: V.pack,
    slug: { ru: 'pereezd-doma', pl: 'przeprowadzka-domu', uk: 'pereyizd-budynku', en: 'house-moving' },
    title: { ru: 'Переезд дома', pl: 'Przeprowadzka domu', uk: 'Переїзд будинку', en: 'House move' },
    short: { ru: 'Дома и таунхаусы', pl: 'Domy i szeregowce', uk: 'Будинки й таунхауси', en: 'Houses and townhouses' },
    lead: { ru: 'Большие объёмы, несколько бусов, сад и гараж. Один координатор от оценки до последней коробки.', pl: 'Dużo rzeczy, kilka busów, ogród i garaż. Jeden koordynator od wyceny po ostatni karton.', uk: 'Великі обсяги, кілька бусів, сад і гараж. Один координатор від оцінки до останньої коробки.', en: 'Lots of belongings, several vans, the garden and the garage. One coordinator from the quote to the last box.' },
    includes: [
      { ru: 'Несколько бусов в один день', pl: 'Kilka busów jednego dnia', uk: 'Кілька бусів в один день', en: 'Several vans on the same day' },
      { ru: 'Координатор переезда', pl: 'Koordynator przeprowadzki', uk: 'Координатор переїзду', en: 'A move coordinator' },
      { ru: 'Гараж, подвал, сад', pl: 'Garaż, piwnica, ogród', uk: 'Гараж, підвал, сад', en: 'Garage, basement, garden' },
      { ru: 'Упаковка всех вещей', pl: 'Pakowanie wszystkich rzeczy', uk: 'Пакування всіх речей', en: 'Full packing service' },
    ],
  },
  {
    id: 'pereezd-ofisa', group: 'move', media: V.van,
    slug: { ru: 'pereezd-ofisa', pl: 'przeprowadzka-biura', uk: 'pereyizd-ofisu', en: 'office-moving' },
    title: { ru: 'Переезд офиса', pl: 'Przeprowadzka biura', uk: 'Переїзд офісу', en: 'Office move' },
    short: { ru: 'Ночью и в выходные', pl: 'Nocą i w weekendy', uk: 'Уночі та у вихідні', en: 'Nights and weekends' },
    lead: { ru: 'Перевозим офис в нерабочее время: начинаем в пятницу вечером, а в понедельник всё уже работает.', pl: 'Przenosimy biuro poza godzinami pracy: zaczynamy w piątek wieczorem, a w poniedziałek wszystko już działa.', uk: 'Перевозимо офіс у неробочий час: починаємо в п’ятницю ввечері, а в понеділок усе вже працює.', en: 'We move your office out of hours: we start on Friday evening, and by Monday everything is up and running.' },
    includes: [
      { ru: 'Работа ночью и в выходные', pl: 'Praca nocą i w weekendy', uk: 'Робота вночі та у вихідні', en: 'Night and weekend work' },
      { ru: 'Маркировка рабочих мест', pl: 'Oznaczenie stanowisk pracy', uk: 'Маркування робочих місць', en: 'Workstation labelling' },
      { ru: 'Техника и серверные шкафы', pl: 'Sprzęt i szafy serwerowe', uk: 'Техніка й серверні шафи', en: 'Office equipment and server racks' },
      { ru: 'Фактура VAT', pl: 'Faktura VAT', uk: 'Фактура VAT', en: 'VAT invoice' },
    ],
  },
  {
    id: 'perevozka-mebeli', group: 'move', media: V.van,
    slug: { ru: 'perevozka-mebeli', pl: 'transport-mebli', uk: 'perevezennya-mebliv', en: 'furniture-transport' },
    title: { ru: 'Перевозка мебели и вещей', pl: 'Transport mebli i rzeczy', uk: 'Перевезення меблів і речей', en: 'Transporting furniture and other items' },
    short: { ru: 'Диван из магазина или с OLX', pl: 'Sofa ze sklepu lub z OLX', uk: 'Диван із магазину чи з OLX', en: 'A sofa from a shop or from OLX' },
    lead: { ru: 'Один предмет или несколько: заберём из магазина или у продавца и занесём в нужную комнату.', pl: 'Jedna rzecz czy kilka: odbierzemy ze sklepu lub od sprzedawcy i wniesiemy do właściwego pokoju.', uk: 'Одна річ чи кілька: заберемо з магазину чи від продавця й занесемо до потрібної кімнати.', en: 'One item or several: we collect from the shop or the seller and carry everything into the right room.' },
    includes: [
      { ru: 'Фиксированная цена за поездку', pl: 'Stała cena za kurs', uk: 'Фіксована ціна за поїздку', en: 'Fixed price per trip' },
      { ru: 'Подъём на этаж', pl: 'Wniesienie na piętro', uk: 'Підйом на поверх', en: 'Carried up to your floor' },
      { ru: 'Упаковка в плёнку', pl: 'Zabezpieczenie folią', uk: 'Пакування в плівку', en: 'Protective stretch wrap' },
      { ru: 'Удобное время доставки', pl: 'Dostawa o dogodnej porze', uk: 'Зручний час доставки', en: 'A delivery time that suits you' },
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
      { ru: 'Бригада из 3–4 человек', pl: 'Ekipa 3–4 osób', uk: 'Бригада з 3–4 осіб', en: 'A crew of 3–4' },
      { ru: 'Страхование груза', pl: 'Ubezpieczenie ładunku', uk: 'Страхування вантажу', en: 'Cargo insurance' },
    ],
  },
  {
    id: 'mezhdugorodnie', group: 'move', media: V.van,
    slug: { ru: 'mezhdugorodnie', pl: 'przeprowadzki-miedzymiastowe', uk: 'mizhmiski-pereyizdy', en: 'long-distance-moves' },
    title: { ru: 'Междугородние переезды', pl: 'Przeprowadzki międzymiastowe', uk: 'Міжміські переїзди', en: 'Long-distance moves' },
    short: { ru: 'По всей Польше', pl: 'Po całej Polsce', uk: 'По всій Польщі', en: 'Across Poland' },
    lead: { ru: 'Из Варшавы в Краков, Гданьск, Вроцлав или любой другой город. Бус едет только с вашими вещами.', pl: 'Z Warszawy do Krakowa, Gdańska, Wrocławia lub każdego innego miasta. Bus wiezie tylko Twoje rzeczy.', uk: 'З Варшави до Кракова, Гданська, Вроцлава чи будь-якого іншого міста. Бус везе лише ваші речі.', en: 'From Warsaw to Kraków, Gdańsk, Wrocław or any other city. The van carries only your things.' },
    includes: [
      { ru: 'Без перегрузок и чужих грузов', pl: 'Bez przeładunków i doładunków', uk: 'Без перевантажень і чужих вантажів', en: 'No reloading, no other loads' },
      { ru: 'Фиксированная цена', pl: 'Stała cena', uk: 'Фіксована ціна', en: 'Fixed price' },
      { ru: 'Доставка в оговорённый день', pl: 'Dostawa w ustalonym dniu', uk: 'Доставка в узгоджений день', en: 'Delivery on the agreed day' },
      { ru: 'Сборка на месте', pl: 'Montaż na miejscu', uk: 'Збирання на місці', en: 'Assembly on site' },
    ],
  },
  {
    id: 'po-evrope', group: 'move', media: V.van,
    slug: { ru: 'po-evrope', pl: 'przeprowadzki-zagraniczne', uk: 'pereyizdy-yevropoyu', en: 'moves-in-europe' },
    title: { ru: 'Переезды по Европе', pl: 'Przeprowadzki po Europie', uk: 'Переїзди Європою', en: 'Moves across Europe' },
    short: { ru: 'Германия, Нидерланды и другие страны ЕС', pl: 'Niemcy, Holandia i inne kraje UE', uk: 'Німеччина, Нідерланди та інші країни ЄС', en: 'Germany, the Netherlands and other EU countries' },
    lead: { ru: 'Переезды в страны ЕС от двери до двери: один бус и одна бригада на всём пути.', pl: 'Przeprowadzki do krajów UE od drzwi do drzwi: jeden bus i jedna ekipa przez całą drogę.', uk: 'Переїзди до країн ЄС від дверей до дверей: один бус і одна бригада на всьому шляху.', en: 'Moves to EU countries, door to door: one van and one crew all the way.' },
    includes: [
      { ru: 'Отдельный бус для ваших вещей', pl: 'Osobny bus tylko na Twoje rzeczy', uk: 'Окремий бус для ваших речей', en: 'A dedicated van for your belongings' },
      { ru: 'Документы и страховка', pl: 'Dokumenty i ubezpieczenie', uk: 'Документи й страхування', en: 'Documents and insurance' },
      { ru: 'Связь с водителем в пути', pl: 'Kontakt z kierowcą w trasie', uk: 'Зв’язок із водієм у дорозі', en: 'Contact with the driver during the trip' },
      { ru: 'Разгрузка и сборка', pl: 'Rozładunek i montaż', uk: 'Розвантаження та збирання', en: 'Unloading and assembly' },
    ],
  },
  {
    id: 'upakovka', group: 'extra', media: V.gloves,
    slug: { ru: 'upakovka', pl: 'pakowanie', uk: 'pakuvannya', en: 'packing' },
    title: { ru: 'Упаковка', pl: 'Pakowanie', uk: 'Пакування', en: 'Packing' },
    short: { ru: 'Всё или только хрупкое', pl: 'Wszystko albo tylko rzeczy delikatne', uk: 'Усе або лише крихке', en: 'Everything or just the fragile items' },
    lead: { ru: 'Каждую вещь упакуем как свою: посуда в бумагу, техника в плёнку, одежда в гардеробные коробки.', pl: 'Każdą rzecz pakujemy jak własną: naczynia w papier, sprzęt w folię, ubrania do kartonów garderobianych.', uk: 'Кожну річ запакуємо як свою: посуд у папір, техніку в плівку, одяг у гардеробні коробки.', en: 'We pack every item as if it were our own: dishes in paper, electronics in protective wrap, clothes in wardrobe boxes.' },
    includes: [
      { ru: 'Белые фирменные коробки', pl: 'Białe firmowe kartony', uk: 'Білі фірмові коробки', en: 'White branded boxes' },
      { ru: 'Наклейки комнат с QR-кодом', pl: 'Naklejki z oznaczeniem pokoju i kodem QR', uk: 'Наліпки кімнат із QR-кодом', en: 'Room labels with QR codes' },
      { ru: 'Пузырчатая плёнка и бумага', pl: 'Folia bąbelkowa i papier', uk: 'Бульбашкова плівка й папір', en: 'Bubble wrap and paper' },
      { ru: 'Распаковка на месте', pl: 'Rozpakowanie na miejscu', uk: 'Розпакування на місці', en: 'Unpacking on site' },
    ],
  },
  {
    id: 'korobki', group: 'extra', media: V.tape,
    slug: { ru: 'korobki', pl: 'kartony', uk: 'korobky', en: 'boxes' },
    title: { ru: 'Коробки и материалы', pl: 'Kartony i materiały', uk: 'Коробки й матеріали', en: 'Boxes and materials' },
    short: { ru: 'Доставим заранее', pl: 'Dostarczymy z wyprzedzeniem', uk: 'Доставимо заздалегідь', en: 'Delivered in advance' },
    lead: { ru: 'Белые фирменные коробки, скотч, плёнка и наклейки — привезём за несколько дней до переезда.', pl: 'Białe firmowe kartony, taśma, folia i naklejki — przywieziemy kilka dni przed przeprowadzką.', uk: 'Білі фірмові коробки, скотч, плівка й наліпки — привеземо за кілька днів до переїзду.', en: 'White branded boxes, tape, stretch wrap and labels — delivered a few days before your move.' },
    includes: [
      { ru: 'Наборы под размер квартиры', pl: 'Zestawy dopasowane do wielkości mieszkania', uk: 'Набори під розмір квартири', en: 'Sets sized to your flat' },
      { ru: 'Гардеробные коробки', pl: 'Kartony garderobiane', uk: 'Гардеробні коробки', en: 'Wardrobe boxes' },
      { ru: 'Коробки для посуды', pl: 'Kartony na naczynia', uk: 'Коробки для посуду', en: 'Boxes for dishes' },
      { ru: 'Возврат неиспользованных коробок', pl: 'Zwrot niewykorzystanych kartonów', uk: 'Повернення невикористаних коробок', en: 'Unused boxes taken back' },
    ],
  },
  {
    id: 'sborka-mebeli', group: 'extra', media: V.pack,
    slug: { ru: 'sborka-mebeli', pl: 'montaz-mebli', uk: 'zbyrannya-mebliv', en: 'furniture-assembly' },
    title: { ru: 'Разборка и сборка мебели', pl: 'Demontaż i montaż mebli', uk: 'Розбирання та збирання меблів', en: 'Furniture disassembly and assembly' },
    short: { ru: 'Шкафы, кровати, кухни', pl: 'Szafy, łóżka, kuchnie', uk: 'Шафи, ліжка, кухні', en: 'Wardrobes, beds, kitchens' },
    lead: { ru: 'Разберём, промаркируем каждую деталь и соберём на новом месте.', pl: 'Rozkręcimy, oznaczymy każdą część i złożymy w nowym miejscu.', uk: 'Розберемо, промаркуємо кожну деталь і зберемо на новому місці.', en: 'We take it apart, label every part and reassemble it at your new place.' },
    includes: [
      { ru: 'Маркировка деталей', pl: 'Oznaczenie części', uk: 'Маркування деталей', en: 'Every part labelled' },
      { ru: 'Свои инструменты', pl: 'Własne narzędzia', uk: 'Власні інструменти', en: 'Our own tools' },
      { ru: 'Крепёж в подписанных пакетах', pl: 'Śruby i okucia w opisanych woreczkach', uk: 'Кріплення в підписаних пакетах', en: 'Fittings in labelled bags' },
      { ru: 'Монтаж полок и телевизора на стену', pl: 'Wieszanie półek i telewizora', uk: 'Монтаж полиць і телевізора на стіну', en: 'Mounting shelves and TVs' },
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
      { ru: 'Сдача на переработку', pl: 'Oddanie do recyklingu', uk: 'Передача на переробку', en: 'Recycling' },
      { ru: 'Техника и электроника', pl: 'Sprzęt AGD i elektronika', uk: 'Техніка й електроніка', en: 'Appliances and electronics' },
      { ru: 'Вместе с переездом дешевле', pl: 'Taniej razem z przeprowadzką', uk: 'Разом із переїздом дешевше', en: 'Cheaper together with a move' },
    ],
  },
  {
    id: 'uborka', group: 'extra', media: V.pack,
    slug: { ru: 'uborka', pl: 'sprzatanie', uk: 'prybyrannya', en: 'cleaning' },
    title: { ru: 'Уборка после переезда', pl: 'Sprzątanie po przeprowadzce', uk: 'Прибирання після переїзду', en: 'Move-out cleaning' },
    short: { ru: 'Сдача квартиры владельцу', pl: 'Oddanie mieszkania właścicielowi', uk: 'Передача квартири власникові', en: 'Handing the flat back to the landlord' },
    lead: { ru: 'Уберём старую квартиру после выезда, чтобы вы спокойно вернули залог.', pl: 'Posprzątamy stare mieszkanie po wyprowadzce — kaucja wróci do Ciebie bez nerwów.', uk: 'Приберемо стару квартиру після виїзду, щоб ви спокійно повернули заставу.', en: 'We clean your old flat after you move out, so you get your deposit back without stress.' },
    includes: [
      { ru: 'Генеральная уборка', pl: 'Sprzątanie generalne', uk: 'Генеральне прибирання', en: 'Deep cleaning' },
      { ru: 'Кухня и санузел', pl: 'Kuchnia i łazienka', uk: 'Кухня й санвузол', en: 'Kitchen and bathroom' },
      { ru: 'Окна по запросу', pl: 'Okna na życzenie', uk: 'Вікна на запит', en: 'Windows on request' },
      { ru: 'Фотоотчёт', pl: 'Fotorelacja', uk: 'Фотозвіт', en: 'Photo report' },
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
  lead: { ru: 'От одной коробки до офиса на три этажа. Каждая услуга — с фиксированной ценой и бригадой MELBUS.', pl: 'Od jednego kartonu po biuro na trzech piętrach. Każda usługa ze stałą ceną i ekipą MELBUS.', uk: 'Від однієї коробки до офісу на три поверхи. Кожна послуга — з фіксованою ціною та бригадою MELBUS.', en: 'From a single box to a three-floor office. Every service comes with a fixed price and a MELBUS crew.' },
  one: { ru: 'Услуга', pl: 'Usługa', uk: 'Послуга', en: 'Service' },
  incEyebrow: { ru: 'Что входит', pl: 'Co obejmuje', uk: 'Що входить', en: 'What’s included' },
  incTitle: { ru: 'Включено<br>в фиксированную цену', pl: 'Wliczone<br>w stałą cenę', uk: 'Включено<br>у фіксовану ціну', en: 'Included<br>in the fixed price' },
  more: { ru: 'Ещё услуги', pl: 'Inne usługi', uk: 'Інші послуги', en: 'More services' },
} satisfies Record<string, L | Record<string, L>>;
