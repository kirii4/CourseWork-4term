const uuid = require('uuid')
const path = require('path');
const {Device, DeviceInfo, TypeBrand, Brand, Type, User, BasketDevice} = require('../models/models')

class DeviceController {
    async create(req, res, next) {
        try {
            let { name, price, brandId, typeId, info } = req.body;
            const { img } = req.files;
            let fileName = uuid.v4() + ".jpg";
            img.mv(path.resolve(__dirname, '..', 'static', fileName));
            const device = await Device.create({ name, price, brandId, typeId, img: fileName });
            let brand = await Brand.findOne({ where: { id: brandId } });
            let type = await Type.findOne({ where: { id: typeId } });
            if (info) {
                let existingDeviceInfo = await DeviceInfo.findOne({ where: { title: type.name + ' ' + brand.name + ' ' + name, deviceId: device.id } });
                if (existingDeviceInfo) {
                    existingDeviceInfo.description = info;
                    await existingDeviceInfo.save();
                } else {
                    await DeviceInfo.create({
                        title: type.name + ' ' + brand.name + ' ' + name,
                        description: info,
                        deviceId: device.id
                    });
                }
            }
            return res.json(device);
        } catch (e) {
            res.status(400).json({ message: e.message });
        }
    }


    async getAll(req, res) {
        const { brandId, typeId, limit, page } = req.query;
        const offset = (page || 1) * (limit || 9) - (limit || 9);

        try {
            let devices;

            if (!brandId && !typeId) {
                devices = await Device.findAndCountAll({
                    limit,
                    offset,
                    include: [Brand, Type]
                });
            } else if (brandId && !typeId) {
                devices = await Device.findAndCountAll({
                    where: { brandId },
                    limit,
                    offset,
                    include: Brand,
                });
            } else if (!brandId && typeId) {
                devices = await Device.findAndCountAll({
                    where: { typeId },
                    limit,
                    offset,
                    include: Brand,
                });
            } else if (brandId && typeId) {
                devices = await Device.findAndCountAll({
                    where: { typeId, brandId },
                    limit,
                    offset,
                    include: Brand,
                });
            }

            return res.json(devices);
        } catch (error) {
            console.log(error);
            return res.status(500).json({ error: 'Something went wrong' });
        }
    }

    async getOne(req, res) {
        const {id} = req.params
        const device = await Device.findOne(
            {
                where: {id},
                include: [{model: DeviceInfo, as: 'info'}]
            },
        )
        return res.json(device)
    }

    async update(req,res){
        try {
            let {id, name} = req.body
            id = parseInt(id, 10)
            const device = await Device.findOne({ where: {id} });
            if (!device) {
                return res.status(404).json({ message: 'Товар не найден' });
            }
            device.name = name
            await device.save()
            return res.status(200).json({ message: 'Товар обновлен'});
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Ошибка при обновлении товара' });
        }
    }

    async delete(req, res){
        try {
            let {id} = req.body
            console.log(id)
            id = parseInt(id, 10)
            await Device.destroy({ where: { id } });
            return res.json({ message: 'Товар успешно удален' });
        } catch (err){
            console.error(err)
            return res.status(500).json({ message: 'Ошибка удаления товара' });
        }
    }

    async showDevice(req, res) {
        try {
            console.log(1);
            let { deviceId } = req.body;
            deviceId = parseInt(deviceId, 10);
            let device = await Device.findOne({ where: { id: deviceId }, include: [Type, Brand] });
            let deviceInfo = await DeviceInfo.findOne({ where: { deviceId } });
            return res.json({ deviceInfo, device });
        } catch (err) {
            console.error(err);
            return res.status(500).json({ message: 'Ошибка удаления товара' });
        }
    }
}

module.exports = new DeviceController()