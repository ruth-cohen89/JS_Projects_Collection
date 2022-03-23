const Review = require('../models/reviewModel');
const Booking = require('../models/bookingModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const factory = require('./handlerFactory');

// MW that Specifies tour and user of the created review
// for later use in creating the actual review
//if the user didnt specify them in the request
exports.setTourUserIds = (req, res, next) => {
  // Allow nested routes
  //If user didn't specify tour/user in the body
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id;
  next();
};

exports.isBookedForUser = catchAsync(async (req, res, next) => {
  const booking = await Booking.find({
    tour: req.params.tourId,
    user: req.user.id,
  });

  if (booking.length === 0) {
    return next(new AppError('You did not book this tour 🥴', 401));
  }
  // Tour was actually booked
  next();
});

// CRUD
exports.createReview = factory.createOne(Review);
exports.updateReview = factory.updateOne(Review);
exports.getAllReviews = factory.getAll(Review);
exports.getReview = factory.getOne(Review);
exports.deleteReview = factory.deleteOne(Review);
