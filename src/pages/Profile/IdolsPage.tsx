import { useState } from 'react';
import { Award, ArrowLeft } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { getReleaseGroupCoverUrl, handleCoverImageError } from '../../services/coverArt.service';
import './IdolsPage.css';

interface IdolArtist {
  id: string;
  name: string;
  genre: string;
  image: string;
  followers: string;
}

const DEFAULT_IDOLS: IdolArtist[] = [
  {
    id: 'c8b03190-306c-4120-bb0b-6f2ebfc06ea9',
    name: 'The Weeknd',
    genre: 'R&B / Pop',
    image: getReleaseGroupCoverUrl('78570bea-2a26-467c-a3db-c52723ceb394', '500'),
    followers: '3.1K',
  },
  {
    id: '83d91898-7763-47d7-b03b-b92132375c47',
    name: 'Pink Floyd',
    genre: 'Progressive Rock',
    image: getReleaseGroupCoverUrl('f5093c06-23e3-404f-aeaa-40f72885ee3a', '500'),
    followers: '4.4K',
  },
];

export function IdolsPage() {
  const { username } = useParams();
  const isVisiting = Boolean(username);

  const [idols, setIdols] = useState<IdolArtist[]>(() => {
    try {
      const savedData = JSON.parse(
        localStorage.getItem('musicpostr_idols_data') || '[]'
      );
      const savedIds: string[] = JSON.parse(
        localStorage.getItem('musicpostr_idols') || '[]'
      );
      if (savedIds.length > 0 && savedData.length > 0) {
        const mapped = savedData
          .filter((a: any) => savedIds.includes(String(a.id)))
          .map((a: any) => ({
            id: String(a.id),
            name: a.name,
            genre: a.genre || 'Artista',
            image: a.imageUrl || DEFAULT_IDOLS[0].image,
            followers: a.nbFans ? `${a.nbFans}` : '1.2K',
          }));
        if (mapped.length > 0) return mapped;
      }
    } catch {
      // ignore
    }
    return DEFAULT_IDOLS;
  });

  const toggleFollow = (id: string) => {
    if (isVisiting) return;
    setIdols((prev) => prev.filter((artist) => artist.id !== id));
    try {
      const savedIds: string[] = JSON.parse(
        localStorage.getItem('musicpostr_idols') || '[]'
      );
      localStorage.setItem(
        'musicpostr_idols',
        JSON.stringify(savedIds.filter((item) => item !== id))
      );
    } catch {
      // ignore
    }
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
          <Award className="h-6 w-6 text-amber-500" />
          {isVisiting ? `Ídolos de @${username}` : 'Meus Ídolos Musicais'}
        </h1>
        <p className="text-xs text-muted-foreground mt-1">
          Artistas que você segue e acompanha de perto no cenário musical.
        </p>
      </div>

      <div className="idols-grid">
        {idols.map((artist) => (
          <div key={artist.id} className="idol-card group">
            <Link to={`/artista/${artist.id}`} className="flex flex-col items-center w-full">
              <div className="idol-avatar-wrapper">
                <img
                  src={artist.image}
                  alt={artist.name}
                  onError={handleCoverImageError}
                  className="idol-avatar-img"
                />
              </div>
              <h3 className="text-sm font-bold text-foreground truncate w-full text-center group-hover:text-primary transition-colors">
                {artist.name}
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                {artist.genre}
              </p>
              <p className="text-[11px] text-muted-foreground opacity-80 mt-1">
                {artist.followers} ouvintes
              </p>
            </Link>

            {!isVisiting && (
              <Button
                onClick={() => toggleFollow(artist.id)}
                variant="outline"
                className="mt-4 border-border bg-card text-foreground hover:bg-rose-500/10 hover:text-rose-500 hover:border-rose-500/30 text-xs rounded-full h-9 w-full transition-all shadow-sm"
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
