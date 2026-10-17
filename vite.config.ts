import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';

interface RssItem {
  title: string;
  link: string;
  pubDate: string;
  author?: string;
  thumbnail?: string;
  description?: string;
  enclosure?: { link?: string };
}

async function fetchNewsArticles() {
  const response = await fetch(
    'https://api.rss2json.com/v1/api.json?rss_url=https://pitchfork.com/feed/rss'
  );
  const data = (await response.json()) as { items?: RssItem[] };
  const items = Array.isArray(data.items) ? data.items : [];

  return items.map((item) => {
    let imgUrl = item.thumbnail || item.enclosure?.link || '';
    if (!imgUrl && item.description) {
      const match = item.description.match(/<img[^>]+src="([^">]+)"/);
      if (match) imgUrl = match[1];
    }

    return {
      title: item.title,
      link: item.link,
      pubDate: item.pubDate,
      author: item.author || 'Pitchfork',
      thumbnail: imgUrl,
      description:
        (item.description?.replace(/<[^>]*>?/gm, '') || '').substring(0, 150) + '...',
    };
  });
}

function newsApiPlugin(): Plugin {
  return {
    name: 'musicpostr-news-api',
    configureServer(server) {
      server.middlewares.use('/api/news', async (_req, res) => {
        res.setHeader('Content-Type', 'application/json');
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
