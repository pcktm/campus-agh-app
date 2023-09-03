// eslint-disable-next-line import/no-unresolved
import {defineConfig, minimalPreset as preset} from '@vite-pwa/assets-generator/config';

export default defineConfig({
  preset,
  images: [
    'public/logo.svg',
  ],
});
