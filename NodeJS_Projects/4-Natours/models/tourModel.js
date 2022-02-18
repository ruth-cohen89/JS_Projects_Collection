//validators of schema run automatic when calling .create()
//and also on update, (beacuse we defined them to on updateTour func)
const mongoose = require('mongoose');
const slugify = require('slugify');
//const validator = require('validator');
//The role of the schema is to describe the data,
//set default vaules, validate etc...
//here we can define some validators on the data
//which will be caught by the catchAsync class,
//and will be handled in errorController
//args: schema definition, object for schema options
const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      //Validator
      required: [true, 'A tour must have a name'],
      unique: true,
      trim: true,
      //These 2 validators are avilabe only on strings
      maxLength: [40, 'A tour name must have less or equal to 40 characters'],
      minLength: [10, 'A tour name must have more or equal to 10 characters'],
      // validate: [validator.isAlpha, 'Tour name must only contain characters'],
    },
    slug: String,
    duration: {
      type: Number,
      required: [true, 'A tour must have a duration'],
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'A tour must have a group size'],
    },
    difficulty: {
      type: String,
      required: [true, 'A tour must have a difficulty'],
      //validator (only for strings)
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: 'Difficulty is either easy, medium or difficult',
      },
    },
    //ratingsAverage & ratingsQuantity are not inserted by the user,
    //they are calculated by the app from the real reviews
    ratingsAverage: {
      type: Number,
      default: 4.5,
      //Validator (for numbers and dates)
      min: [1, 'Rating must be above 1.0'],
      max: [5, 'Rating must be below 5.0'],
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, 'A tour must have a price'],
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function (val) {
          //In a validator function 'this' keyword points to the current doc
          //on NEW document creation (but not in 'update' func, in such case it will point to the node object)
          //So, this function works only for posting a new doc
          //console.log(this);
          return val < this.price; //return true if priceDiscount is less than the price
        },
        message: 'Discount price ({VALUE}) should be below the regular price',
      },
    },
    summary: {
      type: String,
      trim: true,
      required: [true, 'A tour must have a description'],
    },
    description: {
      type: String,
      trim: true,
    },
    imageCover: {
      type: String,
      required: [true, 'A tour must have a cover image'],
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
      //Dont show to user
      select: false,
    },
    startDates: [Date],
    secretTour: {
      type: Boolean,
      default: false,
    },
  },
  {
    //Each time that the data is actually ouputted as JSON/object
    // the virtuals will be part of the output
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

//VIRTUAL: virtual properties are not persistent in the the DB
//but calculated when needed
//We can't use a virtual prperty in query (like: =1, no!)
//Create a virtual property: durationWeeks
//It will not be persisted in the DB, but will be calculated only when we get the data
//It will be created each time we get something from the DB
//this refers to current doc (also an object of the schema)
tourSchema.virtual('durationWeeks').get(function () {
  return this.duration / 7;
});

//mongoose has its own mw stack, which differs frim the app mw
// DOCUMENT MIDDLEWARE: runs before .save() and .create() (not on update)
//this refers to the document
//Define a slug field before creating a new doc
tourSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  //console.log(this);
  next();
});

// QUERY MIDDLEWARE: executes for all functions starting with find
//this refers to the query
//this one is executed right before the query made by .find() is executed
tourSchema.pre(/^find/, function (next) {
  this.find({ secretTour: { $ne: true } });

  this.start = Date.now();
  next();
});

//Runs after the query executed,
//Has an access to the returned docs
tourSchema.post(/^find/, function (docs, next) {
  console.log(`Query took: ${Date.now() - this.start} millisecs`);
  console.log('doc mw!');
  next();
});

// AGGREGATION MIDDLEWARE
//Runs before an aggregation executes
tourSchema.pre('aggregate', function (next) {
  //Add at the beginning of the pipeline array another stage
  this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
  console.log(this.pipeline());
  console.log('aggregation mw!');
  next();
});

//Create a model, which is also a collection
//An instance of a model is called a document.
const Tour = mongoose.model('Tour', tourSchema);
module.exports = Tour;
