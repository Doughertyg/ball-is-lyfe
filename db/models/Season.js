const {model, Schema} = require('mongoose');

const seasonSchema = new Schema({
  createdAt: String,
  seasonStart: String,
  seasonEnd: String,
  league: {
    type: Schema.Types.ObjectId,
    ref: 'league'
  },
  admins: [{
      type: Schema.Types.ObjectId,
      ref: 'users'
  }],
  teams: [{
    type: Schema.Types.ObjectId,
    ref: 'teamInstance'
  }],
  players: [{
    type: Schema.Types.ObjectId,
    ref: 'uers'
  }]
});

module.exports = model('Season', seasonSchema);
