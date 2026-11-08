import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Loader2,
  Star,
  Music,
  Clock,
  MessageSquare,
  ThumbsUp,
  ChevronDown,
  ChevronUp,
  ArrowLeft,
  Maximize2,
  Headphones,
  Heart,
} from 'lucide-react';
import { Button } from '../../../components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../../../components/ui/dialog';
import {
  findAlbumCoverArt,
  handleCoverImageError,
  type CoverArtResult,
} from '../../../services/coverArt.service';
import {
  type CatalogAlbum,
  type AlbumUserReview,
  getInstantAlbumPreview,
  fetchAlbumDetailsFromMusicBrainz,
  submitInternalAlbumReview,
  toggleAlbumListened,
  toggleFavoriteAlbum,
} from '../../../services/musicBrainz.service';
import './AlbumDetails.css';

const genZPhrases: { [key: number]: { text: string; color: string } } = {
  0: { text: 'Dê sua nota para o álbum...', color: 'var(--muted-foreground)' },
  1: { text: '💀 Intakável, horrível de ouvir', color: '#ef4444' },
  2: { text: '🗑️ Muito fraco, total decepção', color: '#ef4444' },
  3: { text: '😬 Bem ruinzinho, não curti', color: '#f97316' },
  4: { text: '🥱 Meio sem graça, passa batido', color: '#f97316' },
  5: { text: '😐 Mediano, nada demais', color: '#eab308' },
  6: { text: '🎧 Bonzinho, dá para curtir', color: '#eab308' },
  7: { text: '🔥 Muito bom, curti bastante!', color: '#84cc16' },
  8: { text: '✨ Incrível, viciante demais', color: '#84cc16' },
  9: { text: '🛐 Obra-prima, perfeito do início ao fim', color: '#10b981' },
  10: { text: '🤯 Lendário! Simplesmente impecável!', color: '#10b981' },
};

export function AlbumDetails() {
  const { id } = useParams<{ id: string }>();

  // Renderização otimista instantânea (0ms) se o álbum já estiver em memória/catálogo
  const [album, setAlbum] = useState<CatalogAlbum | null>(() =>
    id ? getInstantAlbumPreview(id) : null
  );
  const [isLoading, setIsLoading] = useState<boolean>(() =>
    id ? !getInstantAlbumPreview(id) : true
  );
  const [isLoadingTracks, setIsLoadingTracks] = useState<boolean>(false);

  const [rating, setRating] = useState<number>(0);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [reviewText, setReviewText] = useState<string>('');

  const [showAllReviews, setShowAllReviews] = useState<boolean>(false);

  // Visualizador de capa em alta resolução (Cover Art Archive)
  const [isCoverViewerOpen, setIsCoverViewerOpen] = useState<boolean>(false);
  const [coverSide, setCoverSide] = useState<'front' | 'back'>('front');
  const [coverArt, setCoverArt] = useState<CoverArtResult | null>(null);
  const [isLoadingCoverArt, setIsLoadingCoverArt] = useState<boolean>(false);
  const [coverLoadError, setCoverLoadError] = useState<boolean>(false);

  const [submittedReviews, setSubmittedReviews] = useState<AlbumUserReview[]>(
    () => (id ? getInstantAlbumPreview(id)?.reviews || [] : [])
  );

  useEffect(() => {
    let isMounted = true;
    if (!id) return;

    const preview = getInstantAlbumPreview(id);
    setCoverArt(null);

    if (preview) {
      setAlbum(preview);
      setSubmittedReviews(preview.reviews || []);
      setIsLoading(false);
      // Se já tiver as músicas pré-carregadas, não precisa buscar nada na rede!
      if (preview.tracks && preview.tracks.data.length > 0) {
        setIsLoadingTracks(false);
        return;
      }
      setIsLoadingTracks(true);
    } else {
      setIsLoading(true);
    }

    fetchAlbumDetailsFromMusicBrainz(id)
      .then((data) => {
        if (!isMounted) return;
        if (data) {
          setAlbum(data);
          setSubmittedReviews(data.reviews || []);
        }
      })
      .catch((error) => {
        console.error('Erro ao buscar detalhes do álbum no MusicBrainz:', error);
      })
      .finally(() => {
        if (isMounted) {
          setIsLoading(false);
          setIsLoadingTracks(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [id]);

  const handlePostReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!album) return;
    if (!reviewText.trim() && rating === 0) return;

    const updatedAlbum = submitInternalAlbumReview(
      album,
      rating || 8,
      reviewText || 'Avaliação sem comentário escrito.'
    );

    setAlbum({
      ...updatedAlbum,
      tracks: album.tracks,
    });
    setSubmittedReviews(updatedAlbum.reviews || []);
    setReviewText('');
    setRating(0);
  };

  const handleToggleListened = () => {
    if (!album) return;
    const updated = toggleAlbumListened(album);
    setAlbum({
      ...updated,
      tracks: album.tracks,
    });
  };

  const handleToggleFavorite = () => {
    if (!album) return;
    const isFav = toggleFavoriteAlbum(album);
    setAlbum({
      ...album,
      isFavorite: isFav,
    });
  };

  const formatDuration = (seconds: number) => {
    if (!seconds) return '—:—';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  const averageRating = album
    ? album.communityRating.toFixed(1)
    : submittedReviews.length > 0
      ? (
          submittedReviews.reduce((acc, curr) => acc + curr.rating, 0) /
          submittedReviews.length
        ).toFixed(1)
      : '0.0';

  if (isLoading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!album) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center bg-background text-muted-foreground gap-4">
        <p>Álbum não encontrado.</p>
        <Link to="/artistas">
          <Button variant="outline">Voltar para Artistas</Button>
        </Link>
      </div>
    );
  }

  const coverImage = album.cover_xl || album.cover_big || album.cover_medium;
  const artistId = album.artist?.id || '';
  const artistName = album.artist?.name || 'Artista';

  const handleCoverClick = () => {
    setIsCoverViewerOpen(true);
    setCoverSide('front');
    setCoverLoadError(false);
    if (!coverArt && !isLoadingCoverArt) {
      setIsLoadingCoverArt(true);
      findAlbumCoverArt(album.title, artistName, album.id, album.releaseId)
        .then((result) => setCoverArt(result))
        .catch((error) => {
          console.error('Erro ao buscar capa no Cover Art Archive:', error);
          setCoverArt(null);
        })
        .finally(() => setIsLoadingCoverArt(false));
    }
  };

  const handleSelectSide = (side: 'front' | 'back') => {
    if (side === 'back' && !coverArt?.backUrl) return;
    setCoverSide(side);
    setCoverLoadError(false);
  };

  const activeCoverUrl =
    coverArt && !coverLoadError
      ? coverSide === 'front'
        ? coverArt.frontUrl
        : coverArt.backUrl ?? null
      : coverImage ?? null;

  const activeScore = hoverRating || rating;
  const currentGenZ = genZPhrases[activeScore] || genZPhrases[0];

  const displayedReviews = showAllReviews
    ? submittedReviews
    : submittedReviews.slice(0, 3);

  const recordTypeLabel =
    album.record_type === 'ep'
      ? 'EP Oficial'
      : album.record_type === 'single'
        ? 'Single Oficial'
        : 'Álbum Oficial';

  return (
    <div className="album-detail-container">
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

        {/* Bloco Superior Dividido */}
        <div className="album-hero-content-grid">
          <div className="album-hero-left">
            <div className="w-full">
              <Link
                to={artistId ? `/artista/${artistId}` : '/artistas'}
                className="album-back-link"
              >
                <ArrowLeft className="h-3.5 w-3.5" /> Voltar para o Artista
              </Link>
            </div>

            <div className="album-hero-main-content">
              <div
                className="album-cover-container"
                role="button"
                tabIndex={0}
                aria-label={`Ver capa de ${album.title} em alta resolução`}
                onClick={handleCoverClick}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleCoverClick();
                  }
                }}
                title="Clique para ver a capa em alta resolução"
              >
                {coverImage ? (
                  <img
                    src={coverImage}
                    alt={album.title}
                    decoding="async"
                    onError={handleCoverImageError}
                    className="album-cover-image"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                    <Music className="h-12 w-12" />
                  </div>
                )}
                <div className="album-cover-hd-overlay">
                  <Maximize2 className="h-3.5 w-3.5" /> Ver capa em HD
                </div>
              </div>

              <div className="album-info-wrapper">
                <h1 className="album-title">{album.title}</h1>
                {artistId ? (
                  <Link
                    to={`/artista/${artistId}`}
                    className="album-artist-name hover:text-primary transition-colors inline-block"
                  >
                    {artistName}
                  </Link>
                ) : (
                  <p className="album-artist-name">{artistName}</p>
                )}

                <div className="album-metadata flex-wrap">
                  <span>
                    Lançamento:{' '}
                    {album.release_date?.substring(0, 4) || 'Desconhecido'}
                  </span>
                  <span>•</span>
                  <span>{recordTypeLabel}</span>
                  <span>•</span>
                  <span>
                    {album.listenersCount.toLocaleString('pt-BR')} ouvintes
                  </span>
                  <span>•</span>
                  <span>{album.totalReviews} avaliações</span>
                </div>

                {/* Ações rápidas internas do usuário (Ouvido / Favorito) */}
                <div className="flex flex-wrap items-center gap-2 mt-3">
                  <Button
                    type="button"
                    size="sm"
                    variant={album.listenedByMe ? 'default' : 'outline'}
                    onClick={handleToggleListened}
                    className="rounded-full text-xs h-8 px-4 gap-1.5 cursor-pointer"
                  >
                    <Headphones className="h-3.5 w-3.5" />
                    {album.listenedByMe ? 'Já ouvi ✓' : 'Marcar como ouvido'}
                  </Button>

                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={handleToggleFavorite}
                    className={`rounded-full text-xs h-8 px-4 gap-1.5 cursor-pointer ${
                      album.isFavorite
                        ? 'border-rose-500/50 text-rose-500 bg-rose-500/10'
                        : ''
                    }`}
                  >
                    <Heart
                      className={`h-3.5 w-3.5 ${
                        album.isFavorite ? 'fill-rose-500 text-rose-500' : ''
                      }`}
                    />
                    {album.isFavorite ? 'Favoritado' : 'Favoritar'}
                  </Button>
                </div>

                <div className="streaming-wrapper">
                  <p className="text-xs text-foreground font-semibold mb-2">
                    Ouvir no Streaming:
                  </p>
                  <div className="streaming-links-container">
                    <a
                      href={`https://music.youtube.com/search?q=${encodeURIComponent(
                        `${album.title} ${artistName}`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="streaming-button youtube"
                    >
                      <svg
                        className="streaming-svg-icon"
                        viewBox="0 0 24 24"
                        fill="#ff0000"
                      >
                        <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm4.5 12.8-6 3.5c-.32.18-.72-.05-.72-.42V8.7c0-.37.4-.6.72-.42l6 3.5c.32.19.32.65 0 .84z" />
                      </svg>
                      YouTube Music
                    </a>
                    <a
                      href={`https://music.apple.com/us/search?term=${encodeURIComponent(
                        `${album.title} ${artistName}`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="streaming-button apple"
                    >
                      <svg
                        className="streaming-svg-icon"
                        viewBox="0 0 24 24"
                        fill="#fa2d4b"
                      >
                        <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.72c.57-.69 1.05-1.65.93-2.62-.92.04-2.03.62-2.69 1.39-.53.61-.99 1.59-.87 2.55 1.03.08 2.06-.51 2.63-1.32z" />
                      </svg>
                      Apple Music
                    </a>
                    <a
                      href={`https://open.spotify.com/search/${encodeURIComponent(
                        `${album.title} ${artistName}`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="streaming-button spotify"
                    >
                      <svg
                        className="streaming-svg-icon"
                        viewBox="0 0 24 24"
                        fill="#1db954"
                      >
                        <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.6 0 12 0zm5.521 17.34c-.24.359-.72.48-1.08.24-2.999-1.8-6.78-2.22-11.22-1.2-.42.12-.84-.18-.96-.6-.12-.42.18-.84.601-.96 4.801-1.14 9.001-.66 12.36 1.38.36.24.48.72.3 1.08zm1.44-3.84c-.3.48-.9.66-1.38.36-3.42-2.1-8.58-2.7-12.6-1.47-.54.18-1.14-.12-1.32-.66-.18-.54.12-1.14.66-1.32 4.62-1.38 10.32-.72 14.34 1.68.48.3.66.9.3 1.35zm.12-4.08C14.88 7.26 8.64 7.08 5.04 8.16c-.66.18-1.38-.18-1.56-.84-.18-.66.18-1.38.84-1.56 4.2-1.26 11.22-1.08 15.66 1.62.6.36.78 1.14.42 1.74-.36.6-1.14.78-1.74.42z" />
                      </svg>
                      Spotify
                    </a>
                    <a
                      href={`https://tidal.com/search?q=${encodeURIComponent(
                        `${album.title} ${artistName}`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="streaming-button tidal"
                    >
                      <svg
                        className="streaming-svg-icon"
                        viewBox="0 0 24 24"
                        fill="#00ffff"
                      >
                        <path d="M12 3.86L8.14 7.71 4.29 3.86 8.14 0 12 3.86zm7.71 7.71L15.86 15.43 12 11.57l3.86-3.86 3.85 3.86zm-7.71 7.72l-3.86-3.86 3.86-3.86 3.86 3.86-3.86 3.86zm7.71-7.72l-3.86-3.86-3.85 3.85 3.85 3.86 3.86-3.85z" />
                      </svg>
                      Tidal
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Direita do Topo (Nota da Comunidade) */}
          <div className="musicpostr-score-wrapper">
            <span className="musicpostr-label">Nota da Comunidade</span>
            <div className="musicpostr-score-badge">
              <span className="musicpostr-score-number">{averageRating}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bloco Principal Inferior */}
      <div className="album-main-layout">
        {/* Esquerda da Base (Rate + Músicas) */}
        <div className="space-y-6">
          <div className="album-review-card">
            <div className="review-card-header">
              <h2 className="review-card-title">Rate This Album</h2>
              <span className="review-score-badge">
                {rating > 0 ? `${rating}/10` : '—/10'}
              </span>
            </div>

            <div>
              <span
                className="gen-z-review-badge"
                style={{
                  color: currentGenZ.color,
                  borderColor: `${currentGenZ.color}40`,
                }}
              >
                {currentGenZ.text}
              </span>
            </div>

            <div className="star-rating-container">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((star: number) => (
                <Star
                  key={star}
                  data-star={star}
                  className={`star-icon ${
                    (hoverRating || rating) >= star ? 'active' : ''
                  }`}
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
                <Button
                  type="submit"
                  className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-6"
                >
                  Post Review
                </Button>
              </div>
            </form>
          </div>

          {album.tracks &&
          album.tracks.data &&
          album.tracks.data.length > 0 ? (
            <div className="tracklist-section">
              <h3 className="tracklist-title">
                <Clock className="h-5 w-5 text-primary" /> Músicas do Álbum (
                {album.tracks.data.length})
              </h3>
              <div className="space-y-1">
                {album.tracks.data.map((track, index: number) => (
                  <div key={track.id} className="track-item">
                    <div className="track-info">
                      <span className="track-number">{index + 1}</span>
                      <span className="track-name">{track.title}</span>
                    </div>
                    <span className="track-duration">
                      {formatDuration(track.duration)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ) : isLoadingTracks ? (
            <div className="tracklist-section flex items-center justify-center py-8 gap-2 text-xs text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin text-primary" />
              Carregando lista de faixas...
            </div>
          ) : null}
        </div>

        {/* Direita da Base (Community Feed) */}
        <div className="sidebar-section">
          <div className="community-feed-card">
            <h3 className="community-feed-title">Community Feed</h3>

            <div className="space-y-4">
              {displayedReviews.map((rev: AlbumUserReview) => {
                const reviewGenZ =
                  genZPhrases[Math.round(rev.rating)] || genZPhrases[0];

                return (
                  <div key={rev.id} className="feed-item">
                    <div className="flex justify-between items-start mb-1">
                      <p className="feed-user">User '{rev.user}'</p>
                      <span
                        className="text-xs font-bold px-2 py-0.5 rounded-full"
                        style={{
                          color: reviewGenZ.color,
                          backgroundColor: `${reviewGenZ.color}15`,
                        }}
                      >
                        {rev.rating}/10
                      </span>
                    </div>

                    <div className="flex gap-0.5 my-1">
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((star) => (
                        <Star
                          key={star}
                          data-star={star}
                          className={`w-3 h-3 star-icon ${
                            rev.rating >= star ? 'active' : ''
                          }`}
                        />
                      ))}
                    </div>

                    <p
                      className="text-xs font-medium my-1"
                      style={{ color: reviewGenZ.color }}
                    >
                      {reviewGenZ.text}
                    </p>

                    <p className="feed-text mt-1">"{rev.comment}"</p>

                    <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                      <button className="flex items-center gap-1 hover:text-foreground transition-colors">
                        <ThumbsUp className="h-3 w-3" /> Like
                      </button>
                      <button className="flex items-center gap-1 hover:text-foreground transition-colors">
                        <MessageSquare className="h-3 w-3" /> Comment
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {submittedReviews.length > 3 && (
              <button
                onClick={() => setShowAllReviews(!showAllReviews)}
                className="w-full mt-4 py-2 text-xs font-semibold text-muted-foreground hover:text-foreground bg-muted hover:bg-card border border-border rounded-lg flex items-center justify-center gap-1.5 transition-all"
              >
                {showAllReviews ? (
                  <>
                    <ChevronUp className="h-4 w-4" /> Ver menos notas
                  </>
                ) : (
                  <>
                    <ChevronDown className="h-4 w-4" /> Ver mais notas (
                    {submittedReviews.length - 3} a mais)
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Visualizador de Capa em Alta Resolução (Cover Art Archive) */}
      <Dialog open={isCoverViewerOpen} onOpenChange={setIsCoverViewerOpen}>
        <DialogContent className="max-w-xl gap-4 p-4 sm:p-5">
          <DialogHeader>
            <DialogTitle className="text-base">{album.title}</DialogTitle>
            <DialogDescription>
              {artistName} • Imagens em alta resolução via Cover Art Archive
            </DialogDescription>
          </DialogHeader>

          <div className="flex min-h-[20rem] items-center justify-center overflow-hidden rounded-lg border border-border bg-muted">
            {isLoadingCoverArt ? (
              <Loader2 className="h-10 w-10 animate-spin text-primary" />
            ) : activeCoverUrl ? (
              <img
                key={activeCoverUrl}
                src={activeCoverUrl}
                alt={
                  coverSide === 'front'
                    ? `Capa frontal de ${album.title}`
                    : `Verso de ${album.title}`
                }
                className="max-h-[60vh] w-auto object-contain"
                onError={() => setCoverLoadError(true)}
              />
            ) : (
              <div className="flex flex-col items-center gap-2 p-8 text-center text-muted-foreground">
                <Music className="h-8 w-8" />
                <p className="text-sm">
                  {coverLoadError
                    ? 'Não foi possível carregar a imagem do Cover Art Archive.'
                    : 'Não encontramos imagens em alta resolução para este álbum.'}
                </p>
              </div>
            )}
          </div>

          <div className="flex items-center justify-center gap-2">
            <Button
              size="sm"
              variant={coverSide === 'front' ? 'default' : 'outline'}
              className={`rounded-full px-5 ${
                coverSide === 'front'
                  ? ''
                  : 'border-zinc-300 bg-white/50 text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-900/50 dark:text-zinc-200 dark:hover:bg-zinc-800'
              }`}
              onClick={() => handleSelectSide('front')}
            >
              Frente
            </Button>
            <Button
              size="sm"
              variant={coverSide === 'back' ? 'default' : 'outline'}
              disabled={!coverArt?.backUrl}
              title={
                !coverArt?.backUrl
                  ? 'Verso não disponível para este álbum'
                  : undefined
              }
              className={`rounded-full px-5 ${
                coverSide === 'back' || !coverArt?.backUrl
                  ? ''
                  : 'border-zinc-300 bg-white/50 text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-900/50 dark:text-zinc-200 dark:hover:bg-zinc-800'
              }`}
              onClick={() => handleSelectSide('back')}
            >
              Verso
            </Button>
          </div>

          <p className="text-center text-xs text-muted-foreground">
            Fonte:{' '}
            <a
              href={
                coverArt
                  ? `https://coverartarchive.org/${coverArt.entityType || 'release'}/${coverArt.mbid}`
                  : `https://coverartarchive.org/release-group/${album.id}`
              }
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2 hover:text-foreground"
            >
              Cover Art Archive / MusicBrainz
            </a>
          </p>
        </DialogContent>
      </Dialog>
    </div>
  );
}
