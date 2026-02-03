// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
<<<<<<< HEAD
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        rewrite: (path) => path
=======
    // YANGI QO'SHILGAN QISM:
    headers: {
      'Content-Type': 'application/javascript'
    },
    proxy: {
      '/api': {
        target: 'http://infast-crm-server.vercel.app',
        changeOrigin: true
>>>>>>> f76e6b7a4f867ecdb448a60fb5faf9d6925d5c88
      }
    }
  },
  preview: {
    port: process.env.PORT || 3000,
<<<<<<< HEAD
    host: '0.0.0.0',
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        rewrite: (path) => path
      }
    }
=======
    host: '0.0.0.0'
>>>>>>> f76e6b7a4f867ecdb448a60fb5faf9d6925d5c88
  },
  // YANGI QO'SHILGAN QISM:
  build: {
    rollupOptions: {
      output: {
        assetFileNames: (assetInfo) => {
          let extType = assetInfo.name.split('.').at(1);
          if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(extType)) {
            extType = 'img';
          }
          if (/jsx?/i.test(extType)) {
            extType = 'js';
          }
          return `assets/${extType}/[name]-[hash][extname]`;
        },
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
      },
    },
  }
});