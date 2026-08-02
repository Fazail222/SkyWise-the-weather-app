import api from './axios.js';

export const authApi = {
  // Register a new user
  register: (userData) => api.post('/auth/register', userData),

  // Login user
  login: (credentials) => api.post('/auth/login', credentials),

  // Fetch logged-in user profile
  getProfile: () => api.get('/auth/profile'),

  // Update name / avatar
  updateProfile: (profileData) => api.patch('/auth/profile', profileData),

  // Change password
  changePassword: (passwords) => api.patch('/auth/change-password', passwords),

  // Logout user
  logout: () => api.post('/auth/logout'),
};