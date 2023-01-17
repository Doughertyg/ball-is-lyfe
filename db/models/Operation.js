const {model, Schema} = require('mongoose');

/**
 * Stat operation
 * A mathematic operation that makes up a stat equation
 * Can be made up of either two StatUnits or two operations
 * and an operation to perform on them represented as a string
 * of one of: "+", "-", "/", "*"
 * 
 * Operations can be nested by referring to other operations
 */
const operationSchema = new Schema({
  metricA: {
    type: Schema.Types.ObjectId,
    refPath: "metricModel"
  },
  metricB: {
    type: Schema.Types.ObjectId,
    refPath: "metricModel"
  },
  metricModel: {
    type: String,
    enum: ["Operation", "StatUnit"]
  },
  operation: String
});

module.exports = model('Operation', operationSchema);