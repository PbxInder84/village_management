import axios from 'axios';

// Get user's service requests
const getUserRequests = async (token) => {
  const config = {
    headers: {
      'x-auth-token': token
    }
  };
  
  const response = await axios.get('/api/services/requests', config);
  
  return response.data;
};

// Get all service requests (admin)
const getAllRequests = async (token) => {
  const config = {
    headers: {
      'x-auth-token': token
    }
  };
  
  const response = await axios.get('/api/services/requests/all', config);
  
  return response.data;
};

// Get service request by ID
const getRequestById = async (id, token) => {
  const config = {
    headers: {
      'x-auth-token': token
    }
  };
  
  const response = await axios.get(`/api/services/requests/${id}`, config);
  
  return response.data;
};

// Create service request
const createRequest = async (requestData, token) => {
  const config = {
    headers: {
      'Content-Type': 'multipart/form-data',
      'x-auth-token': token
    }
  };
  
  const response = await axios.post('/api/services/requests', requestData, config);
  
  return response.data;
};

// Update service request status
const updateRequestStatus = async (id, statusData, token) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
      'x-auth-token': token
    }
  };
  
  const response = await axios.put(`/api/services/requests/${id}/status`, statusData, config);
  
  return response.data;
};

// Add comment to service request
const addComment = async (id, commentData, token) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
      'x-auth-token': token
    }
  };
  
  const response = await axios.post(`/api/services/requests/${id}/comments`, commentData, config);
  
  return response.data;
};

const serviceRequestService = {
  getUserRequests,
  getAllRequests,
  getRequestById,
  createRequest,
  updateRequestStatus,
  addComment
};

export default serviceRequestService; 