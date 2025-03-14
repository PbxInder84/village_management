import axios from 'axios';

// Get all panchayat members (admin)
const getAllMembers = async (token) => {
  const config = {
    headers: {
      'x-auth-token': token
    }
  };
  
  const response = await axios.get('/api/panchayat/members/all', config);
  
  return response.data;
};

// Get active panchayat members
const getActiveMembers = async () => {
  const response = await axios.get('/api/panchayat/members');
  
  return response.data;
};

// Get panchayat member by ID
const getMemberById = async (id) => {
  const response = await axios.get(`/api/panchayat/members/${id}`);
  
  return response.data;
};

// Create panchayat member
const createMember = async (memberData, token) => {
  const config = {
    headers: {
      'Content-Type': 'multipart/form-data',
      'x-auth-token': token
    }
  };
  
  const response = await axios.post('/api/panchayat/members', memberData, config);
  
  return response.data;
};

// Update panchayat member
const updateMember = async (id, memberData, token) => {
  const config = {
    headers: {
      'Content-Type': 'multipart/form-data',
      'x-auth-token': token
    }
  };
  
  const response = await axios.put(`/api/panchayat/members/${id}`, memberData, config);
  
  return response.data;
};

// Delete panchayat member
const deleteMember = async (id, token) => {
  const config = {
    headers: {
      'x-auth-token': token
    }
  };
  
  const response = await axios.delete(`/api/panchayat/members/${id}`, config);
  
  return response.data;
};

const panchayatMemberService = {
  getAllMembers,
  getActiveMembers,
  getMemberById,
  createMember,
  updateMember,
  deleteMember
};

export default panchayatMemberService; 