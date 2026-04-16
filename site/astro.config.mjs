// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import cloudflare from '@astrojs/cloudflare';

// https://astro.build/config
export default defineConfig({
  adapter: cloudflare(),
  site: 'https://aastorage.web.app',
  integrations: [sitemap()],
  vite: {
    plugins: [tailwindcss()]
  }
});
