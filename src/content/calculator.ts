/**
 * КАЛЬКУЛЯТОР — все тексты, каждая фраза сразу на 4 языках (ru, pl, uk, en).
 * Ставки, формула и варианты (расстояние, упаковка, доп. услуги) — в src/data/pricing.ts.
 */
import type { L } from '../i18n/text';

const l = (ru: string, pl: string, uk: string, en: string): L => ({ ru, pl, uk, en });

export const calcText = {
  qSize: l('Что перевозим?', 'Co przewozimy?', 'Що перевозимо?', 'What are we moving?'),
  qDist: l('Куда едем?', 'Dokąd jedziemy?', 'Куди їдемо?', 'Where to?'),
  euNote: l('Переезд в другую страну ЕС считаем индивидуально — по видео и маршруту.', 'Przeprowadzkę do innego kraju UE wyceniamy indywidualnie — na podstawie wideo i trasy.', 'Переїзд до іншої країни ЄС рахуємо індивідуально — за відео й маршрутом.', 'Moves to another EU country are priced individually, from the video and the route.'),
  euLink: l('Запросить цену', 'Zapytaj o cenę', 'Запитати ціну', 'Ask for a price'),
  qFloors: l('Этажи и лифт', 'Piętra i winda', 'Поверхи й ліфт', 'Floors and lift'),
  floorsHint: l('Этажи без лифта мы считаем сразу — в день переезда доплат за них не будет.', 'Piętra bez windy liczymy od razu — w dniu przeprowadzki nie będzie za nie dopłat.', 'Поверхи без ліфта рахуємо одразу — у день переїзду доплат за них не буде.', 'We count floors without a lift up front — there will be no extra charge for them on the day.'),
  addrFrom: l('Сейчас', 'Obecny adres', 'Зараз', 'Current home'),
  addrTo: l('Новый адрес', 'Nowy adres', 'Нова адреса', 'New home'),
  floor: l('Этаж', 'Piętro', 'Поверх', 'Floor'),
  ground: l('партер', 'parter', 'партер', 'ground'),
  lift: l('Есть лифт', 'Jest winda', 'Є ліфт', 'There’s a lift'),
  crew: l('бригада {n} чел.', 'ekipa {n} os.', 'бригада {n} ос.', 'crew of {n}'),
  hours: l('ч', 'h', 'год', 'h'),
  less: l('Ниже', 'Niżej', 'Нижче', 'Lower'),
  more: l('Выше', 'Wyżej', 'Вище', 'Higher'),
  qPack: l('Упаковка', 'Pakowanie', 'Пакування', 'Packing'),
  qExtras: l('Что ещё сделать?', 'Co jeszcze zrobić?', 'Що ще зробити?', 'Anything else?'),
  // панель итога
  estimate: l('Ориентир', 'Orientacyjnie', 'Орієнтир', 'Estimate'),
  from: l('от', 'od', 'від', 'from'),
  sr: l('Ориентировочная цена: от', 'Cena orientacyjna: od', 'Орієнтовна ціна: від', 'Approximate price: from'),
  rows: {
    base: l('Переезд', 'Przeprowadzka', 'Переїзд', 'Move'),
    dist: l('Расстояние', 'Odległość', 'Відстань', 'Distance'),
    floors: l('Этажи без лифта', 'Piętra bez windy', 'Поверхи без ліфта', 'Floors without a lift'),
    pack: l('Упаковка', 'Pakowanie', 'Пакування', 'Packing'),
    extras: l('Доп. услуги', 'Usługi dodatkowe', 'Дод. послуги', 'Extras'),
  },
  note: l('Демо-цифры: ставки ещё утверждаются. Окончательную цену назовём по видео — и она не изменится в день переезда.', 'Ceny demonstracyjne: stawki są jeszcze zatwierdzane. Ostateczną cenę podamy na podstawie wideo — i nie zmieni się w dniu przeprowadzki.', 'Демо-цифри: ставки ще затверджуються. Остаточну ціну назвемо за відео — і вона не зміниться в день переїзду.', 'Demo figures: rates are still being finalised. We’ll give you the final price from a video — and it won’t change on moving day.'),
  cta: l('Получить точную цену', 'Otrzymaj dokładną cenę', 'Отримати точну ціну', 'Get the exact price'),
  video: l('Отправить видео', 'Wyślij wideo', 'Надіслати відео', 'Send a video'),
};
