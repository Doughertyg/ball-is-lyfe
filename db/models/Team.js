const {model, Schema} = require('mongoose');

const teamSchema = new Schema({
  name: String,
  description: String,
  createdAt: String,
  profilePicture: String,
  bannerPicture: String,
  sport: String,
  admins: [{
      type: Schema.Types.ObjectId,
      ref: 'User'
  }],
  players: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }]
});

module.exports = model('Team', teamSchema);
