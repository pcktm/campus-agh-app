import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';
import {VitePWA} from 'vite-plugin-pwa';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['logo.svg'],
      workbox: {
        globPatterns: ['**/*.{js,css,html,png,jpg,svg,woff,woff2}'],
      },
      manifest: {
        name: 'CampusApp',
        short_name: 'CampusApp',
        description: 'Apka obozu adaptacyjnego Campus AGH',
        theme_color: '#eff6f7',
        lang: 'pl',
        orientation: 'portrait',
        background_color: '#fafaf9',
        icons: [
          {
            src: 'pwa-64x64.png',
            sizes: '64x64',
            type: 'image/png',
          },
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any',
          },
          {
            src: 'maskable-icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
    }),
  ],
  build: {
    minify: 'esbuild',
  },
  base: '/',
  define: {
    __BUILD_DATE__: JSON.stringify(new Date().toISOString()),
  },
});
