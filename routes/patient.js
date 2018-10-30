var express = require('express');
var patient = require('../app/controllers/patient.js');
var router = express.Router();

router.get('/', function(req, res, next) {
    res.send({status :200 , message : 'deafult routes for medilocks'});
});


router.post('/addPatient',patient.addPatient);
router.post('/getPatientById',patient.getPatientById);
router.get('/getAllPatient',patient.getAllPatient);
router.post('/addAppointment',patient.addAppointment);
router.post('/addVitalSign',patient.addVitalSign);
router.post('/complaints',patient.complaints);
router.post('/labOrder',patient.labOrder);
router.post('/treatmentPlan',patient.treatmentPlan);
router.post('/uploadBill',patient.uploadBill);
router.post('/uploadPrescription',patient.uploadPrescription);

router.post('/acceptPullEHRrequestByDoctor',patient.acceptPullEHRrequestByDoctor);
router.post('/viewAllDoctors',patient.viewAllDoctors);
router.post('/updatePatient',patient.updatePatient);
router.post('/getBloodGroup',patient.getBloodGroup);

router.post('/viewPullEHRrequestByPatient',patient.viewPullEHRrequestByPatient);
router.post('/deniedPullEHRrequestByDoctor',patient.deniedPullEHRrequestByDoctor);
router.post('/searchDoctorBySpeciality',patient.searchDoctorBySpeciality);
router.post('/getPatientVisit',patient.getPatientVisit);
router.post('/updatePatientProfile',patient.updatePatientProfile);
router.post('/uploadGeneralInfo',patient.uploadGeneralInfo);
router.post('/fetchGeneralInfo',patient.fetchGeneralInfo);
router.post('/fetchPatientVitialInfo',patient.fetchPatientVitialInfo);













module.exports = router;
