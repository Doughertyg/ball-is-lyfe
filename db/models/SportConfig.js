const {model, Schema} = require('mongoose');

/**
 * Sport config schema
 * stores the configuration info for a sport
 */
const SportConfigSchema = new Schema({
  name: String,
  statUnits: [{
    type: Schema.Types.ObjectId,
    ref: "StatUnit"
  }],
  stats: [{
    type: Schema.Types.ObjectId,
    ref: "Stat"
  }],
});

module.exports = model('SportConfig', SportConfigSchema);