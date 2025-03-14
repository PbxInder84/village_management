import axios from 'axios';

const API_URL = '/api/auth';

// Register user
const register = async (userData) => {
  const response = await axios.post(`${API_URL}/register`, userData);
  
  if (response.data) {
    localStorage.setItem('user', JSON.stringify(response.data));
  }
  
  return response.data;
};

// Login user
const login = async (userData) => {
  const response = await axios.post(`${API_URL}/login`, userData);
  
  if (response.data) {
    localStorage.setItem('user', JSON.stringify(response.data));
  }
  
  return response.data;
};

// Get current user
const getCurrentUser = async () => {
  const token = localStorage.getItem('token');
  console.log('Getting current user with token:', token ? 'Token exists' : 'No token');
  
  const config = {
    headers: {
      'x-auth-token': token
    }
  };
  
  try {
    const response = await axios.get('/api/auth/me', config);
    console.log('Current user response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error getting current user:', error.response?.data || error.message);
    throw error;
  }
};

// Logout user
const logout = () => {
  localStorage.removeItem('user');
};

const authService = {
  register,
  login,
  getCurrentUser,
  logout
};

export default authService; 