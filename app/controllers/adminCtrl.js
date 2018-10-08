var ipfsModel = require('../models/ipfs.js');
var mongoose = require('mongoose');
var fs = require('fs');
var pdf = require('html-pdf');
const ipfsAPI = require('ipfs-api');
const express = require('express');
var base64Img = require('base64-img');
var async = require('async');
const base64 = require('base64topdf');
var Locks = require('../models/ipfs.js');
var Doctor = require("../models/doctor");
var Patient = require("../models/patient");
var Hospital = require("../models/hospital");
var Pharmacy = require("../models/pharmacy.js");
var Address = require("../models/address.js");
var Lab = require('../models/lab.js');
var publicApi = require('./publicApi')

var CONST = require('../../config/constants');
const ipfs = ipfsAPI('ipfs.infura.io', '5001', {protocol: 'https'});
var multichain = CONST.multichainConn;
var Global = require('../../config/global.js');


var getRequest = (req, res)=>{
  var condition = { isApproved : false, isBlock : false, isDelete : false};
 var totalRecords = [];
  async.waterfall([
      function(callback) {
         Doctor.find(condition,{},function(err, data){
              if(err) return res.send({status : 400, message : "failed to load all doctors list!"});
              totalRecords.push({doctors : data});
              callback(null, totalRecords);
            });
      },
      function(cbdata,callback) {
         Patient.find(condition,{},function(err, data){
              if(err) return res.send({status : 400, message : "failed to load all patient list!"});
              totalRecords.push({patient : data});
              callback(null, totalRecords);
          });
      },
      function(cbdata,callback) {
         Hospital.find(condition,{},function(err, data){
              if(err) return res.send({status : 400, message : "failed to load all hospital list!"});
              totalRecords.push({hospital : data});
              callback(null, totalRecords);

          });
      }
      ,
      function(cbdata,callback) {
         Pharmacy.find(condition,{},function(err, data){
              if(err) return res.send({status : 400, message : "failed to load all Pharmacy list!"});
              totalRecords.push({pharmacy : data});
              callback(null, totalRecords);

          });
      },
      function(cbdata,callback) {
         Lab.find(condition,{},function(err, data){
              if(err) return res.send({status : 400, message : "failed to load all Labs list!"});
              totalRecords.push({labs : data});
              callback(null, totalRecords);

          });

      }
  ], function (err, result) {
      return res.send({status : 200, message : "all request for permission",data : result});
  });

}


var approvedRequest = (req, res)=>{

    let mobileNo = req.body.mobileNo;
    let requestType = req.body.requestType;
    let email = req.body.email;
    var condition = {mobileNo : mobileNo};
    var hospitalMultichainAddress = req.body.hospitalMultichainAddress;

    switch(requestType){
      case "doctor" :
            if(mobileNo){
              Doctor.updateOne(condition,{$set : {'isApproved' : true}},function(err, data){
                  if(err) return res.send({status : 400, message : "failed to approved doctor!"});
                  return res.send({status : 200, message : "Approved successfully!."});
          });
            }else{
              return res.send({status : 400, message : "send mobileNo for approved!."});
            }
      break;
      case "patient" :
             if(mobileNo){
              Patient.updateOne(condition,{$set : {'isApproved' : true}},function(err, data){
                  if(err) return res.send({status : 400, message : "failed to approved patient!"});
                  //publicApi.Notify(email);
                  return res.send({status : 200, message : "Approved successfully!."});
              });
            }else{
              return res.send({status : 400, message : "send mobileNo for approved!."});
            }
      break;
      case "hospital" :

      if(mobileNo){
        var condition = {contactNo : mobileNo};
       Hospital.findOneAndUpdate(condition,{$set : {'isApproved' : true}},{new: true},function(err, hospital){
           if(err) return res.send({status : 400, message : "failed to approved patient!"});
          publicApi.Notify(email);
          var x = JSON.stringify(hospital);
          var datax = new Buffer(x).toString('hex');
          let publishData = {address : hospital.multichainAddress,streamName : "Hospital",key : hospital.name,data : datax};
          Global.publishDataOnMultichain(publishData,(result)=>{
            return res.send({status : 200, message : "Approved successfully!."});
          });

       });
     }else{
       return res.send({status : 400, message : "send mobileNo for approved!."});
     }
  break;

      case "labs" :
             if(mobileNo){
              var condition = {contactNo : mobileNo};
              Lab.findOneAndUpdate(condition,{$set : {'isApproved' : true}},{new : true},function(err, data){
                  if(err) return res.send({status : 400, message : "failed to approved lab!"});
                  publicApi.Notify(email);
                  var x = JSON.stringify(data);
                  var datax = new Buffer(x).toString('hex');
                  let publishData ='';
                  if(hospitalMultichainAddress) publishData = {address : hospitalMultichainAddress,streamName : "Lab",key : data.name,data : datax};
                  else publishData = {address : data.multichainAddress,streamName : "Lab",key : data.name,data : datax};
                  Global.publishDataOnMultichain(publishData,(result)=>{
                    return res.send({status : 200, message : "Approved successfully!."});
                  });

              });
            }else{
              return res.send({status : 400, message : "send mobileNo for approved!."});
            }
      break;
      case "pharmacy" :
            if(mobileNo){
              var condition = {contactNo : mobileNo};
                    Pharmacy.findOneAndUpdate(condition,{$set : {'isApproved' : true}},{new : true},function(err, data){
                        if(err) return res.send({status : 400, message : "failed to approved pharmacy!"});
                        publicApi.Notify(email);
                        var x = JSON.stringify(data);
                        var datax = new Buffer(x).toString('hex');
                        let publishData ='';
                        if(hospitalMultichainAddress) publishData= {address : hospitalMultichainAddress,streamName : "Pharmacy",key : data.name,data : datax};
                        else publishData = {address : data.multichainAddress,streamName : "Pharmacy",key : data.name,data : datax};
                        Global.publishDataOnMultichain(publishData,(result)=>{
                          return res.send({status : 200, message : "Approved successfully!."});
                        });

                    });
                  }else{
                    return res.send({status : 400, message : "send mobileNo for approved!."});

             }

      break;

      default : res.send({status : 400, message : "Sorry!!!! Invalid entry"});
      break;
    }


}


  var deleteEntity = (req, res)=>{
      let aadharNo = req.body.aadharNo;
      let requestType = req.body.requestType;
      let mobileNo =req.body.mobileNo;
      var condition = {aadharNo : aadharNo};

      switch(requestType){
        case "doctor" :
              if(aadharNo){
                Doctor.findOneAndUpdate(condition,{$set : { isDelete: true}},{new :true},function(err, data){
       console.log("data",data);
                    if(err) return res.send({status : 400, message : "failed to delete doctor!"});
                    return res.send({status : 200, message : "delete successfully|||||!."});
                });
              }else{
                return res.send({status : 400, message : "send mobileNo for delete!."});
              }
        break;
        case "patient" :
               if(aadharNo){
                Patient.updateOne(condition,{$set : {isDelete : true}},{new :true},function(err, data){
                    if(err) return res.send({status : 400, message : "failed to delete patient!"});
                    return res.send({status : 200, message : "delete successfully!."});
                });
              }else{
                return res.send({status : 400, message : "send mobileNo for delete!."});
              }
        break;
        case "hospital" :
              if(mobileNo){
                var condition = {contactNo : mobileNo};
                      Hospital.updateOne(condition,{$set : {'isDelete' : true}},function(err, data){
                          if(err) return res.send({status : 400, message : "failed to delete hospital!"});
                          return res.send({status : 200, message : "Delete successfully!."});
                      });
                    }else{
                      return res.send({status : 400, message : "send mobileNo for delete!."});
               }
        break;

        case "pharmacy" :
         var condition = {contactNo : mobileNo};
              if(mobileNo){
                      Pharmacy.updateOne(condition,{$set : {'isDelete' : true}},function(err, data){
                          if(err) return res.send({status : 400, message : "failed to delete pharamacy!"});
                          return res.send({status : 200, message : "delete successfully!."});

                        })
                      }
        break;
        case "labs" :
        var condition = {contactNo : mobileNo};
               if(mobileNo){
                Lab.updateOne(condition,{$set : {'isDelete' : true}},function(err, data){
                    if(err) return res.send({status : 400, message : "failed to delete lab!"});
                    return res.send({status : 200, message : "delete successfully!."});
                });
              }else{
                return res.send({status : 400, message : "send mobileNo for delete!."});
              }
        break;

        default :
        break;
      }
  }

var blockRequest = (req, res)=>{
    let mobileNo = req.body.mobileNo;
    let requestType = req.body.requestType;
    var condition = {contactNo : mobileNo};
    if(mobileNo){
      switch(requestType){
        case "doctor" :
                Doctor.updateOne(condition,{$set : {'isBlock' : true}},function(err, data){
                    if(err) return res.send({status : 400, message : "failed to block "+requestType+"!."});
                    return res.send({status : 200, message : "Blocked successfully!."});
                });
        break;
        case "patient" :
              Patient.updateOne(condition,{$set : {'isBlock' : true}},function(err, data){
                    if(err) return res.send({status : 400, message : "failed to block "+requestType+"!."});
                    return res.send({status : 200, message : "Blocked successfully!."});
              });
        break;
        case "hospital" :
              Hospital.updateOne(condition,{$set : {'isBlock' : true}},function(err, data){
                    if(err) return res.send({status : 400, message : "failed to block "+requestType+"!."});
                    return res.send({status : 200, message : "Blocked successfully!."});
              });
        break;
        case "labs" :
              Lab.updateOne(condition,{$set : {'isBlock' : true}},function(err, data){
                    if(err) return res.send({status : 400, message : "failed to block "+requestType+"!."});
                    return res.send({status : 200, message : "Blocked successfully!."});
              });
        break;
        case "pharmacy" :
              Pharmacy.updateOne(condition,{$set : {'isBlock' : true}},function(err, data){
                    if(err) return res.send({status : 400, message : "failed to block "+requestType+"!."});
                    return res.send({status : 200, message : "Blocked successfully!."});
              });
        break;
   default :
        break;
      }

    }else{
      return res.send({status : 400, message : "send mobileNo for approved!."});
    }


}
var getDataByType = (req, res)=>{
    let requestType = req.body.requestType;
    let condition = {isApproved : true,isDelete : false};
    if(requestType){
      switch(requestType){
        case "doctor" :
                Doctor.find(condition,{},function(err, data){
                    if(err) return res.send({status : 400, message : "failed to block "+requestType+"!."});
                    if(data) return res.send({status : 200, data : data,message : "Doctor active list fetch successfully!."});
                });
        break;
        case "patient" :
              Patient.find(condition,{},function(err, data){
                    if(err) return res.send({status : 400, message : "failed to block "+requestType+"!."});
                    if(data) return res.send({status : 200, data : data,message : "patient active list fetch successfully!."});
              });
        break;

        case "hospital" :
              Hospital.find(condition,{},function(err, data){
                console.log("data",err,data);
                    if(err) return res.send({status : 400, message : "failed to block "+requestType+"!."});
                    if(data) return res.send({status : 200, data : data,message : "Hospitals active list fetch successfully!."});
                    if(!data)return res.send({status : 200, data : data,message : "Hospitals active list fetch successfully!."});

              });
        break;

        case "lab" :
              Lab.find(condition,{},function(err, data){
                    if(err) return res.send({status : 400, message : "failed to block "+requestType+"!."});
                    if(data) return res.send({status : 200, data : data,message : "Hospitals active list fetch successfully!."});
              });
        break;

        case "pharmacy" :
              Pharmacy.find(condition,{},function(err, data){
                    if(err) return res.send({status : 400, message : "failed to block "+requestType+"!."});
                    if(data) return res.send({status : 200, data : data,message : "Hospitals active list fetch successfully!."});
              });
        break;

       }
      }else{
        return res.send({status : 400, message : "failed to get "+requestType+"!."});
      }
}

function publishDataOnMultichain(publishData) {
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
                }
                console.log('callback come::', result, err);
                // return res.send({status : 200, message : "Data has been saved!", result : result});
            });
    };
}



var login = function(req, res) {
  var email = req.body.email;
  var password = req.body.password;
  var requestType = req.body.requestType;

  if (!email || !password ) {
      return res.json({"message": "Can't be empty!!!",status: 400});
   }
   switch(requestType){
    case 'admin':
        if(email === "admin@gmail.com" && password === "admin@123"){
        return res.send({status:200, message :"Good Job!.", data : {requestType : requestType,email : email,password: password}});
        }
        else{
          return res.send({status:400, message :"Sorry!. Incorrect email and password!."});
        }
    break;

    case 'doctor' :
        if(email === "doctor@gmail.com" && password === "doctor@123"){
        return res.send({status:200, message :"Good Job!.", data : {requestType : requestType,email : email,password: password}});
        }
        else{
          return res.send({status:400, message :"Sorry!. Incorrect email and password!."});
        }
    break;

    case 'patient':
          if(email === "patient@gmail.com" && password === "patient@123"){
          return res.send({status:200, message :"Good Job!.", data : {requestType : requestType,email : email,password: password}});
          }
          else{
            return res.send({status:400, message :"Sorry!. Incorrect email and password!."});
          }
    break;

     case 'hospital':
          if(email === "hospital@gmail.com" && password === "hospital@123"){
          return res.send({status:200, message :"Good Job!.", data : {requestType : requestType,email : email,password: password}});
          }
          else{
            return res.send({status:400, message :"Sorry!. Incorrect email and password!."});
          }
    break;


 case 'labs':
          if(email === "labs@gmail.com" && password === "labs@123"){
          return res.send({status:200, message :"Good Job!.", data : {requestType : requestType,email : email,password: password}});
          }
          else{
            return res.send({status:400, message :"Sorry!. Incorrect email and password!."});
          }
    break;


 case 'pharmacy':
          if(email === "pharmacy@gmail.com" && password === "pharmacy@123"){
          return res.send({status:200, message :"Good Job!.", data : {requestType : requestType,email : email,password: password}});
          }
          else{
            return res.send({status:400, message :"Sorry!. Incorrect email and password!."});
          }
    break;
   }

}


function publishDataOnMultichain(publishData) {
    console.log("publish---------------------------------------------------",publishData);
    if (!publishData) {
        return res.send({
            status: 400,
            message: "Please insert a data and key in the POST body to publish."
        });
    } else {
        var x = JSON.stringify(publishData.data);
        console.log('XXXXXX',x);
        var datax = new Buffer(x).toString('hex');
        console.log('after :::',datax);
        multichain.publishFrom({
                from: publishData.address,
                stream: publishData.streamName,
                key: publishData.key,
                data: datax
            },
            (err, result) => {
                if (err) {
                    console.log("error" + JSON.stringify(err));
                }
                console.log('callback come::', result, err);
                // return res.send({status : 200, message : "Data has been saved!", result : result});
            });
    };
}


var login = function(req, res) {
 var email = req.body.email;
 var password = req.body.password;
 if (!email || !password ) {
     console.log("User Entered invalid parameter ");
     return res.json({
       "message": "Can't be empty!!!",
       status: 400
     });
   }
if ( email === "admin@gmail.com" && password === "admin@123"){
     return res.send({status:200, message :"Good Job!.", data : {email : email,password: password}})
    }else{
      return res.send({status:400, message :"Sorry!. Incorrect email and password!."})
    }
  }


  var getdeleteRequest = (req, res)=>{
    var condition = { isApproved : true, isDelete : true};
    if(requestType){
      switch(requestType){
        case "doctor" :
                Doctor.find(condition,{},function(err, data){
                    if(err) return res.send({status : 400, message : "failed to block "+requestType+"!."});
                    if(data) return res.send({status : 200, data : data,message : "Doctor delete list fetch successfully!."});
                });
        break;
        case "patient" :
              Patient.find(condition,{},function(err, data){
                    if(err) return res.send({status : 400, message : "failed to block "+requestType+"!."});
                    if(data) return res.send({status : 200, data : data,message : "patient delete list fetch successfully!."});
              });
        break;

        case "hospital" :
              Hospital.find(condition,{},function(err, data){
                console.log("data",err,data);
                    if(err) return res.send({status : 400, message : "failed to block "+requestType+"!."});
                    if(data) return res.send({status : 200, data : data,message : "Hospitals delete list fetch successfully!."});
              });
        break;

        case "lab" :
              Lab.find(condition,{},function(err, data){
                    if(err) return res.send({status : 400, message : "failed to block "+requestType+"!."});
                    if(data) return res.send({status : 200, data : data,message : "labs delete list fetch successfully!."});
              });
        break;

        case "pharmacy" :
              Pharmacy.find(condition,{},function(err, data){
                    if(err) return res.send({status : 400, message : "failed to block "+requestType+"!."});
                    if(data) return res.send({status : 200, data : data,message : "pharmacy delete list fetch successfully!."});
              });
        break;

       }
      }else{
        return res.send({status : 400, message : "failed to get "+requestType+"!."});
      }


  }

exports.login=login;
exports.getRequest = getRequest;
exports.approvedRequest = approvedRequest;
exports.blockRequest = blockRequest;
exports.deleteEntity = deleteEntity;
exports.login = login;
exports.getDataByType = getDataByType;
exports.getdeleteRequest = getdeleteRequest;






// exports.getAllpendingHospital =getAllpendingHospital;
