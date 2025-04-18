const express   = require('express')
const controller= require('../../Controllers/system/system.controller')
const router    = express.Router()

router.post('/addsystem', controller.addSystem)
router.get('/getsystem', controller.getSystem)
router.delete('/deletesystem', controller.deleteSystem)
router.put('/updatesystem', controller.updateSystem)

module.exports = router;