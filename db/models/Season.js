const {model, Schema} = require('mongoose');

const seasonSchema = new Schema({
  createdAt: String,
  name: String,
  description: String,
  seasonStart: String,
  seasonEnd: String,
  league: {
    type: Schema.Types.ObjectId,
    ref: 'league'
  },
  players: [{
    type: Schema.Types.ObjectId,
    ref: 'users'
  }],
});

module.exports = model('Season', seasonSchema);
