const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    //parent referncing (tour, user)
    tour: {
      type: mongoose.Schema.ObjectId,
      ref: 'Tour',
      required: [true, 'Booking must belong to a tour!'],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Booking must belong to a user!'],
    },
    price: {
      type: Number,
      require: [true, 'Booking must have a price.'],
    },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  paid: {
    type: Boolean,
    default: true,
  },
},
  {
    //Each time that the data is actually ouputted as JSON/object
    // the virtuals(fields which are not stored in the DB) will be part of the output
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Prevent duplicate bookings on a tour from the same user
// Each combination of user-tour booking has to be unique
bookingSchema.index({ tour: 1, user: 1 }, { unique: true });

// populate
// there wont be many calls to booking( only admins and guides)
// so we can perform
bookingSchema.pre(/^find/, function (next) {
  this.populate('user').populate({
    path: 'tour',
    select: 'name',
  });
  next();
});

// HOLD!!!
// bookingSchema.pre('save', function (next) {
//   const 
//   // this.populate('user').populate({
//   //   path: 'tour',
//   //   select: 'name',
//   // });
//   next();
// });

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;
