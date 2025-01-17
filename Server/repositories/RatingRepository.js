// repositories/RatingRepository.js
import BaseRepository from './BaseRepository.js';
import { Rating, Movie, User } from '../models/index.js';

class RatingRepository extends BaseRepository {
    constructor() {
        super(Rating);
    }

    async getUserRatings(userId) {
        try {
            // Primero obtenemos los ratings
            const ratings = await this.model.findAll({
                where: { userId },
                raw: true
            });

            // Obtenemos los IDs de las películas
            const movieIds = ratings.map(rating => rating.movieId);

            // Obtenemos los detalles de las películas
            const movies = await Movie.findAll({
                where: {
                    id: movieIds
                },
                attributes: [
                    'id', 
                    'title', 
                    'type', 
                    'poster', 
                    'year', 
                    'genre',
                    'runtime',
                    'director',
                    'writer',
                    'actors',
                    'country',
                    'released',
                    'imdbRating'
                ],
                raw: true
            });

            // Combinamos los ratings con los detalles de las películas
            const ratingsWithMovies = ratings.map(rating => ({
                ...rating,
                Movie: movies.find(movie => movie.id === rating.movieId) || null
            }));

            return ratingsWithMovies;
        } catch (error) {
            console.error('Error en getUserRatings:', error);
            throw error;
        }
    }

    async getMovieRatings(movieId) {
        return await this.model.findAll({
            where: { movieId },
            include: [{
                model: User,
                attributes: ['username']
            }]
        });
    }

    async updateRating(userId, movieId, rating, comment) {
        const [existingRating] = await this.model.update(
            { rating, comment },
            { 
                where: { userId, movieId },
                returning: true
            }
        );
        return existingRating;
    }
}

export default new RatingRepository();