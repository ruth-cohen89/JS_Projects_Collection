const mongoose = require('mongoose');

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

// QUERY MIDDLEWARE
//populate the user and the tour when displaying review to the user
reviewSchema.pre(/^find/, function (next) {
//   this.populate({
//     path: 'tour',
//     //not leaking private data, but the name
//     select: 'name',
//   });
  this.populate({
    path: 'user',
    //same
    select: 'name photo',
  });

  next();
});
const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
