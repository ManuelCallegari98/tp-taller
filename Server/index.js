import "dotenv/config";
import express from "express";
import cors from "cors";  // Importar cors
import { db } from './database/connection.database.js';
import userRoutes from './routes/user.routes.js';  // Importar las rutas

const app = express();

// Middleware para CORS
app.use(cors());  // Permitir CORS para todas las solicitudes

// Middleware para parsear JSON
app.use(express.json());

// Usar las rutas de usuario
app.use('/api', userRoutes);


app.get('/', (req, res) => {
    res.send('Hello World!');
});

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    db.connect();
});
