const express = require('express')
const controller = require('../../Controllers/user/account.controller')
const router = express.Router()


router.post('/logout', controller.logout)
router.get('/verifyToken', controller.verifyToken)


module.exports = router;