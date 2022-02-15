//Starter file
//here we do the setup application related to the app
//env var, importing express, start the server, and connect to DB
const mongoose = require('mongoose');
//we want to access the environment variables and assign password
//we will be bale to connect to the DB
const dotenv = require('dotenv');

//Config env vars, before reading app module
//so the app will get access to them
//( In 1 of its mw it checks if we are on development...)
dotenv.config({ path: './config.env' });

//Require app, which starts the server
const app = require('./app');

//assign the password
const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

//Conect to mongoDB through mongoose
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => console.log('You are connected to the DB 😺'));

const port = process.env.PORT || 3000;

//Listen to the server
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

//Natours:
//1)start with server.js
//creating a server and listen for incoming requests
//2)app.js (application-level middleware )
//and mounting the router that matches the mount path
//3) ...Router.js, (router-level middleware),
//and pile matching middlewares
//4) ...Controller.js , use piles mw and send back the reponse (in the last mw)

//Actually, in this project we create a web server (server.js)
//and an API that handles the requests(routes & controllers)
