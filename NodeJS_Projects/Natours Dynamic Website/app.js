//The express application
// The application is express which includes
// optional paths of mw
// the app listens to client requests,
// according to the type of request
// it operates the right series of mw
// which ends up in a mw that
// ends up the req res cycle

// path is used to manipulate path names
const path = require('path');

// Create an express app, which is a series of middlewares
// it automatically has a server inside
const express = require('express');
//third party middleware
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
//secure http headers
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
//Against parameter pollution
const hpp = require('hpp');
// enables access to the cookie from the request
const cookieParser = require('cookie-parser');
// Compress data we sent to the client(JSON/HTML)
const compression = require('compression');
//Operational error class
const AppError = require('./utils/appError');
//Error controller
const globalErrorHandler = require('./controllers/errorController');

// Import routers (also mw)
// This routers are mini apps
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const bookingRouter = require('./routes/bookingRoutes');
const viewRouter = require('./routes/viewRoutes');
//Create Express application
const app = express();

// Template enigne, for creating templates & filling with data
app.set('view engine', 'pug');
//Define view folder
app.set('views', path.join(__dirname, 'views'));

// 1) GLOBAL MIDDLEWARES - will be called for every request.
// Serving in 'views' folder all static files to the browser
// from 'public' folder
app.use(express.static(path.join(__dirname, 'public')));

//helmet() returns a mw that sets seurity HTTP headers
app.use(helmet());

//Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

//Limit requests from the same API
//MW that defines max number of reqs per IP in a certain amount of time
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour!',
});
//All routes that satrt with api
app.use('/api', limiter);

// Body parser,
//express.json is a mw that returns the request body
// Enables the next mw's to acces, req.body
app.use(express.json({ limit: '10kb' }));

// express mw to show encoded data from a form
// The way the form sends data to the server is URL encoded
// example: updating user data from a form, using POST request,without using the API
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Cookie parser,
// Enables the next mw's to access the cookie, req.cookies
app.use(cookieParser());

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

// Compress al text sent to clients(not images)
app.use(compression());

// Test middleware, finds out when the request happened
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// 3) ROUTES

// ROUTES which return JSON data

//Mounting middlewares - routers (adding to MW stack with optional path)
//When a new request hits the server,
//then the matching router middleware will run from the mw stack

// Browser engine requests
app.use('/', viewRouter);

// API requests
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/bookings', bookingRouter);

//Handles all the rest of routes
//If the request wasn't sent back yet,
//then it means it didnt match any router, and it will reach this code
app.all('*', (req, res, next) => {
  //Creating an error for not finding the specified resource
  //when sending an argument to the 'next', the code automatically recognize it
  //as error handling mw and jumps to it, here it is an error we create with our class
  next(new AppError(`Can't find ${req.originalUrl} on this server 🙄`, 404));
});

//Global mw for error (object) handling
//all asyncoronous errors pass here,
//passing them to errorController
app.use(globalErrorHandler);

// START THE SERVER
// (on my local machine: 127.0.0.1:8000)
module.exports = app;
