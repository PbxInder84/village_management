import axios from 'axios';

// Create a function to get auth header
const authHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { 'x-auth-token': token } : {};
};

// Create authenticated request methods
const get = async (url) => {
  const config = {
    headers: authHeader()
  };
  return axios.get(url, config);
};

const post = async (url, data) => {
  const config = {
    headers: authHeader()
  };
  return axios.post(url, data, config);
};

const put = async (url, data) => {
  const config = {
    headers: authHeader()
  };
  return axios.put(url, data, config);
};

const del = async (url) => {
  const config = {
    headers: authHeader()
  };
  return axios.delete(url, config);
};

export default {
  get,
  post,
  put,
  delete: del
}; 