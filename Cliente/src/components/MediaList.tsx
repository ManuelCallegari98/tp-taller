// src/components/MediaList.tsx
import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
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

interface MediaListProps {
  type: "movie" | "series";
  title: string;
}

export default function MediaList({ type, title }: MediaListProps) {
  const [allItems, setAllItems] = useState<Movie[]>([]);
  const [filteredItems, setFilteredItems] = useState<Movie[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("all");
  const [genres, setGenres] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newItemTitle, setNewItemTitle] = useState("");
  const { toast } = useToast();
  
  const debouncedSearch = useDebounce(searchTerm, 500);

  // Cargar todas las películas/series al inicio
  useEffect(() => {
    const fetchItems = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('http://localhost:4000/api/movies');
        if (!response.ok) {
          throw new Error('Error fetching items');
        }
        const data = await response.json();
        
        // Filtrar por tipo (movie o series)
        const typeFilteredItems = data.filter((item: Movie) => item.type === type);
        setAllItems(typeFilteredItems);
        setFilteredItems(typeFilteredItems);
        
        // Extraer géneros únicos
        const uniqueGenres = Array.from(new Set(
          typeFilteredItems.flatMap((item: Movie) => 
            item.genre.split(',').map((g: string) => g.trim())
          )
        )).sort() as string[];
        setGenres(uniqueGenres);
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

    fetchItems();
  }, [type, toast]);

  // Aplicar filtros cuando cambie la búsqueda o el género
  useEffect(() => {
    let filtered = allItems;

    // Filtrar por término de búsqueda
    if (debouncedSearch) {
      filtered = filtered.filter(item =>
        item.title.toLowerCase().includes(debouncedSearch.toLowerCase())
      );
    }

    // Filtrar por género
    if (selectedGenre && selectedGenre !== "all") {
      filtered = filtered.filter(item =>
        item.genre.toLowerCase().includes(selectedGenre.toLowerCase())
      );
    }

    setFilteredItems(filtered);
  }, [debouncedSearch, selectedGenre, allItems]);

  // Función para agregar nueva película/serie
  const handleAddItem = async () => {
    if (!newItemTitle.trim()) {
      toast({
        title: "Error",
        description: "Por favor ingresa un título",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await fetch(`http://localhost:4000/api/movies/search?query=${encodeURIComponent(newItemTitle)}&type=${type}`);
      if (!response.ok) {
        throw new Error('Error al buscar el título');
      }

      const data = await response.json();
      setIsAddDialogOpen(false);
      setNewItemTitle("");

      // Actualizar la lista completa
      const updatedResponse = await fetch('http://localhost:4000/api/movies');
      if (!updatedResponse.ok) {
        throw new Error('Error actualizando la lista');
      }
      const updatedData = await updatedResponse.json();
      const typeFilteredItems = updatedData.filter((item: Movie) => item.type === type);
      setAllItems(typeFilteredItems);

      toast({
        title: "Éxito",
        description: "Item agregado correctamente",
      });
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Error desconocido",
        variant: "destructive",
      });
    }
  };

  const transformToCardItem = (movie: Movie): MovieCardItem => ({
    id: movie.id || 0,
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
        <div className="flex gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:w-[300px]">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={`Buscar ${type === 'movie' ? 'películas' : 'series'}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
          <Select
            value={selectedGenre}
            onValueChange={setSelectedGenre}
          >
            <SelectTrigger className="w-[180px]">
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
                  />
                  <Button onClick={handleAddItem}>Buscar y Agregar</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {filteredItems.length === 0 ? (
        <div className="text-center py-10 text-muted-foreground">
          No se encontraron {type === 'movie' ? 'películas' : 'series'}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredItems.map(item => (
            <MovieCard
              key={item.imdbID}
              item={transformToCardItem(item)}
              onUpdate={async () => {
                const response = await fetch('http://localhost:4000/api/movies');
                if (response.ok) {
                  const data = await response.json();
                  const typeFilteredItems = data.filter((item: Movie) => item.type === type);
                  setAllItems(typeFilteredItems);
                }
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}