export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const { path, ...query } = req.query;
  const endpoint = Array.isArray(path) ? path.join('/') : (path || '');

  // Busca os lançamentos globais (Editorial Mundial - ID 125)
  const baseUrl = endpoint 
    ? `https://api.deezer.com/${endpoint}` 
    : 'https://api.deezer.com/editorial/125/releases';

  // Encaminha os query params recebidos (ex.: limit) para a API do Deezer
  const params = new URLSearchParams();
  Object.entries(query).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach((item) => params.append(key, item));
    } else if (value !== undefined) {
      params.append(key, value);
    }
  });
  const queryString = params.toString();
  const targetUrl = queryString ? `${baseUrl}?${queryString}` : baseUrl;

  try {
    const response = await fetch(targetUrl);
    const data = await response.json();

    // Se estivermos buscando a lista de lançamentos, aplicamos o filtro internacional rigoroso
    if (!endpoint && data.data) {
      // Termos comuns em mercados locais que queremos excluir para focar no internacional
      const termosLocaisExcluidos = [
        'sertanejo', 'pagode', 'funk', 'forró', 'axé', 'mpb', 
        'ao vivo', 'gravado ao vivo', 'church', 'worship brasileiro'
      ];

      data.data = data.data.filter(item => {
        // Garante que é um álbum ou single oficial com capa de alta qualidade
        if (!item.cover_medium && !item.cover_big) return false;

        const title = (item.title || '').toLowerCase();
        const artist = (item.artist?.name || '').toLowerCase();

        // Verifica se o título ou artista contém termos puramente locais
        const contemTermoLocal = termosLocaisExcluidos.some(termo => 
          title.includes(termo) || artist.includes(termo)
        );

        return !contemTermoLocal;
      });
    }

    return res.status(200).json(data);
  } catch (error) {
    console.error('Erro no serviço proxy do Deezer:', error);
    return res.status(500).json({ error: 'Falha ao comunicar com a API do Deezer' });
  }
}