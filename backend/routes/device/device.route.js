const express = require('express');
const controller = require('../../Controllers/device/device.controller');
const router = express.Router();

router.post('/create', controller.create_device);

router.get('/getAll', controller.get_all_devices);

router.get('/getById/:id', controller.get_device_by_id);

router.put('/update/:id', controller.update_device);

router.delete('/delete/:id', controller.delete_device);

router.get('/search', controller.search_device);

router.post('/controlDevice', controller.controlDevice);

router.get('/getDeviceHistory', controller.getDeviceHistory);

module.exports = router;
