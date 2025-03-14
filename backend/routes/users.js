const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const userController = require('../controllers/userController');
const { auth } = require('../middleware/auth');
const { roleCheck } = require('../middleware/auth');

// @route   GET api/users
// @desc    Get all users
// @access  Private/Admin
router.get(
  '/',
  [auth, roleCheck(['admin'])],
  userController.getAllUsers
);

// @route   GET api/users/:id
// @desc    Get user by ID
// @access  Private/Admin
router.get(
  '/:id',
  [auth, roleCheck(['admin'])],
  userController.getUserById
);

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