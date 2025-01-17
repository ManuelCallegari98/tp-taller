"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ModeToggle } from "@/components/switch-mode";
import {
  User as UserIcon,
  CircleUser,
  Popcorn,
  Home,
  Film,
  Heart,
  Eye,
  Tv,
  Settings,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { User } from "@/types/user";
import { sessionService } from "@/services/sessionService";

const NoSSR = dynamic(() => import("../components/no-ssr"), { ssr: false });

interface HeaderProps {
  user: User;
}

export default function Header({ user }: HeaderProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    sessionService.clearSession();
    router.push("/login");
  };

  return (
    <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
      <Sheet>
        <SheetTrigger>
          <div>
            <NoSSR />
          </div>
        </SheetTrigger>
        <SheetContent side="left" className="flex flex-col">
          <nav className="grid gap-2 text-lg font-medium">
            <Link
              href="/browse"
              className={`flex items-center gap-2 font-semibold ${
                pathname === "/browse"
                  ? "text-foreground"
                  : "text-muted-foreground"
              }`}
            >
              <Popcorn className="h-6 w-6" />
              <span className="">TangoFlix</span>
            </Link>
            <Link
              href="/browse/movies"
              className={`mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 
                ${
                  pathname === "/browse/movies"
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
            >
              <Film className="h-4 w-4" />
              Movies
            </Link>
            <Link
              href="/browse/series"
              className={`mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 
                ${
                  pathname === "/browse/series"
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
            >
              <Tv className="h-4 w-4" />
              Series
            </Link>
            <Link
              href="/browse/my-list"
              className={`mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 
                ${
                  pathname === "/browse/my-list"
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
            >
              <Heart className="h-4 w-4" />
              My List
            </Link>
            <Link
              href="/browse/watched"
              className={`mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 
                ${
                  pathname === "/browse/watched"
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
            >
              <Eye className="h-5 w-5" />
              Watched
            </Link>
            <Link
              href="/browse/profile"
              className={`mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 
                ${
                  pathname === "/browse/profile"
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
            >
              <Settings className="h-5 w-5" />
              Settings
            </Link>
            <Link
              href="/browse/dashboard"
              className={`mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 
                  ${
                    pathname === "/browse/dashboard"
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
            >
              <UserIcon className="h-5 w-5" />
              Users
            </Link>
          </nav>
        </SheetContent>
      </Sheet>
      <div className="flex-1" />
      <div className="flex items-center gap-4">
        <ModeToggle />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative ">
              {user.profilePicture ? (
                <img
                  src={user.profilePicture}
                  alt={user.username}
                  className="h-9 w-9 rounded-full object-cover"
                />
              ) : (
                <CircleUser className="h-6 w-6" />
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <div className="flex items-center justify-start gap-2 p-2">
              <div className="flex flex-col space-y-1 leading-none">
                <p className="font-medium">{user.username}</p>
                <p className="text-sm text-muted-foreground">{user.fullName}</p>
              </div>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/browse/profile">
                <UserIcon className="mr-2 h-4 w-4" />
                Profile
              </Link>
            </DropdownMenuItem>
            {user.isAdmin && (
              <DropdownMenuItem asChild>
                <Link href="/browse/dashboard">
                  <Settings className="mr-2 h-4 w-4" />
                  Dashboard
                </Link>
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}