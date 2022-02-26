//A script to import data from the files to the DB
//or to delete data from the DB
//This script runs independently, and only at the begining (for importing)
//We run this script from the console
const fs = require('fs');
const mongoose = require('mongoose');

const dotenv = require('dotenv');

// httpsconst Tour = require('../../models/tourModel');
const Tour = require('../../models/tourModel');
const User = require('../../models/userModel');
const Review = require('../../models/reviewModel');

//Config env vars, before reading app module
dotenv.config({ path: './config.env' });

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
  .then(() => console.log('You are connected to the DB 🕴️'));

//READ DATA FROM FILES
const tours = JSON.parse(
  // eslint-disable-next-line no-template-curly-in-string
  fs.readFileSync(`${__dirname}/tours.json`, 'utf-8')
);
const users = JSON.parse(
  // eslint-disable-next-line no-template-curly-in-string
  fs.readFileSync(`${__dirname}/users.json`, 'utf-8')
);
const reviews = JSON.parse(
  // eslint-disable-next-line no-template-curly-in-string
  fs.readFileSync(`${__dirname}/reviews.json`, 'utf-8')
);

//IMPORT DATA INTO DB
const importData = async () => {
  try {
    //create it in the models
    await Tour.create(tours);
    // Turn of validation for creating users(confirmpassword...)
    // Note! you need to manually comment out the middlewares
    // of password encryption & changedAt
    await User.create(users, { validateBeforeSave: false });
    await Review.create(reviews);
    console.log('Data successfuly loaded');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

// DELETE ALL DATA FROM DB
const deleteData = async () => {
  try {
    await Tour.deleteMany();
    await User.deleteMany();
    await Review.deleteMany();
    console.log('Data successfuly deleted');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

//Run the right func according to what we specify in the terminal
//On real time
if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}
//console.log(process.argv);
