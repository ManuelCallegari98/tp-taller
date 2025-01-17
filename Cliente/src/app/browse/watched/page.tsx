'use client';

import { useEffect, useState } from 'react';
import { sessionService } from "@/services/sessionService";
import { User } from "@/types/user";
import { Loader2 } from 'lucide-react';
import { Card } from "@/components/ui/card";

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
  return (
    <Card className="overflow-hidden bg-gray-800/40 hover:bg-gray-800/60 transition">
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
