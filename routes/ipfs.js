var express = require('express');
var ipfs = require('../app/controllers/ipfsCtrl.js');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.send({status :200 , message : 'deafult routes for medilocks'});
});


router.post('/addLogs', ipfs.addLogs);
router.post('/getLogs',ipfs.getLogs);
router.post('/uploadBill',ipfs.uploadBill);
router.post('/getAllLogs',ipfs.getAllLogs);
router.post('/uploadpdf',ipfs.pdffile);
router.post('/uploadbilluser',ipfs.uploadbilluser);
router.post('/deletelog',ipfs.deletelog);
router.post('/uploadmultiuser',ipfs.uploadbillmultiuser);
router.post('/getLogsById',ipfs.getLogsById);
router.get('/getAllEmployers',ipfs.getAllEmployers);

router.post('/createAddress',ipfs.createAddress)
module.exports = router;
