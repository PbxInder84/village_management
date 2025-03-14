import baseService from '../services/baseService';

const API_URL = '/api/panchayat/members';

// Get all members (including inactive)
const getAllMembers = async () => {
  const response = await baseService.get(`${API_URL}/all`);
  return response.data;
};

// Other methods...

export default {
  getAllMembers,
  // Other methods...
}; 