import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    minify: 'esbuild',
  },
  base: process.env.VERCEL ? '/' : '/app/',
  define: {
    __BUILD_DATE__: JSON.stringify(new Date().toISOString()),
  },
});
