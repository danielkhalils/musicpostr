import { Navbar } from "./components/navbar/Navbar";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ArtistsPage } from "./pages/ArtistsPage";
import { ArtistDetail } from "./pages/ArtistDetail";

// Componente temporário para a Home
function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center text-center mt-10">
      <h1 className="text-4xl font-bold tracking-tight text-white">
        musicpostr
      </h1>
      <p className="text-zinc-400 mt-2">Descubra e avalie os melhores álbuns</p>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-zinc-950 text-zinc-100 antialiased">
        {/* Topbar fixo (já configurado) */}
        <Navbar />

        {/* Área de conteúdo principal */}
        {/* pt-16 é crucial: dá um espaço superior igual à altura da navbar */}
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/artistas" element={<ArtistsPage />} />
            <Route path="/artista/:id" element={<ArtistDetail />} />
          </Routes>
          {/* Container centralizado para limitar a largura do conteúdo */}
          <div className="max-w-7xl mx-auto p-6 md:p-8">
            {/* --- AQUI VAI O SEU CONTEÚDO ANTIGO --- */}
            {/* Exemplo do que estava no print quebrado: */}
            <div className="flex flex-col items-center justify-center text-center mt-10">
              <h2 className="text-4xl font-bold text-white">
                Radiohead - In Rainbows
              </h2>
              <p className="text-zinc-400 mt-1">2007</p>

              {/* Exemplo de como estilizar o bloco de avaliação */}
              <div className="mt-8 bg-zinc-900 p-6 rounded-xl border border-zinc-800 w-full max-w-md">
                <p className="text-sm text-zinc-300">Rate This Album</p>
                {/* Seus botões de nota iriam aqui */}
                <div className="flex gap-2 justify-center mt-3">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                    <button
                      key={num}
                      className="w-8 h-8 rounded bg-zinc-700 hover:bg-primary text-xs"
                    >
                      {num}
                    </button>
                  ))}
                </div>
                <textarea
                  className="w-full mt-4 bg-zinc-800 border-zinc-700 rounded-md p-3 text-sm"
                  placeholder="Share your thoughts..."
                ></textarea>
              </div>
              {/* --- Community --- */}
              {/* <h3 className="text-2xl font-semibold text-white mt-12">
              Community Feed
            </h3> */}
            </div>
            {/* --- FIM DO SEU CONTEÚDO --- */}
          </div>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
