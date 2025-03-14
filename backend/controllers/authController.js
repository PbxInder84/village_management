const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const User = require('../models/User');

// @route   POST api/auth/register
// @desc    Register user
// @access  Public
exports.register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  
  const { name, email, password, role } = req.body;
  
  try {
    // Check if user exists
    let user = await User.findOne({ email });
    
    if (user) {
      return res.status(400).json({ msg: 'User already exists' });
    }
    
    // Create new user
    user = new User({
      name,
      email,
      password,
      role: role || 'user' // Default to 'user' if no role provided
    });
    
    await user.save();
    
    // Create JWT token
    const token = user.getSignedJwtToken();
    
    // Return user data with token
    const userData = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      createdAt: user.createdAt,
      token
    };
    
    res.json(userData);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// @route   POST api/auth/login
// @desc    Authenticate user & get token
// @access  Public
exports.login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  
  const { email, password } = req.body;
  
  try {
    // Check if user exists
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }
    
    // Check password
    const isMatch = await user.matchPassword(password);
    
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }
    
    // Create JWT token
    const token = user.getSignedJwtToken();
    
    // Return user data with token
    const userData = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      createdAt: user.createdAt,
      token
    };
    
    res.json(userData);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// @route   GET api/auth/me
// @desc    Get current user
// @access  Private
const getMe = async (req, res) => {
  try {
    console.log('Getting user profile, user ID:', req.user.id);
    
    // Get user from database without password
    const user = await User.findById(req.user.id).select('-password');
    
    if (!user) {
      console.log('User not found in database');
      return res.status(404).json({ msg: 'User not found' });
    }
    
    res.json(user);
  } catch (err) {
    console.error('Error in getMe:', err);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
exports.updateProfile = async (req, res) => {
  try {
    const { name, email } = req.body;
    
    // Build profile object
    const profileFields = {};
    if (name) profileFields.name = name;
    if (email) profileFields.email = email;
    
    // Update user
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: profileFields },
      { new: true }
    ).select('-password');
    
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
}; 