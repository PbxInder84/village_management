const { validationResult } = require('express-validator');
const Gallery = require('../models/Gallery');
const fs = require('fs');
const path = require('path');

// @route   GET api/gallery
// @desc    Get all published gallery items
// @access  Public
exports.getGalleryItems = async (req, res) => {
  try {
    const gallery = await Gallery.find({ isPublished: true })
      .sort({ createdAt: -1 })
      .populate('createdBy', 'name');
    
    res.json(gallery);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// @route   GET api/gallery/all
// @desc    Get all gallery items (admin)
// @access  Private/Admin
exports.getAllGalleryItems = async (req, res) => {
  try {
    const gallery = await Gallery.find()
      .sort({ createdAt: -1 })
      .populate('createdBy', 'name');
    
    res.json(gallery);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// @route   GET api/gallery/category/:category
// @desc    Get gallery items by category
// @access  Public
exports.getGalleryByCategory = async (req, res) => {
  try {
    const gallery = await Gallery.find({ 
      category: req.params.category,
      isPublished: true 
    })
      .sort({ createdAt: -1 })
      .populate('createdBy', 'name');
    
    res.json(gallery);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// @route   GET api/gallery/:id
// @desc    Get gallery item by ID
// @access  Public
exports.getGalleryById = async (req, res) => {
  try {
    const galleryItem = await Gallery.findById(req.params.id)
      .populate('createdBy', 'name');
    
    if (!galleryItem) {
      return res.status(404).json({ msg: 'Gallery item not found' });
    }
    
    res.json(galleryItem);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Gallery item not found' });
    }
    res.status(500).send('Server error');
  }
};

// @route   POST api/gallery
// @desc    Create a gallery item
// @access  Private/Admin
exports.createGalleryItem = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  
  if (!req.file) {
    return res.status(400).json({ msg: 'Please upload an image' });
  }
  
  const { title, description, category, tags, isPublished } = req.body;
  
  try {
    const newGalleryItem = new Gallery({
      title,
      description,
      image: req.file.filename,
      category,
      tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
      isPublished: isPublished === 'true',
      createdBy: req.user.id
    });
    
    const galleryItem = await newGalleryItem.save();
    
    res.json(galleryItem);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// @route   PUT api/gallery/:id
// @desc    Update a gallery item
// @access  Private/Admin
exports.updateGalleryItem = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  
  const { title, description, category, tags, isPublished } = req.body;
  
  try {
    let galleryItem = await Gallery.findById(req.params.id);
    
    if (!galleryItem) {
      return res.status(404).json({ msg: 'Gallery item not found' });
    }
    
    // Update fields
    if (title) galleryItem.title = title;
    if (description !== undefined) galleryItem.description = description;
    if (category) galleryItem.category = category;
    if (tags) galleryItem.tags = tags.split(',').map(tag => tag.trim());
    if (isPublished !== undefined) galleryItem.isPublished = isPublished === 'true';
    
    // If new image was uploaded
    if (req.file) {
      // Delete old image
      if (galleryItem.image) {
        const imagePath = path.join(__dirname, '../../frontend/public/uploads', galleryItem.image);
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        }
      }
      
      galleryItem.image = req.file.filename;
    }
    
    galleryItem.updatedAt = Date.now();
    
    await galleryItem.save();
    
    res.json(galleryItem);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Gallery item not found' });
    }
    res.status(500).send('Server error');
  }
};

// @route   DELETE api/gallery/:id
// @desc    Delete a gallery item
// @access  Private/Admin
exports.deleteGalleryItem = async (req, res) => {
  try {
    const galleryItem = await Gallery.findById(req.params.id);
    
    if (!galleryItem) {
      return res.status(404).json({ msg: 'Gallery item not found' });
    }
    
    // Delete image file
    if (galleryItem.image) {
      const imagePath = path.join(__dirname, '../../frontend/public/uploads', galleryItem.image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }
    
    await galleryItem.remove();
    
    res.json({ msg: 'Gallery item removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Gallery item not found' });
    }
    res.status(500).send('Server error');
  }
}; 