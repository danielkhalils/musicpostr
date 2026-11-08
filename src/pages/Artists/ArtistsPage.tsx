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
import {
  type CatalogArtist,
  FEATURED_ARTISTS,
  searchArtistsInMusicBrainz,
} from "../../services/musicBrainz.service";
import { handleCoverImageError } from "../../services/coverArt.service";
import "./ArtistsPage.css";

export function ArtistsPage() {
  const ITEMS_PER_PAGE = 18;

  const [artists, setArtists] = useState<CatalogArtist[]>(() =>
    FEATURED_ARTISTS.slice(0, ITEMS_PER_PAGE)
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const [followedIds, setFollowedIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem("musicpostr_idols");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    setPage(1);
  }, [searchQuery]);

  useEffect(() => {
    try {
      localStorage.setItem("musicpostr_idols", JSON.stringify(followedIds));
    } catch (e) {
      console.error("Erro ao salvar ídolos:", e);
    }
  }, [followedIds]);

  const toggleFollow = (artist: CatalogArtist, e: React.MouseEvent) => {
    e.preventDefault();
    setFollowedIds((prev) => {
      const isFollowing = prev.includes(artist.id);
      if (isFollowing) {
        return prev.filter((id) => id !== artist.id);
      } else {
        const currentIdolsData = JSON.parse(
          localStorage.getItem("musicpostr_idols_data") || "[]"
        );
        if (!currentIdolsData.some((a: any) => a.id === artist.id)) {
          currentIdolsData.push(artist);
          localStorage.setItem(
            "musicpostr_idols_data",
            JSON.stringify(currentIdolsData)
          );
        }
        return [...prev, artist.id];
      }
    });
  };

  useEffect(() => {
    let isMounted = true;
    const trimmed = searchQuery.trim();
    const offset = (page - 1) * ITEMS_PER_PAGE;

    // 1. Sem busca na página 1: renderiza instantaneamente (0ms)
    if (!trimmed && page === 1) {
      setArtists(FEATURED_ARTISTS.slice(0, ITEMS_PER_PAGE));
      setHasMore(true);
      setIsLoading(false);
      return;
    }

    // 2. Ao digitar: mostra imediatamente os artistas em memória que batem com o texto
    if (trimmed && page === 1) {
      const instantMatches = FEATURED_ARTISTS.filter((a) =>
        a.name.toLowerCase().includes(trimmed.toLowerCase())
      );
      if (instantMatches.length > 0) {
        setArtists(instantMatches);
      }
    }

    const timeoutId = setTimeout(
      async () => {
        if (!trimmed || FEATURED_ARTISTS.filter((a) => a.name.toLowerCase().includes(trimmed.toLowerCase())).length === 0) {
          setIsLoading(true);
        }
        try {
          const { artists: fetchedArtists, total } =
            await searchArtistsInMusicBrainz(searchQuery, ITEMS_PER_PAGE, offset);
          if (!isMounted) return;
          setArtists(fetchedArtists);
          setHasMore(
            offset + fetchedArtists.length < total &&
              fetchedArtists.length >= ITEMS_PER_PAGE
          );
        } catch (error) {
          console.error("Erro ao buscar artistas no MusicBrainz:", error);
        } finally {
          if (isMounted) {
            setIsLoading(false);
          }
        }
      },
      trimmed ? 250 : 0
    );

    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
    };
  }, [searchQuery, page]);

  return (
    <div className="artists-page-container">
      <div className="artists-content-wrapper">
        <div className="artists-header">
          <h1 className="artists-title">Buscar Artistas</h1>
          <p className="artists-subtitle">
            Pesquise e clique em um artista para ver o banner, discografia,
            álbuns, EPs e singles oficiais
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
                  className="artist-card-wrapper flex flex-col items-center group w-full"
                >
                  <Link
                    to={`/artista/${artist.id}`}
                    className="artist-card flex flex-col items-center w-full"
                  >
                    <div className="artist-avatar-wrapper">
                      {artist.imageUrl ? (
                        <img
                          src={artist.imageUrl}
                          alt={artist.name}
                          loading="lazy"
                          decoding="async"
                          onError={handleCoverImageError}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Music className="h-10 w-10 text-muted-foreground" />
                      )}
                    </div>

                    <span className="artist-name">{artist.name}</span>

                    <span className="artist-fans">
                      {artist.nbFans
                        ? `${artist.nbFans.toLocaleString("pt-BR")} ouvintes`
                        : artist.genre || "Artista"}
                    </span>
                  </Link>

                  <div className="mt-2.5">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={(e) => toggleFollow(artist, e)}
                      className={`h-7 px-3.5 rounded-full text-xs font-semibold shadow-xs transition-all gap-1 cursor-pointer ${
                        isFollowing
                          ? "bg-primary text-primary-foreground border-primary hover:bg-primary/90"
                          : "bg-card/80 text-foreground border-border hover:bg-muted"
                      }`}
                      title={
                        isFollowing ? "Deixar de seguir" : "Seguir como ídolo"
                      }
                    >
                      <Award
                        className={`h-3 w-3 ${isFollowing ? "fill-current" : ""}`}
                      />
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
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            disabled={page === 1 || isLoading}
            className="artists-pagination-btn"
          >
            <ChevronLeft className="h-4 w-4 mr-1" /> Anterior
          </Button>

          <span className="artists-page-indicator">Página {page}</span>

          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setPage((prev) => prev + 1);
              window.scrollTo({ top: 0, behavior: "smooth" });
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
