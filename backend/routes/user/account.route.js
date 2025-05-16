const express = require('express')
const controller = require('../../Controllers/user/account.controller')
const multer = require('multer');

const router = express.Router()
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post('/logout', controller.logout)
router.get('/verifyToken', controller.verifyToken)
router.get('/getUser/:userid', controller.getUser)
router.put('/updateUser/:userid', upload.single('imageData'), controller.updateUser)


module.exports = router;