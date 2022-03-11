//The router
// Our routers handle http requests
//and the server sends back http responses
const express = require('express');
//Requiring tour controller
const tourController = require('../controllers/tourController');
const authController = require('../controllers/authController');
const reviewRouter = require('./reviewRoutes');

const router = express.Router();

// POST /tours/234grf7/reviews
// GET /tours/456jio/reviews

// GET reviews on a specific tour
//Nested route, mounting
router.use('/:tourId/reviews', reviewRouter);

// Aliasing
router
  .route('/top-5-cheap')
  .get(tourController.aliasTopTours, tourController.getAllTours);

router.route('/tour-stats').get(tourController.getTourStats);
router
  .route('/monthly-plan/:year')
  .get(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide', 'guide'),
    tourController.getMonthlyPlan
  );

// Find tours within a radius (based on a given distance)
router
  .route('/tours-within/:distance/center/:latlng/unit/:unit')
  .get(tourController.getToursWithin);
// /tours-distance/233/latlng/-40,45/mi
// /tours-within/233/center/34.305562, -118.535168/unit/mi

//Calculate distance from a certain point to all the tours in the collection
router.route('/distances/:latlng/unit/:unit').get(tourController.getDistances);

router
  .route('/')
  .get(tourController.getAllTours)
  .post(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.createTour
  );

//If URL contains id parameter,
//Mongoose will try to find the tour with the id,
//if not found, it will throw an error
router
  .route('/:id')
  .get(tourController.getTour)
  .patch(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.uploadTourImages,
    tourController.resizeTourImages,
    tourController.updateTour
  )
  .delete(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.deleteTour
  );

module.exports = router;
