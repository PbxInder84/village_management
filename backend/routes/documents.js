const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const documentController = require('../controllers/documentController');
const { auth } = require('../middleware/auth');
const { roleCheck } = require('../middleware/auth');
const upload = require('../middleware/upload');
const Document = require('../models/Document');

// @route   GET api/documents
// @desc    Get all public documents
// @access  Public
router.get('/', async (req, res) => {
  try {
    const documents = await Document.find({ isPublic: true }).sort({ createdAt: -1 });
    res.json(documents);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/documents/all
// @desc    Get all documents (including private)
// @access  Private/Admin
router.get('/all', auth, async (req, res) => {
  try {
    // Check if user is admin
    if (!req.user.isAdmin && !req.user.role.includes('admin')) {
      return res.status(401).json({ msg: 'Not authorized' });
    }
    
    const documents = await Document.find().sort({ createdAt: -1 });
    res.json(documents);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/documents/:id
// @desc    Get document by ID
// @access  Public/Private
router.get('/:id', async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);
    
    if (!document) {
      return res.status(404).json({ msg: 'Document not found' });
    }
    
    // Check if document is private and user is not authenticated
    if (!document.isPublic && !req.user) {
      return res.status(401).json({ msg: 'Not authorized to access this document' });
    }
    
    res.json(document);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Document not found' });
    }
    res.status(500).send('Server Error');
  }
});

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