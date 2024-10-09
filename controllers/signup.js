const appError = require("../utils/appError");
const UserModel = require("../models/userSignup");
const catchAsync = require("../utils/globalCatch");

exports.signup = catchAsync(async (req, res, next) => {
  const { username, email, password,confirmPassword } = req.body;
  const existingUser = await UserModel.findOne({ email });
  if (existingUser) {
    console.log("User already exists");
    return next(new appError("User already exists", 409));
  }
  if (!username || !email || !password ||  !confirmPassword) {
    return next(new appError("Please provide all required fields", 400));
  }
  const newUser = await new UserModel({
    username,
    email,
    password,
    confirmPassword
  });
  await newUser.save();
  return res.status(201).send({ message: "User created successfully" });
});
