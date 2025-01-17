// services/RatingService.js
import RatingRepository from '../repositories/RatingRepository.js';

class RatingService {
    async rateMovie(userId, movieId, rating, comment = null) {
        // Validar rating entre 1 y 5
        if (rating < 1 || rating > 5) {
            throw new Error('La calificación debe estar entre 1 y 5');
        }

        try {
            // Verificar si ya existe una calificación
            const existingRating = await RatingRepository.findOne({
                where: { userId, movieId }
            });

            if (existingRating) {
                // Actualizar calificación existente
                return await RatingRepository.updateRating(userId, movieId, rating, comment);
            }

            // Crear nueva calificación
            return await RatingRepository.create({
                userId,
                movieId,
                rating,
                comment
            });
        } catch (error) {
            throw new Error('Error al procesar la calificación: ' + error.message);
        }
    }

    async getMovieRatings(movieId) {
        return await RatingRepository.getMovieRatings(movieId);
    }

    async getUserRatings(userId) {
        return await RatingRepository.getUserRatings(userId);
    }

    async editComment(ratingId, userId, comment) {
        const rating = await RatingRepository.findById(ratingId);
        if (!rating || rating.userId !== userId) {
            throw new Error('No tienes permiso para editar este comentario');
        }
        return await RatingRepository.update(ratingId, { comment });
    }
}

export default new RatingService();