const {model, Schema} = require('mongoose');

const seasonSchema = new Schema({
  captains: [{
    type: Schema.Types.ObjectId,
    ref: "User"
  }],
  createdAt: String,
  gameConfiguration: {
    scoreStat: {
      type: Schema.Types.ObjectId,
      ref: 'Stat'
    },
    winCondition: {
      type: String,
      enum: ['GREATER', 'LESSER']
    },
    periods: Number,
    periodLength: Number,
  },
  name: String,
  description: String,
  games: [{
    type: Schema.Types.ObjectId,
    ref: 'Game'
  }],
  seasonStart: String,
  seasonEnd: String,
  league: {
    type: Schema.Types.ObjectId,
    ref: 'League'
  },
  players: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  teams: [{
    type: Schema.Types.ObjectId,
    ref: "TeamInstance"
  }],
  stats: [{
    type: Schema.Types.ObjectId,
    ref: "Stat"
  }],
  statUnits: [{
    type: Schema.Types.ObjectId,
    ref: "StatUnit"
  }],
  sport: String,
  status: String, // A string that represents the season status ("Draft, preseason, etc")
});

module.exports = model('Season', seasonSchema);
