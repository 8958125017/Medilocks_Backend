var express = require('express');
var doctor = require('../app/controllers/doctorCtrl.js');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.send({status :200 , message : 'deafult routes for medilocks doctors'});
});


router.post('/addPatient',doctor.addPatient);
router.post('/getAllPatient',doctor.getAllPatient);
router.post('/doctorSendRequestToAdmin',doctor.doctorSendRequestToAdmin);
router.get('/getAllpendingdoctor',doctor.getAllpendingdoctor);
router.post('/createPrescription',doctor.createPrescription);
router.post('/uploadBillByDoctor'         ,doctor.uploadBillByDoctor);
router.post('/recordReviewofpatient'               ,doctor.recordReviewofpatient);
router.post('/sendPullEHRrequestByDoctor' ,doctor.sendPullEHRrequestByDoctor);
router.post('/getDoctorCategory',doctor.getDoctorCategory);
router.post('/deletePatientByDoctor',doctor.deletePatientByDoctor);
router.post('/verifyPatientByDoctor',doctor.verifyPatientByDoctor);
// router.post('/getPatient',doctor.getPatient);

router.post('/verifyEhrByDoctor',doctor.verifyEhrByDoctor);
router.post('/PermisssionDoctor',doctor.PermisssionDoctor);

router.post('/verifyPatientSignupOTP',doctor.verifyPatientSignupOTP);
router.post('/verifyDoctorSignupOTP',doctor.verifyDoctorSignupOTP);
router.post('/getProfile',doctor.getProfile);
router.post('/getAllpatientbydoctor',doctor.getAllpatientbydoctor);

router.post('/updateDoctorprofile',doctor.updateDoctorprofile);

router.post('/gettypedoctor',doctor.gettypedoctor);
router.post('/getDiagonosis',doctor.getDiagonosis);
router.post('/getDeseas',doctor.getDeseas);
router.post('/getDoctorDegree',doctor.getDoctorDegree);
router.post('/getDoctorDepartment',doctor.getDoctorDepartment);
router.post('/doctorDashboard',doctor.doctorDashboard);
router.post('/recentVisitData',doctor.recentVisitData);
router.post('/weeklydata',doctor.weeklydata);
router.post('/dashBoardData',doctor.dashBoardData);
router.post('/getPatientVisit',doctor.getPatientVisit);
router.post('/uploadPrescription',doctor.uploadPrescription);



































function checkDoctorExist(req, res, next){
  if(req.body.id){
    nex();
  }else{
    return res.send({status :400, message :"Please send doctor ID!."});
  }
}


module.exports = router;
