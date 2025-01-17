// routes/movie.routes.js
import express from 'express';
import { 
    getAllMovies, 
    getMoviesByType, 
    searchMovies, 
    getMoviesByGenre 
} from '../controllers/MovieController.js';

const router = express.Router();

router.get('/', getAllMovies);
router.get('/type', getMoviesByType);
router.get('/search', searchMovies);
router.get('/genre', getMoviesByGenre);

export default router;