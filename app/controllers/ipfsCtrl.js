var ipfsModel = require('../models/ipfs.js');
var mongoose = require('mongoose');
var fs = require('fs');
const ipfsAPI = require('ipfs-api');
const express = require('express');
var base64Img = require('base64-img');
var async = require('async');
const base64 = require('base64topdf');
var Locks = require('../models/ipfs.js');
var Address = require('../models/address.js');
var CONST = require('../../config/constants');
const ipfs = ipfsAPI('ipfs.infura.io', '5001', {protocol: 'https'});
var multichain = CONST.multichainConn;

var addLogs = function(req, res){
    let employeeName = req.body.employeeName;
    let employerName = req.body.employerName;
    let email = req.body.email;
    let billissueDate  = req.body.billissueDate;
    let disease = req.body.disease;
    let degination = req.body.degination;
    let bill = req.body.bill;
    let userId = req.body.userId;
    let bills = req.body.bills;

    if(req.body){
        let obj = {
            userId   : userId,
            employeeName : employeeName,
            employerName : employerName,
            email : email,
            billissueDate : billissueDate,
            disease : disease,
            degination : degination,
            bill : bill ? bill : '',
            bills : bills,
            status : 'request',
            isDeleted : false
        }
        console.log('Total bills uploaded by user::',bills.length);
        if(bills.length <= 0){
          console.log("not updated");
          res.send({
            status : 400,
            message : 'Please upload your bill first!.'
          });
        }else{
          ipfsModel.create(obj,function(err, data){
              if(err) return res.send({status : 400, message : "db failed!"});
              return res.send({status : 200, message : "Your record has been saved!", data : data});
          })
        }
    }else{
        return res.send({status : 400, message : "Please fill all required fields!"});
    }
}

var getAllLogs = function(req, res){
    ipfsModel.find({userId : req.body.userId},{},function(err, data){
        if(err) return res.send({status : 400, message : "failed to load all bills from DB!"});
        return res.send({status : 200, message : "Your all bills are here!", data : data,totalbill : data.length});
    });
}

var uploadBill = function(req, res){
    var userId = req.body.userId;
    var filename = req.body.filename;

    if(filename.split(',')[0]!='data:application/pdf;base64'){
        var filepath = base64Img.imgSync(filename,'./bill_images/'+userId);
        console.log('i am image');
        console.log('filepath::',filepath);
    }else{
      console.log('i am pdf');
      var currTime = Date.now();
      // .split(',')[1]
      let decodedBase64 = base64.base64Decode(filename, 'test'+currTime);
      console.log('hey pdf',decodedBase64);
      var filepath ='test'+currTime
    }
    let testFile = fs.readFileSync(filepath);
    let testBuffer = new Buffer(testFile);

      ipfs.files.add(testBuffer,function (err, file) {
        if (err) {
          console.log('Error',err);
          return res.send({status : 400, message : "failed to add log!", data : file,error : err});
        }
        console.log('File',file);
        return res.send({status : 200, message : "Bill has been uploaded!", data : file});
      });
}

var getLogsById = function(req, res){
  console.log("Get log by Id",req.body.logId);
  let logId = req.body.logId;
  let logType = req.body.logType;

  ipfsModel.findOne({_id : logId},{},function(err,data){
    if(err) return res.send({status : 400, message : "Unable to fetch from db!."});
    console.log("Total logs",logType,data.bills[logType]);

    if(data.bills.length-1 >= logType){
    const validCID = data.bills[logType].filehash;
      ipfs.files.get(validCID, function (err, files) {
        files.forEach((file) => {
          console.log(file.content.toString('base64'))
          if(err) return res.send({status : 400, message : "Unable to load bill from db!."});
          if(file.content.toString('base64').indexOf('dataapplication/pdfbase64')===0){
            return res.send({status : 200, message : "get Log has been added!", data : 'data:application/pdf;base64,'+file.content.toString('base64')});
          } else{
            return res.send({status : 200, message : "get Log has been added!", data : 'data:image/jpeg;base64,'+file.content.toString('base64')});
          }
        });
      });
    }else{
      return res.send({status : 200, message : "No bill added yet!.", data : ''});
    }
  });
}

var getAllEmployers = function(req, res){
  return res.send({status : 200, data : CONST.employers.data});
}

var getLogs = function(req, res){
  console.log("sshshshshssbsbsb");
    const validCID = req.body.filehash;
    ipfs.files.get(validCID, function (err, files) {
        files.forEach((file) => {
          console.log(file.content.toString('base64'))
          // console.log(file)
          // console.log(file.content.toString('utf8'))
          if(err) return res.send({status : 400, message : "Unable to fetch from db!."});

          if(file.content.toString('base64').indexOf('dataapplication/pdfbase64')===0){
            return res.send({status : 200, message : "get Log has been added!", data : 'data:application/pdf;base64,'+file.content.toString('base64')});
          } else{
            return res.send({status : 200, message : "get Log has been added!", data : 'data:image/jpeg;base64,'+file.content.toString('base64')});
          }
        })
      })
}


var deletelog = function(req,res){
  var uid = req.body.userid;
  console.log("uid"+uid);
  if(!uid){
      res.send({msg:"OOPS! Something went wrong. Please try again"});
} else {
      Locks.deleteOne({_id:uid},function (err,result){
          if(err) {
          return  res.json({
                 "message": "Error to delete locgs.",
                 status:400
               })
             }
            else{
              return res.json({
                   "message": "log is deleted successfully!.",
                   status:200
                 })
               }

          })
      }
}



















var pdffile = function(req,res){
  console.log("pdffile is uploading|||||||||||||||||||||||||||");
  var filepath = req.file.filename;
  console.log('filepath::',filepath);
  let testFile = fs.readFileSync(filepath);
  let testBuffer = new Buffer(testFile);
  fs.writeFile("testBuffer", body, function(err) {
    if (err) throw err;
});

}

var uploadbilluser = function(req,res){
  console.log("upload bill|||||||||||||||||");
  let employeeName = req.body.employeeName;
  let employerName = req.body.employerName;
  let email = req.body.email;
  let billissueDate  = req.body.billissueDate;
  let disease = req.body.disease;
  let degination = req.body.desgination;
  let userId = req.body.userId;
  var filename = req.body.filename;
  var billType = req.body.billType;

      let obj = {
          userId   : userId,
          employeeName : employeeName,
          employerName : employerName,
          email : email,
          billissueDate : billissueDate,
          disease : disease,
          degination : degination,
          bill : '',
          status : 'request',
          billType : billType
      }
      if(!filename || !userId  || !employerName || !employerName) {
          res.send({message:"Please provide all the details",status:400})
      } else {
if(filename.split(',')[0]!='data:application/pdf;base64'){
  var filepath = base64Img.imgSync(filename,'./bill_images/'+userId);
  console.log('i am image');
  console.log('filepath::',filepath);
  }else{
    var currTime = Date.now();
    // .split(',')[1]
    let decodedBase64 = base64.base64Decode(filename, 'test'+currTime);
    console.log('hey pdf',decodedBase64);
    var filepath ='test'+currTime
  }
  let testFile = fs.readFileSync(filepath);
  var testBuffer = new Buffer(testFile);
  ipfs.files.add(testBuffer,function (err, file) {
    if (err) {
      console.log('Error',err);
      return res.send({status : 400, message : "failed to add log!", data : file,error : err});
    }
    console.log("object||||"+JSON.stringify(file));
console.log("object||||"+file[0].hash);
    obj.bill=file[0].hash;
      ipfsModel.create(obj,function(err, data){
          if(err) return res.send({status :400, message : "db failed!"});
          return res.send({status : 200, message : "Bill logs generated!", data : data});
      })


});
}
  }
  var uploadbillmultiuser = function(req,res){
  console.log("upload bill|||||||||||||||||");
  let employeeName = req.body.employeeName;
  let employerName = req.body.employerName;
  let email = req.body.email;
  let billissueDate  = req.body.billissueDate;
  let disease = req.body.disease;
  let degination = req.body.desgination;
  let userId = req.body.userId;
  var filename = req.body.filename;
  var billType = req.body.billType;
  var totalBills = req.body.bills;

      let obj = {
          userId   : userId,
          employeeName : employeeName,
          employerName : employerName,
          email : email,
          billissueDate : billissueDate,
          disease : disease,
          degination : degination,
          bill : '',
          status : 'request',
          billType : billType
      }
      if(!userId  || !employerName || !employerName) {

          return res.send({message:"Please provide all the details",status:400})
      } else {

        if(totalBills.length > 0){
          var saveData = [];

           async.waterfall([
              function(cb){
                // console.log(totalBills.length);
                  for(var i=0;i<totalBills.length;i++){
                    var filename = totalBills[i].filename;
                    console.log('Current bill:::',totalBills[i].billType);
                    var currentBillName = totalBills[i].billType;

                      if(filename.split(',')[0]!='data:application/pdf;base64'){
                      var filepath = base64Img.imgSync(filename,'./bill_images/'+userId);
                      console.log('i am image');
                      console.log('filepath::',filepath);
                      }else{
                        var currTime = Date.now();
                        // .split(',')[1]
                        let decodedBase64 = base64.base64Decode(filename, 'test'+currTime);
                        console.log('hey pdf',decodedBase64);
                        var filepath ='test'+currTime
                      }

                      let testFile = fs.readFileSync(filepath);
                      var testBuffer = new Buffer(testFile);
                      ipfs.files.add(testBuffer,function (err, file) {
                      if (err) {
                        console.log('Error',err);
                        return res.send({status : 400, message : "failed to add log!", data : file,error : err});
                      }
                      console.log('bill',totalBills.length,i);
                      if(totalBills.length-1 ===i) cb(saveData);
                      else {}
                    saveData.push({billType : currentBillName,filehash:file[0].hash})
                  })
              }
              console.log('save data:::',saveData);

            }
            ],function(err,result){
              console.log('storing into DB:::',result);
                ipfsModel.create(obj,function(err, data){
                   if(err) return res.send({status :400, message : "db failed!"});
                   return res.send({status : 200, message : "Bill logs generated!", data : data});
                });
            });
        }
    }

  }
  var createAddress = (req, res)=>{
    let requestType = req.body.requestType;
    if(requestType){
          multichain.getNewAddress((err,address)=>{
              if(err) return err;
              else{
                var obj = { requestType: requestType, address : address }
                 Address.create(obj,function(err, data){
                      if(err) return res.send({status : 400, message : "db failed!"});
                      return res.send({status : 200, message : "Your address has been generated for "+requestType+"!.", data : data});
                  });
              }
          });
    }else{
      return res.send({status :400, message : "send type for address generation!"});
    }
  }



// Current used
exports.deletelog=deletelog;
exports.addLogs = addLogs;
exports.uploadBill = uploadBill;
exports.getAllLogs = getAllLogs;
exports.getLogsById = getLogsById;
exports.getAllEmployers = getAllEmployers;

// Not used as of now
exports.getLogs = getLogs;
exports.pdffile = pdffile;
exports.uploadbillmultiuser=uploadbillmultiuser;
exports.uploadbilluser = uploadbilluser;

// create address for diffrent-2 type
exports.createAddress = createAddress;
