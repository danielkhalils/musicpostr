import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Disc, Mic, Music, User, Loader2, X } from "lucide-react";
import {
  searchAlbumsInMusicBrainz,
  searchArtistsInMusicBrainz,
  searchTracksInMusicBrainz,
} from "../../services/musicBrainz.service";
import { handleCoverImageError } from "../../services/coverArt.service";
import "./GlobalSearch.css";

interface SearchResult {
  id: number | string;
  title: string;
  subtitle: string;
  type: "album" | "artist" | "track" | "user";
  image?: string;
  link: string;
}

export function GlobalSearch() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeTab, setActiveTab] = useState<
    "all" | "album" | "artist" | "track" | "user"
  >("all");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const searchRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Fecha o menu ao clicar fora
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Busca integrada no MusicBrainz + Cover Art Archive + Usuários da comunidade
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setIsLoading(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsLoading(true);
      try {
        const [albumRes, artistRes, trackRes] = await Promise.all([
          searchAlbumsInMusicBrainz(query, 5, 0),
          searchArtistsInMusicBrainz(query, 4, 0),
          searchTracksInMusicBrainz(query, 5),
        ]);

        let formattedResults: SearchResult[] = [];

        // Mapear Álbuns, EPs e Singles
        if (albumRes.albums) {
          albumRes.albums.forEach((item) => {
            const typeLabel =
              item.record_type === "ep"
                ? "EP"
                : item.record_type === "single"
                  ? "Single"
                  : "Álbum";
            formattedResults.push({
              id: `album-${item.id}`,
              title: item.title,
              subtitle: `${typeLabel} • ${item.artist?.name || "Artista"}`,
              type: "album" as const,
              image: item.cover_medium,
              link: `/album/${item.id}`,
            });
          });
        }

        // Mapear Artistas
        if (artistRes.artists) {
          artistRes.artists.forEach((item) => {
            formattedResults.push({
              id: `artist-${item.id}`,
              title: item.name,
              subtitle: `Artista • ${item.genre || "Catálogo"}`,
              type: "artist" as const,
              image: item.imageUrl || undefined,
              link: `/artista/${item.id}`,
            });
          });
        }

        // Mapear Músicas
        if (trackRes) {
          trackRes.forEach((item) => {
            formattedResults.push({
              id: `track-${item.id}`,
              title: item.title,
              subtitle: `Música • ${item.artist?.name || "Artista"}`,
              type: "track" as const,
              image: item.album?.cover_medium,
              link: item.album?.id
                ? `/album/${item.album.id}`
                : `/artista/${item.artist?.id || ""}`,
            });
          });
        }

        // Simular busca de Usuários do Musicpostr
        const mockUsers: SearchResult[] = [
          {
            id: "user-1",
            title: "Ana Beatriz",
            subtitle: "@anabeat • Usuário",
            type: "user" as const,
            link: "/perfil",
          },
          {
            id: "user-2",
            title: "Lucas Sound",
            subtitle: "@lucas_snd • Usuário",
            type: "user" as const,
            link: "/perfil/lucas_snd",
          },
          {
            id: "user-3",
            title: "Beat Critic",
            subtitle: "@beatcritic • Usuário",
            type: "user" as const,
            link: "/perfil/beatcritic",
          },
        ].filter(
          (u) =>
            u.title.toLowerCase().includes(query.toLowerCase()) ||
            u.subtitle.toLowerCase().includes(query.toLowerCase())
        );

        formattedResults = [...formattedResults, ...mockUsers];

        setResults(formattedResults);
      } catch (error) {
        console.error("Erro na busca global:", error);
      } finally {
        setIsLoading(false);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [query]);

  const filteredResults =
    activeTab === "all" ? results : results.filter((r) => r.type === activeTab);

  const getIcon = (type: string) => {
    switch (type) {
      case "album":
        return <Disc className="h-4 w-4 text-primary" />;
      case "artist":
        return <Mic className="h-4 w-4 text-amber-400" />;
      case "track":
        return <Music className="h-4 w-4 text-emerald-400" />;
      case "user":
        return <User className="h-4 w-4 text-purple-400" />;
      default:
        return <Search className="h-4 w-4 text-zinc-400" />;
    }
  };

  return (
    <div className="relative" ref={searchRef}>
      {/* Input de Busca na Topbar */}
      <div
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 bg-zinc-900/90 border border-zinc-800 hover:border-zinc-700 px-3 py-1.5 rounded-full text-zinc-200 transition-all cursor-text w-40 sm:w-56 md:w-64"
      >
        <Search className="h-4 w-4 text-zinc-400 flex-shrink-0" />
        <input
          type="text"
          placeholder="Buscar álbum, artista, música..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          className="bg-transparent border-none outline-none text-white w-full min-w-0 placeholder:text-zinc-500 text-base sm:text-xs"
        />
        {query && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setQuery("");
            }}
            aria-label="Limpar busca"
            className="p-1.5 -m-1 text-zinc-500 hover:text-white"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {/* Dropdown de Resultados */}
      {isOpen && query.trim() !== "" && (
        <div className="absolute right-0 mt-2 w-[calc(100vw-2rem)] max-w-sm md:w-96 md:max-w-none bg-zinc-950 border border-zinc-800/90 rounded-2xl shadow-2xl z-50 overflow-hidden backdrop-blur-xl animate-in fade-in slide-in-from-top-2 duration-200">
          {/* Abas de Filtro */}
          <div className="flex items-center gap-1 p-2 border-b border-zinc-800 bg-zinc-900/50 overflow-x-auto">
            {(["all", "album", "artist", "track", "user"] as const).map(
              (tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-3 py-1 rounded-full text-[11px] font-medium capitalize transition-colors whitespace-nowrap ${
                    activeTab === tab
                      ? "bg-primary text-white shadow-sm"
                      : "text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200"
                  }`}
                >
                  {tab === "all"
                    ? "Tudo"
                    : tab === "album"
                      ? "Álbuns"
                      : tab === "artist"
                        ? "Artistas"
                        : tab === "track"
                          ? "Músicas"
                          : "Usuários"}
                </button>
              )
            )}
          </div>

          {/* Lista de Resultados */}
          <div className="max-h-80 overflow-y-auto p-2 space-y-1">
            {isLoading ? (
              <div className="flex items-center justify-center py-8 text-zinc-500 gap-2 text-xs">
                <Loader2 className="h-4 w-4 animate-spin text-primary" />{" "}
                Buscando na comunidade e catálogo...
              </div>
            ) : filteredResults.length === 0 ? (
              <div className="py-8 text-center text-xs text-zinc-500">
                Nenhum resultado encontrado para "{query}".
              </div>
            ) : (
              filteredResults.map((item) => (
                <div
                  key={item.id}
                  onClick={() => {
                    navigate(item.link);
                    setIsOpen(false);
                    setQuery("");
                  }}
                  className="flex items-center gap-3 p-2 rounded-xl hover:bg-zinc-900/90 cursor-pointer transition-all group"
                >
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.title}
                      onError={handleCoverImageError}
                      className="w-10 h-10 rounded-lg object-cover flex-shrink-0 border border-zinc-800"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center flex-shrink-0">
                      {getIcon(item.type)}
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-white truncate group-hover:text-primary transition-colors">
                      {item.title}
                    </p>
                    <p className="text-[11px] text-zinc-400 truncate">
                      {item.subtitle}
                    </p>
                  </div>

                  <div className="opacity-0 group-hover:opacity-100 transition-opacity text-zinc-500 text-xs pr-1">
                    →
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
