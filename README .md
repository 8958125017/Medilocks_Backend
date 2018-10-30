Project name -Medilocks 
Technology used-
 Front end-Angular
 Backend - nodejs
 database-mongodb
 Others-Blockchain Technology

doctor module-


Backend api for doctor module->
1-signup of doctor-
  http://103.201.142.41:5005/doctor/doctorSendRequestToAdmin
    req - {
“firstName”:””,”lastName”:””,”mobileNo”:””,”email”:””,”practiceSpecialty”:””,”degree”:””,”city”:””,”hospital”:””,”userName”:””,”password”:””,”confirmPassword”:””,”Designation”:’’,”dob”:”,”from”:””,””:”to”
}
    res-{
    "status": 200,
    "message": "request is send successfully!"}
2-addPatient by doctor
  http://103.201.142.41:5005/doctor/doctorSendRequestToAdmin
   req-“firstName”:””,”lastName”:””,”mobileNo”:””,”email”:””,”address”:””,”gender”:””,”age”:””,”password”:””,”bloodgroup”:””,”city”:””,”dob”:””,”education”:’’,”confirmPassword”:”,”doctorId”:”5b922cb97016fc12595793ca”
}
res-
    res-{
    "status": 200,
    "message": "request is send successfully!"}
3-verifyDoctorSignup-
     http://103.201.142.41:5005/doctor/verifyDoctorSignupOTP
   req-{"OTP":""}
  res-{"status": 200,
    "message": "otp is verified successfully!"}
4-verifyPatientSignupOTP-
       http://103.201.142.41:5005/doctor/verifyPatientSignupOTP
       req-{"OTp":"","doctorId":""}
       res-{"status": 200,
    "message": "otp is verified successfully!"}
5-getAllPatient of doctor-
     http://103.201.142.41:5005/doctor/getAllPatient
     req-{
  "multichainAddress":""
  "stream":""
       }
  res-{
    "status": 200,
    "message": "Patients List",
    "data": [
        {
            "visitTime": "Tue Oct 16 2018 13:50:23 GMT+0530 (IST)",
            "data": {
                "_id": "5bc59f3af514f63000f45c8a",
                "firstName": "patient",
                "lastName": "singh",
                "age": "30",
                "bloodgroup": "B-",
                "dob": "2018-10-18",
                "city": "GURUGRAM",
                "email": "patient@yopmail.com",
                "mobileNo": "8448166243",
                "name": "patient singh",
                "address": "304-305B,Tower B, Spaze iTech Park, 122018, Sohna - Gurgaon\ngurgaon",
                "password": "$2a$10$QaenzN06z9/jnF9MTIE7BeJ7CGMq5/gMxHV7b/qxsLJGsYuFXVXbK",
                "signupOTP": "",
                "aadharNo": "776677554433",
                "image": "http://res.cloudinary.com/dki8mtnah/image/upload/v1539678008/nirybwkro6z5jkgfx5qz.jpg",
                "multichainAddress": "1MqerTt8WWbY6wVyXrsUiKYSyCZRMnXPFoHbiY",
                "__v": 0,
                "isBlock": false,
                "isApproved": true,
                "isDelete": false,
                "prescriptionRecords": [],
                "billRecords": [],
                "TreatmentplanRecords": [],
                "laborderBills": [],
                "laborderRecords": [],
                "complaintRecords": [],
                "pharmacyRecords": [],
                "pullEHRrequests": [],
                "ehr": [],
                "gender": "Male",
                "doctorId": "",
                "signupOTPtimeExpire": "2018-10-16T08:18:11.665Z",
                "createdAt": "2018-10-16T08:20:10.414Z"
            }
        },
        {
            "visitTime": "Tue Oct 16 2018 15:25:30 GMT+0530 (IST)",
            "data": {
                "_id": "5bc5b574af660f403a7a19fc",
                "firstName": "vivek",
                "lastName": "gupta",
                "age": "30",
                "bloodgroup": "B+",
                "dob": "2018-10-04",
                "city": "GURUGRAM",
                "email": "vivek@yopmail.com",
                "mobileNo": "8448166243",
                "name": "vivek gupta",
                "address": "304-305B,Tower B, Spaze iTech Park, 122018, Sohna - Gurgaon\ngurgaon",
                "password": "$2a$10$YNi7nuy3ZUj.Z6baW8mW5OMIlBpYEAYrD9O2WDBjaZDaVQukFZ7Ha",
                "signupOTP": "",
                "aadharNo": "776655434321",
                "image": "http://res.cloudinary.com/dki8mtnah/image/upload/v1539683698/yc5pivhwiowaoblbup9c.jpg",
                "multichainAddress": "12WCwWAPQysuPocKi7pkcuzrncvhZtGEdMjF2w",
                "__v": 0,
                "isBlock": false,
                "isApproved": true,
                "isDelete": false,
                "prescriptionRecords": [],
                "billRecords": [],
                "TreatmentplanRecords": [],
                "laborderBills": [],
                "laborderRecords": [],
                "complaintRecords": [],
                "pharmacyRecords": [],
                "pullEHRrequests": [],
                "ehr": [],
                "gender": "Male",
                "doctorId": "",
                "signupOTPtimeExpire": "2018-10-16T09:58:16.151Z",
                "createdAt": "2018-10-16T09:55:00.329Z"
            }
        },
        {
            "visitTime": 1539685545068,
            "data": {
                "_id": "5bc59f3af514f63000f45c8a",
                "firstName": "patient",
                "lastName": "singh",
                "age": "30",
                "bloodgroup": "B-",
                "dob": "2018-10-18",
                "city": "GURUGRAM",
                "email": "patient@yopmail.com",
                "mobileNo": "8448166243",
                "name": "patient singh",
                "address": "304-305B,Tower B, Spaze iTech Park, 122018, Sohna - Gurgaon\ngurgaon",
                "password": "$2a$10$QaenzN06z9/jnF9MTIE7BeJ7CGMq5/gMxHV7b/qxsLJGsYuFXVXbK",
                "signupOTP": "",
                "aadharNo": "776677554433",
                "image": "http://res.cloudinary.com/dki8mtnah/image/upload/v1539678008/nirybwkro6z5jkgfx5qz.jpg",
                "multichainAddress": "1MqerTt8WWbY6wVyXrsUiKYSyCZRMnXPFoHbiY",
                "__v": 0,
                "isBlock": false,
                "isApproved": true,
                "isDelete": false,
                "prescriptionRecords": [],
                "billRecords": [],
                "TreatmentplanRecords": [],
                "laborderBills": [],
                "laborderRecords": [],
                "complaintRecords": [],
                "pharmacyRecords": [],
                "pullEHRrequests": [],
                "ehr": [],
                "gender": "Male",
                "doctorId": "",
                "signupOTPtimeExpire": "2018-10-16T08:18:11.665Z",
                "createdAt": "2018-10-16T08:20:10.414Z"
            }
        },
        {
            "visitTime": "Tue Oct 16 2018 17:50:37 GMT+0530 (IST)",
            "data": {
                "_id": "5bc5d781648faa680056bf6a",
                "firstName": "pankaj",
                "lastName": "joshi",
                "age": "30",
                "bloodgroup": "A+",
                "dob": "2018-10-10",
                "city": "GURUGRAM",
                "email": "pankaj@yopmail.com",
                "mobileNo": "8448166243",
                "name": "pankaj joshi",
                "address": "304-305B,Tower B, Spaze iTech Park, 122018, Sohna - Gurgaon\ngurgaon",
                "password": "$2a$10$a6gWUqKKGOZKMFv1dul/OOxNm5ii8lGet9ybFkAVYTuUZGYQ/0vRS",
                "signupOTP": "",
                "aadharNo": "667766556677",
                "image": "http://res.cloudinary.com/dki8mtnah/image/upload/v1539692415/efsnq83vobbqn666dybt.png",
                "multichainAddress": "1AJDbshyS44pveBeSyzp7YCa7QGdRZRQKK5GYi",
                "__v": 0,
                "isBlock": false,
                "isApproved": true,
                "isDelete": false,
                "prescriptionRecords": [],
                "billRecords": [],
                "TreatmentplanRecords": [],
                "laborderBills": [],
                "laborderRecords": [],
                "complaintRecords": [],
                "pharmacyRecords": [],
                "pullEHRrequests": [],
                "ehr": [],
                "gender": "Male",
                "doctorId": "",
                "signupOTPtimeExpire": "2018-10-16T12:20:23.705Z",
                "createdAt": "2018-10-16T12:20:17.554Z"
            }
        },
        {
            "visitTime": "Tue Oct 16 2018 17:53:18 GMT+0530 (IST)",
            "data": {
                "_id": "5bc5d822648faa680056bf6c",
                "firstName": "lalit",
                "lastName": "singh",
                "age": "30",
                "bloodgroup": "A+",
                "dob": "2018-10-03",
                "city": "GURUGRAM",
                "email": "Lalit@yopmail.com",
                "mobileNo": "8448166243",
                "name": "lalit singh",
                "address": "304-305B,Tower B, Spaze iTech Park, 122018, Sohna - Gurgaon\ngurgaon",
                "password": "$2a$10$EYOcATrk0/3jQRVvABpSBeC8G32hTla38b3EyujF4mNEiAEGkTqUG",
                "signupOTP": "",
                "aadharNo": "554455445555",
                "image": "http://res.cloudinary.com/dki8mtnah/image/upload/v1539692577/iwdmldvfwmqjnpibpxx0.png",
                "multichainAddress": "14sXnVSPH675YHzmE6EQuid5zoxBidpeAFGdNX",
                "__v": 0,
                "isBlock": false,
                "isApproved": true,
                "isDelete": false,
                "prescriptionRecords": [],
                "billRecords": [],
                "TreatmentplanRecords": [],
                "laborderBills": [],
                "laborderRecords": [],
                "complaintRecords": [],
                "pharmacyRecords": [],
                "pullEHRrequests": [],
                "ehr": [],
                "gender": "Male",
                "doctorId": "",
                "signupOTPtimeExpire": "2018-10-16T12:20:23.705Z",
                "createdAt": "2018-10-16T12:22:58.780Z"
            }
        }
    ]
}


6-createPrescription for patient-
         http://103.201.142.41:5005/doctor/createPrescription

    req-{
"doctorId":"5bc59ec7f514f63000f45c89",
"aadharNo":"776677554433",
"diseas":"cancer",
"diagonosis":"Y-Test",
"prescription":"Medicene",
"mediceneName":"Comviflame",
"dose":"midnight",
"duration":"10:10",
"intake":"morning"
}

res-{
    "status": 200,
    "message": "your prescription is uploaded",
    "data": "bbae5f9960fb30ca8c00ef7abd483dd17abd47f0c8b2b4e022e8f7573ec03c7c"
}



7-uploadBillByDoctor for patient

         http://103.201.142.41:5005/doctor/uploadBillByDoctor
 req- {
"filename":"",
"doctorId":"",
"aadharno":"",
"prescription":""

    }
res-{
    "status": 200,
    "message": "your prescription is uploaded",
    "data": "bbae5f9960fb30ca8c00ef7abd483dd17abd47f0c8b2b4e022e8f7573ec03c7c"
}


8-sendPullEHRrequestByDoctor to patient
         http://103.201.142.41:5005/doctor/sendPullEHRrequestByDoctor
req-

{
"doctorId":"5bc59ec7f514f63000f45c89",
"aadharNo":"776677554433"
}

res-{
    "status": 200,
    "message": "otp is send,please verify"
}



9-verifyEhrByDoctor
           http://103.201.142.41:5005/doctor/verifyEhrByDoctor
req-

{
"OTP":"5bc59ec7f514f63000f45c89",
"aadharNo":"776677554433",
"multichainAddress":""
}
res-{
 "status": 200,
    "message": "your request verify successfully"
}


10-gettypedoctor-
 http://103.201.142.41:5005/doctor/gettypedoctor

{
    "status": 200,
    "data": [
        "Allergists",
        "Anesthesiologists",
        "Cardiologists",
        "Dermatologists",
        "Dentist",
        "ENT Specialist",
        "Family Physicians ",
        "Gastroenterologists",
        "Gynecologist",
        "Surgeon",
        "Neurologists",
        "Oncologists",
        "Nephrologists",
        "Medical Geneticists",
        "Pathologists"
    ]
}

11- http://103.201.142.41:5005/doctor/getDiagonosis

{
    "status": 200,
    "data": [
        "MRI",
        "X-Ray",
        "Blood-Test",
        "Uranine-Test",
        "Pregnancy"
    ]
}


12-http://103.201.142.41:5005/doctor/getDeseas
res-
{
    "status": 200,
    "data": [
        "Typhoid",
        "Joindish",
        "Aids",
        "Diabities",
        "Chinin-pox",
        "Food-posining",
        "Viral-Fever",
        "Thyroid"
    ]
}
13-http://103.201.142.41:5005/doctor/getDoctorCategory

{
    "status": 200,
    "data": [
        "Allergists",
        "Anesthesiologists",
        "Cardiologists",
        "Dermatologists",
        "Dentist",
        "ENT Specialist",
        "Family Physicians ",
        "Gastroenterologists",
        "Gynecologist",
        "Surgeon",
        "Neurologists",
        "Oncologists",
        "Nephrologists",
        "Medical Geneticists",
        "Pathologists"
    ],
    "message": "Doctor category fetch successfully!."
}




14-http://103.201.142.41:5005/doctor/getDoctorDegree

{
    "status": 200,
    "data": [
        "BAMS",
        "MBBS",
        "DENTIST"
    ],
    "message": "Doctor category fetch successfully!."
}


15-http://103.201.142.41:5005/doctor/updateDoctorprofile
 req-{
"doctorId":"",
"req.body":""
}


16-http://103.201.142.41:5005/doctor/weeklydata

req-{

}








Hospital module-



(1)http://103.201.142.41:5005/hospital/SendRequestToAdmin-

req-{
“name”:””
“contactNo”:””
“email”:””
“city”:””
“location”:””
“password”:””
“confirmPassword”:””

“Open”:””,
“image”:””
}


result-{
    "status": 200,
    "message": "request is send successfully!",
}

(2)-http://103.201.142.41:5005/hospital/addDoctor-
req-{
firstName:ravi
lastName:raj
gender:Male
mobileNo:8448166243
email:ravi@yopmail.com
practiceSpecialties:heartsurgeon
degree:bms
department:orthopaedic
city:gurgaon
hospital:max
userName:max
password:Ravi@123
confirmPassword:Ravi@123
image:
age:25
bloodgroup:A+
designation:developer
dob:08/03/1997
from:12
to:10
address:gair citu
hospitalId:5bc5c993b8c0d7571f33b3d1
aadharNo:665566556644
multichainaddress:1Sqwcj5oAXiHXDpo5wG6pvEfKG81nu6LuJLGBz
description:hello

}

res-{
    "status": 200,
    "message": "request is send successfully!",
}

(3)-http://103.201.142.41:5005/hospital/addPharmacy




