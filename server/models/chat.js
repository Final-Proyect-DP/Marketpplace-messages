const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
  userId1: { type: String, required: true },
  userId2: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Chat', chatSchema);