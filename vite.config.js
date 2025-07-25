import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/',
  server: {
    https: false,
    host: '0.0.0.0',
    port: 5173
  },
  build: {
    outDir: 'dist'
  }
});