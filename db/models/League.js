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
    ref: 'season'
  }],
  admins: [{
    type: Schema.Types.ObjectId,
    ref: 'users'
  }],
  players: [{
    type: Schema.Types.ObjectId,
    ref: 'users'
  }]
});

module.exports = model('League', leagueSchema);
