var express = require('express');
var lab = require('../app/controllers/labctrl.js')
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.send({status :200 , message : 'deafult routes for medilocks doctors'});
});




router.post('/viewLab',lab.viewLab);
router.get('/viewallLab',lab.viewallLab);
router.post('/labSendRequestToAdmin',lab.labSendRequestToAdmin);
router.post('/uploadbills',lab.uploadbills);
router.post('/updateLab',lab.updateLab);
router.post('/addressGenerate',lab.addressGenerate);
router.post('/uploadreportsBylab',lab.uploadreportsBylab);
router.post('/updateLabProfile',lab.updateLabProfile);







module.exports = router;
