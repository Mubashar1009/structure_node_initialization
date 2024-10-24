const UserModel = require('../models/userSignup');
const catchAsync = require("../utils/globalCatch");
const appError = require("../utils/appError");
const { generateToken } = require('../utils/generateToken');

exports.updatePassword = catchAsync(async(req,res,next)=>{
      const user  = await UserModel.findById(req.user.id).select("+password");
      if(!user) {
        return new appError("User not found");
      }
      if(! await user.verifyPassword(req.body.passwordCurrent,user.password)) {
        return new appError("Your Current Password is incorrect");
      }
      user.password = req.body.password;
      user.confirmPassword = req.body.confirmPassword;
      await user.save();
 
    const token =   generateToken(user._id)
    res.status(201).json({
        success: true,
        message : "Password updated successfully",
        token 
    })

})

const filterObject = (obj,...remaining) => {
    const object = {};
     Object.keys(obj).forEach(key => {
      console.log("filterObject",key,obj[key]);
     if( remaining.includes(key)) {
      object[key] = obj[key]
     };
    })
    console.log("Object",object);
  return object;
}
exports.updateMe = catchAsync(async(req,res,next) => {
  console.log("user",req.user)
      if(!req.body.password || !req.body.confirmPassword) {
        return next(new appError("Please enter  password"));
      }
      const object = filterObject(req.body,'email','username');
   const user =     await UserModel.findByIdAndUpdate(req.user.id,object,{
        new:true,
        runValidator: true
      })
      return res.status(200).json ({
        message : "user updated successfully",
        user
      })
})

exports.deleteMe = catchAsync(async(req,res,next)=>{
          console.log("deleteMe",req.user.id);
       
     // when we want to get all active user then by mongo db query $nq : false will apply in find query and we will get all active users    
     const user =    await UserModel.findByIdAndUpdate(req.user.id, {
          status:false
        },{
          new : true
        }).select('+password')
        console.log("user",user);
        if(!user || !(req.body.password,user.password) ) {
          return next(new appError("You must provide a correct password",401));
        }   
        return res.status(201).json ({
          message : "user deleted successfully",
          user
        })
})