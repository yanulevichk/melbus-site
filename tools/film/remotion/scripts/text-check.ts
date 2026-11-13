// Автопроверка всех 4-языковых текстов сайта и соцсетей: npx tsx scripts/text-check.ts (оставшиеся «латиница в ru» для слагов, OLX, MDM, Przelewy — норма)
import * as path from 'node:path';
const R = path.resolve(__dirname, '../../../..');
const files = [
  'tools/film/remotion/src/social/stories.ts', 'tools/film/remotion/src/social/posts.ts', 'tools/film/remotion/src/social/texts.ts', 'tools/film/remotion/src/social/gptbank.ts',
  'src/content/home.ts', 'src/content/pages.ts', 'src/content/quote.ts', 'src/content/calculator.ts', 'src/content/areas.ts',
  'src/content/prices.ts', 'src/content/offer.ts', 'src/i18n/ui.ts', 'src/data/areas.ts', 'src/data/services.ts', 'src/data/faq.ts', 'src/data/pricing.ts',
];
const CYR = /[Ѐ-ӿ]/, LAT = /[A-Za-zĄąĆćĘęŁłŃńÓóŚśŹźŻż]/;
const OK_LAT = new Set(['MELBUS', 'QR', 'VAT', 'BLIK', 'TV', 'AI', 'km', 'zł', 'Reels', 'WhatsApp', 'Telegram', 'Instagram', 'TikTok', 'Facebook', 'Google', 'IKEA', 'XL', 'XXL', 'M', 'S', 'L', 'RODO', 'GDPR', 'KSeF', 'OC', 'EU', 'PL', 'UA', 'EN', 'RU', 'm²', 'm2', 'MEL', 'BUS', 'CapCut', 'Ultra', 'Higgsfield', 'ChatGPT', 'Blender', 'Seedance', 'Kling', 'm', 'x', 'h', 'Wi', 'Fi', 'faktura', 'Mokotów', 'email', 'Email', 'Cookies', 'cookies', 'NIP', 'Warszawa', 'PDF', 'Wi-Fi', 'IBAN', 'SMS', 'URL', 'CRM', 'Open', 'Graph']);
const issues: string[] = [];
const seen = new Set<object>();
const walk = (v: any, where: string) => {
  if (!v || typeof v !== 'object' || seen.has(v)) return; seen.add(v);
  if (typeof v.ru === 'string' && typeof v.pl === 'string' && typeof v.uk === 'string' && typeof v.en === 'string') { check(v, where); return; }
  for (const [k, x] of Object.entries(v)) walk(x, `${where}.${k}`);
};
const check = (r: Record<string, string>, where: string) => {
  const id = `${where} «${r.ru.slice(0, 50)}»`;
  for (const [L, s0] of Object.entries(r)) {
    if (typeof s0 !== 'string') continue;
    const s = s0.replace(/<[^>]+>/g, ' ').replace(/\{[a-z]+\}/gi, ' ').replace(/#\S+/g, ' ').replace(/\s+([,.!?:;])/g, '$1');
    if (/DPD|GLS/i.test(s)) issues.push(`[запрет] ${L} ${id}`);
    if (/ {2,}|\s+[,.!?:;]|\s$|^\s/.test(s0.replace(/<[^>]+>/g, ''))) issues.push(`[пробелы] ${L} ${id}: «${s0}»`);
    for (const w of s.split(/[\s,.;:!?()«»„”“"'’\/\-—–+=…%·#№0-9]+/).filter(Boolean)) {
      if (CYR.test(w) && LAT.test(w)) issues.push(`[смешанное слово] ${L} ${id}: «${w}»`);
      if ((L === 'pl' || L === 'en') && CYR.test(w)) issues.push(`[кириллица в ${L}] ${id}: «${w}»`);
      if ((L === 'ru' || L === 'uk') && LAT.test(w) && !CYR.test(w) && !OK_LAT.has(w) && w.length > 1 && !w.startsWith('#')) issues.push(`[латиница в ${L}] ${id}: «${w}»`);
    }
    if (L === 'uk' && /[ыэъё]/i.test(s)) issues.push(`[русские буквы в uk] ${id}: «${s.match(/\S*[ыэъё]\S*/i)![0]}»`);
    if (L === 'ru' && /[іїєґ]/i.test(s)) issues.push(`[украинские буквы в ru] ${id}`);
    if (L === 'pl' && /[«»“]|"/.test(s)) issues.push(`[кавычки pl] ${id}: «${s.slice(0, 80)}»`);
    if ((L === 'ru' || L === 'uk') && /[„“”"]/.test(s)) issues.push(`[кавычки ${L}] ${id}: «${s.slice(0, 80)}»`);
    if (L === 'en' && /[«»„]/.test(s)) issues.push(`[кавычки en] ${id}: «${s.slice(0, 80)}»`);
  }
  if (r.ru.length > 25 && (r.ru === r.uk || r.pl === r.en)) issues.push(`[одинаково на 2 языках] ${id}`);
  const lens = Object.values(r).map((x) => x.length);
  if (Math.min(...lens) > 15 && Math.max(...lens) > Math.min(...lens) * 2.2) issues.push(`[длина сильно разная ${lens.join('/')}] ${id}`);
};
(async () => {
  for (const f of files) { const m = await import(path.join(R, f)); walk(m, path.basename(f)); }
  const uniq = [...new Set(issues)];
  console.log(`записей проверено: ${seen.size} объектов; замечаний: ${uniq.length}`);
  uniq.forEach((x) => console.log(x));
})();
