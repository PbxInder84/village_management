const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const eventController = require('../controllers/eventController');
const { auth } = require('../middleware/auth');
const { roleCheck } = require('../middleware/auth');
const upload = require('../middleware/upload');

// @route   GET api/events
// @desc    Get all events
// @access  Public
router.get('/', eventController.getAllEvents);

// @route   GET api/events/published
// @desc    Get all published events
// @access  Public
router.get('/published', eventController.getEvents);

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