const express = require('express')
const controller = require('../../Controllers/notification/notification.controller')

const router = express.Router()

// Notification
//router.post('/addnotification', controller.addNotification)
router.get('/getNotificationById', controller.getNotificationById)
// router.delete('/deletenotification', controller.deleteNotification)
// router.put('/updatenotification', controller.updateNotification)

module.exports = router;