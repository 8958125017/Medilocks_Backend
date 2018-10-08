var express = require('express');
var admin = require('../app/controllers/adminCtrl.js');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.send({status :200 , message : 'deafult routes for medilocks admin'});
});

router.get('/getRequest',admin.getRequest);
router.post('/approvedRequest',admin.approvedRequest);
router.post('/blockRequest',admin.blockRequest);
router.post('/deleteEntity',admin.deleteEntity);
router.post('/login',admin.login);
router.post('/getDataByType',admin.getDataByType);
router.post('/login',admin.login);
router.post('/getdeleteRequest',admin.getdeleteRequest);


// router.get('/getAllpendingHospital',admin.getAllpendingHospital);
module.exports = router;
