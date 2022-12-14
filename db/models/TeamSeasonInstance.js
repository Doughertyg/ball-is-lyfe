const {model, Schema} = require('mongoose');

const teamSeasonInstanceSchema = new Schema({
  createdAt: String,
  season: String,
  team: {
    type: Schema.Types.ObjectId,
    ref: 'team'
  },
  captain: {
      type: Schema.Types.ObjectId,
      ref: 'users'
  },
  players: [{
    type: Schema.Types.ObjectId,
    ref: 'users'
  }]
});

module.exports = model('TeamSeasonInstance', teamSeasonInstanceSchema);
