import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Music,
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

  const ITEMS_PER_PAGE = 18;

  useEffect(() => {
    setPage(1);
  }, [searchQuery]);

  useEffect(() => {
    async function fetchDeezerArtists() {
      setIsLoading(true);
      try {
        const query = searchQuery.trim() === "" ? "pop" : searchQuery;
        const index = (page - 1) * ITEMS_PER_PAGE;

        // Utilizando a rota interna configurada no Vercel para evitar bloqueio de CORS em produção
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
            {artists.map((artist) => (
              <Link
                key={artist.id}
                to={`/artista/${artist.id}`}
                className="artist-card group"
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

                <span className="artist-name">
                  {artist.name}
                </span>

                <span className="artist-fans">
                  {artist.nbFans ? `${artist.nbFans.toLocaleString()} fãs` : "Artista"}
                </span>
              </Link>
            ))}
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