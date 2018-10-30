var mongoose=require('mongoose')
var Schema=mongoose.Schema;
var visitSchema=new Schema({
  hospitalId:{type:String},
  doctorId:{type:String},
  date:{type:Number},
  vc:{type:Number}

})
var visitcount = mongoose.model('visitcount', visitSchema);

module.exports = visitcount;
