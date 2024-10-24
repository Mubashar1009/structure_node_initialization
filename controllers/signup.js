const appError = require("../utils/appError");
const UserModel = require("../models/userSignup");
const catchAsync = require("../utils/globalCatch");

const { generateToken } = require("../utils/generateToken");

exports.signup = catchAsync(async (req, res, next) => {
  const { username, email, password, confirmPassword } = req.body;
  const existingUser = await UserModel.findOne({ email });
  if (existingUser) {

    return next(new appError("User already exists", 409));
  }
  if (!username || !email || !password || !confirmPassword) {
    return next(new appError("Please provide all required fields", 400));
  }
  // we can write req.body instead of writing each field separately
  const newUser = await new UserModel(req.body);
  //jwt token
  const token = generateToken(newUser._id);
  await newUser.save();
  return res.status(201).send({ message: "User created successfully", token });
});
exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new appError("Please provide all required fields", 400));
  }
  const existingUser = await UserModel.findOne({ email }).select("+password");

  const verifyPassword = await existingUser.verifyPassword(
    existingUser.password,
    password
  );

  if (!existingUser || !verifyPassword) {
    return next(new appError("Your Password or email is incorrect", 401));
  }

  return res.status(201).send({ message: existingUser });
});
