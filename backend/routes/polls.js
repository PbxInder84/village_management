const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const pollController = require('../controllers/pollController');
const { auth } = require('../middleware/auth');
const { roleCheck } = require('../middleware/auth');

// @route   GET api/polls
// @desc    Get all polls
// @access  Public
router.get('/', pollController.getAllPolls);

// @route   GET api/polls/active
// @desc    Get all active polls
// @access  Public
router.get('/active', pollController.getActivePolls);

// @route   GET api/polls/:id
// @desc    Get poll by ID
// @access  Public
router.get('/:id', pollController.getPollById);

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