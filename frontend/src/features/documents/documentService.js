import axios from 'axios';

// Get all public documents
const getPublicDocuments = async () => {
  const response = await axios.get('/api/documents');
  
  return response.data;
};

// Get all documents (admin)
const getAllDocuments = async (token) => {
  const config = {
    headers: {
      'x-auth-token': token
    }
  };
  
  const response = await axios.get('/api/documents/all', config);
  
  return response.data;
};

// Get documents by category
const getDocumentsByCategory = async (category) => {
  const response = await axios.get(`/api/documents/category/${category}`);
  
  return response.data;
};

// Get document by ID
const getDocumentById = async (id, token) => {
  const config = token ? {
    headers: {
      'x-auth-token': token
    }
  } : {};
  
  const response = await axios.get(`/api/documents/${id}`, config);
  
  return response.data;
};

// Upload document
const uploadDocument = async (documentData, token) => {
  const config = {
    headers: {
      'Content-Type': 'multipart/form-data',
      'x-auth-token': token
    }
  };
  
  const response = await axios.post('/api/documents', documentData, config);
  
  return response.data;
};

// Update document
const updateDocument = async (id, documentData, token) => {
  const config = {
    headers: {
      'Content-Type': 'multipart/form-data',
      'x-auth-token': token
    }
  };
  
  const response = await axios.put(`/api/documents/${id}`, documentData, config);
  
  return response.data;
};

// Delete document
const deleteDocument = async (id, token) => {
  const config = {
    headers: {
      'x-auth-token': token
    }
  };
  
  const response = await axios.delete(`/api/documents/${id}`, config);
  
  return response.data;
};

const documentService = {
  getPublicDocuments,
  getAllDocuments,
  getDocumentsByCategory,
  getDocumentById,
  uploadDocument,
  updateDocument,
  deleteDocument
};

export default documentService; 