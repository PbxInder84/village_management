const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const serviceTypeController = require('../controllers/serviceTypeController');
const { auth } = require('../middleware/auth');
const { roleCheck } = require('../middleware/auth');

// @route   GET api/services/types
// @desc    Get all service types
// @access  Public
router.get('/', serviceTypeController.getAllServiceTypes);

// @route   GET api/services/types/:id
// @desc    Get service type by ID
// @access  Public
router.get('/:id', serviceTypeController.getServiceTypeById);

// @route   POST api/services/types
// @desc    Create a service type
// @access  Private/Admin
router.post(
  '/',
  [
    auth,
    roleCheck(['admin']),
    [
      check('name', 'Name is required').not().isEmpty(),
      check('description', 'Description is required').not().isEmpty()
    ]
  ],
  serviceTypeController.createServiceType
);

// @route   PUT api/services/types/:id
// @desc    Update a service type
// @access  Private/Admin
router.put(
  '/:id',
  [
    auth,
    roleCheck(['admin']),
    [
      check('name', 'Name is required').not().isEmpty(),
      check('description', 'Description is required').not().isEmpty()
    ]
  ],
  serviceTypeController.updateServiceType
);

// @route   DELETE api/services/types/:id
// @desc    Delete a service type
// @access  Private/Admin
router.delete(
  '/:id',
  [auth, roleCheck(['admin'])],
  serviceTypeController.deleteServiceType
);

module.exports = router; 