var ipfsModel = require('../models/ipfs.js');
var mongoose = require('mongoose');
var fs = require('fs');
const ipfsAPI = require('ipfs-api');
const express = require('express');
var bcrypt = require('bcrypt-nodejs');
const saltRounds = 10;
var base64Img = require('base64-img');
var Async = require('async/eachLimit');
const base64 = require('base64topdf');
var pdf = require('html-pdf');
var async = require("async");
var Doctor = require('../models/doctor.js');
var Patient = require('../models/patient.js');
var Hospital = require('../models/hospital.js');
var Address = require('../models/address.js');
var CONST = require('../../config/constants');
var Global = require('../../config/global.js');
var moment = require('moment');
var Ehr = require('../models/ehr.js');
const ipfs = ipfsAPI('ipfs.infura.io', '5001', {
    protocol: 'https'
});
var multichain = CONST.multichainConn;
const accountSid = 'AC2f4b78068bd31540787f9d3461dd0f0a'; //
const authToken = '5430c1c3514f0a7d222f04709d977ce4'; //08ac6601b9797b4d4d6f4688f4a84c05
const client = require('twilio')(accountSid, authToken);
var request = require('request');
var axios = require('axios');
var Visit = require('../models/visitcount.js');




var doctorSendRequestToAdmin = function(req, res) {
  console.log("hello");
    var firstName = req.body.firstName;
    var lastName = req.body.lastName;
    var name = firstName + " " + lastName;
    var gender = req.body.gender;
    var mobileNo = req.body.mobileNo;
    var doctoremail = req.body.email;
    var practiceSpecialties = req.body.practiceSpecialties;
    var degree = req.body.degree;
    var department = req.body.department;
    var city = req.body.city;
    var hospital = req.body.hospital;
    var userName = req.body.userName;
    var password = req.body.password;
    var confirmPassword = req.body.confirmPassword;
    var filePath = req.body.image;
    var age = req.body.age;
    var bloodgroup = req.body.bloodgroup;
    var designation = req.body.designation;
    var dob = req.body.dob;
    var from = req.body.from;
    var to = req.body.to;
    var address = req.body.address;
    var hospitalId = req.body.hospitalId;
    var aadharNo = req.body.aadharNo;
    var multichainAddress = '';
    var description = req.body.description;

    if (!name || !mobileNo || !doctoremail) {
        console.log("User Entered invalid parameter ");
        return res.json({
            "message": "Can't be empty!!!",
            status: 400
        });
    }
    if (password !== confirmPassword) {
        console.log("Password and confirmPassword doesn\'t match!");
        return res.json({
            "message": 'Password and confirmPassword doesn\'t match!',
            status: 400
        });
    }
    Doctor.findOne({
        aadharNo: aadharNo
    }, function(err, detail) {
        if (err) return res.send({
            status: 400,
            message: "error to find doctor"
        });
        if (detail) return res.send({
            status: 400,
            message: "doctor already exists"
        });
        if (!detail) {
            bcrypt.genSalt(saltRounds, function(err, salt) {
                bcrypt.hash(password, salt, null, function(err, hash) {
                    if (err) return res.send({
                        status: 400,
                        message: "error to get password hash"
                    });
                    else {
                      if(filePath){
                      Global.fileUpload(filePath,(data) => {
                        console.log("data",data);
                        var hash12 = hash;
                         var signupOTP=Math.floor(100000 + Math.random() * 900000);
                    Global.getNewAddressandpermissionOnMultichain((result)=>{
                            console.log('resultresult',result);
                        var obj = {
                            firstName: firstName,
                            lastName: lastName,
                            name: name,
                            mobileNo: mobileNo,
                            gender: gender,
                            practiceSpecialties: practiceSpecialties,
                            degree: degree,
                            department: department,
                            city: city,
                            bloodgroup: bloodgroup,
                            age: age,
                            hospitals: hospital,
                            image: data,
                            "avaliablity.from": from,
                            "avaliablity.to": to,
                            password: hash12,
                            email: doctoremail,
                            designation: designation,
                            department: department,
                            dob: dob,
                            address :address,
                            description : description,
                            hospitalId : hospitalId ? hospitalId : '',
                            aadharNo : aadharNo,
                            signupOTP : signupOTP,
                            multichainAddress : result
                        }
                        console.log("doctors record" + JSON.stringify(obj));
                        Doctor.create(obj, function(err, result) {
                            if (err) return res.send({
                                status: 400,
                                message: "failed to send request to admin!",
                                error: err
                            });
                            else {

                                var mobileNo = "+91"+result.mobileNo;
                                 client.messages.create({
                                        body: 'Your otp to verify:'+signupOTP ,
                                        from: '+14053584187',
                                        to: mobileNo
                                    }, function(error, send) {
                                      console.log('Send::',send);
                                        if (err) return res.send({
                                            status: 400,
                                            message: "failed to send otp!",
                                            error: error
                                        });
                                        else {
                                            return res.send({
                                                status: 200,
                                                message: "Please Verify your OTP!.",
                                                data: result
                                            });
                                        }
                                    });
                            }
                        });
                      });
                    })
                  }
                    else{
                      console.log("not image path");
                      var hash12 = hash;
                       var signupOTP=Math.floor(100000 + Math.random() * 900000);
                  Global.getNewAddressandpermissionOnMultichain((result)=>{
                      var obj = {
                          firstName: firstName,
                          lastName: lastName,
                          name: name,
                          mobileNo: mobileNo,
                          gender: gender,
                          practiceSpecialties: practiceSpecialties,
                          degree: degree,
                          department: department,
                          city: city,
                          bloodgroup: bloodgroup,
                          age: age,
                          hospitals: hospital,
                          image: filePath,
                          "avaliablity.from": from,
                          "avaliablity.to": to,
                          password: hash12,
                          email: doctoremail,
                          designation: designation,
                          department: department,
                          dob: dob,
                          address :address,
                          description : description,
                          hospitalId : hospitalId ? hospitalId : '',
                          aadharNo : aadharNo,
                          signupOTP : signupOTP,
                          multichainAddress : result
                      }
                      console.log("doctors record" + JSON.stringify(obj));
                      Doctor.create(obj, function(err, result) {
                          if (err) return res.send({
                              status: 400,
                              message: "failed to send request to admin!",
                              error: err
                          });
                          else {
                               var mobileNo = "+91"+result.mobileNo;
                               client.messages.create({
                                      body: 'Your otp to verify:'+signupOTP ,
                                      from: '+14053584187',
                                      to: mobileNo
                                  }, function(error, send) {
                                    console.log('Send::',send);
                                      if (err) return res.send({
                                          status: 400,
                                          message: "failed to send otp!",
                                          error: error
                                      });
                                      else {
                                          return res.send({
                                              status: 200,
                                              message: "Please Verify your OTP!.",
                                              data: result
                                          });
                                      }
                                  });
                          }
                      });
                    });
                    }
                }
            })
        })
    }
})
}

var addPatient = function(req, res) {
    var firstName = req.body.firstName;
    var lastName = req.body.lastName;
    var name = firstName + ' ' + lastName;
    var mobileNo = req.body.mobileNo;
    var email = req.body.email;
    var address = req.body.address;
    var gender = req.body.gender;
    var age = req.body.age;
    var password = req.body.password;
    var bloodgroup = req.body.bloodgroup;
    var city = req.body.city;
    var dob = req.body.dob;
    var education = req.body.education;
    var confirmPassword = req.body.confirmPassword;
    var aadharNo = req.body.aadharNo;
    var  filePath = req.body.image;
    var doctorId = req.body.doctorId;
    var multichainAddress  = '';
    if (!aadharNo ||!name || !mobileNo || !email || !address || !gender || !age || !password || !confirmPassword) {
        return res.send({
            status: 400,
            message: "invalid parameter!"
        });
    }
    if (password !== confirmPassword) {
        return res.json({
            "message": 'Password and confirmPassword doesn\'t match!',
            status: 400
        });
    }
    Patient.findOne({
        aadharNo: aadharNo
    }, function(err, detail) {
        if (err) return res.send({
            status: 400,
            message: "error to find doctor"
        });
        if (detail) return res.send({
            status: 400,
            message: "Patient already exists"
        });

        if (!detail) {
            bcrypt.genSalt(saltRounds, function(err, salt) {
                bcrypt.hash(password, salt, null, function(err, hash) {
                    if (err) return res.send({
                        status: 400,
                        message: "error to get password hash"
                    });
                    else {
                        if(filePath){
                      Global.fileUpload(filePath,(data) => {
                        console.log("image",data);
                        var signupOTP=Math.floor(100000 + Math.random() * 900000);
                        var hash12 = hash;
                        Global.getNewAddressandpermissionOnMultichain((result)=>{
                            console.log('Generated Address::',result);
                          if(result){
                          var obj = {
                            firstName: firstName,
                            lastName: lastName,
                            age: age,
                            education: education,
                            bloodgroup: bloodgroup,
                            dob: dob,
                            city: city,
                            email: email,
                            mobileNo: mobileNo,
                            name: name,
                            address: address,
                            gender: gender,
                            isApproved: false,
                            password: hash12,
                            signupOTP :signupOTP ,
                            doctorId : doctorId ? doctorId : '',
                            aadharNo : aadharNo,
                            image:data,
                            multichainAddress : result
                        }
                        Patient.create(obj, function(err, data) {
                            if (err) return res.send({
                                status: 400,
                                message: "failed to create Pateint Record!",
                                error: err
                            });
                            mobileNo='+91'+mobileNo;
                            console.log('data:::',data);
                            client.messages.create({
                                body: 'Your otp to verify:'+signupOTP ,
                                from: '+14053584187',
                                to: mobileNo
                            }, function(error, send) {
                                if (err) return res.send({
                                    status: 400,
                                    message: "failed to send otp!",
                                    error: error
                                });
                                else {
                                  Patient.updateOne({aadharNo: aadharNo},{$set:{'isApproved':true}})
                                    return res.send({
                                        status: 200,
                                        message: "Please Verify your OTP!.",
                                        data: data
                                    });
                                }
                            });
                        });
                    }
                        });

                    })
                }
                else{
                  var hash12 = hash;
                   var signupOTP=Math.floor(100000 + Math.random() * 900000);
              Global.getNewAddressandpermissionOnMultichain((result)=>{
                      console.log('resultresult',result);
                      var obj = {
                        firstName: firstName,
                        lastName: lastName,
                        age: age,
                        education: education,
                        bloodgroup: bloodgroup,
                        dob: dob,
                        city: city,
                        email: email,
                        mobileNo: mobileNo,
                        name: name,
                        address: address,
                        gender: gender,
                        isApproved: false,
                        password: hash12,
                        signupOTP :signupOTP ,
                        doctorId : doctorId ? doctorId : '',
                        aadharNo : aadharNo,
                        multichainAddress : result,
                        image: filePath,

                    }
                  console.log("doctors record" + JSON.stringify(obj));
                  Patient.create(obj, function(err, result) {
                      if (err) return res.send({
                          status: 400,
                          message: "failed to send request to admin!",
                          error: err
                      });
                      else {
                           var mobileNo = "+91"+result.mobileNo;
                           client.messages.create({
                                  body: 'Your otp to verify:'+signupOTP ,
                                  from: '+14053584187',
                                  to: mobileNo
                              }, function(error, send) {
                                console.log('Send::',send);
                                  if (err) return res.send({
                                      status: 400,
                                      message: "failed to send otp!",
                                      error: error
                                  });
                                else {
                                      Patient.updateOne({aadharNo: aadharNo},{$set:{'isApproved':true}})
                                        return res.send({
                                            status: 200,
                                            message: "Please Verify your OTP!.",
                                            data: send
                                        });
                                    }
                              });
                      }
                  });
                });
                }
            }
    });
  })
}
})
}



var verifyDoctorSignupOTP = (req, res) => {
    let hospitalId = req.body.hospitalId;

    if (!req.body.OTP) {
        return res.send({
            status:400,
            message: "Enter User OTP",
            err: err
        });
    }
    else if (req.body.OTP) {
        Doctor.findOneAndUpdate({ signupOTP: req.body.OTP }, { $set: { isApproved: true,signupOTP : "" } },{new :true}, (err, updateUser) => {
          console.log("updateduser",updateUser);
            if(err){
                res.send({
                    message: "Error occured",
                    err:err,
                    status :400
                });
            }
            if (updateUser) {
                if(hospitalId){
                    let hospital  = Doctor.findOne({_id : updateUser._id},function(err,found){
                        if(err) console.log('error',err);
                        if(found){
                          console.log("found",found.multichainAddress);
                            var x = JSON.stringify(updateUser);
                            var datax = new Buffer(x).toString('hex');
                            let publishData = {address : found.multichainAddress,streamName : "Doctor",key : updateUser.aadharNo,data : datax};
                            Global.publishDataOnMultichain(publishData,(result)=>{
                               if(result) return res.send({
                                message: "OTP verified successfully!.",
                                status : 200
                                });
                            });

                        }
                    });

                }else{
                    var x = JSON.stringify(updateUser);
                    var datax = new Buffer(x).toString('hex');
                    let publishData = {address : updateUser.multichainAddress,streamName : "Doctor",key : updateUser.aadharNo,data : datax};
                    Global.publishDataOnMultichain(publishData,(result)=>{
                       if(result) return res.send({
                                message: "OTP verified successfully!.",
                                status : 200
                            });
                    });

                }
            }
            if (!updateUser) {
                return res.send({
                    message: "OTP not matched!.",
                    status:400
                });
            }
        })
    }
}

var verifyPatientSignupOTP = (req, res) => {
    let doctorId = req.body.doctorId;

    if (!req.body.OTP) {
        return res.send({
            status:400,
            message: "Enter User OTP"
        });
    }
    else if (req.body.OTP) {
        Patient.findOneAndUpdate({ signupOTP: req.body.OTP }, { $set: { isApproved: true,signupOTP : "" } },{new :true}, (err, updateUser) => {
            // console.log('....', updateUser)
            if(err){
                res.send({
                    message: "Error occured",
                    err:err,
                    status :400
                });
            }
            if (updateUser) {
                if(doctorId){
                    let doctor  = Doctor.findOne({_id : doctorId},function(err,found){
                        if(err) console.log('errpr',err);
                        if(found){
                          var obj = {
                            visitTime:Date(),
                            data:updateUser
                          }
                          var x = JSON.stringify(obj);
                          var datax = new Buffer(x).toString('hex');
                            let publishData = {address : found.multichainAddress,streamName : "Patient",key : updateUser.aadharNo,data : datax};
                            Global.publishDataOnMultichain(publishData,(result)=>{
                                      if(result) return res.send({
                                    message: "OTP verified successfully!.",
                                    status : 200
                                });
                            });

                        }
                    });

                }else{
                  var x = JSON.stringify(updateUser);
                  var datax = new Buffer(x).toString('hex');
                    let publishData = {address : updateUser.multichainAddress,streamName : "Patient",key : updateUser.aadharNo,data : datax};
                    Global.publishDataOnMultichain(publishData,(result)=>{
                        if(result) return res.send({
                            message: "OTP verified successfully!.",
                            status : 200
                        });
                    });

                }
            }
            if (!updateUser) {
                return res.send({
                    message: "OTP not matched!.",
                    status:400
                });
            }
        })
    }
}


var verifyPatientByDoctor = function(req, res) {
    var OTP = req.body.otp;
    let doctorId = req.body.doctorId;
    Doctor.find({
        _id: doctorId
    }, function(err, data) {
        if (err) return res.send({
            status: 400,
            message: "error to get user"
        });
        else if (data) {
            let currPatient = data[0].patient;
            let counter = 0;
            async.forEachLimit(currPatient, 1, (element, next) => {
                counter++;
                if (counter < currPatient.length) {
                    console.log('data', counter, currPatient.length);
                    if (currPatient[counter - 1].OTP === OTP) {
                        console.log('match', currPatient[counter - 1].OTP, currPatient[counter - 1]);
                        Doctor.updateOne({
                            "patient.OTP": OTP
                        }, {
                            $set: {
                                "patient.$.status": true
                            }
                        }, function(err, updatedata) {
                            if (err) return res.send({
                                status: 400,
                                message: "error to get user",
                                err: err
                            });
                            return res.send({
                                status: 200,
                                message: "Verify successfully!."
                            });
                        });
                    } else {
                        console.log('next data', counter, currPatient.length, currPatient[counter - 1]);
                        next();
                    }
                } else {
                    return res.send({
                        status: 400,
                        message: "Not Verify!."
                    });
                }
            });

        }
    })
}

var getAllPatient = function(req, res) {
   var multichainAddress = req.body.multichainAddress;
   var stream = req.body.stream;
   var data ={
    address : multichainAddress,
    stream : stream
   }
   Global.listStreamPublisherItems(data,(result)=>{
     console.log("result",result);
      if(result){
        return res.send({status : 200, message : "Patients List",data : result});
}else{
      return res.send({status : 200, message : "no data ",data : result});
}
   });
}



var doctorDashboard = function(req, res) {
   var multichainAddress = req.body.multichainAddress;
   var stream = req.body.stream;
   var data ={
    address : multichainAddress,
    stream : stream
   }
   Global.listStreamPublisherItems(data,(result)=>{
     if(result){
       let c = 0;
       var responseData = [];
       async.forEachLimit(result, 1, (element, next) => {
           c++;
           if(c < result.length){
           if(element)
              {
                var currdate =  element.visitTime;
                console.log("element",currdate);
                var myDate = new Date(currdate);
                var date =  moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');
                console.log("date",date);
                var lastweek = moment(Date.now()- 7 * 24 * 3600 * 1000).format('YYYY-MM-DD HH:mm:ss');
                console.log("date",lastweek);

                if (moment(currdate).isBetween(lastweek, date)) {
                  var obj = {
                    oneweekdata:element
                  }
                  console.log("obj",obj);
                  responseData.push(obj);
                  console.log("isb/w");
                } else {
                  console.log('is not between')
                }
             //
             //    var lastmonth = moment(Date.now()- 31 * 24 * 3600 * 1000).format('YYYY-MM-DD HH:mm:ss');
             //    if (moment(Currdate).isBetween(lastmonth, date)) {
             //      var obj = {
             //        lastmonthdata:element
             //      }
             //      console.log("---------msmmsms",obj.lastmonthdata.length  );
             //
             //      responseData.push(obj);
             //      console.log("isb/w");
             //    } else {
             //      console.log('is not between')
             //    }
             //    var lastyear = moment(Date.now()- 7 * 24 * 3600 * 1000).format('YYYY-MM-DD HH:mm:ss');
             //    console.log("year---------",lastyear);
             //    if (moment(Currdate).isBetween(lastyear, date)) {
             //      var obj = {
             //        lastyeardata:element
             //      }
             //      console.log("obj",obj);
             //
             //      responseData.push(obj);
             //      console.log("isb/w");
             //    } else {
             //      console.log('is not between')
             //    }
             //
             //    console.log("data",responseData);
             // }
             next();
           }else{
             if(element)
             {
               console.log("result----------------",element.visitTime);
               var currdate =  new Date(element.visitTime);
              // var Currdate =  currdate.toISOString().substring(0, 10)
               var date = moment(Date.now()).format('YYYY-MM-DD HH:mm:s');
               var lastweek = moment(Date.now() - 7 * 24 * 3600 * 1000).format('YYYY-MM-DD HH:mm:ss');
               if (moment(currdate).isBetween(lastweek, date)) {
                 console.log("data",element);
                 var obj = {
                   oneweekdata:element
                 }
                 console.log("obj",obj.length);

                 console.log("object-----------",obj);
                 responseData.push(obj);
                 console.log("isb/w");
               } else {
                 console.log('is not between')
               }
             //   var lastmonth = moment(Date.now()- 31 * 24 * 3600 * 1000).format('YYYY-MM-DD HH:mm:ss');
             //   console.log("last month date",lastmonth);
             //   if (moment(Currdate).isBetween(lastmonth, date)) {
             //     var obj = {
             //       lastmonthdata:element
             //     }
             //     console.log("---------msmmsms",obj.lastmonthdata);
             //
             //     responseData.push(obj);
             //     console.log("isb/w");
             //   } else {
             //     console.log('is not between')
             //   }
             //   var lastyear = moment(Date.now()- 365 * 24 * 3600 * 1000).format('YYYY-MM-DD HH:mm:ss');
             //   console.log("year---------",lastyear);
             //   if (moment(Currdate).isBetween(lastyear, date)) {
             //     var obj = {
             //       lastyeardata:element
             //     }
             //     console.log("obj",obj.las);
             //
             //     responseData.push(obj);
             //     console.log("isb/w");
             //   } else {
             //     console.log('is not between')
             //   }
             //  var obj = {
             //    TotalPatient : result.length
             //   }
             //   console.log("obj",obj);
             //
             //   responseData.push(obj);
             // }
             return res.json({message:"your data",status:200,data:responseData})
           }
         }
   }
})
}
})
}


var getAllpendingdoctor = function(req, res) {
    Doctor.find({
        isBlock: false,
        isDelete: false
    }, function(err, data) {
        if (err) return res.status(400).send({
            message: "error to get user"
        });
        return res.send({
            status: 200,
            message: "pending doctor records get successfully",
            data: data
        });
    });
}




var uploadPrescription = (req, res) => {
    var patient = req.body.patient;
    var doctor = req.body.doctor;
    var doctorId = req.body.doctorId;
    var patientadharno = req.body.aadharNo;
    var diseas = req.body.diseas;
    var diagonosis = req.body.diagonosis;
    var prescription = req.body.prescription;
    var data = req.body.data;
    var type = "Prescription";

    var HTMLdata = {
        patient : patient,
        doctor : doctor,
        prescription: prescription,
        diagonosis : diagonosis,
        data : data,
        date: new Date()
    };
    console.log("htmldata",HTMLdata);
    var html = CONST.createPrescription(HTMLdata);
    var options = {
        format: 'Letter'
    };
    let filepath = './patient_' + doctorId + '.pdf';
    pdf.create(html, options).toFile(filepath, function(err, response) {
        if (err) return res.send({
            status: 400,
            message: "failed to Prescription!.",
            error: err
        });
        let testFile = fs.readFileSync(filepath);
        let testBuffer = new Buffer(testFile);
        Doctor.findById({
            _id: doctorId
        }, function(err, data) {
            if (err) {
                return res.send({
                    status: 400,
                    message: "address is unable to save"
                });
            } else {

     ipfs.files.add(testBuffer, function(err, file) {
                    var dataToadd = {
                        hash: file[0].hash,
                        uploadedby: data.multichainAddress,
                        stream : 'Doctor',
                        key : data.aadharNo,
                        description:prescription,
                        type:type,
                        date:Date.now()
                    }
                    var x = JSON.stringify(dataToadd);
                    var datax = new Buffer(x).toString("hex")
                    var streamName = "visit";
                    if (err) return res.send({
                        status: 400,
                        message: "failed to add log!",
                        data: file,
                        error: err
                    });
                    var obj  = {
                      address:data.multichainAddress,
                      streamName:streamName,
                      key:patientadharno,
                      data:datax
                        }
                    Global.publishDataOnMultichain(obj, (result, err) => {
                      console.log("results",result,err)
                        if (result) {
                            return res.send({
                                status: 200,
                                message: "your prescription is uploaded",
                                data: result
                            })
                        }
                    });
                })
            }
        })
    })
}



var createPrescription = (req, res) => {
    var patient = req.body.patient;
    var doctor = req.body.doctor;
    var doctorId = req.body.doctorId;
    var patientadharno = req.body.aadharNo;
    var diseas = req.body.diseas;
    var diagonosis = req.body.diagonosis;
    var prescription = req.body.prescription;
    var data = req.body.data;
    var type = "Prescription";
    console.log("data------------------------",patient.data._id)  ;
    var HTMLdata = {
        patient : patient,
        doctor : doctor,
        prescription: prescription,
        diagonosis : diagonosis,
        data : data,
        date: new Date()
    };
    //var html = CONST.createPrescription(HTMLdata);
    // var options = {
    //     format: 'Letter'
    // };
        Doctor.findById({
            _id: doctorId
        }, function(err, Data) {
            if (err) {
                return res.send({
                    status: 400,
                    message: "address is unable to save"
                });
            } else {
                    var dataToadd = {
                      patient : patient.data._id  ,
                      doctor : Data,
                      prescription: prescription,
                      diagonosis : diagonosis,
                      data : data,
                      date: new Date(),
                        uploadedby: Data.multichainAddress,
                        stream : 'Doctor',
                        //key : data.aadharNo,
                        type:type,
                        date:Date.now()
                    }
                    console.log("data----------------",)
                    var todaytimestamp=new Date(moment(Date.now()).format('YYYY-MM-DD')).getTime();
                    console.log('TimeStamp:',todaytimestamp);
                    var visitobj={
                      doctorId:doctorId,
                      hospitalId:data.hospitalId?data.hospitalId:null,
                      date:todaytimestamp,
                      vc:1
                    }
                    Visit.findOneAndUpdate({doctorId:doctorId,date:todaytimestamp},{$inc:{vc:1}},function(err,result0){
                      if(err) { return res.send({status:400,message: "your prescription is uploaded"})}
                        if(result0==null){
                          Visit.create(visitobj,function(err,result1){
                            if(err) if(err) { return res.send({status:400,message: "your prescription is uploaded"})}
                            console.log(result1);
                        })
                      }
                      console.log('Result',result0);
                    })

                    var x = JSON.stringify(dataToadd);
                    var datax = new Buffer(x).toString("hex")
                    var streamName = "visit";
                    var obj  = {
                      address:Data.multichainAddress,
                      streamName:streamName,
                      key:patientadharno,
                      data:datax
                        }
                        console.log("obj",obj);
                    Global.publishDataOnMultichain(obj, (result, err) => {
                      console.log("results",result,err)
                        if (result) {
                            return res.send({
                                status: 200,
                                message: "your prescription is uploaded",
                                data: result
                            })
                        }
                    });
            }
        })
}



var uploadBillByDoctor = (req, res) => {
  var filename = req.body.filename;
  var doctorId = req.body.doctorId;
  var patientadharno = req.body.aadharno;
  var prescription = req.body.prescription;
    var type = "bill";

    if (filename.split(',')[0] != 'data:application/pdf;base64') {
        var filepath = base64Img.imgSync(filename, './bill_images/' + doctorId);
    } else {
        var currTime = Date.now();
        let decodedBase64 = base64.base64Decode(filename, 'test' + currTime);
        var filepath = 'test' + currTime
    }
    let testFile = fs.readFileSync(filepath);
    let testBuffer = new Buffer(testFile);
    fs.unlinkSync(filepath);

    console.log("docid" + doctorId);
    Doctor.findById({
        _id: doctorId
    }, function(err, data) {
        console.log("data---------------------------" + data);
        if (err) {
            return res.send({
                status: 400,
                message: "address is unable to get"
            });
        } else {
            ipfs.files.add(testBuffer, function(err, file) {
                if (err) return res.send({
                    status: 400,
                    message: "failed to add log!",
                    error: err
                });
                var dataToadd = {
                    hash: file[0].hash,
                    uploadedby: data.multichainAddress,
                    prescription:prescription,
                    type:type,
                    date: Date.now()

                }
                console.log("sss" + dataToadd);
                var x = JSON.stringify(dataToadd);
                var datax = new Buffer(x).toString("hex")
                var streamName = "Doctor";
                var obj  = {
                  address:data.multichainAddress,
                  streamName:streamName,
                  patientadharno:patientadharno,
                  datax:datax
                    }
                    console.log("address",obj);
                Global.publishDataOnMultichain(obj, (result, error) => {
                    if (result) {
                        return res.send({
                            status: 200,
                            message: "your bill is uploaded",
                            data: result
                        })
                    }
                });
            })
        }
    })
}
var recordReviewofpatient = function(req, res) {
    var streamName = req.body.streamName;
    var patientmobileno = req.body.patientmobileno;
    multichain.listStreamItems({
        stream: streamName,
        key: patientmobileno,
        count: 25
    }, (err, result) => {
        if (err) {
            return res.json({
                message: "patient information updated successfully" + err,
                status: 400
            })
        } else {
            var counter = 0;
            var data = [];
            var responseData = [];
            Async.forEachLimit(result, 1, (element, next) => {
                // counter++;
                data.push(JSON.parse(Buffer.from(element.data, 'hex').toString('utf8')));
                console.log('counter===result.length', counter, result.length);
                if (counter === (result.length - 1)) {
                    axios.get('https://ipfs.io/ipfs/' + data[counter - 1].hash).then((response) => {
                        responseData.push(response.data);
                        return res.json({
                            status: 200,
                            message: "review data is!.",
                            data: responseData,
                            total: responseData.length
                        });
                    }).catch(error => {
                        console.log('error to fetch', error);
                    })
                } else {
                    counter++;
                    console.log("counter" + counter);
                    console.log('element.hash', data[counter - 1]);
                    axios.get('https://ipfs.io/ipfs/' + data[counter - 1].hash).then((response) => {
                        responseData.push(response.data);
                        next();
                    }).catch(error => {
                        console.log('error to fetch', error);
                    })

                }
            })
        }
    })
}

function updateDoctor(doctorId,patientId,mobileNo,req,res){
    var createNewOTP = Math.floor(100000 + Math.random() * 900000);
    var data = {
        patientId: patientId,
        status: false,
        mobileNo: mobileNo,
        OTP: createNewOTP
    }

    Doctor.findOne({_id: doctorId}, {}, (err, found) => {
        if (err) return res.send({status: 400,message: "error in send request"});
        if (!found) res.send({status: 400,message: 'Doctor does not exist!.'});
        if (found) {
          if(found.patient.length > 0){

            var status = found.patient.findIndex((item)=>{
              return item.mobileNo === mobileNo;
            });

            console.log('status',status);
              if(status!==-1){
                var condition = {_id: doctorId,"patient.mobileNo" : mobileNo};
                Doctor.updateOne(condition,{$set : {'patient.$.OTP' : createNewOTP}},function(err, data){
                  if (err) return res.send({status: 400,message: "failed to update OTP!."});
                  return res.send({status: 200,message: "OTP has been sent!!."});
                });
              }
              else{
                Doctor.updateOne({_id: doctorId}, {$push: {'patient': data}}, function(err, data) {
                    if (err) return res.send({status: 400,message: "failed to assign prescription!."});
                    return res.send({status: 200,message: "New OTP has been sent!!."});
                });
              }

          }else{
              // entering into first time
            Doctor.updateOne({_id: doctorId}, {$push: {'patient': data}}, function(err, data) {
              if (err) return res.send({status: 400,message: "failed to assign prescription!."});
                return res.send({status: 200,message: "Pull EHR request has been sent successfully!!."});
            });
          }
      }
  });
}


var sendPullEHRrequestByDoctor = (req, res) => {
    var doctorId = req.body.doctorId;
    let aadharNo = req.body.aadharNo;
    var createNewOTP = Math.floor(100000 + Math.random() * 900000);
    Patient.findOne({
        aadharNo: aadharNo
    }, {}, (err, found) => {
        if (err) return res.send({
            status: 400,
            message: "error in send request"
        });
        if (!found) res.send({
            status: 400,
            message: 'Aadhar Number does not exist!.'
        });
        if (found) {
          console.log("found",found._id);
          var obj = {
              doctorId: doctorId,
              status: false,
              aadharNo: aadharNo,
              OTP: createNewOTP,
              time: Date(),
              patientId:found._id
          }
          Ehr.findOneAndUpdate({patientId:found._id},{$set : {'OTP' : createNewOTP}}, function(err, data){
            console.log("data",data,err);
                        if (err) return res.send({status: 400,message: "failed to update OTP!."});
                        if(data){  client.messages.create({
                           body: 'Your otp to verify:'+createNewOTP ,
                           from: '+14053584187',
                           to: "+91"+found.mobileNo
                       }, function(error, data1) {
                           if (error) return res.send({
                               status: 400,
                               message: "failed to send otp!",
                               error: error
                           });
                       if(data1)
                       return res.send({
                           status: 200,
                           message: "otp is send,please verify"
                       });
                       });
                     }
                     if(data==null){
                       console.log("obj------",obj);
                       Ehr.create(obj,function(error,result){
                         if(error)
                           return res.json({
                             msg:"failed to create OTP",
                             status: 400
                           })
                      client.messages.create({
                              body: 'Your otp to verify:'+createNewOTP ,
                              from: '+14053584187',
                              to: "+91"+found.mobileNo
                          },function(error, data1) {
                            console.log("dataaa--------------",error,data1);
                              if (error) return res.send({
                                  status: 400,
                                  message: "failed to send otp!",
                                  error: error
                              });
                          if(data1)
                          return res.send({
                              status: 200,
                              message: "otp is send,please verify"
                          });
                          });
                        })
                         }
                       })
                     }
                   })
                 }


    //       console.log("found------------",found);
    //       if(found.pullEHRrequests.length > 0){
    //         var status = found.pullEHRrequests.findIndex((item)=>{
    //           return item.doctorId.equals(doctorId);
    //         });
    //           if(status!==-1){
    //             var condition = {aadharNo: aadharNo,"pullEHRrequests.doctorId" : doctorId};
    //               Patient.findOneAndUpdate(condition,{$set : {'pullEHRrequests.$.OTP' : createNewOTP,"pullEHRrequests.$.status":false}},function(err, data){
    //               if (err) return res.send({status: 400,message: "failed to update OTP!."});
    //               client.messages.create({
    //                  body: 'Your otp to verify:'+createNewOTP ,
    //                  from: '+14053584187',
    //                  to: "+91"+data.mobileNo
    //              }, function(error, data1) {
    //                  if (error) return res.send({
    //                      status: 400,
    //                      message: "failed to send otp!",
    //                      error: error
    //                  });
    //                  else {
    //                    updateDoctor(doctorId,found._id,aadharNo,req,res);
    //                  }
    //              });
    //             });
    //           }
    //
    //           else{
    //             console.log("data||||||||||||||||");
    //             Patient.findOneAndUpdate({aadharNo: aadharNo}, {$push: {'pullEHRrequests': data}}, function(err, data) {
    //               console.log("data||||||||||||||||",err,data);
    //
    //                 if (err) return res.send({status: 400,message: "failed to assign prescription!."});
    //                 client.messages.create({
    //                    body: 'Your otp to verify:'+createNewOTP ,
    //                    from: '+14053584187',
    //                    to: "+91"+data.mobileNo
    //                }, function(error, data1) {
    //                    if (error) return res.send({
    //                        status: 400,
    //                        message: "failed to send otp!",
    //                        error: error
    //                    });
    //                    else
    //                    {
    //                      updateDoctor(doctorId,found._id,aadharNo,req,res);
    //                    }
    //                });
    //                });
    //           }
    //               }
    //
    //     else{
    //           console.log("entering into first time");
    //         Patient.findOneAndUpdate({aadharNo: aadharNo}, {$push: {'pullEHRrequests': data}}, function(err, data) {
    //           console.log("entering into first time",err,data);
    //           if (err) return res.send({status: 400,message: "failed to assign prescription!."});
    //             client.messages.create({
    //                body: 'Your otp to verify:'+createNewOTP ,
    //                from: '+14053584187',
    //                to: "+91"+data.mobileNo
    //            }, function(error, data1) {
    //              console.log("dara",error,data1);
    //             if (error) return res.send({
    //                    status: 400,
    //                    message: "failed to send otp!",
    //                    error: error
    //                });
    //                else {
    //               updateDoctor(doctorId,found._id,aadharNo,req,res);
    //                }
    //            });            });
    //       }
    // }



var verifyEhrByDoctor = function(req, res) {
    var OTP      = req.body.OTP;
    var aadharNo = req.body.aadharNo;
    var multichainAddress = req.body.multichainAddress;
    console.log("data",req.body);
    Ehr.findOne({
        aadharNo: aadharNo
    }, function(err, data) {
      console.log("dataaaaaaaaaaaa",err,data);
        if (err) return res.send({
            status: 400,
            message: "error to get user"
        });
        else if (data) {
                    Ehr.findOneAndUpdate({
                 "OTP": data.OTP
               },{$set : {'status' : true}}, function(err, updatedata) {
                                   console.log("updatedData",err,updatedata);
                                     if (err) return res.send({
                                         status: 400,
                                         message: "error to get user",
                                         err: err
                                     });
                              else{
          Patient.findOne({_id:updatedata.patientId},function(err,response){
                                 // var x = JSON.stringify(response);
                                 var obj = {
                                   visitTime : Date.now(),
                                   data:response
                                 }
                                 var x = JSON.stringify(obj);
                                 var datax = new Buffer(x).toString('hex');
                                 let publishData = {address : multichainAddress,streamName : "patient",key : aadharNo.toString(),data : datax};
                                 Global.publishDataOnMultichain(publishData,(result)=>{
                                     if(result){
                                         return res.send({
                                         status: 200,
                                         message: "Verify successfully!."
                                        });
                                     }
                                 });

                               })
                             }
                         })
                       }






//             let currDoctor = data[0];
//             let counter = 0;
//             async.forEachLimit(currDoctor, 1, (element, next) => {
//                 counter++;
//                     if (element.OTP == OTP) {
//                         Patient.findOneAndUpdate({
//                             "pullEHRrequests.OTP": OTP
//                         }, {
//                             $set: {
//                                 "pullEHRrequests.$.status": true,
//                             }
//                         },{new : true}, function(err, updatedata) {
//                             console.log("updat--------------", updatedata,err);
//                             if (err) return res.send({
//                                 status: 400,
//                                 message: "error to get user",
//                                 err: err
//                             });
//                      else{
//                         var x = JSON.stringify(updatedata);
//                         var datax = new Buffer(x).toString('hex');
//                         let publishData = {address : multichainAddress,streamName : "patient",key : aadharNo.toString(),data : datax};
//                         Global.publishDataOnMultichain(publishData,(result)=>{
//                             if(result){
//                                 return res.send({
//                                 status: 200,
//                                 message: "Verify successfully!."
//                                });
//                             }
//                         });
//
//                         }
//                     })
//                 }
//                     else {
//                         if(counter != currDoctor.length)
//                         next();
//                         else
//                         return res.send({
//                             status: 400,
//                             message: "Not a valid OTP."
//                         });
//                        }
//                 })
//             }
//
// })
})
}




var PermisssionDoctor = function(req, res) {
    var mobileNo = req.body.mobileNo;
    var doctorid = req.body.doctorid;
    Patient.findOne({
        mobileNo: mobileNo
    }, function(err, data) {
        if (err) return res.send({
            status: 400,
            message: "error to get user"
        });
        else if (data) {
            {
                console.log("data", data);
                let currDoctor = data.pullEHRrequests;
                // for(var i=0;i<currDoctor.length;i++){
                //   if(currDoctor[i].doctorId.equals(doctorid) && currDoctor[i].status){
                //     console.log('match');
                //   }else{
                //     console.log('not match');
                //   }
                // }
                let counter = 0;
                async.forEachLimit(currDoctor, 1, (element, next) => {
                    counter++;
                    if (counter <= currDoctor.length) {
                        console.log('data------------------------', counter, currDoctor.length);
                        if (currDoctor[counter - 1].doctorId.equals(doctorid) && currDoctor[counter - 1].status) {
                            // send response
                            return res.send({
                                status: 200,
                                message: 'Good'
                            });
                        } else {
                            if (counter <= currDoctor.length) return res.send({
                                status: 400,
                                message: 'not Good'
                            });
                            else next();
                        }
                    } else {
                        // next();
                    }
                });
            }
        }
    });
}



var recentVisitData =(req,res) =>{
  var multichainAddress = req.body.multichainAddress;
  var stream = req.body.stream;
  var data ={
   address : multichainAddress,
   stream : stream
  }
  Global.listStreamPublisherItems(data,(result)=>{
    console.log("result--------------------------",result);
     if(result){
       return res.send({status : 200, message : "Patients List",data : result.reverse()});
}else{
     return res.send({status : 200, message : "no data ",data : result});
}
  });

}


var updateDoctorProfile = (req, res) => {
    var doctorId = req.body.doctorId;
    var condition = {
        _id: doctorId
    };
    Doctor.findOne(condition, {}, function(err, data) {
        // var updatedData = {$push : {degree : obj.degree, practiceSpecialties : obj.practiceSpecialties}};
        if (data) {
            var obj = {
                degree: req.body.degree ? req.body.degree : data.degree,
                practiceSpecialties: req.body.practiceSpecialties ? req.body.practiceSpecialties : data.practiceSpecialties,
                hospital: req.body.hospital
            }
            console.log("obj|||||||||||" + JSON.stringify(obj));
            if (obj.degree) {
                var updatedData = {
                    degree: obj.degree
                }
            }
            if (obj.practiceSpecialties) {
                var updatedData = {
                    practiceSpecialties: obj.practiceSpecialties
                }
            }
            if (obj.hospital) {
                var updatedData = {
                    hospital: obj.hospital
                }
            }
            if (obj.hospital && obj.practiceSpecialties) {
                var updatedData = {
                    hospital: obj.hospital,
                    practiceSpecialties: obj.practiceSpecialties
                }
            }
            if (obj.degree && obj.practiceSpecialties) {
                var updatedData = {
                    degree: obj.degree,
                    practiceSpecialties: obj.practiceSpecialties
                }
            }
            if (obj.hospital && obj.degree) {
                var updatedData = {
                    hospital: obj.hospital,
                    degree: obj.degree
                }
            }


            var updatedDatas = {
                $push: updatedData
            };
            Doctor.updateOne(condition, updatedDatas, function(err, success) {
                console.log("success" + JSON.stringify(success));
                if (err) return res.json({
                    message: "Please enter the valid doctorid",
                    status: 400
                })
                else if (success) return res.json({
                    message: "doctor information updated successfully",
                    status: 200
                })
                else return res.json({
                    message: "data not updated",
                    status: 400
                })
            });
        } else {

        }
    });
}
var getpatientbills = function(req, res) {
    var doctorId = req.body.doctorId;
    multichain.listStreamItems({
        stream: doctorId,
        count: 25
    }, (err, result) => {
        if (err) {
            return res.json({
                message: "patient information updated successfully" + err,
                status: 400
            })
        } else {
            var data = Buffer.from(result[0].data, 'hex').toString('utf8');
            console.log("data" + data);
            request.get('https://ipfs.io/ipfs/' + data, (error, response, body) => {
                if (error) {
                    return res.send({
                        status: 400,
                        message: "Sorry! you cannt record review.!.",
                        error
                    });
                } else {
                    return res.send({
                        status: 200,
                        message: "Record review." + response
                    });
                }
            });
        }
    });
}
var gettypedoctor = function(req, res) {
    const Doctor = ["Allergists","Anesthesiologists","Cardiologists","Dermatologists","Dentist","ENT Specialist","Family Physicians ","Gastroenterologists","Gynecologist","Surgeon","Neurologists","Oncologists","Nephrologists","Medical Geneticists","Pathologists"]
    res.send({
        status: 200,
        data: Doctor
    })
}

var getDiagonosis = function(req, res) {
    const data = ['MRI','X-Ray','Blood-Test','Uranine-Test','Pregnancy'];
    res.send({
        status: 200,
        data: data
    })
}

var getDeseas = function(req, res) {
    const data = ['Typhoid','Joindish','Aids','Diabities','Chinin-pox','Food-posining','Viral-Fever','Thyroid'];
    res.send({
        status: 200,
        data: data
    })
}

var getDoctorCategory = function(req, res) {
    const Doctor = CONST.doctorCategory;
    console.log(Doctor);
    return res.send({
        status: 200,
        data: Doctor,
        message: 'Doctor category fetch successfully!.'
    });
}
var getDoctorDegree = function(req, res) {
    const Doctor = CONST.DoctorDegree;
    return res.send({
        status: 200,
        data: Doctor,
        message: 'Doctor category fetch successfully!.'
    });
}



var getDoctorDepartment = function(req, res) {
    const Doctor = CONST.DoctorDepartment;
    return res.send({
        status: 200,
        data: Doctor,
        message: 'Doctor category fetch successfully!.'
    });
}

var deletePatientByDoctor = function(req, res) {
    var doctorId = req.body.doctorId;
    var patientId = req.body.patientId;

    var condition = {
        _id: doctorId
    };

    Doctor.update(condition, {
        $pull: {
            'patient': {
                patientId: patientId
            }
        }
    }, function(err, data) {
        if (err) return res.status(500).json({
            'error': 'error in deleting address',
            err: err
        });
        return res.send({
            status: 200,
            message: 'patient delete successfully!.'
        });
    });
}



var getPatientIndoctor = function(req,res){
  var aadharno =  req.body.aadharno;
Patient.findOne({aadharNo:aadharno},function(err,result){
if(err){
  return res.json({
      message:"enter patientid",
      status:200
        })
}
else {
  var aadharNo = result.aadharNo;
  var data = {
  aadharNo : aadharNo,
  stream:"patient"
  }
    Global.liststreamskey(data,(result)=>{
      if(result){
      return res.json({
          message:"your data",
          status:200,
          data:result
        })
    }
  })
}
})


}


  var getProfile = function(req,res){
    var key  = req.body.key;
    var requestType  = req.body.requestType;
    var data = {
        key : key,
        stream: requestType
    }
      Global.liststreamskey(data,(result)=>{
        if(result){
        return res.json({
            message:"Your Profile Data!",
            status:200,
            data:result
          })
      }
    })
  }


  var getAllpatientbydoctor = function(req,res){
    var data = {
      address : "1P6ADDBnidLj7Xo66gww1ocWXnwhdvpPLcMoMF",
      stream : "Doctor"

    }
    Global.listPublisherStreamKeys(data,(result)=>{
      console.log("results--------",result)
      if(result){
      return res.json({
          message:"your data",
          status:200,
          data:result
        })
    }
  })
}





var updateDoctorprofile = function(req,res){
    var doctorId = req.body.doctorId;
    var myquery={_id:doctorId}
    delete req.body.doctorId;
    var filePath = req.body.image;
    if(filePath){
    Global.fileUpload(filePath,(data) => {
     req.body.image  =  data;
 Doctor.findOneAndUpdate(myquery,req.body,function(err,result){
      if(err) return res.send({status : 400, message : "failed to fetch details!",error:err});
      else{
        var x=JSON.stringify(result);
        var datax=new Buffer(x).toString('hex');
        let obj = {address : result.multichainAddress,streamName : "Doctor",key : result.aadharNo,data : datax};
        Global.publishDataOnMultichain(obj, (data, error)=>{
          if(error) return res.send({message:"Error to publish data",status:400,error:error})
          else
              return res.send({
                 message: "Updated data published succesfully!.",
                 status : 200,
                 data:data
          });
        })
      }
    })

  })
}
  else{
    Doctor.findOneAndUpdate(myquery,req.body,function(err,result){
         if(err) return res.send({status : 400, message : "failed to fetch details!",error:err});
         else{
           var x=JSON.stringify(result);
           var datax=new Buffer(x).toString('hex');
           let obj = {address : result.multichainAddress,streamName : "Doctor",key : result.aadharNo,data : datax};
           Global.publishDataOnMultichain(obj, (data, error)=>{
             if(error) return res.send({message:"Error to publish data",status:400,error:error})
             else
                 return res.send({
                    message: "Updated data published succesfully!.",
                    status : 200,
                    data:data
             });
           })
          }
       })
  }
}




var weeklydata=function(req,res){
  var hospitalId=req.body.hospitalId;
  var doctorId=req.body.doctorId;
  //var ans=new Array(7).fill(0);;
  var ans=[];
  var label=[]
  var x=['Sunday','Monday','Tuesday','Wednesday','Thrusday','Friday','Saturday']
  var d=new Date();
     Visit.find({doctorId:doctorId,date:{$lte:Date.now(),$gt:Date.now()-7*24*3600*1000}}).sort({'date':1}).exec(function(err,result){

    if(err) return res.send({status:400,message:'error to fetch!'});
    console.log('Result::',result);
    async.forEachLimit(result, 1, (element, next) => {
      ans.push(element.vc);
      label.push(x[new Date(element.date).getDay()])
      console.log(ans,label);
      next();
    })
  })
}



var dashBoardData=function(req,res){
  var doctorId=req.body.doctorId;
  var ansy=new Array(12).fill(0)
  var ansm=new Array(30).fill(0);
  var answ=[];
  var labely=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
  var labelw=['Sun','Mon','Tue','Wed','Thr','Fri','Sat']
  var x=['Sun','Mon','Tue','Wed','Thr','Fri','Sat']
  var yearlydata;
  Visit.find({doctorId:doctorId,date:{$lte:Date.now(),$gt:Date.now()-365*24*3600*1000}}).sort({'date':1}).exec(function(err,result){
if(err) return res.send({status:400,message:'error to fetch!'});
async.forEachLimit(result, 1, (element, next) => {
   var i=Number(new Date(element.date).getMonth());
   ansy[i]=ansy[i]+Number(element.vc);

   next();
})
yearlydata={
     labely:labely,
     ansy:ansy
     }
     Visit.find({doctorId:doctorId,date:{$lte:Date.now(),$gt:Date.now()-30*24*3600*1000}}).sort({'date':1}).exec(function(err,result){
     if(err) return res.send({status:400,message:'error to fetch!'});
     console.log('Result::',result);
     async.forEachLimit(result, 1, (element, next) => {
       var i=Number(new Date(element.date).getDate());
       ansm[i]=ansm[i]+Number(element.vc);
       next();
     })
   var monthlydata={
     ansm:ansm
    }
    Visit.find({doctorId:doctorId,date:{$lte:Date.now(),$gt:Date.now()-7*24*3600*1000}}).sort({'date':1}).exec(function(err,result){
   if(err) return res.send({status:400,message:'error to fetch!'});
   async.forEachLimit(result, 1, (element, next) => {
     answ.push(element.vc);
     labelw.push(x[new Date(element.date).getDay()])
     next();
   })
   var weeklydata={
     labelw:labelw,
     answ:answ
   }
   var obj={
     yearlydata:yearlydata,
     monthlydata:monthlydata,
     weeklydata:weeklydata
   }
   return res.send({status:200,message:'Data fetch succesfully!',data:obj})
})
})
})
}



var getPatientVisit = (req,res)=>{
var aadharNo = req.body.aadharNo;
Patient.findOne({aadharNo : aadharNo},{},function(err,result){
  if(err) return res.send({status : 400, message : "Unable to fetch from db!."});
  if(result){
 var data = {
stream : "visit",
aadharNo : result.aadharNo
}
Global.listStreamKey(data,(result)=>{
  console.log("resultdata---------------",result);
if(result){
   var counter = 0;
   var responseData = [];

   return res.json({
                          status: 200,
                          message: "review data is!.",
                          data: result,
                          total: result.length
                      });
//      async.forEachLimit(result, 1, (element, next) => {
//        console.log("result|||||||||||||||||||||||||||||",element);
// counter++
//            if (counter == result.length ) {
//
//                    responseData.push(element);
//                    return res.json({
//                        status: 200,
//                        message: "review data is!.",
//                        data: responseData,
//                        total: responseData.length
//                    });
//                    next()
//
//         }
//         else {
//           console.log("element|||||||||||||||||||||||||||||",element);
//
//            responseData.push(element);
//                    return res.json({
//                        status: 200,
//                        message: "review data is!.",
//                        data: responseData,
//                        total: result.length
//                    });
//                }
//             })
// }
//
// })
       }
   })
 }
})
}






exports.addPatient = addPatient;
exports.getAllPatient = getAllPatient;
exports.doctorSendRequestToAdmin = doctorSendRequestToAdmin;
exports.getAllpendingdoctor = getAllpendingdoctor;
exports.createPrescription = createPrescription;
exports.uploadBillByDoctor = uploadBillByDoctor;
exports.recordReviewofpatient = recordReviewofpatient;
exports.sendPullEHRrequestByDoctor = sendPullEHRrequestByDoctor;

exports.getDoctorCategory = getDoctorCategory;
exports.deletePatientByDoctor = deletePatientByDoctor
exports.verifyPatientByDoctor = verifyPatientByDoctor;

exports.verifyEhrByDoctor = verifyEhrByDoctor;
exports.PermisssionDoctor = PermisssionDoctor;


exports.updateDoctor = updateDoctor;
exports.verifyPatientSignupOTP = verifyPatientSignupOTP;
exports.verifyDoctorSignupOTP = verifyDoctorSignupOTP;
exports.getAllpatientbydoctor = getAllpatientbydoctor;
exports.getProfile = getProfile;
exports.updateDoctorprofile = updateDoctorprofile;

exports.gettypedoctor = gettypedoctor;
exports.getDiagonosis = getDiagonosis;
exports.getDeseas = getDeseas;
exports.getDoctorDegree = getDoctorDegree;
exports.getDoctorDepartment = getDoctorDepartment;
exports.doctorDashboard = doctorDashboard;
exports.recentVisitData = recentVisitData;
exports.weeklydata = weeklydata;
exports.dashBoardData = dashBoardData;
exports.getPatientVisit = getPatientVisit;
exports.uploadPrescription = uploadPrescription;
