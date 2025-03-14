import axios from 'axios';

// Get all events (admin)
const getAllEvents = async (token) => {
  const config = {
    headers: {
      'x-auth-token': token
    }
  };
  
  const response = await axios.get('/api/events/all', config);
  
  return response.data;
};

// Get published events
const getPublishedEvents = async () => {
  const response = await axios.get('/api/events');
  
  return response.data;
};

// Get event by ID
const getEventById = async (id, token) => {
  const config = {
    headers: {
      'x-auth-token': token
    }
  };
  
  const response = await axios.get(`/api/events/${id}`, config);
  
  return response.data;
};

// Create event
const createEvent = async (eventData, token) => {
  const config = {
    headers: {
      'Content-Type': 'multipart/form-data',
      'x-auth-token': token
    }
  };
  
  const response = await axios.post('/api/events', eventData, config);
  
  return response.data;
};

// Update event
const updateEvent = async (id, eventData, token) => {
  const config = {
    headers: {
      'Content-Type': 'multipart/form-data',
      'x-auth-token': token
    }
  };
  
  const response = await axios.put(`/api/events/${id}`, eventData, config);
  
  return response.data;
};

// Delete event
const deleteEvent = async (id, token) => {
  const config = {
    headers: {
      'x-auth-token': token
    }
  };
  
  const response = await axios.delete(`/api/events/${id}`, config);
  
  return response.data;
};

const eventService = {
  getAllEvents,
  getPublishedEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent
};

export default eventService; 