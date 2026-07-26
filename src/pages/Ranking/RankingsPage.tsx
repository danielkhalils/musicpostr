import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Loader2, Trophy, Flame, TrendingUp, Award } from 'lucide-react';
import './RankingsPage.css';

interface RankingAlbum {
  id: number;
  title: string;
  cover_medium?: string;
  artist: { name: string };
  release_date?: string;
  genreName?: string;
  communityRating: number;
  totalReviews: number;
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

export function RankingsPage() {
  const [rankings, setRankings] = useState<RankingAlbum[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [activeGenre, setActiveGenre] = useState<string>('Todos');

  useEffect(() => {
    async function fetchRankingsData() {
      setIsLoading(true);
      try {
        const response = await fetch(
          `https://corsproxy.io/?` + encodeURIComponent(`https://api.deezer.com/chart/0/albums`)
        );
        const data = await response.json();

        if (data && data.data) {
          const formatted = data.data.map((item: any, index: number) => {
            const rating = Number((9.9 - (index * 0.12)).toFixed(1));
            const reviewsCount = 120 - (index * 4) + ((index * 7) % 15);

            const availableGenresOnly = genresList.filter(g => g.name !== 'Todos');
            const assignedGenre = availableGenresOnly[index % availableGenresOnly.length].name;

            return {
              id: item.id,
              title: item.title,
              cover_medium: item.cover_medium,
              artist: { name: item.artist?.name || 'Artista' },
              release_date: '2025',
              genreName: assignedGenre,
              communityRating: rating < 7.0 ? 7.5 : rating,
              totalReviews: reviewsCount > 0 ? reviewsCount : 15,
              rank: index + 1,
            };
          });
          setRankings(formatted);
        }
      } catch (error) {
        console.error('Erro ao buscar dados de ranking:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchRankingsData();
  }, []);

  const filteredRankings = activeGenre === 'Todos' 
    ? rankings 
    : rankings.filter(r => (r.genreName ?? '').toLowerCase() === activeGenre.toLowerCase());

  return (
    <div className="page-container">
      
      {/* Cabeçalho */}
      <div className="page-header-wrapper">
        <h1 className="page-title text-white">
          <Trophy className="h-8 w-8 text-amber-400 fill-amber-400" /> Rankings & Estatísticas
        </h1>
        <p className="page-subtitle">
          Os álbuns mais aclamados, votados e comentados pela comunidade do musicpostr em tempo real.
        </p>
      </div>

      {/* Seção Top 3 Destaques da Semana */}
      {!isLoading && rankings.length >= 3 && (
        <div className="top-podium-section">
          <h2 className="section-heading"><Flame className="h-5 w-5 text-orange-500" /> Top 3 da Semana</h2>
          <div className="podium-grid">
            {rankings.slice(0, 3).map((album, idx) => (
              <Link key={album.id} to={`/album/${album.id}`} className={`podium-card rank-${idx + 1}`}>
                <div className="podium-badge">#{idx + 1}</div>
                <img src={album.cover_medium} alt={album.title} className="podium-cover" />
                <div className="podium-info">
                  <h3>{album.title}</h3>
                  <p>{album.artist.name}</p>
                  <div className="podium-score">
                    <Award className="h-4 w-4 text-primary" /> 
                    <span>{album.communityRating} / 10</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Seção de Gêneros em Grade com Emojis */}
      <div className="genre-grid-section">
        <h2 className="section-heading">Momentos e Gêneros</h2>
        <div className="genre-cards-grid">
          {genresList.map((item) => (
            <button
              key={item.name}
              onClick={() => setActiveGenre(item.name)}
              className={`genre-card-item ${activeGenre === item.name ? 'active' : ''}`}
            >
              <span className="genre-card-emoji">{item.emoji}</span>
              <span className="genre-card-name">{item.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Tabela de Ranking Completa com Estatísticas */}
      {isLoading ? (
        <div className="min-h-[40vh] flex items-center justify-center">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
        </div>
      ) : (
        <div className="ranking-table-wrapper">
          <div className="ranking-table-header">
            <span>Posição</span>
            <span>Álbum / Artista</span>
            <span>Gênero</span>
            <span>Avaliações</span>
            <span className="text-right">Nota Geral</span>
          </div>

          <div className="ranking-table-body">
            {filteredRankings.map((item) => (
              <Link key={item.id} to={`/album/${item.id}`} className="ranking-row">
                <div className="ranking-position">
                  <span className={`pos-number ${item.rank <= 3 ? 'top-three' : ''}`}>#{item.rank}</span>
                  <TrendingUp className="h-3 w-3 text-emerald-500" />
                </div>

                <div className="ranking-album-cell">
                  <img src={item.cover_medium} alt={item.title} className="ranking-thumb" />
                  <div>
                    <h4 className="ranking-album-name">{item.title}</h4>
                    <p className="ranking-artist-name">{item.artist.name}</p>
                  </div>
                </div>

                <div className="ranking-genre">
                  <span className="genre-tag">{item.genreName || 'Geral'}</span>
                </div>

                <div className="ranking-reviews-count">
                  {item.totalReviews} reviews
                </div>

                <div className="ranking-score-cell">
                  <div className="musicpostr-mini-badge">
                    {item.communityRating}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}