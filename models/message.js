const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MessageSchema = new Schema({
  action: {
    type: String,
    required: [true, 'The text field is required']
  }
})

const Message = mongoose.model('message', MessageSchema);

module.exports = Message;