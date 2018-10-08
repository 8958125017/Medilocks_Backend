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
var Lab=require('../models/lab.js')
var CONST = require('../../config/constants');
const ipfs = ipfsAPI('ipfs.infura.io', '5001', {protocol: 'https'});
var multichain = CONST.multichainConn;
var nodemailer = require('nodemailer');
var transporter = nodemailer.createTransport("SMTP", {
  service: CONST.supportEmailIdService,
  auth: {
    user: CONST.supportEmailId,
    pass: CONST.supportEmailIdpass
  }
});
var Global = require('../../config/global.js');


var sendRequestToAdmin = function(req, res){
  var name = req.body.name;
  var contactNo = req.body.contactNo;
  var email = req.body.email;
  var city = req.body.city;
  var location = req.body.location;
  var address = req.body.address;
  var description = req.body.description;
  var password = req.body.password;
  var confirmPassword = req.body.confirmPassword;
  var open = req.body.open;
  var close = req.body.close;
  var filePath = req.body.image;
  var practiceSpecialties = req.body.practiceSpecialties;
  if (name=="" || contactNo=="" || email==""  || city=="" || password=="") {
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
  /// var filepath = base64Img.imgSync(req.body.image,'./profile_images/',email);
//console.log(filepath);
    Hospital.findOne({ contactNo: contactNo}, function(err, detail){
      if (err) return res.send({status : 400, message : "error to find doctor"});
      if (detail) return res.send({status : 400, message : "Hospital already exists"});
      if (!detail) {
        bcrypt.genSalt(saltRounds, function(err, salt) {
              bcrypt.hash(password,salt,null, function(err, hash) {
                if(err) return res.send({status : 400, message : "error to get password hash"});
            else {
              {
                if(filePath){
                Global.fileUpload(filePath,(data) => {
                  console.log("data",data);
              var hash12 = hash;
              Global.getNewAddressandpermissionOnMultichain((result)=>{
              console.log('resultresult',result);
              var obj = {
                  name:name,
                  contactNo:contactNo,
                  address:address,
                  description : description,
                  image:data,
                  city:city,
                  "timming.open":open,
                  "timming.close":close,
                  password:hash12,
                  email:email,
                  multichainAddress : result,
                  practiceSpecialties:practiceSpecialties
              }
              console.log("doctors record"+JSON.stringify(obj));
              Hospital.create(obj,function(err, data){
                  if(err) return res.send({status : 400, message : "failed to send request to admin!",error:err});
                  return res.send({status : 200, message : "request is send successfully!", data : data});
              });
            })
          });
      }
      }
    }
  });
})
}
})
}

var addDoctor = function(req, res){
  var name = req.body.name;
  var mobileNo = req.body.mobileNo;
  var doctoremail = req.body.email;
  var practiceSpecialty = req.body.practiceSpecialty;
  var degree = req.body.degree;
  var city = req.body.city;
  var hospital = req.body.hospital;
  var userName = req.body.userName;
  var password = req.body.password;
  var confirmPassword = req.body.confirmPassword;
  var from = req.body.from;
  var to = req.body.to;




  if (!name || !mobileNo || !doctoremail || !degree || !hospital) {
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
    Doctor.findOne({ mobileNo: mobileNo}, function(err, detail){
      if (err) return res.send({status : 400, message : "error to find doctor"});
      if (detail) return res.send({status : 400, message : "doctor already exists"});

      if (!detail) {
        bcrypt.genSalt(saltRounds, function(err, salt) {
              bcrypt.hash(password,salt,null, function(err, hash) {
                if(err) return res.send({status : 400, message : "error to get password hash"});
            else {
              var hash12 = hash;
              var obj = {
                  name:name,
                  mobileNo:mobileNo,
                  practiceSpecialties:practiceSpecialty,
                  degree:degree,
                  city:city,
                  hospitals:hospital,
                  "avaliablity.from":from,
                  "avaliablity.to":to,
                  password:hash12,
                  email:doctoremail
              }
              Doctor.create(obj,function(err, data){
                  if(err) return res.send({status : 400, message : "failed to send request to admin!",error:err});
                  return res.send({status : 200, message : "request is send successfully!", data : data});
              });
          }

        });
      });

    }

});
}

var addPharmacy=function(req,res){
    var name = req.body.name;
    var contactNo = req.body.contactNo;
    var email = req.body.email;
    var city = req.body.city;
    var password = req.body.password;
    var confirmPassword = req.body.confirmPassword;
    var license=req.body.license;
  var from = req.body.from;
  var to = req.body.to;
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

    Pharmacy.findOne({ contactNo: contactNo}, function(err, detail){
      if (err) return res.send({status : 400, message : "error to find doctor"});
      if (detail) return res.send({status : 400, message : "doctor already exists"});

      if (!detail) {
        bcrypt.genSalt(saltRounds, function(err, salt) {
              bcrypt.hash(password,salt,null, function(err, hash) {
                if(err) return res.send({status : 400, message : "error to get password hash"});
            else {
              var hash12 = hash;
              var obj = {
                  name:name,
                  contactNo:contactNo,
                  email:email,
                  city:city,
                  license:license,
                  "avaliablity.from":from,
                  "avaliablity.to":to,
                  password:hash12
              }
              console.log("Pharmacy record"+JSON.stringify(obj));
              Pharmacy.create(obj,function(err, data){
                  if(err) return res.send({status : 400, message : "failed to send request to admin!",error:err});
                  return res.send({status : 200, message : "request is send successfully!", data : data});
              });
          }

        });
      });

    }
});
}

var addLab=function(req,res){
  var name = req.body.name;
  var contactNo = req.body.contactNo;
  var email = req.body.email;
  var city = req.body.city;
  var password = req.body.password;
  var confirmPassword = req.body.confirmPassword;
  var license=req.body.license;
  var from = req.body.from;
  var to = req.body.to;
  var doctorId = req.body.doctorId;
  // var verificationURL = project_url + "/user/verifyEmailAddress?email=" + useremailaddress + "&otp=" + otpForEmail;

  if (!name || !contactNo || !license) {
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
              var hash12 = hash;
              var createNewOTP = Math.floor(100000 + Math.random() * 900000);
              var obj = {
                  name:name,
                  contactNo:contactNo,
                  email:email,
                  city:city,
                  license:license,
                  "avaliablity.from":from,
                  "avaliablity.to":to,
                  password:hash12,

              }
              console.log("Lab record"+JSON.stringify(obj));
              Lab.create(obj,function(err, data){
                  if(err) return res.send({status : 400, message : "failed to send request to admin!",error:err});
                  var verificationURL = "localhost:5005" + "/user/verifyEmailAddress?email=" + email + "&otp=" + createNewOTP;
                   var param="kavi";
                  var currentDate = new Date();
                  var mailOptions = {
                    from: CONST.supportEmailId,
                    to: email,
                    subject: 'Please verify your email Id  !!!',
                    html: ` <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
                              <html xmlns="http://www.w3.org/1999/xhtml">
                              <head>
                                <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
                                <meta name="viewport" content="width=device-width, initial-scale=1" />
                                <title>OTP Email</title>
                                <!-- Designed by https://github.com/kaytcat -->
                                <!-- Header image designed by Freepik.com -->
                                <style type="text/css">
                                /* Take care of image borders and formatting */
                                img { max-width: 600px; outline: none; text-decoration: none; -ms-interpolation-mode: bicubic;}
                                a img { border: none; }
                                table { border-collapse: collapse !important; }
                                #outlook a { padding:0; }
                                .ReadMsgBody { width: 100%; }
                                .ExternalClass {width:100%;}
                                .backgroundTable {margin:0 auto; padding:0; width:100% !important;}
                                table td {border-collapse: collapse;}
                                .ExternalClass * {line-height: 115%;}
                                /* General styling */
                                td {
                                  font-family: Arial, sans-serif;
                                }
                                body {
                                  -webkit-font-smoothing:antialiased;
                                  -webkit-text-size-adjust:none;
                                  width: 100%;
                                  height: 100%;
                                  color: #6f6f6f;
                                  font-weight: 400;
                                  font-size: 18px;
                                }
                                h1 {
                                  margin: 10px 0;
                                }
                                a {
                                  color: #27aa90;
                                  text-decoration: none;
                                }
                                .force-full-width {
                                  width: 100% !important;
                                }
                                .body-padding {
                                  padding: 0 75px;
                                }
                                </style>
                                <style type="text/css" media="screen">
                                    @media screen {
                                      @import url(http://fonts.googleapis.com/css?family=Source+Sans+Pro:400,600,900);
                                      /* Thanks Outlook 2013! */
                                      * {
                                        font-family: 'Source Sans Pro', 'Helvetica Neue', 'Arial', 'sans-serif' !important;
                                      }
                                      .w280 {
                                        width: 280px !important;
                                      }
                                    }
                                </style>
                                <style type="text/css" media="only screen and (max-width: 480px)">
                                  /* Mobile styles */
                                  @media only screen and (max-width: 480px) {
                                    table[class*="w320"] {
                                      width: 320px !important;
                                    }
                                    td[class*="w320"] {
                                      width: 280px !important;
                                      padding-left: 20px !important;
                                      padding-right: 20px !important;
                                    }
                                    img[class*="w320"] {
                                      width: 250px !important;
                                      height: 67px !important;
                                    }
                                    td[class*="mobile-spacing"] {
                                      padding-top: 10px !important;
                                      padding-bottom: 10px !important;
                                    }
                                    *[class*="mobile-hide"] {
                                      display: none !important;
                                    }
                                    *[class*="mobile-br"] {
                                      font-size: 12px !important;
                                    }
                                    td[class*="mobile-w20"] {
                                      width: 20px !important;
                                    }
                                    img[class*="mobile-w20"] {
                                      width: 20px !important;
                                    }
                                    td[class*="mobile-center"] {
                                      text-align: center !important;
                                    }
                                    table[class*="w100p"] {
                                      width: 100% !important;
                                    }
                                    td[class*="activate-now"] {
                                      padding-right: 0 !important;
                                      padding-top: 20px !important;
                                    }
                                  }
                                </style>
                              </head>
                              <body  offset="0" class="body" style="padding:0; margin:0; display:block; background:#eeebeb; -webkit-text-size-adjust:none" bgcolor="#eeebeb">
                              <table align="center" cellpadding="0" cellspacing="0" width="100%" height="100%">
                                <tr>
                                  <td align="center" valign="top" style="background-color:#eeebeb" width="100%">
                                  <center>
                                    <table cellspacing="0" cellpadding="0" width="600" class="w320">
                                      <tr>
                                        <td align="center" valign="top">
                                        <table cellspacing="0" cellpadding="0" width="100%" style="background-color:#3bcdb0;">
                                          <tr>
                                            <td style="text-align: center;">
                                              <a href="#"><img class="w320" width="311" height="83" src="#" alt="company logo" ></a>
                                            </td>
                                          </tr>
                                          <tr>
                                            <td style="background-color:#3bcdb0;">
                                              <table cellspacing="0" cellpadding="0" width="100%">
                                                <tr>
                                                  <td style="font-size:40px; font-weight: 600; color: #ffffff; text-align:center;" class="mobile-spacing">
                                                  <div class="mobile-br">&nbsp;</div>
                                                    Welcome to Demo
                                                  <br>
                                                  </td>
                                                </tr>
                                                <tr>
                                                  <td style="font-size:24px; text-align:center; padding: 0 75px; color:#6f6f6f;" class="w320 mobile-spacing">
                                                    <br>
                                                  </td>
                                                </tr>
                                              </table>
                                            </td>
                                          </tr>
                                        </table>
                                        <table cellspacing="0" cellpadding="0" width="100%" bgcolor="#ffffff" >
                                          <tr>
                                            <td style="background-color:#ffffff;">
                                              <table cellspacing="0" cellpadding="0" width="100%">
                                              <tr>
                                                <td style="font-size:24px; text-align:center;" class="mobile-center body-padding w320">
                                                <br>
                                        Email Verification:
                                                </td>
                                              </tr>
                                            </table>
                                            <table cellspacing="0" cellpadding="0" class="force-full-width">
                                              <tr>
                                                <td width="75%" class="">
                                                  <table cellspacing="0" cellpadding="0" class="w320 w100p"><br>
                                                    <tr>
                                                      <td class="mobile-center activate-now" style="font-size:17px; text-align:center; padding: 0 75px; color:#6f6f6f;" >
                                                       Dear ${email},
                                                      </td>
                                                    </tr>
                                                  </table>
                                                </td>
                                              </tr>
                                            </table>
                                              <table cellspacing="0" cellpadding="0" width="100%">
                                              <tr>
                                                <td style="text-align:left; font-size:13px;" class="mobile-center body-padding w320">
                                                <br>                            We're really excited for you to join our community!
                                                           You're just one click away from activate your account.
                                              <br>
                                                </td>
                                              </tr>
                                            </table>
                                            <table style="margin:0 auto;" cellspacing="0" cellpadding="10" width="100%">
                                              <tr>
                                                <td style="text-align:center; margin:0 auto;">
                                                <br>
                                                  <div>
                                                  <div
                                                      style="background-color:#f5774e;color:#ffffff;display:inline-block;font-family:'Source Sans Pro', Helvetica, Arial, sans-serif;font-size:18px;font-weight:400;line-height:45px;text-align:center;text-decoration:none;width:180px;-webkit-text-size-adjust:none;"><a style="color:#ffffff;" href="http://${verificationURL}">Activate Now!</a></div>
                                                   </div>
                                                  <br>
                                                </td>
                                              </tr>
                                            </table>
                                            <table cellspacing="0" cellpadding="0" width="100%">
                                              <tr>
                                                <td style="text-align:left; font-size:13px;" class="mobile-center body-padding w320">
                                                <br>
                                                <strong>Please Note : </strong><br>
                                        1. Do not share your credentials or otp with anyone on email.<br>
                                        2. Wallet never asks you for your credentials or otp.<br>
                                        3. Always create a strong password and keep different passwords for different websites.<br>
                                        4. Ensure you maintain only one account on wallet to enjoy our awesome services.<br><br><br>
                                                </td>
                                              </tr>
                                            </table>
                                            <table cellspacing="0" cellpadding="0" width="100%">
                                              <tr>
                                                <td style="text-align:left; font-size:13px;" class="mobile-center body-padding w320">
                                                <br>
                                                  If you have any questions regarding Demo please read our FAQ or use our support form wallet eamil address). Our support staff will be more than happy to assist you.<br><br>
                                                </td>
                                              </tr>
                                            </table>
                                             <table cellspacing="0" cellpadding="0" width="100%">
                                              <tr>
                                                <td style="text-align:left; font-size:13px;" class="mobile-center body-padding w320">
                                                <br>
                                                <b>Regards,</b><br>
                                                Demo team<br>Thank you<br><br><br>
                                                </td>
                                              </tr>
                                            </table>
                                            <table cellspacing="0" cellpadding="0" bgcolor="#363636"  class="force-full-width">
                                              <tr>
                                                <td style="color:#f0f0f0; font-size: 14px; text-align:center; padding-bottom:4px;"><br>
                                                  © 2017 All Rights Reserved Demo
                                                </td>
                                              </tr>
                                              <tr>
                                                <td style="color:#27aa90; font-size: 14px; text-align:center;">
                                                  <a href="#">View in browser</a> | <a href="#">Contact</a> | <a href="#">Unsubscribe</a>
                                                </td>
                                              </tr>
                                              <tr>
                                                <td style="font-size:12px;">
                                                  &nbsp;
                                                </td>
                                              </tr>
                                            </table>
                                            </td>
                                          </tr>
                                        </table>
                                        </td>
                                      </tr>
                                    </table>
                                  </center>
                                  </td>
                                </tr>
                              </table>
                              </body>
                              </html>`
                  };
                  if(doctorId){
                  let updateData = { labId : data._id,contactNo : contactNo, OTP : createNewOTP,status : false};
                  Doctor.findOneAndUpdate({_id : doctorId}, { $push: { lab:  updateData}},(err, update)=>{
                  if(err) return res.send({status : 400, message : "failed to createpateintrecords!",error:err});
              transporter.sendMail(mailOptions, function(error, info) {
               if (error) {
                 console.log(error);
               } else {
                 console.log('Email sent: ' + info.response);
                 return res.json(200, {
                   "message": "We sent link on your email address please verify link!!!",
                   "userMailId": email,
                   status: 200
                 });
               }
             });
           });
           }
         });
        }
      });
    });
}
});
}



var verifyEmailAddressforlab = function(req, res) {
    console.log("Enter into verifyEmailAddress");
    var email = req.body.email;
    var otp = req.body.otp;
    if (!email || !otp) {
      console.log("Can't be empty!!! by user.....");
      return res.json({
        "message": "Can't be empty!!!",
        statusCode: 400
      });
    }
    Doctor.findOne({
      email: email
    }).exec(function(err,doctor) {
      console.log("doctor info"+doctor+err);
      if (err) {
        return res.json({
          "message": "Error to find user",
          statusCode: 401
        });
      }
      if (!doctor) {
        return res.json({
          "message": "Invalid email!",
          statusCode: 401
        });
      }
      if (doctor.status === true) {
     return res.redirect('https://www.192.168.0.142:1338/login.php?message=Email already verified');
      }
    //   User.compareEmailVerificationOTP(otp, user, function(err, valid) {
    //     if (err) {
    //       console.log(err);
    //       console.log("Error to compare otp");
    //       return res.json({
    //         "message": "Error to compare otp",
    //         statusCode: 401
    //       });
    //     }
    //     if (!valid) {
    //       return res.json({
    //         "message": "OTP is incorrect!!",
    //         statusCode: 401
    //       });
    //     } else {
    //       console.log("OTP is verified successfully");
    //       User.update({
    //           email: userMailId
    //         }, {
    //           verifyEmail: true
    //         })
    //         .exec(function(err, updatedUser) {
    //           if (err) {
    //             return res.json({
    //               "message": "Error to update password!",
    //               statusCode: 401
    //             });
    //           }
    //           console.log("Update password successfully!!!");
    //           var mailOptions = {
    //             from: sails.config.common.supportEmailId,
    //             to: userMailId,
    //             subject: 'Email verified successfully !!!',
    //             html: `
    //                 <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
    //                 <html xmlns="http://www.w3.org/1999/xhtml" style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;">
    //                 <head>
    //                   <meta name="viewport" content="width=device-width" />
    //                   <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    //                   <title>Welcome mail</title>
    //                   <style type="text/css">
    //                     img {
    //                       max-width: 100%;
    //                     }
    //                     body {
    //                       -webkit-font-smoothing: antialiased;
    //                       -webkit-text-size-adjust: none;
    //                       width: 100% !important;
    //                       height: 100%;
    //                       line-height: 1.6em;
    //                     }
    //                     body {
    //                       background-color: #f6f6f6;
    //                     }
    //                     @media only screen and (max-width: 640px) {
    //                       body {
    //                         padding: 0 !important;
    //                       }
    //                       h1 {
    //                         font-weight: 800 !important;
    //                         margin: 20px 0 5px !important;
    //                       }
    //                       h2 {
    //                         font-weight: 800 !important;
    //                         margin: 20px 0 5px !important;
    //                       }
    //                       h3 {
    //                         font-weight: 800 !important;
    //                         margin: 20px 0 5px !important;
    //                       }
    //                       h4 {
    //                         font-weight: 800 !important;
    //                         margin: 20px 0 5px !important;
    //                       }
    //                       h1 {
    //                         font-size: 22px !important;
    //                       }
    //                       h2 {
    //                         font-size: 18px !important;
    //                       }
    //                       h3 {
    //                         font-size: 16px !important;
    //                       }
    //                       .container {
    //                         padding: 0 !important;
    //                         width: 100% !important;
    //                       }
    //                       .content {
    //                         padding: 0 !important;
    //                       }
    //                       .content-wrap {
    //                         padding: 10px !important;
    //                       }
    //                       .invoice {
    //                         width: 100% !important;
    //                       }
    //                     }
    //                   </style>
    //                 </head>
    //                 <body itemscope itemtype="http://schema.org/EmailMessage" style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; -webkit-font-smoothing: antialiased; -webkit-text-size-adjust: none; width: 100% !important; height: 100%; line-height: 1.6em; background-color: #f6f6f6; margin: 0;"
    //                   bgcolor="#f6f6f6">
    //                   <table class="body-wrap" style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; width: 100%; background-color: #f6f6f6; margin: 0;" bgcolor="#f6f6f6">
    //                     <tr style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;">
    //                       <td style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; vertical-align: top; margin: 0;" valign="top"></td>
    //                       <td class="container" width="600" style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; vertical-align: top; display: block !important; max-width: 600px !important; clear: both !important; margin: 0 auto;"
    //                         valign="top">
    //                         <div class="content" style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; max-width: 600px; display: block; margin: 0 auto; padding: 20px;">
    //                           <table class="main" width="100%" cellpadding="0" cellspacing="0" itemprop="action" itemscope itemtype="http://schema.org/ConfirmAction" style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; border-radius: 3px; background-color: #fff; margin: 0; border: 1px solid #e9e9e9;"
    //                             bgcolor="#fff">
    //                             <tr style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;">
    //                               <td class="content-wrap" style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; vertical-align: top; margin: 0; padding: 20px;" valign="top">
    //                                 <meta itemprop="name" content="Confirm Email" style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;" />
    //                                 <table width="100%" cellpadding="0" cellspacing="0" style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;">
    //                                   <tr style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;">
    //                                     <td class="content-block" style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; vertical-align: top; margin: 0; padding: 0 0 20px;" valign="top">
    //                                     </td>
    //                                   </tr>
    //                                   <tr style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;">
    //                                     <td class="content-block" style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; vertical-align: top; margin: 0; padding: 0 0 20px;" valign="top">
    //                                       Dear user,
    //                                     </td>
    //                                   </tr>
    //                                   <tr style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;">
    //                                     <td class="content-block" style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; vertical-align: top; margin: 0; padding: 0 0 20px;" valign="top">
    //                                     Your Email has been verified successfully
    //                                     </td>
    //                                   </tr>
    //                                   <tr style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;">
    //                                     <td class="content-block" style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; vertical-align: top; margin: 0; padding: 0 0 20px;" valign="top">
    //                                       Thanks & Regards,
    //                                     </td>
    //                                   </tr>
    //                                   <tr style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;">
    //                                     <td class="content-block" style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; vertical-align: top; margin: 0; padding: 0 0 20px;" valign="top">
    //                                       The Demo Team
    //                                     </td>
    //                                   </tr>
    //                                 </table>
    //                               </td>
    //                             </tr>
    //                           </table>
    //                           <div class="footer" style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; width: 100%; clear: both; color: #999; margin: 0; padding: 20px;">
    //                             <table width="100%" style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;">
    //                               <tr style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;">
    //                                 <td class="aligncenter content-block" style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 12px; vertical-align: top; color: #999; text-align: center; margin: 0; padding: 0 0 20px;" align="center"
    //                                   valign="top">Follow <a href="http://twitter.com/Demo" style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 12px; color: #999; text-decoration: underline; margin: 0;">@Demo</a> on Twitter.</td>
    //                               </tr>
    //                             </table>
    //                           </div>
    //                         </div>
    //                       </td>
    //                       <td style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; vertical-align: top; margin: 0;" valign="top"></td>
    //                     </tr>
    //                   </table>
    //                 </body>
    //                 </html>`
    //           };
    //
    //           transporter.sendMail(mailOptions, function(error, info) {
    //             if (error) {
    //               console.log(error);
    //             } else {
    //               console.log('Email sent: ' + info.response);
    //
    //             }
    //           });
    //           return res.redirect('https://www.192.168.0.142:1338/login.php?message=Email verified successfully');
    //           // res.json(200, {
    //           //   "message": "Email verified successfully",
    //           //   "userMailId": userMailId,
    //           //   statusCode: 200
    //           // });
    //         });
    //     }
    //   });
    // });
  });
}



var viewPharmacy=function(req,res){
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
var viewLab=function(req,res){
  var labid = req.body.labid;
  condition = {_id:labid}
  Lab.find(condition,function(err,data){
    if(err) return res.send({status : 400, message : "failed to fetch details!",error:err});
    return res.send({status : 200, message : "Lab Detail is fetch successfully!", data : data});

  })
}


var updateHospitalProfile = function(req,res){
    var hospitalId = req.body.hospitalId;
    var myquery={_id:hospitalId}
    delete req.body.hospitalId;
    Hospital.findOneAndUpdate(myquery,req.body,function(err,result){
      if(err) return res.send({status : 400, message : "failed to fetch details!",error:err});
      else{
        var x=JSON.stringify(result);
        var datax=new Buffer(x).toString('hex');
        let obj = {address : result.multichainAddress,streamName : "Hospital",key : result.name,data : datax};
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


exports.addDoctor=addDoctor;
exports.addPharmacy=addPharmacy;
exports.addPharmacy=addPharmacy;
exports.addLab = addLab;
exports.addDoctor = addDoctor;
exports.viewPharmacy = viewPharmacy;
exports.viewLab = viewLab;
exports.sendRequestToAdmin = sendRequestToAdmin;
exports.verifyEmailAddressforlab = verifyEmailAddressforlab;
exports.updateHospitalProfile = updateHospitalProfile;
