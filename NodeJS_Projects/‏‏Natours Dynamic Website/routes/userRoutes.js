const express = require('express');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

// mini app, mw
const router = express.Router();

//Related to authentication
router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.get('/logout', authController.logout);
router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);

// Authorization with JWT implemented by protect method
// Protecting all following operations,
// protect method provides the user id
router.use(authController.protect);

//CRUD operations on authenticated (signed-in) users
//REST Arc implemented here:
//the name of the URL has nothing to do with the action
//that is actually performed, unlike the .post('/signup') above...
router.patch('/updateMyPassword', authController.updatePassword);
router.get('/me', userController.getMe, userController.getUser);

router.patch(
  '/updateMe',
  userController.uploadUserPhoto,
  userController.resizeUserPhoto,
  userController.updateMe
);

//Delete - user can diactivate himself
router.delete('/deleteMe', userController.deleteMe);

// All following operations are allowed only to admin
router.use(authController.restrictTo('admin'));

router
  .route('/')
  .get(userController.getAllUsers)
  .post(userController.createUser);

router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
