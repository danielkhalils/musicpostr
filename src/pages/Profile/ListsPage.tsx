import { ListMusic, ArrowLeft, Plus } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import './ListsPage.css';

export function ListsPage() {
  const { username } = useParams();
  const isVisiting = Boolean(username);

  const lists = [
    { id: 1, title: 'Melhores do Pop em 2025', count: 12, description: 'Os lançamentos mais marcantes do ano passado.' },
    { id: 2, title: 'Discos para Ouvir na Madrugada', count: 8, description: 'Atmosferas densas, indie e ambient.' },
  ];

  return (
    <div className="page-container pb-12">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-8">
        <div>
          <Link to="/perfil" className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 mb-2 transition-colors">
            <ArrowLeft className="h-3.5 w-3.5" /> Voltar ao Perfil
          </Link>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <ListMusic className="h-6 w-6 text-emerald-500" /> 
            {isVisiting ? `Listas de @${username}` : 'Minhas Listas'}
          </h1>
          <p className="text-xs text-muted-foreground mt-1">Coletâneas temáticas de álbuns organizadas.</p>
        </div>
        {!isVisiting && (
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl text-xs gap-1.5 h-9 shadow-sm">
            <Plus className="h-4 w-4" /> Nova Lista
          </Button>
        )}
      </div>

      <div className="lists-grid">
        {lists.map((list) => (
          <div key={list.id} className="list-card">
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <h3 className="font-semibold text-foreground text-base truncate min-w-0">{list.title}</h3>
                <span className="text-xs bg-muted text-muted-foreground border border-border px-2.5 py-1 rounded-full flex-shrink-0">{list.count} álbuns</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">{list.description}</p>
            </div>
            <div className="mt-4 pt-3 border-t border-border flex items-center justify-between">
              <span className="text-[11px] text-muted-foreground">Criado recentemente</span>
              <span className="text-xs text-primary font-semibold hover:underline cursor-pointer">Ver lista →</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}