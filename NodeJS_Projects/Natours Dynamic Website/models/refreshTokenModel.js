const mongoose = require('mongoose');
//for creating a random token
const { v4: uuidv4 } = require('uuid');

// Every user can have his own refresh tokens
const refreshTokensSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.ObjectId, ref: 'User' },
  token: String,
  expires: Date,
  // created: { type: Date, default: Date.now },
  // revoked: Date,
  // replacedByToken: String,
});

refreshTokensSchema.statics.createToken = async function (user) {
  const expiredAt = new Date();
  // refresh token expiration
  expiredAt.setSeconds(
    expiredAt.getSeconds() + process.env.JWT_REFRESH_TOKEN_EXPIRES_IN
  );
  // random token
  const _token = uuidv4();

  //create
  const _object = new this({
    token: _token,
    user: user._id,
    expiryDate: expiredAt.getTime(),
  });
  console.log(_object);

  // save refresh token in db
  const refreshToken = await _object.save();
  return refreshToken.token;
};

// Return refresh token expiration time
refreshTokensSchema.statics.verifyExpiration = (token) =>
  token.expiryDate.getTime() < new Date().getTime();

const RefreshToken = mongoose.model('RefreshToken', refreshTokensSchema);
module.exports = RefreshToken;
