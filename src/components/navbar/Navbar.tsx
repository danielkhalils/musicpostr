import { useState } from 'react';
import { Menu, Music, User } from 'lucide-react';
import { Button } from '../ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger } from '../ui/sheet';
import { Link } from 'react-router-dom';
import { GlobalSearch } from '../Search/GlobalSearch';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Logo / Nome do Site */}
        <div className="flex items-center gap-2">
          <a href="/" className="flex items-center gap-2 font-bold text-xl text-white">
            <Music className="h-6 w-6 text-primary" />
            <span>Musicpostr</span>
          </a>
        </div>

        {/* Links de Navegação (Desktop) */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-400">
          <a href="/" className="transition-colors hover:text-white">Início</a>
          <a href="/rankings" className="transition-colors hover:text-white">Rankings</a>
          <a href="/reviews" className="transition-colors hover:text-white">Reviews</a>
          <a href="/artistas" className="transition-colors hover:text-white">Artistas</a>
        </nav>

        {/* Ações da Direita (Busca e Perfil) */}
        <div className="flex items-center gap-3">
          <GlobalSearch />
          
          {/* Menu Dropdown do Perfil */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="icon" className="rounded-full bg-zinc-800 text-zinc-200 hover:bg-zinc-700">
                <User className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-zinc-900 border-zinc-800 text-zinc-200">
<DropdownMenuItem asChild className="focus:bg-zinc-800 focus:text-white cursor-pointer">
          <Link to="/perfil" className="w-full">Meu Perfil</Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild className="focus:bg-zinc-800 focus:text-white cursor-pointer">
          <Link to="/minhas-avaliacoes" className="w-full">Minhas Avaliações</Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild className="focus:bg-zinc-800 focus:text-white cursor-pointer">
          <Link to="/configuracoes" className="w-full">Configurações</Link>
        </DropdownMenuItem>

        <DropdownMenuItem className="text-red-400 focus:bg-red-950/50 focus:text-red-300 cursor-pointer">
          Sair
        </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Menu Mobile (Hambúrguer) */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden text-zinc-300 hover:bg-zinc-800">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] bg-zinc-950 border-zinc-800 text-white">
              <div className="flex flex-col gap-6 py-6">
                <a href="/" className="flex items-center gap-2 font-bold text-lg text-white" onClick={() => setIsOpen(false)}>
                  <Music className="h-5 w-5 text-primary" />
                  <span>Musicpostr</span>
                </a>
                <nav className="flex flex-col gap-4 text-base font-medium text-zinc-400">
                  <a href="/" className="transition-colors hover:text-white" onClick={() => setIsOpen(false)}>Início</a>
                  <a href="/rankings" className="transition-colors hover:text-white" onClick={() => setIsOpen(false)}>Rankings</a>
                  <a href="/reviews" className="transition-colors hover:text-white" onClick={() => setIsOpen(false)}>Reviews</a>
                  <a href="/artistas" className="transition-colors hover:text-white" onClick={() => setIsOpen(false)}>Artistas</a>
                </nav>
              </div>
            </SheetContent>
          </Sheet>
        </div>

      </div>
    </header>
  );
}
