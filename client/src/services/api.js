import axios from 'axios';
import Cookies from 'js-cookie';


const BASE_URL = `${import.meta.env.VITE_API_URL}/api`;

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
console.log('API URL:', import.meta.env.VITE_API_URL)

export default api;