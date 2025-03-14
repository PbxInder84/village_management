const { validationResult } = require('express-validator');
const ServiceType = require('../models/ServiceType');

// @route   GET api/services/types
// @desc    Get all active service types
// @access  Public
exports.getServiceTypes = async (req, res) => {
  try {
    const types = await ServiceType.find({ isActive: true })
      .sort({ name: 1 });
    
    res.json(types);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// @route   GET api/services/types/all
// @desc    Get all service types (including inactive)
// @access  Private/Admin
exports.getAllServiceTypes = async (req, res) => {
  try {
    const types = await ServiceType.find()
      .sort({ name: 1 });
    
    res.json(types);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// @route   GET api/services/types/:id
// @desc    Get service type by ID
// @access  Public
exports.getServiceTypeById = async (req, res) => {
  try {
    const type = await ServiceType.findById(req.params.id);
    
    if (!type) {
      return res.status(404).json({ msg: 'Service type not found' });
    }
    
    res.json(type);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Service type not found' });
    }
    res.status(500).send('Server error');
  }
};

// @route   POST api/services/types
// @desc    Create a service type
// @access  Private/Admin
exports.createServiceType = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  
  const { name, description, department, requiredDocuments, isActive } = req.body;
  
  try {
    // Check if service type already exists
    let serviceType = await ServiceType.findOne({ name });
    if (serviceType) {
      return res.status(400).json({ msg: 'Service type already exists' });
    }
    
    const newServiceType = new ServiceType({
      name,
      description,
      department,
      requiredDocuments: requiredDocuments ? requiredDocuments.split(',') : [],
      isActive: isActive !== undefined ? isActive : true
    });
    
    serviceType = await newServiceType.save();
    
    res.json(serviceType);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// @route   PUT api/services/types/:id
// @desc    Update a service type
// @access  Private/Admin
exports.updateServiceType = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  
  const { name, description, department, requiredDocuments, isActive } = req.body;
  
  try {
    let serviceType = await ServiceType.findById(req.params.id);
    
    if (!serviceType) {
      return res.status(404).json({ msg: 'Service type not found' });
    }
    
    // Update fields
    if (name) serviceType.name = name;
    if (description) serviceType.description = description;
    if (department) serviceType.department = department;
    if (requiredDocuments) serviceType.requiredDocuments = requiredDocuments.split(',');
    if (isActive !== undefined) serviceType.isActive = isActive;
    
    serviceType.updatedAt = Date.now();
    
    await serviceType.save();
    
    res.json(serviceType);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Service type not found' });
    }
    res.status(500).send('Server error');
  }
};

// @route   DELETE api/services/types/:id
// @desc    Delete a service type
// @access  Private/Admin
exports.deleteServiceType = async (req, res) => {
  try {
    const serviceType = await ServiceType.findById(req.params.id);
    
    if (!serviceType) {
      return res.status(404).json({ msg: 'Service type not found' });
    }
    
    await serviceType.remove();
    
    res.json({ msg: 'Service type removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Service type not found' });
    }
    res.status(500).send('Server error');
  }
}; 