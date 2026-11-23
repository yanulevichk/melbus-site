/*
 * ДЕМО-ДАННЫЕ прототипа CRM «Пульт» (23.11.2026). Все имена клиентов и телефоны — вымышленные.
 * Цифры согласованы с сайтом: «Перевозка» 2 комнаты от 1 790 zł, «Под ключ» 3 890 zł, «Грузотакси» 150 zł/ч,
 * задаток 20 % (мин. 200 zł), себестоимость человека 40 zł/ч. Модель — docs/crm/SYSTEM.md.
 */
window.D = (() => {
  const ROOMS = {
    kitchen: ['Кухня', '#14DCD5'], bed: ['Спальня', '#077E79'], living: ['Гостиная', '#10161D'],
    kids: ['Детская', '#8F9AA7'], bath: ['Ванная', '#C9D1D9'], hall: ['Прихожая', '#E3A33B'],
  };
  const STAGES = ['Выезд', 'Прибытие', 'Осмотр и защита', 'Упаковка и разборка', 'Погрузка', 'В пути', 'Выгрузка', 'Сборка и расстановка', 'Приёмка', 'Возврат на базу'];
  const PKG = { taxi: 'Грузотакси', move: 'Перевозка', full: 'Под ключ' };
  const PKG_STAGES = { taxi: [0, 1, 4, 5, 6, 8, 9], move: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], full: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9] };
  const DAYS = [
    { k: '2026-11-23', d: 'Пн', n: 23, avail: 11 }, { k: '2026-11-24', d: 'Вт', n: 24, avail: 10 }, { k: '2026-11-25', d: 'Ср', n: 25, avail: 11 },
    { k: '2026-11-26', d: 'Чт', n: 26, avail: 8 }, { k: '2026-11-27', d: 'Пт', n: 27, avail: 11 }, { k: '2026-11-28', d: 'Сб', n: 28, avail: 7 },
    { k: '2026-11-29', d: 'Вс', n: 29, avail: 4 },
  ];

  const staff = [
    { id: 's1', name: 'Андрей К.', role: 'Бригадир', phone: '+48 501 000 101', lang: 'RU', hours: 142, jobs: 17, state: 'На заказе', pin: '02.11' },
    { id: 's2', name: 'Олег П.', role: 'Водитель', phone: '+48 501 000 102', lang: 'UA', hours: 151, jobs: 18, state: 'На заказе', pin: '02.11' },
    { id: 's3', name: 'Марек Н.', role: 'Грузчик', phone: '+48 501 000 103', lang: 'PL', hours: 128, jobs: 16, state: 'На заказе', pin: '05.11' },
    { id: 's4', name: 'Павел В.', role: 'Упаковщик', phone: '+48 501 000 104', lang: 'UA', hours: 136, jobs: 17, state: 'На заказе', pin: '02.11' },
    { id: 's5', name: 'Юрий С.', role: 'Бригадир', phone: '+48 501 000 105', lang: 'UA', hours: 147, jobs: 19, state: 'На заказе', pin: '30.10' },
    { id: 's6', name: 'Томаш Б.', role: 'Водитель', phone: '+48 501 000 106', lang: 'PL', hours: 139, jobs: 18, state: 'На заказе', pin: '30.10' },
    { id: 's7', name: 'Пётр Л.', role: 'Водитель', phone: '+48 501 000 107', lang: 'RU', hours: 118, jobs: 21, state: 'На заказе', pin: '12.11' },
    { id: 's8', name: 'Сергей М.', role: 'Бригадир', phone: '+48 501 000 108', lang: 'RU', hours: 132, jobs: 15, state: 'Свободен', pin: '12.11' },
    { id: 's9', name: 'Кшиштоф З.', role: 'Упаковщик', phone: '+48 501 000 109', lang: 'PL', hours: 96, jobs: 11, state: 'Свободен', pin: '18.11' },
    { id: 's10', name: 'Иван Д.', role: 'Грузчик', phone: '+48 501 000 110', lang: 'UA', hours: 121, jobs: 14, state: 'Свободен', pin: '18.11' },
    { id: 's11', name: 'Богдан Р.', role: 'Грузчик', phone: '+48 501 000 111', lang: 'UA', hours: 88, jobs: 10, state: 'Выходной', pin: '20.11' },
    { id: 's12', name: 'Ольга Р.', role: 'Менеджер', phone: '+48 501 000 112', lang: 'RU', hours: 164, jobs: 0, state: 'В офисе', pin: '—' },
  ];

  const vans = [
    { id: 'v1', name: 'Бус 1', plate: 'WX 1234A', km: 184210, service: 2300, state: 'На заказе', today: 'M-1142' },
    { id: 'v2', name: 'Бус 2', plate: 'WX 5678B', km: 162880, service: 9100, state: 'На заказе', today: 'M-1142' },
    { id: 'v3', name: 'Бус 3', plate: 'WX 9012C', km: 201540, service: 600, state: 'На заказе', today: 'M-1143' },
    { id: 'v4', name: 'Бус 4', plate: 'WX 3456D', km: 98420, service: 14800, state: 'На заказе', today: 'M-1145' },
    { id: 'v5', name: 'Бус 5', plate: 'WX 7788E', km: 233900, service: 0, state: 'Сервис до 25.11', today: '' },
  ];

  // a/b — откуда/куда; stage — индекс текущего шага (−1 — ещё не начат); done — массив времени шагов «чч:мм–чч:мм»
  const jobs = [
    { id: 'M-1142', client: 'Анна Демо', phone: '+48 600 100 142', lang: 'RU', pkg: 'full', price: 3890, day: '2026-11-23', t0: 8, t1: 16,
      a: { addr: 'ul. Puławska 140/12', dist: 'Мокотув', floor: 3, lift: true, park: 'у подъезда' },
      b: { addr: 'ul. Górczewska 212/45', dist: 'Бемово', floor: 5, lift: true, park: '15 м от подъезда' },
      rooms: '2 комнаты · 48 м²', vans: ['v1', 'v2'], crew: ['s1', 's2', 's3', 's4'], status: 'in_progress', stage: 3,
      boxes: 40, packed: 12, loaded: 0, unloaded: 0, plan: 28, km: 14, deposit: 778, depositAt: '19.11 · 18:42 · BLIK',
      times: ['07:30–07:52', '08:31–08:40', '08:40–09:05', '09:05–'], note: 'Пианино нет. Хрупкое: сервиз в серванте. Код домофона 12#4.' },
    { id: 'M-1143', client: 'Пётр Демо', phone: '+48 600 100 143', lang: 'PL', pkg: 'move', price: 1790, day: '2026-11-23', t0: 8, t1: 12,
      a: { addr: 'ul. Grzybowska 30/8', dist: 'Воля', floor: 2, lift: false, park: 'у подъезда' },
      b: { addr: 'ul. Wschodnia 14', dist: 'Пясечно', floor: 1, lift: false, park: 'дом, въезд во двор' },
      rooms: '2 комнаты · 41 м²', vans: ['v3'], crew: ['s5', 's6'], status: 'in_progress', stage: 5,
      boxes: 26, packed: 26, loaded: 26, unloaded: 0, plan: 9, km: 19, deposit: 358, depositAt: '18.11 · 09:10 · карта',
      times: ['07:40–08:05', '08:28–08:35', '08:35–08:50', '08:50–09:20', '09:20–10:42', '10:48–'], note: 'Клиент упаковал сам. Разобрать только кровать.', eta: '11:40' },
    { id: 'M-1144', client: 'Демо Студия sp. z o.o.', phone: '+48 600 100 144', lang: 'EN', pkg: 'full', price: 7450, day: '2026-11-23', t0: 14, t1: 20,
      a: { addr: 'ul. Marszałkowska 89', dist: 'Средместье', floor: 4, lift: true, park: 'погрузочная зона' },
      b: { addr: 'ul. Klimczaka 1', dist: 'Вилянув', floor: 2, lift: true, park: 'подземный паркинг' },
      rooms: 'Офис · 12 рабочих мест', vans: ['v4'], crew: ['s8', 's9', 's10'], status: 'confirmed', stage: -1,
      boxes: 64, packed: 0, loaded: 0, unloaded: 0, plan: 36, km: 11, deposit: 1490, depositAt: '17.11 · перевод', times: [], note: 'Серверная стойка — везёт клиент. Пропуск на паркинг у охраны.' },
    { id: 'M-1145', client: 'Ирина Демо', phone: '+48 600 100 145', lang: 'UA', pkg: 'taxi', price: 300, day: '2026-11-23', t0: 9, t1: 12,
      a: { addr: 'ul. Targowa 52', dist: 'Прага-Пулноц', floor: 0, lift: false, park: 'у подъезда' },
      b: { addr: 'ul. Kondratowicza 20', dist: 'Таргувек', floor: 3, lift: true, park: 'у подъезда' },
      rooms: 'Диван и 12 коробок', vans: ['v4'], crew: ['s7'], status: 'in_progress', stage: 6,
      boxes: 0, packed: 0, loaded: 0, unloaded: 0, plan: 2, km: 7, deposit: 0, depositAt: '', times: ['08:40–09:02', '09:05–09:10', '', '', '09:10–09:40', '09:40–10:05', '10:05–'], note: 'Грузит клиент с другом. 150 zł/ч, мин. 2 ч.' },
    { id: 'M-1139', client: 'Магдалена Демо', phone: '+48 600 100 139', lang: 'PL', pkg: 'full', price: 3890, day: '2026-11-21', t0: 8, t1: 16,
      a: { addr: 'al. Niepodległości 210/7', dist: 'Охота', floor: 4, lift: true, park: 'у подъезда' },
      b: { addr: 'ul. Kasprowicza 88/3', dist: 'Белоленка', floor: 1, lift: false, park: 'у подъезда' },
      rooms: '2 комнаты · 52 м²', vans: ['v1', 'v2'], crew: ['s1', 's2', 's3', 's4'], status: 'closed', stage: 10,
      boxes: 40, packed: 40, loaded: 40, unloaded: 40, plan: 28, fact: 26.5, km: 16, deposit: 778, depositAt: '14.11 · BLIK',
      times: ['07:30–07:55', '08:24–08:30', '08:30–08:58', '08:58–11:40', '11:40–12:35', '12:40–13:20', '13:20–14:05', '14:05–15:30', '15:30–15:48', '15:50–16:25'], note: '' },
    { id: 'M-1146', client: 'Кшиштоф Демо', phone: '+48 600 100 146', lang: 'PL', pkg: 'move', price: 1990, day: '2026-11-24', t0: 8, t1: 13, a: { addr: 'ul. Grochowska 300', dist: 'Прага-Полудне' }, b: { addr: 'ul. Ostrobramska 72', dist: 'Гоцлав' }, rooms: '2 комнаты', vans: ['v1'], crew: ['s5', 's6', 's10'], status: 'confirmed', stage: -1, boxes: 30, plan: 12, deposit: 398 },
    { id: 'M-1147', client: 'Ольга Демо', phone: '+48 600 100 147', lang: 'RU', pkg: 'full', price: 4290, day: '2026-11-24', t0: 8, t1: 17, a: { addr: 'ul. Sienna 72', dist: 'Средместье' }, b: { addr: 'ul. Lazurowa 12', dist: 'Бемово' }, rooms: '3 комнаты', vans: ['v2', 'v3'], crew: ['s1', 's2', 's3', 's4', 's9'], status: 'confirmed', stage: -1, boxes: 52, plan: 34, deposit: 858 },
    { id: 'M-1148', client: 'Марта Демо', phone: '+48 600 100 148', lang: 'PL', pkg: 'move', price: 1790, day: '2026-11-25', t0: 9, t1: 13, a: { addr: 'ul. Dywizjonu 303 5', dist: 'Бемово' }, b: { addr: 'ul. Okrzei 9', dist: 'Ломянки' }, rooms: '2 комнаты', vans: ['v1'], crew: ['s8', 's10'], status: 'confirmed', stage: -1, boxes: 22, plan: 8, deposit: 358 },
    { id: 'M-1149', client: 'Виктор Демо', phone: '+48 600 100 149', lang: 'UA', pkg: 'taxi', price: 450, day: '2026-11-25', t0: 15, t1: 18, a: { addr: 'ul. Wolska 50', dist: 'Воля' }, b: { addr: 'ul. Bema 70', dist: 'Воля' }, rooms: 'Шкаф, кровать', vans: ['v4'], crew: ['s7'], status: 'booked', stage: -1, boxes: 0, plan: 3, deposit: 0 },
    { id: 'M-1150', client: 'Демо Кафе', phone: '+48 600 100 150', lang: 'PL', pkg: 'full', price: 5690, day: '2026-11-26', t0: 7, t1: 16, a: { addr: 'ul. Nowy Świat 22', dist: 'Средместье' }, b: { addr: 'ul. Hoża 41', dist: 'Средместье' }, rooms: 'Кафе · кухня', vans: ['v1', 'v2'], crew: ['s1', 's2', 's3', 's4', 's5', 's9'], status: 'confirmed', stage: -1, boxes: 70, plan: 44, deposit: 1138 },
    { id: 'M-1151', client: 'Катажина Демо', phone: '+48 600 100 151', lang: 'PL', pkg: 'full', price: 3890, day: '2026-11-28', t0: 8, t1: 16, a: { addr: 'ul. Bitwy Warszawskiej 7', dist: 'Охота' }, b: { addr: 'ul. Fieldorfa 15', dist: 'Гоцлав' }, rooms: '2 комнаты', vans: ['v3', 'v4'], crew: ['s5', 's6', 's10', 's11'], status: 'booked', stage: -1, boxes: 40, plan: 28, deposit: 0, unpaid: true },
    { id: 'M-1152', client: 'Демо Семья Новак', phone: '+48 600 100 152', lang: 'PL', pkg: 'move', price: 2690, day: '2026-11-28', t0: 8, t1: 14, a: { addr: 'ul. Kościuszki 3', dist: 'Пясечно' }, b: { addr: 'ul. Długa 11', dist: 'Прушков' }, rooms: 'Дом · 4 комнаты', vans: ['v1', 'v2'], crew: ['s1', 's2', 's3', 's8'], status: 'confirmed', stage: -1, boxes: 0, plan: 16, deposit: 538 },
    { id: 'M-1153', client: 'Алексей Демо', phone: '+48 600 100 153', lang: 'RU', pkg: 'move', price: 1890, day: '2026-11-27', t0: 9, t1: 14, a: { addr: 'ul. Inflancka 4', dist: 'Муранув' }, b: { addr: 'ul. Kondratowicza 8', dist: 'Таргувек' }, rooms: '2 комнаты', vans: [], crew: ['s8', 's10'], status: 'booked', stage: -1, boxes: 24, plan: 9, deposit: 378 },
  ];

  const leads = [
    { id: 'L-3081', name: 'Ewa Demo', phone: '+48 600 200 081', src: 'Сайт', lang: 'PL', pkg: 'full', est: 3890, date: '06.12', rooms: '2 комнаты', route: 'Урсынув → Вилянув', at: '09:12', col: 'new', video: true },
    { id: 'L-3082', name: 'Дмитрий Демо', phone: '+48 600 200 082', src: 'WhatsApp', lang: 'RU', pkg: 'move', est: 1790, date: '30.11', rooms: '2 комнаты', route: 'Воля → Беляны', at: '10:05', col: 'new' },
    { id: 'L-3083', name: 'John Demo', phone: '+48 600 200 083', src: 'Сайт', lang: 'EN', pkg: 'move', est: 2190, date: '13.12', rooms: '3 комнаты', route: 'Мокотув → Жолибож', at: '10:41', col: 'new' },
    { id: 'L-3084', name: 'Оксана Демо', phone: '+48 600 200 084', src: 'Instagram', lang: 'UA', pkg: 'taxi', est: 300, date: '25.11', rooms: 'Диван, шкаф', route: 'Прага → Таргувек', at: '11:20', col: 'new' },
    { id: 'L-3077', name: 'Piotr Demo', phone: '+48 600 200 077', src: 'Телефон', lang: 'PL', pkg: 'full', est: 4290, date: '20.12', rooms: '3 комнаты', route: 'Охота → Пясечно', at: 'вчера', col: 'contacted' },
    { id: 'L-3078', name: 'Наталья Демо', phone: '+48 600 200 078', src: 'Сайт', lang: 'RU', pkg: 'move', est: 1890, date: '05.12', rooms: '2 комнаты', route: 'Бемово → Воля', at: 'вчера', col: 'contacted' },
    { id: 'L-3074', name: 'Anna Demo-Wiśniewska', phone: '+48 600 200 074', src: 'Сайт', lang: 'PL', pkg: 'full', est: 5290, date: '12.12', rooms: 'Дом · 5 комнат', route: 'Марки → Легионово', at: '21.11', col: 'video', video: true },
    { id: 'L-3075', name: 'Тарас Демо', phone: '+48 600 200 075', src: 'WhatsApp', lang: 'UA', pkg: 'move', est: 1790, date: '02.12', rooms: '2 комнаты', route: 'Таргувек → Прага', at: '21.11', col: 'video', video: true },
    { id: 'L-3070', name: 'Tomasz Demo', phone: '+48 600 200 070', src: 'Сайт', lang: 'PL', pkg: 'move', est: 2190, date: '29.11', rooms: '3 комнаты', route: 'Ломянки → Беляны', at: '20.11', col: 'offer', offer: 'O-2207' },
    { id: 'L-3071', name: 'Мария Демо', phone: '+48 600 200 071', src: 'Instagram', lang: 'RU', pkg: 'full', est: 3890, date: '04.12', rooms: '2 комнаты', route: 'Мокотув → Урсус', at: '20.11', col: 'offer', offer: 'O-2208' },
    { id: 'L-3068', name: 'Катажина Демо', phone: '+48 600 100 151', src: 'Сайт', lang: 'PL', pkg: 'full', est: 3890, date: '28.11', rooms: '2 комнаты', route: 'Охота → Гоцлав', at: '19.11', col: 'won', job: 'M-1151' },
    { id: 'L-3066', name: 'Алексей Демо', phone: '+48 600 100 153', src: 'Телефон', lang: 'RU', pkg: 'move', est: 1890, date: '27.11', rooms: '2 комнаты', route: 'Муранув → Таргувек', at: '18.11', col: 'won', job: 'M-1153' },
    { id: 'L-3062', name: 'Mark Demo', phone: '+48 600 200 062', src: 'Сайт', lang: 'EN', pkg: 'full', est: 3890, date: '22.11', rooms: '2 комнаты', route: 'Вола → Мокотув', at: '16.11', col: 'lost', reason: 'Выбрали другую фирму' },
    { id: 'L-3060', name: 'Юлия Демо', phone: '+48 600 200 060', src: 'WhatsApp', lang: 'UA', pkg: 'move', est: 1790, date: '—', rooms: '2 комнаты', route: 'Прага → ?', at: '15.11', col: 'lost', reason: 'Перенесли переезд' },
  ];
  const LEAD_ITEMS = ['Шкаф 2 м · разобрать и собрать', 'Кровать 160 · подъёмный механизм', 'Диван 3-местный', 'Холодильник', 'Стиральная машина', 'Телевизор 55″', 'Комод', 'Стол на 4 человека + 4 стула', 'Коробки ≈ 35 шт.'];
  const COLS = [['new', 'Новые'], ['contacted', 'Связались'], ['video', 'Видео получено'], ['offer', 'Оферта отправлена'], ['won', 'Принята'], ['lost', 'Потеряна']];
  const LOST = ['Дорого', 'Выбрали другую фирму', 'Не отвечает', 'Перенесли переезд', 'Не наш регион'];

  const offers = [
    { id: 'O-2208', client: 'Мария Демо', pkg: 'full', sum: 3890, v: 1, status: 'viewed', views: 3, until: '04.12', sent: '20.11' },
    { id: 'O-2207', client: 'Tomasz Demo', pkg: 'move', sum: 2190, v: 2, status: 'sent', views: 0, until: '24.11', sent: '10.11', expiring: true },
    { id: 'O-2206', client: 'Катажина Демо', pkg: 'full', sum: 3890, v: 1, status: 'accepted', views: 2, until: '03.12', sent: '19.11' },
    { id: 'O-2205', client: 'Алексей Демо', pkg: 'move', sum: 1890, v: 1, status: 'accepted', views: 1, until: '02.12', sent: '18.11' },
    { id: 'O-2204', client: 'Mark Demo', pkg: 'full', sum: 3890, v: 1, status: 'declined', views: 4, until: '30.11', sent: '16.11' },
    { id: 'O-2203', client: 'Демо Кафе', pkg: 'full', sum: 5690, v: 3, status: 'accepted', views: 7, until: '29.11', sent: '15.11' },
    { id: 'O-2202', client: 'Ирина Демо', pkg: 'taxi', sum: 300, v: 1, status: 'accepted', views: 1, until: '28.11', sent: '14.11' },
    { id: 'O-2201', client: 'Роберт Демо', pkg: 'move', sum: 1790, v: 1, status: 'expired', views: 1, until: '20.11', sent: '06.11' },
    { id: 'O-2209', client: 'Ewa Demo', pkg: 'full', sum: 3890, v: 1, status: 'draft', views: 0, until: '—', sent: '—' },
  ];

  const stock = [
    { t: 'Коробка малая 40×30×30', base: 320, jobs: 64, bad: 12, min: 150 },
    { t: 'Коробка средняя 50×40×40', base: 410, jobs: 98, bad: 9, min: 200 },
    { t: 'Коробка большая 60×40×50', base: 138, jobs: 31, bad: 6, min: 120 },
    { t: 'Гардероб 50×50×110', base: 18, jobs: 6, bad: 1, min: 20 },
    { t: 'Наклейки QR, шт.', base: 2400, jobs: 0, bad: 0, min: 500 },
    { t: 'Скотч бирюзовый, рулонов', base: 140, jobs: 22, bad: 0, min: 60 },
    { t: 'Плёнка стретч, рулонов', base: 36, jobs: 8, bad: 0, min: 20 },
    { t: 'Бумага для упаковки, кг', base: 85, jobs: 14, bad: 0, min: 40 },
  ];

  const payments = [
    { at: '23.11 07:58', job: 'M-1145', client: 'Ирина Демо', kind: 'Почасовая оплата', method: 'BLIK', sum: 300, st: 'ожидается' },
    { at: '21.11 16:02', job: 'M-1139', client: 'Магдалена Демо', kind: 'Остаток', method: 'Карта · терминал', sum: 3112, st: 'получено' },
    { at: '14.11 20:15', job: 'M-1139', client: 'Магдалена Демо', kind: 'Задаток 20 %', method: 'Przelewy24 · BLIK', sum: 778, st: 'получено' },
    { at: '21.11 09:30', job: 'M-1150', client: 'Демо Кафе', kind: 'Задаток 20 %', method: 'Przelewy24 · BLIK', sum: 1138, st: 'получено' },
    { at: '20.11 18:11', job: 'M-1147', client: 'Ольга Демо', kind: 'Задаток 20 %', method: 'Przelewy24 · карта', sum: 858, st: 'получено' },
    { at: '19.11 18:42', job: 'M-1142', client: 'Анна Демо', kind: 'Задаток 20 %', method: 'Przelewy24 · BLIK', sum: 778, st: 'получено' },
    { at: '19.11 12:20', job: 'M-1151', client: 'Катажина Демо', kind: 'Задаток 20 %', method: 'ссылка отправлена', sum: 778, st: 'не оплачен' },
    { at: '18.11 09:10', job: 'M-1143', client: 'Пётр Демо', kind: 'Задаток 20 %', method: 'Przelewy24 · карта', sum: 358, st: 'получено' },
    { at: '17.11 14:44', job: 'M-1144', client: 'Демо Студия', kind: 'Задаток 20 %', method: 'Перевод', sum: 1490, st: 'получено' },
  ];
  const invoices = [
    { no: 'FV/2026/11/031', job: 'M-1139', client: 'Магдалена Демо', sum: 3890, ksef: 'принята', at: '21.11' },
    { no: 'FV/2026/11/030', job: 'M-1137', client: 'Демо Бюро', sum: 6210, ksef: 'принята', at: '20.11' },
    { no: 'FV/2026/11/029', job: 'M-1135', client: 'Томаш Демо', sum: 1790, ksef: 'в очереди', at: '19.11' },
  ];

  const weeks = [
    { w: '28.09', rev: 9400, profit: 4100 }, { w: '05.10', rev: 12800, profit: 5900 }, { w: '12.10', rev: 11200, profit: 4700 },
    { w: '19.10', rev: 15900, profit: 7600 }, { w: '26.10', rev: 14300, profit: 6400 }, { w: '02.11', rev: 17800, profit: 8300 },
    { w: '09.11', rev: 16400, profit: 7400 }, { w: '16.11', rev: 21650, profit: 10200 },
  ];
  const norms = [
    { item: 'Шкаф 2 м — разборка и сборка', norm: 45, fact: 52, n: 14 },
    { item: 'Кровать 160 с подъёмным механизмом', norm: 30, fact: 33, n: 11 },
    { item: 'Диван 3-местный — вынос', norm: 20, fact: 24, n: 18 },
    { item: 'Холодильник — вынос', norm: 25, fact: 23, n: 16 },
    { item: 'Стиральная машина — отключить и вынести', norm: 30, fact: 34, n: 9 },
    { item: 'Телевизор 55″ — снять со стены', norm: 48, fact: 41, n: 7 },
    { item: 'Коробка кухни — упаковать', norm: 12, fact: 13.5, n: 212 },
    { item: 'Стол на 4 + стулья', norm: 15, fact: 14, n: 13 },
  ];

  const notifications = [
    { t: 'Бригада А: упакована коробка MB-7F3K2 · Кухня 12', at: '2 мин', job: 'M-1142' },
    { t: 'Пётр Демо открыл страницу переезда', at: '9 мин', job: 'M-1143' },
    { t: 'Новая заявка с сайта: Ewa Demo, Под ключ', at: '1 ч', lead: 'L-3081' },
    { t: 'Задаток не оплачен: Катажина Демо, 778 zł', at: '3 ч', job: 'M-1151' },
    { t: 'Оферта O-2207 истекает завтра', at: '5 ч', offer: 'O-2207' },
  ];

  // подписи соответствуют содержимому картинок сайта (демо-фото)
  const PHOTOS = {
    arrive: ['/img/site/van-side.webp', 'Бус у подъезда, место для погрузки свободно'],
    before1: ['/img/film/step-1-video.webp', 'Спальня до начала работ'],
    before2: ['/img/site/phone.webp', 'Гостиная до начала: съёмка комнаты'],
    protect: ['/img/site/pack.webp', 'Коробка собрана, дно проклеено'],
    pack1: ['/img/site/gloves.webp', 'Бокалы в бумаге — хрупкое'],
    pack2: ['/img/film/step-4-pack.webp', 'Кухня: коробка в работе'],
    pack3: ['/img/film/std-tape.webp', 'Коробка заклеена бирюзовым скотчем'],
    tape: ['/img/site/tape.webp', 'Наклейка комнаты и QR на месте'],
    load: ['/img/film/step-3-book.webp', 'Погрузка по пандусу'],
    van: ['/img/services/mebel.webp', 'Груз закреплён ремнями'],
    road: ['/img/film/step-5-road.webp', 'В пути'],
    after1: ['/img/film/step-6-home.webp', 'Новая квартира: мебель расставлена'],
    after2: ['/img/services/kvartira.webp', 'Коробки по комнатам, номера видны'],
    std: ['/img/services/dom.webp', 'Приёмка: ключи и протокол'],
  };

  return { ROOMS, STAGES, PKG, PKG_STAGES, DAYS, staff, vans, jobs, leads, LEAD_ITEMS, COLS, LOST, offers, stock, payments, invoices, weeks, norms, notifications, PHOTOS };
})();
