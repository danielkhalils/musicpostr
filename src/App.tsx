import HomePage from "./pages/Home/HomePage";
import { ArtistsPage } from "./pages/Artists/ArtistsPage";
import { ArtistDetail } from "./pages/Artists/ArtistDetails/ArtistDetail";
import { AlbumDetails } from "./pages/Artists/AlbumDetails/AlbumDetails";
import { ReviewsPage } from "./pages/Reviews/ReviewsPage";
import { RankingsPage } from "./pages/Ranking/RankingsPage";
import { ProfilePage } from "./pages/Profile/ProfilePage";
import { MyReviewsPage } from "./pages/Profile/MyReviewsPage";
import { SettingsPage } from "./pages/Profile/SettingsPage";
import { FavoritesPage } from "./pages/Profile/FavoritesPage";
import { FriendsPage } from "./pages/Profile/FriendsPage";
import { IdolsPage } from "./pages/Profile/IdolsPage";
import { ListsPage } from "./pages/Profile/ListsPage";
import { HomeFeedPage } from "./pages/Home/HomeFeedPage";
import { Navbar } from "./components/navbar/Navbar";
import { BrowserRouter, Route, Routes } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-zinc-950 text-zinc-100 antialiased">
        <Navbar />
        {/* Área de conteúdo principal */}
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/feed" element={<HomeFeedPage />} />
            <Route path="/artistas" element={<ArtistsPage />} />
            <Route path="/artista/:id" element={<ArtistDetail />} />
            <Route path="/album/:id" element={<AlbumDetails />} />
            <Route path="/reviews" element={<ReviewsPage />} />
            <Route path="/rankings" element={<RankingsPage />} />
            <Route path="/perfil" element={<ProfilePage />} />
            <Route path="/minhas-avaliacoes" element={<MyReviewsPage />} />
            <Route path="/configuracoes" element={<SettingsPage />} />
            <Route path="/perfil" element={<ProfilePage />} />
            <Route path="/perfil/:username" element={<ProfilePage />} />{" "}
            <Route path="/favoritos" element={<FavoritesPage />} />
            <Route path="/amigos" element={<FriendsPage />} />
            <Route path="/idolos" element={<IdolsPage />} />
            <Route path="/listas" element={<ListsPage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
