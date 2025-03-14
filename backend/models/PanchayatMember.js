const mongoose = require('mongoose');

const PanchayatMemberSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  position: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  contact: {
    type: String
  },
  email: {
    type: String
  },
  isActive: {
    type: Boolean,
    default: true
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

module.exports = mongoose.model('PanchayatMember', PanchayatMemberSchema); 