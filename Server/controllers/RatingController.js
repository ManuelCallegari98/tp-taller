// controllers/RatingController.js
import RatingService from '../Services/RatingService.js';
import logger from '../config/logger.js';

export const rateMovie = async (req, res) => {
    try {
        const { userId, movieId, rating, comment } = req.body;

        if (!userId || !movieId || !rating) {
            logger.warn('Intento de calificación con parámetros faltantes', {
                action: 'RATE_MOVIE_MISSING_PARAMS',
                providedParams: {
                    hasUserId: !!userId,
                    hasMovieId: !!movieId,
                    hasRating: !!rating
                }
            });
            return res.status(400).json({ message: 'Missing required parameters' });
        }

        logger.info('Intento de calificación de película', {
            action: 'RATE_MOVIE',
            userId,
            movieId,
            rating,
            hasComment: !!comment
        });

        const ratingItem = await RatingService.rateMovie(userId, movieId, rating, comment);
        logger.info('Película calificada exitosamente', {
            action: 'RATE_MOVIE_SUCCESS',
            ratingId: ratingItem.id,
            userId,
            movieId,
            rating
        });

        res.status(201).json(ratingItem);
    } catch (error) {
        logger.error('Error al calificar película', {
            error: error.message,
            stack: error.stack,
            action: 'RATE_MOVIE_ERROR',
            userId: req.body.userId,
            movieId: req.body.movieId
        });
        res.status(500).json({ error: error.message });
    }
};

export const getUserRatings = async (req, res) => {
    try {
        const { userId } = req.params;
        
        if (!userId) {
            logger.warn('Intento de obtener calificaciones sin ID de usuario', {
                action: 'GET_USER_RATINGS_MISSING_PARAM'
            });
            return res.status(400).json({ message: 'User ID is required' });
        }

        logger.info('Solicitud de calificaciones de usuario', {
            action: 'GET_USER_RATINGS',
            userId
        });

        const ratings = await RatingService.getUserRatings(userId);
        logger.info('Calificaciones de usuario recuperadas exitosamente', {
            action: 'GET_USER_RATINGS_SUCCESS',
            userId,
            count: ratings.length
        });

        res.status(200).json(ratings);
    } catch (error) {
        logger.error('Error al obtener calificaciones de usuario', {
            error: error.message,
            stack: error.stack,
            action: 'GET_USER_RATINGS_ERROR',
            userId: req.params.userId
        });
        res.status(500).json({ error: error.message });
    }
};

export const getMovieRatings = async (req, res) => {
    try {
        const { movieId } = req.params;

        if (!movieId) {
            logger.warn('Intento de obtener calificaciones sin ID de película', {
                action: 'GET_MOVIE_RATINGS_MISSING_PARAM'
            });
            return res.status(400).json({ message: 'Movie ID is required' });
        }

        logger.info('Solicitud de calificaciones de película', {
            action: 'GET_MOVIE_RATINGS',
            movieId
        });

        const ratings = await RatingService.getMovieRatings(movieId);
        logger.info('Calificaciones de película recuperadas exitosamente', {
            action: 'GET_MOVIE_RATINGS_SUCCESS',
            movieId,
            count: ratings.length
        });

        res.status(200).json(ratings);
    } catch (error) {
        logger.error('Error al obtener calificaciones de película', {
            error: error.message,
            stack: error.stack,
            action: 'GET_MOVIE_RATINGS_ERROR',
            movieId: req.params.movieId
        });
        res.status(500).json({ error: error.message });
    }
};

export const editComment = async (req, res) => {
    try {
        const { ratingId } = req.params;
        const { comment } = req.body;
        const userId = req.user.id;

        if (!ratingId || !comment) {
            logger.warn('Intento de editar comentario con parámetros faltantes', {
                action: 'EDIT_COMMENT_MISSING_PARAMS',
                providedParams: {
                    hasRatingId: !!ratingId,
                    hasComment: !!comment
                }
            });
            return res.status(400).json({ message: 'Missing required parameters' });
        }

        logger.info('Intento de edición de comentario', {
            action: 'EDIT_COMMENT',
            ratingId,
            userId,
            commentLength: comment.length
        });

        await RatingService.editComment(ratingId, userId, comment);
        logger.info('Comentario editado exitosamente', {
            action: 'EDIT_COMMENT_SUCCESS',
            ratingId,
            userId
        });

        res.status(204).send();
    } catch (error) {
        logger.error('Error al editar comentario', {
            error: error.message,
            stack: error.stack,
            action: 'EDIT_COMMENT_ERROR',
            ratingId: req.params.ratingId,
            userId: req.user?.id
        });
        res.status(500).json({ error: error.message });
    }
};

export const deleteRating = async (req, res) => {
    try {
        const { ratingId } = req.params;

        if (!ratingId) {
            logger.warn('Intento de eliminar calificación sin ID', {
                action: 'DELETE_RATING_MISSING_PARAM'
            });
            return res.status(400).json({ message: 'Rating ID is required' });
        }

        logger.info('Intento de eliminar calificación', {
            action: 'DELETE_RATING',
            ratingId
        });

        await RatingService.deleteRating(ratingId);
        
        logger.info('Calificación eliminada exitosamente', {
            action: 'DELETE_RATING_SUCCESS',
            ratingId
        });

        res.status(204).send();
    } catch (error) {
        logger.error('Error al eliminar calificación', {
            error: error.message,
            stack: error.stack,
            action: 'DELETE_RATING_ERROR',
            ratingId: req.params.ratingId
        });
        res.status(500).json({ error: error.message });
    }
};