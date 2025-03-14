const { validationResult } = require('express-validator');
const Document = require('../models/Document');
const fs = require('fs');
const path = require('path');

// @route   GET api/documents
// @desc    Get all public documents
// @access  Public
exports.getPublicDocuments = async (req, res) => {
  try {
    const documents = await Document.find({ isPublic: true })
      .sort({ createdAt: -1 })
      .populate('uploadedBy', 'name');
    
    res.json(documents);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// @route   GET api/documents/all
// @desc    Get all documents (admin)
// @access  Private/Admin
exports.getAllDocuments = async (req, res) => {
  try {
    const documents = await Document.find()
      .sort({ createdAt: -1 })
      .populate('uploadedBy', 'name');
    
    res.json(documents);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// @route   GET api/documents/category/:category
// @desc    Get documents by category
// @access  Public
exports.getDocumentsByCategory = async (req, res) => {
  try {
    const documents = await Document.find({ 
      category: req.params.category,
      isPublic: true 
    })
      .sort({ createdAt: -1 })
      .populate('uploadedBy', 'name');
    
    res.json(documents);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// @route   GET api/documents/:id
// @desc    Get document by ID
// @access  Mixed (Public for public documents, Private for private)
exports.getDocumentById = async (req, res) => {
  try {
    const document = await Document.findById(req.params.id)
      .populate('uploadedBy', 'name');
    
    if (!document) {
      return res.status(404).json({ msg: 'Document not found' });
    }
    
    // Check if document is private and user is not admin
    if (!document.isPublic && (!req.user || req.user.role !== 'admin')) {
      return res.status(401).json({ msg: 'Not authorized to access this document' });
    }
    
    res.json(document);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Document not found' });
    }
    res.status(500).send('Server error');
  }
};

// @route   POST api/documents
// @desc    Upload a document
// @access  Private/Admin
exports.uploadDocument = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  
  if (!req.file) {
    return res.status(400).json({ msg: 'Please upload a file' });
  }
  
  const { title, description, category, tags, isPublic } = req.body;
  
  try {
    const newDocument = new Document({
      title,
      description,
      file: req.file.filename,
      fileType: req.file.mimetype,
      fileSize: req.file.size,
      category,
      tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
      isPublic: isPublic === 'true',
      uploadedBy: req.user.id
    });
    
    const document = await newDocument.save();
    
    res.json(document);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// @route   PUT api/documents/:id
// @desc    Update a document
// @access  Private/Admin
exports.updateDocument = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  
  const { title, description, category, tags, isPublic } = req.body;
  
  try {
    let document = await Document.findById(req.params.id);
    
    if (!document) {
      return res.status(404).json({ msg: 'Document not found' });
    }
    
    // Update fields
    if (title) document.title = title;
    if (description !== undefined) document.description = description;
    if (category) document.category = category;
    if (tags) document.tags = tags.split(',').map(tag => tag.trim());
    if (isPublic !== undefined) document.isPublic = isPublic === 'true';
    
    // If new file was uploaded
    if (req.file) {
      // Delete old file
      if (document.file) {
        const filePath = path.join(__dirname, '../../frontend/public/uploads/documents', document.file);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }
      
      document.file = req.file.filename;
      document.fileType = req.file.mimetype;
      document.fileSize = req.file.size;
    }
    
    document.updatedAt = Date.now();
    
    await document.save();
    
    res.json(document);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Document not found' });
    }
    res.status(500).send('Server error');
  }
};

// @route   DELETE api/documents/:id
// @desc    Delete a document
// @access  Private/Admin
exports.deleteDocument = async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);
    
    if (!document) {
      return res.status(404).json({ msg: 'Document not found' });
    }
    
    // Delete file
    if (document.file) {
      const filePath = path.join(__dirname, '../../frontend/public/uploads/documents', document.file);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }
    
    await document.remove();
    
    res.json({ msg: 'Document removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Document not found' });
    }
    res.status(500).send('Server error');
  }
}; 