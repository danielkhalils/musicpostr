import { Link } from 'react-router-dom';
import { Search, Trophy, Star, ArrowRight, Disc, Flame } from 'lucide-react';
import { Button } from '../../components/ui/button';

export function HomePage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-zinc-950 text-white flex flex-col items-center pb-20">
      
      {/* Hero Section */}
      <div className="relative w-full overflow-hidden py-20 px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center bg-gradient-to-b from-primary/10 via-zinc-950/50 to-zinc-950 border-b border-zinc-900">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent opacity-60 pointer-events-none" />
        
        <div className="relative max-w-3xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-xs text-zinc-300 font-medium">
            <Flame className="h-3.5 w-3.5 text-primary" /> O novo padrão para crítica e avaliação musical
          </div>

          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white">
            Descubra, avalie e discuta os <span className="text-primary">melhores álbuns</span>
          </h1>

          <p className="text-base sm:text-lg text-zinc-400 max-w-2xl mx-auto">
            Explore discografias completas, mergulhe em informações detalhadas de artistas e registre suas opiniões sobre os lançamentos que definem a cultura musical.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
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
      <div className="max-w-7xl w-full px-4 sm:px-6 lg:px-8 mt-16">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Explore a plataforma
          </h2>
          <p className="text-zinc-400 text-sm mt-1">
            Tudo o que você precisa para acompanhar o mundo da música em um só lugar
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1: Artistas */}
          <Link to="/artistas" className="group bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-6 flex flex-col justify-between hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 relative overflow-hidden">
            <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-all" />
            <div>
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-5 group-hover:scale-110 transition-transform">
                <Disc className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2 group-hover:text-primary transition-colors">
                Artistas e Discografias
              </h3>
              <p className="text-zinc-400 text-sm leading-relaxed">
                Navegue por milhares de artistas, confira fotos em alta resolução, álbuns de estúdio, EPs e singles oficiais.
              </p>
            </div>
            <div className="mt-6 flex items-center text-sm font-medium text-primary gap-1 group-hover:translate-x-1 transition-transform">
              Explorar artistas <ArrowRight className="h-4 w-4" />
            </div>
          </Link>

          {/* Card 2: Rankings */}
          <Link to="/rankings" className="group bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-6 flex flex-col justify-between hover:border-amber-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-amber-500/5 relative overflow-hidden">
            <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl group-hover:bg-amber-500/10 transition-all" />
            <div>
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-400 mb-5 group-hover:scale-110 transition-transform">
                <Trophy className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2 group-hover:text-amber-400 transition-colors">
                Rankings de Álbuns
              </h3>
              <p className="text-zinc-400 text-sm leading-relaxed">
                Descubra quais são os discos mais aclamados, as notas da comunidade e os álbuns que marcaram época.
              </p>
            </div>
            <div className="mt-6 flex items-center text-sm font-medium text-amber-400 gap-1 group-hover:translate-x-1 transition-transform">
              Ver classificações <ArrowRight className="h-4 w-4" />
            </div>
          </Link>

          {/* Card 3: Reviews */}
          <Link to="/reviews" className="group bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-6 flex flex-col justify-between hover:border-emerald-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-emerald-500/5 relative overflow-hidden">
            <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl group-hover:bg-emerald-500/10 transition-all" />
            <div>
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 mb-5 group-hover:scale-110 transition-transform">
                <Star className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2 group-hover:text-emerald-400 transition-colors">
                Reviews e Críticas
              </h3>
              <p className="text-zinc-400 text-sm leading-relaxed">
                Leia análises profundas, escreva suas próprias avaliações e compartilhe sua perspectiva sobre faixas e álbuns.
              </p>
            </div>
            <div className="mt-6 flex items-center text-sm font-medium text-emerald-400 gap-1 group-hover:translate-x-1 transition-transform">
              Ler reviews <ArrowRight className="h-4 w-4" />
            </div>
          </Link>

        </div>
      </div>

    </div>
  );
}

export default HomePage;