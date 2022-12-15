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
      ref: 'users'
  }],
  players: [{
    type: Schema.Types.ObjectId,
    ref: 'users'
  }]
});

module.exports = model('Team', teamSchema);
