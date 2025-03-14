import axios from 'axios';

const API_URL = '/api/panchayat/members';

// Get all panchayat members
const getAllMembers = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

// Get active panchayat members
const getActiveMembers = async () => {
  const response = await axios.get(`${API_URL}/active`);
  return response.data;
};

// Get panchayat member by ID
const getMemberById = async (id) => {
  const response = await axios.get(`${API_URL}/${id}`);
  return response.data;
};

const panchayatMembersService = {
  getAllMembers,
  getActiveMembers,
  getMemberById
};

export default panchayatMembersService; 