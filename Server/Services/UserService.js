// services/UserService.js
import UserRepository from '../repositories/UserRepository.js';

class UserService {
    async getAllUsers() {
        return await UserRepository.findAll();
    }

    async createUser(userData) {
        // Verificar si es el primer usuario para hacerlo admin
        const userCount = await UserRepository.countUsers();
        if (userCount === 0) {
            userData.isAdmin = true;
        }
        return await UserRepository.create(userData);
    }

    async login(username, password) {
        const user = await UserRepository.findByUsername(username);
        if (!user) {
            throw new Error('Usuario no encontrado');
        }

        const isValid = await UserRepository.validatePassword(user, password);
        if (!isValid) {
            throw new Error('Contraseña incorrecta');
        }

        return user;
    }

    // Funcionalidad de admin
    async getUsersForAdmin() {
        return await UserRepository.getAllUsersForAdmin();
    }

    async deleteUser(userId) {
        // Solo admin puede eliminar usuarios
        return await UserRepository.delete(userId);
    }
    
    /*async updateUser(userId, userData) {
        return await UserRepository.update(userId, userData);
    }*/

        async updateUser(userId, userData) {
            console.log('UserService.updateUser - Datos recibidos:', {
                userId,
                userData
            });
            return await UserRepository.update(userId, userData);
        }    
    // UserService.js
    async getUserCount() {
        return await UserRepository.countUsers();
    }
}

export default new UserService();