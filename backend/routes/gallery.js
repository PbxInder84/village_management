const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const galleryController = require('../controllers/galleryController');
const { auth } = require('../middleware/auth');
const { roleCheck } = require('../middleware/auth');
const upload = require('../middleware/upload');
const Gallery = require('../models/Gallery');

// @route   GET api/gallery
// @desc    Get all gallery items
// @access  Public
router.get('/', async (req, res) => {
  try {
    const galleryItems = await Gallery.find().sort({ createdAt: -1 });
    res.json(galleryItems);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/gallery/all
// @desc    Get all gallery items (admin)
// @access  Private/Admin
router.get('/all', auth, async (req, res) => {
  try {
    // Check if user is admin
    if (!req.user.isAdmin && !req.user.role.includes('admin')) {
      return res.status(401).json({ msg: 'Not authorized' });
    }
    
    const galleryItems = await Gallery.find().sort({ createdAt: -1 });
    res.json(galleryItems);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/gallery/:id
// @desc    Get gallery item by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const galleryItem = await Gallery.findById(req.params.id);
    
    if (!galleryItem) {
      return res.status(404).json({ msg: 'Gallery item not found' });
    }
    
    res.json(galleryItem);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Gallery item not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route   POST api/gallery
// @desc    Upload a new gallery image
// @access  Private/Admin
router.post(
  '/',
  [
    auth,
    roleCheck(['admin']),
    upload.single('image'),
    [
      check('title', 'Title is required').not().isEmpty(),
      check('category', 'Category is required').not().isEmpty()
    ]
  ],
  galleryController.createGalleryItem
);

// @route   PUT api/gallery/:id
// @desc    Update gallery image
// @access  Private/Admin
router.put(
  '/:id',
  [
    auth,
    roleCheck(['admin']),
    upload.single('image'),
    [
      check('title', 'Title is required').not().isEmpty(),
      check('category', 'Category is required').not().isEmpty()
    ]
  ],
  galleryController.updateGalleryItem
);

// @route   DELETE api/gallery/:id
// @desc    Delete gallery image
// @access  Private/Admin
router.delete(
  '/:id',
  [auth, roleCheck(['admin'])],
  galleryController.deleteGalleryItem
);

module.exports = router; 