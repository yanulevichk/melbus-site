/**
 * БАНК ПОДСКАЗОК ДЛЯ CHATGPT (13.11.2026) — посты на 6 недель после первых 10 публикаций (25.11.2026 – 4.01.2027, пн/ср/пт).
 * Каждая запись: подсказка для картинки (по-английски — так генератор понимает точнее) + надписи на картинке и подпись к посту
 * сразу на 4 языках (правило языков). Картинка из ChatGPT → marketing/gpt/<id>.jpg (или прислать Claude) → ./render-gpt.sh
 * соберёт пост 4:5 и сторис 9:16 на 4 языках.
 * Факты сверены с сайтом (пакеты в src/data/pricing.ts): плёнка, пледы, защита пола и разборка кровати — в любом пакете;
 * упаковка кухни/хрупкого и сборка всей мебели — «Стандарт»; ТВ на стену и до 5 картин — «Под ключ» или доп. услуга.
 * check — что сверить перед публикацией (описание процесса, которого ещё нет на сайте, или наличие дат).
 */
import type {L} from './texts';

const l = (ru: string, pl: string, uk: string, en: string): L => ({ru, pl, uk, en});

/** общий стиль — вставлять перед каждой подсказкой; логотип прикреплять файлом brand/export/MELBUS_logo_na_belom.png */
export const GPT_STYLE = 'Photorealistic premium commercial photo, soft natural daylight, calm, tidy and minimal. Colours: graphite #10161D, clean white, turquoise #14DCD5 only as small accents (tape, stickers, glove cuffs). Portrait format 2:3. Keep the lower third calm and simple for a text overlay. No people’s faces (hands only, if any). All cardboard boxes are pure white, never brown or kraft. The attached MELBUS logo may appear only printed small on boxes or objects, copied exactly — never as a floating overlay or watermark. No other text, letters or numbers anywhere unless the scene asks for a sticker number.';

export const NEW_POST = l('Новый пост', 'Nowy post', 'Новий пост', 'New post');

export const GPT_RUBRICS = {
  tip: l('Совет', 'Porada', 'Порада', 'Tip'),
  detail: l('Детали', 'Szczegóły', 'Деталі', 'Details'),
  city: l('Варшава', 'Warszawa', 'Варшава', 'Warsaw'),
  season: l('Сезон', 'Sezon', 'Сезон', 'Season'),
  service: l('Услуги', 'Usługi', 'Послуги', 'Services'),
};

export type GptPost = {
  id: string; date: string; rubric: keyof typeof GPT_RUBRICS; what: string; prompt: string;
  title: L; sub: L; caption: L; tags: L; check?: string;
};

const T = {
  tip: l('#переезд #советы #упаковка #melbus', '#przeprowadzka #porady #pakowanie #melbus', '#переїзд #поради #пакування #melbus', '#moving #movingtips #packing #melbus'),
  care: l('#переезд #упаковка #варшава #melbus', '#przeprowadzka #pakowanie #warszawa #melbus', '#переїзд #пакування #варшава #melbus', '#moving #packing #warsaw #melbus'),
  city: l('#переезд #варшава #переездваршава #melbus', '#przeprowadzka #warszawa #przeprowadzkawarszawa #melbus', '#переїзд #варшава #переїздваршава #melbus', '#moving #warsaw #movingwarsaw #melbus'),
};

export const GPT_POSTS: GptPost[] = [
  {id: 'dishes', date: '25.11', rubric: 'tip', what: 'Тарелки на ребро в коробке с перегородками (вид сверху)',
    prompt: 'Top-down view of an open white moving box with cardboard dividers on a light oak floor. Plates wrapped in plain white packing paper stand upright on their edges like vinyl records; wine glasses wrapped in paper sit in separate cells. A strip of turquoise tape on one flap. Soft window light.',
    title: l('Тарелки — на ребро', 'Talerze — na sztorc', 'Тарілки — на ребро', 'Plates go on their edge'),
    sub: l('Как пластинки: так они лучше держат удар.', 'Jak płyty winylowe: tak lepiej znoszą wstrząsy.', 'Як платівки: так вони краще тримають удар.', 'Like vinyl records: that way they take knocks better.'),
    caption: l(
      'Совет по упаковке: тарелки заворачиваем в бумагу и ставим в коробку на ребро, как пластинки, — так они лучше переносят дорогу. Стаканы и бокалы — в коробку с перегородками. В пакетах «Стандарт» и «Под ключ» кухню пакуем мы, материалы в цене. Сохраните, чтобы не забыть 🍽️',
      'Porada do pakowania: talerze owijamy w papier i stawiamy w kartonie na sztorc, jak płyty winylowe — tak lepiej znoszą drogę. Szklanki i kieliszki — do kartonu z przegródkami. W pakietach „Standard” i „Pod klucz” kuchnię pakujemy my, materiały w cenie. Zapisz, żeby nie zapomnieć 🍽️',
      'Порада з пакування: тарілки загортаємо в папір і ставимо в коробку на ребро, як платівки, — так вони краще переносять дорогу. Склянки й келихи — у коробку з перегородками. У пакетах «Стандарт» і «Під ключ» кухню пакуємо ми, матеріали в ціні. Збережіть, щоб не забути 🍽️',
      'Packing tip: wrap plates in paper and stand them on their edge in the box, like vinyl records — they handle the journey better. Glasses go into a box with dividers. With the “Standard” and “Full service” packages we pack the kitchen ourselves, materials included. Save this for later 🍽️'),
    tags: T.tip},
  {id: 'sofa', date: '27.11', rubric: 'detail', what: 'Диван в стрейч-плёнке и графитовых пледах в пустой комнате',
    prompt: 'A sofa fully wrapped in clear stretch film and graphite moving blankets, standing in an empty bright living room with light parquet, a grey protective runner on the floor leading to the door, two white moving boxes with turquoise tape nearby. No people.',
    title: l('Диван — в плёнке и пледах', 'Kanapa — w folii i kocach', 'Диван — у плівці та ковдрах', 'Sofa: film and blankets'),
    sub: l('Ни пыли, ни царапин — ни на мебели, ни на стенах.', 'Bez kurzu i rys — ani na meblach, ani na ścianach.', 'Ні пилу, ні подряпин — ні на меблях, ні на стінах.', 'No dust, no scratches — on the furniture or the walls.'),
    caption: l(
      'Мягкую мебель заворачиваем в стрейч-плёнку и защитные пледы: в бус она едет чистой, а углы не задевают стены и косяки. Это есть в любом пакете — даже в «Перевозке».',
      'Meble tapicerowane owijamy folią stretch i kocami ochronnymi: jadą czyste, a narożniki nie obijają ścian ani futryn. To jest w każdym pakiecie — nawet w „Transporcie”.',
      'М’які меблі загортаємо в стретч-плівку й захисні ковдри: вони їдуть чистими, а кути не чіпляють стіни та одвірки. Це є в будь-якому пакеті — навіть у «Перевезенні».',
      'We wrap upholstered furniture in stretch film and protective blankets: it travels clean, and the corners don’t knock the walls or door frames. It’s part of every package — even “Transport”.'),
    tags: T.care},
  {id: 'bed-screws', date: '30.11', rubric: 'tip', what: 'Разобранная кровать, шурупы в пакетике на детали',
    prompt: 'Close-up of a disassembled wooden bed frame lying on a light floor: a small clear zip bag with screws and an Allen key is taped to one of the boards with turquoise tape. A white moving box in the soft-focus background. Hands only if any.',
    title: l('Шурупы — к своей детали', 'Śruby — przy swojej części', 'Шурупи — до своєї деталі', 'Screws stay with their part'),
    sub: l('Пакетик и скотч — и сборка без поисков.', 'Woreczek i taśma — montaż bez szukania.', 'Пакетик і скотч — і збирання без пошуків.', 'A small bag and tape — no hunting at assembly.'),
    caption: l(
      'Разбираете мебель сами? Шурупы и фурнитуру — в пакетик и скотчем прямо к детали, от которой они. На новом месте ничего не придётся искать. Кровать мы разбираем и собираем в любом пакете, всю мебель — в «Стандарте» и «Под ключ».',
      'Rozkręcasz meble sam? Śruby i okucia — do woreczka i taśmą prosto do części, z której pochodzą. W nowym miejscu nic nie trzeba szukać. Łóżko rozkręcamy i składamy w każdym pakiecie, wszystkie meble — w „Standardzie” i „Pod klucz”.',
      'Розбираєте меблі самі? Шурупи й фурнітуру — у пакетик і скотчем просто до деталі, з якої вони. На новому місці нічого не доведеться шукати. Ліжко ми розбираємо й збираємо в будь-якому пакеті, усі меблі — у «Стандарті» та «Під ключ».',
      'Taking furniture apart yourself? Put the screws and fittings in a small bag and tape it to the part they came from. Nothing to hunt for at the new place. We take apart and reassemble the bed in every package, and all furniture in “Standard” and “Full service”.'),
    tags: T.tip},
  {id: 'stairs', date: '2.12', rubric: 'city', what: 'Лестница варшавской каменицы, защитная дорожка, коробки на площадке',
    prompt: 'Stairwell of an old Warsaw tenement building (kamienica): worn wooden banister, patterned floor tiles, a tall window with soft light. A grey protective runner on the stairs, three white moving boxes with turquoise tape waiting on the landing. No people.',
    title: l('Старый дом без лифта?', 'Kamienica bez windy?', 'Старий будинок без ліфта?', 'A walk-up with no lift?'),
    sub: l('Этажи видно на видео — они уже в цене.', 'Piętra widać na wideo — są już w cenie.', 'Поверхи видно на відео — вони вже в ціні.', 'We see the floors on your video — they’re already in the price.'),
    caption: l(
      'В варшавских каменицах лестницы узкие, а лифта часто нет. Покажите лестницу на видео — этажи сразу войдут в окончательную цену, без сюрпризов в день переезда.',
      'W warszawskich kamienicach klatki są wąskie, a windy często brak. Pokaż klatkę schodową na wideo — piętra od razu wejdą do ostatecznej ceny, bez niespodzianek w dniu przeprowadzki.',
      'У варшавських кам’яницях сходи вузькі, а ліфта часто немає. Покажіть сходи на відео — поверхи одразу ввійдуть в остаточну ціну, без сюрпризів у день переїзду.',
      'Warsaw tenements often have narrow stairs and no lift. Show the staircase in your video — the floors go straight into the final price, with no surprises on moving day.'),
    tags: T.city},
  {id: 'tv', date: '4.12', rubric: 'detail', what: 'Телевизор в белой коробке с уголками, бирюзовый скотч',
    prompt: 'A large flat-screen TV standing upright in a white protective cardboard box with foam corner protectors, partly open at the top, sealed with turquoise tape, in a bright empty living room next to a light wall with a TV wall bracket. No people.',
    title: l('Телевизор — в своей коробке', 'Telewizor — w osobnym kartonie', 'Телевізор — у власній коробці', 'The TV gets its own box'),
    sub: l('А на новом месте повесим на стену.', 'A w nowym miejscu powiesimy go na ścianie.', 'А на новому місці повісимо на стіну.', 'And we hang it on the wall at the new place.'),
    caption: l(
      'Экран — самое хрупкое в квартире. Перевозим телевизор стоя, в отдельной коробке с защитными уголками. На новом месте повесим его и до 5 картин — это входит в «Под ключ» или заказывается отдельно в калькуляторе.',
      'Ekran to najdelikatniejsza rzecz w mieszkaniu. Telewizor wieziemy w pionie, w osobnym kartonie z narożnikami ochronnymi. W nowym miejscu powiesimy go i do 5 obrazów — to jest w pakiecie „Pod klucz” albo jako dodatek w kalkulatorze.',
      'Екран — найкрихкіше у квартирі. Телевізор перевозимо стоячи, в окремій коробці із захисними кутиками. На новому місці повісимо його й до 5 картин — це входить у «Під ключ» або замовляється окремо в калькуляторі.',
      'The screen is the most fragile thing in your flat. We move the TV upright, in its own box with corner protectors. At the new place we mount it and up to 5 pictures — included in “Full service” or added in the calculator.'),
    tags: T.care, check: 'Так ли бригада будет возить ТВ (стоя, в отдельной коробке с уголками)?'},
  {id: 'fridge', date: '7.12', rubric: 'tip', what: 'Пустой чистый холодильник с открытой дверцей, полотенце внизу',
    prompt: 'A clean empty white fridge with its door wide open in a bright modern kitchen, a folded white towel on the floor in front of it, a white moving box with turquoise tape on the counter. Calm, fresh, no people.',
    title: l('Холодильник — разморозить заранее', 'Lodówkę rozmroź wcześniej', 'Холодильник — розморозити заздалегідь', 'Defrost the fridge in advance'),
    sub: l('За сутки: выключить, вымыть, оставить открытым.', 'Dobę wcześniej: wyłącz, umyj, zostaw otwartą.', 'За добу: вимкнути, вимити, залишити відчиненим.', 'A day before: switch off, clean, leave it open.'),
    caption: l(
      'Совет: выключите холодильник за сутки до переезда, вымойте и оставьте дверцу приоткрытой — в дороге не будет ни воды, ни запаха. На новом месте дайте ему постоять несколько часов и только потом включайте.',
      'Porada: wyłącz lodówkę dobę przed przeprowadzką, umyj ją i zostaw uchylone drzwi — w drodze nie będzie wody ani zapachu. W nowym miejscu odczekaj kilka godzin i dopiero wtedy ją włącz.',
      'Порада: вимкніть холодильник за добу до переїзду, вимийте й залиште дверцята прочиненими — у дорозі не буде ні води, ні запаху. На новому місці дайте йому постояти кілька годин і лише потім вмикайте.',
      'Tip: switch off the fridge a day before the move, clean it and leave the door ajar — no water and no smell on the road. At the new place let it stand for a few hours before switching it on.'),
    tags: T.tip},
  {id: 'art', date: '9.12', rubric: 'detail', what: 'Картины и зеркало в пупырке и картонных уголках у стены',
    prompt: 'Framed pictures and a large mirror wrapped in bubble wrap with white cardboard corner protectors, leaning neatly against a light wall in an empty room, a roll of turquoise tape on the floor. Soft daylight, no people, no reflections of people in the mirror.',
    title: l('Картины и зеркала — в уголках', 'Obrazy i lustra — w narożnikach', 'Картини й дзеркала — у кутиках', 'Pictures and mirrors: corner guards'),
    sub: l('Пупырка и картонные уголки — и стекло цело.', 'Folia bąbelkowa i narożniki — szkło całe.', 'Бульбашкова плівка й кутики — і скло ціле.', 'Bubble wrap and corner guards keep the glass whole.'),
    caption: l(
      'Стекло и рамы бьются чаще всего на углах. Поэтому картины и зеркала заворачиваем в пупырчатую плёнку, надеваем картонные уголки и ставим в бус вертикально. Хрупкое пакуем мы — в пакетах «Стандарт» и «Под ключ».',
      'Szkło i ramy najczęściej pękają na rogach. Dlatego obrazy i lustra owijamy folią bąbelkową, zakładamy kartonowe narożniki i ustawiamy w busie pionowo. Rzeczy delikatne pakujemy my — w pakietach „Standard” i „Pod klucz”.',
      'Скло й рами найчастіше б’ються на кутах. Тому картини й дзеркала загортаємо в бульбашкову плівку, вдягаємо картонні кутики й ставимо в бус вертикально. Крихке пакуємо ми — у пакетах «Стандарт» і «Під ключ».',
      'Glass and frames break most often at the corners. So we wrap pictures and mirrors in bubble wrap, add cardboard corner guards and stand them upright in the van. We pack fragile items ourselves with “Standard” and “Full service”.'),
    tags: T.care, check: 'Есть ли в материалах картонные уголки?'},
  {id: 'kids', date: '11.12', rubric: 'tip', what: 'Детская: коробка с игрушками и наклейкой комнаты',
    prompt: 'A white moving box in a bright child’s room, open at the top with a teddy bear, wooden toys and a few picture books peeking out, a room label sticker with a yellow colour stripe and the number 03 on the side, turquoise tape on the flaps. Soft daylight, no people.',
    title: l('Своя коробка для ребёнка', 'Własny karton dla dziecka', 'Своя коробка для дитини', 'A box of their own'),
    sub: l('Пусть сам сложит игрушки — и откроет её первой.', 'Niech samo spakuje zabawki — i otworzy ten karton pierwszy.', 'Нехай сама складе іграшки — і відкриє її першою.', 'Let them pack their toys — and open it first.'),
    caption: l(
      'Переезд — стресс и для детей. Совет: дайте ребёнку свою коробку — пусть сам сложит любимые игрушки, выберет наклейку и откроет её первой в новом доме.',
      'Przeprowadzka to stres także dla dzieci. Porada: daj dziecku własny karton — niech samo spakuje ulubione zabawki, wybierze naklejkę i otworzy go jako pierwszy w nowym domu.',
      'Переїзд — це стрес і для дітей. Порада: дайте дитині власну коробку — нехай сама складе улюблені іграшки, вибере наліпку й відкриє її першою в новому домі.',
      'Moving is stressful for children too. Tip: give your child a box of their own — let them pack their favourite toys, pick a sticker and open it first in the new home.'),
    tags: l('#переезд #сдетьми #советы #melbus', '#przeprowadzka #zdziećmi #porady #melbus', '#переїзд #здітьми #поради #melbus', '#moving #movingwithkids #movingtips #melbus')},
  {id: 'winter', date: '14.12', rubric: 'season', what: 'Белый бус без надписей на заснеженной улице Варшавы вечером',
    prompt: 'A white delivery van without any logo or lettering parked on a snowy residential street in Warsaw at blue hour, warm lit windows in old tenement houses, gentle snowfall, no people, no licence plate visible.',
    title: l('Зимой — больше свободных дат', 'Zimą więcej wolnych terminów', 'Узимку — більше вільних дат', 'More free dates in winter'),
    sub: l('Декабрь–февраль — тихий сезон для переездов.', 'Grudzień–luty to spokojny sezon przeprowadzek.', 'Грудень–лютий — тихий сезон для переїздів.', 'December to February is the quiet season for moves.'),
    caption: l(
      'Зима — тихий сезон: проще выбрать удобный день, даже будний. Снег и мороз не страшны — вещи упакованы и едут в закрытом бусе. Снимите видео квартиры — пришлём окончательную цену.',
      'Zima to spokojny sezon: łatwiej wybrać dogodny dzień, nawet w tygodniu. Śnieg i mróz nie są straszne — rzeczy są spakowane i jadą w zamkniętym busie. Nagraj mieszkanie — wyślemy ostateczną cenę.',
      'Зима — тихий сезон: простіше обрати зручний день, навіть будній. Сніг і мороз не страшні — речі запаковані та їдуть у закритому бусі. Зніміть відео квартири — надішлемо остаточну ціну.',
      'Winter is the quiet season: it’s easier to pick a convenient day, even a weekday. Snow and frost are no problem — your things are packed and travel in a closed van. Film your flat and we’ll send the final price.'),
    tags: T.city, check: 'Публиковать, если даты правда есть.'},
  {id: 'plants', date: '16.12', rubric: 'tip', what: 'Комнатные растения в открытой коробке, горшки в бумаге',
    prompt: 'Several houseplants with their pots wrapped in white paper standing in an open white moving box by a bright window, leaves free and healthy, turquoise tape on the flaps, a watering can nearby. Soft daylight, no people.',
    title: l('Растения: полить за 2–3 дня', 'Rośliny: podlej 2–3 dni wcześniej', 'Рослини: полити за 2–3 дні', 'Plants: water 2–3 days before'),
    sub: l('Горшки будут легче, а земля не просыплется.', 'Doniczki będą lżejsze, a ziemia się nie wysypie.', 'Горщики будуть легші, а земля не розсиплеться.', 'Lighter pots and no spilled soil.'),
    caption: l(
      'Совет: полейте растения за 2–3 дня до переезда, а не в день, — горшки будут легче, а мокрая земля не испачкает коробку. Горшки заворачиваем в бумагу, листья оставляем свободными. Зимой растения не оставляйте на холоде, пока ждёте погрузки.',
      'Porada: podlej rośliny 2–3 dni przed przeprowadzką, a nie w jej dniu — doniczki będą lżejsze, a mokra ziemia nie pobrudzi kartonu. Doniczki owijamy papierem, liście zostawiamy wolne. Zimą nie zostawiaj roślin na mrozie w oczekiwaniu na załadunek.',
      'Порада: полийте рослини за 2–3 дні до переїзду, а не в день переїзду, — горщики будуть легші, а мокра земля не забруднить коробку. Горщики загортаємо в папір, листя залишаємо вільним. Узимку не залишайте рослини на холоді, поки чекаєте на завантаження.',
      'Tip: water your plants 2–3 days before the move, not on the day — the pots will be lighter and wet soil won’t dirty the box. We wrap the pots in paper and leave the leaves free. In winter, don’t leave plants out in the cold while you wait for loading.'),
    tags: T.tip},
  {id: 'xmas', date: '18.12', rubric: 'season', what: 'Белая коробка MELBUS с еловой веткой и гирляндой',
    prompt: 'A white MELBUS moving box sealed with turquoise tape tied like a ribbon bow, a small fir branch on top, warm string lights softly blurred in the background of a cosy new living room in winter. No people.',
    title: l('Новый год — в новом доме', 'Nowy rok w nowym domu', 'Новий рік — у новому домі', 'New year, new home'),
    sub: l('Успейте переехать до праздников.', 'Zdąż się przeprowadzić przed świętami.', 'Встигніть переїхати до свят.', 'Move in before the holidays.'),
    caption: l(
      'Хотите встретить Новый год уже в новом доме? Снимите видео квартиры сегодня — пришлём окончательную цену и свободные даты. Без доплат в день переезда 🎄',
      'Chcesz powitać Nowy Rok już w nowym domu? Nagraj mieszkanie jeszcze dziś — wyślemy ostateczną cenę i wolne terminy. Bez dopłat w dniu przeprowadzki 🎄',
      'Хочете зустріти Новий рік уже в новому домі? Зніміть відео квартири сьогодні — надішлемо остаточну ціну й вільні дати. Без доплат у день переїзду 🎄',
      'Want to see in the New Year in your new home? Film your flat today and we’ll send the final price and free dates. No extra fees on moving day 🎄'),
    tags: T.city, check: 'Публиковать, если до праздников правда есть свободные даты.'},
  {id: 'documents', date: '21.12', rubric: 'tip', what: 'Рюкзак «при себе»: папка, ключи, зарядки, лекарства (флэт-лей)',
    prompt: 'Flat lay on a light wooden table: an open graphite backpack with a plain document folder (no visible text), a set of keys on a turquoise keyring, phone chargers, a small first-aid pouch and a water bottle, neatly arranged. A white moving box corner at the edge of the frame. Soft daylight.',
    title: l('Сумка «при себе»', 'Torba „przy sobie”', 'Сумка «при собі»', 'The “with me” bag'),
    sub: l('Документы, ключи, зарядки, лекарства — не в коробку.', 'Dokumenty, klucze, ładowarki, leki — nie do kartonu.', 'Документи, ключі, зарядки, ліки — не в коробку.', 'Documents, keys, chargers, medicine — not in a box.'),
    caption: l(
      'Совет: соберите сумку, которая едет с вами, а не в бусе. Документы, ключи от старой и новой квартиры, зарядки, лекарства, ноутбук. Так ничего важного не потеряется среди коробок.',
      'Porada: spakuj torbę, która jedzie z Tobą, a nie w busie. Dokumenty, klucze do starego i nowego mieszkania, ładowarki, leki, laptop. Dzięki temu nic ważnego nie zginie wśród kartonów.',
      'Порада: зберіть сумку, яка їде з вами, а не в бусі. Документи, ключі від старої та нової квартири, зарядки, ліки, ноутбук. Так нічого важливого не загубиться серед коробок.',
      'Tip: pack a bag that travels with you, not in the van. Documents, keys to the old and new flat, chargers, medicine, your laptop. That way nothing important gets lost among the boxes.'),
    tags: T.tip},
  {id: 'checklist', date: '23.12', rubric: 'tip', what: 'Флэт-лей: скотч, маркер, наклейки, ножницы, блокнот с чек-листом',
    prompt: 'Flat lay on a clean white desk: a roll of turquoise tape, a black marker, a sheet of room label stickers with coloured stripes, scissors and an open notebook with an abstract checklist of grey lines and turquoise ticks (no readable words). Top-down, soft daylight.',
    title: l('Неделя до переезда', 'Tydzień przed przeprowadzką', 'Тиждень до переїзду', 'One week before the move'),
    sub: l('Короткий чек-лист — в подписи.', 'Krótka lista — w opisie.', 'Короткий чек-лист — у підписі.', 'A short checklist in the caption.'),
    caption: l(
      'Чек-лист за неделю до переезда:\n1. Снимите видео квартиры и получите цену.\n2. Предупредите администрацию дома о лифте и парковке.\n3. Разберите шкафы: что везём, что отдаём.\n4. Соберите сумку «при себе» и коробку первой ночи.\n5. Разморозьте холодильник за сутки.\nСохраните 📌',
      'Lista na tydzień przed przeprowadzką:\n1. Nagraj mieszkanie i otrzymaj cenę.\n2. Uprzedź administrację budynku o windzie i parkowaniu.\n3. Przejrzyj szafy: co jedzie, co oddajesz.\n4. Spakuj torbę „przy sobie” i karton pierwszej nocy.\n5. Rozmroź lodówkę dobę wcześniej.\nZapisz 📌',
      'Чек-лист за тиждень до переїзду:\n1. Зніміть відео квартири й отримайте ціну.\n2. Попередьте адміністрацію будинку про ліфт і паркування.\n3. Розберіть шафи: що веземо, що віддаємо.\n4. Зберіть сумку «при собі» й коробку першої ночі.\n5. Розморозьте холодильник за добу.\nЗбережіть 📌',
      'Checklist for the week before your move:\n1. Film your flat and get the price.\n2. Tell the building management about the lift and parking.\n3. Sort your wardrobes: what goes, what you give away.\n4. Pack a “with me” bag and a first-night box.\n5. Defrost the fridge a day before.\nSave this 📌'),
    tags: T.tip},
  {id: 'office', date: '28.12', rubric: 'service', what: 'Пустой офис в выходной: мониторы в плёнке, коробки с номерами',
    prompt: 'An empty modern open-plan office on a weekend: cleared desks, monitors wrapped in protective film, white moving boxes with turquoise tape and numbered room label stickers stacked neatly by the desks, soft daylight through large windows. No people.',
    title: l('Офис — за выходные', 'Biuro — w weekend', 'Офіс — за вихідні', 'Your office, moved over a weekend'),
    sub: l('В понедельник — работаете на новом месте.', 'W poniedziałek pracujesz już w nowym miejscu.', 'У понеділок — працюєте на новому місці.', 'On Monday you work from the new place.'),
    caption: l(
      'Работаем 7 дней в неделю — поэтому офис можно перевезти в выходные, без простоя. Технику пакуем отдельно, коробки подписываем по столам. Фактура VAT.',
      'Pracujemy 7 dni w tygodniu — dlatego biuro można przenieść w weekend, bez przestoju. Sprzęt pakujemy osobno, kartony opisujemy według biurek. Faktura VAT.',
      'Працюємо 7 днів на тиждень — тому офіс можна перевезти у вихідні, без простою. Техніку пакуємо окремо, коробки підписуємо за столами. Фактура VAT.',
      'We work 7 days a week, so your office can move over a weekend, with no downtime. We pack the equipment separately and label boxes by desk. VAT invoice.'),
    tags: l('#переездофиса #варшава #бизнес #melbus', '#przeprowadzkabiura #warszawa #firma #melbus', '#переїздофісу #варшава #бізнес #melbus', '#officemove #warsaw #business #melbus'),
    check: 'Как будете подписывать коробки в офисе (по столам/отделам)?'},
  {id: 'first-evening', date: '30.12', rubric: 'season', what: 'Уютная гостиная вечером: лампа, две кружки на коробке, огни города',
    prompt: 'A cosy living room in a new flat on a winter evening: a sofa, a warm floor lamp on, two mugs on a white moving box used as a coffee table, a few remaining white boxes with turquoise tape, a big window with city lights and light snow outside. No people.',
    title: l('Первый вечер в новом доме', 'Pierwszy wieczór w nowym domu', 'Перший вечір у новому домі', 'First evening in a new home'),
    sub: l('С наступающим Новым годом!', 'Szczęśliwego Nowego Roku!', 'Щасливого Нового року!', 'Happy New Year!'),
    caption: l(
      'Спасибо, что были с нами в первые недели MELBUS. Пусть в новом году всё будет на своих местах — и в доме, и в жизни. С наступающим! ✨',
      'Dziękujemy, że byliście z nami w pierwszych tygodniach MELBUS. Niech w nowym roku wszystko będzie na swoim miejscu — w domu i w życiu. Szczęśliwego Nowego Roku! ✨',
      'Дякуємо, що були з нами в перші тижні MELBUS. Нехай у новому році все буде на своїх місцях — і вдома, і в житті. Щасливого Нового року! ✨',
      'Thank you for being with us in MELBUS’s first weeks. May everything fall into place in the new year — at home and in life. Happy New Year! ✨'),
    tags: T.city},
  {id: 'europe', date: '4.01', rubric: 'service', what: 'Белый бус без надписей на автобане на рассвете, вид сзади',
    prompt: 'A white delivery van without any logo or lettering driving away on an empty European motorway at sunrise, soft mist over fields and distant hills, seen from behind at a distance, no licence plate visible, no people.',
    title: l('По Польше и ЕС', 'Po Polsce i UE', 'Польщею та ЄС', 'Across Poland and the EU'),
    sub: l('Межгород и ЕС — по запросу, цена заранее.', 'Międzymiastowe i do UE — na zapytanie, cena z góry.', 'Міжміські та до ЄС — за запитом, ціна наперед.', 'Intercity and EU moves on request, price upfront.'),
    caption: l(
      'Переезжаете в другой город или страну ЕС? Везём по Польше и в страны ЕС — по запросу. Принцип тот же: видео квартиры, окончательная цена до начала работ, без доплат в пути.',
      'Przeprowadzasz się do innego miasta lub kraju UE? Wozimy po Polsce i do krajów UE — na zapytanie. Zasada ta sama: wideo mieszkania, ostateczna cena przed startem, bez dopłat w trasie.',
      'Переїжджаєте в інше місто чи країну ЄС? Веземо Польщею та до країн ЄС — за запитом. Принцип той самий: відео квартири, остаточна ціна до початку робіт, без доплат у дорозі.',
      'Moving to another city or EU country? We move across Poland and to EU countries on request. Same principle: a video of your flat, the final price before we start, no extra fees on the way.'),
    tags: l('#переезд #переездвевропу #польша #melbus', '#przeprowadzka #przeprowadzkazagranice #polska #melbus', '#переїзд #переїздвєвропу #польща #melbus', '#moving #internationalmove #poland #melbus')},
];
