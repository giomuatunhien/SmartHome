const express   = require('express')
const controller= require('../../Controllers/facedata/facedata.controller')
const multer    = require('multer');

const router    = express.Router()
const storage   = multer.memoryStorage();
const upload    = multer({ storage: storage });

router.post('/addfacedata', upload.array('imageData',30), controller.addFacedata)
router.get('/getfacedata',  controller.getFacedata)
router.delete('/deletefacedata',    controller.deleteFacedata)
router.put('/updatefacedata', upload.array('imageData',30), controller.updateFacedata)

module.exports = router;