const mongoose = require('mongoose');

const MeetingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  meetingId: { type: String, required: true },
  meetingLink: { type: String, required: true },
  meetingDate: { type: String, required: true },
  meetingTime: { type: String, required: true },
  friends: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
});

module.exports = mongoose.model('Meeting', MeetingSchema);
