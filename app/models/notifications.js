
var mongoose = require('mongoose'),
	Schema   = mongoose.Schema;

var notificationSchema = new Schema({
    message   			: {type: String},
    notificationsType   : {type: String, enum: ['general', 'alert', 'reminder']},
    notificationsStatus : {type: String, enum: ['read', 'unread'], default: 'unread'},
    from                : {type: String},
    to                  : {type: String},
    isDeleted           : {type: Boolean,  'default': false},
    createdAt           : {type: Date, default: Date.now},
    updatedAt           : {type: Date, default: Date.now}
});

var notifications = mongoose.model('notifications', notificationSchema);
module.exports = notifications;