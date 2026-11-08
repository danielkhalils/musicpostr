import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  Trophy,
  Flame,
  TrendingUp,
  Award,
  Headphones,
} from 'lucide-react';
import {
  type CatalogAlbum,
  getTopRatedAlbumsByInternalReviews,
  getPopularAlbumsByInternalActivity,
  getInitialNewReleases,
  fetchNewReleasesFromMusicBrainz,
} from '../../services/musicBrainz.service';
import { handleCoverImageError } from '../../services/coverArt.service';
import './RankingsPage.css';

interface RankingAlbum extends CatalogAlbum {
  rank: number;
}

const genresList = [
  { name: 'Todos', emoji: '🌟' },
  { name: 'Pop', emoji: '🎤' },
  { name: 'Hip-Hop', emoji: '🔥' },
  { name: 'Rock', emoji: '🎸' },
  { name: 'Indie', emoji: '🎧' },
  { name: 'Eletrônica', emoji: '⚡' },
  { name: 'R&B', emoji: '🎷' },
  { name: 'Samba e pagode', emoji: '🥁' },
];

type RankingFilterMode = 'top-rated' | 'popular' | 'releases';

function computeInitialRankings(mode: RankingFilterMode): RankingAlbum[] {
  const base =
    mode === 'releases'
      ? getInitialNewReleases(20)
      : mode === 'popular'
        ? getPopularAlbumsByInternalActivity(30)
        : getTopRatedAlbumsByInternalReviews(30);
  return base.map((item, idx) => ({ ...item, rank: idx + 1 }));
}

export function RankingsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const rawFilter = searchParams.get('filter') as RankingFilterMode;
  const initialFilter: RankingFilterMode = [
    'top-rated',
    'popular',
    'releases',
  ].includes(rawFilter)
    ? rawFilter
    : 'top-rated';

  const [filterMode, setFilterMode] =
    useState<RankingFilterMode>(initialFilter);
  const [rankings, setRankings] = useState<RankingAlbum[]>(() =>
    computeInitialRankings(initialFilter)
  );
  const [activeGenre, setActiveGenre] = useState<string>('Todos');

  useEffect(() => {
    const paramFilter = searchParams.get('filter') as RankingFilterMode;
    if (
      paramFilter &&
      ['top-rated', 'popular', 'releases'].includes(paramFilter)
    ) {
      setFilterMode(paramFilter);
    }
  }, [searchParams]);

  useEffect(() => {
    let isMounted = true;

    // Atualiza instantaneamente (0ms) com os dados em memória/cache
    setRankings(computeInitialRankings(filterMode));

    if (filterMode === 'releases') {
      fetchNewReleasesFromMusicBrainz(20)
        .then((freshReleases) => {
          if (isMounted && freshReleases.length > 0) {
            setRankings(
              freshReleases.map((item, idx) => ({ ...item, rank: idx + 1 }))
            );
          }
        })
        .catch(() => {});
    }

    const handleInternalSync = () => {
      if (filterMode !== 'releases') {
        setRankings(computeInitialRankings(filterMode));
      }
    };
    window.addEventListener('musicpostr:albums-updated', handleInternalSync);
    return () => {
      isMounted = false;
      window.removeEventListener(
        'musicpostr:albums-updated',
        handleInternalSync
      );
    };
  }, [filterMode]);

  const handleSelectMode = (mode: RankingFilterMode) => {
    setFilterMode(mode);
    setSearchParams({ filter: mode });
  };

  const filteredRankings =
    activeGenre === 'Todos'
      ? rankings
      : rankings.filter(
          (r) =>
            (r.genreName ?? '').toLowerCase() === activeGenre.toLowerCase()
        );

  return (
    <div className="page-container">
      <div className="page-header-wrapper">
        <div>
          <h1 className="page-title">
            <Trophy className="h-8 w-8 text-amber-400 fill-amber-400" />{' '}
            Rankings & Estatísticas
          </h1>
          <p className="page-subtitle">
            {filterMode === 'releases'
              ? 'Novos lançamentos oficiais de álbuns trazidos diretamente da API do MusicBrainz & Cover Art Archive.'
              : filterMode === 'popular'
                ? 'Álbuns populares no momento com base nas avaliações internas e na quantidade de usuários que ouviram.'
                : 'Os álbuns mais bem avaliados pela comunidade com base nas notas internas dos usuários.'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 mt-4 sm:mt-0">
          <button
            onClick={() => handleSelectMode('top-rated')}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 border ${
              filterMode === 'top-rated'
                ? 'bg-primary text-primary-foreground border-primary shadow-sm'
                : 'bg-card text-muted-foreground border-border hover:text-foreground'
            }`}
          >
            <Award className="h-3.5 w-3.5" /> Mais Bem Avaliados
          </button>
          <button
            onClick={() => handleSelectMode('popular')}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 border ${
              filterMode === 'popular'
                ? 'bg-primary text-primary-foreground border-primary shadow-sm'
                : 'bg-card text-muted-foreground border-border hover:text-foreground'
            }`}
          >
            <TrendingUp className="h-3.5 w-3.5" /> Populares (Mais Ouvidos)
          </button>
          <button
            onClick={() => handleSelectMode('releases')}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 border ${
              filterMode === 'releases'
                ? 'bg-primary text-primary-foreground border-primary shadow-sm'
                : 'bg-card text-muted-foreground border-border hover:text-foreground'
            }`}
          >
            <Flame className="h-3.5 w-3.5" /> Novos Lançamentos
          </button>
        </div>
      </div>

      {rankings.length >= 3 && (
        <div className="top-podium-section">
          <h2 className="section-heading">
            <Flame className="h-5 w-5 text-orange-500" /> Top 3 em Destaque
          </h2>
          <div className="podium-grid">
            {rankings.slice(0, 3).map((album, idx) => (
              <Link
                key={album.id}
                to={`/album/${album.id}`}
                className={`podium-card rank-${idx + 1}`}
              >
                <div className="podium-badge">#{idx + 1}</div>
                <img
                  src={album.cover_medium || album.cover_big}
                  alt={album.title}
                  decoding="async"
                  onError={handleCoverImageError}
                  className="podium-cover"
                />
                <div className="podium-info">
                  <h3>{album.title}</h3>
                  <p>{album.artist.name}</p>
                  <div className="podium-score">
                    <Award className="h-4 w-4 text-primary" />
                    <span>{album.communityRating.toFixed(1)} / 10</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      <div className="genre-grid-section">
        <h2 className="section-heading">Momentos e Gêneros</h2>
        <div className="genre-cards-grid">
          {genresList.map((item) => (
            <button
              key={item.name}
              onClick={() => setActiveGenre(item.name)}
              className={`genre-card-item ${
                activeGenre === item.name ? 'active' : ''
              }`}
            >
              <span className="genre-card-emoji">{item.emoji}</span>
              <span className="genre-card-name">{item.name}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="ranking-table-wrapper">
        <div className="ranking-table-header">
          <span>Posição</span>
          <span>Álbum / Artista</span>
          <span>Gênero</span>
          <span>Ouvintes & Avaliações</span>
          <span className="text-right">Nota Geral</span>
        </div>

        <div className="ranking-table-body">
          {filteredRankings.map((item) => (
            <Link
              key={item.id}
              to={`/album/${item.id}`}
              className="ranking-row"
            >
              <div className="ranking-position">
                <span
                  className={`pos-number ${
                    item.rank <= 3 ? 'top-three' : ''
                  }`}
                >
                  #{item.rank}
                </span>
                <TrendingUp className="h-3 w-3 text-emerald-500" />
              </div>

              <div className="ranking-album-cell">
                <img
                  src={item.cover_medium || item.cover_big}
                  alt={item.title}
                  loading="lazy"
                  decoding="async"
                  onError={handleCoverImageError}
                  className="ranking-thumb"
                />
                <div>
                  <h4 className="ranking-album-name">{item.title}</h4>
                  <p className="ranking-artist-name">{item.artist.name}</p>
                </div>
              </div>

              <div className="ranking-genre">
                <span className="genre-tag">{item.genreName || 'Geral'}</span>
              </div>

              <div className="ranking-reviews-count flex flex-col">
                <span className="flex items-center gap-1 text-xs font-medium text-foreground">
                  <Headphones className="h-3 w-3 text-primary" />
                  {item.listenersCount.toLocaleString('pt-BR')} ouvintes
                </span>
                <span className="text-[11px] text-muted-foreground">
                  {item.totalReviews} avaliações
                </span>
              </div>

              <div className="ranking-score-cell">
                <div className="musicpostr-mini-badge">
                  {item.communityRating.toFixed(1)}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
