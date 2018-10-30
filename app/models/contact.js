var mongoose=require('mongoose')
var Schema=mongoose.Schema;
var contactSchema=new Schema({
 email:{ type:String},
  name:{ type:String},
  message:{ type:String},
  subject:{ type:String}


})
var contact = mongoose.model('contact', contactSchema);

module.exports = contact;
