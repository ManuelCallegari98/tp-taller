import BaseRepository from './BaseRepository.js';
import { WatchList, Movie } from '../models/index.js';

class WatchListRepository extends BaseRepository {
    constructor() {
        super(WatchList);
    }

    async getUserWatchList(userId) {
        try {
            // Primero obtenemos los items de la watchlist
            const watchlistItems = await this.model.findAll({
                where: { userId },
                raw: true
            });

            // Obtenemos los IDs de las películas
            const movieIds = watchlistItems.map(item => item.movieId);

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
                    'imdbRating',
                    'released',
                    'genre',
                    'plot',
                    'runtime',
                    'director',
                    'writer',
                    'actors',
                    'year',
                    'awards',
                    'ratings'
                ],
                raw: true
            });

            // Combinamos los items de watchlist con los detalles de las películas
            const watchlistWithMovies = watchlistItems.map(item => ({
                ...item,
                Movie: movies.find(movie => movie.id === item.movieId) || null
            }));

            return watchlistWithMovies;
        } catch (error) {
            console.error('Error en getUserWatchList:', error);
            throw error;
        }
    }

    async findOne(query) {
        return await this.model.findOne({
            ...query,
            include: [Movie]
        });
    }

    async create(data) {
        return await this.model.create(data);
    }

    async removeFromWatchList(userId, movieId) {
        return await this.model.destroy({
            where: { 
                userId: userId, 
                movieId: movieId}
        });
    }

    async updatePriority(userId, movieId, priority) {
        return await this.model.update(
            { priority },
            { where: { userId, movieId } }
        );
    }
}

export default new WatchListRepository();