const express   = require('express')
const multer    = require('multer');
const path      = require('path');
const controller= require('../../Controllers/authenticationlog/authenticationlog.controller')

const router    = express.Router()

const storage   = multer.memoryStorage();
const upload    = multer({ storage: storage });

router.post('/addlog', upload.single('imageData'), controller.addLog)
router.get('/getlog' , controller.getLog)
router.delete('/deletelog', controller.deleteLog)
router.put('/updatelog',upload.single('imageData'), controller.updateLog)

module.exports = router;