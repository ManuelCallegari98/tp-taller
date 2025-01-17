// Services/MovieService.js
import MovieRepository from '../repositories/MovieRepository.js';
import axios from 'axios';

const OMDB_API_KEY = "91ca3eb4";

class MovieService {
    async getAllMovies() {
        try {
            const movies = await MovieRepository.findAll();
            return movies;
        } catch (error) {
            console.error('Error getting all movies:', error);
            throw error;
        }
    }

    async getMoviesByType(type) {
        try {
            const movies = await MovieRepository.findByType(type);
            return this.transformMovie(movies);
        } catch (error) {
            console.error('Error getting movies by type:', error);
            throw error;
        }
    }

    async searchMovies(query, type) {
        try {
            // Validar el tipo
            if (!['movie', 'series'].includes(type)) {
                throw new Error(`Invalid type: ${type}. Must be "movie" or "series"`);
            }

            // Buscar primero en la base de datos local
            const localMovies = await MovieRepository.findByTitle(query, type);

            if (localMovies.length > 0) {
                return this.transformMovie(localMovies);
            }

            // Si no hay resultados locales, buscar en OMDB
            console.log("Buscando en OMDB:", query, type);
            const formattedQuery = query.trim().replace(/ /g, '+');
            const omdbResponse = await axios.get(
                `http://www.omdbapi.com/?t=${formattedQuery}&type=${type}&apikey=${OMDB_API_KEY}`
            );

            if (omdbResponse.data.Response === "True") {
                // Pasar el tipo solicitado a saveMovieFromAPI
                const savedMovie = await this.saveMovieFromAPI(omdbResponse.data, type);
                return [this.transformMovie(savedMovie)];
            }

            return [];
        } catch (error) {
            console.error('Error searching movies:', error);
            if (error.response) {
                console.error('OMDB API Error:', error.response.data);
            }
            throw new Error(`Error al buscar el título: ${error.message}`);
        }
    }


    async saveMovieFromAPI(movieData, requestedType) {
        try {
            // Validar que tenemos los datos necesarios
            if (!movieData || !movieData.Title || !movieData.Type) {
                throw new Error('Invalid movie data from OMDB API');
            }

            // Validar el tipo antes de guardar
            const movieType = movieData.Type.toLowerCase();
            if (movieType !== requestedType) {
                throw new Error(`Type mismatch: Expected ${requestedType} but got ${movieType}`);
            }

            // Preparar los datos para guardar
            const movieToSave = {
                title: movieData.Title,
                year: movieData.Year || 'N/A',
                rated: movieData.Rated || 'N/A',
                released: movieData.Released || 'N/A',
                runtime: movieData.Runtime || 'N/A',
                genre: movieData.Genre || 'N/A',
                director: movieData.Director || 'N/A',
                writer: movieData.Writer || 'N/A',
                actors: movieData.Actors || 'N/A',
                plot: movieData.Plot || 'N/A',
                language: movieData.Language || 'N/A',
                country: movieData.Country || 'N/A',
                awards: movieData.Awards || 'N/A',
                poster: movieData.Poster || 'N/A',
                ratings: movieData.Ratings || [],
                metascore: movieData.Metascore || 'N/A',
                imdbRating: movieData.imdbRating || 'N/A',
                imdbVotes: movieData.imdbVotes || 'N/A',
                imdbID: movieData.imdbID || 'N/A',
                type: movieType,
                boxOffice: movieData.BoxOffice || 'N/A'
            };

            console.log('Saving movie/series:', movieToSave);
            return await MovieRepository.create(movieToSave);
        } catch (error) {
            console.error('Error saving movie from API:', error);
            throw new Error(`Failed to save movie: ${error.message}`);
        }
    }
    
    // Método de transformación para el frontend
    transformMovie(movie) {
        return {
            id: movie.id,
            title: movie.title,
            type: movie.type,
            genre: movie.genre,
            release_date: movie.released,
            duration: movie.runtime,
            team: {
                Director: movie.director,
                Writer: movie.writer,
                Cast: movie.actors
            },
            cover_photo: movie.poster,
            country: movie.country,
            imdb_rating: movie.imdbRating,
            plot: movie.plot,
            year: movie.year,
            awards: movie.awards,
            ratings: movie.ratings
        };
    }

    async getMoviesByGenre(genre, type) {
        try {
            const movies = await MovieRepository.findByGenre(genre, type);
            return this.transformMovies(movies);
        } catch (error) {
            console.error('Error getting movies by genre:', error);
            throw error;
        }
    }

}

export default new MovieService();