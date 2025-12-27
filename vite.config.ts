import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  base: '/what-is-the-luhn-algorithm/',
  plugins: [tailwindcss()],
  test: {
    environment: 'happy-dom',
  },
});
