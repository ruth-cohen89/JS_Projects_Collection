//promisify function
const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

//Create token
const signToken = (id) =>
  //(payload, key, header options)
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

//sign up
exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    passwordChangedAt: req.body.passwordChangedAt,
  });

  const token = signToken(newUser._id);
  //By sending the token the user will be logged in
  res.status(201).json({
    status: 'success',
    token,
    data: {
      user: newUser,
    },
  });
});

//login
exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // check the body of request is ok
  // 1) Check if the email and passowrd are valid
  if (!email || !password) {
    //create an error & send it to the global error mw handler
    //return makes sure that the login function finishes here
    return next(new AppError('Please provide email and password', 400));
  }

  // 2) Check if the user exists && password is correct (authenicate)
  //find by email and Select - return fields that by default are false(not displayed)
  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Inncorrect email or password', 401));
  }
  // 3) If everything is ok, send token to client
  const token = signToken(user._id);

  res.status(200).json({
    status: 'success',
    token,
  });
});

//Check if a user logged in and authenticate him
exports.protect = catchAsync(async (req, res, next) => {
  // 1) Get token and check if it's there
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(
      new AppError('You are not logged in! Please log in to get access.', 401)
    );
  }
  // 2) verify token (if payload hasn't changed & token hasnt expired)
  //this functions 3rd arg should be a callback that will return the token, but we want to work with promises!
  //so we make it return a promise instead, by using promisify,
  // returning the token if successful
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  //console.log(decoded);

  // 3) Check if user still exists
  //maybe the user has been deleted after the token has been issued
  //Maybe his token was stolen and the he deleted his account(to protect maybe)...
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(
      new AppError('The user belonging to this token does no longer exist', 401)
    );
  }

  // 4) Check if user changed password after the token was issued
  ///his password has changed after the token has been issued
  //If his token was stolen, the user changes password to protect his information
  // iat - issued at
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError('User recently changed password! Please log in again.', 401)
    );
  }

  //GRANT ACCESS TO PROTECTED ROUTE
  //If all correct - go to the next mw
  //Identify the user in request (we would use this data in next middlewares)
  req.user = currentUser;
  next();
});
//retrict route to specified users only
//A wrapper that takes in the args and returns the mw to execute now
//which will have access to roles because of the closure 
//because we cant pass args directly to mw...
exports.restrictTo =
  (...roles) =>
  (req, res, next) => {
    // roles ['admin', 'lead-guide'], role='user'
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError('You do not have permission to perform this action', 403)
      );
    }

    next();
  };
