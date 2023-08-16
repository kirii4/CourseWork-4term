const {Type} = require('../models/models')

class TypeController {
    async create(req, res) {
        const { name } = req.body;
        try {
            const existingType = await Type.findOne({ where: { name } });
            if (existingType) {
                return res.status(409).json({ message: 'Такой тип уже существует' });
            }
            const type = await Type.create({ name });
            return res.status(201).json(type);
        } catch (err) {
            console.error(err);
            return res.status(500).json({ message: 'Ошибка при создании типа' });
        }
    }

    async getAll(req, res) {
        const types = await Type.findAll()
        return res.json(types)
    }

}

module.exports = new TypeController()