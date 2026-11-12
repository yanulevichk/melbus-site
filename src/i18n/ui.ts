/** Общие подписи интерфейса — каждая сразу на 4 языках (см. text.ts). */
import type { L } from './text';

export const ui = {
  nav: {
    services: { ru: 'Услуги', pl: 'Usługi', uk: 'Послуги', en: 'Services' },
    pricing: { ru: 'Цены', pl: 'Cennik', uk: 'Ціни', en: 'Prices' },
    how: { ru: 'Как мы работаем', pl: 'Jak pracujemy', uk: 'Як ми працюємо', en: 'How we work' },
    guarantee: { ru: 'Гарантия цены', pl: 'Gwarancja ceny', uk: 'Гарантія ціни', en: 'Price guarantee' },
    about: { ru: 'О нас', pl: 'O nas', uk: 'Про нас', en: 'About us' },
    contact: { ru: 'Контакты', pl: 'Kontakt', uk: 'Контакти', en: 'Contact' },
    faq: { ru: 'Вопросы и ответы', pl: 'Pytania i odpowiedzi', uk: 'Питання й відповіді', en: 'FAQ' },
  },
  cta: {
    price: { ru: 'Рассчитать цену', pl: 'Oblicz cenę', uk: 'Розрахувати ціну', en: 'Get a price' },
    video: { ru: 'Отправить видео', pl: 'Wyślij wideo', uk: 'Надіслати відео', en: 'Send a video' },
    call: { ru: 'Позвонить', pl: 'Zadzwoń', uk: 'Подзвонити', en: 'Call' },
    whatsapp: { ru: 'WhatsApp', pl: 'WhatsApp', uk: 'WhatsApp', en: 'WhatsApp' },
    writeWhatsapp: { ru: 'Написать в WhatsApp', pl: 'Napisz na WhatsApp', uk: 'Написати у WhatsApp', en: 'Message us on WhatsApp' },
    quote: { ru: 'Получить цену', pl: 'Otrzymaj wycenę', uk: 'Отримати ціну', en: 'Get a quote' },
    menu: { ru: 'Меню', pl: 'Menu', uk: 'Меню', en: 'Menu' },
    close: { ru: 'Закрыть', pl: 'Zamknij', uk: 'Закрити', en: 'Close' },
  },
  a11y: {
    home: { ru: 'главная', pl: 'strona główna', uk: 'головна', en: 'home' },
    mainNav: { ru: 'Основное меню', pl: 'Menu główne', uk: 'Головне меню', en: 'Main menu' },
    quick: { ru: 'Быстрые действия', pl: 'Szybkie akcje', uk: 'Швидкі дії', en: 'Quick actions' },
    skip: { ru: 'К содержанию', pl: 'Przejdź do treści', uk: 'До змісту', en: 'Skip to content' },
    langs: { ru: 'Язык', pl: 'Język', uk: 'Мова', en: 'Language' },
  },
  footer: {
    note: { ru: 'Переезды квартир, домов и офисов по Варшаве, Польше и Европе.', pl: 'Przeprowadzki mieszkań, domów i biur w Warszawie, w Polsce i w Europie.', uk: 'Переїзди квартир, будинків і офісів Варшавою, Польщею та Європою.', en: 'Flat, house and office moves in Warsaw, across Poland and Europe.' },
    company: { ru: 'Компания', pl: 'Firma', uk: 'Компанія', en: 'Company' },
    docs: { ru: 'Документы', pl: 'Dokumenty', uk: 'Документи', en: 'Documents' },
    terms: { ru: 'Регламент', pl: 'Regulamin', uk: 'Регламент', en: 'Terms' },
    privacy: { ru: 'Политика конфиденциальности', pl: 'Polityka prywatności', uk: 'Політика конфіденційності', en: 'Privacy policy' },
    cookies: { ru: 'Cookies', pl: 'Cookies', uk: 'Cookies', en: 'Cookies' },
    complaints: { ru: 'Рекламации', pl: 'Reklamacje', uk: 'Рекламації', en: 'Complaints' },
    ai: { ru: 'Часть видео на сайте — визуализация, созданная ИИ.', pl: 'Część filmów na stronie to wizualizacje stworzone przez AI.', uk: 'Частина відео на сайті — візуалізація, створена ШІ.', en: 'Some videos on this site are AI-generated visualisations.' },
  },
  aiLabel: { ru: 'Визуализация', pl: 'Wizualizacja', uk: 'Візуалізація', en: 'Visualisation' },
  sceneSoon: { ru: 'Здесь будет сцена', pl: 'Tu pojawi się scena', uk: 'Тут буде сцена', en: 'Scene coming soon' },
  ctaBand: {
    title: { ru: 'Ваш новый адрес<br>ждёт.', pl: 'Twój nowy adres<br>czeka.', uk: 'Ваша нова адреса<br>чекає.', en: 'Your new address<br>is waiting.' },
    lead: { ru: 'Пришлите видео квартиры — в течение 2 часов днём получите цену, которая не изменится.', pl: 'Wyślij wideo mieszkania — w ciągu 2 godzin (w dzień) otrzymasz cenę, która się nie zmieni.', uk: 'Надішліть відео квартири — протягом 2 годин удень отримаєте ціну, яка не зміниться.', en: 'Send us a video of your flat — within 2 hours (daytime) you get a price that won’t change.' },
  },
  notFound: {
    title: { ru: 'Страница не найдена', pl: 'Nie znaleziono strony', uk: 'Сторінку не знайдено', en: 'Page not found' },
    eyebrow: { ru: 'Ошибка 404', pl: 'Błąd 404', uk: 'Помилка 404', en: 'Error 404' },
    h1: { ru: 'Такого адреса<br />нет.', pl: 'Taki adres<br />nie istnieje.', uk: 'Такої адреси<br />немає.', en: 'This address<br />doesn’t exist.' },
    lead: { ru: 'Но мы доставим вас куда нужно.', pl: 'Ale dowieziemy Cię tam, gdzie trzeba.', uk: 'Але ми доставимо вас куди треба.', en: 'But we’ll get you where you need to be.' },
    home: { ru: 'На главную', pl: 'Na stronę główną', uk: 'На головну', en: 'Back to home' },
  },
} satisfies Record<string, L | Record<string, L>>;
