const mongoose = require('mongoose');

const FriendSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  friendId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
}, {
  timestamps: true
});

const Friend = mongoose.model('Friend', FriendSchema);

module.exports = Friend;
