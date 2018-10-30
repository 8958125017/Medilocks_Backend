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
const accountSid = 'AC2f4b78068bd31540787f9d3461dd0f0a'; //
const authToken = '5430c1c3514f0a7d222f04709d977ce4'; //08ac6601b9797b4d4d6f4688f4a84c05
const client = require('twilio')(accountSid, authToken);
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
  var aadharNo = req.body.aadharNo+"_"+hospitalId;
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
                      var verificationURL = "192.168.0.57:5005"+ "/hospital/verifyDoctorSignupOTP?hospitalId=" + hospitalId + "&OTP=" + signupOTP;
                      var mailOptions = {
        from: CONST.supportEmailId,
        to: doctoremail,
        subject: 'Please verify email !!!',
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
                                           Dear ${doctoremail},
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
      transporter.sendMail(mailOptions, function(error, info) {
        if (error) {
          return res.json({
            "message": "Try after some time!!!",
            error : error,
            status: 400
          });
        } else {
          console.log('Email sent: ' + info.response);
          Doctor.create(obj,function(err,obj) {
              if (err) {
                console.log("Error to Create New Doctor !!!",err);
                return res.json({
                  "message": "Error to create New Doctor",
                  status: 400
                });
              }
              return res.json({
                "message": "We sent OTP on your email address please verify your account!!!",
                status: 200
              });
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
                    var verificationURL = "192.168.0.57:5005"+ "/hospital/verifyDoctorSignupOTP?hospitalId=" + hospitalId + "&OTP=" + signupOTP;
                    var mailOptions = {
            from: CONST.supportEmailId,
            to: doctoremail,
            subject: 'Please verify email !!!',
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
                                               Dear ${doctoremail},
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
            transporter.sendMail(mailOptions, function(error, info) {
            if (error) {
            return res.json({
            "message": "Try after some time!!!",
            error : error,
            status: 400
            });
            } else {
            console.log('Email sent: ' + info.response);
            Doctor.create(obj,function(err,obj) {
            if (err) {
              console.log("Error to Create New Doctor !!!",err);
              return res.json({
                "message": "Error to create New Doctor",
                status: 400
              });
            }
            return res.json({
              "message": "We sent OTP on your email address please verify email!!!",
              status: 200
            });
            });
            }
            });                  })

                  }
                  }
              })
          })
      }
  })
}

var addPharmacy=function(req,res){
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
var hospitalId = req.body.hospitalId;
var multichainAddress = '';

    if (!name || !contactNo || !email) {
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
    Pharmacy.findOne({
        email: email
    }, function(err, detail) {
        if (err) return res.send({
            status: 400,
            message: "error to find doctor"
        });
        if (detail) return res.send({
            status: 400,
            message: "Pharmacy already exists"
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
                license:license,
                image:data,
                OTP:signupOTP
                        }
                        var verificationURL = "192.168.0.57:5005"+ "/hospital/verifyPharmacySignupOTP?hospitalId=" + hospitalId + "&OTP=" + signupOTP;
                        var mailOptions = {
          from: CONST.supportEmailId,
          to: email,
          subject: 'Please verify email !!!',
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
        Pharmacy.create(obj,function(err,obj) {
            if (err) {
              console.log("Error to Create New Doctor !!!",err);
              return res.json({
                "message": "Error to create New Pharmacyr",
                status: 400
              });
            }
        transporter.sendMail(mailOptions, function(error, info) {
        if (error) {
        return res.json({
        "message": "Try after some time!!!",
        error : error,
        status: 400
        });
        } else {
          client.messages.create({
              body: 'We sent OTP on your email address please verify email!!!' ,
              from: '+14053584187',
              to: '+91'+contactNo
          }, function(error, send) {
            console.log("twillioresponse||||||||||",error,send)
              if (err) return res.send({
                  status: 400,
                  message: "failed to send otp!",
                  error: error
              });
              return res.json({
                "message": "We sent OTP on your email address please verify email!!!",
                status: 200
              });
        });
           }

         })
       })
    })
  })
}

                    else{
                      console.log("not image path");
                      var hash12 = hash;
                       var signupOTP=Math.floor(100000 + Math.random() * 900000);
                  Global.getNewAddressandpermissionOnMultichain((result)=>{
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
            OTP:signupOTP
                    }
                      var verificationURL = "192.168.0.57:5005"+ "/hospital/verifyPharmacySignupOTP?hospitalId=" + hospitalId + "&OTP=" + signupOTP;
                      var mailOptions = {
              from: CONST.supportEmailId,
              to: email,
              subject: 'Please verify email !!!',
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



              Pharmacy.create(obj,function(err,obj) {
                  if (err) {
                    console.log("Error to Create New Doctor !!!",err);
                    return res.json({
                      "message": "Error to create New Pharmacy",
                      status: 400
                    });
                  }
              transporter.sendMail(mailOptions, function(error, info) {
              if (error) {
              return res.json({
              "message": "Try after some time!!!",
              error : error,
              status: 400
              });
              } else {
                client.messages.create({
                    body: 'We sent OTP on your email address please verify email!!!' ,
                    from: '+14053584187',
                    to: '+91'+contactNo
                }, function(error, send) {
                  console.log("twillioresponse||||||||||",error,send)
                    if (err) return res.send({
                        status: 400,
                        message: "failed to send otp!",
                        error: error
                    });
                    return res.json({
                      "message": "We sent OTP on your email address please verify email!!!",
                      status: 200
                    });
              });
                 }

               })
             })
           })
            }
        }
    })
  })
}
})
}

var addLab=function(req,res){
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
      var hospitalId = req.body.hospitalId;
      var multichainAddress = '';

      if (!name || !contactNo || !email) {
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
      Lab.findOne({
          email: email
      }, function(err, detail) {
          if (err) return res.send({
              status: 400,
              message: "error to find doctor"
          });
          if (detail) return res.send({
              status: 400,
              message: "Lab already exists"
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
                  license:license,
                  image:data,
                  OTP:signupOTP
                          }
                          var verificationURL = "192.168.0.57:5005"+ "/hospital/verifyLabSignupOTP?hospitalId=" + hospitalId + "&OTP=" + signupOTP;
                          var mailOptions = {
            from: CONST.supportEmailId,
            to: email,
            subject: 'Please verify email !!!',
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
          Lab.create(obj,function(err,obj) {
              if (err) {
                console.log("Error to Create New Doctor !!!",err);
                return res.json({
                  "message": "Error to create New Pharmacyr",
                  status: 400
                });
              }
          transporter.sendMail(mailOptions, function(error, info) {
          if (error) {
          return res.json({
          "message": "Try after some time!!!",
          error : error,
          status: 400
          });
          } else {
            client.messages.create({
                body: 'We sent OTP on your email address please verify email!!!' ,
                from: '+14053584187',
                to: '+91'+contactNo
            }, function(error, send) {
              console.log("twillioresponse||||||||||",error,send)
                if (err) return res.send({
                    status: 400,
                    message: "failed to send otp!",
                    error: error
                });
                return res.json({
                  "message": "We sent OTP on your email address please verify email!!!",
                  status: 200
                });
          });
             }

           })
         })
      })
    })
  }

                      else{
                        console.log("not image path");
                        var hash12 = hash;
                         var signupOTP=Math.floor(100000 + Math.random() * 900000);
                    Global.getNewAddressandpermissionOnMultichain((result)=>{
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
              OTP:signupOTP
                      }
                        var verificationURL = "192.168.0.57:5005"+ "/hospital/verifyLabSignupOTP?hospitalId=" + hospitalId + "&OTP=" + signupOTP;
                        var mailOptions = {
                from: CONST.supportEmailId,
                to: email,
                subject: 'Please verify email !!!',
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
                Pharmacy.create(obj,function(err,obj) {
                    if (err) {
                      console.log("Error to Create New Doctor !!!",err);
                      return res.json({
                        "message": "Error to create New Lab",
                        status: 400
                      });
                    }
                transporter.sendMail(mailOptions, function(error, info) {
                if (error) {
                return res.json({
                "message": "Try after some time!!!",
                error : error,
                status: 400
                });
                } else {
                  client.messages.create({
                      body: 'We sent OTP on your email address please verify email!!!' ,
                      from: '+14053584187',
                      to: '+91'+contactNo
                  }, function(error, send) {
                    console.log("twillioresponse||||||||||",error,send)
                      if (err) return res.send({
                          status: 400,
                          message: "failed to send otp!",
                          error: error
                      });
                      return res.json({
                        "message": "We sent OTP on your email address please verify email!!!",
                        status: 200
                      });
                });
                   }

                 })
               })
             })
              }
          }
      })
    })
  }
  })
  }



var verifyEmailAddressforlab = function(req, res) {
    console.log("Enter into verifyEmailAddress");
    var email = req.body.email;
    var otp = req.body.otp;
    if (!email || !otp) {
      console.log("Can't be empty!!! by user.....");
      return res.json({
        "message": "Can't be empty!!!",
        status: 400
      });
    }
    Doctor.findOne({
      email: email
    }).exec(function(err,doctor) {
      console.log("doctor info"+doctor+err);
      if (err) {
        return res.json({
          "message": "Error to find user",
          status: 400
        });
      }
      if (!doctor) {
        return res.json({
          "message": "Invalid email!",
          status: 400
        });
      }
      if (doctor.status === true) {
     return res.redirect('https://www.192.168.0.142:1338/login.php?message=Email already verified');
      }
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



    var addPatientByHospital = (req, res) => {
        var hospitalId = req.body.hospitalId;
        let aadharNo = req.body.aadharNo;
        var createNewOTP = Math.floor(100000 + Math.random() * 900000);
        var data = {
            hospitalId: hospitalId,
            status: false,
            aadharNo: aadharNo,
            OTP: createNewOTP
        }
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
              console.log("found",found);
              if(found.pullEHRrequests.length > 0){
                var status = found.pullEHRrequests.findIndex((item)=>{
                  console.log("DAta||||||||||||||||",item);
                  return item.hospitalId==hospitalId;
                });
                  if(status!==-1){
                    var condition = {aadharNo: aadharNo,"pullEHRrequests.hospitalId" : hospitalId};
                      Patient.findOneAndUpdate(condition,{$set : {'pullEHRrequests.$.OTP' : createNewOTP,"pullEHRrequests.$.status":false}},function(err, data){
                      if (err) return res.send({status: 400,message: "failed to update OTP!."});
                      client.messages.create({
                         body: 'Your otp to verify:'+createNewOTP ,
                         from: '+14053584187',
                         to: "+91"+data.mobileNo
                     }, function(error, data1) {
                         if (error) return res.send({
                             status: 400,
                             message: "failed to send otp!",
                             error: error
                         });
                         else {
                           updateHospital(hospitalId,found._id,aadharNo,req,res);
                         }
                     });
                    });
                  }

                  else{
                    Patient.findOneAndUpdate({aadharNo: aadharNo}, {$push: {'pullEHRrequests': data}}, function(err, data) {
                        if (err) return res.send({status: 400,message: "failed to assign prescription!."});
                        client.messages.create({
                           body: 'Your otp to verify:'+createNewOTP ,
                           from: '+14053584187',
                           to: "+91"+data.mobileNo
                       }, function(error, data1) {
                           if (error) return res.send({
                               status: 400,
                               message: "failed to send otp!",
                               error: error
                           });
                           else
                           {
                             updateHospital(hospitalId,found._id,aadharNo,req,res);
                           }
                       });
                       });
                  }
                      }

            else{
                Patient.findOneAndUpdate({aadharNo: aadharNo}, {$push: {'pullEHRrequests': data}}, function(err, data) {
                  console.log("entering into first time",err,data);
                  if (err) return res.send({status: 400,message: "failed to assign prescription!."});
                    client.messages.create({
                       body: 'Your otp to verify:'+createNewOTP ,
                       from: '+14053584187',
                       to: "+91"+data.mobileNo
                   }, function(error, data1) {
                     console.log("dara",error,data1);
                    if (error) return res.send({
                           status: 400,
                           message: "failed to send otp!",
                           error: error
                       });
                       else {
                      updateHospital(hospitalId,found._id,aadharNo,req,res);
                       }
                   });            });
              }
        }
    })
    }


    function updateHospital(hospitalId,patientId,mobileNo,req,res){
        var createNewOTP = Math.floor(100000 + Math.random() * 900000);
        var data = {
            patientId: patientId,
            status: false,
            mobileNo: mobileNo,
            OTP: createNewOTP
        }
        Hospital.findOne({_id: hospitalId}, {}, (err, found) => {
            if (err) return res.send({status: 400,message: "error in send request"});
            if (!found) res.send({status: 400,message: 'Doctor does not exist!.'});
            if (found) {
              if(found.patient.length > 0){
                var status = found.patient.findIndex((item)=>{
                  return item.mobileNo === mobileNo;
                });
                  if(status!==-1){
                    var condition = {_id: hospitalId,"patient.mobileNo" : mobileNo};
                    Hospital.updateOne(condition,{$set : {'patient.$.OTP' : createNewOTP}},function(err, data){
                      if (err) return res.send({status: 400,message: "failed to update OTP!."});
                      return res.send({status: 200,message: "OTP has been sent!!."});
                    });
                  }
                  else{
                    Hospital.updateOne({_id: hospitalId}, {$push: {'patient': data}}, function(err, data) {
                        if (err) return res.send({status: 400,message: "failed to assign prescription!."});
                        return res.send({status: 200,message: "New OTP has been sent!!."});
                    });
                  }
    }else{
                Hospital.updateOne({_id: hospitalId}, {$push: {'patient': data}}, function(err, data) {
                  if (err) return res.send({status: 400,message: "failed to assign prescription!."});
                    return res.send({status: 200,message: "Pull EHR request has been sent successfully!!."});
                });
              }
          }
      });
    }




  var verifyByHospital = function(req, res) {
        var OTP      = req.body.OTP;
        var aadharNo = req.body.aadharNo;
        var multichainAddress = req.body.multichainAddress;
        Patient.find({
            aadharNo: aadharNo
        }, function(err, data) {
            if (err) return res.send({
                status: 400,
                message: "error to get user"
            });
            else if (data) {
                let currDoctor = data[0].pullEHRrequests;
                let counter = 0;
                async.forEachLimit(currDoctor, 1, (element, next) => {
                    counter++;
                        if (element.OTP == OTP) {
                            Patient.findOneAndUpdate({
                                "pullEHRrequests.OTP": OTP
                            }, {
                                $set: {
                                    "pullEHRrequests.$.status": true,
                                }
                            },{new : true}, function(err, updatedata) {
                                if (err) return res.send({
                                    status: 400,
                                    message: "error to get user",
                                    err: err
                                });
                         else{
                            var x = JSON.stringify(updatedata);
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

                            }
                        })
                    }
                        else {
                            if(counter != currDoctor.length)
                            next();
                            else
                            return res.send({
                                status: 400,
                                message: "Not a valid OTP."
                            });
                           }
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



    var verifyPatientSignupOTP = (req, res) => {
        let hospitalId = req.body.hospitalId;

        if (!req.body.OTP) {
            return res.send({
                status:400,
                message: "Enter User OTP"
            });
        }
        else if (req.body.OTP) {
            Patient.findOneAndUpdate({ signupOTP: req.body.OTP }, { $set: { isApproved: true,signupOTP : "" } },{new :true}, (err, updateUser) => {
                if(err){
                    res.send({
                        message: "Error occured",
                        err:err,
                        status :400
                    });
                }
                if (updateUser) {
                    if(hospitalId){
                        let hospital  = hospital.findOne({_id : hospitalId},function(err,found){
                            if(err) console.log('errpr',err);
                            if(found){
                              var x = JSON.stringify(updateUser);
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



    var getDoctor = function(req,res){
     Doctor.find( { hospitalId: { $ne: null } } ,function(error,result){
       if(error){
         return res.json({
           message:"error to get doctors",
           status:400
         })

       }
         else{
           return res.json({
            message:"doctors",
            status:200,
            data:result
          })
       }

     })
    }
    var getLab = function(req,res){
     Lab.find( { hospitalId: { $ne: null } } ,function(error,result){
       if(error){
         return res.json({
           message:"error to get labs",
           status:400
         })

       }
         else{
           return res.json({
            message:"Labs",
            status:200,
            data:result
          })
       }

     })
    }
    var getPharmacy = function(req,res){
     Pharmacy.find( { hospitalId: { $ne: null } } ,function(error,result){
       if(error){
         return res.json({
           message:"error to get doctors",
           status:400
         })

       }
         else{
           return res.json({
            message:"pharmacy",
            status:200,
            data:result
          })
       }

     })
    }



    var verifyDoctorSignupOTP = (req, res) => {
      console.log("req",req.body);
        let hospitalId = req.param('hospitalId');
        let OTP = req.param('OTP');
        if (!OTP) {
            return res.send({
                status:400,
                message: "Enter User OTP"
                          });
        }
        else if (OTP) {
            Doctor.findOneAndUpdate({ signupOTP: OTP}, { $set: { isApproved: true,signupOTP : "" } },{new :true}, (err, updateUser) => {
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
                        let hospital  = Hospital.findOne({_id : hospitalId},function(err,found){
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

                    }
                    else{
                      return res.send({
                       message: "OTP not verified!.",
                       status : 400
                       });
                    }
                  }
                })
              }
            }

            var verifyPharmacySignupOTP = (req, res) => {
              console.log("req",req.body);
                let hospitalId = req.param('hospitalId');
                let OTP = req.param('OTP');
                if (!OTP) {
                    return res.send({
                        status:400,
                        message: "Enter User OTP"
                                  });
                }
                else if (OTP) {
                    Pharmacy.findOneAndUpdate({ OTP: OTP}, { $set: { isApproved: true,signupOTP : "" } },{new :true}, (err, updateUser) => {
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
                                let hospital  = Hospital.findOne({_id : hospitalId},function(err,found){
                                  console.log("error----------------",err);
                                    if(err) console.log('error',err);
                                    if(found){
                                      console.log("found",found.multichainAddress);
                                        var x = JSON.stringify(updateUser);
                                        var datax = new Buffer(x).toString('hex');
                                        let publishData = {address : found.multichainAddress,streamName : "Pharmacy",key : updateUser.name,data : datax};
                                        Global.publishDataOnMultichain(publishData,(result)=>{
                                           if(result)
                    return res.redirect('http://192.168.0.76:5008/home');
                                        });

                                    }
                                });

                            }
                            else{
                              return res.send({
                               message: "OTP not verified!.",
                               status : 400
                               });
                            }
                          }
                        })
                      }
                    }



                    var verifyLabSignupOTP = (req, res) => {
                        let hospitalId = req.param('hospitalId');
                        let OTP = req.param('OTP');
                        if (!OTP) {
                            return res.send({
                                status:400,
                                message: "Enter User OTP"
                                          });
                        }
                        else if (OTP) {
                            Lab.findOneAndUpdate({ OTP: OTP}, { $set: { isApproved: true,signupOTP : "" } },{new :true}, (err, updateUser) => {
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
                                        let hospital  = Hospital.findOne({_id : hospitalId},function(err,found){
                                            if(err) console.log('error',err);
                                            if(found){
                                              console.log("found",found.multichainAddress);
                                                var x = JSON.stringify(updateUser);
                                                var datax = new Buffer(x).toString('hex');
                                                let publishData = {address : found.multichainAddress,streamName : "lab",key : updateUser.name,data : datax};
                                                Global.publishDataOnMultichain(publishData,(result)=>{
                                                   if(result)

                                                       return res.redirect('http://192.168.0.76:5008/home');
                                                });

                                            }
                                        });

                                    }
                                    else{
                                      return res.send({
                                       message: "OTP not verified!.",
                                       status : 400
                                       });
                                    }
                                  }
                                })
                              }
                            }





        var hospitalDashBoardData=function(req,res){
                              var hospitalId=req.body.hospitalId;
                              var ansy=new Array(12).fill(0)
                              var ansm=new Array(30).fill(0);
                              var answ=new Array(7).fill(0);
                              var totalWeekVisitor=0;
                              var totalMonthVisitor=0;
                              var todayVisitor=0;
                              var totalVisitor=0;
                              //var answ=[];

                              var labely=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
                              var labelw=['Sun','Mon','Tue','Wed','Thr','Fri','Sat']
                              var labelm = [];
                              var d=new Date();
                              for (var i = 1; i <=new Date(d.getFullYear(),d.getMonth(),0).getDate(); i++) {
                               labelm.push(i);
                                }
                              var x=['Sun','Mon','Tue','Wed','Thr','Fri','Sat']
                              var yearlydata;
                              Visit.find({hospitalId:hospitalId,date:{$lte:Date.now(),$gt:Date.now()-365*24*3600*1000}}).sort({'date':1}).exec(function(err,result){
                            if(err) return res.send({status:400,message:'error to fetch!'});
                            async.forEachLimit(result, 1, (element, next) => {
                               totalVisitor=totalVisitor+Number(element.vc);
                               next();
                            })
                              Visit.find({hospitalId:hospitalId,date:{$lte:Date.now(),$gt:Date.now()-365*24*3600*1000}}).sort({'date':1}).exec(function(err,result){
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
                                 Visit.find({hospitalId:hospitalId,date:{$lte:Date.now(),$gt:Date.now()-30*24*3600*1000}}).sort({'date':1}).exec(function(err,result){
                                 if(err) return res.send({status:400,message:'error to fetch!'});
                                 console.log('Result::',result);
                                 async.forEachLimit(result, 1, (element, next) => {
                                   var i=Number(new Date(element.date).getDate());
                                   ansm[i]=ansm[i]+Number(element.vc);
                                   totalMonthVisitor+=Number(element.vc);
                                   next();
                                 })
                               var monthlydata={
                                 labelm:labelm,
                                 ansm:ansm
                                }
                                Visit.find({hospitalId:hospitalId,date:{$lte:Date.now(),$gt:Date.now()-7*24*3600*1000}}).sort({'date':1}).exec(function(err,result){
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
                                 totalWeekVisitor:totalWeekVisitor,
                                 totalVisitor:totalVisitor
                               }
                               return res.send({status:200,message:'Data fetch succesfully!',data:obj})
                            })
                            })
                            })
                            })
                            }






exports.addDoctor=addDoctor;
exports.addPharmacy=addPharmacy;
exports.addLab = addLab;
// exports.addDoctor = addDoctor;
exports.viewPharmacy = viewPharmacy;
exports.viewLab = viewLab;
exports.sendRequestToAdmin = sendRequestToAdmin;
exports.verifyEmailAddressforlab = verifyEmailAddressforlab;
exports.updateHospitalProfile = updateHospitalProfile;
exports.addPatientByHospital = addPatientByHospital;
exports.verifyByHospital = verifyByHospital;
exports.addPatient = addPatient;
exports.verifyPatientSignupOTP = verifyPatientSignupOTP;
exports.getDoctor = getDoctor;
exports.verifyDoctorSignupOTP = verifyDoctorSignupOTP;
exports.verifyPharmacySignupOTP = verifyPharmacySignupOTP;
exports.verifyLabSignupOTP = verifyLabSignupOTP;
exports.getPharmacy = getPharmacy;
exports.getLab = getLab;
exports.hospitalDashBoardData = hospitalDashBoardData;
