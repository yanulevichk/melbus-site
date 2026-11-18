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
  /** 3D-иконка: public/img/icons/<icon>.webp (tools/icons/cut-icons.py) */
  icon: string;
  title: L;
  short: L;
  lead: L;
  includes: L[];
  media: { video: string; poster: string };
  /** картинка карточки на странице «Услуги» */
  img: string;
}

const V = {
  film: { video: '/video/film-1280.mp4', poster: '/scenes/film/poster-d.webp' },
  pack: { video: '/video/pack.mp4', poster: '/img/site/pack.webp' },
  van: { video: '/video/van.mp4', poster: '/img/site/van-side.webp' },
  gloves: { video: '/video/gloves.mp4', poster: '/img/site/gloves.webp' },
  tape: { video: '/video/tape.mp4', poster: '/img/site/tape.webp' },
};

/**
 * 18.11.2026: 5 услуг вместо 12 (решение владельца: «много лишних страниц, людей сбивают с толку»).
 * Пианино и сейфы — внутри «Мебель и отдельные вещи», ЕС — внутри «По Польше и ЕС»; упаковка, коробки, сборка,
 * вывоз и уборка — допы в форме «Цены и расчёт». Старые адреса ведут на новые (public/_redirects).
 * img — картинка карточки (визуализация ИИ, подпись «Визуализация» на странице услуг).
 */
export const services: Service[] = [
  {
    id: 'pereezd-kvartiry', group: 'move', icon: 'block', media: V.film, img: '/img/services/kvartira.webp',
    slug: { ru: 'pereezd-kvartiry', pl: 'przeprowadzka-mieszkania', uk: 'pereyizd-kvartyry', en: 'flat-moving' },
    title: { ru: 'Переезд квартиры', pl: 'Przeprowadzka mieszkania', uk: 'Переїзд квартири', en: 'Flat move' },
    short: { ru: 'Студии и 2–4 комнаты', pl: 'Kawalerki i 2–4 pokoje', uk: 'Студії та 2–4 кімнати', en: 'Studios and 2–4-room flats' },
    lead: { ru: 'Снимите квартиру на видео — в течение 2 часов пришлём цену, которая не изменится. Упакуем, перевезём, соберём мебель и расставим всё по местам.', pl: 'Nagraj mieszkanie telefonem — w ciągu 2 godzin wyślemy cenę, która się nie zmieni. Spakujemy, przewieziemy, skręcimy meble i ustawimy wszystko na swoje miejsca.', uk: 'Зніміть квартиру на відео — протягом 2 годин надішлемо ціну, яка не зміниться. Запакуємо, перевеземо, зберемо меблі й розставимо все по місцях.', en: 'Film your flat — within 2 hours we’ll send a price that won’t change. We pack, move, reassemble the furniture and put everything in its place.' },
    includes: [
      { ru: 'Защита пола, дверей и углов', pl: 'Ochrona podłóg, drzwi i narożników', uk: 'Захист підлоги, дверей і кутів', en: 'Floors, doors and corners protected' },
      { ru: 'Плёнка, одеяла и ремни для мебели', pl: 'Folia, koce i pasy do mebli', uk: 'Плівка, ковдри й ремені для меблів', en: 'Stretch wrap, blankets and straps for furniture' },
      { ru: 'Белые коробки с наклейками комнат', pl: 'Białe kartony z naklejkami pokoi', uk: 'Білі коробки з наліпками кімнат', en: 'White boxes with room labels' },
      { ru: 'Сборка и расстановка по комнатам', pl: 'Montaż i rozstawienie po pokojach', uk: 'Збирання й розстановка по кімнатах', en: 'Assembly and everything placed room by room' },
    ],
  },
  {
    id: 'pereezd-doma', group: 'move', icon: 'house', media: V.pack, img: '/img/services/dom.webp',
    slug: { ru: 'pereezd-doma', pl: 'przeprowadzka-domu', uk: 'pereyizd-budynku', en: 'house-moving' },
    title: { ru: 'Переезд дома', pl: 'Przeprowadzka domu', uk: 'Переїзд будинку', en: 'House move' },
    short: { ru: 'С гаражом, подвалом и садом', pl: 'Z garażem, piwnicą i ogrodem', uk: 'З гаражем, підвалом і садом', en: 'Garage, cellar and garden included' },
    lead: { ru: 'Пройдитесь по дому с телефоном — гараж, подвал и чердак тоже покажите. Цену пришлём в течение 2 часов, и она не изменится. Если вещей много, приедут сразу несколько бусов.', pl: 'Przejdź się po domu z telefonem — pokaż też garaż, piwnicę i strych. Cenę wyślemy w ciągu 2 godzin i się nie zmieni. Gdy rzeczy jest dużo, przyjedzie od razu kilka busów.', uk: 'Пройдіться будинком із телефоном — гараж, підвал і горище теж покажіть. Ціну надішлемо протягом 2 годин, і вона не зміниться. Якщо речей багато, приїдуть одразу кілька бусів.', en: 'Walk through the house with your phone and show us the garage, cellar and attic too. We’ll send a price within 2 hours, and it won’t change. If there’s a lot to move, several vans come at once.' },
    includes: [
      { ru: 'Несколько бусов в один день', pl: 'Kilka busów jednego dnia', uk: 'Кілька бусів в один день', en: 'Several vans on the same day' },
      { ru: 'Садовая мебель, велосипеды, инструмент', pl: 'Meble ogrodowe, rowery, narzędzia', uk: 'Садові меблі, велосипеди, інструмент', en: 'Garden furniture, bikes and tools' },
      { ru: 'Упаковка и разборка мебели', pl: 'Pakowanie i demontaż mebli', uk: 'Пакування та розбирання меблів', en: 'Packing and furniture disassembly' },
      { ru: 'Сборка и расстановка на новом месте', pl: 'Montaż i rozstawienie w nowym miejscu', uk: 'Збирання й розстановка на новому місці', en: 'Assembly and setup at the new place' },
    ],
  },
  {
    id: 'pereezd-ofisa', group: 'move', icon: 'desk', media: V.van, img: '/img/services/ofis.webp',
    slug: { ru: 'pereezd-ofisa', pl: 'przeprowadzka-biura', uk: 'pereyizd-ofisu', en: 'office-moving' },
    title: { ru: 'Переезд офиса', pl: 'Przeprowadzka biura', uk: 'Переїзд офісу', en: 'Office move' },
    short: { ru: 'Ночью и в выходные', pl: 'W nocy i w weekendy', uk: 'Уночі та у вихідні', en: 'Nights and weekends' },
    lead: { ru: 'Снимите рабочие места, шкафы и технику — цену пришлём в течение 2 часов. Переедем ночью или в выходные, чтобы утром все работали на новом месте.', pl: 'Nagraj stanowiska pracy, szafy i sprzęt — cenę wyślemy w ciągu 2 godzin. Przeprowadzimy się w nocy lub w weekend, żeby rano wszyscy pracowali już w nowym miejscu.', uk: 'Зніміть робочі місця, шафи й техніку — ціну надішлемо протягом 2 годин. Переїдемо вночі або у вихідні, щоб уранці всі працювали на новому місці.', en: 'Film the desks, cabinets and equipment — we’ll send a price within 2 hours. We move at night or over the weekend, so everyone is working at the new place by morning.' },
    includes: [
      { ru: 'План расстановки по номерам мест', pl: 'Plan rozstawienia według numerów stanowisk', uk: 'План розстановки за номерами місць', en: 'A layout plan by desk number' },
      { ru: 'Упаковка техники и документов', pl: 'Pakowanie sprzętu i dokumentów', uk: 'Пакування техніки й документів', en: 'Equipment and documents packed' },
      { ru: 'Разборка и сборка столов и шкафов', pl: 'Demontaż i montaż biurek i szaf', uk: 'Розбирання та збирання столів і шаф', en: 'Desks and cabinets taken apart and reassembled' },
      { ru: 'Фактура VAT на фирму', pl: 'Faktura VAT na firmę', uk: 'Фактура VAT на фірму', en: 'VAT invoice for your company' },
    ],
  },
  {
    id: 'perevozka-mebeli', group: 'move', icon: 'sofa', media: V.gloves, img: '/img/services/mebel.webp',
    slug: { ru: 'perevozka-mebeli', pl: 'transport-mebli', uk: 'perevezennya-mebliv', en: 'furniture-transport' },
    title: { ru: 'Мебель и отдельные вещи', pl: 'Meble i pojedyncze rzeczy', uk: 'Меблі та окремі речі', en: 'Furniture and single items' },
    short: { ru: 'Диван с OLX, шкаф, пианино', pl: 'Sofa z OLX, szafa, pianino', uk: 'Диван з OLX, шафа, піаніно', en: 'A sofa from OLX, a wardrobe, a piano' },
    lead: { ru: 'Один диван, шкаф или пианино: заберём из магазина, у продавца с OLX или из старой квартиры и занесём в нужную комнату.', pl: 'Jedna sofa, szafa czy pianino: odbierzemy ze sklepu, od sprzedawcy z OLX albo ze starego mieszkania i wniesiemy do właściwego pokoju.', uk: 'Один диван, шафа чи піаніно: заберемо з магазину, у продавця з OLX або зі старої квартири й занесемо до потрібної кімнати.', en: 'One sofa, a wardrobe or a piano: we collect it from the shop, an OLX seller or your old flat and carry it into the right room.' },
    includes: [
      { ru: 'Подъём на любой этаж', pl: 'Wniesienie na każde piętro', uk: 'Підйом на будь-який поверх', en: 'Carried up to any floor' },
      { ru: 'Плёнка и одеяла для мебели', pl: 'Folia i koce na meble', uk: 'Плівка й ковдри для меблів', en: 'Stretch wrap and blankets for furniture' },
      { ru: 'Пианино и сейфы — ремни, тележки, бригада из 3–4 человек', pl: 'Pianina i sejfy — pasy, wózki, ekipa 3–4 osób', uk: 'Піаніно й сейфи — ремені, візки, бригада з 3–4 осіб', en: 'Pianos and safes: straps, dollies and a crew of 3–4' },
      { ru: 'Сборка на месте, если нужно', pl: 'Montaż na miejscu, jeśli trzeba', uk: 'Збирання на місці, якщо потрібно', en: 'Assembly on site if needed' },
    ],
  },
  {
    id: 'mezhdugorodnie', group: 'move', icon: 'road', media: V.van, img: '/img/services/mezhgorod.webp',
    slug: { ru: 'mezhdugorodnie', pl: 'przeprowadzki-miedzymiastowe', uk: 'mizhmiski-pereyizdy', en: 'long-distance-moves' },
    title: { ru: 'По Польше и в страны ЕС', pl: 'Po Polsce i do krajów UE', uk: 'Польщею та до країн ЄС', en: 'Across Poland and the EU' },
    short: { ru: 'Краков, Гданьск, Берлин', pl: 'Kraków, Gdańsk, Berlin', uk: 'Краків, Гданськ, Берлін', en: 'Kraków, Gdańsk, Berlin' },
    lead: { ru: 'Из Варшавы в Краков, Гданьск или Берлин — один бус и одна бригада от двери до двери. Без перегрузок и чужих грузов по пути.', pl: 'Z Warszawy do Krakowa, Gdańska czy Berlina — jeden bus i jedna ekipa od drzwi do drzwi. Bez przeładunków i doładunków po drodze.', uk: 'З Варшави до Кракова, Гданська чи Берліна — один бус і одна бригада від дверей до дверей. Без перевантажень і чужих вантажів у дорозі.', en: 'From Warsaw to Kraków, Gdańsk or Berlin: one van and one crew, door to door. No reloading and no other cargo on the way.' },
    includes: [
      { ru: 'Отдельный бус только для ваших вещей', pl: 'Osobny bus tylko na Twoje rzeczy', uk: 'Окремий бус лише для ваших речей', en: 'A van just for your belongings' },
      { ru: 'Цена с дорогой — известна заранее', pl: 'Cena z dojazdem — znana z góry', uk: 'Ціна з дорогою — відома заздалегідь', en: 'The price includes the road and is known in advance' },
      { ru: 'Доставка в оговорённый день', pl: 'Dostawa w ustalonym dniu', uk: 'Доставка в узгоджений день', en: 'Delivery on the agreed day' },
      { ru: 'Разгрузка и сборка на месте', pl: 'Rozładunek i montaż na miejscu', uk: 'Розвантаження та збирання на місці', en: 'Unloading and assembly on site' },
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
