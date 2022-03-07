const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const factory = require('./handlerFactory');

// MW for user manipulating himself
exports.createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not defined! use signUp instead. 😡',
  });
};

//Filtering chosen fields(allowedFields) in the body(obj)
const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    //newObj[name] = obj[name] {name:'Ruth'}
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

// User updating himself
exports.updateMe = catchAsync(async (req, res, next) => {
  // 1) Create error if user POSTs password data
  console.log(req.body);
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        'This route is not for password updates. Please use /updateMyPassword.',
        400
      )
    );
  }
  // save method isn't good in here, because it will use the doc mw,
  // but we don't need them here. they are related to password actions
  // also all the validators of other fields not good in here

  // 2) Filtered out unwanted fields that are not allowed to be updated
  const filteredBody = filterObj(req.body, 'name', 'email');

  // 3) Update user document
  // new: true - return the updated object, instead of the old one
  // in options, we don't specify the body, but the filterd fields,
  // because otherwise, an attacker could write nody.role: 'admin', not good.
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: 'success',
    data: {
      updatedUser,
    },
  });
});

// GET current user
exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

// DELETE - diactivate user, user can diactive himself
exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });

  // The server response:
  res.status(204).json({
    //204 - deleted
    status: 'success',
    data: null,
  });
});

exports.getAllUsers = factory.getAll(User);
exports.getUser = factory.getOne(User);
// Do NOT update passwords with this!
// updateUser & deleteUser are only for admin
exports.updateUser = factory.updateOne(User);
exports.deleteUser = factory.deleteOne(User);
