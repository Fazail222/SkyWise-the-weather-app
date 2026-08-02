import api from './axios.js';

export const favoriteApi = {
  // Get user's saved favorite cities
  getFavorites: () => api.get('/favorites'),

  // Add a city to user favorites
  addFavorite: (favoriteData) => api.post('/favorites', favoriteData),

  // Remove a favorite city by ID
  removeFavorite: (id) => api.delete(`/favorites/${id}`),
};