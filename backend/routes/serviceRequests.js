const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const serviceRequestController = require('../controllers/serviceRequestController');
const { auth } = require('../middleware/auth');
const { roleCheck } = require('../middleware/auth');
const upload = require('../middleware/upload');

// @route   GET api/services/requests
// @desc    Get all service requests (admin)
// @access  Private/Admin
router.get(
  '/',
  [auth, roleCheck(['admin'])],
  serviceRequestController.getAllRequests
);

// @route   GET api/services/requests/user
// @desc    Get user's service requests
// @access  Private
router.get(
  '/user',
  auth,
  serviceRequestController.getUserRequests
);

// @route   GET api/services/requests/:id
// @desc    Get service request by ID
// @access  Private
router.get(
  '/:id',
  auth,
  serviceRequestController.getRequestById
);

// @route   POST api/services/requests
// @desc    Create a service request
// @access  Private
router.post(
  '/',
  [
    auth,
    upload.single('document'),
    [
      check('serviceType', 'Service type is required').not().isEmpty(),
      check('description', 'Description is required').not().isEmpty()
    ]
  ],
  serviceRequestController.createRequest
);

// @route   PUT api/services/requests/:id
// @desc    Update a service request (admin)
// @access  Private/Admin
router.put(
  '/:id',
  [
    auth,
    roleCheck(['admin']),
    [
      check('status', 'Status is required').not().isEmpty()
    ]
  ],
  serviceRequestController.updateRequest
);

// @route   DELETE api/services/requests/:id
// @desc    Delete a service request
// @access  Private
router.delete(
  '/:id',
  auth,
  serviceRequestController.deleteRequest
);

module.exports = router; 