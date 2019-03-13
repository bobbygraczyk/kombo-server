const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SessionSchema = new Schema({
  key: {
    type: String,
    required: [true, 'The text field is required'],
    unique: [true, 'A session with this name exists']
  },
  messages: [{
    user: String,
    body: String,
    date: Date,
    tags: [{tag: String}]
  }],
  tournamentName: String,
  tournamentSlug: String,
  tournamentId: Number,
  users: [{name: String, role: String}],
  stream: String,
  isPolling: Boolean,
  streamInfo: Object,
  matchInfo: Object,
  streamLayout: [{
    name: {
      width: String,
      font: String,
      top: String,
      fontSize: String,
      color: String
    },
    score: {
      width: String,
      font: String,
      top: String,
      fontSize: String,
      color: String
    },
    round: {
      font: String,
      top: String,
      fontSize: String,
      color: String
    },
    event: {
      font: String,
      top: String,
      fontSize: String,
      color: String
    }
  }]
})

const Session = mongoose.model('session', SessionSchema);

module.exports = Session;