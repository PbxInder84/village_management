const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const serviceTypeController = require('../controllers/serviceTypeController');
const { auth } = require('../middleware/auth');
const { roleCheck } = require('../middleware/auth');
const ServiceType = require('../models/ServiceType');

// @route   GET api/services/types
// @desc    Get all active service types
// @access  Public
router.get('/', async (req, res) => {
  try {
    const serviceTypes = await ServiceType.find({ isActive: true }).sort({ name: 1 });
    res.json(serviceTypes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/services/types/all
// @desc    Get all service types (including inactive)
// @access  Private/Admin
router.get('/all', auth, async (req, res) => {
  try {
    // Check if user is admin
    if (!req.user.isAdmin && !req.user.role.includes('admin')) {
      return res.status(401).json({ msg: 'Not authorized' });
    }
    
    const serviceTypes = await ServiceType.find().sort({ name: 1 });
    res.json(serviceTypes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/services/types/:id
// @desc    Get service type by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const serviceType = await ServiceType.findById(req.params.id);
    
    if (!serviceType) {
      return res.status(404).json({ msg: 'Service type not found' });
    }
    
    res.json(serviceType);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Service type not found' });
    }
    res.status(500).send('Server Error');
  }
});

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