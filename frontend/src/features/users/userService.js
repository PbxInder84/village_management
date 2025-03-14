import baseService from '../services/baseService';

const API_URL = '/api/users';

// Get all users
const getUsers = async () => {
  const response = await baseService.get(API_URL);
  return response.data;
};

// Get user by ID
const getUserById = async (id) => {
  const response = await baseService.get(`${API_URL}/${id}`);
  return response.data;
};

// Create user
const createUser = async (userData) => {
  const response = await baseService.post(API_URL, userData);
  return response.data;
};

// Update user
const updateUser = async (id, userData) => {
  const response = await baseService.put(`${API_URL}/${id}`, userData);
  return response.data;
};

// Delete user
const deleteUser = async (id) => {
  const response = await baseService.delete(`${API_URL}/${id}`);
  return response.data;
};

const userService = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser
};

export default userService; 