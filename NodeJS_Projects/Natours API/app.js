//The express application
//Create an express app, which is a series of middlewares
//it automatically has a server inside
const express = require('express');
//third party middleware
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
//secure http headers
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
//Agains parameter pollution
const hpp = require('hpp');

//Operational error class
const AppError = require('./utils/appError');
//Error controller
const globalErrorHandler = require('./controllers/errorController');

//Import routers (also mw)
// This routers are mini apps
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');

//Create Express application
const app = express();

// 1) GLOBAL MIDDLEWARES - will be called for every request.
//Set seurity HTTP headers
//helmet() returns a mw, that will be called when there is a req
app.use(helmet());

//Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

//Limit requests from same API
//MW that defines max number of reqs per IP in a certain amount of time
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour!',
});
//All routes that satrt with api
app.use('/api', limiter);

// Body parser, reading data from the body into req.body
//express.json is the body of the request (built-in mw)
//now we have access to the request body (from the next middlewares)
app.use(express.json({ limit: '10kb' }));

// Serving static files in the browser
app.use(express.static(`${__dirname}/public`));

// Data sanitization against NoQsql query injection (sql pollution)
//Returns a mw to use, otherwise
//This mw looks at the req body, querystring and params
// and filters out all '$' and '.'
app.use(mongoSanitize());

// mongo's validation is great against this xss

// Data santiziation agains XSS (html pollution)
// By converting the html symbols
// Cleans user input from malicious html code
//An attacker can insert malicious html code with some js code attached to it
//It could be injected to the html site and create damage
app.use(xss());

// Prevent parameter pollution (clean the query string from duplicates)
// so we protect from error
// If the query is (?sort=duration&sort=price) then it will sort only by the last one, which is priceDiscount
// We specify whitelist - an array of properties which we allow dupliate in query string
// (duration=5&duration=9) will return both durations 5 and 9 and not only 9..
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsQuantity',
      'ratingsAverage',
      'maxGroupSize',
      'difficulty',
      'price',
    ],
  })
);

// Test middleware, finds out when the request happened
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  //console.log(req.headers);
  next();
});

// ROUTES MOUNT ROUTERES
//Mounting middlewares - routers (adding to MW stack with optional path)
//When a new request hits the server,
//then the matching router middleware will run from the mw stack
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);

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
