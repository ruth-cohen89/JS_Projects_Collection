//The router
const express = require('express');
//Requiring tour controller
const tourController = require('../controllers/tourController');
const authController = require('../controllers/authController');
const reviewRouter = require('./reviewRoutes');

const router = express.Router();

// POST /tours/234grf7/reviews
// GET /tours/456jio/reviews

//Nested route, router mounted
router.use('/:tourId/reviews', reviewRouter);

//Aliasing
router
  .route('/top-5-cheap')
  .get(tourController.aliasTopTours, tourController.getAllTours);

router.route('/tour-stats').get(tourController.getTourStats);
router.route('/monthly-plan/:year').get(tourController.getMonthlyPlan);

//CRUD operations on tours
router
  .route('/')
  .get(authController.protect, tourController.getAllTours)
  .post(tourController.createTour);

//If URL contains id parameter,
//Mongoose will try to find the tour with the id,
//if not found, it will throw an error
router
  .route('/:id')
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.deleteTour
  );

module.exports = router;
