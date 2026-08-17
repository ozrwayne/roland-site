// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

import cloudflare from '@astrojs/cloudflare';

// https://astro.build/config
export default defineConfig({
  site: 'https://www.rolandwayne.com',

  vite: {
    plugins: [tailwindcss()]
  },

  adapter: cloudflare(),
  integrations: [
    sitemap({
      // Advertise only canonical content. Legacy Astro pages remain available
      // as permanent redirects but must not compete with the React homepage.
      filter: (page) => {
        const pathname = new URL(page).pathname;
        return pathname === '/' || (pathname.startsWith('/blog/') && pathname !== '/blog/');
      },
    }),
  ]
});
