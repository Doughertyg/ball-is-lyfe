const {model, Schema} = require('mongoose');

const gameSchema = new Schema({
  date: String,
  homeTeam: {
    type: Schema.Types.ObjectId,
    ref: 'TeamInstance'
  },
  homeScore: Number,
  awayScore: Number,
  awayTeam: {
    type: Schema.Types.ObjectId,
    ref: 'TeamInstance'
  },
  createdAt: String,
  season: {
    type: Schema.Types.ObjectId,
    ref: 'Season'
  },
});

module.exports = model('Game', gameSchema);
