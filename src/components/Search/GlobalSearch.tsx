import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Disc, Mic, Music, User, Loader2, X } from "lucide-react";
import {
  searchLocalCatalogInstant,
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

const COMMUNITY_USERS: SearchResult[] = [
  {
    id: "user-1",
    title: "Ana Beatriz",
    subtitle: "@anabeat • Usuário",
    type: "user",
    link: "/perfil",
  },
  {
    id: "user-2",
    title: "Lucas Sound",
    subtitle: "@lucas_snd • Usuário",
    type: "user",
    link: "/perfil/lucas_snd",
  },
  {
    id: "user-3",
    title: "Beat Critic",
    subtitle: "@beatcritic • Usuário",
    type: "user",
    link: "/perfil/beatcritic",
  },
];

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

  useEffect(() => {
    let isMounted = true;
    const trimmed = query.trim();

    if (!trimmed) {
      setResults([]);
      setIsLoading(false);
      return;
    }

    // 1. Resposta instantânea (0ms) do catálogo local em memória
    const local = searchLocalCatalogInstant(trimmed);
    const matchedUsers = COMMUNITY_USERS.filter(
      (u) =>
        u.title.toLowerCase().includes(trimmed.toLowerCase()) ||
        u.subtitle.toLowerCase().includes(trimmed.toLowerCase())
    );

    const instantResults: SearchResult[] = [
      ...local.albums.map((item) => ({
        id: `album-${item.id}`,
        title: item.title,
        subtitle: `Álbum • ${item.artist.name}`,
        type: "album" as const,
        image: item.cover_medium,
        link: `/album/${item.id}`,
      })),
      ...local.artists.map((item) => ({
        id: `artist-${item.id}`,
        title: item.name,
        subtitle: `Artista • ${item.genre}`,
        type: "artist" as const,
        image: item.imageUrl || undefined,
        link: `/artista/${item.id}`,
      })),
      ...local.tracks.map((item) => ({
        id: `track-${item.id}`,
        title: item.title,
        subtitle: `Música • ${item.artist.name}`,
        type: "track" as const,
        image: item.album.cover_medium,
        link: `/album/${item.album.id}`,
      })),
      ...matchedUsers,
    ];

    setResults(instantResults);
    setIsLoading(instantResults.length === 0);

    // 2. Busca complementar no MusicBrainz (com debounce suave)
    const timer = setTimeout(async () => {
      try {
        const [albumRes, artistRes, trackRes] = await Promise.all([
          activeTab === "all" || activeTab === "album"
            ? searchAlbumsInMusicBrainz(trimmed, 5, 0)
            : Promise.resolve({ albums: [], total: 0 }),
          activeTab === "all" || activeTab === "artist"
            ? searchArtistsInMusicBrainz(trimmed, 4, 0)
            : Promise.resolve({ artists: [], total: 0 }),
          activeTab === "all" || activeTab === "track"
            ? searchTracksInMusicBrainz(trimmed, 4)
            : Promise.resolve([]),
        ]);

        if (!isMounted) return;

        const mergedMap = new Map<string | number, SearchResult>();
        for (const item of instantResults) {
          if (item.type !== "user") {
            mergedMap.set(item.id, item);
          }
        }

        albumRes.albums.forEach((item) => {
          const typeLabel =
            item.record_type === "ep"
              ? "EP"
              : item.record_type === "single"
                ? "Single"
                : "Álbum";
          mergedMap.set(`album-${item.id}`, {
            id: `album-${item.id}`,
            title: item.title,
            subtitle: `${typeLabel} • ${item.artist?.name || "Artista"}`,
            type: "album",
            image: item.cover_medium,
            link: `/album/${item.id}`,
          });
        });

        artistRes.artists.forEach((item) => {
          mergedMap.set(`artist-${item.id}`, {
            id: `artist-${item.id}`,
            title: item.name,
            subtitle: `Artista • ${item.genre || "Catálogo"}`,
            type: "artist",
            image: item.imageUrl || undefined,
            link: `/artista/${item.id}`,
          });
        });

        trackRes.forEach((item) => {
          mergedMap.set(`track-${item.id}`, {
            id: `track-${item.id}`,
            title: item.title,
            subtitle: `Música • ${item.artist?.name || "Artista"}`,
            type: "track",
            image: item.album?.cover_medium,
            link: item.album?.id
              ? `/album/${item.album.id}`
              : `/artista/${item.artist?.id || ""}`,
          });
        });

        setResults([...Array.from(mergedMap.values()), ...matchedUsers]);
      } catch (error) {
        console.error("Erro na busca global:", error);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }, 260);

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [query, activeTab]);

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

      {isOpen && query.trim() !== "" && (
        <div className="absolute right-0 mt-2 w-[calc(100vw-2rem)] max-w-sm md:w-96 md:max-w-none bg-zinc-950 border border-zinc-800/90 rounded-2xl shadow-2xl z-50 overflow-hidden backdrop-blur-xl animate-in fade-in slide-in-from-top-2 duration-200">
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

          <div className="max-h-80 overflow-y-auto p-2 space-y-1">
            {isLoading && filteredResults.length === 0 ? (
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
                      loading="lazy"
                      decoding="async"
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
