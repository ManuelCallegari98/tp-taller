// routes/rating.routes.js
import express from 'express';
import { rateMovie, getUserRatings, getMovieRatings, editComment } from '../controllers/RatingController.js';

const router = express.Router();

router.post('/', rateMovie);
router.get('/user/:userId', getUserRatings);
router.get('/movie/:movieId', getMovieRatings);
router.put('/:ratingId', editComment);

export default router;