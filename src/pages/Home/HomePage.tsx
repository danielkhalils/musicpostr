import { Link } from 'react-router-dom';
import { Search, Trophy, Star, ArrowRight, Flame, Disc3 } from 'lucide-react';
import { Button } from '../../components/ui/button';
import './HomePage.css';

export function HomePage() {
  return (
    <div className="home-container">
      
      {/* Hero Section */}
      <div className="home-hero-wrapper">
        <div className="home-hero-radial" />
        
        <div className="home-hero-content">
          <div className="home-modern-badge">
            <div className="badge-glow" />
            <span className="badge-icon-wrapper">
              <Flame className="h-4 w-4 text-orange-500 animate-pulse" />
            </span>
            <span className="badge-text">O novo padrão para crítica e avaliação musical</span>
          </div>

          <h1 className="home-title">
            Descubra, avalie e discuta os <span className="home-title-gradient">melhores álbuns</span>
          </h1>

          <p className="home-subtitle">
            Explore discografias completas, mergulhe em informações detalhadas de artistas e registre suas opiniões sobre os lançamentos que definem a cultura musical.
          </p>

          <div className="home-actions">
            <Link to="/artistas">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-white font-medium rounded-full px-8 shadow-lg shadow-primary/20 transition-all hover:scale-105">
                <Search className="h-4 w-4 mr-2" /> Buscar Artistas
              </Button>
            </Link>

            <Link to="/rankings">
              <Button size="lg" variant="outline" className="border-zinc-800 bg-zinc-900/50 hover:bg-zinc-900 text-zinc-200 font-medium rounded-full px-8 backdrop-blur-sm transition-all hover:scale-105">
                <Trophy className="h-4 w-4 mr-2 text-amber-400" /> Ver Rankings
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Seção de Atalhos / Recursos */}
      <div className="home-features-container">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Explore a plataforma
          </h2>
          <p className="text-zinc-400 text-sm mt-1">
            Tudo o que você precisa para acompanhar o mundo da música em um só lugar
          </p>
        </div>

        <div className="home-cards-grid">
          
          {/* Card 1: Artistas (Com Disc3 roxo) */}
          <Link to="/artistas" className="home-feature-card artist-card">
            <div className="home-card-glow artist-glow" />
            <div>
              <div className="home-card-icon-wrapper artist-icon">
                <Disc3 className="h-6 w-6 text-purple-400" />
              </div>
              <h3 className="home-card-title">
                Artistas e Discografias
              </h3>
              <p className="home-card-desc">
                Navegue por milhares de artistas, confira fotos em alta resolução, álbuns de estúdio, EPs e singles oficiais.
              </p>
            </div>
            <div className="home-card-footer artist-link">
              Explorar artistas <ArrowRight className="h-4 w-4" />
            </div>
          </Link>

          {/* Card 2: Rankings */}
          <Link to="/rankings" className="home-feature-card ranking-card">
            <div className="home-card-glow ranking-glow" />
            <div>
              <div className="home-card-icon-wrapper ranking-icon">
                <Trophy className="h-6 w-6" />
              </div>
              <h3 className="home-card-title">
                Rankings de Álbuns
              </h3>
              <p className="home-card-desc">
                Descubra quais são os discos mais aclamados, as notas da comunidade e os álbuns que marcaram época.
              </p>
            </div>
            <div className="home-card-footer ranking-link">
              Ver classificações <ArrowRight className="h-4 w-4" />
            </div>
          </Link>

          {/* Card 3: Reviews */}
          <Link to="/reviews" className="home-feature-card review-card">
            <div className="home-card-glow review-glow" />
            <div>
              <div className="home-card-icon-wrapper review-icon">
                <Star className="h-6 w-6" />
              </div>
              <h3 className="home-card-title">
                Reviews e Críticas
              </h3>
              <p className="home-card-desc">
                Leia análises profundas, escreva suas próprias avaliações e compartilhe sua perspectiva sobre faixas e álbuns.
              </p>
            </div>
            <div className="home-card-footer review-link">
              Ler reviews <ArrowRight className="h-4 w-4" />
            </div>
          </Link>

        </div>
      </div>

    </div>
  );
}

export default HomePage;