import { useState, useEffect } from "react";
import { Menu, Music, User, Sun, Moon } from "lucide-react";
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
    // Verifica o tema salvo no localStorage ou assume dark por padrão
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
        {/* Logo / Nome do Site */}
        <div className="flex items-center gap-2">
          <a
            href="/"
            className="flex items-center gap-2 font-bold text-xl text-zinc-900 dark:text-white"
          >
            <Music className="h-6 w-6 text-primary" />
            <span>Musicpostr</span>
          </a>
        </div>

        {/* Links de Navegação (Desktop) */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-600 dark:text-zinc-400">
          <a href="/" className="transition-colors hover:text-zinc-900 dark:hover:text-white">
            Início
          </a>
          <a href="/rankings" className="transition-colors hover:text-zinc-900 dark:hover:text-white">
            Rankings
          </a>
          <a href="/reviews" className="transition-colors hover:text-zinc-900 dark:hover:text-white">
            Reviews
          </a>
          <a href="/artistas" className="transition-colors hover:text-zinc-900 dark:hover:text-white">
            Artistas
          </a>
        </nav>

        {/* Ações da Direita (Busca e Perfil) */}
        <div className="flex items-center gap-3">
          <GlobalSearch />

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
              <DropdownMenuItem
                asChild
                className="cursor-pointer"
              >
                <Link to="/perfil" className="w-full">
                  Meu Perfil
                </Link>
              </DropdownMenuItem>

              <DropdownMenuItem
                asChild
                className="cursor-pointer"
              >
                <Link to="/minhas-avaliacoes" className="w-full">
                  Minhas Avaliações
                </Link>
              </DropdownMenuItem>

              <DropdownMenuItem
                asChild
                className="cursor-pointer"
              >
                <Link to="/configuracoes" className="w-full">
                  Configurações
                </Link>
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              {/* Botão de Alternância de Tema (Dark / Light) */}
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
                Sair
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Menu Mobile (Hambúrguer) */}
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
                <a
                  href="/"
                  className="flex items-center gap-2 font-bold text-lg text-zinc-900 dark:text-white"
                  onClick={() => setIsOpen(false)}
                >
                  <Music className="h-5 w-5 text-primary" />
                  <span>Musicpostr</span>
                </a>
                <nav className="flex flex-col gap-4 text-base font-medium text-zinc-600 dark:text-zinc-400">
                  <a
                    href="/"
                    className="transition-colors hover:text-zinc-900 dark:hover:text-white"
                    onClick={() => setIsOpen(false)}
                  >
                    Início
                  </a>
                  <a
                    href="/rankings"
                    className="transition-colors hover:text-zinc-900 dark:hover:text-white"
                    onClick={() => setIsOpen(false)}
                  >
                    Rankings
                  </a>
                  <a
                    href="/reviews"
                    className="transition-colors hover:text-zinc-900 dark:hover:text-white"
                    onClick={() => setIsOpen(false)}
                  >
                    Reviews
                  </a>
                  <a
                    href="/artistas"
                    className="transition-colors hover:text-zinc-900 dark:hover:text-white"
                    onClick={() => setIsOpen(false)}
                  >
                    Artistas
                  </a>
                </nav>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
