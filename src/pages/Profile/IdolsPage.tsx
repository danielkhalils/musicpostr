import { useState } from 'react';
import { Award, ArrowLeft } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import './IdolsPage.css';

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
    if (isVisiting) return;
    setIdols(idols.filter(artist => artist.id !== id));
  };

  return (
    <div className="page-container pb-12">
      <div className="mb-8">
        <Link to="/perfil" className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 mb-2 transition-colors">
          <ArrowLeft className="h-3.5 w-3.5" /> Voltar ao Perfil
        </Link>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <Award className="h-6 w-6 text-amber-500" /> 
          {isVisiting ? `Ídolos de @${username}` : 'Meus Ídolos Musicais'}
        </h1>
        <p className="text-xs text-muted-foreground mt-1">Artistas que você segue e acompanha de perto no cenário musical.</p>
      </div>

      <div className="idols-grid">
        {idols.map((artist) => (
          <div key={artist.id} className="idol-card group">
            <div className="idol-avatar-wrapper">
              <img src={artist.image} alt={artist.name} className="idol-avatar-img" />
            </div>
            <h3 className="text-sm font-bold text-foreground truncate w-full">{artist.name}</h3>
            <p className="text-xs text-muted-foreground mt-0.5">{artist.genre}</p>
            <p className="text-[11px] text-muted-foreground opacity-80 mt-1">{artist.followers} seguidores</p>
            
            {!isVisiting && (
              <Button 
                onClick={() => toggleFollow(artist.id)}
                variant="outline" 
                className="mt-4 border-border bg-card text-foreground hover:bg-rose-500/10 hover:text-rose-500 hover:border-rose-500/30 text-xs rounded-full h-8 w-full transition-all shadow-sm"
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