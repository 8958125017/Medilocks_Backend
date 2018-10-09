

var mongoose = require('mongoose');
var NodeTtl = require( "node-ttl" );
var ttl = new NodeTtl();
var Schema = mongoose.Schema;
var tokenSchema = new Schema({
expire_at: {type: String},
token:{type:String},
  email:{type:String},
  requestType:{type:String}
})
var token = mongoose.model('Token', tokenSchema);
module.exports = token;
