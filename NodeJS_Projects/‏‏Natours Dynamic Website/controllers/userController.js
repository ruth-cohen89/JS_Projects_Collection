// mw to handle multi-part form data
// multi-part - form encoding that is used to upload files from a form
const multer = require('multer');
// Image processing library
const sharp = require('sharp');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const factory = require('./handlerFactory');

// Without image processing:
//  Disk storage engine for toring files to disk.
// const multerStorage = multer.diskStorage({
//   // destination for storage
//   destination: (req, file, cb) => {
//     // null - no error, destination
//     cb(null, 'public/img/users');
//   },
//   // Define the file name in the folder
//   filename: (req, file, cb) => {
//     // user-id-timestamp.extension
//     const ext = file.mimetype.split('/')[1];
//     cb(null, `user-${req.user.id}-${Date.now()}.${ext}`);
//   },
// });

// Store image as buffer
// and not on disk, because
// we will do some image processing on resizeUserPhoto
// and there we will save on disk....
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

// multer mw
// upload is a an instance of multer
const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

// A single file with a 'photo' field which holds the uploaded file in the form
// single mw uploads the file to the destination
// and updates it in the req object (req.file)
exports.uploadUserPhoto = upload.single('photo');

// Resize uploaded user photo
exports.resizeUserPhoto = catchAsync(async (req, res, next) => {
  // If there was no upload continue to next mw
  if (!req.file) return next();

  // Specifiy filname for later use in updateMe mw
  req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;

  // read file and resize (h, w),
  // h=w -> square
  await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/img/users/${req.file.filename}`);

  next();
});

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
  // console.log(req.file);
  // console.log(req.body);
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
  // If user uploads a photo, give it the name we specified
  //console.log(req.file)
  if (req.file) filteredBody.photo = req.file.filename;

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
