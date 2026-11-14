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
      'Мокотув — один из самых больших районов Варшавы: довоенные каменицы и виллы Старого Мокотува, многоэтажки на Стегнах, Садыбе и Служеве, новые жилые комплексы и офисы Служевца.',
      'Mokotów to jedna z największych dzielnic Warszawy: przedwojenne kamienice i wille Starego Mokotowa, bloki Stegien, Sadyby i Służewa, nowe osiedla i biurowce Służewca.',
      'Мокотув — один із найбільших районів Варшави: довоєнні кам’яниці та вілли Старого Мокотова, багатоповерхівки на Стегнах, Садибі й Служеві, нові житлові комплекси та офіси Служевця.',
      'Mokotów is one of Warsaw’s largest districts: pre-war tenement houses and villas in Old Mokotów, the housing estates of Stegny, Sadyba and Służew, and the new flats and office blocks of Służewiec.'),
    points: [
      [l('Каменицы Старого Мокотува', 'Kamienice Starego Mokotowa', 'Кам’яниці Старого Мокотова', 'Old Mokotów tenements'),
       l('Высокие потолки, узкие лестницы и часто нет лифта. Маршрут от квартиры до буса видим заранее по видео, а лестничную клетку защищаем.', 'Wysokie kondygnacje, wąskie klatki i często brak windy. Drogę od mieszkania do busa znamy z wideo, a klatkę schodową zabezpieczamy.', 'Високі стелі, вузькі сходи й часто немає ліфта. Маршрут від квартири до буса бачимо заздалегідь на відео, а сходову клітку захищаємо.', 'High ceilings, narrow staircases and often no lift. We plan the route from the flat to the van from your video, and we protect the stairwell.')],
      [l('Офисы на Служевце', 'Biura na Służewcu', 'Офіси на Служевці', 'Offices in Służewiec'),
       l('Офисный переезд можно сделать вечером или в выходные, чтобы команда в понедельник села за готовые столы. Работаем 7 дней в неделю.', 'Biuro możemy przenieść wieczorem lub w weekend, żeby w poniedziałek zespół usiadł przy gotowych biurkach. Pracujemy 7 dni w tygodniu.', 'Офісний переїзд можна зробити ввечері або у вихідні, щоб команда в понеділок сіла за готові столи. Працюємо 7 днів на тиждень.', 'We can move an office in the evening or at the weekend, so your team can start Monday at desks that are all set up. We work 7 days a week.')],
      [l('Оживлённые улицы', 'Ruchliwe ulice', 'Жваві вулиці', 'Busy streets'),
       l('На Пулавской, Воронича или Вилановской место для буса у подъезда планируем заранее, до дня переезда.', 'Przy Puławskiej, Woronicza czy Wilanowskiej miejsce na busa pod klatką planujemy jeszcze przed dniem przeprowadzki.', 'На Пулавській, Вороніча чи Віланівській місце для буса біля під’їзду плануємо заздалегідь, до дня переїзду.', 'On Puławska, Woronicza or Wilanowska, we plan where the van will park before moving day.')],
    ],
    near: ['ursynow', 'wilanow', 'ochota', 'srodmiescie', 'piaseczno'],
  },
  {
    id: 'wola', kind: 'district',
    name: l('Воля', 'Wola', 'Воля', 'Wola'),
    loc: l('на Воле', 'na Woli', 'на Волі', 'in Wola'),
    intro: l(
      'Воля меняется на глазах: офисные небоскрёбы у ронда Дашиньского, новые жилые комплексы рядом с довоенными каменицами и домами 60–70-х годов.',
      'Wola zmienia się w oczach: biurowe wieżowce przy rondzie Daszyńskiego, nowe apartamentowce obok przedwojennych kamienic i bloków z lat 60. i 70.',
      'Воля змінюється на очах: офісні хмарочоси біля ронда Дашинського, нові житлові комплекси поруч із довоєнними кам’яницями та будинками 60–70-х років.',
      'Wola is changing fast: office towers around Rondo Daszyńskiego and new apartment buildings next to pre-war tenements and 1960s–70s blocks.'),
    points: [
      [l('Новые дома с подземным гаражом', 'Nowe budynki z garażem podziemnym', 'Нові будинки з підземним гаражем', 'New buildings with underground garages'),
       l('Проверяем высоту въезда, грузовой лифт и правила дома. Подскажем, что согласовать с управляющей компанией до переезда.', 'Sprawdzamy wysokość wjazdu, windę towarową i regulamin budynku. Podpowiemy, co uzgodnić z zarządcą przed przeprowadzką.', 'Перевіряємо висоту в’їзду, вантажний ліфт і правила будинку. Підкажемо, що погодити з управителем будинку до переїзду.', 'We check the garage height limit, the service lift and the building rules, and tell you what to arrange with the building manager beforehand.')],
      [l('Офисы в высотках', 'Biura w wieżowcach', 'Офіси у висотках', 'Offices in high-rises'),
       l('В бизнес-центрах свои правила: время для погрузки, пропуска, защита холлов. Переезд планируем с учётом этих правил — вне рабочих часов или в выходные.', 'Biurowce mają swoje zasady: okna czasowe na załadunek, przepustki, ochrona holi. Przeprowadzkę planujemy zgodnie z nimi — poza godzinami pracy lub w weekend.', 'У бізнес-центрах свої правила: час для завантаження, перепустки, захист холів. Переїзд плануємо з урахуванням цих правил — поза робочими годинами або у вихідні.', 'Office towers have their own rules: loading slots, passes, lobby protection. We plan the move around them — outside office hours or at the weekend.')],
      [l('Старые дома без лифта', 'Starsze bloki bez windy', 'Старі будинки без ліфта', 'Older blocks without lifts'),
       l('В четырёх- и пятиэтажных домах лифта часто нет. Этажи сразу учитываем в цене — в день переезда доплат не будет.', 'W blokach na 4–5 pięter windy często nie ma. Piętra od razu wliczamy w cenę — w dniu przeprowadzki nie będzie dopłat.', 'У чотири- та п’ятиповерхових будинках ліфта часто немає. Поверхи одразу враховуємо в ціні — у день переїзду доплат не буде.', 'Four- and five-storey blocks often have no lift. We include the stairs in the price from the start — no extra charge on the day.')],
    ],
    near: ['srodmiescie', 'ochota', 'bemowo', 'zoliborz'],
  },
  {
    id: 'srodmiescie', kind: 'district',
    name: l('Средместье', 'Śródmieście', 'Середмістя', 'Śródmieście'),
    loc: l('в Средместье', 'w Śródmieściu', 'у Середмісті', 'in Śródmieście'),
    intro: l(
      'Средместье — это центр Варшавы: Повисле, Муранув, MDM и Старый город. Здесь каменицы с высокими потолками, узкие улицы, зона платной парковки и места, куда машине подъехать непросто.',
      'Śródmieście to centrum Warszawy: Powiśle, Muranów, MDM i Stare Miasto. Kamienice z wysokimi sufitami, wąskie ulice, strefa płatnego parkowania i miejsca, do których trudno dojechać.',
      'Середмістя — це центр Варшави: Повісле, Муранув, MDM і Старе місто. Тут кам’яниці з високими стелями, вузькі вулиці, зона платного паркування й місця, куди авто під’їхати непросто.',
      'Śródmieście is the heart of Warsaw: Powiśle, Muranów, MDM and the Old Town. Expect tenements with high ceilings, narrow streets, a paid parking zone and spots that are hard to reach by car.'),
    points: [
      [l('Высокие этажи без лифта', 'Wysokie piętra bez windy', 'Високі поверхи без ліфта', 'High floors without a lift'),
       l('Довоенный «третий этаж» по высоте — как четвёртый, а то и пятый в новом доме. Сколько пролётов нести, считаем по видео, поэтому цена известна заранее.', 'Przedwojenne „trzecie piętro” bywa tak wysoko jak czwarte, a nawet piąte w nowym bloku. Ile biegów schodów trzeba pokonać, liczymy z wideo, więc cenę znasz z góry.', 'Довоєнний «третій поверх» за висотою — як четвертий, а то й п’ятий у новому будинку. Скільки прольотів нести, рахуємо за відео, тож ціну ви знаєте заздалегідь.', 'A pre-war “third floor” can be as high as the fourth or even fifth floor of a new block. We count the flights of stairs from your video, so you know the price in advance.')],
      [l('Парковка и узкие улицы', 'Parkowanie i wąskie ulice', 'Паркування й вузькі вулиці', 'Parking and narrow streets'),
       l('В центре платная зона и мало места у подъезда. Место для буса и время приезда планируем заранее, чтобы не носить вещи через квартал.', 'W centrum jest strefa płatnego parkowania i mało miejsca pod klatką. Miejsce dla busa i godzinę podjazdu planujemy wcześniej, żeby nie nosić rzeczy przez pół ulicy.', 'У центрі платна зона й мало місця біля під’їзду. Місце для буса й час приїзду плануємо заздалегідь, щоб не носити речі через квартал.', 'The centre has paid parking and little space outside the door. We plan the van’s spot and arrival time in advance, so nothing has to be carried half a block.')],
      [l('Старый город', 'Stare Miasto', 'Старе місто', 'Old Town'),
       l('Въезд ограничен, поэтому маршрут и время согласуем заранее. Бригада в форме и бахилах бережёт и вашу квартиру, и общую лестницу.', 'Wjazd jest ograniczony, dlatego trasę i godzinę przyjazdu uzgadniamy wcześniej. Ekipa w uniformach i ochraniaczach na buty dba zarówno o Twoje mieszkanie, jak i o wspólną klatkę.', 'В’їзд обмежений, тому маршрут і час приїзду погоджуємо заздалегідь. Бригада у формі та бахілах береже і вашу квартиру, і спільні сходи.', 'Vehicle access is restricted, so we agree the route and arrival time in advance. Our crew in uniforms and shoe covers looks after both your flat and the shared staircase.')],
    ],
    near: ['wola', 'mokotow', 'zoliborz', 'ochota', 'praga-poludnie'],
  },
  {
    id: 'praga-poludnie', kind: 'district',
    name: l('Прага-Полудне', 'Praga-Południe', 'Прага-Полудне', 'Praga-Południe'),
    loc: l('на Праге-Полудне', 'na Pradze-Południe', 'на Празі-Полудне', 'in Praga-Południe'),
    intro: l(
      'Прага-Полудне — это виллы и невысокие каменицы Саской Кемпы, большие кварталы Гоцлава и Грохува, а также новые дома на Каменке.',
      'Praga-Południe to wille i niskie kamienice Saskiej Kępy, duże osiedla Gocławia i Grochowa oraz nowe inwestycje na Kamionku.',
      'Прага-Полудне — це вілли й невисокі кам’яниці Саської Кемпи, великі квартали Гоцлава та Грохува, а також нові будинки на Каменку.',
      'Praga-Południe means the villas and low tenements of Saska Kępa, the large estates of Gocław and Grochów, and new developments in Kamionek.'),
    points: [
      [l('Виллы Саской Кемпы', 'Wille na Saskiej Kępie', 'Вілли Саської Кемпи', 'Villas in Saska Kępa'),
       l('Дом — это не только комнаты: подвал, гараж, садовая мебель. Всё это видим на видео и сразу включаем в цену.', 'Dom to nie tylko pokoje: piwnica, garaż, meble ogrodowe. Wszystko widzimy na wideo i od razu wliczamy w cenę.', 'Будинок — це не лише кімнати: підвал, гараж, садові меблі. Усе це бачимо на відео й одразу включаємо в ціну.', 'A house is more than its rooms: a cellar, a garage, garden furniture. We see it all on the video and include it in the price.')],
      [l('Высотки Гоцлава', 'Wieżowce Gocławia', 'Висотки Гоцлава', 'Gocław tower blocks'),
       l('Высокие дома с лифтом соседствуют с более низкими, где лифта нет. Цену считаем для каждой квартиры отдельно, без усреднений.', 'Wysokie bloki z windą sąsiadują z niższymi, w których windy nie ma. Cenę liczymy dla każdego mieszkania osobno, bez uśredniania.', 'Високі будинки з ліфтом сусідять із нижчими, де ліфта немає. Ціну рахуємо для кожної квартири окремо, без усереднення.', 'Tall blocks with lifts stand next to lower ones without. We price each flat individually, not by averages.')],
      [l('Через Вислу', 'Przez Wisłę', 'Через Віслу', 'Across the Vistula'),
       l('Если новый адрес на левом берегу, время выезда выбираем так, чтобы не стоять на мостах в час пик.', 'Jeśli nowy adres jest po lewej stronie Wisły, godzinę wyjazdu dobieramy tak, żeby nie stać na mostach w szczycie.', 'Якщо нова адреса на лівому березі, час виїзду обираємо так, щоб не стояти на мостах у годину пік.', 'If your new address is on the left bank, we time the trip so we’re not stuck on the bridges in rush hour.')],
    ],
    near: ['srodmiescie', 'targowek', 'zabki', 'mokotow'],
  },
  {
    id: 'ursynow', kind: 'district',
    name: l('Урсынов', 'Ursynów', 'Урсинів', 'Ursynów'),
    loc: l('на Урсынове', 'na Ursynowie', 'на Урсинові', 'in Ursynów'),
    intro: l(
      'Урсынов — это большие кварталы Имелина, Натолина и Кабат, а также новые дома у Кабацкого леса. Здесь заканчивается линия метро M1.',
      'Ursynów to duże osiedla Imielina, Natolina i Kabat oraz nowe budynki przy Lesie Kabackim. Tu kończy się linia metra M1.',
      'Урсинів — це великі квартали Імеліна, Натоліна й Кабат, а також нові будинки біля Кабацького лісу. Тут закінчується лінія метро M1.',
      'Ursynów is made up of the large estates of Imielin, Natolin and Kabaty, plus new buildings by the Kabaty Woods. Metro line M1 ends here.'),
    points: [
      [l('Высокие и низкие дома рядом', 'Wysokie i niskie bloki obok siebie', 'Високі й низькі будинки поруч', 'High and low blocks side by side'),
       l('В высоких домах есть лифт, в четырёх- и пятиэтажках — обычно нет. Этаж и наличие лифта указываете в калькуляторе, а точную цену называем по видео.', 'W wysokich blokach jest winda, w cztero- i pięciopiętrowych zwykle nie. Piętro i windę zaznaczasz w kalkulatorze, a dokładną cenę podajemy po obejrzeniu wideo.', 'У високих будинках є ліфт, у чотири- та п’ятиповерхівках — зазвичай немає. Поверх і наявність ліфта вказуєте в калькуляторі, а точну ціну називаємо за відео.', 'Tall blocks have lifts; four- and five-storey ones usually don’t. You enter the floor and whether there’s a lift in the calculator, and we give the exact price from your video.')],
      [l('Подъезд к дому', 'Dojazd pod klatkę', 'Під’їзд до будинку', 'Getting to the door'),
       l('Во дворах часто внутренние дороги и шлагбаумы. По видео видим, где встанет бус, и заранее говорим, что нужно открыть.', 'Na osiedlach często są wewnętrzne drogi i szlabany. Na wideo widzimy, gdzie stanie bus, i wcześniej mówimy, co trzeba otworzyć.', 'У дворах часто внутрішні дороги й шлагбауми. На відео бачимо, де стане бус, і заздалегідь кажемо, що треба відчинити.', 'Estates often have internal roads and barriers. Your video shows us where the van will stop, and we tell you in advance what needs opening.')],
      [l('Рядом Пясечно и Констанцин', 'Blisko Piaseczna i Konstancina', 'Поруч Пясечно й Констанцін', 'Close to Piaseczno and Konstancin'),
       l('Переезд из Урсынова в дом под Варшавой — короткая дорога на юг, без лишних часов в пробке.', 'Przeprowadzka z Ursynowa do domu pod Warszawą to krótka trasa na południe, bez stania godzinami w korkach.', 'Переїзд з Урсинова в будинок під Варшавою — коротка дорога на південь, без зайвих годин у заторі.', 'Moving from Ursynów to a house outside Warsaw is a short trip south, without sitting in traffic for hours.')],
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
       l('Много пятиэтажек без лифта, с узкими лестницами. Тяжёлое — шкафы, стиральную машину — выносим на ремнях, а стены и двери защищаем.', 'Dużo bloków bez windy, z wąskimi klatkami. Ciężkie rzeczy — szafy, pralkę — znosimy na pasach, a ściany i drzwi zabezpieczamy.', 'Багато п’ятиповерхівок без ліфта, з вузькими сходами. Важке — шафи, пральну машину — виносимо на ременях, а стіни й двері захищаємо.', 'Lots of walk-up blocks with narrow stairs. Heavy items — wardrobes, the washing machine — go down on straps, with walls and doors protected.')],
      [l('Виллы Старых Белян', 'Wille Starych Bielan', 'Вілли Старих Білян', 'Villas of Old Bielany'),
       l('Тихие улицы с домами: место для буса согласуем так, чтобы не перекрывать соседям выезд.', 'Spokojne uliczki z domami: miejsce dla busa ustalamy tak, żeby nie blokować sąsiadom wyjazdu.', 'Тихі вулиці з будинками: місце для буса погоджуємо так, щоб не перекривати сусідам виїзд.', 'Quiet streets of houses: we place the van so neighbours can still get out of their drives.')],
      [l('На север за город', 'Na północ za miasto', 'На північ за місто', 'North, out of town'),
       l('Ломянки и окрестности совсем рядом. В калькуляторе такой переезд — «до 50 км».', 'Łomianki i okolice są tuż obok. W kalkulatorze taka przeprowadzka to „do 50 km”.', 'Ломянки й околиці зовсім поруч. У калькуляторі такий переїзд — «до 50 км».', 'Łomianki and the surrounding area are right next door. In the calculator, that’s “up to 50 km”.')],
    ],
    near: ['zoliborz', 'bemowo', 'lomianki', 'bialoleka'],
  },
  {
    id: 'bemowo', kind: 'district',
    name: l('Бемово', 'Bemowo', 'Бемово', 'Bemowo'),
    loc: l('на Бемове', 'na Bemowie', 'на Бемові', 'in Bemowo'),
    intro: l(
      'Бемово — это кварталы Елонки и Гурце, зелёное Бёрнерово с частными домами и новые жилые комплексы, которые здесь продолжают строить.',
      'Bemowo to osiedla Jelonek i Górc, zielone Boernerowo z domami jednorodzinnymi i nowe osiedla, które wciąż tu powstają.',
      'Бемово — це квартали Єлонки й Гурце, зелене Бернерово з приватними будинками та нові житлові комплекси, які тут далі будують.',
      'Bemowo means the estates of Jelonki and Górce, leafy Boernerowo with its family houses, and new developments still going up.'),
    points: [
      [l('Новостройки', 'Nowe osiedla', 'Новобудови', 'New developments'),
       l('В новый дом часто въезжает много соседей одновременно. Дату лучше забронировать заранее — бронь закрепляется задатком.', 'W nowym budynku wielu sąsiadów wprowadza się w tym samym czasie. Termin warto zarezerwować wcześniej — rezerwację potwierdza zadatek.', 'У новий будинок часто одночасно заселяється багато сусідів. Дату краще забронювати заздалегідь — бронювання підтверджує завдаток.', 'In a new building, many neighbours move in at the same time. It’s worth booking early — a deposit secures your date.')],
      [l('Дома Бёрнерова', 'Domy na Boernerowie', 'Будинки Бернерова', 'Houses in Boernerowo'),
       l('Частный дом — это больше мебели и вещей из подвала и гаража. Упаковку и разборку мебели сразу включаем в цену.', 'Dom jednorodzinny to więcej mebli i rzeczy z piwnicy i garażu. Pakowanie i demontaż mebli od razu wliczamy w cenę.', 'Приватний будинок — це більше меблів і речей з підвалу та гаража. Пакування й розбирання меблів одразу включаємо в ціну.', 'A family house means more furniture and more from the cellar and garage. Packing and furniture disassembly are priced in from the start.')],
      [l('Соседи — Воля и Беляны', 'Sąsiedzi: Wola i Bielany', 'Сусіди — Воля й Біляни', 'Next to Wola and Bielany'),
       l('Переезды в пределах западной Варшавы короткие — обычно укладываемся в один день вместе со сборкой мебели.', 'Przeprowadzki w obrębie zachodniej Warszawy są krótkie — zwykle mieścimy się w jednym dniu razem z montażem mebli.', 'Переїзди в межах західної Варшави короткі — зазвичай укладаємося в один день разом зі збиранням меблів.', 'Moves within western Warsaw are short — usually done in a single day, furniture assembly included.')],
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
       l('Можем привезти белые коробки заранее, собрать новую мебель и вывезти упаковку — чтобы уже в первый вечер в новой квартире было уютно.', 'Możemy wcześniej przywieźć białe kartony, złożyć nowe meble i wywieźć opakowania — żeby już pierwszego wieczoru w nowym mieszkaniu było przytulnie.', 'Можемо заздалегідь привезти білі коробки, зібрати нові меблі й вивезти пакування — щоб уже першого вечора в новій квартирі було затишно.', 'We can bring white boxes in advance, assemble new furniture and take the packaging away — so your first evening in the new flat already feels cosy.')],
      [l('Мосты через Вислу', 'Mosty przez Wisłę', 'Мости через Віслу', 'Bridges over the Vistula'),
       l('Через мост Марии Склодовской-Кюри или мост Грота едем не в час пик — время выезда планируем вместе с вами.', 'Przez most Marii Skłodowskiej-Curie czy most Grota jedziemy poza szczytem — godzinę wyjazdu planujemy razem z Tobą.', 'Мостом Марії Склодовської-Кюрі чи мостом Грота їдемо не в годину пік — час виїзду плануємо разом із вами.', 'We cross the Skłodowska-Curie or Grota-Roweckiego bridge outside rush hour — and plan the departure time with you.')],
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
      'Таргувек — это Брудно с его большими кварталами, Таргувек Мешканёвы и частные дома Зацише и Эльснерова. В районе есть станции второй линии метро.',
      'Targówek to duże osiedla Bródna, domy Zacisza i Elsnerowa oraz Targówek Mieszkaniowy. W dzielnicy są stacje drugiej linii metra.',
      'Таргувек — це Брудно з великими кварталами, Таргувек Мешканьови та приватні будинки Зацише й Ельснерова. У районі є станції другої лінії метро.',
      'Targówek covers the big estates of Bródno, Targówek Mieszkaniowy and the family houses of Zacisze and Elsnerów. Metro line M2 runs through the district.'),
    points: [
      [l('Брудно', 'Bródno', 'Брудно', 'Bródno'),
       l('Десятиэтажки с лифтом и дома пониже без него. Кабину лифта сначала защищаем, чтобы её не поцарапать, и не занимаем лифт дольше, чем нужно.', 'Dziesięciopiętrowce z windą i niższe bloki bez niej. Kabinę windy najpierw zabezpieczamy, żeby jej nie porysować, i nie zajmujemy windy dłużej, niż trzeba.', 'Десятиповерхівки з ліфтом і нижчі будинки без нього. Кабіну ліфта спершу захищаємо, щоб її не подряпати, і не займаємо ліфт довше, ніж потрібно.', 'Ten-storey blocks with lifts and lower ones without. We protect the lift car first so it doesn’t get scratched, and we don’t hold the lift longer than we need to.')],
      [l('Дома Зацише', 'Domy na Zaciszu', 'Будинки Зацише', 'Houses in Zacisze'),
       l('Тихие улицы с частными домами: больше мебели, техника, вещи из гаража. Всё это учитываем в цене по видео.', 'Spokojne ulice z domami: więcej mebli, sprzęt AGD, rzeczy z garażu. Wszystko uwzględniamy w cenie na podstawie wideo.', 'Тихі вулиці з приватними будинками: більше меблів, техніка, речі з гаража. Усе це враховуємо в ціні за відео.', 'Quiet streets of family houses: more furniture, appliances, things from the garage. We include it all in the price, based on your video.')],
      [l('Рядом Марки и Зомбки', 'Blisko Marek i Ząbek', 'Поруч Марки й Зомбки', 'Close to Marki and Ząbki'),
       l('Переезд в Марки или Зомбки — короткая дорога. В калькуляторе выбирайте «до 50 км».', 'Przeprowadzka do Marek lub Ząbek to krótka trasa. W kalkulatorze wybierz „do 50 km”.', 'Переїзд до Марок чи Зомбок — коротка дорога. У калькуляторі обирайте «до 50 км».', 'Moving to Marki or Ząbki is a short trip — choose “up to 50 km” in the calculator.')],
    ],
    near: ['bialoleka', 'praga-poludnie', 'marki', 'zabki'],
  },
  {
    id: 'wilanow', kind: 'district',
    name: l('Вилянув', 'Wilanów', 'Віланув', 'Wilanów'),
    loc: l('в Вилянуве', 'w Wilanowie', 'у Віланові', 'in Wilanów'),
    intro: l(
      'Вилянув — это новые жилые комплексы Мястечка Вилянув, виллы и частные дома. Здесь же Вилянувский дворец, а рядом — Констанцин.',
      'Wilanów to nowe apartamentowce Miasteczka Wilanów, wille i domy jednorodzinne. Tu stoi Pałac w Wilanowie, a tuż obok leży Konstancin.',
      'Віланув — це нові житлові комплекси Містечка Віланув, вілли й приватні будинки. Тут же Віланувський палац, а поруч — Констанцін.',
      'Wilanów means the new apartment buildings of Miasteczko Wilanów, villas and family houses. Wilanów Palace is here too, and Konstancin is right next door.'),
    points: [
      [l('Жилые комплексы', 'Apartamentowce', 'Житлові комплекси', 'Apartment buildings'),
       l('Подземные гаражи, лифты, правила жилого комплекса. Заранее подскажем, о чём договориться с администрацией дома.', 'Garaże podziemne, windy, regulamin wspólnoty. Wcześniej podpowiemy, co uzgodnić z administracją budynku.', 'Підземні гаражі, ліфти, правила житлового комплексу. Заздалегідь підкажемо, про що домовитися з адміністрацією будинку.', 'Underground garages, lifts, residents’ association rules. We’ll tell you in advance what to arrange with the building management.')],
      [l('Большие дома', 'Duże domy', 'Великі будинки', 'Large houses'),
       l('Много мебели, гардеробные, вещи из подвала и сада. Одежду везём на вешалках в гардеробных коробках — она приезжает не мятой.', 'Dużo mebli, garderoby, rzeczy z piwnicy i ogrodu. Ubrania wieziemy na wieszakach w kartonach garderobianych — przyjeżdżają niepogniecione.', 'Багато меблів, гардеробні, речі з підвалу й саду. Одяг веземо на вішаках у гардеробних коробках — він приїжджає не м’ятим.', 'Lots of furniture, walk-in wardrobes, things from the cellar and garden. Clothes travel on hangers in wardrobe boxes and arrive uncreased.')],
      [l('Хрупкое и ценное', 'Rzeczy delikatne i cenne', 'Крихке й цінне', 'Fragile and valuable items'),
       l('Зеркала, стекло, картины и посуду пакуем отдельно: бумага, плёнка, коробки с перегородками.', 'Lustra, szkło, obrazy i naczynia pakujemy osobno: papier, folia, kartony z przegródkami.', 'Дзеркала, скло, картини й посуд пакуємо окремо: папір, плівка, коробки з перегородками.', 'We pack mirrors, glass, pictures and dishes separately, using paper, protective wrap and boxes with dividers.')],
    ],
    near: ['ursynow', 'mokotow', 'piaseczno'],
  },
  {
    id: 'zoliborz', kind: 'district',
    name: l('Жолибож', 'Żoliborz', 'Жолібож', 'Żoliborz'),
    loc: l('на Жолибоже', 'na Żoliborzu', 'на Жолібожі', 'in Żoliborz'),
    intro: l(
      'Жолибож — это довоенные виллы Офицерского Жолибожа, каменицы вокруг площади Вильсона, квартал Сады Жолибожские и новые дома.',
      'Żoliborz to przedwojenne wille Żoliborza Oficerskiego, kamienice wokół placu Wilsona, osiedle Sady Żoliborskie i nowe budynki.',
      'Жолібож — це довоєнні вілли Офіцерського Жолібожа, кам’яниці навколо площі Вільсона, квартал Сади Жолібожські й нові будинки.',
      'Żoliborz means the pre-war villas of Officers’ Żoliborz, tenements around Plac Wilsona, the Sady Żoliborskie estate and new buildings.'),
    points: [
      [l('Довоенные виллы', 'Przedwojenne wille', 'Довоєнні вілли', 'Pre-war villas'),
       l('Узкие лестницы, старые двери и паркет. Защищаем пол дорожками, косяки — накладками, мебель — плёнкой и одеялами.', 'Wąskie schody, stare drzwi i parkiet. Podłogę chronimy chodnikami, futryny osłonami, meble folią i kocami.', 'Вузькі сходи, старі двері й паркет. Підлогу захищаємо доріжками, одвірки — накладками, меблі — плівкою й ковдрами.', 'Narrow stairs, old doors and parquet. We cover floors with runners, door frames with guards and furniture with stretch wrap and blankets.')],
      [l('Тихие улицы', 'Spokojne uliczki', 'Тихі вулиці', 'Quiet streets'),
       l('Бус ставим так, чтобы не перекрыть соседей, и работаем аккуратно, без лишнего шума.', 'Busa stawiamy tak, żeby nie blokować sąsiadów, i pracujemy starannie, bez zbędnego hałasu.', 'Бус ставимо так, щоб не перекрити сусідів, і працюємо акуратно, без зайвого шуму.', 'We park so neighbours aren’t blocked in and work neatly, without unnecessary noise.')],
      [l('Каменицы без лифта', 'Kamienice bez windy', 'Кам’яниці без ліфта', 'Tenements without a lift'),
       l('Этажи считаем по видео и сразу включаем в цену. Изменения — только с вашего согласия и до начала работ.', 'Piętra liczymy z wideo i od razu wliczamy w cenę. Zmiany — tylko za Twoją zgodą i przed rozpoczęciem prac.', 'Поверхи рахуємо за відео й одразу включаємо в ціну. Зміни — лише з вашої згоди й до початку робіт.', 'We count floors from the video and include them in the price. Any change only with your consent and before work starts.')],
    ],
    near: ['bielany', 'srodmiescie', 'wola'],
  },
  {
    id: 'ochota', kind: 'district',
    name: l('Охота', 'Ochota', 'Охота', 'Ochota'),
    loc: l('на Охоте', 'na Ochocie', 'на Охоті', 'in Ochota'),
    intro: l(
      'Охота — это каменицы Старой Охоты и кварталы Щенсливиц и Раковца. Здесь много студентов и съёмных квартир.',
      'Ochota to kamienice Starej Ochoty oraz osiedla Szczęśliwic i Rakowca. Mieszka tu wielu studentów, jest też dużo mieszkań na wynajem.',
      'Охота — це кам’яниці Старої Охоти та квартали Щенсливіц і Раковця. Тут багато студентів і орендованих квартир.',
      'Ochota has the tenements of Old Ochota and the estates of Szczęśliwice and Rakowiec. It’s home to many students and plenty of rented flats.'),
    points: [
      [l('Небольшие переезды', 'Małe przeprowadzki', 'Невеликі переїзди', 'Small moves'),
       l('Студия или комната — тоже переезд. Те же правила: цена по видео, фактура, бригада в форме.', 'Kawalerka czy pokój to też przeprowadzka. Te same zasady: cena z wideo, faktura, ekipa w uniformach.', 'Студія чи кімната — теж переїзд. Ті самі правила: ціна за відео, фактура, бригада у формі.', 'A studio or a single room is a move too. Same rules: a price from the video, an invoice, a crew in uniform.')],
      [l('Съёмные квартиры', 'Mieszkania na wynajem', 'Орендовані квартири', 'Rented flats'),
       l('Выезжаете из съёмной квартиры? Защищаем стены и пол, чтобы при сдаче ключей у владельца не было вопросов.', 'Wyprowadzasz się z wynajmowanego mieszkania? Chronimy ściany i podłogi, żeby przy oddawaniu kluczy właściciel nie miał uwag.', 'Виїжджаєте з орендованої квартири? Захищаємо стіни й підлогу, щоб під час здачі ключів у власника не було питань.', 'Leaving a rented flat? We protect walls and floors, so the landlord has nothing to query when you hand back the keys.')],
      [l('Каменицы Старой Охоты', 'Kamienice Starej Ochoty', 'Кам’яниці Старої Охоти', 'Old Ochota tenements'),
       l('Высокие этажи без лифта и дворы-колодцы, куда бус обычно не заезжает. Путь через арку и по лестнице заранее видим на видео и учитываем в цене.', 'Wysokie piętra bez windy i podwórka-studnie, do których bus zwykle nie wjedzie. Drogę przez bramę i po schodach widzimy wcześniej na wideo i wliczamy w cenę.', 'Високі поверхи без ліфта й двори-колодязі, куди бус зазвичай не заїжджає. Шлях через арку й сходами заздалегідь бачимо на відео та враховуємо в ціні.', 'High floors without lifts and enclosed courtyards a van usually can’t enter. We see the route through the gateway and up the stairs on your video and include it in the price.')],
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
       l('Новый дом — часто и новая мебель. Соберём её, расставим всё по комнатам и вывезем упаковку.', 'Nowy dom to często nowe meble. Złożymy je, ustawimy wszystko w pokojach i wywieziemy opakowania.', 'Новий будинок — часто й нові меблі. Зберемо їх, розставимо все по кімнатах і вивеземо пакування.', 'A new house often means new furniture. We assemble it, arrange everything room by room and take the packaging away.')],
      [l('Пулавская в час пик', 'Puławska w szczycie', 'Пулавська в годину пік', 'Puławska at rush hour'),
       l('Дорога между Варшавой и Пясечно часто стоит в пробках — время выезда выбираем так, чтобы в них не попасть.', 'Trasa między Warszawą a Piasecznem bywa zakorkowana — godzinę wyjazdu dobieramy tak, żeby nie stać w korku.', 'Дорога між Варшавою та Пясечно часто стоїть у заторах — час виїзду обираємо так, щоб у них не потрапити.', 'The road between Warsaw and Piaseczno is often jammed — we time the trip to avoid the queues.')],
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
      'Прушков к западу от Варшавы — жилые кварталы, частные дома и новые комплексы. Многие живут здесь, а работают в Варшаве.',
      'Pruszków na zachód od Warszawy to osiedla bloków, domy jednorodzinne i nowe inwestycje. Wiele osób mieszka tu, a pracuje w Warszawie.',
      'Прушків на захід від Варшави — житлові квартали, приватні будинки й нові комплекси. Багато хто живе тут, а працює у Варшаві.',
      'Pruszków, west of Warsaw, has housing estates, family houses and new developments. Many people live here and work in Warsaw.'),
    points: [
      [l('Переезд в выходной', 'Przeprowadzka w weekend', 'Переїзд у вихідний', 'Moving at the weekend'),
       l('Заняты в будни? Перевезём вас в субботу или воскресенье — мы работаем 7 дней в неделю.', 'Pracujesz od poniedziałku do piątku? Przeprowadzimy Cię w sobotę lub niedzielę — działamy 7 dni w tygodniu.', 'Зайняті в будні? Перевеземо вас у суботу чи неділю — ми працюємо 7 днів на тиждень.', 'Busy on weekdays? We’ll move you on a Saturday or Sunday. We work 7 days a week.')],
      [l('Дома и кварталы', 'Domy i osiedla', 'Будинки й квартали', 'Houses and estates'),
       l('Дом и квартира — это разный объём вещей и разная бригада. Всё видно на видео, поэтому цену считаем именно для вас.', 'Dom i mieszkanie to różna ilość rzeczy i inna ekipa. Wszystko widać na wideo, więc cenę liczymy dokładnie dla Ciebie.', 'Будинок і квартира — це різний обсяг речей і різна бригада. Усе видно на відео, тож ціну рахуємо саме для вас.', 'A house and a flat mean different amounts to move and different crews. Your video shows it all, so the price is calculated for your move specifically.')],
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
      'Легионово к северу от Варшавы — жилые кварталы и частные дома, а рядом Зегжинское водохранилище.',
      'Legionowo na północ od Warszawy to osiedla i domy jednorodzinne, a tuż obok Zalew Zegrzyński.',
      'Легіоново на північ від Варшави — житлові квартали й приватні будинки, а поруч Зегжинське водосховище.',
      'Legionowo, north of Warsaw, has housing estates, family houses and Lake Zegrze close by.'),
    points: [
      [l('Дорога в Варшаву', 'Droga do Warszawy', 'Дорога до Варшави', 'The road to Warsaw'),
       l('Дорога в Варшаву идёт через Белоленку, а в центр — ещё и по мостам. Время выезда подбираем так, чтобы не попасть в утренние и вечерние пробки.', 'Droga do Warszawy prowadzi przez Białołękę, a do centrum — jeszcze przez mosty. Godzinę wyjazdu dobieramy tak, żeby ominąć poranne i popołudniowe korki.', 'Дорога до Варшави йде через Бялоленку, а до центру — ще й мостами. Час виїзду підбираємо так, щоб оминути ранкові й вечірні затори.', 'The way into Warsaw runs through Białołęka, and to the centre over the bridges as well. We time the departure to miss the morning and evening traffic.')],
      [l('Дом у воды', 'Dom nad wodą', 'Будинок біля води', 'A house by the water'),
       l('Садовую мебель, спортивное и водное снаряжение тоже нужно перевезти. Всё это видим на видео и учитываем в цене.', 'Meble ogrodowe, sprzęt sportowy i wodny to też rzeczy do przewiezienia. Wszystko widzimy na wideo i wliczamy w cenę.', 'Садові меблі, спортивне й водне спорядження теж треба перевезти. Усе це бачимо на відео й враховуємо в ціні.', 'Garden furniture, sports and water gear need moving too. We see it all on the video and include it in the price.')],
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
      'Марки у северо-восточной границы Варшавы — быстро растущий город: новые жилые кварталы и частные дома.',
      'Marki przy północno-wschodniej granicy Warszawy to szybko rosnące miasto: nowe osiedla i domy jednorodzinne.',
      'Марки біля північно-східної межі Варшави — місто, що швидко росте: нові житлові квартали й приватні будинки.',
      'Marki, on Warsaw’s north-eastern edge, is a fast-growing town of new estates and family houses.'),
    points: [
      [l('Новые кварталы', 'Nowe osiedla', 'Нові квартали', 'New estates'),
       l('Закрытые территории, шлагбаумы, подземные паркинги. По видео заранее видим, где встанет бус и как пройти к лифту.', 'Zamknięte osiedla, szlabany, garaże podziemne. Na wideo wcześniej widzimy, gdzie stanie bus i jak dojść do windy.', 'Закриті території, шлагбауми, підземні паркінги. За відео заздалегідь бачимо, де стане бус і як пройти до ліфта.', 'Gated estates, barriers, underground car parks. The video shows us in advance where the van will stop and how to reach the lift.')],
      [l('Частные дома', 'Domy jednorodzinne', 'Приватні будинки', 'Family houses'),
       l('Разберём и соберём мебель, упакуем технику и хрупкое — всё в одной фиксированной цене.', 'Rozłożymy i złożymy meble, spakujemy sprzęt i rzeczy delikatne — wszystko w jednej stałej cenie.', 'Розберемо й зберемо меблі, запакуємо техніку та крихке — усе в одній фіксованій ціні.', 'We take furniture apart and put it back together, and pack appliances and fragile items — all for one fixed price.')],
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
      'Зомбки біля східної межі Варшави — щільно забудоване місто з безліччю нових житлових будинків.',
      'Ząbki, on Warsaw’s eastern edge, is a densely built town with many new apartment buildings.'),
    points: [
      [l('Плотная застройка', 'Gęsta zabudowa', 'Щільна забудова', 'Dense streets'),
       l('Узкие улицы и мало места у подъезда. Где встанет бус и во сколько мы приедем, решаем заранее, а не на месте.', 'Wąskie ulice i mało miejsca pod klatką. Gdzie stanie bus i o której przyjedziemy, ustalamy wcześniej, a nie na miejscu.', 'Вузькі вулиці й мало місця біля під’їзду. Де стане бус і о котрій ми приїдемо, вирішуємо заздалегідь, а не на місці.', 'Narrow streets and little space outside the door. Where the van will stop and when we’ll arrive is settled in advance, not on the spot.')],
      [l('Лифт в новом доме', 'Winda w nowym bloku', 'Ліфт у новому будинку', 'The lift in a new block'),
       l('Защищаем кабину лифта и холл, чтобы ваш переезд не доставил хлопот соседям и администрации дома.', 'Zabezpieczamy kabinę windy i hol, żeby Twoja przeprowadzka nie była kłopotem dla sąsiadów i wspólnoty.', 'Захищаємо кабіну ліфта й хол, щоб ваш переїзд не завдав клопоту сусідам і адміністрації будинку.', 'We protect the lift car and lobby, so your move causes no trouble for the neighbours or the building management.')],
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
      'Ломянки к северо-западу от Варшавы — в основном частные дома, а рядом Кампиносская пуща и Висла.',
      'Łomianki na północny zachód od Warszawy to głównie domy jednorodzinne, a obok Puszcza Kampinoska i Wisła.',
      'Ломянки на північний захід від Варшави — переважно приватні будинки, а поруч Кампіноська пуща й Вісла.',
      'Łomianki, north-west of Warsaw, is mostly family houses, with the Kampinos Forest and the Vistula close by.'),
    points: [
      [l('Переезд дома', 'Przeprowadzka domu', 'Переїзд будинку', 'Moving a house'),
       l('Несколько этажей, подвал, гараж, сад. Работаем комната за комнатой, а коробки помечаем наклейками с цветом комнаты и QR-кодом.', 'Kilka pięter, piwnica, garaż, ogród. Pracujemy pokój po pokoju, a kartony oznaczamy naklejkami z kolorem pokoju i kodem QR.', 'Кілька поверхів, підвал, гараж, сад. Працюємо кімната за кімнатою, а коробки позначаємо наліпками з кольором кімнати та QR-кодом.', 'Several floors, a cellar, a garage, a garden. We work room by room and label every box with its room colour and a QR code.')],
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
