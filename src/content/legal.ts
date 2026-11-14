/**
 * ДОКУМЕНТЫ: политика конфиденциальности и cookies — каждая фраза сразу на 4 языках.
 * Черновик 14.11.2026 — перед запуском показать юристу (особенно: Telegram как получатель данных,
 * передача за пределы ЕЭЗ, сроки хранения). Реквизиты берутся из config/brand.ts.
 */
import type { L } from '../i18n/text';
import type { LBlock } from './pages';
import { brand } from '../config/brand';

const l = (ru: string, pl: string, uk: string, en: string): L => ({ ru, pl, uk, en });
const { company, address, nip } = brand.legal;
const email = brand.contact.email;

/** блок о cookies — общий для «Политики конфиденциальности» и страницы «Cookies» */
export const cookiesBlock: LBlock = {
  type: 'text',
  title: l('Cookies', 'Cookies', 'Cookies', 'Cookies'),
  items: [
    [l('Без рекламных cookies', 'Bez cookies reklamowych', 'Без рекламних cookies', 'No advertising cookies'),
      l('Сайт не использует рекламные и аналитические cookies. В памяти браузера мы сохраняем только техническую отметку о том, что анимация логотипа уже показана. Если добавим аналитику, сначала спросим согласия и обновим эту политику.',
        'Strona nie używa cookies reklamowych ani analitycznych. W pamięci przeglądarki zapisujemy tylko techniczną informację, że animacja logo już się wyświetliła. Jeśli dodamy analitykę, najpierw zapytamy o zgodę i zaktualizujemy tę politykę.',
        'Сайт не використовує рекламних і аналітичних cookies. У пам’яті браузера ми зберігаємо лише технічну позначку про те, що анімацію логотипа вже показано. Якщо додамо аналітику, спершу попросимо згоди й оновимо цю політику.',
        'The site uses no advertising or analytics cookies. Your browser only stores a technical note that the logo animation has already played. If we add analytics, we’ll ask for your consent first and update this policy.')],
    [l('Последнее обновление', 'Ostatnia aktualizacja', 'Останнє оновлення', 'Last updated'),
      l('14 ноября 2026 года.', '14 listopada 2026 r.', '14 листопада 2026 року.', '14 November 2026.')],
  ],
};

export const privacy: { lead: L; blocks: LBlock[] } = {
  lead: l('Простыми словами: какие данные мы получаем, зачем и сколько храним.',
    'Prostymi słowami: jakie dane zbieramy, po co i jak długo je przechowujemy.',
    'Простими словами: які дані ми отримуємо, навіщо й скільки зберігаємо.',
    'In plain words: what data we collect, why, and how long we keep it.'),
  blocks: [
    { type: 'text', title: l('Кто отвечает за ваши данные', 'Kto odpowiada za Twoje dane', 'Хто відповідає за ваші дані', 'Who is responsible for your data'),
      items: [[l(company, company, company, company),
        l(`${address}. NIP ${nip}. По вопросам персональных данных пишите на ${email}.`,
          `${address}. NIP ${nip}. W sprawach danych osobowych pisz na ${email}.`,
          `${address}. NIP ${nip}. З питань персональних даних пишіть на ${email}.`,
          `${address}. NIP (tax ID) ${nip}. For anything about your personal data, write to ${email}.`)]] },

    { type: 'text', title: l('Какие данные мы получаем', 'Jakie dane zbieramy', 'Які дані ми отримуємо', 'What data we collect'),
      items: [
        [l('Из формы заявки', 'Z formularza zgłoszenia', 'З форми заявки', 'From the request form'),
          l('Имя, телефон, удобный способ связи, детали переезда (адреса, этажи, дата, список вещей, комментарий), а также видео и фото, которые вы присылаете.',
            'Imię, telefon, preferowany sposób kontaktu, szczegóły przeprowadzki (adresy, piętra, termin, lista rzeczy, uwagi) oraz filmy i zdjęcia, które przesyłasz.',
            'Ім’я, телефон, зручний спосіб зв’язку, деталі переїзду (адреси, поверхи, дата, перелік речей, коментар), а також відео й фото, які ви надсилаєте.',
            'Your name, phone number, preferred way to contact you, move details (addresses, floors, date, list of items, comments) and any videos or photos you send.')],
        [l('Для фактуры', 'Do faktury', 'Для фактури', 'For invoices'),
          l('Данные фирмы, если нужна фактура на фирму.', 'Dane firmy, jeśli potrzebujesz faktury na firmę.', 'Дані фірми, якщо потрібна фактура на фірму.', 'Company details, if you need a VAT invoice for a business.')],
        [l('Технические данные', 'Dane techniczne', 'Технічні дані', 'Technical data'),
          l('IP-адрес и сведения о браузере в журналах сервера — они нужны для безопасности сайта.',
            'Adres IP i informacje o przeglądarce w logach serwera — potrzebne do bezpieczeństwa strony.',
            'IP-адреса та відомості про браузер у журналах сервера — вони потрібні для безпеки сайту.',
            'IP address and browser information in server logs, kept for the site’s security.')],
      ] },

    { type: 'text', title: l('Зачем и на каком основании', 'Po co i na jakiej podstawie', 'Навіщо й на якій підставі', 'Why and on what legal basis'),
      items: [
        [l('Расчёт и оферта', 'Wycena i oferta', 'Розрахунок і оферта', 'Quote and offer'),
          l('Чтобы посчитать цену и ответить на заявку (ст. 6 ч. 1 лит. b GDPR — действия до заключения договора).',
            'Żeby przygotować wycenę i odpowiedzieć na zgłoszenie (art. 6 ust. 1 lit. b RODO — działania przed zawarciem umowy).',
            'Щоб порахувати ціну й відповісти на заявку (ст. 6 ч. 1 літ. b GDPR — дії до укладення договору).',
            'To prepare a price and reply to your request (Art. 6(1)(b) GDPR — steps before a contract).')],
        [l('Переезд', 'Przeprowadzka', 'Переїзд', 'Your move'),
          l('Чтобы выполнить договор: согласовать дату, бригаду и маршрут (ст. 6 ч. 1 лит. b GDPR).',
            'Żeby wykonać umowę: ustalić termin, ekipę i trasę (art. 6 ust. 1 lit. b RODO).',
            'Щоб виконати договір: узгодити дату, бригаду й маршрут (ст. 6 ч. 1 літ. b GDPR).',
            'To perform the contract: agree on the date, crew and route (Art. 6(1)(b) GDPR).')],
        [l('Фактуры и бухгалтерия', 'Faktury i księgowość', 'Фактури й бухгалтерія', 'Invoices and accounting'),
          l('Чтобы выставить фактуру и хранить документы, как требует налоговое право (ст. 6 ч. 1 лит. c GDPR).',
            'Żeby wystawić fakturę i przechowywać dokumenty, jak wymaga prawo podatkowe (art. 6 ust. 1 lit. c RODO).',
            'Щоб виставити фактуру й зберігати документи, як вимагає податкове право (ст. 6 ч. 1 літ. c GDPR).',
            'To issue invoices and keep records as tax law requires (Art. 6(1)(c) GDPR).')],
        [l('Рекламации и безопасность', 'Reklamacje i bezpieczeństwo', 'Рекламації й безпека', 'Complaints and security'),
          l('Чтобы рассматривать рекламации, защищать свои права и сайт от злоупотреблений — это наш законный интерес (ст. 6 ч. 1 лит. f GDPR).',
            'Żeby rozpatrywać reklamacje, dochodzić roszczeń i chronić stronę przed nadużyciami — to nasz prawnie uzasadniony interes (art. 6 ust. 1 lit. f RODO).',
            'Щоб розглядати рекламації, захищати свої права й сайт від зловживань — це наш законний інтерес (ст. 6 ч. 1 літ. f GDPR).',
            'To handle complaints, defend our rights and protect the site from abuse — our legitimate interest (Art. 6(1)(f) GDPR).')],
      ] },

    { type: 'text', title: l('Кому мы передаём данные', 'Komu przekazujemy dane', 'Кому ми передаємо дані', 'Who we share data with'),
      items: [
        [l('Хостинг и хранение файлов', 'Hosting i przechowywanie plików', 'Хостинг і зберігання файлів', 'Hosting and file storage'),
          l('Cloudflare, Inc. — серверы сайта, формы и видео.', 'Cloudflare, Inc. — serwery strony, formularza i filmów.', 'Cloudflare, Inc. — сервери сайту, форми й відео.', 'Cloudflare, Inc. — servers for the site, the form and videos.')],
        [l('Уведомления менеджеру', 'Powiadomienia dla menedżera', 'Сповіщення менеджеру', 'Notifications for our manager'),
          l('Telegram — заявка приходит в закрытую рабочую группу нашей команды.', 'Telegram — zgłoszenie trafia do zamkniętej grupy roboczej naszego zespołu.', 'Telegram — заявка надходить у закриту робочу групу нашої команди.', 'Telegram — your request arrives in our team’s private work group.')],
        [l('Бухгалтерия', 'Księgowość', 'Бухгалтерія', 'Accounting'),
          l('Бухгалтерское бюро и система KSeF — только данные для фактуры.', 'Biuro rachunkowe i system KSeF — tylko dane do faktury.', 'Бухгалтерське бюро й система KSeF — лише дані для фактури.', 'Our accountants and the KSeF e-invoicing system — invoice details only.')],
        [l('За пределами ЕЭЗ', 'Poza EOG', 'За межами ЄЕЗ', 'Outside the EEA'),
          l('Если данные попадают за пределы Европейской экономической зоны, мы используем защиту, которую предусматривает GDPR, например стандартные договорные условия Еврокомиссии.',
            'Jeśli dane trafiają poza Europejski Obszar Gospodarczy, korzystamy z zabezpieczeń przewidzianych w RODO, np. standardowych klauzul umownych Komisji Europejskiej.',
            'Якщо дані потрапляють за межі Європейської економічної зони, ми використовуємо захист, який передбачає GDPR, наприклад стандартні договірні умови Єврокомісії.',
            'If data leaves the European Economic Area, we rely on safeguards provided by the GDPR, such as the European Commission’s standard contractual clauses.')],
        [l('Не продаём данные', 'Nie sprzedajemy danych', 'Не продаємо дані', 'We don’t sell data'),
          l('Мы не продаём данные и не передаём их рекламодателям.', 'Nie sprzedajemy danych i nie przekazujemy ich reklamodawcom.', 'Ми не продаємо дані й не передаємо їх рекламодавцям.', 'We never sell your data or share it with advertisers.')],
      ] },

    { type: 'text', title: l('Сколько храним', 'Jak długo przechowujemy', 'Скільки зберігаємо', 'How long we keep it'),
      items: [
        [l('Заявка без договора', 'Zgłoszenie bez umowy', 'Заявка без договору', 'Requests without a contract'),
          l('До 12 месяцев с последнего контакта, если раньше вы не попросите удалить.', 'Do 12 miesięcy od ostatniego kontaktu, chyba że wcześniej poprosisz o usunięcie.', 'До 12 місяців від останнього контакту, якщо раніше ви не попросите видалити.', 'Up to 12 months after our last contact, unless you ask us to delete it sooner.')],
        [l('Видео и фото', 'Filmy i zdjęcia', 'Відео й фото', 'Videos and photos'),
          l('До 60 дней, потом удаляем.', 'Do 60 dni, potem je usuwamy.', 'До 60 днів, потім видаляємо.', 'Up to 60 days, then we delete them.')],
        [l('Договор и фактуры', 'Umowa i faktury', 'Договір і фактури', 'Contracts and invoices'),
          l('Пока не истекут сроки претензий по договору; бухгалтерские документы — 5 лет с конца года, в котором выставлена фактура.',
            'Do przedawnienia roszczeń z umowy; dokumenty księgowe — 5 lat od końca roku, w którym wystawiono fakturę.',
            'Доки не минуть строки претензій за договором; бухгалтерські документи — 5 років від кінця року, в якому виставлено фактуру.',
            'Until claims under the contract expire; accounting records for 5 years from the end of the year the invoice was issued.')],
      ] },

    { type: 'text', title: l('Ваши права', 'Twoje prawa', 'Ваші права', 'Your rights'),
      items: [
        [l('Доступ, исправление, удаление', 'Dostęp, poprawienie, usunięcie', 'Доступ, виправлення, видалення', 'Access, correction, deletion'),
          l('Вы можете попросить копию своих данных, исправить или удалить их, ограничить обработку или перенести данные.',
            'Możesz poprosić o kopię swoich danych, ich poprawienie lub usunięcie, a także o ograniczenie przetwarzania i przeniesienie danych.',
            'Ви можете попросити копію своїх даних, виправити чи видалити їх, обмежити обробку або перенести дані.',
            'You can ask for a copy of your data, have it corrected or deleted, restrict its processing or move it elsewhere.')],
        [l('Возражение', 'Sprzeciw', 'Заперечення', 'Objection'),
          l('Вы можете возразить против обработки на основании нашего законного интереса.', 'Możesz sprzeciwić się przetwarzaniu opartemu na naszym prawnie uzasadnionym interesie.', 'Ви можете заперечити проти обробки на підставі нашого законного інтересу.', 'You can object to processing based on our legitimate interest.')],
        [l('Жалоба', 'Skarga', 'Скарга', 'Complaint'),
          l('Вы можете подать жалобу в польский орган по защите данных (Prezes UODO, ul. Stawki 2, 00-193 Warszawa).',
            'Możesz złożyć skargę do Prezesa Urzędu Ochrony Danych Osobowych (ul. Stawki 2, 00-193 Warszawa).',
            'Ви можете подати скаргу до польського органу із захисту даних (Prezes UODO, ul. Stawki 2, 00-193 Warszawa).',
            'You can complain to the Polish data protection authority (Prezes UODO, ul. Stawki 2, 00-193 Warszawa).')],
        [l('Обязательно ли давать данные', 'Czy muszę podać dane', 'Чи обов’язково надавати дані', 'Do I have to give my data?'),
          l('Нет, но без телефона и деталей переезда мы не сможем подготовить оферту.', 'Nie, ale bez telefonu i szczegółów przeprowadzki nie przygotujemy oferty.', 'Ні, але без телефону й деталей переїзду ми не зможемо підготувати оферту.', 'No, but without a phone number and move details we can’t prepare an offer.')],
        [l('Автоматические решения', 'Automatyczne decyzje', 'Автоматичні рішення', 'Automated decisions'),
          l('Калькулятор на сайте считает примерную цену автоматически. Окончательную оферту проверяет и отправляет человек. Профилирования нет.',
            'Kalkulator na stronie liczy cenę orientacyjną automatycznie. Ostateczną ofertę sprawdza i wysyła człowiek. Nie profilujemy klientów.',
            'Калькулятор на сайті рахує орієнтовну ціну автоматично. Остаточну оферту перевіряє й надсилає людина. Профілювання немає.',
            'The calculator on the site estimates a price automatically. A person checks and sends the final offer. We don’t profile clients.')],
      ] },

    cookiesBlock,
  ],
};
