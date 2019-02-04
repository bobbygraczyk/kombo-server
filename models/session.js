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
    date: Date
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
    nameWidth: Number,
    scoreWidth: Number,
    fontSize: Number,
    fontWeight: Number,
    fontColor: String,
    fontStyle: String,
    scoreboardHeight: Number,
  }]
})

const Session = mongoose.model('session', SessionSchema);

module.exports = Session;