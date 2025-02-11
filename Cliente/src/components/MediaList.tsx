// src/components/MediaList.tsx
import { useEffect, useState, useMemo } from "react";
import { Search, Plus, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/use-toast";
import { useDebounce } from "@/hooks/use-debounce";
import { Movie } from "@/types/movie";
import { MovieCardItem } from "@/types/movieCard";
import MovieCard from "./MovieCard";
import { sessionService } from "@/services/sessionService";

interface MediaListProps {
  type: "movie" | "series";
  title: string;
}

interface SearchFilters {
  searchTerm: string;
  genre: string;
}

export default function MediaList({ type, title }: MediaListProps) {
  // Estados principales
  const [allItems, setAllItems] = useState<Movie[]>([]);
  const [filteredItems, setFilteredItems] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [watchlistItems, setWatchlistItems] = useState<number[]>([]);

  // Estados de búsqueda y filtros
  const [filters, setFilters] = useState<SearchFilters>({
    searchTerm: "",
    genre: "all"
  });
  const debouncedSearch = useDebounce(filters.searchTerm, 500);

  // Estados de diálogo
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newItemTitle, setNewItemTitle] = useState("");
  const [isAddingItem, setIsAddingItem] = useState(false);

  // Estados de usuario y watchlist
  const user = sessionService.getSession();


  // Hooks
  const { toast } = useToast();

  // Géneros únicos memoizados
  const genres = useMemo(() => {
    const uniqueGenres = Array.from(new Set(
      allItems.flatMap(item =>
        item.genre.split(',').map(g => g.trim())
      )
    )).sort();
    return uniqueGenres;
  }, [allItems]);

  // Funciones de fetch
  const fetchWatchlist = async () => {
    try {
      if (!user?.id) return;
      
      const response = await fetch(`http://localhost:4000/api/watchlist/${user.id}`);
      if (!response.ok) throw new Error('Error al obtener la watchlist');
      
      const watchlist = await response.json();
      setWatchlistItems(watchlist.map((item: any) => Number(item.movieId)));
    } catch (error) {
      console.error('Error al obtener watchlist:', error);
    }
  };

  const fetchItems = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('http://localhost:4000/api/movies');
      if (!response.ok) throw new Error('Error al cargar items');

      const data = await response.json();
      const typeFilteredItems = data.filter((item: Movie) => item.type === type);
      setAllItems(typeFilteredItems);
      setFilteredItems(typeFilteredItems);
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "No se pudieron cargar los items",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Efectos
  useEffect(() => {
    fetchItems();
  }, [type]);

  useEffect(() => {
    if (user?.id) {
      fetchWatchlist();
    }
  }, [user?.id]);

  // Efecto de búsqueda y filtrado
  useEffect(() => {
    setIsSearching(true);
    const applyFilters = () => {
      let filtered = [...allItems];

      if (debouncedSearch) {
        const searchTerms = debouncedSearch.toLowerCase().split(' ');
        filtered = filtered.filter(item => {
          const searchableText = [
            item.title,
            item.director,
            item.actors,
            item.genre,
            item.plot || '',
            item.year || ''
          ].join(' ').toLowerCase();

          return searchTerms.every(term => searchableText.includes(term));
        });
      }

      if (filters.genre !== "all") {
        const genreLower = filters.genre.toLowerCase();
        filtered = filtered.filter(item =>
          item.genre.toLowerCase().split(',')
            .map(g => g.trim())
            .some(g => g === genreLower)
        );
      }

      setFilteredItems(filtered);
      setIsSearching(false);
    };

    const timeoutId = setTimeout(applyFilters, 100);
    return () => clearTimeout(timeoutId);
  }, [debouncedSearch, filters.genre, allItems]);

  const handleWatchlistChange = () => {
    fetchWatchlist();
  };

  // Transformación de datos
  const transformToCardItem = (movie: Movie): MovieCardItem => ({
    id: movie.id ?? 0,
    title: movie.title,
    type: movie.type,
    genre: movie.genre,
    release_date: movie.released,
    duration: movie.runtime,
    team: {
      Director: movie.director,
      Writer: movie.writer,
      Cast: movie.actors
    },
    cover_photo: movie.poster,
    country: movie.country,
    imdb_rating: movie.imdbRating,
    plot: movie.plot,
    year: movie.year,
    awards: movie.awards,
    ratings: movie.ratings
  });

  // Manejadores de eventos
  const handleAddItem = async () => {
    try {
      setIsAddingItem(true);
      console.log("Buscando: ", `http://localhost:4000/api/movies/search?query=${encodeURIComponent(newItemTitle)}&type=${type}`, newItemTitle, type);
      const response = await fetch(
        `http://localhost:4000/api/movies/search?query=${encodeURIComponent(newItemTitle)}&type=${type}`
      );
  
      if (!response.ok) throw new Error('Error al buscar el título');
      
      const data = await response.json();
      
      // Verifica si se encontró alguna película
      if (!data || data.length === 0) {
        throw new Error('No se encontró la película');
      }
  
      setIsAddDialogOpen(false);
      setNewItemTitle("");
      await fetchItems();
  
      toast({
        title: "Éxito",
        description: "La película fue agregada exitosamente",
        variant: "default",
      });
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Error desconocido",
        variant: "destructive",
      });
    } finally {
      setIsAddingItem(false);
    }
  };

  // Renderizado condicional
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
        <h1 className="text-2xl font-bold">{title}</h1>
        <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
          <div className="relative w-full md:min-w-[300px] md:max-w-[500px]">
            <Search className={`absolute left-2 top-2.5 h-4 w-4 ${isSearching ? 'animate-spin text-primary' : 'text-muted-foreground'
              }`} />
            <Input
              placeholder={`Buscar ${type === 'movie' ? 'películas' : 'series'}...`}
              value={filters.searchTerm}
              onChange={(e) => setFilters(prev => ({ ...prev, searchTerm: e.target.value }))}
              className="pl-8 w-full"
            />
          </div>
          <Select
            value={filters.genre}
            onValueChange={(value) => setFilters(prev => ({ ...prev, genre: value }))}
          >
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Filtrar por género" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los géneros</SelectItem>
              {genres.map(genre => (
                <SelectItem key={genre} value={genre}>
                  {genre}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Agregar {type === 'movie' ? 'Película' : 'Serie'}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Agregar {type === 'movie' ? 'Película' : 'Serie'}</DialogTitle>
                <DialogDescription>
                  Ingresa el título para buscar en la base de datos y en OMDB
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="flex items-center space-x-4">
                  <Input
                    placeholder="Ingresa el título..."
                    value={newItemTitle}
                    onChange={(e) => setNewItemTitle(e.target.value)}
                    disabled={isAddingItem}
                  />
                  <Button
                    onClick={handleAddItem}
                    disabled={isAddingItem}
                  >
                    {isAddingItem ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Buscando...
                      </>
                    ) : (
                      'Buscar y Agregar'
                    )}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {filteredItems.length === 0 ? (
        <div className="text-center py-10 text-muted-foreground">
          <p>No se encontraron {type === 'movie' ? 'películas' : 'series'}</p>
          {filters.searchTerm && (
            <p className="mt-2">
              Prueba con otros términos de búsqueda o ajusta los filtros
            </p>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredItems.map(item => (
            <MovieCard
              key={item.id ?? ''}
              item={transformToCardItem(item)}
              isInWatchlist={watchlistItems.includes(Number(item.id ?? 0))}
              onWatchlistChange={handleWatchlistChange}
            />
          ))}
        </div>
      )}
    </div>
  );
}