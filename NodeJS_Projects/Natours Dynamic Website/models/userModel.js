const crypto = require('crypto');
const mongoose = require('mongoose');
//For creating custom validators
const validator = require('validator');

const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please tell us your name!'],
    // maxLength
    // minLength
  },
  email: {
    type: String,
    required: [true, 'Please provide your email'],
    unique: true,
    lowerCase: true,
    validate: [validator.isEmail, 'Please provide a valid email'],
  },
  //The path to the photo in our fs
  photo: { type: String, default: 'default.jpg' },
  role: {
    type: String,
    enum: ['user', 'guide', 'lead-guide', 'admin'],
    default: 'user',
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minLength: 8,
    //dont show the password when returning the object
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your password'],
    //validator func is boolean, false - validation error
    //This only work on CREATE and SAVE!! (if we want to upadte we should use save so it will be validated)
    validate: {
      validator: function (el) {
        return el === this.password;
      },
      message: 'Passwords are not the same!',
    },
  },
  //This field exists only if password has been changed
  passwordChangedAt: Date,
  // If reseting password
  passwordResetToken: String,
  passwordResetExpires: Date,
  // If confirming email
  confirmEmailToken: String,
  confirmEmailExpires: Date,
  emailConfirmed: {
    type: Boolean,
    default: true,
  },
  //If user is active
  active: {
    type: Boolean,
    default: true,
    //dont show to user
    select: false,
  },
});

// DOCUMENT MIDDLEWARES
//doesnt run before findAndUpdate!
//Encrypt password between getting the data and saving it to the DB
userSchema.pre('save', async function (next) {
  //Only run this function if password was actually modified
  //Because maybe the user implemented update but modified another property
  if (!this.isModified('password')) return next();

  //Hash the password with cost of 12
  //this is sync ard returns a promise
  this.password = await bcrypt.hash(this.password, 12);

  //Delete passwordConfirm field
  //This field is no longer needed after validating password = passwordConfirm
  //and we dont persist it to the DB
  this.passwordConfirm = undefined;
  next();
});

//Before saving, update passwordChangedAt property
userSchema.pre('save', function (next) {
  //if password hasnt changed just now/the doc is new,
  if (!this.isModified('password') || this.isNew) return next();
  // console.log('Password changed');
  // console.log(Date.now());
  //Sometimes the new token is created a bit before passwordChangetAt is created,
  //so we subscrapt 1 second before saving, now the password will always change before the token is created
  this.passwordChangedAt = Date.now() - 1000;
  next();
});

// QUERY mw
//thiz points to current query
//All queries starting with find
userSchema.pre(/^find/, function (next) {
  //Find - display only active users
  this.find({ active: { $ne: false } });
  next();
});

// INSTANCE METHODS
//These 2 functions are related to the data, thats why they are in the model here
//This instace method can be access by all users, its a model method
//In an instance method, this points to the current document (which is called from)
//Authinticationg a given password, boolean
userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  //Since bcrypt doesnt use salt, the result of bcrypting the same string will always be the same..?
  return await bcrypt.compare(candidatePassword, userPassword);
};

//Checks if password changed after the token was issued
userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  //If password changed
  if (this.passwordChangedAt) {
    const changedTimeStamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    //console.log(changedTimeStamp, JWTTimestamp);
    //true - the token was issued before password changed, false - the opposite
    return JWTTimestamp < changedTimeStamp;
  } //else. not changed
  return false;
};

userSchema.methods.createPasswordResetToken = function () {
  //this reset token isnt created with jwt, but with crypto
  //so we need to store it in db, so we will be able to compare after...
  //we never store a raw token in the db, because if someone breaks it, he may get this token
  //so store as encrypted, but not as strong as the passowrd, so use the built it crypto only
  const resetToken = crypto.randomBytes(32).toString('hex');
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  //for 10 min in ms
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  return resetToken;
};

// To make authenticate the email confirm we use a token
userSchema.methods.createEmailConfirmToken = function () {
  //this token isnt created with jwt, but with crypto
  //so we need to store it in db, so we will be able to compare after...
  //we never store a raw token in the db, because if someone breaks it, he may get this token
  //so store as encrypted, but not as strong as the passowrd, so use the built it crypto only
  // create
  const confirmToken = crypto.randomBytes(32).toString('hex');
  // store
  this.confirmEmailToken = crypto
    .createHash('sha256')
    .update(confirmToken)
    .digest('hex');

  // Valid for 3 days
  this.confirmEmailExpires = Date.now() + 1000 * 60 * 60 * 24 * 3;
  return confirmToken;
};

const User = mongoose.model('User', userSchema);
module.exports = User;
