const {model, Schema} = require('mongoose');

/**
 * Stat Unit
 *  The building block of a statistic
 *  e.g.: "Field Goal Made"
 */
const statUnitSchema = new Schema({
  name: String,
  value: Number,
  game: {
    type: Schema.Types.ObjectId,
    ref: 'game'
  },
  createdAt: String,
  player: {
    type: Schema.Types.ObjectId,
    ref: 'users'
  }
});

module.exports = model('StatUnit', statUnitSchema);
