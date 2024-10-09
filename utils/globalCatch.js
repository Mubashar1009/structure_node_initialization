const appError = require("./appError");

// We are write this function to remove try catch functionality from the overall app 
module.exports = fn => {
    return (req, res, next) => {
        console.log("user has  been existing")
        fn(req, res, next).catch((err) => {
            console.log("error** " + err)
            next((err))});
        // catch(next) we can write in this way also because it is javascript functionality that  catch function automaitcally goes to callback function  it is auto
      };
}