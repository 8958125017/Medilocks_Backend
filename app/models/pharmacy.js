var mongoose=require('mongoose')
var Schema=mongoose.Schema;
var pharmacySchema=new Schema({
  name:String,
  contactNo:String,
  email:String,
  city:String,
  password:String,
  license:String,
  image:String,
  avaliablity : {
    open:{type:String},
    close:{type:String}
  },
  address:{type:String},
  description : {type :String},
  multichainAddress : {type : String},
  createdAt:{ type: Date ,default : Date.now},
	updatedAt:{ type:Date, default: Date.now,select: false},
  isApproved:{type:Boolean,default:false},
  isBlock:{type:Boolean,default:false},
  isDelete:{type:Boolean,default:false},
  hospitalMultichainAddress:{type:String}
})
var pharmacy = mongoose.model('Pharmacy', pharmacySchema);
module.exports = pharmacy;
