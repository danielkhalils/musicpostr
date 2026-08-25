import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Music,
  Award,
} from "lucide-react";
import { Button } from "../../components/ui/button";
import "./ArtistsPage.css";

interface Artist {
  id: string;
  name: string;
  imageUrl?: string;
  nbFans?: number;
}

export function ArtistsPage() {
  const [artists, setArtists] = useState<Artist[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);

  // Estado para armazenar os IDs dos artistas seguidos (Ídolos) sincronizados com o localStorage
  const [followedIds, setFollowedIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem("musicpostr_idols");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const ITEMS_PER_PAGE = 18;

  useEffect(() => {
    setPage(1);
  }, [searchQuery]);

  // Salvar ídolos no localStorage sempre que houver alteração
  useEffect(() => {
    try {
      localStorage.setItem("musicpostr_idols", JSON.stringify(followedIds));
    } catch (e) {
      console.error("Erro ao salvar ídolos:", e);
    }
  }, [followedIds]);

  const toggleFollow = (artist: Artist, e: React.MouseEvent) => {
    e.preventDefault(); // Evita que o clique navegue para a página do artista ao clicar no botão
    setFollowedIds((prev) => {
      const isFollowing = prev.includes(artist.id);
      if (isFollowing) {
        return prev.filter((id) => id !== artist.id);
      } else {
        // Opcional: Salvar os dados completos do artista no localStorage para a página de Ídolos renderizar se necessário
        const currentIdolsData = JSON.parse(localStorage.getItem("musicpostr_idols_data") || "[]");
        if (!currentIdolsData.some((a: any) => a.id === artist.id)) {
          currentIdolsData.push(artist);
          localStorage.setItem("musicpostr_idols_data", JSON.stringify(currentIdolsData));
        }
        return [...prev, artist.id];
      }
    });
  };

  useEffect(() => {
    async function fetchDeezerArtists() {
      setIsLoading(true);
      try {
        const query = searchQuery.trim() === "" ? "pop" : searchQuery;
        const index = (page - 1) * ITEMS_PER_PAGE;

        const response = await fetch(
          `/api/deezer/search/artist?q=${encodeURIComponent(query)}&index=${index}&limit=${ITEMS_PER_PAGE}`
        );
        const data = await response.json();

        if (data && data.data && data.data.length > 0) {
          const rawArtists = data.data;

          const blockedNames = [
            "various artists", "unknown", "various", "artist", "none", "anonymous", "soundtrack",
            "original soundtrack", "motion picture soundtrack", "various composers", 
            "karaoke", "tribute", "orchestra", "choir", "ensemble", "studio cast",
            "cast", "ensemble cast", "studio musicians", "instrumental", "dj", "dj mix",
            "vários artistas", "artista desconhecido", "desconhecido", "anônimo", 
            "varios", "banda sonora", "trilha sonora", "test", "teste", "n/a"
          ];

          const validArtists = rawArtists.filter((artist: any) => {
            const name = artist.name.toLowerCase().trim();
            if (!name || name.startsWith("[") || name.endsWith("]")) return false;
            if (blockedNames.includes(name)) return false;
            return true;
          });

          const usedImages = new Set<string>();

          const formattedArtists = validArtists.map((artist: any) => {
            const imageUrl =
              artist.picture_xl ||
              artist.picture_big ||
              artist.picture_medium ||
              "";

            let finalImageUrl = "";
            if (imageUrl && !usedImages.has(imageUrl)) {
              finalImageUrl = imageUrl;
              usedImages.add(imageUrl);
            }

            return {
              id: artist.id.toString(),
              name: artist.name,
              imageUrl: finalImageUrl,
              nbFans: artist.nb_fans,
            };
          });

          setArtists(formattedArtists);
          setHasMore(rawArtists.length >= ITEMS_PER_PAGE);
        } else {
          setArtists([]);
          setHasMore(false);
        }
      } catch (error) {
        console.error("Erro ao buscar artistas no Deezer:", error);
      } finally {
        setIsLoading(false);
      }
    }

    const timeoutId = setTimeout(() => {
      fetchDeezerArtists();
    }, 400);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, page]);

  return (
    <div className="artists-page-container">
      <div className="artists-content-wrapper">
        
        <div className="artists-header">
          <h1 className="artists-title">
            Buscar Artistas
          </h1>
          <p className="artists-subtitle">
            Pesquise e clique em um artista para ver o banner, discografia e álbuns oficiais
          </p>

          <div className="artists-search-box">
            <Search className="artists-search-icon" />
            <input
              type="text"
              placeholder="Digite o nome de um artista ou banda..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="artists-search-input"
            />
          </div>
        </div>

        {isLoading ? (
          <div className="artists-loader-container">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
          </div>
        ) : artists.length === 0 ? (
          <div className="artists-empty-state">
            Nenhum artista encontrado para "{searchQuery}".
          </div>
        ) : (
          <div className="artists-grid">
            {artists.map((artist) => {
              const isFollowing = followedIds.includes(artist.id);

              return (
                <div
                  key={artist.id}
                  className="artist-card-wrapper relative group"
                >
                  <Link
                    to={`/artista/${artist.id}`}
                    className="artist-card flex flex-col items-center"
                  >
                    <div className="artist-avatar-wrapper">
                      {artist.imageUrl ? (
                        <img
                          src={artist.imageUrl}
                          alt={artist.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Music className="h-10 w-10 text-zinc-600" />
                      )}
                    </div>

                    <span className="artist-name text-center">
                      {artist.name}
                    </span>

                    <span className="artist-fans">
                      {artist.nbFans ? `${artist.nbFans.toLocaleString()} fãs` : "Artista"}
                    </span>
                  </Link>

                  {/* Botão de Seguir / Ídolo Flutuante no Card */}
                  <div className="absolute top-3 right-3 z-10">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={(e) => toggleFollow(artist, e)}
                      className={`h-8 px-3 rounded-full text-xs font-semibold shadow-md transition-all gap-1 ${
                        isFollowing
                          ? "bg-primary text-white border-primary hover:bg-primary/80 dark:bg-primary dark:hover:bg-primary/80"
                          : "bg-zinc-900/90 text-zinc-200 border-zinc-700 hover:bg-zinc-800 hover:text-white dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800"
                      }`}
                      title={isFollowing ? "Deixar de seguir" : "Seguir como ídolo"}
                    >
                      <Award className={`h-3.5 w-3.5 ${isFollowing ? "fill-white" : ""}`} />
                      {isFollowing ? "Seguindo" : "Seguir"}
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {!isLoading && artists.length > 0 && (
        <div className="artists-pagination">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setPage((prev) => Math.max(prev - 1, 1));
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            disabled={page === 1 || isLoading}
            className="artists-pagination-btn"
          >
            <ChevronLeft className="h-4 w-4 mr-1" /> Anterior
          </Button>

          <span className="artists-page-indicator">
            Página {page}
          </span>

          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setPage((prev) => prev + 1);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            disabled={!hasMore || isLoading}
            className="artists-pagination-btn"
          >
            Próxima <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      )}
    </div>
  );
}