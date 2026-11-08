const MB_RELEASE_SEARCH = '/api/musicbrainz/release';
const CAA_RELEASE_BASE = 'https://coverartarchive.org/release';
const CAA_RELEASE_GROUP_BASE = 'https://coverartarchive.org/release-group';
const CACHE_PREFIX = 'musicpostr_coverart_v2_';
const CACHE_TTL_MS = 1000 * 60 * 60 * 24 * 7; // 7 dias
const NEGATIVE_CACHE_TTL_MS = 1000 * 60 * 60 * 24; // 1 dia para álbuns sem capa no CAA

export const DEFAULT_ALBUM_COVER =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400">
      <defs>
        <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#18181b"/>
          <stop offset="50%" stop-color="#27272a"/>
          <stop offset="100%" stop-color="#09090b"/>
        </linearGradient>
        <radialGradient id="vinyl" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#3f3f46"/>
          <stop offset="30%" stop-color="#18181b"/>
          <stop offset="65%" stop-color="#27272a"/>
          <stop offset="100%" stop-color="#09090b"/>
        </radialGradient>
      </defs>
      <rect width="400" height="400" fill="url(#bg)"/>
      <circle cx="200" cy="200" r="135" fill="url(#vinyl)" stroke="#3f3f46" stroke-width="2"/>
      <circle cx="200" cy="200" r="95" fill="none" stroke="#27272a" stroke-width="1.5"/>
      <circle cx="200" cy="200" r="65" fill="none" stroke="#27272a" stroke-width="1.5"/>
      <circle cx="200" cy="200" r="38" fill="#7c3aed" opacity="0.85"/>
      <circle cx="200" cy="200" r="12" fill="#09090b"/>
    </svg>`
  );

export const DEFAULT_ARTIST_IMAGE =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400">
      <defs>
        <linearGradient id="abg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#1e1b4b"/>
          <stop offset="50%" stop-color="#18181b"/>
          <stop offset="100%" stop-color="#09090b"/>
        </linearGradient>
      </defs>
      <rect width="400" height="400" fill="url(#abg)"/>
      <circle cx="200" cy="155" r="56" fill="#52525b"/>
      <path d="M96 340c0-57.4 46.6-104 104-104s104 46.6 104 104" fill="#52525b"/>
    </svg>`
  );

export interface CoverArtResult {
  mbid: string;
  entityType?: 'release' | 'release-group';
  frontUrl: string;
  frontMediumUrl?: string;
  frontSmallUrl?: string;
  backUrl: string | null;
}

interface CachedCoverArt {
  result: CoverArtResult | null;
  cachedAt: number;
}

export function getReleaseGroupCoverUrl(
  releaseGroupMbid: string,
  size: '250' | '500' | '1200' = '500'
): string {
  if (!releaseGroupMbid) return DEFAULT_ALBUM_COVER;
  return `${CAA_RELEASE_GROUP_BASE}/${releaseGroupMbid}/front-${size}`;
}

export function getReleaseCoverUrl(
  releaseMbid: string,
  size: '250' | '500' | '1200' = '500'
): string {
  if (!releaseMbid) return DEFAULT_ALBUM_COVER;
  return `${CAA_RELEASE_BASE}/${releaseMbid}/front-${size}`;
}

export function handleCoverImageError(e: React.SyntheticEvent<HTMLImageElement, Event>): void {
  const target = e.currentTarget;
  if (target.src !== DEFAULT_ALBUM_COVER) {
    target.src = DEFAULT_ALBUM_COVER;
  }
}

function buildCacheKey(albumTitle: string, artistName: string, mbid?: string): string {
  if (mbid) {
    return `${CACHE_PREFIX}mbid::${mbid.toLowerCase().trim()}`;
  }
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

async function fetchCaaJson(url: string): Promise<any | null> {
  try {
    const res = await fetch(url, {
      headers: { Accept: 'application/json' },
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

function parseCaaImages(
  data: any,
  mbid: string,
  entityType: 'release' | 'release-group'
): CoverArtResult | null {
  if (!data || !Array.isArray(data.images) || data.images.length === 0) {
    return null;
  }

  const frontImg = data.images.find((img: any) => img.front) || data.images[0];
  const backImg = data.images.find((img: any) => img.back);

  if (!frontImg) return null;

  const frontUrl =
    frontImg.thumbnails?.['1200'] ||
    frontImg.thumbnails?.large ||
    frontImg.image ||
    `${entityType === 'release-group' ? CAA_RELEASE_GROUP_BASE : CAA_RELEASE_BASE}/${mbid}/front-1200`;

  const frontMediumUrl =
    frontImg.thumbnails?.['500'] ||
    frontImg.thumbnails?.large ||
    frontImg.image;

  const frontSmallUrl =
    frontImg.thumbnails?.['250'] ||
    frontImg.thumbnails?.small ||
    frontMediumUrl;

  const backUrl = backImg
    ? backImg.thumbnails?.['1200'] ||
      backImg.thumbnails?.large ||
      backImg.image ||
      `${CAA_RELEASE_BASE}/${mbid}/back`
    : null;

  return {
    mbid,
    entityType,
    frontUrl,
    frontMediumUrl,
    frontSmallUrl,
    backUrl,
  };
}

/**
 * Busca a capa frontal e traseira (alta resolução) no Cover Art Archive
 * usando o MBID (release-group ou release) ou buscando por título + artista no MusicBrainz.
 */
export async function findAlbumCoverArt(
  albumTitle: string,
  artistName: string,
  mbid?: string,
  releaseId?: string
): Promise<CoverArtResult | null> {
  const cacheKey = buildCacheKey(albumTitle, artistName, mbid || releaseId);

  const cached = readCache(cacheKey);
  if (cached.found) return cached.result;

  // 1. Se tivermos um releaseId específico, tentamos direto no Cover Art Archive (que tem frente e verso)
  if (releaseId) {
    const releaseData = await fetchCaaJson(`${CAA_RELEASE_BASE}/${releaseId}`);
    const parsedRelease = parseCaaImages(releaseData, releaseId, 'release');
    if (parsedRelease) {
      writeCache(cacheKey, parsedRelease);
      return parsedRelease;
    }
  }

  // 2. Se tivermos o MBID (release-group ou release), consultamos o Cover Art Archive diretamente
  if (mbid) {
    const rgData = await fetchCaaJson(`${CAA_RELEASE_GROUP_BASE}/${mbid}`);
    const parsedRg = parseCaaImages(rgData, mbid, 'release-group');

    // Se encontrou no release-group, mas ainda não tem verso (backUrl), tenta ver se o release do CAA tem verso
    if (parsedRg) {
      if (!parsedRg.backUrl && rgData?.release) {
        const linkedReleaseId = String(rgData.release).split('/').pop();
        if (linkedReleaseId) {
          const relData = await fetchCaaJson(`${CAA_RELEASE_BASE}/${linkedReleaseId}`);
          const parsedRel = parseCaaImages(relData, linkedReleaseId, 'release');
          if (parsedRel?.backUrl) {
            parsedRg.backUrl = parsedRel.backUrl;
            parsedRg.mbid = linkedReleaseId;
            parsedRg.entityType = 'release';
          }
        }
      }
      writeCache(cacheKey, parsedRg);
      return parsedRg;
    }

    // Talvez o mbid passado já seja um release MBID
    const relData = await fetchCaaJson(`${CAA_RELEASE_BASE}/${mbid}`);
    const parsedRel = parseCaaImages(relData, mbid, 'release');
    if (parsedRel) {
      writeCache(cacheKey, parsedRel);
      return parsedRel;
    }
  }

  // 3. Fallback: busca por título e artista no MusicBrainz
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

    // Prioriza um release que tenha frente e verso, ou pelo menos artwork
    const withFrontAndBack = releases.find(
      (release) =>
        release['cover-art-archive']?.artwork === true &&
        release['cover-art-archive']?.back === true
    );
    const withArtwork =
      withFrontAndBack ||
      releases.find((release) => release['cover-art-archive']?.artwork === true);

    if (!withArtwork) {
      writeCache(cacheKey, null);
      return null;
    }

    const caa = withArtwork['cover-art-archive'];
    const result: CoverArtResult = {
      mbid: withArtwork.id,
      entityType: 'release',
      frontUrl: `${CAA_RELEASE_BASE}/${withArtwork.id}/front-1200`,
      frontMediumUrl: `${CAA_RELEASE_BASE}/${withArtwork.id}/front-500`,
      frontSmallUrl: `${CAA_RELEASE_BASE}/${withArtwork.id}/front-250`,
      backUrl: caa.back ? `${CAA_RELEASE_BASE}/${withArtwork.id}/back` : null,
    };

    writeCache(cacheKey, result);
    return result;
  } catch {
    return null;
  }
}
