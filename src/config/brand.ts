/**
 * Единый источник правды о бренде.
 * Логотип, цвета и контакты меняются ЗДЕСЬ — и обновляются по всему сайту.
 * Всё, что помечено TODO, — заглушки до утверждения.
 */
export const brand = {
  name: 'MELBUS',
  // Реквизиты (JDG, CEIDG) — от владельца 14.11.2026. TODO: miejscowość для индекса 05-090
  legal: {
    company: 'MELBUS Edhar Lekh',
    address: 'ul. Źródlana 40, 05-090 [miejscowość]',
    nip: '1133069416',
  },
  // TODO: настоящие номера
  contact: {
    phone: '+48 000 000 000',
    phoneHref: '+48000000000',
    whatsapp: '48000000000',
    telegram: 'melbus',
    email: 'kontakt@melbus.pl',
  },
  area: 'Warszawa + 150 km',
  hours: '7 / 7',
  facts: {
    years: 5, // «5+ лет в логистике»
    deliveriesPerMonth: 30000,
  },
  site: 'https://melbus.pl', // TODO: финальный домен
} as const;

export type Brand = typeof brand;
