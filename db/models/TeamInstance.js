const {model, Schema} = require('mongoose');

const teamInstanceSchema = new Schema({
  createdAt: String,
  season: {
    type: Schema.Types.ObjectId,
    ref: 'season'
  },
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

module.exports = model('TeamInstance', teamInstanceSchema);
