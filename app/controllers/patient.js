var Patient = require('../models/patient.js');
var Appointement = require('../models/appointment.js');
var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var HttpStatus = require('http-status-codes');
const ipfsAPI = require('ipfs-api');
var Locks = require('../models/ipfs.js');
var Doctor = require('../models/doctor.js');
var fs = require('fs');
var request = require('request');
var async = require('async');
var base64Img = require('base64-img');
var axios = require('axios');
const base64 = require('base64topdf');


var CONST = require('../../config/constants');
const ipfs = ipfsAPI('ipfs.infura.io', '5001', {protocol: 'https'});

var multichain = CONST.multichainConn;
var Global = require('../../config/global.js');



var getBloodGroup = function(req,res){
  const Bloodgroup = CONST.BloodCategory;
  console.log("Ssss",Bloodgroup);
  return res.send({ status:200,data:Bloodgroup,message : 'Doctor category fetch successfully!.'});
}

var addPatient = function(req,res){
  if( req.body.patientName=="" || req.body.email=="" || req.body.mobileNo=="" ||req.body.disease==""
    || req.body.gender=="" || req.body.age=="" || req.body.occupation=="" || req.body.bloodGroup=="" || req.body.refferedBy==""
    || req.body.streetAddress=="" || req.body.pinCode=="" || req.body.city=="") {
      res.send({message:"Please provide all the details",status:400})
  }
  else {
    var obj = req.body;
    console.log("object details"+obj);
    var buffer = Buffer.from(JSON.stringify(obj))
    fs.writeFile("patient.txt", buffer, 'binary', (error)=>{
       if(error) console.log(err)
       else console.log('File saved')
        var filepath = base64Img.imgSync(req.body.image,'./profile_images/',email);
        req.body.image=filepath;
       console.log("process.pwd()", process.cwd())
       let testFile = fs.readFileSync("patient.txt");
          let testBuffer = new Buffer(testFile);
            ipfs.files.add(testBuffer,function (err,result) {
              if (err) {
                console.log("Error to  create patient details!!!",err);
                return res.json({
                  "message": "Error to create patient details!!!!!!",
                  status: 400
                });
              }
              else if (result) {
              var storeData = result[0].path;
    publishDataOnMultichain('patient',storeData,(cbResult)=>{
                  if(cbResult){
                    console.log('callback received::',cbResult);
                       Patient.create({patient: cbResult},function(err, data){
                        if(err) return res.send({status : 400, message : "db failed!"});
                        fs.unlink("patient.txt");
                        return res.send({status : 200, message : "Patient record has been saved!", data : data});
                    });
                  }

                });

              }
          });
       })
    }
}

function publishDataOnMultichain(streamName,data,callback){
       if (!data) {
           return res.send({status : 400, message:"Please insert a data and key in the POST body to publish."});
       } else {
           var dataToadd = new Buffer(data).toString("hex");
           multichain.publish({
               stream: streamName,
               key: "kunvar",
               data: dataToadd
               },
           (err,result) => {
             if(err){
              callback(null);
             }
              // return res.send({status : 400, message : "failed!",error : err});
              console.log('callback come::',result,err);
             callback(result);
             // return res.send({status : 200, message : "Data has been saved!", result : result});
           });
       };
}

var addAppointment = function(req,res){
  if(!req.body.patientName || !req.body.email || !req.body.mobileNo || !req.body.doctorName
    || !req.body.notes || !req.body.fromDate || !req.body.toDate) {

      return res.send({message:"Please provide all the details",status:400});
  } else {
    var obj = req.body;
    var buffer = Buffer.from(JSON.stringify(obj))

    fs.writeFile("appointement.txt", buffer, 'binary', (error)=>{
       if(error) console.log(err)
       else console.log('File saved');

       let testFile = fs.readFileSync("appointement.txt");
          let testBuffer = new Buffer(testFile);
            ipfs.files.add(testBuffer,function (err,result) {
              if (err) {
                console.log("appointement detail is not scheduled!!!",err);
                return res.json({
                  message: "appointement detail is not scheduled!!!!!!",
                  status: 400
                });
              }
              else if (result) {
                Appointement.create({appointment: result[0].path},function(err, data){
                      if(err) return res.send({status : 400, message : "db failed!",error :err});
                      return res.send({status : 200, message : "Your Appointment has been booked!", data : data});
                });
              }
    });
});
}

}

var getPatientById = function(req, res){
  let pateintid = req.body.patientId;

  Patient.findOne({_id : pateintid},{},function(err,data){
    if(err) return res.send({status : 400, message : "Unable to fetch from db!."});

    let patientData = [];
    async.waterfall([
        function(callback) {
          request.get('https://ipfs.io/ipfs/'+data.patient,(error,response,body)=>{
            patientData.push({patient : JSON.parse(body)})
            callback(null, patientData);
          });
        },
        function(arg1, callback) {
            request.get('https://ipfs.io/ipfs/'+data.vitalRecords,(error,response,body)=>{
              patientData.push({vital : JSON.parse(body)})
              callback(null, patientData);
            });
        },
        function(arg1,callback){
          request.get('https://ipfs.io/ipfs/'+data.complaintRecords,(error,response,body)=>{
              patientData.push({complain : JSON.parse(body)})
              callback(null, patientData);
            });
        },
        function(arg1,callback){
          request.get('https://ipfs.io/ipfs/'+data.laborderRecords,(error,response,body)=>{
              patientData.push({laborder : JSON.parse(body)})
              callback(null, patientData);
            });
        },
        function(arg1,callback){
          request.get('https://ipfs.io/ipfs/'+data.TreatmentplanRecords,(error,response,body)=>{
              patientData.push({treatment : JSON.parse(body)})
              callback(null, patientData);
            });
        }
    ], function (err, result) {
        return res.send({status : 200, data : result});
    });

    // request.get('https://ipfs.io/ipfs/'+data.patient,(error,response,body)=>{
    //   return res.send({status : 200, data : JSON.parse(body)})
    // });

  });
}

var getAllPatient =  function(req,res) {
        Patient.find({},function (err,data) {
            if(err) return res.status(400).send({message:"error to get user"});
            else if(data) {
            var patients = [];
            let counter = 0;
            async.forEachLimit(data,1,(element,next)=>{
             counter++;
             if(counter < data.length){

                request.get('https://ipfs.io/ipfs/'+data[counter].patient,(error,response,body)=>{
                 patients.push(JSON.parse(body));
                 next();
                });
             }else{
               return res.status(200).send({message:'Get All Patients lists',data:patients});
             }
            });

            }
        })
    }


var addVitalSign = function(req,res){

  var patientId = req.body.patientId ;
  var weight = req.body.weight ;
  var systolic = req.body.systolic ;
  var diastolic = req.body.diastolic ;
  var pulse = req.body.pulse ;
  var temperature = req.body.temperature ;
  var breatheRate = req.body.breatheRate ;
if(!req.body.patientId || !req.body.weight || !req.body.systolic || !req.body.diastolic ||
 !req.body.pulse || !req.body.temperature || !req.body.breatheRate) {
  return res.send({message:"Please provide all the details",status:400});
} else {

  var obj = {
    weight:weight,
    systolic:systolic,
    diastolic:diastolic,
    pulse:pulse,
    temperature:temperature,
    breatheRate:breatheRate
    }

   var buffer = Buffer.from(JSON.stringify(obj))
    fs.writeFile("vitalsign.txt", buffer, 'binary', (error)=>{
       if(error) console.log(err)
       else console.log('File saved');

       let testFile = fs.readFileSync("vitalsign.txt");
          let testBuffer = new Buffer(testFile);
            ipfs.files.add(testBuffer,function (err,result) {
              if (err) {
                console.log("Vital Records is not found!!!",err);
                return res.json({
                  message: "Vital Records is not found!!!!!!",
                  status: 400
                });
              }
              else if (result) {
              Patient.updateOne({_id:patientId},
                   {$set: {vitalRecords: result[0].path}},function(err, data){
                     console.log("data"+data);
                         if(err) return res.send({status : 400, message : "Vital Records is not found",error :err});
                         fs.unlink("vitalsign.txt");
                         return res.send({status : 200, message : "Vital Records is found", data : data});

              })
    }
});
})
}
}

var complaints = function(req,res){
  var patientId = req.body.patientId ;
  var complaints = req.body.complaints ;
if(!req.body.patientId || !req.body.complaints ) {
  return res.send({message:"Please provide all the details",status:400});
} else {
  var obj = {
    complaints:complaints
    }

   var buffer = Buffer.from(JSON.stringify(obj))
    fs.writeFile("complaint.txt", buffer, 'binary', (error)=>{
       if(error) console.log(err)
       else console.log('File saved');

       let testFile = fs.readFileSync("complaint.txt");
          let testBuffer = new Buffer(testFile);
            ipfs.files.add(testBuffer,function (err,result) {
              if (err) {
                console.log("complaint is not saved!!!!",err);
                return res.json({
                  message: "complaint is not saved!!!!!!",
                  status: 400
                });
              }
              else if (result) {
              Patient.updateOne({_id:patientId},
                   {$set: {complaintRecords: result[0].path}},function(err, data){
                     console.log("data"+data);
                         if(err) return res.send({status : 400, message : "Vital Records is not found",error :err});
                         fs.unlink("complaint.txt");
                         return res.send({status : 200, message : "Vital Records is found", data : data});

              })
    }

    });
});
}
}
var labOrder = function(req,res){
  var patientId = req.body.patientId ;
  var labtest = req.body.labtest ;
  var instruction = req.body.instruction ;


if(!req.body.patientId || !req.body.labtest || !req.body.instruction) {
  return res.send({message:"Please provide all the details",status:400});
} else {
  var obj = {
    labtest:labtest,
    instruction:instruction
    }

   var buffer = Buffer.from(JSON.stringify(obj))
    fs.writeFile("lab.txt", buffer, 'binary', (error)=>{
       if(error) console.log(err)
       else console.log('File saved');

       let testFile = fs.readFileSync("lab.txt");
          let testBuffer = new Buffer(testFile);
            ipfs.files.add(testBuffer,function (err,result) {
              if (err) {
                console.log("laborder record is not saved!!!!",err);
                return res.json({
                  message: "laborder record is not saved!!!!!!",
                  status: 400
                });
              }
              else if (result) {
              Patient.updateOne({_id:patientId},
                   {$set: {laborderRecords: result[0].path}},function(err, data){
                     console.log("data"+data);
                         if(err) return res.send({status : 400, message : "Vital Records is not found",error :err});
                         fs.unlink("lab.txt");
                         return res.send({status : 200, message : "Vital Records is found", data : data});

              })
    }

    });
});
}
}


var treatmentPlan = function(req,res){
  var patientId = req.body.patientId ;
  var procedure = req.body.procedure ;
  var cost = req.body.cost ;
  var discount = req.body.discount ;
  var total = req.body.total ;
  if(!req.body.patientId || !req.body.procedure || !req.body.cost || !req.body.discount || !req.body.total) {
    return res.send({message:"Please provide all the details",status:400});
  } else {
  var obj = {
    patientId:patientId,
    procedure:procedure,
    cost:cost,
    discount:discount,
    total:total
}

   var buffer = Buffer.from(JSON.stringify(obj))
    fs.writeFile("treatment.txt", buffer, 'binary', (error)=>{
       if(error) console.log(err)
       else console.log('File saved');

       let testFile = fs.readFileSync("treatment.txt");
          let testBuffer = new Buffer(testFile);
            ipfs.files.add(testBuffer,function (err,result) {
              if (err) {
                console.log("laborder record is not saved!!!!",err);
                return res.json({
                  message: "laborder record is not saved!!!!!!",
                  status: 400
                });
              }
              else if (result) {
              Patient.updateOne({_id:patientId},
                   {$set: {TreatmentplanRecords: result[0].path}},function(err, data){
                     console.log("data"+data);
                         if(err) return res.send({status : 400, message : "treatment Records is not found",error :err});
                         fs.unlink("treatment.txt");
                         return res.send({status : 200, message : "treatment records", data : data});

              })
    }

    });
});
}
}
var uploadBill = function(req, res){
    var filename = req.body.filename;
    var patientId = req.body.patientId ;
    if(!req.body.patientId || !req.body.filename) {
      return res.send({message:"Please provide all the details",status:400});
    } else {
      console.log("ssss"+filename);
    if(req.body.filename.split(',')[0]!='data:application/pdf;base64'){
        var filepath = base64Img.imgSync(req.body.filename,'./bill_images/'+patientId);
        console.log('i am image');
        console.log('filepath::',filepath);
    }else{
      var currTime = Date.now();
      let decodedBase64 = base64.base64Decode(req.body.filename, 'test'+currTime);
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
      if(file)  {
        console.log("Ssssssss");
        Patient.updateOne({_id:patientId},
             {$set: {billRecords: file[0].path}},function(err, data){
               console.log("data"+data);
                   if(err) return res.send({status : 400, message : "bill is not uploaded",error :err});
                   // fs.unlink("filepath");
                   return res.send({status : 200, message : "bill is uploaded successfully"});

        })
  }

      });
}
}
var uploadPrescription = function(req, res){
    var filename = req.body.filename;
    var patientId = req.body.patientId ;
    if(!req.body.patientId || !req.body.filename) {
      return res.send({message:"Please provide all the details",status:400});
    } else {
      console.log("ssss"+filename);
    if(req.body.filename.split(',')[0]!='data:application/pdf;base64'){
        var filepath = base64Img.imgSync(req.body.filename,'./bill_images/'+patientId);
        console.log('i am image');
        console.log('filepath::',filepath);
    }else{
      var currTime = Date.now();
      let decodedBase64 = base64.base64Decode(req.body.filename, 'test'+currTime);
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
      if(file)  {
        console.log("Ssssssss");
        Patient.updateOne({_id:patientId},
             {$set: {prescriptionRecords: file[0].path}},function(err, data){
               console.log("data"+data);
                   if(err) return res.send({status : 400, message : "bill is not uploaded",error :err});
                   // fs.unlink("filepath");
                   return res.send({status : 200, message : "presciption is uploaded successfully"});

        })
  }

      });
}
}



function updateDoctor(doctorId,patientId,req,res){
    var createNewOTP = Math.floor(100000 + Math.random() * 900000);
    Doctor.findOne({_id: doctorId}, {}, (err, found) => {
        if (err) return res.send({status: 400,message: "error in send request"});
        if (!found) res.send({status: 400,message: 'Doctor does not exist!.'});
        if (found) {
          if(found.patient.length > 0){

            var status = found.patient.findIndex((item)=>{
              console.log('itemitem',item);
              return item.patientId.equals(patientId);
            });

            console.log('status',status);
              if(status!==-1){
                var condition = {_id: doctorId,"patient.patientId" : patientId};
                Doctor.updateOne(condition,{$set : {'patient.$.status' : true}},function(err, data){
                  if (err) return res.send({status: 400,message: "failed to update OTP!."});
                  return res.send({status: 200,message: "Accepted!!."});
                });
              }
          }
      }
  });
}


// new api after meeting
var acceptPullEHRrequestByDoctor = (req, res)=>{
  var doctorId = req.body.doctorId;
  let patientId = req.body.patientId;
  var mobileNo = req.body.mobileNo;

  var condition = {"pullEHRrequests.doctorId" : doctorId};
  Patient.updateOne(condition,{$set : {'pullEHRrequests.$.status' : true}},function(err, data){
      if(err) return res.send({status : 400, message : "failed to assign prescription!."});
      // return res.send({status : 200, message : "Pull EHR request has been accepted successfully!!."});
      updateDoctor(doctorId,patientId,req,res);
  });
}

var deniedPullEHRrequestByDoctor = (req, res)=>{
  var doctorId = req.body.doctorId;
  let patientId = req.body.patientId;
  var mobileNo = req.body.mobileNo;

  var condition = {"pullEHRrequests.doctorId" : doctorId};
  Patient.updateOne(condition,{$set : {'pullEHRrequests.$.status' : false}},function(err, data){
      if(err) return res.send({status : 400, message : "failed to assign prescription!."});
      // return res.send({status : 200, message : "Pull EHR request has been accepted successfully!!."});
      Doctor.update({_id : doctorId}, {$pull: {'patient': {patientId : patientId}}}, function(err, data){
        if(err) return res.status(500).json({'error' : 'error in deleting address',err:err});
        return res.send({ status:200,message : 'Pull EHR request has been denied!.'});
      });
  });
}


var viewPullEHRrequestByPatient = (req, res)=>{
  let patientId = req.body.patientId;
  var condition = {_id : patientId};
  Patient.findOne(condition)
  .populate("pullEHRrequests.doctorId")
  .exec((err, data)=>{
      if(err) return res.send({status : 400, message : "failed to assign prescription!."});
      return res.send({status : 200, message : "View EHR request has been fetch successfully!!.",data :data});
  });
}



var viewAllDoctors = (req, res)=>{
  let patientId = req.body.patientId;
  let hospitalId=req.body.hospitalId;
  let kind=req.body.kind;
  let speciality=req.body.speciality;
    let query=req.body.query;
  var obj;
  if(kind=='EHR') {
    if(patientId) {

      var obj={}
      if (speciality) obj["practiceSpecialties"]={$in:[speciality]};
      if (query) obj["firstName"]={$regex:query};
    }
    else return res.send({status:400,message:'PatientId is missing'});
  }
  else if(kind=='HOSP'){
    if(hospitalId) {
      obj={hospitalId:hospitalId}
      if (speciality) obj["practiceSpecialties"]={$in:[speciality]};
      if (query) obj["firstName"]={$regex:query};
    }
    else return res.send({status:400,message:'HospitalId is missing'});
  }
  else {
          obj={};
          if (speciality) obj["practiceSpecialties"]={$in:[speciality]};
          if (query) obj["firstName"]={$regex:query};
  }
  if(kind=='EHR')
  {
    console.log('EHR.................OBJ',obj);
    Ehr.find({patientId:patientId})
    .select("doctorId")
    .populate({path:'doctorId',match:obj})
    .exec(function(err,data){
      console.log('Error:',err,'Data:',data);
      if(err) return res.send({status : 400, message : "failed to load all doctors!."});
      return res.send({status : 200, message : "All doctors are here!.",data: data});
    })

}
else {
  //var condition = { isBlock : false, isDelete : false, isApproved : true}
  Doctor.find(obj,function(err, data){
      if(err) return res.send({status : 400, message : "failed to load all doctors!."});
      return res.send({status : 200, message : "All doctors are here!.",data: data});
  });


}
}
//Update Patient Data
var updatePatient=function(req,res){

  var patientId=req.body.patientId
  var myquery={patientId:patientId};
  delete req.body._id;
  var obj = req.body;

Patient.update(myquery,{$set: obj}, function(err, res) {
if (err) throw err;
 })
 Patient.find({myquery:myquery},function(err,object){
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
          var storeData = result[0].path;
            publishDataOnMultichain('patient',storeData,(cbResult)=>{
                    var cbres=cbResult;
                    var newvalue={$set:{updatedHash:cbres}}
                    Patient.updateOne(myquery,newvalue,function(err,result){
                      if(err) return res.send({status : 400, message : "db failed!"});
                      return res.send({status : 200, message : "Lab record has been saved!", data : result});
                    })
              })

            }


          })
      });
   })

}

var searchDoctorBySpeciality = (req,res)=>{
  Doctor.find({practiceSpecialties:{ $in:[req.body.practiceSpecialties] }}, (err,result)=>{
    if(err){
      return res.send({
        message: " error in finding data",
        status: 400,
        error: err
      })
    }else{
      return res.send({
        message: "Success in finding doctor",
        status: 200,
        data: result
      })
    }
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
     if(result){
       var counter = 0;
       var data = [];
       var responseData = [];
         async.forEachLimit(result, 1, (element, next) => {
               counter++;
               if (counter == result.length ) {
                   axios.get('https://ipfs.io/ipfs/'+result[counter - 1].hash).then((response) => {
                     if(response){
                     stream = result[counter-1].stream;
                     address = result[counter-1].uploadedby;
                     var publishData = {
                       stream : stream,
                       address : address
                     }
                     if(stream){
                    viewVisitProfile(publishData,(result)=>{
                      if (result){
                        var data='';
                        async.forEachLimit(result,1,(element,next)=>{
                          var x=JSON.parse(Buffer.from(element.data, 'hex').toString('utf8'))
                          data = x;
                        })
                        var visitdata = {
                          data:response.config.url,
                          uploadedby:data
                        }
                       responseData.push(visitdata);
                       return res.json({
                           status: 200,
                           message: "review data is!.",
                           data: responseData,
                           total: responseData.length
                       });
                   }
                 })
               }else next()

                }
              })
             .catch(error => {
                 console.log('error to fetch', error);
             })
           }
            else {
                   axios.get('https://ipfs.io/ipfs/'+result[counter - 1].hash).then((response) => {
                     if(response){
                      stream = result[counter-1].stream;
                     address = result[counter-1].uploadedby;
                     var publishData = {
                       stream : stream,
                       address :address
                     }
             if(stream){
                    viewVisitProfile(publishData,(result)=>{
                      console.log("publishResult|||||||||||",result);

                      if (result){
                      var data='';
                      async.forEachLimit(result,1,(element,next)=>{
                        var x=JSON.parse(Buffer.from(element.data, 'hex').toString('utf8'))
                        data = x;
                      })
                     var visitdata = {
                       data:response.config.url,
                       uploadedby:data
                     }
                       responseData.push(visitdata);console.log('cvdvfadjfhadjfadkfa');
                       next();
                   }
                })
              }else next();
}
}).catch(error => {
    console.log('error to fetch', error);
})
           }
       })
     }
})
}
})
}

function viewVisitProfile(publishData,callback) {
    if (!publishData) {
        return res.send({
            status: 400,
            message: "Please insert a data and key in the POST body to publish."
        });
    } else {
        // console.log('after :::',datax);
        multichain.listStreamPublisherItems({
                stream: publishData.stream,
                address: publishData.address,
                 count:200
               },
            (err, result) => {
                  if (err) {
                    //console.log("error" + JSON.stringify(err));
                    callback(err);
                }
                //console.log('callback come::', result, err);
                callback(result);
                // return res.send({status : 200, message : "Data has been saved!", result : result});
            });
    };
}







var updatePatientProfile = function(req,res){
      var patientId = req.body.patientId;
      var myquery={_id:patientId}
      delete req.body.patientId;
      var filePath = req.body.image;
      if(filePath){
      Global.fileUpload(filePath,(data) => {
       req.body.image  =  data;
   Patient.findOneAndUpdate(myquery,req.body,function(err,result){
        if(err) return res.send({status : 400, message : "failed to fetch details!",error:err});
        else{
          var x=JSON.stringify(result);
          var datax=new Buffer(x).toString('hex');
          let obj = {address : result.multichainAddress,streamName : "Patient",key : result.aadharNo,data : datax};
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
      Patient.findOneAndUpdate(myquery,req.body,function(err,result){
           if(err) return res.send({status : 400, message : "failed to fetch details!",error:err});
           else{
             var x=JSON.stringify(result);
             var datax=new Buffer(x).toString('hex');
             let obj = {address : result.multichainAddress,streamName : "Patient",key : result.aadharNo,data : datax};
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


  var uploadGeneralInfo = (req, res) => {
    var patientId = req.body.patientId;
    var condition={_id:patientId}
    Patient.findOne(condition,function(err,result){
                 patientadharno=result.aadharNo;
                  var generalInfo={
                    sugar:req.body.sugar,
                    weight:req.body.weight,
                    temprature:req.body.temprature,
                    respirationRate:req.body.respirationRate,
                    systolic:req.body.systolic,
                    diastolic:req.body.diastolic,
                    pulseRate:req.body.pulseRate,
                    date:Date.now()
                  }
                  var x = JSON.stringify(generalInfo);
                  var datax = new Buffer(x).toString("hex")
                  var streamName = "Patient";
                  console.log(datax);
                  var obj  = {
                    address:result.multichainAddress,
                    streamName:streamName,
                    key:patientadharno,
                    data:datax
                      }
                  Global.publishDataOnMultichain(obj, (result, error) => {
                      if (result) {
                          return res.send({
                              status: 200,
                              message: "succesfully Published!",
                              data: result
                          })
                      }
                  });
              })
          }




  var fetchGeneralInfo = function(req,res){
  var patientId=req.body.patientId;
  var condition={_id:patientId};
  Patient.findOne(condition,function(err,data){
    if(err) return res.send({status : 400, message : "db failed!"});
            var data = {
              address : data.multichainAddress,
              stream : "Patient"
          }
            Global.listPublisherStreamKeys(data,(result)=>{
              console.log("result",result);
              if(result){
                let c = 0;
                var responseData = [];
                async.forEachLimit(result, 1, (element, next) => {
                  console.log("element-----------------------------------",element);
                    c++;
                    if(c < result.length){
                    if(element.sugar||element.weight||element.bloodPressure||element.temprature||element.respirationRate || element.date)
                       {
                        responseData.push(element);
                        console.log('True.............................');}
                      next();
                    }else{
                      if(element.sugar||element.weight||element.bloodPressure||element.temprature||element.respirationRate || element.date)
                      {
                        responseData.push(element);
                      }
                      var data = responseData.reverse();
                      return res.json({message:"your data",status:200,data:data})
                    }
                  });
            }
          })
            })
}




var fetchPatientVitialInfo = function(req,res){
  var patientId=req.body.patientId;
  var condition={_id:patientId};
  var bloodPressure=[];
  var labelBP=[];
  var weight=[];
  var labelWt=[];
  var sugar=[];
  var labelSugar=[];
  var latestBloodPressure;
  var latestSugar;
  var latestWeight;
  Patient.findOne(condition,function(err,data){
    if(err) return res.send({status : 400, message : "db failed!"});
            var data = {
              address : data.multichainAddress,
              //key:data.aadharNo,
              stream : "Patient"
          }
          //listPublisherStreamKeys
            Global.listPublisherStreamKeys(data,(result)=>{
              //console.log("results--------",result)
              if(result){
                let c = 1;
                var responseData = [];
                result=result.reverse();
                latestBloodPressure=result[0].systolic;latestSugar=result[0].sugar;latestWeight=result[0].weight;
                async.forEachLimit(result, 1, (element, next) => {
                  //console.log("element",element);
                    c++;
                    if(c < result.length&&c<30){
                      //console.log('Data:::',element);
                      if(element.sugar||element.weight||element.systolic)
                       {
                         var ts=new Date(element.date);
                         var date=ts.getDate();
                         if(ts=='Invalid Date'){}
                         else{labelBP.push(ts);labelWt.push(ts);labelSugar.push(ts);
                         if(element.systolic==null)bloodPressure.push(0);else bloodPressure.push(element.systolic);
                         if(element.sugar==null)sugar.push(0);else sugar.push(element.sugar);
                         if(element.weight==null)weight.push(0);else weight.push(element.weight);}
                       }
                      next();
                    }else{
                      //console.log('datat:::',element);
                      var ts=new Date(element.date);
                      var date=ts.getDate();
                      if(ts=='Invalid Date'){}//labelBP.push(0);labelWt.push(0);labelSugar.push(0);
                      else{labelBP.push(ts);labelWt.push(ts);labelSugar.push(ts);
                      if(element.sugar||element.weight||element.systolic)
                      {
                        if(element.systolic==null)bloodPressure.push(0);else bloodPressure.push(element.systolic);
                        if(element.sugar==null)sugar.push(0);else sugar.push(element.sugar);
                        if(element.weight==null)weight.push(0);else weight.push(element.weight);
                      }}
                      var bp={
                        latestBloodPressure:latestBloodPressure,
                        bloodPressure:bloodPressure,
                        labelBP:labelBP
                      }
                      var wt={
                        latestWeight:latestWeight,
                        weight:weight,
                        labelWt:labelWt
                      }
                      var su={
                        latestSugar:latestSugar,
                        sugar:sugar,
                        labelSugar:labelSugar
                      }
                      var obj={
                        bp:bp,
                        wt:wt,
                        su:su
                      }
                      return res.json({message:"your data",status:200,data:obj})
                    }
                  });
            }
          })
            })
}


exports.updatePatient=updatePatient;
exports.addPatient = addPatient;
exports.getPatientById = getPatientById;
exports.getAllPatient = getAllPatient;
exports.addAppointment = addAppointment;
exports.addVitalSign = addVitalSign;
exports.complaints = complaints;
exports.labOrder = labOrder;
exports.treatmentPlan = treatmentPlan;
exports.uploadBill = uploadBill;
exports.uploadPrescription = uploadPrescription;
exports.acceptPullEHRrequestByDoctor = acceptPullEHRrequestByDoctor;
exports.viewAllDoctors = viewAllDoctors;
exports.getBloodGroup = getBloodGroup;
exports.viewPullEHRrequestByPatient = viewPullEHRrequestByPatient;
exports.deniedPullEHRrequestByDoctor = deniedPullEHRrequestByDoctor;
exports.searchDoctorBySpeciality = searchDoctorBySpeciality;
exports.getPatientVisit = getPatientVisit;
exports.updatePatientProfile = updatePatientProfile;
exports.uploadGeneralInfo = uploadGeneralInfo;
exports.fetchGeneralInfo = fetchGeneralInfo;
exports.fetchPatientVitialInfo = fetchPatientVitialInfo;
