// services/WatchListService.js
import WatchListRepository from '../repositories/WatchListRepository.js';

class WatchListService {
    async getUserWatchList(userId) {
        return await WatchListRepository.getUserWatchList(userId);
    }

    async addToWatchList(userId, movieId) {
        // Verificar que no exista ya en la lista
        const existing = await WatchListRepository.findOne({
            where: { userId, movieId }
        });
        if (existing) {
            throw new Error('La película/serie ya está en tu lista');
        }
        return await WatchListRepository.create({ userId, movieId });
    }

    async updatePriority(userId, movieId, priority) {
        return await WatchListRepository.updatePriority(userId, movieId, priority);
    }

    async removeFromWatchList(userId, movieId) {
        return await WatchListRepository.removeFromWatchList(
            parseInt(userId),
            parseInt(movieId)
        );
    }
}

export default new WatchListService();