import axios from 'axios';

// Get all published gallery items
const getGalleryItems = async () => {
  const response = await axios.get('/api/gallery');
  
  return response.data;
};

// Get all gallery items (admin)
const getAllGalleryItems = async (token) => {
  const config = {
    headers: {
      'x-auth-token': token
    }
  };
  
  const response = await axios.get('/api/gallery/all', config);
  
  return response.data;
};

// Get gallery items by category
const getGalleryByCategory = async (category) => {
  const response = await axios.get(`/api/gallery/category/${category}`);
  
  return response.data;
};

// Get gallery item by ID
const getGalleryById = async (id) => {
  const response = await axios.get(`/api/gallery/${id}`);
  
  return response.data;
};

// Create gallery item
const createGalleryItem = async (galleryData, token) => {
  const config = {
    headers: {
      'Content-Type': 'multipart/form-data',
      'x-auth-token': token
    }
  };
  
  const response = await axios.post('/api/gallery', galleryData, config);
  
  return response.data;
};

// Update gallery item
const updateGalleryItem = async (id, galleryData, token) => {
  const config = {
    headers: {
      'Content-Type': 'multipart/form-data',
      'x-auth-token': token
    }
  };
  
  const response = await axios.put(`/api/gallery/${id}`, galleryData, config);
  
  return response.data;
};

// Delete gallery item
const deleteGalleryItem = async (id, token) => {
  const config = {
    headers: {
      'x-auth-token': token
    }
  };
  
  const response = await axios.delete(`/api/gallery/${id}`, config);
  
  return response.data;
};

const galleryService = {
  getGalleryItems,
  getAllGalleryItems,
  getGalleryByCategory,
  getGalleryById,
  createGalleryItem,
  updateGalleryItem,
  deleteGalleryItem
};

export default galleryService; 