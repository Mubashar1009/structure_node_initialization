const jwt = require("jsonwebtoken");

exports.generateToken = (id)=>{
    return jwt.sign({ id }, process.env.JWT_SECRET_KEY, {
      expiresIn: process.env.JWT_EXPIRE_IN,
    });
  }
  