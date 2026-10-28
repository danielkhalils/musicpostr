import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import { fetchNewsArticles } from './shared/news.ts';

function newsApiPlugin(): Plugin {
  return {
    name: 'musicpostr-news-api',
    configureServer(server) {
      server.middlewares.use('/api/news', async (_req, res) => {
        res.setHeader('Content-Type', 'application/json; charset=utf-8');
        res.setHeader('Access-Control-Allow-Origin', '*');

        try {
          const articles = await fetchNewsArticles();
          res.end(JSON.stringify({ articles }));
        } catch (error) {
          console.error('Erro ao buscar notícias de música:', error);
          res.statusCode = 500;
          res.end(JSON.stringify({ error: 'Falha ao carregar notícias' }));
        }
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), newsApiPlugin()],
  server: {
    proxy: {
      // `secure: false` evita o erro "unable to verify the first certificate" em
      // redes locais com proxy/antivírus que reemitem o certificado TLS.
      // Isso afeta apenas o servidor de desenvolvimento; a Vercel usa as
      // funções serverless em `api/` para falar com essas APIs em produção.
      '/api/deezer': {
        target: 'https://api.deezer.com',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api\/deezer/, ''),
      },
      '/api/musicbrainz': {
        target: 'https://musicbrainz.org/ws/2',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api\/musicbrainz/, ''),
      },
    },
  },
});
