import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://melbus.pl', // TODO: финальный домен
  trailingSlash: 'always',
  integrations: [sitemap({ filter: (p) => !p.endsWith('/404/') && !p.endsWith('/lux/') && !/\/(oferta|offer)\/$/.test(p) && !p.includes('/team/') })],
  vite: { plugins: [tailwindcss()] },
});
