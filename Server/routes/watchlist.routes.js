// routes/watchlist.routes.js
import express from 'express';
import { getUserWatchList, addToWatchList, updatePriority, removeFromWatchList } from '../controllers/WatchListController.js';

const router = express.Router();

router.get('/:userId', getUserWatchList);
router.post('/', addToWatchList);
router.put('/:userId/:movieId', updatePriority);
router.delete('/:userId/:movieId', removeFromWatchList);

export default router;