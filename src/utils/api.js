import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5001/api',
  withCredentials: true,
});

export const login = (email, password) => api.post('/auth/login', { email, password });
export const signup = (name, email, password) => api.post('/auth/signup', { name, email, password });
export const logout = () => api.post('/auth/logout');
export const getMe = () => api.get('/auth/me');

export const predictPrice = (url) => api.post('/prediction/predict', { url });
export const getHistory = () => api.get('/users/history');

export default api;
