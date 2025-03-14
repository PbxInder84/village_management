const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const newsController = require('../controllers/newsController');
const { auth } = require('../middleware/auth');
const { roleCheck } = require('../middleware/auth');
const upload = require('../middleware/upload');

// @route   GET api/news
// @desc    Get all news
// @access  Public
router.get('/', newsController.getAllNews);

// @route   GET api/news/published
// @desc    Get all published news
// @access  Public
router.get('/published', newsController.getPublishedNews);

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