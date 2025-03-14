const mongoose = require('mongoose');

const OptionSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true
  },
  votes: {
    type: Number,
    default: 0
  }
});

const VoteSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  option: {
    type: Number,
    required: true
  },
  votedAt: {
    type: Date,
    default: Date.now
  }
});

const PollSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  options: [OptionSchema],
  votes: [VoteSchema],
  isActive: {
    type: Boolean,
    default: true
  },
  startDate: {
    type: Date,
    default: Date.now
  },
  endDate: {
    type: Date
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

module.exports = mongoose.model('Poll', PollSchema); 