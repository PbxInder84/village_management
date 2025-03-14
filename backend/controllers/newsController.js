const { validationResult } = require('express-validator');
const News = require('../models/News');

// @desc    Get all news
// @route   GET /api/news
// @access  Public
exports.getAllNews = async (req, res) => {
  try {
    const news = await News.find().sort({ createdAt: -1 });
    res.json(news);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Get all published news
// @route   GET /api/news/published
// @access  Public
exports.getPublishedNews = async (req, res) => {
  try {
    const news = await News.find({ isPublished: true }).sort({ createdAt: -1 });
    res.json(news);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Get news by ID
// @route   GET /api/news/:id
// @access  Public
exports.getNewsById = async (req, res) => {
  try {
    const news = await News.findById(req.params.id);
    
    if (!news) {
      return res.status(404).json({ msg: 'News not found' });
    }
    
    res.json(news);
  } catch (err) {
    console.error(err.message);
    
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'News not found' });
    }
    
    res.status(500).send('Server Error');
  }
};

// @desc    Create a news
// @route   POST /api/news
// @access  Private/Admin
exports.createNews = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  
  const { title, content, isPublished } = req.body;
  
  try {
    const newNews = new News({
      title,
      content,
      author: req.user.id,
      isPublished: isPublished !== undefined ? isPublished : true
    });
    
    // If image was uploaded
    if (req.file) {
      newNews.image = req.file.filename;
    }
    
    const news = await newNews.save();
    
    res.json(news);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Update a news
// @route   PUT /api/news/:id
// @access  Private/Admin
exports.updateNews = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  
  const { title, content, isPublished } = req.body;
  
  try {
    let news = await News.findById(req.params.id);
    
    if (!news) {
      return res.status(404).json({ msg: 'News not found' });
    }
    
    // Build news object
    const newsFields = {};
    if (title) newsFields.title = title;
    if (content) newsFields.content = content;
    if (isPublished !== undefined) newsFields.isPublished = isPublished;
    
    // If image was uploaded
    if (req.file) {
      newsFields.image = req.file.filename;
    }
    
    // Update news
    news = await News.findByIdAndUpdate(
      req.params.id,
      { $set: newsFields },
      { new: true }
    );
    
    res.json(news);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Delete a news
// @route   DELETE /api/news/:id
// @access  Private/Admin
exports.deleteNews = async (req, res) => {
  try {
    const news = await News.findById(req.params.id);
    
    if (!news) {
      return res.status(404).json({ msg: 'News not found' });
    }
    
    await News.findByIdAndRemove(req.params.id);
    
    res.json({ msg: 'News removed' });
  } catch (err) {
    console.error(err.message);
    
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'News not found' });
    }
    
    res.status(500).send('Server Error');
  }
}; 