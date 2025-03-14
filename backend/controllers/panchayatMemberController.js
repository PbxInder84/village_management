const { validationResult } = require('express-validator');
const PanchayatMember = require('../models/PanchayatMember');

// @desc    Get all panchayat members
// @route   GET /api/panchayat/members
// @access  Public
exports.getAllMembers = async (req, res) => {
  try {
    const members = await PanchayatMember.find().sort({ position: 1 });
    res.json(members);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Get all active panchayat members
// @route   GET /api/panchayat/members/active
// @access  Public
exports.getActiveMembers = async (req, res) => {
  try {
    const members = await PanchayatMember.find({ isActive: true }).sort({ position: 1 });
    res.json(members);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Get panchayat member by ID
// @route   GET /api/panchayat/members/:id
// @access  Public
exports.getMemberById = async (req, res) => {
  try {
    const member = await PanchayatMember.findById(req.params.id);
    
    if (!member) {
      return res.status(404).json({ msg: 'Panchayat member not found' });
    }
    
    res.json(member);
  } catch (err) {
    console.error(err.message);
    
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Panchayat member not found' });
    }
    
    res.status(500).send('Server Error');
  }
};

// @desc    Create a panchayat member
// @route   POST /api/panchayat/members
// @access  Private/Admin
exports.createMember = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  
  const { name, position, contactNumber, email, bio, isActive } = req.body;
  
  try {
    const newMember = new PanchayatMember({
      name,
      position,
      contactNumber,
      email,
      bio,
      isActive: isActive !== undefined ? isActive : true
    });
    
    // If image was uploaded
    if (req.file) {
      newMember.image = req.file.filename;
    }
    
    const member = await newMember.save();
    
    res.json(member);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Update a panchayat member
// @route   PUT /api/panchayat/members/:id
// @access  Private/Admin
exports.updateMember = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  
  const { name, position, contactNumber, email, bio, isActive } = req.body;
  
  try {
    let member = await PanchayatMember.findById(req.params.id);
    
    if (!member) {
      return res.status(404).json({ msg: 'Panchayat member not found' });
    }
    
    // Build member object
    const memberFields = {};
    if (name) memberFields.name = name;
    if (position) memberFields.position = position;
    if (contactNumber) memberFields.contactNumber = contactNumber;
    if (email) memberFields.email = email;
    if (bio) memberFields.bio = bio;
    if (isActive !== undefined) memberFields.isActive = isActive;
    
    // If image was uploaded
    if (req.file) {
      memberFields.image = req.file.filename;
    }
    
    // Update member
    member = await PanchayatMember.findByIdAndUpdate(
      req.params.id,
      { $set: memberFields },
      { new: true }
    );
    
    res.json(member);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Delete a panchayat member
// @route   DELETE /api/panchayat/members/:id
// @access  Private/Admin
exports.deleteMember = async (req, res) => {
  try {
    const member = await PanchayatMember.findById(req.params.id);
    
    if (!member) {
      return res.status(404).json({ msg: 'Panchayat member not found' });
    }
    
    await PanchayatMember.findByIdAndRemove(req.params.id);
    
    res.json({ msg: 'Panchayat member removed' });
  } catch (err) {
    console.error(err.message);
    
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Panchayat member not found' });
    }
    
    res.status(500).send('Server Error');
  }
}; 