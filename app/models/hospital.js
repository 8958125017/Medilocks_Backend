var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var hospitalSchema = new Schema({
  name:{ type:String,unique : true},
  contactNo : {type : String},
	password :{type:String},
  specialties:[],
  city:{type:String},
	email : { type : String },
  address:{type:String},
  description : {type :String},

  multichainAddress  :{type : String},
  timming : {
    open:{type:String},
    close:{type:String}
  },
  doctors:[],
  location:{},
  isApproved:{ type: Boolean, default: false},
  isBlock:{ type: Boolean, default: false},
  isDelete:{ type: Boolean, default: false},
  createdAt:{ type: Date ,default : Date.no},
	updatedAt:{ type:Date, default: Date.now,select: false},
  updatedHash:{type:String},
  image:{type:String},
  practiceSpecialties:{type:String},
patient:[
  { patientId : {type:mongoose.Schema.Types.ObjectId, ref: 'Patient'},
    mobileNo : { type : String},
    OTP : {type : String},
    status : {type : Boolean,default : false}
  }
],
doctor:[
  { doctorId : {type:mongoose.Schema.Types.ObjectId, ref: 'doctor'},
    mobileNo : { type : String},
    status : {type : Boolean,default : false}
  }
],
lab:[
  { labId : {type:mongoose.Schema.Types.ObjectId, ref: 'lab'},
    contactNo : { type : String},
    status : {type : Boolean,default : false}
  }
],
});



  var hospital = mongoose.model('Hospital', hospitalSchema);
  module.exports = hospital;
