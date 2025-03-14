import axios from 'axios';

// Get all active polls
const getActivePolls = async () => {
  const response = await axios.get('/api/polls');
  
  return response.data;
};

// Get all polls (admin)
const getAllPolls = async (token) => {
  const config = {
    headers: {
      'x-auth-token': token
    }
  };
  
  const response = await axios.get('/api/polls/all', config);
  
  return response.data;
};

// Get poll by ID
const getPollById = async (id) => {
  const response = await axios.get(`/api/polls/${id}`);
  
  return response.data;
};

// Create poll
const createPoll = async (pollData, token) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
      'x-auth-token': token
    }
  };
  
  const response = await axios.post('/api/polls', pollData, config);
  
  return response.data;
};

// Update poll
const updatePoll = async (id, pollData, token) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
      'x-auth-token': token
    }
  };
  
  const response = await axios.put(`/api/polls/${id}`, pollData, config);
  
  return response.data;
};

// Vote on poll
const votePoll = async (id, optionIndex, token) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
      'x-auth-token': token
    }
  };
  
  const response = await axios.post(`/api/polls/${id}/vote`, { optionIndex }, config);
  
  return response.data;
};

// Delete poll
const deletePoll = async (id, token) => {
  const config = {
    headers: {
      'x-auth-token': token
    }
  };
  
  const response = await axios.delete(`/api/polls/${id}`, config);
  
  return response.data;
};

const pollService = {
  getActivePolls,
  getAllPolls,
  getPollById,
  createPoll,
  updatePoll,
  votePoll,
  deletePoll
};

export default pollService; 