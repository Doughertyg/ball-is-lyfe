const {model, Schema} = require('mongoose');

/**
 * Stat
 *  A statistic using a stat unit
 *  e.g.: "Field Goal percentage"
 */
const statUnitSchema = new Schema({
  name: String,
  createdAt: String,
  player: {
    type: Schema.Types.ObjectId,
    ref: 'users'
  },
  team: {
    type: Schema.Types.ObjectId,
    ref: 'teams'
  },
  teamSeason: {
    type: Schema.Types.ObjectId,
    ref: 'teamSeasonInstance'
  },
  statUnits: [{
    type: Schema.Types.ObjectId,
    ref: 'statUnit'
  }],
  operations: [string]
});

module.exports = model('Stat', statUnitSchema);
