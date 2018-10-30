var mongoose=require('mongoose')
var Schema=mongoose.Schema;
var ehrSchema=new Schema({
 patientId:{ type:String},
 doctorId:{ type:String},
 status:{ type:String},
 OTP:{ type:String},
 aadharNo:{type:String},
 time:{type:Date}


})
var ehr = mongoose.model('ehr', ehrSchema);

module.exports = ehr;
