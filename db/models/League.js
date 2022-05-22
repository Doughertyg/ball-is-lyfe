const {model, Schema} = require('mongoose');

const leagueSchema = new Schema({
  name: String,
  description: String,
  createdAt: String,
  profilePicture: String,
  location: String,
  bannerPicture: String,
  sport: String,
  seasons: [{
    type: Schema.Types.ObjectId,
    ref: 'Season'
  }],
  admins: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  players: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }]
});

module.exports = model('League', leagueSchema);
