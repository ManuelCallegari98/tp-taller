// controllers/RatingController.js
import RatingService from '../Services/RatingService.js';

export const rateMovie = async (req, res) => {
    try {
        const { userId, movieId, rating, comment } = req.body;
        const ratingItem = await RatingService.rateMovie(userId, movieId, rating, comment);
        res.status(201).json(ratingItem);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getUserRatings = async (req, res) => {
    try {
        const { userId } = req.params;
        const ratings = await RatingService.getUserRatings(userId);
        res.status(200).json(ratings);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getMovieRatings = async (req, res) => {
    try {
        const { movieId } = req.params;
        const ratings = await RatingService.getMovieRatings(movieId);
        res.status(200).json(ratings);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const editComment = async (req, res) => {
    try {
        const { ratingId } = req.params;
        const { comment } = req.body;
        await RatingService.editComment(ratingId, req.user.id, comment);
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};