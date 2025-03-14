const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const panchayatMemberController = require('../controllers/panchayatMemberController');
const panchayatMeetingController = require('../controllers/panchayatMeetingController');
const { auth } = require('../middleware/auth');
const { roleCheck } = require('../middleware/auth');
const upload = require('../middleware/upload');
const PanchayatMember = require('../models/PanchayatMember');

// Panchayat Member Routes
// @route   GET api/panchayat/members
// @desc    Get all active panchayat members
// @access  Public
router.get('/', async (req, res) => {
  try {
    const members = await PanchayatMember.find({ isActive: true }).sort({ order: 1 });
    res.json(members);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/panchayat/members/all
// @desc    Get all panchayat members (including inactive)
// @access  Private/Admin
router.get('/all', auth, async (req, res) => {
  try {
    // Check if user is admin
    if (!req.user.isAdmin && !req.user.role.includes('admin')) {
      return res.status(401).json({ msg: 'Not authorized' });
    }
    
    const members = await PanchayatMember.find().sort({ order: 1 });
    res.json(members);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/panchayat/members/:id
// @desc    Get panchayat member by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const member = await PanchayatMember.findById(req.params.id);
    
    if (!member) {
      return res.status(404).json({ msg: 'Panchayat member not found' });
    }
    
    res.json(member);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Panchayat member not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route   POST api/panchayat/members
// @desc    Add a new panchayat member
// @access  Private (Admin only)
router.post('/members', auth, async (req, res) => {
  try {
    // Check if user is admin
    if (!req.user.isAdmin) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    const { name, position, description, contact, email, isActive } = req.body;

    const newMember = new PanchayatMember({
      name,
      position,
      description,
      contact,
      email,
      isActive: isActive || true
    });

    const member = await newMember.save();
    res.json(member);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/panchayat/members/:id
// @desc    Update a panchayat member
// @access  Private (Admin only)
router.put('/members/:id', auth, async (req, res) => {
  try {
    // Check if user is admin
    if (!req.user.isAdmin) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    const member = await PanchayatMember.findById(req.params.id);
    
    if (!member) {
      return res.status(404).json({ msg: 'Member not found' });
    }

    const { name, position, description, contact, email, isActive } = req.body;

    if (name) member.name = name;
    if (position) member.position = position;
    if (description) member.description = description;
    if (contact) member.contact = contact;
    if (email) member.email = email;
    if (isActive !== undefined) member.isActive = isActive;

    await member.save();
    res.json(member);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/panchayat/members/:id
// @desc    Delete a panchayat member
// @access  Private (Admin only)
router.delete('/members/:id', auth, async (req, res) => {
  try {
    // Check if user is admin
    if (!req.user.isAdmin) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    const member = await PanchayatMember.findById(req.params.id);
    
    if (!member) {
      return res.status(404).json({ msg: 'Member not found' });
    }

    await member.remove();
    res.json({ msg: 'Member removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Panchayat Meeting Routes
// @route   GET api/panchayat/meetings
// @desc    Get all panchayat meetings
// @access  Public
router.get('/meetings', panchayatMeetingController.getMeetings);

// @route   GET api/panchayat/meetings/:id
// @desc    Get panchayat meeting by ID
// @access  Public
router.get('/meetings/:id', panchayatMeetingController.getMeetingById);

// @route   POST api/panchayat/meetings
// @desc    Create a panchayat meeting
// @access  Private/Admin
router.post(
  '/meetings',
  [
    auth,
    roleCheck(['admin']),
    [
      check('title', 'Title is required').not().isEmpty(),
      check('date', 'Date is required').not().isEmpty(),
      check('time', 'Time is required').not().isEmpty(),
      check('location', 'Location is required').not().isEmpty(),
      check('agenda', 'Agenda is required').not().isEmpty()
    ]
  ],
  panchayatMeetingController.createMeeting
);

// @route   PUT api/panchayat/meetings/:id
// @desc    Update a panchayat meeting
// @access  Private/Admin
router.put(
  '/meetings/:id',
  [
    auth,
    roleCheck(['admin'])
  ],
  panchayatMeetingController.updateMeeting
);

// @route   DELETE api/panchayat/meetings/:id
// @desc    Delete a panchayat meeting
// @access  Private/Admin
router.delete('/meetings/:id', auth, roleCheck(['admin']), panchayatMeetingController.deleteMeeting);

module.exports = router; 