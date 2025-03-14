const { validationResult } = require('express-validator');
const Poll = require('../models/Poll');

// @route   GET api/polls
// @desc    Get all active polls
// @access  Public
exports.getActivePolls = async (req, res) => {
  try {
    const polls = await Poll.find({ 
      isActive: true,
      $or: [
        { endDate: { $gt: new Date() } },
        { endDate: null }
      ]
    })
      .sort({ createdAt: -1 })
      .populate('createdBy', 'name');
    
    res.json(polls);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// @route   GET api/polls/all
// @desc    Get all polls (admin)
// @access  Private/Admin
exports.getAllPolls = async (req, res) => {
  try {
    const polls = await Poll.find()
      .sort({ createdAt: -1 })
      .populate('createdBy', 'name');
    
    res.json(polls);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// @route   GET api/polls/:id
// @desc    Get poll by ID
// @access  Public
exports.getPollById = async (req, res) => {
  try {
    const poll = await Poll.findById(req.params.id)
      .populate('createdBy', 'name')
      .populate('votes.user', 'name');
    
    if (!poll) {
      return res.status(404).json({ msg: 'Poll not found' });
    }
    
    res.json(poll);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Poll not found' });
    }
    res.status(500).send('Server error');
  }
};

// @route   POST api/polls
// @desc    Create a poll
// @access  Private/Admin
exports.createPoll = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  
  const { title, description, options, endDate, isActive } = req.body;
  
  try {
    const formattedOptions = options.map(option => ({
      text: option,
      votes: 0
    }));
    
    const newPoll = new Poll({
      title,
      description,
      options: formattedOptions,
      endDate: endDate ? new Date(endDate) : null,
      isActive: isActive !== undefined ? isActive : true,
      createdBy: req.user.id
    });
    
    const poll = await newPoll.save();
    
    res.json(poll);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// @route   PUT api/polls/:id
// @desc    Update a poll
// @access  Private/Admin
exports.updatePoll = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  
  const { title, description, endDate, isActive } = req.body;
  
  try {
    let poll = await Poll.findById(req.params.id);
    
    if (!poll) {
      return res.status(404).json({ msg: 'Poll not found' });
    }
    
    // Update fields
    if (title) poll.title = title;
    if (description !== undefined) poll.description = description;
    if (endDate) poll.endDate = new Date(endDate);
    if (isActive !== undefined) poll.isActive = isActive;
    
    poll.updatedAt = Date.now();
    
    await poll.save();
    
    res.json(poll);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Poll not found' });
    }
    res.status(500).send('Server error');
  }
};

// @route   POST api/polls/:id/vote
// @desc    Vote on a poll
// @access  Private
exports.votePoll = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  
  const { optionIndex } = req.body;
  
  try {
    const poll = await Poll.findById(req.params.id);
    
    if (!poll) {
      return res.status(404).json({ msg: 'Poll not found' });
    }
    
    // Check if poll is active
    if (!poll.isActive) {
      return res.status(400).json({ msg: 'This poll is no longer active' });
    }
    
    // Check if poll has ended
    if (poll.endDate && new Date(poll.endDate) < new Date()) {
      return res.status(400).json({ msg: 'This poll has ended' });
    }
    
    // Check if option exists
    if (optionIndex < 0 || optionIndex >= poll.options.length) {
      return res.status(400).json({ msg: 'Invalid option' });
    }
    
    // Check if user has already voted
    const existingVote = poll.votes.find(vote => vote.user.toString() === req.user.id);
    
    if (existingVote) {
      // If user is changing their vote
      if (existingVote.option !== optionIndex) {
        // Decrement previous option
        poll.options[existingVote.option].votes -= 1;
        
        // Increment new option
        poll.options[optionIndex].votes += 1;
        
        // Update vote
        existingVote.option = optionIndex;
        existingVote.votedAt = Date.now();
      } else {
        return res.status(400).json({ msg: 'You have already voted for this option' });
      }
    } else {
      // Add new vote
      poll.votes.push({
        user: req.user.id,
        option: optionIndex
      });
      
      // Increment option votes
      poll.options[optionIndex].votes += 1;
    }
    
    await poll.save();
    
    res.json(poll);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Poll not found' });
    }
    res.status(500).send('Server error');
  }
};

// @route   DELETE api/polls/:id
// @desc    Delete a poll
// @access  Private/Admin
exports.deletePoll = async (req, res) => {
  try {
    const poll = await Poll.findById(req.params.id);
    
    if (!poll) {
      return res.status(404).json({ msg: 'Poll not found' });
    }
    
    await poll.remove();
    
    res.json({ msg: 'Poll removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Poll not found' });
    }
    res.status(500).send('Server error');
  }
}; 