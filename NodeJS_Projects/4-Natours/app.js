//File related to express
//Create an express app, which is a series of middlewares
//it automatically has a server inside
const express = require('express');
//third party middleware
const morgan = require('morgan');

//Import routers (also mw)
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

//Create Express application
const app = express();

// 1) MIDDLEWARES
//If we are on development, print logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

//express.json is the body of the request (built-in in express)
//now we have access to the request body (from the next middlewares)
app.use(express.json());
//Middleware to serve static files in the browser
app.use(express.static(`${__dirname}/public`));

app.use((req, res, next) => {
  //console.log('Hello from the middleware🥰');
  //console.log(req.params);
  next();
});

//Finds when the request happens
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// 3) ROUTES
//Mounting the routers (adding them to the MW stack)
//When the request hits the matching route
//then it will run the matching router middleware in the ms
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

//4) Start THE SERVER
//on our local machine 127.0.0.1
module.exports = app;
