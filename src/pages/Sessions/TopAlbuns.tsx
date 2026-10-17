import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Disc } from 'lucide-react';
import "../Artists/ArtistDetails/ArtistDetail.css";
import './TopAlbuns.css';

// Exemplo de interface para os álbuns
interface Album {
  id: string;
  title: string;
  artist: string;
  coverUrl: string;
  rating: number;
  releaseYear: number;
  genre: string;
}

export function TopAlbuns() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('Todos');

  // Lista expandida para a página de listagem completa
  const allAlbums: Album[] = [
    {
      id: '1',
      title: 'After Hours',
      artist: 'The Weeknd',
      coverUrl: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=300&h=300&fit=crop',
      rating: 4.8,
      releaseYear: 2020,
      genre: 'Pop',
    },
    {
      id: '2',
      title: 'Future Nostalgia',
      artist: 'Dua Lipa',
      coverUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300&h=300&fit=crop',
      rating: 4.7,
      releaseYear: 2020,
      genre: 'Pop',
    },
    {
      id: '3',
      title: 'Un Verano Sin Ti',
      artist: 'Bad Bunny',
      coverUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=300&h=300&fit=crop',
      rating: 4.9,
      releaseYear: 2022,
      genre: 'Urbano',
    },
    {
      id: '4',
      title: 'RENAISSANCE',
      artist: 'Beyoncé',
      coverUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop',
      rating: 4.9,
      releaseYear: 2022,
      genre: 'Pop',
    },
    {
      id: '5',
      title: 'Midnights',
      artist: 'Taylor Swift',
      coverUrl: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=300&h=300&fit=crop',
      rating: 4.6,
      releaseYear: 2022,
      genre: 'Pop',
    },
    {
      id: '6',
      title: 'SOS',
      artist: 'SZA',
      coverUrl: 'https://images.unsplash.com/photo-1526478806334-5fd488fcaabc?w=300&h=300&fit=crop',
      rating: 4.8,
      releaseYear: 2022,
      genre: 'R&B',
    },
  ];

  const genres = ['Todos', 'Pop', 'Urbano', 'R&B'];

  const filteredAlbums = allAlbums.filter((album) => {
    const matchesSearch =
      album.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      album.artist.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGenre = selectedGenre === 'Todos' || album.genre === selectedGenre;
    return matchesSearch && matchesGenre;
  });

  const bannerBackdrop = [...allAlbums].sort((a, b) => b.rating - a.rating)[0]?.coverUrl;

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
            {/* Subtítulo espelhado no padrão do ArtistDetail */}
            <p className="text-muted-foreground mt-2 text-sm md:text-base font-medium">
              Explore a listagem completa dos lançamentos e álbuns mais aclamados pela comunidade e pela crítica.
            </p>
          </div>
        </div>
      </div>

      <div className="artist-main-content">
        <div>
          <h2 className="section-title">
            <Disc className="h-6 w-6 text-primary" /> Ranking de Álbuns
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
                  className={`genre-chip ${selectedGenre === genre ? 'active' : ''}`}
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
                <div key={album.id} className="release-card group cursor-pointer">
                  <div>
                    <div className="release-cover-box relative">
                      <img
                        src={album.coverUrl}
                        alt={album.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <span className="album-rating">★ {album.rating.toFixed(1)}</span>
                    </div>
                    <h3 className="font-medium text-[var(--foreground)] text-sm line-clamp-1 group-hover:text-primary transition-colors">
                      {album.title}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-1">{album.artist}</p>
                    <p className="text-xs text-muted-foreground mt-1">{album.releaseYear}</p>
                  </div>
                  <span className="release-tag">{album.genre}</span>
                </div>
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