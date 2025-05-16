const express = require('express')
const controller = require('../../Controllers/facedata/facedata.controller')
const controller_help = require('../../Controllers/facedata/facedata_help_train')

const multer = require('multer');

const router = express.Router()
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post('/addfacedata/:userID', upload.array('imageData', 30), controller.addFacedata)
router.get('/getfacedata', controller.getFacedata)
// router.delete('/deletefacedata', controller.deleteFacedata)
// router.put('/updatefacedata', upload.array('imageData', 30), controller.updateFacedata)

router.get('/trainface', controller_help.trainFaceModel)
router.post('/recognize_face/:userId', controller_help.recognizeFace)

module.exports = router;