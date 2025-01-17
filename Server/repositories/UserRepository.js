// repositories/UserRepository.js
import BaseRepository from './BaseRepository.js';
import { User } from '../models/index.js';

class UserRepository extends BaseRepository {
    constructor() {
        super(User);
    }

    async findByUsername(username) {
        return await this.model.findOne({ where: { username } });
    }

    async validatePassword(user, password) {
        return await user.validatePassword(password);
    }

    async countUsers() {
        return await this.model.count();
    }

    // Para el requisito de admin
    async getAllUsersForAdmin() {
        return await this.model.findAll({
            attributes: ['id', 'username', 'fullName', 'isAdmin', 'profilePicture']
        });
    }
}

export default new UserRepository();