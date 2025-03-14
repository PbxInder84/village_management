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
const crypto = require('crypto');
const sendEmail = require('../utils/sendEmail');
const nodemailer = require('nodemailer');

// @route   POST api/auth/register
// @desc    Register user
// @access  Public
router.post('/register', async (req, res) => {
  try {
    console.log('Registration attempt:', req.body);
    
    const { name, email, password, mobile, address } = req.body;
    
    // Check if user already exists
    let user = await User.findOne({ email });
    
    if (user) {
      console.log('User already exists:', email);
      return res.status(400).json({ msg: 'User already exists' });
    }
    
    // Create new user
    user = new User({
      name,
      email,
      password,
      mobile,
      address,
      role: 'user' // Default role
    });
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    
    // Save user to database
    await user.save();
    
    // Create JWT payload
    const payload = {
      user: {
        id: user.id,
        isAdmin: user.role === 'admin'
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
        // Return both token and user data
        res.json({ 
          token, 
          user: { 
            id: user.id, 
            name: user.name, 
            email: user.email, 
            role: user.role 
          } 
        });
      }
    );
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

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
        // Return both token and user data
        res.json({ 
          token, 
          user: { 
            id: user.id, 
            name: user.name, 
            email: user.email, 
            role: user.role 
          } 
        });
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

// @route   POST api/auth/forgot-password
// @desc    Send password reset email
// @access  Public
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    
    // Find user by email
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Generate reset token
    const resetToken = crypto.randomBytes(20).toString('hex');
    
    // Set token expiry (1 hour)
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    
    await user.save();
    
    // Create reset URL
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
    
    // Create email content with HTML formatting
    const message = `
      <h1>Password Reset Request</h1>
      <p>You requested a password reset for your Upalheri Gram Panchayat account.</p>
      <p>Please click on the following link to reset your password:</p>
      <a href="${resetUrl}" style="display: inline-block; background-color: #0284c7; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin: 20px 0;">Reset Password</a>
      <p>If you did not request this, please ignore this email and your password will remain unchanged.</p>
      <p>This link is valid for 1 hour only.</p>
    `;
    
    try {
      const emailInfo = await sendEmail({
        email: user.email,
        subject: 'Password Reset Request - Upalheri Gram Panchayat',
        message
      });
      
      res.status(200).json({ 
        message: 'Password reset email sent. Please check your inbox.' 
      });
    } catch (emailError) {
      console.error('Email sending error:', emailError);
      
      // If email fails, reset the token
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;
      await user.save();
      
      return res.status(500).json({ 
        message: 'Could not send reset email. Please try again later.' 
      });
    }
  } catch (err) {
    console.error('Error in forgot password:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET api/auth/reset-password/:token
// @desc    Validate reset token
// @access  Public
router.get('/reset-password/:token', async (req, res) => {
  try {
    // Find user by reset token and check if token is still valid
    const user = await User.findOne({
      resetPasswordToken: req.params.token,
      resetPasswordExpires: { $gt: Date.now() }
    });
    
    if (!user) {
      return res.status(400).json({ message: 'Password reset token is invalid or has expired' });
    }
    
    res.status(200).json({ message: 'Token is valid' });
  } catch (err) {
    console.error('Error validating reset token:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST api/auth/reset-password/:token
// @desc    Reset password
// @access  Public
router.post('/reset-password/:token', async (req, res) => {
  try {
    // Find user by reset token and check if token is still valid
    const user = await User.findOne({
      resetPasswordToken: req.params.token,
      resetPasswordExpires: { $gt: Date.now() }
    });
    
    if (!user) {
      return res.status(400).json({ message: 'Password reset token is invalid or has expired' });
    }
    
    // Set new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(req.body.password, salt);
    
    // Clear reset token fields
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    
    await user.save();
    
    res.status(200).json({ message: 'Password has been reset successfully' });
  } catch (err) {
    console.error('Error resetting password:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 