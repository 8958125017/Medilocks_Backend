var express = require('express');
var pharmacy = require('../app/controllers/pharmacyCtrl.js');
var router = express.Router();
var hospital= require('../app/controllers/hospitalCtrl.js');

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.send({status :200 , message : 'deafult routes for medilocks doctors'});
});

router.post('/pharmacySendRequestToAdmin',pharmacy.pharmacySendRequestToAdmin);
router.post('/uploadBillBypharmacy',pharmacy.uploadBillBypharmacy);
router.get('/getAllpendingPharamacy',pharmacy.getAllpendingPharamacy);
router.get('/viewallPharmacy',pharmacy.viewallPharmacy);
router.post('/viewPharmacy',pharmacy.viewPharmacy);
router.post('/addressGenerate',pharmacy.addressGenerate);
router.post('/uploadReportsbypharmacy',pharmacy.uploadReportsbypharmacy);









module.exports = router;
