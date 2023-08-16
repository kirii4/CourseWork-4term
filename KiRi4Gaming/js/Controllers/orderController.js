const {Basket, User, Type, Device, Brand, Order, OrderItem} = require('../models/models')
const {BasketDevice} = require('../models/models')
const bcrypt = require("bcrypt");

class OrderController {
    async createOrder(req, res) {
        try {
            let { initials, phoneNumber, town, address, email, region, postIndex, paymentMethod, delivery } = req.body;
            if (!initials || !phoneNumber || !town || !address || !email || !region || !postIndex || !paymentMethod || !delivery) {
                return res.status(400).json({ message: 'Некорректные данные заказа' });
            }
            const order = await Order.create({
                initial: initials,
                phoneNumber: phoneNumber,
                town: town,
                address: address,
                email: email,
                region: region,
                postIndex: postIndex,
                paymentMethod: paymentMethod,
                delivery: delivery
            });
            if (!order) {
                return res.status(500).json({ message: 'Ошибка создания заказа' });
            }
            return res.json('Успешно');
        } catch (err) {
            console.error(err);
            return res.status(500).json({ message: 'Ошибка добавления товара в корзину' });
        }
    }

    async checkOrder(req, res) {
        const {email} = req.query
        const candidate = await Order.findOne({where: {email}})
        if (candidate)
            return res.json({email});
    }

    async addDevice(req, res) {
        try {
            const { email, cartItems } = req.body;
            const order = await Order.findOne({ where: { email } });
            if (!order) {
                return res.status(400).json({ message: 'Заказ не найден' });
            }
            for (let i = 0; i < cartItems.length; i++) {
                let orderItem = await OrderItem.findOne({ where: { orderId: order.id, deviceId: cartItems[i].productId } });
                if (orderItem) {
                    orderItem.quantity += parseInt(cartItems[i].quantity, 10);
                    await orderItem.save();
                } else {
                    await OrderItem.create({
                        quantity: cartItems[i].quantity,
                        orderId: order.id,
                        deviceId: cartItems[i].productId
                    });
                }
            }
            return res.json('Успешно');
        } catch (err) {
            console.error(err);
            return res.status(500).json({ message: 'Ошибка добавления товара в корзину' });
        }
    }

    async getAll(req, res) {
        try {
            const orders = await Order.findAll({
                include: [
                    {
                        model: OrderItem,
                        include: {
                            model: Device,
                            include: [Brand, Type]
                        },
                    },
                ],
            });

            const usersOrders = await Promise.all(
                orders.map(async (order) => {
                    const orderItems = await OrderItem.findAll({
                        where: { orderId: order.id },
                        include: { model: Device,
                                   include: [Brand, Type]},
                    });

                    return { order };
                })
            );

            return res.json(usersOrders);
        } catch (error) {
            console.log(error);
            return res.status(500).json({ error: 'Something went wrong' });
        }
    }

    async getOne(req, res) {
        try {
            let { email } = req.query;
            const order = await Order.findOne({
                where: { email },
                include: [
                    {
                        model: OrderItem,
                        include: {
                            model: Device,
                            include: [Brand, Type],
                        },
                    },
                ],
            });
            if (!order) {
                return res.status(404).json({ error: 'Заказ не найден' });
            }
            return res.json(order);
        } catch (error) {
            console.log(error);
            return res.status(500).json({ error: 'Ошибка получения данных' });
        }
    }

    async deleteOrder(req, res) {
        try {
            let {id} = req.body
            let order = await Order.findOne({where: {id}})
            await OrderItem.destroy({where:{orderId: order.id}})
            await Order.destroy({where: {id}});
            return res.json({message: 'Заказ успешно удален'});
        } catch (err) {
            console.error(err)
            return res.status(500).json({message: 'Ошибка поиска информации о корзине'});
        }
    }

    async delivered(req, res){
        try {
            let {id} = req.body
            let order = await Order.findOne({where: {id}})
            order.isDelivered = true
            await order.save()
            return res.json({message: 'Заказ успешно доставлен'});
        } catch (err) {
            console.error(err)
            return res.status(500).json({message: 'Ошибка поиска информации о корзине'});
        }
    }
}

module.exports = new OrderController()