const {model, Schema} = require('mongoose');

const seasonSchema = new Schema({
  createdAt: String,
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
});

module.exports = model('Season', seasonSchema);
