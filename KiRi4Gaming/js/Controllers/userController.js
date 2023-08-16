const ApiError = require('../error/ApiError');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const {User, Basket} = require('../models/models')
const {Op} = require('sequelize');
const uuid = require('uuid');
const path = require('path');

const generateJwt = (id, email, role) => {
    return jwt.sign(
        {id, email, role},
        process.env.SECRET_KEY,
        {expiresIn: '24h'}
    )
}

class UserController {
    async registration(req, res, next) {
        const {name, surname, email, password, role} = req.body
        if (!email || !password) {
            return res.status(400).json({message: 'Некорректный email или password'});
        }
        const candidate = await User.findOne({where: {email}})
        if (candidate) {
            return res.status(400).json({message: 'Пользователь с таким email уже существует'});
        }
        const hashPassword = await bcrypt.hash(password, 5)
        const user = await User.create({name, surname, email, role, password: hashPassword})
        const basket = await Basket.create({userId: user.id})
        const token = generateJwt(user.id, user.email, user.name, user.surname, user.img, user.role)
        return res.json({token})
    }

    async info(req, res, next) {
        try {
            const {email, password} = req.query;
            const user = await User.findOne({where: {email}})
            if (!user) {
                return res.status(400).json({message: 'Пользователь не найден'});
            }
            let comparePassword = bcrypt.compareSync(password, user.password)
            if (!comparePassword) {
                return res.status(400).json({message: 'Указан неверный пароль'});
            }
            const {id, name, surname, img, role} = user;
            return res.json({data: {id, email, name, surname, img, role}});
        } catch (error) {
            return res.status(400).json({message: error.message});
        }
    }

    async getId(req, res, next) {
        try {
            const { email } = req.query;
            const user = await User.findOne({where: {email}})
            if (!user) {
                return res.status(400).json({message: 'Пользователь не найден'});
            }
            const { id } = user;
            return res.json({id});
        } catch (error) {
            return res.status(500).json({message: error.message});
        }
    }

    async login(req, res) {
        let {email, password} = req.body
        const user = await User.findOne({where: {email}})
        if (!user) {
            return res.status(400).json({message: 'Пользователь не найден'});
        }
        let comparePassword = bcrypt.compareSync(password, user.password)
        if (!comparePassword) {
            return res.status(400).json({message: 'Указан неверный пароль'});
        }
        const token = generateJwt(user.id, user.email, user.name, user.surname, user.img, user.role)
        return res.json({token})
    }


    async updateUserAvatar(req, res) {
        try {
            const { email } = req.body;
            const {img} = req.files
            let fileName = uuid.v4() + ".jpg"
            img.mv(path.resolve(__dirname, '..', 'static', fileName))
            const user = await User.findOne({ where: { email } });
            if (!user) {
                return res.status(404).json({ message: 'Пользователь не найден' });
            }
            user.img = fileName;
            await user.save();
            return res.status(200).json({ message: 'Аватар пользователя обновлен', fileName });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Ошибка при обновлении аватара пользователя' });
        }
    }


    async logout(req, res, next) {
        try {
            return res.status(200).json({message: "Пользователь вышел из аккаунта."});
        } catch (error) {
            return res.status(400).json({message: error.message});
        }
    }

    async updatePassword(req, res) {
        try {
            const {email, password} = req.body;
            const user = await User.findOne({where: {email}});
            if (!user) {
                return res.status(404).json({message: 'Пользователь не найден'});
            }
            user.password = await bcrypt.hash(password, 5)
            await user.save();
            res.status(200).json(user);
        } catch (error) {
            console.error(error);
            res.status(500).json({message: 'Ошибка при изменении данных'});
        }
    }

    async updateName(req, res) {
        try {
            const {email, name, surname} = req.body;
            const user = await User.findOne({where: {email}});
            if (!user) {
                return res.status(404).json({message: 'Пользователь не найден'});
            }
            user.name = name;
            user.surname = surname;
            await user.save();
            res.status(200).json(user);
        } catch (error) {
            console.error(error);
            res.status(500).json({message: 'Ошибка при изменении данных'});
        }
    }

    async check(req, res, next) {
        const token = generateJwt(req.user.id, req.user.email, req.user.role)
        return res.json({token})
    }
}

module.exports = new UserController()