import { useState } from 'react';
import { Users, ArrowLeft } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import './FriendsPage.css';

interface Friend {
  id: string;
  name: string;
  username: string;
  avatar: string;
  reviewsCount: number;
}

export function FriendsPage() {
  const { username } = useParams();
  const isVisiting = Boolean(username);

  const [friends] = useState<Friend[]>([
    { id: '1', name: 'Lucas Sound', username: 'lucas_snd', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200', reviewsCount: 34 },
    { id: '2', name: 'Beat Critic', username: 'beatcritic', avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?q=80&w=200', reviewsCount: 51 },
  ]);

  return (
    <div className="page-container pb-12">
      <div className="mb-8">
        <Link to="/perfil" className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 mb-2 transition-colors">
          <ArrowLeft className="h-3.5 w-3.5" /> Voltar ao Perfil
        </Link>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <Users className="h-6 w-6 text-primary" /> 
          {isVisiting ? `Amigos de @${username}` : 'Minha Rede de Amigos'}
        </h1>
        <p className="text-xs text-muted-foreground mt-1">Críticos e entusiastas musicais conectados.</p>
      </div>

      <div className="friends-grid">
        {friends.map((friend) => (
          <div key={friend.id} className="friend-card">
            <div className="flex items-center gap-3 min-w-0">
              <img src={friend.avatar} alt={friend.name} className="friend-avatar" />
              <div className="min-w-0">
                <h3 className="text-sm font-semibold text-foreground truncate">{friend.name}</h3>
                <p className="text-xs text-primary truncate">@{friend.username}</p>
                <p className="text-[11px] text-muted-foreground mt-0.5">{friend.reviewsCount} avaliações publicadas</p>
              </div>
            </div>
            <Link to={`/perfil/${friend.username}`} className="flex-shrink-0">
              <Button variant="outline" className="border-border bg-card text-foreground hover:bg-muted text-xs rounded-xl h-8 shadow-sm">
                Ver Perfil
              </Button>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}