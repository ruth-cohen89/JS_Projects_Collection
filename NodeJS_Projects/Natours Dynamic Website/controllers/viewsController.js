//This controller renders views
const Tour = require('../models/tourModel');
const User = require('../models/userModel');
const Booking = require('../models/bookingModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.getOverview = catchAsync(async (req, res, next) => {
  // 1) Get tour data from collection
  const tours = await Tour.find();
  // 2) Build template
  // 3) Render that template using tour data from 1)

  res.status(200).render('overview', {
    title: 'All tours',
    tours,
  });
});

exports.getTour = catchAsync(async (req, res, next) => {
  // 1) Get the data, for the requested tour (including reviews and guides)
  const tour = await Tour.findOne({ slug: req.params.slug }).populate({
    path: 'reviews',
    fields: 'review rating user',
  });

  if (!tour) {
    return next(new AppError('There is no tour with that name.', 404));
  }

  // 2) Build template
  // 3) Render template using data from 1)
  res.status(200).render('tour', {
    title: `${tour.name} Tour`,
    tour,
  });
});

exports.getLoginForm = (req, res) => {
  res.status(200).render('login', {
    title: 'Log into your account',
  });
};

exports.getSignUpForm = (req, res) => {
  res.status(200).render('signup', {
    title: 'Sign up now',
  });
};

exports.confirmEmailForm = (req, res) => {
  res.status(200).render('emailConfirm', {
    title: 'Confirm Your Email Address',
  });
};

exports.getStepOneForm = (req, res) => {
  res.status(200).render('step1', {
    title: 'Enter your phone number',
  });
};

exports.getStepTWoForm = (req, res) => {
  res.status(200).render('step2', {
    title: 'Enter your verification code',
  });
};

exports.forgotPassword = (req, res) => {
  res.status(200).render('forgotPassword', {
    title: 'Forgot password',
  });
};

exports.resetPassword = (req, res) => {
  res.status(200).render('resetPassword', {
    title: 'Reset your password',
  });
};

// All the tours that the user has booked
exports.getMyTours = catchAsync(async (req, res, next) => {
  // 1) Find all bookings of that user
  const bookings = await Booking.find({ user: req.user.id });

  // 2) Find tours with the retruned IDs
  const tourIDs = bookings.map((el) => el.tour);

  // Find all tours which their id is in tourIDs array
  const tours = await Tour.find({ _id: { $in: tourIDs } });

  res.status(200).render('overview', {
    title: 'My tours',
    tours,
  });
});
// (In step 1 we could also populate user field on bookings and display
// and do a virtual populate to bookings on Tour model
// but its away more complicated and not efficient in this case.. so we do it manually)

exports.getAccount = (req, res) => {
  // the protect mw gave us the current user
  res.status(200).render('account', {
    title: 'Your account',
  });
};

exports.updateUserData = catchAsync(async (req, res) => {
  // UPDATE USER
  const updatedUser = await User.findByIdAndUpdate(
    req.user.id,
    {
      name: req.body.name,
      email: req.body.email,
    },
    {
      //get the updated user data
      new: true,
      //run mongoose validatorsSymbol
      runValidators: true,
    }
  );

  // RENDER NEW DATA
  res.status(200).render('account', {
    title: 'Your account',
    user: updatedUser,
  });
});
