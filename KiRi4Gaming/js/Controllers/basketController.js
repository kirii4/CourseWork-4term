const {Basket, User, Type, Device, Brand} = require('../models/models')
const {BasketDevice} = require('../models/models')
const bcrypt = require("bcrypt");

class BasketController {
    async addDevice(req, res) {
        try {
            const {id, email} = req.query
            const user = await User.findOne({where: {email}})
            const userId = user.id
            const basket = await Basket.findOne({where: {userId}})
            const basketDevice = await BasketDevice.create({ basketId: basket.id, deviceId: id})
            return res.json('Успешно');
        } catch (err) {
            console.error(err);
            return res.status(500).json({ message: 'Ошибка добавления товара в корзину' });
        }
    }

    async getAll(req, res) {
        try {
            let {userId} = req.query
            userId = parseInt(userId, 10)
            let basket = await Basket.findOne({where: {userId}})
            if (!basket) {
                return res.status(409).json({message: 'Корзина не найдена'});
            }
            let basketId = basket.id
            basketId = parseInt(basketId, 10)
            const device = await BasketDevice.findAndCountAll({
                where: { basketId },
                include: [
                    { model: Device, include: [Brand, Type] } // Включаем модели Brand и Type внутри модели Device
                ]
            });
            return res.json(device)
        } catch (err){
            console.error(err)
            return res.status(500).json({ message: 'Ошибка поиска информации о корзине' });
        }
    }

    async deleteDevice(req, res){
        try {
            let {id, email} = req.query
            const user = await User.findOne({where: {email}})
            let userId = user.id
            const basket = await Basket.findOne({where: {userId}})
            let basketId = basket.id
            await BasketDevice.destroy({ where: { basketId: basketId, deviceId: id } });
            return res.json({ message: 'Товар успешно удален' });
        } catch (err){
            console.error(err)
            return res.status(500).json({ message: 'Ошибка поиска информации о корзине' });
        }
    }
    async deleteBasketDevice(req, res){
        try {
            let {email, cartItems} = req.query
            console.log(email)
            console.log(cartItems)
            const user = await User.findOne({where: {email}})
            let userId = user.id
            const basket = await Basket.findOne({where: {userId}})
            let basketId = basket.id
            for (let i = 0; i < cartItems.length; i++)
                await BasketDevice.destroy({ where: { basketId: basketId, deviceId: cartItems[i].productId } });
            return res.json({ message: 'Товар успешно удален' });
        } catch (err){
            console.error(err)
            return res.status(500).json({ message: 'Ошибка поиска информации о корзине' });
        }
    }
}

module.exports = new BasketController()