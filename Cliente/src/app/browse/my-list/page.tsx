"use client";

import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import MovieCard from "@/components/MovieCard";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/use-toast";
import { useDebounce } from "@/hooks/use-debounce";
import { MovieCardItem } from "@/types/movieCard";
import { sessionService } from "@/services/sessionService";

export default function MyList() {
  const [watchlistItems, setWatchlistItems] = useState<MovieCardItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<MovieCardItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const user = sessionService.getSession();
  const debouncedSearch = useDebounce(searchTerm, 500);

  const fetchWatchlist = async () => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(`http://localhost:4000/api/watchlist/${user.id}`);
      if (!response.ok) throw new Error('Error al cargar la watchlist');
      const data = await response.json();
      
      // Transformar los datos al formato MovieCardItem
      const transformedData = data.map((item: any) => ({
        id: item.movieId,
        title: item.Movie.title,
        type: item.Movie.type,
        cover_photo: item.Movie.poster,
        imdb_rating: item.Movie.imdbRating,
        release_date: item.Movie.released,
        genre: item.Movie.genre,
        description: item.Movie.plot,
        duration: item.Movie.runtime,
        team: {
          Director: item.Movie.director,
          Writer: item.Movie.writer,
          Cast: item.Movie.actors
        },
        year: item.Movie.year,
        awards: item.Movie.awards,
        ratings: item.Movie.ratings
      }));
      
      setWatchlistItems(transformedData);
      setFilteredItems(transformedData);
    } catch (error) {
      toast({
        title: "Error",
        description: "Error al cargar tu lista",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchWatchlist();
  }, [user]);

  // Aplicar filtro de búsqueda
  useEffect(() => {
    if (!debouncedSearch) {
      setFilteredItems(watchlistItems);
      return;
    }

    const filtered = watchlistItems.filter(item =>
      item.title.toLowerCase().includes(debouncedSearch.toLowerCase())
    );
    setFilteredItems(filtered);
  }, [debouncedSearch, watchlistItems]);

  if (!user) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Mi Lista</h1>
        <p className="text-muted-foreground">Inicia sesión para ver tu lista de películas</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-6 p-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-[200px]" />
          <Skeleton className="h-10 w-[300px]" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <Skeleton key={i} className="h-[500px]" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <h1 className="text-2xl font-bold">Mi Lista</h1>
        <div className="flex gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:w-[300px]">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar en mi lista..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
        </div>
      </div>

      {filteredItems.length === 0 ? (
        <div className="text-center py-10 text-muted-foreground">
          {debouncedSearch ? "No se encontraron resultados" : "No tienes películas en tu lista"}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredItems.map((item) => (
            <MovieCard
              key={item.id}
              item={item}
              onUpdate={fetchWatchlist}
            />
          ))}
        </div>
      )}
    </div>
  );
}