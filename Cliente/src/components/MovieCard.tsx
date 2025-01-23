// src/components/MovieCard.tsx
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, Info, Plus, Check } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { sessionService }  from "@/services/sessionService";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { MovieCardItem } from "@/types/movieCard";

interface MovieCardProps {
  item: MovieCardItem;
  isInWatchlist: boolean;
  onWatchlistChange: () => void;
  onUpdate?: () => void; // Mantener onUpdate opcional para ratings
}

const MovieCard = ({ item, isInWatchlist: initialIsInWatchlist, onWatchlistChange, onUpdate }: MovieCardProps) => {
  const { toast } = useToast();
  const user = sessionService.getSession();
  const [isRatingDialogOpen, setIsRatingDialogOpen] = useState(false);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isInWatchlist, setIsInWatchlist] = useState(initialIsInWatchlist);

  // Eliminar el useEffect que verifica watchlist

  const handleWatchlistToggle = async () => {
    if (!user) {
      toast({
        title: "Error",
        description: "Debes iniciar sesión para agregar a tu lista",
        variant: "destructive",
      });
      return;
    }

    try {
      if (isInWatchlist) {
        const response = await fetch(`http://localhost:4000/api/watchlist/${user.id}/${item.id}`, {
          method: 'DELETE',
        });
        if (!response.ok) throw new Error('Error al eliminar de la watchlist');
      } else {
        const response = await fetch(`http://localhost:4000/api/watchlist`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userId: user.id, movieId: item.id }),
        });
        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.message || 'Error al agregar a la watchlist');
        }
      }

      setIsInWatchlist(!isInWatchlist);
      onWatchlistChange();

      toast({
        title: "Éxito",
        description: isInWatchlist ? "Eliminado de tu lista" : "Agregado a tu lista",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Error al actualizar tu lista",
        variant: "destructive",
      });
    }
  };


  const handleRating = async () => {
    if (!user) {
      toast({
        title: "Error",
        description: "Debes iniciar sesión para calificar",
        variant: "destructive",
      });
      return;
    }

    if (rating === 0) {
      toast({
        title: "Error",
        description: "Debes seleccionar una calificación",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await fetch("http://localhost:4000/api/ratings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.id,
          movieId: item.id,
          rating,
          comment,
        }),
      });

      if (!response.ok) {
        throw new Error("Error al calificar");
      }

      setIsRatingDialogOpen(false);
      setRating(0);
      setComment("");
      
      if (onUpdate) {
        onUpdate();
      }

      toast({
        title: "Éxito",
        description: `Has calificado "${item.title}" con ${rating} estrellas`,
      });
    } catch (error) {
      console.error("Error rating movie:", error);
      toast({
        title: "Error",
        description: "No se pudo guardar la calificación",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="overflow-hidden">
      <div className="relative aspect-[2/3]">
        <img
          src={item.cover_photo}
          alt={item.title}
          className="object-cover w-full h-full"
        />
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black to-transparent">
          <h3 className="text-lg font-bold text-white">{item.title}</h3>
          <p className="text-sm text-gray-300">{item.genre}</p>
        </div>
      </div>
      <CardContent className="p-4 space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-500">{item.release_date}</p>
            <p className="text-sm">⭐ {item.imdb_rating}</p>
          </div>
          <div className="flex gap-2">
          <Button
          variant="outline"
          size="icon"
          onClick={handleWatchlistToggle}
        >
          {isInWatchlist ? (
            <Check className="h-4 w-4 text-green-500" />
          ) : (
            <Plus className="h-4 w-4" />
          )}
        </Button>
            <Dialog open={isRatingDialogOpen} onOpenChange={setIsRatingDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="icon">
                  <Star className="h-4 w-4" />
                </Button>
                
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Calificar {item.title}</DialogTitle>
                  <DialogDescription>
                    Califica esta {item.type === 'movie' ? 'película' : 'serie'} y deja un comentario opcional
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="flex justify-center gap-2">
                    {[1, 2, 3, 4, 5].map((value) => (
                      <Button
                        key={value}
                        variant={rating === value ? "default" : "outline"}
                        onClick={() => setRating(value)}
                      >
                        {value}
                      </Button>
                    ))}
                    
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="comment">Comentario (opcional)</Label>
                    <Textarea
                      id="comment"
                      placeholder="Escribe tu comentario..."
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                    />
                  </div>
                  <Button onClick={handleRating} className="w-full">
                    Calificar
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
            <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="icon">
                  <Info className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{item.title}</DialogTitle>
                  <DialogDescription>
                    {item.type === 'movie' ? 'Película' : 'Serie'} • {item.duration}
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <p>{item.plot}</p>
                  <div className="space-y-2">
                    <p><strong>Director:</strong> {String(item.team.Director)}</p>
                    <p><strong>Elenco:</strong> {String(item.team.Cast)}</p>
                    <p><strong>País:</strong> {item.country}</p>
                    {item.awards && <p><strong>Premios:</strong> {item.awards}</p>}
                    {item.ratings && (
                      <div>
                        <strong>Calificaciones:</strong>
                        {item.ratings.map((rating, index) => (
                          <p key={index} className="text-sm">
                            {String(rating.Source)}: {String(rating.Value)}
                          </p>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MovieCard;