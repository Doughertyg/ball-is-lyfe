const {model, Schema} = require('mongoose');

const gameSchema = new Schema({
  playDate: String,
  homeTeam: {
    type: Schema.Types.ObjectId,
    ref: 'teamSeasonInstance'
  },
  homeScore: Number,
  awayScore: Number,
  awayTeam: {
    type: Schema.Types.ObjectId,
    ref: 'teamSeasonInstance'
  },
  createdAt: String,
  season: {
    type: Schema.Types.ObjectId,
    ref: 'season'
  },
});

module.exports = model('Game', gameSchema);
