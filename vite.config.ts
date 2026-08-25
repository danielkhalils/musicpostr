import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api/deezer': {
        target: 'https://api.deezer.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/deezer/, ''),
      },
      '/api/musicbrainz': {
        target: 'https://musicbrainz.org/ws/2',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/musicbrainz/, ''),
      },
    },
  },
});