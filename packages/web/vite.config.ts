import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    // The proxy is the key to avoiding CORS issues during development.
    // When React code calls fetch('/api/tasks'), Vite intercepts it and
    // forwards to http://localhost:3000/api/tasks.
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
});
