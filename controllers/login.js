 const appError = require("../utils/appError");
const UserModel = require("../models/userSignup");
const catchAsync = require("../utils/globalCatch");
exports.login = catchAsync(async (req, res,next) => {
    const {id} = req.params;
    
        console.log("login", );
        const user = await UserModel.findById(id);
      return  res.status(200).json({
         message: user,
       
        })
     
    
   
  
 
});