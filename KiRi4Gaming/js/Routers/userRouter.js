const Router = require('express')
const router = new Router()
const userController = require('../Controllers/userController')
const authMiddleware = require('../middleware/authMiddleware')

router.post('/registration', userController.registration)
router.post('/login', userController.login)
router.post('/logout', userController.logout)
router.put('/updateName', userController.updateName)
router.put('/updateUserAvatar', userController.updateUserAvatar)
router.put('/updatePassword', userController.updatePassword)
router.get('/info', userController.info)
router.get('/getId', userController.getId)
router.get('/auth', authMiddleware, userController.check)

module.exports = router