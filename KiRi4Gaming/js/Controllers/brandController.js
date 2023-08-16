const {Brand} = require('../models/models')

class BrandController {
    async create(req, res) {
        const { name } = req.body;
        try {
            const existingBrand = await Brand.findOne({ where: { name } });
            if (existingBrand) {
                return res.status(400).json({ message: 'Бренд с таким именем уже существует' });
            }
            const brand = await Brand.create({ name });
            return res.json(brand);
        } catch (err) {
            console.error(err);
            return res.status(500).json({ message: 'Ошибка при создании бренда' });
        }
    }

    async getAll(req, res) {
        const brands = await Brand.findAll()
        return res.json(brands)
    }

}

module.exports = new BrandController()