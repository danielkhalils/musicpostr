import {
  getReleaseGroupCoverUrl,
  getReleaseCoverUrl,
  DEFAULT_ALBUM_COVER,
  DEFAULT_ARTIST_IMAGE,
} from './coverArt.service';

const MB_API_BASE = '/api/musicbrainz';

const STORAGE_KEYS = {
  ALBUM_STATS: 'musicpostr_internal_albums_v2',
  MY_REVIEWS: 'musicpostr_my_reviews_v2',
  FAVORITES: 'musicpostr_favorites_v2',
  FEED: 'musicpostr_community_feed_v2',
  API_CACHE_PREFIX: 'musicpostr_mb_cache_v2_',
};

const API_CACHE_TTL = 1000 * 60 * 60 * 6; // 6 horas

export interface CatalogTrack {
  id: string;
  title: string;
  duration: number; // segundos
  artist: {
    id?: string;
    name: string;
  };
  album: {
    id: string;
    title: string;
    cover_medium: string;
    cover_big?: string;
  };
}

export interface AlbumUserReview {
  id: string | number;
  user: string;
  username?: string;
  avatar?: string;
  comment: string;
  rating: number;
  date?: string;
}

export interface CatalogAlbum {
  id: string; // MBID (release-group ou release)
  releaseId?: string; // MBID de um release específico (para faixas/verso da capa)
  title: string;
  cover_xl: string;
  cover_big: string;
  cover_medium: string;
  release_date: string;
  record_type: 'album' | 'ep' | 'single';
  genreName: string;
  label: string;
  artist: {
    id: string;
    name: string;
  };
  communityRating: number;
  totalReviews: number;
  listenersCount: number;
  listenedByMe?: boolean;
  isFavorite?: boolean;
  reviews?: AlbumUserReview[];
  tracks?: {
    data: {
      id: string;
      title: string;
      duration: number;
    }[];
  };
}

export interface CatalogArtist {
  id: string; // Artist MBID
  name: string;
  imageUrl: string;
  genre: string;
  country?: string;
  nbFans: number; // Ouvintes/seguidores na comunidade
  type?: string;
}

export interface FeedPostItem {
  id: string;
  friendName: string;
  friendUsername: string;
  friendAvatar: string;
  albumTitle: string;
  artistName: string;
  albumCover: string;
  albumId: string;
  rating: number;
  comment: string;
  timeAgo: string;
  likesCount: number;
  isLiked: boolean;
  comments: {
    id: string;
    author: string;
    avatar: string;
    text: string;
    time: string;
  }[];
}

export interface MyReviewRecord {
  id: string;
  albumId: string;
  albumTitle: string;
  artistName: string;
  coverUrl: string;
  rating: number;
  comment: string;
  date: string;
}

function makeAlbumSeed(
  id: string,
  title: string,
  artistId: string,
  artistName: string,
  release_date: string,
  genreName: string,
  label: string,
  communityRating: number,
  totalReviews: number,
  listenersCount: number,
  record_type: 'album' | 'ep' | 'single' = 'album',
  customReviews?: AlbumUserReview[]
): CatalogAlbum {
  const defaultReviews: AlbumUserReview[] = customReviews || [
    {
      id: `${id}-rev-1`,
      user: 'AnaBeat',
      username: 'anabeat',
      comment: `Produção impecável de ${artistName}. Um dos trabalhos mais marcantes de ${genreName}.`,
      rating: Math.min(10, Math.round(communityRating)),
      date: 'Recente',
    },
    {
      id: `${id}-rev-2`,
      user: 'LucasSound',
      username: 'lucas_snd',
      comment: 'Arranjos criativos e uma coesão sonora que prende do início ao fim.',
      rating: Math.max(7, Math.min(10, Math.round(communityRating - 0.3))),
      date: 'Há 3 dias',
    },
    {
      id: `${id}-rev-3`,
      user: 'BeatCritic',
      username: 'beatcritic',
      comment: 'Referência absoluta dentro do gênero. Vale cada segundo de audição!',
      rating: Math.min(10, Math.round(communityRating + 0.2)),
      date: 'Há 1 semana',
    },
  ];

  return {
    id,
    title,
    cover_xl: getReleaseGroupCoverUrl(id, '1200'),
    cover_big: getReleaseGroupCoverUrl(id, '500'),
    cover_medium: getReleaseGroupCoverUrl(id, '500'),
    release_date,
    record_type,
    genreName,
    label,
    artist: {
      id: artistId,
      name: artistName,
    },
    communityRating,
    totalReviews,
    listenersCount,
    reviews: defaultReviews,
  };
}

/**
 * Catálogo inicial com MBIDs reais do MusicBrainz e capas do Cover Art Archive,
 * contendo avaliações internas dos usuários e contagem de ouvintes.
 */
const INITIAL_INTERNAL_ALBUMS: CatalogAlbum[] = [
  makeAlbumSeed(
    '02a544b3-0459-42c7-bd9c-047162e7b67a',
    'HIT ME HARD AND SOFT',
    'f4abc0b5-3f7a-4eff-8f78-ac078dbce533',
    'Billie Eilish',
    '2024-05-17',
    'Pop',
    'Darkroom / Interscope',
    9.5,
    184,
    3420
  ),
  makeAlbumSeed(
    'e0fdb431-0109-420d-8a37-f99eaeb4d671',
    'BRAT',
    '260b6184-8828-48eb-945c-bc4cb6fc34ca',
    'Charli xcx',
    '2024-06-07',
    'Eletrônica',
    'Atlantic Records',
    9.4,
    172,
    3190
  ),
  makeAlbumSeed(
    '32cb822c-a14e-49ce-a169-f209c5f31e0f',
    'GNX',
    '381086ea-f511-4aba-bdf9-71c753dc5077',
    'Kendrick Lamar',
    '2024-11-22',
    'Hip-Hop',
    'pgLang / Interscope',
    9.6,
    195,
    3580
  ),
  makeAlbumSeed(
    '78570bea-2a26-467c-a3db-c52723ceb394',
    'After Hours',
    'c8b03190-306c-4120-bb0b-6f2ebfc06ea9',
    'The Weeknd',
    '2020-03-20',
    'R&B',
    'XO / Republic',
    9.3,
    168,
    3110
  ),
  makeAlbumSeed(
    'aa997ea0-2936-40bd-884d-3af8a0e064dc',
    'Random Access Memories',
    '056e4f3e-d505-4dad-8ec1-d04f521cbb56',
    'Daft Punk',
    '2013-05-17',
    'Eletrônica',
    'Columbia Records',
    9.8,
    240,
    4120
  ),
  makeAlbumSeed(
    'f5093c06-23e3-404f-aeaa-40f72885ee3a',
    'The Dark Side of the Moon',
    '83d91898-7763-47d7-b03b-b92132375c47',
    'Pink Floyd',
    '1973-03-24',
    'Rock',
    'Harvest / EMI',
    9.9,
    265,
    4390
  ),
  makeAlbumSeed(
    'd9103c72-3807-4378-9ce7-b6f3e8fdd547',
    'To Pimp a Butterfly',
    '381086ea-f511-4aba-bdf9-71c753dc5077',
    'Kendrick Lamar',
    '2015-03-15',
    'Hip-Hop',
    'Top Dawg / Aftermath',
    9.9,
    252,
    3890
  ),
  makeAlbumSeed(
    'b1392450-e666-3926-a536-22c65f834433',
    'OK Computer',
    'a74b1b7f-71a5-4011-9441-d0b5e4122711',
    'Radiohead',
    '1997-05-21',
    'Rock',
    'Parlophone / XL',
    9.8,
    230,
    3670
  ),
  makeAlbumSeed(
    '0da340a0-6ad7-4fc2-a272-6f94393a7831',
    'Blonde',
    'e520459c-dff4-491d-a6e4-c97be35e0044',
    'Frank Ocean',
    '2016-08-20',
    'R&B',
    'Boys Don’t Cry',
    9.7,
    218,
    3540
  ),
  makeAlbumSeed(
    '1646286a-d0ad-4288-bfab-34b0fb7b22c1',
    'SOS',
    '272989c8-5535-492d-a25c-9f58803e027f',
    'SZA',
    '2022-12-09',
    'R&B',
    'Top Dawg / RCA',
    9.2,
    154,
    2890
  ),
  makeAlbumSeed(
    '2c385052-5083-43a2-b1e5-36566d2ae3c0',
    'RENAISSANCE',
    '859d0860-d480-4efd-970c-c05d5f1776b8',
    'Beyoncé',
    '2022-07-29',
    'Pop',
    'Parkwood / Columbia',
    9.4,
    162,
    2950
  ),
  makeAlbumSeed(
    '37cfca48-dabb-48b9-8a76-0ea08a965eb9',
    'Future Nostalgia',
    '6f1a58bf-9b1b-49cf-a44a-6cefad7ae04f',
    'Dua Lipa',
    '2020-03-27',
    'Pop',
    'Warner Records',
    9.1,
    149,
    2840
  ),
  makeAlbumSeed(
    '08aa7a6c-3e43-4459-87b2-e47faf3a088a',
    'Currents',
    '63aa26c3-d59b-4da4-84ac-716b54f1ef4d',
    'Tame Impala',
    '2015-07-17',
    'Indie',
    'Modular / Interscope',
    9.6,
    190,
    3320
  ),
  makeAlbumSeed(
    'a348ba2f-f8b3-4686-b928-e63d8d94d543',
    'AM',
    'ada7a83c-e3e1-40f1-93f9-3e73dbc9298a',
    'Arctic Monkeys',
    '2013-09-09',
    'Indie',
    'Domino Recording Co.',
    9.2,
    176,
    3280
  ),
  makeAlbumSeed(
    '0f1b9e07-b38b-4bba-9794-55e0924d7177',
    'IGOR',
    'f6beac20-5dfe-4d1f-ae02-0b0a740aafd6',
    'Tyler, The Creator',
    '2019-05-17',
    'Hip-Hop',
    'Columbia Records',
    9.5,
    181,
    3150
  ),
  makeAlbumSeed(
    '0dcc84fb-c592-46e9-ba92-a52bb44dd553',
    'Midnights',
    '20244d07-534f-4eff-b4d4-930878889970',
    'Taylor Swift',
    '2022-10-21',
    'Pop',
    'Republic Records',
    8.9,
    160,
    3050
  ),
  makeAlbumSeed(
    '2ae2e504-7116-4b4f-b632-9748bb18ccd2',
    'SOUR',
    '6925db17-f35e-42f3-a4eb-84ee6bf5d4b0',
    'Olivia Rodrigo',
    '2021-05-21',
    'Pop',
    'Geffen Records',
    9.0,
    142,
    2760
  ),
  makeAlbumSeed(
    'e992b449-141b-4aea-b07b-9b2a478a8570',
    'Un verano sin ti',
    '89aa5ecb-59ad-46f5-b3eb-2d424e941f19',
    'Bad Bunny',
    '2022-05-06',
    'Pop',
    'Rimas Entertainment',
    9.1,
    138,
    2910
  ),
  makeAlbumSeed(
    'c8bea388-c195-4177-bf9b-7469f6e695a1',
    'Short n’ Sweet',
    '1882fe91-cdd9-49c9-9956-8e06a3810bd4',
    'Sabrina Carpenter',
    '2024-08-23',
    'Pop',
    'Island Records',
    8.8,
    126,
    2540
  ),
  makeAlbumSeed(
    '155bd1f1-0570-41f3-a38c-0dd81373a5b6',
    'Construção',
    '3a5d1cc7-627e-48ea-aba3-fdd20d782c33',
    'Chico Buarque',
    '1971-12-01',
    'Samba e pagode',
    'Philips / MPB',
    9.8,
    164,
    2620
  ),
  makeAlbumSeed(
    '65790705-6d7b-3596-a427-fe5b8ab6481d',
    'Acabou chorare',
    '7b543eba-995a-4c30-a37e-f8cac424f167',
    'Novos Baianos',
    '1972-01-01',
    'Samba e pagode',
    'Som Livre',
    9.7,
    150,
    2480
  ),
];

export const FEATURED_ARTISTS: CatalogArtist[] = [
  {
    id: 'f4abc0b5-3f7a-4eff-8f78-ac078dbce533',
    name: 'Billie Eilish',
    imageUrl: getReleaseGroupCoverUrl('02a544b3-0459-42c7-bd9c-047162e7b67a', '500'),
    genre: 'Pop / Alt-Pop',
    country: 'US',
    nbFans: 3420,
    type: 'Person',
  },
  {
    id: '381086ea-f511-4aba-bdf9-71c753dc5077',
    name: 'Kendrick Lamar',
    imageUrl: getReleaseGroupCoverUrl('32cb822c-a14e-49ce-a169-f209c5f31e0f', '500'),
    genre: 'Hip-Hop / Rap',
    country: 'US',
    nbFans: 3890,
    type: 'Person',
  },
  {
    id: 'c8b03190-306c-4120-bb0b-6f2ebfc06ea9',
    name: 'The Weeknd',
    imageUrl: getReleaseGroupCoverUrl('78570bea-2a26-467c-a3db-c52723ceb394', '500'),
    genre: 'R&B / Synthpop',
    country: 'CA',
    nbFans: 3110,
    type: 'Person',
  },
  {
    id: '056e4f3e-d505-4dad-8ec1-d04f521cbb56',
    name: 'Daft Punk',
    imageUrl: getReleaseGroupCoverUrl('aa997ea0-2936-40bd-884d-3af8a0e064dc', '500'),
    genre: 'Eletrônica / French House',
    country: 'FR',
    nbFans: 4120,
    type: 'Group',
  },
  {
    id: '83d91898-7763-47d7-b03b-b92132375c47',
    name: 'Pink Floyd',
    imageUrl: getReleaseGroupCoverUrl('f5093c06-23e3-404f-aeaa-40f72885ee3a', '500'),
    genre: 'Progressive Rock',
    country: 'GB',
    nbFans: 4390,
    type: 'Group',
  },
  {
    id: '260b6184-8828-48eb-945c-bc4cb6fc34ca',
    name: 'Charli xcx',
    imageUrl: getReleaseGroupCoverUrl('e0fdb431-0109-420d-8a37-f99eaeb4d671', '500'),
    genre: 'Hyperpop / Eletrônica',
    country: 'GB',
    nbFans: 3190,
    type: 'Person',
  },
  {
    id: '859d0860-d480-4efd-970c-c05d5f1776b8',
    name: 'Beyoncé',
    imageUrl: getReleaseGroupCoverUrl('2c385052-5083-43a2-b1e5-36566d2ae3c0', '500'),
    genre: 'Pop / R&B',
    country: 'US',
    nbFans: 2950,
    type: 'Person',
  },
  {
    id: '272989c8-5535-492d-a25c-9f58803e027f',
    name: 'SZA',
    imageUrl: getReleaseGroupCoverUrl('1646286a-d0ad-4288-bfab-34b0fb7b22c1', '500'),
    genre: 'R&B / Neo-Soul',
    country: 'US',
    nbFans: 2890,
    type: 'Person',
  },
  {
    id: 'a74b1b7f-71a5-4011-9441-d0b5e4122711',
    name: 'Radiohead',
    imageUrl: getReleaseGroupCoverUrl('b1392450-e666-3926-a536-22c65f834433', '500'),
    genre: 'Alternative Rock / Art Rock',
    country: 'GB',
    nbFans: 3670,
    type: 'Group',
  },
  {
    id: 'e520459c-dff4-491d-a6e4-c97be35e0044',
    name: 'Frank Ocean',
    imageUrl: getReleaseGroupCoverUrl('0da340a0-6ad7-4fc2-a272-6f94393a7831', '500'),
    genre: 'R&B / Alternative R&B',
    country: 'US',
    nbFans: 3540,
    type: 'Person',
  },
  {
    id: '63aa26c3-d59b-4da4-84ac-716b54f1ef4d',
    name: 'Tame Impala',
    imageUrl: getReleaseGroupCoverUrl('08aa7a6c-3e43-4459-87b2-e47faf3a088a', '500'),
    genre: 'Indie / Psychedelic Pop',
    country: 'AU',
    nbFans: 3320,
    type: 'Person',
  },
  {
    id: 'ada7a83c-e3e1-40f1-93f9-3e73dbc9298a',
    name: 'Arctic Monkeys',
    imageUrl: getReleaseGroupCoverUrl('a348ba2f-f8b3-4686-b928-e63d8d94d543', '500'),
    genre: 'Indie Rock',
    country: 'GB',
    nbFans: 3280,
    type: 'Group',
  },
  {
    id: '6f1a58bf-9b1b-49cf-a44a-6cefad7ae04f',
    name: 'Dua Lipa',
    imageUrl: getReleaseGroupCoverUrl('37cfca48-dabb-48b9-8a76-0ea08a965eb9', '500'),
    genre: 'Pop / Dance-Pop',
    country: 'GB',
    nbFans: 2840,
    type: 'Person',
  },
  {
    id: 'f6beac20-5dfe-4d1f-ae02-0b0a740aafd6',
    name: 'Tyler, The Creator',
    imageUrl: getReleaseGroupCoverUrl('0f1b9e07-b38b-4bba-9794-55e0924d7177', '500'),
    genre: 'Hip-Hop / Neo-Soul',
    country: 'US',
    nbFans: 3150,
    type: 'Person',
  },
  {
    id: '20244d07-534f-4eff-b4d4-930878889970',
    name: 'Taylor Swift',
    imageUrl: getReleaseGroupCoverUrl('0dcc84fb-c592-46e9-ba92-a52bb44dd553', '500'),
    genre: 'Pop / Synthpop',
    country: 'US',
    nbFans: 3050,
    type: 'Person',
  },
  {
    id: '6925db17-f35e-42f3-a4eb-84ee6bf5d4b0',
    name: 'Olivia Rodrigo',
    imageUrl: getReleaseGroupCoverUrl('2ae2e504-7116-4b4f-b632-9748bb18ccd2', '500'),
    genre: 'Pop / Pop-Rock',
    country: 'US',
    nbFans: 2760,
    type: 'Person',
  },
  {
    id: '89aa5ecb-59ad-46f5-b3eb-2d424e941f19',
    name: 'Bad Bunny',
    imageUrl: getReleaseGroupCoverUrl('e992b449-141b-4aea-b07b-9b2a478a8570', '500'),
    genre: 'Urbano / Reggaeton',
    country: 'PR',
    nbFans: 2910,
    type: 'Person',
  },
  {
    id: '1882fe91-cdd9-49c9-9956-8e06a3810bd4',
    name: 'Sabrina Carpenter',
    imageUrl: getReleaseGroupCoverUrl('c8bea388-c195-4177-bf9b-7469f6e695a1', '500'),
    genre: 'Pop',
    country: 'US',
    nbFans: 2540,
    type: 'Person',
  },
];

export const INITIAL_TOP_TRACKS: CatalogTrack[] = [
  {
    id: 'track-birds-of-a-feather',
    title: 'BIRDS OF A FEATHER',
    duration: 210,
    artist: { id: 'f4abc0b5-3f7a-4eff-8f78-ac078dbce533', name: 'Billie Eilish' },
    album: {
      id: '02a544b3-0459-42c7-bd9c-047162e7b67a',
      title: 'HIT ME HARD AND SOFT',
      cover_medium: getReleaseGroupCoverUrl('02a544b3-0459-42c7-bd9c-047162e7b67a', '250'),
    },
  },
  {
    id: 'track-360-brat',
    title: '360',
    duration: 133,
    artist: { id: '260b6184-8828-48eb-945c-bc4cb6fc34ca', name: 'Charli xcx' },
    album: {
      id: 'e0fdb431-0109-420d-8a37-f99eaeb4d671',
      title: 'BRAT',
      cover_medium: getReleaseGroupCoverUrl('e0fdb431-0109-420d-8a37-f99eaeb4d671', '250'),
    },
  },
  {
    id: 'track-luther-gnx',
    title: 'luther',
    duration: 177,
    artist: { id: '381086ea-f511-4aba-bdf9-71c753dc5077', name: 'Kendrick Lamar & SZA' },
    album: {
      id: '32cb822c-a14e-49ce-a169-f209c5f31e0f',
      title: 'GNX',
      cover_medium: getReleaseGroupCoverUrl('32cb822c-a14e-49ce-a169-f209c5f31e0f', '250'),
    },
  },
  {
    id: 'track-blinding-lights',
    title: 'Blinding Lights',
    duration: 200,
    artist: { id: 'c8b03190-306c-4120-bb0b-6f2ebfc06ea9', name: 'The Weeknd' },
    album: {
      id: '78570bea-2a26-467c-a3db-c52723ceb394',
      title: 'After Hours',
      cover_medium: getReleaseGroupCoverUrl('78570bea-2a26-467c-a3db-c52723ceb394', '250'),
    },
  },
  {
    id: 'track-instant-crush',
    title: 'Instant Crush',
    duration: 337,
    artist: { id: '056e4f3e-d505-4dad-8ec1-d04f521cbb56', name: 'Daft Punk' },
    album: {
      id: 'aa997ea0-2936-40bd-884d-3af8a0e064dc',
      title: 'Random Access Memories',
      cover_medium: getReleaseGroupCoverUrl('aa997ea0-2936-40bd-884d-3af8a0e064dc', '250'),
    },
  },
  {
    id: 'track-kill-bill',
    title: 'Kill Bill',
    duration: 153,
    artist: { id: '272989c8-5535-492d-a25c-9f58803e027f', name: 'SZA' },
    album: {
      id: '1646286a-d0ad-4288-bfab-34b0fb7b22c1',
      title: 'SOS',
      cover_medium: getReleaseGroupCoverUrl('1646286a-d0ad-4288-bfab-34b0fb7b22c1', '250'),
    },
  },
  {
    id: 'track-cuff-it',
    title: 'CUFF IT',
    duration: 225,
    artist: { id: '859d0860-d480-4efd-970c-c05d5f1776b8', name: 'Beyoncé' },
    album: {
      id: '2c385052-5083-43a2-b1e5-36566d2ae3c0',
      title: 'RENAISSANCE',
      cover_medium: getReleaseGroupCoverUrl('2c385052-5083-43a2-b1e5-36566d2ae3c0', '250'),
    },
  },
  {
    id: 'track-let-it-happen',
    title: 'Let It Happen',
    duration: 467,
    artist: { id: '63aa26c3-d59b-4da4-84ac-716b54f1ef4d', name: 'Tame Impala' },
    album: {
      id: '08aa7a6c-3e43-4459-87b2-e47faf3a088a',
      title: 'Currents',
      cover_medium: getReleaseGroupCoverUrl('08aa7a6c-3e43-4459-87b2-e47faf3a088a', '250'),
    },
  },
  {
    id: 'track-levitating',
    title: 'Levitating',
    duration: 203,
    artist: { id: '6f1a58bf-9b1b-49cf-a44a-6cefad7ae04f', name: 'Dua Lipa' },
    album: {
      id: '37cfca48-dabb-48b9-8a76-0ea08a965eb9',
      title: 'Future Nostalgia',
      cover_medium: getReleaseGroupCoverUrl('37cfca48-dabb-48b9-8a76-0ea08a965eb9', '250'),
    },
  },
  {
    id: 'track-nights-blonde',
    title: 'Nights',
    duration: 307,
    artist: { id: 'e520459c-dff4-491d-a6e4-c97be35e0044', name: 'Frank Ocean' },
    album: {
      id: '0da340a0-6ad7-4fc2-a272-6f94393a7831',
      title: 'Blonde',
      cover_medium: getReleaseGroupCoverUrl('0da340a0-6ad7-4fc2-a272-6f94393a7831', '250'),
    },
  },
  {
    id: 'track-earfquake',
    title: 'EARFQUAKE',
    duration: 190,
    artist: { id: 'f6beac20-5dfe-4d1f-ae02-0b0a740aafd6', name: 'Tyler, The Creator' },
    album: {
      id: '0f1b9e07-b38b-4bba-9794-55e0924d7177',
      title: 'IGOR',
      cover_medium: getReleaseGroupCoverUrl('0f1b9e07-b38b-4bba-9794-55e0924d7177', '250'),
    },
  },
  {
    id: 'track-do-i-wanna-know',
    title: 'Do I Wanna Know?',
    duration: 272,
    artist: { id: 'ada7a83c-e3e1-40f1-93f9-3e73dbc9298a', name: 'Arctic Monkeys' },
    album: {
      id: 'a348ba2f-f8b3-4686-b928-e63d8d94d543',
      title: 'AM',
      cover_medium: getReleaseGroupCoverUrl('a348ba2f-f8b3-4686-b928-e63d8d94d543', '250'),
    },
  },
  {
    id: 'track-espresso',
    title: 'Espresso',
    duration: 175,
    artist: { id: '1882fe91-cdd9-49c9-9956-8e06a3810bd4', name: 'Sabrina Carpenter' },
    album: {
      id: 'c8bea388-c195-4177-bf9b-7469f6e695a1',
      title: 'Short n’ Sweet',
      cover_medium: getReleaseGroupCoverUrl('c8bea388-c195-4177-bf9b-7469f6e695a1', '250'),
    },
  },
  {
    id: 'track-paranoid-android',
    title: 'Paranoid Android',
    duration: 387,
    artist: { id: 'a74b1b7f-71a5-4011-9441-d0b5e4122711', name: 'Radiohead' },
    album: {
      id: 'b1392450-e666-3926-a536-22c65f834433',
      title: 'OK Computer',
      cover_medium: getReleaseGroupCoverUrl('b1392450-e666-3926-a536-22c65f834433', '250'),
    },
  },
  {
    id: 'track-time-pf',
    title: 'Time',
    duration: 413,
    artist: { id: '83d91898-7763-47d7-b03b-b92132375c47', name: 'Pink Floyd' },
    album: {
      id: 'f5093c06-23e3-404f-aeaa-40f72885ee3a',
      title: 'The Dark Side of the Moon',
      cover_medium: getReleaseGroupCoverUrl('f5093c06-23e3-404f-aeaa-40f72885ee3a', '250'),
    },
  },
  {
    id: 'track-chihiro',
    title: 'CHIHIRO',
    duration: 303,
    artist: { id: 'f4abc0b5-3f7a-4eff-8f78-ac078dbce533', name: 'Billie Eilish' },
    album: {
      id: '02a544b3-0459-42c7-bd9c-047162e7b67a',
      title: 'HIT ME HARD AND SOFT',
      cover_medium: getReleaseGroupCoverUrl('02a544b3-0459-42c7-bd9c-047162e7b67a', '250'),
    },
  },
];

// ============================================================================
// GERENCIAMENTO INTERNO DE AVALIAÇÕES, OUVINTES E FAVORITOS (LOCALSTORAGE)
// ============================================================================

export function getInternalAlbumsStore(): CatalogAlbum[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ALBUM_STATS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.ALBUM_STATS, JSON.stringify(INITIAL_INTERNAL_ALBUMS));
      return [...INITIAL_INTERNAL_ALBUMS];
    }
    const parsed = JSON.parse(raw) as CatalogAlbum[];
    if (!Array.isArray(parsed) || parsed.length === 0) {
      localStorage.setItem(STORAGE_KEYS.ALBUM_STATS, JSON.stringify(INITIAL_INTERNAL_ALBUMS));
      return [...INITIAL_INTERNAL_ALBUMS];
    }
    return parsed;
  } catch {
    return [...INITIAL_INTERNAL_ALBUMS];
  }
}

function saveInternalAlbumsStore(albums: CatalogAlbum[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.ALBUM_STATS, JSON.stringify(albums));
    window.dispatchEvent(new CustomEvent('musicpostr:albums-updated'));
  } catch {
    // ignore storage errors
  }
}

/**
 * Retorna os "Álbuns Populares no Momento" baseando-se nas avaliações internas dos usuários
 * e na quantidade de usuários que ouviram cada álbum (listenersCount + totalReviews + communityRating).
 */
export function getPopularAlbumsByInternalActivity(limit = 8): CatalogAlbum[] {
  const store = getInternalAlbumsStore();
  const sorted = [...store].sort((a, b) => {
    // Score composto pela quantidade de usuários que ouviram + volume de avaliações internas + nota média
    const scoreA = a.listenersCount * 1.0 + a.totalReviews * 6 + a.communityRating * 25;
    const scoreB = b.listenersCount * 1.0 + b.totalReviews * 6 + b.communityRating * 25;
    return scoreB - scoreA;
  });
  return sorted.slice(0, limit);
}

/**
 * Retorna os álbuns "Mais Bem Avaliados" baseando-se exclusivamente nas avaliações internas dos usuários.
 */
export function getTopRatedAlbumsByInternalReviews(limit = 8): CatalogAlbum[] {
  const store = getInternalAlbumsStore();
  const sorted = [...store].sort((a, b) => {
    if (b.communityRating !== a.communityRating) {
      return b.communityRating - a.communityRating;
    }
    if (b.totalReviews !== a.totalReviews) {
      return b.totalReviews - a.totalReviews;
    }
    return b.listenersCount - a.listenersCount;
  });
  return sorted.slice(0, limit);
}

export function getHighlightAlbums(limit = 10): CatalogAlbum[] {
  const store = getInternalAlbumsStore();
  const sorted = [...store].sort((a, b) => {
    const scoreA = a.communityRating * 100 + a.listenersCount * 0.1;
    const scoreB = b.communityRating * 100 + b.listenersCount * 0.1;
    return scoreB - scoreA;
  });
  return sorted.slice(0, limit);
}

export function getAlbumInternalData(
  albumId: string,
  fallbackMeta?: Partial<CatalogAlbum>
): CatalogAlbum {
  const store = getInternalAlbumsStore();
  const existing = store.find((a) => a.id === albumId);
  if (existing) return existing;

  // Gera dados iniciais determinísticos caso seja um álbum recém-buscado no MusicBrainz
  let hash = 0;
  for (let i = 0; i < albumId.length; i++) {
    hash = (hash * 31 + albumId.charCodeAt(i)) >>> 0;
  }
  const initialRating = Number((7.8 + (hash % 20) / 10).toFixed(1));
  const initialReviewsCount = 5 + (hash % 25);
  const initialListeners = 45 + (hash % 350);

  return {
    id: albumId,
    title: fallbackMeta?.title || 'Álbum',
    cover_xl: fallbackMeta?.cover_xl || getReleaseGroupCoverUrl(albumId, '1200'),
    cover_big: fallbackMeta?.cover_big || getReleaseGroupCoverUrl(albumId, '500'),
    cover_medium: fallbackMeta?.cover_medium || getReleaseGroupCoverUrl(albumId, '500'),
    release_date: fallbackMeta?.release_date || '2025',
    record_type: fallbackMeta?.record_type || 'album',
    genreName: fallbackMeta?.genreName || 'Pop',
    label: fallbackMeta?.label || 'Independente',
    artist: fallbackMeta?.artist || { id: '', name: 'Artista' },
    communityRating: initialRating > 9.8 ? 9.6 : initialRating,
    totalReviews: initialReviewsCount,
    listenersCount: initialListeners,
    listenedByMe: false,
    isFavorite: false,
    reviews: [
      {
        id: `${albumId}-1`,
        user: 'AnaBeat',
        comment: 'Excelente descoberta no catálogo! Produção e timbres muito bem trabalhados.',
        rating: Math.min(10, Math.round(initialRating)),
      },
      {
        id: `${albumId}-2`,
        user: 'LucasVibes',
        comment: 'Gostei bastante da atmosfera das faixas, vale muito a audição completa.',
        rating: Math.max(7, Math.min(10, Math.round(initialRating - 0.5))),
      },
    ],
  };
}

/**
 * Registra ou alterna que o usuário atual ouviu o álbum, atualizando o contador interno de ouvintes.
 */
export function toggleAlbumListened(album: CatalogAlbum): CatalogAlbum {
  const store = getInternalAlbumsStore();
  const idx = store.findIndex((a) => a.id === album.id);
  const base = idx >= 0 ? store[idx] : getAlbumInternalData(album.id, album);

  const nowListened = !base.listenedByMe;
  const updated: CatalogAlbum = {
    ...base,
    ...album,
    listenedByMe: nowListened,
    listenersCount: Math.max(1, base.listenersCount + (nowListened ? 1 : -1)),
  };

  if (idx >= 0) {
    store[idx] = updated;
  } else {
    store.unshift(updated);
  }
  saveInternalAlbumsStore(store);
  return updated;
}

/**
 * Registra uma nova avaliação interna do usuário para um álbum,
 * recalculando a média interna, total de avaliações e ouvintes.
 */
export function submitInternalAlbumReview(
  album: CatalogAlbum,
  rating: number,
  comment: string,
  userName = 'Ana Beatriz'
): CatalogAlbum {
  const store = getInternalAlbumsStore();
  const idx = store.findIndex((a) => a.id === album.id);
  const base = idx >= 0 ? store[idx] : getAlbumInternalData(album.id, album);

  const cleanRating = Math.max(1, Math.min(10, rating || 8));
  const cleanComment = comment.trim() || 'Avaliação sem comentário escrito.';

  const newReview: AlbumUserReview = {
    id: Date.now(),
    user: userName,
    username: 'anabeat',
    comment: cleanComment,
    rating: cleanRating,
    date: 'Agora mesmo',
  };

  const existingReviews = base.reviews || [];
  const prevTotal = Math.max(existingReviews.length, base.totalReviews);
  const newTotal = prevTotal + 1;
  const newAverage = Number(
    ((base.communityRating * prevTotal + cleanRating) / newTotal).toFixed(1)
  );

  const wasAlreadyListened = Boolean(base.listenedByMe);

  const updated: CatalogAlbum = {
    ...base,
    ...album,
    communityRating: Math.min(10, newAverage),
    totalReviews: newTotal,
    listenersCount: wasAlreadyListened ? base.listenersCount : base.listenersCount + 1,
    listenedByMe: true,
    reviews: [newReview, ...existingReviews],
  };

  if (idx >= 0) {
    store[idx] = updated;
  } else {
    store.unshift(updated);
  }
  saveInternalAlbumsStore(store);

  // Salva também em "Minhas Avaliações"
  addMyReview({
    id: String(newReview.id),
    albumId: updated.id,
    albumTitle: updated.title,
    artistName: updated.artist.name,
    coverUrl: updated.cover_medium || updated.cover_big,
    rating: cleanRating,
    comment: cleanComment,
    date: new Date().toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }),
  });

  // Adiciona ao Feed da Comunidade
  addCommunityFeedPost({
    id: `feed-${Date.now()}`,
    friendName: userName,
    friendUsername: 'anabeat',
    friendAvatar:
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200',
    albumTitle: updated.title,
    artistName: updated.artist.name,
    albumCover: updated.cover_medium || updated.cover_big,
    albumId: updated.id,
    rating: cleanRating,
    comment: cleanComment,
    timeAgo: 'Agora mesmo',
    likesCount: 1,
    isLiked: true,
    comments: [],
  });

  return updated;
}

// ============================================================================
// MINHAS AVALIAÇÕES, FAVORITOS E TIMELINE DA REDE
// ============================================================================

const INITIAL_MY_REVIEWS: MyReviewRecord[] = [
  {
    id: 'my-rev-1',
    albumId: 'af635412-fa88-4624-b33c-bbea72afedd0',
    albumTitle: 'This Is… Icona Pop',
    artistName: 'Icona Pop',
    coverUrl: getReleaseGroupCoverUrl('af635412-fa88-4624-b33c-bbea72afedd0', '500'),
    rating: 10,
    comment: 'Uma obra-prima absoluta de design sonoro e atmosferas.',
    date: '24 de Mai, 2026',
  },
  {
    id: 'my-rev-2',
    albumId: '2ae2e504-7116-4b4f-b632-9748bb18ccd2',
    albumTitle: 'SOUR',
    artistName: 'Olivia Rodrigo',
    coverUrl: getReleaseGroupCoverUrl('2ae2e504-7116-4b4f-b632-9748bb18ccd2', '500'),
    rating: 9,
    comment: 'Letras marcantes e produções impecáveis do início ao fim.',
    date: '18 de Mai, 2026',
  },
];

export function getMyReviews(): MyReviewRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.MY_REVIEWS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.MY_REVIEWS, JSON.stringify(INITIAL_MY_REVIEWS));
      return [...INITIAL_MY_REVIEWS];
    }
    return JSON.parse(raw);
  } catch {
    return [...INITIAL_MY_REVIEWS];
  }
}

export function addMyReview(record: MyReviewRecord): void {
  try {
    const current = getMyReviews();
    const updated = [record, ...current];
    localStorage.setItem(STORAGE_KEYS.MY_REVIEWS, JSON.stringify(updated));
  } catch {
    // ignore
  }
}

export function deleteMyReview(id: string): MyReviewRecord[] {
  const current = getMyReviews().filter((r) => r.id !== id);
  try {
    localStorage.setItem(STORAGE_KEYS.MY_REVIEWS, JSON.stringify(current));
  } catch {
    // ignore
  }
  return current;
}

export interface FavoriteAlbumRecord {
  id: string;
  title: string;
  artist: string;
  cover: string;
  rating: number;
}

const INITIAL_FAVORITES: FavoriteAlbumRecord[] = [
  {
    id: 'f5093c06-23e3-404f-aeaa-40f72885ee3a',
    title: 'The Dark Side of the Moon',
    artist: 'Pink Floyd',
    cover: getReleaseGroupCoverUrl('f5093c06-23e3-404f-aeaa-40f72885ee3a', '500'),
    rating: 9.9,
  },
  {
    id: '78570bea-2a26-467c-a3db-c52723ceb394',
    title: 'After Hours',
    artist: 'The Weeknd',
    cover: getReleaseGroupCoverUrl('78570bea-2a26-467c-a3db-c52723ceb394', '500'),
    rating: 9.3,
  },
  {
    id: 'aa997ea0-2936-40bd-884d-3af8a0e064dc',
    title: 'Random Access Memories',
    artist: 'Daft Punk',
    cover: getReleaseGroupCoverUrl('aa997ea0-2936-40bd-884d-3af8a0e064dc', '500'),
    rating: 9.8,
  },
];

export function getFavoriteAlbums(): FavoriteAlbumRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.FAVORITES);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(INITIAL_FAVORITES));
      return [...INITIAL_FAVORITES];
    }
    return JSON.parse(raw);
  } catch {
    return [...INITIAL_FAVORITES];
  }
}

export function isAlbumFavorited(albumId: string): boolean {
  return getFavoriteAlbums().some((f) => f.id === albumId);
}

export function toggleFavoriteAlbum(album: CatalogAlbum): boolean {
  const current = getFavoriteAlbums();
  const exists = current.some((f) => f.id === album.id);
  let next: FavoriteAlbumRecord[];
  if (exists) {
    next = current.filter((f) => f.id !== album.id);
  } else {
    next = [
      {
        id: album.id,
        title: album.title,
        artist: album.artist.name,
        cover: album.cover_big || album.cover_medium,
        rating: album.communityRating,
      },
      ...current,
    ];
  }
  try {
    localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(next));
  } catch {
    // ignore
  }
  return !exists;
}

const INITIAL_FEED_POSTS: FeedPostItem[] = [
  {
    id: 'feed-1',
    friendName: 'Lucas Sound',
    friendUsername: 'lucas_snd',
    friendAvatar:
      'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200',
    albumTitle: 'HIT ME HARD AND SOFT',
    artistName: 'Billie Eilish',
    albumCover: getReleaseGroupCoverUrl('02a544b3-0459-42c7-bd9c-047162e7b67a', '500'),
    albumId: '02a544b3-0459-42c7-bd9c-047162e7b67a',
    rating: 9.5,
    comment:
      'A transição entre as faixas e a produção vocal neste álbum estão em outro patamar. Simplesmente envolvente do início ao fim!',
    timeAgo: 'Há 2 horas',
    likesCount: 14,
    isLiked: false,
    comments: [
      {
        id: 'c-1',
        author: 'Ana Beatriz',
        avatar:
          'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200',
        text: 'Concordo totalmente! "LUNCH" e "CHIHIRO" são surreais.',
        time: 'Há 1 hora',
      },
    ],
  },
  {
    id: 'feed-2',
    friendName: 'Beat Critic',
    friendUsername: 'beatcritic',
    friendAvatar:
      'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?q=80&w=200',
    albumTitle: 'Random Access Memories',
    artistName: 'Daft Punk',
    albumCover: getReleaseGroupCoverUrl('aa997ea0-2936-40bd-884d-3af8a0e064dc', '500'),
    albumId: 'aa997ea0-2936-40bd-884d-3af8a0e064dc',
    rating: 10,
    comment:
      'O ápice da música eletrônica orgânica. Uma verdadeira obra de arte atemporal.',
    timeAgo: 'Há 5 horas',
    likesCount: 29,
    isLiked: true,
    comments: [],
  },
];

export function getCommunityFeedPosts(): FeedPostItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.FEED);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.FEED, JSON.stringify(INITIAL_FEED_POSTS));
      return [...INITIAL_FEED_POSTS];
    }
    return JSON.parse(raw);
  } catch {
    return [...INITIAL_FEED_POSTS];
  }
}

export function saveCommunityFeedPosts(posts: FeedPostItem[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.FEED, JSON.stringify(posts));
  } catch {
    // ignore
  }
}

export function addCommunityFeedPost(post: FeedPostItem): void {
  const current = getCommunityFeedPosts();
  saveCommunityFeedPosts([post, ...current]);
}

// ============================================================================
// INTEGRAÇÃO COM A API DO MUSICBRAINZ + CACHE INTELIGENTE
// ============================================================================

function readApiCache<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.API_CACHE_PREFIX + key);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { data: T; timestamp: number };
    if (Date.now() - parsed.timestamp > API_CACHE_TTL) {
      localStorage.removeItem(STORAGE_KEYS.API_CACHE_PREFIX + key);
      return null;
    }
    return parsed.data;
  } catch {
    return null;
  }
}

function writeApiCache<T>(key: string, data: T): void {
  try {
    localStorage.setItem(
      STORAGE_KEYS.API_CACHE_PREFIX + key,
      JSON.stringify({ data, timestamp: Date.now() })
    );
  } catch {
    // ignore
  }
}

async function mbFetchJson(pathAndQuery: string): Promise<any | null> {
  const cacheKey = pathAndQuery;
  const cached = readApiCache<any>(cacheKey);
  if (cached) return cached;

  try {
    const res = await fetch(`${MB_API_BASE}/${pathAndQuery}`, {
      headers: {
        Accept: 'application/json',
      },
    });
    if (!res.ok) return null;
    const data = await res.json();
    if (data && !data.unavailable && !data.error) {
      writeApiCache(cacheKey, data);
    }
    return data;
  } catch {
    return null;
  }
}

const GENRE_KEYWORDS: { [genre: string]: string[] } = {
  Pop: ['pop', 'synth-pop', 'dance-pop', 'electropop', 'indie pop', 'art pop', 'teen pop'],
  Rock: ['rock', 'alternative rock', 'progressive rock', 'hard rock', 'classic rock', 'post-punk', 'metal', 'punk'],
  'Hip-Hop': ['hip hop', 'hip-hop', 'rap', 'trap', 'conscious hip hop', 'boom bap'],
  Eletrônica: ['electronic', 'house', 'techno', 'electro', 'edm', 'ambient', 'hyperpop', 'dance', 'drum and bass'],
  Indie: ['indie', 'indie rock', 'shoegaze', 'dream pop', 'lo-fi', 'alternative', 'psychedelic'],
  'R&B': ['r&b', 'rnb', 'soul', 'neo-soul', 'contemporary r&b', 'funk'],
  'Samba e pagode': ['samba', 'pagode', 'mpb', 'bossa nova', 'choro', 'brazilian'],
};

function mapTagsToGenre(tags?: { name: string }[], fallbackIndex = 0): string {
  if (tags && tags.length > 0) {
    const joined = tags.map((t) => t.name.toLowerCase()).join(' ');
    for (const [genre, keywords] of Object.entries(GENRE_KEYWORDS)) {
      if (keywords.some((kw) => joined.includes(kw))) {
        return genre;
      }
    }
  }
  const genres = Object.keys(GENRE_KEYWORDS);
  return genres[fallbackIndex % genres.length];
}

function normalizeRecordType(primaryType?: string, secondaryTypes?: string[]): 'album' | 'ep' | 'single' {
  const pt = (primaryType || '').toLowerCase();
  if (pt === 'ep') return 'ep';
  if (pt === 'single') return 'single';
  if (secondaryTypes?.some((s) => s.toLowerCase() === 'ep')) return 'ep';
  if (secondaryTypes?.some((s) => s.toLowerCase() === 'single')) return 'single';
  return 'album';
}

function formatArtistCredit(artistCredit?: any[]): { id: string; name: string } {
  if (!Array.isArray(artistCredit) || artistCredit.length === 0) {
    return { id: '', name: 'Artista Desconhecido' };
  }
  const firstArtist = artistCredit[0]?.artist || artistCredit[0];
  const fullName = artistCredit
    .map((ac) => (ac.name || ac.artist?.name || '') + (ac.joinphrase || ''))
    .join('')
    .trim();
  return {
    id: firstArtist?.id || '',
    name: fullName || firstArtist?.name || 'Artista',
  };
}

export function mapReleaseGroupToCatalogAlbum(rg: any, idx = 0): CatalogAlbum {
  const id = rg.id;
  const artist = formatArtistCredit(rg['artist-credit']);
  const recordType = normalizeRecordType(rg['primary-type'], rg['secondary-types']);
  const genreName = mapTagsToGenre(rg.tags || rg.genres, idx);
  const internalData = getAlbumInternalData(id, {
    title: rg.title,
    release_date: rg['first-release-date'] || rg.date || '2025',
    record_type: recordType,
    genreName,
    artist,
    cover_xl: getReleaseGroupCoverUrl(id, '1200'),
    cover_big: getReleaseGroupCoverUrl(id, '500'),
    cover_medium: getReleaseGroupCoverUrl(id, '500'),
  });

  return {
    ...internalData,
    id,
    title: rg.title || internalData.title,
    release_date: rg['first-release-date'] || rg.date || internalData.release_date,
    record_type: recordType,
    genreName: internalData.genreName || genreName,
    artist: artist.name !== 'Artista Desconhecido' ? artist : internalData.artist,
    cover_xl: getReleaseGroupCoverUrl(id, '1200'),
    cover_big: getReleaseGroupCoverUrl(id, '500'),
    cover_medium: getReleaseGroupCoverUrl(id, '500'),
  };
}

/**
 * Busca "Novos Lançamentos" diretamente na API do MusicBrainz (álbuns recentes oficiais)
 * com capas vindas do Cover Art Archive.
 */
export async function fetchNewReleasesFromMusicBrainz(limit = 12): Promise<CatalogAlbum[]> {
  const currentYear = new Date().getFullYear();
  const minYear = Math.max(2024, currentYear - 2);

  // Busca releases oficiais recentes no MusicBrainz que possuem capa no Cover Art Archive
  const query = `status:official AND primarytype:album AND date:[${minYear}-01-01 TO ${currentYear}-12-31] NOT artist:"Various Artists"`;
  const data = await mbFetchJson(
    `release?query=${encodeURIComponent(query)}&limit=50&fmt=json`
  );

  const results: CatalogAlbum[] = [];
  const seenReleaseGroups = new Set<string>();

  if (data && Array.isArray(data.releases) && data.releases.length > 0) {
    // Prioriza os releases que têm artwork confirmado no Cover Art Archive
    const sortedReleases = [...data.releases].sort((a, b) => {
      const aArt = a['cover-art-archive']?.artwork ? 1 : 0;
      const bArt = b['cover-art-archive']?.artwork ? 1 : 0;
      if (bArt !== aArt) return bArt - aArt;
      return String(b.date || '').localeCompare(String(a.date || ''));
    });

    for (const rel of sortedReleases) {
      const rgId = rel['release-group']?.id || rel.id;
      if (!rgId || seenReleaseGroups.has(rgId)) continue;

      const artist = formatArtistCredit(rel['artist-credit']);
      if (
        !artist.name ||
        artist.name.toLowerCase().includes('various artists') ||
        artist.name.toLowerCase().includes('[unknown]')
      ) {
        continue;
      }

      seenReleaseGroups.add(rgId);
      const hasReleaseArtwork = rel['cover-art-archive']?.artwork === true;
      const cover500 = hasReleaseArtwork
        ? getReleaseCoverUrl(rel.id, '500')
        : getReleaseGroupCoverUrl(rgId, '500');
      const cover1200 = hasReleaseArtwork
        ? getReleaseCoverUrl(rel.id, '1200')
        : getReleaseGroupCoverUrl(rgId, '1200');

      const labelInfo = rel['label-info']?.[0]?.label?.name || 'Oficial';
      const baseAlbum = getAlbumInternalData(rgId, {
        title: rel.title,
        release_date: rel.date || `${currentYear}`,
        record_type: normalizeRecordType(rel['release-group']?.['primary-type']),
        label: labelInfo,
        artist,
        cover_xl: cover1200,
        cover_big: cover500,
        cover_medium: cover500,
      });

      results.push({
        ...baseAlbum,
        id: rgId,
        releaseId: rel.id,
        title: rel.title,
        release_date: rel.date || baseAlbum.release_date,
        label: labelInfo,
        artist,
        cover_xl: cover1200,
        cover_big: cover500,
        cover_medium: cover500,
      });

      if (results.length >= limit) break;
    }
  }

  // Complementa com lançamentos recentes do catálogo caso a API retorne menos itens
  if (results.length < limit) {
    const recentInternal = getInternalAlbumsStore()
      .filter((a) => !seenReleaseGroups.has(a.id))
      .sort((a, b) => b.release_date.localeCompare(a.release_date));

    for (const item of recentInternal) {
      results.push(item);
      if (results.length >= limit) break;
    }
  }

  return results.slice(0, limit);
}

/**
 * Busca álbuns, EPs e singles no MusicBrainz (release-group).
 */
export async function searchAlbumsInMusicBrainz(
  query: string,
  limit = 15,
  offset = 0
): Promise<{ albums: CatalogAlbum[]; total: number }> {
  const trimmed = query.trim();
  if (!trimmed) {
    const all = getInternalAlbumsStore();
    return {
      albums: all.slice(offset, offset + limit),
      total: all.length,
    };
  }

  const data = await mbFetchJson(
    `release-group?query=${encodeURIComponent(trimmed)}&limit=${limit}&offset=${offset}&fmt=json`
  );

  if (!data || !Array.isArray(data['release-groups'])) {
    const filtered = getInternalAlbumsStore().filter(
      (a) =>
        a.title.toLowerCase().includes(trimmed.toLowerCase()) ||
        a.artist.name.toLowerCase().includes(trimmed.toLowerCase())
    );
    return { albums: filtered.slice(offset, offset + limit), total: filtered.length };
  }

  const mapped = data['release-groups'].map((rg: any, idx: number) =>
    mapReleaseGroupToCatalogAlbum(rg, offset + idx)
  );

  return {
    albums: mapped,
    total: typeof data.count === 'number' ? data.count : mapped.length,
  };
}

/**
 * Mantém exportação compatível com a versão anterior do serviço.
 */
export const searchAlbums = async (query: string) => {
  return searchAlbumsInMusicBrainz(query, 10, 0);
};

/**
 * Busca artistas no MusicBrainz com suporte a paginação.
 */
export async function searchArtistsInMusicBrainz(
  query: string,
  limit = 18,
  offset = 0
): Promise<{ artists: CatalogArtist[]; total: number }> {
  const trimmed = query.trim();

  if (!trimmed) {
    // Sem termo de busca: retorna artistas em destaque e busca mais no MusicBrainz se paginar
    if (offset < FEATURED_ARTISTS.length) {
      return {
        artists: FEATURED_ARTISTS.slice(offset, offset + limit),
        total: FEATURED_ARTISTS.length * 2,
      };
    }
  }

  const luceneQuery = trimmed
    ? trimmed
    : 'type:person OR type:group NOT artist:"Various Artists"';

  const data = await mbFetchJson(
    `artist?query=${encodeURIComponent(luceneQuery)}&limit=${limit}&offset=${offset}&fmt=json`
  );

  if (!data || !Array.isArray(data.artists)) {
    const fallback = FEATURED_ARTISTS.filter((a) =>
      a.name.toLowerCase().includes(trimmed.toLowerCase())
    );
    return { artists: fallback, total: fallback.length };
  }

  const blockedNames = new Set([
    'various artists',
    'unknown',
    '[unknown]',
    'various',
    'none',
    'anonymous',
    'vários artistas',
    'artista desconhecido',
  ]);

  const validArtists = data.artists.filter((artist: any) => {
    const name = (artist.name || '').toLowerCase().trim();
    if (!name || name.startsWith('[') || blockedNames.has(name)) return false;
    return true;
  });

  const formatted: CatalogArtist[] = validArtists.map((artist: any, idx: number) => {
    const known = FEATURED_ARTISTS.find(
      (fa) => fa.id === artist.id || fa.name.toLowerCase() === String(artist.name).toLowerCase()
    );

    const internalArtistAlbum = getInternalAlbumsStore().find(
      (alb) =>
        alb.artist.id === artist.id ||
        alb.artist.name.toLowerCase() === String(artist.name).toLowerCase()
    );

    const genre =
      known?.genre ||
      (artist.tags && artist.tags.length > 0
        ? artist.tags
            .slice(0, 2)
            .map((t: any) => t.name)
            .join(' / ')
        : artist.disambiguation || 'Artista');

    let hash = 0;
    const idStr = String(artist.id || idx);
    for (let i = 0; i < idStr.length; i++) {
      hash = (hash * 31 + idStr.charCodeAt(i)) >>> 0;
    }

    return {
      id: artist.id,
      name: artist.name,
      imageUrl: known?.imageUrl || internalArtistAlbum?.cover_medium || '',
      genre,
      country: artist.country || artist.area?.name || '',
      nbFans: known?.nbFans || 150 + (hash % 2500),
      type: artist.type,
    };
  });

  return {
    artists: formatted,
    total: typeof data.count === 'number' ? data.count : formatted.length,
  };
}

/**
 * Busca músicas (recordings) no MusicBrainz.
 */
export async function searchTracksInMusicBrainz(
  query: string,
  limit = 10
): Promise<CatalogTrack[]> {
  const trimmed = query.trim();
  if (!trimmed) {
    return INITIAL_TOP_TRACKS.slice(0, limit);
  }

  const data = await mbFetchJson(
    `recording?query=${encodeURIComponent(trimmed)}&limit=${limit}&fmt=json`
  );

  if (!data || !Array.isArray(data.recordings)) {
    return INITIAL_TOP_TRACKS.filter(
      (t) =>
        t.title.toLowerCase().includes(trimmed.toLowerCase()) ||
        t.artist.name.toLowerCase().includes(trimmed.toLowerCase())
    ).slice(0, limit);
  }

  const tracks: CatalogTrack[] = [];
  for (const rec of data.recordings) {
    const artist = formatArtistCredit(rec['artist-credit']);
    const firstRelease = rec.releases?.[0];
    const releaseGroupId = firstRelease?.['release-group']?.id || firstRelease?.id || '';
    const albumTitle = firstRelease?.title || 'Single';

    tracks.push({
      id: rec.id,
      title: rec.title,
      duration: rec.length ? Math.round(rec.length / 1000) : 200,
      artist,
      album: {
        id: releaseGroupId,
        title: albumTitle,
        cover_medium: releaseGroupId
          ? getReleaseGroupCoverUrl(releaseGroupId, '250')
          : DEFAULT_ALBUM_COVER,
        cover_big: releaseGroupId
          ? getReleaseGroupCoverUrl(releaseGroupId, '500')
          : DEFAULT_ALBUM_COVER,
      },
    });
  }

  return tracks;
}

/**
 * Busca detalhes completos de um Artista no MusicBrainz (incluindo Álbuns, EPs e Singles)
 * com capas vindas do Cover Art Archive.
 */
export async function fetchArtistDetailsFromMusicBrainz(artistId: string): Promise<{
  id: string;
  name: string;
  bannerUrl: string;
  genre: string;
  country: string;
  albums: CatalogAlbum[];
  epsAndSingles: CatalogAlbum[];
}> {
  const knownArtist = FEATURED_ARTISTS.find((a) => a.id === artistId);

  const [artistData, rgData] = await Promise.all([
    mbFetchJson(`artist/${artistId}?inc=tags+genres&fmt=json`),
    mbFetchJson(`release-group?artist=${artistId}&type=album|ep|single&limit=100&fmt=json`),
  ]);

  const artistName = artistData?.name || knownArtist?.name || 'Artista';
  const country = artistData?.country || artistData?.area?.name || knownArtist?.country || '';
  const genre =
    knownArtist?.genre ||
    (artistData?.tags?.length
      ? artistData.tags
          .slice(0, 3)
          .map((t: any) => t.name)
          .join(' • ')
      : 'Artista Oficial');

  const releaseGroups: any[] = rgData?.['release-groups'] || [];

  // Remove duplicados por título normalizado e ordena dos mais recentes para os mais antigos
  const uniqueMap = new Map<string, any>();
  for (const rg of releaseGroups) {
    const normTitle = String(rg.title || '').toLowerCase().trim();
    if (!normTitle) continue;
    const existing = uniqueMap.get(normTitle);
    if (!existing) {
      uniqueMap.set(normTitle, rg);
    } else if (!existing['first-release-date'] && rg['first-release-date']) {
      uniqueMap.set(normTitle, rg);
    }
  }

  const allReleases = Array.from(uniqueMap.values())
    .map((rg, idx) => {
      const mapped = mapReleaseGroupToCatalogAlbum(rg, idx);
      return {
        ...mapped,
        artist: { id: artistId, name: artistName },
      };
    })
    .sort((a, b) => String(b.release_date || '').localeCompare(String(a.release_date || '')));

  // Se o MusicBrainz estiver indisponível, usa os álbuns internos desse artista
  if (allReleases.length === 0) {
    const fallbackInternal = getInternalAlbumsStore().filter(
      (a) =>
        a.artist.id === artistId ||
        a.artist.name.toLowerCase() === artistName.toLowerCase()
    );
    allReleases.push(...fallbackInternal);
  }

  const albums = allReleases.filter((item) => item.record_type === 'album');
  const epsAndSingles = allReleases.filter(
    (item) => item.record_type === 'ep' || item.record_type === 'single'
  );

  const bannerUrl =
    knownArtist?.imageUrl ||
    albums[0]?.cover_xl ||
    epsAndSingles[0]?.cover_xl ||
    DEFAULT_ARTIST_IMAGE;

  return {
    id: artistId,
    name: artistName,
    bannerUrl,
    genre,
    country,
    albums,
    epsAndSingles,
  };
}

/**
 * Busca os detalhes completos de um Álbum, EP ou Single no MusicBrainz (release-group ou release),
 * incluindo a lista completa de músicas (recordings) e capas do Cover Art Archive.
 */
export async function fetchAlbumDetailsFromMusicBrainz(
  albumId: string
): Promise<CatalogAlbum | null> {
  const internalMatch = getInternalAlbumsStore().find((a) => a.id === albumId);

  // 1. Consulta o release-group no MusicBrainz
  const rgData = await mbFetchJson(
    `release-group/${albumId}?inc=artist-credits+releases+tags+genres&fmt=json`
  );

  let releaseGroupId = albumId;
  let targetReleaseId = internalMatch?.releaseId || '';
  let title = internalMatch?.title || '';
  let releaseDate = internalMatch?.release_date || '';
  let recordType: 'album' | 'ep' | 'single' = internalMatch?.record_type || 'album';
  let artist = internalMatch?.artist || { id: '', name: 'Artista' };
  let genreName = internalMatch?.genreName || 'Pop';
  let label = internalMatch?.label || 'Oficial';

  if (rgData && rgData.id) {
    releaseGroupId = rgData.id;
    title = rgData.title || title;
    releaseDate = rgData['first-release-date'] || releaseDate || '2025';
    recordType = normalizeRecordType(rgData['primary-type'], rgData['secondary-types']);
    artist = formatArtistCredit(rgData['artist-credit']);
    if (rgData.tags?.length || rgData.genres?.length) {
      genreName = mapTagsToGenre(rgData.tags || rgData.genres);
    }

    const releasesList: any[] = rgData.releases || [];
    if (releasesList.length > 0) {
      const officialRelease =
        releasesList.find(
          (r) =>
            String(r.status || '').toLowerCase() === 'official' &&
            (r.country === 'US' || r.country === 'XW' || r.country === 'GB' || r.country === 'BR')
        ) ||
        releasesList.find((r) => String(r.status || '').toLowerCase() === 'official') ||
        releasesList[0];

      targetReleaseId = officialRelease.id;
    }
  } else {
    // Caso o ID passado já seja o MBID de um release específico
    targetReleaseId = albumId;
  }

  // 2. Busca as faixas (recordings) e gravadora do release selecionado no MusicBrainz
  let tracksList: { id: string; title: string; duration: number }[] = [];

  if (targetReleaseId) {
    const releaseDetails = await mbFetchJson(
      `release/${targetReleaseId}?inc=recordings+artist-credits+release-groups+labels+tags&fmt=json`
    );

    if (releaseDetails && releaseDetails.id) {
      if (!title) title = releaseDetails.title;
      if (!releaseDate) releaseDate = releaseDetails.date || '2025';
      if (releaseDetails['release-group']?.id) {
        releaseGroupId = releaseDetails['release-group'].id;
        recordType = normalizeRecordType(
          releaseDetails['release-group']['primary-type'],
          releaseDetails['release-group']['secondary-types']
        );
      }
      if (!artist.id && releaseDetails['artist-credit']) {
        artist = formatArtistCredit(releaseDetails['artist-credit']);
      }
      const foundLabel = releaseDetails['label-info']?.[0]?.label?.name;
      if (foundLabel) {
        label = foundLabel;
      }

      const mediaList: any[] = releaseDetails.media || [];
      for (const medium of mediaList) {
        const mediumTracks: any[] = medium.tracks || [];
        for (const tr of mediumTracks) {
          const durationMs = tr.length ?? tr.recording?.length ?? 0;
          tracksList.push({
            id: tr.recording?.id || tr.id || `${tracksList.length + 1}`,
            title: tr.title || tr.recording?.title || `Faixa ${tracksList.length + 1}`,
            duration: durationMs ? Math.round(durationMs / 1000) : 0,
          });
        }
      }
    }
  }

  // Fallback se não encontrou nem no MusicBrainz nem no store interno
  if (!title) {
    return null;
  }

  // Fallback de faixas das músicas conhecidas caso o release não traga mídia detalhada
  if (tracksList.length === 0) {
    const matchingTracks = INITIAL_TOP_TRACKS.filter((t) => t.album.id === releaseGroupId);
    if (matchingTracks.length > 0) {
      tracksList = matchingTracks.map((t) => ({
        id: t.id,
        title: t.title,
        duration: t.duration,
      }));
    }
  }

  const internalStats = getAlbumInternalData(releaseGroupId, {
    title,
    release_date: releaseDate,
    record_type: recordType,
    genreName,
    label,
    artist,
    cover_xl: getReleaseGroupCoverUrl(releaseGroupId, '1200'),
    cover_big: getReleaseGroupCoverUrl(releaseGroupId, '500'),
    cover_medium: getReleaseGroupCoverUrl(releaseGroupId, '500'),
  });

  return {
    ...internalStats,
    id: releaseGroupId,
    releaseId: targetReleaseId || internalStats.releaseId,
    title,
    release_date: releaseDate || internalStats.release_date,
    record_type: recordType,
    genreName,
    label,
    artist,
    cover_xl: getReleaseGroupCoverUrl(releaseGroupId, '1200'),
    cover_big: getReleaseGroupCoverUrl(releaseGroupId, '500'),
    cover_medium: getReleaseGroupCoverUrl(releaseGroupId, '500'),
    isFavorite: isAlbumFavorited(releaseGroupId),
    tracks: {
      data: tracksList,
    },
  };
}
