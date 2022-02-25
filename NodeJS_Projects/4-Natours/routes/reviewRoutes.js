const express = require('express');
// eslint-disable-next-line import/extensions
const reviewController = require('../controllers/reviewController');
const authController = require('../controllers/authController');

//By default each router has access to the parameters of his
//mergeParams enables access to parameters of the former router
const router = express.Router({ mergeParams: true });

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
  .post(
    //protect gives the user id (req.user.id)
    authController.protect,
    authController.restrictTo('user'),
    reviewController.createReview
  );

router
  .route('/:id')
  .patch(reviewController.updateReview)
  .delete(reviewController.deleteReview);

module.exports = router;
