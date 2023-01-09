const {model, Schema} = require('mongoose');

const teamInstanceSchema = new Schema({
  admins: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  createdAt: String,
  season: {
    type: Schema.Types.ObjectId,
    ref: 'Season'
  },
  team: {
    type: Schema.Types.ObjectId,
    ref: 'Team'
  },
  captain: {
      type: Schema.Types.ObjectId,
      ref: 'User'
  },
  players: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }]
});

module.exports = model('TeamInstance', teamInstanceSchema);
