// controllers/UserController.js
import UserService from '../Services/UserService.js';

export const createUser = async (req, res) => {
    try {
        console.log('Datos recibidos:', {
            username: req.body.username,
            fullName: req.body.fullName,
            // No logueamos la contraseña por seguridad
            hasProfilePicture: !!req.body.profile_picture
        });

        const user = await UserService.createUser(req.body);
        console.log('Usuario creado exitosamente:', {
            id: user.id,
            username: user.username,
            fullName: user.fullName,
            isAdmin: user.isAdmin
        });

        res.status(201).json(user);
    } catch (error) {
        console.error('Error al crear usuario:', {
            message: error.message,
            stack: error.stack
        });
        res.status(500).json({ error: error.message });
    }
};

export const loginUser = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await UserService.login(username, password);
        
        // Solo enviamos la información necesaria
        res.json({ 
            id: user.id,
            username: user.username,
            fullName: user.fullName,
            isAdmin: user.isAdmin,
            profilePicture: user.profilePicture,
        });
    } catch (error) {
        res.status(401).json({ error: error.message });
    }
};

export const getUsersForAdmin = async (req, res) => {
    try {
        const users = await UserService.getUsersForAdmin();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const deleteUser = async (req, res) => {
    try {
        const { userId } = req.params;
        await UserService.deleteUser(userId);
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


export const updateUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const { id, isAdmin, password, username, fullName, profilePicture } = req.body;
        
        // Logs seguros (sin mostrar contraseña)
        console.log('Datos recibidos:', {
            userId,
            username,
            fullName,
            hasPassword: !!password,
            hasProfilePicture: !!profilePicture,
            requestingUserId: id,
            isAdmin
        });

        // Verificar si el usuario es admin o si está editando su propio perfil
        if (isAdmin || id === parseInt(userId, 10)) {
            console.log('Usuario tiene permisos para editar');
            
            // Preparar datos de actualización (similar a createUser)
            const updateData = {
                username,
                fullName,
                profilePicture
            };

            // Solo incluir password si se proporcionó uno nuevo
            if (password) {
                updateData.password = password;
            }

            const updatedUser = await UserService.updateUser(userId, updateData);
            
            // Log del resultado (sin datos sensibles)
            console.log('Usuario actualizado exitosamente:', {
                id: updatedUser.id,
                username: updatedUser.username,
                fullName: updatedUser.fullName,
                isAdmin: updatedUser.isAdmin,
                hasProfilePicture: !!updatedUser.profilePicture
            });

            // Enviar respuesta sin datos sensibles
            res.status(200).json({
                id: updatedUser.id,
                username: updatedUser.username,
                fullName: updatedUser.fullName,
                isAdmin: updatedUser.isAdmin,
                profilePicture: updatedUser.profilePicture
            });
        } else {
            console.log('Usuario NO tiene permisos:', { 
                userIdToEdit: userId, 
                requestingUserId: id, 
                isAdmin 
            });
            res.status(403).json({ error: 'No tienes permiso para editar este perfil' });
        }
    } catch (error) {
        console.error('Error en updateUser:', {
            message: error.message,
            stack: error.stack
        });
        res.status(500).json({ error: error.message });
    }
};


export const getUserCount = async (req, res) => {
    try {
        const count = await UserService.getUserCount();
        res.json({ count });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};