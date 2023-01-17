const {model, Schema} = require('mongoose');

/**
 * Stat
 *  A statistic using a stat unit
 *  e.g.: {
 *   name: "Field Goal percentage",
 *   operations: [{
 *     metricA: {
 *       metricA: "fieldGoalsMade",
 *       metricB: "3PtMade",
 *       operation: "+"
 *     },
 *     metricB: {
 *       metricA: "fieldGoalsAttempted",
 *       metricB: "3PtAttempted",
 *       operation: "+"
 *     },
 *     operation: "/"
 *   }]
 *  }
 * 
 *  Stats are the result of one or more (possibly nested) operations
 *  Seasons reference which stats that season has/uses
 *  Seasons also reference the StatUnits that season has/uses
 *    - as required by that season's stats.
 */
const statSchema = new Schema({
  name: String,
  operations: [{
    type: Schema.Types.ObjectId,
    ref: 'Operation'
  }],
});

module.exports = model('Stat', statSchema);