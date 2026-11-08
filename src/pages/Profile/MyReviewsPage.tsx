import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, Trash2, Music, ArrowLeft } from 'lucide-react';
import {
  type MyReviewRecord,
  getMyReviews,
  deleteMyReview,
} from '../../services/musicBrainz.service';
import { handleCoverImageError } from '../../services/coverArt.service';
import './MyReviewsPage.css';

export function MyReviewsPage() {
  const [reviews, setReviews] = useState<MyReviewRecord[]>(() =>
    getMyReviews()
  );

  const handleDelete = (id: string) => {
    const updated = deleteMyReview(id);
    setReviews(updated);
  };

  return (
    <div className="page-container pb-12">
      <div className="mb-8">
        <Link
          to="/perfil"
          className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 mb-2 transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Voltar ao Perfil
        </Link>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <Star className="h-6 w-6 text-primary fill-primary" /> Minhas
          Avaliações
        </h1>
        <p className="text-xs text-muted-foreground mt-1">
          Gerencie, edite ou remova as notas e opiniões que você compartilhou na
          comunidade.
        </p>
      </div>

      {reviews.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[30vh] text-muted-foreground gap-3">
          <Music className="h-12 w-12 text-muted-foreground opacity-50" />
          <p>Você ainda não publicou nenhuma avaliação.</p>
        </div>
      ) : (
        <div className="my-reviews-list">
          {reviews.map((rev) => (
            <div key={rev.id} className="my-review-card">
              <div className="flex items-start gap-4">
                <img
                  src={rev.coverUrl}
                  alt={rev.albumTitle}
                  onError={handleCoverImageError}
                  className="my-review-thumb"
                />

                <div className="flex-1 min-w-0">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-1">
                    <div>
                      <h3 className="font-semibold text-foreground text-sm truncate">
                        {rev.albumTitle}
                      </h3>
                      <p className="text-xs text-muted-foreground truncate">
                        {rev.artistName}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">
                        {rev.rating}/10
                      </span>
                      <span className="text-[11px] text-muted-foreground">
                        {rev.date}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-foreground/85 mt-3 italic">
                    "{rev.comment}"
                  </p>

                  <div className="flex items-center gap-3 mt-4 pt-3 border-t border-border">
                    <Link
                      to={`/album/${rev.albumId}`}
                      className="text-xs text-primary font-semibold hover:underline py-1.5 pr-2"
                    >
                      Ver Álbum →
                    </Link>
                    <button
                      onClick={() => handleDelete(rev.id)}
                      className="text-xs text-red-500 hover:text-red-400 flex items-center gap-1 ml-auto p-2 -mr-2 transition-colors"
                    >
                      <Trash2 className="h-3.5 w-3.5" /> Excluir
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
