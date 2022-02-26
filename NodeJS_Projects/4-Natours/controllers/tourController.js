//Routes handlers
//We fetch the data from the DB server
//and then send it back to the user inside the server response.
//Tour model
const Tour = require('../models/tourModel');
//API features
// eslint-disable-next-line import/extensions

//App Error class
const AppError = require('../utils/appError');
//Catch async errors class
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');

//Manipulating the query object (before reaching getAllTours)
//by adding the right API Features
exports.aliasTopTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
};

exports.getAllTours = factory.getAll(Tour);
//also populating the path property (to the virtual field - reviews)
exports.getTour = factory.getOne(Tour, { path: 'reviews' });
exports.createTour = factory.createOne(Tour);
exports.updateTour = factory.updateOne(Tour);
//We call factory.deleteOne() function and it
//is returnes and sits here until it is called as soon as we hit the corresponding route
exports.deleteTour = factory.deleteOne(Tour);

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
