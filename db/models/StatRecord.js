const {model, Schema} = require('mongoose');

/**
 * Stat Record
 *  records a player stat (e.g.: Points, Field Goal Percentage)
 */
const StatRecordSchema = new Schema({
  stat: {
    type: Schema.Types.ObjectId,
    ref: "Stat"
  },
  game: {
    type: Schema.Types.ObjectId,
    ref: "Game"
  },
  player: {
    type: Schema.Types.ObjectId,
    ref: "User"
  },
  season: {
    type: Schema.Types.ObjectId,
    ref: "Season"
  },
});

module.exports = model('StatRecord', StatRecordSchema);