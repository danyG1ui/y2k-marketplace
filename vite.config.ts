
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        // Wir erzwingen feste Namen, damit wir im Shopify Liquid-Code nicht ständig die URLs ändern müssen
        entryFileNames: `assets/y2k-app.js`,
        chunkFileNames: `assets/[name].js`,
        assetFileNames: `assets/y2k-styles.[ext]`
      }
    }
  },
  server: {
    cors: true
  }
});
