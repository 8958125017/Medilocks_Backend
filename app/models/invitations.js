
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var invitationSchema = new Schema({
    senderUid 			: {type : String},
    receiverUid     	: {type : String},
    statusCode         	: {type: String,
                            enum: ['pending','accepted','rejected'],
                            default:'pending'
                           },
    receiverId          : {type : String},
    invitationType      : {type: String,
                            enum: ['registered','unregistered']
                           },
    isDeleted           : {type : Boolean, 'default': false},
    createdDate         : {type : Date, default: Date.now},
    updatedDate         : {type : Date, default: Date.now}
});


invitationSchema.pre('save', function (next) {
    var self = this;
    invitations.find({$and:[{receiverUid:self.receiverUid},{senderUid:self.senderUid}]}, function (err, docs) {
        if (!docs.length){
            next();
        }else{
            console.log('user exists: ');
            var error = new Error('Conversation exists');
            error.msg = "User has been already invited by you";
            next(error);
        }
    });
});

var invitations = mongoose.model('invitations', invitationSchema);

module.exports = invitations;