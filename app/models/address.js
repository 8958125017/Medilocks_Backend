var mongoose = require('mongoose');
var Schema = mongoose.Schema;

let address = new Schema({
    requestType :  {type:String},
    address : {type:String},
    isDeleted           : { type: Boolean, default: false},
    createdAt           : { type:Date, default: Date.now,select: false},
    updatedAt           : { type:Date, default: Date.now,select: false}
});


var addressModel = mongoose.model('Address', address);

module.exports = addressModel;
