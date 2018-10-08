var mongoose = require('mongoose');
var Schema =  mongoose.Schema;

var appointmentSchema = new Schema({
	createdAt     : { type: Date ,default : Date.now},
	updatedAt     : { type:Date, default: Date.now,select: false},
    appointment: {}
})
  var appointement = mongoose.model('Appointement', appointmentSchema);

  module.exports = appointement;
