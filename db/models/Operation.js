const {model, Schema} = require('mongoose');

function getFloatFromDecimal(value) {
  if (typeof value !== 'undefined' && value != null) {
     return parseFloat(value.toString());
  }
  return value;
};

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
    refPath: "metricAModel"
  },
  termAScalar: {
    type: Schema.Types.Decimal128,
    get: getFloatFromDecimal
  },
  metricB: {
    type: Schema.Types.ObjectId,
    refPath: "metricBModel"
  },
  termBScalar: {
    type: Schema.Types.Decimal128,
    get: getFloatFromDecimal
  },
  metricAModel: {
    type: String,
    enum: ["Operation", "StatUnit"]
  },
  metricBModel: {
    type: String,
    enum: ["Operation", "StatUnit"]
  },
  name: String,
  operation: String,
}, {toJSON: {getters: true}});

module.exports = model('Operation', operationSchema);