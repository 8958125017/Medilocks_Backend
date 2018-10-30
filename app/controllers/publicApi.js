
var User = require('../models/users.js');
// var Loker = require('../models/ipfs.js')
var Mail = require('../models/SendMail.js');
var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var config = require('../../config/passport_config.js');
var jwt = require('jsonwebtoken');
var fs = require('fs');
var formidable = require("formidable");
var crypto = require('crypto');
var HttpStatus = require('http-status-codes');
var CONST = require('../../config/constants');
var GlobalMessages = require('../../config/constantMessages');
var messageHandler = require('../../config/messageHandler');
var multer  =   require('multer');
const fileUpload = require('express-fileupload');
var fs = require('fs');
var mkdirp = require('mkdirp');
var path = require('path');
var async = require('async');
var Doctor = require("../models/doctor");
var Patient = require("../models/patient");
var Hospital = require("../models/hospital");
var Pharmacy = require("../models/pharmacy.js");
var Lab = require("../models/lab.js");
var Contact = require("../models/contact.js")
var mailer = require("nodemailer");
var saltRounds=12;
// var Hospital = require("../models/token");
var Token = require("../models/token");
var Subscribe = require("../models/subscribe");
var Visit = require('../models/visitcount.js');


/*________________________________________________________________________
 * @Date:      	10 Nov,2017
 * @Method :   	Register
 * Modified On:	-
 * @Purpose:   	This function is used for sign up user.
 _________________________________________________________________________
 */

var check = function (req,res){
    res.send({name:req.body.name});
}

var updateMany = function (req,res){

    User.updateMany(
        {key: req.body.key},
        {$set: { "gender": req.body.gender}},
        function (err,data) {
            if (err) {
                res.status(HttpStatus.NOT_FOUND).send({msg:err,status:HttpStatus.NOT_FOUND});
            }
            else if(data){
                res.send({msg:'Updated',status:400,data : data});
            }
        });
}

var getUpdatedValues = function (req,res){

    User.findOneAndUpdate(
        { email: req.body.email },
        { $set: {"key": req.body.key} },
        { new: true },
        function (err,data) {
            if (err) {
                res.send({msg: err, status: 400 });
            }
            else if(data){
                res.send({msg:'Updated',status:400, data : data});
            }
        });
}

var register = function (req, res) {
    var user = {};
    user = req.body;
    console.log(req.body, 'user');
    var token;
    // var condition = { $and: [ { email: { $ne: 1.99 } }, { price: { $exists: true } } ] };
console.log("data");
    if(!user || !user.email || !user.password  ) {
        res.send({msg:"Please provide all the details",status:400})
    } else {
        User.findOne({email: user.email,key : user.key},{}, function (err,data) {
            if (err) {
                res.send({msg:err,status:400});
            }
            else if(data){
                res.send({msg:"Someone is already using email: "+user.email+" and key: "+user.key,status:400});
            } else {
              if(req.body.password != req.body.confirmpassword )
                {
                return  res.json({status:400,responseMessage:"password and confirmpassword are not match"});
              }else{
                    crypto.randomBytes(10, function (err, buf) {
                    token = buf.toString('hex');
                    user.verificationToken = token;
                    user.verifyEmail = {
                        email: req.body.email.toLowerCase(),
                        verificationStatus: false
                    };
                    var errorMessage = "";
                    User(user).save(function (err, data) {
                        if (err) {
                             res.send(messageHandler.errMessage(err));
                        } else {
                            var verifyurl = 'api/verifyemail/' + user.verificationToken;
                            Mail.registerMail(user,verifyurl, function(msg) {
                                console.log('Mail sent successfully.')
                            });
                            res.send({msg: "you have registered successfully",status:200});
                        }
                    });
                });
              }
            }
        });
    }
}

/*________________________________________________________________________
 * @Date:       10 Nov,2017
 * @Method :    verifyEmail
 * Modified On: -
 * @Purpose:    This function is used to verify user.
 _________________________________________________________________________
 */

var verifyEmail = function (req, res) {
    User.findOne({verificationToken: req.params.token}, function (err, data) {
        if (err) {
            res.status(203).send({msg: "Something went wrong."});
        } else {
            if (!data) {
                res.status(203).send({msg: "Token is expired."});
            } else {
                var verificationStatus = data.verifyEmail.verificationStatus;
                var user_id = data._id;
                if (verificationStatus === true) { // already verified
                    console.log("account verified");
                    res.status(200).send({msg: "Account Already verified."});
                } else { // to be verified
                    data.email = data.verifyEmail.email;
                    data.verifyEmail = {
                        email: data.verifyEmail.email,
                        verificationStatus: true
                    };
                    data.save(function (err, data) {
                        if (err) {
                            res.status(203).send({msg: "Something went wrong."});
                        } else {
                            Mail.verifyAccountMail(data.email, function (msg) {
                                console.log('Mail sent successfully.')
                            });
                            res.status(200).send({msg: "you have verified your account successfully"});
                        }
                    });
                }
            }
        }
    });
};
/*________________________________________________________________________
 * @Date:       10 Nov,2017
 * @Method :    login
 * Modified On: -
 * @Purpose:    This function is used to authenticate user.
 _________________________________________________________________________
 */

var login = function(req, res){
    var requestType = req.body.requestType;
    var email = req.body.email;
    var password = req.body.password;
    console.log("data",req.body);
    if (!req.body.requestType || !req.body.email || !req.body.password) {
        return res.send({status : 400, message:"Please insert a data and key in the POST body to publish."});
    } else {
    loginfunction(req,res,requestType,email,password,(result)=>{
     //          res.send({status:200,message:"doctor login successfully"
     // })
     })
    }
}

function loginfunction(req,res,requestType,email,password,callback){
   switch(requestType){
     case "doctor" :
             Doctor.findOne({email: email},function(err, doctor) {
               if (err)  return res.json({ "message": "Error to find Doctor", status: 400});
               if (!doctor) return res.json({"message": "Please enter registered email!",status: 400});
               if(doctor.isDelete == true || doctor.isBlock == true){
               return res.json({ "message": "your account has been blocked", status: 400});
               }
               else if  (doctor.isApproved == true){
                bcrypt.compare(password, doctor.password, function(err, match) {
                      if (err) {
                        cb(err);
                        return reject(err);
                      }
                      if (!match) return res.json({"message": "Please enter correct password",status: 400});
                       else {
                      if(match){var data= {doctor: doctor,id: doctor._id}
                          return res.json({"message": "Doctor login successfully!.",status: 200,data : doctor});
                      }
                      }
                  })
              }
              else {
            return res.json({"message":"doctor is not verified", status:400});
              }
            });

        break;

     case "patient" :
                 Patient.findOne({email: email},function(err, patient) {
                 if (err) return res.json({"message": "Error to find patient",status: 400});
                 if (!patient) return res.json({"message": "Please enter registered email!",status: 400});
                 if(patient.isDelete == true || patient.isBlock == true){
                 return res.json({ "message": "your account has been blocked", status: 400});
                 }
                   else if (patient.isApproved == true){
                bcrypt.compare(password, patient.password, function(err, match) {
                      if (err) {
                        cb(err);
                        return reject(err);
                      }
                      if (!match) {
                        return res.json({"message": "Please enter correct password",status: 400});
                      } else {
                if(match){
                  var data= {patient: patient,id: patient._id}
                          return res.json({"message": "Patient login successfully!.",status: 200,data : patient});
                        }
                        }
                        })
                      }
                      else {
                    return res.json({"message":"patient is not verified", status:400});
                      }
                })
      break;
     case "hospital" :
                     Hospital.findOne({email: email},function(err, hospital) {
                        if (err) return res.json({"message": "Error to find hospital",status: 400});
                        if (!hospital) return res.json({"message": "Please enter registered email!",status: 400});
                        if(hospital.isDelete == true || hospital.isBlock == true){
                        return res.json({ "message": "your account has been blocked", status: 400});
                        }
                        else if (hospital.isApproved == true){
                        bcrypt.compare(password, hospital.password, function(err, match) {
                          if (err) {
                            cb(err);
                            return reject(err);
                          }
                          if (!match) {
                            return res.json({"message": "Please enter correct password",status: 400});
                          } else {
                        if(match){
                        var data= {hospital: hospital,id: hospital._id}
                              return res.json({"message": "Hospital login successfully!.",status: 200,data : hospital});
                        }
                        }

                      })
                    }
                    else {
                      return res.json({"message":"hospital is not verified", status:400});
                    }
                    })
     break;

     case "labs" :
                 Lab.findOne({email: email},function(err, lab) {
                    if (err) return res.json({"message": "Error to find lab",status: 400});
                    if (!lab)return res.json({"message": "Please enter registered email!",status: 400});
                    if(lab.isDelete == true || lab.isBlock == true){
                    return res.json({ "message": "your account has been blocked", status: 400});
                    }
                      else if (lab.isApproved == true){
                    bcrypt.compare(password, lab.password, function(err, match) {
                          if (err) {
                            cb(err);
                            return reject(err);
                          }
                          if (!match) return res.json({"message": "Please enter correct password",status: 400});
                     else {
                    if(match){
                           var data= {lab:lab,id: lab._id}
                              return res.json({  "message": "Lab login successfully!.",status: 200,data : lab
                        });
                    }
                    }
                    })
                  }
                  else {
                return res.json({"message":"lab is not verified", status:400});
                  }
                });
     break;

     case "pharmacy" :
             Pharmacy.findOne({email: email},function(err, pharmacy) {
                if (err) return res.json({ "message": "Error to find Doctor",status: 400});
                if (!pharmacy) return res.json({"message": "Please enter registered email!",status: 400});
                if(pharmacy.isDelete == true || pharmacy.isBlock == true){
                return res.json({ "message": "your account has been blocked", status: 400});
                }
                else if (pharmacy.isApproved == true) {
                bcrypt.compare(password, pharmacy.password, function(err, match) {
                      if (err) {
                        cb(err);
                        return reject(err);
                      }
                      if (!match) {
                        return res.json({"message": "Please enter correct password",status: 400
                        });
                      } else {
                if(match){
                  var data= {pharmacy: pharmacy,id: pharmacy._id}
                  return res.json({"message": "Pharmacy login successfully!.",status: 200,data : pharmacy});
                }
            }

          })
        }
        else {
      return res.json({"message":"pharmacy is not verified", status:400});
        }
            })
     break;

    case 'admin':
        if(email === CONST.adminCred.email && password === CONST.adminCred.password) return res.send({status:200, message :"Good Job!.", data : {requestType : requestType,email : email,password: password}});
        else return res.send({status:400, message :"Sorry!. Incorrect email and password!."});
    break;

     default :
     break;
   }
}

// var login = function (req, res) {
//     var user = req.body;
//     if (!user || !user.email) {
//         res.send({msg: "Please provide valid email and password",status:HttpStatus.NOT_FOUND});
//     } else {
//         User.findOne({email: user.email},
//             {}, function (err, data) {
//                 if (err) {
//                     res.send({msg: err,status:HttpStatus.NOT_FOUND});
//                 } else {
//                     if(data){
//                         if(data.verifyEmail.verificationStatus == false) {
//                             res.send({msg: "Your email is not verified.",status:HttpStatus.NOT_FOUND});
//                         }else {
//                             if (data) {
//                                 bcrypt.compare(user.password, data.password, function (err, result) {
//                                     if (err) {
//                                         res.send({msg: err,status:HttpStatus.NON_AUTHORITATIVE_INFORMATION});
//                                     } else {
//                                         if (result === true) {
//                                             data.active = true;
//                                             data.lastSeen = new Date().getTime();
//                                             data.save(function (err, success) {
//                                                 if (!err) {
//                                                     var token = jwt.sign({_id: data._id}, config.secret);
//                                                     // to remove password from response.
//                                                     data = data.toObject();
//                                                     delete data.password;
//                                                     res.json({msg:"user login successfully",status:HttpStatus.OK,data : data});
//                                                 }
//                                             });
//                                         } else {
//                                             res.send({msg: 'Authentication failed due to wrong details.',status:HttpStatus.NOT_FOUND});
//                                         }
//                                     }
//                                 });
//                             } else {
//                                 res.send({msg: 'No account found with given email.',status:HttpStatus.NOT_FOUND});
//                             }
//                     }
//                 }
//                 else{
//                    res.send({msg: "Your email is not register with us. Please signup first",status:HttpStatus.NOT_FOUND});
//                 }
//             }
//         });
//     }
// };


/*________________________________________________________________________
 * @Date:       10 Nov,2017
 * @Method :    forgot_password
 * Modified On: -
 * @Purpose:    This function is used when user forgots password.
 _________________________________________________________________________
 */
// var forgotPassword = function (req, res) {
//     crypto.randomBytes(10, function (err, buf) {
//         var token = buf.toString('hex');
//         User.findOne({email: req.body.email}, function (err, data) {
//             if (err) {
//                 res.status(HttpStatus.NON_AUTHORITATIVE_INFORMATION).send({msg: 'Please enter a valid email.',status:HttpStatus.NON_AUTHORITATIVE_INFORMATION});
//             } else if (!data) {
//                 res.status(HttpStatus.NON_AUTHORITATIVE_INFORMATION).send({msg: 'Email does not exist.',status:HttpStatus.NON_AUTHORITATIVE_INFORMATION});
//             } else {
//                 if (data) {
//                     data.resetPasswordToken = token,
//                     data.resetPasswordExpires = Date.now() + 3600000;
//
//                     data.save(function (err, data) {
//                         if (err) {
//                             res.status(HttpStatus.NON_AUTHORITATIVE_INFORMATION).send({msg: 'Something went wrong.',status:HttpStatus.NON_AUTHORITATIVE_INFORMATION});
//                         } else {
//                             Mail.resetPwdMail(req.body, token, function (msg) {
//                                 console.log('Reset password mail sent successfully.')
//                             });
//                         }
//                         res.status(HttpStatus.OK).send({msg: 'Email sent successfully.',status:HttpStatus.OK});
//                     });
//                 }
//             }
//         });
//
//     });
// };




var forgotPassword=function(req,res){
  var email=req.body.email;
  var requestType = req.body.requestType;
  var token=Math.floor(Math.random()*100000000);
  if(!email || !requestType){
      return res.json({message:"invalid parameter",status:400})
  }
  var smtpTransport = mailer.createTransport("SMTP",{
      service: "Gmail",
      auth: {
          user: "vivekshengupta011@gmail.com",
          pass: "m*nukumar"
      }
  });
  var obj={
    email:email,
    token:token,
    requestType:req.body.requestType,
    expire_at:new Date().getTime()+1000000
  }

  switch(requestType){
    case "doctor" :
            Doctor.findOne({email: email},function(err, doctor) {
              if (err)  return res.json({ "message": "Error to find Doctor", status: 400});
              if (!doctor) return res.json({"message": "Please enter registered email!",status: 400});
              var mail = {
                  from: "Medilocks <vivekshengupta011@gmail.com>",
                  to: email,
                  subject: 'Regarding Medilocks update password',
                  text: 'Update Password Link:http://103.201.142.41:5006/updatePassword/'+token,
              }


                Token.create(obj,function(err,data){
                  if(err) return res.send({message:"Error to update",status:400})
              smtpTransport.sendMail(mail, function(error, response){
                  if(error){
                      console.log(error);
                  }
                  smtpTransport.close();
                  return res.json({message:"Check your mail",status:200,data:data})
              });
                })
           });

       break;

    case "patient" :
                Patient.findOne({email: email},function(err, patient) {
                if (err) return res.json({"message": "Error to find patient",status: 400});
                if (!patient) return res.json({"message": "Please enter registered email!",status: 400});
                var mail = {
                    from: "Medilocks <vivekshengupta011@gmail.com>",
                    to: email,
                    subject: 'Regarding Medilocks update password',
                    text: 'Update Password Link:http://103.201.142.41:5006/updatePassword/'+token,
                }


                  Token.create(obj,function(err,data){
                    if(err) return res.send({message:"Error to update",status:400})
                smtpTransport.sendMail(mail, function(error, response){
                    if(error){
                        console.log(error);
                    }
                    smtpTransport.close();
                    return res.json({message:"Check your mail",status:200,data:data})
                });
                  })
               })
     break;
    case "hospital" :
                    Hospital.findOne({email: email},function(err, hospital) {
                      console.log("hospital",hospital);
                       if (err) return res.json({"message": "Error to find hospital",status: 400});
                       if (!hospital) return res.json({"message": "Please enter registered email!",status: 400});
                       var mail = {
                           from: "Medilocks <vivekshengupta011@gmail.com>",
                           to: email,
                           subject: 'Regarding Medilocks update password',
                           text: 'Update Password Link:http://103.201.142.41:5006/updatePassword/'+token,
                       }


                         Token.create(obj,function(err,data){
                           if(err) return res.send({message:"Error to update",status:400})
                       smtpTransport.sendMail(mail, function(error, response){
                           if(error){
                               console.log(error);
                           }
                           smtpTransport.close();
                           return res.json({message:"Check your mail",status:200,data:data})
                       });
                         })
                   })
    break;

    case "labs" :
                Lab.findOne({email: email},function(err, lab) {
                   if (err) return res.json({"message": "Error to find lab",status: 400});
                   if (!lab)return res.json({"message": "Please enter registered email!",status: 400});
                   var mail = {
                       from: "Medilocks <vivekshengupta011@gmail.com>",
                       to: email,
                       subject: 'Regarding Medilocks update password',
                       text: 'Update Password Link:http://103.201.142.41:5006/updatePassword/'+token,
                   }


                     Token.create(obj,function(err,data){
                       if(err) return res.send({message:"Error to update",status:400})
                   smtpTransport.sendMail(mail, function(error, response){
                       if(error){
                           console.log(error);
                       }
                       smtpTransport.close();
                       return res.json({message:"Check your mail",status:200,data:data})
                   });
                     })
               });
    break;

    case "pharmacy" :
            Pharmacy.findOne({email: email},function(err, pharmacy) {
               if (err) return res.json({ "message": "Error to find Doctor",status: 400});
               if (!pharmacy) return res.json({"message": "Please enter registered email!",status: 400});
               var mail = {
                   from: "Medilocks <vivekshengupta011@gmail.com>",
                   to: email,
                   subject: 'Regarding Medilocks update password',
                   text: 'Update Password Link:http://103.201.142.41:5006/updatePassword/'+token,
               }
                 Token.create(obj,function(err,data){
                   if(err) return res.send({message:"Error to update",status:400})
               smtpTransport.sendMail(mail, function(error, response){
                   if(error){
                       console.log(error);
                   }
                   smtpTransport.close();
                   return res.json({message:"Check your mail",status:200,data:data})
               });
                 })
           })
    break;

   case 'admin':
       if(email === CONST.adminCred.email && password === CONST.adminCred.password) return res.send({status:200, message :"Good Job!.", data : {requestType : requestType,email : email,password: password}});
       else return res.send({status:400, message :"Sorry!. Incorrect email and password!."});
   break;

    default :
    break;
  }
}








function updateForgotPassword(req,res){
  var password=req.body.password;
  var confirmPassword=req.body.confirmPassword;
  var token=req.body.token;
  var expiryTime = new Date().getTime();
  if(password!=confirmPassword) return res.json({ "message": "Password doen't match!", status: 400});
Token.findOne({token:token,expire_at:{$gte:expiryTime}})
.then((success)=>{
  if(success)
  {
    switch(success.requestType){
     case "doctor" :
     Doctor.findOne({email:success.email},function(err, doctor) {
               if (err)  return res.json({ "message": "Error to find Doctor", status: 400});
               if (!doctor) return res.json({"message": "Please enter registered email!",status: 400});
      else{var query= {email:doctor.email}
      bcrypt.genSalt(saltRounds, function(err, salt) {
            bcrypt.hash(password,salt,null, function(err, hash) {
              if(err) return res.send({status : 400, message : "error to get password hash"});
              else {
                Doctor.updateOne(query,{$set:{password:hash,token:''}},function(err,result){
                  if(err) return res.send({status : 400, message : "db failed!"});
                  return res.send({status : 200, message : "Password Updated successfully!"});

                })
              }
            })
          })
        }
          });
break;
case "patient" :
Patient.findOne({email:success.email},function(err, patient) {
           if (err)  return res.json({ "message": "Error to find Doctor", status: 400});
           if (!patient) return res.json({"message": "Please enter registered email!",status: 400});
  else{var query= {email:patient.email}
  bcrypt.genSalt(saltRounds, function(err, salt) {
        bcrypt.hash(password,salt,null, function(err, hash) {
          if(err) return res.send({status : 400, message : "error to get password hash"});
          else {
            Patient.updateOne(query,{$set:{password:hash,token:''}},function(err,result){
              if(err) return res.send({status : 400, message : "db failed!"});
              return res.send({status : 200, message : "Password Updated successfully!"});

            })
          }
      });
  })
  }
})
break;
case "hospital" :
Hospital.findOne({email:success.email},function(err, hospital) {
          if (err)  return res.json({ "message": "Error to find Doctor", status: 400});
          if (!hospital) return res.json({"message": "Please enter registered email!",status: 400});
else{var query= {email:hospital.email}
bcrypt.genSalt(saltRounds, function(err, salt) {
       bcrypt.hash(password,salt,null, function(err, hash) {
         if(err) return res.send({status : 400, message : "error to get password hash"});
         else {
           Hospital.updateOne(query,{$set:{password:hash,token:''}},function(err,result){
             if(err) return res.send({status : 400, message : "db failed!"});
             return res.send({status : 200, message : "Password Updated successfully!"});

           })
         }
     });
})
}
})
break;
case "lab" :
Lab.findOne({email:success.email},function(err, lab) {
          if (err)  return res.json({ "message": "Error to find Doctor", status: 400});
          if (!lab) return res.json({"message": "Please enter registered email!",status: 400});
else{var query= {email:lab.email}
bcrypt.genSalt(saltRounds, function(err, salt) {
       bcrypt.hash(password,salt,null, function(err, hash) {
         if(err) return res.send({status : 400, message : "error to get password hash"});
         else {
           Lab.updateOne(query,{$set:{password:hash,token:''}},function(err,result){
             if(err) return res.send({status : 400, message : "db failed!"});
             return res.send({status : 200, message : "Password Updated successfully!"});

           })
         }
     });
})
}
})
break;
case "pharmacy" :
Pharmacy.findOne({email:success.email},function(err, pharmacy) {
          if (err)  return res.json({ "message": "Error to find Doctor", status: 400});
          if (!pharmacy) return res.json({"message": "Please enter registered email!",status: 400});
else{var query= {email:success.email}
bcrypt.genSalt(saltRounds, function(err, salt) {
       bcrypt.hash(password,salt,null, function(err, hash) {
         if(err) return res.send({status : 400, message : "error to get password hash"});
         else {
           Pharmacy.updateOne(query,{$set:{password:hash,token:''}},function(err,result){
             if(err) return res.send({status : 400, message : "db failed!"});
             return res.send({status : 200, message : "Password Updated successfully!"});

           })
         }
     });
})
}
})
break;


}
  }
  else {
    return res.json({ "message": "Link is not valid or expired.", status: 400});
  }
})
.catch((err) => {
  throw new Error('Higher-level error. ' + err.message);
})
}



/*________________________________________________________________________
 * @Date:       10 Nov,2017
 * @Method :    resetPassword
 * Modified On: -
 * @Purpose:    This function is used when user reset password.
 _________________________________________________________________________
 */


// var resetPassword = function (req, res) {
//     if (req.body.newPassword && req.body.token) {
//         User.findOne({resetPasswordToken: req.body.token}, function (err, data) {
//             if (err) {
//                 res.status(HttpStatus.NON_AUTHORITATIVE_INFORMATION).send({msg: 'No record found.',status:HttpStatus.NON_AUTHORITATIVE_INFORMATION});
//             } else {
//                 if (!data) {
//                     res.status(HttpStatus.NON_AUTHORITATIVE_INFORMATION).send({msg: 'Reset Password token has been expired.',status:HttpStatus.NON_AUTHORITATIVE_INFORMATION});
//                 } else {
//                     data.password = req.body.newPassword;
//                     data.resetPasswordToken = undefined;
//                     data.resetPasswordExpires = undefined;
//                     data.save(function (err, data) {
//                         if (err) {
//                             res.status(HttpStatus.NON_AUTHORITATIVE_INFORMATION).send({msg: 'No record found.',status:NON_AUTHORITATIVE_INFORMATION});
//                         } else {
//                             Mail.resetConfirmMail(data, function (msg) {
//                                 console.log('Reset Confirmation mail sent successfully.')
//                             });
//                             res.status(HttpStatus.OK).send({msg: 'Password has been successfully updated.',status:HttpStatus.OK});
//                         }
//                     });
//                 }
//             }
//         });
//     }
//     else{
//         res.status(HttpStatus.BAD_REQUEST).send({msg: GlobalMessages.CONST_MSG.fillAllFields,status:HttpStatus.BAD_REQUEST});
//     }
// };

/*________________________________________________________________________
 * @Date:       16 Nov,2017
 * @Method :    imageUpload
 * Modified On: -
 * @Purpose:    This function is used when user reset password.
 _________________________________________________________________________
 */
var storage =   multer.diskStorage({
      destination: function (req, file, callback) {
        callback(null, './uploads');
      },
      filename: function (req, file, callback) {
        callback(null, file.fieldname + '-' + Date.now());
      }
    });
    var upload = multer({ storage : storage},{limits: {
          fieldNameSize: 100,
          files: 2,
          fields: 5
    }}).single('userPhoto');

 var imageUpload = function (req, res) {
     upload(req,res,function(err) {
        if(err) {
            return res.send({msg:GlobalMessages.CONST_MSG.fileUploadError,err:err.message});
        }
        res.send({msg:GlobalMessages.CONST_MSG.fileUploadSuccess, status:HttpStatus.OK});
    });

 }


var getProfile =  function(req,res) {
    console.log(req.user);
    var uid = req.body.userid;
    console.log("uid"+uid);
    if(!uid){
        res.send({msg:"OOPS! Something went wrong. Please try again"});
} else {
        User.findOne({_id:uid},{email :1,mobileNumber :1,gender: 1,name :1},function (err,data) {
            if(err) {
                res.status(400).send({msg:err})
            }else {
                if(data){
                    data.active = true;
                    data.lastSeen = new Date().getTime();
                    data.save(function (err,success) {
                        if(err){
                            console.log(err,"saveing error");
                        }else {
                            res.status(200).json(data);
                        }
                    });
                }else{
                    res.status(200).json({msg:"No user found"})
                }

            }
        })
    }
};
var userupdate = function(req,res){
var updatevalue = req.body.updatename;
var uid = req.body.userid;
var no = req.body.updatemobile;
if(!uid && !updatevalue){
    res.send({msg:"OOPS! Something went wrong. Please try again"});
} else{
User.updateOne({_id:uid},
   {$set: {name:updatevalue,mobileNumber:no}}).then((success)=>
   res.json({
        "msg": "Profile has been update successfully!.",
        status:200
      }))
      .catch((error)=>res.json({
        "msg":"something went wrong",
        status:400
        })
      )
    }
}
var logout = function (req, res) {
    var uid = req.body.id;
    User.findOne({_id:uid},{lastSeen:1,active:1},function (err,data) {
        if(err) {
            res.status(400).send({msg:err})
        }else {
            if(data){
                data.active = false;
                data.lastSeen = new Date().getTime();
                data.save(function (err,success) {
                    if(err){
                        console.log(err,"saveing error");
                    }else {
                      res.json({
                           "message": "logout successfully",
                           data:data,
                           status:200
                         })
                }
              });
            }else{
                res.status(200).json({msg:"No user found"})
            }

        }
    })

  }

var login = function(req, res){
    var requestType = req.body.requestType;
    var email = req.body.email;
    var password = req.body.password;
    if (!req.body.requestType || !req.body.email || !req.body.password) {
        return res.send({status : 400, message:"Please insert a data and key in the POST body to publish."});
    } else {
    loginfunction(req,res,requestType,email,password,(result)=>{
              res.send({status:200,msg:"doctor login successfully"
              })
     })

}
}








// var viewProfile = (req, res)=>{
//     let requestType = req.body.requestType;
//     var condition = {_id : req.body.id};
//     var mobileNo = req.body.id;
//
//     switch(requestType){
//       case "doctor" :
//             if(mobileNo){
//               Doctor.findOne(condition,{},function(err, data){
//                   if(err) return res.send({status : 400, message : "failed to approved doctor!"});
//                   return res.send({status : 200, message : "Approved successfully!.",data :data});
//               });
//             }else{
//               return res.send({status : 400, message : "send mobileNo for approved!."});
//             }
//       break;
//       case "patient" :
//              if(mobileNo){
//               Patient.findOne(condition,{},function(err, data){
//                   if(err) return res.send({status : 400, message : "failed to approved patient!"});
//                   return res.send({status : 200, message : "Approved successfully!.",data :data});
//               });
//             }else{
//               return res.send({status : 400, message : "send mobileNo for approved!."});
//             }
//       break;
//       case "hospital" :
//             if(mobileNo){
//                     Hospital.findOne(condition,{},function(err, data){
//                         if(err) return res.send({status : 400, message : "failed to approved hospital!"});
//                         return res.send({status : 200, message : "Approved successfully!.",data :data});
//                     });
//                   }else{
//                     return res.send({status : 400, message : "send mobileNo for approved!."});
//              }
//       break;
//
//       case "pharamacy" :
//             if(mobileNo){
//                     Pharamacy.findOne(condition,{},function(err, data){
//                         if(err) return res.send({status : 400, message : "failed to approved pharamacy!"});
//                         return res.send({status : 200, message : "Approved successfully!.",data :data});
//
//                       })
//                     }
//       break;
//
//       case "labs" :
//              if(mobileNo){
//               Lab.findOne(condition,{},function(err, data){
//                   if(err) return res.send({status : 400, message : "failed to approved lab!"});
//                   return res.send({status : 200, message : "Approved successfully!.",data:data});
//               });
//             }else{
//               return res.send({status : 400, message : "send mobileNo for approved!."});
//             }
//       break;
//
//       default :
//       break;
//     }
//
//
// }



var viewProfile = (req, res)=>{
    let requestType = req.body.requestType;
    var condition = {_id : req.body.id};
    switch(requestType){
      case "doctor" :
              Doctor.findOne(condition,{},function(err, data){
                  if(err) return res.send({status : 400, message : "failed to approved doctor!"});
                  return res.send({status : 200, message : "Fetched data successfully!.",data :data});
              });
      break;
      case "patient" :
              Patient.findOne(condition,{},function(err, data){
                  if(err) return res.send({status : 400, message : "failed to approved patient!"});
                  return res.send({status : 200, message : "Fetch Data successfully!.",data :data});
              });
      break;
      case "hospital" :
                    Hospital.findOne(condition,{},function(err, data){
                        if(err) return res.send({status : 400, message : "failed to approved hospital!"});
                        return res.send({status : 200, message : "Fetch Data successfully!.",data :data});
                    });
      break;

      case "pharamacy":
                    Pharamacy.findOne(condition,{},function(err, data){
                        if(err) return res.send({status : 400, message : "failed to approved pharamacy!"});
                        return res.send({status : 200, message : "Fetch data successfully!.",data :data});

                      })
      break;

      case "labs" :
              Lab.findOne(condition,{},function(err, data){
                  if(err) return res.send({status : 400, message : "failed to approved lab!"});
                  return res.send({status : 200, message : "Fetch data successfully!.",data:data});
              });

      break;

      default :
      break;
    }


}


  var Notify=function(email){
    console.log("email",email);
    var smtpTransport = mailer.createTransport("SMTP",{
      service: "Gmail",
      auth: {
          user: "vivekshengupta011@gmail.com",
          pass: "m*nukumar"
      }
  });

  var mail = {
      from: "Medilocks <vivekshengupta011@gmail.com>",
      to: email,
      subject: 'Regarding Medilocks admins Status',
      text: 'You are approved in medilocks',

  }

  smtpTransport.sendMail(mail, function(error, response){
      if(error){
          console.log(error);
      }else{
          console.log("Message sent: " + response.message);
      }

      smtpTransport.close();
  });

}

// var resetPassword = function(req,res){
//   console.log('rp');
//   var requestType=req.body.requestType;
//   var oldPassword=req.body.oldPassword;
//   var password=req.body.password;
//   var confirmPassword=req.body.confirmPassword;
//   var email=req.body.email;
//   if(password!=confirmPassword){
//     return res.json({ "message": "Password does not match!", status: 400});
//   }
//   else{
//    switch(requestType){
//      case "doctor" :
//      Doctor.findOne({email:req.body.email},function(err, doctor) {
//                if (err)  return res.json({ "message": "Error to find Doctor", status: 400});
//                if (!doctor) return res.json({"message": "Please enter registered email!",status: 400});
//                bcrypt.compare(oldPassword,doctor.password, function(err, result) {
//                if(err) return res.json({"message":"Error to match password"})
//                if(!result) return res.json({"message":"Password doesn't match"})
//       else{var query= {_id:doctor._id}
//       bcrypt.genSalt(saltRounds, function(err, salt) {
//             bcrypt.hash(password,salt,null, function(err, hash) {
//               if(err) return res.send({status : 400, message : "error to get password hash"});
//               else {
//                 Doctor.updateOne(query,{$set:{password:hash}},function(err,result){
//                   if(err) return res.send({status : 400, message : "db failed!"});
//                   return res.json({"message": "Password updated succesfully!",status: 200});
//
//                 })
//               }
//             })
//           });
//         }
//       })
//     })
// break;
// case "patient" :
// Patient.findOne({email:req.body.email},function(err, patient) {
//            if (err)  return res.json({ "message": "Error to find Doctor", status: 400});
//            if (!patient) return res.json({"message": "Patient Please enter registered email!",status: 400});
//            console.log("patient",patient);
//            bcrypt.compare(oldPassword,patient.password, function(err, result) {
//              console.log("data||||||||||||||||||",err,result);
//            if(err) return res.json({"message":"Error to compare"})
//            if(!result) {
//              return res.json({"message":"Error! Password doesn't match"})
//            }
//   else
//   {
//     var query= {_id:patient._id}
//   bcrypt.genSalt(saltRounds, function(err, salt) {
//         bcrypt.hash(password,salt,null, function(err, hash) {
//           if(err) return res.send({status : 400, message : "error to get password hash"});
//           else {
//             Patient.updateOne(query,{$set:{password:hash}},function(err,result){
//               if(err) return res.send({status : 400, message : "db failed!"});
//               return res.send({status : 200, message : "Password Updated successfully!"});
//
//             })
//           }
//       });
//   })
//   }
//   });
// })
// break;
// case "hospital" :
// Hospital.findOne({email:req.body.email},function(err, hospital) {
//           if (err)  return res.json({ "message": "Error to find Doctor", status: 400});
//           if (!hospital) return res.json({"message": "Please enter registered email!",status: 400});
//           bcrypt.compare(oldPassword,doctor.password, function(err, result) {
//           if(err) return res.json({"message":"Error to match password"})
//           if(!result) return res.json({"message":"Password doesn't match"})
// else{var query= {_id:hospital._id}
// bcrypt.genSalt(saltRounds, function(err, salt) {
//        bcrypt.hash(password,salt,null, function(err, hash) {
//          if(err) return res.send({status : 400, message : "error to get password hash"});
//          else {
//            Hospital.updateOne(query,{$set:{password:hash}},function(err,result){
//              if(err) return res.send({status : 400, message : "db failed!"});
//              return res.send({status : 200, message : "Password Updated successfully!"});
//
//            })
//          }
//      });
// })
// }
// })
// })
// break;
// case "lab" :
// Lab.findOne({email:req.body.email},function(err, lab) {
//           if (err)  return res.json({ "message": "Error to find Doctor", status: 400});
//           if (!lab) return res.json({"message": "Please enter registered email!",status: 400});
//           bcrypt.compare(oldPassword,doctor.password, function(err, result) {
//           if(err) return res.json({"message":"Error to match password"})
//           if(!result) return res.json({"message":"Password doesn't match"})
// else{var query= {_id:lab._id}
// bcrypt.genSalt(saltRounds, function(err, salt) {
//        bcrypt.hash(password,salt,null, function(err, hash) {
//          if(err) return res.send({status : 400, message : "error to get password hash"});
//          else {
//            Lab.updateOne(query,{$set:{password:hash}},function(err,result){
//              if(err) return res.send({status : 400, message : "db failed!"});
//              return res.send({status : 200, message : "Password Updated successfully!"});
//
//            })
//          }
//      });
// })
// }
// })
// })
// break;
// case "pharmacy" :
// Pharmacy.findOne({email:req.body.email},function(err, pharmacy) {
//           if (err)  return res.json({ "message": "Error to find Doctor", status: 400});
//           if (!pharmacy) return res.json({"message": "Please enter registered email!",status: 400});
//           bcrypt.compare(oldPassword,doctor.password, function(err, result) {
//           if(err) return res.json({"message":"Error to password doesn.t match"})
//           if(!result) return res.json({"message":"Password doesn't match"})
// else{var query= {_id:pharmacy._id}
// bcrypt.genSalt(saltRounds, function(err, salt) {
//        bcrypt.hash(password,salt,null, function(err, hash) {
//          if(err) return res.send({status : 400, message : "error to get password hash"});
//          else {
//            Pharmacy.updateOne(query,{$set:{password:hash}},function(err,result){
//              if(err) return res.send({status : 400, message : "db failed!"});
//              return res.send({status : 200, message : "Password Updated successfully!"});
//
//            })
//          }
//      });
// })
// }
// })
// })
// break;
//
//
// }
// }
// }
//

var resetPassword = function(req,res){
  var requestType=req.body.requestType;
  var oldPassword=req.body.oldPassword;
  var password=req.body.password;
  var confirmPassword=req.body.confirmPassword;
  var email=req.body.email;
  if(password!=confirmPassword){
    return res.json({ "message": "Password does not match!", status: 400});
  }
  else
  {
   switch(requestType){
     case "doctor" :
     Doctor.findOne({email:req.body.email},function(err, doctor) {
               if (err)  return res.json({ "message": "Error to find Doctor", status: 400});
               if (!doctor) return res.json({"message": "Please enter registered email!",status: 400});
               bcrypt.compare(oldPassword,doctor.password, function(err, result) {
               if(err) return res.json({"message":"Error to match password"})
               if(!result) return res.json({"message":"Password doesn't match"})
      else{
        var query= {_id:doctor._id}
        bcrypt.genSalt(saltRounds, function(err, salt) {
            bcrypt.hash(password,salt,null, function(err, hash) {
              if(err) return res.send({status : 400, message : "error to get password hash"});
              else {
                Doctor.updateOne(query,{$set:{password:hash}},function(err,result){
                  if(err) return res.send({status : 400, message : "db failed!"});
                  return res.json({"message": "Password updated succesfully!",status: 200});

                })
              }
            })
          });
        }
      })
    })
break;
case "patient" :
Patient.findOne({email:req.body.email},function(err, patient) {
           if (err)  return res.json({ "message": "Error to find Doctor", status: 400});
           if (!patient) return res.json({"message": "Patient Please enter registered email!",status: 400});
           bcrypt.compare(oldPassword,patient.password, function(err, result) {
             console.log("result",err,result);
           if(err) return res.json({"message":"Error to compare"})
           if(!result) return res.json({"message":"Error! Password doesn't match"})
  else{
    var query= {_id:patient._id}
  bcrypt.genSalt(saltRounds, function(err, salt) {
        bcrypt.hash(password,salt,null, function(err, hash) {
          if(err) return res.send({status : 400, message : "error to get password hash"});
          else {
            Patient.updateOne(query,{$set:{password:hash}},function(err,result){
              if(err) return res.send({status : 400, message : "db failed!"});
              return res.send({status : 200, message : "Password Updated successfully!"});

            })
          }
      });
  })
  }
  });
})
break;
case "hospital" :
Hospital.findOne({email:req.body.email},function(err, hospital) {
          if (err)  return res.json({ "message": "Error to find Doctor", status: 400});
          if (!hospital) return res.json({"message": "Please enter registered email!",status: 400});
          bcrypt.compare(oldPassword,hospital.password, function(err, result) {
          if(err) return res.json({"message":"Error to match password"})
          if(!result) return res.json({"message":"Password doesn't match"})
else{
  var query= {_id:hospital._id}
  bcrypt.genSalt(saltRounds, function(err, salt) {
       bcrypt.hash(password,salt,null, function(err, hash) {
         if(err) return res.send({status : 400, message : "error to get password hash"});
         else {
           Hospital.updateOne(query,{$set:{password:hash}},function(err,result){
             if(err) return res.send({status : 400, message : "db failed!"});
             return res.send({status : 200, message : "Password Updated successfully!"});

           })
         }
     });
})
}
})
})
break;
case "lab" :
Lab.findOne({email:req.body.email},function(err, lab) {
          if (err)  return res.json({ "message": "Error to find Doctor", status: 400});
          if (!lab) return res.json({"message": "Please enter registered email!",status: 400});
          bcrypt.compare(oldPassword,doctor.password, function(err, result) {
          if(err) return res.json({"message":"Error to match password"})
          if(!result) return res.json({"message":"Password doesn't match"})
else{var query= {_id:lab._id}
bcrypt.genSalt(saltRounds, function(err, salt) {
       bcrypt.hash(password,salt,null, function(err, hash) {
         if(err) return res.send({status : 400, message : "error to get password hash"});
         else {
           Lab.updateOne(query,{$set:{password:hash}},function(err,result){
             if(err) return res.send({status : 400, message : "db failed!"});
             return res.send({status : 200, message : "Password Updated successfully!"});

           })
         }
     });
})
}
})
})
break;
case "pharmacy" :
Pharmacy.findOne({email:req.body.email},function(err, pharmacy) {
          if (err)  return res.json({ "message": "Error to find Doctor", status: 400});
          if (!pharmacy) return res.json({"message": "Please enter registered email!",status: 400});
          bcrypt.compare(oldPassword,doctor.password, function(err, result) {
          if(err) return res.json({"message":"Error to password doesn.t match"})
          if(!result) return res.json({"message":"Password doesn't match"})
else{var query= {_id:pharmacy._id}
bcrypt.genSalt(saltRounds, function(err, salt) {
       bcrypt.hash(password,salt,null, function(err, hash) {
         if(err) return res.send({status : 400, message : "error to get password hash"});
         else {
           Pharmacy.updateOne(query,{$set:{password:hash}},function(err,result){
             if(err) return res.send({status : 400, message : "db failed!"});
             return res.send({status : 200, message : "Password Updated successfully!"});

           })
         }
     });
})
}
})
})
break;


}
}
}


var subscribe = function(req,res){
var emailid = req.body.email;
Subscribe.findOne({email:emailid},function(error,result){
  console.log(result,error);
  if(result){
  return  res.json({
      message:"user is already subscribed",
      status:400
    })
  }
  if(error){
  return  res.json({
      message:"error to subscribed",
      status:400
    })
  }
    var obj ={
      email : emailid
    }
Subscribe.create(obj,function(err,subscribre){
if(err){
 return  res.json({
    message:"error to subscribe user.please try again",
    status:400
  })
}
    if(subscribe){
      var smtpTransport = mailer.createTransport("SMTP",{
        service: "Gmail",
        auth: {
            user: "vivekshengupta011@gmail.com",
            pass: "m*nukumar"
        }
    });

    var mail = {
        from: "Medilocks <vivekshengupta011@gmail.com>",
        to: emailid,
        subject: 'Regarding Medilocks admins Status',
        text: 'You are subscribed in medilocks',

    }

    smtpTransport.sendMail(mail, function(error, response){
        if(error){
          return  res.json({
             message:"please try again",
             status:400
           })
        }else{
          return  res.json({
             message:"user is subscribed succesfully",
             status:200
           })
        }
        smtpTransport.close();
    });
    }
})

})
 }



 var contactUs = function(req,res){
 var emailid = req.body.email;
 var name = req.body.name;
 var subject = req.body.subject;
 var message = req.body.message;
var obj = {
email:emailid,
name:name,
subject:subject,
message:message
}
Contact.create(req.body,function(error,result){
  console.log(error,result);
if(error){
  return  res.json({
     message:"please try again",
     status:400
   })
}
return  res.json({
   message:"your query send successfully to admin",
   status:200
 })

})

  }






var dashBoardData=function(req,res){
  var doctorId=req.body.doctorId;
  var ansy=new Array(12).fill(0)
  var ansm=new Array(31).fill(0);
  var answ=new Array(7).fill(0);
  var totalWeekVisitor=0;
  var totalMonthVisitor=0;
  var todayVisitor=0;
  //var answ=[];

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
       totalMonthVisitor+=Number(element.vc);
       next();
     })
   var monthlydata={
     ansm:ansm
    }
    Visit.find({doctorId:doctorId,date:{$lte:Date.now(),$gt:Date.now()-7*24*3600*1000}}).sort({'date':1}).exec(function(err,result){
   if(err) return res.send({status:400,message:'error to fetch!'});
   async.forEachLimit(result, 1, (element, next) => {
     if(element.date<=Date.now()&&element.date>=Date.now()-new Date().getHours()*3600*1000) {todayVisitor=element.vc;console.log('Today Visit:',todayVisitor);}
     var i=Number(new Date(element.date).getDay());
     answ[i]=answ[i]+Number(element.vc);
     totalWeekVisitor+=Number(element.vc);
     //answ.push(element.vc);
     //labelw.push(x[new Date(element.date).getDay()])
     next();
   })
   var weeklydata={
     labelw:labelw,
     answ:answ
   }
   var obj={
     yearlydata:yearlydata,
     monthlydata:monthlydata,
     weeklydata:weeklydata,
     todayVisitor:todayVisitor,
     totalMonthVisitor:totalMonthVisitor,
     totalWeekVisitor:totalWeekVisitor
   }
   return res.send({status:200,message:'Data fetch succesfully!',data:obj})
})
})
})
}


//  functions
exports.register = register;
exports.verifyEmail = verifyEmail;
exports.forgotPassword = forgotPassword;
exports.resetPassword = resetPassword;
exports.imageUpload = imageUpload;
exports.check = check;
exports.updateMany = updateMany;
exports.getUpdatedValues = getUpdatedValues;
exports.getProfile =getProfile;
exports.userupdate = userupdate;
exports.logout = logout;
exports.viewProfile = viewProfile;
exports.login=login;
exports.Notify = Notify;
exports.updateForgotPassword = updateForgotPassword;
exports.subscribe = subscribe;
exports.contactUs = contactUs;
exports.dashBoardData = dashBoardData;
