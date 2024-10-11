const appError = require("../utils/appError");

const sendDevError = (err, res) => {
  res.status(err.statusCode).send({
    status: err.status,
    message: err || "An error occurred",
    stack: err.stack || "Error",
  });
};
const sendProductionError = (err, res) => {
  if (err.isOperational) {
    console.log("Error: " + err.message);
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  }
  res.status(500).json({
    status: "Error",
    message: err,
  });
};

const handleCastErrorDB = (error) => {
  const message = `Invalid ${error.path}: ${error.value}.`;
  console.log("Message: " , message);
  return new appError(message, 400);
};

const handleDoublicateFieldsDB = (error) => {
  const value = error.errmsg.match(/(["'])(?:(?=(\\?))\2.)*?\1/)[0];
  const message = `Duplicate field value: ${value}. Please use unique values.`;
 return new appError(message,400);
}

const handleValidationErrorDB = (error) => { 
  const errors = Object.values(error.errors).map(value =>value.message);
  const message = `
  Invalidate input data. ${errors.join(', ')}
  `
  return new appError(message, 400);
 
}
const handleJsonWebTokenError = () => {
  const message = "Invalid token. Please login again.";
  console.log("Message: " , message);
  return new appError(message, 401);
 }

 const handleTokenExpiredError = () => {
  const message = "Token expired. Please login again.";
  console.log("Message: " , message);
  return new appError(message, 401);
 }
module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";
  if (process.env.NODE_ENV ==="development") {
    console.log("development environment",process.env.NODE_ENV)
    sendDevError(err, res);
  } 
   if (process.env.NODE_ENV ==="production") {
     let error;
    if (err.name === "CastError") {   
          error = handleCastErrorDB(err);
 
    }
    if(err.code === 11000) {
      error  = handleDoublicateFieldsDB(err);
    }
    if(err.name === "ValidationError") {
      error  = handleValidationErrorDB(err);
    }
    if(err.name === "JsonWebTokenError") {
      error = handleJsonWebTokenError();
    }
    if(err.name === "TokenExpiredError") {
      error = handleTokenExpiredError();
     }
    return sendProductionError(error, res);
  // res.status(500).json({
    
  //   message:error.message,
  // })
  }
};
