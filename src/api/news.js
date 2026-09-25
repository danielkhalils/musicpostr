export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    const rssFeedUrl = 'https://api.rss2json.com/v1/api.json?rss_url=https://pitchfork.com/feed/rss';
    
    const response = await fetch(rssFeedUrl);
    const data = await response.json();

    if (data && data.items) {
      const newsList = data.items.map(item => {
        // Tenta extrair a imagem de dentro da descrição HTML caso o thumbnail venha vazio
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
          description: item.description?.replace(/<[^>]*>?/gm, '').substring(0, 150) + '...'
        };
      });

      return res.status(200).json({ articles: newsList });
    }

    return res.status(200).json({ articles: [] });
  } catch (error) {
    console.error('Erro ao buscar notícias de música:', error);
    return res.status(500).json({ error: 'Falha ao carregar notícias' });
  }
}