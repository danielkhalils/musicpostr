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

  try {
    const response = await fetch(targetUrl, {
      headers: {
        'User-Agent': 'musicpostr/1.0.0 (https://musicpostr.vercel.app)',
        'Accept': 'application/json',
      },
    });
    const data = await response.json();
    return res.status(response.status || 200).json(data);
  } catch (error) {
    console.error('Erro no proxy do MusicBrainz:', error);
    return res.status(500).json({ error: 'Falha ao comunicar com a API do MusicBrainz' });
  }
}
