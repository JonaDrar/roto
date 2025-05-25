
"use client";
    
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { Button } from './ui/button';
import { Home, ListOrdered } from 'lucide-react';

export function AppHeader() {
  const pathname = usePathname();

  return (
    <header className="bg-primary text-primary-foreground shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center max-w-5xl">
        <Link href="/" className="text-xl sm:text-2xl font-bold hover:opacity-90 transition-opacity">
          ¿Qué tan roto estás?
        </Link>
        <nav className="flex items-center gap-2 sm:gap-4">
          <Button variant={pathname === '/' ? "secondary" : "ghost"} size="sm" asChild className={` ${pathname === '/' ? 'bg-primary-foreground/20 text-primary-foreground' : 'hover:bg-primary-foreground/10 text-primary-foreground/80 hover:text-primary-foreground'}`}>
            <Link href="/">
              <Home className="h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline">Inicio</span>
            </Link>
          </Button>
          <Button variant={pathname === '/ranking' ? "secondary" : "ghost"} size="sm" asChild className={` ${pathname === '/ranking' ? 'bg-primary-foreground/20 text-primary-foreground' : 'hover:bg-primary-foreground/10 text-primary-foreground/80 hover:text-primary-foreground'}`}>
            <Link href="/ranking">
              <ListOrdered className="h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline">Ranking</span>
            </Link>
          </Button>
        </nav>
      </div>
    </header>
  );
}
