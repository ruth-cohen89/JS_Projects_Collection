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
const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

//Handle production errors
const sendErrorProd = (err, res) => {
  //Operational errors, trusted: send message to the client, (the user can understand them)
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
    // Programming or other unknown error: don't leak error details,
    //the user will not understand them
  } else {
    // 1) Log error
    console.error('Error 💥', err);

    // 2) Send generic message
    res.status(500).json({
      status: 'error',
      message: 'Something went very wrong!',
    });
  }
};

// Controller code starts from here:
// Handling all errors made by the API
module.exports = (err, req, res, next) => {
  //where the error was created is in the stck trace
  //when we create an error with the appError class this is an error we create
  //but there are errors that are not created by us, like mongoose ones,
  //such errors are thrown somewhere with a message and without a status code, so we define default 500
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  //throws the error according to the node environment
  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    //console.log(err,'start')
    let error = Object.assign(err);
    //console.log(error, 'done')

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

    sendErrorProd(error, res);
  }
};
