var mongoose = require('mongoose');
var Schema =  mongoose.Schema;
var patientSchema = new Schema({
	createdAt     : { type: Date ,default : Date.now},
	updatedAt     : { type:Date, default: Date.now,select: false},
	mobileNo:{type:String},
	patientName:{type:String},
	email:{type:String},
	address:{type:String},
	firstName : {type:String},
	lastName : {type:String},
	name : {type :String},
	age : {type:String},
	education : {type:String},
	bloodgroup : {type:String},
	dob: {type:String},
	city : {type:String},
	signupOTP : {type :String},
	signupOTPtimeExpire : {type : Date,default:+new Date() + 5*60*1000},
	doctorId : {type:String,default : ''},
	multichainAddress : {type : String},
	aadharNo : {type : String,unique : true},
	image:{type:String},	
	gender:{ type: String,	enum: ['Male','Female', 'Others'],
													default:'others'
												},
	ehr:[{
		uploadedBy : {type:mongoose.Schema.Types.ObjectId, ref: 'Doctor'},
        ehr : { type : String}
	}],

    pullEHRrequests : [{
    	doctorId : {type:mongoose.Schema.Types.ObjectId, ref: 'Doctor'},
        status : { type : Boolean},
				OTP : {type : String},
				status : {type : Boolean,default : false},
				Permission : {type : Boolean,default : false},


    }],
	pharmacyRecords : [{
		uploadedBy : {type:mongoose.Schema.Types.ObjectId, ref: 'Doctor'},
        pharmacy : { type : String}
	}],
	complaintRecords: [{
		uploadedBy : {type:mongoose.Schema.Types.ObjectId, ref: 'Doctor'},
        complain : { type : String}
	}],
	laborderRecords:[{
		uploadedBy : {type:mongoose.Schema.Types.ObjectId, ref: 'Doctor'},
        lab : { type : String}
	}],
    laborderBills:[{
		uploadedBy : {type:mongoose.Schema.Types.ObjectId, ref: 'Doctor'},
        lab : { type : String}
	}],
	TreatmentplanRecords:[{
		uploadedBy : {type:mongoose.Schema.Types.ObjectId, ref: 'Doctor'},
        treatment : { type : String}
	}],
	billRecords:[{
		uploadedBy : {type:mongoose.Schema.Types.ObjectId, ref: 'Doctor'},
        bill : { type : String}
	}],
	prescriptionRecords:[{
     uploadedBy : {type:mongoose.Schema.Types.ObjectId, ref: 'Doctor'},
     prescription : { type : String}
    }],
	isDelete:{ type: Boolean, default: false},
	isApproved :{ type: Boolean, default: false},
	isBlock:{ type: Boolean, default: false},
	password: {type:String},
	bloodGroup:{type:String},
	otp:{type:String}

})


var patient = mongoose.model('Patient', patientSchema);

module.exports = patient;
