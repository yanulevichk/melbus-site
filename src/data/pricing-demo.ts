/**
 * ДЕМО-ЦИФРЫ для табло цены. Ставки MELBUS ещё НЕ утверждены (ждут анализа конкурентов).
 * Когда цены утвердят — заменить значения здесь и убрать DEMO.
 */
export const DEMO = true;
export const boardOptions: { label: string; value: number; status: string }[] = [
  { label: 'Студия', value: 1190, status: 'Студия · до 30 м²' },
  { label: '2 комнаты', value: 1890, status: '2 комнаты · 40–55 м²' },
  { label: '3 комнаты', value: 2690, status: '3 комнаты · 60–80 м²' },
  { label: 'Дом', value: 4290, status: 'Дом · до 150 м²' },
  { label: 'Офис', value: 3490, status: 'Офис · 10–15 мест' },
];
