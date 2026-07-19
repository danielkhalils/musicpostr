const BASE_URL = 'https://musicbrainz.org/ws/2';

export const searchAlbums = async (query: string) => {
  // Buscamos 'release-group' que é a categoria de álbuns no MusicBrainz
  const response = await fetch(`${BASE_URL}/release-group?query=${encodeURIComponent(query)}&fmt=json&limit=10`, {
    headers: {
      'User-Agent': 'musicpostr/0.1.0 (seu-email-ou-url-do-projeto)'
    }
  });
  return response.json();
};