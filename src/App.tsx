//import React from 'react';
import * as Avatar from '@radix-ui/react-avatar';
import { RatingStars } from '../src/components/elements/RatingStars';

function App() {
  return (
    <div className="flex h-screen bg-[#0f172a] text-white">
      {/* Sidebar - Fixa à esquerda */}
      <aside className="w-64 p-6 flex flex-col gap-8 border-r border-slate-800">
        <h1 className="text-xl font-bold text-orange-500">musicpostr</h1>
        <nav className="flex flex-col gap-4">
          <a href="#" className="font-semibold text-white">Home</a>
          <a href="#" className="text-slate-400">Explore</a>
          <a href="#" className="text-slate-400">Community</a>
          <a href="#" className="text-slate-400">Profile</a>
        </nav>
      </aside>

      {/* Conteúdo Principal - Flexível */}
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-4xl mx-auto flex gap-8">

          {/* Coluna Central (Álbum) */}
          <div className="flex-1">
            <div className="bg-slate-800/50 p-6 rounded-2xl backdrop-blur-sm border border-slate-700">
              <img src="https://via.placeholder.com/200" alt="Capa" className="w-full rounded-lg mb-4" />
              <h2 className="text-2xl font-bold">Radiohead - In Rainbows</h2>
              <p className="text-slate-400">2007</p>

              <div className="mt-6">
                <p className="text-sm mb-2">Rate This Album</p>
                <RatingStars onRatingChange={(r) => console.log(`Nota: ${r}`)} />
                <textarea className="w-full mt-4 bg-slate-900 border border-slate-700 p-3 rounded-lg" placeholder="Share your thoughts..."></textarea>
              </div>
            </div>
          </div>

          {/* Coluna da Direita (Social Feed) */}
          <div className="w-80">
            <h3 className="font-bold mb-4">Community Feed</h3>
            <div className="space-y-4">
              <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700">
                <div className="flex items-center gap-2 mb-2">
                  <Avatar.Root className="w-8 h-8 rounded-full bg-slate-600" />
                  <span className="text-sm">User 'AnaBeat'</span>
                </div>
                <p className="text-xs text-slate-300">"A masterpiece of sound design."</p>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}

export default App;