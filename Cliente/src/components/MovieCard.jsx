import React from 'react';
import { Card, CardContent, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const MovieCard = ({ movie }) => {
  const {
    title,
    cover_photo,
    genre,
    release_date,
    duration,
    imdb_rating,
    country,
    team
  } = movie;

  return (
    <Card className="w-full h-[500px] bg-background shadow-lg rounded-lg flex flex-col">
      <div className="relative h-[30%]">
        <img
          src={cover_photo}
          alt={`${title} cover`}
          className="w-full h-full object-cover"
        />
      </div>
      <CardContent className="p-4 flex-grow flex flex-col justify-between">
        <div>
          <CardTitle className="text-lg font-semibold truncate">{title}</CardTitle>
          <CardDescription className="text-sm text-muted-foreground">
            <p><strong>Genre:</strong> {genre}</p>
            <p><strong>Release Date:</strong> {new Date(release_date).toLocaleDateString()}</p>
            <p><strong>Duration:</strong> {duration}</p>
            <p><strong>Rating:</strong> {imdb_rating}</p>
            <p><strong>Country:</strong> {country}</p>
            <p><strong>Director:</strong> {team?.Director}</p>
            <p><strong>Writer:</strong> {team?.Writer}</p>
            <p><strong>Cast:</strong> {team?.Cast}</p>
          </CardDescription>
        </div>
      </CardContent>
      <CardFooter className="p-4 flex gap-2 justify-center bg-background">
        <Button variant="outline">Add to List</Button>
        <Button variant="outline">Watched</Button>
      </CardFooter>
    </Card>
  );
};

export default MovieCard;
