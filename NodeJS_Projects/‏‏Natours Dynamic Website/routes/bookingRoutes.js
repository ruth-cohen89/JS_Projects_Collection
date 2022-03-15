const express = require('express');
// eslint-disable-next-line import/extensions
const bookingController = require('../controllers/bookingController');
const authController = require('../controllers/authController');

const router = express.Router();

router.use(authController.protect);

// create booking session
//Doesnt follow REST Arc
// Accepting tour ID by which we will fill up
// the checkout session with all the data that is necessary(name, price...)
router.get(
  '/checkout-session/:tourId',
  authController.protect,
  bookingController.getCheckoutSession
);

router.use(authController.restrictTo('admin', 'lead-guide'));

router
  .route('/')
  .get(bookingController.getAllBookings)
  .post(bookingController.createBooking);

// GET/PATCH/DELETE booking
//If URL contains id parameter,
//Mongoose will try to find the booking with that id,
//if not found, will throw an error
router
  .route('/:id')
  .get(bookingController.getBooking)
  .patch(bookingController.updateBooking)
  .delete(bookingController.deleteBooking);

module.exports = router;
