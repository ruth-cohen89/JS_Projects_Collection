// Factory function
//We return the handler functions to the API controllers
const AppError = require('../utils/appError');
//Catch async errors class
const catchAsync = require('../utils/catchAsync');
// eslint-disable-next-line import/extensions
const APIFeatures = require('../utils/apiFeatures.js');

//Return delete handler function
exports.deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);
    if (!doc) {
      return next(new AppError('No Document found with that ID', 404));
    }

    res.status(204).json({
      status: 'success',
      data: null,
    });
  });

exports.updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      //run validators of schema again
      runValidators: true,
    });

    if (!doc) {
      return next(new AppError('No document found with that ID', 404));
    }
    res.status(200).json({
      status: 'success',
      data: {
        data: doc,
      },
    });
  });

// for Tour & Review only
exports.createOne = (Model) =>
  catchAsync(async (req, res, next) => {
    //validators of schema run automatically when calling .create()
    const doc = await Model.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        data: doc,
      },
    });
  });

exports.getOne = (Model, popOptions) =>
  catchAsync(async (req, res, next) => {
    // Create query
    let query = Model.findById(req.params.id);
    // Tour.findOne({_id: req.params.id})

    //If some fields need to be populated
    if (popOptions) query = query.populate(popOptions);
    const doc = await query;

    //In case that the ID is almost valid except one char then
    //mongoose will not throw an error of unfound, but will return null,
    //but we want the user to know about it in production
    //so, we create an error for that (predicting)
    if (!doc) {
      return next(new AppError('No document found with that ID', 404));
    }
    res.status(200).json({
      status: 'success',
      data: {
        data: doc,
      },
    });
  });

exports.getAll = (Model) =>
  catchAsync(async (req, res, next) => {
    let filter = {};
    //If user specified tour,
    // filter and find only his reviews/bookings - (Model)
    if (req.params.tourId) filter = { tour: req.params.tourId };

    //Passing a query object and the query string, chaining features
    const features = new APIFeatures(Model.find(filter), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    const doc = await features.query;

    //SEND RESPONSE
    res.status(200).json({
      status: 'success',
      results: doc.length,
      data: {
        data: doc,
      },
    });
  });
