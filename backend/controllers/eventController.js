const { validationResult } = require('express-validator');
const Event = require('../models/Event');

// @route   GET api/events
// @desc    Get all published events
// @access  Public
exports.getEvents = async (req, res) => {
  try {
    const events = await Event.find({ isPublished: true })
      .sort({ date: 1 })
      .populate('organizer', 'name');
    
    res.json(events);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// @route   GET api/events/all
// @desc    Get all events (including unpublished)
// @access  Private/Admin
exports.getAllEvents = async (req, res) => {
  try {
    const events = await Event.find()
      .sort({ date: 1 })
      .populate('organizer', 'name');
    
    res.json(events);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// @route   GET api/events/:id
// @desc    Get event by ID
// @access  Public/Private
exports.getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate('organizer', 'name');
    
    if (!event) {
      return res.status(404).json({ msg: 'Event not found' });
    }
    
    // Check if event is published or user is admin
    if (!event.isPublished && req.user.role !== 'admin') {
      return res.status(404).json({ msg: 'Event not found' });
    }
    
    res.json(event);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Event not found' });
    }
    res.status(500).send('Server error');
  }
};

// @route   POST api/events
// @desc    Create an event
// @access  Private/Admin
exports.createEvent = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  
  const { title, description, date, time, location, isPublished } = req.body;
  
  try {
    const newEvent = new Event({
      title,
      description,
      date,
      time,
      location,
      organizer: req.user.id,
      isPublished: isPublished !== undefined ? isPublished : true
    });
    
    // If image was uploaded
    if (req.file) {
      newEvent.image = req.file.filename;
    }
    
    const event = await newEvent.save();
    
    res.json(event);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// @route   PUT api/events/:id
// @desc    Update an event
// @access  Private/Admin
exports.updateEvent = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  
  const { title, description, date, time, location, isPublished } = req.body;
  
  try {
    let event = await Event.findById(req.params.id);
    
    if (!event) {
      return res.status(404).json({ msg: 'Event not found' });
    }
    
    // Update fields
    if (title) event.title = title;
    if (description) event.description = description;
    if (date) event.date = date;
    if (time) event.time = time;
    if (location) event.location = location;
    if (isPublished !== undefined) event.isPublished = isPublished;
    
    // If image was uploaded
    if (req.file) {
      event.image = req.file.filename;
    }
    
    event.updatedAt = Date.now();
    
    await event.save();
    
    res.json(event);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Event not found' });
    }
    res.status(500).send('Server error');
  }
};

// @route   DELETE api/events/:id
// @desc    Delete an event
// @access  Private/Admin
exports.deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    
    if (!event) {
      return res.status(404).json({ msg: 'Event not found' });
    }
    
    await event.remove();
    
    res.json({ msg: 'Event removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Event not found' });
    }
    res.status(500).send('Server error');
  }
}; 