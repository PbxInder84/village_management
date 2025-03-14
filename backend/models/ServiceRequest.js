const mongoose = require('mongoose');

const ServiceRequestSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  serviceType: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ServiceType',
    required: true
  },
  description: {
    type: String,
    required: true
  },
  additionalInfo: {
    type: String
  },
  document: {
    type: String
  },
  status: {
    type: String,
    enum: ['pending', 'in-progress', 'completed', 'rejected'],
    default: 'pending'
  },
  adminRemarks: {
    type: String
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

module.exports = mongoose.model('ServiceRequest', ServiceRequestSchema); 