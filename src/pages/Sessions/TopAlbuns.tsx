import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Disc, Headphones } from 'lucide-react';
import {
  type CatalogAlbum,
  getPopularAlbumsByInternalActivity,
} from '../../services/musicBrainz.service';
import { handleCoverImageError } from '../../services/coverArt.service';
import '../Artists/ArtistDetails/ArtistDetail.css';
import './TopAlbuns.css';

export function TopAlbuns() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('Todos');
  const [allAlbums, setAllAlbums] = useState<CatalogAlbum[]>(() =>
    getPopularAlbumsByInternalActivity(30)
  );

  useEffect(() => {
    const syncPopular = () => {
      setAllAlbums(getPopularAlbumsByInternalActivity(30));
    };
    window.addEventListener('musicpostr:albums-updated', syncPopular);
    return () =>
      window.removeEventListener('musicpostr:albums-updated', syncPopular);
  }, []);

  const genres = [
    'Todos',
    'Pop',
    'Rock',
    'Hip-Hop',
    'Eletrônica',
    'Indie',
    'R&B',
    'Samba e pagode',
  ];

  const filteredAlbums = allAlbums.filter((album) => {
    const matchesSearch =
      album.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      album.artist.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGenre =
      selectedGenre === 'Todos' ||
      album.genreName.toLowerCase() === selectedGenre.toLowerCase();
    return matchesSearch && matchesGenre;
  });

  const bannerBackdrop = allAlbums[0]?.cover_xl || allAlbums[0]?.cover_big;

  return (
    <div className="artist-detail-container">
      {/* Banner no Topo */}
      <div className="artist-banner-wrapper">
        <div
          className="artist-banner-bg"
          style={{ backgroundImage: `url(${bannerBackdrop})` }}
        />
        <div className="artist-banner-gradient" />

        <div className="artist-banner-content">
          <button className="artist-back-button" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4" /> Voltar
          </button>

          <div>
            <h1 className="text-3xl sm:text-4xl md:text-6xl font-black tracking-tight text-foreground drop-shadow-xs break-words">
              Álbuns Populares do Momento
            </h1>
            <p className="text-muted-foreground mt-2 text-sm md:text-base font-medium">
              Ranking baseado nas avaliações internas dos usuários e na
              quantidade de ouvintes na comunidade.
            </p>
          </div>
        </div>
      </div>

      <div className="artist-main-content">
        <div>
          <h2 className="section-title">
            <Disc className="h-6 w-6 text-primary" /> Ranking de Popularidade
            Interna
          </h2>

          <div className="top-albuns-filters">
            <input
              type="text"
              placeholder="Buscar por álbum ou artista..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />

            <div className="genre-filters">
              {genres.map((genre) => (
                <button
                  key={genre}
                  className={`genre-chip ${
                    selectedGenre === genre ? 'active' : ''
                  }`}
                  onClick={() => setSelectedGenre(genre)}
                >
                  {genre}
                </button>
              ))}
            </div>
          </div>

          {filteredAlbums.length > 0 ? (
            <div className="releases-grid">
              {filteredAlbums.map((album) => (
                <Link
                  key={album.id}
                  to={`/album/${album.id}`}
                  className="release-card group cursor-pointer"
                >
                  <div>
                    <div className="release-cover-box relative">
                      <img
                        src={album.cover_big || album.cover_medium}
                        alt={album.title}
                        onError={handleCoverImageError}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <span className="album-rating">
                        ★ {album.communityRating.toFixed(1)}
                      </span>
                    </div>
                    <h3 className="font-medium text-[var(--foreground)] text-sm line-clamp-1 group-hover:text-primary transition-colors">
                      {album.title}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      {album.artist.name}
                    </p>
                    <p className="text-[11px] text-muted-foreground mt-1 flex items-center gap-1">
                      <Headphones className="h-3 w-3 text-primary" />
                      {album.listenersCount.toLocaleString('pt-BR')} ouvintes •{' '}
                      {album.totalReviews} avaliações
                    </p>
                  </div>
                  <span className="release-tag">{album.genreName}</span>
                </Link>
              ))}
            </div>
          ) : (
            <div className="no-results">
              <p className="text-muted-foreground">
                Nenhum álbum encontrado para os critérios selecionados.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
