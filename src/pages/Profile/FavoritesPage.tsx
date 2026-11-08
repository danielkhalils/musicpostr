import { useState } from 'react';
import { Heart, Disc, ArrowLeft } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import {
  type FavoriteAlbumRecord,
  getFavoriteAlbums,
} from '../../services/musicBrainz.service';
import { handleCoverImageError } from '../../services/coverArt.service';
import './FavoritesPage.css';

export function FavoritesPage() {
  const { username } = useParams();
  const isVisiting = Boolean(username);

  const [favorites] = useState<FavoriteAlbumRecord[]>(() =>
    getFavoriteAlbums()
  );

  return (
    <div className="page-container pb-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <Link
            to="/perfil"
            className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 mb-2 transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Voltar ao Perfil
          </Link>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Heart className="h-6 w-6 text-rose-500 fill-rose-500/20" />
            {isVisiting
              ? `Álbuns Favoritos de @${username}`
              : 'Meus Álbuns Favoritos'}
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            {isVisiting
              ? `Discos prediletos selecionados por ${username}.`
              : 'Sua seleção definitiva de discos prediletos.'}
          </p>
        </div>
      </div>

      {favorites.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[30vh] text-muted-foreground gap-3">
          <Disc className="h-12 w-12 opacity-50" />
          <p className="text-xs">Nenhum álbum favoritado ainda.</p>
        </div>
      ) : (
        <div className="favorites-grid">
          {favorites.map((album) => (
            <Link
              key={album.id}
              to={`/album/${album.id}`}
              className="favorite-card group"
            >
              <div className="favorite-cover-wrapper">
                <img
                  src={album.cover}
                  alt={album.title}
                  onError={handleCoverImageError}
                  className="favorite-cover-img"
                />
              </div>
              <h3 className="favorite-title group-hover:text-primary">
                {album.title}
              </h3>
              <p className="favorite-artist">{album.artist}</p>
              <div className="favorite-footer">
                <span className="favorite-rating">★ {album.rating}</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
