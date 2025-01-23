// controllers/MovieController.js
import MovieService from '../Services/MovieService.js';
import logger from '../config/logger.js';

export const getAllMovies = async (req, res) => {
    try {
        logger.info('Solicitud de obtener todas las películas', {
            action: 'GET_ALL_MOVIES'
        });

        const movies = await MovieService.getAllMovies();
        logger.info('Películas recuperadas exitosamente', {
            action: 'GET_ALL_MOVIES_SUCCESS',
            count: movies.length
        });

        res.status(200).json(movies);
    } catch (error) {
        logger.error('Error al obtener todas las películas', {
            error: error.message,
            stack: error.stack,
            action: 'GET_ALL_MOVIES_ERROR'
        });
        res.status(500).json({ message: 'Error getting movies', error: error.message });
    }
};

export const getMoviesByType = async (req, res) => {
    try {
        const { type } = req.query;
        
        if (!type) {
            logger.warn('Intento de búsqueda por tipo sin especificar el tipo', {
                action: 'GET_MOVIES_BY_TYPE_MISSING_PARAM'
            });
            return res.status(400).json({ message: 'Type parameter is required' });
        }

        logger.info('Solicitud de películas por tipo', {
            action: 'GET_MOVIES_BY_TYPE',
            type
        });

        const movies = await MovieService.getMoviesByType(type);
        logger.info('Películas por tipo recuperadas exitosamente', {
            action: 'GET_MOVIES_BY_TYPE_SUCCESS',
            type,
            count: movies.length
        });

        res.status(200).json(movies);
    } catch (error) {
        logger.error('Error al obtener películas por tipo', {
            error: error.message,
            stack: error.stack,
            action: 'GET_MOVIES_BY_TYPE_ERROR',
            type: req.query.type
        });
        res.status(500).json({ message: 'Error getting movies', error: error.message });
    }
};

export const searchMovies = async (req, res) => {
    try {
        const { query } = req.query;
        
        if (!query) {
            logger.warn('Intento de búsqueda sin término de búsqueda', {
                action: 'SEARCH_MOVIES_MISSING_PARAM'
            });
            return res.status(400).json({ message: 'Search query is required' });
        }

        logger.info('Solicitud de búsqueda de películas', {
            action: 'SEARCH_MOVIES',
            searchQuery: query
        });

        const movies = await MovieService.searchMovies(query);
        logger.info('Búsqueda de películas completada', {
            action: 'SEARCH_MOVIES_SUCCESS',
            searchQuery: query,
            resultsCount: movies.length
        });

        res.status(200).json(movies);
    } catch (error) {
        logger.error('Error en la búsqueda de películas', {
            error: error.message,
            stack: error.stack,
            action: 'SEARCH_MOVIES_ERROR',
            searchQuery: req.query.query
        });
        res.status(500).json({ message: 'Error searching movies', error: error.message });
    }
};

export const getMoviesByGenre = async (req, res) => {
    try {
        const { genre } = req.query;
        
        if (!genre) {
            logger.warn('Intento de búsqueda por género sin especificar el género', {
                action: 'GET_MOVIES_BY_GENRE_MISSING_PARAM'
            });
            return res.status(400).json({ message: 'Genre parameter is required' });
        }

        logger.info('Solicitud de películas por género', {
            action: 'GET_MOVIES_BY_GENRE',
            genre
        });

        const movies = await MovieService.getMoviesByGenre(genre);
        logger.info('Películas por género recuperadas exitosamente', {
            action: 'GET_MOVIES_BY_GENRE_SUCCESS',
            genre,
            count: movies.length
        });

        res.status(200).json(movies);
    } catch (error) {
        logger.error('Error al obtener películas por género', {
            error: error.message,
            stack: error.stack,
            action: 'GET_MOVIES_BY_GENRE_ERROR',
            genre: req.query.genre
        });
        res.status(500).json({ message: 'Error getting movies by genre', error: error.message });
    }
};