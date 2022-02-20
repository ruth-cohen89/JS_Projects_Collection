const mongoose = require('mongoose');
//For creating custom validators
const validator = require('validator');

const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please tell us your name!']
    // maxLength
    // minLength
  },
  email: {
    type: String,
    required: [true, 'Please provide your email'],
    unique: true,
    lowerCase: true,
    validate: [validator.isEmail, 'Please provide a valid email']
  },
  //The path to the photo in our fs
  photo: String,
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
});

//Encrypt password between getting the data and saving it to the DB
userSchema.pre('save', async function (next) {
  //Only run this function if password was actually modified
  //If the user implemented update but modified another property
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

//THese 2 functions are related to the data, thats why they are in the model here
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

const User = mongoose.model('User', userSchema);
module.exports = User;
