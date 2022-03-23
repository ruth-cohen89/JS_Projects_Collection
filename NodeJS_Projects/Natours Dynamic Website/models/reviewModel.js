const mongoose = require('mongoose');
const Tour = require('./tourModel');

const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, 'Review can not be empty!'],
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    // Parent ref - the review belongs to the tour
    //the review knows his tour, but not vis versa
    tour: {
      type: mongoose.Schema.ObjectId,
      ref: 'Tour',
      required: [true, 'Review must belong to a tour'],
    },
    // Same
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Review must belong to a user'],
    },
  },
  {
    //Each time that the data is actually ouputted as JSON/object
    // the virtuals(fields which are not stored in the DB) will be part of the output
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Prevent duplicate reviews on a tourfrom the same user
// Each combination of user-tour review has to be unique
reviewSchema.index({ tour: 1, user: 1 }, { unique: true });

// QUERY MIDDLEWARE
//populate the user and the tour when displaying review to the user
reviewSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'user',
    //not leaking private data
    select: 'name photo',
  });

  next();
});

//Static, calculates and stores ratingsQuantity & ratingsAverage each time a review is created/updated
// this technic of storing summary of a related dataSet on the main dataSet
// is to prevent constant queries of the related dataSet
// so we store those 2 fields, so we dont have query all the reviews and
// calculate them on each time we query for tour/s...
reviewSchema.statics.calcAverageRatings = async function (tourId) {
  const stats = await this.aggregate([
    {
      // All reviews of that tour
      $match: { tour: tourId },
    },
    {
      $group: {
        //group by tour id (all reviews of a specific tour)
        _id: '$tour',
        //For each doc in the group, (number of review docs for a tour)
        nRatings: { $sum: 1 },
        //average of ratings fields in the group of reviews
        avgRating: { $avg: '$rating' },
      },
    },
  ]);
  //console.log(stats);
  //update tour if there are reviews
  if (stats.length > 0) {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsQuantity: stats[0].nRatings,
      ratingsAverage: stats[0].avgRating,
    });
  } else {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsQuantity: 0,
      ratingsAverage: 4.5,
    });
  }
};

// Calling the static function when new review is created (save/create)
// note that the post mw doesnt get access to next()
reviewSchema.post('save', function () {
  //this points to current review

  // this.constructor and not Review, because Review model is not yet defined
  this.constructor.calcAverageRatings(this.tour);
});

// Pre queries: findByIdAndUpdate, findByIdAndDelete
reviewSchema.pre(/^findOneAnd/, async function (next) {
  //since its a query mw, we dont have access to the doc
  //in order to access the doc we execute a query on the current q
  //Defining on the query the review document
  // this - query, r - review doc
  this.r = await this.findOne();
  next();
});

// post queries: findByIdAndUpdate, findByIdAndDelete
// Calling the static function when updating a review
// to update the *tour*,
// we do it on post and not on pre,
//because only then the query is executed and the review is updated
reviewSchema.post(/^findOneAnd/, async function () {
  // await this.findOne doesnt work here, the query already executed
  //Extracting the tour id from qurey.r field from the previous mw
  await this.r.constructor.calcAverageRatings(this.r.tour);
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
