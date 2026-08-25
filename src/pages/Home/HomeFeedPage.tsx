import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, Heart, MessageSquare, Send, Disc, Sparkles } from 'lucide-react';
import './HomeFeedPage.css';

interface CommentItem {
  id: string;
  author: string;
  avatar: string;
  text: string;
  time: string;
}

interface FeedItem {
  id: string;
  friendName: string;
  friendUsername: string;
  friendAvatar: string;
  albumTitle: string;
  artistName: string;
  albumCover: string;
  albumId: number;
  rating: number;
  comment: string;
  timeAgo: string;
  likesCount: number;
  isLiked: boolean;
  comments: CommentItem[];
}

export function HomeFeedPage() {
  const [feedItems, setFeedItems] = useState<FeedItem[]>([
    {
      id: 'feed-1',
      friendName: 'Lucas Sound',
      friendUsername: 'lucas_snd',
      friendAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200',
      albumTitle: 'HIT ME HARD AND SOFT',
      artistName: 'Billie Eilish',
      albumCover: 'https://api.deezer.com/album/581177892/image',
      albumId: 581177892,
      rating: 9.5,
      comment: 'A transição entre as faixas e a produção vocal neste álbum estão em outro patamar. Simplesmente envolvente do início ao fim!',
      timeAgo: 'Há 2 horas',
      likesCount: 14,
      isLiked: false,
      comments: [
        {
          id: 'c-1',
          author: 'Ana Beatriz',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200',
          text: 'Concordo totalmente! "Lunch" e "Chihiro" são surreais.',
          time: 'Há 1 hora'
        }
      ]
    },
    {
      id: 'feed-2',
      friendName: 'Beat Critic',
      friendUsername: 'beatcritic',
      friendAvatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?q=80&w=200',
      albumTitle: 'Random Access Memories',
      artistName: 'Daft Punk',
      albumCover: 'https://api.deezer.com/album/6666872/image',
      albumId: 6666872,
      rating: 10,
      comment: 'O ápice da música eletrônica orgânica. Uma verdadeira obra de arte atemporal.',
      timeAgo: 'Há 5 horas',
      likesCount: 29,
      isLiked: true,
      comments: []
    }
  ]);

  const [commentInputs, setCommentInputs] = useState<{ [key: string]: string }>({});
  const [activeCommentSection, setActiveCommentSection] = useState<{ [key: string]: boolean }>({});

  const handleToggleLike = (id: string) => {
    setFeedItems(prev => prev.map(item => {
      if (item.id === id) {
        return {
          ...item,
          isLiked: !item.isLiked,
          likesCount: item.isLiked ? item.likesCount - 1 : item.likesCount + 1
        };
      }
      return item;
    }));
  };

  const handleToggleCommentSection = (id: string) => {
    setActiveCommentSection(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleAddComment = (id: string, e: React.FormEvent) => {
    e.preventDefault();
    const text = commentInputs[id]?.trim();
    if (!text) return;

    setFeedItems(prev => prev.map(item => {
      if (item.id === id) {
        const newComment: CommentItem = {
          id: Date.now().toString(),
          author: 'Ana Beatriz',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200',
          text: text,
          time: 'Agora mesmo'
        };
        return {
          ...item,
          comments: [...item.comments, newComment]
        };
      }
      return item;
    }));

    setCommentInputs(prev => ({ ...prev, [id]: '' }));
  };

  return (
    <div className="page-container pb-16">
      {/* Cabeçalho da Timeline */}
      <div className="feed-header mb-8">
        <div className="flex items-center gap-3">
          <span className="p-2.5 bg-primary/10 text-primary rounded-2xl border border-primary/20">
            <Sparkles className="h-6 w-6" />
          </span>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-white tracking-tight">Timeline da Rede</h1>
            <p className="text-xs text-muted-foreground mt-0.5">Acompanhe as críticas, notas e descobertas dos seus amigos na comunidade.</p>
          </div>
        </div>
      </div>

      {/* Lista de Atividades (Feed) */}
      <div className="max-w-2xl mx-auto space-y-6">
        {feedItems.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground bg-muted/40 rounded-2xl border border-border">
            <Disc className="h-12 w-12 mx-auto mb-3 text-muted-foreground animate-pulse" />
            <p className="text-xs">Sua timeline está silenciosa. Siga mais amigos para ver avaliações aqui!</p>
          </div>
        ) : (
          feedItems.map((item) => (
            <div key={item.id} className="feed-card">
              
              {/* Autor da Atividade */}
              <div className="flex items-center justify-between gap-2 mb-4 pb-3 border-b border-border">
                <Link to={`/perfil/${item.friendUsername}`} className="flex items-center gap-3 group min-w-0">
                  <img src={item.friendAvatar} alt={item.friendName} className="w-10 h-10 rounded-full object-cover border-2 border-zinc-300 dark:border-zinc-700 group-hover:border-primary transition-colors flex-shrink-0" />
                  <div className="min-w-0">
                    <h3 className="text-xs font-bold text-zinc-900 dark:text-white truncate group-hover:text-primary transition-colors">{item.friendName}</h3>
                    <p className="text-[11px] text-muted-foreground truncate">@{item.friendUsername} • <span>{item.timeAgo}</span></p>
                  </div>
                </Link>
                <span className="hidden sm:inline-block text-[11px] font-medium text-muted-foreground bg-muted px-3 py-1 rounded-full border border-border flex-shrink-0">
                  Review de Álbum
                </span>
              </div>

              {/* Card do Álbum Avaliado */}
              <div className="feed-album-box">
                <img src={item.albumCover} alt={item.albumTitle} className="feed-album-cover" />
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <Link to={`/album/${item.albumId}`} className="text-sm font-bold text-zinc-900 dark:text-white hover:text-primary transition-colors block truncate">
                        {item.albumTitle}
                      </Link>
                      <p className="text-xs text-muted-foreground mt-0.5 truncate">{item.artistName}</p>
                    </div>

                    {/* Nota Estrela idêntica à tela de reviews */}
                    <div className="review-card-score-badge static flex items-center gap-1 px-2.5 py-1 rounded-full bg-primary/15 border border-primary/30 flex-shrink-0">
                      <Star className="h-3.5 w-3.5 text-primary fill-primary" />
                      <span className="text-xs font-bold text-primary">{item.rating}</span>
                    </div>
                  </div>

                  {/* Comentário do Review */}
                  <p className="text-xs text-foreground/90 mt-3 leading-relaxed italic bg-muted/50 p-3 rounded-xl border border-border">
                    "{item.comment}"
                  </p>
                </div>
              </div>

              {/* Barra de Ações (Curtir e Comentar) */}
              <div className="flex items-center gap-5 mt-4 pt-3 border-t border-border text-xs text-muted-foreground">
                <button
                  onClick={() => handleToggleLike(item.id)}
                  className={`flex items-center gap-1.5 py-1.5 -my-1.5 transition-colors font-medium ${item.isLiked ? 'text-rose-500' : 'hover:text-foreground'}`}
                >
                  <Heart className={`h-4 w-4 ${item.isLiked ? 'fill-rose-500 text-rose-500' : ''}`} />
                  <span>{item.likesCount} {item.likesCount === 1 ? 'curtida' : 'curtidas'}</span>
                </button>

                <button
                  onClick={() => handleToggleCommentSection(item.id)}
                  className="flex items-center gap-1.5 py-1.5 -my-1.5 hover:text-foreground transition-colors font-medium"
                >
                  <MessageSquare className="h-4 w-4" />
                  <span>{item.comments.length} {item.comments.length === 1 ? 'comentário' : 'comentários'}</span>
                </button>
              </div>

              {/* Seção de Comentários Expandida */}
              {activeCommentSection[item.id] && (
                <div className="mt-4 pt-3 border-t border-zinc-800/80 space-y-3 animate-in fade-in duration-200">
                  
                  {/* Lista de Comentários */}
                  {item.comments.map((comment) => (
                    <div key={comment.id} className="flex items-start gap-2.5 bg-muted/50 p-3 rounded-xl border border-border">
                      <img src={comment.avatar} alt={comment.author} className="w-7 h-7 rounded-full object-cover flex-shrink-0 mt-0.5 border border-border" />
                      <div className="flex-1 min-w-0 text-xs">
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-semibold text-zinc-900 dark:text-white truncate">{comment.author}</span>
                          <span className="text-[10px] text-muted-foreground flex-shrink-0">{comment.time}</span>
                        </div>
                        <p className="text-muted-foreground mt-1 leading-relaxed">{comment.text}</p>
                      </div>
                    </div>
                  ))}

                  {/* Input para Novo Comentário com contraste adequado */}
                  <form onSubmit={(e) => handleAddComment(item.id, e)} className="flex items-center gap-2 mt-2">
                    <input
                      type="text"
                      placeholder="Escreva um comentário..."
                      value={commentInputs[item.id] || ''}
                      onChange={(e) => setCommentInputs({ ...commentInputs, [item.id]: e.target.value })}
                      className="flex-1 min-w-0 bg-background border border-border focus:border-primary rounded-xl px-3.5 py-2 text-base sm:text-sm text-foreground placeholder:text-muted-foreground outline-none transition-colors"
                    />
                    <button type="submit" aria-label="Enviar comentário" className="p-3 bg-primary hover:bg-primary/90 text-white rounded-xl transition-all shadow-md">
                      <Send className="h-4 w-4" />
                    </button>
                  </form>

                </div>
              )}

            </div>
          ))
        )}
      </div>
    </div>
  );
}