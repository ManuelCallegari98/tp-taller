// components/MovieCard.js
import React from 'react';
import { Card, CardContent, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from 'next/image';

const MovieCard = ({ movie }) => {
  const {
    title,
    cover_photo,
    genre,
    release_date,
    duration,
    imdb_rating,
    country
  } = movie;

  return (
    <Card className="w-full h-[400px] bg-background shadow-lg rounded-lg overflow-hidden">
      <div className="relative h-[30%]">
        <img
          src={cover_photo}
          alt={`${title} cover`}
          layout="fill"
          objectFit="cover"
          className="w-full h-full"
        />
      </div>
      <CardContent className="p-4 flex flex-col h-[40%]">
        <CardTitle className="text-lg font-semibold truncate">{title}</CardTitle>
        <CardDescription className="text-sm text-muted-foreground">
          <p><strong>Genre:</strong> {genre}</p>
          <p><strong>Release Date:</strong> {new Date(release_date).toLocaleDateString()}</p>
          <p><strong>Duration:</strong> {duration}</p>
          <p><strong>Rating:</strong> {imdb_rating}</p>
          <p><strong>Country:</strong> {country}</p>
        </CardDescription>
      </CardContent>
      <CardFooter className="relative bottom-0 w-full p-4 flex gap-2 justify-center bg-background">
        {/*<Button variant="outline">More Details</Button>*/}
        <Button variant="outline">Add to List</Button>
        <Button variant="outline">Watched</Button>
      </CardFooter>
    </Card>
  );
};

export default MovieCard;
