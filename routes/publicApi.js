var express = require('express');
var user = require('../app/controllers/publicApi.js');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.send('respond with a resource');
});

/* To register a user. */
router.post('/register', user.register);
router.post('/updateMany', user.updateMany);
router.post('/getUpdatedValues', user.getUpdatedValues);
/* To verify email. */
router.get('/verifyemail/:token', user.verifyEmail);

/* To login. */
router.post('/login', user.login);

/* To recover password. */
router.post('/forgotPassword', user.forgotPassword);

/* To reset password. */
router.post('/resetpassword', user.resetPassword);


router.post('/imageUpload', user.imageUpload);
router.post('/check', user.check);
router.post('/getprofile',user.getProfile);
router.post('/userupdate',user.userupdate);
router.post('/logout',user.logout);

router.post('/viewProfile', user.viewProfile);
router.post('/login',user.login);
router.post('/updateForgotPassword',user.updateForgotPassword);





module.exports = router;
