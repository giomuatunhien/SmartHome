const express   = require('express')
const controller    = require('../../Controllers/device/device.controller')

const router = express.Router()

// Device
router.post('/adddevice', controller.addDevice)
router.get('/getdevice', controller.getDevice)
router.delete('/deletedevice', controller.deleteDevice)
router.put('/updatedevice', controller.updateDevice)

module.exports = router;