/**
 * КАЛЬКУЛЯТОР — все тексты, каждая фраза сразу на 4 языках (ru, pl, uk, en).
 * Цены, пакеты и варианты (сколько вещей, расстояние, доп. услуги) — в src/data/pricing.ts.
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
  less: l('Ниже', 'Niżej', 'Нижче', 'Lower'),
  more: l('Выше', 'Wyżej', 'Вище', 'Higher'),
  qAmount: l('Сколько вещей?', 'Ile rzeczy?', 'Скільки речей?', 'How much stuff?'),
  amountHint: l('Мы считаем объём, а не часы: цена — за весь переезд.', 'Liczymy objętość, nie godziny: cena jest za całą przeprowadzkę.', 'Ми рахуємо обсяг, а не години: ціна — за весь переїзд.', 'We price the volume, not the hours: one price for the whole move.'),
  qPkg: l('Какой пакет?', 'Jaki pakiet?', 'Який пакет?', 'Which package?'),
  best: l('Выгоднее всего', 'Najkorzystniej', 'Найвигідніше', 'Best value'),
  nudgeGo: l('Выбрать', 'Wybierz', 'Обрати', 'Choose it'),
  inPkg: l('в пакете', 'w pakiecie', 'у пакеті', 'included'),
  qExtras: l('Что ещё сделать?', 'Co jeszcze zrobić?', 'Що ще зробити?', 'Anything else?'),
  // панель итога
  estimate: l('Ориентир', 'Orientacyjnie', 'Орієнтир', 'Estimate'),
  from: l('от', 'od', 'від', 'from'),
  sr: l('Ориентировочная цена: от', 'Cena orientacyjna: od', 'Орієнтовна ціна: від', 'Approximate price: from'),
  rows: {
    pkg: l('Пакет', 'Pakiet', 'Пакет', 'Package'),
    dist: l('Расстояние', 'Odległość', 'Відстань', 'Distance'),
    floors: l('Этажи без лифта', 'Piętra bez windy', 'Поверхи без ліфта', 'Floors without a lift'),
    extras: l('Доп. услуги', 'Usługi dodatkowe', 'Дод. послуги', 'Extras'),
  },
  note: l('Цены на утверждении. Окончательную цену назовём по видео — и она не изменится в день переезда.', 'Ceny w trakcie zatwierdzania. Ostateczną cenę podamy na podstawie wideo — i nie zmieni się w dniu przeprowadzki.', 'Ціни на затвердженні. Остаточну ціну назвемо за відео — і вона не зміниться в день переїзду.', 'Prices are being finalised. We’ll give you the final price from a video — and it won’t change on moving day.'),
  noHours: l('Без оплаты за часы: если работа займёт дольше — это наш риск, не ваш.', 'Bez płacenia za godziny: jeśli praca potrwa dłużej — to nasze ryzyko, nie Twoje.', 'Без оплати за години: якщо робота триватиме довше — це наш ризик, не ваш.', 'No hourly billing: if the job takes longer, that’s our risk, not yours.'),
  /** подсказка-сравнение пакетов: {name} {diff} {note} */
  nudgeMore: l('«{name}» — всего +{diff} zł: {note}.', '„{name}” — tylko +{diff} zł: {note}.', '«{name}» — усього +{diff} zł: {note}.', '“{name}” — just +{diff} zł: {note}.'),
  nudgeSame: l('«{name}» выйдет не дороже — и {note}.', '„{name}” nie wyjdzie drożej — a {note}.', '«{name}» вийде не дорожче — і {note}.', '“{name}” costs no more — and {note}.'),
  nudgeNote: [
    l('', '', '', ''),
    l('упакуем кухню и хрупкое, соберём всю мебель', 'spakujemy kuchnię i rzeczy delikatne, złożymy wszystkie meble', 'запакуємо кухню й крихке, зберемо всі меблі', 'we pack the kitchen and fragile items and assemble all the furniture'),
    l('упакуем всю квартиру и распакуем на месте', 'spakujemy całe mieszkanie i rozpakujemy na miejscu', 'запакуємо всю квартиру й розпакуємо на місці', 'we pack the whole home and unpack it at the new one'),
  ],
  cta: l('Получить точную цену', 'Otrzymaj dokładną cenę', 'Отримати точну ціну', 'Get the exact price'),
  video: l('Отправить видео', 'Wyślij wideo', 'Надіслати відео', 'Send a video'),
};
