import axios from 'axios';
import Cookies from 'js-cookie';

const BASE_URL = 'http://localhost:5000/api';

const getHeaders = () => {
  const token = Cookies.get('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const api = {
  get: async (endpoint) => {
    return axios.get(`${BASE_URL}${endpoint}`, { headers: getHeaders() });
  },
  post: async (endpoint, data) => {
    return axios.post(`${BASE_URL}${endpoint}`, data, { headers: getHeaders() });
  },
  put: async (endpoint, data) => {
    return axios.put(`${BASE_URL}${endpoint}`, data, { headers: getHeaders() });
  },
  delete: async (endpoint) => {
    return axios.delete(`${BASE_URL}${endpoint}`, { headers: getHeaders() });
  },
};

export default api;
