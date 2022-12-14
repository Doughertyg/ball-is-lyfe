const {model, Schema} = require('mongoose');

const teamPlayerSchema = new Schema({
  season: {
    type: Schema.Types.ObjectId,
    ref: 'season'
  },
  playerNumber: Number,
  user: {
    type: Schema.Types.ObjectId,
    ref: 'user'
  },
  createdAt: String
});

module.exports = model('teamPlayer', teamPlayerSchema);
