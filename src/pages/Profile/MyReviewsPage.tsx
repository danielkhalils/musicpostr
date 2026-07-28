import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, Trash2, Music } from 'lucide-react';
import './MyReviewsPage.css';

interface UserReview {
  id: number;
  albumTitle: string;
  artistName: string;
  coverUrl: string;
  rating: number;
  comment: string;
  date: string;
}

export function MyReviewsPage() {
  const [reviews, setReviews] = useState<UserReview[]>([
    {
      id: 1,
      albumTitle: "THIS IS... ICONA POP",
      artistName: "Icona Pop",
      coverUrl: "https://api.deezer.com/album/7446312/image",
      rating: 10,
      comment: "Uma obra-prima absoluta de design sonoro e atmosferas.",
      date: "24 de Mai, 2026"
    },
    {
      id: 2,
      albumTitle: "SOUR",
      artistName: "Olivia Rodrigo",
      coverUrl: "https://api.deezer.com/album/1002561451/image",
      rating: 9,
      comment: "Letras marcantes e produções impecáveis do início ao fim.",
      date: "18 de Mai, 2026"
    }
  ]);

  const handleDelete = (id: number) => {
    setReviews(reviews.filter(r => r.id !== id));
  };

  return (
    <div className="page-container">
      <div className="page-header-wrapper">
        <h1 className="page-title text-white">
          <Star className="h-8 w-8 text-primary fill-primary" /> Minhas Avaliações
        </h1>
        <p className="page-subtitle">
          Gerencie, edite ou remova as notas e opiniões que você compartilhou na comunidade.
        </p>
      </div>

      {reviews.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[30vh] text-zinc-500 gap-3">
          <Music className="h-12 w-12 text-zinc-700" />
          <p>Você ainda não publicou nenhuma avaliação.</p>
        </div>
      ) : (
        <div className="space-y-4 mt-6">
          {reviews.map((rev) => (
            <div key={rev.id} className="my-review-card">
              <div className="flex items-start gap-4">
                <img src={rev.coverUrl} alt={rev.albumTitle} className="my-review-thumb" />
                
                <div className="flex-1">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-1">
                    <div>
                      <h3 className="font-semibold text-white text-sm">{rev.albumTitle}</h3>
                      <p className="text-xs text-zinc-400">{rev.artistName}</p>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">
                        {rev.rating}/10
                      </span>
                      <span className="text-[11px] text-zinc-500">{rev.date}</span>
                    </div>
                  </div>

                  <p className="text-xs text-zinc-300 mt-3 italic">"{rev.comment}"</p>

                  <div className="flex items-center gap-3 mt-4 pt-3 border-t border-zinc-800/80">
                    <Link to={`/album/${rev.id}`} className="text-xs text-primary font-semibold hover:underline">
                      Ver Álbum →
                    </Link>
                    <button 
                      onClick={() => handleDelete(rev.id)} 
                      className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1 ml-auto transition-colors"
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