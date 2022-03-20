// stripe function creates a stripe object
const Stripe = require('stripe');
const Tour = require('../models/tourModel');
const Booking = require('../models/bookingModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');

exports.getCheckoutSession = catchAsync(async (req, res, next) => {
  const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

  // 1) Get the currently booked tour
  const tour = await Tour.findById(req.params.tourId);

  // 2) Create checkout session
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],

    // url called as soon as the credit card has been charged
    //(as soon as the payment succeesful), home page
    success_url: `${req.protocol}://${req.get('host')}/?tour=${
      req.params.tourId
    }&user=${req.user.id}&price=${tour.price}`,

    // to cancel payment, url: the tour page the user was priviously
    cancel_url: `${req.protocol}://${req.get('host')}/tour/${tour.slug}`,
    // user resource was provided by 'protect'
    customer_email: req.user.email,
    // for passing data about the session for creating a booking later
    client_reference_id: req.params.tourId,
    line_items: [
      {
        name: `${tour.name} Tour`,
        description: tour.summary,
        //live images on the internet
        images: [
          `${req.protocol}://${req.get('host')}/img/tours/${tour.imageCover}`,
        ],
        amount: tour.price * 100, // in cents
        currency: 'usd',
        quantity: 1,
      },
    ],
  });
  console.log(session);
  // 3) Create session as response
  res.status(200).json({
    status: 'success',
    session,
  });
});

exports.createBookingCheckout = catchAsync(async (req, res, next) => {
  // This is only TEMPORARY, because it's UNSECURE: everyone can make bookings without paying
  const { tour, user, price } = req.query;

  // If the request is not after user implemented checkout
  if (!tour && !user && !price) return next();
  await Booking.create({ tour, user, price });

  console.log('Payment complete!');
  //console.log(req.originalUrl.split('?'));

  // Go to homepage ('/')
  res.redirect(req.originalUrl.split('?')[0]);
});

// CRUD
exports.createBooking = factory.createOne(Booking);
exports.getBooking = factory.getOne(Booking);
exports.getAllBookings = factory.getAll(Booking);
exports.updateBooking = factory.updateOne(Booking);
exports.deleteBooking = factory.deleteOne(Booking);