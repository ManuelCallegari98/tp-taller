'use client'
import Link from 'next/link';
import { Home, Film, Heart, Eye, Tv, Settings, Popcorn } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { Separator } from './ui/separator';

export default function Sidebar({ isAdmin }: { isAdmin: boolean }) {
  const pathname = usePathname();

  return (
    <div className="hidden border-r bg-muted/40 md:block">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
          <Link
            href="/browse"
            className={`flex items-center gap-2 font-semibold ${pathname === '/browse' ? 'text-foreground' : 'text-muted-foreground'}`}
          >
            <Popcorn className="h-4 w-4" />
            <span>TangoFlix</span>
          </Link>
        </div>
        <div className="flex-1">
          <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
            <Link
              href="/browse/movies"
              className={`mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 
                ${pathname === '/browse/movies' 
                  ? 'text-foreground' 
                  : 'text-muted-foreground hover:text-foreground'}`} >
              <Film className="h-4 w-4" />
              Movies
            </Link>
            <Link
              href="/browse/series"
              className={`mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 
                ${pathname === '/browse/series' 
                  ? 'text-foreground' 
                  : 'text-muted-foreground hover:text-foreground'}`} >
              <Tv className="h-4 w-4" />
              Series
            </Link>
            <Link
              href="/browse/my-list"
              className={`mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 
                ${pathname === '/browse/my-list' 
                  ? 'text-foreground' 
                  : 'text-muted-foreground hover:text-foreground'}`} >
              <Heart className="h-4 w-4" />
              My List
            </Link>
            <Link
              href="/browse/watched"
              className={`mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 
                ${pathname === '/browse/watched' 
                  ? 'text-foreground' 
                  : 'text-muted-foreground hover:text-foreground'}`} >
              <Eye className="h-5 w-5" />
              Watched
            </Link>
            <Link
              href="/browse/profile"
              className={`mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 
                ${pathname === '/browse/profile' 
                  ? 'text-foreground' 
                  : 'text-muted-foreground hover:text-foreground'}`} >
              <Settings className="h-5 w-5" />
              Settings
            </Link>
            <Separator className='my-4'/>
            {/* Mostrar el Dashboard solo si el usuario es administrador */}
            {isAdmin && (
              <Link
                href="/browse/dashboard"
                className={`mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 
                  ${pathname === '/browse/dashboard' 
                    ? 'text-foreground' 
                    : 'text-muted-foreground hover:text-foreground'}`} >
                <Home className="h-5 w-5" />
                Dashboard
              </Link>
            )}
          </nav>
        </div>
      </div>
    </div>
  );
}
