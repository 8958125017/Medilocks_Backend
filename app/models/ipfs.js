var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var userSchema = new Schema({
    // userId : { type:mongoose.Schema.Types.ObjectId, ref: 'users'},
    employeeName        : { type : String,default : ''},
    employerName        : { type : String,default : ''},
    email               : { type : String,default : ''},
    billissueDate       : { type : Date,default: Date.now},
    disease             : { type : String,default : ''},
    degination          : { type : String,default : ''},
    bill                : { type : String,default : ''},
    status              : { type: String,default : ''},
    isDeleted           : { type: Boolean, default: false},
    bills               : [],
    createdAt           : { type:Date, default: Date.now,select: false},
    updatedAt           : { type:Date, default: Date.now,select: false},
    // billType:    {type: String, enum: ['bill', 'prescription', 'diagnostic']},
    userId :    { type:mongoose.Schema.Types.ObjectId, ref: 'users'},
});

var users = mongoose.model('lock', userSchema);

module.exports = users;
