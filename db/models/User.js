const {model, Schema} = require('mongoose');

const userSchema = new Schema({
  username: String,
  name: String,
  phoneNumber: Number, 
  bio: String,
  height: String,
  weight: String,
  location: String,
  profilePicture: String,
  bannerPicture: String,
  password: String,
  leagues: [{
    type: Schema.Types.ObjectId,
    ref: 'league'
  }],
  email: String,
  createdAt: String
});

module.exports = model('User', userSchema);
