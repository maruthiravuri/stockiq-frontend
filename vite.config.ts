import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: { port: 3000, open: true },
  define: {
    // sockjs-client uses Node globals — polyfill for browser
    global: 'globalThis',
    'process.env': {},
  },
  build: {
    outDir: 'build',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks(id: string) {
          if (id.includes('node_modules')) {
            if (id.includes('@mui')) return 'mui';
            if (id.includes('recharts')) return 'charts';
            if (id.includes('ag-grid')) return 'grid';
            if (id.includes('@reduxjs') || id.includes('react-redux')) return 'redux';
            if (id.includes('react-dom') || id.includes('react/')) return 'vendor';
          }
        },
      },
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/setupTests.ts'],
    include: ['src/**/*.test.{ts,tsx}'],
    exclude: ['e2e/**', 'node_modules/**'],
    css: true,
  },
});
