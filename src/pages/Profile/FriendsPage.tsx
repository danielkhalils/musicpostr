import { useState } from 'react';
import { Users, ArrowLeft, UserCheck, MessageSquare } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { Button } from '../../components/ui/button';

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
        <Link to="/perfil" className="text-xs text-zinc-400 hover:text-white flex items-center gap-1 mb-2">
          <ArrowLeft className="h-3.5 w-3.5" /> Voltar ao Perfil
        </Link>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Users className="h-6 w-6 text-primary" /> 
          {isVisiting ? `Amigos de @${username}` : 'Minha Rede de Amigos'}
        </h1>
        <p className="text-xs text-zinc-400 mt-1">Críticos e entusiastas musicais conectados.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {friends.map((friend) => (
          <div key={friend.id} className="bg-zinc-900/60 border border-zinc-800/80 p-4 rounded-2xl flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <img src={friend.avatar} alt={friend.name} className="w-12 h-12 rounded-full object-cover border border-zinc-700" />
              <div>
                <h3 className="text-sm font-semibold text-white">{friend.name}</h3>
                <p className="text-xs text-primary">@{friend.username}</p>
                <p className="text-[11px] text-zinc-500 mt-0.5">{friend.reviewsCount} avaliações publicadas</p>
              </div>
            </div>
            <Link to={`/perfil/${friend.username}`}>
              <Button variant="outline" className="border-zinc-700 bg-zinc-900 text-zinc-200 hover:bg-zinc-800 text-xs rounded-xl h-8">
                Ver Perfil
              </Button>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}