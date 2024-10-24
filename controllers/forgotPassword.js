const catchAsync = require("../utils/globalCatch");
const UserModel = require("../models/userSignup");
const sendEmail = require("../utils/email");
exports.forgotPassword = catchAsync(async(req,res,next)=> {
   
      const user  = await UserModel.findOne
      ({email: req.body.email});
      if(!user) {
        return new Error("User not found Please provide a  email address");
      };
      
    const resetToken =   user.forgetPasswordMethod();
   
 const newuser =  await  user.save({validateBeforeSave:false});
 const newurl = `${req.protocol}://${req.get("host")}/resetPassword/${resetToken}`;
 const message = `if you want to reset your password, then click on ${newurl} and if you do not want to reset your password then ignore it `;
 console.log("Email function",sendEmail); 
 try {
       await sendEmail ({
        to: user.email,
        subject: "Reset Password",
        text: message
        });
        
        return  res.status(201).send({
          message : "Email Send successfully",
          newuser  : newuser,
          resetToken : resetToken
        })
  }
  catch (error) {
        console.log(error);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpiresIn = undefined;
        await  user.save({validateBeforeSave:false});
        return next(new Error("Failed to send email"));
  }
  
}) 
