import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Loader2, Star, Music, Clock, MessageSquare, ThumbsUp } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import './AlbumDetails.css';

interface Track {
  id: number;
  title: string;
  duration: number;
}

interface AlbumData {
  id: number;
  title: string;
  cover_xl?: string;
  cover_big?: string;
  release_date?: string;
  link?: string;
  artist?: {
    id: number;
    name: string;
  };
  tracks?: {
    data: Track[];
  };
  genre_id?: number;
}

interface Review {
  id: number;
  user: string;
  comment: string;
  rating: number;
}

// Frases Gen Z mapeadas por faixa de nota (1 a 10)
const genZPhrases: { [key: number]: { text: string; color: string } } = {
  0: { text: "Dê sua nota para o álbum...", color: "#a1a1aa" },
  1: { text: "💀 Intakável, horrível de ouvir", color: "#ef4444" },
  2: { text: "🗑️ Muito fraco, total decepção", color: "#ef4444" },
  3: { text: "😬 Bem ruinzinho, não curti", color: "#f97316" },
  4: { text: "🥱 Meio sem graça, passa batido", color: "#f97316" },
  5: { text: "😐 Mediano, nada demais", color: "#eab308" },
  6: { text: "🎧 Bonzinho, dá para curtir", color: "#eab308" },
  7: { text: "🔥 Muito bom, curti bastante!", color: "#84cc16" },
  8: { text: "✨ Incrível, viciante demais", color: "#84cc16" },
  9: { text: "🛐 Obra-prima, perfeito do início ao fim", color: "#10b981" },
  10: { text: "🤯 Lendário! Simplesmente impecável!", color: "#10b981" }
};

export function AlbumDetails() {
  const { id } = useParams<{ id: string }>();
  const [album, setAlbum] = useState<AlbumData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  const [rating, setRating] = useState<number>(0);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [reviewText, setReviewText] = useState<string>('');
  
  // Avaliações iniciais atualizadas com notas de 1 a 10
  const [submittedReviews, setSubmittedReviews] = useState<Review[]>([
    { id: 1, user: 'AnaBeat', comment: 'Uma obra-prima absoluta de design sonoro e atmosferas.', rating: 10 },
    { id: 2, user: 'JazzCat', comment: 'A produção desse álbum está anos luz à frente do seu tempo.', rating: 9 }
  ]);

  useEffect(() => {
    async function fetchAlbumDetails() {
      setIsLoading(true);
      try {
        const response = await fetch(
          `https://corsproxy.io/?` + encodeURIComponent(`https://api.deezer.com/album/${id}`)
        );
        const data = await response.json();
        if (data && data.id) {
          setAlbum(data);
        }
      } catch (error) {
        console.error('Erro ao buscar detalhes do álbum:', error);
      } finally {
        setIsLoading(false);
      }
    }

    if (id) {
      fetchAlbumDetails();
    }
  }, [id]);

  const handlePostReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewText.trim() && rating === 0) return;

    const newReview: Review = {
      id: Date.now(),
      user: 'Você',
      comment: reviewText || 'Avaliação sem comentário escrito.',
      rating: rating 
    };

    setSubmittedReviews([newReview, ...submittedReviews]);
    setReviewText('');
    setRating(0);
  };

  const formatDuration = (seconds: number) => {
    if (!seconds) return '0:00';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  if (isLoading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-zinc-950">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!album) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center bg-zinc-950 text-zinc-400 gap-4">
        <p>Álbum não encontrado.</p>
        <Link to="/artistas">
          <Button variant="outline">Voltar para Artistas</Button>
        </Link>
      </div>
    );
  }

  const coverImage = album.cover_xl || album.cover_big;
  const artistId = album.artist?.id || '';
  const artistName = album.artist?.name || 'Artista';

  const activeScore = hoverRating || rating;
  const currentGenZ = genZPhrases[activeScore] || genZPhrases[0];

  return (
    <div className="album-detail-container">
      
      <Link to={artistId ? `/artista/${artistId}` : '/artistas'} className="album-back-link">
        Voltar para o Artista
      </Link>

      <div className="album-hero-wrapper">
        {coverImage ? (
          <div 
            className="album-hero-bg"
            style={{ backgroundImage: `url(${coverImage})` }}
          />
        ) : (
          <div className="album-hero-fallback" />
        )}

        <div className="album-hero-gradient" />

        <div className="album-hero-content">
          <div className="album-cover-container">
            {coverImage ? (
              <img src={coverImage} alt={album.title} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-zinc-600">
                <Music className="h-12 w-12" />
              </div>
            )}
          </div>

          <div className="album-info">
            <h1 className="album-title">{album.title}</h1>
            <p className="album-artist-name">{artistName}</p>
            <div className="album-metadata">
              <span>Lançamento: {album.release_date?.substring(0, 4) || 'Desconhecido'}</span>
              <span>•</span>
              <span>Álbum Oficial</span>
            </div>

            {/* Links de Streaming */}
            <div className="mt-3">
              <p className="text-xs text-zinc-400 font-medium mb-2">Ouvir no Streaming:</p>
              <div className="streaming-links-container">
                {album.link && (
                  <a href={album.link} target="_blank" rel="noopener noreferrer" className="streaming-button deezer">
                    <svg className="streaming-svg-icon" viewBox="0 0 24 24" fill="#ff7300"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm4.8 17.6h-2.4V6.4h2.4v11.2zm-4.4 0h-2.4V9.6h2.4v8zm-4.4 0H5.6v-4.8h2.4v4.8z"/></svg>
                    Deezer
                  </a>
                )}
                <a href={`https://open.spotify.com/search/${encodeURIComponent(`${album.title} ${artistName}`)}`} target="_blank" rel="noopener noreferrer" className="streaming-button spotify">
                  <svg className="streaming-svg-icon" viewBox="0 0 24 24" fill="#1db954"><path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.6 0 12 0zm5.521 17.34c-.24.359-.72.48-1.08.24-2.999-1.8-6.78-2.22-11.22-1.2-.42.12-.84-.18-.96-.6-.12-.42.18-.84.601-.96 4.801-1.14 9.001-.66 12.36 1.38.36.24.48.72.3 1.08zm1.44-3.84c-.3.48-.9.66-1.38.36-3.42-2.1-8.58-2.7-12.6-1.47-.54.18-1.14-.12-1.32-.66-.18-.54.12-1.14.66-1.32 4.62-1.38 10.32-.72 14.34 1.68.48.3.66.9.3 1.35zm.12-4.08C14.88 7.26 8.64 7.08 5.04 8.16c-.66.18-1.38-.18-1.56-.84-.18-.66.18-1.38.84-1.56 4.2-1.26 11.22-1.08 15.66 1.62.6.36.78 1.14.42 1.74-.36.6-1.14.78-1.74.42z"/></svg>
                  Spotify
                </a>
                <a href={`https://music.apple.com/us/search?term=${encodeURIComponent(`${album.title} ${artistName}`)}`} target="_blank" rel="noopener noreferrer" className="streaming-button apple">
                  <svg className="streaming-svg-icon" viewBox="0 0 24 24" fill="#fa2d4b"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.72c.57-.69 1.05-1.65.93-2.62-.92.04-2.03.62-2.69 1.39-.53.61-.99 1.59-.87 2.55 1.03.08 2.06-.51 2.63-1.32z"/></svg>
                  Apple Music
                </a>
                <a href={`https://music.amazon.com/search/${encodeURIComponent(`${album.title} ${artistName}`)}`} target="_blank" rel="noopener noreferrer" className="streaming-button amazon">
                  <svg className="streaming-svg-icon" viewBox="0 0 24 24" fill="#ff9900"><path d="M15.93 15.65c-1.76 1.34-4.32 2.05-6.84 2.05-3.26 0-6.34-1.18-8.68-3.32-.23-.21-.04-.57.27-.47 3.23 1.03 6.74.88 9.87-.43 1.53-.64 2.9-1.51 4.06-2.57.26-.24.64.01.48.33-1.12 2.3-2.73 4.23-4.86 5.64zm7.04-3.8c-.21-.12-.46-.02-.58.19-1.04 1.83-2.61 3.42-4.57 4.57-.27.16-.62-.05-.53-.36.65-2.24.49-4.71-.46-6.83-.98-2.17-2.63-3.95-4.76-5.1-2.22-1.21-4.77-1.76-7.38-1.57-.31.02-.49-.31-.3-.55 3.25-4.14 9.17-4.73 13.06-1.34 2.54 2.22 3.96 5.37 5.52 8.41.14.28-.05.61-.37.6z"/></svg>
                  Amazon Music
                </a>
                <a href={`https://tidal.com/search?q=${encodeURIComponent(`${album.title} ${artistName}`)}`} target="_blank" rel="noopener noreferrer" className="streaming-button tidal">
                  <svg className="streaming-svg-icon" viewBox="0 0 24 24" fill="#00ffff"><path d="M12 3.86L8.14 7.71 4.29 3.86 8.14 0 12 3.86zm7.71 7.71L15.86 15.43 12 11.57l3.86-3.86 3.85 3.86zm-7.71 7.72l-3.86-3.86 3.86-3.86 3.86 3.86-3.86 3.86zm7.71-7.72l-3.86-3.86-3.85 3.85 3.85 3.86 3.86-3.85z"/></svg>
                  Tidal
                </a>
                <a href={`https://music.youtube.com/search?q=${encodeURIComponent(`${album.title} ${artistName}`)}`} target="_blank" rel="noopener noreferrer" className="streaming-button youtube">
                  <svg className="streaming-svg-icon" viewBox="0 0 24 24" fill="#ff0000"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm4.5 12.8-6 3.5c-.32.18-.72-.05-.72-.42V8.7c0-.37.4-.6.72-.42l6 3.5c.32.19.32.65 0 .84z"/></svg>
                  YouTube Music
                </a>
              </div>
            </div>

          </div>
        </div>
      </div>

      <div className="album-main-layout">
        
        <div className="space-y-6">
          
          <div className="album-review-card">
            <div className="review-card-header">
              <h2 className="review-card-title">Rate This Album</h2>
              <span className="review-score-badge">
                {rating > 0 ? `${rating}/10` : '—/10'}
              </span>
            </div>

            {/* Frase Gen Z Dinâmica baseada no Hover/Nota */}
            <div>
              <span className="gen-z-review-badge" style={{ color: currentGenZ.color, borderColor: `${currentGenZ.color}40` }}>
                {currentGenZ.text}
              </span>
            </div>

            <div className="star-rating-container">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((star: number) => (
                <Star
                  key={star}
                  data-star={star}
                  className={`star-icon ${(hoverRating || rating) >= star ? 'active' : ''}`}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setRating(star)}
                />
              ))}
            </div>

            <form onSubmit={handlePostReview}>
              <textarea
                placeholder="Compartilhe seus pensamentos sobre este álbum..."
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                className="review-textarea"
              />
              <div className="review-submit-wrapper">
                <Button type="submit" className="bg-primary hover:bg-primary/90 text-white rounded-full px-6">
                  Post Review
                </Button>
              </div>
            </form>
          </div>

          {album.tracks && album.tracks.data && album.tracks.data.length > 0 && (
            <div className="tracklist-section">
              <h3 className="tracklist-title">
                <Clock className="h-5 w-5 text-primary" /> Músicas do Álbum
              </h3>
              <div className="space-y-1">
                {album.tracks.data.map((track: Track, index: number) => (
                  <div key={track.id} className="track-item">
                    <div className="track-info">
                      <span className="track-number">{index + 1}</span>
                      <span className="track-name">{track.title}</span>
                    </div>
                    <span className="track-duration">{formatDuration(track.duration)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Community Feed Atualizado com Estrelas Coloridas e Frases Gen Z */}
        <div className="sidebar-section">
          <div className="community-feed-card">
            <h3 className="community-feed-title">Community Feed</h3>
            
            <div className="space-y-4">
              {submittedReviews.map((rev: Review) => {
                const reviewGenZ = genZPhrases[rev.rating] || genZPhrases[0];

                return (
                  <div key={rev.id} className="feed-item">
                    <div className="flex justify-between items-start mb-1">
                      <p className="feed-user">User '{rev.user}'</p>
                      <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ color: reviewGenZ.color, backgroundColor: `${reviewGenZ.color}15` }}>
                        {rev.rating}/10
                      </span>
                    </div>

                    {/* Estrelas miniaturizadas do review */}
                    <div className="flex gap-0.5 my-1">
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((star) => (
                        <Star
                          key={star}
                          data-star={star}
                          className={`w-3 h-3 star-icon ${rev.rating >= star ? 'active' : ''}`}
                        />
                      ))}
                    </div>

                    {/* Frase Gen Z do review */}
                    <p className="text-xs font-medium my-1" style={{ color: reviewGenZ.color }}>
                      {reviewGenZ.text}
                    </p>

                    <p className="feed-text mt-1">"{rev.comment}"</p>
                    
                    <div className="flex items-center gap-4 mt-2 text-xs text-zinc-500">
                      <button className="flex items-center gap-1 hover:text-white transition-colors">
                        <ThumbsUp className="h-3 w-3" /> Like
                      </button>
                      <button className="flex items-center gap-1 hover:text-white transition-colors">
                        <MessageSquare className="h-3 w-3" /> Comment
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}