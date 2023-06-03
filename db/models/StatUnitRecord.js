const {model, Schema} = require('mongoose');

/**
 * Stat Unit Record
 *  records a player stat (statunit e.g.: FGA)
 *  StatUnitRecords are later used to calculate a user's
 *  stats for a season, game, etc.
 */
const StatUnitRecordSchema = new Schema({
  statUnit: {
    type: Schema.Types.ObjectId,
    ref: "StatUnit"
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
  timeCode: String
});

module.exports = model('StatUnitRecord', StatUnitRecordSchema);