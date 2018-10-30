
var ipfsModel = require('../models/ipfs.js');
var mongoose = require('mongoose');
var fs = require('fs');
const ipfsAPI = require('ipfs-api');
const express = require('express');
var bcrypt = require('bcrypt-nodejs');
const saltRounds = 10;
var base64Img = require('base64-img');
var Async = require('async');
const base64 = require('base64topdf');
var pdf = require('html-pdf');
var Patient = require('../models/patient.js');
var Pharmacy=require('../models/pharmacy.js')
var Lab=require('../models/lab.js')
var CONST = require('../../config/constants');
const ipfs = ipfsAPI('ipfs.infura.io', '5001', {protocol: 'https'});
var multichain = CONST.multichainConn;
var Global = require('../../config/global.js');



var pharmacySendRequestToAdmin = function(req, res){
  var name = req.body.name;
  var contactNo = req.body.contactNo;
  var email = req.body.email;
  var city = req.body.city;
  var password = req.body.password;
  var confirmPassword = req.body.confirmPassword;
  var license = req.body.license;
  var filePath=req.body.image;
  var open = req.body.open;
  var close = req.body.close;
  var address = req.body.address;
  var description =  req.body.description;
  var hospitalMultichainAddress = req.body.hospitalMultichainAddress;
  console.log("body data",req.body);

  if (name==""||contactNo=="" || email=="" || city=="" || password=="") {
      console.log("User Entered invalid parameter ");
      return res.json({
        "message": "Can't be empty!!!",
        status: 400
      });
    }
    if (password != confirmPassword) {
      console.log("Password and confirmPassword doesnt match!");
      return res.json({
        "message": 'Password and confirmPassword doesnt match!',
        status: 400
      });
    }

    Pharmacy.findOne({ contactNo: contactNo}, function(err, detail){
      if (err) return res.send({status : 400, message : "error to find doctor"});
      if (detail) return res.send({status : 400, message : "pharmacy already exists"});

      if (!detail) {
        bcrypt.genSalt(saltRounds, function(err, salt) {
              bcrypt.hash(password,salt,null, function(err, hash) {
                if(err) return res.send({status : 400, message : "error to get password hash"});
            else {
              if(filePath){
              Global.fileUpload(filePath,(data) => {
              var hash12 = hash;
               Global.getNewAddressandpermissionOnMultichain((result)=>{
              console.log('resultresult',result);
              var obj = {
                  name:name,
                  contactNo:contactNo,
                  city:city,
                  "avaliablity.open":open,
                  "avaliablity.close":close,
                  password:hash12,
                  email:email,
                  address : address,
                  description : description,
                  multichainAddress : result,
                  hospitalMultichainAddress : hospitalMultichainAddress,
                  image:data,
                  license:license
              }
              console.log("doctors record"+JSON.stringify(obj));
              Pharmacy.create(obj,function(err, data){
                  if(err) return res.send({status : 400, message : "failed to send request to admin!",error:err});
                  return res.send({status : 200, message : "request is send successfully!", data : data});
              });
            });
          })
      }
      }
    })
  });
}
})
}
var addressGenerate = function(req,res){
  var pharmacyId = req.body.pharmacyId;
    multichain.getNewAddress((err,result)=>{
      if(err)
      return  res.send({
          status:200,
           message:"error to generate address"
        });
else{
        Pharmacy.findOneAndUpdate({_id:pharmacyId}, {$set:{address:result}},function(err, doc){
    if(err){
        return  res.send({
            status:400,
             message:"address is unable to save"
          });
    }
    else{
      var counter = 0;
      var permissions = ['send', 'receive','connect','mine','admin','activate','issue','create'];
  Async.forEachLimit(permissions,1,(element,next)=>{
  multichain.grant({'addresses': result,'permissions':element},(err,resp)=>{
    if(err){
   res.send({
        'message': "permission not granted",
        'statusCode': 400
      })
    }
    else{
      counter++;
      if(counter!=permissions.length)
        next();
      else{
        res.send({
          'message': "permission granted",
          'statusCode': 200
      })
    }
    }
  })
});
    }
      })
    }
  })
}





function publishDataOnMultichain(publishData,callback) {
    if (!publishData) {
        return res.send({
            status: 400,
            message: "Please insert a data and key in the POST body to publish."
        });
    } else {

        // console.log('after :::',datax);
        multichain.publishFrom({
                from: publishData.address,
                stream: publishData.streamName,
                key: publishData.patientadharno,
                data: publishData.datax
            },
            (err, result) => {
              console.log("data",err,result)
                if (err) {
                    console.log("error" + JSON.stringify(err));
                    callback(err);
                }
                console.log('callback come::', result, err);
                callback(result);
                // return res.send({status : 200, message : "Data has been saved!", result : result});
            });
    };
}






var uploadBillBypharmacy = function(req,res){
  var filename = req.body.filename;
  var pharmacyId = req.body.pharmacyId;
  var patientadharno = req.body.aadharno;
  var description = req.body.description;
  var type = "bill"
  console.log("hello----------",req.body);
    if (filename.split(',')[0] != 'data:application/pdf;base64') {
        var filepath = base64Img.imgSync(filename, './bill_images/' + pharmacyId);
    } else {
        var currTime = Date.now();
        let decodedBase64 = base64.base64Decode(filename, 'test' + currTime);
        var filepath = 'test' + currTime
    }
    let testFile = fs.readFileSync(filepath);
    let testBuffer = new Buffer(testFile);
    fs.unlinkSync(filepath);
    Pharmacy.findById({
        _id: pharmacyId
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
                    description : description,
                    stream :'Pharmacy',
                    type:type,
                    date:Date.now()
                }
                var x = JSON.stringify(dataToadd);
                var datax = new Buffer(x).toString("hex")
                var streamName = "visit";
                var obj  = {
                  address:data.multichainAddress,
                  streamName:streamName,
                  key:patientadharno,
                  data:datax
                    }
                publishDataOnMultichain(obj,(result) => {
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
var getAllpendingPharamacy =  function(req,res) {
         Pharmacy.find({isBlock:false,isDelete:false},function (err,data) {
             if(err) return res.status(400).send({message:"error to get user"});
             return res.send({status : 200, message : " pending patient records get successfully", data : data});
});
}
var viewPharmacy=function(req,res){
  console.log("getpharamacy");
  var pharmaycyid = req.body.pharmacyid;
  condition = {_id:pharmaycyid};
  Pharmacy.find(condition,function(err,data){
    if(err) return res.send({status : 400, message : "failed to fetch details!",error:err});
    return res.send({status : 200, message : "Pharmacy Detail is fetch successfully!", data : data});
})

}
var viewallPharmacy=function(req,res){
  Pharmacy.find({},function(err,data){
    if(err) return res.send({status : 400, message : "failed to fetch details!",error:err});
    return res.send({status : 200, message : "Pharmacy Detail is fetch successfully!", data : data});
  })
}



var uploadReportsbypharmacy=function(req,res){
  var filename = req.body.filename;
  var pharmacyId = req.body.pharmacyId;
  var patientadharno = req.body.aadharno;
    var description = req.body.description;
    var type = "report"

    if (filename.split(',')[0] != 'data:application/pdf;base64') {
        var filepath = base64Img.imgSync(filename, './bill_images/' + pharmacyId);
    } else {
        var currTime = Date.now();
        let decodedBase64 = base64.base64Decode(filename, 'test' + currTime);
        var filepath = 'test' + currTime
    }
    let testFile = fs.readFileSync(filepath);
    let testBuffer = new Buffer(testFile);
    fs.unlinkSync(filepath);
    Pharmacy.findById({
        _id: pharmacyId
    }, function(err, data) {
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
                     type:type,
                    date:Date.now(),
                    description:description
                }
                var x = JSON.stringify(dataToadd);
                var datax = new Buffer(x).toString("hex")
                var streamName = "visit";
                var obj  = {
                  address:data.multichainAddress,
                  streamName:streamName,
                  patientadharno:patientadharno,
                  datax:datax

                    }
                    console.log("address",obj);
                publishDataOnMultichain(obj,(result) => {

                    if (result) {
                      // console.log("result-------------------------------------"+result,error);
                        return res.send({
                            status: 200,
                            message: "reports are uploaded",
                            data: result
                        })
                    }
                });
            })
        }
    })
}


exports.pharmacySendRequestToAdmin = pharmacySendRequestToAdmin;
exports.uploadBillBypharmacy = uploadBillBypharmacy;
exports.getAllpendingPharamacy = getAllpendingPharamacy;
exports.viewallPharmacy = viewallPharmacy;
exports.viewPharmacy = viewPharmacy;
exports.addressGenerate = addressGenerate;
exports.uploadReportsbypharmacy = uploadReportsbypharmacy;
