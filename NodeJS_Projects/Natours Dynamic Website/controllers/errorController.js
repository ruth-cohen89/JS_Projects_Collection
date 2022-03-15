//error controllers
//All caught errors are handled here
const AppError = require('../utils/appError');

//Create an AppError error for a casting error (created by mongoose)
//usually its an id object that can't be casted
const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  console.log('Handling a casting error');
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (err) => {
  const value = err.message.match(/(["'])(\\?.)*?\1/)[0];
  const message = `Duplicate field value: ${value}, Please use another value!`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);

  const message = `Invalid input data. ${errors.join('. ')}`;
  return new AppError(message, 400);
};

const handleJWTError = () =>
  new AppError('Invalid token. Please log in again!', 401);

const handleJWTExpiredError = () =>
  new AppError('Your token has expired! please log in again.', 401);

//Handle development errors
const sendErrorDev = (err, req, res) => {
  // A) API
  // original url = all the url without the host
  if (req.originalUrl.startsWith('/api')) {
    return res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack,
    });
  }

  // B) RENDERED WEBSITE
  console.error('ERROR 💥', err);
  return res.status(err.statusCode).render('error', {
    title: 'Something went wrong!',
    msg: err.message,
  });
};

// Handle production errors
const sendErrorProd = (err, req, res) => {
  // A) API
  if (req.originalUrl.startsWith('/api')) {
    //Operational errors, trusted: send message to the client, he can understand it
    if (err.isOperational) {
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });
    }
    // B) Programming or other unknown error: don't leak error details,
    // the user will not understand it, weird error
    // 1) Log error
    console.error('ERROR 💥', err);
    // 2) Send generic message
    return res.status(500).json({
      status: 'error',
      message: 'Something went very wrong!',
    });
  }

  // B) RENDERED WEBSITE
  // A) Operational, trusted error: send message to client
  if (err.isOperational) {
    console.log(err);
    return res.status(err.statusCode).render('error', {
      title: 'Something went wrong!',
      msg: err.message,
    });
  }
  // B) Programming or other unknown error: don't leak error details
  // 1) Log error
  console.error('ERROR 💥', err);
  // 2) Send generic message
  return res.status(err.statusCode).render('error', {
    title: 'Something went wrong!',
    msg: 'Please try again later.',
  });
};

// The controller starts from here:
module.exports = (err, req, res, next) => {
  //where the error was created is in the stck trace
  //when we create an error with the appError class this is an error we create
  //but there are errors that are not created by us, like mongoose ones,
  //such errors are thrown somewhere with a message and without a status code, so we define default 500
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  //throws the error according to the node environment
  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, req, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = Object.assign(err);

    //Here, we take async errors that were thrown (created by external, like mongoose server or jwt)
    //And mark them as operational by creating an error for each by the appError class
    //Marking errors as operational:
    //handle mongoose errors
    //if mongoose threw a casting error
    if (error.name === 'CastError') error = handleCastErrorDB(error);

    //If inserted an existed name when posting, also error by mongoose
    if (error.code === 11000) error = handleDuplicateFieldsDB(error);

    //Validation error created by mongoose schema
    if (error.name === 'ValidationError')
      error = handleValidationErrorDB(error);

    //Error by JWT, id changed
    if (error.name === 'JsonWebTokenError') error = handleJWTError();
    //Error by JWT, token expired
    if (error.name === 'TokenExpiredError') error = handleJWTExpiredError();

    sendErrorProd(error, req, res);
  }
};
