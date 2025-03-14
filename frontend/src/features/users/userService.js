import axios from 'axios';

// Get all users
const getUsers = async (token) => {
  const config = {
    headers: {
      'x-auth-token': token
    }
  };
  
  const response = await axios.get('/api/users', config);
  
  return response.data;
};

// Get user by ID
const getUserById = async (id, token) => {
  const config = {
    headers: {
      'x-auth-token': token
    }
  };
  
  const response = await axios.get(`/api/users/${id}`, config);
  
  return response.data;
};

// Update user
const updateUser = async (id, userData, token) => {
  const config = {
    headers: {
      'x-auth-token': token
    }
  };
  
  const response = await axios.put(`/api/users/${id}`, userData, config);
  
  return response.data;
};

// Update user role
const updateUserRole = async (id, role, token) => {
  const config = {
    headers: {
      'x-auth-token': token
    }
  };
  
  const response = await axios.put(`/api/users/${id}/role`, { role }, config);
  
  return response.data;
};

// Delete user
const deleteUser = async (id, token) => {
  const config = {
    headers: {
      'x-auth-token': token
    }
  };
  
  const response = await axios.delete(`/api/users/${id}`, config);
  
  return response.data;
};

const userService = {
  getUsers,
  getUserById,
  updateUser,
  updateUserRole,
  deleteUser
};

export default userService; 