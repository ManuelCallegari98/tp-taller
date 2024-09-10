import Movie from "../models/Movie.js";
import axios from "axios";

const API_KEY = "http://www.omdbapi.com/?i=tt3896198&apikey=91ca3eb4";

const searchMovies = async (req, res) => {
    const { title, genre, type } = req.query;

    try {
        // Buscar en la base de datos
        const internalResults = await Movie.findByCriteria(title, genre, type);

        if (internalResults.length > 0) {
            return res.status(200).json(internalResults);
        }

        // Si no hay resultados, buscar en la API de OMDB
        const omdbResponse = await axios.get(`http://www.omdbapi.com/`, {
            params: {
                apikey: API_KEY,
                s: title,
                type,
                genre
            }
        });

        if (omdbResponse.data.Response === "True") {
            const omdbResults = omdbResponse.data.Search;

            // Insertar resultados en la base de datos
            const savedMovies = [];
            for (const movie of omdbResults) {
                const movieDetails = await axios.get(`http://www.omdbapi.com/`, {
                    params: {
                        apikey: API_KEY,
                        i: movie.imdbID
                    }
                });

                const newMovie = {
                    title: movieDetails.data.Title,
                    type: movieDetails.data.Type,
                    genre: movieDetails.data.Genre,
                    release_date: movieDetails.data.Released,
                    duration: movieDetails.data.Runtime,
                    team: {
                        director: movieDetails.data.Director,
                        writer: movieDetails.data.Writer,
                        actors: movieDetails.data.Actors
                    },
                    cover_photo: movieDetails.data.Poster,
                    country: movieDetails.data.Country,
                    imdb_rating: movieDetails.data.imdbRating
                };

                const savedMovie = await Movie.insertMovie(newMovie);
                savedMovies.push(savedMovie);
            }

            return res.status(200).json(savedMovies);
        } else {
            return res.status(404).json({ message: "No movies found" });
        }
    } catch (error) {
        console.error("Error searching movies:", error);
        return res.status(500).json({ error: "An error occurred while searching for movies." });
    }
};
export const getMovies = async (req, res) => {
    try {
        const movies = await Movie.findAll();
        res.status(200).json(movies);
    } catch (err) {
        res.status(500).json({ message: "Error fetching movies" });
    }
};

export { searchMovies, getMovies };
