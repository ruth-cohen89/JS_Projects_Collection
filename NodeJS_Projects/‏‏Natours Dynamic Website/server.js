//Starter file
// Application Setup
//env var, importing express, starting the server, and connecting to DB
const mongoose = require('mongoose');
//we want to access the environment variables and assign password
//we will be able to connect to the DB
const dotenv = require('dotenv');

//catching & handling uncaught exceptions in synchronous code
process.on('uncaughtException', (err) => {
  console.log('UNHANDLED REJECTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  process.exit(1);
});

//Config env vars, before reading app module
//so the app will get access to them
//( In 1 of its mw it checks if we are on development...)
dotenv.config({ path: './config.env' });

//Require app
const app = require('./app');

//assign the password
//process is a global variable
const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

// The server has the controll on the DB,
// fetching his resources from there according to requests
//Connect to mongoDB through mongoose
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => console.log('You are connected to the DB 😺'));

const port = process.env.PORT || 3000;

// Express creates a server and starts it, listens to HTTP reqs
// In this case the server is started on local matchine
// the server gets the local host IP address => running on this computer
const server = app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

//catching & handling uncaught promise rejections (outside of express app)
//Listen to unhandledRejection event that the process object create automatically
//this event helps us handle all the errors that occur in async code which were not previously handled
process.on('unhandledRejection', (err) => {
  console.log('UNHANDLED REJECTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  //shut down app
  //First close the server( giving it time to close all reqs that are running/pending)
  //then kill the server
  server.close(() => {
    process.exit(1);
  });
});
