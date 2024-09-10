import express from "express";
import { getMovies, searchMovieByTitle } from "../controllers/movie.controller.js";

const router = express.Router();

router.get("/", getMovies);
router.get("/searchbytitle", searchMovieByTitle);

export default router;
