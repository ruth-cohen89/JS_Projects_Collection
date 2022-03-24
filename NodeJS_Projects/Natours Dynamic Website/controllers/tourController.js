//Routes handlers
// reads multi-part - form-data encoding
const multer = require('multer');
// Image processing library
const sharp = require('sharp');
const Tour = require('../models/tourModel');
//API features
// eslint-disable-next-line import/extensions
//App Error class
const AppError = require('../utils/appError');
//Catch async errors class
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');

// Store in memory
const multerStorage = multer.memoryStorage();

// Filter images files
const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    // accept file
    cb(null, true);
  } else {
    // reject file
    cb(new AppError('Not an image! Please upload only images.', 400), false);
  }
};

// upload mw
const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

exports.uploadTourImages = upload.fields([
  // only 1 field called imageCover which will be processed
  { name: 'imageCover', naxCount: 1 },
  // 3 fields named 'images'
  { name: 'images', naxCount: 3 },
]);

//If we had only 'images' field to upload files from:
// upload.array('images', naxCount: 3); req.files
// Only 1 field:
//upload.single('image')  req.file
// Above we have a mix (upload.fields()) req.files

// Resize uploaded user photo
exports.resizeTourImages = catchAsync(async (req, res, next) => {
  // If there was no upload continue to next mw
  // if (!req.files.imageCover || !req.files.images) return next();

  //console.log(req.body); //body doesnt contain files
  //console.log(req.files);
  // 1) Cover image

  // Add to req.body for later update in updateTour mw
  req.body.imageCover = `tour-${req.params.id}-${Date.now()}-cover.jpeg`;
  // read from buffer and then save to memory
  await sharp(req.files.imageCover[0].buffer)
    .resize(200, 1333) //2:3
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/img/tours/${req.body.imageCover}`);

  // 1) Images
  req.body.images = [];

  // await Promise.all is waiting for the promosises array
  // when each promise made inside the loop and was added to the array by map
  // before moving out to of the loop to the next line (next())
  await Promise.all(
    req.files.images.map(async (file, i) => {
      const filename = `tour-${req.params.id}-${Date.now()}-${i + 1}.jpeg`;

      await sharp(file.buffer)
        .resize(500, 500)
        .toFormat('jpeg')
        .jpeg({ quality: 90 })
        .toFile(`public/img/tours/${filename}`);

      // Add to req.body for later update in updateTour
      req.body.images.push(filename);
    })
  );
  console.log(req.body);
  next();
});

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


// Find tours within a radius /tours-within/233/lating/lating=34.305562, -118.535168/unit/mi
exports.getToursWithin = catchAsync(async (req, res, next) => {
  const { distance, latlng, unit } = req.params;
  const [lat, lng] = latlng.split(',');

  //The raduis of the earth sphere in radians (divided by mi or km)
  const radius = unit === 'mi' ? distance / 3963.2 : distance / 6378.1;
  console.log(radius);
  // If user didnt provide cordinates
  if (!lat || !lng) {
    next(
      new AppError(
        'Please provide latitude and longitude in the format lat, lang.',
        400
      )
    );
  }
  //find docs within a certain geometry
  const tours = await Tour.find({
    startLocation: { $geoWithin: { $centerSphere: [[lng, lat], radius] } },
  });

  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      data: tours,
    },
  });
});

//Calculate distance from a certain point to all the tours in the collection
exports.getDistances = catchAsync(async (req, res, next) => {
  const { latlng, unit } = req.params;
  const [lat, lng] = latlng.split(',');

  // if the unit is mile - convert to mile, if km - convert to km
  const multiplier = unit === 'mi' ? 0.000621371 : 0.001;

  // If user didnt provide cordinates
  if (!lat || !lng) {
    next(
      new AppError(
        'Please provide latitude and longitude in the format lat, lang.',
        400
      )
    );
  }

  //Calculations, aggregation pipeline
  // Returning all tours with their distances from the given location
  const distances = await Tour.aggregate([
    {
      // 'geoNear' always needs to be the first stage in the pipeline
      // requires that at least one field contains a geoSpatial index ('startLocation')
      // Outputs documents in order of nearest from a specified point.
      $geoNear: {
        // The point from which to calculate the distances (to all startLocations)
        near: {
          type: 'Point',
          coordinates: [lng * 1, lat * 1],
        },
        // All calculated distances will be stored in a new field, 'distance'
        distanceField: 'distance',
        distanceMultiplier: multiplier, //converting
      },
    },
    {
      //Display only these fields :)
      $project: {
        distance: 1,
        name: 1,
      },
    },
  ]);

  res.status(200).json({
    status: 'success',
    results: distances.length,
    data: {
      data: distances,
    },
  });
});
