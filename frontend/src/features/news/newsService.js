import axios from 'axios';
import baseService from '../services/baseService';

const API_URL = '/api/news';

// Get all news
const getAllNews = async () => {
  const response = await baseService.get(`${API_URL}/all`);
  return response.data;
};

// Get published news
const getPublishedNews = async () => {
  const response = await axios.get('/api/news');
  
  return response.data;
};

// Get news by ID
const getNewsById = async (id, token) => {
  const config = {
    headers: {
      'x-auth-token': token
    }
  };
  
  const response = await axios.get(`/api/news/${id}`, config);
  
  return response.data;
};

// Create news
const createNews = async (newsData, token) => {
  const config = {
    headers: {
      'Content-Type': 'multipart/form-data',
      'x-auth-token': token
    }
  };
  
  const response = await axios.post('/api/news', newsData, config);
  
  return response.data;
};

// Update news
const updateNews = async (id, newsData, token) => {
  const config = {
    headers: {
      'Content-Type': 'multipart/form-data',
      'x-auth-token': token
    }
  };
  
  const response = await axios.put(`/api/news/${id}`, newsData, config);
  
  return response.data;
};

// Delete news
const deleteNews = async (id, token) => {
  const config = {
    headers: {
      'x-auth-token': token
    }
  };
  
  const response = await axios.delete(`/api/news/${id}`, config);
  
  return response.data;
};

const newsService = {
  getAllNews,
  getPublishedNews,
  getNewsById,
  createNews,
  updateNews,
  deleteNews
};

export default newsService; 