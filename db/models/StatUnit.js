const {model, Schema} = require('mongoose');

/**
 * Stat Unit
 *  The building block of a statistic
 *  e.g.: "Field Goal Made"
 */
const statUnitSchema = new Schema({
  name: String,
  value: Number,
});

module.exports = model('StatUnit', statUnitSchema);