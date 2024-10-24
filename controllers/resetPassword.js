const crypto = require('crypto');
const catchAsync = require("../utils/globalCatch");
const appError = require("../utils/appError");
const UserModel = require('../models/userSignup');
const { generateToken } = require('../utils/generateToken');

exports.resetPassword = catchAsync(async(req,res,next) => {
    const {token} = req.params;
    const oldToken = crypto.createHash('sha256').update(token).digest('hex');
    const user =await UserModel.findOne({resetPasswordToken: oldToken,resetPasswordExpiresIn: {$gt: new Date()}});
    if(!user) {
        return next (new appError('You token has been expired. Please try again'))
    }
    user.password = req.body.password;
    user.confirmPassword  = req.body.confirmPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpiresIn = undefined;
    await user.save();
    const newToken = generateToken(user._id);
    res.status(200).json({
        success: true,
        message: 'Password has been reset successfully',
        token: newToken
    })

})