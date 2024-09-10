"use client";
import React, { useState, useEffect } from "react";
import MovieCard from "@/components/MovieCard";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";

export default function MoviesPage() {
  const [movies, setMovies] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [open, setOpen] = useState(false);
  const [movieTitle, setMovieTitle] = useState("");

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await fetch("http://localhost:4000/api/movies");
        if (response.ok) {
          const data = await response.json();
          // Filtrar solo las películas
          const moviesOnly = data.filter(movie => movie.type === 'movie');
          setMovies(moviesOnly);
          setFilteredMovies(moviesOnly); // Inicialmente, todas las películas están filtradas
        } else {
          console.error("Failed to fetch movies");
        }
      } catch (error) {
        console.error("Error fetching movies:", error);
      }
    };

    fetchMovies();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      // Filtrar películas por término de búsqueda
      const filtered = movies.filter((movie) =>
        movie.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredMovies(filtered);
    } else {
      // Si no hay término de búsqueda, mostrar todas las películas
      setFilteredMovies(movies);
    }
  }, [searchTerm, movies]);

  const handleAddMovie = async () => {
    const formattedTitle = movieTitle.trim().replace(/ /g, '+');

    try {
      const response = await fetch(`http://localhost:4000/api/movies/searchbytitle?title=${formattedTitle}`, {
        method: "GET",
      });
      if (response.ok) {
        const data = await response.json();
        // Filtrar solo las películas
        const moviesOnly = data.filter(movie => movie.type === 'movie');
        setMovies(prevMovies => [...prevMovies, ...moviesOnly]);
        setFilteredMovies(prevMovies => [...prevMovies, ...moviesOnly]); // Actualiza también los filtrados
        setMovieTitle(""); // Limpiar el título de la película
        setOpen(false); // Cerrar el diálogo
      } else {
        console.error("Failed to add movie");
      }
    } catch (error) {
      console.error("Error adding movie:", error);
    }
  };

  return (
    <div className="flex flex-col h-[85vh]">
      <div className="flex justify-between items-center gap-2 relative w-full md:w-[200px] lg:w-[320px] m-2">
        <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search movies..."
          className="w-full rounded-lg bg-background pl-8"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setOpen(true)}>Add Movie</Button>
          </DialogTrigger>
          <DialogPortal>
            <DialogOverlay />
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add a New Movie</DialogTitle>
                <DialogDescription>
                  Enter the title of the movie you want to add.
                </DialogDescription>
              </DialogHeader>
              <Input
                type="text"
                placeholder="Movie Title"
                value={movieTitle}
                onChange={(e) => setMovieTitle(e.target.value)}
                className="w-full mb-4"
              />
              <DialogFooter>
                <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                <Button onClick={handleAddMovie}>Add Movie</Button>
              </DialogFooter>
            </DialogContent>
          </DialogPortal>
        </Dialog>
      </div>

      <div className="flex-grow overflow-y-scroll w-full">
        <div className="grid grid-cols-1 m-2 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {filteredMovies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      </div>
    </div>
  );
}
