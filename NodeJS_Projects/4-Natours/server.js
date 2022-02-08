//File related to the app
//Starter file
const dotenv = require('dotenv');
//Config env vars, before reading app module
dotenv.config({ path: './config.env' });

const app = require('./app');

//console.log(process.env);

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
