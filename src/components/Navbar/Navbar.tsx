import { useState, useEffect } from "react";
import { Menu, Music, User, Sun, Moon, Heart } from "lucide-react";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { Link } from "react-router-dom";
import { GlobalSearch } from "../Search/GlobalSearch";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem("musicpostr_theme");
    return savedTheme ? savedTheme === "dark" : true;
  });

  useEffect(() => {
    const root = document.documentElement;
    if (isDarkMode) {
      root.classList.add("dark");
      localStorage.setItem("musicpostr_theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("musicpostr_theme", "light");
    }
  }, [isDarkMode]);

  const toggleTheme = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDarkMode((prev) => !prev);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Lado Esquerdo: Links de Navegação (Desktop) + Menu Mobile */}
        <div className="flex items-center gap-6">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden text-zinc-700 dark:text-zinc-300"
              >
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px]">
              <div className="flex flex-col gap-6 py-6">
                <Link
                  to="/"
                  className="flex items-center gap-2 font-bold text-lg text-zinc-900 dark:text-white"
                  onClick={() => setIsOpen(false)}
                >
                  <Music className="h-5 w-5 text-primary" />
                  <span>Musicpostr</span>
                </Link>
                <nav className="flex flex-col gap-4 text-base font-medium text-zinc-600 dark:text-zinc-400">
                  <Link to="/" onClick={() => setIsOpen(false)}>Início</Link>
                  <Link to="/rankings" onClick={() => setIsOpen(false)}>Rankings</Link>
                  <Link to="/reviews" onClick={() => setIsOpen(false)}>Reviews</Link>
                  <Link to="/artistas" onClick={() => setIsOpen(false)}>Artistas</Link>
                </nav>
              </div>
            </SheetContent>
          </Sheet>

          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-zinc-600 dark:text-zinc-400">
            <Link to="/" className="transition-colors hover:text-zinc-900 dark:hover:text-white">
              Início
            </Link>
            <Link to="/rankings" className="transition-colors hover:text-zinc-900 dark:hover:text-white">
              Rankings
            </Link>
            <Link to="/reviews" className="transition-colors hover:text-zinc-900 dark:hover:text-white">
              Reviews
            </Link>
            <Link to="/artistas" className="transition-colors hover:text-zinc-900 dark:hover:text-white">
              Artistas
            </Link>
          </nav>
        </div>

        {/* Centro: Logo / Nome do Site */}
        <div className="flex items-center justify-center">
          <Link
            to="/"
            className="flex items-center gap-2 font-bold text-xl tracking-wider text-zinc-900 dark:text-white uppercase"
          >
            <Music className="h-5 w-5 text-primary" />
            <span>Musicpostr</span>
          </Link>
        </div>

        {/* Lado Direito: Ações (Busca, Favoritos e Perfil) */}
        <div className="flex items-center gap-3">
          <GlobalSearch />

          {/* Atalho opcional inspirado na ref para favoritos/curtidas */}
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full text-zinc-700 dark:text-zinc-300 hidden sm:flex"
            asChild
          >
            <Link to="/favoritos">
              <Heart className="h-5 w-5" />
            </Link>
          </Button>

          {/* Menu Dropdown do Perfil */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="secondary"
                size="icon"
                className="rounded-full"
              >
                <User className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem asChild className="cursor-pointer">
                <Link to="/perfil" className="w-full">Meu Perfil</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className="cursor-pointer">
                <Link to="/minhas-avaliacoes" className="w-full">Minhas Avaliações</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className="cursor-pointer">
                <Link to="/configuracoes" className="w-full">Configurações</Link>
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem
                onClick={toggleTheme}
                className="cursor-pointer flex items-center justify-between"
              >
                <span>Tema</span>
                <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                  {isDarkMode ? (
                    <>
                      <Moon className="h-3.5 w-3.5 text-primary" /> Escuro
                    </>
                  ) : (
                    <>
                      <Sun className="h-3.5 w-3.5 text-amber-400" /> Claro
                    </>
                  )}
                </div>
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem className="text-red-600 focus:bg-red-50 focus:text-red-700 dark:text-red-400 dark:focus:bg-red-950/50 dark:focus:text-red-300 cursor-pointer">
                <Link to="/login" className="w-full">Sair</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

      </div>
    </header>
  );
}