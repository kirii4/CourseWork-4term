const Router = require('express')
const router = new Router()
const deviceController = require('../controllers/deviceController')

router.post('/create', deviceController.create)
router.get('/getAll', deviceController.getAll)
router.get('/:id', deviceController.getOne)
router.post('/update', deviceController.update)
router.post('/delete', deviceController.delete)
router.post('/showDevice', deviceController.showDevice)

module.exports = router