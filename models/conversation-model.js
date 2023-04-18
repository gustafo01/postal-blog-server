const { Schema } = require('mongoose');
const { model } = require("mongoose");

const ConversationSchema = new Schema({
  members: {
    type: Array
  },
  messages: [{
    from: {
      type: String
    },
    to: {
      type: String
    },
    message: {
      type: String
    },
    sentAt: {
      type: Date,
      default: Date.now
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = model('Conversation', ConversationSchema);
