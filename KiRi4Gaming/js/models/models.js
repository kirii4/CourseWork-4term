/*const {Schema, model} = require('mongoose')

const UserSchema = new Schema({
    name: { type: String },
    surname: { type: String },
    email: { type: String, unique: true },
    password: { type: String },
    role: { type: String, default: "USER" },
    img: { type: String },
    basket: { type: Schema.Types.ObjectId, ref: "Basket" },
    ratings: [{ type: Schema.Types.ObjectId, ref: "Rating" }]
});

const BasketSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    basketDevices: [{ type: Schema.Types.ObjectId, ref: 'BasketDevice' }]
});

const BasketDeviceSchema = new Schema({
    basket: { type: Schema.Types.ObjectId, ref: 'Basket' },
    device: { type: Schema.Types.ObjectId, ref: 'Device' }
});

const DeviceSchema = new Schema({
    name: { type: String, unique: true },
    price: { type: Number },
    rating: { type: Number, default: 0 },
    img: { type: String },
    type: { type: Schema.Types.ObjectId, ref: 'Type' },
    brand: { type: Schema.Types.ObjectId, ref: 'Brand' },
    ratings: [{ type: Schema.Types.ObjectId, ref: 'Rating' }],
    basketDevices: [{ type: Schema.Types.ObjectId, ref: 'BasketDevice' }],
    deviceInfo: { type: Schema.Types.ObjectId, ref: 'DeviceInfo' }
});

const TypeSchema = new Schema({
    name: { type: String, unique: true },
    devices: [{ type: Schema.Types.ObjectId, ref: 'Device' }],
    brands: [{ type: Schema.Types.ObjectId, ref: 'Brand' }]
});

const BrandSchema = new Schema({
    name: { type: String, unique: true },
    devices: [{ type: Schema.Types.ObjectId, ref: 'Device' }],
    types: [{ type: Schema.Types.ObjectId, ref: 'Type' }]
});

const RatingSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    device: { type: Schema.Types.ObjectId, ref: 'Device' },
    rate: { type: Number }
});

const DeviceInfoSchema = new Schema({
    title: { type: String },
    description: { type: String },
    device: { type: Schema.Types.ObjectId, ref: 'Device' }
});

const TypeBrandSchema = new Schema({
    type: { type: Schema.Types.ObjectId, ref: 'Type' },
    brand: { type: Schema.Types.ObjectId, ref: 'Brand' }
});

const User = model('User', UserSchema);
const Basket = model('Basket', BasketSchema);
const BasketDevice = model('BasketDevice', BasketDeviceSchema);
const Device = model('Device', DeviceSchema);
const Type = model('Type', TypeSchema);
const Brand = model('Brand', BrandSchema);
const Rating = model('Rating', RatingSchema);
const TypeBrand = model('TypeBrand', TypeBrandSchema);
const DeviceInfo = model('DeviceInfo', DeviceInfoSchema);

module.exports = {
    User,
    Basket,
    BasketDevice,
    Device,
    Type,
    Brand,
    Rating,
    TypeBrand,
    DeviceInfo
}*/

const sequelize = require('../db')
const {DataTypes} = require('sequelize')

const User = sequelize.define('user', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    email: {type: DataTypes.STRING, unique: true,},
    name: { type: DataTypes.STRING },
    surname: { type: DataTypes.STRING },
    password: {type: DataTypes.STRING},
    img: {type: DataTypes.STRING},
    role: {type: DataTypes.STRING, defaultValue: "USER"},
})

const Basket = sequelize.define('basket', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
})

const BasketDevice = sequelize.define('basket_device', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
})

const Device = sequelize.define('device', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING, unique: true, allowNull: false},
    price: {type: DataTypes.INTEGER, allowNull: false},
    rating: {type: DataTypes.INTEGER, defaultValue: 0},
    img: {type: DataTypes.STRING, allowNull: false},
})

const Type = sequelize.define('type', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING, unique: true, allowNull: false},
})

const Brand = sequelize.define('brand', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING, unique: true, allowNull: false},
})

const Rating = sequelize.define('rating', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    rate: {type: DataTypes.INTEGER, allowNull: false},
})

const DeviceInfo = sequelize.define('device_info', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    title: {type: DataTypes.STRING, allowNull: false},
    description: {type: DataTypes.STRING, allowNull: false},
})

const TypeBrand = sequelize.define('type_brand', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
})


const Order = sequelize.define('order', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    initial: {type: DataTypes.STRING},
    email: {type: DataTypes.STRING, unique: true},
    town: { type: DataTypes.STRING },
    region: { type: DataTypes.STRING },
    address: { type: DataTypes.STRING },
    phoneNumber: { type: DataTypes.STRING },
    postIndex: {type: DataTypes.STRING},
    delivery: {type: DataTypes.STRING},
    paymentMethod: {type: DataTypes.STRING},
    isDelivered: {type: DataTypes.BOOLEAN, defaultValue: false},
})

const OrderItem = sequelize.define('orderItem', {
    quantity: { type: DataTypes.INTEGER }
});

User.hasOne(Basket)
Basket.belongsTo(User)

User.hasMany(Rating)
Rating.belongsTo(User)

Basket.hasMany(BasketDevice)
BasketDevice.belongsTo(Basket)

Type.hasMany(Device)
Device.belongsTo(Type)

Brand.hasMany(Device)
Device.belongsTo(Brand)

Device.hasMany(Rating)
Rating.belongsTo(Device)

Device.hasMany(BasketDevice)
BasketDevice.belongsTo(Device)

Device.hasMany(DeviceInfo, {as: 'info'});
DeviceInfo.belongsTo(Device)

Type.belongsToMany(Brand, {through: TypeBrand })
Brand.belongsToMany(Type, {through: TypeBrand })

Order.hasMany(OrderItem);
OrderItem.belongsTo(Order);

Order.belongsToMany(Device, { through: OrderItem });
Device.belongsToMany(Order, { through: OrderItem });

OrderItem.belongsTo(Device);

module.exports = {
    User,
    Basket,
    BasketDevice,
    Device,
    Type,
    Brand,
    Rating,
    TypeBrand,
    DeviceInfo,
    Order,
    OrderItem
}
