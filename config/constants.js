
const twilioCredentials = {
    // "TwilioNumber" : "+19149337525",
    // "Authy" : "BT3ybwzIHaDiNghYsUCbnajVUk93AxUf",
    // "ACCOUNTSID"   : "ACb76e2a9503584eee8836854bc8bb40eb",
    // "AUTHTOKEN"    : "1e41430304caa28891a9577f0954eaff"

   "ACCOUNTSID": "AC2f4b78068bd31540787f9d3461dd0f0a",
    "AUTHTOKEN":"5430c1c3514f0a7d222f04709d977ce4"

};

const gmailSMTPCredentials = {
    "type": "SMTP",
    "service": "Gmail",
    "host": "smtp.gmail.com",
    "port": 587,
    "secure": true,
    "username": "kavipal766@gmail.com",
    "password": "backtrack@123"
};

const smsCredentials = {
    number:'4755292423'
};

const rpiCredentials = {
    baseUrl:'http://proxy7.remote-iot.com:11804'
};

const pagination = {
    itemPerPage:10
};

const imagePaths = {
    "user": "/../../public/images/user/avatar",
    "url": "/images/user/avatar",
    "defaultUserImage" : './images/user/avtar.png'
};


const userRole = {
    "roles" : [
    {roleId : 1, roleName : "Admin"},
    {roleId : 2, roleName : "Developer"},
    {roleId : 3, roleName : "Tester"},
    {roleId : 4, roleName : "Business Developer"},
    {roleId : 5, roleName : "Project Manager"},
    {roleId : 6, roleName : "Team Manager"},
    {roleId : 7, roleName : "Team Lead"},
    {roleId : 8, roleName : "Super Admin"},
    {roleId : 9, roleName : "Desinger"}]
}

const hostingServer ={
    serverName : 'http://192.168.0.168:5005/',
    serverUiName : 'http://192.168.0.168:5006/',
    // serverName : 'https://bug-tracker-web.herokuapp.com'
}

const employers = {
    data : ['TCS','WIPRO','INTEL','PENNYBASE','BLOCKON']
}

var multichain = {
   port: "2782",
   host: "103.201.142.41",
   user: "multichainrpc",
   pass: "7RUbSvpeWwEBEAtDqVtfPncDC4xArPbhXjvmX7BQCjXf"
}


// var Async = {
//   Async : require('async')
// }
var multichainConn = require("multichain-node")({
       port: multichain.port,
       host: multichain.host,
       user: multichain.user,
       pass: multichain.pass
});

var doctor = {
    prescription : `<!DOCTYPE html>
<html>
<title>HTML Tutorial</title>
<body>

<h1>This is a heading</h1>
<p>This is a paragraph.</p>

</body>
</html>`
}


function createPrescription(HTMLdata){
    // let name = data.name;
    // var patientData = data.data;
    // const tmpl = patientData => html`
    // <table>
    // ${patientData.map(addr => html`
    //     <tr>$${addr.medicineName}</tr>
    //     <tr>$${addr.intake}</tr>
    //     <tr>$${addr.dose}</tr>
    //     <tr>$${addr.duration}</tr>
    // `)}
    // </table>
    // `;

    // return `<!DOCTYPE html>
    // <html>
    // <title>Medilocks prescription</title>
    // <body>
    // <h2>MEDILOCKS </h2>
    // <p>Dr. Kunvar</p>`+data.name+`<br>
    // <h6>Diagonasis : `+data.diagonosis+`</h6><br>
    // `+tmpl+`
    // <br/>`+data.prescription+`
    // </body>
    // </html>`;

// console.log("data",HTMLdata);
   // var name = data.name;
   var prescription = HTMLdata.prescription;
   var diagonosis = HTMLdata.diagonosis;
   var data = HTMLdata.data;
   var patient = HTMLdata.patient;
   var doctor = HTMLdata.doctor;
  return `<!DOCTYPE html>
<html>
<head>
    <title>Medillocks</title>
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css" integrity="sha384-MCw98/SFnGE8fJT3GXwEOngsV7Zt27NXFoaoApmYm81iuXoPkFOJwJ8ERdknLPMO" crossorigin="anonymous">
    <style type="text/css">
     body{
        font-family: arial;
     }
     section{
        padding: 70px 0px;
     }
     .pres-bg{
        background-color: #fff;
        padding: 10px;
        border:1px solid #fafafa;
        /*padding-bottom: 50px;*/
     }
        .main-heading{
            font-size: 40px;
            padding: 20px 0px 58px 0px;
            color: #fff;
            padding-left: 5px;

        }
        .bg{
            background-color: #42387a;
            padding:8px 15px;
            color: #fff;
        }
        .custom-border{
            border:10px solid #f0f0f5;
        }
        .p-name{
            font-size: 24px;
        }
        strong{
            color: #42387a;
        }
        p{
            margin-bottom: 5px;
        }
        .dr-heading{
            font-size: 24px;
            color: #42387a;
        }
        .other-haeding{
            font-size: 18px;
            font-weight: 700;
            border-left: 5px solid #42387a;
            padding-left: 10px;
        }
        .diagno{
            margin-left: 80px;
        }
        .header{
            background-image: url(header.png);
            background-repeat: no-repeat;
            background-size: cover;
        }
        .footer{
            border:5px solid #42387a;
            margin-top: 50px;
        }
    </style>
</head>
<body>


    <section>
        <div class="container">
            <div class="pres-bg">
                <div class="row">
                    <div class="col-sm-12">
                        <div class="row">
                            <div class="col-sm-9">
                                <div class="header">
                                    <h1 class="main-heading">
                                        Prescription
                                    </h1>
                                </div>
                            </div>
                            <div class="col-sm-3 text-right">
                                <div>
                                    <img src="https://dummyimage.com/600x400/9e9e9e/ffffff&text=Hospital+logo" alt="image" width="200">
                                </div>
                            </div>
                        </div>
                        <!-- <div class="custom-border"></div> -->
                        <div class="row mt-5">
                            <div class="col-sm-6">
                                <p class="p-name">
                         ${patient.firstName + ' '+patient.lastName}
                                 </p>
                                <p>
                                    <strong>
                                        Age :
                                    </strong>
                                    <span>
                                        ${patient.age}
                                    </span>
                                </p>
                                <p>
                                    <strong>
                                        Gender :
                                    </strong>
                                    <span>
                                        ${patient.gender}
                                    </span>
                                </p>
                                <p>
                                    <strong>
                                        City :
                                    </strong>
                                    <span>
                                        ${patient.city}
                                    </span>
                                </p>
                                <div class="row"></div>
                            </div>
                            <div class="col-sm-6 text-right">
                                <h2 class="dr-heading">Dr. ${doctor.firstName +' '+doctor.lastName}</h2>
                                <p>
                                    <strong>,${doctor.city} (${doctor.address})</strong>
                                </p>

                            </div>
                        </div>
                        <div class="custom-border mt-5 mb-5"></div>
                        <div class="row">
                            <div class="col-sm-12">
                                <h3 class="other-haeding">
                                    <span class="">Diagnosis</span>
                                </h3>
                            </div>
                            <div>
                                <ul class="diagno mt-3">
                                    <li >${diagonosis} </li>
                                </ul>
                            </div>
                        </div>
                        <hr>
                        <div class="row mt-3">
                            <div class="col-sm-12">
                                <h3 class="other-haeding mt-3 mb-5">
                                    <span class="">Prescription</span>
                                </h3>
                            </div>
                            <div class="col-sm-10 m-auto">
                                <div class="table-responsive">
                                    <table class="table table-hover" style="font-size: 12px;">
                                        <thead>
                                            <tr>
                                              <th scope="col">#</th>
                                              <th scope="col">Drug</th>
                                              <th scope="col">Dosege &amp; Frequency</th>
                                              <th scope="col">Intake</th>
                                              <th scope="col">Duration</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                         ${data.map((item,index) =>
                                             `<tr>
                                              <th scope="row">${index+1}</th>
                                              <td>${item.medicineName}</td>
                                              <td>${item.dose}</td>
                                              <td>${item.intake}</td>
                                              <td>${item.duration}</td>
                                            </tr>`
                                            ).join('')
                                         }
                                        </tbody>
                                    </table>
                                </div>
                                <div>
                                    <strong>General Instruction -</strong>
                                </div>
                                <div>
                                    ${prescription}
                                </div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-sm-12">
                                <div class="footer"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- js -->
    <script src="https://code.jquery.com/jquery-3.3.1.slim.min.js" integrity="sha384-q8i/X+965DzO0rT7abK41JStQIAqVgRVzpbzo5smXKp4YfRvH+8abtTE1Pi6jizo" crossorigin="anonymous"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.3/umd/popper.min.js" integrity="sha384-ZMP7rVo3mIykV+2+9J3UJ46jBk0WLaUAdn689aCwoqbBJiSnjAK/l8WvCWPIPm49" crossorigin="anonymous"></script>
    <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/js/bootstrap.min.js" integrity="sha384-ChfqqxuZUCnJSK3+MXmPNIyE6ZbWh2IMqE241rYiqJxyMiZ6OW/JmZQ5stwEULTy" crossorigin="anonymous"></script>

</body>
</html>`
}


var adminCred = {
    email  :'admin@yopmail.com',
    password : 'admin@123'
}


var doctorCategory = ["Allergists","Anesthesiologists","Cardiologists","Dermatologists","Dentist","ENT Specialist","Family Physicians ","Gastroenterologists","Gynecologist","Surgeon","Neurologists","Oncologists","Nephrologists","Medical Geneticists","Pathologists"];
var BloodCategory = ["A+","A-","B+","B-","O+","O-","AB+","AB-"];
var DoctorDegree = ["BAMS","MBBS","DENTIST"];
var DoctorDepartment = ["nuerosurgeon","heartsurgeon","cardiologist","heartsurgeon"];



// function getNewAddressandpermissionOnMultichain() {
//   console.log("getnewaddress--------------------");
// multichain.getNewAddress((err, result) => {
//   console.log(err+result);
//     if (err)
//         return res.send({
//             status: 200,
//             message: "error to generate address"
//         });
//     else {
//         console.log("results" + result);
//         Doctor.findOneAndUpdate({
//             _id: doctorID
//         }, {
//             $set: {
//                 "data.address": result
//             }
//         }, function(err, doc) {
//             console.log("data" + err + doc);
//             if (err) {
//                 console.log("Something wrong when updating data!");
//                 return res.send({
//                     status: 400,
//                     message: "address is unable to save"
//                 });
//             } else {
//                 var counter = 0;
//                 var permissions = ['send', 'receive', 'connect', 'mine', 'admin', 'activate', 'issue', 'create'];
//                 Async.forEachLimit(permissions, 1, (element, next) => {
//                     multichain.grant({
//                         'addresses': result,
//                         'permissions': element
//                     }, (err, resp) => {
//                         if (err) {
//                             res.send({
//                                 'message': "permission not granted",
//                                 'statusCode': 400
//                             })
//                         } else {
//                             counter++;
//                             if (counter != permissions.length)
//                                 next();
//                             else {
//                               console.log("response"+resp);
//                             }
//                           }
//                         })
//                       })
//                     }
//                   })
//                 }
//               })
//             }






var obj = { gmailSMTPCredentials:gmailSMTPCredentials,
    twilioCredentials: twilioCredentials,
    smsCredentials:smsCredentials,
    imagePaths: imagePaths,
    rpiCredentials:rpiCredentials,
    pagination: pagination,
    hostingServer: hostingServer,
    userRole : userRole,
    employers : employers,
    multichain : multichain,
    multichainConn : multichainConn,
    doctor : doctor,
    createPrescription: createPrescription,
    adminCred :adminCred,
    doctorCategory :doctorCategory,
    BloodCategory :BloodCategory,
    DoctorDegree:DoctorDegree,
    supportEmailId: 'kavipal766@gmail.com', //Support Email Id to send mail signup and login and forgot password
    supportEmailIdpass: 'backtrack@123', //Support Email Id passoword
    supportEmailIdService: 'gmail',
    DoctorDepartment:DoctorDepartment


};

// function getNewAddressandpermissionOnMultichain(req,res) {
//   console.log("getnewaddress--------------------");
// multichainConn.getNewAddress((err, result) => {
//   console.log(err+result);
//     if (err)
//         return res.send({
//             status: 200,
//             message: "error to generate address"
//         });
//     else {
//       var counter = 0;
//       var permissions = ['send', 'receive', 'connect', 'mine', 'admin', 'activate', 'issue', 'create'];
//       Async.forEachLimit(permissions, 1, (element, next) => {
//           multichain.grant({
//               'addresses': result,
//               'permissions': element
//           }, (err, resp) => {
//               if (err) {
//                   res.send({
//                       'message': "permission not granted",
//                       'status': 400
//                   })
//               } else {
//                   counter++;
//                   if (counter != permissions.length)
//                       next();
//                   else {
//                       res.send({
//                           'message': "permission granted",
//                           'status': 200,
//                           'address':result
//                       })
//                   }
//               }
//           })
//       });
//
//             }
//           })
//         }

module.exports = obj;
