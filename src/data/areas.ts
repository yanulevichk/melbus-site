/**
 * РАЙОНЫ И ГОРОДА — страницы «Przeprowadzki Mokotów» и т. п. Каждая фраза сразу на 4 языках.
 * Текст у каждого места СВОЙ (Google не любит копии с заменой названия): что реально важно при переезде там.
 * Никаких выдуманных заказов и отзывов — только факты о районе и наш подход.
 * Адрес страницы: pl /przeprowadzki-<id>/, ru /ru/pereezdy-<id>/, uk /uk/pereyizdy-<id>/, en /en/moving-<id>/.
 */
import type { L } from '../i18n/text';

const l = (ru: string, pl: string, uk: string, en: string): L => ({ ru, pl, uk, en });

export interface Area {
  id: string;
  kind: 'district' | 'town';
  name: L;   // именительный: «Mokotów»
  loc: L;    // «где»: «na Mokotowie»
  intro: L;
  points: [L, L][];
  near: string[];
}

export const areas: Area[] = [
  {
    id: 'mokotow', kind: 'district',
    name: l('Мокотув', 'Mokotów', 'Мокотув', 'Mokotów'),
    loc: l('на Мокотуве', 'na Mokotowie', 'на Мокотові', 'in Mokotów'),
    intro: l(
      'Мокотув — один из самых больших районов Варшавы: довоенные каменицы и виллы Старого Мокотува, панельные кварталы Стеген, Садыбы и Служева, новые жилые комплексы и офисы Служевца.',
      'Mokotów to jedna z największych dzielnic Warszawy: przedwojenne kamienice i wille Starego Mokotowa, bloki Stegien, Sadyby i Służewa, nowe osiedla i biurowce Służewca.',
      'Мокотув — один із найбільших районів Варшави: довоєнні кам’яниці та вілли Старого Мокотова, панельні квартали Стеґен, Садиби й Служева, нові житлові комплекси та офіси Служевця.',
      'Mokotów is one of Warsaw’s largest districts: pre-war tenement houses and villas in Old Mokotów, the housing estates of Stegny, Sadyba and Służew, and the new flats and office blocks of Służewiec.'),
    points: [
      [l('Каменицы Старого Мокотува', 'Kamienice Starego Mokotowa', 'Кам’яниці Старого Мокотова', 'Old Mokotów tenements'),
       l('Высокие этажи, узкие лестницы и часто нет лифта. По видео заранее видим маршрут от квартиры до буса и защищаем лестничную клетку.', 'Wysokie kondygnacje, wąskie klatki i często brak windy. Z wideo widzimy drogę od mieszkania do busa i zabezpieczamy klatkę schodową.', 'Високі поверхи, вузькі сходи й часто немає ліфта. За відео заздалегідь бачимо маршрут від квартири до буса й захищаємо сходову клітку.', 'High ceilings, narrow staircases and often no lift. From the video we plan the route from the flat to the van and protect the stairwell.')],
      [l('Офисы на Служевце', 'Biura na Służewcu', 'Офіси на Служевці', 'Offices in Służewiec'),
       l('Офисный переезд можно сделать вечером или в выходные, чтобы команда в понедельник села за готовые столы. Работаем 7 дней в неделю.', 'Przeprowadzkę biura robimy wieczorem lub w weekend, żeby zespół w poniedziałek usiadł przy gotowych biurkach. Pracujemy 7 dni w tygodniu.', 'Офісний переїзд можна зробити ввечері або у вихідні, щоб команда в понеділок сіла за готові столи. Працюємо 7 днів на тиждень.', 'We can move an office in the evening or at the weekend, so your team sits down at ready desks on Monday. We work 7 days a week.')],
      [l('Оживлённые улицы', 'Ruchliwe ulice', 'Жваві вулиці', 'Busy streets'),
       l('У Пулавской, Воронича или Вилановской место для буса у подъезда планируем до дня переезда.', 'Przy Puławskiej, Woronicza czy Wilanowskiej miejsce postoju busa pod klatką planujemy przed dniem przeprowadzki.', 'Біля Пулавської, Вороніча чи Віланівської місце для буса біля під’їзду плануємо до дня переїзду.', 'On Puławska, Woronicza or Wilanowska we plan where the van will stand before moving day.')],
    ],
    near: ['ursynow', 'wilanow', 'ochota', 'srodmiescie', 'piaseczno'],
  },
  {
    id: 'wola', kind: 'district',
    name: l('Воля', 'Wola', 'Воля', 'Wola'),
    loc: l('на Воле', 'na Woli', 'на Волі', 'in Wola'),
    intro: l(
      'Воля меняется быстрее всех: офисные небоскрёбы у Ронда Дашиньского, новые жилые комплексы рядом с довоенными каменицами и домами 60–70-х годов.',
      'Wola zmienia się najszybciej: biurowe wieżowce przy Rondzie Daszyńskiego, nowe apartamentowce obok przedwojennych kamienic i bloków z lat 60. i 70.',
      'Воля змінюється найшвидше: офісні хмарочоси біля Ронда Дашинського, нові житлові комплекси поруч із довоєнними кам’яницями та будинками 60–70-х років.',
      'Wola is changing faster than anywhere else: office towers around Rondo Daszyńskiego and new apartment buildings next to pre-war tenements and 1960s–70s blocks.'),
    points: [
      [l('Новые дома с подземным гаражом', 'Nowe budynki z garażem podziemnym', 'Нові будинки з підземним гаражем', 'New buildings with underground garages'),
       l('Проверяем высоту въезда, грузовой лифт и правила дома. Подскажем, что согласовать с управляющей компанией до переезда.', 'Sprawdzamy wysokość wjazdu, windę towarową i regulamin budynku. Podpowiemy, co uzgodnić z zarządcą przed przeprowadzką.', 'Перевіряємо висоту в’їзду, вантажний ліфт і правила будинку. Підкажемо, що погодити з керуючою компанією до переїзду.', 'We check the entrance height, the service lift and the building rules, and tell you what to agree with the building manager in advance.')],
      [l('Офисы в высотках', 'Biura w wieżowcach', 'Офіси у висотках', 'Offices in high-rises'),
       l('В бизнес-центрах свои правила: окна для погрузки, пропуска, защита холлов. Планируем переезд под них — вне рабочих часов или в выходные.', 'Biurowce mają swoje zasady: okna na załadunek, przepustki, ochrona holi. Planujemy przeprowadzkę pod nie — poza godzinami pracy lub w weekend.', 'У бізнес-центрах свої правила: вікна для завантаження, перепустки, захист холів. Плануємо переїзд під них — поза робочими годинами або у вихідні.', 'Office towers have their own rules: loading slots, passes, lobby protection. We plan the move around them — outside office hours or at the weekend.')],
      [l('Старые дома без лифта', 'Starsze bloki bez windy', 'Старі будинки без ліфта', 'Older blocks without lifts'),
       l('В домах на 4–5 этажей лифта часто нет. Эти этажи сразу входят в цену — в день переезда доплат не будет.', 'W blokach na 4–5 pięter windy często nie ma. Te piętra od razu są w cenie — w dniu przeprowadzki nie będzie dopłat.', 'У будинках на 4–5 поверхів ліфта часто немає. Ці поверхи одразу входять у ціну — у день переїзду доплат не буде.', 'Four- and five-storey blocks often have no lift. Those floors are in the price from the start — no extra charge on the day.')],
    ],
    near: ['srodmiescie', 'ochota', 'bemowo', 'zoliborz'],
  },
  {
    id: 'srodmiescie', kind: 'district',
    name: l('Средместье', 'Śródmieście', 'Середмістя', 'Śródmieście'),
    loc: l('в Средместье', 'w Śródmieściu', 'у Середмісті', 'in Śródmieście'),
    intro: l(
      'Центр Варшавы — это Повисле, Муранув, MDM и Старый город: каменицы с высокими потолками, узкие улицы, зона платной парковки и места, куда машине въехать непросто.',
      'Centrum Warszawy to Powiśle, Muranów, MDM i Stare Miasto: kamienice z wysokimi sufitami, wąskie ulice, strefa płatnego parkowania i miejsca, do których trudno dojechać.',
      'Центр Варшави — це Повісле, Муранув, MDM і Старе місто: кам’яниці з високими стелями, вузькі вулиці, зона платного паркування й місця, куди авто заїхати непросто.',
      'Central Warsaw means Powiśle, Muranów, MDM and the Old Town: tenements with high ceilings, narrow streets, a paid parking zone and spots that are hard to reach by car.'),
    points: [
      [l('Высокие этажи без лифта', 'Wysokie piętra bez windy', 'Високі поверхи без ліфта', 'High floors without a lift'),
       l('Довоенный «третий этаж» — это почти пятый в новом доме. Считаем по видео, сколько пролётов нести, и называем цену сразу.', 'Przedwojenne „trzecie piętro” to prawie piąte w nowym bloku. Z wideo liczymy, ile biegów schodów trzeba nieść, i od razu podajemy cenę.', 'Довоєнний «третій поверх» — це майже п’ятий у новому будинку. Рахуємо за відео, скільки прольотів нести, і називаємо ціну одразу.', 'A pre-war “third floor” is almost a fifth floor in a new block. We count the flights of stairs from the video and give you the price straight away.')],
      [l('Парковка и узкие улицы', 'Parkowanie i wąskie ulice', 'Паркування й вузькі вулиці', 'Parking and narrow streets'),
       l('В центре платная зона и мало места у подъезда. Место для буса и время подъезда планируем заранее, чтобы не носить вещи через квартал.', 'W centrum jest strefa płatnego parkowania i mało miejsca pod klatką. Miejsce dla busa i godzinę podjazdu planujemy wcześniej, żeby nie nosić rzeczy przez pół kwartału.', 'У центрі платна зона й мало місця біля під’їзду. Місце для буса й час під’їзду плануємо заздалегідь, щоб не носити речі через квартал.', 'The centre has paid parking and little space outside the door. We plan the van’s spot and arrival time in advance, so nothing is carried half a block.')],
      [l('Старый город', 'Stare Miasto', 'Старе місто', 'Old Town'),
       l('Въезд ограничен, поэтому маршрут и окно подъезда согласуем до переезда. Бригада в форме и бахилах — соседи тоже заметят.', 'Wjazd jest ograniczony, dlatego trasę i okno podjazdu uzgadniamy przed przeprowadzką. Ekipa w uniformach i ochraniaczach na buty — sąsiedzi też to zauważą.', 'В’їзд обмежений, тому маршрут і вікно під’їзду погоджуємо до переїзду. Бригада у формі та бахілах — сусіди теж помітять.', 'Vehicle access is restricted, so we agree the route and arrival window before the move. A crew in uniforms and shoe covers — the neighbours will notice too.')],
    ],
    near: ['wola', 'mokotow', 'zoliborz', 'ochota', 'praga-poludnie'],
  },
  {
    id: 'praga-poludnie', kind: 'district',
    name: l('Прага-Полудне', 'Praga-Południe', 'Прага-Полудне', 'Praga-Południe'),
    loc: l('на Праге-Полудне', 'na Pradze-Południe', 'на Празі-Полудне', 'in Praga-Południe'),
    intro: l(
      'Прага-Полудне — это виллы и невысокие каменицы Саской Кемпы, большие кварталы Гоцлава и Грохува и новые дома на Каменке.',
      'Praga-Południe to wille i niskie kamienice Saskiej Kępy, duże osiedla Gocławia i Grochowa oraz nowe inwestycje na Kamionku.',
      'Прага-Полудне — це вілли й невисокі кам’яниці Саської Кемпи, великі квартали Гоцлава та Грохува й нові будинки на Каменку.',
      'Praga-Południe means the villas and low tenements of Saska Kępa, the large estates of Gocław and Grochów, and new developments in Kamionek.'),
    points: [
      [l('Виллы Саской Кемпы', 'Wille na Saskiej Kępie', 'Вілли Саської Кемпи', 'Villas in Saska Kępa'),
       l('Дом — это не только комнаты: подвал, гараж, садовая мебель. Всё это видим на видео и сразу включаем в цену.', 'Dom to nie tylko pokoje: piwnica, garaż, meble ogrodowe. Wszystko widzimy na wideo i od razu wliczamy w cenę.', 'Будинок — це не лише кімнати: підвал, гараж, садові меблі. Усе це бачимо на відео й одразу включаємо в ціну.', 'A house is more than its rooms: a cellar, a garage, garden furniture. We see it all on the video and include it in the price.')],
      [l('Высотки Гоцлава', 'Wieżowce Gocławia', 'Висотки Гоцлава', 'Gocław tower blocks'),
       l('Высокие дома с лифтом, рядом — пятиэтажки без него. Для каждой квартиры считаем свой вариант, без «средней температуры».', 'Wysokie bloki z windą, obok niższe bez niej. Dla każdego mieszkania liczymy osobno, bez uśredniania.', 'Високі будинки з ліфтом, поруч — п’ятиповерхівки без нього. Для кожної квартири рахуємо окремо, без усереднення.', 'Tall blocks with lifts stand next to five-storey ones without. We price each flat on its own, not on averages.')],
      [l('Через Вислу', 'Przez Wisłę', 'Через Віслу', 'Across the Vistula'),
       l('Если новый адрес на левом берегу, время выезда выбираем так, чтобы не стоять на мостах в час пик.', 'Jeśli nowy adres jest po lewej stronie Wisły, godzinę wyjazdu dobieramy tak, żeby nie stać na mostach w szczycie.', 'Якщо нова адреса на лівому березі, час виїзду обираємо так, щоб не стояти на мостах у годину пік.', 'If your new home is on the left bank, we time the trip so we don’t sit on the bridges in rush hour.')],
    ],
    near: ['srodmiescie', 'targowek', 'zabki', 'mokotow'],
  },
  {
    id: 'ursynow', kind: 'district',
    name: l('Урсынов', 'Ursynów', 'Урсинів', 'Ursynów'),
    loc: l('на Урсынове', 'na Ursynowie', 'на Урсинові', 'in Ursynów'),
    intro: l(
      'Урсынов — большие кварталы 70–80-х годов (Натолин, Кабаты, Имелин) и новые дома у Кабацкого леса. Здесь заканчивается линия метро M1.',
      'Ursynów to duże osiedla z lat 70. i 80. — Natolin, Kabaty, Imielin — i nowe budynki przy Lesie Kabackim. Tu kończy się linia metra M1.',
      'Урсинів — великі квартали 70–80-х років (Натолін, Кабати, Імелін) і нові будинки біля Кабацького лісу. Тут закінчується лінія метро M1.',
      'Ursynów means the large 1970s–80s estates of Natolin, Kabaty and Imielin, plus new buildings by the Kabaty Woods. It’s where metro line M1 ends.'),
    points: [
      [l('Высокие и низкие дома рядом', 'Wysokie i niskie bloki obok siebie', 'Високі й низькі будинки поруч', 'High and low blocks side by side'),
       l('В высоких домах есть лифт, в четырёх-пятиэтажках — обычно нет. Этаж и лифт выбираете в калькуляторе, точную цену называем по видео.', 'W wysokich blokach jest winda, w cztero- i pięciopiętrowych zwykle nie. Piętro i windę wybierasz w kalkulatorze, dokładną cenę podajemy z wideo.', 'У високих будинках є ліфт, у чотири-п’ятиповерхівках — зазвичай немає. Поверх і ліфт обираєте в калькуляторі, точну ціну називаємо за відео.', 'Tall blocks have lifts; four- and five-storey ones usually don’t. You set the floor and lift in the calculator, and we give the exact price from the video.')],
      [l('Подъезд к дому', 'Dojazd pod klatkę', 'Під’їзд до будинку', 'Getting to the door'),
       l('Во дворах часто внутренние дороги и шлагбаумы. По видео видим, где встанет бус, и заранее говорим, что нужно открыть.', 'Na osiedlach często są wewnętrzne drogi i szlabany. Z wideo widzimy, gdzie stanie bus, i wcześniej mówimy, co trzeba otworzyć.', 'У дворах часто внутрішні дороги й шлагбауми. За відео бачимо, де стане бус, і заздалегідь кажемо, що треба відчинити.', 'Estates often have internal roads and barriers. From the video we see where the van will stop and tell you in advance what needs opening.')],
      [l('Рядом Пясечно и Констанцин', 'Blisko Piaseczno i Konstancin', 'Поруч Пясечно й Констанцін', 'Close to Piaseczno and Konstancin'),
       l('Переезд из Урсынова в дом под Варшавой — короткая дорога на юг, без лишних часов в пробке.', 'Przeprowadzka z Ursynowa do domu pod Warszawą to krótka trasa na południe, bez godzin w korku.', 'Переїзд з Урсинова в будинок під Варшавою — коротка дорога на південь, без зайвих годин у заторі.', 'Moving from Ursynów to a house outside Warsaw is a short trip south, without hours in traffic.')],
    ],
    near: ['mokotow', 'wilanow', 'piaseczno'],
  },
  {
    id: 'bielany', kind: 'district',
    name: l('Беляны', 'Bielany', 'Біляни', 'Bielany'),
    loc: l('на Белянах', 'na Bielanach', 'на Білянах', 'in Bielany'),
    intro: l(
      'Беляны — зелёный район у Белянского леса и Вислы: кварталы Хомичувка, Вавжишев и Вжецёно, виллы Старых Белян и новые дома на Млоцинах.',
      'Bielany to zielona dzielnica przy Lesie Bielańskim i Wiśle: osiedla Chomiczówki, Wawrzyszewa i Wrzeciona, wille Starych Bielan i nowe budynki na Młocinach.',
      'Біляни — зелений район біля Білянського лісу та Вісли: квартали Хомічувка, Вавжишев і Вжецьоно, вілли Старих Білян і нові будинки на Млоцинах.',
      'Bielany is a green district by the Bielany Forest and the Vistula: the estates of Chomiczówka, Wawrzyszew and Wrzeciono, the villas of Old Bielany and new buildings in Młociny.'),
    points: [
      [l('Кварталы 70-х', 'Osiedla z lat 70.', 'Квартали 70-х', '1970s estates'),
       l('Много пятиэтажек без лифта и узких лестниц. Тяжёлое — шкафы, стиральную машину — выносим на ремнях, стены и двери защищаем.', 'Dużo bloków bez windy i wąskich klatek. Ciężkie rzeczy — szafy, pralkę — znosimy na pasach, ściany i drzwi zabezpieczamy.', 'Багато п’ятиповерхівок без ліфта й вузьких сходів. Важке — шафи, пральну машину — виносимо на ременях, стіни й двері захищаємо.', 'Lots of walk-up blocks with narrow stairs. Heavy items — wardrobes, the washing machine — go down on straps, with walls and doors protected.')],
      [l('Виллы Старых Белян', 'Wille Starych Bielan', 'Вілли Старих Білян', 'Villas of Old Bielany'),
       l('Тихие улицы с домами: место для буса согласуем так, чтобы не перекрывать соседям выезд.', 'Spokojne uliczki z domami: miejsce dla busa ustalamy tak, żeby nie blokować sąsiadom wyjazdu.', 'Тихі вулиці з будинками: місце для буса погоджуємо так, щоб не перекривати сусідам виїзд.', 'Quiet streets of houses: we place the van so neighbours can still get out of their drives.')],
      [l('На север за город', 'Na północ za miasto', 'На північ за місто', 'North, out of town'),
       l('Ломянки и окрестности — рядом. Такой переезд в калькуляторе — «до 50 км».', 'Łomianki i okolice są tuż obok. Taka przeprowadzka to w kalkulatorze „do 50 km”.', 'Ломянки й околиці — поруч. Такий переїзд у калькуляторі — «до 50 км».', 'Łomianki and the area around are right next door. In the calculator that’s “up to 50 km”.')],
    ],
    near: ['zoliborz', 'bemowo', 'lomianki', 'bialoleka'],
  },
  {
    id: 'bemowo', kind: 'district',
    name: l('Бемово', 'Bemowo', 'Бемово', 'Bemowo'),
    loc: l('на Бемове', 'na Bemowie', 'на Бемові', 'in Bemowo'),
    intro: l(
      'Бемово — это кварталы Елонек и Гурц, зелёное Бёрнерово с частными домами и новые жилые комплексы, которые здесь продолжают строить.',
      'Bemowo to osiedla Jelonek i Górc, zielone Boernerowo z domami jednorodzinnymi i nowe osiedla, które wciąż tu powstają.',
      'Бемово — це квартали Єлонок і Гурц, зелене Бернерово з приватними будинками та нові житлові комплекси, які тут далі будують.',
      'Bemowo means the estates of Jelonki and Górce, leafy Boernerowo with its family houses, and new developments still going up.'),
    points: [
      [l('Новостройки', 'Nowe osiedla', 'Новобудови', 'New developments'),
       l('В новом доме часто в одно время въезжает много соседей. Дату лучше закрепить заранее — бронь фиксируется предоплатой.', 'W nowym budynku wielu sąsiadów wprowadza się w tym samym czasie. Termin warto zarezerwować wcześniej — rezerwację potwierdza przedpłata.', 'У новий будинок часто одночасно заїжджає багато сусідів. Дату краще закріпити заздалегідь — бронь фіксується передоплатою.', 'In a new building many neighbours move in at once. It’s worth booking early — a prepayment secures your date.')],
      [l('Дома Бёрнерова', 'Domy na Boernerowie', 'Будинки Бернерова', 'Houses in Boernerowo'),
       l('Частный дом — больше мебели и вещей из подвала и гаража. Упаковку и разборку мебели считаем в цене сразу.', 'Dom jednorodzinny to więcej mebli i rzeczy z piwnicy i garażu. Pakowanie i demontaż mebli od razu są w cenie.', 'Приватний будинок — більше меблів і речей з підвалу та гаража. Пакування й розбирання меблів одразу в ціні.', 'A family house means more furniture and more from the cellar and garage. Packing and furniture disassembly are priced in from the start.')],
      [l('Соседи — Воля и Беляны', 'Sąsiedzi: Wola i Bielany', 'Сусіди — Воля й Біляни', 'Next to Wola and Bielany'),
       l('Переезды по западной части Варшавы — короткие, обычно укладываемся в один день вместе со сборкой мебели.', 'Przeprowadzki po zachodniej Warszawie są krótkie — zwykle mieścimy się w jednym dniu razem z montażem mebli.', 'Переїзди західною частиною Варшави короткі — зазвичай укладаємося в один день разом зі збиранням меблів.', 'Moves within western Warsaw are short — usually done in a single day, furniture assembly included.')],
    ],
    near: ['wola', 'bielany', 'ochota'],
  },
  {
    id: 'bialoleka', kind: 'district',
    name: l('Белоленка', 'Białołęka', 'Бялоленка', 'Białołęka'),
    loc: l('на Белоленке', 'na Białołęce', 'на Бялоленці', 'in Białołęka'),
    intro: l(
      'Белоленка — один из самых быстрорастущих районов Варшавы: Тархомин, Новодворы, Хощувка, много новых жилых комплексов и частных домов.',
      'Białołęka to jedna z najszybciej rosnących dzielnic Warszawy: Tarchomin, Nowodwory, Choszczówka, wiele nowych osiedli i domów jednorodzinnych.',
      'Бялоленка — один із районів Варшави, що ростуть найшвидше: Тархомін, Новодвори, Хощувка, багато нових житлових комплексів і приватних будинків.',
      'Białołęka is one of Warsaw’s fastest-growing districts: Tarchomin, Nowodwory, Choszczówka, with many new estates and family houses.'),
    points: [
      [l('Переезд в новостройку', 'Przeprowadzka do nowego mieszkania', 'Переїзд у новобудову', 'Moving into a new build'),
       l('Можем привезти белые коробки заранее, собрать новую мебель и вывезти упаковку — чтобы в первый вечер в квартире было уже уютно.', 'Możemy wcześniej przywieźć białe kartony, złożyć nowe meble i wywieźć opakowania — żeby już pierwszego wieczoru było przytulnie.', 'Можемо заздалегідь привезти білі коробки, зібрати нові меблі й вивезти пакування — щоб уже першого вечора в квартирі було затишно.', 'We can bring white boxes in advance, assemble new furniture and take the packaging away — so your first evening there already feels like home.')],
      [l('Мосты через Вислу', 'Mosty przez Wisłę', 'Мости через Віслу', 'Bridges over the Vistula'),
       l('Через мост Марии Склодовской-Кюри или мост Грота едем не в час пик — время выезда планируем вместе с вами.', 'Przez Most Marii Skłodowskiej-Curie czy Most Grota jedziemy poza szczytem — godzinę wyjazdu planujemy razem z Tobą.', 'Мостом Марії Склодовської-Кюрі чи мостом Грота їдемо не в годину пік — час виїзду плануємо разом із вами.', 'We cross the Skłodowska-Curie or Grot bridge outside rush hour — we plan the departure time with you.')],
      [l('Частные дома', 'Domy jednorodzinne', 'Приватні будинки', 'Family houses'),
       l('Для дома важны подвал, гараж и сад. Всё это видно на видео — цена не изменится в день переезда.', 'W domu liczą się piwnica, garaż i ogród. Wszystko to widać na wideo — cena nie zmieni się w dniu przeprowadzki.', 'Для будинку важливі підвал, гараж і сад. Усе це видно на відео — ціна не зміниться в день переїзду.', 'With a house, the cellar, garage and garden all count. We see them on the video — the price won’t change on the day.')],
    ],
    near: ['targowek', 'bielany', 'marki', 'legionowo'],
  },
  {
    id: 'targowek', kind: 'district',
    name: l('Таргувек', 'Targówek', 'Таргувек', 'Targówek'),
    loc: l('на Таргувеке', 'na Targówku', 'на Таргувку', 'in Targówek'),
    intro: l(
      'Таргувек — это большие кварталы Брудно, частные дома Зацише и Эльснерова и Таргувек Мешканёвы. В районе есть станции второй линии метро.',
      'Targówek to duże osiedla Bródna, domy Zacisza i Elsnerowa oraz Targówek Mieszkaniowy. W dzielnicy są stacje drugiej linii metra.',
      'Таргувек — це великі квартали Брудна, приватні будинки Зацише й Ельснерова та Таргувек Мешканьови. У районі є станції другої лінії метро.',
      'Targówek means the big estates of Bródno, the houses of Zacisze and Elsnerów, and Targówek Mieszkaniowy. The district is served by metro line M2.'),
    points: [
      [l('Брудно', 'Bródno', 'Брудно', 'Bródno'),
       l('Десятиэтажки с лифтом и дома пониже без него. Лифт заранее защищаем, чтобы не поцарапать кабину и не задерживать соседей.', 'Dziesięciopiętrowce z windą i niższe bloki bez niej. Windę wcześniej zabezpieczamy, żeby nie porysować kabiny i nie blokować sąsiadów.', 'Десятиповерхівки з ліфтом і нижчі будинки без нього. Ліфт заздалегідь захищаємо, щоб не подряпати кабіну й не затримувати сусідів.', 'Ten-storey blocks with lifts and lower ones without. We protect the lift car first, so nothing gets scratched and neighbours aren’t held up.')],
      [l('Дома Зацише', 'Domy na Zaciszu', 'Будинки Зацише', 'Houses in Zacisze'),
       l('Тихие улицы с частными домами: больше мебели, техника, вещи из гаража. Всё это включаем в цену по видео.', 'Spokojne ulice z domami: więcej mebli, sprzęt AGD, rzeczy z garażu. Wszystko wliczamy w cenę z wideo.', 'Тихі вулиці з приватними будинками: більше меблів, техніка, речі з гаража. Усе включаємо в ціну за відео.', 'Quiet streets of family houses: more furniture, appliances, things from the garage. All included in the price from the video.')],
      [l('Рядом Марки и Зомбки', 'Blisko Marki i Ząbki', 'Поруч Марки й Зомбки', 'Close to Marki and Ząbki'),
       l('Много переездов идёт отсюда в соседние города — дорога короткая, в калькуляторе это «до 50 км».', 'Wiele przeprowadzek prowadzi stąd do sąsiednich miast — trasa jest krótka, w kalkulatorze to „do 50 km”.', 'Багато переїздів іде звідси в сусідні міста — дорога коротка, у калькуляторі це «до 50 км».', 'Many moves go from here to the neighbouring towns — it’s a short trip, “up to 50 km” in the calculator.')],
    ],
    near: ['bialoleka', 'praga-poludnie', 'marki', 'zabki'],
  },
  {
    id: 'wilanow', kind: 'district',
    name: l('Вилянув', 'Wilanów', 'Віланув', 'Wilanów'),
    loc: l('в Вилянуве', 'w Wilanowie', 'у Вілянові', 'in Wilanów'),
    intro: l(
      'Вилянув — это Мястечко Вилянув с новыми жилыми комплексами, виллы и частные дома, а рядом — Вилянувский дворец и Констанцин.',
      'Wilanów to Miasteczko Wilanów z nowymi apartamentowcami, wille i domy jednorodzinne, a obok Pałac w Wilanowie i Konstancin.',
      'Віланув — це Містечко Віланув із новими житловими комплексами, вілли й приватні будинки, а поруч — Віланувський палац і Констанцін.',
      'Wilanów means Miasteczko Wilanów with its new apartment buildings, villas and family houses, with Wilanów Palace and Konstancin next door.'),
    points: [
      [l('Жилые комплексы', 'Apartamentowce', 'Житлові комплекси', 'Apartment buildings'),
       l('Подземные гаражи, лифты, правила сообщества жильцов. Заранее подскажем, что согласовать с администрацией дома.', 'Garaże podziemne, windy, regulamin wspólnoty. Wcześniej podpowiemy, co uzgodnić z administracją budynku.', 'Підземні гаражі, ліфти, правила спільноти мешканців. Заздалегідь підкажемо, що погодити з адміністрацією будинку.', 'Underground garages, lifts, residents’ association rules. We’ll tell you in advance what to agree with the building management.')],
      [l('Большие дома', 'Duże domy', 'Великі будинки', 'Large houses'),
       l('Много мебели, гардеробные, вещи из подвала и сада. Одежду везём на вешалках в гардеробных коробках — приезжает не мятой.', 'Dużo mebli, garderoby, rzeczy z piwnicy i ogrodu. Ubrania wieziemy na wieszakach w kartonach garderobianych — przyjeżdżają niepogniecione.', 'Багато меблів, гардеробні, речі з підвалу й саду. Одяг веземо на вішаках у гардеробних коробках — приїжджає не м’ятим.', 'Lots of furniture, walk-in wardrobes, things from the cellar and garden. Clothes travel on hangers in wardrobe boxes and arrive uncreased.')],
      [l('Хрупкое и ценное', 'Rzeczy delikatne i cenne', 'Крихке й цінне', 'Fragile and valuable items'),
       l('Зеркала, стекло, картины и посуду пакуем отдельно: бумага, плёнка, коробки с перегородками.', 'Lustra, szkło, obrazy i naczynia pakujemy osobno: papier, folia, kartony z przegródkami.', 'Дзеркала, скло, картини й посуд пакуємо окремо: папір, плівка, коробки з перегородками.', 'Mirrors, glass, pictures and dishes are packed separately: paper, film and boxes with dividers.')],
    ],
    near: ['ursynow', 'mokotow', 'piaseczno'],
  },
  {
    id: 'zoliborz', kind: 'district',
    name: l('Жолибож', 'Żoliborz', 'Жолібож', 'Żoliborz'),
    loc: l('на Жолибоже', 'na Żoliborzu', 'на Жолібожі', 'in Żoliborz'),
    intro: l(
      'Жолибож — довоенные виллы Офицерского Жолибожа, каменицы вокруг площади Вильсона, кварталы Садов Жолибожских и новые дома.',
      'Żoliborz to przedwojenne wille Żoliborza Oficerskiego, kamienice wokół placu Wilsona, osiedle Sady Żoliborskie i nowe budynki.',
      'Жолібож — довоєнні вілли Офіцерського Жолібожа, кам’яниці навколо площі Вільсона, квартали Садів Жолібожських і нові будинки.',
      'Żoliborz means the pre-war villas of Officers’ Żoliborz, tenements around Plac Wilsona, the Sady Żoliborskie estate and new buildings.'),
    points: [
      [l('Довоенные виллы', 'Przedwojenne wille', 'Довоєнні вілли', 'Pre-war villas'),
       l('Узкие лестницы, старые двери и паркет. Защищаем пол дорожками, косяки — накладками, мебель — плёнкой и одеялами.', 'Wąskie schody, stare drzwi i parkiet. Podłogę chronimy chodnikami, futryny osłonami, meble folią i kocami.', 'Вузькі сходи, старі двері й паркет. Підлогу захищаємо доріжками, одвірки — накладками, меблі — плівкою й ковдрами.', 'Narrow stairs, old doors and parquet. We cover floors with runners, door frames with guards and furniture with film and blankets.')],
      [l('Тихие улицы', 'Spokojne uliczki', 'Тихі вулиці', 'Quiet streets'),
       l('Бус ставим так, чтобы не перекрыть соседей, и работаем аккуратно и без лишнего шума.', 'Busa stawiamy tak, żeby nie blokować sąsiadów, i pracujemy sprawnie, bez zbędnego hałasu.', 'Бус ставимо так, щоб не перекрити сусідів, і працюємо акуратно, без зайвого шуму.', 'We park so neighbours aren’t blocked in and work neatly, without unnecessary noise.')],
      [l('Каменицы без лифта', 'Kamienice bez windy', 'Кам’яниці без ліфта', 'Tenements without a lift'),
       l('Этажи считаем по видео и сразу включаем в цену. Изменения — только с вашего согласия и до начала работ.', 'Piętra liczymy z wideo i od razu wliczamy w cenę. Zmiany — tylko za Twoją zgodą i przed rozpoczęciem pracy.', 'Поверхи рахуємо за відео й одразу включаємо в ціну. Зміни — лише з вашої згоди й до початку робіт.', 'We count floors from the video and include them in the price. Any change only with your consent and before work starts.')],
    ],
    near: ['bielany', 'srodmiescie', 'wola'],
  },
  {
    id: 'ochota', kind: 'district',
    name: l('Охота', 'Ochota', 'Охота', 'Ochota'),
    loc: l('на Охоте', 'na Ochocie', 'на Охоті', 'in Ochota'),
    intro: l(
      'Охота — каменицы Старой Охоты, кварталы Щенсливиц и Ракувца, много съёмных квартир и студентов.',
      'Ochota to kamienice Starej Ochoty, osiedla Szczęśliwic i Rakowca, dużo mieszkań na wynajem i studentów.',
      'Охота — кам’яниці Старої Охоти, квартали Щенсливіц і Раковця, багато орендованих квартир і студентів.',
      'Ochota means the tenements of Old Ochota, the estates of Szczęśliwice and Rakowiec, plenty of rented flats and students.'),
    points: [
      [l('Небольшие переезды', 'Małe przeprowadzki', 'Невеликі переїзди', 'Small moves'),
       l('Студия или комната — тоже переезд. Те же правила: цена по видео, фактура, бригада в форме.', 'Kawalerka czy pokój to też przeprowadzka. Te same zasady: cena z wideo, faktura, ekipa w uniformach.', 'Студія чи кімната — теж переїзд. Ті самі правила: ціна за відео, фактура, бригада у формі.', 'A studio or a single room is a move too. Same rules: a price from the video, an invoice, a crew in uniform.')],
      [l('Съёмные квартиры', 'Mieszkania na wynajem', 'Орендовані квартири', 'Rented flats'),
       l('Выезжаете из съёмной квартиры — защищаем стены и пол, чтобы при сдаче ключей не было вопросов от владельца.', 'Wyprowadzasz się z wynajmowanego mieszkania — chronimy ściany i podłogi, żeby przy oddaniu kluczy właściciel nie miał uwag.', 'Виїжджаєте з орендованої квартири — захищаємо стіни й підлогу, щоб під час здачі ключів у власника не було питань.', 'Leaving a rented flat? We protect walls and floors, so handing back the keys goes without questions from the landlord.')],
      [l('Каменицы Старой Охоты', 'Kamienice Starej Ochoty', 'Кам’яниці Старої Охоти', 'Old Ochota tenements'),
       l('Высокие этажи без лифта и дворы-колодцы. Маршрут от квартиры до буса видим по видео заранее.', 'Wysokie piętra bez windy i podwórka-studnie. Drogę od mieszkania do busa widzimy wcześniej na wideo.', 'Високі поверхи без ліфта й двори-колодязі. Маршрут від квартири до буса бачимо заздалегідь на відео.', 'High floors without lifts and enclosed courtyards. We see the route from the flat to the van on the video in advance.')],
    ],
    near: ['wola', 'mokotow', 'srodmiescie', 'pruszkow'],
  },
  {
    id: 'piaseczno', kind: 'town',
    name: l('Пясечно', 'Piaseczno', 'Пясечно', 'Piaseczno'),
    loc: l('в Пясечно', 'w Piasecznie', 'у Пясечно', 'in Piaseczno'),
    intro: l(
      'Пясечно к югу от Варшавы — частные дома, новые жилые кварталы и старый центр. Сюда часто переезжают из Варшавы в собственный дом.',
      'Piaseczno na południe od Warszawy to domy jednorodzinne, nowe osiedla i stare centrum. Wiele osób przeprowadza się tu z Warszawy do własnego domu.',
      'Пясечно на південь від Варшави — приватні будинки, нові житлові квартали й старий центр. Сюди часто переїжджають з Варшави у власний будинок.',
      'Piaseczno, south of Warsaw, has family houses, new estates and an old town centre. Many people move here from Warsaw into a house of their own.'),
    points: [
      [l('Из квартиры в дом', 'Z mieszkania do domu', 'З квартири в будинок', 'From a flat to a house'),
       l('Новый дом — новая мебель. Соберём её, расставим всё по комнатам и вывезем упаковку.', 'Nowy dom to nowe meble. Złożymy je, ustawimy wszystko w pokojach i wywieziemy opakowania.', 'Новий будинок — нові меблі. Зберемо їх, розставимо все по кімнатах і вивеземо пакування.', 'A new house means new furniture. We assemble it, arrange everything room by room and take the packaging away.')],
      [l('Пулавская в час пик', 'Puławska w szczycie', 'Пулавська в годину пік', 'Puławska at rush hour'),
       l('Дорога между Варшавой и Пясечно бывает забита — время выезда выбираем так, чтобы не стоять в пробке.', 'Trasa między Warszawą a Piasecznem bywa zakorkowana — godzinę wyjazdu dobieramy tak, żeby nie stać w korku.', 'Дорога між Варшавою та Пясечно буває забита — час виїзду обираємо так, щоб не стояти в заторі.', 'The road between Warsaw and Piaseczno often jams — we time the trip to stay out of the queues.')],
      [l('Зона «до 50 км»', 'Strefa „do 50 km”', 'Зона «до 50 км»', 'The “up to 50 km” zone'),
       l('В калькуляторе выбирайте «до 50 км» — так ориентир сразу будет с учётом дороги.', 'W kalkulatorze wybierz „do 50 km” — wtedy orientacyjna cena od razu uwzględni dojazd.', 'У калькуляторі обирайте «до 50 км» — так орієнтир одразу враховуватиме дорогу.', 'Choose “up to 50 km” in the calculator so the estimate includes the journey.')],
    ],
    near: ['ursynow', 'wilanow', 'mokotow'],
  },
  {
    id: 'pruszkow', kind: 'town',
    name: l('Прушков', 'Pruszków', 'Прушків', 'Pruszków'),
    loc: l('в Прушкове', 'w Pruszkowie', 'у Прушкові', 'in Pruszków'),
    intro: l(
      'Прушков к западу от Варшавы — жилые кварталы, частные дома и новые комплексы. Много людей живёт здесь, а работает в Варшаве.',
      'Pruszków na zachód od Warszawy to osiedla bloków, domy jednorodzinne i nowe inwestycje. Wiele osób mieszka tu, a pracuje w Warszawie.',
      'Прушків на захід від Варшави — житлові квартали, приватні будинки й нові комплекси. Багато людей живе тут, а працює у Варшаві.',
      'Pruszków, west of Warsaw, has housing estates, family houses and new developments. Many people live here and work in Warsaw.'),
    points: [
      [l('Переезд в выходной', 'Przeprowadzka w weekend', 'Переїзд у вихідний', 'Moving at the weekend'),
       l('Работаете в будни — переедем в субботу или воскресенье. Работаем 7 дней в неделю.', 'Pracujesz w tygodniu — przeprowadzimy Cię w sobotę lub niedzielę. Pracujemy 7 dni w tygodniu.', 'Працюєте в будні — переїдемо в суботу чи неділю. Працюємо 7 днів на тиждень.', 'Busy on weekdays? We’ll move you on a Saturday or Sunday. We work 7 days a week.')],
      [l('Дома и кварталы', 'Domy i osiedla', 'Будинки й квартали', 'Houses and estates'),
       l('Для дома и квартиры — разный объём и разная бригада. Это видно на видео, и цену называем под ваш случай.', 'Dom i mieszkanie to inna ilość rzeczy i inna ekipa. Widać to na wideo, a cenę podajemy pod Twój przypadek.', 'Для будинку й квартири — різний обсяг і різна бригада. Це видно на відео, і ціну називаємо під ваш випадок.', 'A house and a flat need different volumes and crews. The video shows it, and we price your case, not an average.')],
      [l('Зона «до 50 км»', 'Strefa „do 50 km”', 'Зона «до 50 км»', 'The “up to 50 km” zone'),
       l('Переезд между Прушковом и Варшавой в калькуляторе — «до 50 км».', 'Przeprowadzka między Pruszkowem a Warszawą to w kalkulatorze „do 50 km”.', 'Переїзд між Прушковом і Варшавою в калькуляторі — «до 50 км».', 'A move between Pruszków and Warsaw is “up to 50 km” in the calculator.')],
    ],
    near: ['ochota', 'wola', 'bemowo'],
  },
  {
    id: 'legionowo', kind: 'town',
    name: l('Легионово', 'Legionowo', 'Легіоново', 'Legionowo'),
    loc: l('в Легионово', 'w Legionowie', 'у Легіоново', 'in Legionowo'),
    intro: l(
      'Легионово к северу от Варшавы — жилые кварталы, частные дома и близость Зегжинского водохранилища.',
      'Legionowo na północ od Warszawy to osiedla, domy jednorodzinne i bliskość Zalewu Zegrzyńskiego.',
      'Легіоново на північ від Варшави — житлові квартали, приватні будинки й близькість Зегжинського водосховища.',
      'Legionowo, north of Warsaw, has housing estates, family houses and Lake Zegrze close by.'),
    points: [
      [l('Дорога в Варшаву', 'Droga do Warszawy', 'Дорога до Варшави', 'The road to Warsaw'),
       l('Через Белоленку и мосты едем не в час пик — время выезда согласуем с вами.', 'Przez Białołękę i mosty jedziemy poza szczytem — godzinę wyjazdu ustalamy z Tobą.', 'Через Бялоленку й мости їдемо не в годину пік — час виїзду погоджуємо з вами.', 'We go through Białołęka and over the bridges outside rush hour — we agree the departure time with you.')],
      [l('Дом у воды', 'Dom nad wodą', 'Будинок біля води', 'A house by the water'),
       l('Садовая мебель, лодочное и спортивное снаряжение — тоже вещи. Всё видим на видео и учитываем в цене.', 'Meble ogrodowe, sprzęt sportowy i wodny to też rzeczy do przewiezienia. Wszystko widzimy na wideo i wliczamy w cenę.', 'Садові меблі, спортивне й водне спорядження — теж речі. Усе бачимо на відео й враховуємо в ціні.', 'Garden furniture, sports and water gear are things to move too. We see it all on the video and include it in the price.')],
      [l('Зона «до 50 км»', 'Strefa „do 50 km”', 'Зона «до 50 км»', 'The “up to 50 km” zone'),
       l('В калькуляторе для Легионово выбирайте «до 50 км».', 'W kalkulatorze dla Legionowa wybierz „do 50 km”.', 'У калькуляторі для Легіоново обирайте «до 50 км».', 'For Legionowo, choose “up to 50 km” in the calculator.')],
    ],
    near: ['bialoleka', 'targowek', 'marki'],
  },
  {
    id: 'marki', kind: 'town',
    name: l('Марки', 'Marki', 'Марки', 'Marki'),
    loc: l('в Марках', 'w Markach', 'у Марках', 'in Marki'),
    intro: l(
      'Марки на северо-восточной границе Варшавы — новые жилые кварталы и частные дома вдоль Радзыминской.',
      'Marki na północno-wschodniej granicy Warszawy to nowe osiedla i domy jednorodzinne wzdłuż Radzymińskiej.',
      'Марки на північно-східному кордоні Варшави — нові житлові квартали й приватні будинки вздовж Радзимінської.',
      'Marki, on Warsaw’s north-eastern edge, has new estates and family houses along Radzymińska Street.'),
    points: [
      [l('Новые кварталы', 'Nowe osiedla', 'Нові квартали', 'New estates'),
       l('Закрытые территории, шлагбаумы, подземные паркинги. По видео заранее видим, где встанет бус и как пройти к лифту.', 'Zamknięte osiedla, szlabany, garaże podziemne. Z wideo wcześniej widzimy, gdzie stanie bus i jak dojść do windy.', 'Закриті території, шлагбауми, підземні паркінги. За відео заздалегідь бачимо, де стане бус і як пройти до ліфта.', 'Gated estates, barriers, underground car parks. The video shows us in advance where the van will stop and how to reach the lift.')],
      [l('Частные дома', 'Domy jednorodzinne', 'Приватні будинки', 'Family houses'),
       l('Разберём и соберём мебель, упакуем технику и хрупкое — всё в одной фиксированной цене.', 'Rozłożymy i złożymy meble, spakujemy sprzęt i rzeczy delikatne — wszystko w jednej stałej cenie.', 'Розберемо й зберемо меблі, запакуємо техніку та крихке — усе в одній фіксованій ціні.', 'We take furniture apart and put it back together, and pack appliances and fragile items — all in one fixed price.')],
      [l('Зона «до 50 км»', 'Strefa „do 50 km”', 'Зона «до 50 км»', 'The “up to 50 km” zone'),
       l('Переезд между Марками и Варшавой в калькуляторе — «до 50 км».', 'Przeprowadzka między Markami a Warszawą to w kalkulatorze „do 50 km”.', 'Переїзд між Марками й Варшавою в калькуляторі — «до 50 км».', 'A move between Marki and Warsaw is “up to 50 km” in the calculator.')],
    ],
    near: ['targowek', 'bialoleka', 'zabki'],
  },
  {
    id: 'zabki', kind: 'town',
    name: l('Зомбки', 'Ząbki', 'Зомбки', 'Ząbki'),
    loc: l('в Зомбках', 'w Ząbkach', 'у Зомбках', 'in Ząbki'),
    intro: l(
      'Зомбки у восточной границы Варшавы — плотно застроенный город с множеством новых жилых домов.',
      'Ząbki przy wschodniej granicy Warszawy to gęsto zabudowane miasto z wieloma nowymi budynkami mieszkalnymi.',
      'Зомбки біля східного кордону Варшави — щільно забудоване місто з безліччю нових житлових будинків.',
      'Ząbki, on Warsaw’s eastern edge, is a densely built town with many new apartment buildings.'),
    points: [
      [l('Плотная застройка', 'Gęsta zabudowa', 'Щільна забудова', 'Dense streets'),
       l('Узкие улицы и мало места у подъезда. Время подъезда и место для буса планируем заранее.', 'Wąskie ulice i mało miejsca pod klatką. Godzinę podjazdu i miejsce dla busa planujemy wcześniej.', 'Вузькі вулиці й мало місця біля під’їзду. Час під’їзду й місце для буса плануємо заздалегідь.', 'Narrow streets and little space outside the door. We plan the arrival time and the van’s spot in advance.')],
      [l('Лифт в новом доме', 'Winda w nowym bloku', 'Ліфт у новому будинку', 'The lift in a new block'),
       l('Защищаем кабину лифта и холл, чтобы ваш переезд не стал проблемой для соседей и сообщества жильцов.', 'Zabezpieczamy kabinę windy i hol, żeby Twoja przeprowadzka nie była problemem dla sąsiadów i wspólnoty.', 'Захищаємо кабіну ліфта й хол, щоб ваш переїзд не став проблемою для сусідів і спільноти мешканців.', 'We protect the lift car and lobby, so your move isn’t a problem for the neighbours or the residents’ association.')],
      [l('Зона «до 50 км»', 'Strefa „do 50 km”', 'Зона «до 50 км»', 'The “up to 50 km” zone'),
       l('Переезд между Зомбками и Варшавой в калькуляторе — «до 50 км».', 'Przeprowadzka między Ząbkami a Warszawą to w kalkulatorze „do 50 km”.', 'Переїзд між Зомбками й Варшавою в калькуляторі — «до 50 км».', 'A move between Ząbki and Warsaw is “up to 50 km” in the calculator.')],
    ],
    near: ['targowek', 'marki', 'praga-poludnie'],
  },
  {
    id: 'lomianki', kind: 'town',
    name: l('Ломянки', 'Łomianki', 'Ломянки', 'Łomianki'),
    loc: l('в Ломянках', 'w Łomiankach', 'у Ломянках', 'in Łomianki'),
    intro: l(
      'Ломянки к северо-западу от Варшавы — в основном частные дома, рядом Кампиносская пуща и Висла.',
      'Łomianki na północny zachód od Warszawy to głównie domy jednorodzinne, a obok Puszcza Kampinoska i Wisła.',
      'Ломянки на північний захід від Варшави — переважно приватні будинки, поруч Кампіноська пуща й Вісла.',
      'Łomianki, north-west of Warsaw, is mostly family houses, with the Kampinos Forest and the Vistula close by.'),
    points: [
      [l('Переезд дома', 'Przeprowadzka domu', 'Переїзд будинку', 'Moving a house'),
       l('Несколько этажей, подвал, гараж, сад. Делим работу по комнатам, коробки подписываем наклейками с цветом комнаты и QR.', 'Kilka pięter, piwnica, garaż, ogród. Pracę dzielimy na pokoje, a kartony oznaczamy naklejkami z kolorem pokoju i kodem QR.', 'Кілька поверхів, підвал, гараж, сад. Ділимо роботу по кімнатах, коробки підписуємо наліпками з кольором кімнати й QR.', 'Several floors, a cellar, a garage, a garden. We split the work by room and label boxes with a room colour and a QR code.')],
      [l('Беляны рядом', 'Bielany tuż obok', 'Біляни поруч', 'Right next to Bielany'),
       l('Из Ломянок в северную Варшаву — короткая дорога, обычно всё укладывается в один день.', 'Z Łomianek do północnej Warszawy jest blisko — zwykle wszystko mieści się w jednym dniu.', 'З Ломянок до північної Варшави — коротка дорога, зазвичай усе вкладається в один день.', 'From Łomianki to northern Warsaw is a short drive — usually everything fits into one day.')],
      [l('Зона «до 50 км»', 'Strefa „do 50 km”', 'Зона «до 50 км»', 'The “up to 50 km” zone'),
       l('В калькуляторе для Ломянок выбирайте «до 50 км».', 'W kalkulatorze dla Łomianek wybierz „do 50 km”.', 'У калькуляторі для Ломянок обирайте «до 50 км».', 'For Łomianki, choose “up to 50 km” in the calculator.')],
    ],
    near: ['bielany', 'zoliborz', 'bemowo'],
  },
];

export const areaById = (id: string) => areas.find((a) => a.id === id);
/** часть адреса перед названием места, по языкам */
export const areaPrefix: Record<keyof L, string> = { pl: 'przeprowadzki', ru: 'pereezdy', uk: 'pereyizdy', en: 'moving' };
