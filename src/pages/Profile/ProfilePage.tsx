import { useState } from 'react';
import { User, Mail, Star, Heart, Edit3, Globe, Camera, Users, Award, ListMusic, Share2, Check } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import './ProfilePage.css';

interface SocialLinks {
  instagram?: string;
  tiktok?: string;
  twitter?: string;
  discord?: string;
  lastfm?: string;
  facebook?: string;
  youtube?: string;
  threads?: string;
  linkedin?: string;
  website?: string;
}

export function ProfilePage() {
  const { username } = useParams();
  const isVisiting = Boolean(username);
  const [copied, setCopied] = useState(false);

  const userProfile = {
    name: isVisiting ? `Usuário @${username}` : 'Ana Beatriz',
    username: username || 'anabeat',
    email: isVisiting ? `${username}@musicpostr.com` : 'anabeat@musicpostr.com',
    bio: 'Amante de música pop, indie e crítica sonora alucinógena. Colecionadora de notas 10/10.',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop',
    bannerUrl: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=1200&auto=format&fit=crop',
    stats: {
      reviews: 28,
      favorites: 12,
      avgRating: 9.2,
      friends: 42,
      idols: 15,
      lists: 6,
    },
    socials: {
      instagram: 'https://instagram.com/anabeat',
      twitter: 'https://twitter.com/anabeat',
      threads: 'https://threads.net/@anabeat',
      discord: 'https://discord.gg/anabeat',
      lastfm: 'https://last.fm/user/anabeat',
      youtube: 'https://youtube.com/@anabeat',
      website: 'https://anabeat.com',
    } as SocialLinks
  };

  const handleShareProfile = async () => {
    const profileUrl = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({
          title: `Perfil de ${userProfile.name} no Musicpostr`,
          url: profileUrl,
        });
      } else {
        await navigator.clipboard.writeText(profileUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      }
    } catch (err) {
      navigator.clipboard.writeText(profileUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const renderSocialIcon = (key: string) => {
    switch (key) {
      case 'instagram':
        return (
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="url(#instagram-gradient-profile)">
            <defs>
              <linearGradient id="instagram-gradient-profile" x1="0%" y1="100%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#fdf497" />
                <stop offset="45%" stopColor="#fd5949" />
                <stop offset="60%" stopColor="#d6249f" />
                <stop offset="90%" stopColor="#285AEB" />
              </linearGradient>
            </defs>
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
          </svg>
        );
      case 'threads':
        return (
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.824 11.196c-.161-.016-.323-.024-.486-.024-2.176 0-3.864.88-4.704 2.508-.66-1.04-1.74-1.644-3.156-1.644-2.628 0-4.488 2.052-4.488 4.908 0 2.892 1.872 4.92 4.548 4.92 2.028 0 3.528-1.032 4.236-2.916.444 1.86 1.836 2.856 3.828 2.856 3.252 0 5.316-2.28 5.316-6.132 0-3.876-2.124-6.12-5.088-6.12zm-8.088 5.7c0-1.62 1.056-2.784 2.544-2.784 1.344 0 2.232 1.056 2.232 2.748 0 1.644-.912 2.748-2.232 2.748-1.488 0-2.544-1.128-2.544-2.712zm8.016.924c0 2.232-1.152 3.672-3.036 3.672-1.464 0-2.508-.912-2.784-2.316.54-.156 1.104-.24 1.68-.24 2.376 0 3.42 1.2 4.14-.116z"/>
          </svg>
        );
      case 'discord':
        return (
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="#5865F2">
            <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.927 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
          </svg>
        );
      case 'tiktok':
        return (
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="#ff0050">
            <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
          </svg>
        );
      case 'twitter':
        return (
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
          </svg>
        );
      case 'lastfm':
        return (
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="#d51007">
            <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm3.849 16.59c-1.11 0-2.025-.45-2.745-1.35-.72-.9-1.08-2.01-1.08-3.33 0-1.23.33-2.265.99-3.105.66-.84 1.545-1.32 2.655-1.44.81-.09 1.455.225 1.935.945.48.72.72 1.59.72 2.61 0 .24-.015.465-.045.675h-2.97c0 .54.165.975.51 1.305.345.33.78.495 1.305.495.45 0 .84-.12 1.17-.36.33-.24.51-.57.54-.99h2.82c-.15 1.05-.66 1.86-1.53 2.43-.87.57-1.89.855-3.06.855z"/>
          </svg>
        );
      case 'youtube':
        return (
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="#ff0000">
            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
          </svg>
        );
      case 'facebook':
        return (
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="#1877f2">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
          </svg>
        );
      case 'linkedin':
        return (
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="#0a66c2">
            <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
          </svg>
        );
      case 'website':
        return (
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#3b82f6' }}>
            <circle cx="12" cy="12" r="10" />
            <line x1="2" y1="12" x2="22" y2="12" />
            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
          </svg>
        );
      default:
        return <Globe className="w-4 h-4 text-primary" />;
    }
  };

  const capitalizeFirstLetter = (string: string) => {
    return string === 'website' ? 'Site Pessoal' : string.charAt(0).toUpperCase() + string.slice(1);
  };

  return (
    <div className="page-container pb-12">
      {/* Capa de Fundo do Perfil */}
      <div className="profile-banner-container">
        {userProfile.bannerUrl ? (
          <img src={userProfile.bannerUrl} alt="Capa do perfil" className="profile-banner-image" />
        ) : (
          <div className="profile-banner-fallback" />
        )}
      </div>

      <div className="profile-main-card">
        
        {/* Topo do Card: Avatar sobreposto + Botões de Ação */}
        <div className="profile-top-row">
          <div className="profile-avatar-container">
            {userProfile.avatarUrl ? (
              <img src={userProfile.avatarUrl} alt={userProfile.name} className="profile-avatar-img" />
            ) : (
              <div className="profile-avatar-fallback">
                <User className="h-14 w-14 text-muted-foreground" />
              </div>
            )}
            <div className="profile-camera-badge">
              <Camera className="h-3 w-3" />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={handleShareProfile}
              className="border-border bg-card text-foreground hover:bg-muted rounded-full text-xs h-9 px-3.5 transition-all flex items-center gap-1.5 shadow-sm"
              title="Compartilhar perfil"
            >
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-500" />
                  <span className="text-emerald-500 font-medium">Link copiado!</span>
                </>
              ) : (
                <>
                  <Share2 className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Compartilhar Perfil </span>
                </>
              )}
            </Button>

            {!isVisiting && (
              <Link to="/configuracoes">
                <Button
                  variant="outline"
                  className="border-border bg-card text-foreground hover:bg-muted rounded-full text-xs h-9 px-4 transition-all flex items-center gap-1.5 shadow-sm"
                  title="Editar Perfil nas Configurações"
                >
                  <Edit3 className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Editar Perfil nas Configurações</span>
                  <span className="sm:hidden">Editar</span>
                </Button>
              </Link>
            )}
          </div>
        </div>

        {/* Informações Principais e Estatísticas Lado a Lado */}
        <div className="profile-content-grid mt-4">
          
          {/* Esquerda: Identidade e Bio */}
          <div className="profile-identity-section">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight">{userProfile.name}</h1>
              <p className="text-xs text-muted-foreground flex items-center gap-1.5 mt-1 font-medium min-w-0">
                <span className="text-primary font-semibold flex-shrink-0">@{userProfile.username}</span>
                <span aria-hidden="true" className="flex-shrink-0">•</span>
                <Mail className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                <span className="truncate">{userProfile.email}</span>
              </p>
            </div>

            <p className="text-sm text-foreground/80 mt-3 leading-relaxed max-w-xl">
              {userProfile.bio}
            </p>

            {/* Redes Sociais */}
            {userProfile.socials && Object.keys(userProfile.socials).length > 0 && (
              <div className="flex flex-wrap items-center gap-2 mt-4">
                {Object.entries(userProfile.socials).map(([key, url]) => {
                  if (!url) return null;
                  const formattedName = capitalizeFirstLetter(key);
                  return (
                    <a
                      key={key}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 bg-card hover:bg-muted border border-border rounded-xl text-foreground hover:text-primary transition-all flex items-center justify-center group shadow-sm"
                      title={formattedName}
                    >
                      {renderSocialIcon(key)}
                    </a>
                  );
                })}
              </div>
            )}
          </div>

          {/* Direita: Painel Moderno de Estatísticas */}
          <div className="profile-stats-panel">
            <div className="profile-stats-container">
              
              <Link to={isVisiting ? `/perfil/${username}/avaliacoes` : '/minhas-avaliacoes'} className="profile-stat-card primary-stat block">
                <div className="flex items-center justify-between mb-1">
                  <span className="stat-label">Avaliações</span>
                  <Star className="h-4 w-4 text-primary fill-primary/25" />
                </div>
                <span className="stat-number">{userProfile.stats.reviews}</span>
                <span className="stat-subtext">Discos avaliados</span>
              </Link>

              <Link to={isVisiting ? `/perfil/${username}/favoritos` : '/favoritos'} className="profile-stat-card block">
                <div className="flex items-center justify-between mb-1">
                  <span className="stat-label">Favoritos</span>
                  <Heart className="h-4 w-4 text-rose-500 fill-rose-500/25" />
                </div>
                <span className="stat-number">{userProfile.stats.favorites}</span>
                <span className="stat-subtext">No acervo pessoal</span>
              </Link>

              <div className="profile-stat-card cursor-default">
                <div className="flex items-center justify-between mb-1">
                  <span className="stat-label">Média</span>
                  <Award className="h-4 w-4 text-amber-500 fill-amber-500/25" />
                </div>
                <span className="stat-number">{userProfile.stats.avgRating}</span>
                <span className="stat-subtext">Nota geral dada</span>
              </div>

              <Link to={isVisiting ? `/perfil/${username}/amigos` : '/amigos'} className="profile-stat-card block">
                <div className="flex items-center justify-between mb-1">
                  <span className="stat-label">Amigos</span>
                  <Users className="h-4 w-4 text-blue-500" />
                </div>
                <span className="stat-number">{userProfile.stats.friends}</span>
                <span className="stat-subtext">Conectados</span>
              </Link>

              <Link to={isVisiting ? `/perfil/${username}/idolos` : '/idolos'} className="profile-stat-card block">
                <div className="flex items-center justify-between mb-1">
                  <span className="stat-label">Ídolos</span>
                  <User className="h-4 w-4 text-purple-500" />
                </div>
                <span className="stat-number">{userProfile.stats.idols}</span>
                <span className="stat-subtext">Artistas seguidos</span>
              </Link>

              <Link to={isVisiting ? `/perfil/${username}/listas` : '/listas'} className="profile-stat-card block">
                <div className="flex items-center justify-between mb-1">
                  <span className="stat-label">Listas</span>
                  <ListMusic className="h-4 w-4 text-emerald-500" />
                </div>
                <span className="stat-number">{userProfile.stats.lists}</span>
                <span className="stat-subtext">Playlists criadas</span>
              </Link>

            </div>
          </div>

        </div>

      </div>

      {/* Cards Inferiores com Links Funcionais */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6 max-w-8xl mx-auto px-1">
        <Link to={isVisiting ? `/perfil/${username}/avaliacoes` : '/minhas-avaliacoes'} className="bg-card border border-border p-5 rounded-2xl flex items-center justify-between hover:border-primary/50 transition-all group shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-primary/10 text-primary rounded-xl">
              <Star className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground text-sm">Histórico de Avaliações</h3>
              <p className="text-xs text-muted-foreground">Veja o histórico completo das notas publicadas.</p>
            </div>
          </div>
          <span className="text-xs text-primary font-semibold group-hover:underline">Ver →</span>
        </Link>

        <Link to={isVisiting ? `/perfil/${username}/favoritos` : '/favoritos'} className="bg-card border border-border p-5 rounded-2xl flex items-center justify-between hover:border-primary/50 transition-all group shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-amber-500/10 text-amber-500 rounded-xl">
              <Heart className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground text-sm">Álbuns Favoritos</h3>
              <p className="text-xs text-muted-foreground">Gerencie e visualize a lista de discos prediletos.</p>
            </div>
          </div>
          <span className="text-xs text-amber-500 font-semibold group-hover:underline">Ver →</span>
        </Link>
      </div>
    </div>
  );
}
