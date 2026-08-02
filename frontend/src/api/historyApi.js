import api from './axios.js';

export const historyApi = {
  // Get recent search history (last 10)
  getSearchHistory: () => api.get('/history'),

  // Save search log
  addSearchHistory: (city) => api.post('/history', { city }),

  // Clear all search logs
  clearSearchHistory: () => api.delete('/history'),
};