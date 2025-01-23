// controllers/WatchListController.js
import WatchListService from '../Services/WatchListService.js';
import logger from '../config/logger.js';

export const getUserWatchList = async (req, res) => {
    try {
        const { userId } = req.params;

        if (!userId) {
            logger.warn('Intento de obtener watchlist sin ID de usuario', {
                action: 'GET_WATCHLIST_MISSING_PARAM'
            });
            return res.status(400).json({ message: 'User ID is required' });
        }

        logger.info('Solicitud de watchlist de usuario', {
            action: 'GET_WATCHLIST',
            userId
        });

        const watchList = await WatchListService.getUserWatchList(userId);
        logger.info('Watchlist recuperada exitosamente', {
            action: 'GET_WATCHLIST_SUCCESS',
            userId,
            itemCount: watchList.length
        });

        res.status(200).json(watchList);
    } catch (error) {
        logger.error('Error al obtener watchlist', {
            error: error.message,
            stack: error.stack,
            action: 'GET_WATCHLIST_ERROR',
            userId: req.params.userId
        });
        res.status(500).json({ error: error.message });
    }
};

export const addToWatchList = async (req, res) => {
    try {
        const { userId, movieId } = req.body;

        if (!userId || !movieId) {
            logger.warn('Intento de agregar a watchlist con parámetros faltantes', {
                action: 'ADD_TO_WATCHLIST_MISSING_PARAMS',
                providedParams: {
                    hasUserId: !!userId,
                    hasMovieId: !!movieId
                }
            });
            return res.status(400).json({ message: 'User ID and Movie ID are required' });
        }

        logger.info('Intento de agregar película a watchlist', {
            action: 'ADD_TO_WATCHLIST',
            userId,
            movieId
        });

        const item = await WatchListService.addToWatchList(userId, movieId);
        logger.info('Película agregada exitosamente a watchlist', {
            action: 'ADD_TO_WATCHLIST_SUCCESS',
            userId,
            movieId,
            watchlistItemId: item.id
        });

        res.status(201).json(item);
    } catch (error) {
        logger.error('Error al agregar a watchlist', {
            error: error.message,
            stack: error.stack,
            action: 'ADD_TO_WATCHLIST_ERROR',
            userId: req.body.userId,
            movieId: req.body.movieId
        });
        res.status(500).json({ error: error.message });
    }
};

export const updatePriority = async (req, res) => {
    try {
        const { userId, movieId } = req.params;
        const { priority } = req.body;

        if (!userId || !movieId || priority === undefined) {
            logger.warn('Intento de actualizar prioridad con parámetros faltantes', {
                action: 'UPDATE_PRIORITY_MISSING_PARAMS',
                providedParams: {
                    hasUserId: !!userId,
                    hasMovieId: !!movieId,
                    hasPriority: priority !== undefined
                }
            });
            return res.status(400).json({ message: 'Missing required parameters' });
        }

        logger.info('Intento de actualizar prioridad en watchlist', {
            action: 'UPDATE_PRIORITY',
            userId,
            movieId,
            priority
        });

        await WatchListService.updatePriority(userId, movieId, priority);
        logger.info('Prioridad actualizada exitosamente', {
            action: 'UPDATE_PRIORITY_SUCCESS',
            userId,
            movieId,
            newPriority: priority
        });

        res.status(204).send();
    } catch (error) {
        logger.error('Error al actualizar prioridad', {
            error: error.message,
            stack: error.stack,
            action: 'UPDATE_PRIORITY_ERROR',
            userId: req.params.userId,
            movieId: req.params.movieId
        });
        res.status(500).json({ error: error.message });
    }
};

export const removeFromWatchList = async (req, res) => {
    try {
        const { userId, movieId } = req.params;

        if (!userId || !movieId) {
            logger.warn('Intento de eliminar de watchlist con parámetros faltantes', {
                action: 'REMOVE_FROM_WATCHLIST_MISSING_PARAMS',
                providedParams: {
                    hasUserId: !!userId,
                    hasMovieId: !!movieId
                }
            });
            return res.status(400).json({ message: 'User ID and Movie ID are required' });
        }

        logger.info('Intento de eliminar película de watchlist', {
            action: 'REMOVE_FROM_WATCHLIST',
            userId,
            movieId
        });

        await WatchListService.removeFromWatchList(userId, movieId);
        logger.info('Película eliminada exitosamente de watchlist', {
            action: 'REMOVE_FROM_WATCHLIST_SUCCESS',
            userId,
            movieId
        });

        res.status(204).send();
    } catch (error) {
        logger.error('Error al eliminar de watchlist', {
            error: error.message,
            stack: error.stack,
            action: 'REMOVE_FROM_WATCHLIST_ERROR',
            userId: req.params.userId,
            movieId: req.params.movieId
        });
        res.status(500).json({ error: error.message });
    }
};