import UserService from '../Services/UserService.js';
import logger from '../config/logger.js';

export const createUser = async (req, res) => {
    try {
        logger.info('Intento de creación de usuario', {
            username: req.body.username,
            fullName: req.body.fullName,
            action: 'CREATE_USER',
            hasProfilePicture: !!req.body.profile_picture
        });

        const user = await UserService.createUser(req.body);
        logger.info('Usuario creado exitosamente', {
            userId: user.id,
            username: user.username,
            action: 'USER_CREATED',
            isAdmin: user.isAdmin
        });

        res.status(201).json(user);
    } catch (error) {
        logger.error('Error al crear usuario', {
            error: error.message,
            stack: error.stack,
            action: 'CREATE_USER_ERROR',
            username: req.body.username
        });
        res.status(500).json({ error: error.message });
    }
};

export const loginUser = async (req, res) => {
    try {
        const { username } = req.body;
        logger.info('Intento de inicio de sesión', {
            username,
            action: 'LOGIN_ATTEMPT'
        });

        const user = await UserService.login(username, req.body.password);
        logger.info('Inicio de sesión exitoso', {
            userId: user.id,
            username: user.username,
            action: 'LOGIN_SUCCESS'
        });
        
        res.json({ 
            id: user.id,
            username: user.username,
            fullName: user.fullName,
            isAdmin: user.isAdmin,
            profilePicture: user.profilePicture,
        });
    } catch (error) {
        logger.error('Error en inicio de sesión', {
            username,
            error: error.message,
            action: 'LOGIN_ERROR'
        });
        res.status(401).json({ error: error.message });
    }
};

export const getUsersForAdmin = async (req, res) => {
    try {
        logger.info('Solicitud de lista de usuarios para admin', {
            action: 'GET_USERS_ADMIN'
        });

        const users = await UserService.getUsersForAdmin();
        logger.info('Lista de usuarios recuperada exitosamente', {
            action: 'GET_USERS_ADMIN_SUCCESS',
            userCount: users.length
        });

        res.json(users);
    } catch (error) {
        logger.error('Error al obtener lista de usuarios', {
            error: error.message,
            stack: error.stack,
            action: 'GET_USERS_ADMIN_ERROR'
        });
        res.status(500).json({ error: error.message });
    }
};

export const deleteUser = async (req, res) => {
    try {
        const { userId } = req.params;
        logger.info('Intento de eliminación de usuario', {
            userId,
            action: 'DELETE_USER'
        });

        await UserService.deleteUser(userId);
        logger.info('Usuario eliminado exitosamente', {
            userId,
            action: 'DELETE_USER_SUCCESS'
        });

        res.json({ message: 'Usuario eliminado exitosamente' });
    } catch (error) {
        logger.error('Error al eliminar usuario', {
            userId: req.params.userId,
            error: error.message,
            stack: error.stack,
            action: 'DELETE_USER_ERROR'
        });
        res.status(500).json({ error: error.message });
    }
};

export const updateUser = async (req, res) => {
    try {
        const { userId } = req.params;
        logger.info('Intento de actualización de usuario', {
            userId,
            action: 'UPDATE_USER',
            updatedFields: Object.keys(req.body).filter(key => key !== 'password')
        });

        const updatedUser = await UserService.updateUser(userId, req.body);
        logger.info('Usuario actualizado exitosamente', {
            userId,
            username: updatedUser.username,
            action: 'UPDATE_USER_SUCCESS'
        });

        res.json(updatedUser);
    } catch (error) {
        logger.error('Error al actualizar usuario', {
            userId: req.params.userId,
            error: error.message,
            stack: error.stack,
            action: 'UPDATE_USER_ERROR'
        });
        res.status(500).json({ error: error.message });
    }
};

export const getUserCount = async (req, res) => {
    try {
        logger.info('Solicitud de conteo de usuarios', {
            action: 'GET_USER_COUNT'
        });

        const count = await UserService.getUserCount();
        logger.info('Conteo de usuarios completado', {
            action: 'GET_USER_COUNT_SUCCESS',
            count
        });

        res.json({ count });
    } catch (error) {
        logger.error('Error al obtener conteo de usuarios', {
            error: error.message,
            stack: error.stack,
            action: 'GET_USER_COUNT_ERROR'
        });
        res.status(500).json({ error: error.message });
    }
};