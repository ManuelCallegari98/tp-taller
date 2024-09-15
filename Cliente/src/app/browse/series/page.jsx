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
} from "@/components/ui/dialog";

export default function SeriesPage() {
  const [series, setSeries] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredSeries, setFilteredSeries] = useState([]);
  const [open, setOpen] = useState(false);
  const [serieTitle, setSerieTitle] = useState("");
  const [selectedGenre, setSelectedGenre] = useState(""); // Estado para el género seleccionado

  useEffect(() => {
    const fetchSeries = async () => {
      try {
        const response = await fetch("http://localhost:4000/api/movies"); // Actualizar endpoint si es diferente
        if (response.ok) {
          const data = await response.json();
          const seriesOnly = data.filter(serie => serie.type === 'series');
          setSeries(seriesOnly);
          setFilteredSeries(seriesOnly); // Inicialmente, todas las series están filtradas
        } else {
          console.error("Failed to fetch series");
        }
      } catch (error) {
        console.error("Error fetching series:", error);
      }
    };

    fetchSeries();
  }, []);

  useEffect(() => {
    let filtered = series;

    // Filtrar series por término de búsqueda
    if (searchTerm) {
      filtered = filtered.filter((serie) =>
        serie.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtrar por género si hay un género seleccionado
    if (selectedGenre) {
      filtered = filtered.filter((serie) =>
        serie.genre.toLowerCase().includes(selectedGenre.toLowerCase())
      );
    }

    setFilteredSeries(filtered);
  }, [searchTerm, selectedGenre, series]);

  const handleAddSerie = async () => {
    const formattedTitle = serieTitle.trim().replace(/ /g, '+');

    try {
      const response = await fetch(`http://localhost:4000/api/movies/searchbytitle?title=${formattedTitle}&type=series`, {
        method: "GET",
      });
      if (response.ok) {
        const data = await response.json();
        const seriesOnly = data.filter(serie => serie.type === 'series');
        setSeries(prevSeries => [...prevSeries, ...seriesOnly]);
        setFilteredSeries(prevSeries => [...prevSeries, ...seriesOnly]); // Actualiza también los filtrados
        setSerieTitle(""); // Limpiar el título de la serie
        setOpen(false); // Cerrar el diálogo
        window.location.reload()
      } else {
        console.error("Failed to add serie");
      }
    } catch (error) {
      console.error("Error adding serie:", error);
    }
  };

  // Obtener lista única de géneros a partir de las series disponibles
  const genres = [...new Set(series.flatMap((serie) => serie.genre.split(", ").map((genre) => genre.trim())))];

  return (
    <div className="flex flex-col h-[85vh]">
      <div className="flex justify-between items-center gap-2 relative w-full md:w-[200px] lg:w-[320px] m-2">
        <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search series..."
          className="w-full rounded-lg bg-background pl-8"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setOpen(true)}>Add Serie</Button>
          </DialogTrigger>
          <DialogPortal>
            <DialogOverlay />
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add a New Serie</DialogTitle>
                <DialogDescription>
                  Enter the title of the serie you want to add.
                </DialogDescription>
              </DialogHeader>
              <Input
                type="text"
                placeholder="Serie Title"
                value={serieTitle}
                onChange={(e) => setSerieTitle(e.target.value)}
                className="w-full mb-4"
              />
              <DialogFooter>
                <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                <Button onClick={handleAddSerie}>Add Serie</Button>
              </DialogFooter>
            </DialogContent>
          </DialogPortal>
        </Dialog>
      </div>
      <div className="m-2">
        <label htmlFor="genre-select" className="mr-2">Filter by Genre:</label>
        <select
          id="genre-select"
          value={selectedGenre}
          onChange={(e) => setSelectedGenre(e.target.value)}
          className="rounded-lg bg-background pl-2"
        >
          <option value="">All Genres</option>
          {genres.map((genre) => (
            <option key={genre} value={genre}>
              {genre}
            </option>
          ))}
        </select>
      </div>

      <div className="flex-grow overflow-y-scroll w-full">
        <div className="grid grid-cols-1 m-2 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {filteredSeries.map((serie) => (
            <MovieCard key={serie.id} movie={serie} /> // Asegúrate de que MovieCard pueda manejar series
          ))}
        </div>
      </div>
    </div>
  );
}
