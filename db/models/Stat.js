const {model, Schema} = require('mongoose');

/**
 * Stat
 *  A statistic using a stat unit
 *  e.g.: "Field Goal percentage"
 */
const statSchema = new Schema({
  name: String,
  statUnits: [{
    type: Schema.Types.ObjectId,
    ref: 'statUnit'
  }],
  operations: [string]
});

module.exports = model('Stat', statSchema);
