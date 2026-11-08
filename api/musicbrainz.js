export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const { path, ...query } = req.query;
  const endpoint = Array.isArray(path) ? path.join('/') : (path || '');
  const cleanEndpoint = endpoint.replace(/^\/+/, '');

  const params = new URLSearchParams();
  Object.entries(query).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach((item) => params.append(key, item));
    } else if (value !== undefined) {
      params.append(key, value);
    }
  });

  const queryString = params.toString();
  const targetUrl = `https://musicbrainz.org/ws/2/${cleanEndpoint}${queryString ? `?${queryString}` : ''}`;

  const maxRetries = 1;
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetch(targetUrl, {
        headers: {
          'User-Agent': 'MusicPostr/1.2.0 ( contact@musicpostr.vercel.app )',
          'Accept': 'application/json',
        },
      });

      // Se o MusicBrainz responder com 503 (rate limiting ou servidor ocupado), aguarda brevemente e tenta de novo
      if (response.status === 503 && attempt < maxRetries) {
        await new Promise((resolve) => setTimeout(resolve, 450));
        continue;
      }

      if (response.ok) {
        const data = await response.json();
        // Cache na borda (Edge Network da Vercel) por 24 horas
        res.setHeader('Cache-Control', 's-maxage=86400, stale-while-revalidate=604800');
        return res.status(200).json(data);
      }

      // Se continuar 503 ou 429 após as tentativas, retorna lista vazia para fallback suave no cliente
      if (response.status === 503 || response.status === 429) {
        return res.status(200).json({ releases: [], count: 0, unavailable: true });
      }

      const errorText = await response.text();
      return res.status(response.status).send(errorText);
    } catch (error) {
      if (attempt < maxRetries) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        continue;
      }
      console.error('Erro no proxy do MusicBrainz:', error);
      return res.status(200).json({ releases: [], count: 0, error: 'Falha de comunicação com MusicBrainz' });
    }
  }
}
