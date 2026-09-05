const {model, Schema} = require('mongoose');

const userSchema = new Schema({
  username: {
    type: String,
    unique: true,
    sparse: true
  },
  name: String,
  phoneNumber: Number,
  bio: String,
  height: String,
  weight: String,
  location: String,
  profilePicture: String,
  googleProfilePicture: String,
  bannerPicture: String,
  password: String,
  authType: {
    type: String,
    enum: ['email_password', 'google'],
    default: 'email_password'
  },
  leagues: [{
    type: Schema.Types.ObjectId,
    ref: 'league'
  }],
  email: {
    type: String,
    unique: true,
    sparse: true
  },
  createdAt: String
});

module.exports = model('User', userSchema);
