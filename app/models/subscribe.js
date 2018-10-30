var mongoose=require('mongoose')
var Schema=mongoose.Schema;
var subscribeSchema=new Schema({
  email:{ type:String, unique:true},

})
var subscribe = mongoose.model('subscribe', subscribeSchema);

module.exports = subscribe;
