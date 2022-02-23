//Routes handlers
//We fetch the data from the DB server
//and then send it back to the user inside the server response.
//Tour model
const Tour = require('../models/tourModel');
//API features
// eslint-disable-next-line import/extensions
const APIFeatures = require('../utils/apiFeatures.js');
//App Error class
const AppError = require('../utils/appError');
//Catch async errors class
const catchAsync = require('../utils/catchAsync');

//Manipulating the query object (before reaching getAllTours)
//by adding the right API Features
exports.aliasTopTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
};

exports.getAllTours = catchAsync(async (req, res, next) => {
  // EXECUTE QUERY
  //Passing a query object and the query string, and chaining feats
  const features = new APIFeatures(Tour.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
    //console.log(Tour.find())
  const tours = await features.query;
  //console.log(tours)
  //SEND RESPONSE
  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      tours,
    },
  });
});
//
exports.getTour = catchAsync(async (req, res, next) => {
  //populate fills up the referenced field to the docs data from another collection
  const tour = await Tour.findById(req.params.id).populate({
    path: 'guides',
    select: '-__v -passwordChangedAt',
  });
  // Tour.findOne({_id: req.params.id})
  //In case that the ID is almost valid except one char then
  //mongoose will not throw an error of unfound, but will return null,
  //but we want the user to know about it in production
  //so, we create an error for that (predicting)
  if (!tour) {
    return next(new AppError('No tour found with that ID', 404));
  }
  res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
});

exports.createTour = catchAsync(async (req, res, next) => {
  //validators of schema run automatically when calling .create()
  //mongoose throw errors of schema, so we dont need to create ones
  const newTour = await Tour.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      tour: newTour,
    },
  });
});

exports.updateTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    //run validators of schema again
    runValidators: true,
  });

  if (!tour) {
    return next(new AppError('No tour found with that ID', 404));
  }
  res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
});

exports.deleteTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findByIdAndDelete(req.params.id);
  if (!tour) {
    return next(new AppError('No tour found with that ID', 404));
  }
  res.status(204).json({
    status: 'success',
    data: null,
  });
});

//Displaying statistics for each level of diffculty of some tours
exports.getTourStats = catchAsync(async (req, res, next) => {
  //Building aggregation pipeline on an aggregate object
  //(the aggregate object is returned from Tour DB server)
  const stats = await Tour.aggregate([
    {
      //Match tours with ratingsAverage>4.5 only
      $match: { ratingsAverage: { $gte: 4.5 } },
    },
    {
      //Tranform documents - group by certain fields using accumulator,
      $group: {
        //group tours by their id, which is difficulty now
        _id: { $toUpper: '$difficulty' },
        //For each doc that will go through this pp, 1 will be added,
        //Sum of all tours (docs)
        numTours: { $sum: 1 },
        numRatings: { $sum: 'ratingsQuantity' },
        averageRating: { $avg: '$ratingsAverage' },
        avgPrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' },
      },
    },
    {
      //sort the groups by avgPrice
      $sort: { avgPrice: 1 },
    },
  ]);
  res.status(200).json({
    status: 'success',
    data: {
      stats,
    },
  });
});

//Get monthly plan per each month of the chosen year
exports.getMonthlyPlan = catchAsync(async (req, res, next) => {
  //Convert to number
  const year = req.params.year * 1; // 2021

  const plan = await Tour.aggregate([
    {
      //For each tour + start month create a seperate document
      //(Each tour has several start dates in an array,
      //so we want to split it to seperate docs according to the month)
      $unwind: '$startDates',
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },
    {
      $group: {
        //Group docs by their start date
        _id: { $month: '$startDates' },
        //How many tours per month
        numTourStarts: { $sum: 1 },
        //An array of the tours names
        tours: { $push: '$name' },
      },
    },
    {
      //add a field, the month
      $addFields: { month: '$_id' },
    },
    {
      $project: {
        //dont show up id field
        _id: 0,
      },
    },
    {
      //Sort by number of tours per a group, in a descending order
      $sort: { numTourStarts: -1 },
    },
    {
      //Don't show more then 12 groups per page?
      $limit: 12,
    },
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      plan,
    },
  });
});

//Before mongoose we had to validate this staff ourselves:
//Validate ID MW
//exports.checkID = (req, res, next, val) => {
// if (req.params.id * 1 > tours.length) {
//   return res.status(404).json({
//     status: 'fail',
//     message: 'Invalid ID🥲',
//   });
// }
//Go to next mw determined by tourRoutes
//next();
//};

//CheckBody middleware, when creating a new tour
// exports.checkBody = (req, res, next) => {
//   if (!req.body.name || !req.body.price) {
//     return res.status(400).json({
//       status: 'fail',
//       message: 'Missing name or price!',
//     });
//   }
//   next();
// }
