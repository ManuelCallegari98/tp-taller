import { db } from "../database/connection.database.js";

const Movie = {
  // Crear tabla si no existe
  createTable: async () => {
    try {
      // Crear la tabla "movies" si no existe
      const createTableQuery = `
            CREATE TABLE IF NOT EXISTS public.movies (
                id SERIAL PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                type VARCHAR(50),          -- Puede ser 'película' o 'serie'
                genre VARCHAR(255),
                release_date DATE,
                duration VARCHAR(50),
                team JSONB,                -- Director, escritor, elenco
                cover_photo TEXT,
                country VARCHAR(100),
                imdb_rating DECIMAL(3, 1)  -- Calificación de IMDB con 1 decimal
            );
        `;
      await db.query(createTableQuery);
      console.log('Tabla "movies" verificada/creada');
    } catch (err) {
      console.error("Error creating movies table:", err);
      throw err;
    }
  },

  // Método para buscar películas por título en la base de datos
  findByTitle: async (title) => {
    try {
      const query = `SELECT * FROM public.movies WHERE title ILIKE $1;`;
      const result = await db.query(query, [`%${title}%`]);
      return result.rows;
    } catch (err) {
      throw err;
    }
  },

  // Método para insertar una película en la base de datos
  insertMovie: async (movieData) => {
    try {
      const {
        title,
        type,
        genre,
        release_date,
        duration,
        team,
        cover_photo,
        country,
        imdb_rating,
      } = movieData;
      const query = `
            INSERT INTO public.movies (title, type, genre, release_date, duration, team, cover_photo, country, imdb_rating)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
            RETURNING *;
        `;
      const values = [
        title,
        type,
        genre,
        release_date,
        duration,
        team,
        cover_photo,
        country,
        imdb_rating,
      ];
      const result = await db.query(query, values);
      return result.rows[0];
    } catch (err) {
      console.error("Error inserting movie:", err);
      throw err;
    }
  },

  // Método para obtener todas las películas de la base de datos
  getAllMovies: async () => {
    try {
      const query = "SELECT * FROM public.movies;";
      const result = await db.query(query);
      console.log("Resultado de la consulta:", result.rows); // Log del resultado
      return result.rows;
    } catch (err) {
      console.error("Error fetching movies:", err);
      throw err;
    }
  },
};

export default Movie;
