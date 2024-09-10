import "dotenv/config";
import express from "express";
import cors from "cors";
import { db } from './database/connection.database.js';
import userRoutes from './routes/user.routes.js';
import movieRoutes from './routes/movie.routes.js';  // Importar las rutas

const app = express();

// Middleware para CORS
app.use(cors());

// Middleware para parsear JSON con un límite aumentado
app.use(express.json({ limit: '10mb' })); // Establece el límite en 10 MB
app.use(express.urlencoded({ limit: '10mb', extended: true })); // Para formularios codificados en URL

// Usar las rutas de usuario
app.use('/api', userRoutes);
app.use("/api/movies", movieRoutes);

app.get('/', (req, res) => {
    res.send('Hello World!');
});

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    db.connect();
});

