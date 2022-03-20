const crypto = require('crypto');
//promisify function
const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const Email = require('../utils/email');

// Protect implements authentication
// RestrictTo implements authorization

//In production we use https in order to hide the token
//Create token and return
const signToken = (id) =>
  //(payload, key, header options)
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

//Create token and return in the response and in a cookie
const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);

  const cookieOptions = {
    //converting days to ms
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    //Don't let the browser modify/access the cookie
    // we cant manipulate/delete the cookie in the front end js code on the browser
    //Preventing cross-site-scripting attacks - the attacker may reach LS of the browser
    httpOnly: true,
  };

  // In production the cookie will be sent only on https
  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;

  // SEND COOKIE
  //Create cookie named jwt and data (token) we want to send in the cookie
  res.cookie('jwt', token, cookieOptions);
  //console.log(token)
  //All properties of a document that are selected as false
  //won't be displayed when the user asks to see the user document
  //but when creating a new doc (user) all assined fields are returned and seen
  //so in order to hide the password in the response, we do this:
  //Remove the password from the output
  user.password = undefined;
  //SEND RESOPNSE(body) in a promise which will be resolved by await
  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user,
    },
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  // 1) Create user data
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    role: req.body.role,
    // false until user confirms his email address
    emailConfirmed: false,
  });

  // 2) Generate confirm email random token
  // createEmailConfirmToken modifies the data in user
  //and returns the unencryped version of the token
  const confirmToken = newUser.createEmailConfirmToken();

  // Here we save the changes witout validating because we didnt modify all fields
  // Save user modification in createEmailConfirmToken
  await newUser.save({ validateBeforeSave: false });
  // 3) Send it to user's email
  try {
    const confirmURL = `${req.protocol}://${req.get(
      'host'
    )}/emailConfirm/${confirmToken}`;
    await new Email(newUser, confirmURL).sendWelcome();
    console.log(confirmURL);
    createSendToken(newUser, 200, res);
    res.status(200).json({
      status: 'success',
      message: 'Token sent to email!',
    });
  } catch (err) {
    newUser.confirmEmailToken = undefined;
    newUser.confirmEmailExpires = undefined;
    await newUser.save({ validateBeforeSave: false });
    return next(
      new AppError('There was an error sending the email. Try again later!'),
      500
    );
  }
});

exports.emailConfirm = catchAsync(async (req, res, next) => {
  console.log('confirming...', req.originalUrl);
  // console.log('confirming...', req.params.token)
  // 1) Get user based on the token
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');
  const user = await User.findOne({
    confirmEmailToken: hashedToken,
    confirmEmailExpires: { $gt: Date.now() },
  });
  //console.log('po', user)
  if (!user) {
    return next(new AppError('Token is invalid or has expired', 400));
  }
  // 2) If token has not expired, and there is user, confirm the email
  user.emailConfirmed = true;
  console.log('po', user.emailConfirmed)
  // Reset the confirm tk
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  // 3) Update
  await user.save({ validateBeforeSave: false });
  // 4) Log the user in, send JWT, now the reset password token will be forgotten - not valid
  createSendToken(user, 200, res);
});

//login - verify name and password and create a token
exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  // console.log(req.header)

  // 1) Check if the email and passowrd are valid
  if (!email || !password) {
    //create an error & send it to the global error mw handler
    //return makes sure that the login function finishes here
    return next(new AppError('Please provide email and password', 400));
  }

  // 2) Check if the user exists && password is correct
  //find by email, select - return fields that by default are false(not displayed)
  const user = await User.findOne({ email }).select('+password emailConfirmed'); ///working?
  //console.log(user);
  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Inncorrect email or password', 401));
  }
  //console.log('here',user.emailConfirmed)
  if (!user.emailConfirmed) {
    return next(
      new AppError('You have not confirmed your email address!', 401)
    );
  }

  // 3) If everything is ok, send token to client
  createSendToken(user, 200, res);
});

exports.logout = (req, res) => {
  res.cookie('jwt', 'loggedout', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  res.status(200).json({ status: 'success' });
};

//Authenticate the user by his token

exports.protect = catchAsync(async (req, res, next) => {
  // 1) Getting token and check of it's there
  let token;
  // If the client is postman, the API tester
  // then it will send the token in a header "Bearer"
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
    //If the client is the browser
    // then the token will be sent in a cookie
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) {
    return next(
      new AppError('You are not logged in! Please log in to get access.', 401)
    );
  }

  // 2) Verification token
  //this functions 3rd arg should be a callback that will return the token, but we want to work with promises!
  //so we make it return a promise instead, by using promisify,
  // returning the token if successful
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // 3) Check if user still exists
  //maybe the user has been deleted after the token has been issued
  //Maybe his token was stolen and the he deleted his account(to protect maybe)...
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(
      new AppError(
        'The user belonging to this token does no longer exist.',
        401
      )
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

  // GRANT ACCESS TO PROTECTED ROUTE
  //Identify the user in request (we would use this data in next middlewares)
  req.user = currentUser;
  res.locals.user = currentUser;
  next();
});

// Only for rendered pages, no errors!
exports.isLoggedIn = async (req, res, next) => {
  if (req.cookies.jwt) {
    try {
      // 1) verify token
      const decoded = await promisify(jwt.verify)(
        req.cookies.jwt,
        process.env.JWT_SECRET
      );

      // 2) Check if user still exists
      const currentUser = await User.findById(decoded.id);
      if (!currentUser) {
        return next();
      }

      // 3) Check if user changed password after the token was issued
      if (currentUser.changedPasswordAfter(decoded.iat)) {
        return next();
      }

      // THERE IS A LOGGED IN USER
      res.locals.user = currentUser;
      return next();
    } catch (err) {
      return next();
    }
  }
  next();
};

// Authorization
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

exports.forgotPassword = catchAsync(async (req, res, next) => {
  // 1) Get user based on POSTed email (we don't get the id)
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError('There is no user with this email address.', 404));
  }

  // 2) Generate the random reset token
  // createPasswordResetToken modifies the data in user
  //and returns the unencryped version of the token

  // the token is unique and has an expiration date, thats why we use it
  const resetToken = user.createPasswordResetToken();

  //Here we save the changes witout validating because we didnt modify all fields
  await user.save({ validateBeforeSave: false });
  // 3) Send it to user's email
  try {
    const resetURL = `${req.protocol}://${req.get(
      'host'
    )}/resetPassword/${resetToken}`;
    await new Email(user, resetURL).sendPasswordReset();

    res.status(200).json({
      status: 'success',
      message: 'Token sent to email!',
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(
      new AppError('There was an error sending the email. Try again later!'),
      500
    );
  }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  // 1) Get user based on the token
  console.log(req.originalUrl)
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });
   //console.log(user)
  // 2) If token has not expired, and there is user, set the new password
  if (!user) {
    return next(new AppError('Token is invalid or has expired', 400));
  }
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  // 3) Update changedPasswordAt property for the user is by pre mw
  await user.save();

  // 4) Log the user in, send JWT, now the reset password token will be forgotten - not valid
  createSendToken(user, 200, res);
});

//Logged-in user changes his password (protect mw set the user in the req before)
exports.updatePassword = catchAsync(async (req, res, next) => {
  //If someone access your open computer when you are logged he can your password
  //so as a security measure, we ask him for the current password

  // 1)  Get user from the collection,
  // req.user doesnt conatain the password field, that's why we fetch it now
  //password is hidden by default, so we specify that we want to get it
  const user = await User.findById(req.user.id).select('+password');

  // 2) Check if POSTed password is correct and user is found
  if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
    return next(new AppError('Your current password is wrong!', 401)); //401, unauthorized
  }

  // 3a) If so, update password
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;

  // 3b) Update changedPasswordAt property for the user,
  // validate passwordConfirm, and encrypt by pre doc mw
  await user.save();
  // User.findByIdUpdate will NOT work as intended!

  // 4) Log user in, send JWT
  createSendToken(user, 200, res);
});
