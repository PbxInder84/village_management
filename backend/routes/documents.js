const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const documentController = require('../controllers/documentController');
const { auth } = require('../middleware/auth');
const { roleCheck } = require('../middleware/auth');
const upload = require('../middleware/upload');

// @route   GET api/documents
// @desc    Get all documents
// @access  Public
router.get('/', documentController.getAllDocuments);

// @route   GET api/documents/:id
// @desc    Get document by ID
// @access  Public
router.get('/:id', documentController.getDocumentById);

// @route   POST api/documents
// @desc    Upload a new document
// @access  Private/Admin
router.post(
  '/',
  [
    auth,
    roleCheck(['admin']),
    upload.single('file'),
    [
      check('title', 'Title is required').not().isEmpty(),
      check('category', 'Category is required').not().isEmpty()
    ]
  ],
  documentController.uploadDocument
);

// @route   PUT api/documents/:id
// @desc    Update document
// @access  Private/Admin
router.put(
  '/:id',
  [
    auth,
    roleCheck(['admin']),
    upload.single('file'),
    [
      check('title', 'Title is required').not().isEmpty(),
      check('category', 'Category is required').not().isEmpty()
    ]
  ],
  documentController.updateDocument
);

// @route   DELETE api/documents/:id
// @desc    Delete document
// @access  Private/Admin
router.delete(
  '/:id',
  [auth, roleCheck(['admin'])],
  documentController.deleteDocument
);

module.exports = router; 