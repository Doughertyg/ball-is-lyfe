const {model, Schema} = require('mongoose');

const seasonSchema = new Schema({
  createdAt: String,
  seasonStart: String,
  seasonEnd: String,
  league: {
    type: Schema.Types.ObjectId,
    ref: 'league'
  },
  seasons: [{
    type: Schema.Types.ObjectId,
    ref: 'season'
  }],
  admins: [{
      type: Schema.Types.ObjectId,
      ref: 'users'
  }],
  teams: [{
    type: Schema.Types.ObjectId,
    ref: 'teamInstance'
  }]
});

module.exports = model('Season', seasonSchema);
