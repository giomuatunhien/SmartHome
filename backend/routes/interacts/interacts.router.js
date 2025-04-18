const express   = require('express')
const controller= require('../../Controllers/interacts/interacts.controller')
const router    = express.Router()

router.post('/addinteracts', controller.addinteracts)
router.get('/getinteracts', controller.getinteracts)
router.delete('/deleteinteracts', controller.deleteinteracts)
router.put('/updateinteracts', controller.updateinteracts)

module.exports = router;