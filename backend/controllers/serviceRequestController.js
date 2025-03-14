const { validationResult } = require('express-validator');
const ServiceRequest = require('../models/ServiceRequest');
const ServiceType = require('../models/ServiceType');

// @desc    Get all service requests (admin)
// @route   GET /api/services/requests
// @access  Private/Admin
exports.getAllRequests = async (req, res) => {
  try {
    const requests = await ServiceRequest.find()
      .sort({ createdAt: -1 })
      .populate('user', 'name email')
      .populate('serviceType', 'name');
    
    res.json(requests);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Get user's service requests
// @route   GET /api/services/requests/user
// @access  Private
exports.getUserRequests = async (req, res) => {
  try {
    const requests = await ServiceRequest.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .populate('serviceType', 'name');
    
    res.json(requests);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Get service request by ID
// @route   GET /api/services/requests/:id
// @access  Private
exports.getRequestById = async (req, res) => {
  try {
    const request = await ServiceRequest.findById(req.params.id)
      .populate('user', 'name email')
      .populate('serviceType', 'name');
    
    if (!request) {
      return res.status(404).json({ msg: 'Service request not found' });
    }
    
    // Check if user owns the request or is admin
    if (request.user._id.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ msg: 'Not authorized' });
    }
    
    res.json(request);
  } catch (err) {
    console.error(err.message);
    
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Service request not found' });
    }
    
    res.status(500).send('Server Error');
  }
};

// @desc    Create a service request
// @route   POST /api/services/requests
// @access  Private
exports.createRequest = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  
  const { serviceType, description, additionalInfo } = req.body;
  
  try {
    const newRequest = new ServiceRequest({
      user: req.user.id,
      serviceType,
      description,
      additionalInfo,
      status: 'pending'
    });
    
    // If document was uploaded
    if (req.file) {
      newRequest.document = req.file.filename;
    }
    
    const request = await newRequest.save();
    
    // Populate the response
    const populatedRequest = await ServiceRequest.findById(request._id)
      .populate('user', 'name email')
      .populate('serviceType', 'name');
    
    res.json(populatedRequest);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Update a service request (admin)
// @route   PUT /api/services/requests/:id
// @access  Private/Admin
exports.updateRequest = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  
  const { status, adminRemarks } = req.body;
  
  try {
    let request = await ServiceRequest.findById(req.params.id);
    
    if (!request) {
      return res.status(404).json({ msg: 'Service request not found' });
    }
    
    // Build request object
    const requestFields = {};
    if (status) requestFields.status = status;
    if (adminRemarks) requestFields.adminRemarks = adminRemarks;
    
    // Update request
    request = await ServiceRequest.findByIdAndUpdate(
      req.params.id,
      { $set: requestFields },
      { new: true }
    )
      .populate('user', 'name email')
      .populate('serviceType', 'name');
    
    res.json(request);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Delete a service request
// @route   DELETE /api/services/requests/:id
// @access  Private
exports.deleteRequest = async (req, res) => {
  try {
    const request = await ServiceRequest.findById(req.params.id);
    
    if (!request) {
      return res.status(404).json({ msg: 'Service request not found' });
    }
    
    // Check if user owns the request or is admin
    if (request.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ msg: 'Not authorized' });
    }
    
    await ServiceRequest.findByIdAndRemove(req.params.id);
    
    res.json({ msg: 'Service request removed' });
  } catch (err) {
    console.error(err.message);
    
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Service request not found' });
    }
    
    res.status(500).send('Server Error');
  }
}; 