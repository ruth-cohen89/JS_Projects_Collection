const express = require('express');
// eslint-disable-next-line import/extensions
const bookingController = require('../controllers/bookingController');
const authController = require('../controllers/authController');

const router = express.Router();

//Doesnt follow REST Arc
// Accepting tour ID by which we will fill up
// the checkout session with all the data that is necessary(name, price...)
router.get(
  '/checkout-session/:tourId',
  authController.protect,
  bookingController.getCheckoutSession
);

module.exports = router;
