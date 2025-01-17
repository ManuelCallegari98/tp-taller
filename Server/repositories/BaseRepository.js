// repositories/BaseRepository.js
class BaseRepository {
    constructor(model) {
        this.model = model;
    }

    async findAll() {
        return await this.model.findAll();
    }

    async findById(id) {
        return await this.model.findByPk(id);
    }

    async findOne(options) {
        return await this.model.findOne(options);
    }

    async create(data) {
        return await this.model.create(data);
    }

    /*async update(id, data) {
        const entity = await this.findById(id);
        if (entity) {
            return await entity.update(data);
        }
        return null;
    }*/
        async update(id, data) {
            console.log('BaseRepository.update - Datos recibidos:', {
                id,
                data
            });
            const entity = await this.findById(id);
            if (entity) {
                console.log('Entidad encontrada:', entity.toJSON());
                const updated = await entity.update(data);
                console.log('Entidad actualizada:', updated.toJSON());
                return updated;
            }
            console.log('No se encontró la entidad con id:', id);
            return null;
        }

    async delete(id) {
        const entity = await this.findById(id);
        if (entity) {
            await entity.destroy();
            return true;
        }
        return false;
    }

}

export default BaseRepository;