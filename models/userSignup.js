const mongoose = require("mongoose");
const bcrypt = require("bcrypt");const appError = require("../utils/appError");
`
`
const user = mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  confirmPassword: {
    type: String,
    required: true,
    // validate: {
    //   //this will run only create or save 
    //   validator: function (e) {
    //     console.log("e",e,"password",this.password,this.username,this.email);
    //     return e === this.password
    //   },
    //   message : "Passwords are not same "
    // },
  },
});
// user.pre('validate', function (next) {
//   if (this.confirmPassword === this.password) {
//    next()
//   }
//   next(new appError("Passwords do not match",400))
// });
user.pre("save", async function (next)  {

   if(!this.isModified('password')) {

    return next()
   }
   this.password =await bcrypt.hash(this.password,12);
   this.confirmPassword = undefined;
   next()
})

module.exports = mongoose.model("User", user);
