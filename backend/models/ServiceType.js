const mongoose = require('mongoose');

const ServiceTypeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String,
    required: true
  },
  department: {
    type: String,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  requiredDocuments: [String],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('ServiceType', ServiceTypeSchema); 