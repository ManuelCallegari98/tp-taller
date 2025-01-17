// index.js
import express from 'express';
import dotenv from 'dotenv';
import userRoutes from './routes/user.routes.js';
import movieRoutes from './routes/movie.routes.js';
import watchlistRoutes from './routes/watchlist.routes.js';
import ratingRoutes from './routes/rating.routes.js';
import { sequelize } from './models/index.js';// Asegúrate de que sequelize esté exportado en index.js de modelos
import cors from 'cors'; 

dotenv.config();

const app = express();

const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true }));
// Rutas
app.use('/api/users', userRoutes);
app.use('/api/movies', movieRoutes);
app.use('/api/watchlist', watchlistRoutes);
app.use('/api/ratings', ratingRoutes);

// Sincronizar con la base de datos
sequelize.sync().then(() => {
    console.log('Conectado a la base de datos');
    app.listen(PORT, () => {
        console.log(`Servidor corriendo en http://localhost:${PORT}`);
    });
}).catch(err => {
    console.error('No se pudo conectar a la base de datos:', err);
});