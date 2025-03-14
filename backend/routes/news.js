const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const newsController = require('../controllers/newsController');
const { auth } = require('../middleware/auth');
const { roleCheck } = require('../middleware/auth');
const upload = require('../middleware/upload');
const News = require('../models/News');

// @route   GET api/news
// @desc    Get all news
// @access  Public
router.get('/', async (req, res) => {
  try {
    const news = await News.find({ isPublished: true }).sort({ createdAt: -1 });
    res.json(news);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/news/all
// @desc    Get all news (including unpublished)
// @access  Private/Admin
router.get('/all', auth, async (req, res) => {
  try {
    // Check if user is admin
    if (!req.user.isAdmin && !req.user.role.includes('admin')) {
      return res.status(401).json({ msg: 'Not authorized' });
    }
    
    const news = await News.find().sort({ createdAt: -1 });
    res.json(news);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/news/:id
// @desc    Get news by ID
// @access  Public
router.get('/:id', newsController.getNewsById);

// @route   POST api/news
// @desc    Create a news
// @access  Private/Admin
router.post(
  '/',
  [
    auth,
    roleCheck(['admin']),
    upload.single('image'),
    [
      check('title', 'Title is required').not().isEmpty(),
      check('content', 'Content is required').not().isEmpty()
    ]
  ],
  newsController.createNews
);

// @route   PUT api/news/:id
// @desc    Update a news
// @access  Private/Admin
router.put(
  '/:id',
  [
    auth,
    roleCheck(['admin']),
    upload.single('image'),
    [
      check('title', 'Title is required').not().isEmpty(),
      check('content', 'Content is required').not().isEmpty()
    ]
  ],
  newsController.updateNews
);

// @route   DELETE api/news/:id
// @desc    Delete a news
// @access  Private/Admin
router.delete(
  '/:id',
  [auth, roleCheck(['admin'])],
  newsController.deleteNews
);

module.exports = router; 