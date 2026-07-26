import { Navbar } from "./components/navbar/Navbar";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ArtistsPage } from "./pages/Artists/ArtistsPage";
import { ArtistDetail } from "./pages/Artists/ArtistDetails/ArtistDetail";
import HomePage from "./pages/Home/HomePage";
import { AlbumDetails } from "./pages/Artists/AlbumDetails/AlbumDetails";

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-zinc-950 text-zinc-100 antialiased">
        <Navbar />
        {/* Área de conteúdo principal */}
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/artistas" element={<ArtistsPage />} />
            <Route path="/artista/:id" element={<ArtistDetail />} />
            <Route path="/album/:id" element={<AlbumDetails />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
