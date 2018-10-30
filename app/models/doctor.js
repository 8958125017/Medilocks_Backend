var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var doctorSchema = new Schema({
	createdAt:{ type: Date ,default : Date.now},
	updatedAt:{ type:Date, default: Date.now,select: false},
  firstName:{ type:String},
  lastName:{ type:String},
  mobileNo :{type:String},
	password :{type:String},
  practiceSpecialties:[],
  hospitals : [],
  city:{type:String},
  gender : {type:String},
	email : { type : String},
  department : {type : String},
  bloodgroup : {type:String},
  age : {type:String},
  image:{type:String},
  avaliablity : {
    from:{type:String},
    to:{type:String}
  },
  address:{type:String},
  description : {type :String},
	designation:{type:String},
  hospitalId : {type : String,default:null},
  signupOTP : {type :String},
  signupOTPtimeExpire : {type : Date,default:+new Date() + 5*60*1000},
  multichainAddress:{type:String},
  aadharNo : {type : String},

    patient: [{
        patientId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Patient'
        },
        mobileNo: {
            type: String
        },
        OTP: {
            type: String
        },
        status: {
            type: Boolean,
            default: false
        }
    }],

    isApproved: {
        type: Boolean,
        default: false
    },
    isBlock: {
        type: Boolean,
        default: false
    },
    isDelete: {
        type: Boolean,
        default: false
    },
    degree: [],
    department: {
        type: String
    },
    dob: {
        type: Date
    }
})
var doctor = mongoose.model('Doctor', doctorSchema);
module.exports = doctor;
