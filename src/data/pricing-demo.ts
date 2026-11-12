/**
 * ДЕМО-ЦИФРЫ для табло цены. Ставки MELBUS ещё НЕ утверждены (ждут анализа конкурентов).
 * Когда цены утвердят — заменить значения здесь и убрать DEMO. Подписи — сразу на 4 языках.
 */
import type { L } from '../i18n/text';

export const DEMO = true;
export const boardOptions: { label: L; value: number; status: L }[] = [
  { value: 1190, label: { ru: 'Студия', pl: 'Kawalerka', uk: 'Студія', en: 'Studio' }, status: { ru: 'Студия · до 30 м²', pl: 'Kawalerka · do 30 m²', uk: 'Студія · до 30 м²', en: 'Studio · up to 30 m²' } },
  { value: 1890, label: { ru: '2 комнаты', pl: '2 pokoje', uk: '2 кімнати', en: '2 rooms' }, status: { ru: '2 комнаты · 40–55 м²', pl: '2 pokoje · 40–55 m²', uk: '2 кімнати · 40–55 м²', en: '2 rooms · 40–55 m²' } },
  { value: 2690, label: { ru: '3 комнаты', pl: '3 pokoje', uk: '3 кімнати', en: '3 rooms' }, status: { ru: '3 комнаты · 60–80 м²', pl: '3 pokoje · 60–80 m²', uk: '3 кімнати · 60–80 м²', en: '3 rooms · 60–80 m²' } },
  { value: 4290, label: { ru: 'Дом', pl: 'Dom', uk: 'Будинок', en: 'House' }, status: { ru: 'Дом · до 150 м²', pl: 'Dom · do 150 m²', uk: 'Будинок · до 150 м²', en: 'House · up to 150 m²' } },
  { value: 3490, label: { ru: 'Офис', pl: 'Biuro', uk: 'Офіс', en: 'Office' }, status: { ru: 'Офис · 10–15 мест', pl: 'Biuro · 10–15 stanowisk', uk: 'Офіс · 10–15 місць', en: 'Office · 10–15 desks' } },
];
