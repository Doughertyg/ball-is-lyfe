const {model, Schema} = require('mongoose');

const playerInstanceSchema = new Schema({
  season: {
    type: Schema.Types.ObjectId,
    ref: 'season'
  },
  playerNumber: Number,
  position: String,
  user: {
    type: Schema.Types.ObjectId,
    ref: 'user'
  },
  createdAt: String
});

module.exports = model('playerInstance', playerInstanceSchema);
