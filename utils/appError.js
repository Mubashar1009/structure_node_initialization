function appError(message, statusCode) {
  console.log("Messsage: " + message);
  const error = new Error(message);

  // Add custom properties to the error object
  error.statusCode = statusCode;
  error.status = getStatus(statusCode);
  error.isOperational = true;

  // Capture the stack trace
  captureStackTrace(error);

  return error;
}

function getStatus(statusCode) {
  return `${statusCode}`.startsWith("4") ? "fail" : "error";
}

function captureStackTrace(error) {
  Error.captureStackTrace(error, appError);
}

module.exports = appError;
