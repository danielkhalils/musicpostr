import { fetchNewsArticles } from '../shared/news.ts';

interface ApiRequest {
  method?: string;
}

interface ApiResponse {
  setHeader(name: string, value: string): void;
  status(code: number): ApiResponse;
  json(body: unknown): void;
  end(): void;
}

export default async function handler(req: ApiRequest, res: ApiResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    const articles = await fetchNewsArticles();

    // Cache na borda por 15 minutos para não bater no feed a cada visita
    res.setHeader('Cache-Control', 's-maxage=900, stale-while-revalidate=3600');

    return res.status(200).json({ articles });
  } catch (error) {
    console.error('Erro ao buscar notícias de música:', error);
    return res.status(500).json({ error: 'Falha ao carregar notícias' });
  }
}
