var express = require('express');
var router = express.Router();
var CardanoControllers = require('../controllers/CardanoControllers.js')
/* GET users listing. */
router.get('/connect-nami', CardanoControllers.ConnectNami);
router.post('/save-nami', CardanoControllers.SaveNami);
router.post('/save_cost', CardanoControllers.SaveCost)
router.get('/get-name', CardanoControllers.GetNami)
router.get('/delete-all', CardanoControllers.RemoveAllSend);
router.post('/my-wallet', CardanoControllers.SaveMyInfo)
router.get('/my-data', CardanoControllers.GetMyData)
router.get('/page-sender', CardanoControllers.PageSend)
// router.get('/enable', CardanoControllers.Enable)
module.exports = router;
