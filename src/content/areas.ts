/**
 * Общие надписи страниц районов и страницы «Где работаем». Каждая фраза сразу на 4 языках.
 * Тексты про каждое место — в src/data/areas.ts.
 * Шаблоны со словом места: f(loc) — «na Mokotowie», n — «Mokotów».
 */
import type { L } from '../i18n/text';
import type { Locale } from '../i18n/routes';

const l = (ru: string, pl: string, uk: string, en: string): L => ({ ru, pl, uk, en });
type F = Record<Locale, (x: string) => string>;

export const areaText = {
  eyebrowDistrict: l('Район Варшавы', 'Dzielnica Warszawy', 'Район Варшави', 'Warsaw district'),
  eyebrowTown: l('Рядом с Варшавой', 'Okolice Warszawy', 'Поруч із Варшавою', 'Near Warsaw'),
  h1: { ru: (x) => `Переезды<br>${x}`, pl: (x) => `Przeprowadzki<br>${x}`, uk: (x) => `Переїзди<br>${x}`, en: (x) => `Movers<br>${x}` } as F,
  /** title для Google — с именительным падежом, как ищут: «Przeprowadzki Mokotów» */
  title: { ru: (n) => `Переезды ${n}, Варшава — фиксированная цена`, pl: (n) => `Przeprowadzki ${n} — stała cena z wideo`, uk: (n) => `Переїзди ${n}, Варшава — фіксована ціна`, en: (n) => `Movers ${n}, Warsaw — fixed price` } as F,
  description: {
    ru: (x) => `Переезды ${x}: упаковка, перевозка, сборка мебели. Фиксированная цена по видео без доплат, фактура VAT, BLIK, карта, наличные, 7 дней в неделю.`,
    pl: (x) => `Przeprowadzki ${x}: pakowanie, transport, montaż mebli. Stała cena z wideo bez dopłat, faktura VAT, BLIK, karta, gotówka, 7 dni w tygodniu.`,
    uk: (x) => `Переїзди ${x}: пакування, перевезення, збирання меблів. Фіксована ціна за відео без доплат, фактура VAT, BLIK, картка, готівка, 7 днів на тиждень.`,
    en: (x) => `Moving ${x}: packing, transport, furniture assembly. A fixed price from a video with no extra fees, VAT invoice, BLIK, card or cash, 7 days a week.`,
  } as F,
  lead: {
    ru: (x) => `Квартира, дом или офис ${x}: цена по видео, которая не изменится в день переезда, и бригада MELBUS 7 дней в неделю.`,
    pl: (x) => `Mieszkanie, dom lub biuro ${x}: cena z wideo, która nie zmieni się w dniu przeprowadzki, i ekipa MELBUS 7 dni w tygodniu.`,
    uk: (x) => `Квартира, будинок чи офіс ${x}: ціна за відео, яка не зміниться в день переїзду, і бригада MELBUS 7 днів на тиждень.`,
    en: (x) => `A flat, house or office ${x}: a price from a video that won’t change on moving day, and a MELBUS crew 7 days a week.`,
  } as F,
  matters: { ru: (x) => `Что важно при переезде ${x}`, pl: (x) => `Co jest ważne przy przeprowadzce ${x}`, uk: (x) => `Що важливо під час переїзду ${x}`, en: (x) => `What matters when moving ${x}` } as F,
  howTitle: l('Как это работает', 'Jak to działa', 'Як це працює', 'How it works'),
  how: [
    [l('Видео', 'Wideo', 'Відео', 'Video'), l('Снимаете квартиру на видео: две-три минуты, комната за комнатой.', 'Nagrywasz mieszkanie telefonem: dwie, trzy minuty, pokój po pokoju.', 'Знімаєте квартиру на відео: дві-три хвилини, кімната за кімнатою.', 'You film your flat on your phone: two or three minutes, room by room.')],
    [l('Цена', 'Cena', 'Ціна', 'Price'), l('Окончательную цену и список вещей присылаем в течение двух часов (днём).', 'Ostateczną cenę i listę rzeczy wysyłamy w ciągu dwóch godzin (w dzień).', 'Остаточну ціну й список речей надсилаємо протягом двох годин (удень).', 'We send the final price and a list of items within two hours (in the daytime).')],
    [l('Переезд', 'Przeprowadzka', 'Переїзд', 'Moving day'), l('Упаковка, перевозка, сборка и расстановка — без доплат на месте.', 'Pakowanie, transport, montaż i ustawienie — bez dopłat na miejscu.', 'Пакування, перевезення, збирання й розстановка — без доплат на місці.', 'Packing, transport, assembly and setting up — no extra charges on the day.')],
  ] as [L, L][],
  calc: l('Рассчитать примерную цену', 'Oblicz orientacyjną cenę', 'Розрахувати орієнтовну ціну', 'Get a ballpark price'),
  near: l('Работаем и рядом', 'Działamy też w pobliżu', 'Працюємо й поруч', 'We also work nearby'),
  all: l('Все районы и города', 'Wszystkie dzielnice i miejscowości', 'Усі райони й міста', 'All districts and towns'),
  // страница «Где работаем»
  hub: {
    eyebrow: l('Где работаем', 'Gdzie działamy', 'Де працюємо', 'Where we work'),
    title: l('Варшава<br>и 150 км вокруг', 'Warszawa<br>i okolice do 150 km', 'Варшава<br>і 150 км довкола', 'Within 150 km<br>of Warsaw'),
    lead: l('Все районы Варшавы и города вокруг. Переезды по Польше и в страны ЕС — по запросу.', 'Wszystkie dzielnice Warszawy i okoliczne miejscowości. Przeprowadzki po Polsce i do krajów UE — na zapytanie.', 'Усі райони Варшави й міста довкола. Переїзди Польщею та до країн ЄС — за запитом.', 'Every district of Warsaw and the towns around it. Moves across Poland and to EU countries on request.'),
    districts: l('Районы Варшавы', 'Dzielnice Warszawy', 'Райони Варшави', 'Warsaw districts'),
    towns: l('Города рядом', 'Miejscowości w okolicy', 'Міста поруч', 'Nearby towns'),
    other: l('Нет вашего района или города в списке? Мы работаем во всех районах Варшавы и в радиусе 150 км — просто пришлите видео.', 'Nie ma Twojej dzielnicy lub miejscowości na liście? Działamy we wszystkich dzielnicach Warszawy i w promieniu 150 km — po prostu wyślij wideo.', 'Немає вашого району чи міста в списку? Ми працюємо в усіх районах Варшави й у радіусі 150 км — просто надішліть відео.', 'Don’t see your district or town? We work all over Warsaw and within 150 km of it — just send us a video.'),
    metaTitle: l('Где работаем: районы Варшавы и пригороды', 'Gdzie działamy: dzielnice Warszawy i okolice', 'Де працюємо: райони Варшави й передмістя', 'Where we work: Warsaw districts and nearby towns'),
    metaDesc: l('Переезды по всем районам Варшавы и в радиусе 150 км: Мокотув, Воля, Урсынов, Пясечно, Прушков и другие.', 'Przeprowadzki we wszystkich dzielnicach Warszawy i w promieniu 150 km: Mokotów, Wola, Ursynów, Piaseczno, Pruszków i inne.', 'Переїзди в усіх районах Варшави й у радіусі 150 км: Мокотув, Воля, Урсинів, Пясечно, Прушків та інші.', 'Moving in every Warsaw district and within 150 km of Warsaw: Mokotów, Wola, Ursynów, Piaseczno, Pruszków and more.'),
  },
};
