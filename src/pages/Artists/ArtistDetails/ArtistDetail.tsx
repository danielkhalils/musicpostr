import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  Loader2,
  Disc,
  Music as MusicIcon,
  Radio,
  ChevronDown,
} from "lucide-react";
import "./ArtistDetail.css";
import { Button } from "../../../components/ui/button";

interface DeezerAlbum {
  id: number;
  title: string;
  cover_medium?: string;
  cover_big?: string;
  release_date?: string;
  record_type?: string;
}

export function ArtistDetail() {
  const { id } = useParams<{ id: string }>();
  const [artistName, setArtistName] = useState("");
  const [artistBanner, setArtistBanner] = useState("");
  const [albums, setAlbums] = useState<DeezerAlbum[]>([]);
  const [epsAndSingles, setEpsAndSingles] = useState<DeezerAlbum[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [visibleAlbumsCount, setVisibleAlbumsCount] = useState(10);
  const [visibleEpsCount, setVisibleEpsCount] = useState(10);

  useEffect(() => {
    async function fetchArtistDetails() {
      setIsLoading(true);
      setVisibleAlbumsCount(10);
      setVisibleEpsCount(10);

      try {
        const artistRes = await fetch(`/api/deezer/artist/${id}`);
        const artistData = await artistRes.json();

        if (artistData && artistData.name) {
          setArtistName(artistData.name);
          setArtistBanner(
            artistData.picture_xl ||
              artistData.picture_big ||
              artistData.picture_medium ||
              "",
          );
        }

        const albumsRes = await fetch(
          `/api/deezer/artist/${id}/albums?limit=100`,
        );
        const albumsData = await albumsRes.json();

        if (albumsData && albumsData.data) {
          const uniqueReleases = Array.from(
            new Map(
              albumsData.data.map((item: any) => [item.title, item]),
            ).values(),
          ) as DeezerAlbum[];

          const studioAlbums = uniqueReleases.filter(
            (item) => !item.record_type || item.record_type === "album",
          );

          const otherReleases = uniqueReleases.filter(
            (item) =>
              item.record_type === "ep" || item.record_type === "single",
          );

          setAlbums(studioAlbums);
          setEpsAndSingles(otherReleases);
        }
      } catch (error) {
        console.error("Erro ao carregar detalhes do artista no Deezer:", error);
      } finally {
        setIsLoading(false);
      }
    }

    if (id) {
      fetchArtistDetails();
    }
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const displayedAlbums = albums.slice(0, visibleAlbumsCount);
  const displayedEps = epsAndSingles.slice(0, visibleEpsCount);

  return (
    <div className="artist-detail-container">
      {/* Banner no Topo */}
      <div className="artist-banner-wrapper">
        {artistBanner ? (
          <div
            className="artist-banner-bg"
            style={{ backgroundImage: `url(${artistBanner})` }}
          />
        ) : (
          <div className="artist-banner-fallback" />
        )}

        <div className="artist-banner-gradient" />

        <div className="artist-banner-content">
          <Link to="/artistas" className="artist-back-button">
            <ArrowLeft className="h-4 w-4" /> Voltar para busca
          </Link>

          <div>
            <h1 className="text-3xl sm:text-4xl md:text-6xl font-black tracking-tight text-foreground drop-shadow-xs break-words">
              {artistName || "Detalhes do Artista"}
            </h1>
            <p className="text-muted-foreground mt-2 text-sm md:text-base font-medium">
              Discografia, álbuns e lançamentos oficiais
            </p>
          </div>
        </div>
      </div>

      <div className="artist-main-content">

        {/* Seção de Álbuns */}
        {albums.length > 0 && (
          <div className="mt-12">
            <h2 className="section-title">
              <Disc className="h-6 w-6 text-primary" /> Álbuns de Estúdio
            </h2>

            <div className="releases-grid">
              {displayedAlbums.map((album) => {
                const coverUrl = album.cover_big || album.cover_medium;

                return (
                  <Link
                    key={album.id}
                    to={`/album/${album.id}`}
                    className="release-card group cursor-pointer"
                  >
                    <div>
                      <div className="release-cover-box">
                        {coverUrl ? (
                          <img
                            src={coverUrl}
                            alt={album.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <MusicIcon className="h-10 w-10 text-muted-foreground" />
                        )}
                      </div>
                      <h3 className="font-medium text-[var(--foreground)] text-sm line-clamp-1 group-hover:text-primary transition-colors">
                        {album.title}
                      </h3>
                      <p className="text-xs text-muted-foreground mt-1">
                        {album.release_date?.substring(0, 4) ||
                          "Ano desconhecido"}
                      </p>
                    </div>
                    <span className="release-tag">Álbum</span>
                  </Link>
                );
              })}
            </div>

            {visibleAlbumsCount < albums.length && (
              <div className="flex justify-center mt-8">
                <Button
                  variant="outline"
                  onClick={() => setVisibleAlbumsCount((prev) => prev + 10)}
                  className="bg-card border-border text-foreground hover:bg-muted rounded-full px-6 shadow-sm"
                >
                  Ver mais álbuns <ChevronDown className="h-4 w-4 ml-1" />
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Seção de EPs e Singles */}
        {epsAndSingles.length > 0 && (
          <div className="mt-12">
            <h2 className="section-title">
              <Radio className="h-6 w-6 text-primary" /> EPs e Singles
            </h2>

            <div className="releases-grid">
              {displayedEps.map((item) => {
                const coverUrl = item.cover_big || item.cover_medium;

                return (
                  <Link
                    key={item.id}
                    to={`/album/${item.id}`}
                    className="release-card group cursor-pointer"
                  >
                    <div>
                      <div className="release-cover-box">
                        {coverUrl ? (
                          <img
                            src={coverUrl}
                            alt={item.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <MusicIcon className="h-10 w-10 text-muted-foreground" />
                        )}
                      </div>
                      <h3 className="font-medium text-[var(--foreground)] text-sm line-clamp-1 group-hover:text-primary transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-xs text-muted-foreground mt-1">
                        {item.release_date?.substring(0, 4) ||
                          "Ano desconhecido"}
                      </p>
                    </div>
                    <span className="release-tag">
                      {item.record_type
                        ? item.record_type.toUpperCase()
                        : "Single"}
                    </span>
                  </Link>
                );
              })}
            </div>

            {visibleEpsCount < epsAndSingles.length && (
              <div className="flex justify-center mt-8">
                <Button
                  variant="outline"
                  onClick={() => setVisibleEpsCount((prev) => prev + 10)}
                  className="bg-card border-border text-foreground hover:bg-muted rounded-full px-6 shadow-sm"
                >
                  Ver mais EPs e Singles{" "}
                  <ChevronDown className="h-4 w-4 ml-1" />
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}