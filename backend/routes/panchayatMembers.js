const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const panchayatMemberController = require('../controllers/panchayatMemberController');
const { auth } = require('../middleware/auth');
const { roleCheck } = require('../middleware/auth');
const upload = require('../middleware/upload');

// @route   GET api/panchayat/members
// @desc    Get all panchayat members
// @access  Public
router.get('/', panchayatMemberController.getAllMembers);

// @route   GET api/panchayat/members/active
// @desc    Get all active panchayat members
// @access  Public
router.get('/active', panchayatMemberController.getActiveMembers);

// @route   GET api/panchayat/members/:id
// @desc    Get panchayat member by ID
// @access  Public
router.get('/:id', panchayatMemberController.getMemberById);

// @route   POST api/panchayat/members
// @desc    Create a panchayat member
// @access  Private/Admin
router.post(
  '/',
  [
    auth,
    roleCheck(['admin']),
    upload.single('image'),
    [
      check('name', 'Name is required').not().isEmpty(),
      check('position', 'Position is required').not().isEmpty(),
      check('contactNumber', 'Contact number is required').not().isEmpty()
    ]
  ],
  panchayatMemberController.createMember
);

// @route   PUT api/panchayat/members/:id
// @desc    Update a panchayat member
// @access  Private/Admin
router.put(
  '/:id',
  [
    auth,
    roleCheck(['admin']),
    upload.single('image'),
    [
      check('name', 'Name is required').not().isEmpty(),
      check('position', 'Position is required').not().isEmpty(),
      check('contactNumber', 'Contact number is required').not().isEmpty()
    ]
  ],
  panchayatMemberController.updateMember
);

// @route   DELETE api/panchayat/members/:id
// @desc    Delete a panchayat member
// @access  Private/Admin
router.delete(
  '/:id',
  [auth, roleCheck(['admin'])],
  panchayatMemberController.deleteMember
);

module.exports = router; 