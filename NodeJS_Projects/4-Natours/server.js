//File related to the app
//Starter file
const dotenv = require('dotenv');
//Config env vars, before reading app module
dotenv.config({ path: './config.env' });

//Require app, which startes the server
const app = require('./app');

//console.log(process.env);

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
