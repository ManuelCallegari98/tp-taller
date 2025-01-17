// repositories/MovieRepository.js
import { Movie } from '../models/index.js';
import { Op } from 'sequelize';

class MovieRepository {
    async findAll() {
        return await Movie.findAll();
    }

    async findByType(type) {
        return await Movie.findAll({
            where: { type }
        });
    }

    async findByTitle(title, type = null) {
        return await Movie.findAll({
            where: {
                title: {
                    [Op.iLike]: `%${title}%`
                },
                ...(type && { type })
            }
        });
    }

    async create(movieData) {
        // Validar el tipo
        if (!['movie', 'series'].includes(movieData.type)) {
            throw new Error(`Invalid type: ${movieData.type}. Must be "movie" or "series"`);
        }
        
        // Asegurarnos de que todos los campos requeridos estén presentes
        const requiredFields = ['title', 'type', 'year'];
        for (const field of requiredFields) {
            if (!movieData[field]) {
                throw new Error(`Missing required field: ${field}`);
            }
        }
    
        return await Movie.create(movieData);
    }

    async update(id, movieData) {
        const movie = await Movie.findByPk(id);
        if (!movie) {
            throw new Error('Movie not found');
        }
        return await movie.update(movieData);
    }

    async delete(id) {
        const movie = await Movie.findByPk(id);
        if (!movie) {
            throw new Error('Movie not found');
        }
        await movie.destroy();
    }

    async findByGenre(genre, type = null) {
        return await Movie.findAll({
            where: {
                genre: {
                    [Op.iLike]: `%${genre}%`
                },
                ...(type && { type })
            }
        });
    }
}

export default new MovieRepository();