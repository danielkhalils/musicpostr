const MB_RELEASE_SEARCH = '/api/musicbrainz/release';
const CAA_BASE = 'https://coverartarchive.org/release';
const CACHE_PREFIX = 'musicpostr_coverart_';
const CACHE_TTL_MS = 1000 * 60 * 60 * 24 * 7; // 7 dias

export interface CoverArtResult {
  mbid: string;
  frontUrl: string;
  backUrl: string | null;
}

interface CachedCoverArt extends CoverArtResult {
  cachedAt: number;
}

function buildCacheKey(albumTitle: string, artistName: string): string {
  return `${CACHE_PREFIX}${artistName}::${albumTitle}`
    .toLowerCase()
    .trim();
}

function readCache(cacheKey: string): CoverArtResult | null {
  try {
    const raw = localStorage.getItem(cacheKey);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as CachedCoverArt;
    if (Date.now() - parsed.cachedAt > CACHE_TTL_MS) {
      localStorage.removeItem(cacheKey);
      return null;
    }
    return { mbid: parsed.mbid, frontUrl: parsed.frontUrl, backUrl: parsed.backUrl };
  } catch {
    return null;
  }
}

function writeCache(cacheKey: string, result: CoverArtResult): void {
  try {
    const payload: CachedCoverArt = { ...result, cachedAt: Date.now() };
    localStorage.setItem(cacheKey, JSON.stringify(payload));
  } catch {
    // storage cheio/indisponível: segue sem cache
  }
}

/**
 * Busca o release correspondente no MusicBrainz e retorna as URLs de alta
 * resolução da capa (frente e verso) no Cover Art Archive.
 * Retorna null quando o álbum não possui artwork cadastrado.
 */
export async function findAlbumCoverArt(
  albumTitle: string,
  artistName: string
): Promise<CoverArtResult | null> {
  const cacheKey = buildCacheKey(albumTitle, artistName);

  const cached = readCache(cacheKey);
  if (cached) return cached;

  const luceneQuery = `release:"${albumTitle}" AND artist:"${artistName}"`;
  const response = await fetch(
    `${MB_RELEASE_SEARCH}?query=${encodeURIComponent(luceneQuery)}&fmt=json&limit=10`
  );

  if (!response.ok) {
    throw new Error(`MusicBrainz respondeu ${response.status}`);
  }

  const data = await response.json();
  const releases: any[] = data?.releases ?? [];

  const withArtwork = releases.find(
    (release) => release['cover-art-archive']?.artwork === true
  );

  if (!withArtwork) return null;

  const caa = withArtwork['cover-art-archive'];
  const result: CoverArtResult = {
    mbid: withArtwork.id,
    frontUrl: `${CAA_BASE}/${withArtwork.id}/front-1200`,
    backUrl: caa.back ? `${CAA_BASE}/${withArtwork.id}/back` : null,
  };

  writeCache(cacheKey, result);
  return result;
}
