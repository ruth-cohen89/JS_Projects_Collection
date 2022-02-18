//The express application
//Create an express app, which is a series of middlewares
//it automatically has a server inside
const express = require('express');
//third party middleware
const morgan = require('morgan');
//Operational error class
const AppError = require('./utils/appError');
//Error controller
const globalErrorHandler = require('./controllers/errorController');

//Import routers (also mw)
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

//Create Express application
const app = express();

// MIDDLEWARES
//If we are on development, print logging by morgan mw
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

//express.json is the body of the request (built-in mw)
//now we have access to the request body (from the next middlewares)
app.use(express.json());
//Middleware to serve static files in the browser
app.use(express.static(`${__dirname}/public`));

//Finds out when the request happened, saving it in the req obj
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  console.log(req.headers);
  next();
});

// ROUTES
//Mounting middlewares (adding it to the MW stack with optional path)
//When a new request hits the server,
//then the matching router middleware will run from the mw stack
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

//Handles all the rest of routes
//If the request wasn't sent back yet,
//then it means it didnt match any router, and it will reach this code
app.all('*', (req, res, next) => {
  //Creating an error for not finding the specified resource
  //when sending an argument to the 'next', the code automatically recognize it
  //as error handling mw and jumps to it, here it is an error we create with our class
  next(new AppError(`Can't find ${req.originalUrl} on this server 🙄`, 404));
});

//console.log(jj);
//Global mw for error (object) handling
//all asyncoronous errors pass here,
//passing them to errorController
app.use(globalErrorHandler);

// START THE SERVER
//on our local machine 127.0.0.1
module.exports = app;
