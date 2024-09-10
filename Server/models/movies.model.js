import { db } from "../database/connection.database.js";

const Movie = {
  // Crear tabla si no existe
  createTable: async () => {
    const query = `
            CREATE TABLE IF NOT EXISTS public.movies (
                id SERIAL PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                type VARCHAR(50),
                genre VARCHAR(255),
                release_date VARCHAR(50),
                duration VARCHAR(50),
                team JSONB, -- JSONB para almacenar director, escritor, elenco
                cover_photo TEXT,
                country VARCHAR(100),
                imdb_rating DECIMAL,
                created_at TIMESTAMP DEFAULT NOW()
            );
        `;
    await db.query(query);
  },

  // Método para buscar películas/series por título, género y tipo
  findByCriteria: async (title, genre, type) => {
    let query = `SELECT * FROM public.movies WHERE 1=1`;
    const params = [];

    if (title) {
      query += ` AND LOWER(title) LIKE LOWER($${params.length + 1})`;
      params.push(`%${title}%`);
    }
    if (genre) {
      query += ` AND LOWER(genre) LIKE LOWER($${params.length + 1})`;
      params.push(`%${genre}%`);
    }
    if (type) {
      query += ` AND LOWER(type) = LOWER($${params.length + 1})`;
      params.push(type);
    }

    const result = await db.query(query, params);
    return result.rows;
  },

  // Método para insertar una nueva película/serie
  insertMovie: async (movie) => {
    const query = `
            INSERT INTO public.movies (title, type, genre, release_date, duration, team, cover_photo, country, imdb_rating, created_at)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW()) RETURNING *;
        `;
    const values = [
      movie.title,
      movie.type,
      movie.genre,
      movie.release_date,
      movie.duration,
      JSON.stringify(movie.team),
      movie.cover_photo,
      movie.country,
      movie.imdb_rating,
    ];

    const result = await db.query(query, values);
    return result.rows[0];
  },

  findAll: async () => {
    try {
      const query = `
                    SELECT * FROM public.movies ORDER BY release_date DESC;
                `;
      const result = await db.query(query);
      return result.rows; // Returns all movies/series in the database
    } catch (err) {
      console.error("Error fetching movies:", err);
      throw err;
    }
  },
};

export default Movie;
