import axios from 'axios';
import { API_URL } from './ApiConfig';

const api = axios.create({
  baseURL: API_URL
});


api.interceptors.request.use(config => {
const token = JSON.parse(localStorage.getItem('token'));

   
  if (token) config.headers.Authorization = `Bearer ${token.token}`;
  return config;
});

export default api;
