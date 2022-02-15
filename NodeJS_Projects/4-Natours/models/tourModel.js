//validators of schema run automatic when calling .create()
//and also on update, (beacuse we defined them to on updateTour func)
const mongoose = require('mongoose');
const slugify = require('slugify');
const validator = require('validator');
//The role of the schema is to describe the data,
//set default vaules, validate etc...
//args: schema definition, object for the schema object
const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour must have a name'],
      unique: true,
      trim: true,
      //These 2 validators are avilabe only on strings
      maxLength: [40, 'A tour name must have less or equal to 40 characters'],
      minLength: [10, 'A tour name must have more or equal to 40 characters'],
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
          console.log(this);
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
    // the virtuals are part of output
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);
//durationWeeks will ve created each time we get something from the DB
tourSchema.virtual('durationWeeks').get(function () {
  return this.duration / 7;
});

// DOCUMENT MIDDLEWARE: runs before .save() a nd .create() (not on update)
//this refers to the document
//Define a slug field before creating a new doc
tourSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  console.log(this);
  next();
});

// QUERY MIDDLEWARE: executes for all functions starting with find
//this refers to the query
//this one is executed right before find is the query made by .find() is executed
tourSchema.pre(/^find/, function (next) {
  this.find({ secretTour: { $ne: true } });

  this.start = Date.now();
  next();
});

//runs after the query executed,
//Has an access to the returned docs
tourSchema.post(/^find/, function (docs, next) {
  console.log(`Query took: ${Date.now() - this.start} millisecs`);
  //console.log(docs);
  next();
});

// AGGREGATION MIDDLEWARE
tourSchema.pre('aggregate', function (next) {
  //Add at the beginning of the pipeline array another stage
  this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
  console.log(this.pipeline());
  next();
});

//Create a model, which is also a collection
//An instance of a model is called a document.
const Tour = mongoose.model('Tour', tourSchema);
module.exports = Tour;
