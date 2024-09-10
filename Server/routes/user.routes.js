import express from 'express';
import {
    createUser,
    loginUser,
    updateUserProfile,
    updateUserPassword,
    deleteUser,
    getAllUsers,
    updateUserList
} from '../controllers/user.controller.js';

const router = express.Router();

// Ruta para crear un nuevo usuario
router.post('/users', createUser);

// Ruta para iniciar sesión
router.post('/login', loginUser);

// Ruta para actualizar el perfil de usuario
router.put('/users/:id', updateUserProfile);

// Ruta para actualizar la contraseña de usuario
router.put('/users/:id/:password', updateUserPassword);

// Ruta para eliminar un usuario
router.delete('/users/:id', deleteUser);

// Ruta para obtener todos los usuarios
router.get('/users', getAllUsers);

// Ruta para agregar pelicula a la lista
router.post('/users/list', updateUserList);

export default router;

