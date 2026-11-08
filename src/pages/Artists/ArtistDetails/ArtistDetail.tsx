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
import {
  type CatalogAlbum,
  getInstantArtistPreview,
  fetchArtistDetailsFromMusicBrainz,
} from "../../../services/musicBrainz.service";
import { handleCoverImageError } from "../../../services/coverArt.service";

export function ArtistDetail() {
  const { id } = useParams<{ id: string }>();
  const initialPreview = id ? getInstantArtistPreview(id) : null;

  const [artistName, setArtistName] = useState(initialPreview?.name || "");
  const [artistBanner, setArtistBanner] = useState(
    initialPreview?.bannerUrl || ""
  );
  const [albums, setAlbums] = useState<CatalogAlbum[]>(
    initialPreview?.albums || []
  );
  const [epsAndSingles, setEpsAndSingles] = useState<CatalogAlbum[]>(
    initialPreview?.epsAndSingles || []
  );
  const [isLoading, setIsLoading] = useState(!initialPreview);
  const [isSyncingDiscography, setIsSyncingDiscography] = useState(false);

  const [visibleAlbumsCount, setVisibleAlbumsCount] = useState(10);
  const [visibleEpsCount, setVisibleEpsCount] = useState(10);

  useEffect(() => {
    let isMounted = true;
    if (!id) return;

    setVisibleAlbumsCount(10);
    setVisibleEpsCount(10);

    const preview = getInstantArtistPreview(id);
    if (preview) {
      setArtistName(preview.name);
      setArtistBanner(preview.bannerUrl);
      setAlbums(preview.albums);
      setEpsAndSingles(preview.epsAndSingles);
      setIsLoading(false);
      setIsSyncingDiscography(true);
    } else {
      setIsLoading(true);
    }

    fetchArtistDetailsFromMusicBrainz(id)
      .then((details) => {
        if (!isMounted) return;
        setArtistName(details.name);
        setArtistBanner(details.bannerUrl);
        setAlbums(details.albums);
        setEpsAndSingles(details.epsAndSingles);
      })
      .catch((error) => {
        console.error(
          "Erro ao carregar detalhes do artista no MusicBrainz:",
          error
        );
      })
      .finally(() => {
        if (isMounted) {
          setIsLoading(false);
          setIsSyncingDiscography(false);
        }
      });

    return () => {
      isMounted = false;
    };
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
            <p className="text-muted-foreground mt-2 text-sm md:text-base font-medium flex items-center gap-2">
              Discografia completa via MusicBrainz & Cover Art Archive: álbuns,
              EPs e singles oficiais
              {isSyncingDiscography && (
                <Loader2 className="h-3.5 w-3.5 animate-spin text-primary inline" />
              )}
            </p>
          </div>
        </div>
      </div>

      <div className="artist-main-content">
        {/* Seção de Álbuns */}
        {albums.length > 0 && (
          <div className="mt-12">
            <h2 className="section-title">
              <Disc className="h-6 w-6 text-primary" /> Álbuns de Estúdio (
              {albums.length})
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
                            loading="lazy"
                            decoding="async"
                            onError={handleCoverImageError}
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
              <Radio className="h-6 w-6 text-primary" /> EPs e Singles (
              {epsAndSingles.length})
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
                            loading="lazy"
                            decoding="async"
                            onError={handleCoverImageError}
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
