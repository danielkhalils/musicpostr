import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  Loader2,
  Award,
  Music,
  Search,
  Calendar,
  User,
  Building2,
  ChevronLeft,
  ChevronRight,
  Filter,
  Headphones,
} from 'lucide-react';
import {
  type CatalogAlbum,
  searchAlbumsInMusicBrainz,
} from '../../services/musicBrainz.service';
import { handleCoverImageError } from '../../services/coverArt.service';
import './ReviewsPage.css';

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

export function ReviewsPage() {
  const [searchParams] = useSearchParams();
  const [albums, setAlbums] = useState<CatalogAlbum[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [debouncedSearch, setDebouncedSearch] = useState<string>('');

  const [selectedYear, setSelectedYear] = useState<string>('');
  const [selectedGenre, setSelectedGenre] = useState<string>(() => {
    const g = searchParams.get('genre');
    if (g && genresList.some((item) => item.name.toLowerCase() === g.toLowerCase())) {
      return (
        genresList.find((item) => item.name.toLowerCase() === g.toLowerCase())
          ?.name || 'Todos'
      );
    }
    return 'Todos';
  });
  const [selectedLabel, setSelectedLabel] = useState<string>('');

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalResults, setTotalResults] = useState<number>(0);
  const limit = 15;

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setCurrentPage(1);
    }, 450);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    async function fetchAlbums() {
      setIsLoading(true);
      try {
        const offset = (currentPage - 1) * limit;
        const { albums: fetched, total } = await searchAlbumsInMusicBrainz(
          debouncedSearch,
          limit,
          offset
        );
        setAlbums(fetched);
        setTotalResults(total);
      } catch (error) {
        console.error('Erro ao buscar álbuns no MusicBrainz:', error);
        setAlbums([]);
        setTotalResults(0);
      } finally {
        setIsLoading(false);
      }
    }

    fetchAlbums();

    const syncReviews = () => {
      if (!debouncedSearch.trim()) {
        fetchAlbums();
      }
    };
    window.addEventListener('musicpostr:albums-updated', syncReviews);
    return () =>
      window.removeEventListener('musicpostr:albums-updated', syncReviews);
  }, [debouncedSearch, currentPage]);

  const availableYears = Array.from(
    new Set(albums.map((a) => a.release_date?.substring(0, 4)).filter(Boolean))
  )
    .sort()
    .reverse();

  const availableLabels = Array.from(
    new Set(albums.map((a) => a.label).filter(Boolean))
  ).sort();

  const filteredAlbums = albums.filter((album) => {
    const albumYear = album.release_date?.substring(0, 4) || '';
    const matchYear = selectedYear ? albumYear === selectedYear : true;
    const matchGenre =
      selectedGenre === 'Todos' ? true : album.genreName === selectedGenre;
    const matchLabel = selectedLabel ? album.label === selectedLabel : true;
    return matchYear && matchGenre && matchLabel;
  });

  return (
    <div className="page-container">
      <div className="page-header-wrapper">
        <div>
          <h1 className="page-title">
            <Award className="h-8 w-8 text-primary stroke-[2.5]" /> Avaliações
            da Comunidade
          </h1>
          <p className="page-subtitle">
            Explore álbuns, EPs e singles no MusicBrainz, utilize os filtros por
            ano, gênero e gravadora para refinar suas descobertas.
            {totalResults > 0 && (
              <span className="ml-2 text-xs text-muted-foreground">
                ({totalResults} resultados encontrados)
              </span>
            )}
          </p>
        </div>

        {/* Barra de Pesquisa */}
        <div className="reviews-search-wrapper">
          <Search className="reviews-search-icon" />
          <input
            type="text"
            placeholder="Pesquisar álbum, EP, single ou artista..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="reviews-search-input"
          />
        </div>
      </div>

      {/* Seção de Gêneros em Grade com Emojis */}
      <div className="genre-grid-section mb-6">
        <h2 className="section-heading mb-3">Filtrar por Momento ou Gênero</h2>
        <div className="genre-cards-grid">
          {genresList.map((item) => (
            <button
              key={item.name}
              onClick={() => setSelectedGenre(item.name)}
              className={`genre-card-item ${
                selectedGenre === item.name ? 'active' : ''
              }`}
            >
              <span className="genre-card-emoji">{item.emoji}</span>
              <span className="genre-card-name">{item.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Painel de Filtros Secundários (Ano e Gravadora) */}
      <div className="reviews-filter-bar mb-8">
        <div className="flex items-center gap-2 text-xs font-semibold text-foreground">
          <Filter className="h-4 w-4 text-primary" /> Filtros Adicionais:
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="reviews-select-filter"
          >
            <option value="">Todos os Anos</option>
            {availableYears.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>

          <select
            value={selectedLabel}
            onChange={(e) => setSelectedLabel(e.target.value)}
            className="reviews-select-filter"
          >
            <option value="">Todas as Gravadoras</option>
            {availableLabels.map((label) => (
              <option key={label} value={label}>
                {label}
              </option>
            ))}
          </select>

          {(selectedYear || selectedGenre !== 'Todos' || selectedLabel) && (
            <button
              onClick={() => {
                setSelectedYear('');
                setSelectedGenre('Todos');
                setSelectedLabel('');
              }}
              className="text-xs text-primary hover:underline font-semibold ml-1"
            >
              Limpar filtros
            </button>
          )}
        </div>
      </div>

      {/* Tela de Loading */}
      {isLoading ? (
        <div className="min-h-[50vh] flex items-center justify-center">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
        </div>
      ) : filteredAlbums.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[30vh] text-muted-foreground gap-3">
          <Music className="h-12 w-12 text-muted-foreground opacity-50" />
          <p>Nenhum álbum encontrado com os filtros selecionados.</p>
        </div>
      ) : (
        <>
          <div className="reviews-grid-container">
            {filteredAlbums.map((album) => (
              <Link
                key={album.id}
                to={`/album/${album.id}`}
                className="review-album-card"
              >
                <div>
                  <div className="review-album-cover">
                    {album.cover_medium || album.cover_big ? (
                      <img
                        src={album.cover_medium || album.cover_big}
                        alt={album.title}
                        onError={handleCoverImageError}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                        <Music className="h-8 w-8" />
                      </div>
                    )}

                    <div className="review-card-score-badge">
                      <span className="review-card-score-number">
                        {album.communityRating.toFixed(1)}
                      </span>
                    </div>
                  </div>

                  <h3 className="review-album-title" title={album.title}>
                    {album.title}
                  </h3>

                  <p className="review-album-artist flex items-center gap-1.5 mt-1">
                    <User className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                    <span className="truncate">{album.artist.name}</span>
                  </p>

                  <div className="mt-2 space-y-1 text-[11px] text-muted-foreground">
                    <p className="flex items-center gap-1.5 truncate">
                      <Building2 className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                      <span className="truncate" title={album.label}>
                        {album.label}
                      </span>
                    </p>
                    <p className="flex items-center gap-1.5">
                      <Calendar className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                      <span>
                        {album.release_date?.substring(0, 4) || 'Desconhecido'}{' '}
                        ({album.genreName})
                      </span>
                    </p>
                    <p className="flex items-center gap-1.5">
                      <Headphones className="h-3 w-3 text-primary flex-shrink-0" />
                      <span>
                        {album.listenersCount.toLocaleString('pt-BR')} ouvintes
                      </span>
                    </p>
                  </div>
                </div>

                <div className="review-card-footer">
                  <span>{album.totalReviews} avaliações</span>
                  <span className="review-card-action">Detalhes →</span>
                </div>
              </Link>
            ))}
          </div>

          {/* Paginação */}
          <div className="pagination-container">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1 || isLoading}
              className="pagination-button"
            >
              <ChevronLeft className="h-4 w-4" /> Anterior
            </button>

            <span className="pagination-info">
              Página <strong className="text-foreground">{currentPage}</strong>
            </span>

            <button
              onClick={() => setCurrentPage((prev) => prev + 1)}
              disabled={albums.length < limit || isLoading}
              className="pagination-button"
            >
              Próxima <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </>
      )}
    </div>
  );
}
