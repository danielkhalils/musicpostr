import { ListMusic, ArrowLeft, Plus } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { Button } from '../../components/ui/button';

export function ListsPage() {
  const { username } = useParams();
  const isVisiting = Boolean(username);

  const lists = [
    { id: 1, title: 'Melhores do Pop em 2025', count: 12, description: 'Os lançamentos mais marcantes do ano passado.' },
    { id: 2, title: 'Discos para Ouvir na Madrugada', count: 8, description: 'Atmosferas densas, indie e ambient.' },
  ];

  return (
    <div className="page-container pb-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <Link to="/perfil" className="text-xs text-zinc-400 hover:text-white flex items-center gap-1 mb-2">
            <ArrowLeft className="h-3.5 w-3.5" /> Voltar ao Perfil
          </Link>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <ListMusic className="h-6 w-6 text-emerald-400" /> 
            {isVisiting ? `Listas de @${username}` : 'Minhas Listas'}
          </h1>
          <p className="text-xs text-zinc-400 mt-1">Coletâneas temáticas de álbuns organizadas.</p>
        </div>
        {!isVisiting && (
          <Button className="bg-primary hover:bg-primary/90 text-white rounded-xl text-xs gap-1.5 h-9">
            <Plus className="h-4 w-4" /> Nova Lista
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {lists.map((list) => (
          <div key={list.id} className="bg-zinc-900/60 border border-zinc-800/80 p-5 rounded-2xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-white text-base">{list.title}</h3>
                <span className="text-xs bg-zinc-800 text-zinc-300 px-2.5 py-1 rounded-full">{list.count} álbuns</span>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">{list.description}</p>
            </div>
            <div className="mt-4 pt-3 border-t border-zinc-800/80 flex items-center justify-between">
              <span className="text-[11px] text-zinc-500">Criado recentemente</span>
              <span className="text-xs text-primary font-semibold hover:underline cursor-pointer">Ver lista →</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}