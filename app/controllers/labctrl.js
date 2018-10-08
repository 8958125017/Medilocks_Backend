var ipfsModel = require('../models/ipfs.js');
var mongoose = require('mongoose');
var fs = require('fs');
const ipfsAPI = require('ipfs-api');
const express = require('express');
var bcrypt = require('bcrypt-nodejs');
const saltRounds = 10;
var base64Img = require('base64-img');
var async = require('async');
const base64 = require('base64topdf');
var pdf = require('html-pdf');
var Hospital = require('../models/hospital.js');
var Doctor = require('../models/doctor.js');
var Pharmacy=require('../models/pharmacy.js')
var Patient=require('../models/patient.js')
var Lab=require('../models/lab')
var CONST = require('../../config/constants');
const ipfs = ipfsAPI('ipfs.infura.io', '5001', {protocol: 'https'});
var multichain = CONST.multichainConn;
var Async = require('async');
var Global = require('../../config/global.js');

var labSendRequestToAdmin=function(req,res){
  var name = req.body.name;
  var contactNo = req.body.contactNo;
  var email = req.body.email;
  var city = req.body.city;
  var password = req.body.password;
  var confirmPassword = req.body.confirmPassword;
  var license=req.body.license;
  var address = req.body.address;
  var description = req.body.description;
  var filePath=req.body.image;
  var from = req.body.from;
  var to = req.body.to;

  var hospitalMultichainAddress = req.body.hospitalMultichainAddress;

  if (name=="" || contactNo=="" || license=="") {
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

    Lab.findOne({ contactNo: contactNo}, function(err, detail){
      if (err) return res.send({status : 400, message : "error to find Lab"});
      if (detail) return res.send({status : 400, message : "Lab already exists"});

      if (!detail) {
        bcrypt.genSalt(saltRounds, function(err, salt) {
              bcrypt.hash(password,salt,null, function(err, hash) {
                if(err) return res.send({status : 400, message : "error to get password hash"});
            else {
              if(filePath){
              Global.fileUpload(filePath,(data) => {
              var hash12 = hash;
              Global.getNewAddressandpermissionOnMultichain((result)=>{
              var obj = {
                  name:name,
                  contactNo:contactNo,
                  email:email,
                  city:city,
                  license:license,
                  address : address,
                  description : description,
                  image:data,
                  "avaliablity.open":from,
                  "avaliablity.close  ":to,
                  password:hash12,
                  multichainAddress: result,
                  hospitalMultichainAddress : hospitalMultichainAddress ? hospitalMultichainAddress : ''
              }
              console.log("Lab record"+JSON.stringify(obj));
              Lab.create(obj,function(err, data){
                  if(err) return res.send({status : 400, message : "failed to send request to admin!",error:err});
                  return res.send({status : 200, message : "request is send successfully!", data : data});
              });
            })
          })
        }
    }
  })
})
}
})
}

var viewLab=function(req,res){
  var labid = req.body.labid;
  condition = {_id:labid}
  Lab.find(condition,function(err,data){
    if(err) return res.send({status : 400, message : "failed to fetch details!",error:err});
    return res.send({status : 200, message : "Lab Detail is fetch successfully!", data : data});

  })

}
var viewallLab=function(req,res){

  Lab.find({},function(err,data){
    if(err) return res.send({status : 400, message : "failed to fetch details!",error:err});
    return res.send({status : 200, message : "All Lab Detail is fetch successfully!", data : data});

  })

}

// var uploadReports=function(req,res){
//   console.log("reports");
//   var filename = req.body.filename;
//   var labid = req.body.labid;
//   var patientmobileno = req.body.patientmobileno;
//   if(filename.split(',')[0]!='data:application/pdf;base64'){
//       var filepath = base64Img.imgSync(filename,'./bill_images/'+labid);
//   }
//    else{
//     var currTime = Date.now();
//     let decodedBase64 = base64.base64Decode(filename, 'test'+currTime);
//     var filepath ='test'+currTime
//   }
//   let testFile = fs.readFileSync(filepath);
//   let testBuffer = new Buffer(testFile);
// Lab.findById({_id:labid} ,function(err,data){
// if(err){
//   return  res.send({
//       status:400,
//        message:"error to find addresse"+err
//     });
// }
// else
// {
// ipfs.files.add(testBuffer,function (err, file){
//   var dataToadd = {
//     hash : file[0].hash,
//     uploadedby:labid
//   }
//   var x = JSON.stringify(dataToadd);
//    var datax = new Buffer(x).toString("hex")
//    var streamName = "lab";
// if (err) return res.send({status : 400, message : "failed to add log!", data : file,error : err});
// publishDataOnMultichain(data.address,streamName,patientmobileno,datax,(result)=>{
// if(result){
//         return res.send({status : 200, message : "your report is uploaded", data : result
//     })
//     }
// });
// })
// }
// })
// }


var addressGenerate = function(req,res){
  var labId = req.body.labId;
    multichain.getNewAddress((err,result)=>{
      if(err)
      return  res.send({
          status:200,
           message:"error to generate address"
        });
else{
        Lab.findOneAndUpdate({_id:labId}, {$set:{address:result}},function(err, doc){
    if(err){
        console.log("Something wrong when updating data!");
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
    console.log("publish---------------------------------------------------",publishData);
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





var uploadbills = function(req,res){
  var filename = req.body.filename;
  var labId = req.body.labId;
  var patientadharno = req.body.aadharno.toString();
  var description = req.body.description;
   var type = "bill";

    if (filename.split(',')[0] != 'data:application/pdf;base64') {
        var filepath = base64Img.imgSync(filename, './bill_images/' + labId);
    } else {
        var currTime = Date.now();
        let decodedBase64 = base64.base64Decode(filename, 'test' + currTime);
        var filepath = 'test' + currTime
    }
    let testFile = fs.readFileSync(filepath);
    let testBuffer = new Buffer(testFile);
    fs.unlinkSync(filepath);
    Lab.findById({
        _id: labId
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
                    stream : 'Lab',
                    description : description,
                    type:type,
                    date: Date.now()
                }
                var x = JSON.stringify(dataToadd);
                var datax = new Buffer(x).toString("hex")
                var streamName = "visit";
                var obj  = {
                  address:data.multichainAddress,
                  streamName:streamName,
                  patientadharno:patientadharno,
                  datax:datax,
                    }
                    console.log("address",obj);
                publishDataOnMultichain(obj,(result) => {

                    if (result) {
                      // console.log("result-------------------------------------"+result,error);
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
//Update Lab record:vkg
var updateLab=function(req,res){

  var labId=req.body.labId
  var myquery={labId:labId};
  delete req.body._id;
  var obj = req.body;

Lab.update(myquery,{$set: obj}, function(err, res) {
if (err) throw err;
console.log("Lab data is  updated");
 })
console.log("object details"+obj);
Lab.find(myquery,function(err,object){
var buffer = Buffer.from(JSON.stringify(object))
fs.writeFile("patient.txt", buffer, 'binary', (error)=>{
   if(error) console.log(err)
   else console.log('File saved')
   //var filepath = base64Img.imgSync(filename,'./bill_images/'+userId);
   console.log("process.pwd()", process.cwd())
   let testFile = fs.readFileSync("lab.txt");
      let testBuffer = new Buffer(testFile);
        ipfs.files.add(testBuffer,function (err,result) {
          if (err) {
            console.log("Error to  update lab details!!!",err);
            return res.json({
              "message": "Error to update lab details!!!!!!",
              status: 400
            });
          }
          else if (result) {
          // console.log("resuklt"+JSON.stringify(result));
          var storeData = result[0].path;

            publishDataOnMultichain(labId,labId,storeData,(cbResult)=>{

                console.log('callback received::',cbResult);
                    var cbres=cbResult;
                    var newvalue={$set:{updatedHash:cbres}}
                    Lab.updateOne(myquery,newvalue,function(err,result){
                      if(err) return res.send({status : 400, message : "db failed!"});
                      return res.send({status : 200, message : "Lab record has been saved!", data : result});

                    })
              })

            }


          })
      });
   })

}

var uploadreportsBylab = (req, res) => {
  var filename = req.body.filename;
  var labId = req.body.labId;
  var patientadharno = req.body.aadharno.toString();
  var description = req.body.description;
  var type = "report";

    if (filename.split(',')[0] != 'data:application/pdf;base64') {
        var filepath = base64Img.imgSync(filename, './bill_images/' + labId);
    } else {
        var currTime = Date.now();
        let decodedBase64 = base64.base64Decode(filename, 'test' + currTime);
        var filepath = 'test' + currTime
    }
    let testFile = fs.readFileSync(filepath);
    let testBuffer = new Buffer(testFile);
    fs.unlinkSync(filepath);
    Lab.findById({
        _id: labId
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
                    stream : 'Lab',
                    description : description,
                    type:type,
                    date:Date.now()
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


var updateLabProfile = function(req,res){
  var labId = req.body.labId;
  var myquery={_id:labId}
  delete req.body.labId;
  Lab.findOneAndUpdate(myquery,req.body,function(err,result){
    if(err) return res.send({status : 400, message : "failed to fetch details!",error:err});
    else{
      //console.log("Updated data::",result);
      var x=JSON.stringify(result);
      var datax=new Buffer(x).toString('hex');
      let obj = {address : result.multichainAddress,streamName : "Lab",key : result.name,data : datax};
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

exports.updateLab=updateLab;
exports.labSendRequestToAdmin=labSendRequestToAdmin;
exports.viewallLab=viewallLab;
exports.viewLab = viewLab;
exports.uploadbills = uploadbills;
exports.addressGenerate = addressGenerate;
exports.uploadreportsBylab = uploadreportsBylab;
exports.updateLabProfile = updateLabProfile;









// exports.viewLab=viewLab;
// exports.viewallLab=viewallLab;
// exports.addLab=addLab;
