import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  define: {
    // Fix for sockjs-client and other Node.js libraries that expect 'global'
    global: 'globalThis',
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@/components': path.resolve(__dirname, './src/components'),
      '@/pages': path.resolve(__dirname, './src/pages'),
      '@/services': path.resolve(__dirname, './src/services'),
      '@/stores': path.resolve(__dirname, './src/stores'),
      '@/hooks': path.resolve(__dirname, './src/hooks'),
      '@/utils': path.resolve(__dirname, './src/utils'),
      '@/types': path.resolve(__dirname, './src/types'),
      '@/config': path.resolve(__dirname, './src/config'),
    },
  },
  server: {
    port: 3000,
    proxy: {
      '/api/auth': {
        target: 'http://localhost:8081',
        changeOrigin: true,
      },
      '/api/worker': {
        target: 'http://localhost:8082',
        changeOrigin: true,
      },
      '/api/employer': {
        target: 'http://localhost:8082',
        changeOrigin: true,
      },
      '/api/job': {
        target: 'http://localhost:8083',
        changeOrigin: true,
      },
      '/api/assignments': {
        target: 'http://localhost:8084',
        changeOrigin: true,
      },
      '/api/attendance': {
        target: 'http://localhost:8086',
        changeOrigin: true,
      },
      '/api/payment': {
        target: 'http://localhost:8087',
        changeOrigin: true,
      },
      '/api/invoice': {
        target: 'http://localhost:8087',
        changeOrigin: true,
      },
      '/api/notifications': {
        target: 'http://localhost:8088',
        changeOrigin: true,
      },
      '/api/Matching': {
        target: 'http://localhost:8085',
        changeOrigin: true,
      },
      '/ws-notifications': {
        target: 'http://localhost:8088',
        ws: true,
        changeOrigin: true,
      },
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    css: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: ['node_modules/', 'src/test/'],
    },
  },
});
