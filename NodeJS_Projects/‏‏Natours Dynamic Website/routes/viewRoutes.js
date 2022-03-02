const express = require('express');

const viewsController = require('../controllers/viewsController');
const authController = require('../controllers/authController');
const router = express.Router();

// ROUTES which return a dynamic rendered file

// Rendering 'base' file (the root page) in the browser
// We can pass data in {} to the rendered file
//finding that file in the views folder we specidied ('base')
// when sending JSON data we specified .route() first, but here we only want get reqs
// The overview is the root, default
router.get('/', viewsController.getOverview);

router.get('/tour/:slug', authController.protect, viewsController.getTour);

router.get('/login', viewsController.getLoginForm);

module.exports = router;
