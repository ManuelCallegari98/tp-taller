// src/types/movieCard.ts
export interface MovieCardItem {
  id: number;
  title: string;
  type: 'movie' | 'series';
  genre: string;
  release_date: string;
  duration: string;
  team: {
    Director?: string;
    Writer?: string;
    Cast?: string;
  };
  cover_photo: string;
  country: string;
  imdb_rating: string;
  plot?: string;
  year?: string;
  awards?: string;
  ratings?: {
    Source: string;
    Value: string;
  }[];
}