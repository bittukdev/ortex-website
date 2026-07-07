import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        customization: resolve(__dirname, 'customization.html'),
        oem: resolve(__dirname, 'oem.html'),
        about: resolve(__dirname, 'about.html'),
        product: resolve(__dirname, 'product.html'),
      },
    },
  },
});
