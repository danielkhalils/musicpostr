import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Loader2, Disc, Music as MusicIcon } from 'lucide-react';

interface ReleaseGroup {
  id: string;
  title: string;
  'first-release-date'?: string;
  'primary-type'?: string;
}

export function ArtistDetail() {
  const { id } = useParams<{ id: string }>();
  const [artistName, setArtistName] = useState('');
  const [artistBanner, setArtistBanner] = useState('');
  const [releases, setReleases] = useState<ReleaseGroup[]>([]);
  const [releaseCovers, setReleaseCovers] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchArtistDetails() {
      setIsLoading(true);
      try {
        // 1. Busca os álbuns do MusicBrainz
        const response = await fetch(
          `https://musicbrainz.org/ws/2/release-group?artist=${id}&fmt=json`,
          {
            headers: {
              'User-Agent': 'MusicPostrApp/1.0.0 (contact@musicpostr.com)',
            },
          }
        );
        const data = await response.json();
        if (data && data['release-groups']) {
          const fetchedReleases: ReleaseGroup[] = data['release-groups'];
          setReleases(fetchedReleases);

          // Busca as capas dos álbuns em paralelo via Cover Art Archive
          fetchedReleases.forEach(async (release) => {
            try {
              const coverRes = await fetch(`https://coverartarchive.org/release-group/${release.id}/front-250`, {
                method: 'HEAD', // Apenas valida se a imagem existe
              });
              if (coverRes.ok) {
                setReleaseCovers(prev => ({ ...prev, [release.id]: `https://coverartarchive.org/release-group/${release.id}/front-250` }));
              }
            } catch (e) {
              // Capa não encontrada, mantém o ícone padrão
            }
          });
        }

        // 2. Busca o nome do artista no MusicBrainz
        const artistRes = await fetch(`https://musicbrainz.org/ws/2/artist/${id}?fmt=json`, {
          headers: { 'User-Agent': 'MusicPostrApp/1.0.0 (contact@musicpostr.com)' },
        });
        const artistData = await artistRes.json();
        if (artistData && artistData.name) {
          setArtistName(artistData.name);

          // 3. Busca a foto de fundo/banner do artista no TheAudioDB
          try {
            const audioDbRes = await fetch(
              `https://www.theaudiodb.com/api/v1/json/2/search.php?s=${encodeURIComponent(artistData.name)}`
            );
            const audioDbData = await audioDbRes.json();
            if (audioDbData && audioDbData.artists && audioDbData.artists[0]) {
              // Prioriza fanart/banner, se não houver pega a foto normal de perfil
              const banner = audioDbData.artists[0].strArtistFanart || audioDbData.artists[0].strArtistThumb;
              if (banner) setArtistBanner(banner);
            }
          } catch (e) {
            // Ignora erro de banner
          }
        }
      } catch (error) {
        console.error('Erro ao carregar detalhes do artista:', error);
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
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-zinc-950">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-zinc-950 text-white pb-16">
      
      {/* Banner Estilo YouTube Music no Topo */}
      <div className="relative w-full h-72 md:h-96 overflow-hidden">
        {artistBanner ? (
          <div 
            className="absolute inset-0 bg-cover bg-center filter blur-sm scale-105 opacity-50"
            style={{ backgroundImage: `url(${artistBanner})` }}
          />
        ) : (
          <div className="absolute inset-0 bg-zinc-900 opacity-60" />
        )}

        {/* Gradiente escuro para mesclar o banner com o fundo da página */}
        <div className="absolute inset-0 bg-gradient-to-b from-zinc-950/40 via-zinc-950/70 to-zinc-950" />

        {/* Conteúdo sobre o Banner */}
        <div className="relative max-w-6xl mx-auto h-full px-4 sm:px-6 flex flex-col justify-between py-8">
          <Link to="/artistas" className="inline-flex items-center gap-2 text-sm text-zinc-300 hover:text-white bg-black/40 px-3 py-1.5 rounded-full w-fit backdrop-blur-md transition-colors">
            <ArrowLeft className="h-4 w-4" /> Voltar para busca
          </Link>

          <div>
            <h1 className="text-4xl md:text-6xl font-black tracking-tight drop-shadow-md">
              {artistName || 'Detalhes do Artista'}
            </h1>
            <p className="text-zinc-300 mt-2 text-sm md:text-base drop-shadow">
              Discografia, álbuns e lançamentos oficiais
            </p>
          </div>
        </div>
      </div>

      {/* Lista de Álbuns / Lançamentos */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 mt-6">
        <h2 className="text-2xl font-semibold text-white mb-6 flex items-center gap-2">
          <Disc className="h-6 w-6 text-primary" /> Álbuns e Lançamentos
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {releases.map((release) => {
            const coverUrl = releaseCovers[release.id];

            return (
              <div key={release.id} className="bg-zinc-900/80 border border-zinc-800/80 rounded-lg p-4 flex flex-col justify-between hover:border-zinc-700 transition-all shadow-md">
                <div>
                  <div className="w-full aspect-square bg-zinc-800 rounded-md mb-4 overflow-hidden flex items-center justify-center text-zinc-600 shadow-inner">
                    {coverUrl ? (
                      <img src={coverUrl} alt={release.title} className="w-full h-full object-cover" />
                    ) : (
                      <MusicIcon className="h-10 w-10 text-zinc-600" />
                    )}
                  </div>
                  <h3 className="font-medium text-white text-sm line-clamp-1">{release.title}</h3>
                  <p className="text-xs text-zinc-500 mt-1">{release['first-release-date']?.substring(0, 4) || 'Ano desconhecido'}</p>
                </div>
                <span className="mt-4 inline-block text-[10px] uppercase tracking-wider bg-zinc-800 text-zinc-300 px-2 py-0.5 rounded w-fit">
                  {release['primary-type'] || 'Álbum'}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}