const mongoose = require('mongoose');

const PanchayatMeetingSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  agenda: {
    type: String,
    required: true
  },
  minutes: {
    type: String
  },
  attendees: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PanchayatMember'
  }],
  status: {
    type: String,
    enum: ['scheduled', 'completed', 'cancelled'],
    default: 'scheduled'
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('PanchayatMeeting', PanchayatMeetingSchema); 