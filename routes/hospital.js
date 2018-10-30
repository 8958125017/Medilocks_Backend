var express = require('express');
var hospital = require('../app/controllers/hospitalCtrl.js');
var router = express.Router();
var doctor = require('../app/controllers/doctorCtrl.js');
var pharmacy = require('../app/controllers/pharmacyCtrl.js');
var lab=require('../app/controllers/labctrl.js')



/* GET users listing. */
router.get('/', function(req, res, next) {
    res.send({status :200 , message : 'deafult routes for medilocks doctors'});
});
// router.post('/doctorSendRequestToAdmin',doctor.doctorSendRequestToAdmin)
// router.post('/pharmacySendRequestToAdmin',pharmacy.pharmacySendRequestToAdmin)
// router.post('/labSendRequestToAdmin',lab.labSendRequestToAdmin)
// router.post('/sendRequestToAdmin',hospital.sendRequestToAdmin);
router.post('/addDoctor',hospital.addDoctor);
router.post('/addPharmacy',hospital.addPharmacy);
router.post('/addLab',hospital.addLab);
router.post('/viewPharmacy',hospital.viewPharmacy);
router.post('/sendRequestToAdmin',hospital.sendRequestToAdmin);
router.post('/viewLab',hospital.viewLab);
router.post('/verifyEmailAddressforlab',hospital.verifyEmailAddressforlab);
router.post('/updateHospitalProfile',hospital.updateHospitalProfile);
router.post('/addPatientByHospital',hospital.addPatientByHospital);
router.post('/verifyByHospital',hospital.verifyByHospital);
router.post('/verifyPatientSignupOTP',hospital.verifyPatientSignupOTP);
router.post('/addPatient',hospital.addPatient);
router.get('/getDoctor',hospital.getDoctor);
router.get('/verifyDoctorSignupOTP',hospital.verifyDoctorSignupOTP);
router.get('/verifyPharmacySignupOTP',hospital.verifyPharmacySignupOTP);
router.get('/verifyLabSignupOTP',hospital.verifyLabSignupOTP);
router.get('/getPharmacy',hospital.getPharmacy);
router.get('/getLab',hospital.getLab);
router.post('/hospitalDashBoardData',hospital.hospitalDashBoardData);









































module.exports = router;
