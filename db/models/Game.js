const {model, Schema} = require('mongoose');

const gameSchema = new Schema({
  date: String,
  homeTeam: {
    type: Schema.Types.ObjectId,
    ref: 'teamInstance'
  },
  homeScore: Number,
  awayScore: Number,
  awayTeam: {
    type: Schema.Types.ObjectId,
    ref: 'teamInstance'
  },
  createdAt: String,
  season: {
    type: Schema.Types.ObjectId,
    ref: 'season'
  },
});

module.exports = model('Game', gameSchema);
