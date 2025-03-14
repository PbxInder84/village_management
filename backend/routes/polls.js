const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const pollController = require('../controllers/pollController');
const { auth } = require('../middleware/auth');
const { roleCheck } = require('../middleware/auth');
const Poll = require('../models/Poll');

// @route   GET api/polls
// @desc    Get all active polls
// @access  Public
router.get('/', async (req, res) => {
  try {
    const polls = await Poll.find({ isActive: true }).sort({ createdAt: -1 });
    res.json(polls);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/polls/all
// @desc    Get all polls (including inactive)
// @access  Private/Admin
router.get('/all', auth, async (req, res) => {
  try {
    // Check if user is admin
    if (!req.user.isAdmin && !req.user.role.includes('admin')) {
      return res.status(401).json({ msg: 'Not authorized' });
    }
    
    const polls = await Poll.find().sort({ createdAt: -1 });
    res.json(polls);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/polls/:id
// @desc    Get poll by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const poll = await Poll.findById(req.params.id);
    
    if (!poll) {
      return res.status(404).json({ msg: 'Poll not found' });
    }
    
    res.json(poll);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Poll not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route   POST api/polls
// @desc    Create a poll
// @access  Private/Admin
router.post(
  '/',
  [
    auth,
    roleCheck(['admin']),
    [
      check('question', 'Question is required').not().isEmpty(),
      check('options', 'Options are required').isArray({ min: 2 })
    ]
  ],
  pollController.createPoll
);

// @route   PUT api/polls/:id
// @desc    Update a poll
// @access  Private/Admin
router.put(
  '/:id',
  [
    auth,
    roleCheck(['admin']),
    [
      check('question', 'Question is required').not().isEmpty(),
      check('options', 'Options are required').isArray({ min: 2 })
    ]
  ],
  pollController.updatePoll
);

// @route   POST api/polls/:id/vote
// @desc    Vote on a poll
// @access  Private
router.post(
  '/:id/vote',
  [
    auth,
    [
      check('optionId', 'Option ID is required').not().isEmpty()
    ]
  ],
  pollController.votePoll
);

// @route   DELETE api/polls/:id
// @desc    Delete a poll
// @access  Private/Admin
router.delete(
  '/:id',
  [auth, roleCheck(['admin'])],
  pollController.deletePoll
);

module.exports = router; 