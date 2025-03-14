const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const galleryController = require('../controllers/galleryController');
const { auth } = require('../middleware/auth');
const { roleCheck } = require('../middleware/auth');
const upload = require('../middleware/upload');

// @route   GET api/gallery
// @desc    Get all gallery images
// @access  Public
router.get('/', galleryController.getGalleryItems);

// @route   GET api/gallery/:id
// @desc    Get gallery image by ID
// @access  Public
router.get('/:id', galleryController.getGalleryById);

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