const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
  recipientId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  senderUsername: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
}, {
  timestamps: true
});

const Notification = mongoose.model('Notification', NotificationSchema, 'notifications');

module.exports = Notification;
