// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';
import node from '@astrojs/node';
import cloudflare from '@astrojs/cloudflare';

const isProduction = process.env.NODE_ENV === 'production';

// https://astro.build/config
export default defineConfig({
  integrations: [
    react(),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
  output: 'server',
  adapter: isProduction
    ? cloudflare({
        imageService: 'cloudflare',
      })
    : node({
        mode: 'standalone',
      }),
});
