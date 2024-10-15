const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const appError = require("../utils/appError");
const crypto = require("crypto");
const user = mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true },
  password: { type: String, required: true,
    select : false
   },
   role : {
    type : String,
    enum  : ["user","admin"],
    default : "user",
   },
  confirmPassword: {
    type: String,
    required: true,
    validate: {
      //this will run only create or save 
      validator: function (e) {
        console.log("e",e,"password",this.password,this.username,this.email);
        return e === this.password
      },
      message : "Passwords are not same "
    },
    resetPasswordToken : String,
    resetPasswordExpiresIn : Date,
  },
  passwordChangeAt : Date
});
// user.pre('validate', function (next) {
//   if (this.confirmPassword === this.password) {
//    next()
//   }
//   next(new appError("Passwords do not match",400))
// });
user.methods.verifyPassword =  function (candidatePassword,userPassword) {

  return   bcrypt.compare(userPassword, candidatePassword);
 
 
};

user.methods.changePasswordAfter = function (JwtTimeStemp) {
  if(this.passwordChangeAt) {
    const convertPasswordChangeAtIntoNumber = parseInt(this.passwordChangeAt.getTime()/1000,10);
    console.log("Passwords change",convertPasswordChangeAtIntoNumber,JwtTimeStemp);
    //When we will change password then  passwordChangeAt will increase due to date or time change 
    return JwtTimeStemp< convertPasswordChangeAtIntoNumber
  }
  return false;
}
user.pre("save", async function (next)  {

   if(!this.isModified('password')) {

    return next()
   }
   this.password =await bcrypt.hash(this.password,12);
   this.confirmPassword = undefined;
   next()
})

user.methods.forgetPasswordMethod = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');
  this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  console.log({resetToken},this.resetPasswordToken);
  this.resetPasswordExpiresIn = Date.now() + 10*60 * 1000;
  return resetToken
}
module.exports = mongoose.model("User", user);
