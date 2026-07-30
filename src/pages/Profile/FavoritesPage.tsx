import { useState } from 'react';
import { Heart, Disc, Music, ArrowLeft } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';

interface FavoriteAlbum {
  id: number;
  title: string;
  artist: string;
  cover: string;
  rating: number;
}

export function FavoritesPage() {
  const { username } = useParams(); // Se houver username, estamos no perfil de um amigo
  const isVisiting = Boolean(username);

  const [favorites, setFavorites] = useState<FavoriteAlbum[]>([
    { id: 1, title: 'The Dark Side of the Moon', artist: 'Pink Floyd', cover: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=400', rating: 10 },
    { id: 2, title: 'After Hours', artist: 'The Weeknd', cover: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=400', rating: 9.5 },
  ]);

  return (
    <div className="page-container pb-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <Link to="/perfil" className="text-xs text-zinc-400 hover:text-white flex items-center gap-1 mb-2">
            <ArrowLeft className="h-3.5 w-3.5" /> Voltar ao Perfil
          </Link>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Heart className="h-6 w-6 text-rose-500 fill-rose-500/20" /> 
            {isVisiting ? `Álbuns Favoritos de @${username}` : 'Meus Álbuns Favoritos'}
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            {isVisiting ? `Discos prediletos selecionados por ${username}.` : 'Sua seleção definitiva de discos prediletos.'}
          </p>
        </div>
      </div>

      {favorites.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[30vh] text-zinc-500 gap-3">
          <Disc className="h-12 w-12 text-zinc-700" />
          <p className="text-xs">Nenhum álbum favoritado ainda.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {favorites.map((album) => (
            <Link key={album.id} to={`/album/${album.id}`} className="bg-zinc-900/60 border border-zinc-800/80 p-3 rounded-2xl hover:border-zinc-700 transition-all group">
              <div className="aspect-square rounded-xl overflow-hidden mb-3 bg-zinc-800">
                <img src={album.cover} alt={album.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
              </div>
              <h3 className="text-xs font-semibold text-white truncate group-hover:text-primary transition-colors">{album.title}</h3>
              <p className="text-[11px] text-zinc-400 truncate mt-0.5">{album.artist}</p>
              <div className="mt-2 flex items-center justify-between text-[11px]">
                <span className="text-amber-400 font-bold">★ {album.rating}</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
