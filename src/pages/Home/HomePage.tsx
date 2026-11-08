import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  Star,
  Play,
  Disc,
  Sparkles,
  TrendingUp,
  ArrowRight,
  ShieldCheck,
  Mail,
  Loader2,
  Newspaper,
  ExternalLink,
  Flame,
  Award,
  Music,
  Compass,
  ChevronLeft,
  ChevronRight,
  Headphones,
} from "lucide-react";
import { Button } from "../../components/ui/button";
import {
  type CatalogAlbum,
  type CatalogTrack,
  getHighlightAlbums,
  getPopularAlbumsByInternalActivity,
  getTopRatedAlbumsByInternalReviews,
  fetchNewReleasesFromMusicBrainz,
  INITIAL_TOP_TRACKS,
} from "../../services/musicBrainz.service";
import { handleCoverImageError } from "../../services/coverArt.service";
import "./HomePage.css";

interface NewsArticle {
  title: string;
  link: string;
  pubDate: string;
  author: string;
  thumbnail: string;
  description: string;
}

const GENRES = [
  { id: "Pop", name: "Pop", color: "from-pink-500 to-rose-600" },
  { id: "Rock", name: "Rock", color: "from-amber-600 to-red-700" },
  { id: "Hip-Hop", name: "Hip-Hop", color: "from-purple-600 to-indigo-800" },
  { id: "Eletrônica", name: "Eletrônica", color: "from-cyan-500 to-blue-600" },
  {
    id: "Indie",
    name: "Indie / Alternativo",
    color: "from-emerald-500 to-teal-700",
  },
  { id: "R&B", name: "R&B", color: "from-orange-500 to-amber-600" },
];

export default function HomePage() {
  const [highlights, setHighlights] = useState<CatalogAlbum[]>(() =>
    getHighlightAlbums(10)
  );
  const [popularAlbums, setPopularAlbums] = useState<CatalogAlbum[]>(() =>
    getPopularAlbumsByInternalActivity(8)
  );
  const [newReleases, setNewReleases] = useState<CatalogAlbum[]>([]);
  const [topRatedAlbums, setTopRatedAlbums] = useState<CatalogAlbum[]>(() =>
    getTopRatedAlbumsByInternalReviews(8)
  );
  const [topTracks] = useState<CatalogTrack[]>(INITIAL_TOP_TRACKS);
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [activeIndex, setActiveIndex] = useState(0);

  // Ref para controlar a rolagem horizontal das Top Músicas (estilo YouTube Music)
  const tracksScrollRef = useRef<HTMLDivElement>(null);

  const scrollTracks = (direction: "left" | "right") => {
    if (tracksScrollRef.current) {
      const { scrollLeft, clientWidth } = tracksScrollRef.current;
      const scrollAmount = clientWidth * 0.75;
      tracksScrollRef.current.scrollTo({
        left:
          direction === "left"
            ? scrollLeft - scrollAmount
            : scrollLeft + scrollAmount,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    function syncInternalSections() {
      setHighlights(getHighlightAlbums(10));
      setPopularAlbums(getPopularAlbumsByInternalActivity(8));
      setTopRatedAlbums(getTopRatedAlbumsByInternalReviews(8));
    }

    window.addEventListener("musicpostr:albums-updated", syncInternalSections);
    return () =>
      window.removeEventListener("musicpostr:albums-updated", syncInternalSections);
  }, []);

  useEffect(() => {
    async function parseJson(res: Response | null) {
      if (!res || !res.ok) return null;
      const contentType = res.headers.get("content-type") || "";
      if (!contentType.includes("application/json")) return null;
      try {
        return await res.json();
      } catch {
        return null;
      }
    }

    async function fetchHomeData() {
      setIsLoading(true);
      try {
        // Carrega as seções baseadas nas avaliações e ouvintes internos imediatamente
        setHighlights(getHighlightAlbums(10));
        setPopularAlbums(getPopularAlbumsByInternalActivity(8));
        setTopRatedAlbums(getTopRatedAlbumsByInternalReviews(8));

        const [mbNewReleases, newsRes] = await Promise.all([
          fetchNewReleasesFromMusicBrainz(8),
          fetch("/api/news").catch(() => null),
        ]);

        setNewReleases(mbNewReleases);

        const newsData = await parseJson(newsRes);
        if (newsData && newsData.articles) {
          setNews(newsData.articles.slice(0, 3));
        }
      } catch (error) {
        console.error("Erro ao carregar dados da Home:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchHomeData();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const currentAlbum = highlights[activeIndex] || popularAlbums[0];

  return (
    <div className="home-page-container">
      {/* 1. HERO BANNER DE DESTAQUES */}
      {currentAlbum && (
        <section className="hero-banner-section">
          <div
            className="hero-backdrop"
            style={{
              backgroundImage: `url(${currentAlbum.cover_xl || currentAlbum.cover_big})`,
            }}
          />
          <div className="hero-gradient-overlay" />

          <div className="hero-content-wrapper">
            <div className="hero-info-container">
              <div className="flex items-center gap-2 mb-1">
                <span className="hero-badge">
                  <Sparkles className="h-3.5 w-3.5 text-primary animate-pulse" />{" "}
                  Destaque da Crítica
                </span>
              </div>

              <h1 className="hero-title">{currentAlbum.title}</h1>
              <p className="hero-artist">
                por{" "}
                <span className="text-primary font-bold">
                  {currentAlbum.artist?.name}
                </span>
              </p>

              <div className="hero-metadata">
                <span className="hero-rating-pill">
                  <Star className="h-3.5 w-3.5 fill-current" />{" "}
                  {currentAlbum.communityRating.toFixed(1)} / 10 (Média)
                </span>
                <span>•</span>
                <span className="font-medium">
                  {currentAlbum.release_date?.substring(0, 4) || "2026"}
                </span>
                <span>•</span>
                <span className="font-medium flex items-center gap-1">
                  <Headphones className="h-3.5 w-3.5 text-primary" />
                  {currentAlbum.listenersCount.toLocaleString("pt-BR")} ouvintes
                </span>
              </div>

              <div className="hero-actions">
                <Link to={`/album/${currentAlbum.id}`}>
                  <Button className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-7 py-3 text-xs font-bold gap-2 shadow-lg shadow-primary/25 transition-all hover:scale-105 cursor-pointer">
                    <Play className="h-4 w-4 fill-primary-foreground" /> Ouvir e
                    Avaliar
                  </Button>
                </Link>
                <Link to="/reviews">
                  <Button
                    variant="outline"
                    className="rounded-full px-7 py-3 text-xs font-semibold border-border/80 bg-card/50 hover:bg-card/90 backdrop-blur-md text-foreground shadow-sm transition-all hover:scale-105 cursor-pointer"
                  >
                    Ver Comunidade
                  </Button>
                </Link>
              </div>
            </div>

            <div className="hero-thumbnails-bar">
              <div className="hero-thumbnails-track">
                {highlights.map((item, index) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveIndex(index)}
                    className={`hero-thumb-card ${activeIndex === index ? "active" : ""}`}
                  >
                    <img
                      src={item.cover_medium || item.cover_big}
                      alt={item.title}
                      onError={handleCoverImageError}
                    />
                    <div className="hero-thumb-overlay">
                      <span className="text-[10px] font-bold text-white truncate">
                        {item.title}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 2. ÁLBUNS POPULARES (BASEADO NAS AVALIAÇÕES INTERNAS E QUANTIDADE DE OUVINTES) */}
      <section className="content-section max-w-7xl mx-auto px-4 py-10 w-full">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-bold text-foreground">
              Álbuns Populares do Momento
            </h2>
          </div>
          <Link
            to="/top-albuns"
            className="text-xs text-primary font-semibold flex items-center gap-1 hover:underline"
          >
            Ver lista completa <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-5">
          {popularAlbums.map((album) => (
            <Link
              key={album.id}
              to={`/album/${album.id}`}
              className="popular-album-card group"
            >
              <div className="popular-cover-wrapper">
                <img
                  src={album.cover_big || album.cover_medium}
                  alt={album.title}
                  onError={handleCoverImageError}
                />
                <div className="popular-rating-badge">
                  ★ {album.communityRating.toFixed(1)}
                </div>
              </div>
              <h3 className="popular-title group-hover:text-primary">
                {album.title}
              </h3>
              <p className="popular-artist">{album.artist?.name}</p>
              <p className="text-[11px] text-muted-foreground mt-0.5 flex items-center gap-1.5">
                <Headphones className="h-3 w-3 text-primary" />
                <span>
                  {album.listenersCount.toLocaleString("pt-BR")} ouvintes •{" "}
                  {album.totalReviews} avaliações
                </span>
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. LANÇAMENTOS RECENTES (MUSICBRAINZ API + COVER ART ARCHIVE) */}
      {newReleases.length > 0 && (
        <section className="content-section max-w-7xl mx-auto px-4 py-6 w-full">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Flame className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-bold text-foreground">
                Novos Lançamentos
              </h2>
            </div>
            <Link
              to="/rankings?filter=releases"
              className="text-xs text-primary font-semibold flex items-center gap-1 hover:underline"
            >
              Ver lista completa <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-5">
            {newReleases.map((album) => (
              <Link
                key={album.id}
                to={`/album/${album.id}`}
                className="popular-album-card group"
              >
                <div className="popular-cover-wrapper">
                  <img
                    src={album.cover_big || album.cover_medium}
                    alt={album.title}
                    onError={handleCoverImageError}
                  />
                  <span className="absolute bottom-2 left-2 bg-primary/90 text-primary-foreground text-[10px] font-bold px-2 py-0.5 rounded">
                    NOVO • {album.release_date?.substring(0, 4) || "2026"}
                  </span>
                </div>
                <h3 className="popular-title group-hover:text-primary">
                  {album.title}
                </h3>
                <p className="popular-artist">{album.artist?.name}</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* 4. MAIS BEM AVALIADOS PELA COMUNIDADE (BASEADO NA AVALIAÇÃO INTERNA DOS USUÁRIOS) */}
      <section className="content-section max-w-7xl mx-auto px-4 py-6 w-full">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Award className="h-5 w-5 text-amber-500" />
            <h2 className="text-xl font-bold text-foreground">
              Mais Bem Avaliados (Aclamados)
            </h2>
          </div>
          <Link
            to="/rankings?filter=top-rated"
            className="text-xs text-primary font-semibold flex items-center gap-1 hover:underline"
          >
            Ver ranking completo <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-5">
          {topRatedAlbums.map((album) => (
            <Link
              key={album.id}
              to={`/album/${album.id}`}
              className="popular-album-card group"
            >
              <div className="popular-cover-wrapper">
                <img
                  src={album.cover_big || album.cover_medium}
                  alt={album.title}
                  onError={handleCoverImageError}
                />
                <div className="popular-rating-badge bg-amber-500 text-black font-extrabold">
                  ★ {album.communityRating.toFixed(1)}
                </div>
              </div>
              <h3 className="popular-title group-hover:text-primary">
                {album.title}
              </h3>
              <p className="popular-artist">{album.artist?.name}</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                {album.totalReviews} avaliações da comunidade
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* 5. GÊNEROS E ESTILOS */}
      <section className="content-section max-w-7xl mx-auto px-4 py-8 w-full">
        <div className="flex items-center gap-2 mb-6">
          <Compass className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-bold text-foreground">
            Explorar por Gênero
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
          {GENRES.map((genre) => (
            <Link
              key={genre.id}
              to={`/reviews?genre=${encodeURIComponent(genre.id)}`}
              className={`h-28 rounded-2xl p-4 bg-gradient-to-br ${genre.color} flex flex-col justify-between shadow-md hover:scale-105 transition-transform text-white`}
            >
              <span className="font-bold text-sm tracking-wide">
                {genre.name}
              </span>
              <Music className="h-6 w-6 self-end opacity-80" />
            </Link>
          ))}
        </div>
      </section>

      {/* 6. TOP MÚSICAS GLOBAIS (ESTILO YOUTUBE MUSIC COM BOTÕES DE NAVEGAÇÃO LATERAL) */}
      {topTracks.length > 0 && (
        <section className="content-section max-w-7xl mx-auto px-4 py-6 w-full">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Music className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-bold text-foreground">Top Músicas</h2>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => scrollTracks("left")}
                className="rounded-full h-8 w-8 bg-card border-border hover:bg-muted"
                aria-label="Rolar para esquerda"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => scrollTracks("right")}
                className="rounded-full h-8 w-8 bg-card border-border hover:bg-muted"
                aria-label="Rolar para direita"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Container horizontal com scroll oculto e comportamento estilo YouTube Music */}
          <div
            ref={tracksScrollRef}
            className="flex gap-4 overflow-x-auto scrollbar-none pb-2 snap-x snap-mandatory"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            <div className="grid grid-rows-4 grid-flow-col gap-3 min-w-full">
              {topTracks.map((track, idx) => (
                <div
                  key={track.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-card border border-border hover:border-primary/50 transition-colors w-[300px] sm:w-[350px] snap-start"
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    <span className="text-sm font-bold text-muted-foreground w-5 text-center flex-shrink-0">
                      {idx + 1}
                    </span>
                    <img
                      src={track.album?.cover_medium}
                      alt={track.title}
                      onError={handleCoverImageError}
                      className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                    />
                    <div className="overflow-hidden">
                      <h4 className="text-xs font-bold text-foreground truncate">
                        {track.title}
                      </h4>
                      <p className="text-[11px] text-muted-foreground truncate">
                        {track.artist?.name}
                      </p>
                    </div>
                  </div>
                  <Link
                    to={`/album/${track.album.id}`}
                    className="flex-shrink-0 ml-2"
                  >
                    <Button
                      size="icon"
                      variant="ghost"
                      className="rounded-full h-8 w-8 hover:text-primary"
                    >
                      <Play className="h-4 w-4 fill-current" />
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 7. SEÇÃO DE NOTÍCIAS DA CRÍTICA MUSICAL */}
      {news.length > 0 && (
        <section className="content-section max-w-7xl mx-auto px-4 py-8 w-full">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Newspaper className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-bold text-foreground">
                Crítica e Notícias Globais
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {news.map((item, index) => (
              <a
                key={index}
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-card border border-border p-4 rounded-2xl hover:border-primary transition-all group flex flex-col justify-between"
              >
                <div>
                  {item.thumbnail && (
                    <div className="w-full h-40 rounded-xl overflow-hidden mb-3 bg-muted">
                      <img
                        src={item.thumbnail}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}
                  <h3 className="text-sm font-bold text-foreground group-hover:text-primary transition-colors line-clamp-2">
                    {item.title}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-2 line-clamp-2">
                    {item.description}
                  </p>
                </div>
                <div className="flex items-center justify-between mt-4 pt-3 border-t border-border/60 text-[11px] text-muted-foreground">
                  <span>{item.pubDate.substring(0, 10)}</span>
                  <span className="flex items-center gap-1 text-primary font-semibold group-hover:underline">
                    Ler matéria <ExternalLink className="h-3 w-3" />
                  </span>
                </div>
              </a>
            ))}
          </div>
        </section>
      )}

      {/* 8. FOOTER INSTITUCIONAL */}
      <footer className="site-footer">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-black">
                <Disc className="h-5 w-5" />
              </div>
              <span className="font-extrabold text-foreground text-lg tracking-tight">
                Musicpostr
              </span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Sua rede social definitiva para diário de escuta, críticas sonoras
              e compartilhamento de notas musicais.
            </p>
          </div>

          <div>
            <h4 className="footer-heading">Plataforma</h4>
            <ul className="footer-links">
              <li>
                <Link to="/feed">Feed da Comunidade</Link>
              </li>
              <li>
                <Link to="/rankings">Rankings e Notas</Link>
              </li>
              <li>
                <Link to="/artistas">Artistas em Alta</Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="footer-heading">Legal & Privacidade</h4>
            <ul className="footer-links">
              <li>
                <a href="#sobre" onClick={(e) => e.preventDefault()}>
                  Sobre o Musicpostr
                </a>
              </li>
              <li>
                <a href="#termos" onClick={(e) => e.preventDefault()}>
                  Termos de Serviço
                </a>
              </li>
              <li>
                <a href="#privacidade" onClick={(e) => e.preventDefault()}>
                  Política de Privacidade
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="footer-heading">Contato & Suporte</h4>
            <ul className="footer-links">
              <li>
                <a
                  href="#contato"
                  onClick={(e) => e.preventDefault()}
                  className="flex items-center gap-1.5"
                >
                  <Mail className="h-3.5 w-3.5" /> suporte@musicpostr.com
                </a>
              </li>
              <li>
                <span className="text-[11px] text-muted-foreground">
                  Versão 1.2.0-beta
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
            <p>© 2026 Musicpostr. Todos os direitos reservados.</p>
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />{" "}
                Ambiente Seguro
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
