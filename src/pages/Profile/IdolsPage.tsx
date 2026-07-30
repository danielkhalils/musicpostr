import { useState } from 'react';
import { Award, ArrowLeft } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { Button } from '../../components/ui/button';

interface IdolArtist {
  id: number;
  name: string;
  genre: string;
  image: string;
  followers: string;
}

export function IdolsPage() {
  const { username } = useParams();
  const isVisiting = Boolean(username);

  const [idols, setIdols] = useState<IdolArtist[]>([
    { id: 101, name: 'The Weeknd', genre: 'R&B / Pop', image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=400', followers: '124M' },
    { id: 102, name: 'Pink Floyd', genre: 'Progressive Rock', image: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?q=80&w=400', followers: '45M' },
  ]);

  const toggleFollow = (id: number) => {
    if (isVisiting) return; // Se for visitante, não altera
    setIdols(idols.filter(artist => artist.id !== id));
  };

  return (
    <div className="page-container pb-12">
      <div className="mb-8">
        <Link to="/perfil" className="text-xs text-zinc-400 hover:text-white flex items-center gap-1 mb-2">
          <ArrowLeft className="h-3.5 w-3.5" /> Voltar ao Perfil
        </Link>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Award className="h-6 w-6 text-amber-400" /> 
          {isVisiting ? `Ídolos de @${username}` : 'Meus Ídolos Musicais'}
        </h1>
        <p className="text-xs text-zinc-400 mt-1">Artistas que você segue e acompanha de perto no cenário musical.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {idols.map((artist) => (
          <div key={artist.id} className="bg-zinc-900/60 border border-zinc-800/80 p-4 rounded-2xl flex flex-col items-center text-center group">
            <div className="w-24 h-24 rounded-full overflow-hidden mb-3 border-2 border-zinc-700 shadow-lg">
              <img src={artist.image} alt={artist.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
            </div>
            <h3 className="text-sm font-bold text-white">{artist.name}</h3>
            <p className="text-xs text-zinc-400 mt-0.5">{artist.genre}</p>
            <p className="text-[11px] text-zinc-500 mt-1">{artist.followers} seguidores</p>
            
            {!isVisiting && (
              <Button 
                onClick={() => toggleFollow(artist.id)}
                variant="outline" 
                className="mt-4 border-zinc-700 bg-zinc-900 text-zinc-200 hover:bg-rose-500/10 hover:text-rose-400 hover:border-rose-500/30 text-xs rounded-full h-8 w-full transition-all"
              >
                Seguindo ✓
              </Button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
