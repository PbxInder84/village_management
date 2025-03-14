const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const eventController = require('../controllers/eventController');
const { auth } = require('../middleware/auth');
const { roleCheck } = require('../middleware/auth');
const upload = require('../middleware/upload');
const Event = require('../models/Event');

// @route   GET api/events
// @desc    Get all events
// @access  Public
router.get('/', async (req, res) => {
  try {
    const events = await Event.find({ isPublished: true }).sort({ date: 1 });
    res.json(events);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/events/all
// @desc    Get all events (including unpublished)
// @access  Private/Admin
router.get('/all', auth, async (req, res) => {
  try {
    // Check if user is admin
    if (!req.user.isAdmin && !req.user.role.includes('admin')) {
      return res.status(401).json({ msg: 'Not authorized' });
    }
    
    const events = await Event.find().sort({ date: 1 });
    res.json(events);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/events/:id
// @desc    Get event by ID
// @access  Public/Private
router.get('/:id', auth, eventController.getEventById);

// @route   POST api/events
// @desc    Create an event
// @access  Private/Admin
router.post(
  '/',
  [
    auth,
    roleCheck(['admin']),
    upload.single('image'),
    [
      check('title', 'Title is required').not().isEmpty(),
      check('description', 'Description is required').not().isEmpty(),
      check('date', 'Date is required').not().isEmpty(),
      check('time', 'Time is required').not().isEmpty(),
      check('location', 'Location is required').not().isEmpty()
    ]
  ],
  eventController.createEvent
);

// @route   PUT api/events/:id
// @desc    Update an event
// @access  Private/Admin
router.put(
  '/:id',
  [
    auth,
    roleCheck(['admin']),
    upload.single('image'),
    [
      check('title', 'Title is required').not().isEmpty(),
      check('description', 'Description is required').not().isEmpty(),
      check('date', 'Date is required').not().isEmpty(),
      check('time', 'Time is required').not().isEmpty(),
      check('location', 'Location is required').not().isEmpty()
    ]
  ],
  eventController.updateEvent
);

// @route   DELETE api/events/:id
// @desc    Delete an event
// @access  Private/Admin
router.delete(
  '/:id',
  [auth, roleCheck(['admin'])],
  eventController.deleteEvent
);

module.exports = router; 