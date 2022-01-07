var express = require('express');
var router = express.Router();
let CardanoControllers = require('../controllers/CardanoControllers')
/* GET home page. */
router.get('/', CardanoControllers.PageSend);

module.exports = router;
