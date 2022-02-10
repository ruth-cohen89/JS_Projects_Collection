//The router
const express = require('express');

//Requiring tour controller
const tourController = require('../controllers/tourController');

const router = express.Router();

//Routing to the next middleware

//If URL contains id parameter, then use checkID MW
router.param('id', tourController.checkID);

//Now, determine the next middleWare
router
  .route('/')
  .get(tourController.getAllTours)
  .post(tourController.checkBody, tourController.createTour);

router
  .route('/:id')
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(tourController.deleteTour);

module.exports = router;
