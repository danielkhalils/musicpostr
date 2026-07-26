import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Loader2, Award, Music, Search, Calendar, User, Building2, ChevronLeft, ChevronRight, Filter } from 'lucide-react';
import './ReviewsPage.css';

interface AlbumReviewItem {
  id: number;
  title: string;
  cover_medium?: string;
  cover_big?: string;
  release_date?: string;
  genreName?: string;
  artist: {
    name: string;
  };
  label?: string;
  communityRating: number;
  totalReviews: number;
}

export function ReviewsPage() {
  const [albums, setAlbums] = useState<AlbumReviewItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [debouncedSearch, setDebouncedSearch] = useState<string>('');
  
  const [selectedYear, setSelectedYear] = useState<string>('');
  const [selectedGenre, setSelectedGenre] = useState<string>('');
  const [selectedLabel, setSelectedLabel] = useState<string>('');

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalResults, setTotalResults] = useState<number>(0);
  const limit = 15;

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setCurrentPage(1);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    async function fetchAlbums() {
      setIsLoading(true);
      try {
        const index = (currentPage - 1) * limit;
        let url = '';

        if (debouncedSearch.trim() !== '') {
          url = `https://corsproxy.io/?` + encodeURIComponent(`https://api.deezer.com/search/album?q=${encodeURIComponent(debouncedSearch)}&index=${index}&limit=${limit}`);
        } else {
          url = `https://corsproxy.io/?` + encodeURIComponent(`https://api.deezer.com/chart/0/albums?index=${index}&limit=${limit}`);
        }

        const response = await fetch(url);
        const data = await response.json();

        if (data && data.data) {
          setTotalResults(data.total || 50);

          const detailedAlbumsPromises = data.data.map(async (item: any, idx: number) => {
            const uniqueIndex = index + idx;
            try {
              const detailRes = await fetch(
                `https://corsproxy.io/?` + encodeURIComponent(`https://api.deezer.com/album/${item.id}`)
              );
              const detailData = await detailRes.json();

              const mockRating = Number((7.0 + ((uniqueIndex * 37) % 29) / 10).toFixed(1));
              const mockTotalReviews = (uniqueIndex * 13) % 45 + 5;

              return {
                id: item.id,
                title: item.title,
                cover_medium: item.cover_medium || detailData.cover_medium,
                cover_big: item.cover_big || detailData.cover_big,
                release_date: detailData.release_date || '2025',
                genreName: detailData.genres?.data?.[0]?.name || 'Pop / Rock',
                label: detailData.label || 'Independente',
                artist: {
                  name: item.artist?.name || 'Artista Desconhecido',
                },
                communityRating: mockRating > 10 ? 9.9 : mockRating,
                totalReviews: mockTotalReviews,
              };
            } catch (err) {
              return {
                id: item.id,
                title: item.title,
                cover_medium: item.cover_medium,
                cover_big: item.cover_big,
                release_date: '2025',
                genreName: 'Pop',
                label: 'Independente',
                artist: { name: item.artist?.name || 'Artista' },
                communityRating: 8.0,
                totalReviews: 10,
              };
            }
          });

          const resolvedAlbums = await Promise.all(detailedAlbumsPromises);
          setAlbums(resolvedAlbums);
        } else {
          setAlbums([]);
        }
      } catch (error) {
        console.error('Erro ao buscar álbuns:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchAlbums();
  }, [debouncedSearch, currentPage]);

  const availableYears = Array.from(
    new Set(albums.map((a) => a.release_date?.substring(0, 4)).filter(Boolean))
  ).sort().reverse();

  const availableGenres = Array.from(
    new Set(albums.map((a) => a.genreName).filter(Boolean))
  ).sort();

  const availableLabels = Array.from(
    new Set(albums.map((a) => a.label).filter(Boolean))
  ).sort();

  const filteredAlbums = albums.filter((album) => {
    const albumYear = album.release_date?.substring(0, 4) || '';
    const matchYear = selectedYear ? albumYear === selectedYear : true;
    const matchGenre = selectedGenre ? album.genreName === selectedGenre : true;
    const matchLabel = selectedLabel ? album.label === selectedLabel : true;
    return matchYear && matchGenre && matchLabel;
  });

  return (
    <div className="reviews-container">
      <div className="reviews-header-wrapper">
        <div>
          <h1 className="reviews-title text-white">
            <Award className="h-8 w-8 text-white stroke-[2.5]" /> Avaliações da Comunidade
          </h1>
          <p className="reviews-subtitle">
            Explore álbuns, utilize os filtros por ano, gênero e gravadora para refinar suas descobertas.
          </p>
        </div>

        {/* Barra de Pesquisa */}
        <div className="reviews-search-wrapper">
          <Search className="reviews-search-icon" />
          <input
            type="text"
            placeholder="Pesquisar álbum ou artista..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="reviews-search-input"
          />
        </div>
      </div>

      {/* Painel de Filtros Básicos */}
      <div className="reviews-filter-bar">
        <div className="flex items-center gap-2 text-xs font-semibold text-white">
          <Filter className="h-4 w-4 text-white" /> Filtrar por:
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
            value={selectedGenre}
            onChange={(e) => setSelectedGenre(e.target.value)}
            className="reviews-select-filter"
          >
            <option value="">Todos os Gêneros</option>
            {availableGenres.map((genre) => (
              <option key={genre} value={genre}>
                {genre}
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

          {(selectedYear || selectedGenre || selectedLabel) && (
            <button
              onClick={() => {
                setSelectedYear('');
                setSelectedGenre('');
                setSelectedLabel('');
              }}
              className="text-xs text-primary hover:underline font-semibold ml-1"
            >
              Limpar filtros
            </button>
          )}
        </div>
      </div>

      {/* Tela de Loading ao carregar ou buscar dados */}
      {isLoading ? (
        <div className="min-h-[50vh] flex items-center justify-center">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
        </div>
      ) : filteredAlbums.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[30vh] text-zinc-500 gap-3">
          <Music className="h-12 w-12 text-zinc-700" />
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
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-zinc-600">
                        <Music className="h-8 w-8" />
                      </div>
                    )}

                    <div className="review-card-score-badge">
                      <span className="review-card-score-number">{album.communityRating}</span>
                    </div>
                  </div>

                  <h3 className="review-album-title" title={album.title}>
                    {album.title}
                  </h3>
                  
                  <p className="review-album-artist flex items-center gap-1.5 mt-1">
                    <User className="h-3 w-3 text-zinc-500 flex-shrink-0" />
                    <span className="truncate">{album.artist.name}</span>
                  </p>

                  <div className="mt-2 space-y-1 text-[11px] text-zinc-400">
                    <p className="flex items-center gap-1.5 truncate">
                      <Building2 className="h-3 w-3 text-zinc-500 flex-shrink-0" />
                      <span className="truncate" title={album.label}>{album.label}</span>
                    </p>
                    <p className="flex items-center gap-1.5">
                      <Calendar className="h-3 w-3 text-zinc-500 flex-shrink-0" />
                      <span>{album.release_date?.substring(0, 4) || 'Desconhecido'} ({album.genreName})</span>
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
              Página <strong className="text-white">{currentPage}</strong>
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