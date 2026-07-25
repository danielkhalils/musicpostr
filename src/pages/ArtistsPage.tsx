import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Music,
} from "lucide-react";
import { Button } from "../components/ui/button";

interface Artist {
  id: string;
  name: string;
  country?: string;
  disambiguation?: string;
  imageUrl?: string;
}

export function ArtistsPage() {
  const [artists, setArtists] = useState<Artist[]>([]);
  const [searchQuery, setSearchQuery] = useState("pop");
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const ITEMS_PER_PAGE = 18;
  const API_LIMIT = 24; // Buscamos um pouco a mais para compensar os itens filtrados

  useEffect(() => {
    setPage(1);
  }, [searchQuery]);

  useEffect(() => {
    async function fetchArtistsWithImages() {
      setIsLoading(true);
      try {
        const offset = (page - 1) * ITEMS_PER_PAGE;
        const query =
          searchQuery.trim() === "" ? "tag:pop OR tag:rock OR a" : searchQuery;

        const response = await fetch(
          `https://musicbrainz.org/ws/2/artist?query=${encodeURIComponent(query)}&limit=${API_LIMIT}&offset=${offset}&fmt=json`,
          {
            headers: {
              "User-Agent": "MusicPostrApp/1.0.0 (contact@musicpostr.com)",
            },
          },
        );
        const data = await response.json();

        if (data && data.artists) {
          const rawArtists = data.artists;

          // Lista de nomes genéricos para ignorar
          const blockedNames = [
            // Termos genéricos e coleções
            "various artists",
            "unknown",
            "various",
            "artist",
            "none",
            "anonymous",
            "soundtrack",
            "original soundtrack",
            "motion picture soundtrack",
            "various composers",
            "karaoke",
            "tribute",
            "orchestra",
            "choir",
            "ensemble",
            "studio cast",
            "cast",
            "ensemble cast",
            "studio musicians",
            "instrumental",
            "dj",
            "dj mix",

            // Termos em outros idiomas comuns na base de dados
            "vários artistas",
            "artista desconhecido",
            "desconhecido",
            "anônimo",
            "varios",
            "banda sonora",
            "trilha sonora",

            // Nomes de teste ou lixo de banco de dados
            "test",
            "teste",
            "n/a",
            "no artist",
            "unknown artist",
            "unknown-artist",
            "anonymous artist",
            "placeholder",
            "dummy",
          ];

          const validArtists = rawArtists.filter((artist: any) => {
            const name = artist.name.toLowerCase().trim();
            const type = artist.type; // Retorna 'Person', 'Group', etc.

            // Remove nomes vazios, com colchetes ou que estejam na blacklist
            if (!name || name.startsWith("[") || name.endsWith("]"))
              return false;
            if (blockedNames.includes(name)) return false;

            // Opcional: O Spotify foca em Person e Group. Se quiser excluir Coros/Orquestras genéricas:
            if (type === "Choir" || type === "Orchestra") return false;

            return true;
          });

          setHasMore(rawArtists.length >= API_LIMIT);

          const usedImages = new Set<string>();

          const artistsWithImages = await Promise.all(
            validArtists.map(async (artist: any) => {
              let imageUrl = "";
              try {
                const imgRes = await fetch(
                  `https://corsproxy.io/?` +
                    encodeURIComponent(
                      `https://api.deezer.com/search/artist?q=${encodeURIComponent(artist.name)}`,
                    ),
                );
                const imgData = await imgRes.json();

                if (imgData && imgData.data && imgData.data.length > 0) {
                  const candidateUrl =
                    imgData.data[0].picture_xl ||
                    imgData.data[0].picture_big ||
                    imgData.data[0].picture_medium;

                  if (candidateUrl && !usedImages.has(candidateUrl)) {
                    imageUrl = candidateUrl;
                    usedImages.add(candidateUrl);
                  }
                }
              } catch (e) {
                // Silencia erro de imagem
              }

              return {
                id: artist.id,
                name: artist.name,
                country: artist.country,
                disambiguation: artist.disambiguation,
                imageUrl,
              };
            }),
          );

          setArtists(artistsWithImages);
        } else {
          setArtists([]);
          setHasMore(false);
        }
      } catch (error) {
        console.error("Erro ao buscar artistas:", error);
      } finally {
        setIsLoading(false);
      }
    }

    const timeoutId = setTimeout(() => {
      fetchArtistsWithImages();
    }, 600);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, page]);

  return (
    <div className="min-h-[calc(100vh-4rem)] py-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-between">
      <div className="w-full flex flex-col items-center">
        <div className="text-center max-w-2xl mb-8">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white">
            Buscar Artistas
          </h1>
          <p className="text-zinc-400 mt-2 text-sm md:text-base">
            Pesquise e clique em um artista para ver o banner, discografia e
            álbuns oficiais
          </p>

          <div className="mt-6 relative max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
            <input
              type="text"
              placeholder="Digite o nome de um artista ou banda..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-full pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary transition-all"
            />
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : artists.length === 0 ? (
          <div className="text-center py-20 text-zinc-500">
            Nenhum artista encontrado para "{searchQuery}".
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 max-w-6xl w-full">
            {artists.map((artist) => (
              <Link
                key={artist.id}
                to={`/artista/${artist.id}`}
                className="group flex flex-col items-center cursor-pointer transition-transform duration-200 hover:scale-105"
              >
                <div className="relative w-32 h-32 md:w-36 md:h-36 rounded-full overflow-hidden border-4 border-transparent group-hover:border-primary/60 transition-all flex items-center justify-center bg-zinc-800 shadow-lg">
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

                <span className="mt-3 text-sm font-medium text-zinc-200 text-center line-clamp-1 group-hover:text-white group-hover:underline">
                  {artist.name}
                </span>

                <span className="text-xs text-zinc-500 text-center line-clamp-1">
                  {artist.disambiguation || artist.country || "Artista"}
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Controles de Paginação */}
      {!isLoading && artists.length > 0 && (
        <div className="flex items-center gap-4 mt-12 pb-6">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            disabled={page === 1}
            className="bg-zinc-900 border-zinc-800 text-zinc-200 hover:bg-zinc-800 hover:text-white disabled:opacity-50"
          >
            <ChevronLeft className="h-4 w-4 mr-1" /> Anterior
          </Button>

          <span className="text-sm font-medium text-zinc-400">
            Página {page}
          </span>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((prev) => prev + 1)}
            disabled={!hasMore}
            className="bg-zinc-900 border-zinc-800 text-zinc-200 hover:bg-zinc-800 hover:text-white disabled:opacity-50"
          >
            Próxima <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      )}
    </div>
  );
}
