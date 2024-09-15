import Movie from "../models/movies.model.js";
import axios from "axios";
const OMDB_API_KEY = "91ca3eb4";

export const getMovies = async (req, res) => {
    console.log("Request received for getMovies"); // Log de la solicitud
    try {
      const movies = await Movie.getAllMovies(); // Usa el método correcto del modelo
      console.log("Movies retrieved:", movies); // Log de las películas obtenidas
      res.status(200).json(movies);
    } catch (err) {
      console.error('Error fetching movies:', err);
      res.status(500).json({ message: "Error fetching movies", error: err.message });
    }
};
export const searchMovieByTitle = async (req, res) => {
    const { title, type } = req.query;

    if (!title || !type) {
        return res.status(400).json({ message: 'Title and type query parameters are required.' });
    }

    // Reemplaza los espacios con +
    const formattedTitle = title.trim().replace(/ /g, '+');

    try {
        // Asegurarse de que la tabla exista antes de hacer consultas
        await Movie.createTable();

        // Buscar la película o serie en la base de datos
        const movies = await Movie.findByTitle(title);

        // Filtrar las películas o series según el tipo
        const filteredMovies = movies.filter(movie => movie.type === type);

        // Si se encuentran películas o series que coincidan con el tipo, devolverlas
        if (filteredMovies.length > 0) {
            return res.status(200).json(filteredMovies);
        }

        // Si no se encuentra la película o serie en la base de datos, consultar la API de OMDB
        console.log("No se encontró en la base de datos. Buscando en OMDB...");
        const omdbResponse = await axios.get(`http://www.omdbapi.com/?t=${formattedTitle}&type=${type}&apikey=${OMDB_API_KEY}`);
        console.log("Respuesta de OMDB:", omdbResponse.data);

        if (omdbResponse.data.Response === "True") {
            const movie = omdbResponse.data;
            if (movie.Type !== type) {
                return res.status(404).json({ message: `No ${type}s found with the given title.` });
            }

            const movieData = {
                title: movie.Title,
                type: movie.Type,
                genre: movie.Genre,
                release_date: movie.Released,
                duration: movie.Runtime,
                team: { Director: movie.Director, Writer: movie.Writer, Cast: movie.Actors },
                cover_photo: movie.Poster,
                country: movie.Country,
                imdb_rating: movie.imdbRating
            };
            await Movie.insertMovie(movieData);

            // Consultar nuevamente la base de datos
            const updatedMovies = await Movie.findByTitle(title);
            return res.status(200).json(updatedMovies);
        } else {
            return res.status(404).json({ message: `No ${type}s found with the given title.` });
        }
    } catch (error) {
        console.error('Error searching for movie or series:', error);
        res.status(500).json({ message: 'An error occurred while searching for movies or series.', error: error.message });
    }
};

