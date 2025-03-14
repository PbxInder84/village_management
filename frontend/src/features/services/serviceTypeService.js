import axios from 'axios';

// Get all service types (admin)
const getAllServiceTypes = async (token) => {
  const config = {
    headers: {
      'x-auth-token': token
    }
  };
  
  const response = await axios.get('/api/services/types/all', config);
  
  return response.data;
};

// Get active service types
const getActiveServiceTypes = async () => {
  const response = await axios.get('/api/services/types');
  
  return response.data;
};

// Get service type by ID
const getServiceTypeById = async (id) => {
  const response = await axios.get(`/api/services/types/${id}`);
  
  return response.data;
};

// Create service type
const createServiceType = async (serviceTypeData, token) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
      'x-auth-token': token
    }
  };
  
  const response = await axios.post('/api/services/types', serviceTypeData, config);
  
  return response.data;
};

// Update service type
const updateServiceType = async (id, serviceTypeData, token) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
      'x-auth-token': token
    }
  };
  
  const response = await axios.put(`/api/services/types/${id}`, serviceTypeData, config);
  
  return response.data;
};

// Delete service type
const deleteServiceType = async (id, token) => {
  const config = {
    headers: {
      'x-auth-token': token
    }
  };
  
  const response = await axios.delete(`/api/services/types/${id}`, config);
  
  return response.data;
};

const serviceTypeService = {
  getAllServiceTypes,
  getActiveServiceTypes,
  getServiceTypeById,
  createServiceType,
  updateServiceType,
  deleteServiceType
};

export default serviceTypeService; 