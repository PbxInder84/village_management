const { validationResult } = require('express-validator');
const PanchayatMeeting = require('../models/PanchayatMeeting');

// @route   GET api/panchayat/meetings
// @desc    Get all panchayat meetings
// @access  Public
exports.getMeetings = async (req, res) => {
  try {
    const meetings = await PanchayatMeeting.find()
      .sort({ date: -1 })
      .populate('attendees', 'name position')
      .populate('createdBy', 'name');
    
    res.json(meetings);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// @route   GET api/panchayat/meetings/:id
// @desc    Get panchayat meeting by ID
// @access  Public
exports.getMeetingById = async (req, res) => {
  try {
    const meeting = await PanchayatMeeting.findById(req.params.id)
      .populate('attendees', 'name position')
      .populate('createdBy', 'name');
    
    if (!meeting) {
      return res.status(404).json({ msg: 'Panchayat meeting not found' });
    }
    
    res.json(meeting);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Panchayat meeting not found' });
    }
    res.status(500).send('Server error');
  }
};

// @route   POST api/panchayat/meetings
// @desc    Create a panchayat meeting
// @access  Private/Admin
exports.createMeeting = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  
  const { title, date, time, location, agenda, attendees, status } = req.body;
  
  try {
    const newMeeting = new PanchayatMeeting({
      title,
      date,
      time,
      location,
      agenda,
      attendees: attendees ? attendees.split(',') : [],
      status: status || 'scheduled',
      createdBy: req.user.id
    });
    
    const meeting = await newMeeting.save();
    
    res.json(meeting);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// @route   PUT api/panchayat/meetings/:id
// @desc    Update a panchayat meeting
// @access  Private/Admin
exports.updateMeeting = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  
  const { title, date, time, location, agenda, minutes, attendees, status } = req.body;
  
  try {
    let meeting = await PanchayatMeeting.findById(req.params.id);
    
    if (!meeting) {
      return res.status(404).json({ msg: 'Panchayat meeting not found' });
    }
    
    // Update fields
    if (title) meeting.title = title;
    if (date) meeting.date = date;
    if (time) meeting.time = time;
    if (location) meeting.location = location;
    if (agenda) meeting.agenda = agenda;
    if (minutes) meeting.minutes = minutes;
    if (attendees) meeting.attendees = attendees.split(',');
    if (status) meeting.status = status;
    
    meeting.updatedAt = Date.now();
    
    await meeting.save();
    
    res.json(meeting);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Panchayat meeting not found' });
    }
    res.status(500).send('Server error');
  }
};

// @route   DELETE api/panchayat/meetings/:id
// @desc    Delete a panchayat meeting
// @access  Private/Admin
exports.deleteMeeting = async (req, res) => {
  try {
    const meeting = await PanchayatMeeting.findById(req.params.id);
    
    if (!meeting) {
      return res.status(404).json({ msg: 'Panchayat meeting not found' });
    }
    
    await meeting.remove();
    
    res.json({ msg: 'Panchayat meeting removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Panchayat meeting not found' });
    }
    res.status(500).send('Server error');
  }
}; 