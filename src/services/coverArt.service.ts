const MB_RELEASE_SEARCH = '/api/musicbrainz/release';
const CAA_BASE = 'https://coverartarchive.org/release';
const CACHE_PREFIX = 'musicpostr_coverart_';
const CACHE_TTL_MS = 1000 * 60 * 60 * 24 * 7; // 7 dias
const NEGATIVE_CACHE_TTL_MS = 1000 * 60 * 60 * 24; // 1 dia para álbuns sem capa no CAA

export interface CoverArtResult {
  mbid: string;
  frontUrl: string;
  backUrl: string | null;
}

interface CachedCoverArt {
  result: CoverArtResult | null;
  cachedAt: number;
}

function buildCacheKey(albumTitle: string, artistName: string): string {
  return `${CACHE_PREFIX}${artistName}::${albumTitle}`
    .toLowerCase()
    .trim();
}

function readCache(cacheKey: string): { found: boolean; result: CoverArtResult | null } {
  try {
    const raw = localStorage.getItem(cacheKey);
    if (!raw) return { found: false, result: null };
    const parsed = JSON.parse(raw) as CachedCoverArt;
    const ttl = parsed.result ? CACHE_TTL_MS : NEGATIVE_CACHE_TTL_MS;
    if (Date.now() - parsed.cachedAt > ttl) {
      localStorage.removeItem(cacheKey);
      return { found: false, result: null };
    }
    return { found: true, result: parsed.result };
  } catch {
    return { found: false, result: null };
  }
}

function writeCache(cacheKey: string, result: CoverArtResult | null): void {
  try {
    const payload: CachedCoverArt = { result, cachedAt: Date.now() };
    localStorage.setItem(cacheKey, JSON.stringify(payload));
  } catch {
    // storage cheio/indisponível: segue sem cache
  }
}

function sanitizeLucene(str: string): string {
  return str.replace(/["\\/()[\]{}~*?:!^&|+-]/g, ' ').replace(/\s+/g, ' ').trim();
}

/**
 * Busca o release correspondente no MusicBrainz e retorna as URLs de alta
 * resolução da capa (frente e verso) no Cover Art Archive.
 * Retorna null quando o álbum não possui artwork cadastrado ou quando o serviço estiver ocupado.
 */
export async function findAlbumCoverArt(
  albumTitle: string,
  artistName: string
): Promise<CoverArtResult | null> {
  const cacheKey = buildCacheKey(albumTitle, artistName);

  const cached = readCache(cacheKey);
  if (cached.found) return cached.result;

  const cleanTitle = sanitizeLucene(albumTitle);
  const cleanArtist = sanitizeLucene(artistName);

  if (!cleanTitle && !cleanArtist) return null;

  try {
    const luceneQuery = cleanArtist
      ? `release:(${cleanTitle}) AND artist:(${cleanArtist})`
      : `release:(${cleanTitle})`;

    const response = await fetch(
      `${MB_RELEASE_SEARCH}?query=${encodeURIComponent(luceneQuery)}&fmt=json&limit=10`
    );

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    const releases: any[] = data?.releases ?? [];

    const withArtwork = releases.find(
      (release) => release['cover-art-archive']?.artwork === true
    );

    if (!withArtwork) {
      writeCache(cacheKey, null);
      return null;
    }

    const caa = withArtwork['cover-art-archive'];
    const result: CoverArtResult = {
      mbid: withArtwork.id,
      frontUrl: `${CAA_BASE}/${withArtwork.id}/front-1200`,
      backUrl: caa.back ? `${CAA_BASE}/${withArtwork.id}/back` : null,
    };

    writeCache(cacheKey, result);
    return result;
  } catch {
    return null;
  }
}
