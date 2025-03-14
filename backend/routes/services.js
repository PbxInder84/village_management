const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const serviceTypeController = require('../controllers/serviceTypeController');
const serviceRequestController = require('../controllers/serviceRequestController');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');
const upload = require('../middleware/upload');

// Service Type Routes
// @route   GET api/services/types
// @desc    Get all active service types
// @access  Public
router.get('/types', serviceTypeController.getServiceTypes);

// @route   GET api/services/types/all
// @desc    Get all service types (including inactive)
// @access  Private/Admin
router.get('/types/all', auth, roleCheck(['admin']), serviceTypeController.getAllServiceTypes);

// @route   GET api/services/types/:id
// @desc    Get service type by ID
// @access  Public
router.get('/types/:id', serviceTypeController.getServiceTypeById);

// @route   POST api/services/types
// @desc    Create a service type
// @access  Private/Admin
router.post(
  '/types',
  [
    auth,
    roleCheck(['admin']),
    [
      check('name', 'Name is required').not().isEmpty(),
      check('description', 'Description is required').not().isEmpty(),
      check('department', 'Department is required').not().isEmpty()
    ]
  ],
  serviceTypeController.createServiceType
);

// @route   PUT api/services/types/:id
// @desc    Update a service type
// @access  Private/Admin
router.put(
  '/types/:id',
  [
    auth,
    roleCheck(['admin'])
  ],
  serviceTypeController.updateServiceType
);

// @route   DELETE api/services/types/:id
// @desc    Delete a service type
// @access  Private/Admin
router.delete('/types/:id', auth, roleCheck(['admin']), serviceTypeController.deleteServiceType);

// Service Request Routes
// @route   GET api/services/requests
// @desc    Get all service requests for the logged-in user
// @access  Private
router.get('/requests', auth, serviceRequestController.getUserRequests);

// @route   GET api/services/requests/all
// @desc    Get all service requests (admin)
// @access  Private/Admin
router.get('/requests/all', auth, roleCheck(['admin']), serviceRequestController.getAllRequests);

// @route   GET api/services/requests/:id
// @desc    Get service request by ID
// @access  Private
router.get('/requests/:id', auth, serviceRequestController.getRequestById);

// @route   POST api/services/requests
// @desc    Create a service request
// @access  Private
router.post(
  '/requests',
  [
    auth,
    upload.array('attachments', 5),
    [
      check('service', 'Service type is required').not().isEmpty(),
      check('description', 'Description is required').not().isEmpty(),
      check('contactNumber', 'Contact number is required').not().isEmpty(),
      check('address', 'Address is required').not().isEmpty()
    ]
  ],
  serviceRequestController.createRequest
);

// @route   PUT api/services/requests/:id/status
// @desc    Update service request status
// @access  Private/Admin
router.put(
  '/requests/:id/status',
  [
    auth,
    roleCheck(['admin']),
    [
      check('status', 'Status is required').isIn(['pending', 'in-progress', 'completed', 'rejected'])
    ]
  ],
  serviceRequestController.updateRequestStatus
);

// @route   POST api/services/requests/:id/comments
// @desc    Add comment to service request
// @access  Private
router.post(
  '/requests/:id/comments',
  [
    auth,
    [
      check('text', 'Comment text is required').not().isEmpty()
    ]
  ],
  serviceRequestController.addComment
);

module.exports = router; 