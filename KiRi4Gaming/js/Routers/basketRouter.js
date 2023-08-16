const Router = require('express')
const router = new Router()
const basketController = require('../controllers/basketController')

router.post('/addDevice', basketController.addDevice)
router.get('/getAll', basketController.getAll)
router.delete('/deleteDevice', basketController.deleteDevice)
router.delete('/deleteBasketDevice', basketController.deleteBasketDevice)

module.exports = router