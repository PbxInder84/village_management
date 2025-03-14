const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const { 
  register, 
  login, 
  getMe, 
  updateProfile 
} = require('../controllers/authController');
const { auth } = require('../middleware/auth');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// @route   POST api/auth/register
// @desc    Register user
// @access  Public
router.post(
  '/register',
  [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 })
  ],
  register
);

// @route   POST api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', async (req, res) => {
  try {
    console.log('Login attempt:', req.body);
    
    const { email, password } = req.body;
    
    // Find user by email
    const user = await User.findOne({ email });
    
    if (!user) {
      console.log('User not found:', email);
      return res.status(400).json({ msg: 'Invalid credentials' });
    }
    
    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    
    if (!isMatch) {
      console.log('Password mismatch for user:', email);
      return res.status(400).json({ msg: 'Invalid credentials' });
    }
    
    // Create JWT payload
    const payload = {
      user: {
        id: user.id,
        isAdmin: user.isAdmin || user.role === 'admin'
      }
    };
    
    // Sign token
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '24h' },
      (err, token) => {
        if (err) {
          console.error('JWT Sign Error:', err);
          throw err;
        }
        res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
      }
    );
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

// @route   GET api/auth/me
// @desc    Get current user
// @access  Private
router.get('/me', auth, async (req, res) => {
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
});

// @route   PUT api/auth/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', auth, updateProfile);

module.exports = router; 