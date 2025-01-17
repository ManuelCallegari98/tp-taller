// src/types/serie.ts
export interface Serie {
    id: string;
    title: string;
    cover_photo: string;
    genre: string;
    release_date: string;
    seasons: number;
    imdb_rating: number;
    country: string;
    type: 'serie';  // Agregamos el type como literal
    team: {
      Creator?: string;
      Writer?: string;
      Cast?: string;
    };
}