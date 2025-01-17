// controllers/WatchListController.js
import WatchListService from '../Services/WatchListService.js';

export const getUserWatchList = async (req, res) => {
    try {
        const { userId } = req.params;
        const watchList = await WatchListService.getUserWatchList(userId);
        res.status(200).json(watchList);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const addToWatchList = async (req, res) => {
    try {
        const { userId, movieId } = req.body;
        const item = await WatchListService.addToWatchList(userId, movieId);
        res.status(201).json(item);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const updatePriority = async (req, res) => {
    try {
        const { userId, movieId } = req.params;
        const { priority } = req.body;
        await WatchListService.updatePriority(userId, movieId, priority);
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const removeFromWatchList = async (req, res) => {
    try {
        const { userId, movieId } = req.params;
        await WatchListService.removeFromWatchList(userId, movieId);
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};