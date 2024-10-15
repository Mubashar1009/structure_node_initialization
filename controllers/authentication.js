const catchAsync = require("../utils/globalCatch");
const {promisify} = require("util");
const jwt = require("jsonwebtoken");
const User  = require("../models/userSignup")
const userSignup = require("../models/userSignup");
exports.protectRoute = catchAsync(async(req,res,next) => {
       let token ; 
       if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
         token = req.headers.authorization.split(" ")[1];
         console.log("token: ", token);
       }
       if(!token) {
         return next(new Error("Not authorized, token required", 401));
       }
   const decoded =    await promisify(jwt.verify)(token,process.env.JWT_SECRET_KEY);
   console.log("decoded: ", typeof decoded.iat);
   // handle deleted user's token 
   console.log("User",User);
     const freshUser = await User.findById(decoded.id);
   if(!freshUser) {
     return next(new Error("User no longer exists", 401));
   }
   // handle token issue after password change 
  const passwordChange =   freshUser.changePasswordAfter(decoded.iat);
  if(passwordChange) {
    return next(new Error("User recently change  password,so login again ", 401));
  }

  req.user = freshUser;
  console.log("fresh user", req.user);
  next()
})

exports.deletePermission = (...roles) => {
     
  return (req,res,next) => {
    // when we pass in ... then it give use in array form
    console.log("roles: ", roles);
    if(!roles.includes(req.user.role)) {
      return next (new Error("You can not delete this thing ",403));
    }

   }
 }

