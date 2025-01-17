// src/types/movie.ts
export interface Movie {
    id?: number;
    title: string;
    year: string;
    rated: string;
    released: string;
    runtime: string;
    genre: string;
    director: string;
    writer: string;
    actors: string;
    plot: string;
    language: string;
    country: string;
    awards: string;
    poster: string;
    ratings: {
      Source: string;
      Value: string;
    }[];
    metascore: string;
    imdbRating: string;
    imdbVotes: string;
    imdbID: string;
    type: 'movie' | 'series';
    boxOffice: string;
  }