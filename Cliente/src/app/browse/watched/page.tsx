'use client';

import { useEffect, useState } from 'react';
import { sessionService } from "@/services/sessionService";
import { User } from "@/types/user";
import { Loader2 } from 'lucide-react';
import { Trash } from 'lucide-react';
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Button } from '@/components/ui/button';

interface Rating {
  id: number;
  rating: number;
  comment: string | null;
  createdAt: string;
  Movie: {
    id: number;
    title: string;
    poster: string;
    genre: string;
    director: string;
  };
}

function RatedMovieCard({ rating }: { rating: Rating }) {
  const [watchlistItems, setWatchlistItems] = useState<number[]>([]);
  const [sessionUser, setSessionUser] = useState<User | null>(null);
  const { toast } = useToast();


  useEffect(() => {
    const userData = sessionService.getSession() as User | null;
    if (userData) {
      setSessionUser(userData);
    }
  }, []);

  const handleDeleteRating = async () => {
    try {
      const response = await fetch(`http://localhost:4000/api/ratings/${rating.id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) throw new Error('Error al eliminar la calificación');
      
      toast({
        title: "Éxito",
        description: "Calificación eliminada exitosamente",
      });

      // Recargar la página para actualizar la lista
      window.location.reload();
    } catch (error) {
      console.error('Error al eliminar la calificación:', error);
      toast({
        title: "Error",
        description: "No se pudo eliminar la calificación",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="overflow-hidden bg-gray-800/40 hover:bg-gray-800/60 transition relative">
      <div className="absolute top-2 right-2">
      <Button 
          onClick={handleDeleteRating}
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-gray-400 hover:text-red-500 hover:bg-red-500/10"
        >
          <Trash className="h-4 w-4" />
        </Button>
      </div>
      <div className="flex gap-4 p-4">
        <img 
          src={rating.Movie.poster} 
          alt={rating.Movie.title}
          className="w-32 h-48 object-cover rounded"
        />
        <div className="flex flex-col flex-1">
          <h3 className="text-xl font-semibold mb-2">{rating.Movie.title}</h3>
          <p className="text-gray-400 text-sm mb-2">{rating.Movie.genre}</p>
          <p className="text-gray-400 text-sm mb-4">Director: {rating.Movie.director}</p>
          
          <div className="mt-auto">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-yellow-400 text-lg">
                {'⭐'.repeat(rating.rating)}
              </span>
              <span className="text-sm text-gray-400">
                {new Date(rating.createdAt).toLocaleDateString()}
              </span>
            </div>
            {rating.comment && (
              <p className="text-sm text-gray-300 italic">
                "{rating.comment}"
              </p>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}

export default function WatchedMovies() {
  const [user, setUser] = useState<User | null>(null);
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userData = sessionService.getSession() as User | null;
    if (userData) {
      setUser(userData);
      fetchUserRatings(userData.id);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUserRatings = async (userId: string | number) => {
    try {
      const response = await fetch(`http://localhost:4000/api/ratings/user/${userId}`);
      if (!response.ok) throw new Error('Error al obtener las calificaciones');
      const data = await response.json();
      setRatings(data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh]">
        <p className="text-xl text-gray-500">
          Debes iniciar sesión para ver tus películas valoradas
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[70vh]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-semibold mb-6">Mis Películas Valoradas</h1>
      {ratings.length === 0 ? (
        <p className="text-xl text-gray-500 text-center">
          Aún no has valorado ninguna película
        </p>
      ) : (
        <div className="grid gap-6">
          {ratings.map((rating) => (
            <RatedMovieCard key={rating.id} rating={rating} />
          ))}
        </div>
      )}
    </div>
  );
}
