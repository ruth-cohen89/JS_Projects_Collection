const express = require('express');
// eslint-disable-next-line import/extensions
const reviewController = require('../controllers/reviewController');
const authController = require('../controllers/authController');
const bookingController = require('../controllers/bookingController');

//By default each router has access to the parameters of his
//mergeParams enables access to parameters of the former router
const router = express.Router({ mergeParams: true });

// Only logged-in users can perform operations on reviews
//protect gives the user id (req.user.id)
router.use(authController.protect);

// POST /tours/234grf7/reviews (redirected)
// GET /tours/234grf7/reviews
// POST /reviews

router
  .route('/')
  .get(reviewController.getAllReviews)
  //Only authenticated users (by protect function)
  //and authorized (by restrictTo function) can post a review
  //protect actually provides the user id,
  //so no need to specicy the user id in the req
  // post '...api/v1/tours/5c88fa8cf4afda39709c2955/reviews'
  .post(
    // Only users can post a review
    authController.restrictTo('user'),
    bookingController.isBooked,
    // Check if book has already passed
    // if(tour.startDate),
    reviewController.setTourUserIds,
    reviewController.createReview
  );

router
  .route('/:id')
  .get(reviewController.getReview)
  // Guides & lead-guides are not allowed to change/delete a review
  .patch(
    authController.restrictTo('user', 'admin'),
    reviewController.updateReview
  )
  .delete(
    authController.restrictTo('user', 'admin'),
    reviewController.deleteReview
  );

module.exports = router;

//bookingController.isOutOfDate,
