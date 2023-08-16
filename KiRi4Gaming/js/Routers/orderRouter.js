const Router = require('express')
const router = new Router()
const orderController = require('../controllers/orderController')

router.post('/createOrder', orderController.createOrder)
router.post('/addDevice', orderController.addDevice)
router.get('/getAll', orderController.getAll)
router.get('/getOne', orderController.getOne)
router.get('/checkOrder', orderController.checkOrder)
router.post('/deleteOrder', orderController.deleteOrder)
router.post('/delivered', orderController.delivered)

module.exports = router