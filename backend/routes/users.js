const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const userController = require('../controllers/userController');
const { auth } = require('../middleware/auth');
const { roleCheck } = require('../middleware/auth');
const User = require('../models/User');

// @route   GET api/users
// @desc    Get all users
// @access  Private/Admin
router.get('/', auth, async (req, res) => {
  try {
    // Check if user is admin
    if (!req.user.isAdmin && req.user.role !== 'admin') {
      return res.status(401).json({ msg: 'Not authorized' });
    }
    
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    console.error('Error getting users:', err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/users/:id
// @desc    Get user by ID
// @access  Private (Admin or own user)
router.get('/:id', auth, async (req, res) => {
  try {
    // Check if user is requesting their own profile or is an admin
    if (req.user.id !== req.params.id && req.user.role !== 'admin') {
      return res.status(403).json({ msg: 'Not authorized to access this user profile' });
    }
    
    const user = await User.findById(req.params.id).select('-password');
    
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    
    res.json(user);
  } catch (err) {
    console.error('Error getting user by ID:', err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'User not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/users/:id
// @desc    Update user
// @access  Private/Admin
router.put(
  '/:id',
  [
    auth,
    roleCheck(['admin']),
    [
      check('name', 'Name is required').not().isEmpty(),
      check('email', 'Please include a valid email').isEmail()
    ]
  ],
  userController.updateUser
);

// @route   DELETE api/users/:id
// @desc    Delete user
// @access  Private/Admin
router.delete(
  '/:id',
  [auth, roleCheck(['admin'])],
  userController.deleteUser
);

// @route   PUT api/users/:id/role
// @desc    Update user role
// @access  Private/Admin
router.put(
  '/:id/role',
  [
    auth,
    roleCheck(['admin']),
    [
      check('role', 'Role is required').not().isEmpty().isIn(['user', 'panch', 'sarpanch', 'admin'])
    ]
  ],
  userController.updateUserRole
);

module.exports = router; 