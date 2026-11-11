/**
 * Единый источник правды о бренде.
 * Логотип, цвета и контакты меняются ЗДЕСЬ — и обновляются по всему сайту.
 * Всё, что помечено TODO, — заглушки до утверждения.
 */
export const brand = {
  name: 'MELBUS',
  // TODO: заменить на настоящие данные из KRS/CEIDG
  legal: {
    company: 'MELBUS [forma prawna]',
    address: '[adres rejestrowy]',
    nip: '[NIP]',
    krs: '[KRS]',
    capital: '[kapitał zakładowy]',
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
