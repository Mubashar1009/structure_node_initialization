const catchAsync = require("../utils/globalCatch");
const UserModel = require("../models/userSignup");
exports.forgotPassword = catchAsync(async(req,res,next)=> {
   
      const user  = await UserModel.findOne
      ({email: req.body.email},{new : true});
      if(!user) {
        return new Error("User not found Please provide a  email address");
      };
      
    const resetToken =   user.forgetPasswordMethod();
  await  user.save({validateBeforeSave:false});
  return  res.status(201).send({
    message : "User saved successfully"
  })
}) 